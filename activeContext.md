# Active Context — SeniorEase

> Este arquivo é atualizado pelo dev que inicia uma nova frente de trabalho. Reflete o estado atual do time.
> Última atualização: 2026-06-17

---

## Status geral

**Fase atual:** Fundação — configuração de infraestrutura e início do desenvolvimento

O memory-bank foi criado e está pronto para ser adicionado como submódulo nos projetos web e mobile. O Figma está validado e alinhado com os requisitos do Hackathon.

---

## Foco atual por frente

### Firebase / Infra
**Responsável:** David (Tech Lead)
**Status:** Pendente
**Próximo passo:** Criar projeto no Firebase Console, habilitar Auth (Email/Password), criar coleções no Firestore (`users`, `tasks`, `preferences`, `reminders`), configurar regras de segurança conforme `techContext.md`, compartilhar variáveis de ambiente com o time.

### Web (seniorease-web)
**Status:** Pendente — aguardando Firebase configurado
**Próximo passo:**
1. Adicionar memory-bank como submódulo (`git submodule add`)
2. Copiar `.cursor/rules/memory-bank.mdc` para `.cursor/rules/`
3. Configurar projeto Next.js 14 com estrutura Clean Architecture definida em `systemPatterns.md`
4. Implementar autenticação (Login, Register, Forgot Password)

### Mobile (seniorease-mobile)
**Responsável:** David
**Status:** Pendente — aguardando Firebase configurado
**Próximo passo:**
1. Adicionar memory-bank como submódulo (`git submodule add`)
2. Copiar `.cursor/rules/memory-bank.mdc` para `.cursor/rules/`
3. Configurar projeto Flutter com estrutura definida em `systemPatterns.md`
4. Executar `flutterfire configure` para conectar ao Firebase
5. Implementar autenticação (Login, Register, Forgot Password)

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
