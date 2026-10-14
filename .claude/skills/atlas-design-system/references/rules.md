# Rules

Each line is a requirement. The review checklist checks all of them.

## Values
- Every value comes from `tokens/tokens.json`. Semantic colour tokens only in components; primitives never.
- A missing value becomes a token proposal (`tokens.md`), never an approximation or a raw value.
- Mockup frame sizes (390 × 844) and fixed asset geometry (icon paths, the Logo mark) are the only numbers that are not tokens.

## States
- Every interactive element has `default`, `focus` and `disabled`. Inputs also have `error`. Anything that waits on a request has `loading`.
- Focus is always visible: `shadow.focus`. Never remove an outline without that replacement.
- Disabled is `opacity.disabled` on the whole element, and no interaction.
- Errors pair a `danger.text` border or mark with a message that says how to fix it. Colour is never the only signal.

## Size and touch
- Every tappable element is at least `size.target-min` in both directions, text links included.
- Controls are `size.control` high. Selection marks are `size.mark`.

## Themes and text
- Everything works in light and dark without changes, because it uses semantic tokens.
- Text uses the Atlas text styles only. Labels can grow to the longest expected translation without breaking the layout (check with strings 40 % longer than English; German and Polish copy often runs long): let them wrap or grow, never fix their width.

## Accessibility
- Real semantic elements: `button`, `a`, `input`, `label`, `fieldset` and `legend`.
- Text contrast at least 4.5:1, borders and icons at least 3:1, in both themes. The usage notes give the measured ratios; a new colour pair is measured before it is used. When a pair fails a rule, look for every other place in the system that uses the same pair and list them in the report, even when fixing them is outside the change.
- Screen reader names and states as written in the component READMEs (`aria-invalid`, `aria-describedby`, `aria-busy`, `role="alert"`, `role="status"`).

## Reuse
- Compose from existing components. A new component needs a reason in the spec: what it does that no existing component or variant does.
- Icons come from the Icon set. A new icon follows `components/Icon/README.md` (24-unit grid, round caps and joins).
