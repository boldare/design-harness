# Logo

The Atlas mark and wordmark, shown in the header of entry screens.

## Anatomy

Row with gap `space.3`: the mark, then the wordmark "Atlas" in `Text/body-strong` and `text.primary`.

The mark is an asset, not a layout: drawn at 28 px, a 28-unit square with a corner radius of 8 filled with `text.primary`, and a 10-unit circle in its centre filled with `surface.page`. Its geometry is fixed like an icon path and is not tokenised; its colours are tokens, so it works in both themes.

## Props

| Prop | Values | Default |
|------|--------|---------|
| `wordmark` | boolean | `true` |

## Tokens

`text.primary`, `surface.page`, `space.3`, style `Text/body-strong`.

## Accessibility

- With the wordmark, the mark is decorative (`aria-hidden`). Without it, the mark carries `role="img"` and `aria-label="Atlas"`.

## Do / Don't

- Do keep the mark and wordmark together on entry screens.
- Don't recolour the mark or place it on anything other than `surface.page`.
