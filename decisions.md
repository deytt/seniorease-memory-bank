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
