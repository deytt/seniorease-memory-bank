# Design System Components — Plano de Implementação

> **11 Componentes do Figma para Storybook + Web**  
> **Data**: 2026-07-08  
> **Status**: 🔴 CRÍTICO — Bloqueador para Storybook

---

## 📋 Componentes a Implementar

### ✅ 1. Spacing System (node 2:6608)

**O que é**: Sistema de espaçamento (4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px)  
**Prioridade**: 🔴 **CRÍTICA** (base para todos os outros)  
**Tarefas**:

- [ ] Usar tokens Tailwind existentes: `space-1` (4px), `space-2` (8px), etc.
- [ ] Documentar em Storybook (assets page)
- [ ] Criar página visual: `/design/spacing` ou Storybook story

**Status**: `[ ]` Não iniciado  
**ETA**: 0.5 dias

---

### ✅ 2. Buttons (node 2:6772)

**O que é**:

- Tamanhos: Small (11px), Medium (14px), Large (16px)
- Variantes: Primary, Secondary, Success, Danger, Outline, Ghost, Disabled
- Estados: Com ícones, Full Width
- Acessibilidade: Min 44×44px (Small OK, Medium OK, Large OK)

**Prioridade**: 🔴 **CRÍTICA** (componente base)  
**Status**: ✅ Já existe em `src/presentation/components/ui/button.tsx` via shadcn  
**Tarefas**:

- [ ] Criar stories no Storybook com todas as variantes
- [ ] Verificar altura mínima de acessibilidade (44×44px)
- [ ] Documentar ícones integrados

**Status**: `[x]` Componente pronto, `[ ]` Storybook story pendente  
**ETA**: 1 dia

---

### ✅ 3. Input Fields (node 2:6945)

**O que é**:

- Text Input com placeholder
- Password Input com toggle visibility
- Search Input com ícone
- Select/Dropdown
- Textarea
- Estados: Success (verde), Error (vermelho), Disabled, Read-only

**Prioridade**: 🔴 **ALTA** (formulários críticos)  
**Status**: ✅ Existe `src/presentation/components/ui/input.tsx` via shadcn  
**Tarefas**:

- [ ] Adicionar suporte a ícones (prefix/suffix)
- [ ] Criar validation feedback (success/error com cores)
- [ ] Stories com todos os tipos + estados
- [ ] Integrar máscaras (CPF, Telefone, Data, CEP) — usar `react-input-mask`

**Status**: `[ ]` Componente pronto, `[ ]` Validação/máscaras pendentes  
**ETA**: 2 dias

---

### ✅ 4. Cards (node 2:7128)

**O que é**:

- Basic Card (branco com borda sutil)
- Featured Card (fundo azul claro, destacado)
- Success Card (verde)
- Task Card (com badge + ações)
- Reminder Card (com hora e status)
- Summary Card (azul com stats)

**Prioridade**: 🟡 **MÉDIA** (componentes aplicados já existem)  
**Status**: ✅ `src/presentation/components/ui/card.tsx` existe via shadcn  
**Tarefas**:

- [ ] Stories de todas as variações
- [ ] Exemplos com conteúdo real (tasks, reminders)

**Status**: `[ ]` Não iniciado  
**ETA**: 1 dia

---

### ✅ 5. Alerts & Notifications (node 2:7297)

**O que é**:

- Information Alert (azul, ℹ️)
- Success Alert (verde, ✓)
- Reminder Alert (amarelo, ⚠️)
- Action Required Alert (vermelho, ⚠️)
- Dismissible com X button

**Prioridade**: 🟡 **MÉDIA** (feedback visual importante)  
**Status**: ✅ Existe via shadcn `Alert` component  
**Tarefas**:

- [ ] Stories com 4 tipos + estados
- [ ] Verificar contraste (acessibilidade)

**Status**: `[ ]` Não iniciado  
**ETA**: 1 dia

---

### ✅ 6. Form Controls (node 2:7460)

**O que é**:

- Checkboxes (Take morning medication, Morning walk, Family call)
- Radio Buttons (High/Medium/Low Priority)
- Toggle Switches (Reminders on/off, Audio feedback, etc.)
- Estados: Checked, Unchecked, Disabled

**Prioridade**: 🟡 **MÉDIA** (acessibilidade importante)  
**Status**: Parcial (checkboxes/radios existem, toggles customizados no accessibility.tsx)  
**Tarefas**:

- [ ] Criar componente `Toggle` unificado
- [ ] Stories com todos os estados
- [ ] Garantir labels acessíveis (56×56px touch target)

**Status**: `[ ]` Toggle component pendente  
**ETA**: 1 dia

---

### ✅ 7. Tabs (node 2:7621)

**O que é**:

- Pill Style Tabs (rounded): Today, This Week, Completed, Archived
- Underline Style Tabs: All, Medication, Appointments, Routines
- Active state com cor azul
- Tab content area

**Prioridade**: 🟡 **MÉDIA** (usado em Task List, Reminders)  
**Status**: Parcial (usamos filtros em vez de tabs componentes)  
**Tarefas**:

- [ ] Criar componente `Tabs` (se não existir)
- [ ] Stories com ambos os estilos
- [ ] Integrar em Task List e Reminders

**Status**: `[ ]` Não iniciado  
**ETA**: 1.5 dias

---

### ✅ 8. Badges & Labels (node 2:7760)

**O que é**:

