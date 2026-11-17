# Components

Screens built from these components are specified in [`screens/`](../screens/README.md).

Every component has a folder with a `README.md`: what it is for, its anatomy, props, the states it must show, the tokens it uses, accessibility rules and do / don't. The README is the spec. The Figma component and the code implement it, and a change starts here.

The Group column sets the groups of the library. The rows of a group stand together, and the order of the table is the order of the library.

| Component | Group | Purpose | Builds on |
|-----------|-------|---------|-----------|

## Rules for every component

- Every value comes from a token in `tokens/tokens.json`. A missing value is proposed as a token in `docs/foundations.md` first.
