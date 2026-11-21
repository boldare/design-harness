# Working on this design system

This repository is a design system made with [design-harness](https://github.com/boldare/design-harness), and the source of truth for it.

- Every change to how the system looks or behaves goes through the `design-harness` skill: the spec first, and every value from a token.
- A change is done when `npm run check` passes.
- Everything in the repository is in English: specs, docs, code, commits and PRs.
- Commit messages are one short line in the Conventional Commits style (`feat: the Badge component`, `fix: …`, `docs: …`), with no body and no trailers. The why goes in the PR description.
