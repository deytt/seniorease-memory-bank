# Gaps — SeniorEase Mobile

> Resultado da análise de aderência aos requisitos do Hackathon (2026-07-06).
> Cada gap tem: descrição, evidência no código, critério violado e plano de correção.
> Marcar com `[x]` quando o gap for corrigido e validado.

---

## GAP-001 — Espaçamento ajustável não aplicado na UI

**Status:** `[ ]` Pendente  
**Prioridade:** Alta (requisito direto do Hackathon)

### Descrição
O `UserPreferences` tem o campo `spacing` (compact/comfortable/spacious) e o Firestore persiste corretamente. Porém:
- A tela de Acessibilidade **não exibe** o seletor de espaçamento.
- `AppSpacing` é uma classe de **constantes estáticas** — nunca varia em runtime.
- A preferência de espaçamento existe no modelo mas **não produz nenhum efeito visual** no app.

### Evidências
- `lib/core/theme/app_spacing.dart` — constantes fixas, sem multiplicador dinâmico.
- `lib/features/accessibility/presentation/screens/accessibility_screen.dart` — toggles de Modo Escuro, Alto Contraste, Feedback de Áudio e Botões Maiores; **sem toggle de Espaçamento**.
- `AppTheme.buildDynamic()` aplica escala tipográfica e touch target, mas **ignora `prefs.spacing`**.

### Critério violado
> "Espaçamento entre elementos — compacto, confortável, espaçoso" — Hackathon, `projectbrief.md` Módulo 1.

### Plano de correção

**Fase 1 — Infraestrutura (core)**
1. Criar `SpacingScale` em `core/theme/app_spacing.dart`: função `AppSpacing.factor(SpacingMode)` → `0.75` / `1.0` / `1.5`.
2. Adicionar `ThemeExtension<SeniorSpacingTheme>` em `core/theme/` com os campos `cardPadding`, `sectionGap`, `itemGap` (valores multiplicados pelo fator).
3. Em `AppTheme.buildDynamic()`, ler `prefs.spacing` e calcular o fator correto, criando a extensão e passando em `ThemeData.extensions`.

**Fase 2 — UI (Acessibilidade)**
4. Criar widget `SpacingModeCard` em `features/accessibility/presentation/widgets/` — três opções (Compacto/Confortável/Espaçoso) usando `ChoiceChip` ou botões segmentados com touch target ≥ 44px.
5. Adicionar o card entre o `InterfaceModeCard` e os toggles na `AccessibilityScreen`.
6. Adicionar o novo card ao tour de Acessibilidade (4.º alvo: `_spacingShowcaseKey`).

**Fase 3 — Aplicação global**
7. Substituir todos os usos de `AppSpacing.md / AppSpacing.lg / AppSpacing.xl` em `padding` e `SizedBox.height` nas telas por `Theme.of(context).extension<SeniorSpacingTheme>()!.cardPadding` (etc.), começando pelas telas principais: Home, Tasks, Reminders, History, Accessibility.
8. Atualizar testes unitários de `UserPreferences` para cobrir `spacing` e o cálculo do fator.

**Critério de aceite**
- Seletor visível na tela de Acessibilidade.
- Trocar para "Espaçoso" aumenta visivelmente os paddings/gaps em todas as telas principais.
- Trocar para "Compacto" reduz visivelmente.
- Preferência persiste no Firestore e reaparece após fechar e reabrir o app.

---

## GAP-002 — Notificações reais de lembretes não implementadas

**Status:** `[ ]` Pendente  
**Prioridade:** Alta (Módulo 2 do Hackathon — "Lembretes com linguagem clara")

### Descrição
O CRUD de lembretes existe e funciona (Firestore). Porém não há nenhum mecanismo de **disparo de notificação** no dispositivo:
- Nem push via Firebase Cloud Messaging (FCM).
- Nem notificações locais agendadas via `flutter_local_notifications`.
- Os campos `remindersEnabled` e `notificationTime` em `UserPreferences` são persistidos mas **nunca consultados** para acionar ou silenciar notificações.

