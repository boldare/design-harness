---
"@boldare/design-harness": minor
---

Foundations first: in a system with no tokens yet, the skill asks for a source (a brand book, a Figma file, CSS) and never invents a look. From the source it writes a foundations proposal (`references/foundations.md`: every token with its value, usage and where it came from, the tokens the core rules need, contrast and open points) and stops at the `spec` and `tokens` gates. After approval it writes the tokens, the rules and the fonts, and the Figma adapter's new "Starting a library" builds the variables, styles and Foundations page, also for a Figma file given later. The sidebar has no Foundations group until a system has `src/foundations`, so a new system's check no longer warns, and `tokens.css` names its generator and a single theme correctly.
