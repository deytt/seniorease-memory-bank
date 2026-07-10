# Progress — SeniorEase

> Atualizado por cada dev ao concluir uma tarefa. Use `[x]` para marcar como concluído.
> Última atualização: 2026-07-08 (branch feat/adding-github-copilot-support — suporte a instruções/skills do GitHub Copilot + sync no update-memory-bank.sh)

---

## Memory Bank

- [x] README.md criado
- [x] projectbrief.md criado
- [x] productContext.md criado
- [x] systemPatterns.md criado
- [x] techContext.md criado
- [x] activeContext.md criado
- [x] progress.md criado
- [x] decisions.md criado
- [x] `.cursor/rules/memory-bank.mdc` criado (template)
- [x] `.github/copilot-instructions.md` criado (protocolo equivalente para GitHub Copilot / VS Code)
- [x] `.github/skills/project-overview/` criado (skill Copilot espelhada da Cursor)
- [x] `scripts/update-memory-bank.sh` atualizado para sincronizar Cursor **e** Copilot

---

## Firebase / Infra

- [x] Projeto Firebase criado no console (`seniorease-backend`)
- [x] Firebase Authentication habilitado (Email/Password)
- [x] Coleção `users` criada no Firestore
- [x] Coleção `tasks` criada no Firestore
- [x] Coleção `preferences` criada no Firestore
- [x] Coleção `reminders` criada no Firestore
- [x] Regras de segurança do Firestore configuradas
- [x] Firebase Cloud Messaging habilitado (push notifications)
- [x] Variáveis de ambiente compartilhadas com o time
- [x] Firebase Storage — `storage.rules` criado (`profile_photos/{userId}`) e referenciado em `firebase.json` (ADR-014); **pendente ativar o bucket no console + publicar regras**
- [ ] APNs configurado (iOS) — necessário para push notifications no iOS

> Coleções Firestore serão populadas automaticamente pela app na primeira gravação. Apps registadas: Web (`seniorease-web`), Android e iOS (`com.seniorease.mobile`). APNs iOS pendente para fase de push notifications.

---

## CI/CD

- [x] GitHub Actions configurado para Web (CI: lint+types+build em develop/master; CD: Vercel deploy em master)
- [x] GitHub Actions configurado para Mobile (build APK)
- [x] Firebase App Distribution configurado para Mobile

---

## Web Platform — seniorease-web

> Última atualização: 2026-07-07 (Revisão e correção de aderência — análise de código + lint/type-check zerados)

### Configuração inicial
- [x] Projeto Next.js 16 inicializado com TypeScript
- [x] Estrutura de pastas Clean Architecture criada (`domain/`, `infrastructure/`, `presentation/`)
- [x] memory-bank adicionado como submódulo
- [x] `.cursor/rules/memory-bank.mdc` copiado para o projeto
- [x] `.github/copilot-instructions.md` sincronizado a partir do memory-bank (branch `feat/adding-github-copilot-support`)
- [x] `.github/skills/project-overview/` sincronizado a partir do memory-bank
- [x] `scripts/update-memory-bank.sh` atualizado para sincronizar Cursor + Copilot
- [x] Tailwind CSS configurado com tokens do Design System (`globals.css` com todas as CSS custom properties)
- [x] Firebase SDK configurado
- [x] Zustand configurado

### Design System (componentes base)
- [x] Button (Primary, Secondary, Destructive, Ghost) — via shadcn/ui
- [x] Input (Text, Password, Email) — via shadcn/ui
- [x] Card — via shadcn/ui
- [x] Modal de confirmação (Dialog) — via shadcn/ui; usado em Logout, Exclusão de Tarefa e Reset de Acessibilidade
- [x] Toast / Notificação — via sonner
- [x] Badge — via shadcn/ui
- [x] Tema dinâmico (CSS custom properties para fonte, contraste, espaçamento) — `PreferencesProvider` aplica no `<html>`
- [ ] Storybook — **pendente** (ver secção Documentação abaixo)

### Autenticação
- [x] Tela Login (email/password + Google OAuth)
- [x] Tela Register
- [x] Tela Forgot Password
- [x] Tela Success Screen
- [x] Firebase Auth integrado
- [x] Login com Google (OAuth) — `SignInWithGoogleUseCase` + botão na UI com logo Google
- [x] Rota protegida (redirect se não autenticado) — guard no `(app)/layout.tsx`

