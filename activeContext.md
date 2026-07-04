# Active Context — SeniorEase

> Este arquivo é atualizado pelo dev que inicia uma nova frente de trabalho. Reflete o estado atual do time.
> Última atualização: 2026-07-03 (Módulo Histórico concluído no mobile — ADR-017: feature `history` em Clean Architecture, port `HistoryRecorder` em `core/` + adaptador em `app/`, collection `history` com rules/indexes publicados, contadores semana/streak on-read, tela alinhada ao Figma com acessibilidade e Tour; próximo: pendências na Segurança — biometria e alterar senha)

---

## Status geral

**Fase atual:** Features — Módulo Histórico concluído (tela Figma + eventos Firestore + contadores on-read); próximo: pendências na Segurança (biometria e alterar senha)

O memory-bank está configurado no repositório mobile. Firebase (`seniorease-backend`) está operacional. CI/CD Mobile funcional com App Distribution. Design System base implementado. Autenticação (Login, Register, Forgot Password) integrada com Firebase Auth e rotas protegidas. Telas auth alinhadas ao Figma.

**ADR-015 + ADR-016 concluídos (2026-06-30):** **Login com Google (OAuth)** e **Verificação de e-mail**. Google via `google_sign_in` v6 (`googleSignInProvider` injetado com `serverClientId` = Web Client ID); `AuthRepository.signInWithGoogle` → `signInWithCredential`; 1.º login cria `users/{uid}` com nome/foto do Google sem sobrescrever perfil existente; cancelamento tratado por `AuthCancelledException` (UI ignora); botão "Entrar com Google" só no Login (logo "G" oficial em `assets/images/google_logo.png` via novo `SeniorButton.leading`); vinculação automática por e-mail ativada no console; iOS com `CFBundleURLTypes` (`REVERSED_CLIENT_ID`). Verificação de e-mail: `AppUser.emailVerified`, `sendEmailVerification`/`reloadAndCheckEmailVerified` no repo + use cases; `AuthController.refreshEmailVerification` invalida `authStateProvider`; `SettingsNavRow.showAlert` (exclamação) na linha "Segurança" quando não verificado; `SecurityScreen` com selo verde/âmbar + painel enviar/confirmar. Testes de auth ampliados (122 testes a passar, 0 erros de análise). **Pendente na Segurança:** biometria e alterar senha.

**ADR-014 concluído (2026-06-30):** Módulo Perfil (`features/profile/`) com Clean Architecture — `UserProfile`/`Address`, `ProfileRepository` (estende `users/{userId}` via merge) e `ProfilePhotoStorage` (Firebase Storage `profile_photos/{userId}`), use cases e providers injetados. `ProfileScreen` (`/profile`) exibe foto/nome/email/telefone e edita Informações Pessoais (nome 30, e-mail só-leitura, data de nascimento/telefone/CPF mascarados) e Endereço (bairro/rua/número/CEP/cidade/estado/país); foto via `image_picker` (galeria/câmara) com upload imediato. CPF (opcional) oculto em Modo Básico. Tour Guiado da tela (`TourId.profile`, 3 passos) + oferta na 1ª utilização (Modo Básico) + entrada na Central. `SeniorInput` ganhou `inputFormatters`/`readOnly`; máscaras em `core/utils/input_masks.dart`. "Informação Pessoal" renomeado para "Perfil" nas Definições. **Pendente:** ativar o bucket Storage no console e publicar `storage.rules`.

**Refactor ADR-008 concluído:** projeto migrado para Feature-First + Clean Architecture. **ADR-009 concluído:** Dynamic Theme Engine (`AppTheme.buildDynamic`) + Módulo Acessibilidade implementado. **ADR-010 concluído:** schema `tasks` estendido (priority, category, reminderTime) e Módulo Tarefas mobile implementado com passos dinâmicos, modo guiado sequencial inteligente e celebração Lottie. **ADR-011 concluído:** ordenação de tarefas por `dueDate` ascendente + `nextPendingTaskProvider`. **Melhorias UX 2026-06-25 (1ª vaga):** limites de caracteres; TaskDetails com header genérico; TaskCard com badges; Home com Próxima Atividade dinâmica. **ADR-012 concluído (2026-06-25):** Filtros na Task List com queries Firestore (category, priority, isToday), bottom sheet `TaskFilterSheet`, barra de chips activos, pull-to-refresh com reset de filtros. **ADR-013 concluído (2026-06-29):** Sistema de Tour Guiado com `showcaseview` — infra genérica em `core/tour/` (port `TourGate`, `SeniorShowcase`, mixin `TourHost`, sinais), feature `guides` (persistência híbrida: `shared_preferences` local + collection Firestore `onboarding/{userId}`), adaptador `AppTourGate` na camada `app/` (injetado via `ProviderScope`), tutoriais em Home/Criar Tarefa/Lista de Tarefas, Central "Guias do aplicativo" em Definições. Inversão de dependência respeita Feature-First (nenhuma feature importa outra). 0 erros de análise estática.

