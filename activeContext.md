# Active Context — SeniorEase

> Este arquivo é atualizado pelo dev que inicia uma nova frente de trabalho. Reflete o estado atual do time.
> Última atualização: 2026-06-18

---

## Status geral

**Fase atual:** Fundação — Firebase concluído; setup Mobile em progresso (Flutter criado)

O memory-bank está configurado no repositório mobile. Firebase (`seniorease-backend`) está operacional com Auth, Firestore, FCM e apps Web/Android/iOS registadas. O Figma está validado e alinhado com os requisitos do Hackathon.

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
**Status:** Etapa 2 em progresso — Firebase conectado, app compila
**Já feito:** memory-bank como submódulo, `.cursor/rules/memory-bank.mdc`, projeto Flutter (`com.seniorease.mobile`), estrutura Clean Architecture, Riverpod, GoRouter, tema base, `flutterfire configure`, Firebase inicializado no `main.dart`.
**Próximo passo:**
1. Configurar GitHub Actions (build APK + Firebase App Distribution)
2. Implementar autenticação (Login, Register, Forgot Password)

### CI/CD
**Status:** Pendente — deve ser configurado antes das primeiras features
**Próximo passo:** Configurar GitHub Actions para Web (Vercel) e Mobile (Firebase App Distribution)

---

## Decisões em aberto

Nenhuma decisão pendente no momento. Todas as decisões arquiteturais estão documentadas em `decisions.md`.

---

## Como atualizar este arquivo

Quando começar uma nova tarefa, atualize a seção da sua frente com:
- O que está sendo implementado agora
- Quaisquer bloqueios ou dependências

Quando concluir, atualize `progress.md` e limpe o foco desta seção.
