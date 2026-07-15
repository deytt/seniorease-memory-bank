# Decisions — SeniorEase (ADR Log)

Registro de decisões arquiteturais (Architecture Decision Records). Cada ADR documenta o contexto, a decisão tomada e o motivo. Novas decisões devem ser adicionadas aqui antes de serem implementadas.

---

## ADR-001 — Memory Bank como submódulo Git

**Data:** 2026-06-17
**Status:** Aceito

**Contexto:**
O time tem 5 desenvolvedores trabalhando em paralelo em dois repositórios distintos (Web e Mobile). Precisamos de uma fonte da verdade compartilhada para requisitos, arquitetura e progresso.

**Decisão:**
Criar um repositório separado (`seniorease-memory-bank`) e adicioná-lo como submódulo Git em `seniorease-web` e `seniorease-mobile` na pasta `memory-bank/`.

**Motivo:**
- Submódulo permite que cada projeto tenha o memory-bank versionado junto ao seu código
- Um único lugar para atualizar, refletido em todos os projetos via `git submodule update --remote`
- A Cursor Rule garante que agentes leiam o contexto antes de qualquer tarefa

**Alternativas consideradas:**
- README com link (descartado: não é versionado junto ao código, agentes não leem automaticamente)
- Monorepo (descartado: Flutter e Next.js têm ecossistemas incompatíveis em monorepo JS)

---

## ADR-002 — Flutter para Mobile (não React Native)

**Data:** 2026-06-17
**Status:** Aceito

**Contexto:**
O time precisa desenvolver um app mobile para iOS e Android. As opções principais são Flutter (Dart) e React Native (JavaScript/TypeScript).

**Decisão:**
Usar **Flutter** com Dart.

**Motivo:**
- A equipe já tem experiência prévia com Flutter (Fases 3 e 4 da pós-graduação foram feitas em Flutter)
- Flutter oferece melhor controle sobre acessibilidade (Semantics widget, ThemeData dinâmico)
- Performance nativa via compilação AOT
- `lottie` package maduro e bem documentado

**Alternativas consideradas:**
- React Native + Expo (descartado: compartilharia TypeScript com o Web, mas o time tem mais produtividade em Flutter)

---

## ADR-003 — Next.js 14+ App Router para Web (não React puro ou Angular)

**Data:** 2026-06-17
**Status:** Aceito

**Contexto:**
O Hackathon aceita React, Angular ou Next.js. O time precisa escolher a stack web.

**Decisão:**
Usar **Next.js 14+ com App Router**.

**Motivo:**
- Requisito de SSR/SSG mencionado explicitamente nas fases anteriores
- App Router oferece Server Components, layouts aninhados e melhor performance
- Deploy nativo na Vercel sem configuração adicional
- TypeScript como primeira classe

**Alternativas consideradas:**
- React puro com Vite (descartado: sem SSR nativo)
- Angular (descartado: curva de aprendizado e o time tem mais familiaridade com React)

---

## ADR-004 — Firebase como backend compartilhado

**Data:** 2026-06-17
**Status:** Aceito

**Contexto:**
O projeto precisa de autenticação, banco de dados e notificações push. A equipe de backend não está disponível — o time de frontend precisa ser autossuficiente.

**Decisão:**
Usar **Firebase** (Auth + Firestore + Cloud Messaging) como backend compartilhado entre Web e Mobile.

**Motivo:**
- SDK disponível para Next.js e Flutter
- Firestore com realtime sync simplifica o estado distribuído
- Firebase Auth resolve autenticação sem infraestrutura própria
- Cloud Messaging para push notifications de lembretes
- Fases anteriores da pós-graduação já usaram Firebase (familiaridade do time)

**Alternativas consideradas:**
- Supabase (descartado: menos familiar ao time)
- Backend próprio (descartado: sem recurso de dev backend disponível)

---

## ADR-005 — Clean Architecture em ambas as plataformas

**Data:** 2026-06-17
**Status:** Aceito

**Contexto:**
O Hackathon exige explicitamente Clean Architecture com camada de domínio isolada, casos de uso independentes de UI e adaptadores bem definidos.

**Decisão:**
Aplicar **Clean Architecture** com 3 camadas (Domain, Infrastructure, Presentation) em ambas as plataformas, conforme definido em `systemPatterns.md`.

**Motivo:**
- Requisito obrigatório do Hackathon
- Facilita testes unitários dos casos de uso (sem dependência de Firebase ou UI)
- Permite trocar a implementação de infraestrutura sem afetar o domínio
- Cada módulo (auth, tasks, accessibility, reminders, profile) é independente

**Regra de ouro:**
A camada Domain nunca importa de Infrastructure ou Presentation. Dependências sempre apontam para dentro.

---

## ADR-006 — Interface Mode (Basic/Advanced) substitui toggle de Extra Confirmation

**Data:** 2026-06-17
**Status:** Aceito

**Contexto:**
O Hackathon requer tanto "Modo básico / avançado" quanto "Confirmação adicional antes de ações críticas". A tela de Accessibility Center ficaria sobrecarregada com ambos os toggles.

**Decisão:**
- A **confirmação adicional** é um comportamento **sempre ativo** no app — não é configurável pelo usuário
- O toggle na tela de Accessibility Center é apenas o **Interface Mode (Básico / Avançado)**
- Modo Básico implica semanticamente mais cautela e proteção, o que é consistente com confirmações sempre ativas

**Motivo:**
- UX mais limpa: menos opções na tela de configurações
- Semânticamente correto: um usuário em Modo Básico espera proteção total, incluindo confirmações
- Ambos os requisitos do Hackathon são cobertos: o modo existe e as confirmações são sempre ativas

---

## ADR-007 — Lottie para animação de celebração ao concluir tarefas

**Data:** 2026-06-17
**Status:** Aceito

**Contexto:**
O Hackathon requer "avisos de conclusão com feedback positivo" ao completar tarefas. O requisito de acessibilidade menciona "animações suaves e controláveis".

**Decisão:**
Usar **animações Lottie** (arquivos `.json` do LottieFiles) para a celebração ao concluir uma tarefa no modo guiado.

