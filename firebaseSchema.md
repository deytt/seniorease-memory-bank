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
| `email` | `string` | Email de autenticação |
| `createdAt` | `Timestamp` | Data de criação da conta |

---

### `tasks/{taskId}`

| Campo | Tipo Firestore | Descrição |
|-------|---------------|-----------|
| `id` | `string` | ID gerado pelo Firestore |
| `userId` | `string` | UID do dono — usado para filtrar por utilizador |
| `title` | `string` | Título da tarefa |
| `description` | `string` | Descrição detalhada |
| `status` | `string` | `'pending'` \| `'in_progress'` \| `'completed'` |
| `dueDate` | `Timestamp \| null` | Data limite (opcional) |
| `completedAt` | `Timestamp \| null` | Data de conclusão (null se não concluída) |
| `createdAt` | `Timestamp` | Data de criação |
| `updatedAt` | `Timestamp` | Data da última atualização |

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
| `remindersEnabled` | `boolean` | Ativa notificações push de lembretes |
| `notificationTime` | `string \| null` | Horário preferido de notificação (ex: `"08:00"`) |
| `updatedAt` | `Timestamp` | Data da última atualização |

> **Nota (ADR-009):** `contrast: 'maximum'` nunca é guardado diretamente. É derivado em runtime quando `darkMode == true && contrast == 'high'`. O `SavePreferencesUseCase` é responsável por esta lógica em ambas as plataformas.

---

### `reminders/{reminderId}`

| Campo | Tipo Firestore | Descrição |
|-------|---------------|-----------|
| `id` | `string` | ID gerado pelo Firestore |
| `userId` | `string` | UID do dono |
| `taskId` | `string \| null` | Referência à tarefa (null se lembrete avulso) |
| `title` | `string` | Título do lembrete |
| `message` | `string` | Mensagem de notificação |
| `scheduledAt` | `Timestamp` | Data/hora agendada para disparo |
| `isRead` | `boolean` | Se o utilizador já leu o lembrete |
| `createdAt` | `Timestamp` | Data de criação |

---

## Regras de Segurança (Firestore Rules)

> As rules abaixo devem estar publicadas no Firebase Console → `seniorease-backend` → Firestore → Rules.
> O ficheiro `firestore.rules` neste mesmo diretório contém o conteúdo em formato nativo.
> Última publicação: **2026-06-24**

Princípio: **cada utilizador só acede aos seus próprios dados**. Não existe acesso admin via cliente — operações administrativas (se necessárias) devem usar Firebase Admin SDK num ambiente seguro.

Resumo das permissões:

| Collection | Leitura | Escrita | Criação |
|------------|---------|---------|---------|
| `users` | próprio userId | próprio userId | — |
| `tasks` | resource.userId == auth.uid | resource.userId == auth.uid | request.resource.userId == auth.uid |
| `tasks/steps` | auth != null | auth != null | auth != null |
| `preferences` | próprio userId | próprio userId | — |
| `reminders` | resource.userId == auth.uid | resource.userId == auth.uid | request.resource.userId == auth.uid |

Ver `firestore.rules` para o código completo.

---

## Changelog

| Data | Mudança | ADR |
|------|---------|-----|
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