### Dashboard
> Espelha a Home do mobile: saudação dinâmica, botão de emergência, quick actions (Nova Tarefa, Acessibilidade, Emergência, Histórico), lembretes próximos, tarefas do dia e card de status de acessibilidade. Ver Figma `node 134-851`.
- [x] Tela Dashboard com saudação dinâmica (bom dia/tarde/noite)
- [x] Botão Emergência (SOS) no header
- [x] Grid de Ações Rápidas (2×2: Nova Tarefa, Acessibilidade, Emergência, Histórico)
- [x] Seção "Tarefas de Hoje" ligada ao Firestore (até 4 tarefas)
- [x] Seção "Lembretes Próximos" ligada ao Firestore (até 3 lembretes)
- [x] Card "Status de Acessibilidade" lendo preferências reais do store (corrigido 2026-07-07)

### Documentação de componentes (Storybook)
> Requisito: todos os componentes da web documentados no Storybook — documentação completa cobrindo cada componente e variações do Design System, além de componentes customizados que eventualmente não existam no DS.
- [ ] Storybook configurado no projeto web
- [ ] Stories de todos os componentes do Design System (com todas as variações/estados)
- [ ] Stories dos componentes customizados fora do Design System
- [ ] Controls/args (props), estados (hover/disabled/loading/erro) e tokens documentados

### Módulo 1 — Acessibilidade
> Mesma funcionalidade e mesma collection `preferences/{userId}` do mobile; lógica idêntica (incl. `maximum` derivado pelo `SavePreferencesUseCase`). Adaptação web: tema dinâmico via CSS custom properties.
- [x] Tela Accessibility Center (`/acessibility`)
- [x] Toggle de tamanho de fonte — slider com 4 níveis (Pequena/Média/Grande/Extra Grande)
- [x] Toggle de Dark Mode — mapeia `preferences.darkMode`; classe `.dark` no `<html>`
- [x] Toggle de contraste (Alto Contraste) — `[data-contrast="high"]` e `.dark[data-contrast="maximum"]` no CSS
- [x] Toggle de Espaçamento (Compacto / Confortável / Espaçoso) — adicionado 2026-07-07
- [x] Toggle de Modo Básico / Avançado — `data-interface-mode` no `<html>`
- [x] Toggle de Feedback de Áudio e Tátil — `audioFeedbackEnabled`
- [x] Toggle de Botões Maiores / áreas de toque — `.a11y-large-touch` com `min-height: 64px`
- [x] Persistência das preferências no Firestore
- [x] Redefinir para padrões com modal de confirmação

### Módulo 2 — Tarefas
> Mesma collection `tasks/{taskId}` do mobile; adaptação web com filtros em memória.
- [x] Tela Task List (`/tasks`) com filtros por categoria/data e busca por texto
- [x] Tela Task Details (`/tasks/[id]`) com badges em PT, deleção com modal de confirmação
- [x] Tela Create Task (`/tasks/create`)
- [x] Tela Guided Task Mode (`/tasks/[id]/guided`) — "Passo X de Y" correto, barra de progresso, botão Passo Anterior
- [x] Animação Lottie de celebração ao concluir tarefa (via lottie-react + `public/celebration.json`)
- [x] Filtros na Task List (categoria + "hoje" + busca por título) — processamento em memória
- [x] Labels de prioridade/categoria/status em português (corrigido 2026-07-07)
- [ ] Ordenação por dueDate ascendente no repositório (pendente)
- [ ] Card "Próxima Atividade" isolado no Dashboard (pendente — atualmente mostra lista de tarefas)
- [x] Tela Reminder Center (`/reminders`) — lista, marcar concluído, ordenação por scheduledAt
- [x] Tela Create Reminder (`/reminders/create`)
- [x] Reminder alinhado ao schema/mobile (`category`, `notified`, `createdAt`; 5 categorias) — branch `feat/web-reminders-figma` (2026-07-10)
- [x] Filtros combináveis Hoje + categoria; Modo Básico simplifica pills; `ReminderCard` reutilizável — Figma `15:5163`
- [x] Edição (`/reminders/[id]/edit`) e exclusão com modal de confirmação — paridade com mobile (2026-07-10)
- [x] Responsividade Lembretes + shell: sidebar `lg` + auto-colapso &lt;1280px; card com ações empilhadas até `xl`; filtros com wrap; header empilhável (2026-07-10)
- [ ] FCM Web + Service Worker para push notifications (pendente — infra existe mas não integrada)
- [x] Tela History (`/history`) — stats (semana/streak/total/mês), banner de conquista, timeline de eventos

