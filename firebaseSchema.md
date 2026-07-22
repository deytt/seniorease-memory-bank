# Firebase Schema — SeniorEase

> **Fonte única da verdade** para o contrato entre Web (Next.js), Mobile (Flutter) e Firestore.
> Projeto Firebase: `seniorease-backend`
>
> ⚠️ Ao modificar qualquer collection ou rule, atualize este ficheiro (schema + Changelog) E publique as rules no Firebase Console.

---

## Collections

### `users/{userId}`

| Campo | Tipo Firestore | Descrição |
|-------|---------------|-----------|
| `id` | `string` | Igual ao Firebase Auth UID |
| `name` | `string` | Nome completo do utilizador |
| `email` | `string` | Email de autenticação (nunca editável pela app) |
| `phone` | `string \| null` | Telefone formatado, ex.: `(19) 9 9999-9999` |
| `birthDate` | `string \| null` | Data de nascimento mascarada `DD/MM/AAAA` |
| `cpf` | `string \| null` | CPF formatado (opcional) `999.999.999-99` |
| `photoUrl` | `string \| null` | URL público da foto de perfil (Firebase Storage ou OAuth futuro) |
| `address` | `map \| null` | Endereço: `{ neighborhood, street, number, zipCode, city, state, country }` (strings) |
| `createdAt` | `Timestamp` | Data de criação da conta |
| `updatedAt` | `Timestamp` | Data da última atualização do perfil |

> **Nota (ADR-014):** os campos de perfil e o `address` são escritos com
> `SetOptions(merge: true)`, preservando `id`/`createdAt`. O `email` é incluído
> por consistência mas nunca é alterado pela UI (vem do Firebase Auth).

> **Nota (ADR-015/ADR-016):** o estado de verificação do e-mail **não** fica no
> Firestore — vive no Firebase Auth (`user.emailVerified`). Contas criadas via
> Google (OAuth) chegam com `emailVerified = true`. No primeiro login com Google,
> `users/{uid}` é criado com `name`/`email`/`photoUrl` do provedor; logins
> seguintes não sobrescrevem o perfil (apenas preenchem `photoUrl` se vazia).

---

### `tasks/{taskId}`

| Campo | Tipo Firestore | Descrição |
|-------|---------------|-----------|
| `id` | `string` | ID gerado pelo Firestore |
| `userId` | `string` | UID do dono — usado para filtrar por utilizador |
| `title` | `string` | Título da tarefa |
| `description` | `string` | Descrição detalhada |
| `priority` | `string` | `'low'` \| `'medium'` \| `'high'` |
| `category` | `string` | `'medication'` \| `'health'` \| `'exercise'` \| `'social'` \| `'personal'` |
| `status` | `string` | `'pending'` \| `'in_progress'` \| `'completed'` |
| `dueDate` | `Timestamp \| null` | Data e hora da tarefa (usado para notificações e ordenação) |
| `completedAt` | `Timestamp \| null` | Data de conclusão (null se não concluída) |
| `notified` | `boolean` | `false` por defeito; a Cloud Function marca `true` após enviar o push — evita reenvios. Deve ser reposto a `false` se `dueDate` for alterada pelo cliente |
| `createdAt` | `Timestamp` | Data de criação |
| `updatedAt` | `Timestamp` | Data da última atualização |

> **Nota (ADR-020):** campo `reminderTime` removido. Usar `dueDate` para toda a lógica de notificação.

#### Sub-collection: `tasks/{taskId}/steps/{stepId}`

| Campo | Tipo Firestore | Descrição |
|-------|---------------|-----------|
| `id` | `string` | ID gerado pelo Firestore |
| `order` | `number` | Ordem do passo no modo guiado (1-indexed) |
| `title` | `string` | Título curto do passo |
| `instruction` | `string` | Instrução completa para o utilizador |
| `isCompleted` | `boolean` | Se o passo já foi concluído |

---

### `preferences/{userId}`

