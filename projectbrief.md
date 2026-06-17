# Project Brief — SeniorEase

> Este documento é a **fonte da verdade** dos requisitos do projeto. Não deve ser alterado sem decisão coletiva do time.

---

## Contexto

O **SeniorEase** é o projeto final (Hackathon) de pós-graduação da FIAP. O briefing foi desenvolvido pela instituição FIAP Inclusive com o objetivo de melhorar a experiência digital de pessoas idosas em ambientes acadêmicos e profissionais.

O projeto deve conter versão **Web** e versão **Mobile**, com coerência visual e cognitiva entre as duas plataformas.

---

## Problemas que o produto resolve

Usuários idosos relataram dificuldades com:
- Excesso de informação na tela
- Botões pequenos e pouco visíveis
- Textos com fonte reduzida
- Baixo contraste entre elementos
- Navegação pouco intuitiva
- Ausência de feedback claro após ações
- Fluxos com muitas etapas e pouca orientação
- Perda gradual de memória
- Dificuldades de visão
- Redução da coordenação motora fina
- Menor familiaridade com padrões modernos de navegação
- Insegurança ao utilizar plataformas digitais
- Medo de cometer erros irreversíveis
- Dificuldade em compreender fluxos complexos

---

## Módulos obrigatórios

### Módulo 1 — Painel de Personalização da Experiência

Um painel onde o usuário pode ajustar:

- **Tamanho da fonte** — escala ajustável (pequeno, médio, grande, extra grande)
- **Nível de contraste** — padrão, alto contraste, contraste máximo
- **Espaçamento entre elementos** — compacto, confortável, espaçoso
- **Modo de interface** — Básico (interface simplificada) / Avançado (interface completa)
- **Feedback visual reforçado** — ativação de animações e confirmações visuais extras

> Nota de implementação: A opção de "confirmação adicional antes de ações críticas" é um comportamento **sempre ativo** no app — não é configurável pelo usuário. O Modo Básico implica automaticamente maior cautela e clareza na interface.

### Módulo 2 — Organizador de Atividades Simplificado

Um sistema de organização com foco em clareza e previsibilidade:

- **Lista de tarefas** com visual simples e direto
- **Etapas guiadas** para execução de atividades (passo a passo com progresso visível)
- **Lembretes** com linguagem clara e objetiva
- **Avisos de conclusão** com feedback positivo (animação Lottie de celebração)
- **Histórico** simples de atividades realizadas

### Módulo 3 — Perfil do Usuário + Configurações Persistentes

Armazenar e persistir no Firebase:

- Tamanho de fonte escolhido
- Nível de contraste
- Modo de interface (Básico / Avançado)
- Preferências de lembretes e notificações
- Configurações de espaçamento

---

## Requisitos de Acessibilidade (obrigatório e avaliado)

- Ajustes **reais** de legibilidade (fonte, contraste, espaçamento funcionando de fato na UI)
- Botões e áreas clicáveis ampliadas (mínimo 44×44px, ideal 56×56px)
- Feedback claro após cada ação
- Redução de complexidade visual
- Navegação previsível e consistente
- Fluxos guiados passo a passo com indicador de progresso ("Passo X de Y")
- Animações suaves e controláveis

---

## Requisitos técnicos

### Arquitetura
- **Clean Architecture** obrigatória: camada de domínio isolada, casos de uso independentes de UI, adaptadores e interfaces bem definidos
- Separação clara entre módulos: painel, tarefas, perfil, configurações

### Web
- React, Angular **ou** Next.js — escolha do time: **Next.js 14+ (App Router)**
- TypeScript obrigatório
- SSR/SSG onde aplicável

### Mobile
- Flutter **ou** React Native — escolha do time: **Flutter**
- Foco em dispositivos móveis (iOS e Android)
- A versão mobile deve manter coerência visual e cognitiva com a versão Web

### Backend
- **Firebase** como backend compartilhado (Auth, Firestore, Storage, Cloud Messaging)

### Boas práticas
- Testes
- CI/CD
- Documentação no README de cada repositório

---

## Telas por plataforma

### Web Platform (13 telas)

**Autenticação:**
1. Login
2. Register
3. Forgot Password
4. Success Screen

**Aplicação principal:**
5. Dashboard
6. Accessibility Center (Módulo 1)
7. Task List (Módulo 2)
8. Task Details (Módulo 2)
9. Create Task (Módulo 2)
10. Guided Task Mode (Módulo 2)
11. Reminder Center (Módulo 2)
12. History (Módulo 2)
13. Profile (Módulo 3)

### Mobile App (13 telas)

**Autenticação:**
1. Login
2. Register
3. Forgot Password

**Aplicação principal:**
4. Home (Dashboard)
5. Task List (Módulo 2)
6. Task Details (Módulo 2)
7. Create Task (Módulo 2)
8. Guided Task (Módulo 2)
9. Reminders (Módulo 2)
10. History (Módulo 2)
11. Settings (contém Profile) (Módulo 3)
12. Profile (dentro de Settings) (Módulo 3)
13. Accessibility (Módulo 1)

---

## User Flows documentados (Figma)

1. **Login Flow** — autenticação em ambas as plataformas
2. **Accessibility Setup** — configuração inicial do painel de acessibilidade (inclui escolha do Modo Básico/Avançado)
3. **Task Creation** — criar nova tarefa com título, descrição e etapas
4. **Guided Task** — executar tarefa no modo guiado passo a passo
5. **Reminder Flow** — configurar e receber lembretes

---

## Entregáveis

- [ ] Repositório `seniorease-web` no GitHub com README completo
- [ ] Repositório `seniorease-mobile` no GitHub com README completo
- [ ] Vídeo explicativo de até **15 minutos** cobrindo cada decisão e feature
- [ ] Link do vídeo e dos repositórios submetidos na plataforma FIAP (arquivo `.docx` ou `.txt`)

---

## Referências do Figma

| Seção | Link |
|---|---|
| Web Platform | https://www.figma.com/design/3avWJD9n4gI9mZHw9dksIy/SeniorEase?node-id=15-2 |
| Mobile App | https://www.figma.com/design/3avWJD9n4gI9mZHw9dksIy/SeniorEase?node-id=15-6101 |
| Design System | https://www.figma.com/design/3avWJD9n4gI9mZHw9dksIy/SeniorEase?node-id=2-2397 |
| User Flows | https://www.figma.com/design/3avWJD9n4gI9mZHw9dksIy/SeniorEase?node-id=15-9211 |
| Accessibility | https://www.figma.com/design/3avWJD9n4gI9mZHw9dksIy/SeniorEase?node-id=2-2399 |
| Protótipo publicado | https://square-big-15985298.figma.site/ |