### Módulo 3 — Perfil / Definições
> Mesma collection `users/{userId}` do mobile; lógica análoga.
- [x] Tela Perfil (`/profile`) — avatar com iniciais, informações pessoais, preferências de notificação, links para segurança
- [x] Tela Edit Profile (`/profile/edit`) — formulário de edição de dados
- [x] Tela Segurança (`/profile/security`) — formulário de alteração de senha (UI completa)
- [x] Modal de confirmação no Logout (corrigido 2026-07-07 — estava sem confirmação)
- [ ] Tela "Sobre" (About) — **pendente** (sem rota `/about`)
- [ ] Upload de foto de perfil para Firebase Storage — **pendente** (TODO no código)
- [ ] Máscaras de input (telefone, CPF, data, CEP) — **pendente** (lib não instalada)
- [ ] CPF oculto em Modo Básico — **pendente**
- [ ] Verificar conta por e-mail (Firebase email verification UI) — **pendente**
- [ ] Alterar senha — implementação real Firebase (`updatePassword`) — **pendente** (UI existe, lógica não)
- [ ] Card "Precisa de Ajuda?" (1-800-SENIOR) — **pendente**

> Nota: a **biometria** é exclusiva do mobile. Não se aplica à Web.

### Módulo 4 — Tour Guiado
> Mesmo comportamento do mobile (ADR-013), com biblioteca React equivalente.
- [ ] Biblioteca de tour/onboarding escolhida e adicionada (ex.: `react-joyride` / `driver.js`)
- [ ] Infra genérica de tour e todas as telas — **pendente** (nenhum item iniciado)

### Qualidade de código
- [x] ESLint: 0 erros, 0 warnings (verificado 2026-07-07)
- [x] TypeScript strict: 0 erros (verificado 2026-07-07)
- [x] CI/CD configurado (GitHub Actions: lint + type-check + build em PR; deploy Vercel em master)
- [ ] Testes unitários (Domain, Data, Presentation) — **pendente** (0 testes existem)

---

### Features parcialmente implementadas (para segunda fase)

| Feature | Status atual | O que falta |
|---------|-------------|-------------|
| Upload de foto | UI pronta (botão + file input) | Integrar `getStorage`, `uploadBytes`, `getDownloadURL` do Firebase Storage |
| Alterar senha | Formulário de UI completo | Chamar `reauthenticateWithCredential` + `updatePassword` do Firebase Auth |
| Verificar e-mail | Sem UI | Adicionar botão em `/profile/security` que chama `sendEmailVerification` |
| Storybook | Não iniciado | Instalar `@storybook/nextjs`, criar stories para Button, Input, Card, Badge, Dialog, Toast |
| Testes unitários | 0 testes | Implementar com `vitest` ou `jest` para domain entities, use cases e hooks |
| Tela "Sobre" | Ausente | Criar rota `/about` com identidade do app, versão e link para o repositório |
| Tour Guiado | Ausente | Instalar `driver.js` ou `react-joyride`, criar abstração port/adapter análoga ao mobile |
| Ordenação por dueDate | Sem ordenação no repo | Adicionar `.orderBy('dueDate', 'asc')` nas queries Firestore + `nulls last` em memória |
| FCM Web | Config existe (`fcmService.ts`) | Registrar Service Worker, solicitar permissão, integrar no `FCMProvider` |
| Máscaras de input | Sem lib | Instalar `imask` ou `react-input-mask`, aplicar em telefone/CPF/CEP |
| CPF em Modo Básico | Campo existe no form | Ler `preferences.interfaceMode` e ocultar campo CPF quando `basic` |

---

## Mobile App — seniorease-mobile

### Configuração inicial
- [x] Projeto Flutter inicializado
- [x] Estrutura de pastas Feature-First + Clean Architecture criada (ADR-008)
- [x] memory-bank adicionado como submódulo
- [x] `.cursor/rules/memory-bank.mdc` copiado para o projeto
- [x] `flutterfire configure` executado
- [x] Riverpod configurado
- [x] GoRouter configurado

### Design System (widgets base)
- [x] SeniorButton (Primary, Secondary, Outline, Ghost, Destructive)
- [x] SeniorInput (label compacto para campos lado a lado)
- [x] SeniorCard
- [x] SeniorLogo
- [x] SeniorScreenHeader (botão voltar Figma `15:6423`)
- [x] SeniorScreenScaffold
- [x] SeniorFormBody (scroll com altura mínima proporcional)
- [x] Modal de confirmação
- [x] SnackBar / Toast
- [x] Edge-to-edge e system UI (`senior_system_ui.dart`, MainActivity, styles Android)
- [x] ThemeData dinâmico (fonte, contraste via MaterialApp)

