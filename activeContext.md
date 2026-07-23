# Active Context — SeniorEase

> Este arquivo é atualizado pelo dev que inicia uma nova frente de trabalho. Reflete o estado atual do time.
> Última atualização: 2026-07-23 (Tati — início da revisão geral de UX/UI web)

---

## Status geral

**Fase atual:** Mobile em preparação de entrega — TestFlight a funcionar; push iOS (APNs) validado; Google Sign-In no iPhone corrigido. Web — Storybook concluído; backlog de testes e features pendentes. Entrega: vídeo de demo + avaliação interna + repos públicos.

O memory-bank está configurado no repositório mobile. Firebase (`seniorease-backend`) está operacional. CI/CD Mobile funcional com App Distribution. Design System base implementado. Autenticação (Login, Register, Forgot Password) integrada com Firebase Auth e rotas protegidas. Telas auth alinhadas ao Figma.

**ADR-015 + ADR-016 concluídos (2026-06-30):** **Login com Google (OAuth)** e **Verificação de e-mail**. Google via `google_sign_in` v6 (`googleSignInProvider` injetado com `serverClientId` = Web Client ID); `AuthRepository.signInWithGoogle` → `signInWithCredential`; 1.º login cria `users/{uid}` com nome/foto do Google sem sobrescrever perfil existente; cancelamento tratado por `AuthCancelledException` (UI ignora); botão "Entrar com Google" só no Login (logo "G" oficial em `assets/images/google_logo.png` via novo `SeniorButton.leading`); vinculação automática por e-mail ativada no console; iOS com `CFBundleURLTypes` (`REVERSED_CLIENT_ID`). Verificação de e-mail: `AppUser.emailVerified`, `sendEmailVerification`/`reloadAndCheckEmailVerified` no repo + use cases; `AuthController.refreshEmailVerification` invalida `authStateProvider`; `SettingsNavRow.showAlert` (exclamação) na linha "Segurança" quando não verificado; `SecurityScreen` com selo verde/âmbar + painel enviar/confirmar. Testes de auth ampliados (122 testes a passar, 0 erros de análise). Biometria e alteração de senha foram concluídas posteriormente (2026-07-09).

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

**Responsável:** Henrique / Tati / Vinicius
**Status:** Em andamento — revisão geral de UX/UI na branch `fix/web-ux-ui-audit-2026`, documentada em `docs/web-ux-ui-audit-2026`.

**Concluído nesta frente (2026-07-23, Tati) — etapa 01, temas acessíveis:**

- Cores claras fixas removidas de estados de carregamento, lembretes, notificações, perfil, segurança, diálogos e componentes compartilhados.
- Fundos, textos e bordas dessas áreas passam a usar os tokens semânticos `background`, `card`, `foreground`, `muted`, `border`, `primary` e estados de feedback.
- Conteúdo sobre fundos `primary`, `secondary`, `success` e `destructive` passa a usar o respectivo token `*-foreground`, incluindo o contraste máximo, no qual o botão primário é amarelo com texto preto.
- Badges e ações de detalhes da tarefa deixam de depender de cores Tailwind/hex fixas e acompanham tema escuro, alto contraste e contraste máximo.
- Cores oficiais do logotipo do Google e a identidade escura da navegação foram preservadas intencionalmente.
- Validação da etapa: ESLint e TypeScript sem erros; suíte Vitest com 81 testes aprovada.

**Concluído nesta frente (2026-07-23, Tati) — etapa 02, fonte de design tokens:**

- `src/app/globals.css` formalizado como fonte única dos tokens da aplicação web, consumida pelo layout raiz, Tailwind, shadcn e Storybook.
- `src/app/design-tokens.css` removido por estar órfão e conter valores antigos conflitantes de tipografia, raios, cores e espaçamento.
- Wrapper global do Storybook passa a usar `bg-background` e `text-foreground`, permitindo validar componentes com os mesmos temas da aplicação; padding reduzido de 32px para 16px e removida a altura mínima de viewport para o Canvas/Docs crescer conforme o conteúdo.

**Concluído nesta frente (2026-07-23, Tati) — etapa 03, tipografia legível:**

- Textos operacionais e auxiliares abaixo de 14px removidos das telas e componentes de produção.
- Datas, descrições, contadores de caracteres, filtros, metadados, menus, badges e rótulos do dashboard passam a partir de 14px na escala padrão.
- Badges de notificação foram ampliados junto com a fonte para preservar a leitura sem cortar contagens.
- Token base de badge atualizado de 12px para 14px; multiplicadores de fonte da acessibilidade continuam aplicados normalmente.