---

## Foco atual por frente

### Firebase / Infra
**Responsável:** David (Tech Lead)
**Status:** Concluído
**Entregue:** Projeto `seniorease-backend`, Auth Email/Password, Firestore com regras publicadas, FCM V1, apps Web/Android/iOS (`com.seniorease.mobile`), `.env.local` partilhado com o time.
**Pendente (não bloqueante):** Configuração APNs para push notifications no iOS.

### Web (seniorease-web)
**Status:** Pronto para Etapa 2 — setup do projeto
**Backlog alinhado (2026-06-30):** o `progress.md` da Web foi atualizado em paridade com o mobile — Acessibilidade (Dark Mode, Botões Maiores, Feedback de Áudio e Tátil), Tarefas (filtros, ordenação por `dueDate`, card "Próxima Atividade", refetch/reset), Perfil (tela "Sobre", edição de dados + endereço, máscaras, CPF oculto em Modo Básico, upload de foto para Storage), **Segurança** (hub nas Definições com verificar e-mail e alterar senha + tour; biometria é exclusiva do mobile, não se aplica à Web) e Tour Guiado (tutoriais por tela: Acessibilidade, Definições, Sobre, Perfil, Segurança e Central). Tudo usando a **mesma base Firebase** (collections/Storage/regras já criados), com **bibliotecas próprias da web** (Zustand, libs React de máscara/tour/etc.) em vez das do mobile. Ver Figma `node 134-851` para o Dashboard.
**Próximo passo:**
1. Adicionar memory-bank como submódulo (`git submodule add`)
2. Copiar `.cursor/rules/memory-bank.mdc` para `.cursor/rules/`
3. Configurar projeto Next.js 14 com estrutura Clean Architecture definida em `systemPatterns.md`
4. Implementar autenticação (Login, Register, Forgot Password)

