# System Patterns — SeniorEase

Padrões de arquitetura, estrutura de código e convenções aplicados em ambas as plataformas (Web e Mobile).

---

## Arquitetura: Clean Architecture

Ambas as plataformas seguem Clean Architecture com 3 camadas bem definidas. A regra fundamental: **dependências sempre apontam para dentro** — camadas externas dependem das internas, nunca o contrário.

```
┌──────────────────────────────────┐
│         Presentation             │  ← UI, componentes, telas
├──────────────────────────────────┤
│            Domain                │  ← Entidades, casos de uso, contratos
├──────────────────────────────────┤
│        Infrastructure            │  ← Firebase, cache, APIs externas
└──────────────────────────────────┘
```

- A camada **Domain** não conhece Firebase, Next.js, Flutter ou qualquer framework
- A camada **Infrastructure** implementa os contratos definidos em Domain
- A camada **Presentation** consome os casos de uso via injeção de dependência

---

## Estrutura de pastas — Web (Next.js)

```
seniorease-web/
├── memory-bank/               ← submódulo (não editar aqui)
├── src/
│   ├── app/                   ← rotas Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── (app)/
│   │   │   ├── dashboard/
│   │   │   ├── accessibility/
│   │   │   ├── tasks/
│   │   │   │   ├── page.tsx           ← Task List
│   │   │   │   ├── [id]/page.tsx      ← Task Details
│   │   │   │   ├── create/page.tsx    ← Create Task
│   │   │   │   └── [id]/guided/page.tsx ← Guided Task Mode
│   │   │   ├── reminders/
│   │   │   ├── history/
│   │   │   └── profile/
│   │   └── layout.tsx
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── User.ts
│   │   │   ├── Task.ts
│   │   │   ├── TaskStep.ts
│   │   │   ├── Reminder.ts
│   │   │   └── UserPreferences.ts
│   │   ├── usecases/
│   │   │   ├── auth/
│   │   │   │   ├── SignInUseCase.ts
│   │   │   │   ├── SignUpUseCase.ts
│   │   │   │   └── SignOutUseCase.ts
│   │   │   ├── tasks/
│   │   │   │   ├── CreateTaskUseCase.ts
│   │   │   │   ├── UpdateTaskUseCase.ts
│   │   │   │   ├── DeleteTaskUseCase.ts
│   │   │   │   ├── CompleteTaskUseCase.ts
│   │   │   │   └── GetTasksUseCase.ts
│   │   │   ├── reminders/
│   │   │   │   └── ...
│   │   │   └── preferences/
│   │   │       ├── GetPreferencesUseCase.ts
│   │   │       └── UpdatePreferencesUseCase.ts
│   │   └── repositories/
│   │       ├── IAuthRepository.ts
│   │       ├── ITaskRepository.ts
│   │       ├── IReminderRepository.ts
│   │       └── IPreferencesRepository.ts
│   ├── infrastructure/
│   │   ├── firebase/
│   │   │   ├── config.ts
│   │   │   ├── FirebaseAuthRepository.ts
│   │   │   ├── FirebaseTaskRepository.ts
│   │   │   ├── FirebaseReminderRepository.ts
│   │   │   └── FirebasePreferencesRepository.ts
│   │   └── cache/
│   │       └── LocalStorageCache.ts
│   ├── presentation/
│   │   ├── components/
│   │   │   ├── ui/                ← Design System (Button, Input, Card, etc.)
│   │   │   ├── tasks/             ← componentes específicos de tarefas
│   │   │   ├── accessibility/     ← componentes do painel de acessibilidade
│   │   │   └── layout/            ← Sidebar, Header, BottomNav
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useTasks.ts
│   │   │   ├── usePreferences.ts
│   │   │   └── useAccessibility.ts
│   │   └── providers/
│   │       ├── AuthProvider.tsx
│   │       └── PreferencesProvider.tsx
│   └── lib/
│       ├── di/                    ← injeção de dependência
│       └── utils/
├── .cursor/
│   └── rules/
│       └── memory-bank.mdc
└── memory-bank/                   ← submódulo
```

---

## Estrutura de pastas — Mobile (Flutter)

