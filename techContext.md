# Tech Context — SeniorEase

Stack completa, tokens do Design System, schema Firebase e configurações de ambiente.

---

## Stack

### Web — seniorease-web

| Tecnologia | Versão | Motivo |
|---|---|---|
| Next.js | 16+ (App Router) | SSR/SSG, roteamento, performance |
| TypeScript | 5+ | Tipagem estática obrigatória |
| Tailwind CSS | 3+ | Design System via CSS custom properties |
| Zustand | 4+ | State management simples e performático |
| Firebase SDK | 10+ | Auth, Firestore, Storage |
| Lottie React | última | Animações de celebração ao concluir tarefas |
| React Hook Form | última | Formulários com validação |
| Zod | última | Validação de schemas |

#### Fonte dos design tokens web

`seniorease-web/src/app/globals.css` é a fonte única dos tokens da aplicação
web. O arquivo reúne as custom properties, os overrides de tema e contraste e
o mapeamento semântico do Tailwind em `@theme inline`. O layout raiz, o
Storybook, o shadcn e o Tailwind devem consumir esse mesmo arquivo; não criar
folhas paralelas de tokens.

### Mobile — seniorease-mobile

| Tecnologia | Versão | Motivo |
|---|---|---|
| Flutter | 3.x (stable) | Cross-platform iOS + Android |
| Dart | 3.x | Linguagem do Flutter |
| Firebase Flutter SDK | última | Auth, Firestore, Storage |
| firebase_messaging | ^16.x | Push notifications FCM (GAP-002, ADR-020) |
| google_sign_in | 6.x | Login social com Google (OAuth) — ADR-015 |
| Riverpod | 2+ | State management reativo |
| GoRouter | última | Navegação declarativa |
| Lottie Flutter | última | Animações de celebração |
| Flutter Hooks | última | Hooks no Flutter (opcional) |

### Backend — Firebase (compartilhado)

| Serviço | Uso |
|---|---|
| Firebase Auth | Autenticação (Email/Password + Google OAuth; verificação de e-mail) |
| Cloud Firestore | Banco de dados principal |
| Firebase Storage | Upload de imagens de perfil (futuro) |
| Firebase Cloud Messaging (FCM) | Push notifications configuráveis (tasks + reminders, offsets variáveis, ADR-020) |
| Cloud Functions (Node 20 / TypeScript) | Cron `sendDueNotifications` (cada minuto) + trigger `resetReminderNotified` — `memory-bank/functions/` |

---

## Design System — Tokens (extraídos do Figma)

### Paleta de cores

```css
/* Primárias */
--color-primary:          #2563EB;
--color-primary-dark:     #1D4ED8;
--color-primary-light:    #EFF6FF;

/* Secundárias */
--color-secondary:        #14B8A6;
--color-secondary-light:  #F0FDFA;

/* Semânticas */
--color-success:          #22C55E;
--color-success-light:    #F0FDF4;
--color-success-dark:     #166534;

--color-warning:          #F59E0B;
--color-warning-light:    #FFFBEB;

--color-danger:           #EF4444;
--color-danger-light:     #FEF2F2;
--color-danger-dark:      #991B1B;

/* Neutros (Slate) */
--color-slate-50:         #F8FAFC;
--color-slate-100:        #F1F5F9;
--color-slate-200:        #E2E8F0;
--color-slate-300:        #CBD5E1;
--color-slate-400:        #94A3B8;
--color-slate-500:        #64748B;
--color-slate-600:        #475569;
--color-slate-900:        #0F172A;
```

### Tipografia (escala base adaptável)

| Nome | Tamanho base | Uso |
|---|---|---|
| Display | 36px+ | Títulos de página principais |
| Heading 1 | 28-32px | Títulos de página |
| Heading 2 | 22-24px | Títulos de seção principal |
| Heading 3 | 18px | Títulos internos de card e grupos de formulário |
| Body Large | 18-20px | Texto de destaque, labels de formulário |
| Body | 16px | Texto padrão |
| Caption | 14px | Textos auxiliares |
| Badge | 14px | Tags, contadores e status badges |

> A escala de fonte é multiplicada pelo fator de preferência do usuário:
> - `small`: × 0.875 (mínimo absoluto — nunca abaixo de 14px)
> - `medium`: × 1.0 (base)
> - `large`: × 1.125
> - `extra_large`: × 1.25

### Espaçamento

```
--spacing-xs:   4px
--spacing-sm:   8px
--spacing-md:   16px
--spacing-lg:   24px
--spacing-xl:   32px
--spacing-2xl:  48px
```

Quando o usuário seleciona espaçamento "Espaçoso", aplicar multiplicador 1.5× nos espaçamentos internos de cards e formulários.

### Touch Targets (Mobile)

| Categoria | Tamanho mínimo |
|---|---|
| Absoluto mínimo (não usar) | 32×32px |
| Mínimo aceitável | 44×44px |
| Recomendado | 56×56px |
| Botões primários | 56-72px de altura |

### Componentes do Design System (Figma)

| Componente | Uso |
|---|---|
| Colors | Paleta + tokens semânticos |
| Typography Scale | Escala tipográfica completa |
| Spacing | Grid e espaçamentos |
| Buttons | Primary, Secondary, Destructive, Ghost |
| Inputs | Text, Password, Email, com estados |
| Cards | Default, Elevated, Outlined |
| Alerts | Success, Warning, Danger, Info |
| Form Controls | Checkbox, Radio, Toggle, Select |
| Tabs | Horizontal tab bar |
| Badges | Status, Count, Label |
| Modals | Confirmation, Info, Form |
| Toasts | Success, Warning, Error, Info |
| Avatars | Image, Initials, Placeholder |

Componentes estruturais compartilhados no web:

- `PageHeader`: título, descrição, ação lateral, retorno contextual opcional e marcador de tour.
- `BackNavigationButton`: navegação de retorno com ícone, alvo de toque e estados visuais padronizados.

---

## Schema Firebase — Cloud Firestore

> O schema completo das collections, campos, tipos e regras de segurança está em `memory-bank/firebaseSchema.md`.
> As Firestore Rules em formato nativo estão em `memory-bank/firestore.rules`.

---

## Variáveis de ambiente

### Web — `.env.local` (nunca commitar)

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Mobile — `lib/firebase_options.dart`
Gerado via `flutterfire configure`. Não commitar valores reais em repositório público.

---

## CI/CD

### Web — GitHub Actions + Vercel
- Build automático a cada PR para `main`
- Deploy de preview por PR
- Deploy de produção ao merge em `main`

### Mobile — GitHub Actions + Firebase App Distribution
- Build de APK/IPA a cada push em `main`
- Distribuição via Firebase App Distribution para o time de teste
