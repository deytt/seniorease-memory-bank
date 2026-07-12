# Plano de Ação Hackathon — SeniorEase

> **Versão**: 1.0  
> **Data Criação**: 2026-07-08  
> **Status**: 🔴 CRÍTICO — Requisitos obrigatórios pendentes  
> **Última atualização**: Pela IA — 2026-07-08

---

## 🎯 Resumo Executivo

Há **requisitos obrigatórios do hackathon que NÃO foram implementados** na plataforma web. Este plano lista tudo o que precisa ser feito para cumprir com o briefing, com prioridades claras e critérios de aceite.

---

## 📊 Status Geral por Módulo

| Módulo                        | Completude | Bloqueadores                           | Prioridade |
| ----------------------------- | ---------- | -------------------------------------- | ---------- |
| **Módulo 1 - Acessibilidade** | 95%        | Storybook docs                         | 🟡 Média   |
| **Módulo 2 - Tarefas**        | 90%        | Ordenação, FCM Web                     | 🔴 Alta    |
| **Módulo 3 - Perfil**         | 85%        | Upload foto, Senha real, CPF mascarado | 🔴 Alta    |
| **Design System / Storybook** | 0%         | Necessário começar                     | 🔴 CRÍTICA |
| **Documentation**             | 50%        | Storybook, Color/Typo pages            | 🔴 Alta    |

---

## 🔴 REQUISITOS CRÍTICOS NÃO IMPLEMENTADOS

### ❌ 1. Storybook — Documentação de componentes

**O que é**: Plataforma de documentação interativa para todos os componentes.  
**Por que é obrigatório**: Hackathon exige documentação de todos os componentes + variações + estados.  
**Status**: `[ ]` Não iniciado  
**Prioridade**: 🔴 **CRÍTICA**  
**Dependências**: Nenhuma (pode começar agora)

**Tarefas**:

- [ ] Instalar Storybook no projeto web (`npm install --save-dev @storybook/next`)
- [ ] Configurar `storybook/main.ts` e `storybook/preview.ts`
- [ ] Criar pasta `src/presentation/components/**/*.stories.tsx`
- [ ] Stories de Design System:
  - [ ] Button (Primary, Secondary, Destructive, Ghost, sizes)
  - [ ] Input (Text, Password, Email, disabled, error)
  - [ ] Card
  - [ ] Badge
  - [ ] Modal/Dialog
  - [ ] Toast
- [ ] Stories de componentes customizados:
  - [ ] TaskCard
  - [ ] ReminderCard
  - [ ] PreferenceToggle
  - [ ] AccessibilitySettings
  - [ ] HistoryTimeline
- [ ] Documentação com MDX (descrição, props, exemplos)
- [ ] Build & deploy Storybook (ex: Vercel ou GitHub Pages)

**Critério de Aceite**:

- Storybook roda em `npm run storybook`
- Mínimo 15 stories documentadas
- Todos os componentes têm variações (tamanho, estado, disabled)
- Cores e tokens visíveis

---

### ❌ 2. Upload de Foto de Perfil — Firebase Storage

**O que é**: Usuário consegue fazer upload de foto para Firebase Storage.  
**Por que é obrigatório**: Módulo 3 — "Perfil do Usuário + Configurações Persistentes".  
**Status**: `[ ]` UI pronta, lógica pendente  
**Prioridade**: 🔴 **Alta**  
**Dependências**: Firebase Storage já configurado

**Tarefas**:

- [ ] Implementar `uploadProfilePhotoUseCase` em `domain/usecases/user/`
- [ ] Chamar Firebase Storage em `infrastructure/firebase/FirebaseStorageRepository`
- [ ] Path: `profile_photos/{userId}/{timestamp}.jpg`
- [ ] Atualizar documento user em Firestore com `photoUrl`
- [ ] Mostrar loading durante upload
- [ ] Handle de erro (mostrar toast/alert)
- [ ] Testar com arquivo real

