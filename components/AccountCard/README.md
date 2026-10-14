# AccountCard

Shows who is signed in: avatar with initials, name and email.

## Anatomy

Container: fill `surface.raised`, border `stroke.default` in `border.subtle`, radius `radius.md`, padding `space.3` vertical and `space.4` horizontal, gap `space.3`.

- Avatar: `size.avatar`, radius `radius.full`, fill `action.primary`, initials in `Text/label` and `text.on-action`.
- Text column, gap `space.1`: name (`Text/body-strong`, `text.primary`) and email (`Text/body-sm`, `text.secondary`, one line, truncated with an ellipsis).

## Props

| Prop | Values | Default |
|------|--------|---------|
| `name` | string | required |
| `email` | string | required |
| `initials` | string | first letters of `name` |

## Tokens

`surface.raised`, `border.subtle`, `action.primary`, `text.on-action`, `text.primary`, `text.secondary`, `radius.md`, `radius.full`, `stroke.default`, `size.avatar`, `space.1`, `space.3`, `space.4`, styles `Text/label`, `Text/body-strong`, `Text/body-sm`.

## Accessibility

- The avatar is decorative (`aria-hidden`); the name is the accessible content.
- A truncated email keeps its full value in the accessible name.

## Do / Don't

- Do use it on confirmation and profile screens.
- Don't make the whole card a button. Put actions next to it.
