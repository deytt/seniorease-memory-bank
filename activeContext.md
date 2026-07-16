# Active Context — SeniorEase

> Este arquivo é atualizado pelo dev que inicia uma nova frente de trabalho. Reflete o estado atual do time.
> Última atualização: 2026-07-15 (David — ADR-022 reauth Google silenciosa; APNs iOS; TestFlight)

---

## Status geral

**Fase atual:** Mobile em preparação de entrega — TestFlight a funcionar; push iOS (APNs) validado; Google Sign-In no iPhone corrigido. Web — Storybook concluído; backlog de testes e features pendentes. Entrega: vídeo de demo + avaliação interna + repos públicos.

O memory-bank está configurado no repositório mobile. Firebase (`seniorease-backend`) está operacional. CI/CD Mobile funcional com App Distribution. Design System base implementado. Autenticação (Login, Register, Forgot Password) integrada com Firebase Auth e rotas protegidas. Telas auth alinhadas ao Figma.

**ADR-015 + ADR-016 concluídos (2026-06-30):** **Login com Google (OAuth)** e **Verificação de e-mail**. Google via `google_sign_in` v6 (`googleSignInProvider` injetado com `serverClientId` = Web Client ID); `AuthRepository.signInWithGoogle` → `signInWithCredential`; 1.º login cria `users/{uid}` com nome/foto do Google sem sobrescrever perfil existente; cancelamento tratado por `AuthCancelledException` (UI ignora); botão "Entrar com Google" só no Login (logo "G" oficial em `assets/images/google_logo.png` via novo `SeniorButton.leading`); vinculação automática por e-mail ativada no console; iOS com `CFBundleURLTypes` (`REVERSED_CLIENT_ID`). Verificação de e-mail: `AppUser.emailVerified`, `sendEmailVerification`/`reloadAndCheckEmailVerified` no repo + use cases; `AuthController.refreshEmailVerification` invalida `authStateProvider`; `SettingsNavRow.showAlert` (exclamação) na linha "Segurança" quando não verificado; `SecurityScreen` com selo verde/âmbar + painel enviar/confirmar. Testes de auth ampliados (122 testes a passar, 0 erros de análise). **Pendente na Segurança:** biometria e alterar senha.

**ADR-014 concluído (2026-06-30):** Módulo Perfil (`features/profile/`) com Clean Architecture — `UserProfile`/`Address`, `ProfileRepository` (estende `users/{userId}` via merge) e `ProfilePhotoStorage` (Firebase Storage `profile_photos/{userId}`), use cases e providers injetados. `ProfileScreen` (`/profile`) exibe foto/nome/email/telefone e edita Informações Pessoais (nome 30, e-mail só-leitura, data de nascimento/telefone/CPF mascarados) e Endereço (bairro/rua/número/CEP/cidade/estado/país); foto via `image_picker` (galeria/câmara) com upload imediato. CPF (opcional) oculto em Modo Básico. Tour Guiado da tela (`TourId.profile`, 3 passos) + oferta na 1ª utilização (Modo Básico) + entrada na Central. `SeniorInput` ganhou `inputFormatters`/`readOnly`; máscaras em `core/utils/input_masks.dart`. "Informação Pessoal" renomeado para "Perfil" nas Definições. **Pendente:** ativar o bucket Storage no console e publicar `storage.rules`.

**Refactor ADR-008 concluído:** projeto migrado para Feature-First + Clean Architecture. **ADR-009 concluído:** Dynamic Theme Engine (`AppTheme.buildDynamic`) + Módulo Acessibilidade implementado. **ADR-010 concluído:** schema `tasks` estendido (priority, category, reminderTime) e Módulo Tarefas mobile implementado com passos dinâmicos, modo guiado sequencial inteligente e celebração Lottie. **ADR-011 concluído:** ordenação de tarefas por `dueDate` ascendente + `nextPendingTaskProvider`. **Melhorias UX 2026-06-25 (1ª vaga):** limites de caracteres; TaskDetails com header genérico; TaskCard com badges; Home com Próxima Atividade dinâmica. **ADR-012 concluído (2026-06-25):** Filtros na Task List com queries Firestore (category, priority, isToday), bottom sheet `TaskFilterSheet`, barra de chips activos, pull-to-refresh com reset de filtros. **ADR-013 concluído (2026-06-29):** Sistema de Tour Guiado com `showcaseview` — infra genérica em `core/tour/` (port `TourGate`, `SeniorShowcase`, mixin `TourHost`, sinais), feature `guides` (persistência híbrida: `shared_preferences` local + collection Firestore `onboarding/{userId}`), adaptador `AppTourGate` na camada `app/` (injetado via `ProviderScope`), tutoriais em Home/Criar Tarefa/Lista de Tarefas, Central "Guias do aplicativo" em Definições. Inversão de dependência respeita Feature-First (nenhuma feature importa outra). 0 erros de análise estática.

