# Working on design-harness

- Everything in the repository is in English: code, docs, skill text, commits and PRs.
- Commit messages are one short line in the Conventional Commits style (`feat: groups in the inventory table`, `fix: …`, `docs: …`, `chore: …`), with no body and no trailers. The why goes in the PR description.
- PR titles follow the same style: a squash merge makes the title the commit on `main`.
- A change to the published package (`packages/design-harness`) has a changeset (`pnpm changeset`).
- A change to the skill's text (`skill/`, `adapters/`) runs the evals first (`evals/README.md`) and records the result there.
- The repository is public: no client names and no client code, in files, commits or PRs.
