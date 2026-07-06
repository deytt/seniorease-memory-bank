# Plano de Implementação — GAP-001: Espaçamento Ajustável

> Status: `[ ]` A implementar  
> Referência: `gaps.md#GAP-001`  
> Pré-requisito: nenhum (pode ser iniciado imediatamente)

---

## Visão geral

Implementar o ajuste real de espaçamento em 3 camadas:

```
1. Core (tema)    → SeniorSpacingTheme (ThemeExtension) + fator dinâmico
2. UI (tela)      → SpacingModeCard na AccessibilityScreen
3. Aplicação      → telas usam a extensão em vez de AppSpacing.*
```

---

## Passo 1 — Adicionar fator de escala a `AppSpacing`

**Arquivo:** `lib/core/theme/app_spacing.dart`

Adicionar logo abaixo das constantes existentes:

```dart
/// Retorna o multiplicador de espaçamento para cada modo.
static double factor(SpacingMode mode) => switch (mode) {
  SpacingMode.compact    => 0.75,
  SpacingMode.comfortable => 1.0,
  SpacingMode.spacious   => 1.5,
};
```

> `SpacingMode` vive em `features/accessibility/domain/entities/user_preferences.dart` — o import já existe implicitamente via `AppTheme`; aqui vai precisar adicioná-lo explicitamente. (Este ponto será resolvido definitivamente no GAP-005, mas para o GAP-001 é aceitável manter o import de features temporariamente em app_spacing.)
>
> **Alternativa mais limpa para não piorar o GAP-005**: definir o enum `SpacingMode` diretamente em `app_spacing.dart` e fazer `user_preferences.dart` re-exportar dele. Esta é a opção recomendada — resolve os dois gaps ao mesmo tempo.

---

## Passo 2 — Criar `SeniorSpacingTheme` (ThemeExtension)

**Arquivo novo:** `lib/core/theme/senior_spacing_theme.dart`

```dart
import 'package:flutter/material.dart';

/// Extensão de tema que carrega os espaçamentos já multiplicados pelo
/// fator do utilizador. Consumida via:
///   Theme.of(context).extension<SeniorSpacingTheme>()!
class SeniorSpacingTheme extends ThemeExtension<SeniorSpacingTheme> {
  const SeniorSpacingTheme({
    required this.cardPadding,   // padding interno de cards/containers
    required this.sectionGap,    // espaço vertical entre secções de página
    required this.itemGap,       // espaço entre itens de lista/formulário
    required this.buttonGap,     // espaço entre botões num grupo
    required this.screenPadding, // padding horizontal/vertical das telas
  });

  final double cardPadding;
  final double sectionGap;
  final double itemGap;
  final double buttonGap;
  final double screenPadding;

  /// Constrói a extensão a partir de um fator (0.75 / 1.0 / 1.5).
  factory SeniorSpacingTheme.fromFactor(double factor) =>
      SeniorSpacingTheme(
        cardPadding:   16 * factor,   // base: AppSpacing.md = 16
        sectionGap:    24 * factor,   // base: AppSpacing.lg = 24
        itemGap:        8 * factor,   // base: AppSpacing.sm =  8
        buttonGap:      8 * factor,
        screenPadding: 16 * factor,
      );

  @override
  SeniorSpacingTheme copyWith({
    double? cardPadding,
    double? sectionGap,
    double? itemGap,
    double? buttonGap,
    double? screenPadding,
  }) =>
      SeniorSpacingTheme(
        cardPadding:   cardPadding   ?? this.cardPadding,
        sectionGap:    sectionGap    ?? this.sectionGap,
        itemGap:       itemGap       ?? this.itemGap,
        buttonGap:     buttonGap     ?? this.buttonGap,
        screenPadding: screenPadding ?? this.screenPadding,
      );

  @override
  SeniorSpacingTheme lerp(SeniorSpacingTheme? other, double t) {
    if (other == null) return this;
    return SeniorSpacingTheme(
      cardPadding:   _lerpDouble(cardPadding,   other.cardPadding,   t),
      sectionGap:    _lerpDouble(sectionGap,    other.sectionGap,    t),
      itemGap:       _lerpDouble(itemGap,        other.itemGap,        t),
      buttonGap:     _lerpDouble(buttonGap,      other.buttonGap,      t),
      screenPadding: _lerpDouble(screenPadding,  other.screenPadding,  t),
    );
  }

  static double _lerpDouble(double a, double b, double t) =>
      a + (b - a) * t;
}
```