- Status Badges: Completed (green), In Progress (yellow), High Priority (red), Medication, Health, Social, Exercise, Scheduled
- Counter Badges: Tasks (1), Alerts (3), Achievements (1)

**Prioridade**: 🟡 **MÉDIA** (visual enhancement)  
**Status**: ✅ Existe via shadcn `Badge` component  
**Tarefas**:

- [ ] Stories com todas as cores/tipos
- [ ] Integrar em componentes existentes (Task, Reminder, etc.)

**Status**: `[ ]` Não iniciado  
**ETA**: 1 dia

---

### ✅ 9. Modals & Dialogs (node 2:7912)

**O que é**:

- Task Completed Modal (com celebração 🎉, pontos earned, ações)
- Confirmation Dialog (Delete, Logout, etc.)
- Overlay (dark semi-transparent)

**Prioridade**: 🔴 **ALTA** (crítico para UX)  
**Status**: ✅ Existe via shadcn `Dialog` component  
**Tarefas**:

- [ ] Task Completed story (simular Lottie animation)
- [ ] Confirmation Dialog story
- [ ] Integrar em ações (mark complete, delete, logout)

**Status**: `[ ]` Não iniciado  
**ETA**: 1 dia

---

### ✅ 10. Toast Notifications (node 2:8051)

**O que é**:

- Success Toast (verde)
- Reminder Toast (azul)
- Warning Toast (amarelo)
- Error Toast (vermelho)
- Auto-dismiss após 5s

**Prioridade**: 🟡 **MÉDIA** (feedback de ações)  
**Status**: ✅ Existe via `sonner` package  
**Tarefas**:

- [ ] Stories com todos os tipos
- [ ] Verificar se usar `sonner` ou criar customizado

**Status**: `[ ]` Não iniciado  
**ETA**: 0.5 dias

---

### ✅ 11. Avatars (node 2:8214)

**O que é**:

- Tamanhos: Small (32px), Medium (40px), Default (48px), Large (56px), X-Large (64px)
- Variantes: Com iniciais (azul background), Com imagem, Sem foto (ícone placeholder)

**Prioridade**: 🟡 **MÉDIA** (profil component)  
**Status**: Parcial (existe em Profile page, não é componente reutilizável)  
**Tarefas**:

- [ ] Criar componente `Avatar` reutilizável
- [ ] Stories com todas as variações
- [ ] Suporte a imagem ou iniciais

**Status**: `[ ]` Não iniciado  
**ETA**: 1 dia

---

## 📊 Resumo de Status

| #   | Componente     | Status       | ETA  | Prioridade |
| --- | -------------- | ------------ | ---- | ---------- |
| 1   | Spacing System | ⏳           | 0.5d | 🔴         |
| 2   | Buttons        | ⏳ Storybook | 1d   | 🔴         |
| 3   | Input Fields   | ⏳ Máscaras  | 2d   | 🔴         |
| 4   | Cards          | ⏳           | 1d   | 🟡         |
| 5   | Alerts         | ⏳           | 1d   | 🟡         |
| 6   | Form Controls  | ⏳ Toggle    | 1d   | 🟡         |
| 7   | Tabs           | ⏳           | 1.5d | 🟡         |
| 8   | Badges         | ⏳           | 1d   | 🟡         |
| 9   | Modals         | ⏳           | 1d   | 🔴         |
| 10  | Toasts         | ⏳           | 0.5d | 🟡         |
| 11  | Avatars        | ⏳           | 1d   | 🟡         |

**Total ETA**: ~11 dias (sequencial) ou ~3-4 dias (paralelo)

---

## 🎯 Fases de Implementação

### Fase 1 — CRÍTICA (3-4 dias)

1. Storybook setup + CI/build
2. Spacing System page
3. Buttons stories
4. Input Fields + máscaras
5. Modals & Dialogs

### Fase 2 — MÉDIA (2-3 dias)

6. Cards stories
7. Alerts stories
8. Form Controls (Toggle component)
9. Tabs component
10. Badges stories

### Fase 3 — FINALIZAÇÃO (1-2 dias)

11. Toast Notifications stories
12. Avatars component
13. Deploy Storybook
14. Verificação de acessibilidade global

---

## 📋 Checklist de Conformidade

**Cada story deve ter**:

- [ ] Descrição clara
- [ ] Todas as variações visíveis
- [ ] Exemplos de uso
- [ ] Tokens/cores documentadas
- [ ] Acessibilidade info (tamanho mínimo, contraste)
- [ ] Notas sobre responsividade

**Acessibilidade obrigatória**:

- [ ] Botões: min 44×44px ✅
- [ ] Inputs: labels claros + feedback visual ✅
- [ ] Contraste WCAG AA mínimo ✅
- [ ] Touch targets: 56×56px recomendado ✅
- [ ] Keyboard navigation testada ✅

---

## 🚀 Próximos Passos

1. **Hoje**: Configurar Storybook
2. **Amanhã**: Comissionar Spacing + Buttons stories
3. **Esta semana**: Completar Fase 1
4. **Próxima semana**: Fase 2 + deploy

---

## 📝 Notas Importantes

- **Não duplicar**: Muitos componentes já existem via shadcn
- **Storybook é OBRIGATÓRIO para hackathon**
- **Cada story deve ser visual + documentada**
- **Acessibilidade é requisito de avaliação**
- **Memory-bank deve ser atualizado conforme progresso**
