# Link

Text that navigates or starts a secondary action, such as "Forgot password?" or "Create an account".

## Anatomy

Text only, no underline at rest. Vertical padding brings the touch target to `size.target-min` without changing the line height around it.

## Props

| Prop | Values | Default |
|------|--------|---------|
| `tone` | `accent` (`accent`), `strong` (`text.primary`, `Text/body-strong`), `subtle` (`text.secondary`) | `accent` |
| `size` | `body` (`Text/body`), `sm` (`Text/body-sm`) | `body` |
| `href` or `onPress` | string or function | required |

## States (Figma: Tone × Size × State)

`default`, `focus` (+ `shadow.focus` around the text box, radius `radius.sm`).

## Tokens

`accent`, `text.primary`, `text.secondary`, styles `Text/body`, `Text/body-strong`, `Text/body-sm`, `size.target-min`, `radius.sm`, `shadow.focus`.

## Accessibility

- A real `<a href>` for navigation, a `<button>` styled as a link for in-page actions.
- Link text makes sense on its own: "Forgot password?", never "click here".

## Do / Don't

- Do use `accent` for links inside forms, `strong` for the call to action in a sentence ("New to Atlas? **Create an account**"), `subtle` for header utilities ("Help").
- Don't use a link where the action is the main one on the screen. That is a primary Button.
