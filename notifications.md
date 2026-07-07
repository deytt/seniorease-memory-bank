# Notificações Push FCM — Especificação (Mobile + Web)

> **Fonte única da verdade** para a implementação de notificações push em ambas as plataformas.
> Projeto Firebase: `seniorease-backend`
>
> **Mobile (Flutter):** implementado — GAP-002 (2026-07-06)
> **Web (Next.js):** a implementar seguindo esta especificação

---

## 1. Arquitetura geral

```
Apps (Mobile + Web)
  │  ① Registo de token FCM
  ▼
Firestore: users/{uid}/fcmTokens/{token}
  │
  │  ② Cron a cada minuto
  ▼
Cloud Function: sendDueNotifications
  │  ③ Lê tasks/reminders + preferences
  │  ④ Envia FCM multicast
  │  ⑤ Grava notifications/{id}
  │  ⑥ Marca notified=true
  ▼
Dispositivos (push)
  ▼
Firestore: notifications/{id}  ← web pode ler para o "sino"
```

---

## 2. Modelo de dados

### Preferências (`preferences/{userId}`)

| Campo | Tipo | Default | Descrição |
|-------|------|---------|-----------|
| `tasksNotificationsEnabled` | `boolean` | `true` | Liga/desliga pushes de tarefas |
| `taskNotificationOffset` | `string` | `'30m'` | Antecedência: `'15m'` \| `'30m'` \| `'1h'` \| `'6h'` \| `'1d'` |
| `remindersNotificationsEnabled` | `boolean` | `true` | Liga/desliga pushes de lembretes |
| `reminderNotificationOffset` | `string` | `'30m'` | Antecedência (mesmos valores) |

Campos removidos: ~~`remindersEnabled`~~, ~~`notificationTime`~~.

### Tasks (`tasks/{taskId}`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `notified` | `boolean` | `false` por defeito; `true` após o push ter sido enviado |

Campo removido: ~~`reminderTime`~~ — usar `dueDate`.

### Reminders (`reminders/{reminderId}`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `notified` | `boolean` | `false` por defeito; `true` após o push ter sido enviado |

> `notified` é reposto a `false` automaticamente pela função `resetReminderNotified` quando `scheduledAt` é alterado.

### Tokens FCM (`users/{uid}/fcmTokens/{token}`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `token` | `string` | Token FCM (também o ID do documento) |
| `platform` | `string` | `'android'` \| `'ios'` \| `'web'` |
| `updatedAt` | `Timestamp` | Data de registo/renovação |

### Histórico (`notifications/{id}`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `userId` | `string` | Dono |
| `entityId` | `string` | ID da tarefa ou lembrete |
| `entityType` | `string` | `'task'` \| `'reminder'` |
| `title` | `string` | Título exibido (ex: `"Tarefa em 30 minutos"`) |
| `body` | `string` | Título do item |
| `sentAt` | `Timestamp` | Momento do envio |
| `successCount` | `number` | Dispositivos que receberam |
| `failureCount` | `number` | Dispositivos que falharam |

---

## 3. Cloud Functions (`memory-bank/functions/`)

### `sendDueNotifications` — cron a cada minuto

**Regra de disparo:**

Para cada item com `notified == false`:
1. `dueDate` (tasks) ou `scheduledAt` (reminders) dentro da janela `[agora, agora + 25h]`.
2. Ler `preferences/{userId}` do dono.
3. Se a flag de notificação estiver activa **e** `agora >= due - offset`, enviar push.
4. Gravar em `notifications/{id}`, marcar `notified = true`, remover tokens inválidos.

**Motivo da janela de 25h:** garante que o offset mais longo (1 dia = 1440 min) seja apanhado no 1.º ciclo após criação do item.

**Payload FCM:**

```json
{
  "notification": {
    "title": "Tarefa em 30 minutos",
    "body": "<título do item>"
  },
  "data": {
    "entityType": "task",
    "entityId": "<id do item>"
  }
}
```

### `resetReminderNotified` — onDocumentUpdated

Quando `reminders/{id}` é atualizado e `scheduledAt` muda, repõe `notified = false` para que o push seja reenviado no novo horário.

---

## 4. Integração no cliente Mobile (Flutter)

### Dependência

```yaml
firebase_messaging: ^16.x
```

