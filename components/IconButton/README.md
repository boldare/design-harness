# IconButton

An action shown only as an icon, such as the password visibility toggle, with a touch target of at least 44 px.

## Anatomy

Square container `size.target-min`, radius `radius.md`, no fill, centred Icon at `size.icon-md` in `text.secondary`.

## Props

| Prop | Values | Default |
|------|--------|---------|
| `icon` | Icon name | required |
| `label` | string | required |
| `pressed` | boolean, for toggles with a fixed label | none |
| `disabled` | boolean | `false` |
| `onPress` | function | required |

## States (Figma: State)

`default`, `focus` (+ `shadow.focus`), `disabled` (`opacity.disabled`).

## Tokens

`size.target-min`, `radius.md`, `size.icon-md`, `text.secondary`, `opacity.disabled`, `shadow.focus`.

## Accessibility

- `label` is required and becomes `aria-label`.
- A toggle uses one of two patterns, never both: a label that names the next action ("Show password", then "Hide password") without `aria-pressed`, or a fixed label with `aria-pressed` (`pressed` prop). The password toggle uses the first.

## Do / Don't

- Do use it only where the icon is widely understood (eye for visibility, close, back).
- Don't shrink the target below `size.target-min`, even when the icon is small.