### Autenticação
- [x] Tela Login (Figma `15:6210`)
- [x] Tela Register (Figma `15:6415` — nome/sobrenome lado a lado, scroll unificado)
- [x] Tela Forgot Password (Figma `15:6638` — conteúdo centralizado, botão outline)
- [x] Firebase Auth integrado
- [x] Login com Google (OAuth) — `google_sign_in` v6, botão no Login, auto-preenche nome/foto no 1.º login, vinculação automática por e-mail (ADR-015)
- [x] Rota protegida
- [x] **Biometric App Lock** (2026-07-09) — `BiometricLockScreen` (`/biometric-lock`): auto-dispara prompt nativo no `initState`, botão "Tentar novamente" e botão secundário "Usar senha" (sign-out → `/login`); `biometricLockedProvider` (StateProvider, reset por sessão) + `biometricEnabledProvider` (Provider síncrono derivado); router redirect: `isLoggedIn && biometricEnabled && biometricLocked → /biometric-lock`; `GoRouterRefreshNotifier` escuta `biometricLockedProvider` + `biometricControllerProvider`; credenciais mock e botão biométrico redundante removidos da `LoginScreen`

### Home
- [x] Tela Home (Dashboard) — Figma `15:6831`
- [x] Header gradiente com saudação dinâmica + botão SOS
- [x] Grid 2×2 Quick Actions (Nova Tarefa, Acessibilidade, Lembretes, Ajuda Rápida)
- [x] Secção Lembretes de Hoje (ligada ao Firestore)
- [x] Banner de sucesso
- [x] Bottom Navigation Bar com 5 tabs (StatefulShellRoute)

### Módulo 1 — Acessibilidade
- [x] Tela Accessibility (Figma `15:9085`)
- [x] Toggle de tamanho de fonte (ThemeData dinâmico — 4 passos 87%/100%/120%/150%)
- [x] Toggle de Dark Mode (ThemeMode.dark via buildDynamic)
- [x] Toggle de Alto Contraste (ContrastMode.high / maximum)
- [x] Toggle de Modo Básico / Avançado
- [x] Toggle de Feedback de Áudio e Tátil
- [x] Toggle de Botões Maiores (largeTouchTargets 64×64px)
- [x] ThemeData dinâmico (AppTheme.buildDynamic — escala tipográfica, contraste, touch targets)
- [x] Persistência das preferências no Firestore

