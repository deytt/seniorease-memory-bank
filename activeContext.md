# Active Context — SeniorEase

> Este arquivo é atualizado pelo dev que inicia uma nova frente de trabalho. Reflete o estado atual do time.
> Última atualização: 2026-06-18 (layout auth + Figma)

---

## Status geral

**Fase atual:** Features — Design System, autenticação e layout das telas auth Mobile concluídos; próximo: Home/Dashboard e Módulo Acessibilidade

O memory-bank está configurado no repositório mobile. Firebase (`seniorease-backend`) está operacional. CI/CD Mobile funcional com App Distribution. Design System base implementado a partir do Figma. Autenticação (Login, Register, Forgot Password) integrada com Firebase Auth e rotas protegidas. Telas auth alinhadas ao Figma com layout responsivo e edge-to-edge.

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
**Status:** Etapa 3 em progresso — Design System + Auth + layout auth concluídos
**Já feito:** CI/CD Mobile; Design System (`SeniorButton` com variante outline, `SeniorInput` com label compacto, `SeniorCard`, `SeniorAlert`, `SeniorToast`, `SeniorModal`, `SeniorLogo`, `SeniorScreenHeader`, `SeniorScreenScaffold`, `SeniorFormBody`); escala tipográfica e tokens Figma (`inputHeight` 58, `inputBorderRadius`/`buttonBorderRadius` 16, botão voltar 36×36 visual / 48×48 toque); edge-to-edge (status bar e nav bar transparentes via `senior_system_ui.dart`); autenticação Firebase (Login, Register, Forgot Password); auth guard GoRouter; criação de `users/{uid}` no Firestore no registo; telas auth alinhadas ao Figma (`15:6210` Login, `15:6415` Register, `15:6638` Forgot Password, `15:6423` botão voltar).
**Próximo passo:** Home/Dashboard real e Módulo 1 — Acessibilidade (ThemeData dinâmico)

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
