# Slider

A value picked from a range by feel, such as the brightness of a light, that takes effect as soon as it is changed.

## Anatomy

1. Label row, gap `space.4`: label (`Text/label`, `text.primary`) on the left, the current value (`Text/body-sm`, `text.secondary`) on the right. A long label wraps; the value keeps its place.
2. Track area, `size.target-min` high and the full width, directly under the label row with no gap: the target's own space above the thumb separates them.
   - Track: `size.slider-track` high, radius `radius.full`, centred in the track area. From the start to the thumb it is `action.primary`, after the thumb `border.control`, as the off Switch track.
   - Thumb: `size.mark`, radius `radius.full`, fill `action.primary`, centred on the value. At the minimum and maximum it stays inside the track.

## Props

| Prop | Values | Default |
|------|--------|---------|
| `label` | string | required |
| `value`, `onChange` | number, function | required |
| `min`, `max`, `step` | numbers | `0`, `100`, `1` |
| `formatValue` | function from the value to the text shown and announced, such as `50%` | the number |
| `disabled` | boolean | `false` |

## States (Figma: State)

`default`, `focus` (+ `shadow.focus` on the thumb), `disabled` (`opacity.disabled` on the whole slider, label and value included).

There is no error state: every position on the track is a valid value.

## Tokens

`text.primary`, `text.secondary`, `action.primary`, `border.control`, `size.target-min`, `size.slider-track`, `size.mark`, `radius.full`, `space.4`, `opacity.disabled`, `shadow.focus`, styles `Text/label`, `Text/body-sm`.

## Accessibility

- Native `<input type="range">`; the whole label row is its `<label for>`. `aria-valuetext` from `formatValue` announces the value, so a screen reader says "50%", not "50"; the value in the row is `aria-hidden`, so the name stays the label ("LED brightness") and the value is not read twice.
- Contrast: the thumb and the filled track carry the value, `action.primary` at 17.3:1 light and 16.9:1 dark on `surface.page`. The unfilled track, `border.control` on `surface.page`, is 2.85:1 light and 3.5:1 dark: below 3:1 in light, as the off Switch track. Open, decided 22.10.2026.
- Keyboard as native: arrow keys move one step, Home and End go to the ends.
- The whole track area is the target: a tap anywhere on it moves the thumb there.
- If the change can fail (for example the device is out of range), return the thumb to its previous value and say why in an Alert above the settings it belongs to, as with Switch. The Slider itself has no message.

## Do / Don't

- Do use it where more or less matters more than an exact number: brightness, volume. An exact number is a TextField.
- Do show the current value next to the label, in the unit people know (`50%`).
- Don't use it for a few named options ("Low", "Medium", "High"). That is a Radio group.