> O document ID é igual ao `userId` — relação 1:1 com `users`.

| Campo | Tipo Firestore | Descrição |
|-------|---------------|-----------|
| `userId` | `string` | UID do utilizador (igual ao ID do documento) |
| `fontSize` | `string` | `'small'` \| `'medium'` \| `'large'` \| `'extra_large'` |
| `darkMode` | `boolean` | Ativa o tema escuro |
| `contrast` | `string` | `'default'` \| `'high'` — `'maximum'` é derivado automaticamente |
| `spacing` | `string` | `'compact'` \| `'comfortable'` \| `'spacious'` |
| `interfaceMode` | `string` | `'basic'` \| `'advanced'` |
| `audioFeedbackEnabled` | `boolean` | Ativa feedback sonoro e tátil |
| `largeTouchTargets` | `boolean` | Ativa botões com touch target 64×64px |
| `tasksNotificationsEnabled` | `boolean` | Ativa notificações push para tarefas — default `true` |
| `taskNotificationOffset` | `string` | Antecedência do push de tarefa: `'15m'` \| `'30m'` \| `'1h'` \| `'6h'` \| `'1d'` — default `'30m'` |
| `remindersNotificationsEnabled` | `boolean` | Ativa notificações push para lembretes — default `true` |
| `reminderNotificationOffset` | `string` | Antecedência do push de lembrete (mesmos valores que `taskNotificationOffset`) — default `'30m'` |
| `updatedAt` | `Timestamp` | Data da última atualização |

> **Nota (ADR-020):** campos `remindersEnabled` e `notificationTime` removidos e substituídos pelos 4 campos acima.

> **Nota (ADR-009):** `contrast: 'maximum'` nunca é guardado diretamente. É derivado em runtime quando `darkMode == true && contrast == 'high'`. O `SavePreferencesUseCase` é responsável por esta lógica em ambas as plataformas.

---

### `onboarding/{userId}`

> O document ID é igual ao `userId` — relação 1:1 com `users`.
> Collection própria da feature `guides` (Tour Guiado). Guarda **apenas** o estado
> da boas-vindas inicial, partilhado entre Web e Mobile (ADR-013). O estado
> "oferecido/visto" de cada tutorial é por-dispositivo e fica em `shared_preferences`
> (local), não aqui.

| Campo | Tipo Firestore | Descrição |
|-------|---------------|-----------|
| `userId` | `string` | UID do utilizador (igual ao ID do documento) |
| `initialTourCompleted` | `boolean` | Se a boas-vindas inicial já foi concluída ou recusada (não volta a aparecer automaticamente) |
| `updatedAt` | `Timestamp` | Data da última atualização (`serverTimestamp`) |

---

### `reminders/{reminderId}`

| Campo | Tipo Firestore | Descrição |
|-------|---------------|-----------|
| `id` | `string` | ID gerado pelo Firestore |
| `userId` | `string` | UID do dono |
| `taskId` | `string \| null` | Referência à tarefa (null se lembrete avulso) |
| `title` | `string` | Título do lembrete |
| `message` | `string` | Mensagem de notificação |
| `category` | `string` | `'medication'` \| `'appointment'` \| `'hydration'` \| `'meal'` \| `'bills'` — categoria do lembrete (combo na criação e filtro da lista). Valores legados/desconhecidos caem no fallback `'medication'` |
| `scheduledAt` | `Timestamp` | Data/hora agendada para disparo |
| `isRead` | `boolean` | Se o utilizador já leu o lembrete |
| `notified` | `boolean` | `false` por defeito; a Cloud Function marca `true` após enviar o push — reposto a `false` se `scheduledAt` for alterado |
| `createdAt` | `Timestamp` | Data de criação |


---

### `notifications/{notifId}`

> Histórico de notificações push enviadas pela Cloud Function. **Escrita exclusiva pelo Admin SDK** (Cloud Functions) — nunca pelo cliente. Os clientes lêem apenas as suas próprias notificações (para o "sino" do web).