**Critério de Aceite**:

- Clique em "Alterar Foto de Perfil" → abre file picker
- Selecionar imagem → faz upload para Storage
- Após upload → atualiza avatar na UI
- Reload página → foto persiste (lida do Firestore)

---

### ❌ 3. Alterar Senha — Firebase `updatePassword`

**O que é**: Formulário de alteração de senha com validação real Firebase.  
**Por que é obrigatório**: Módulo 3 — "Configurações Persistentes" + Segurança.  
**Status**: `[ ]` UI existe, lógica não  
**Prioridade**: 🔴 **Alta**  
**Dependências**: Firebase Auth

**Tarefas**:

- [ ] Criar `UpdatePasswordUseCase` em `domain/usecases/auth/`
- [ ] Validar senha atual com `reauthenticateWithCredential`
- [ ] Chamar `updatePassword(newPassword)`
- [ ] Mostrar confirmação e erros
- [ ] Testar mudanças de senha

**Critério de Aceite**:

- Formulário com: Senha Atual, Senha Nova, Confirmar Senha
- Validação: senha nova ≠ senha atual, min 8 chars
- Clique em "Atualizar" → sucesso ou erro
- Após sucesso → logout automático para re-login

---

### ❌ 4. CPF Oculto em Modo Básico

**O que é**: Se `interfaceMode === "basic"`, CPF mostra apenas últimos 3 dígitos (ex: `***-***-***-42`).  
**Por que é obrigatório**: Hackathon — "Modo Básico" deve simplificar visual e reduzir informação.  
**Status**: `[ ]` Não implementado  
**Prioridade**: 🟡 **Média**  
**Dependências**: CPF já sendo salvo (precisa mascarar na exibição)

**Tarefas**:

- [ ] Ler `preferences.interfaceMode` na tela de Perfil
- [ ] Se `basic` → formatador que retorna `***-***-***-XX` (últimos 3 dígitos)
- [ ] Aplicar em `<ProfilePage>` e `<EditProfilePage>`

**Critério de Aceite**:

- Modo Avançado → CPF visível: `123-456-789-00`
- Modo Básico → CPF oculto: `***-***-***-00`
- Muda dinamicamente ao trocar modo de interface

---

### ❌ 5. Mascaras de Input — Telefone, CPF, Data, CEP

**O que é**: Validação + formatação automática em inputs de dados pessoais.  
**Por que é obrigatório**: Acessibilidade para idosos — evitar erros de entrada.  
**Status**: `[ ]` Não implementado  
**Prioridade**: 🟡 **Média**  
**Dependências**: Instalar lib (ex: `react-input-mask` ou `imask`)

**Tarefas**:

- [ ] Escolher lib: `react-input-mask` ou `imask`
- [ ] Instalar dependência
- [ ] Criar componentes wrapper: `MaskedInput`
- [ ] Aplicar em formulários:
  - [ ] CPF: `999.999.999-99`
  - [ ] Telefone: `(99) 99999-9999`
  - [ ] Data: `DD/MM/YYYY`
  - [ ] CEP: `99999-999`
- [ ] Integrar em `EditProfilePage` e `CreateTaskPage`

**Critério de Aceite**:

- Digitar telefone sem formatação → auto-formata
- Validação rejeita input inválido
- Salva no Firestore sem a máscara (apenas dígitos)

---

### ❌ 6. Email Verification UI — Firebase Email Verification

**O que é**: Link "Verificar e-mail" que dispara `sendEmailVerification()` e mostra status.  
**Por que é obrigatório**: Módulo 3 — Segurança + Verificação de conta.  
**Status**: `[ ]` Não implementado  
**Prioridade**: 🟡 **Média**  
**Dependências**: Firebase Auth

**Tarefas**:

- [ ] Adicionar `sendVerificationEmailUseCase` em `domain/usecases/auth/`
- [ ] Integrar em `<ProfilePage>` — badge "E-mail não verificado" se `!user.emailVerified`
- [ ] Botão "Enviar Link de Verificação"
- [ ] Toast: "Link de verificação enviado para {email}"
- [ ] Check `user.emailVerified` após verificação