### Módulo 2 — Tarefas
- [x] Tela Task List (Figma `15:7134` — header, contador, TaskCard, promo Modo Guiado)
- [x] Tela Task Details (Figma `15:7401` — badges, passos, ações, apagar com confirmação)
- [x] Tela Create Task (Figma `15:7612` — passos dinâmicos com "+" e "X")
- [x] Tela Guided Task (Figma `15:7818` — passo a passo sequencial inteligente)
- [x] Animação Lottie de celebração ao concluir tarefa
- [x] Melhorias UX Create Task (categoria como dropdown, dueDate full datetime, 1 passo pré-aberto, validações, sem botão Guardar no header)
- [x] Limites de caracteres (título 30, descrição 100, passo 30)
- [x] TaskDetails com header genérico (título + badges de prioridade/categoria) e data na card
- [x] Cores de botões alinhadas ao Figma (Guided=teal, Complete=verde)
- [x] TaskCard com badges de prioridade+categoria e data formatada na lista
- [x] Ordenação da lista por dueDate ascendente (mais próxima primeiro, nulls no fim)
- [x] Card "Próxima Atividade" na Home ligado ao Firestore via nextPendingTaskProvider
- [x] Filtros na Task List — filtro por categoria, prioridade e "hoje" aplicados na query Firestore (ADR-012)
- [x] Pull-to-refresh na Task List — reset de filtros + refetch completo com toast informativo
- [x] Tela Reminders (lista, marcar concluído, ordenação crescente por `scheduledAt`)
- [x] Criar lembrete (Firestore CRUD, sem push no device)
- [x] Editar lembrete reutilizando a tela de criação (rota `/reminders/:id/edit`, `UpdateReminderUseCase`) — bloqueado para lembretes concluídos
- [x] Card de lembrete: swipe bidirecional (esquerda apaga / direita edita, bloqueado quando concluído), toque para expandir a descrição completa (acessível), data no card e dica de swipe ("peek") na 1ª abertura da sessão
- [x] Home → lista: toque no lembrete limpa filtros, navega para a aba de Lembretes e destaca o item com `ensureVisible` + pulso; preview mostra os 3 primeiros; data também exibida no card da Home
- [x] Header Reminders alinhado ao de Tarefas (botão ajuda "?" + filtro com badge + criar) e header Novo Lembrete estilo Nova Tarefa (botão "?", hints, título 30, validação de data no passado)
- [x] Categorias de lembrete (Medicação, Consulta, Hidratação, Alimentação, Contas e Pagamentos) em combo box na criação
- [x] Filtros combináveis (Categoria + "Hoje") via `ReminderFilter` + `ReminderFilterSheet` + barra de chips activos (estilo Tarefas)
- [x] Tour Guiado dos Lembretes (`TourId.remindersList` e `TourId.createReminder`) com oferta na 1ª utilização e entradas na Central
- [x] Secção Lembretes de Hoje na Home ligada ao Firestore
- [x] Tela History (Figma `15:8316`) — feature `history` em Clean Architecture; stats cards, banner de streak dinâmico e lista "Atividade Recente" agrupada por dia (ADR-017)
- [x] Registo cross-feature via port `HistoryRecorder` (`core/history/`) + adaptador `AppHistoryRecorder` (`app/history/`), best-effort, disparado por tasks/reminders/accessibility/profile/auth
- [x] Contadores "Tarefas esta semana" e "Sequência (streak)" computados on-read (função pura `computeStats`)
- [x] Collection `history/{id}` + 2 composite indexes + rule (dono) publicados no Firestore (ADR-017)
- [x] Acessibilidade (FittedBox nos números, Semantics nos ícones, Modo Básico oculta eventos de baixa relevância) + Tour Guiado (`TourId.history`) e entrada na Central
- [x] Testes das 3 camadas (domínio streak/mapa, data com `fake_cloud_firestore`, presentation stats + adaptador)

### Módulo 3 — Perfil / Definições
- [x] Tela Settings / Definições (`features/profile`)
- [x] Profile banner com gradiente + avatar com iniciais (nome + email do utilizador)
- [x] Card de navegação com rows (Informação Pessoal, Notificações, Acessibilidade, Guias do aplicativo, Sobre)
- [x] Card "Precisa de Ajuda?" com número 1-800-SENIOR
- [x] Botão "Sair da Conta" com confirmação modal
- [x] Tela "Sobre" (`/about`) — identidade do app, versão e ligação clicável para a web app (url_launcher)
- [x] Tela "Perfil" (`/profile`) — exibe foto/nome/email/telefone e edita Informações Pessoais + Endereço (ADR-014)
- [x] Renomeado "Informação Pessoal" → "Perfil" nas Definições, com navegação para `/profile`
- [x] Configurações de conta — editar dados do utilizador (nome, telefone, data de nascimento, CPF, endereço; campos mascarados)
- [x] Upload de foto de perfil para o Firebase Storage (`image_picker` + `profile_photos/{userId}`)
- [x] Tela "Segurança" (`/security`) — hub de proteção da conta nas Definições (abaixo de Perfil), com tour guiado
- [x] Segurança — Habilitar biometria (Android/iOS)
- [x] Segurança — Verificar conta por e-mail (Firebase Auth `emailVerified`; alerta na linha "Segurança" das Definições; painel enviar/confirmar) (ADR-016)
- [x] Segurança — Alterar palavra-passe — implementado (reauthenticate + updatePassword; painel inline com 3 campos; aviso para contas Google; log no Histórico)