| Campo | Tipo Firestore | Descrição |
|-------|---------------|-----------|
| `userId` | `string` | UID do dono da notificação |
| `entityId` | `string` | ID da tarefa ou lembrete que originou o push |
| `entityType` | `string` | `'task'` \| `'reminder'` |
| `title` | `string` | Título da notificação (ex: `"Tarefa em 30 minutos"`) |
| `body` | `string` | Corpo da notificação (título do item) |
| `sentAt` | `Timestamp` | Momento de envio (serverTimestamp) |
| `successCount` | `number` | Número de dispositivos que receberam o push |
| `failureCount` | `number` | Número de dispositivos que falharam |

> **Nota (ADR-020):** esta collection serve como histórico para o "sino" da web (Next.js). No mobile (iteração atual) não existe UI dedicada — o push chega via FCM e, se o app estiver em primeiro plano, é exibido um `SeniorToast`.

---

### `users/{userId}/fcmTokens/{tokenId}`

> Subcollection dos tokens FCM por dispositivo. Cada dispositivo tem um documento próprio cujo ID é o próprio token. A Cloud Function lê esta subcollection para enviar pushes multicast. Tokens inválidos são removidos automaticamente após um envio falhado.

| Campo | Tipo Firestore | Descrição |
|-------|---------------|-----------|
| `token` | `string` | Token FCM do dispositivo |
| `platform` | `string` | `'android'` \| `'ios'` \| `'web'` |
| `updatedAt` | `Timestamp` | Data de registo/renovação (serverTimestamp) |

> **Nota (ADR-020):** o token é usado como ID do documento — garante unicidade e permite remoção directa por `doc(token).delete()` sem query prévia.

---

### `history/{historyId}`

> Eventos de atividade do utilizador para a tela **Histórico** (Módulo 2). Alimentados via port `HistoryRecorder` (ADR-017). Os contadores "Tarefas esta semana" e "Sequência (streak)" são **computados on-read** a partir destes eventos — não são denormalizados.

| Campo | Tipo Firestore | Descrição |
|-------|---------------|-----------|
| `id` | `string` | ID gerado pelo Firestore |
| `userId` | `string` | UID do dono |
| `type` | `string` | `HistoryActionType`: `taskCreated` \| `taskCompleted` \| `taskStepCompleted` \| `taskDeleted` \| `reminderCreated` \| `reminderCompleted` \| `reminderEdited` \| `reminderDeleted` \| `accessibilityChanged` \| `profileUpdated` \| `accountVerified` \| `streakAchievement`. Só `taskCompleted` e `reminderCompleted` contam para streak/semana |
| `title` | `string` | Snapshot do texto pronto para exibir (ex.: `"Concluiu: Tomar remédio"`) — preserva o histórico mesmo após apagar o item de origem |
| `entityId` | `string \| null` | ID da tarefa/lembrete de origem (navegação futura) |
| `category` | `string \| null` | Categoria do item de origem (ícone/cor do card) |
| `occurredAt` | `Timestamp` | Data/hora do evento — base de todas as queries e ordenação |

---

## Deploy Firebase (Rules + Indexes)

> Os ficheiros de configuração Firebase estão centralizados neste diretório (`memory-bank/`) para que **qualquer projeto** (web ou mobile) possa publicar rules e indexes sem duplicação.
>
> Ficheiros presentes:
> - `firestore.rules` — regras de segurança do Firestore
> - `firestore.indexes.json` — composite indexes do Firestore
> - `storage.rules` — regras de segurança do Firebase Storage (fotos de perfil)
> - `firebase.json` — config do Firebase CLI (aponta para os ficheiros acima)
>
> ### Pré-requisito
> Firebase CLI instalado e autenticado: `npm install -g firebase-tools && firebase login`
>
> ### Comandos de deploy (a partir do root de **qualquer** projeto)
>
> ```bash
> # Publicar apenas as Firestore Rules
> firebase deploy --config memory-bank/firebase.json --only firestore:rules
>
> # Publicar apenas os Composite Indexes
> firebase deploy --config memory-bank/firebase.json --only firestore:indexes
>
> # Publicar rules + indexes de uma vez
> firebase deploy --config memory-bank/firebase.json --only firestore
>
> # Publicar as Storage Rules (requer bucket ativado — ver secção abaixo)
> firebase deploy --config memory-bank/firebase.json --only storage
> ```
>
> Se necessário, especificar o projeto: adicionar `-P seniorease-backend` a qualquer comando acima.

