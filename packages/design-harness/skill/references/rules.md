# Core rules

Each line is a requirement for every system. The system's own rules (`paths.rules` in the manifest, `docs/rules.md` by default) come on top: they name the tokens these rules use, and add what is true only for that system. The review checklist checks both.

## Process
- The spec comes first. Nothing is built in Figma or code before the designer approves the spec, unless the request says to go straight through.
- A human gate (`spec`, `tokens` with new tokens, `report`, and any the manifest adds) is a stop: wait for the person. An `auto` gate passes on its check.
- Every change ends with the change report from the review checklist.

## Values
- Every value comes from the tokens file. Semantic colour tokens only in components; primitives never.
- A missing value becomes a token proposal (`tokens.md`), never an approximation or a raw value.
- The screen frame (`frame` in the manifest) and fixed asset geometry (icon paths, a logo mark) are the only numbers that are not tokens.

## States
- Every interactive element has `default`, `focus` and `disabled`. Inputs also have `error`. Anything that waits on a request has `loading`.
- Focus is always visible, with the system's focus token. Never remove an outline without that replacement.
- Disabled is the system's disabled opacity on the whole element, and no interaction.
- Errors pair a border or mark in the system's error colour with a message that says how to fix it. Colour is never the only signal.

## Size and touch
- Every tappable element is at least the system's minimum target size in both directions, text links included.
- Controls and selection marks take the sizes the system rules name.

## Themes and text
- Everything works in every theme of the system without changes, because it uses semantic tokens.
- Text uses the system's text styles only (`type.groups` in the tokens file). Labels can grow to the longest expected translation without breaking the layout (check with strings 40 % longer than English; German and Polish copy often runs long): let them wrap or grow, never fix their width.

## Accessibility
- Real semantic elements: `button`, `a`, `input`, `label`, `fieldset` and `legend`.
- Text contrast at least 4.5:1, borders and icons at least 3:1, in every theme. The usage notes give the measured ratios; a new colour pair is measured before it is used. When a pair fails a rule, look for every other place in the system that uses the same pair and list them in the report, even when fixing them is outside the change.
- Screen reader names and states as written in the component READMEs (`aria-invalid`, `aria-describedby`, `aria-busy`, `role="alert"`, `role="status"`).

## Reuse
- Compose from existing components. A new component needs a reason in the spec: what it does that no existing component or variant does.
- Icons come from the system's icon set and follow its spec.
