# design-harness

The Atlas design system, kept as files that people and agents read and change in the same way.

- `tokens/tokens.json` is the source of truth: colours (light and dark), type, spacing, radius, size, stroke and shadow. Every token carries a usage note.
- `docs/foundations.md` records where each value came from and the decisions behind it.
- `figma/library.json` maps tokens to the Figma library ([design-harness](https://www.figma.com/design/XHhJ2l7C09Si5uQu3EBmUH), Boldare S.A. / Gildia designu): file and collection ids, and the naming rules from token to Figma variable, CSS variable and Android name.

The rule: every value in a component comes from a token. A value no token covers becomes a proposal for a new token, recorded in `docs/foundations.md` before any component uses it.

- `components/` holds the spec of every component (README), `screens/` the screens composed from them, `src/` the React implementation with Storybook (`npm run storybook`).

Coming next: a Claude skill that adds new components and screens inside these rules, and keeps Figma, code and Claude Design in step.