---

## Firebase Storage — fotos de perfil

> Regras nativas em `memory-bank/storage.rules`. **Pré-requisito (manual):** o
> bucket do Storage tem de estar ativado no console `seniorease-backend`
> (Build → Storage → Get started) antes do primeiro upload e do deploy das
> regras.

| Caminho | Conteúdo | Acesso |
|---------|----------|--------|
| `profile_photos/{userId}` | Foto de perfil (1 ficheiro por utilizador; o upload seguinte substitui o anterior) | Leitura/escrita apenas pelo dono; escrita só de `image/*` até 5 MB |

O `photoUrl` guardado em `users/{userId}` é o `getDownloadURL()` deste ficheiro.
Quando o login com Google (OAuth) for implementado, `photoUrl` pode também
apontar para a foto do provedor — a UI usa o `photoUrl` se existir, caindo para
as iniciais do nome caso contrário.

---

## Regras de Segurança (Firestore Rules)

> O ficheiro `firestore.rules` neste mesmo diretório contém o conteúdo em formato nativo.
> Última publicação: **2026-07-03**

Princípio: **cada utilizador só acede aos seus próprios dados**. Não existe acesso admin via cliente — operações administrativas (se necessárias) devem usar Firebase Admin SDK num ambiente seguro.

Resumo das permissões:

| Collection | Leitura | Escrita | Criação |
|------------|---------|---------|---------|
| `users` | próprio userId | próprio userId | — |
| `tasks` | resource.userId == auth.uid | resource.userId == auth.uid | request.resource.userId == auth.uid |
| `tasks/steps` | auth != null | auth != null | auth != null |
| `preferences` | próprio userId | próprio userId | — |
| `onboarding` | próprio userId | próprio userId | — |
| `reminders` | resource.userId == auth.uid | resource.userId == auth.uid | request.resource.userId == auth.uid |
| `history` | resource.userId == auth.uid | resource.userId == auth.uid | request.resource.userId == auth.uid |
| `notifications` | resource.userId == auth.uid | Admin SDK apenas | Admin SDK apenas |
| `users/{uid}/fcmTokens` | uid == auth.uid | uid == auth.uid | uid == auth.uid |

Ver `firestore.rules` para o código completo.

---

## Composite Indexes — `tasks`

> Indexes necessários para as queries de filtro implementadas no Módulo Tarefas (ADR-012).
> O ficheiro `firestore.indexes.json` neste diretório contém o JSON pronto para deploy.
> Ver secção **Deploy Firebase** acima para o comando de publicação.

| Index | Campos | Tipo | Quando usar |
|-------|--------|------|-------------|
| idx-tasks-today | `userId ASC, dueDate ASC` | Collection | Filtro "Hoje" (sem category/priority) |
| idx-tasks-category-today | `userId ASC, category ASC, dueDate ASC` | Collection | Filtro "Hoje" + Categoria |
| idx-tasks-priority-today | `userId ASC, priority ASC, dueDate ASC` | Collection | Filtro "Hoje" + Prioridade |
| idx-tasks-all-filters | `userId ASC, category ASC, priority ASC, dueDate ASC` | Collection | Todos os filtros combinados |

> **Nota:** Filtros apenas por `category` e/ou `priority` (sem "Hoje") usam exclusivamente equality filters e **não precisam de composite index**.