---

## Foco atual por frente

### Memory Bank / Agentes

**Responsável:** David
**Status:** Em andamento — branch `feat/adding-github-copilot-support` (sem commit ainda)
**Em curso:** Suporte a GitHub Copilot (VS Code) espelhado do protocolo Cursor: `.github/copilot-instructions.md`, `.github/skills/project-overview/`, e `scripts/update-memory-bank.sh` a sincronizar Cursor + Copilot nos projetos consumidores.
**Próximo passo:** Revisar, commit no memory-bank e no web, e avisar o time (sobretudo quem usa VS Code + Copilot no Windows) para puxar a branch / correr o script após merge.

### Firebase / Infra

**Responsável:** David (Tech Lead)
**Status:** Concluído (incl. APNs iOS)
**Entregue:** Projeto `seniorease-backend`, Auth Email/Password, Firestore com regras publicadas, FCM V1, apps Web/Android/iOS (`com.seniorease.mobile`), `.env.local` partilhado com o time.
**2026-07-15:** APNs Auth Key gerada na Apple Developer, carregada no Firebase Cloud Messaging; push notifications no iPhone físico validadas.

### Web (seniorease-web)

**Responsável:** Henrique / Tati
**Status:** Em andamento — Henrique: branch `feat/web-history-figma` (Histórico Figma `15:5492`); Tati: branch `feature/update-design-system`

**Concluído anteriormente (Henrique):**