**Motivo:**
- Lottie está disponível para Flutter (`lottie` package) e Next.js/React (`lottie-react`)
- Animações são leves, controladas via código (duração, loop, pausa)
- Satisfaz o requisito de "animações suaves e controláveis" — a animação pode ser desativada para usuários que preferirem
- Impacto emocional positivo reforça a confiança do usuário idoso ("Parabéns! Você completou esta tarefa!")

**Implementação:**
- Arquivo Lottie: buscar em [LottieFiles.com](https://lottiefiles.com) tema "celebração / confetti / success"
- Exibir em modal ou overlay por 2-3 segundos ao clicar em "Concluir tarefa"
- Permitir fechar manualmente (acessibilidade)

---

## ADR-008 — Feature-First com Clean Architecture (Mobile)

**Data:** 2026-06-22
**Status:** Aceito

**Contexto:**
A estrutura inicial do projeto mobile seguia um modelo layer-first global (`domain/`, `infrastructure/`, `presentation/` na raiz de `lib/`). À medida que novas features (accessibility, tasks, reminders, profile) eram adicionadas, ficou claro que este modelo obrigaria o dev a navegar por 4 pastas raiz diferentes para trabalhar numa única feature, tornando o projeto difícil de manter e escalar.

Adicionalmente, os use cases estavam todos vazios — a camada de apresentação chamava os repositórios diretamente, bypassando a camada de domínio e violando a Clean Architecture.

**Decisão:**
Reorganizar `lib/` para **Feature-First com Clean Architecture** em cada feature:

```
lib/
├── app/          ← bootstrap, MaterialApp, GoRouter
├── core/         ← partilhado por TODAS as features (sem lógica de negócio)
│   ├── theme/    ← AppColors, AppSpacing, AppTheme, SeniorSystemUi
│   ├── widgets/  ← Design System (SeniorButton, SeniorInput, etc.)
│   └── firebase/ ← firebase_options.dart
└── features/
    ├── auth/
    │   ├── domain/        ← entities/, repositories/, usecases/
    │   ├── data/          ← implementações Firebase
    │   └── presentation/  ← providers/, screens/
    ├── home/
    ├── accessibility/
    ├── tasks/
    ├── reminders/
    └── profile/
```

Cada feature tem as suas próprias sub-camadas domain/data/presentation. A Clean Architecture é preservada dentro de cada feature: domain não importa data nem presentation.

Os use cases foram criados de facto (`SignInUseCase`, `SignUpUseCase`, `SignOutUseCase`, `SendPasswordResetUseCase`) e o `AuthController` passou a chamar os use cases em vez de chamar o repositório diretamente.

**Motivo:**
- Trabalhar numa feature requer acesso a uma única pasta (`features/X/`) em vez de 4 pastas raiz
- Use cases reais garantem que a lógica de negócio está na camada correta (domain)
- `core/` separa claramente código partilhado de código de feature
- Escala bem com 5+ features sem perder coesão
- Padrão adotado por Very Good Ventures, Felix Angelov (Bloc) e Andrea Bizzotto (Riverpod)

**Regra de ouro (inviolável):**
- `features/X/domain/` **nunca** importa de `features/X/data/` nem de `features/X/presentation/`
- Uma feature **nunca** importa diretamente de outra feature — comunicação via providers partilhados ou parâmetros
- `core/` **nunca** importa de `features/` — é sempre o contrário

**Alternativas consideradas:**
- Manter layer-first global (descartado: não escala, dificulta navegação)
- Monorepo por packages Dart (descartado: overhead desnecessário para um hackathon)

---

## ADR-009 — Dynamic Theme Engine + Módulo Acessibilidade (Mobile)

**Data:** 2026-06-22
**Status:** Aceito

**Contexto:**
O `AppTheme.light` era estático. A tela de Acessibilidade do Figma (`node 15:9085`) requer que tamanho de letra, modo escuro, contraste e tamanho dos touch targets sejam configurados pelo utilizador e reflitam imediatamente em toda a app. O schema original do Firestore (`preferences`) não tinha `darkMode` nem `largeTouchTargets`, e usava `visualFeedbackEnabled` em vez de `audioFeedbackEnabled`.

**Decisão:**
1. Criar `AppTheme.buildDynamic(UserPreferences)` que produz um `ThemeData` com escala tipográfica correta do Figma (Display 48px → Caption 12px), multiplicada pelo factor de `FontSizeScale` do utilizador.
2. Atualizar `app.dart` para observar `preferencesProvider` e passar o tema dinâmico ao `MaterialApp.router`.
3. Atualizar schema Firestore `preferences/{userId}`: adicionar `darkMode: boolean`, `largeTouchTargets: boolean`, substituir `visualFeedbackEnabled` por `audioFeedbackEnabled`.
4. O `ContrastMode.maximum` é **derivado automaticamente** pelo `SavePreferencesUseCase` quando `darkMode == true && contrast == high` — nunca exposto como opção separada na UI.

**Motivo:**
- `buildDynamic()` centraliza toda a lógica de tema num único ponto, evitando duplicação e garantindo consistência WCAG em todos os ecrãs.
- Observar `preferencesProvider` em `app.dart` faz com que a mudança de tema seja instantânea sem reiniciar a app.
- Derivar `maximum` automaticamente simplifica a UX (dois toggles em vez de três opções de contraste).

**Alternativas consideradas:**
- `MediaQuery.textScaleFactor` — descartado porque é global do sistema e não dá controlo fine-grained por feature.
- `ThemeExtension` para spacing — mantido como work-in-progress; o campo `spacing` existe no Firestore mas o toggle não está exposto na UI por ora (implementar na iteração de Spacing avançado).
- Três modos de contraste como segmented control — descartado em favor de dois toggles (Dark Mode + High Contrast) para não sobrecarregar a UX do público sénior.

**Impacto cross-projeto:**
A collection `preferences` é partilhada com `seniorease-web`. A Web deve implementar os mesmos toggles (Dark Mode, High Contrast, Botões Maiores/`largeTouchTargets`, Feedback de Áudio e Tátil/`audioFeedbackEnabled`) e a mesma derivação de `contrast: 'maximum'` no `SavePreferencesUseCase`, adaptando o tema dinâmico a CSS custom properties / theme context (não `ThemeData`).

**Regras imutáveis:**
- `AppTheme.buildDynamic()` é o único ponto de construção de `ThemeData` em produção.
- `AppTheme.light` e `AppTheme.dark` existem apenas como base interna; nunca passados directamente ao `MaterialApp`.
- `UserPreferences.defaults()` é sempre retornado quando não há utilizador autenticado ou Firestore indisponível.

---

## ADR-010 — Extensão do schema `tasks` (priority, category, reminderTime)

**Data:** 2026-06-24
**Status:** Aceito

**Contexto:**
Os designs do Módulo Tarefas no Figma (Create Task `15:7612`, Task List `15:7134`, Task Details `15:7401`) exigem que cada tarefa tenha um nível de prioridade (exibido como "high"/"medium" na lista e "High Priority" nos detalhes), uma categoria (chips: Medication, Health, Exercise, Social, Personal) e um horário de lembrete (ex: "8:00 AM"). O schema original da collection `tasks` não previa nenhum destes três campos.

**Decisão:**
Estender a collection partilhada `tasks/{taskId}` com três campos:
- `priority: 'low' | 'medium' | 'high'`
- `category: 'medication' | 'health' | 'exercise' | 'social' | 'personal'`
- `reminderTime: string | null` (formato `"HH:mm"`, ex: `"08:00"`)

A subcollection `steps/{stepId}` mantém-se inalterada. No formulário de criação (mobile), cada passo é um campo de texto único que mapeia para `step.title`; `step.instruction` fica opcional (vazio por agora) e pode ser usado futuramente para enriquecer o Modo Guiado.

**Motivo:**
- Os três campos são requisitos diretos do design — não há como implementar as telas sem eles.
- `reminderTime` fica na própria tarefa (não na collection `reminders`) porque representa a hora preferida da tarefa; a criação de lembretes propriamente ditos fica para o módulo de Lembretes.
- Manter a subcollection `steps` intacta evita migração e preserva compatibilidade com o que já está documentado.

**Alternativas consideradas:**
- Adicionar apenas `priority` + `category` e deixar o horário para o módulo de Lembretes (descartado: a lista e os detalhes exibem a hora da própria tarefa).
- Criar uma collection separada para metadados da tarefa (descartado: overhead desnecessário; os campos são 1:1 com a tarefa).

**Impacto cross-projeto:**
A collection `tasks` é partilhada com `seniorease-web`. Os campos novos são aditivos (não quebram leituras existentes). O time Web deve ler `firebaseSchema.md` antes de implementar o Módulo Tarefas na Web.

---

## ADR-011 — Ordenação de tarefas por dueDate e provider de próxima atividade

**Data:** 2026-06-25
**Status:** Aceito

**Contexto:**
O Módulo Tarefas passou a registar `dueDate` (DateTime completo) em vez de apenas `reminderTime` (string "HH:mm"). Com data e hora disponíveis, surgem dois requisitos: (1) a lista de tarefas deve ser ordenada da mais próxima para a mais distante no tempo; (2) o card "Próxima Atividade" na Home deve exibir a tarefa pendente mais urgente e dirigir o utilizador directamente para o modo guiado.

**Decisão:**
1. **Ordenação em memória no repositório** (`FirebaseTaskRepository.watchTasks`): sort multi-nível — pendentes/em progresso antes de concluídas; dentro das pendentes, `dueDate` ascendente (nulls no fim, com fallback por `createdAt`); concluídas por `completedAt` descendente. Não é adicionado nenhum índice composto no Firestore.
2. **`nextPendingTaskProvider`** (Riverpod `Provider<Task?>`): provider derivado de `tasksStreamProvider` que devolve a tarefa pendente mais próxima no tempo. Preferência para `dueDate >= agora`; fallback para qualquer tarefa não concluída; `null` se não existir nenhuma. Liga o `_NextActivityCard` da Home sem nova leitura ao Firestore.

**Motivo:**
- Ordenação em memória evita exigir índice composto no Firestore (simplifica infra e regras de segurança).
- `nextPendingTaskProvider` reutiliza o stream já aberto — custo zero de leituras adicionais.
- Separar a lógica de "próxima tarefa" num provider mantém a Home desacoplada do repositório.

**Alternativas consideradas:**
- Ordenar no Firestore via `orderBy('dueDate')` (descartado: exigiria índice composto com `userId`; a ordenação multi-nível não é suportada sem índice separado por status).
- Criar stream dedicado para "próxima tarefa" no repositório (descartado: overhead de ligação extra ao Firestore; o provider derivado é suficiente).

**Impacto:**
- `FirebaseTaskRepository` é a única camada que ordena — a UI recebe sempre a lista já ordenada.
- `nextPendingTaskProvider` pode ser reutilizado em futuras widgets (ex: notificações locais).

**Impacto cross-projeto:**
A Web (`seniorease-web`) deve replicar a mesma ordenação em memória (pendentes/em progresso antes de concluídas; `dueDate` ascendente, nulls no fim) e um equivalente ao `nextPendingTaskProvider` para o card "Próxima Atividade" no Dashboard, usando o estado web (Zustand selectors) em vez de Riverpod. Nenhum índice composto adicional é necessário para esta ordenação.

---

## ADR-012 — Filtros na Task List com Composite Indexes Firestore

**Data:** 2026-06-25
**Status:** Aceito

**Contexto:**
A Task List precisava de filtros por prioridade, categoria e data ("hoje"). O requisito era que os filtros fossem aplicados na query Firestore (não em memória). Filtros em memória trariam todo o dataset do utilizador e descartariam os resultados no cliente — ineficiente e sem escala.

**Decisão:**
1. Criar `TaskFilter` — modelo imutável de valor com `category?`, `priority?` e `isToday`. Inclui `isEmpty`, `activeCount`, `copyWith` e helpers `removeX()`.
2. Adicionar `watchTasksFiltered(userId, TaskFilter)` à interface `TaskRepository` e implementar no `FirebaseTaskRepository` com `.where()` encadeados condicionalmente.
3. Criar `GetFilteredTasksUseCase` dedicado (sem alterar o `GetTasksUseCase` original).
4. Adicionar `taskFilterProvider` (Riverpod `NotifierProvider<TaskFilterNotifier, TaskFilter>`) e `filteredTasksStreamProvider` no `tasks_provider.dart`. O `tasksStreamProvider` original (sem filtro) é mantido para o `nextPendingTaskProvider` e para o pull-to-refresh.
5. UI: botão de filtro com badge no header, barra de chips activos abaixo do header (com remoção individual), `RefreshIndicator` que reseta filtros + invalida streams + mostra toast se havia filtros.
6. Bottom sheet `TaskFilterSheet` com seções "Data", "Categoria" e "Prioridade"; chips com touch target ≥44px; estado local até "Aplicar".
7. Criar 4 composite indexes Firestore (documentados em `firebaseSchema.md`) para as combinações que envolvem `isToday` (range filter em `dueDate`).

**Motivo:**
- Filtros no Firestore reduzem o tráfego de rede e o custo de leitura (vs. trazer tudo e filtrar em memória).
- `TaskFilter.empty` como valor sentinela permite que `filteredTasksStreamProvider` se comporte identicamente ao `tasksStreamProvider` quando não há filtro.
- Pull-to-refresh que limpa filtros é um padrão de UX intuitivo para o público sénior: "puxar para baixo" = "recomeçar do zero".
- Bottom sheet com botão "Aplicar" evita que cada toque num chip dispare um novo fetch — aplica tudo de uma vez.

**Alternativas consideradas:**
- Filtros em memória após fetch completo (descartado: ineficiente e contraria o requisito explícito do utilizador).
- Chips inline na toolbar acima da lista com aplicação imediata (descartado: cada toque dispararia um novo stream; pior para rede e experiência do utilizador sénior que pode tocar por engano).
- `StateProvider<TaskFilter>` para o filtro (descartado: removido no Riverpod 3.x; substituído por `NotifierProvider`).

**Composite Indexes criados:**
- `(userId ASC, dueDate ASC)` — filtro "Hoje" isolado
- `(userId ASC, category ASC, dueDate ASC)` — "Hoje" + Categoria
- `(userId ASC, priority ASC, dueDate ASC)` — "Hoje" + Prioridade
- `(userId ASC, category ASC, priority ASC, dueDate ASC)` — todos combinados

> Filtros só por `category` e/ou `priority` (sem "Hoje") são equality filters e não requerem composite index.

**Impacto cross-projeto:**
A Web (`seniorease-web`) deve implementar os mesmos filtros (categoria, prioridade, "hoje") aplicados na query Firestore e reutiliza os mesmos composite indexes já criados (são partilhados — não é preciso recriar). Adaptar a UX de filtros e o "atualizar/reset" ao contexto web (em vez de bottom sheet + pull-to-refresh do mobile).

---

## ADR-013 — Sistema de Tour Guiado (showcaseview) com Port/Adapter e persistência híbrida

**Data:** 2026-06-29
**Status:** Aceito

**Contexto:**
Era necessário um sistema de tutoriais interativos para o público sénior: boas-vindas no primeiro arranque, tutoriais curtos por tela, oferta contextual na primeira utilização de um recurso, ajuda sempre acessível e uma Central "Guias do aplicativo" para rever qualquer guia. Os requisitos exigiam: adaptação ao Modo Básico/Avançado, repetição de qualquer tutorial, não interromper navegação desnecessariamente e — sobretudo — **manter a Clean Architecture e o Feature-First (ADR-005/ADR-008)** sem imports feature→feature. A biblioteca escolhida foi `showcaseview` (v5.x), cuja API usa registo por **scope nomeado** (`ShowcaseView.register(scope: ...)`), necessário porque o `IndexedStack` do shell mantém várias telas vivas em simultâneo.

**Decisão:**
1. **Infraestrutura genérica em `core/tour/`** (sem regra de negócio, importável por qualquer feature): `TourId` (enum), `SeniorShowcase` (wrapper de `Showcase` com tokens do DS e contraste AA), `TourHost` (mixin que regista/limpa o scope, configura o tooltip "sénior" e reage a sinais), `TourHelpButton`, `tourSignalProvider`/`tourSessionProvider` (coordenação efémera de UI) e o **port `TourGate`** + `tourGateProvider` (default no-op).
2. **Feature `guides`** depende apenas de `core`: contém os contratos `TutorialStateRepository`/`OnboardingRepository`, as implementações (`LocalTutorialStateRepository` em `shared_preferences`; `FirebaseOnboardingRepository` na collection `onboarding/{userId}`), os use cases (`ShouldOfferTutorial`, `MarkTutorialOffered`, `MarkTutorialSeen`, `IsInitialTourCompleted`, `CompleteInitialTour`), os providers, o catálogo de tutoriais (em presentation, por carregar `IconData`/rotas) e a `GuidesScreen`.
3. **Inversão de dependência (Port & Adapter)** para a comunicação entre telas e features: as telas (`home`, `tasks`) dependem **só do port `TourGate`** em `core`. A implementação real `AppTourGate` vive na camada `app/` (raiz de composição) — único ponto que compõe `guides` (persistência) e `accessibility` (Modo Básico). É injetada via `ProviderScope(overrides:)` na `main.dart`. Nenhuma feature importa outra.
4. **Persistência híbrida:** estado **local por dispositivo** (offered/seen de cada tutorial) em `shared_preferences`; estado **cross-device/web** (boas-vindas inicial) na collection Firestore própria `onboarding/{userId}` — **sem tocar em `UserPreferences`** (acessibilidade) para não sobrecarregar essa entidade com uma responsabilidade que não é dela.

**Motivo:**
- O port em `core` permite que as telas tenham tutoriais sem conhecer `guides`/`accessibility`, respeitando o Feature-First.
- Scope nomeado por tela resolve o conflito real do `IndexedStack` (Home e Tarefas vivas ao mesmo tempo).
- Separar `onboarding` num documento próprio mantém `preferences` coeso (Single Responsibility) e dá um sinal cross-platform claro e barato (1 doc 1:1 por utilizador).
- `shared_preferences` é suficiente (e mais barato) para flags efémeras por dispositivo que não precisam de sincronização.

**Alternativas consideradas:**
- Guardar `onboardingCompleted` em `UserPreferences`/`preferences` (descartado: sobrecarrega a entidade de acessibilidade com uma responsabilidade do domínio `guides`).
- Telas importarem diretamente providers de `guides` (descartado: viola o Feature-First/ADR-008).
- Presentation chamar repositórios diretamente (descartado: viola a Clean Architecture; introduzidos use cases dedicados).
- Guardar todo o estado dos tutoriais no Firestore (descartado: custo e complexidade desnecessários para flags por-dispositivo).

**Impacto:**
- Nova collection `onboarding/{userId}` + rule (dono apenas) em `firestore.rules`; `firebaseSchema.md` atualizado.
- Novas dependências: `showcaseview ^5.1.0`, `shared_preferences ^2.3.2`.
- Adicionar um novo tutorial é incremental: novo valor em `TourId`, entrada no catálogo e `TourHost` na tela alvo — nenhuma estrutura existente muda.

---

## ADR-014 — Módulo Perfil: extensão de `users` e foto no Firebase Storage

**Data:** 2026-06-30
**Status:** Aceito

**Contexto:**
O Módulo Perfil (Mobile) exige exibir e editar dados pessoais (nome, telefone, data de nascimento, CPF) e endereço, além de permitir mudar a foto do utilizador. A foto precisa de ser persistida (upload) e o conjunto de dados tem de respeitar a Clean Architecture/Feature-First (ADR-005/ADR-008). O login com Google (OAuth) ainda não existe, mas será adicionado a seguir, podendo trazer uma foto do provedor.

**Decisão:**
1. **Estender a collection `users/{userId}`** (relação 1:1 já lida pelo `auth`) com `phone`, `birthDate` (string `DD/MM/AAAA`), `cpf`, `photoUrl`, um mapa `address` e `updatedAt` — em vez de criar uma collection separada. A escrita usa `SetOptions(merge: true)`, preservando `id`/`createdAt`. O `email` nunca é editável (vem do Firebase Auth).
2. **Feature `profile` completa** (`domain`/`data`/`presentation`): entidades `UserProfile`/`Address`, contratos `ProfileRepository` (Firestore) e `ProfilePhotoStorage` (Storage), use cases (`GetUserProfile`, `SaveUserProfile`, `UploadProfilePhoto`), providers Riverpod com dependências injetadas (`firebaseFirestoreProvider`/`firebaseStorageProvider`) e `ProfileScreen`.
3. **Foto no Firebase Storage** em `profile_photos/{userId}` (1 ficheiro por utilizador); `photoUrl` guarda o `getDownloadURL()`. Regras próprias em `storage.rules` (dono apenas, só `image/*` até 5 MB). A UI usa `photoUrl` se existir, caindo para as iniciais — desenho compatível com a futura foto do Google.
4. **Tour Guiado da tela** seguindo o ADR-013 (port `TourGate`): `TourId.profile`, `TourHost` na `ProfileScreen`, alvos `SeniorShowcase`, oferta na 1.ª utilização apenas em Modo Básico e entrada no catálogo da Central de Guias.
5. **Máscaras** via `mask_text_input_formatter` com fábricas partilhadas em `core/utils/input_masks.dart`; `SeniorInput` ganha `inputFormatters` e `readOnly`. O CPF (opcional) é ocultado em Modo Básico.

**Motivo:**
- Reutilizar `users` evita duplicação e mantém a leitura existente do `auth` válida; o merge protege campos não geridos pelo perfil.
- Separar `ProfileRepository` de `ProfilePhotoStorage` respeita o Single Responsibility e facilita os testes (Storage abstraído por contrato).
- Storage por utilizador com regras estritas garante privacidade e custo previsível.
- Reaproveitar o port `TourGate` mantém o Feature-First (nenhum import feature→feature).

**Alternativas consideradas:**
- Collection `profiles` separada (descartado: duplica o 1:1 já existente em `users`).
- Guardar a foto em base64 no Firestore (descartado: custo/limite de 1 MB por documento; Storage é o local correto).
- Formatadores de máscara manuais (descartado a favor de uma dependência mantida, com `inputFormatters` exposto no DS).

**Impacto:**
- `users` estendido + nova secção/secção Storage em `firebaseSchema.md`; novo `storage.rules` + entrada `storage` em `firebase.json`.
- **Pré-requisito manual:** ativar o bucket do Storage no console `seniorease-backend` e publicar as regras (`firebase deploy --config memory-bank/firebase.json --only storage`).
- Novas dependências: `firebase_storage`, `image_picker`, `mask_text_input_formatter`; permissões iOS (`NSPhotoLibraryUsageDescription`, `NSCameraUsageDescription`).

**Impacto cross-projeto:**
A Web (`seniorease-web`) deve implementar a tela "Sobre" e a tela Perfil em paridade: ler/editar os mesmos campos de `users/{userId}` (com `merge`, `email` só-leitura), endereço, máscaras (telefone/CPF/data/CEP) com lib web equivalente (ex.: `react-input-mask`/`imask`), CPF oculto em Modo Básico, e upload da foto para o mesmo bucket `profile_photos/{userId}` (regras partilhadas). A seleção de ficheiro usa input web (`<input type="file">`) em vez de `image_picker`.

---

## ADR-015 — Login com Google (OAuth) via google_sign_in v6 + vinculação automática

**Data:** 2026-06-30
**Status:** Aceito

**Contexto:**
A tela de Login só permitia e-mail/senha. Era necessário um login social com Google que fosse simples para o público sénior (menos digitação), aproveitasse a foto/nome do provedor e mantivesse a Clean Architecture/Feature-First (ADR-005/ADR-008). O `google_sign_in` mudou bastante na v7 (API por singleton/eventos); a v6 tem API mais direta e mais exemplos.

**Decisão:**
1. Adicionar `google_sign_in: ^6.2.1` e o `googleSignInProvider` em `core/firebase/firebase_providers.dart` (injetável/testável), configurado com `serverClientId` = Web Client ID do `seniorease-backend` para obter o `idToken`.
2. Domain: `AuthRepository.signInWithGoogle()` + `SignInWithGoogleUseCase`. Cancelamento do seletor de contas é modelado por `AuthCancelledException` (em `domain/auth_exceptions.dart`) para a UI ignorar sem toast de erro.
3. Data (`FirebaseAuthRepository`): `signIn()` → `authentication` → `GoogleAuthProvider.credential` → `signInWithCredential`. No primeiro login, `_ensureUserDocument` cria `users/{uid}` com `name`/`email`/`photoUrl` do Google (`createdAt: serverTimestamp`); em logins seguintes não sobrescreve o perfil, apenas preenche `photoUrl` se estiver vazia.
4. **Vinculação automática:** a opção "Link accounts that use the same email address" está ativada no Firebase Console — o Firebase vincula contas com o mesmo e-mail sem fluxo manual de re-autenticação.
5. Presentation: `AuthController.signInWithGoogle()` e botão "Entrar com Google" apenas no `LoginScreen` (abaixo do divisor "ou"), com o logo "G" oficial via novo parâmetro `leading` do `SeniorButton`.
6. Config nativa: Android sem código (google-services.json + SHA-1 de debug já prontos); iOS com `CFBundleURLTypes` (`REVERSED_CLIENT_ID`) no `Info.plist`.

**Motivo:**
- v6 reduz a complexidade e o risco do hackathon (API estável e documentada).
- Vinculação automática evita pedir a senha antiga ao idoso — UX mais simples e segura.
- Injetar `GoogleSignIn` por provider mantém a testabilidade e o padrão dos outros repositórios.
- Auto-preencher sem sobrescrever respeita o Módulo Perfil (ADR-014).

**Alternativas consideradas:**
- `google_sign_in` v7 (descartado: API nova com menos exemplos; risco desnecessário no prazo).
- Fluxo manual de account-linking (descartado: a vinculação automática no console resolve sem código extra).
- Botão Google também no Register (descartado a pedido do produto: apenas no Login por ora).

**Impacto cross-projeto:**
A Web (`seniorease-web`) deve oferecer o mesmo login com Google (Firebase `GoogleAuthProvider`), partilhando a mesma config do projeto Firebase e a mesma regra de auto-preenchimento de `users/{uid}` (sem sobrescrever perfil existente).

---

## ADR-016 — Verificação de e-mail na tela de Segurança + sinalização de alerta

**Data:** 2026-06-30
**Status:** Aceito

**Contexto:**
A tela de Segurança (`/security`) tinha a opção "Verificar conta (e-mail)" apenas como "Em breve". Era preciso implementar a verificação real de e-mail do Firebase Auth, sinalizando ao utilizador que há uma ação pendente sem poluir a Home.

**Decisão:**
1. Entidade `AppUser` ganha `emailVerified` (default `false`); `_mapFirebaseUser` lê `user.emailVerified`. Contas Google chegam verificadas.
2. `AuthRepository` ganha `sendEmailVerification()` e `reloadAndCheckEmailVerified()` (+ use cases dedicados). O segundo faz `reload()` porque o link de confirmação não dispara o `authStateChanges`.
3. `AuthController.refreshEmailVerification()` invalida o `authStateProvider` ao confirmar, atualizando selo e alerta em toda a app.
4. **Sinalização:** `SettingsNavRow` ganha `showAlert` (ícone de exclamação à esquerda do chevron); a linha "Segurança" nas Definições mostra o alerta quando `user != null && !user.emailVerified`. Sem banner na Home (decisão de produto).
5. `SecurityScreen`: linha dinâmica — selo verde "Verificada" (não-clicável) ou âmbar "Não verificado"; ao tocar, envia o e-mail e revela um painel com instruções + botão "Já confirmei o meu e-mail" (e "Reenviar e-mail").

**Motivo:**
- Recarregar manualmente é o padrão correto do Firebase (o estado de verificação não chega por stream).
- Sinalizar o pendente na própria linha de Segurança mantém a Home limpa, como pedido.
- Centralizar a invalidação no controller garante consistência do selo/alerta.

**Alternativas consideradas:**
- Banner na Home (descartado a pedido do produto: não poluir a Home).
- Polling automático do estado de verificação (descartado: custo e complexidade; o botão "Já confirmei" é suficiente e claro).

**Impacto cross-projeto:**
A Web deve implementar a verificação de e-mail equivalente na sua tela de Segurança (Firebase `sendEmailVerification`/`reload`) e uma sinalização análoga de "ação pendente" no acesso à Segurança.

---

## ADR-017 — Módulo Histórico: port `HistoryRecorder`, streak on-read e collection `history`

**Data:** 2026-07-03
**Status:** Aceito

**Contexto:**
A tela de Histórico (Figma `15:8316`) precisa registar ações do utilizador (criar/concluir/editar/apagar tarefas e lembretes, ajustar acessibilidade, atualizar perfil, verificar conta) e exibir atividade recente + dois contadores: "Tarefas esta semana" e "Sequência (streak)". O registo tem de ser disparado por várias features, mas a regra Feature-First (ADR-008) proíbe uma feature importar outra.

**Decisão:**
1. **Port/Adapter (igual ao Tour, ADR-013):** enum `HistoryActionType` + port `HistoryRecorder` (+ `NoopHistoryRecorder` default) vivem em `core/history/`. O adaptador real `AppHistoryRecorder` vive em `app/history/` e é injetado no `main.dart` via `historyRecorderProvider.overrideWith(...)`. As features consumidoras dependem só do port em `core/`.
2. **best-effort:** `AppHistoryRecorder.record(...)` encapsula erros em try/catch e nunca propaga — falhar a gravar histórico jamais faz falhar a ação principal do utilizador.
3. **Feature `history`** (Clean Architecture): `HistoryEvent`/`HistoryStats`, `HistoryRepository` (`log`/`watchRecent`/`fetchCompletions`), use cases (`LogHistoryEvent`, `GetHistory`, `GetHistoryStats`) e `FirebaseHistoryRepository`.
4. **Contadores computados on-read (não denormalizados):** `GetHistoryStatsUseCase.computeStats` é uma função pura que calcula contador semanal (conclusões desde segunda-feira) e streaks (dias consecutivos terminando hoje/ontem) a partir das conclusões. Sem write-amplification, sem risco de dessincronização e portável 1:1 para a Web.
5. **Collection `history/{historyId}`** com `userId`, `type`, `title` (snapshot do texto no momento do evento), `entityId?`, `category?`, `occurredAt`. Dois composite indexes: `(userId, occurredAt DESC)` para a lista e `(userId, type, occurredAt DESC)` para as estatísticas (`whereIn` conclusões).
6. **Acessibilidade:** `FittedBox` nos números grandes, `Semantics` nos ícones, tokens do Design System, e no **Modo Básico** ocultam-se eventos de baixa relevância (edições, exclusões, ajustes de acessibilidade e perfil) — lido via `preferencesProvider`.
7. **Tour Guiado:** novo `TourId.history` + entrada na Central + `TourHost` na tela (3 passos).

**Motivo:**
- O Port/Adapter mantém o domínio de cada feature isolado sem duplicar lógica de registo.
- On-read é mais simples e seguro que denormalizar (que exigiria transações e correria risco de contadores dessincronizados) — adequado ao prazo e à escala.
- Guardar o `title` como snapshot preserva o histórico mesmo após apagar o item de origem.

**Alternativas consideradas:**
- **Denormalizar streak/contadores em `users/{uid}`** (descartado: write-amplification e risco de dessincronização; fica como otimização futura se o volume crescer).
- **Cada feature importar a use case de `history`** (descartado: viola a regra Feature-First de não-importação entre features).
- **Contar passos concluídos no streak** (descartado: só `taskCompleted` e `reminderCompleted` contam para o streak/semana, evitando inflar a métrica).

**Impacto cross-projeto:**
A Web (`seniorease-web`) deve replicar a mesma experiência com stack própria: mesmo `history/{id}` e mesmos indexes/rules (já publicados — nada a criar no Firebase); port `HistoryRecorder` equivalente em TS com No-op default e adaptador na raiz de composição; disparar `record(...)` nos mesmos pontos; portar a função pura de streak/contagem 1:1; contadores on-read via Zustand selectors; Modo Básico oculta eventos de baixa relevância; tour da tela History com a lib de tour da Web.

---

## ADR-018 — Módulo core/preferences/: mover UserPreferences para core e desacoplar SeniorFeedback

**Data:** 2026-07-06
**Status:** Aceito

**Contexto:**
Três ficheiros em `lib/core/` importavam directamente de `lib/features/`:
- `app_spacing.dart` e `app_theme.dart` importavam `SpacingMode`/`UserPreferences` de `features/accessibility/domain/entities/`.
- `senior_feedback.dart` importavam `preferencesProvider` de `features/accessibility/presentation/providers/`.
Isto violava a regra "core nunca importa features" da Clean Architecture.

**Decisão:**
1. Criar `lib/core/preferences/user_preferences.dart` com o conteúdo completo da entidade e enums.
2. Converter `features/accessibility/domain/entities/user_preferences.dart` num re-export de `core/preferences/`, preservando todos os imports existentes em features sem alteração.
3. Criar `lib/core/preferences/preferences_state.dart` com `audioFeedbackEnabledProvider` (default `false`).
4. `senior_feedback.dart` usa `audioFeedbackEnabledProvider` de `core/preferences/`.
5. `lib/app/app.dart` (que já importa features) adiciona um `ProviderScope` aninhado que faz override de `audioFeedbackEnabledProvider` com o valor real de `preferencesProvider`.

**Motivo:**
A arquitectura alvo exige que `core/` seja independente de `features/`. A solução com `ProviderScope` override é o padrão idiomático em Riverpod para injecção de dependências em camadas que não se podem importar mutuamente — sem introduzir service locators nem singletons globais.

**Alternativas consideradas:**
- Passar `bool audioEnabled` como parâmetro a `SeniorFeedback`: descartado, pois obriga todos os call sites a ler `preferencesProvider` explicitamente, espalhando a responsabilidade.
- Manter `UserPreferences` em `features/` e criar um typedef/abstract em `core/`: descartado, complexidade desnecessária; a entidade não tem dependências de UI.

---

## ADR-019 — Manter `auth_provider` como comunicação directa entre features

**Data:** 2026-07-06
**Status:** Aceito

**Contexto:**
8 features (`tasks`, `reminders`, `home`, `profile`, `guides`, `history`, etc.) importam `auth_provider.dart` directamente de `features/auth/presentation/providers/`. Isto é uma violação da regra "features nunca importam directamente de outras features".

**Decisão:**
Manter a dependência directa para o Hackathon. Não migrar `auth_provider` para `core/auth/` nesta iteração.

**Motivo:**
- Risco muito baixo para o âmbito do Hackathon: `auth_provider` é apenas um `StateNotifierProvider` que expõe o estado de autenticação, sem lógica de negócio acoplada.
- O volume de mudança (8 features + testes) não traz valor diferenciador para os entregáveis do Hackathon.
- O padrão de re-export (usado em ADR-018) pode ser aplicado numa futura iteração com custo mínimo.

**Plano de migração futura:**
1. Criar `lib/core/auth/auth_state.dart` com `authStateProvider` (tipo abstracto ou equivalente).
2. Registar override em `app.dart` ligando `authStateProvider` ao `FirebaseAuthNotifier` existente.
3. Substituir os 8 imports por `core/auth/auth_state.dart`.

**Alternativas consideradas:**
- Migrar agora: descartado pelo custo vs. benefício no contexto do Hackathon.
- Criar barrel file em `features/auth/`: descartado, não resolve a violação arquitectural — apenas a camufla.

---

## ADR-020 — Arquitetura FCM: cron + token storage + collection `notifications` + remoção de campos legados

**Data:** 2026-07-06
**Status:** Aceito

**Contexto:**
O GAP-002 identificou que o projeto não tinha notificações push implementadas. Os campos `reminderTime` (tasks) e `remindersEnabled`/`notificationTime` (preferences) eram legados e sem utilização real. Era necessário definir uma arquitetura de notificações push configurável (offset variável), compatível com mobile (Flutter) e web (Next.js), e documentada de forma que ambas as plataformas possam implementá-la de forma idêntica.

**Decisão:**
- **Backend:** Cloud Function cron (`onSchedule every 1 minutes`) percorre `tasks` e `reminders` com `notified==false` na janela `[agora, agora+25h]`, lê as `preferences` do dono, aplica o `offset` configurado, envia FCM multicast, grava histórico em `notifications/{id}` e marca `notified=true`.
- **Token storage:** `users/{uid}/fcmTokens/{token}` — cada dispositivo regista o seu token; tokens inválidos são removidos automaticamente após falha no envio.
- **Offsets configuráveis:** enum `NotificationOffset` (5 valores: 15m, 30m, 1h, 6h, 1d) com 4 campos em `preferences` (tasks + reminders × enabled + offset).
- **Campos removidos:** `reminderTime` de `tasks`, `remindersEnabled` e `notificationTime` de `preferences` — substituídos pelos novos campos.
- **Cloud Functions location:** `memory-bank/functions/` — partilhado entre mobile e web.
- **Documentação:** `memory-bank/notifications.md` como spec única para ambas as plataformas.

**Motivo:**
- Cron + flag `notified` é robusto: lida naturalmente com edições, exclusões e mudanças de preferência; sem necessidade de Cloud Tasks ou agendamentos individuais por item.
- FCM garante entrega em Android, iOS e Web com um único contrato de API.
- Documentar em `notifications.md` garante que a equipa Web pode replicar a implementação de forma idêntica sem ambiguidade.

**Alternativas consideradas:**
- Cloud Tasks (uma task por item): mais complexo, mais caro, mais difícil de lidar com edições/exclusões — descartado.
- Notificações locais (flutter_local_notifications): não funciona com app fechado e não cobre Web — descartado.
- Agendamento on-write (onCreate trigger): não lida com mudanças de preferência após criação — descartado.

**Referência:** `memory-bank/notifications.md` — especificação completa para mobile e web.

---

## ADR-021 — Tour automático por tela em Modo Básico — remoção do guard de sessão

**Data:** 2026-07-08
**Status:** Aceito

**Contexto:**
O sistema de tour guiado (ADR-013) incluía um `tourSessionProvider` — um guard de sessão em memória que impedia mais de um convite automático por sessão de uso. Essa decisão foi tomada para evitar "bombardear" o utilizador com modais de tour ao navegar por várias telas seguidas. Porém, o objetivo do produto evoluiu: no Modo Básico, queremos que o utilizador receba o convite do tour em CADA tela que abrir pela primeira vez, independentemente de quantas telas já visitou na mesma sessão. A persistência `isOffered` (SharedPreferences por `userId + TourId`) já garante que o convite só aparece uma vez por tela ao longo da vida do dispositivo — o guard de sessão tornara-se redundante e contrário ao objetivo.

Também se verificou que apenas 4 das 16 telas com `TourHost` tinham `_maybeOfferFirstUse()` — as restantes 12 nunca ofereciam tour automaticamente.

**Decisão:**
1. Remover `TourSession` e `tourSessionProvider` de `core/tour/tour_signal_provider.dart`.
2. Adoptar o padrão `_maybeOfferFirstUse()` em TODAS as 16 telas com `TourHost`, incluindo as que já tinham (4) e as que não tinham (12). Para a `HomeScreen`, integrar com o `_maybeOfferWelcome` existente (onboarding cross-device via Firestore) para evitar dois modais seguidos.
3. O único ponto de verificação do Modo Básico continua a ser `AppTourGate.shouldOfferFirstUse`, que retorna `false` quando `interfaceMode != InterfaceMode.basic` — garantindo que em Modo Avançado nenhum modal automático é exibido.
4. No Modo Avançado, o tour continua acessível manualmente pelo botão `?` no header ou pela Central "Guias do aplicativo".

**Motivo:**
- A persistência `tour_{userId}_{tourId}_offered` (SharedPreferences) é suficiente para evitar repetições — cada tela controla o seu próprio estado de "já foi oferecido".
- O utilizador Sénior em Modo Básico beneficia de descobrir as funcionalidades de cada tela de forma contextual, no momento em que a visita pela primeira vez.
- O utilizador em Modo Avançado é mais experiente e não precisa de interrupções automáticas; o acesso ao tour fica disponível sob demanda.
- A remoção do guard simplifica o código: menos estado global, menos coordenação entre telas.

**Alternativas consideradas:**
- Manter o guard de sessão mas aumentar o limite para N por sessão (descartado: arbitrário e não resolve o problema de novas telas em sessões futuras).
- Usar o guard de sessão com escopo por tela (descartado: equivalente a `isOffered` que já existe).

**Impacto no schema Firebase / SharedPreferences:**
Nenhuma mudança no schema. As chaves `tour_{userId}_{tourId}_offered` e `tour_{userId}_{tourId}_seen` já existem e são suficientes.

---

## ADR-022 — Reauth Google silenciosa após biometria (preservar sessão Google no logout)

**Data:** 2026-07-15
**Status:** Aceito

**Contexto:**
Com conta Google lembrada e biometria activa, o fluxo "Continuar com Google" fazia Face ID e de seguida `GoogleSignIn.signIn()` interactivo. No iOS, o dismiss do Face ID podia fechar o sheet OAuth (race de UI), deixando o utilizador na tela de login apesar do Face ID ter sucesso. No logout, `_googleSignIn.signOut()` limpava a sessão Google e forçava sempre o fluxo interactivo.

**Decisão:**
1. No `signOut` da app, terminar **apenas** a sessão Firebase Auth — preservar a sessão Google no dispositivo.
2. Em re-login com Google lembrado, usar `signInWithGoogle(preferSilent: true)` → `signInSilently()` primeiro; fallback para `signIn()` só se não houver sessão em cache (com pequeno delay pós-biometria no edge case).
3. Em "Usar outra conta", chamar `clearGoogleSession()` para forçar o seletor no próximo login Google.
4. O botão "Entrar com Google" do formulário completo continua interactivo (`preferSilent: false`).

**Motivo:**
- Happy path sem empilhar dois prompts nativos (biometria + OAuth) — sólido em iOS e Android.
- Delay 400 ms global pós-Face ID já tinha sido tentado e não resolvia; o silent reauth elimina o sheet na maioria dos casos.
- Troca de conta continua possível via `clearGoogleSession`.

**Alternativas consideradas:**
- Invertir ordem (OAuth → Face ID → Firebase) — mais complexo (separar obtenção de credencial do `signInWithCredential`) e ainda apresenta UI OAuth desnecessária no re-login.
- Delay fixo sempre antes de `signIn()` — já falhou em produção.

---

## Como adicionar um novo ADR

Copie o template abaixo e preencha:

```markdown
## ADR-00X — Título da decisão

**Data:** YYYY-MM-DD
**Status:** Proposto | Aceito | Descartado | Substituído por ADR-00Y

**Contexto:**
[Qual problema ou situação motivou esta decisão?]

**Decisão:**
[O que foi decidido?]

**Motivo:**
[Por que esta foi a melhor opção?]

**Alternativas consideradas:**
[O que foi avaliado e descartado?]
```