---

## Composite Indexes — `reminders`

> Indexes **necessários e já publicados**. O app mobile filtra "Hoje" **server-side** (range em `scheduledAt`) e ordena por `scheduledAt` **DESC** (data/hora maior primeiro) na própria query.

| Index | Campos | Tipo | Quando usar |
|-------|--------|------|-------------|
| idx-reminders-today | `userId ASC, scheduledAt ASC` | Collection | Legado / web se voltar a ASC; Cloud Functions não usam este |
| idx-reminders-list-desc | `userId ASC, scheduledAt DESC` | Collection | Lista e filtro "Hoje" no mobile (`orderBy scheduledAt DESC`) |
| idx-reminders-category-today | `userId ASC, category ASC, scheduledAt ASC` | Collection | Legado ASC por categoria |
| idx-reminders-category-desc | `userId ASC, category ASC, scheduledAt DESC` | Collection | Filtro por categoria + `orderBy scheduledAt DESC` (mobile) |

> **Nota (mobile):** filtro da lista é **combinável** (Categoria + "Hoje"). Ordenação `scheduledAt` **DESC** (mais antigos por último). "Hoje" usa range server-side; categoria usa `where` + orderBy.
>
> **Nota (web, 2026-07-21):** filtro da lista alinhado ao mobile — chips exclusivos Hoje / Medicação / Consultas (default Hoje), filtragem em memória após fetch `userId` + `orderBy(scheduledAt asc)`. Mobile passou a DESC em 2026-07-22.

---

## Composite Indexes — `history`

> Indexes **necessários e já publicados** para a tela Histórico (ADR-017).

| Index | Campos | Tipo | Quando usar |
|-------|--------|------|-------------|
| idx-history-recent | `userId ASC, occurredAt DESC` | Collection | Lista de "Atividade Recente" (`watchRecent`) |
| idx-history-completions | `userId ASC, type ASC, occurredAt DESC` | Collection | Estatísticas de streak/semana (`fetchCompletions`, `whereIn type` + `orderBy occurredAt`) |

---

## Composite Indexes — Cloud Functions (GAP-002)

> Indexes necessários para as queries da Cloud Function `sendDueNotifications` (cron a cada minuto).

| Index | Campos | Tipo | Quando usar |
|-------|--------|------|-------------|
| idx-tasks-notified | `notified ASC, dueDate ASC` | Collection | Cloud Function: tasks com notified==false na janela de tempo |
| idx-reminders-notified | `notified ASC, isRead ASC, scheduledAt ASC` | Collection | Cloud Function: reminders com notified==false e isRead==false na janela de tempo |
| idx-notifications-user | `userId ASC, sentAt DESC` | Collection | Web: sino de notificações do utilizador |

---

## Changelog