- **Módulo Perfil (PR #19):** tela `/profile` alinhada ao Figma `15:5798`, tour guiado, segurança unificada, upload de foto
- **Central de Lembretes (PR #12):** interface completa de gerenciamento de lembretes na web
- **Modo Guiado Figma `15:4931` (PR #14):** sidebar, hub `/tasks/guided`, lógica sequencial, responsividade, saída para `/tasks`

**Concluído (Henrique — `feat/web-dashboard-figma`, 2026-07-16):** Dashboard `/dashboard` alinhado ao Figma `134-851` — sininho de notificações, badges de tarefas, quick actions com ícones Figma, card de acessibilidade, tela `/notifications`, seed de dados demo e FCM web parcialmente integrado.

**Concluído nesta frente (2026-07-13, Henrique — Perfil):**
- Upload de foto de perfil — `UploadProfilePhotoUseCase` + Firebase Storage integrado em `/profile`
- Alterar senha — `ChangePasswordUseCase` com reautenticação Firebase Auth
- Verificar e-mail — tela unificada `/profile/security` (ADR-016, paridade mobile)
- Alterar senha — integrado na mesma tela de Segurança
- Máscaras de input — `MaskedInput` em telefone, CPF, data de nascimento e CEP no formulário de edição
- Data de nascimento exibida em formato amigável na view do perfil (`formatBirthDateDisplay`)
- Removido 2FA (TOTP) da web — paridade com mobile (verificação por e-mail apenas)
- Card "Precisa de Ajuda?" (1-800-SENIOR) no perfil
- Tela Sobre (`/about`)
- Tour guiado do Perfil (`driver.js`, Modo Básico + botão `?`)

**Concluído nesta frente (2026-07-12, Tati):**

- **Storybook 10.5.0** — instalado, configurado com @storybook/nextjs framework (migrado de @storybook/nextjs-vite), 19 stories (15 UI componentes + 3 features + 1 integração) documentados com autodocs, controls/args e tipo TypeScript. Removidos CreateReminderForm e CreateTaskForm (dependências Firebase)
- **Bug fixes infraestrutura:**
  - Config conflict: `.storybook/main.js` (glob pattern incorreto) deletado, apenas `.storybook/main.ts` (correto)
  - Version mismatch: `@storybook/nextjs-vite` atualizado de 10.4.6 para 10.5.0
  - Next.js corruption: `next@16.2.9` reinstalado (faltava `font-data.json`)
  - npm install limpo (reinstalado 1266 packages, todas as dependências resolvidas)
- **Projeto Next.js rodando** em http://localhost:3000 (dev server com Turbopack)
- **Storybook rodando** em http://localhost:6006 (todos 21 componentes renderizando, sem erros de import)

**Próximo nesta frente (ordem acordada):** entrega hackathon (vídeo, repos públicos) após validação final do Dashboard.

**Próximos passos prioritários (segunda fase / time):**

1. Testes unitários — vitest/jest para Domain, Data e Presentation
2. Tour Guiado nas demais telas (infra genérica port/adapter)
3. Ordenação por dueDate no Firestore
4. FCM Web + Service Worker
5. Ativar bucket Firebase Storage + publicar `storage.rules` (David)

### Mobile (seniorease-mobile)

**Responsável:** David
**Status:** Entrega iOS em curso (2026-07-15) — TestFlight + correções nativas iOS.
**Feito nesta sessão (2026-07-15):**

- **APNs / Push iOS:** chave APNs no Firebase; notificações a funcionar no dispositivo físico.
- **TestFlight:** app criada no App Store Connect (`com.seniorease.mobile`); Archive/upload OK após corrigir ícone 1024 sem alpha (erro 90717). Avisos dSYM Firebase no upload são não bloqueantes.
- **Google Sign-In iOS:** crash ao tocar no botão — causa: `GoogleService-Info.plist` existia em disco mas **não** estava no target Runner (Copy Bundle Resources). Corrigido no Xcode. Evitar adicionar `Info.plist` aos Resources (`Multiple commands produce … Info.plist`).
- **ADR-022 — Face ID + “Continuar com Google”:** corrigido. Logout só limpa Firebase Auth (preserva sessão Google); re-login com conta Google lembrada usa `preferSilent: true` → `signInSilently()` (sem sheet OAuth); "Usar outra conta" chama `clearGoogleSession()`. Happy path: Face ID → silent Google → Home (iOS e Android).

**Status anterior:** Biometric App Lock implementado (2026-07-09) — fluxo de autenticação biométrica como ecrã de bloqueio da app.
**Implementado (histórico recente):**

- `BiometricLockScreen` (`/biometric-lock`): ecrã de bloqueio com logo, ícone biométrico, botão "Tentar novamente" e botão "Usar senha" (sign-out → login). Auto-dispara o prompt biométrico nativo no `initState` via `SchedulerBinding.addPostFrameCallback`.
- `biometricLockedProvider` (`StateProvider<bool>`, começa `true` por sessão) — o lock screen define `false` após auth bem-sucedida; o router redirect detecta a mudança e navega para Home.
- `biometricEnabledProvider` (`Provider<bool>`) — leitura síncrona derivada do `biometricControllerProvider`.
- Router atualizado: nova rota `/biometric-lock`, redirect `isLoggedIn && biometricEnabled && biometricLocked → /biometric-lock`, `GoRouterRefreshNotifier` escuta `biometricLockedProvider` + `biometricControllerProvider`.
- `LoginScreen` limpa: credenciais mock (`senior@teste.com` / `123456`) removidas, botão "Entrar com biometria" removido (coberto pelo lock screen).
- Testes: `biometric_usecases_test.dart` (6 casos) + `biometric_controller_test.dart` (4 casos).
  **Próximo passo:** gravação do vídeo de demo + avaliação interna final antes da entrega.
- `core/widgets/senior_feedback_overlay.dart` — novo widget genérico reutilizável com `check_animation.json`
- Tarefas: guided task, task details (conclusão), create task (criação) usam `SeniorFeedbackOverlay`
- Lembretes: criação, edição e conclusão (mark done) usam `SeniorFeedbackOverlay`; feedback `SeniorFeedback.success()` em todos os fluxos de sucesso
- `celebration_overlay.dart` mantido como re-export para compatibilidade retroativa
  **Módulo Histórico (2026-07-03, ADR-017):** feature `history` (`features/history/`) em Clean Architecture — `HistoryEvent`/`HistoryStats`, `HistoryRepository` (`log`/`watchRecent`/`fetchCompletions`) + `FirebaseHistoryRepository`, use cases (`LogHistoryEvent`, `GetHistory`, `GetHistoryStats` com função pura `computeStats`). O registo cross-feature usa o **padrão Port/Adapter** (igual ao Tour): enum `HistoryActionType` + port `HistoryRecorder` (+ `NoopHistoryRecorder`) em `core/history/`, adaptador `AppHistoryRecorder` em `app/history/` injetado no `main.dart` via `historyRecorderProvider.overrideWith`. `record(...)` é **best-effort** (nunca propaga erro). Os controllers de tasks/reminders/accessibility/profile/auth chamam `record(...)` após sucesso, importando só de `core/`. Contadores "Tarefas esta semana" e "Sequência (streak)" **computados on-read** a partir das conclusões (`taskCompleted`/`reminderCompleted`). Tela (`/history`, substitui o placeholder) alinhada ao Figma `15:8316`: stats cards (`FittedBox`), banner de streak dinâmico (≥3 dias), lista "Atividade Recente" agrupada por dia com `Semantics`; **Modo Básico** oculta eventos de baixa relevância (edições/exclusões/acessibilidade/perfil). Tour próprio (`TourId.history`, 3 passos) + entrada na Central. Nova collection `history/{id}` + 2 composite indexes + rule (dono) **publicados** no Firestore. Testes das 3 camadas (21 novos; suíte a passar, 0 erros de análise).
  **Evolução Lembretes (2026-07-01):** header da lista alinhado ao de Tarefas (botão ajuda "?" + botão de filtro com badge + criar) e header "Novo Lembrete" estilo "Nova Tarefa" (botão "?", hints nos campos, título máx. 30, validação client-side impedindo data/hora no passado). `ReminderCategory` passou a ter 5 valores (Medicação, Consulta, Hidratação, Alimentação, Contas e Pagamentos) exibidos em combo box na criação. Filtro exclusivo por chips substituído por `ReminderFilter` combinável (Categoria + "Hoje") com `ReminderFilterSheet` (bottom sheet) e barra de chips activos, espelhando o Módulo Tarefas. Lista ordenada por `scheduledAt` ascendente (server-side). Tour Guiado próprio da lista (`TourId.remindersList`) e da criação (`TourId.createReminder`, com oferta na 1ª utilização em Modo Básico) + entradas na Central. Sem novos composite indexes (reutiliza `idx-reminders-category-today`).
  **Ações no card (2026-07-01):** cada card ganhou **swipe bidirecional** dentro do mesmo contorno — arrastar para a **esquerda revela Excluir** (confirmação via `showSeniorConfirmDialog`) e para a **direita revela Editar**; ambos os gestos ficam **desativados quando o lembrete está concluído**. **Toque no corpo expande/recolhe** a descrição completa (respeitando `textScaler`/acessibilidade), com chevron indicador e um único card expandido por vez (`expandedReminderIdProvider`). Na **1ª abertura da sessão** o primeiro card acionável executa uma **dica animada ("peek")** que revela brevemente os dois lados. **Edição reutiliza a `CreateReminderScreen`** (novo parâmetro `initial`; rota `/reminders/:id/edit`; `UpdateReminderUseCase` + `RemindersController.update`), com título "Editar Lembrete", botão "Salvar alterações" e **sem oferta de tour**. A **data** do lembrete passa a aparecer nos cards da **lista** e da **Home**. Na Home, tocar num lembrete **limpa os filtros**, define `highlightReminderIdProvider`, navega para a aba de Lembretes e a lista faz `Scrollable.ensureVisible` + **pulso de destaque** no item; o preview continua limitado aos **3 primeiros**. Sem mudança de schema/rules (o `write` do dono já cobre `update`). Novos providers: `openReminderSwipeProvider` (id + lado), `expandedReminderIdProvider`, `highlightReminderIdProvider`, `reminderSwipeHintShownProvider`.
  **Tela de Segurança (2026-06-30 → atualizado 2026-07-09):** nova tela `/security` (`features/profile/presentation/screens/security_screen.dart`) acessível em Definições logo abaixo de "Perfil". Reúne três opções: **Habilitar biometria** (implementado 2026-07-09), **Verificar conta (e-mail)** (implementado, ADR-016) e **Alterar senha** (implementado 2026-07-09). **Biometria:** pacote `local_auth` adicionado ao `pubspec.yaml`; `BiometricRepository` (domain/abstract) + `LocalBiometricRepository` (data, usa `local_auth` + `SharedPreferences`); 4 use cases (`CheckBiometricAvailabilityUseCase`, `AuthenticateWithBiometricUseCase`, `EnableBiometricUseCase`, `DisableBiometricUseCase`); `biometric_provider.dart` com `BiometricState` + `BiometricController` (AsyncNotifier); preferência persistida localmente em `shared_preferences` (`biometric_enabled`); `SecurityScreen` com toggle real (selos Ativo/Inativo/Indisponível, loading state, toast de sucesso/erro); `LoginScreen` com botão "Entrar com biometria" condicional (visível quando `isAvailable && isEnabled`); permissões Android (`USE_BIOMETRIC`) e iOS (`NSFaceIDUsageDescription`) configuradas. **Alterar senha:** painel inline com 3 campos (`SeniorInput obscureText`) — senha atual, nova senha, confirmar nova senha; validação client-side (mínimo 6 caracteres, confirmação igual, nova ≠ atual); `reauthenticateWithCredential` + `updatePassword` via `FirebaseAuthRepository.reauthenticateAndChangePassword`; use case `ChangePasswordUseCase`; provider `changePasswordUseCaseProvider`; `AuthController.changePassword` com `AsyncValue.guard` + registo em Histórico (`HistoryActionType.passwordChanged`); aviso específico para contas Google (sem provedor de senha); erros mapeados incluindo `requires-recent-login`. Tour Guiado (`TourId.security`, 3 passos) + entrada na Central. **O alterar senha deve ser implementado também na Web** (ver backlog Web em `progress.md`).
  **Tour Guiado (ADR-013 + ADR-021, 2026-07-08):** `core/tour/` (port + widgets reutilizáveis), `features/guides/` (use cases + repos local/Firestore + `GuidesScreen`), `app/tour/app_tour_gate.dart` (composição), tutoriais integrados em todas as 16 telas. **ADR-021 concluído:** `_maybeOfferFirstUse()` adicionado a todas as telas (em Modo Básico, modal de convite na 1ª visita de cada tela); `tourSessionProvider` removido de `core/tour/tour_signal_provider.dart` (redundante face ao `isOffered` por `TourId`); em Modo Avançado, tour apenas via botão `?` ou Central de Guias. 0 erros de análise estática.
  **Já feito:** CI/CD Mobile; Design System em `core/widgets/`; `core/theme/` com tokens Figma e `AppTheme.buildDynamic`; edge-to-edge; autenticação Firebase com use cases; auth guard GoRouter; telas auth alinhadas ao Figma; estrutura Feature-First; **Módulo Acessibilidade** (dynamic theme, tela, Firestore; migrada para `SeniorScreenScaffold`); **Home/Dashboard** (header gradiente, SOS, quick actions, reminders, bottom nav 5 tabs; **Próxima Atividade** ligada a `nextPendingTaskProvider`); **Settings** (profile banner, 5 nav rows, HelpCard, logout com confirmação); **Módulo Tarefas** (`features/tasks/` domain/data/presentation; Create/List/Details/Guided; passos dinâmicos; modo guiado sequencial; celebração Lottie); **Melhorias UX Tarefas** (header `CreateTask` sem botão Guardar; `CategoryDropdown`; `dueDate` full datetime; limites de caracteres título/descrição/passo; `TaskDetails` com header genérico título+badges e data na card; botões Guided=teal, Complete=verde; `TaskCard` com badges prioridade+categoria e data formatada; ordenação por `dueDate` ascendente; `nextPendingTaskProvider`; widgets base: `SeniorInput.maxLength`, `SeniorButton.customColors`, `SeniorScreenHeader.subtitleWidget`).
  **Próximo passo (Mobile):**
- Todos os 5 gaps corrigidos e validados (2026-07-06).
- Cloud Functions: `sendDueNotifications`, `resetTaskNotified` (novo), `resetReminderNotified` deployadas.
- `resetTaskNotified` repõe `notified=false` quando `dueDate` muda ou tarefa é reactivada após conclusão.
- `prefs.tasksNotificationsEnabled` / `prefs.remindersNotificationsEnabled` verificados pelo cron antes de cada push.
- Documentação `notifications.md` actualizada com tabela de comportamento ao deletar/completar entidades (secção 3a).
- **Passos manuais necessários:** recompilar e publicar as Cloud Functions:
  ```bash
  cd memory-bank/functions && npm run build
  firebase deploy --config memory-bank/firebase.json --only functions
  ```

### CI/CD

**Status:** Mobile concluído — Web concluído
**Entregue (Mobile):** `.github/workflows/mobile.yml` — CI (`analyze` + `test`) em push/PR; CD (build APK + App Distribution) só em push na `master`.
**Entregue (Web):** `.github/workflows/web.yml` — CI (lint + type-check + build) em push/PR para `develop` e `master`; CD (Vercel `--prebuilt`) só em push para `master` após CI passar. Secrets necessários: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` + variáveis Firebase.

---

## Decisões em aberto

- (nenhuma em aberto nesta frente)

---

## Como atualizar este arquivo

Quando começar uma nova tarefa, atualize a seção da sua frente com:

- O que está sendo implementado agora
- Quaisquer bloqueios ou dependências

Quando concluir, atualize `progress.md` e limpe o foco desta seção.
