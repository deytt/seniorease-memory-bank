# Active Context — SeniorEase

> Este arquivo é atualizado pelo dev que inicia uma nova frente de trabalho. Reflete o estado atual do time.
> Última atualização: 2026-06-24 (Módulo Tarefas mobile — Create, List, Details, Guided)

---

## Status geral

**Fase atual:** Features — Módulo Tarefas (mobile) concluído; próximo: Lembretes e Histórico

O memory-bank está configurado no repositório mobile. Firebase (`seniorease-backend`) está operacional. CI/CD Mobile funcional com App Distribution. Design System base implementado. Autenticação (Login, Register, Forgot Password) integrada com Firebase Auth e rotas protegidas. Telas auth alinhadas ao Figma.

**Refactor ADR-008 concluído:** projeto migrado para Feature-First + Clean Architecture. **ADR-009 concluído:** Dynamic Theme Engine (`AppTheme.buildDynamic`) + Módulo Acessibilidade implementado (tela `15:9085`, domain/data/presentation, rota `/accessibility`). **ADR-010 concluído:** schema `tasks` estendido (priority, category, reminderTime) e Módulo Tarefas mobile implementado (Create `15:7612`, List `15:7134`, Details `15:7401`, Guided `15:7818`) com passos dinâmicos, modo guiado sequencial inteligente e celebração Lottie. 0 erros de análise estática.

---

## Foco atual por frente

### Firebase / Infra
**Responsável:** David (Tech Lead)
**Status:** Concluído
**Entregue:** Projeto `seniorease-backend`, Auth Email/Password, Firestore com regras publicadas, FCM V1, apps Web/Android/iOS (`com.seniorease.mobile`), `.env.local` partilhado com o time.
**Pendente (não bloqueante):** Configuração APNs para push notifications no iOS.

### Web (seniorease-web)
**Status:** Pronto para Etapa 2 — setup do projeto
**Próximo passo:**
1. Adicionar memory-bank como submódulo (`git submodule add`)
2. Copiar `.cursor/rules/memory-bank.mdc` para `.cursor/rules/`
3. Configurar projeto Next.js 14 com estrutura Clean Architecture definida em `systemPatterns.md`
4. Implementar autenticação (Login, Register, Forgot Password)

### Mobile (seniorease-mobile)
**Responsável:** David
**Status:** Refactor Criar Tarefa concluído — próximo: Módulo Lembretes e Histórico
**Já feito:** CI/CD Mobile; Design System em `core/widgets/`; `core/theme/` com tokens Figma e `AppTheme.buildDynamic`; edge-to-edge; autenticação Firebase com use cases; auth guard GoRouter; telas auth alinhadas ao Figma; estrutura Feature-First; **Módulo Acessibilidade** (dynamic theme, tela, Firestore); **Home/Dashboard** (header gradiente, SOS, quick actions, reminders, bottom nav 5 tabs via StatefulShellRoute); **Settings** (profile banner, 5 nav rows, HelpCard, logout com confirmação); **Módulo Tarefas** (`features/tasks/` domain/data/presentation; Create/List/Details/Guided; passos dinâmicos; modo guiado sequencial; celebração Lottie; rotas `/tasks`, `/tasks/create`, `/tasks/:id`, `/tasks/:id/guided`); **Refactor Criar Tarefa** (`SeniorScreenHeader` genérico com tokens de tema; `AccessibilityScreen` migrada para `SeniorScreenScaffold`; `CategoryDropdown` novo widget; `CreateTaskScreen` com categoria como dropdown, campo data+hora (`dueDate`), 1 passo pré-aberto obrigatório, validações inline, remoção do botão guardar do header).
**Próximo passo:** Módulo Lembretes (Reminders) e Histórico (History)

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