### Fluxo de inicialização

```
App start
  → AppNotificationsGate.initState()
    → fcmInitProvider (FutureProvider)
      → PushNotificationService.requestPermission()
      → PushNotificationService.getToken()
      → RegisterFcmTokenUseCase(userId, token, platform)
        → FirebaseFcmTokenRepository.saveToken()
          → users/{uid}/fcmTokens/{token}
```

### Handlers de mensagens

| Situação | Handler | Comportamento |
|----------|---------|---------------|
| App em 1.º plano | `onMessage` | Exibe `SeniorToast` com título + corpo |
| App em 2.º plano (tap) | `onMessageOpenedApp` | Navega: `entityType=task` → `taskDetails(id)`; `entityType=reminder` → `/reminders` |
| App terminado (tap) | `getInitialMessage()` | Idem |

### Sign-out

Antes de chamar `signOut()`, chamar `removeFcmTokenOnSignOut(ref)` para remover o token do Firestore e evitar pushes após o logout.

---

## 5. Integração no cliente Web (Next.js) — Especificação

### Dependências

```bash
npm install firebase
```

O `firebase` já está instalado na maioria dos projetos Next.js com Firebase. Confirmar que `firebase/messaging` está disponível.

### Passo 1 — Service Worker

Criar `public/firebase-messaging-sw.js`:

```javascript
importScripts('https://www.gstatic.com/firebasejs/10.x.x/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.x.x/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: 'seniorease-backend',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

const messaging = firebase.messaging();

// Handler para pushes recebidos com app em background/fechado
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {};
  self.registration.showNotification(title ?? 'SeniorEase', {
    body,
    icon: '/icons/icon-192.png',
    data: payload.data,
  });
});
```

### Passo 2 — Variável VAPID

No Firebase Console → Project Settings → Cloud Messaging → Web configuration:
- Gerar "Web Push certificate" → copiar a chave pública VAPID.
- Adicionar ao `.env.local`: `NEXT_PUBLIC_FIREBASE_VAPID_KEY=<chave>`

### Passo 3 — Registo de token

```typescript
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

async function registerFcmToken() {
  const messaging = getMessaging();
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return;

  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  });
  if (!token) return;

  const userId = auth.currentUser?.uid;
  if (!userId) return;

  await setDoc(
    doc(db, 'users', userId, 'fcmTokens', token),
    { token, platform: 'web', updatedAt: serverTimestamp() },
    { merge: true }
  );
}
```

Chamar `registerFcmToken()` no mounting do componente raiz (após autenticação).

### Passo 4 — Foreground handler

```typescript
import { getMessaging, onMessage } from 'firebase/messaging';

const messaging = getMessaging();
onMessage(messaging, (payload) => {
  // Exibir toast/snackbar com payload.notification.title e .body
  // Usar payload.data.entityType e .entityId para navegação ao clicar
});
```

### Passo 5 — Sino / histórico de notificações

Ler `notifications` filtrado por `userId`:

```typescript
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

const q = query(
  collection(db, 'notifications'),
  where('userId', '==', userId),
  orderBy('sentAt', 'desc'),
  limit(20)
);
const unsubscribe = onSnapshot(q, (snap) => {
  const notifications = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  // atualizar estado do sino
});
```

### Tap na notificação (service worker)

Adicionar handler no service worker para navegar ao clicar:

```javascript
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const { entityType, entityId } = event.notification.data ?? {};
  let url = '/';
  if (entityType === 'task') url = `/tasks/${entityId}`;
  else if (entityType === 'reminder') url = '/reminders';
  event.waitUntil(clients.openWindow(url));
});
```

### Sign-out

Remover o token antes de fazer sign-out:

```typescript
import { doc, deleteDoc } from 'firebase/firestore';

async function removeFcmToken(userId: string, token: string) {
  await deleteDoc(doc(db, 'users', userId, 'fcmTokens', token));
}
```

---

## 6. Mensagens FCM — Formato

| Tipo | `title` | `body` |
|------|---------|--------|
| Tarefa | `"Tarefa em {offset}"` | Título da tarefa |
| Lembrete | `"Lembrete em {offset}"` | Título do lembrete |

Exemplos:
- `"Tarefa em 30 minutos"` / `"Tomar medicamento"`
- `"Lembrete em 1 hora"` / `"Consulta com Dr. João"`

