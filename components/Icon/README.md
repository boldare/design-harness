# Icon

A stroke icon drawn on a 24-unit grid and shown at one of two sizes; it takes the colour of the text around it.

## Set

| Name | Used in |
|------|---------|
| `eye`, `eye-off` | TextField password toggle |
| `chevron-down` | Select |
| `check` | Checkbox tick, selected Select option |
| `alert-circle` | Field messages, Alert |
| `spinner` | Button loading (animated in code) |

New icons follow the same grid: 24 units, round caps and joins, stroke width 2 at `size.icon-sm`, 1.8 at `size.icon-md`.

## Props

| Prop | Values | Default |
|------|--------|---------|
| `name` | one of the set | required |
| `size` | `sm` (`size.icon-sm`), `md` (`size.icon-md`) | `md` |
| `label` | string | none |

## Tokens

`size.icon-sm`, `size.icon-md`. Colour is inherited (`currentColor` in code, the parent's text colour token in Figma).

## Accessibility

- Decorative by default (`aria-hidden="true"`). Pass `label` only when the icon is the only carrier of meaning, which is rare: an icon-only action uses IconButton and puts the label there.

## Do / Don't

- Do swap icons with the `name` property (instance swap in Figma), never by detaching.
- Don't use an icon as the only signal of a state. An error icon always sits next to a message.