### Módulo 4 — Tour Guiado (ADR-013 + ADR-021)
- [x] Dependências `showcaseview ^5.1.0` e `shared_preferences` adicionadas
- [x] Infra genérica `core/tour/` (port `TourGate`, `SeniorShowcase`, mixin `TourHost`, `TourHelpButton`, `TourId`, sinais de coordenação)
- [x] Feature `guides/` (use cases + `TutorialStateRepository` local + `OnboardingRepository` Firestore + providers + catálogo)
- [x] Adaptador `AppTourGate` na camada `app/` injetado via `ProviderScope` (inversão de dependência, sem imports feature→feature)
- [x] Collection Firestore `onboarding/{userId}` + rule (dono apenas) + schema/ADR documentados
- [x] Boas-vindas inicial na Home (persistida cross-device) + tutorial da Tela Inicial
- [x] Tutorial de Criar Tarefa + oferta na 1ª utilização (apenas Modo Básico)
- [x] Tutorial da Lista de Tarefas
- [x] Tutorial da Acessibilidade (4 passos) + oferta na 1ª utilização (Modo Básico) + entrada na Central
- [x] Tutorial das Definições (3 passos: atalhos, ajuda, sair da conta) + botão de ajuda no banner + entrada na Central
- [x] Tutorial da tela Sobre (2 passos: descrição/versão e aplicação web) + botão de ajuda + entrada na Central
- [x] Tutorial da tela Perfil (3 passos: foto, dados pessoais, guardar) + oferta na 1ª utilização (Modo Básico) + entrada na Central (ADR-014)
- [x] Tutorial da tela Segurança (3 passos: biometria, verificar conta, alterar senha) + botão de ajuda + entrada na Central
- [x] Tutorial da própria Central de Guias (2 passos: o que é + começar um guia) — só via botão de ajuda (sem item auto-referencial)
- [x] Botão de ajuda (?) em todas as telas com tour
- [x] Central "Guias do aplicativo" (`/guides`) acessível a partir de Definições
- [x] Publicar a rule da collection `onboarding` no Firebase (`seniorease-backend`)
- [x] Balão com botão X de sair (canto superior, alinhado ao título) + auto-scroll ágil e condicional
- [x] **ADR-021** — Tour automático em TODAS as 16 telas na 1ª visita (Modo Básico): `_maybeOfferFirstUse()` adicionado às 11 telas sem oferta automática; `tourSessionProvider` removido (redundante face ao `isOffered` por `TourId`); diferenciação Modo Básico vs. Avançado documentada
- [x] Animação de atenção no ícone `?` (pulse) e no sininho de notificações (shake) — sempre exibida, em qualquer modo
- [x] Pop-up "Conheça as funções" — exibido apenas na 1ª visita em Modo Básico (via `TourGate.shouldOfferFirstUse` dentro de `TourAttentionWrapper`); modal de convite de tour (`_maybeOfferFirstUse`) substituído pelo pop-up em todas as 16 telas

### Testes (unitários)
> Requisito: todas as camadas da Clean Architecture (Presentation, Domain, Data) devem conter testes unitários (testes de lógica). Não usar testes instrumentados nem testes de view/widget.
- [x] Camada Domain — entidades (Task, TaskStep, TaskFilter, UserPreferences) + use cases (tasks, auth, accessibility, guides)
- [x] Camada Data — todos os repositórios Firebase com dependências **injetadas** (providers de `core/firebase`): `FirebaseTaskRepository`, `FirebasePreferencesRepository`, `FirebaseOnboardingRepository` (fake_cloud_firestore), `FirebaseAuthRepository` (firebase_auth_mocks + fake) e `LocalTutorialStateRepository` (shared_preferences mock)
- [x] Camada Presentation — `TaskFilterNotifier`, `nextPendingTaskProvider`, `TasksController`, `AuthController`, `TourSignal` (ProviderContainer, sem widgets) — `TourSession` removido em ADR-021
- [x] Ferramentas: `flutter_test` + `mocktail` + `fake_cloud_firestore`; `test/` espelha `lib/`
- [x] Feature `notifications` — domain (`NotificationItem`, use cases FCM token + history), data (`FirebaseFcmTokenRepository`, `FirebaseNotificationHistoryRepository`), presentation (`notificationHistoryProvider`, `todayNotificationCountProvider`) — **226 testes passam** (2026-07-06)
- [x] Testes biometria — `biometric_usecases_test.dart` (6 casos: `CheckBiometricAvailability`, `AuthenticateWithBiometric`, `EnableBiometric` ×3, `DisableBiometric`) + `biometric_controller_test.dart` (4 casos: `build()`, `enable()` sucesso/erro, `disable()`) — (2026-07-09)

---

## Correção de Gaps (análise de aderência 2026-07-06)

> Ver `gaps.md` para descrição completa, evidências e plano de cada gap.

### GAP-001 — Espaçamento ajustável

**Concluído: 2026-07-06**

