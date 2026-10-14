# TextField

A labelled single-line input for text, email or password, with an optional action next to the label and a message under the field.

## Anatomy

1. Label row: label (`Text/label`, `text.primary`) and an optional Link on the right (for example "Forgot password?").
2. Field: height `size.control`, radius `radius.md`, fill `surface.raised`, border `stroke.default` in `border.control`, horizontal padding `space.4`, value in `Controls/input` and `text.primary`, placeholder in `text.secondary`.
3. Password only: an IconButton (`eye` / `eye-off`) inside the field on the right, inset `space.1`.
4. Message: Icon `alert-circle` at `size.icon-sm` and text in `Text/body-sm`, both `danger.text`, gap `space.2`.

Gaps: label row to field `space.2`, field to message `space.2`.

## Props

| Prop | Values | Default |
|------|--------|---------|
| `label` | string | required |
| `type` | `text`, `email`, `password` | `text` |
| `value`, `onChange` | string, function | required |
| `onBlur` | function, for values saved when the field loses focus | none |
| `placeholder` | string | none |
| `error` | string | none |
| `disabled` | boolean | `false` |
| `labelAction` | Link | none |

## States (Figma: Type × State)

| State | Field |
|-------|-------|
| `empty` | placeholder in `text.secondary` |
| `filled` | value in `text.primary` |
| `focus` | + `shadow.focus` |
| `error` | border `danger.text`, + `shadow.danger-halo`, message shown |
| `disabled` | whole field `opacity.disabled` |

## Tokens

`surface.raised`, `border.control`, `text.primary`, `text.secondary`, `danger.text`, `size.control`, `radius.md`, `stroke.default`, `space.1`, `space.2`, `space.4`, `size.icon-sm`, `opacity.disabled`, `shadow.focus`, `shadow.danger-halo`, styles `Text/label`, `Controls/input`, `Text/body-sm`.

## Accessibility

- Visible `<label for>` always; the placeholder shows the format ("name@company.com"), never the label.
- Error: `aria-invalid="true"` and `aria-describedby` pointing at the message. Messages say how to fix it: "Enter a valid email, like name@company.com".
- Use the right `type` and `autocomplete` (`email`, `current-password`) so the keyboard and password managers work.

## Do / Don't

- Do validate on submit, then update the message as the person types.
- Do keep what was typed after a server error.
- Don't show more than one message under a field.
