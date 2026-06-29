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
