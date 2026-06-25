# Progress — SeniorEase

> Atualizado por cada dev ao concluir uma tarefa. Use `[x]` para marcar como concluído.
> Última atualização: 2026-06-18 (layout auth + Figma)

---

## Memory Bank

- [x] README.md criado
- [x] projectbrief.md criado
- [x] productContext.md criado
- [x] systemPatterns.md criado
- [x] techContext.md criado
- [x] activeContext.md criado
- [x] progress.md criado
- [x] decisions.md criado
- [x] `.cursor/rules/memory-bank.mdc` criado (template)

---

## Firebase / Infra

- [x] Projeto Firebase criado no console (`seniorease-backend`)
- [x] Firebase Authentication habilitado (Email/Password)
- [x] Coleção `users` criada no Firestore
- [x] Coleção `tasks` criada no Firestore
- [x] Coleção `preferences` criada no Firestore
- [x] Coleção `reminders` criada no Firestore
- [x] Regras de segurança do Firestore configuradas
- [x] Firebase Cloud Messaging habilitado (push notifications)
- [x] Variáveis de ambiente compartilhadas com o time

> Coleções Firestore serão populadas automaticamente pela app na primeira gravação. Apps registadas: Web (`seniorease-web`), Android e iOS (`com.seniorease.mobile`). APNs iOS pendente para fase de push notifications.

---

## CI/CD

- [x] GitHub Actions configurado para Web (CI: lint+types+build em develop/master; CD: Vercel deploy em master)
- [x] GitHub Actions configurado para Mobile (build APK)
- [x] Firebase App Distribution configurado para Mobile

---

## Web Platform — seniorease-web

### Configuração inicial
- [x] Projeto Next.js 16 inicializado com TypeScript
- [ ] Estrutura de pastas Clean Architecture criada (`domain/`, `infrastructure/`, `presentation/`)
- [ ] memory-bank adicionado como submódulo
- [ ] `.cursor/rules/memory-bank.mdc` copiado para o projeto
- [ ] Tailwind CSS configurado com tokens do Design System
- [ ] Firebase SDK configurado
- [ ] Zustand configurado

### Design System (componentes base)
- [ ] Button (Primary, Secondary, Destructive, Ghost)
- [ ] Input (Text, Password, Email)
- [ ] Card
- [ ] Modal de confirmação
- [ ] Toast / Notificação
- [ ] Badge
- [ ] Tema dinâmico (CSS custom properties para fonte, contraste, espaçamento)

### Autenticação
- [ ] Tela Login
- [ ] Tela Register
- [ ] Tela Forgot Password
- [ ] Tela Success Screen
- [ ] Firebase Auth integrado
- [ ] Rota protegida (redirect se não autenticado)

### Dashboard
- [ ] Tela Dashboard

### Módulo 1 — Acessibilidade
- [ ] Tela Accessibility Center
- [ ] Toggle de tamanho de fonte (funcional)
- [ ] Toggle de contraste (funcional)
- [ ] Toggle de espaçamento (funcional)
- [ ] Toggle de Modo Básico / Avançado (funcional)
- [ ] Toggle de feedback visual (funcional)
- [ ] Persistência das preferências no Firestore

### Módulo 2 — Tarefas
- [ ] Tela Task List
- [ ] Tela Task Details
- [ ] Tela Create Task
- [ ] Tela Guided Task Mode (passo a passo)
- [ ] Animação Lottie de celebração ao concluir tarefa
- [ ] Tela Reminder Center
- [ ] Tela History

### Módulo 3 — Perfil / Definições
- [x] Tela Settings — Figma `15:8860` (renomeada de "My Profile")
- [x] Profile banner com gradiente + avatar com iniciais
- [x] 5 rows de navegação (incl. link para Acessibilidade)
- [x] Card "Precisa de Ajuda?" com número 1-800-SENIOR
- [x] Botão "Sair da Conta" com confirmação modal

---

## Mobile App — seniorease-mobile

### Configuração inicial
- [x] Projeto Flutter inicializado
- [x] Estrutura de pastas Feature-First + Clean Architecture criada (ADR-008)
- [x] memory-bank adicionado como submódulo
- [x] `.cursor/rules/memory-bank.mdc` copiado para o projeto
- [x] `flutterfire configure` executado
- [x] Riverpod configurado
- [x] GoRouter configurado

### Design System (widgets base)
- [x] SeniorButton (Primary, Secondary, Outline, Ghost, Destructive)
- [x] SeniorInput (label compacto para campos lado a lado)
- [x] SeniorCard
- [x] SeniorLogo
- [x] SeniorScreenHeader (botão voltar Figma `15:6423`)
- [x] SeniorScreenScaffold
- [x] SeniorFormBody (scroll com altura mínima proporcional)
- [x] Modal de confirmação
- [x] SnackBar / Toast
- [x] Edge-to-edge e system UI (`senior_system_ui.dart`, MainActivity, styles Android)
- [x] ThemeData dinâmico (fonte, contraste via MaterialApp)

### Autenticação
- [x] Tela Login (Figma `15:6210`)
- [x] Tela Register (Figma `15:6415` — nome/sobrenome lado a lado, scroll unificado)
- [x] Tela Forgot Password (Figma `15:6638` — conteúdo centralizado, botão outline)
- [x] Firebase Auth integrado
- [x] Rota protegida

### Home
- [x] Tela Home (Dashboard) — Figma `15:6831`
- [x] Header gradiente com saudação dinâmica + botão SOS
- [x] Grid 2×2 Quick Actions (Nova Tarefa, Acessibilidade, Lembretes, Ajuda Rápida)
- [x] Secção Lembretes de Hoje (placeholder)
- [x] Banner de sucesso
- [x] Bottom Navigation Bar com 5 tabs (StatefulShellRoute)

### Módulo 1 — Acessibilidade
- [x] Tela Accessibility (Figma `15:9085`)
- [x] Toggle de tamanho de fonte (ThemeData dinâmico — 4 passos 87%/100%/120%/150%)
- [x] Toggle de Dark Mode (ThemeMode.dark via buildDynamic)
- [x] Toggle de Alto Contraste (ContrastMode.high / maximum)
- [x] Toggle de Modo Básico / Avançado
- [x] Toggle de Feedback de Áudio e Tátil
- [x] Toggle de Botões Maiores (largeTouchTargets 64×64px)
- [x] ThemeData dinâmico (AppTheme.buildDynamic — escala tipográfica, contraste, touch targets)
- [x] Persistência das preferências no Firestore

### Módulo 2 — Tarefas
- [x] Tela Task List (Figma `15:7134` — header, contador, TaskCard, promo Modo Guiado)
- [x] Tela Task Details (Figma `15:7401` — badges, passos, ações, apagar com confirmação)
- [x] Tela Create Task (Figma `15:7612` — passos dinâmicos com "+" e "X")
- [x] Tela Guided Task (Figma `15:7818` — passo a passo sequencial inteligente)
- [x] Animação Lottie de celebração ao concluir tarefa
- [ ] Tela Reminders
- [ ] Tela History

### Módulo 3 — Perfil
- [ ] Tela Settings
- [ ] Tela Profile (dentro de Settings)
- [ ] Botão Sign Out
- [ ] Persistência de preferências

---

## Vídeo e entrega final

- [ ] Vídeo gravado (máx. 15 min)
- [ ] Vídeo enviado para plataforma FIAP
- [ ] Links dos repositórios submetidos (arquivo `.docx` ou `.txt`)