### Evidências
- `pubspec.yaml` — ausência de `firebase_messaging` e `flutter_local_notifications`.
- Grep por "notification" retorna apenas ícones e labels de UI, sem código de scheduling/handling.
- `activeContext.md` — "Criar lembrete (Firestore CRUD, **sem push no device**)".

### Critério violado
> "Lembretes com linguagem clara e objetiva" + "Preferências de lembretes e notificações" — Hackathon, `projectbrief.md` Módulos 2 e 3.

### Plano de correção
1. Adicionar dependência `flutter_local_notifications` (agendamento local, mais simples e confiável para demo).
2. Criar `core/notifications/notification_service.dart` — inicialização, permissão e agendamento.
3. Ao criar/editar lembrete, chamar `NotificationService.schedule(reminder)` com o `scheduledAt`.
4. Ao deletar ou marcar como concluído, cancelar a notificação correspondente.
5. Respeitar `prefs.remindersEnabled`: se `false`, não agendar e cancelar todas as pendentes.
6. Integrar `notificationTime` (preferência de hora) como fallback quando `scheduledAt` do lembrete não tiver horário definido.
7. Pedir permissão de notificação no primeiro uso (tela Onboarding ou Settings).
8. Registar um ADR (ADR-018) documentando a decisão de notificações locais vs FCM.

**Critério de aceite**
- Criar um lembrete com hora futura → notificação aparece no dispositivo na hora certa.
- Marcar como concluído → notificação cancelada.
- Toggle `remindersEnabled = false` → nenhuma notificação é disparada.

---

## GAP-003 — `audioFeedbackEnabled` não controla o comportamento de haptics no runtime

**Status:** `[ ]` Pendente  
**Prioridade:** Média

### Descrição
O app usa `HapticFeedback.lightImpact()` / `HapticFeedback.selectionClick()` / `HapticFeedback.mediumImpact()` em dezenas de pontos. Porém **nenhuma dessas chamadas verifica** se `audioFeedbackEnabled` está ativo nas preferências do utilizador. O toggle existe na UI e persiste no Firestore mas **não produz nenhum efeito comportamental**.

### Evidências
- Grep por `HapticFeedback` → 40+ ocorrências em toda a base (`guided_task_screen`, `task_list_screen`, `reminders_screen`, etc.).
- Nenhuma ocorrência lê `audioFeedbackEnabled` antes de chamar haptics.
- `accessibilityScreen` mostra o toggle mas nada o consome no runtime.

### Critério violado
> "Ativação de feedback visual reforçado" — Hackathon, `projectbrief.md` Módulo 1.

### Plano de correção
1. Criar `core/feedback/senior_feedback.dart` com método estático `SeniorFeedback.light(WidgetRef ref)` / `.selection(ref)` / `.medium(ref)` que lê `preferencesProvider` e só chama `HapticFeedback.*` se `audioFeedbackEnabled == true`.
2. Substituir todas as chamadas diretas a `HapticFeedback.*` pelo wrapper em `SeniorFeedback.*`.
3. Incluir na mesma classe um método `SeniorFeedback.success(context)` para som de confirmação (usa `SystemSound.click` ou asset de áudio leve) — só ativo com o toggle ligado.
4. Atualizar testes de `UserPreferences` para cobrir a lógica do wrapper.

**Critério de aceite**
- Toggle desligado → nenhum haptic é sentido em nenhuma tela.
- Toggle ligado → haptics normais em todos os toques.

---

## GAP-004 — Guided Task exibe "1/5" em vez de "Passo 1 de 5"

**Status:** `[x]` Concluído em 2026-07-06  
**Prioridade:** Baixa (detalhe textual, mas é requisito explícito do protocolo)

### Descrição
O modo guiado exibe o contador de passos no formato `"1/5"` em vez do formato "Passo X de Y" exigido pelo `memory-bank.mdc` ("sempre mostrar 'Passo X de Y' com barra de progresso").

