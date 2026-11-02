# Architecture: the harness and a design system

Status: proposed (02.11.2026), step 2 of [`plans/workflow-split.md`](plans/workflow-split.md). The owner approves it before any code moves; steps 3 to 5b implement it.

The harness is a workflow in one npm package, `@boldare/design-harness`: a skill that takes a design change from a spec to a report, with gates where a person approves, and the CLI and test helpers that the skill's checks run. A design system lives in its own repository. A designer starts one by adding the package and running `design-harness init`, then builds the system with the skill, one approved piece at a time. The harness reads the system's files through contracts, which are data formats, and the tools sit behind those contracts as adapters: Figma, describe-me, React and Claude Design. Atlas is the example system in this repository and the fixture the evals run on.

## Decisions this document proposes

1. **One package, one install.** `@boldare/design-harness` carries the skill and the runtime: the CLI, the test helpers and the Vitest preset. `design-harness init` links `node_modules/@boldare/design-harness/skill` into the project's `.claude/skills/design-harness`, so the skill is always the version the lockfile pins, and CI gets everything from the install. Claude Code 2.1.309 loads a skill through that link, a pnpm store link included (checked 02.11.2026). Nothing is cloned into `~/.claude/skills`. The name `design-harness` is taken on npm by an unrelated package, so the package is scoped; the command stays `design-harness`.
2. **A system lives in its own repository.** This repository holds the package (`packages/design-harness/`), the evals and the docs, and Atlas as `examples/atlas/`: the example, the eval fixture and the first consumer, which depends on the package through the workspace as a project does through npm.
3. **A system can start from an empty repository.** `design-harness init` writes the skeleton: the manifest, an empty tokens file, the two inventories, the npm scripts, the Vitest config and the skill link. The skill then works foundations first: from a source the designer names (a brand book, the variables of the client's Figma, CSS the project already has) it proposes the tokens and the foundations, the designer approves them at the `tokens` gate, and only then come components. The skill still never invents a look; with nothing to extend, it asks for a source.
4. **The Figma file key stays in `figma/library.json`.** The plan's first draft of the manifest also had `outputs.figma.file`, and one key in two places drifts. The manifest points at the library file instead.

## Layers

| Layer | What it holds | Owned by |
|---|---|---|
| **Core** | The flow and its gates, the core rules, the spec and token templates, the review checklist and the report, the CLI, what `init` writes | The package, versioned and published |
| **Adapters** | One folder per tool: what the skill needs to know about the tool, and the scripts and helpers that implement the contracts with it | The package |
| **System** | Tokens, foundations, system rules, specs, the Figma library record, components and screens in code, Claude Design content, the manifest | The project team, in its repository |
| **Generated** | `tokens.css`, `.describe-me/`, the Claude Design build | Written by the adapters into the system; only `tokens.css` is tracked, because the app imports it |

The evals belong to this repository, not to the package: they test the skill before a release.

## The flow

The skill runs seven steps. A gate closes each one; `human` is where the skill stops and waits.

| Gate | Step | Approval | What passes it |
|---|---|---|---|
| `frame` | 1. Frame the request | auto | What is added, what is reused, what is missing, in two or three lines |
| `spec` | 2. Spec | human | The designer approves the spec and any token proposals, unless the request says to go straight through |
| `tokens` | 3. Tokens | human, only with new tokens | Approved tokens in the tokens file and the foundations, `design-harness tokens` run |
| `figma` | 4. Figma | auto | A screenshot in both themes; the sections in the order of the inventory (step 1c) |
| `code` | 5. Code | auto | `npm run check` |
| `states` | 5. Code | auto | `design-harness states`: every state in a spec has a recorded test |
| `sync` | 6. Claude Design | auto | The build and the publish |
| `report` | 7. Review and report | human | The change report |

These gates are the core and come with the package. A system adds its own in the manifest (for example `visual` from step 1b), and can make an `auto` gate `human`. It cannot remove `spec` or `report`. An output the manifest leaves out (Figma, Claude Design) skips its step and its gate.

With an empty tokens file the first change is the foundations: the spec is the source and the token proposals, the `tokens` gate approves them, and the figma step builds the variables, the text and effect styles and the Foundations page. Components and screens come after, through the same seven steps.

## Contracts

What the core reads, in what shape, and who writes it. The paths are relative to the system's root and are the defaults; the manifest can change them.

| Contract | File | Shape the core relies on | Written by | Read by |
|---|---|---|---|---|
| Tokens | `tokens/tokens.json` | `name`, `version`, `meta`, then one family per kind (`color`, `type`, `spacing`, …), each with tokens of `name`, `value` (or a value per theme) and `usage`; text styles in `type.groups[].styles[]` | `init` (empty), then the skill after an approved proposal | Every adapter, the raw-value lint |
| Specs | `components/<Name>/README.md`, `screens/<Name>/README.md` | The sections of the templates in the skill; the states in `## States`, as the first column of its table or the backticked names in its first sentence | The skill, approved by the designer | The skill, the states check, Claude Design |
| Inventory | `components/README.md`, `screens/README.md` | A table whose first column links `[Name](Name/README.md)`, in library order; a Group column from step 1c; "Rules for every component" below it | `init` (empty), then the skill | Every adapter: the order and the groups |
| System rules | `docs/rules.md` | Requirements on top of the core rules, one per line (step 4) | The team | The skill, the review checklist |
| Foundations | `docs/foundations.md` | Where values came from and what was decided; every token decision recorded | The skill, with each new token | The skill, Claude Design |
| Figma library | `figma/library.json` | The file key and URL, the naming rules, the variable collections with ids and modes, the pages, the components with their node ids, notes | The Figma adapter, after each change | The skill, to find nodes |
| States record | `.describe-me/manifest.json` | `modules[].id`, `modules[].tests[].name`, from step 1c `modules[].group`; a test file `<src>/components/<Name>/<Name>.test.tsx` with `describe('<Name>')` and one `it('<state>')` per state | The describe-me adapter, on every test run | The states check |
| Checks | `package.json` | Scripts `tokens`, `lint:tokens`, `typecheck`, `test`, `check-states` and `check`, calling the CLI | `init` | The `code` gate, CI |
| Report | the skill's last message | The change report in the review checklist | The skill | The reviewer |

The contracts are data, not an adapter API. No manifest key gets a single allowed value, and each tool's files stay in one folder, so a second adapter later is a move, not a rewrite.

## Adapters

All four are the defaults and, for now, the only ones (decisions 3 and 8 of the plan). Each is a folder in `packages/design-harness/adapters/`.

| Adapter | Implements | Holds |
|---|---|---|
| `react/` | Tokens for the platform, code | `code.md`; the token build (`tokens.json` to CSS custom properties, `surface.page` to `--surface-page`); the raw-value lint for CSS Modules; the test helpers (setup, axe in both themes, the phone frame sized from the manifest, the layout classes, `respond()`), exported as `@boldare/design-harness/test`; the Vitest preset, exported as `@boldare/design-harness/vitest` |
| `describe-me/` | States and preview | The plugin options (fonts from the system's preview head, the sidebar groups from the inventory from step 1c); the reader of `.describe-me/manifest.json` for the states check. Tested with describe-me 0.12.1, a dependency of the package |
| `figma/` | Design | `figma.md`, the method: variables, text and effect styles, components with variants, screens from instances, the screenshot check. Uses the Figma MCP |
| `claude-design/` | Output (optional) | `claude-design.md`, how the sync works; the build; the preview helpers shared by every card. The global is `window[name]`, not `window.Atlas` |

The states check has two halves: the comparison of specs with recorded states is core, and the reader of the manifest is the describe-me adapter's. Until a second adapter exists they stay in one file in `describe-me/`.

## The manifest

`design-harness.yaml` at the root of the system: the project's repository, or `examples/atlas/` here. Only `name` is required.

```yaml
name: Atlas                          # reports, Figma pages, the Claude Design namespace and global
paths:                               # the defaults
  tokens: tokens/tokens.json
  tokens_css: src/styles/tokens.css  # what the token build writes and the app imports
  foundations: docs/foundations.md
  rules: docs/rules.md
  components: components             # specs and the inventory
  screens: screens
  src: src                           # <src>/components/<Name>, <src>/screens/<Name>
  preview_head: src/styles/fonts.html  # fonts for the test page and every recorded frame
frame: { width: 390, height: 844 }   # the screen mockup; without it the system has no screens
outputs:                             # an output left out skips its step and its gate
  figma: { library: figma/library.json }
  claude_design: { sources: claude-design }   # brand book, cover, one preview per component
gates:                               # added to the core gates
  - { id: visual, after: code, approval: auto, check: "npm run test:visual" }
```

The text styles are not listed: they are the `type.groups` of the tokens file. The harness version is not listed either: the project's lockfile pins it, and the skill comes from the same install.

## Repositories

```
design-harness/                      this repository, a pnpm workspace as in describe-me
  packages/design-harness/           @boldare/design-harness, published
    skill/                           SKILL.md and references/: the core
    adapters/                        react/, describe-me/, figma/, claude-design/
    bin/design-harness.mjs           init · tokens · lint · states · claude-design
    templates/                       what init writes
  examples/atlas/                    the example system and the eval fixture
  evals/                             the skill evals; the scaffold copies examples/atlas
  scripts/eval-e2e.sh
  docs/                              the plan, this file

design-project-x/                    a designer's repository
  package.json                       devDependencies: @boldare/design-harness
  design-harness.yaml
  .claude/skills/design-harness      link to node_modules/@boldare/design-harness/skill
  tokens/  docs/  components/  screens/  figma/  src/
```

## Where every file goes

Today's path, its path after step 5, and its layer. `skill:` is short for `.claude/skills/atlas-design-system/` today, and `pkg/` for `packages/design-harness/` after the move.

| Today | After step 5 | Layer |
|---|---|---|
| `skill:SKILL.md` | `pkg/skill/SKILL.md`, skill `design-harness` | Core |
| `skill:references/component-spec.md`, `screens.md`, `tokens.md`, `review-checklist.md` | `pkg/skill/references/` | Core |
| `skill:references/rules.md` | `pkg/skill/references/rules.md` (core rules) and `examples/atlas/docs/rules.md` (Atlas rules), step 4 | Split |
| `skill:references/code.md` | `pkg/adapters/react/code.md` | React |
| `skill:references/figma.md` | `pkg/adapters/figma/figma.md`; the file key and ids stay only in `library.json` | Figma |
| `skill:evals/*` | `evals/*`, not published; the scaffold copies `examples/atlas/` | Core |
| `scripts/eval-e2e.sh` | `scripts/eval-e2e.sh`, not published | Core |
| `scripts/build-tokens.mjs`, `check-raw-values.mjs` | `pkg/adapters/react/` | React |
| `scripts/check-states.mjs` | `pkg/adapters/describe-me/` | describe-me |
| `scripts/build-claude-design.mjs`, `scripts/claude-design/preview.js`, `preview.css` | `pkg/adapters/claude-design/` | Claude Design |
| `scripts/claude-design/brand-book.md`, `cover.html`, `previews/*` | `examples/atlas/claude-design/` | System |
| `docs/claude-design.md` | `pkg/adapters/claude-design/claude-design.md`; the artifact link in `examples/atlas/README.md` | Split |
| `docs/evals.md` | `evals/README.md` | Core |
| `docs/plans/`, `docs/architecture.md` | `docs/` | Core |
| `src/test/setup.ts`, `a11y.ts`, `PhoneFrame.tsx`, `PhoneFrame.module.css`, `layout.module.css`, `respond.ts` | `pkg/adapters/react/test/` | React |
| `src/test/canvas.css` | `examples/atlas/src/test/canvas.css`; it names Atlas tokens | System |
| `vitest.config.ts` | `examples/atlas/vitest.config.ts` on the preset; `init` writes the same for a new system | Split |
| `tokens/`, `docs/foundations.md`, `components/`, `screens/`, `figma/library.json` | `examples/atlas/` | System |
| `src/components/`, `src/screens/`, `src/foundations/`, `src/styles/`, `src/index.ts`, `src/vite-env.d.ts` | `examples/atlas/src/` | System |
| `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts` | A private workspace root with `pnpm-lock.yaml`; `pkg/package.json` is the package; `examples/atlas/package.json` depends on it with `workspace:*` | Split |
| `README.md` | The root README is the repository's; `pkg/README.md` is the npm page and how to start; `examples/atlas/README.md` describes Atlas | Split |
| `.idea/` | Removed from git | None |

## How a designer starts a system

```
mkdir design-project-x && cd design-project-x && git init
pnpm add -D @boldare/design-harness
pnpm exec design-harness init
claude        # "Start the system from the brand book in docs/brand-book.pdf"
```

`init` writes the skeleton and links the skill. The first session builds the foundations from the source, the next ones the components and screens. An update is `pnpm up @boldare/design-harness`; the skill follows through the link.

## Not decided here

- Which rules are core and which are Atlas's: step 4.
- How the inventory sets the order in the three outputs: step 1c.
- The release process (versions, changelog, publishing from CI): the owner sets it up.
- The CI action for a system repository: step 7.
