# Foundations: where the values come from

Atlas started as a single sign-in flow: five states, light and dark, drawn on a claude.ai Design canvas on 6 October 2026. Its colours and sizes were typed straight into each screen, and the same colour table was copied into the sign-in screen and the component sheet. This file records how those values became the tokens in `tokens/tokens.json`, so people and agents can see why a value exists before they change it.

## Kept from Atlas as they were

- **Every colour.** The twelve light and twelve dark values are unchanged. They now sit in two layers: primitives (`neutral.*`, `blue.*`, `red.*`, `green.*`) and semantic tokens that point at them per theme (`surface.page`, `text.primary`, `danger.text` and so on). Components use semantic tokens only.
- **Typeface:** Geist, from Google Fonts. Geist Mono for code samples.
- **Type styles** title (34 / 600 / -3%), body (16 / 400 / 1.5), button (16 / 600), label (14 / 500) and the validation message (14 / 400 / 1.4, now `body-sm`).
- **Spacing values** documented in the Atlas deck: 8, 12, 16, 20, 24, 32 and 56.
- **Sizes:** 52 px fields and primary button, 44 px minimum touch target.
- **Radius** 12 for fields, buttons, banners and cards; full for avatars and the success mark.

## Normalised

| Atlas | Now | Why |
|-------|-----|-----|
| Ad-hoc gaps of 6, 10, 14 and 28 px | Snapped to the 4 px scale: 6 → `space.2` (8), 10 → `space.2` or `space.3`, 14 → `space.3` (12) or `space.4` (16), 28 → `space.6` (24) or `space.8` (32) | The Atlas deck promised a 4 px grid, but these four values were outside the documented scale. |
| Icon button radius 10 | `radius.md` (12) | A one-off value next to 12 px fields reads as a mistake, not a choice. |
| Colour names such as `bg`, `field`, `ink`, `muted` | `surface.page`, `surface.raised`, `text.primary`, `text.secondary` | Names say what a colour is for, so a new component can pick one without guessing. |
| 15 px text in four places | Help link and footer link → `body` (16); account name → `body-strong` (16); quiet button → `button` (16 / 600) | 15 px sat between 14 and 16 without a role of its own. Decided 14.10.2026. |
| "Message" style (14 / 400 / 1.4) | Renamed `body-sm` | The same style serves validation messages and secondary lines such as the account email. |
| Quiet button 48 px | `size.control` (52) | Every button has the same height. Decided 14.10.2026. |

## Added for the components that come next

- `heading` (20 / 600) for section titles in the profile and device settings forms.
- `caption` (12 / 600, tracked) from the Atlas component sheet, now a named style.
- `radius.sm` (6) for checkboxes.
- `shadow.overlay` for the select menu. It is the only shadow in the system.
- `space.1` (4), `space.10` (40) and `space.12` (48) to complete the scale.
- `action.primary` and `text.on-action`, so the primary button and selected controls (checkbox, radio, switch) share one fill.

## Gap found while extracting

The Atlas acceptance slide lists "2 px accent ring on every input and link", but the inputs were drawn with `outline: none` and no focus style. The ring is now a rule (`stroke.focus` in `accent`, with a 2 px gap of `surface.page`) that every interactive component must implement.

## Added for the base components (14.10.2026)

Each of these was needed by a component and had no token yet, so it was proposed here first.

| Token | Value | Needed by | Note |
|-------|-------|-----------|------|
| `size.icon-sm`, `size.icon-md` | 16, 20 | Messages, checkbox, password toggle, select, alert, spinner | Atlas used 16, 18 and 20. The 18 px spinner moves to 20. |
| `size.mark` | 24 | Checkbox, radio, switch thumb | One size for every selection mark. |
| `size.dot` | 10 | Selected radio | |
| `size.avatar` | 40 | Account card | From Atlas. |
| `size.switch-width`, `size.switch-height` | 56, 32 | Switch | Derived: a 24 px thumb with `space.1` around it. |
| `opacity.disabled` | 0.55 | Every disabled control | From Atlas, where it locked the form while signing in. |
| `shadow.focus` | 2 px `surface.page` gap, 2 px `accent` ring | Every interactive element | Turns the focus rule above into a value. |
| `shadow.danger-halo` | 3 px `danger.surface` | Invalid fields | From Atlas. |
| `duration.spin` | 800 ms | Button loading spinner | From Atlas. Code only: Figma shows the spinner still. |
| `layer.overlay` | 10 | Select menu | Raised by the code implementation: the menu must sit above content that follows it. Code only. |

Not added on purpose: a success tone for the alert banner. It would need a `success.border` colour and a new green primitive, and no screen needs it yet. Atlas shows success with the success mark instead.

## The rule that follows from all of this

Every value in a component comes from a token: colour, type, spacing, radius, size, stroke and shadow. A value that no token covers is not typed in by hand. It becomes a proposal for a new token, with a name, a usage note and a reason, and it is added here before the component uses it.
