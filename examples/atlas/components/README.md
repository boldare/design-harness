# Components

Screens built from these components are specified in [`screens/`](../screens/README.md).

Every component has a folder with a `README.md`: what it is for, its anatomy, props, the states it must show, the tokens it uses, accessibility rules and do / don't. The README is the spec. The Figma component and the code implement it, and a change starts here.

The Group column sets the groups of the library. The rows of a group stand together, and the order of the table is the order of the library.

| Component | Group | Purpose | Builds on |
|-----------|-------|---------|-----------|
| [Icon](Icon/README.md) | Icons | Stroke icons in two sizes | - |
| [Button](Button/README.md) | Actions | Primary and quiet actions, with loading | Icon |
| [IconButton](IconButton/README.md) | Actions | An action shown only as an icon | Icon |
| [Link](Link/README.md) | Actions | Navigation and secondary actions inside text | - |
| [TextField](TextField/README.md) | Inputs | Text, email and password input with label and message | Icon, IconButton |
| [Select](Select/README.md) | Inputs | One choice from a list, as a field with a menu | Icon |
| [Checkbox](Checkbox/README.md) | Selection | Independent yes / no choices, consents | Icon |
| [Radio](Radio/README.md) | Selection | One choice from a short visible list | - |
| [Switch](Switch/README.md) | Selection | A setting that takes effect immediately | - |
| [Slider](Slider/README.md) | Selection | A value on a range, such as brightness, that takes effect immediately | - |
| [Alert](Alert/README.md) | Feedback | A message about the whole form or screen | Icon |
| [StatusMark](StatusMark/README.md) | Feedback | A large confirmation mark on outcome screens | Icon |
| [AccountCard](AccountCard/README.md) | Identity | The signed-in person, with avatar | - |
| [Logo](Logo/README.md) | Identity | The Atlas mark and wordmark | - |

## Rules for every component

- Every value comes from a token in `tokens/tokens.json`. No hex codes, pixel values or font sizes typed by hand. A missing value is proposed as a token in `docs/foundations.md` first.
- Every interactive element shows `shadow.focus` when it has keyboard focus and has a touch target of at least `size.target-min`.
- Disabled means `opacity.disabled` on the whole component, and no interaction.
- Every component works in both themes without changes, because it uses semantic colour tokens only.
- Text is never baked into images, and every label can grow to the longest expected translation without breaking the layout.
