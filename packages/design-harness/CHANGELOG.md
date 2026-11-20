# @boldare/design-harness

## 0.2.0

### Minor Changes

- [#25](https://github.com/boldare/design-harness/pull/25) [`21fcf86`](https://github.com/boldare/design-harness/commit/21fcf86114090c66a1539fd37fe2984e4f5e9631) Thanks [@grzehub](https://github.com/grzehub)! - Foundations first: in a system with no tokens yet, the skill asks for a source (a brand book, a Figma file, CSS) and never invents a look. From the source it writes a foundations proposal (`references/foundations.md`: every token with its value, usage and where it came from, the tokens the core rules need, contrast and open points) and stops at the `spec` and `tokens` gates. After approval it writes the tokens, the rules and the fonts, and the Figma adapter's new "Starting a library" builds the variables, styles and Foundations page, also for a Figma file given later. The sidebar has no Foundations group until a system has `src/foundations`, so a new system's check no longer warns, and `tokens.css` names its generator and a single theme correctly.

### Patch Changes

- [#23](https://github.com/boldare/design-harness/pull/23) [`f020611`](https://github.com/boldare/design-harness/commit/f02061112e6c3475005d6324db8d15087b85d89c) Thanks [@grzehub](https://github.com/grzehub)! - The skill puts a new component or screen in its group of the inventory table in the spec step, and starts a new group only as an open point for the designer. The Figma adapter keeps one section per group on the Components and Screens pages, in table order, and its check compares the sections of a page with the table.

## 0.1.0

### Minor Changes

- [#20](https://github.com/boldare/design-harness/pull/20) [`09f81dd`](https://github.com/boldare/design-harness/commit/09f81dd29ffe8e0024b52d5045ab89f87674935b) Thanks [@grzehub](https://github.com/grzehub)! - The first release: the design-harness skill, `design-harness init`, the CLI (`tokens`, `lint`, `states`, `claude-design`), the Vitest preset (`@boldare/design-harness/vitest`) and the test helpers (`@boldare/design-harness/test`). Anything below 1.0.0 may change its contracts and exports between minors; the changelog says when.
