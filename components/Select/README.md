# Select

One choice from a list, shown as a field that opens a menu of options.

## Anatomy

1. Label (`Text/label`, `text.primary`), gap `space.2`.
2. Field: the TextField shell (height `size.control`, radius `radius.md`, `surface.raised`, `border.control`, padding `space.4`), the selected value in `Controls/input` or a placeholder in `text.secondary`, and Icon `chevron-down` at `size.icon-md` in `text.secondary` on the right.
3. Menu, below the field with a gap of `space.2`: fill `surface.raised`, border `stroke.default` in `border.subtle`, radius `radius.md`, `shadow.overlay`, vertical padding `space.2`.
4. Option: height `size.target-min`, horizontal padding `space.4`, text `Text/body` in `text.primary`. The selected option uses `Text/body-strong` and shows Icon `check` at `size.icon-md`.
5. Message, as in TextField.

## Props

| Prop | Values | Default |
|------|--------|---------|
| `label` | string | required |
| `options` | `{ value, label }[]` | required |
| `value`, `onChange` | string, function | required |
| `placeholder` | string | "Choose…" |
| `error` | string | none |
| `disabled` | boolean | `false` |

## States (Figma: State)

`empty`, `filled`, `focus`, `open` (menu shown), `error`, `disabled`, with the same rules as TextField.

## Tokens

As TextField, plus `border.subtle`, `shadow.overlay`, `size.target-min`, `size.icon-md`, style `Text/body`, `Text/body-strong`.

## Accessibility

- On Android and in the PWA, prefer the platform picker for long lists. The custom menu is for short lists (up to about 7 options).
- Custom menu: `role="combobox"` on the field with `aria-expanded`, `role="listbox"` on the menu, `role="option"` and `aria-selected` on options; arrow keys move, Enter selects, Escape closes and returns focus to the field.

## Do / Don't

- Do use Radio instead when there are up to 4 options and there is room to show them all.
- Don't use a Select for yes / no. That is a Checkbox or a Switch.