**Critério de Aceite**:

- Se e-mail não verificado → mostra badge + botão
- Clique no botão → Firebase envia e-mail
- Toast confirma envio
- Após verificar no e-mail → badge desaparece no reload

---

### ❌ 7. Tela "Sobre" (About) — Informações da App

**O que é**: Página simples com: Versão, Licença, Créditos, Link para Suporte.  
**Por que é obrigatório**: Navegação completa + Informações legais.  
**Status**: `[ ]` Não existe rota  
**Prioridade**: 🟡 **Média**  
**Dependências**: Nenhuma

**Tarefas**:

- [ ] Criar `src/app/(app)/about/page.tsx`
- [ ] Conteúdo:
  - [ ] Logo SeniorEase
  - [ ] "SeniorEase v1.0"
  - [ ] "Plataforma de inclusão digital para idosos"
  - [ ] "© 2026 FIAP Inclusive"
  - [ ] Link: "Precisa de ajuda? 1-800-SENIOR"
  - [ ] Link: "Termos de Uso"
  - [ ] Link: "Política de Privacidade"
- [ ] Adicionar link no menu Perfil (`/profile` → link para `/about`)

**Critério de Aceite**:

- Rota `/about` acessível
- Informações visíveis e bem formatadas
- Links funcionam (termos/privacidade já existem?)

---

### ❌ 8. Card "Precisa de Ajuda?" — Suporte ao Usuário

**O que é**: Card na tela de Perfil com número de telefone e descrição de suporte.  
**Por que é obrigatório**: Acessibilidade — idosos devem ter caminho claro para suporte.  
**Status**: `[ ]` Não implementado  
**Prioridade**: 🟡 **Média**  
**Dependências**: Nenhuma

**Tarefas**:

- [ ] Adicionar card em `<ProfilePage>` após seção de Segurança
- [ ] Conteúdo:
  ```
  📞 Precisa de Ajuda?
  Ligue para 1-800-SENIOR (1-800-734-6476)
  Segunda a Sexta, 8h às 18h
  ```
- [ ] Botão: "Ligar" (href: `tel:+1-800-734-6476`)
- [ ] Design consistente com outros cards

**Critério de Aceite**:

- Card visível em Perfil
- Botão "Ligar" abre aplicativo de telefone (ou mostra número)

---

## 🟡 REQUISITOS COM IMPLEMENTAÇÃO PARCIAL

### ⏳ 9. FCM Web + Service Worker — Push Notifications

**O que é**: Push notifications via Firebase Cloud Messaging no navegador.  
**Por que é importante**: Módulo 2 — "Lembretes com linguagem clara".  
**Status**: `[ ]` Infraestrutura existe (Firebase config), web service worker não  
**Prioridade**: 🟡 **Média** (pode ser entregue como "próxima fase")  
**Dependências**: Firebase Messaging

**Tarefas**:

- [ ] Criar `public/firebase-messaging-sw.js` (service worker)
- [ ] Registrar SW no app
- [ ] Pedir permissão de notificação ao usuário
- [ ] Ao criar lembrete/tarefa → chamar FCM para agendamento
- [ ] Handler de clique na notificação

**Critério de Aceite**:

- Permissão de notificação pedida
- Ao criar tarefa/lembrete → notificação aparece no navegador
- Clique na notificação → navega para página relevante

---

### ⏳ 10. Ordenação por Due Date — Task List

**O que é**: Tarefas ordenadas por data de vencimento (ascendente).  
**Por que é importante**: UX — tarefas urgentes aparecem primeiro.  
**Status**: `[ ]` Filtros existem, ordenação não  
**Prioridade**: 🟡 **Média**  
**Dependências**: Repositório de tarefas

**Tarefas**:

