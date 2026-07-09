# Roteiro do Vídeo de Entrega — SeniorEase

> Máximo: **15 minutos** | Destino: Plataforma FIAP
> Status: **em construção** — ir complementando à medida que a entrega se aproxima

---

## Links e Recursos para o Vídeo

| Recurso | Link |
|---------|------|
| Protótipo Figma publicado (Figma Make → Figma Design) | https://senior-ease.figma.site |
| Figma Design (ficheiro oficial, Design System + telas) | https://www.figma.com/design/3avWJD9n4gI9mZHw9dksIy/SeniorEase?node-id=2-2396&p=f&m=dev |
| Kanban do projeto (GitHub Projects) | https://github.com/users/deytt/projects/3 |
| Repositório Mobile | *(adicionar link)* |
| Repositório Web | *(adicionar link)* |
| App Distribution (APK) | *(adicionar link)* |
| Deploy Web (Vercel) | *(adicionar link)* |

---

## Diferenciais do Projeto — O que vale destacar no vídeo

Esta secção documenta os pontos de destaque da **forma como o projeto foi construído**, não apenas o produto em si. São os argumentos mais fortes para a apresentação.

### 1. Processo de Design — Figma Make → Figma Design → Código

- Começámos pelo **Figma Make** para gerar um protótipo navegável rapidamente: exploração de conceito, paleta de cores, identidade visual e fluxos de navegação — tudo antes de escrever uma linha de código.
- Com o protótipo validado, migrámos para o **Figma Design** para criar o Design System formal: tokens de cor, tipografia, espaçamento, componentes reutilizáveis, variantes de estado (hover, disabled, erro), Modo Básico vs. Avançado e Dark Mode.
- O desenvolvimento das telas foi assistido pelo **Figma MCP** (Model Context Protocol), que permitiu ao agente de IA ler o design diretamente do Figma e gerar código Flutter/React alinhado ao Design System — acelerando drasticamente a implementação e reduzindo divergências entre design e código.

### 2. Plataforma Dupla com Base Única (Mobile + Web)

- Desenvolvemos simultaneamente uma **app mobile em Flutter** e uma **plataforma web em Next.js**.
- As duas partilham a **mesma base Firebase** (`seniorease-backend`): mesmas collections Firestore, regras de segurança, indexes e Firebase Storage — sem duplicação de infra.
- A coerência visual e de UX é garantida pelo mesmo Design System (tokens exportados do Figma para os dois projetos).
- As regras de negócio do domínio são portadas 1:1 entre as plataformas (ex.: algoritmo de streak do Histórico).

### 3. Memory-Bank Centralizado — O "Cérebro" do Projeto

- Criámos um **submódulo Git partilhado** (`seniorease-memory-bank`) que vive dentro dos dois repositórios (mobile e web).
- O memory-bank contém toda a documentação viva do projeto: brief de requisitos, contexto de produto, padrões de arquitetura, schema Firestore, regras de segurança, ADRs (decisões arquiteturais), contexto ativo e progresso.
- Qualquer agente de IA ou dev que abra o projeto lê primeiro o memory-bank e fica imediatamente alinhado — sem precisar de briefings manuais, sem divergências entre equipas.
- Isto permitiu trabalhar com **agentes de IA como colaboradores reais**: o agente conhecia os requisitos do hackathon, as decisões já tomadas, o estado atual e as regras invioláveis (acessibilidade, Clean Architecture, tokens do DS).

### 4. Arquitetura — Clean Architecture + Feature-First

- Tanto o mobile (Flutter/Riverpod) como o web (Next.js/Zustand) seguem **Clean Architecture** com separação estrita entre Domain, Data e Presentation.
- A regra "uma feature nunca importa outra feature" é garantida por um padrão **Port/Adapter** (usado no Tour Guiado e no Módulo Histórico): a comunicação cross-feature passa por abstrações em `core/`, nunca por imports diretos.
- Isto torna o código testável, extensível e fácil de compreender por qualquer dev (ou agente IA) que entre no projeto.

### 5. Notificações Push FCM — Infraestrutura Real de Ponta a Ponta

- O app não usa notificações locais simuladas — usa **Firebase Cloud Messaging (FCM)** com **Cloud Functions** reais rodando no servidor.
- Uma Cloud Function `sendDueNotifications` é executada **a cada minuto** (cron scheduler), consulta as tarefas e lembretes com prazo próximo e envia push diretamente para todos os dispositivos do utilizador.
- O utilizador configura a **antecedência do aviso** (15 min, 30 min, 1h, 6h, 1 dia) por tipo — tarefas e lembretes têm offsets independentes.
- O token FCM é registado automaticamente no Firestore (`users/{uid}/fcmTokens/{token}`) quando o utilizador autoriza notificações, e removido no sign-out — sem tokens fantasma.
- Uma segunda Cloud Function (`resetReminderNotified`) recalcula automaticamente o aviso quando o utilizador edita o horário de um lembrete.
- O **sininho** substituiu o botão SOS no header da Home: exibe um **badge vermelho** com a contagem de notificações recebidas hoje e abre um histórico completo (`/notifications`) que mostra cada aviso enviado, com navegação direta à tarefa ou lembrete correspondente.
- Toda a infra está documentada no memory-bank (`notifications.md`) para que a equipa Web implemente de forma idêntica.

