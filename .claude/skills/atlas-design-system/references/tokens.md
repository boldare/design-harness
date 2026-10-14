# Tokens

## Reading them
`tokens/tokens.json` holds families: `color` (primitives with one value, semantic tokens with a light and a dark alias), `type` (families and styles), `spacing`, `radius`, `size`, `stroke`, `shadow`, `opacity`, `duration`, `layer`. Each token has a `usage` note. Choose a token by its usage note, not by its value: `space.5` is "between fields in a form", so it is the gap between fields even where `space.4` would look similar.

## Names in every output
| Where | Rule | Example |
|-------|------|---------|
| tokens.json | dot-separated | `surface.page` |
| Figma variable | dots become slashes | `surface/page` |
| CSS | `--` and dots become hyphens | `var(--surface-page)` |
| Android | camelCase | `surfacePage` |
| Text style | group / name | `Text/body-sm` |
| Effect style | `Shadow/` + name | `Shadow/focus` |

Figma uses 0-100 for opacity variables: `opacity.disabled` is 55 there and 0.55 everywhere else.

## Proposing a token
Use this format, one block per token, and add the reason to `docs/foundations.md` once approved.

```
Token:   size.badge
Value:   20px
Family:  size
Usage:   Height of the count badge on a tab.
Needed by: Badge
Why no existing token fits: size.icon-md is also 20, but it is the size of an icon; a badge that follows it would change when icons do.
Figma:   FLOAT variable in Dimensions, scope WIDTH_HEIGHT, WEB var(--size-badge), ANDROID sizeBadge
```

A proposal is refused if an existing token's usage note already covers the need. Prefer a new semantic name over reusing a token whose value happens to match: the name says what the value is for.