---

## Passo 3 — Integrar em `AppTheme.buildDynamic()`

**Arquivo:** `lib/core/theme/app_theme.dart`

Dentro de `buildDynamic()`, logo antes do `return _buildBase(...)`, adicionar:

```dart
final spacingFactor = AppSpacing.factor(prefs.spacing);
final spacingTheme = SeniorSpacingTheme.fromFactor(spacingFactor);
```

Em `_buildBase()`, adicionar o parâmetro `SeniorSpacingTheme spacingTheme` e passá-lo ao `ThemeData`:

```dart
return ThemeData(
  // ... campos existentes ...
  extensions: <ThemeExtension<dynamic>>[spacingTheme],
);
```

---

## Passo 4 — Criar `SpacingModeCard`

**Arquivo novo:** `lib/features/accessibility/presentation/widgets/spacing_mode_card.dart`

Padrão visual idêntico ao `InterfaceModeCard`, mas com 3 opções:

```dart
import 'package:flutter/material.dart';
import 'package:mobile/core/theme/app_colors.dart';
import 'package:mobile/features/accessibility/domain/entities/user_preferences.dart';

class SpacingModeCard extends StatelessWidget {
  const SpacingModeCard({
    super.key,
    required this.value,
    required this.onChanged,
  });

  final SpacingMode value;
  final ValueChanged<SpacingMode> onChanged;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.all(17),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        border: Border.all(color: theme.colorScheme.outline),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Espaçamento',
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: theme.colorScheme.onSurface,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Ajuste o espaço entre os elementos da tela',
            style: theme.textTheme.labelSmall?.copyWith(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.55),
            ),
          ),
          const SizedBox(height: 12),
          IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Expanded(
                  child: _SpacingButton(
                    label: 'Compacto',
                    sublabel: 'Menos espaço entre elementos',
                    selected: value == SpacingMode.compact,
                    onTap: () => onChanged(SpacingMode.compact),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _SpacingButton(
                    label: 'Confortável',
                    sublabel: 'Espaço padrão',
                    selected: value == SpacingMode.comfortable,
                    onTap: () => onChanged(SpacingMode.comfortable),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _SpacingButton(
                    label: 'Espaçoso',
                    sublabel: 'Mais espaço entre elementos',
                    selected: value == SpacingMode.spacious,
                    onTap: () => onChanged(SpacingMode.spacious),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SpacingButton extends StatelessWidget {
  const _SpacingButton({
    required this.label,
    required this.sublabel,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final String sublabel;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final bg     = selected ? AppColors.primaryLight : theme.colorScheme.surface;
    final border = selected ? AppColors.primary      : theme.colorScheme.outline;
    final labelColor = selected ? AppColors.primary  : theme.colorScheme.onSurface;

    return Semantics(
      button: true,
      selected: selected,
      label: label,
      child: GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
          decoration: BoxDecoration(
            color: bg,
            border: Border.all(color: border, width: 2),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: theme.textTheme.labelSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: labelColor,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                sublabel,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: theme.textTheme.labelSmall?.copyWith(
                  color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

---

## Passo 5 — Adicionar o card à `AccessibilityScreen`

**Arquivo:** `lib/features/accessibility/presentation/screens/accessibility_screen.dart`

1. Adicionar `GlobalKey _spacingShowcaseKey = GlobalKey();` na classe de estado.
2. Adicionar `_spacingShowcaseKey` à lista `tourKeys` (posição 2, entre modo e toggles).
3. Inserir entre `InterfaceModeCard` e o card de toggles:

```dart
const SizedBox(height: 12),

