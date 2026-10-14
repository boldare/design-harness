# Button

Starts an action: primary for the one main action on a screen, quiet for secondary ones.

## Anatomy

Container (height `size.control`, radius `radius.md`, horizontal padding `space.6`), optional leading Icon or spinner (`size.icon-md`, gap `space.2`), label (`Controls/button`). Full width by default on mobile screens.

## Props

| Prop | Values | Default |
|------|--------|---------|
| `variant` | `primary`, `quiet` | `primary` |
| `loading` | boolean | `false` |
| `loadingLabel` | string shown while loading ("Signing in…") | the label |
| `icon` | Icon name, leading | none |
| `disabled` | boolean | `false` |
| `fullWidth` | boolean | `true` |
| `onPress` | function | required |

## Variants and states (Figma: Variant × State)

| | default | focus | disabled | loading |
|---|---|---|---|---|
| primary | fill `action.primary`, label `text.on-action` | + `shadow.focus` | `opacity.disabled` | spinner + "-ing" label, same colours |
| quiet | no fill, label `text.secondary` | + `shadow.focus` | `opacity.disabled` | spinner + label, same colours |

There is no hover or pressed colour: Atlas runs on touch screens. Pressed feedback comes from the platform (ripple on Android).

## Tokens

`action.primary`, `text.on-action`, `text.secondary`, `size.control`, `radius.md`, `space.6`, `space.2`, `size.icon-md`, `opacity.disabled`, `shadow.focus`, style `Controls/button`.

## Accessibility

- Real `<button type="button">` (or `submit` in a form).
- Loading sets `aria-busy="true"`, keeps the button focusable and ignores repeated presses. The label changes to say what is happening ("Signing in…").
- Disabled buttons are rare. Prefer an enabled button that explains what is missing after a press (Atlas sign-in keeps "Sign in" enabled and shows validation).

## Do / Don't

- Do keep one primary button per screen.
- Do write labels as verbs: "Sign in", "Pair device", "Save changes".
- Don't change the button colour while loading. Only the spinner and label change.
- Don't use a quiet button for a destructive action without a confirmation step.
