---
'@boldare/design-harness': patch
---

Fixes found building the first component of a real system: a token that points at a semantic colour (such as a shadow) follows the theme of a section with its own `data-theme`, and the default theme gets a `[data-theme]` block too; `check-states` reads `## Variants and states`, the heading of the spec template, as well as `## States`; the test and preview helpers no longer read spacing and stroke tokens a system may not have; the React adapter draws focus with an outline when the system's focus tokens are a colour and a stroke, or when the component has a shadow of its own.
