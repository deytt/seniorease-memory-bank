# Progress — SeniorEase

> Atualizado por cada dev ao concluir uma tarefa. Use `[x]` para marcar como concluído.
> Última atualização: 2026-06-30 (Backlog Web alinhado em paridade com o mobile — acessibilidade, tarefas, perfil e tour)

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

### Configuração inicial
- [x] Projeto Next.js 16 inicializado com TypeScript
- [ ] Estrutura de pastas Clean Architecture criada (`domain/`, `infrastructure/`, `presentation/`)
- [ ] memory-bank adicionado como submódulo
- [ ] `.cursor/rules/memory-bank.mdc` copiado para o projeto
- [ ] Tailwind CSS configurado com tokens do Design System
- [ ] Firebase SDK configurado
- [ ] Zustand configurado

### Design System (componentes base)
- [ ] Button (Primary, Secondary, Destructive, Ghost)
- [ ] Input (Text, Password, Email)
- [ ] Card
- [ ] Modal de confirmação
- [ ] Toast / Notificação
- [ ] Badge
- [ ] Tema dinâmico (CSS custom properties para fonte, contraste, espaçamento)

### Autenticação
- [ ] Tela Login
- [ ] Tela Register
- [ ] Tela Forgot Password
- [ ] Tela Success Screen
- [ ] Firebase Auth integrado
- [ ] Login com Google (OAuth)
- [ ] Rota protegida (redirect se não autenticado)

### Dashboard
> Deve espelhar a Home do mobile (saudação, SOS, quick actions, lembretes de hoje, card "Próxima Atividade"), com diferenças próprias da web (ex.: header/topbar adaptado em vez do header gradiente mobile). Ver Figma `node 134-851`. Detalhe ao critério do design web.
- [ ] Tela Dashboard

### Documentação de componentes (Storybook)
> Requisito: todos os componentes da web documentados no Storybook — documentação completa cobrindo cada componente e variações do Design System, além de componentes customizados que eventualmente não existam no DS.
- [ ] Storybook configurado no projeto web
- [ ] Stories de todos os componentes do Design System (com todas as variações/estados)
- [ ] Stories dos componentes customizados fora do Design System
- [ ] Controls/args (props), estados (hover/disabled/loading/erro) e tokens documentados

### Módulo 1 — Acessibilidade
> Mesma funcionalidade e mesma collection `preferences/{userId}` do mobile; lógica idêntica (incl. `maximum` derivado pelo `SavePreferencesUseCase`). Adaptação web: tema dinâmico via CSS custom properties / theme context (não `ThemeData`).
- [ ] Tela Accessibility Center
- [ ] Toggle de tamanho de fonte (funcional)
- [ ] Toggle de Dark Mode (funcional) — mapeia `preferences.darkMode`; `contrast: 'maximum'` derivado quando `darkMode && high` (ADR-009)
- [ ] Toggle de contraste (funcional)
- [ ] Toggle de espaçamento (funcional)
- [ ] Toggle de Modo Básico / Avançado (funcional)
- [ ] Toggle de Feedback de Áudio e Tátil (funcional) — `audioFeedbackEnabled` (ADR-009)
- [ ] Toggle de Botões Maiores / áreas de toque (funcional) — `largeTouchTargets`
- [ ] Persistência das preferências no Firestore

### Módulo 2 — Tarefas
> Mesma collection `tasks/{taskId}` (+ subcollection `steps`) e mesma lógica do mobile; adaptação web: estado via Zustand selectors (não Riverpod), ordenação em memória no repositório.
- [ ] Tela Task List
- [ ] Tela Task Details
- [ ] Tela Create Task
- [ ] Tela Guided Task Mode (passo a passo)
- [ ] Animação Lottie de celebração ao concluir tarefa
- [ ] Filtros na Task List (categoria, prioridade, "hoje") via queries Firestore + composite indexes já criados (ADR-012)
- [ ] Ordenação da lista por dueDate ascendente (pendentes primeiro, nulls no fim) (ADR-011)
- [ ] Card "Próxima Atividade" no Dashboard ligado ao Firestore — equivalente a `nextPendingTaskProvider` (ADR-011)
- [ ] Atualizar lista / refetch com reset de filtros — equivalente web ao pull-to-refresh do mobile
- [ ] Tela Reminder Center
- [ ] Lembretes — exibição e visualização de push notifications (Firebase Cloud Messaging / FCM Web + Service Worker)
- [ ] Tela History (Figma `15:8316`) — replicar a experiência do mobile (ADR-017):
  - [ ] Mesma collection `history/{id}` e mesmos indexes/rules (já publicados — nada a criar no Firebase)
  - [ ] Port `HistoryRecorder` equivalente em TS (hook/serviço injetado) com No-op default + adaptador na raiz de composição, evitando acoplamento entre módulos (espelha o mobile)
  - [ ] Disparar `record(...)` nos mesmos pontos (criar/concluir/editar/apagar tarefa e lembrete, ajustar acessibilidade, atualizar perfil, verificar conta), best-effort
  - [ ] Portar 1:1 a função pura de streak/contagem semanal (`computeStats`)
  - [ ] Contadores computados on-read via Zustand selectors; contraste/tamanho de fonte via CSS custom properties; Modo Básico oculta eventos de baixa relevância
  - [ ] Tour da tela History com a lib de tour da Web