### `data` payload

```json
{
  "entityType": "task" | "reminder",
  "entityId": "<id do documento>"
}
```

---

## 7. Sino de notificações — Tela de histórico (Mobile + Web)

### 7.1 Comportamento

O sininho substitui o botão SOS no header da tela inicial e dá acesso ao histórico de notificações push registado em `notifications/{id}`.

| Situação | Comportamento |
|---|---|
| Sem notificações hoje | Badge não aparece |
| ≥ 1 notificação hoje | Badge vermelho com o número (ex: `3`) |
| Toque no sininho | Navega para a tela `/notifications` |
| Toque num card | Navega para a entidade (`task` → `/tasks/:id`, `reminder` → `/reminders`) |

### 7.2 Query Firestore (igual em mobile e web)

```
collection: notifications
where: userId == <uid_autenticado>
orderBy: sentAt DESC
limit: 50
```

### 7.3 Mobile (Flutter) — implementado

- **Sininho:** `_NotificationBell` em `lib/features/home/presentation/widgets/home_header.dart`
  - `ConsumerWidget` que observa `todayNotificationCountProvider`
  - Badge: `Stack` + `Positioned` com `Container` vermelho (cor `AppColors.danger`)
  - Navega: `context.push(AppRoutes.notifications)` → `/notifications`
- **Tela:** `lib/features/notifications/presentation/screens/notifications_screen.dart`
  - Route: `AppRoutes.notifications = '/notifications'` (full-screen, fora da shell)
  - Tour: `TourId.notifications`, 3 passos
  - Entrada na Central de Guias: `TourId.notifications` em `kTutorials`
- **Providers:** `notificationHistoryProvider` (StreamProvider), `todayNotificationCountProvider`
- **Clean Architecture:**
  - Entity: `NotificationItem` (`features/notifications/domain/entities/`)
  - Repo: `NotificationHistoryRepository` (abstrato) + `FirebaseNotificationHistoryRepository`
  - Use case: `WatchNotificationHistoryUseCase`

### 7.4 Web (Next.js) — a implementar

**Objetivo:** Replicar o mesmo comportamento no header da aplicação web.

**1. Registo do token FCM web (se ainda não feito)**

```typescript
// Usar a chave VAPID gerada no Firebase Console
const token = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY });
// Guardar em users/{uid}/fcmTokens/{token} com platform: 'web'
```

**2. Componente `NotificationBell`**

```tsx
// Zustand store ou React Query para o stream de notifications
// Contar documentos onde sentAt >= início do dia de hoje
const todayCount = notifications.filter(n =>
  n.sentAt.toDate() >= startOfDay(new Date())
).length;

// Badge: número vermelho se todayCount > 0
// Toque: navegar para /notifications
```

**3. Página `/notifications`**

- Listar `notifications` do utilizador autenticado (query acima)
- Card por notificação: ícone por `entityType`, título, body, hora formatada
- Tap: `entityType === 'task'` → `/tasks/:entityId`; `'reminder'` → `/reminders`
- Estado vazio com mensagem amigável

**4. Campos esperados em cada documento**

```typescript
interface NotificationRecord {
  id: string;          // document ID
  userId: string;
  entityId: string;
  entityType: 'task' | 'reminder';
  title: string;       // ex: "Tarefa em 30 minutos"
  body: string;        // título da tarefa/lembrete
  sentAt: Timestamp;
  successCount: number;
  failureCount: number;
}
```

---

## 8. Offsets disponíveis

| Chave Firestore | Minutos | Label (PT) |
|-----------------|---------|------------|
| `15m` | 15 | 15 minutos antes |
| `30m` | 30 | 30 minutos antes |
| `1h` | 60 | 1 hora antes |
| `6h` | 360 | 6 horas antes |
| `1d` | 1440 | 1 dia antes |

---

## 8. Passos manuais necessários

Ver secção **Fase 7** do plano de implementação (GAP-002) para instruções detalhadas de:
- Geração da chave VAPID no Firebase Console (web)
- `POST_NOTIFICATIONS` no `AndroidManifest.xml` (Android 13+)
- APNs Auth Key para iOS
- Deploy: `firebase deploy --config memory-bank/firebase.json --only functions,firestore:rules,firestore:indexes`