| Data | Mudança | ADR |
|------|---------|-----|
| 2026-07-22 | Mobile: ordenação de `reminders` passa a `scheduledAt` **DESC** (lista + preview Home); índice `idx-reminders-list-desc` volta a ser necessário; novo `idx-reminders-category-desc` (`userId ASC, category ASC, scheduledAt DESC`) | — |
| 2026-07-21 | Web passa a ler e gravar steps em `tasks/{taskId}/steps/{stepId}`, igual ao mobile; mantém fallback de leitura do array legado e migra esse formato ao atualizar/concluir a tarefa | ADR-004 |
| 2026-07-21 | Web: filtro de lembretes volta a chips exclusivos (Hoje / Medicação / Consultas) + `scheduledAt` ASC (paridade mobile, PR #50); `idx-reminders-list-desc` marcado como opcional/legado | — |
| 2026-07-21 | Web: dashboard alinhado à Home mobile — “Próxima atividade” + “Lembretes de hoje”; polish tours/UX/favicon (PRs #48/#49) | — |
| 2026-07-21 | Documentado composite index `idx-reminders-list-desc` (`userId ASC, scheduledAt DESC`) — uso web DESC revertido no mesmo dia | — |
| 2026-07-16 | Web: alinhamento do schema `history` ao mobile (`type`, `occurredAt`, `entityId`); novo tipo `streakAchievement` para conquista de 7 dias; leitura compatível com campos legados da web | ADR-017 | campo `reminderTime` removido de `tasks`; campo `notified` adicionado a `tasks` e `reminders`; campos `remindersEnabled`/`notificationTime` removidos de `preferences` e substituídos por `tasksNotificationsEnabled`, `taskNotificationOffset`, `remindersNotificationsEnabled`, `reminderNotificationOffset`; novas collections `notifications/{id}` e `users/{uid}/fcmTokens/{tokenId}`; 3 novos composite indexes; novas Firestore Rules para `notifications` e `fcmTokens` | ADR-020 |
| 2026-07-03 | Adicionada collection `history/{historyId}` (eventos de atividade) + 2 composite indexes (`userId,occurredAt` e `userId,type,occurredAt`) + rule (dono apenas). Contadores de semana/streak computados on-read | ADR-017 |
| 2026-06-30 | Login com Google (OAuth): `users/{uid}` criado no 1.º login com `name`/`email`/`photoUrl` do provedor (sem sobrescrever perfil existente). Verificação de e-mail via Firebase Auth (`emailVerified`, fora do Firestore) | ADR-015 / ADR-016 |
| 2026-06-30 | Estendido `users` com `phone`, `birthDate`, `cpf`, `photoUrl`, `address` e `updatedAt`; adicionado Firebase Storage (`profile_photos/{userId}`) + `storage.rules` para o Módulo Perfil | ADR-014 |
| 2026-06-29 | Adicionada collection `onboarding/{userId}` (`initialTourCompleted`, `updatedAt`) + rule (dono apenas) para o Tour Guiado | ADR-013 |
| 2026-07-01 | `reminders.category` expandido para 5 categorias (`medication`, `appointment`, `hydration`, `meal`, `bills`); filtros da lista passam a ser **combináveis** (Categoria + "Hoje"). Sem novos indexes — reutiliza `idx-reminders-category-today` | — |
| 2026-07-01 | Filtro "Hoje" e ordenação de `reminders` passam a ser **server-side** (range + `orderBy` em `scheduledAt`); composite indexes publicados no Firestore | — |
| 2026-06-30 | Adicionados composite indexes em `reminders` (inicialmente com filtro "Hoje" em memória no mobile) | — |
| 2026-06-30 | Adicionado `category` à collection `reminders` (filtros Medicação/Consultas) | — |
| 2026-06-25 | Adicionados 4 composite indexes na collection `tasks` para queries de filtro | ADR-012 |
| 2026-06-24 | Adicionado `priority`, `category` e `reminderTime` à collection `tasks` | ADR-010 |
| 2026-06-22 | Adicionado `darkMode: boolean` à collection `preferences` | ADR-009 |
| 2026-06-22 | Adicionado `largeTouchTargets: boolean` à collection `preferences` | ADR-009 |
| 2026-06-22 | Substituído `visualFeedbackEnabled` por `audioFeedbackEnabled` em `preferences` | ADR-009 |
| 2026-06-17 | Schema inicial — collections `users`, `tasks`, `preferences`, `reminders` | ADR-004 |
| 2026-06-17 | Sub-collection `steps` adicionada a `tasks` | ADR-004 |

---

## Como atualizar este ficheiro

Ao adicionar/remover campos ou alterar regras:

1. Atualize a tabela da collection correspondente
2. Atualize `firestore.rules` com as novas regras
3. Publique as rules no Firebase Console (`seniorease-backend`)
4. Adicione uma linha no Changelog com data, descrição e referência ao ADR (se existir)
5. Se a mudança for estrutural, crie um ADR em `decisions.md`
6. Commite o submódulo e avise o time: `git submodule update --remote`
