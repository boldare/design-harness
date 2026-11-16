# @boldare/design-harness

The harness is a design workflow in one package: a skill that takes a design change from a spec to a report, with gates where a person approves, and the CLI and test helpers that the skill's checks run. A design system lives in its own repository. The harness reads the system's files through contracts, which are data formats, and the tools sit behind those contracts as adapters: Figma, describe-me, React and Claude Design. [Atlas](https://github.com/boldare/design-harness/blob/main/examples/atlas/README.md) is the example system and the fixture the evals run on.

The package is not on npm yet, and `init` comes in a later version. The contracts and the adapters: [`docs/architecture.md`](https://github.com/boldare/design-harness/blob/main/docs/architecture.md).

## Commands

Each command finds the system's `design-harness.yaml` from the working directory up. Options after the command pass on to it.

| Command | What it does |
|---|---|
| `design-harness tokens` | Builds the CSS custom properties (`paths.tokens_css`) from the tokens file |
| `design-harness lint` | Fails when a CSS Module under `paths.src` types a value by hand instead of using a token |
| `design-harness states` | Fails when a state in a spec has no recorded test of that name, or when the recorded sidebar differs from the inventory |
| `design-harness claude-design` | Builds the system's Claude Design artifact files (`--out`, `--by`, `--via`, `--note`, `--at`, `--index-from`) |

## Folders

- `skill/`: `SKILL.md` and `references/`, the core: the flow and its gates, the core rules, the spec and token templates, the review checklist.
- `adapters/`: one folder per tool. `react/` holds `code.md`, the token build, the raw-value lint and the test helpers in `test/`, which tests import as `@boldare/design-harness/adapters/react/test/<helper>`. `describe-me/` holds the states check, `figma/` holds `figma.md`, and `claude-design/` holds `claude-design.md`, the build and the preview helpers.
- `bin/`: `design-harness.mjs`, the CLI.
- `lib/`: the readers of the manifest and the inventory that the adapters share.

## How a designer starts a system

Once the package is on npm with `init`:

```
mkdir design-project-x && cd design-project-x && git init
pnpm add -D @boldare/design-harness
pnpm exec design-harness init
claude        # "Start the system from the brand book in docs/brand-book.pdf"
```

`init` writes the skeleton and links the skill. The first session builds the foundations from the source, the next ones the components and screens. An update is `pnpm up @boldare/design-harness`, and the skill follows through the link.