### Mobile (seniorease-mobile)
**Responsável:** David
**Status:** Módulo Histórico concluído — próximo: pendências na Segurança (biometria e alterar senha)
**Módulo Histórico (2026-07-03, ADR-017):** feature `history` (`features/history/`) em Clean Architecture — `HistoryEvent`/`HistoryStats`, `HistoryRepository` (`log`/`watchRecent`/`fetchCompletions`) + `FirebaseHistoryRepository`, use cases (`LogHistoryEvent`, `GetHistory`, `GetHistoryStats` com função pura `computeStats`). O registo cross-feature usa o **padrão Port/Adapter** (igual ao Tour): enum `HistoryActionType` + port `HistoryRecorder` (+ `NoopHistoryRecorder`) em `core/history/`, adaptador `AppHistoryRecorder` em `app/history/` injetado no `main.dart` via `historyRecorderProvider.overrideWith`. `record(...)` é **best-effort** (nunca propaga erro). Os controllers de tasks/reminders/accessibility/profile/auth chamam `record(...)` após sucesso, importando só de `core/`. Contadores "Tarefas esta semana" e "Sequência (streak)" **computados on-read** a partir das conclusões (`taskCompleted`/`reminderCompleted`). Tela (`/history`, substitui o placeholder) alinhada ao Figma `15:8316`: stats cards (`FittedBox`), banner de streak dinâmico (≥3 dias), lista "Atividade Recente" agrupada por dia com `Semantics`; **Modo Básico** oculta eventos de baixa relevância (edições/exclusões/acessibilidade/perfil). Tour próprio (`TourId.history`, 3 passos) + entrada na Central. Nova collection `history/{id}` + 2 composite indexes + rule (dono) **publicados** no Firestore. Testes das 3 camadas (21 novos; suíte a passar, 0 erros de análise).
**Evolução Lembretes (2026-07-01):** header da lista alinhado ao de Tarefas (botão ajuda "?" + botão de filtro com badge + criar) e header "Novo Lembrete" estilo "Nova Tarefa" (botão "?", hints nos campos, título máx. 30, validação client-side impedindo data/hora no passado). `ReminderCategory` passou a ter 5 valores (Medicação, Consulta, Hidratação, Alimentação, Contas e Pagamentos) exibidos em combo box na criação. Filtro exclusivo por chips substituído por `ReminderFilter` combinável (Categoria + "Hoje") com `ReminderFilterSheet` (bottom sheet) e barra de chips activos, espelhando o Módulo Tarefas. Lista ordenada por `scheduledAt` ascendente (server-side). Tour Guiado próprio da lista (`TourId.remindersList`) e da criação (`TourId.createReminder`, com oferta na 1ª utilização em Modo Básico) + entradas na Central. Sem novos composite indexes (reutiliza `idx-reminders-category-today`).
**Ações no card (2026-07-01):** cada card ganhou **swipe bidirecional** dentro do mesmo contorno — arrastar para a **esquerda revela Excluir** (confirmação via `showSeniorConfirmDialog`) e para a **direita revela Editar**; ambos os gestos ficam **desativados quando o lembrete está concluído**. **Toque no corpo expande/recolhe** a descrição completa (respeitando `textScaler`/acessibilidade), com chevron indicador e um único card expandido por vez (`expandedReminderIdProvider`). Na **1ª abertura da sessão** o primeiro card acionável executa uma **dica animada ("peek")** que revela brevemente os dois lados. **Edição reutiliza a `CreateReminderScreen`** (novo parâmetro `initial`; rota `/reminders/:id/edit`; `UpdateReminderUseCase` + `RemindersController.update`), com título "Editar Lembrete", botão "Salvar alterações" e **sem oferta de tour**. A **data** do lembrete passa a aparecer nos cards da **lista** e da **Home**. Na Home, tocar num lembrete **limpa os filtros**, define `highlightReminderIdProvider`, navega para a aba de Lembretes e a lista faz `Scrollable.ensureVisible` + **pulso de destaque** no item; o preview continua limitado aos **3 primeiros**. Sem mudança de schema/rules (o `write` do dono já cobre `update`). Novos providers: `openReminderSwipeProvider` (id + lado), `expandedReminderIdProvider`, `highlightReminderIdProvider`, `reminderSwipeHintShownProvider`.
**Tela de Segurança (2026-06-30):** nova tela `/security` (`features/profile/presentation/screens/security_screen.dart`) acessível em Definições logo abaixo de "Perfil" (`Icons.security_outlined`). Reúne três opções ainda **não implementadas**, visíveis com selo "Em breve" e toast ao toque: **Habilitar biometria**, **Verificar conta (e-mail)** e **Alterar senha**. Inclui Tour Guiado próprio (`TourId.security`, 3 passos) com botão de ajuda e entrada na Central "Guias do aplicativo". **A mesma feature deve ser implementada na Web, exceto a biometria (exclusiva do mobile)** (ver backlog Web em `progress.md`).
**Tour Guiado (ADR-013):** `core/tour/` (port + widgets reutilizáveis), `features/guides/` (use cases + repos local/Firestore + `GuidesScreen`), `app/tour/app_tour_gate.dart` (composição), tutoriais integrados em Home, Criar Tarefa e Lista de Tarefas, entrada "Guias do aplicativo" em Definições. Requer publicar a rule da collection `onboarding` (ver `firebaseSchema.md`).
**Já feito:** CI/CD Mobile; Design System em `core/widgets/`; `core/theme/` com tokens Figma e `AppTheme.buildDynamic`; edge-to-edge; autenticação Firebase com use cases; auth guard GoRouter; telas auth alinhadas ao Figma; estrutura Feature-First; **Módulo Acessibilidade** (dynamic theme, tela, Firestore; migrada para `SeniorScreenScaffold`); **Home/Dashboard** (header gradiente, SOS, quick actions, reminders, bottom nav 5 tabs; **Próxima Atividade** ligada a `nextPendingTaskProvider`); **Settings** (profile banner, 5 nav rows, HelpCard, logout com confirmação); **Módulo Tarefas** (`features/tasks/` domain/data/presentation; Create/List/Details/Guided; passos dinâmicos; modo guiado sequencial; celebração Lottie); **Melhorias UX Tarefas** (header `CreateTask` sem botão Guardar; `CategoryDropdown`; `dueDate` full datetime; limites de caracteres título/descrição/passo; `TaskDetails` com header genérico título+badges e data na card; botões Guided=teal, Complete=verde; `TaskCard` com badges prioridade+categoria e data formatada; ordenação por `dueDate` ascendente; `nextPendingTaskProvider`; widgets base: `SeniorInput.maxLength`, `SeniorButton.customColors`, `SeniorScreenHeader.subtitleWidget`).
**Próximo passo:** Pendências na Segurança (biometria e alterar senha)

### CI/CD
**Status:** Mobile concluído — Web concluído
**Entregue (Mobile):** `.github/workflows/mobile.yml` — CI (`analyze` + `test`) em push/PR; CD (build APK + App Distribution) só em push na `master`.
**Entregue (Web):** `.github/workflows/web.yml` — CI (lint + type-check + build) em push/PR para `develop` e `master`; CD (Vercel `--prebuilt`) só em push para `master` após CI passar. Secrets necessários: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` + variáveis Firebase.

---

## Decisões em aberto

Nenhuma decisão pendente no momento. Todas as decisões arquiteturais estão documentadas em `decisions.md`.

---

## Como atualizar este arquivo

Quando começar uma nova tarefa, atualize a seção da sua frente com:
- O que está sendo implementado agora
- Quaisquer bloqueios ou dependências

Quando concluir, atualize `progress.md` e limpe o foco desta seção.
