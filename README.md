# design-harness

A design workflow for Claude: a skill that takes a change to a design system from a spec to a report, with gates where a person approves, and keeps the spec, the tokens, the Figma library, the code and Claude Design in step.

This repository holds:

- the package [`@boldare/design-harness`](packages/design-harness/README.md), on GitHub Packages from 0.1.0 ([`RELEASING.md`](RELEASING.md)): the skill, the adapters, the test helpers and the `design-harness` CLI,
- Atlas, the example design system and the fixture the evals run on,
- the evals of the skill,
- the docs: the architecture and the plan.

## Layout

```
packages/design-harness/   @boldare/design-harness: skill/, adapters/, lib/, templates/, bin/design-harness.mjs
examples/atlas/            Atlas, the example system and the eval fixture
evals/                     the skill evals, whose scaffold copies examples/atlas and the package
scripts/eval-e2e.sh        the end-to-end eval
scripts/check-init.sh      init on the packed package, in an empty system
docs/                      the architecture and the plan
.claude-plugin/            the skill as a plugin, for claude plugin eval
```

## Check

The repository is a pnpm workspace. From its root:

```
pnpm install
pnpm --filter ./examples/atlas exec playwright install chromium
pnpm check
pnpm claude-design
```

`pnpm check` runs Atlas's checks: the raw-value lint, the typecheck, the tests (the stories and axe in both themes) and the states check. `pnpm claude-design` builds Atlas for Claude Design into `examples/atlas/claude-design/project/`, next to the card sources.

`scripts/check-init.sh` packs the package and starts an empty system from the tarball in a temporary folder. It runs `init` and the system's check, checks the skill link and the paths its `SKILL.md` names, and runs `init` again, which must change nothing. It needs the npm registry. CI runs it after the Claude Design build.

```
scripts/check-init.sh
```

## Evals

From the root of a detached worktree of the commit under test:

```
claude plugin eval . --scaffold --allow-tools Write Edit -j 1
scripts/eval-e2e.sh
```

The cases, the results and how they were run: [`evals/README.md`](evals/README.md).

## Docs

- [`docs/architecture.md`](docs/architecture.md): the harness and a design system, the contracts between them and where every file goes.
- [`docs/plans/workflow-split.md`](docs/plans/workflow-split.md): the plan that splits the workflow from Atlas.
