# Foundations proposal

The first change of an empty system. It turns a source the designer names into tokens, and it is the spec of that change: write it in `docs/foundations.md` (`paths.foundations`), show it, and wait at the `spec` and `tokens` gates. Atlas's `docs/foundations.md` is the model of the result, after approval.

## Read the source
- A brand book: its colours, typefaces and sizes, its spacing or grid, its corners, and what it says each one is for. Read all of it; usage often sits next to the swatches, not in them.
- A Figma file: its variables (collections, modes, scopes) and its text and effect styles, through the Figma MCP. Keep its names where they say what a value is for.
- CSS or a theme (custom properties, a Tailwind `@theme`, a MUI theme): the values and how the project's components use them.

Every value in the proposal traces to the source, or is listed under "Not in the source" for the designer to decide. Nothing is filled in silently, however typical.

## Sections

```
# Foundations: where the values come from

<Two or three lines: the source (file, page or link, date) and what it covers.>

## Proposed tokens
<One table per family, in the order of the tokens file: Token | Value | Usage | Source.
 Source is the page or section of the source, "derived" with how (for example "blue.600 at 10 %"),
 or "not in the source".>

## Tokens for the core rules
<The focus token, the disabled opacity, the error colour and the minimum target, each named, with its value and where it came from.
 These lines go into the system's rules (docs/rules.md) once approved.>

## Normalised
<Values snapped to a scale or merged, as a table: source | now | why. Or "none".>

## Contrast
<Every text and icon colour on every surface it is meant for, per theme, with the measured ratio. A pair under 4.5:1 for text
 or 3:1 for borders and icons is an open point, not a token.>

## Open points
<Decisions for the designer: what the source does not say, values that conflict, a theme the source does not have.>
```

## Families and names
- Colour: primitives named by hue and step (`blue.600`), the source's values unchanged, used only through semantic tokens. Semantic tokens named by role (`surface.page`, `text.primary`, `action.primary`, `danger.text`), each with one value per theme, aliasing a primitive.
- Type: the families, then the text styles in groups (`Headings/title`, `Text/body`), each with size, line height, weight, letter spacing and usage.
- Spacing, radius, size, stroke, shadow, opacity, duration: only what the source gives or the core rules need. A family with nothing in the source is left out, not filled with a default scale.
- Names follow `references/tokens.md`, and every token has a usage note that says when to use it.

## What the source rarely says
Propose these only as open points, with the reason and, where it helps, a value the designer can accept or change:
- A dark theme, when the source has one look. Ask whether the system has one theme or more; the empty tokens file lists light and dark, so a one-theme system removes dark.
- Focus: a ring colour and width that pass 3:1 on every surface.
- Error and success colours, when the source has no semantic palette.
- The minimum touch target (WCAG 2.5.8 asks for 24 px; Apple and Material use 44 and 48).
- The screen frame (`frame` in the manifest), when the system will have screens.
