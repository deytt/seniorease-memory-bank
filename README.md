# SeniorEase — Memory Bank

Repositório central de contexto do projeto **SeniorEase**, uma plataforma de inclusão digital para pessoas idosas desenvolvida como projeto final de pós-graduação (Hackathon FIAP).

Este repositório funciona como **submódulo Git** dentro dos projetos `seniorease-web` e `seniorease-mobile`. É a fonte da verdade para decisões de produto, arquitetura, stack e progresso do time.

---

## Arquivos do Memory Bank

| Arquivo | Conteúdo | Quem atualiza |
|---|---|---|
| `projectbrief.md` | Requisitos oficiais do Hackathon (imutável) | Ninguém — fonte da verdade |
| `productContext.md` | Persona, problemas do usuário, objetivos do produto | Product / Tech Lead |
| `systemPatterns.md` | Clean Architecture, estrutura de pastas, padrões de código | Tech Lead |
| `techContext.md` | Stack, Design System tokens, env vars | Tech Lead |
| `firebaseSchema.md` | Schema Firestore (collections, campos, tipos), regras de segurança, changelog | Tech Lead |
| `activeContext.md` | Foco atual do time, o que está em andamento | Todo dev ao iniciar tarefa |
| `progress.md` | Status por frente (Web / Mobile / Firebase / CI/CD) | Todo dev ao concluir tarefa |
| `decisions.md` | ADRs — decisões arquiteturais e seus motivos | Tech Lead / decisão coletiva |

---

## Protocolo obrigatório para agentes (Cursor)

Todo agente Cursor que trabalhar nos projetos `seniorease-web` ou `seniorease-mobile` deve seguir este protocolo:

### Antes de qualquer tarefa
Ler obrigatoriamente:
1. `memory-bank/projectbrief.md` — para entender o que o projeto deve entregar
2. `memory-bank/productContext.md` — para entender para quem e por quê
3. `memory-bank/systemPatterns.md` — para respeitar a arquitetura definida
4. `memory-bank/techContext.md` — para usar a stack e tokens corretos
5. `memory-bank/firebaseSchema.md` — para conhecer o schema Firestore e as regras de segurança vigentes
6. `memory-bank/activeContext.md` — para saber o foco atual do time

### Após concluir uma tarefa
- Atualizar `memory-bank/progress.md` com o que foi entregue

### Ao iniciar uma nova frente de trabalho
- Atualizar `memory-bank/activeContext.md` com o foco atual

### Ao tomar uma decisão arquitetural nova
- Registrar em `memory-bank/decisions.md` no formato ADR

### Ao modificar o schema Firestore ou as Firestore Rules
1. Atualizar `memory-bank/firebaseSchema.md` — campo modificado e linha no Changelog
2. Atualizar `memory-bank/firestore.rules` com as novas regras
3. Publicar as rules no Firebase Console (projeto: `seniorease-backend`)
4. Se a mudança for estrutural, criar um ADR em `decisions.md`
5. Commitar o submódulo e avisar o time: `git submodule update --remote`

> A Cursor Rule que aplica este protocolo automaticamente está em `.cursor/rules/memory-bank.mdc` e deve ser copiada para `.cursor/rules/` em cada projeto.

---

## Cursor Skills

Este repositório inclui skills para o Cursor Agent que devem ser copiadas para cada projeto.

| Skill | Caminho | O que faz |
|---|---|---|
| `project-overview` | `.cursor/skills/project-overview/` | Apresenta o status atual do desenvolvimento por frente |

### Copiar skills para um projeto (feito uma vez)
```bash
mkdir -p .cursor/skills
cp -r memory-bank/.cursor/skills/project-overview .cursor/skills/
```

> As skills são atualizadas ao executar o script `update-memory-bank.sh` presente em cada projeto.

---

## Como usar o submódulo

### Adicionar o submódulo a um projeto (feito uma vez)
```bash
git submodule add git@github.com:deytt/seniorease-memory-bank.git memory-bank
git commit -m "chore: add seniorease-memory-bank as submodule"
```

### Copiar rules e skills para o projeto (feito uma vez)
```bash
# Cursor Rule
cp memory-bank/.cursor/rules/memory-bank.mdc .cursor/rules/memory-bank.mdc

# Cursor Skills
mkdir -p .cursor/skills
cp -r memory-bank/.cursor/skills/project-overview .cursor/skills/
```

### Atualizar o memory-bank para o commit mais recente
```bash
bash scripts/update-memory-bank.sh
```

O script (mantido em cada projeto individualmente) atualiza o submodule, re-sincroniza rules e skills automaticamente, e informa o que foi alterado. Não faz commit — fica a teu cargo.

### Clonar um projeto que já tem o submódulo
```bash
git clone --recurse-submodules git@github.com:deytt/seniorease-web.git
# ou, se já clonou sem o submódulo:
git submodule update --init --recursive
```

---

## Repositórios do projeto

| Repositório | Descrição |
|---|---|
| `seniorease-memory-bank` | Este repositório — contexto e decisões |
| `seniorease-web` | Aplicação Web (Next.js 14+) |
| `seniorease-mobile` | Aplicação Mobile (Flutter) |
