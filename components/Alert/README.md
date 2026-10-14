# Alert

A message about the whole form or screen, such as a rejected sign-in, shown above the content it refers to.

## Anatomy

Container: fill `danger.surface`, border `stroke.default` in `danger.border`, radius `radius.md`, padding `space.3` vertical and `space.4` horizontal, gap `space.3`. Icon `alert-circle` at `size.icon-md` in `danger.text`, then a text column (gap `space.1`): title (`Text/body-strong`, `text.primary`) and optional description (`Text/body-sm`, `text.secondary`).

## Props

| Prop | Values | Default |
|------|--------|---------|
| `tone` | `danger` | `danger` |
| `title` | string | required |
| `description` | string | none |

Only the danger tone exists. A success tone needs a `success.border` colour that the system does not have yet (see `docs/foundations.md`); success is shown with the success mark instead.

## Tokens

`danger.surface`, `danger.border`, `danger.text`, `text.primary`, `text.secondary`, `radius.md`, `stroke.default`, `space.1`, `space.3`, `space.4`, `size.icon-md`, styles `Text/body-strong`, `Text/body-sm`.

## Accessibility

- `role="alert"` so screen readers announce it when it appears.
- The title says what happened, the description what to do: "Email or password is incorrect" / "Check your details and try again, or reset your password."

## Do / Don't

- Do clear it as soon as the person edits a field.
- Don't use it for field-level problems. Those go under the field.
