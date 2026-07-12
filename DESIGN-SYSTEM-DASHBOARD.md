# 📊 Dashboard — Design System Components

**Status**: Extraído de 11 designs Figma (2026-07-08)  
**Próximo**: Setup Storybook + Stories para cada componente

---

## 🎯 Matriz de Priorização (11 Componentes)

```
┌─────────────────────────────────────────────────────────────┐
│  CRITICAL PATH — Ordem de implementação                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  FASE 1: STORYBOOK SETUP (Dia 1)                             │
│  ├─ npm install @storybook/next                              │
│  ├─ storybook/main.ts + preview.ts                           │
│  └─ Initial build + deployment pipeline                      │
│                                                               │
│  FASE 2: TIER 1 STORIES (Dias 2-3) — BLOQUEADOR             │
│  ├─ 01. Spacing System                    (0.5d) ⭐⭐⭐       │
│  ├─ 02. Buttons                          (1d)   ⭐⭐⭐       │
│  └─ 03. Input Fields + Masks             (2d)   ⭐⭐⭐       │
│                                                               │
│  FASE 3: TIER 2 STORIES (Dias 4-5)                           │
│  ├─ 04. Cards                            (1d)   ⭐⭐⭐       │
│  ├─ 05. Alerts & Notifications           (1d)   ⭐⭐        │
│  └─ 06. Form Controls (+ Toggle comp)    (1d)   ⭐⭐        │
│                                                               │
│  FASE 4: TIER 3 STORIES (Dias 6-7)                           │
│  ├─ 07. Tabs (+ component)               (1.5d) ⭐⭐        │
│  └─ 08. Badges & Labels                  (1d)   ⭐⭐        │
│                                                               │
│  FASE 5: TIER 4 STORIES (Dias 8-9)                           │
│  ├─ 09. Modals & Dialogs                 (1d)   ⭐⭐⭐       │
│  ├─ 10. Toast Notifications              (0.5d) ⭐⭐        │
│  └─ 11. Avatars (+ component)            (1d)   ⭐⭐        │
│                                                               │
│  FASE 6: QA + DEPLOY (Dia 10)                                │
│  ├─ Accessibility audit                                      │
│  ├─ Responsive testing                                       │
│  └─ Storybook deployment                                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📈 Progress by Component

### ⭐ TIER 1 — Foundation (Dependencies: None)

| #   | Component      | Figma  | Existing? | Stories? | Masks? | Est. | Status |
| --- | -------------- | ------ | --------- | -------- | ------ | ---- | ------ |
| 1️⃣  | Spacing System | 2:6608 | —         | ⏳       | —      | 0.5d | 🔲     |
| 2️⃣  | Buttons        | 2:6772 | ✅        | ⏳       | —      | 1d   | 🔲     |
| 3️⃣  | Input Fields   | 2:6945 | ✅        | ⏳       | 🔴     | 2d   | 🔲     |

### ⭐ TIER 2 — Content (Dependencies: Tier 1)

| #   | Component              | Figma  | Existing? | Stories? | Status |
| --- | ---------------------- | ------ | --------- | -------- | ------ |
| 4️⃣  | Cards                  | 2:7128 | ✅        | ⏳       | 🔲     |
| 5️⃣  | Alerts & Notifications | 2:7297 | ✅        | ⏳       | 🔲     |
| 6️⃣  | Form Controls          | 2:7460 | ⚠️        | ⏳       | 🔲     |

### ⭐ TIER 3 — Organization (Dependencies: Tier 1-2)

| #   | Component       | Figma  | Existing? | Stories? | New Comp? | Status |
| --- | --------------- | ------ | --------- | -------- | --------- | ------ |
| 7️⃣  | Tabs            | 2:7621 | ⚠️        | ⏳       | ✅        | 🔲     |
| 8️⃣  | Badges & Labels | 2:7760 | ✅        | ⏳       | —         | 🔲     |

### ⭐ TIER 4 — Interactions (Dependencies: Tier 1-3)

| #    | Component           | Figma  | Existing? | Stories? | New Comp? | Status |
| ---- | ------------------- | ------ | --------- | -------- | --------- | ------ |
| 9️⃣   | Modals & Dialogs    | 2:7912 | ✅        | ⏳       | —         | 🔲     |
| 🔟   | Toast Notifications | 2:8051 | ✅        | ⏳       | —         | 🔲     |
| 1️⃣1️⃣ | Avatars             | 2:8214 | ⚠️        | ⏳       | ✅        | 🔲     |

---

## 🔧 Component Status Legend

```
✅ = Existe (shadcn/custom)     ⏳ = Pendente (Stories)
⚠️ = Parcial (falta refinamento) 🔴 = Crítico (bloqueia outros)
🔲 = Não iniciado              ✔️ = Completo
```

---

## 📋 Checklist — Cada Story Deve Ter

```
[ ] Título descritivo
[ ] Figma node ID como referência
[ ] Todas as variações visíveis
[ ] Tamanhos diferentes (se aplicável)
[ ] Estados (active, hover, disabled, error)
[ ] Exemplos de uso com dados reais
[ ] Design tokens documentados (cores, spacing)
[ ] Notas de acessibilidade:
    - [ ] Tamanho mínimo (44×44px botões, 56×56px targets)
    - [ ] Contraste WCAG AA
    - [ ] Keyboard navigation
    - [ ] Screen reader labels