```
seniorease-mobile/
├── memory-bank/               ← submódulo (não editar aqui)
├── lib/
│   ├── main.dart
│   ├── app/
│   │   ├── app.dart           ← MaterialApp + router
│   │   └── router.dart        ← GoRouter ou auto_route
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── user.dart
│   │   │   ├── task.dart
│   │   │   ├── task_step.dart
│   │   │   ├── reminder.dart
│   │   │   └── user_preferences.dart
│   │   ├── usecases/
│   │   │   ├── auth/
│   │   │   ├── tasks/
│   │   │   ├── reminders/
│   │   │   └── preferences/
│   │   └── repositories/
│   │       ├── auth_repository.dart
│   │       ├── task_repository.dart
│   │       ├── reminder_repository.dart
│   │       └── preferences_repository.dart
│   ├── infrastructure/
│   │   └── firebase/
│   │       ├── firebase_options.dart
│   │       ├── firebase_auth_repository.dart
│   │       ├── firebase_task_repository.dart
│   │       ├── firebase_reminder_repository.dart
│   │       └── firebase_preferences_repository.dart
│   └── presentation/
│       ├── screens/
│       │   ├── auth/
│       │   │   ├── login_screen.dart
│       │   │   ├── register_screen.dart
│       │   │   └── forgot_password_screen.dart
│       │   ├── home/
│       │   │   └── home_screen.dart
│       │   ├── tasks/
│       │   │   ├── task_list_screen.dart
│       │   │   ├── task_details_screen.dart
│       │   │   ├── create_task_screen.dart
│       │   │   └── guided_task_screen.dart
│       │   ├── reminders/
│       │   │   └── reminders_screen.dart
│       │   ├── history/
│       │   │   └── history_screen.dart
│       │   ├── accessibility/
│       │   │   └── accessibility_screen.dart
│       │   └── settings/
│       │       ├── settings_screen.dart
│       │       └── profile_screen.dart
│       ├── widgets/
│       │   ├── ui/                ← componentes compartilhados
│       │   ├── tasks/
│       │   └── accessibility/
│       └── providers/             ← Riverpod providers
│           ├── auth_provider.dart
│           ├── tasks_provider.dart
│           └── preferences_provider.dart
├── .cursor/
│   └── rules/
│       └── memory-bank.mdc
└── memory-bank/                   ← submódulo
```

---

## Entidades do domínio (compartilhadas conceitualmente)

### User
```
id: string
name: string
email: string
createdAt: DateTime
```

### Task
```
id: string
userId: string
title: string
description: string
steps: TaskStep[]
status: 'pending' | 'in_progress' | 'completed'
dueDate: DateTime?
completedAt: DateTime?
createdAt: DateTime
```

### TaskStep
```
id: string
taskId: string
order: number
title: string
instruction: string
isCompleted: boolean
```

### Reminder
```
id: string
userId: string
taskId: string?
title: string
message: string
scheduledAt: DateTime
isRead: boolean
```

### UserPreferences
```
userId: string
fontSize: 'small' | 'medium' | 'large' | 'extra_large'
contrast: 'default' | 'high' | 'maximum'
spacing: 'compact' | 'comfortable' | 'spacious'
interfaceMode: 'basic' | 'advanced'
visualFeedbackEnabled: boolean
remindersEnabled: boolean
notificationTime: string?   ← ex: "08:00"
```

---

## Módulos e suas responsabilidades

| Módulo | Responsabilidade | Telas (Web) | Telas (Mobile) |
|---|---|---|---|
| **auth** | Autenticação via Firebase Auth | Login, Register, Forgot Password, Success | Login, Register, Forgot Password |
| **accessibility** | Painel de personalização, aplicação dos tokens de preferências | Accessibility Center | Accessibility |
| **tasks** | CRUD de tarefas, modo guiado, histórico | Task List, Task Details, Create Task, Guided Task Mode, History | Task List, Task Details, Create Task, Guided Task, History |
| **reminders** | Lembretes e notificações | Reminder Center | Reminders |
| **profile** | Perfil do usuário e configurações persistentes | Profile | Settings + Profile |

---

## Gerenciamento de estado

### Web — Zustand
- `useAuthStore` — usuário autenticado
- `useTasksStore` — lista de tarefas, loading, filtros
- `usePreferencesStore` — preferências do usuário (fonte, contraste, modo)
- `useReminderStore` — lembretes

As preferências do `usePreferencesStore` devem ser aplicadas como CSS custom properties no `document.documentElement` para que toda a UI reflita os ajustes em tempo real:

```typescript
// exemplo
document.documentElement.style.setProperty('--font-size-base', fontSizeMap[fontSize])
document.documentElement.style.setProperty('--contrast-mode', contrast)
```

### Mobile — Riverpod (recomendado) ou Provider
- `authProvider` — usuário autenticado
- `tasksProvider` — tarefas do usuário
- `preferencesProvider` — preferências (ThemeData dinâmico)
- `remindersProvider` — lembretes

As preferências devem alimentar um `ThemeData` dinâmico passado ao `MaterialApp`, garantindo que fonte e contraste se apliquem globalmente.

---

## Padrões de código

### Nomenclatura
- **Web**: PascalCase para componentes (`TaskCard.tsx`), camelCase para hooks e utils
- **Mobile**: snake_case para arquivos Dart (`task_card.dart`), PascalCase para classes (`TaskCard`)
- **Firebase collections**: snake_case (`user_preferences`, não `userPreferences`)

### Confirmação antes de ações destrutivas
Sempre exibir modal de confirmação antes de deletar qualquer item. Nunca deletar ao primeiro toque.

### Guided Task Mode — regra de implementação
- Mostrar apenas o passo atual — ocultar passos futuros para reduzir carga cognitiva
- Sempre exibir "Passo X de Y" com barra de progresso visual
- Botão "Passo anterior" sempre visível (exceto no passo 1)
- Botão "Sair do modo guiado" sempre acessível
- Ao concluir o último passo: exibir animação Lottie de celebração

### Acessibilidade — regras de implementação
- Tamanho mínimo de área clicável: 44×44px (ideal 56×56px)
- Contraste mínimo texto/fundo: 4.5:1 (WCAG AA)
- Todos os botões e inputs devem ter labels semânticos (aria-label no Web, Semantics no Flutter)
- Fontes nunca abaixo de 16px no tamanho base
