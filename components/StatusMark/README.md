# StatusMark

A large round mark that confirms an outcome at the top of a confirmation screen, such as "You're signed in".

## Anatomy

Circle `size.status-mark`, radius `radius.full`, fill `success.surface`, with Icon `check` at `size.icon-lg` in `success.text`, centred.

## Props

| Prop | Values | Default |
|------|--------|---------|
| `tone` | `success` | `success` |

Only the success tone exists, for the same reason as in Alert: other tones need colours the system does not have yet.

## Tokens

`success.surface`, `success.text`, `size.status-mark`, `size.icon-lg`, `radius.full`.

## Accessibility

- Decorative (`aria-hidden`). The heading next to it carries the message, and the region it sits in has `role="status"`.

## Do / Don't

- Do use it once per screen, above the heading.
- Don't use it inside forms or lists. Small confirmations belong next to the thing they confirm.