### Evidência
```dart
// lib/features/tasks/presentation/screens/guided_task_screen.dart — _Header
Text(
  '$current/$total',   // ← deveria ser "Passo $current de $total"
  ...
),
```

### Critério violado
> "Guided Task Mode: sempre mostrar 'Passo X de Y' com barra de progresso" — `memory-bank.mdc` (regra inviolável).

### Plano de correção
1. Em `_Header` na `guided_task_screen.dart`, substituir o texto por `'Passo $current de $total'`.
2. Adicionar semântica acessível: `Semantics(label: 'Passo $current de $total')` em volta do widget de contador.
3. Verificar se o mesmo formato existe (ou se precisa ser replicado) na tela Web.

**Critério de aceite**
- Header do modo guiado exibe "Passo 1 de 5", "Passo 2 de 5", etc.
- Texto com semântica acessível para leitores de tela.

---

## GAP-005 — Violação da regra "core nunca importa features"

**Status:** `[ ]` Pendente  
**Prioridade:** Média (viola Clean Architecture documentada; pode ser apontado pelos avaliadores)

### Descrição
`lib/core/theme/app_theme.dart` importa `UserPreferences` de `features/accessibility/domain/entities/`. Isso viola a regra arquitetural registada em `systemPatterns.md`: "core nunca importa de features".

Adicionalmente, várias features importam `auth_provider` de `features/auth/presentation/providers/` — comunicação direta entre features, violando o Feature-First.

### Evidências
```dart
// lib/core/theme/app_theme.dart
import 'package:mobile/features/accessibility/domain/entities/user_preferences.dart';
```
- `features/accessibility`, `features/tasks`, `features/reminders`, `features/profile`, `features/guides`, `features/history` — todas importam diretamente `features/auth/presentation/providers/auth_provider.dart`.

### Critério violado
> "core/ nunca importa de features/ — é sempre o contrário" — `systemPatterns.md`.  
> "features/X nunca importa diretamente de features/Y" — `systemPatterns.md`.

### Plano de correção

**Opção A — Mover `UserPreferences` para `core/` (recomendada)**
1. Criar `core/preferences/user_preferences.dart` com a entidade `UserPreferences` e os enums (`FontSizeScale`, `ContrastMode`, `SpacingMode`, `InterfaceMode`).
2. Atualizar todos os imports da entidade nos módulos `accessibility`, `home`, `profile`, `history`, etc.
3. `features/accessibility/domain/` passa a re-exportar de `core/` (ou apenas usa o import de `core/`).
4. `AppTheme` passa a importar de `core/preferences/` — violação resolvida.

**Opção B — Usar um "shared kernel" package Dart interno** (mais robusto, mais trabalhoso).

**Para o `auth_provider`:**
5. Criar `core/auth/auth_state.dart` com o port `AuthStateReader` (interface minimalista com `currentUserId`).
6. Registar `authStateReaderProvider` em `core/` (default: retorna `null`).
7. Em `main.dart`, fazer override com a implementação real de `features/auth`.
8. Features substituem `features/auth/presentation/providers/auth_provider` por `core/auth/auth_state.dart`.

> **Nota:** A Opção A para `UserPreferences` é suficiente para o Hackathon. O ponto do `auth_provider` é de menor risco (é um detalhe avançado), mas registar a decisão num ADR demonstra maturidade arquitetural.

**Critério de aceite**
- Nenhum arquivo em `lib/core/` contém import de `package:mobile/features/`.
- Análise estática (`flutter analyze`) continua a passar com 0 erros.

---

## Como atualizar este arquivo

Ao resolver um gap:
1. Marcar `[x]` no **Status**.
2. Adicionar nota de rodapé com data e referência ao ADR (se aplicável).
3. Atualizar `progress.md` com o item correspondente como `[x]`.
4. Atualizar `activeContext.md`.
