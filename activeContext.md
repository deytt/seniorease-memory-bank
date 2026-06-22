# Active Context — SeniorEase

> Este arquivo é atualizado pelo dev que inicia uma nova frente de trabalho. Reflete o estado atual do time.
> Última atualização: 2026-06-22 (refactor feature-first + use cases auth)

---

## Status geral

**Fase atual:** Features — Refactor arquitetural concluído; próximo: Home/Dashboard e Módulo Acessibilidade

O memory-bank está configurado no repositório mobile. Firebase (`seniorease-backend`) está operacional. CI/CD Mobile funcional com App Distribution. Design System base implementado. Autenticação (Login, Register, Forgot Password) integrada com Firebase Auth e rotas protegidas. Telas auth alinhadas ao Figma.

**Refactor ADR-008 concluído:** projeto migrado para Feature-First + Clean Architecture com use cases reais criados (`SignInUseCase`, `SignUpUseCase`, `SignOutUseCase`, `SendPasswordResetUseCase`). Estrutura `core/` e `features/` no lugar de `domain/`, `infrastructure/`, `presentation/` globais. 0 erros de análise estática.

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
**Status:** Refactor ADR-008 concluído — pronto para Home/Dashboard e Módulo 1
**Já feito:** CI/CD Mobile; Design System em `core/widgets/` (`SeniorButton`, `SeniorInput`, `SeniorCard`, `SeniorAlert`, `SeniorToast`, `SeniorModal`, `SeniorLogo`, `SeniorScreenHeader`, `SeniorScreenScaffold`, `SeniorFormBody`); `core/theme/` com tokens Figma; edge-to-edge; autenticação Firebase com use cases reais; auth guard GoRouter; telas auth alinhadas ao Figma; estrutura Feature-First (`features/auth/`, `features/home/`, `features/accessibility/`, `features/tasks/`, `features/reminders/`, `features/profile/`).
**Próximo passo:** Home/Dashboard real e Módulo 1 — Acessibilidade (`UserPreferences` entity + `ThemeData` dinâmico)

### CI/CD
**Status:** Mobile concluído — Web pendente
**Entregue (Mobile):** `.github/workflows/mobile.yml` — CI (`analyze` + `test`) em push/PR; CD (build APK + App Distribution) só em push na `master`.
**Próximo passo:** Configurar GitHub Actions para Web (Vercel)

---

## Decisões em aberto

Nenhuma decisão pendente no momento. Todas as decisões arquiteturais estão documentadas em `decisions.md`.

---

## Como atualizar este arquivo

Quando começar uma nova tarefa, atualize a seção da sua frente com:
- O que está sendo implementado agora
- Quaisquer bloqueios ou dependências

Quando concluir, atualize `progress.md` e limpe o foco desta seção.