[ ] Responsividade testada
[ ] Integração com componentes conectados
```

---

## 🎨 Design Tokens Reference

**Spacing (4px unit)**:

```
spacing-1  = 4px  │ spacing-2  = 8px   │ spacing-3  = 12px
spacing-4  = 16px │ spacing-5  = 20px  │ spacing-6  = 24px
spacing-8  = 32px │ spacing-10 = 40px  │ spacing-12 = 48px
spacing-16 = 64px │ spacing-20 = 80px  │ spacing-24 = 96px
```

**Button Heights** (min 44px for touch):

```
Small  = 32px (icon-only: 40px)
Medium = 40px ✅ Accessible
Large  = 48px ✅ Accessible
```

**Avatar Sizes**:

```
Small  = 32px │ Medium  = 40px │ Default = 48px
Large  = 56px │ X-Large = 64px
```

---

## 🚀 Implementation Sequence

### Day 1 — Setup

```bash
npm install --save-dev @storybook/next
npm install --save-dev @storybook/addon-essentials
npm install --save-dev @storybook/addon-a11y
npm install --save-dev @storybook/addon-links
npm install --save-dev @storybook/addon-actions

# Create storybook/main.ts
# Create storybook/preview.ts
# npm run storybook
```

### Days 2-3 — Tier 1 Stories (BLOCKING)

```
✅ Spacing System story
✅ Button stories (all variants + sizes)
✅ Input Fields stories (+ react-input-mask)
```

### Days 4-10 — Remaining Tiers

```
✅ Card, Alert, FormControl stories
✅ Tab, Badge, Modal, Toast stories
✅ Avatar component + stories
```

---

## 📊 Success Metrics

- [ ] 11/11 components documented in Storybook
- [ ] 100% accessibility compliance (WCAG AA)
- [ ] Responsive testing: Mobile, Tablet, Desktop ✅
- [ ] Zero TypeScript errors
- [ ] Storybook deployed to Vercel/Netlify
- [ ] Team can clone & run: `npm run storybook`

---

## 📝 Files to Create/Modify

```
src/presentation/
├── components/
│   ├── ui/
│   │   ├── button.tsx          (✅ exists, add stories)
│   │   ├── input.tsx           (✅ exists, add masks)
│   │   ├── card.tsx            (✅ exists, add stories)
│   │   ├── badge.tsx           (✅ exists, add stories)
│   │   ├── dialog.tsx          (✅ exists, add stories)
│   │   ├── toggle.tsx          (❌ CREATE)
│   │   ├── tabs.tsx            (❌ CREATE)
│   │   ├── avatar.tsx          (❌ CREATE)
│   │   └── ...
│   └── stories/
│       ├── Spacing.stories.tsx
│       ├── Button.stories.tsx
│       ├── Input.stories.tsx
│       ├── Card.stories.tsx
│       ├── Alert.stories.tsx
│       ├── FormControl.stories.tsx
│       ├── Tab.stories.tsx
│       ├── Badge.stories.tsx
│       ├── Modal.stories.tsx
│       ├── Toast.stories.tsx
│       └── Avatar.stories.tsx
└── ...

storybook/
├── main.ts
├── preview.ts
└── preview-head.html (optional)
```

---

## 🎯 Definition of Done (Each Component)

Component is **DONE** when:

1. ✅ Figma design referenced with node ID
2. ✅ All variants visible in Storybook
3. ✅ Code is TypeScript strict mode compliant
4. ✅ Accessibility info documented (sizes, contrast, labels)
5. ✅ Mobile responsive verified
6. ✅ Story builds without errors
7. ✅ Memory-bank updated with progress

---

## 🔗 Related Documents

- **Central Plan**: `seniorease-memory-bank/design-system-components.md`
- **Figma Design System**: Colors (2:6199), Typography (2:6440)
- **Action Plan**: `seniorease-memory-bank/action-plan-hackathon.md`
- **Progress Tracker**: Updated daily via `npm run update-memory-bank`