- [ ] Em `TaskRepository.getTasks()` → adicionar `.orderBy('dueDate', 'asc')`
- [ ] Testar em Task List

**Critério de Aceite**:

- Tarefas com dueDate mais próximas aparecem primeiro
- Tarefas sem dueDate aparecem por último

---

### ⏳ 11. Card "Próxima Atividade" Isolado — Dashboard

**O que é**: Em vez de listar todas as tarefas, mostrar apenas a próxima atividade urgente.  
**Por que é importante**: Simplificação visual para modo Básico + Modo Avançado.  
**Status**: `[ ]` Seção "Tarefas de Hoje" lista multiplas  
**Prioridade**: 🟡 **Média**  
**Dependências**: Task repository

**Tarefas**:

- [ ] Refatorar `<DashboardPage>` — mudar de lista para card único
- [ ] Lógica: pegar tarefa com menor `dueDate` de hoje
- [ ] Design: card grande com ação primária "Iniciar"
- [ ] Se não há tarefas → mensagem "Parabéns! Sem atividades por agora"

**Critério de Aceite**:

- Dashboard mostra apenas 1 tarefa (próxima)
- Card grande com botão "Iniciar"

---

## 🟢 DESIGN SYSTEM COMPONENTS — Do Figma

### Design System Pages (Documentação)

**Componentes do Figma a implementar**:

#### 1. **Color Palette Page** (node 2:6199)

- Mostrar todas as brand colors
- Escala de grays (Slate 50 → 900)
- Cores semânticas (Success, Warning, Danger, Info)
- Tokens CSS correspondentes
- Status: `[ ]` Criar página em `/design/colors`

#### 2. **Typography Scale Page** (node 2:6440)

- Mostrar todos os níveis de texto (text-4xl → text-xs)
- Tamanho de fonte, line-height, letter-spacing
- Exemplo de uso (heading, body, caption, etc.)
- Status: `[ ]` Criar página em `/design/typography`

---

## 📅 Cronograma Proposto

| Semana              | Tarefas                                 | Equipe     |
| ------------------- | --------------------------------------- | ---------- |
| **Semana 1** (Esta) | Storybook + Upload foto + Alterar senha | Web        |
| **Semana 2**        | Mascaras + CPF oculto + Email verify    | Web        |
| **Semana 2**        | Design System docs (Color + Typography) | Design/Web |
| **Semana 3**        | Tela About + Card Ajuda + Ordenação     | Web        |
| **Semana 4**        | FCM Web + Next Activity Card + Testes   | Web        |

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

1. **Hoje (2026-07-08)**:
   - [ ] Iniciar instalação Storybook
   - [ ] Começar implementação de Upload Foto
   - [ ] Atualizar memory-bank conforme progresso

2. **Amanhã (2026-07-09)**:
   - [ ] Storybook com 5 stories básicas
   - [ ] Upload foto funcional
   - [ ] Alterar senha implementado

3. **Esta semana**:
   - [ ] Storybook com 15+ stories
   - [ ] 4 requisitos críticos concluídos
   - [ ] Memory-bank sincronizado

---

## 📝 Notas importantes

- **Memory Bank**: Deve ser atualizado automaticamente conforme cada tarefa é concluída
- **Coordenação**: Outros integrantes usam esse arquivo para rastrear progresso
- **Código**: Sempre seguir Clean Architecture + TypeScript
- **Testes**: Cada feature deve ter testes unitários simples (Vitest)

---

## 📋 Checklist de Conformidade Hackathon

- [ ] Módulo 1 — Acessibilidade: 100% completo
- [ ] Módulo 2 — Tarefas: 100% completo
- [ ] Módulo 3 — Perfil: 100% completo
- [ ] Design System documentado (Storybook)
- [ ] Clean Architecture mantida
- [ ] TypeScript sem erros
- [ ] Código português consistente
- [ ] Acessibilidade (botões 56×56px, contraste OK)
- [ ] Responsivo (mobile + desktop)
- [ ] Testes básicos implementados