### 6. Identidade Visual — Logo, Nome e Continuidade do Header

- O ícone do app ("SE" branco sobre fundo azul `#2563EB`) foi extraído do Figma (node `15:2447`) e gerado a 1024×1024px para ambas as plataformas (Android mipmap-mdpi a mipmap-xxxhdpi + todos os tamanhos iOS via `flutter_launcher_icons`).
- O app passou a chamar-se **"Senior Ease"** em Android e iOS.
- O header gradiente da Home e dos Ajustes **estende-se atrás do status bar** (edge-to-edge) com `statusBarColor: Colors.transparent` — dando a sensação de um único elemento contínuo entre o sistema operativo e a app.

### 7. Acessibilidade como Requisito de Primeira Classe

- A acessibilidade não foi um "extra" — foi uma **constraint de arquitetura** desde o início.
- Design System com tokens de contraste validados (WCAG AA mínimo), áreas de toque ≥ 44px, `Semantics` em todos os elementos interativos.
- **Modo Básico / Avançado**: simplifica a UI em tempo real, ocultando elementos não essenciais — implementado como lógica real no tema e nos providers, não apenas visualmente.
- **Dynamic Theme Engine**: tipografia escalável (87% a 150%), Dark Mode, Alto Contraste e `largeTouchTargets` persistidos por utilizador no Firestore e aplicados globalmente via `ThemeData` dinâmico.

### 8. Tour Guiado — Onboarding Ativo para Idosos

- O público-alvo (idosos) tem baixa tolerância a interfaces desconhecidas. Implementámos um **sistema de tour guiado** (showcaseview no mobile) em todas as telas principais.
- O tour é **persistido**: no primeiro uso oferece-se automaticamente; depois só aparece se o utilizador clicar no botão "?" — sem spam.
- A persistência é híbrida: `shared_preferences` local (rápido) + Firestore `onboarding/{userId}` (cross-device).
- A Central "Guias do aplicativo" nas Definições permite rever qualquer tutorial quando o utilizador quiser.

### 9. CI/CD Automatizado desde o Início — Mais do que Qualidade de Código

- **Mobile:** GitHub Actions — CI (analyze + test) em todo push/PR; CD (build APK + Firebase App Distribution) só na `master`.
- **Web:** GitHub Actions — CI (lint + type-check + build); CD (Vercel `--prebuilt`) só na `master` após CI passar.
- Isto garantiu que o código que chega à `master` está sempre compilando, testado e distribuído — mesmo trabalhando em velocidade de hackathon.
- **Colaboração assíncrona entre plataformas:** como a web estava sempre deployada no Vercel e o mobile sempre distribuído via App Distribution, cada developer podia **ver o trabalho do outro sem clonar nem subir ambiente**. Por exemplo: eu, como dev Android, pude verificar como a feature de Histórico foi implementada na web simplesmente abrindo o deploy do Vercel — e vice-versa. Isto elimina um dos maiores atritos num projeto multi-plataforma: a necessidade de configurar e correr dois projetos diferentes para entender o que foi feito.
- O CI/CD não foi só uma ferramenta de qualidade — foi também uma ferramenta de **comunicação e transparência** entre as frentes do projeto.

### 10. Kanban e Rastreabilidade — Gestão de Projeto Integrada

