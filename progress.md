# Progress — SeniorEase

> Atualizado por cada dev ao concluir uma tarefa. Use `[x]` para marcar como concluído.
> Última atualização: 2026-06-18

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

- [ ] GitHub Actions configurado para Web (build + Vercel deploy)
- [ ] GitHub Actions configurado para Mobile (build APK)
- [ ] Firebase App Distribution configurado para Mobile

---

## Web Platform — seniorease-web

### Configuração inicial
- [ ] Projeto Next.js 14 inicializado com TypeScript
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

### Módulo 3 — Perfil
- [ ] Tela Profile
- [ ] Persistência de preferências via Profile

---

## Mobile App — seniorease-mobile

### Configuração inicial
- [ ] Projeto Flutter inicializado
- [ ] Estrutura de pastas Clean Architecture criada
- [ ] memory-bank adicionado como submódulo
- [ ] `.cursor/rules/memory-bank.mdc` copiado para o projeto
- [ ] `flutterfire configure` executado
- [ ] Riverpod configurado
- [ ] GoRouter configurado

### Design System (widgets base)
- [ ] SeniorButton (variantes)
- [ ] SeniorInput
- [ ] SeniorCard
- [ ] Modal de confirmação
- [ ] SnackBar / Toast
- [ ] ThemeData dinâmico (fonte, contraste via MaterialApp)

### Autenticação
- [ ] Tela Login
- [ ] Tela Register
- [ ] Tela Forgot Password
- [ ] Firebase Auth integrado
- [ ] Rota protegida

### Home
- [ ] Tela Home (Dashboard)

### Módulo 1 — Acessibilidade
- [ ] Tela Accessibility
- [ ] Toggle de tamanho de fonte (ThemeData dinâmico)
- [ ] Toggle de contraste
- [ ] Toggle de espaçamento
- [ ] Toggle de Modo Básico / Avançado
- [ ] Toggle de feedback visual
- [ ] Persistência das preferências no Firestore

### Módulo 2 — Tarefas
- [ ] Tela Task List
- [ ] Tela Task Details
- [ ] Tela Create Task
- [ ] Tela Guided Task (passo a passo)
- [ ] Animação Lottie de celebração ao concluir tarefa
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
