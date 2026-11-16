# Atlas

The Atlas design system, kept as files that people and agents read and change in the same way. It is the example system of design-harness and the fixture its evals run on.

- `tokens/tokens.json` is the source of truth: colours (light and dark), type, spacing, radius, size, stroke and shadow. Every token carries a usage note.
- `docs/foundations.md` records where each value came from and the decisions behind it.
- `docs/rules.md` holds the Atlas rules on top of the skill's core rules: the tokens for focus, disabled, errors and touch size, the frame, the text styles, the icon and logo geometry, the persona.
- `figma/library.json` maps tokens to the Figma library ([design-harness](https://www.figma.com/design/XHhJ2l7C09Si5uQu3EBmUH), Boldare S.A. / Gildia designu): file and collection ids, and the naming rules from token to Figma variable, CSS variable and Android name.
- Claude Design has the same system as an artifact ([Atlas](https://claude.ai/artifact/1tmtuAJXcgkirZ25hAMPY5)), generated from these files by `pnpm claude-design`. How the sync works: `claude-design.md` in the package's Claude Design adapter ([`packages/design-harness/adapters/claude-design/claude-design.md`](../../packages/design-harness/adapters/claude-design/claude-design.md)).

The rule: every value in a component comes from a token. A value no token covers becomes a proposal for a new token, recorded in `docs/foundations.md` before any component uses it.

- `components/` holds the spec of every component (README), `screens/` the screens composed from them, `src/` the React implementation, documented by its tests with describe-me (`pnpm dev` for the viewer, `pnpm check` for every check, both run in `examples/atlas/`).
- `design-harness.yaml` is the manifest: the system's name, where its files are, its frame and its outputs. The scripts find the system through it ([`docs/architecture.md`](../../docs/architecture.md#the-manifest)).

`.claude/skills/design-harness` links the package's skill, and Claude Code started in `examples/atlas/` loads it. The link resolves once `pnpm install` has run.