- Utilizámos o **GitHub Projects** como quadro Kanban do projeto (https://github.com/users/deytt/projects/3), rastreando tarefas, bugs e melhorias diretamente ligados aos commits e PRs.
- Combinado com o memory-bank (que documenta decisões e progresso) e o CI/CD (que valida e distribui cada mudança), tínhamos uma visão completa do estado do projeto em qualquer momento — sem reuniões de alinhamento desnecessárias.

---

## Estrutura Sugerida para o Vídeo (15 min)

> A preencher e ajustar à medida que o produto estiver mais completo.

| # | Bloco | Duração estimada | Notas |
|---|-------|-----------------|-------|
| 1 | **Problema e público-alvo** — Quem é o idoso digital? O que o SeniorEase resolve? | ~1 min | Persona "Margaret", dados do `productContext.md`: medo de errar, botões pequenos, textos densos |
| 2 | **Processo de Design** — Figma Make → Design System → Figma MCP → código | ~2 min | Protótipo: https://senior-ease.figma.site · Logo "SE" azul · Figma MCP a gerar código Flutter |
| 3 | **Arquitetura do projeto** — Memory-bank, Clean Architecture, plataforma dupla, base Firebase única | ~2 min | Submódulo, ADRs, estrutura de pastas, Cloud Functions, Kanban |
| 4 | **Demo Mobile — fluxo principal** | ~4 min | Ver roteiro detalhado abaixo |
| 5 | **Demo Web** — mesmos fluxos na plataforma web | ~2 min | Deploy Vercel; destacar paridade visual com o mobile |
| 6 | **Acessibilidade em detalhe** — Modo Básico, fonte 150%, Dark Mode, Alto Contraste, espaçamento, tour | ~1 min | Demonstrar ao vivo nas duas plataformas |
| 7 | **Encerramento** — diferenciais, próximos passos, agradecimento | ~1 min | Ligeiro e positivo |

### Roteiro detalhado — Demo Mobile (bloco 4)

> Seguir esta sequência no dispositivo físico. Ter o app instalado via App Distribution com conta de teste pronta.

1. **Abertura da app** — mostrar o ícone "SE" azul no launcher + nome "Senior Ease" no ecrã inicial do dispositivo
2. **Abertura com biometria** — app abre; tela de bloqueio (`/biometric-lock`) surge automaticamente com o logo SeniorEase e o ícone de impressão digital/Face ID; autenticação com biometria nativa; app entra diretamente na Home sem escrever qualquer senha. *(Se biometria não estiver ativada, mostrar o Login normal e ativá-la em Ajustes → Segurança para a próxima abertura.)*
3. **Home** — destacar:
   - Header gradiente azul **contínuo** com o status bar (sem linha de separação — funcionalidade implementada esta sessão)
   - Sininho com **badge vermelho** (contagem de notificações de hoje)
   - Card "Próxima Atividade" ligado ao Firestore em tempo real
4. **Criar tarefa** — título + prazo + passos dinâmicos; mostrar validação em tempo real
5. **Modo Guiado** — iniciar o modo guiado; destacar "**Passo X de Y**" + barra de progresso + **celebração Lottie** ao concluir
6. **Criar lembrete** — criar um lembrete com horário futuro; mencionar que em até 2 minutos chegará uma notificação push real no dispositivo
7. **Notificação push** — fechar o app → aguardar a notificação do sistema aparecer na barra de status → tocar nela → app abre diretamente no item correto
8. **Tela de Notificações** — tocar no sininho; mostrar o histórico de avisos recebidos; tocar num card para navegar à entidade
9. **Preferências de Notificação** — Ajustes → Preferências de Notificação; mostrar os offsets configuráveis por tipo (tarefas e lembretes separados)
10. **Histórico** — stats de streak + lista de atividade recente agrupada por dia; Modo Básico oculta eventos de baixa relevância
11. **Acessibilidade** — aumentar fonte para 150% + ativar Modo Básico (UI simplifica em tempo real) + ligar Dark Mode
12. **Tour Guiado** — tocar no "?" de qualquer tela; mostrar o showcase com balão explicativo; Central "Guias do aplicativo" nas Definições
13. **Ajustes** — mostrar o header gradiente contínuo; perfil com foto + dados persistidos

---

## Frases e Argumentos-Chave

> Ideias de frases para usar na narração do vídeo.

- *"O nosso diferencial não é só o produto — é a forma como o construímos."*
- *"Dois projetos, uma base, zero duplicação de infraestrutura."*
- *"O memory-bank é o único briefing que qualquer dev (ou agente IA) precisa para contribuir imediatamente."*
- *"Acessibilidade foi uma constraint de arquitetura, não um afterthought."*
- *"O Figma Make gerou o protótipo; o Figma Design criou o sistema; o Figma MCP conectou o design ao código."*
- *"O tour guiado existe porque os nossos utilizadores não devem precisar de manual."*
- *"O app desbloqueia com biometria — o idoso não precisa de memorizar password nenhuma para entrar na sua própria app."*
- *"A notificação não é simulada — é uma Cloud Function real que corre a cada minuto e envia um push FCM para o dispositivo."*
- *"O sininho substituiu o SOS: em vez de um botão de emergência, o utilizador tem acesso direto ao histórico de tudo o que o app comunicou com ele."*
- *"O status bar não tem linha de separação — é o mesmo gradiente do header, porque o app deve parecer uma coisa só, não uma janela dentro do sistema operativo."*
- *"Com o CI/CD sempre ativo, eu, como dev Android, sabia exatamente o que estava na web — só abrindo o browser. Sem clonar, sem configurar ambiente, sem esperar."*
- *"O Kanban, o memory-bank e o CI/CD formaram um sistema de gestão de projeto que funcionava mesmo sem reuniões."*

---

## Pendências para o Vídeo

> ⚠️ **ANTES DE ENTREGAR — AÇÕES OBRIGATÓRIAS:**
> - [ ] **Tornar público o repositório Mobile** (está privado atualmente)
> - [ ] **Tornar público o repositório Web** (está privado atualmente)
> - [ ] **Tornar público o Figma Design** (ficheiro de design está privado atualmente)
> - [ ] Verificar se o protótipo https://senior-ease.figma.site continua acessível publicamente

- [ ] Adicionar links dos repositórios e deploy na tabela acima
- [ ] Gravar demo mobile (APK final, fluxo completo)
- [ ] Gravar demo web (deploy Vercel, fluxo completo)
- [ ] Rever e ajustar duração estimada de cada bloco
- [ ] Ensaiar a narração dos diferenciais (secção acima)
- [ ] Gravar e editar o vídeo (máx. 15 min)
- [ ] Submeter na plataforma FIAP
