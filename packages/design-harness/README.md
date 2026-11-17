# @boldare/design-harness

The harness is a design workflow in one package: a skill that takes a design change from a spec to a report, with gates where a person approves, and the CLI and test helpers that the skill's checks run. A design system lives in its own repository. The harness reads the system's files through contracts, which are data formats, and the tools sit behind those contracts as adapters: Figma, describe-me, React and Claude Design. [Atlas](https://github.com/boldare/design-harness/blob/main/examples/atlas/README.md) is the example system and the fixture the evals run on.

The package is not on npm yet, but `init` is here. The contracts and the adapters: [`docs/architecture.md`](https://github.com/boldare/design-harness/blob/main/docs/architecture.md).

## Commands

`init` writes into the working directory. Every other command finds the system's `design-harness.yaml` from the working directory up. Options after the command pass on to it.

| Command | What it does |
|---|---|
| `design-harness init [--name <name>]` | Writes the skeleton of a new system and links the skill into `.claude/skills/design-harness`. The name defaults to the folder's name |
| `design-harness tokens` | Builds the CSS custom properties (`paths.tokens_css`) from the tokens file |
| `design-harness lint` | Fails when a CSS Module under `paths.src` types a value by hand instead of using a token |
| `design-harness states` | Fails when a state in a spec has no recorded test of that name, or when the recorded sidebar differs from the inventory |
| `design-harness claude-design` | Builds the system's Claude Design artifact files (`--out`, `--by`, `--via`, `--note`, `--at`, `--index-from`) |

## Folders

- `skill/`: `SKILL.md` and `references/`, the core: the flow and its gates, the core rules, the spec and token templates, the review checklist.
- `adapters/`: one folder per tool. `react/` holds `code.md`, the token build, the raw-value lint, the Vitest preset (`vitest.mjs`, exported as `@boldare/design-harness/vitest`) and the test helpers in `test/`, exported as `@boldare/design-harness/test`. `describe-me/` holds the plugin options and the states check, `figma/` holds `figma.md`, and `claude-design/` holds `claude-design.md`, the build and the preview helpers.
- `bin/`: `design-harness.mjs`, the CLI.
- `lib/`: `init`, and the readers of the manifest and the inventory that the adapters share.
- `templates/`: what `init` writes. Its `gitignore` becomes `.gitignore`, because `pnpm pack` leaves out a `.gitignore`.

## A system's Vitest config

A system's `vitest.config.ts` is the preset:

```ts
import { defineHarnessConfig } from '@boldare/design-harness/vitest';

export default defineHarnessConfig();
```

The preset finds the system's `design-harness.yaml` from the working directory up and takes from it:

- `paths.src`: the tests are the `*.test.tsx` files under it, and they run in a headless Chromium. No test files is not a failure, so the check of a new system passes. The states check still fails once an inventory row has no recorded test file.
- `paths.tokens_css`, and `<src>/test/canvas.css` when it exists: the package's setup loads both before every test file.
- `paths.preview_head`: the fonts of every recorded frame in describe-me.
- The inventory tables: the groups of the describe-me sidebar and their order.
- `frame`: the size of `PhoneFrame`. A system without a frame has no screens, and `PhoneFrame` throws when it renders.

Overrides go in as the argument and merge with Vitest's `mergeConfig`, so arrays such as `plugins` and `test.setupFiles` add to the preset's.

The tests import the helpers from one place:

```ts
import { expectAccessible, layout, PhoneFrame, respond, responseDelay } from '@boldare/design-harness/test';
```

The preset and the helpers need these next to the package: `vitest`, `@vitest/browser-playwright` with `playwright`, `@vitejs/plugin-react`, `react` and `react-dom`.

## How a designer starts a system

Once the package is on npm:

```
mkdir design-project-x && cd design-project-x && git init
pnpm add -D @boldare/design-harness
pnpm exec design-harness init
pnpm install
pnpm exec playwright install chromium
claude        # "Start the system from the brand book in docs/brand-book.pdf"
```

`init` writes the skeleton of an empty system and links the skill:

- `design-harness.yaml` with the name, and `tokens/tokens.json` with the themes `light` and `dark` and no tokens.
- `docs/foundations.md` and `docs/rules.md`.
- The inventories `components/README.md` and `screens/README.md`, with empty tables.
- In `package.json`, whatever it lacks of `"type": "module"`, the scripts (`check` and its steps, `dev` and `docs`) and the devDependencies a component test needs.
- `vitest.config.ts` on the preset, `tsconfig.json`, `src/index.ts`, `src/vite-env.d.ts`, an empty `src/styles/fonts.html` and `.gitignore`.
- The link `.claude/skills/design-harness` to `../../node_modules/@boldare/design-harness/skill`.

`pnpm install` installs what `init` added to `package.json`. The check then passes with no components. Chromium is needed from the first component test on.

`init` never overwrites a file. It lists each file it skipped and each script it kept. On an unchanged folder, a second run changes nothing but a link that points elsewhere, which it fixes. A real file or folder in the link's place stays, and is listed as skipped. In `package.json`, the one value `init` replaces is npm's placeholder `test` script, which `npm init -y` and `pnpm add` write in a folder without `package.json`. Kept, it would fail the check.

The first session builds the foundations from the source, the next ones the components and screens. An update is `pnpm up @boldare/design-harness`, and the skill follows through the link.
