# Checkbox

An independent yes / no choice that is confirmed later with a button, such as a consent or a filter.

## Anatomy

Row with minimum height `size.target-min`: box (`size.mark`, radius `radius.sm`), gap `space.3`, label (`Text/body`, `text.primary`), optional description below the label (`Text/body-sm`, `text.secondary`).

- Unchecked box: fill `surface.raised`, border `stroke.default` in `border.control`.
- Checked box: fill `action.primary`, Icon `check` at `size.icon-sm` in `text.on-action`.
- Error: box border `danger.text`, message below as in TextField.

## Props

| Prop | Values | Default |
|------|--------|---------|
| `label` | string | required |
| `description` | string | none |
| `checked`, `onChange` | boolean, function | required |
| `error` | string | none |
| `disabled` | boolean | `false` |

## States (Figma: Checked × State)

`checked` true / false × `default`, `focus` (+ `shadow.focus` on the box), `error`, `disabled` (`opacity.disabled`).

## Tokens

`surface.raised`, `border.control`, `action.primary`, `text.on-action`, `text.primary`, `text.secondary`, `danger.text`, `size.mark`, `size.icon-sm`, `size.target-min`, `radius.sm`, `stroke.default`, `space.3`, `opacity.disabled`, `shadow.focus`, styles `Text/body`, `Text/body-sm`.

## Accessibility

- Native `<input type="checkbox">` with a `<label>`; the whole row is the target.
- A required consent shows its error only after submit, with a message that says what happens without it.

## Do / Don't

- Do write the label as the thing being agreed to: "Share usage data with Atlas".
- Don't use a Checkbox for a setting that applies immediately. That is a Switch.