- [x] Criar `SpacingScale` / `AppSpacing.factor(SpacingMode)` em `core/theme/app_spacing.dart`
- [x] Criar `ThemeExtension<SeniorSpacingTheme>` em `core/theme/senior_spacing_theme.dart`
- [x] Integrar `SeniorSpacingTheme` em `AppTheme.buildDynamic()` a partir de `prefs.spacing`
- [x] Criar widget `SpacingModeCard` em `features/accessibility/presentation/widgets/`
- [x] Adicionar `SpacingModeCard` na `AccessibilityScreen` + novo alvo de tour (`_spacingShowcaseKey`)
- [x] Aplicar `SeniorSpacingTheme` nas telas principais (Home, Tasks, Reminders, History, Accessibility)
- [x] Atualizar testes de `UserPreferences` para cobrir `spacing` + fator

### GAP-002 — Notificações Push FCM (Tarefas + Lembretes)

**Concluído: 2026-07-06**

- [x] Adicionar `firebase_messaging` ao `pubspec.yaml`
- [x] Enum `NotificationOffset` + 4 campos em `UserPreferences` (remover `remindersEnabled`/`notificationTime`)
- [x] Campo `notified` em `Task` (remover `reminderTime`) e `Reminder`
- [x] `core/notifications/push_notification_service.dart` (wrapper FCM)
- [x] Feature `notifications`: `FcmTokenRepository` + use cases + `notifications_provider.dart`
- [x] `AppNotificationsGate`: init FCM, token refresh, `onMessage` (toast), `onMessageOpenedApp`/`getInitialMessage` (nav)
- [x] Sign-out: `removeFcmTokenOnSignOut` antes do `signOut()`
- [x] `notificationPreferencesControllerProvider` em `preferences_provider.dart`
- [x] Tela `NotificationPreferencesScreen` + widget `NotificationOffsetCard`
- [x] Tour guiado: `TourId.notificationPreferences`, `SeniorShowcase`, `TourHelpButton`
- [x] Entrada em `kTutorials` + rota `AppRoutes.notificationPreferences`
- [x] Ligação no `settings_screen.dart`
- [x] Cloud Functions TypeScript: `sendDueNotifications` (cron 1min) + `resetReminderNotified`
- [x] `memory-bank/firebase.json` atualizado com bloco `functions`
- [x] `firestore.rules`: `notifications` (read-only) + `fcmTokens` (dono)
- [x] `firestore.indexes.json`: 3 novos composite indexes
- [x] `memory-bank/notifications.md`: spec completa mobile + web
- [x] `memory-bank/decisions.md`: ADR-020
- [x] `memory-bank/firebaseSchema.md`: atualizado
- [x] `memory-bank/techContext.md`: atualizado
- [x] Testes: `user_preferences_test.dart` (NotificationOffset + novos campos)
- [x] Sininho no header da Home (substitui SOS) — badge hoje + navega para `/notifications`
- [x] Tela `NotificationsScreen` (`/notifications`): lista histórico `notifications/{id}`, tour 3 passos
- [x] `NotificationItemCard` (ícone por entityType, tempo formatado, tap navega à entidade)
- [x] `NotificationHistoryRepository` + `FirebaseNotificationHistoryRepository` + `WatchNotificationHistoryUseCase`
- [x] `notificationHistoryProvider` (StreamProvider) + `todayNotificationCountProvider` (badge)
- [x] `TourId.notifications` + entrada em `kTutorials` + rota `AppRoutes.notifications`
- [x] `notifications.md` — secção 7 "Sino de notificações" com spec web
- [x] `resetTaskNotified` Cloud Function: repõe `notified=false` quando `dueDate` muda ou tarefa é reactivada (2026-07-06)
- [x] Cancelar/re-notificar ao deletar/completar: confirmado que cron já verifica `status != completed` e `isRead == false`; `resetTaskNotified` garante re-notificação ao reabrir tarefa
- [x] Respeitar `prefs.tasksNotificationsEnabled` / `prefs.remindersNotificationsEnabled`: já implementado no cron `sendDueNotifications` — verificado e documentado (2026-07-06)
- [x] Registar decisão "local vs FCM": coberto por ADR-020 (alternativas consideradas); documentado em `notifications.md` secção 3a (2026-07-06)

### GAP-003 — `audioFeedbackEnabled` controlar haptics

- [x] Criar `core/feedback/senior_feedback.dart` com wrapper `SeniorFeedback.light/selection/medium/success(ref)`
- [x] Substituir todas as chamadas a `HapticFeedback.*` pelo wrapper `SeniorFeedback.*`
- [x] Adicionar `audioplayers` e `assets/sounds/success.mp3` para feedback sonoro
- [x] Integrar `SeniorFeedback.success()` nos momentos de conclusão (tarefa, lembrete, perfil, formulários)
- [x] Adicionar feedback a `SettingsNavRow`, toggles de acessibilidade e botão fechar do modo guiado

