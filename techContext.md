# Tech Context — SeniorEase

Stack completa, tokens do Design System, schema Firebase e configurações de ambiente.

---

## Stack

### Web — seniorease-web

| Tecnologia | Versão | Motivo |
|---|---|---|
| Next.js | 14+ (App Router) | SSR/SSG, roteamento, performance |
| TypeScript | 5+ | Tipagem estática obrigatória |
| Tailwind CSS | 3+ | Design System via CSS custom properties |
| Zustand | 4+ | State management simples e performático |
| Firebase SDK | 10+ | Auth, Firestore, Storage |
| Lottie React | última | Animações de celebração ao concluir tarefas |
| React Hook Form | última | Formulários com validação |
| Zod | última | Validação de schemas |

### Mobile — seniorease-mobile

| Tecnologia | Versão | Motivo |
|---|---|---|
| Flutter | 3.x (stable) | Cross-platform iOS + Android |
| Dart | 3.x | Linguagem do Flutter |
| Firebase Flutter SDK | última | Auth, Firestore, Storage, Messaging |
| Riverpod | 2+ | State management reativo |
| GoRouter | última | Navegação declarativa |
| Lottie Flutter | última | Animações de celebração |
| Flutter Hooks | última | Hooks no Flutter (opcional) |

### Backend — Firebase (compartilhado)

| Serviço | Uso |
|---|---|
| Firebase Auth | Autenticação (Email/Password) |
| Cloud Firestore | Banco de dados principal |
| Firebase Storage | Upload de imagens de perfil (futuro) |
| Firebase Cloud Messaging | Push notifications para lembretes |

---

## Design System — Tokens (extraídos do Figma)

### Paleta de cores

```css
/* Primárias */
--color-primary:          #2563EB;
--color-primary-dark:     #1D4ED8;
--color-primary-light:    #EFF6FF;

/* Secundárias */
--color-secondary:        #14B8A6;
--color-secondary-light:  #F0FDFA;

/* Semânticas */
--color-success:          #22C55E;
--color-success-light:    #F0FDF4;
--color-success-dark:     #166534;

--color-warning:          #F59E0B;
--color-warning-light:    #FFFBEB;

--color-danger:           #EF4444;
--color-danger-light:     #FEF2F2;
--color-danger-dark:      #991B1B;

/* Neutros (Slate) */
--color-slate-50:         #F8FAFC;
--color-slate-100:        #F1F5F9;
--color-slate-200:        #E2E8F0;
--color-slate-300:        #CBD5E1;
--color-slate-400:        #94A3B8;
--color-slate-500:        #64748B;
--color-slate-600:        #475569;
--color-slate-900:        #0F172A;
```

### Tipografia (escala base adaptável)

| Nome | Tamanho base | Uso |
|---|---|---|
| Display | 36px+ | Títulos de página principais |
| Heading 1 | 28-32px | Títulos de seção |
| Heading 2 | 22-24px | Subtítulos, títulos de card |
| Body Large | 18-20px | Texto de destaque, labels de formulário |
| Body | 16px | Texto padrão |
| Caption | 13-14px | Textos auxiliares, badges |
| Badge | 12px uppercase | Tags, status badges |

> A escala de fonte é multiplicada pelo fator de preferência do usuário:
> - `small`: × 0.875 (mínimo absoluto — nunca abaixo de 14px)
> - `medium`: × 1.0 (base)
> - `large`: × 1.125
> - `extra_large`: × 1.25

### Espaçamento

```
--spacing-xs:   4px
--spacing-sm:   8px
--spacing-md:   16px
--spacing-lg:   24px
--spacing-xl:   32px
--spacing-2xl:  48px
```

Quando o usuário seleciona espaçamento "Espaçoso", aplicar multiplicador 1.5× nos espaçamentos internos de cards e formulários.

### Touch Targets (Mobile)

| Categoria | Tamanho mínimo |
|---|---|
| Absoluto mínimo (não usar) | 32×32px |
| Mínimo aceitável | 44×44px |
| Recomendado | 56×56px |
| Botões primários | 56-72px de altura |

### Componentes do Design System (Figma)

| Componente | Uso |
|---|---|
| Colors | Paleta + tokens semânticos |
| Typography Scale | Escala tipográfica completa |
| Spacing | Grid e espaçamentos |
| Buttons | Primary, Secondary, Destructive, Ghost |
| Inputs | Text, Password, Email, com estados |
| Cards | Default, Elevated, Outlined |
| Alerts | Success, Warning, Danger, Info |
| Form Controls | Checkbox, Radio, Toggle, Select |
| Tabs | Horizontal tab bar |
| Badges | Status, Count, Label |
| Modals | Confirmation, Info, Form |
| Toasts | Success, Warning, Error, Info |
| Avatars | Image, Initials, Placeholder |

---

## Schema Firebase — Cloud Firestore

### Collection: `users`
```
users/{userId}
  - id: string (= Firebase Auth UID)
  - name: string
  - email: string
  - createdAt: Timestamp
```

### Collection: `tasks`
```
tasks/{taskId}
  - id: string
  - userId: string                    ← para filtrar por usuário
  - title: string
  - description: string
  - status: 'pending' | 'in_progress' | 'completed'
  - dueDate: Timestamp | null
  - completedAt: Timestamp | null
  - createdAt: Timestamp
  - updatedAt: Timestamp

  subcollection: steps/{stepId}
    - id: string
    - order: number
    - title: string
    - instruction: string
    - isCompleted: boolean
```

### Collection: `preferences`
```
preferences/{userId}               ← ID = userId (1:1 com users)
  - userId: string
  - fontSize: 'small' | 'medium' | 'large' | 'extra_large'
  - darkMode: boolean                ← novo (Dark Mode toggle)
  - contrast: 'default' | 'high' | 'maximum'
    ↳ 'maximum' é derivado automaticamente (darkMode:true + contrast:'high')
  - spacing: 'compact' | 'comfortable' | 'spacious'
  - interfaceMode: 'basic' | 'advanced'
  - audioFeedbackEnabled: boolean    ← substitui visualFeedbackEnabled
  - largeTouchTargets: boolean       ← novo (botões 64×64px)
  - remindersEnabled: boolean
  - notificationTime: string | null  ← ex: "08:00"
  - updatedAt: Timestamp
```

### Collection: `reminders`
```
reminders/{reminderId}
  - id: string
  - userId: string
  - taskId: string | null            ← null se não vinculado a tarefa
  - title: string
  - message: string
  - scheduledAt: Timestamp
  - isRead: boolean
  - createdAt: Timestamp
```

### Regras de segurança (template)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Usuário só acessa seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /tasks/{taskId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;

      match /steps/{stepId} {
        allow read, write: if request.auth != null;
      }
    }

    match /preferences/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /reminders/{reminderId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## Variáveis de ambiente

### Web — `.env.local` (nunca commitar)

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Mobile — `lib/firebase_options.dart`
Gerado via `flutterfire configure`. Não commitar valores reais em repositório público.

---

## CI/CD

### Web — GitHub Actions + Vercel
- Build automático a cada PR para `main`
- Deploy de preview por PR
- Deploy de produção ao merge em `main`

### Mobile — GitHub Actions + Firebase App Distribution
- Build de APK/IPA a cada push em `main`
- Distribuição via Firebase App Distribution para o time de teste