SeniorShowcase(
  showcaseKey: _spacingShowcaseKey,
  scope: tourScope,
  title: 'Espaçamento',
  description:
      'Escolha quanto espaço quer entre os elementos. "Espaçoso" dá mais respiro à tela.',
  child: SpacingModeCard(
    value: current.spacing,
    onChanged: (v) => onUpdate(current.copyWith(spacing: v)),
  ),
),
```

---

## Passo 6 — Aplicar `SeniorSpacingTheme` nas telas principais

Substituir usos mais visíveis de `AppSpacing.*` em padding/SizedBox pelas propriedades da extensão:

```dart
// Antes
padding: const EdgeInsets.all(AppSpacing.md)

// Depois
final spacing = Theme.of(context).extension<SeniorSpacingTheme>()!;
padding: EdgeInsets.all(spacing.cardPadding)
```

**Ordem de aplicação (mais impacto visual primeiro):**
1. `home_screen.dart` — seções e gaps verticais
2. `task_list_screen.dart` — padding da lista e gaps entre cards
3. `reminders_screen.dart` — idem
4. `history_screen.dart` — idem
5. `accessibility_screen.dart` — padding do scroll principal
6. `create_task_screen.dart` / `create_reminder_screen.dart` — gaps de formulário

> **Nota:** `AppSpacing.*` nas constantes de widgets do Design System (`senior_button`, `senior_card`, etc.) podem ser mantidas por enquanto — mudar widgets base tem risco de quebrar layouts. Priorizar as telas de features.

---

## Passo 7 — Testes

**Arquivo:** `test/features/accessibility/domain/entities/user_preferences_test.dart` (já existe)

Adicionar casos de teste:
```dart
test('spacing default é comfortable', () {
  expect(UserPreferences.defaults().spacing, SpacingMode.comfortable);
});

test('copyWith preserva spacing', () {
  final prefs = UserPreferences.defaults();
  final updated = prefs.copyWith(spacing: SpacingMode.spacious);
  expect(updated.spacing, SpacingMode.spacious);
  expect(updated.fontSize, prefs.fontSize); // outros campos intactos
});

test('toMap/fromMap roundtrip spacing', () {
  final prefs = UserPreferences.defaults().copyWith(spacing: SpacingMode.compact);
  final map = prefs.toMap();
  expect(map['spacing'], 'compact');
  final restored = UserPreferences.fromMap(prefs.userId, map);
  expect(restored.spacing, SpacingMode.compact);
});
```

Adicionar teste do fator em `test/core/theme/app_spacing_test.dart` (novo):
```dart
test('AppSpacing.factor retorna os valores corretos', () {
  expect(AppSpacing.factor(SpacingMode.compact),     0.75);
  expect(AppSpacing.factor(SpacingMode.comfortable), 1.0);
  expect(AppSpacing.factor(SpacingMode.spacious),    1.5);
});
```

---

## Ordem de execução resumida

| # | Ação | Arquivo |
|---|------|---------|
| 1 | Adicionar `AppSpacing.factor()` | `core/theme/app_spacing.dart` |
| 2 | Criar `SeniorSpacingTheme` | `core/theme/senior_spacing_theme.dart` (**novo**) |
| 3 | Integrar em `buildDynamic()` + `_buildBase()` | `core/theme/app_theme.dart` |
| 4 | Criar `SpacingModeCard` | `features/accessibility/presentation/widgets/spacing_mode_card.dart` (**novo**) |
| 5 | Adicionar card + showcase key na `AccessibilityScreen` | `features/accessibility/presentation/screens/accessibility_screen.dart` |
| 6 | Aplicar extensão nas telas principais | 6 arquivos de telas |
| 7 | Escrever testes | `test/features/accessibility/...` e `test/core/theme/...` |

**Estimativa:** 2–3 horas de implementação focada.

---

## Critério de aceite final

- [ ] Seletor de espaçamento visível na tela de Acessibilidade.
- [ ] Selecionar "Espaçoso" → gaps e paddings visivelmente maiores em Home, Tasks e Reminders.
- [ ] Selecionar "Compacto" → gaps e paddings visivelmente menores.
- [ ] Preferência persiste no Firestore: fechar e reabrir o app mantém o espaçamento escolhido.
- [ ] `flutter test` passa com 0 erros.
- [ ] `flutter analyze` passa com 0 erros.
