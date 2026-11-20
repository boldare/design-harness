# Foundations proposal

The first change of an empty system. It turns a source the designer names into tokens, and it is the spec of that change: write it in `docs/foundations.md` (`paths.foundations`), show it, and wait at the `spec` and `tokens` gates. Once approved, the same file stays the record of where each value came from: the proposal's tables become the record, and each open point gets the answer the designer gave.

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

### Decisions
<Numbered. What only the designer can decide: a choice with no value you can defend, values that conflict,
 a theme the source does not have. Each with two to four lettered options, the recommended one first and marked "(recommended)",
 and what each means for the system (values, contrast).>

### Defaults
<Values the source does not give that the proposal uses, one line each: the value and why.
 They are approved with the proposal unless the designer changes them.>
```

Keep the decisions few: a point with a value you can defend is a default, not a decision. Figma and Claude Design are not open points of the foundations: when the manifest has no outputs, ask about them after approval.

## Families and names
- Colour: primitives named by hue and step (`blue.600`), the source's values unchanged, used only through semantic tokens. Semantic tokens named by role (`surface.page`, `text.primary`, `action.primary`, `danger.text`), each with one value per theme, aliasing a primitive.
- Type: the families, then the text styles in groups (`Headings/title`, `Text/body`), each with size, line height, weight, letter spacing and usage.
- Spacing, radius, size, stroke, shadow, opacity, duration: only what the source gives or the core rules need. A family with nothing in the source is left out, not filled with a default scale.
- Names follow `references/tokens.md`, and every token has a usage note that says when to use it.

## What the source rarely says
Propose these only as open points: a default with the reason, or a decision with options:
- A dark theme, when the source has one look. Ask whether the system has one theme or more; the empty tokens file lists light and dark, so a one-theme system removes dark.
- Focus: a ring colour and width that pass 3:1 on every surface.
- Error and success colours, when the source has no semantic palette.
- The minimum touch target (WCAG 2.5.8 asks for 24 px; Apple and Material use 44 and 48).
- The screen frame (`frame` in the manifest), when the system will have screens.

## Showing the proposal
The designer reads the reply, not the file, so the reply carries every open point: never a selection of "the most important".

1. In two or three lines, what the proposal is (themes, colours, type) and where it is written.
2. The defaults, as one list, one line each, approved with the proposal unless the designer changes one.
3. The decisions. When the session has a tool that asks questions with options (`AskUserQuestion` in Claude Code), ask them with it: one question per decision, its options with the recommended one first and marked "(recommended)", at most four questions per call, and another call for the rest. Make the last question the approval: write the tokens now, or let the designer read `docs/foundations.md` first. Without such a tool, or when it fails, list the decisions numbered, with their lettered options, so the designer can answer "1a, 2b", and end by asking for approval.

Write each answer into the file: a decision gets the option chosen, a changed default its new value.
