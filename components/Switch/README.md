# Switch

A setting that takes effect as soon as it is changed, such as device vibration or a lock.

## Anatomy

Row, minimum height `size.target-min`, gap `space.4`: label (`Text/body`, `text.primary`) and optional description (`Text/body-sm`, `text.secondary`) on the left, switch on the right.

Switch: track `size.switch-width` × `size.switch-height`, radius `radius.full`; thumb `size.mark`, radius `radius.full`, inset `space.1`.

- Off: track fill `border.control`, thumb `surface.raised`.
- On: track fill `action.primary`, thumb `text.on-action`, thumb on the right.

## Props

| Prop | Values | Default |
|------|--------|---------|
| `label` | string | required |
| `description` | string | none |
| `checked`, `onChange` | boolean, function | required |
| `disabled` | boolean | `false` |

## States (Figma: Checked × State)

`checked` true / false × `default`, `focus` (+ `shadow.focus` on the track), `disabled` (`opacity.disabled`).

## Tokens

`border.control`, `surface.raised`, `action.primary`, `text.on-action`, `text.primary`, `text.secondary`, `size.switch-width`, `size.switch-height`, `size.mark`, `size.target-min`, `radius.full`, `space.1`, `space.4`, `opacity.disabled`, `shadow.focus`, styles `Text/body`, `Text/body-sm`.

## Accessibility

- `<button role="switch" aria-checked>` or `<input type="checkbox" role="switch">`, labelled by the row label. The whole row is the target.
- If the change can fail (for example the device is out of range), revert the switch and say why next to it.

## Do / Don't

- Do apply the change immediately, without a Save button.
- Don't put a Switch in a form that is submitted later. Use a Checkbox there.
