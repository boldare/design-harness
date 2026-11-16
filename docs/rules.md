# Atlas rules

The rules of the Atlas system, on top of the core rules of the design-harness skill (`references/rules.md`). Each line is a requirement; the review checklist checks them with the core rules.

## Tokens for the core rules
- Focus: `shadow.focus`.
- Disabled: `opacity.disabled`.
- Error colour: `danger.text`.
- Minimum touch target: `size.target-min`.
- Controls are `size.control` high. Selection marks are `size.mark`.

## Frames and themes
- Screens are phone mockups, 390 × 844 (`frame` in `design-harness.yaml`): one screen height, longer screens scroll.
- Two themes: light and dark.

## Text
- Text uses the Atlas text styles (`type.groups` in `tokens/tokens.json`, Geist and Geist Mono).

## Assets
- Icons come from the Icon set. A new icon follows `components/Icon/README.md` (24-unit grid, round caps and joins).
- The Logo mark keeps its fixed geometry from `components/Logo/README.md` (a 28-unit square, corner radius 8, a 10-unit circle); its colours are tokens.

## Copy
- Realistic, short, in the voice of the existing screens. No placeholder names other than the Atlas persona: Anna Kowalska, anna.kowalska@example.com, device "Atlas One".
