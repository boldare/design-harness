# Components

Every component has a folder with a `README.md`: what it is for, its anatomy, props, the states it must show, the tokens it uses, accessibility rules and do / don't. The README is the spec. The Figma component and the code implement it, and a change starts here.

| Component | Purpose | Builds on |
|-----------|---------|-----------|
| [Icon](Icon/README.md) | Stroke icons in two sizes | - |
| [Button](Button/README.md) | Primary and quiet actions, with loading | Icon |
| [IconButton](IconButton/README.md) | An action shown only as an icon | Icon |
| [Link](Link/README.md) | Navigation and secondary actions inside text | - |
| [TextField](TextField/README.md) | Text, email and password input with label and message | Icon, IconButton |
| [Select](Select/README.md) | One choice from a list, as a field with a menu | Icon |
| [Checkbox](Checkbox/README.md) | Independent yes / no choices, consents | Icon |
| [Radio](Radio/README.md) | One choice from a short visible list | - |
| [Switch](Switch/README.md) | A setting that takes effect immediately | - |
| [Alert](Alert/README.md) | A message about the whole form or screen | Icon |
| [AccountCard](AccountCard/README.md) | The signed-in person, with avatar | - |

## Rules for every component

- Every value comes from a token in `tokens/tokens.json`. No hex codes, pixel values or font sizes typed by hand. A missing value is proposed as a token in `docs/foundations.md` first.
- Every interactive element shows `shadow.focus` when it has keyboard focus and has a touch target of at least `size.target-min`.
- Disabled means `opacity.disabled` on the whole component, and no interaction.
- Every component works in both themes without changes, because it uses semantic colour tokens only.
- Text is never baked into images, and every label can grow to the longest expected translation without breaking the layout.
