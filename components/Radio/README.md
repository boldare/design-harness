# Radio

One choice from a short list where all options stay visible.

## Anatomy

Group: legend (`Text/label`, `text.primary`), then options with gap `space.2`.

Option row, minimum height `size.target-min`: circle (`size.mark`, radius `radius.full`), gap `space.3`, label (`Text/body`, `text.primary`), optional description (`Text/body-sm`, `text.secondary`).

- Not selected: fill `surface.raised`, border `stroke.default` in `border.control`.
- Selected: fill `action.primary`, centred dot `size.dot` in `text.on-action`.

## Props

RadioGroup: `legend`, `options` (`{ value, label, description? }[]`), `value`, `onChange`, `error`, `disabled`.

## States (Figma: Selected × State)

`selected` true / false × `default`, `focus` (+ `shadow.focus` on the circle), `disabled` (`opacity.disabled`).

## Tokens

`surface.raised`, `border.control`, `action.primary`, `text.on-action`, `text.primary`, `text.secondary`, `size.mark`, `size.dot`, `size.target-min`, `radius.full`, `stroke.default`, `space.2`, `space.3`, `opacity.disabled`, `shadow.focus`, styles `Text/label`, `Text/body`, `Text/body-sm`.

## Accessibility

- `<fieldset>` with `<legend>`, native `<input type="radio">` sharing a `name`. Arrow keys move between options.

## Do / Don't

- Do use it for 2 to 4 options. More than that is a Select.
- Do preselect a sensible default when one exists.