### GAP-004 — "Passo X de Y" no Guided Task

- [x] Substituir `'$current/$total'` por `'Passo $current de $total'` em `guided_task_screen.dart`
- [x] Adicionar `Semantics(label: ...)` no contador de passos

### GAP-005 — `core/` não deve importar `features/`

- [x] Mover `UserPreferences` e enums relacionados para `core/preferences/user_preferences.dart`
- [x] Atualizar todos os imports existentes para o novo caminho (`app_spacing.dart`, `app_theme.dart`, `app_spacing_test.dart`); `features/` usa re-export para compatibilidade
- [x] Criar `core/preferences/preferences_state.dart` com `audioFeedbackEnabledProvider`; `senior_feedback.dart` migrado para usar este provider; override em `app.dart` liga ao valor real de `preferencesProvider`
- [x] Definir estratégia para `auth_provider` cross-feature — registado ADR-018 + ADR-019 em `decisions.md`; decisão de manter import directo para o Hackathon com plano de migração documentado
- [x] Confirmar `flutter analyze` com 0 erros após refactor

### Dark Mode — Correção nas telas secundárias (2026-07-08)

- [x] `SeniorScreenScaffold` — `backgroundColor` nullable; resolve para `Theme.of(context).scaffoldBackgroundColor` (fundo escuro em dark mode em todas as telas secundárias)
- [x] `SeniorInput` — labels e texto do campo: `AppColors.slate900` → `theme.colorScheme.onSurface` (inputs legíveis em dark mode)
- [x] `create_task_screen.dart` — `_LabeledField` e `_StepsSection`: labels corrigidos para `onSurface`
- [x] `create_reminder_screen.dart` — `_LabeledField`: label corrigido para `onSurface`
- [x] `settings_nav_row.dart` — fundo do ícone: `AppColors.primaryLight` → `primary.withValues(alpha: 0.15)`
- [x] `profile_screen.dart` — fundo do placeholder de foto e `_PhotoSourceTile` ícone container
- [x] `security_screen.dart` — `_VerificationPanel` (fundo tint âmbar + texto `AppColors.warning`), `_VerifiedBadge`, `_NotVerifiedBadge`, `_ComingSoonBadge` e `_SecurityRow` ícone container
- [x] `about_screen.dart` — `_WebAppCard`: fundo `primary.withValues(alpha: 0.10)`, container interno `Colors.white` → `surface`, texto `primaryDark` → `colorScheme.primary`
- [x] `guides_screen.dart` — `_IntroCard` e ícone de `_TutorialCard` corrigidos
- [x] `settings_screen.dart` — `_HelpCard`: fundo e texto corrigidos (bónus)
- [x] `notification_offset_card.dart` — chip selecionado: `primaryLight` → `primary.withValues(alpha: 0.15)`
- [x] `spacing_mode_card.dart` — botão selecionado: `primaryLight` → `primary.withValues(alpha: 0.15)`
- [x] `interface_mode_card.dart` — botões selecionados: `primaryLight`/`secondaryLight` → tint transparente via `selectedBorder.withValues(alpha:)`
- [x] `font_size_slider_card.dart` — `inactiveTrackColor`: `AppColors.slate200` → `onSurface.withValues(alpha: 0.2)`

---

## Vídeo e entrega final

- [ ] Avaliação interna criteriosa antes da entrega (Web + Mobile)
  - [ ] Criar um agente que conheça o desafio e os requisitos do projeto (projectbrief, productContext, telas obrigatórias, entregáveis)
  - [ ] Conferir o cumprimento de todos os requisitos em ambos os projetos (Web e Mobile)
  - [ ] Levantar lacunas, riscos e possíveis soluções/melhorias antes de entregar
  - [ ] Registar o resultado da avaliação (checklist final + ações)
- [ ] **Tornar público o repositório Mobile** (está privado — obrigatório antes da entrega)
- [ ] **Tornar público o repositório Web** (está privado — obrigatório antes da entrega)
- [ ] **Tornar público o Figma Design** (ficheiro de design está privado — obrigatório antes da entrega)
- [ ] Vídeo gravado (máx. 15 min)
- [ ] Vídeo enviado para plataforma FIAP
- [ ] Links dos repositórios submetidos (arquivo `.docx` ou `.txt`)