### Módulo 3 — Perfil / Definições
> Mesma collection `users/{userId}` (estendida no ADR-014) e mesmo bucket Storage `profile_photos/{userId}` do mobile; lógica idêntica, adaptação web nas bibliotecas (máscaras, upload).
- [ ] Tela Settings — Figma `15:8860` (renomeada de "My Profile")
- [ ] Profile banner com gradiente + avatar com iniciais
- [ ] 5 rows de navegação (incl. link para Acessibilidade)
- [ ] Card "Precisa de Ajuda?" com número 1-800-SENIOR
- [ ] Botão "Sair da Conta" com confirmação modal
- [ ] Tela "Sobre" — identidade do app, versão e ligação clicável para a app (paridade com mobile `/about`)
- [ ] Tela Perfil — exibe foto/nome/email/telefone e edita Informação Pessoal (nome; email só-leitura; data de nascimento; telefone; CPF) + Endereço (bairro/rua/número/CEP/cidade/estado/país) (ADR-014)
- [ ] Máscaras de input (telefone, CPF, data, CEP) — lib web equivalente (ex.: `react-input-mask` / `imask`)
- [ ] CPF (opcional) oculto em Modo Básico
- [ ] Upload de foto de perfil para o Firebase Storage (`profile_photos/{userId}`; `photoUrl` em `users`)
- [ ] Tela "Segurança" — hub de proteção da conta nas Definições (abaixo de Perfil), com tour guiado (paridade com mobile `/security`)
- [ ] Segurança — Verificar conta por e-mail (Firebase Auth email verification) — a implementar
- [ ] Segurança — Alterar palavra-passe — a implementar

> Nota: a **biometria** é exclusiva do mobile (`local_auth` como trava local de acesso ao app). Não se aplica à Web — por isso não consta deste backlog.

### Módulo 4 — Tour Guiado
> Mesmo comportamento do mobile (ADR-013), com infra/dependências/adaptadores próprios da web (Next.js, Zustand, biblioteca de tour React). A collection Firestore `onboarding/{userId}` e a respetiva rule são partilhadas (já criadas).
- [ ] Biblioteca de tour/onboarding escolhida e adicionada (ex.: `react-joyride` / `driver.js`)
- [ ] Infra genérica de tour (abstração/port `TourGate`, componente de showcase com tokens do Design System, hook/store de coordenação, catálogo de `TourId`)
- [ ] Persistência híbrida: estado local "oferecido/visto" (localStorage) + flag inicial cross-device na collection `onboarding/{userId}` (Firestore)
- [ ] Adaptador concreto na raiz de composição (inversão de dependência, sem imports feature→feature)
- [ ] Boas-vindas inicial no Dashboard (persistida cross-device) + tutorial da tela inicial
- [ ] Tutorial de Criar Tarefa + oferta na 1ª utilização (apenas Modo Básico)
- [ ] Tutorial da Lista de Tarefas
- [ ] Tutorial da Acessibilidade + oferta na 1ª utilização (Modo Básico) + entrada na Central
- [ ] Tutorial das Definições + botão de ajuda + entrada na Central
- [ ] Tutorial da tela Sobre + botão de ajuda + entrada na Central
- [ ] Tutorial da tela Perfil + oferta na 1ª utilização (Modo Básico) + entrada na Central
- [ ] Tutorial da tela Segurança + botão de ajuda + entrada na Central
- [ ] Tutorial da própria Central de Guias (só via botão de ajuda, sem item auto-referencial)
- [ ] Botão de ajuda (?) em todas as telas com tour
- [ ] Central "Guias do aplicativo" acessível a partir das Definições
- [ ] Requisitos da tela de Guias: lista de tutoriais (re)executáveis, linguagem simples ("Vamos fazer juntos"), cada item inicia o tutorial na respetiva tela
- [ ] Adaptação ao Modo Básico / Avançado (oferta automática só em Modo Básico)

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
- [ ] Segurança — Habilitar biometria (Android/iOS) — a implementar
- [x] Segurança — Verificar conta por e-mail (Firebase Auth `emailVerified`; alerta na linha "Segurança" das Definições; painel enviar/confirmar) (ADR-016)
- [ ] Segurança — Alterar palavra-passe — a implementar

### Módulo 4 — Tour Guiado (ADR-013)
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

### Testes (unitários)
> Requisito: todas as camadas da Clean Architecture (Presentation, Domain, Data) devem conter testes unitários (testes de lógica). Não usar testes instrumentados nem testes de view/widget.
- [x] Camada Domain — entidades (Task, TaskStep, TaskFilter, UserPreferences) + use cases (tasks, auth, accessibility, guides)
- [x] Camada Data — todos os repositórios Firebase com dependências **injetadas** (providers de `core/firebase`): `FirebaseTaskRepository`, `FirebasePreferencesRepository`, `FirebaseOnboardingRepository` (fake_cloud_firestore), `FirebaseAuthRepository` (firebase_auth_mocks + fake) e `LocalTutorialStateRepository` (shared_preferences mock)
- [x] Camada Presentation — `TaskFilterNotifier`, `nextPendingTaskProvider`, `TasksController`, `AuthController`, `TourSignal`/`TourSession` (ProviderContainer, sem widgets)
- [x] Ferramentas: `flutter_test` + `mocktail` + `fake_cloud_firestore`; `test/` espelha `lib/`

---

## Correção de Gaps (análise de aderência 2026-07-06)

> Ver `gaps.md` para descrição completa, evidências e plano de cada gap.

### GAP-001 — Espaçamento ajustável

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
- [ ] Cancelar notificação ao deletar ou marcar lembrete como concluído
- [ ] Respeitar `prefs.remindersEnabled` (skip/cancel quando `false`)
- [ ] Registar ADR-018 (notificações locais vs FCM)

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