**Concluído nesta frente (2026-07-23, Vinicius — issue #58):**

- Reforçar Modo Básico: ocultar card Status de acessibilidade e UI densa no dashboard/tarefas via `.advanced-only`
- Manter ocultações existentes (CPF, histórico filtrado, categorias de lembrete)
- Atualizar `progress.md` com a cobertura real

**Concluído nesta frente (2026-07-23, Vinicius — issue #32):**

- "Lembrar de mim" paridade mobile (e-mail + método; Modo A/B)
- Google OAuth: photoUrl, fallback redirect, callback e mensagens amigáveis
- Success Screen alinhada (sem seed automático de tarefas/lembretes no registo)

**Concluído nesta frente (2026-07-23, Tati) — etapa 04, hierarquia de títulos:**

- Hierarquia estrutural consolidada em três classes semânticas ligadas aos tokens: `page-title` (30px), `section-title` (22px) e `card-title` (18px).
- Títulos de páginas, seções, cards, formulários, filtros e estados vazios passam a seguir o mesmo papel visual em todas as áreas.
- Título do passo ativo no modo guiado mantém escala responsiva própria por ser o conteúdo focal da experiência, não um cabeçalho estrutural.
- A criação de um componente compartilhado de cabeçalho permanece reservada para a análise de componentes da etapa 05.

**Concluído nesta frente (2026-07-23, Tati) — etapa 05, componentes compartilhados:**

- `PageHeader` criado para centralizar título, descrição, ação lateral, retorno opcional e identificação dos tours.
- Primeira migração concluída nas páginas de tarefas, lembretes, perfil, histórico e acessibilidade.
- `BackNavigationButton` permanece como composição interna única para os retornos contextuais.
- Cards de Dashboard, Perfil e Histórico foram mantidos separados por terem responsabilidades e composições próprias; cards de tarefas, lembretes e notificações também não foram unificados apenas por semelhança visual.

**Concluído nesta frente (2026-07-23, Tati) — etapa 06, rota de acessibilidade:**

- Rota canônica corrigida de `/acessibility` para `/accessibility`.
- Navegação, Dashboard e catálogo de tours passam a apontar para a grafia correta.
- Rota antiga preservada apenas como redirecionamento, mantendo compatibilidade com favoritos e links existentes.
- Validação concluída com ESLint, TypeScript, teste do catálogo de tours e build das 29 rotas.

**Concluído nesta frente (2026-07-23, Tati) — etapa 07, menu móvel acessível:**

- Menu móvel migrado para o `Sheet` acessível do design system, com contenção de foco, fechamento por `Esc`, overlay e restauração do foco ao disparador.
- Painel recebe título e descrição acessíveis; navegação recebe nome semântico e o item ativo expõe `aria-current="page"`.
- Ícones decorativos foram ocultados da árvore de acessibilidade e todos os itens mantêm alvos de toque de pelo menos 48px.
- Botões de abrir, fechar e sair possuem nomes acessíveis e foco visível de alto contraste.
- Validação concluída com ESLint, TypeScript e build das 29 rotas.

**Adiado nesta frente (2026-07-23, Tati) — etapa 08, bloco de suporte:**

- Identificado que `1-800-SENIOR` não representa um canal real e também está presente na experiência mobile.
- Alteração adiada para uma implementação coordenada entre web e mobile, evitando divergência de conteúdo e comportamento entre plataformas.
- Nenhuma mudança de interface foi realizada nesta etapa.

**Concluído nesta frente (2026-07-23, Tati) — etapa 09, botões:**

- Raio padrão do componente `Button` consolidado em 14px.
- Ações compactas do Dashboard (`Adicionar tarefa`, `Carregar exemplos` e `Ajustar configurações`) passam a usar explicitamente 44px.
- Links de ação `Iniciar/Continuar`, `Ver todas as tarefas` e `Gerenciar lembretes` passam a compor o `Button`, removendo estilos paralelos.
- Ações de edição do Perfil e ícones de editar/excluir lembrete passam a respeitar o alvo mínimo de 44px e o raio compartilhado.
- Botões principais de formulários e diálogos permanecem em 56px; modo guiado mantém dimensões maiores por ser uma experiência focal.
- Validação concluída com ESLint, TypeScript, testes do Dashboard e build das 29 rotas.

**Concluído nesta frente (2026-07-22, Tati):**

- Toasts passam por uma única porta de feedback: sucesso 3s, informação/aviso 4s e erro 5s; posição responsiva e ausência de botão Close mantidas no Toaster global
- Sucesso visual não é duplicado quando a ação já apresenta modal informativo ou celebração Lottie
- `Button` suporta `loading`/`loadingText`, desabilita novos cliques, expõe `aria-busy`/`aria-disabled` e preserva os alvos de toque do design system
- Estados de loading aplicados aos fluxos assíncronos principais de autenticação, tarefas, lembretes, perfil, segurança, preferências e acessibilidade; Storybook documenta o novo estado
- Feedback de criação/exclusão de tarefas é transportado até `/tasks` e exibido somente após a listagem montar, evitando perda do toast durante o redirecionamento
- Auditoria validada com lint, type-check, build e 81 testes (incluindo durações fixas e feedback após navegação)
- Contador “Concluídas hoje” passa a usar `status === completed` e `completedAt` no dia civil atual, sem depender de `dueDate`
- Regra isolada em helper testável, cobrindo tarefas concluídas em dia diferente do agendamento

**Concluído nesta frente (2026-07-21, Tati):**

- Lista de tarefas ordenada por `dueDate` descendente (tarefas sem data no fim)
- Cards da listagem exibem hora + dia (`Hoje`, `Amanhã` ou `dd/mm`), seguindo o Dashboard; modal de filtros com padding simétrico
- Detalhes sem horário no card de notificação e sem card redundante de notas
- Web alinhada ao contrato mobile: `steps` como **campo array** no documento `tasks/{taskId}` (ADR-023); sub-collection marcada como legado
- Conclusão disponível após a data da tarefa e também quando não houver passos; modal informativo fora do modo guiado
- Item Acessibilidade na navegação global e toasts nos fluxos de tarefas sem modal

**Concluído nesta frente (2026-07-21, Henrique):**

- **Lembretes lista (PR #50):** chips exclusivos Hoje / Medicação / Consultas (paridade mobile); default Hoje; `scheduledAt` ASC; remove modal combinável
- **Dashboard previews:** “Próxima atividade” (1 pendente ASC) + “Lembretes de hoje” (dia civil ASC, inclui concluídos); hora 24h
- **Polish tours/UX (PR #48/#49):** `TourHelpButton` padronizado; Voltar/Sair hover-only; toasts sem Close; tour Acessibilidade no stack partilhado; Guia “Dashboard”; favicon SE; tour Endereço removido do catálogo
- **Lote anterior (PRs #38–#44):** Guia `/guides`, infra de tour, tours nas telas, shell UX

**Concluído anteriormente (Henrique):**

- **Módulo Perfil (PR #19):** tela `/profile` alinhada ao Figma `15:5798`, tour guiado, segurança unificada, upload de foto
- **Central de Lembretes (PR #12):** interface completa de gerenciamento de lembretes na web
- **Modo Guiado Figma `15:4931` (PR #14):** sidebar, hub `/tasks/guided`, lógica sequencial, responsividade, saída para `/tasks`
- **FCM Web + Sino de Notificações:** Service Worker configurável via env pública, VAPID, token em `users/{uid}/fcmTokens/{token}`, `/notifications` com histórico Firestore e badge do dia
- **Preferências de Notificação Web:** `/profile/notifications/edit` com toggles e antecedência (`15m`, `30m`, `1h`, `6h`, `1d`) — campos ADR-020
- **Dashboard Figma `134-851`:** sininho, badges, quick actions, card de acessibilidade, seed demo

**Próximo nesta frente:** entrega hackathon (vídeo, repos públicos) + validação final; lista `/tasks` deve usar `orderBy(dueDate, 'desc')` (contrato ADR-011 atualizado) + ampliar testes unitários.

**Próximos passos prioritários (segunda fase / time):**

1. Testes unitários — ampliar vitest para Domain, Data e Presentation
2. Ativar bucket Firebase Storage + publicar `storage.rules` (David)
3. Credenciais FCM/VAPID de produção no ambiente web
4. Avaliação interna + vídeo de demo + repos públicos

### Mobile (seniorease-mobile)

**Responsável:** David
**Status:** Entrega iOS em curso (2026-07-15) — TestFlight + correções nativas iOS.
**Feito nesta sessão (2026-07-22):**

- **Lista de tarefas — `dueDate` DESC server-side:** `watchTasksFiltered` usa `orderBy('dueDate', descending: true)` (sem sort em memória); índices compostos DESC em `firestore.indexes.json` — **publicar**; ADR-011 + `firebaseSchema` atualizados para paridade Web.
- **ADR-023 — `steps` como array:** mobile deixa de usar a sub-collection `tasks/{taskId}/steps` e passa a ler/gravar o campo `steps` no documento da tarefa (paridade com a web). Create/update/complete/delete no novo modelo; `TaskStep` com `taskId`; `order` 0-indexed; schema + ADR + rules (legado) atualizados.
- **Ordenação de lembretes:** lista e preview Home passam a `scheduledAt` **DESC** (data/hora maior primeiro; mais antigos por último). Preview "Próximos Lembretes" mostra até 3 ativos (exclui concluídos), mesma ordenação da lista. Novo índice `idx-reminders-category-desc`; `idx-reminders-list-desc` volta a ser necessário — **publicar** `firestore.indexes.json`.
- **Excluir concluídos:** lembretes concluídos voltam a permitir swipe de **Excluir** (Editar continua bloqueado).

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
  **Evolução Lembretes (2026-07-01 → 2026-07-22):** header da lista alinhado ao de Tarefas (botão ajuda "?" + botão de filtro com badge + criar) e header "Novo Lembrete" estilo "Nova Tarefa" (botão "?", hints nos campos, título máx. 30, validação client-side impedindo data/hora no passado). `ReminderCategory` passou a ter 5 valores (Medicação, Consulta, Hidratação, Alimentação, Contas e Pagamentos) exibidos em combo box na criação. Filtro exclusivo por chips substituído por `ReminderFilter` combinável (Categoria + "Hoje") com `ReminderFilterSheet` (bottom sheet) e barra de chips activos, espelhando o Módulo Tarefas. Lista ordenada por `scheduledAt` **descendente** (server-side; 2026-07-22). Tour Guiado próprio da lista (`TourId.remindersList`) e da criação (`TourId.createReminder`, com oferta na 1ª utilização em Modo Básico) + entradas na Central. Índices: `idx-reminders-list-desc` + `idx-reminders-category-desc`.
  **Ações no card (2026-07-01):** cada card ganhou **swipe bidirecional** dentro do mesmo contorno — arrastar para a **esquerda revela Excluir** (confirmação via `showSeniorConfirmDialog`) e para a **direita revela Editar**; concluídos só permitem **Excluir** (Editar continua bloqueado). **Toque no corpo expande/recolhe** a descrição completa (respeitando `textScaler`/acessibilidade), com chevron indicador e um único card expandido por vez (`expandedReminderIdProvider`). Na **1ª abertura da sessão** o primeiro card acionável executa uma **dica animada ("peek")** que revela brevemente os dois lados. **Edição reutiliza a `CreateReminderScreen`** (novo parâmetro `initial`; rota `/reminders/:id/edit`; `UpdateReminderUseCase` + `RemindersController.update`), com título "Editar Lembrete", botão "Salvar alterações" e **sem oferta de tour**. A **data** do lembrete passa a aparecer nos cards da **lista** e da **Home**. Na Home, tocar num lembrete **limpa os filtros**, define `highlightReminderIdProvider`, navega para a aba de Lembretes e a lista faz `Scrollable.ensureVisible` + **pulso de destaque** no item; o preview continua limitado aos **3 primeiros**. Sem mudança de schema/rules (o `write` do dono já cobre `update`). Novos providers: `openReminderSwipeProvider` (id + lado), `expandedReminderIdProvider`, `highlightReminderIdProvider`, `reminderSwipeHintShownProvider`.
  **Tela de Segurança (2026-06-30 → atualizado 2026-07-09):** nova tela `/security` (`features/profile/presentation/screens/security_screen.dart`) acessível em Definições logo abaixo de "Perfil". Reúne três opções: **Habilitar biometria** (implementado 2026-07-09), **Verificar conta (e-mail)** (implementado, ADR-016) e **Alterar senha** (implementado 2026-07-09). **Biometria:** pacote `local_auth` adicionado ao `pubspec.yaml`; `BiometricRepository` (domain/abstract) + `LocalBiometricRepository` (data, usa `local_auth` + `SharedPreferences`); 4 use cases (`CheckBiometricAvailabilityUseCase`, `AuthenticateWithBiometricUseCase`, `EnableBiometricUseCase`, `DisableBiometricUseCase`); `biometric_provider.dart` com `BiometricState` + `BiometricController` (AsyncNotifier); preferência persistida localmente em `shared_preferences` (`biometric_enabled`); `SecurityScreen` com toggle real (selos Ativo/Inativo/Indisponível, loading state, toast de sucesso/erro); `LoginScreen` com botão "Entrar com biometria" condicional (visível quando `isAvailable && isEnabled`); permissões Android (`USE_BIOMETRIC`) e iOS (`NSFaceIDUsageDescription`) configuradas. **Alterar senha:** painel inline com 3 campos (`SeniorInput obscureText`) — senha atual, nova senha, confirmar nova senha; validação client-side (mínimo 6 caracteres, confirmação igual, nova ≠ atual); `reauthenticateWithCredential` + `updatePassword` via `FirebaseAuthRepository.reauthenticateAndChangePassword`; use case `ChangePasswordUseCase`; provider `changePasswordUseCaseProvider`; `AuthController.changePassword` com `AsyncValue.guard` + registo em Histórico (`HistoryActionType.passwordChanged`); aviso específico para contas Google (sem provedor de senha); erros mapeados incluindo `requires-recent-login`. Tour Guiado (`TourId.security`, 3 passos) + entrada na Central. A alteração de senha também está integrada na Web via `ChangePasswordUseCase` e tela `/profile/security`.
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
