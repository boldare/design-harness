# Architecture: the harness and a design system

Status: proposed (02.11.2026), step 2 of [`plans/workflow-split.md`](plans/workflow-split.md). The owner approves it before any code moves; steps 3 to 5 implement it.

The harness is a workflow: a skill that takes a design change from a spec to a report, with gates where a person approves. A design system plugs into it with one manifest, `design-harness.yaml`. The harness reads the system's files through contracts, which are data formats, and the tools sit behind those contracts as adapters: Figma, describe-me, React and Claude Design. Atlas is the reference system and the harness's first consumer.

## Decisions this document proposes

The plan left three points open or got them wrong. Each one changes what steps 3 to 5 build.

1. **The repository root is the harness.** The plan's first draft of step 5 moved the workflow into `harness/` and made `git clone` of `harness/` the install, but git cannot clone a directory. The skill (`SKILL.md`, `references/`), the adapters, `bin/` and the evals sit at the root, and Atlas moves to `systems/atlas/`. Cloning the repository into `~/.claude/skills/design-harness` is the install, and Atlas comes along as the example.
2. **A project gets the runtime from a git dependency.** Part of the harness runs inside the project, not in Claude: the scripts that its CI runs (step 7) and the test helpers that its tests import. A clone in `~/.claude/skills` is not there in CI. A project therefore adds the harness pinned to a tag, `"design-harness": "github:boldare/design-harness#v0.1.0"`, and gets the CLI (`design-harness tokens | lint | states | claude-design`) and the helpers (`design-harness/test`, `design-harness/vitest`). Nothing is published: npm only fetches the tag, so decision 6 still holds for packaging. Atlas uses `"design-harness": "file:../.."` and takes the same path as any project. The skill's clone and the project's dependency must be on the same tag, and the skill checks that before it starts. CI needs read access to the private repository (a deploy key or a token).
   The alternative: the skill copies the runtime into the project (`.design-harness/`). That works in CI without access, but every project carries its own copy, and an update is a new copy that drifts.
3. **The Figma file key stays in `figma/library.json`.** The plan's first draft of the manifest also had `outputs.figma.file`, and one key in two places drifts. The manifest points at the library file instead.

## Layers

| Layer | What it holds | Owned by |
|---|---|---|
| **Core** | The flow and its gates, the core rules, the spec and token templates, the review checklist and the report, the evals, the CLI | The harness, versioned by tag |
| **Adapters** | One folder per tool: what the skill needs to know about the tool, and the scripts and helpers that implement the contracts with it | The harness |
| **System** | Tokens, foundations, system rules, specs, the Figma library record, components and screens in code, Claude Design content, the manifest | The project team |
| **Generated** | `tokens.css`, `.describe-me/`, the Claude Design build | Written by the adapters into the system; only `tokens.css` is tracked, because the app imports it |

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

These gates are the core and come with the harness. A system adds its own in the manifest (for example `visual` from step 1b), and can make an `auto` gate `human`. It cannot remove `spec` or `report`. An output the manifest leaves out (Figma, Claude Design) skips its step and its gate.

## Contracts

What the core reads, in what shape, and who writes it. The paths are the defaults; the manifest can change them.

| Contract | File | Shape the core relies on | Written by | Read by |
|---|---|---|---|---|
| Tokens | `tokens/tokens.json` | `name`, `version`, `meta`, then one family per kind (`color`, `type`, `spacing`, …), each with tokens of `name`, `value` (or a value per theme) and `usage`; text styles in `type.groups[].styles[]` | The skill, after an approved proposal | Every adapter, the raw-value lint |
| Specs | `components/<Name>/README.md`, `screens/<Name>/README.md` | The sections of the templates in `references/`; the states in `## States`, as the first column of its table or the backticked names in its first sentence | The skill, approved by the designer | The skill, the states check, Claude Design |
| Inventory | `components/README.md`, `screens/README.md` | A table whose first column links `[Name](Name/README.md)`, in library order; a Group column from step 1c; "Rules for every component" below it | The skill | Every adapter: the order and the groups |
| System rules | `docs/rules.md` | Requirements on top of the core rules, one per line (step 4) | The team | The skill, the review checklist |
| Foundations | `docs/foundations.md` | Where values came from and what was decided; every token decision recorded | The skill, with each new token | The skill, Claude Design |
| Figma library | `figma/library.json` | The file key and URL, the naming rules, the variable collections with ids and modes, the pages, the components with their node ids, notes | The Figma adapter, after each change | The skill, to find nodes |
| States record | `.describe-me/manifest.json` | `modules[].id`, `modules[].tests[].name`, from step 1c `modules[].group`; a test file `<src>/components/<Name>/<Name>.test.tsx` with `describe('<Name>')` and one `it('<state>')` per state | The describe-me adapter, on every test run | The states check |
| Checks | `package.json` | Scripts `tokens`, `lint:tokens`, `typecheck`, `test`, `check-states` and `check`, calling the CLI | The project, once | The `code` gate, CI |
| Report | the skill's last message | The change report in `references/review-checklist.md` | The skill | The reviewer |

The contracts are data, not an adapter API. No manifest key gets a single allowed value, and each tool's files stay in one folder, so a second adapter later is a move, not a rewrite.

## Adapters

All four are the defaults and, for now, the only ones (decisions 3 and 8 of the plan).

| Adapter | Implements | Holds |
|---|---|---|
| `adapters/react/` | Tokens for the platform, code | `code.md`; the token build (`tokens.json` to CSS custom properties, `surface.page` to `--surface-page`); the raw-value lint for CSS Modules; the test helpers (setup, axe in both themes, the phone frame sized from the manifest, the layout classes, `respond()`); the Vitest preset |
| `adapters/describe-me/` | States and preview | The Vitest plugin options (fonts from the system's preview head, the sidebar groups from the inventory from step 1c); the reader of `.describe-me/manifest.json` for the states check. Tested with describe-me 0.12.1 |
| `adapters/figma/` | Design | `figma.md`, the method: variables, text and effect styles, components with variants, screens from instances, the screenshot check. Uses the Figma MCP |
| `adapters/claude-design/` | Output (optional) | `claude-design.md`, how the sync works; the build; the preview helpers shared by every card. The global is `window[name]`, not `window.Atlas` |

The states check has two halves: the comparison of specs with recorded states is core, and the reader of the manifest is the describe-me adapter's. Until a second adapter exists they stay in one file in `adapters/describe-me/`.

## The manifest

`design-harness.yaml` at the root of the system: the project root, or `systems/atlas/` in this repository. Only `name` is required.

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

The text styles are not listed: they are the `type.groups` of the tokens file. The harness version is not listed either: the project's dependency pins it, and the skill reads it from there.

## Where every file goes

Today's path, its path after step 5, and its layer. Paths under the skill are short for `.claude/skills/atlas-design-system/`.

| Today | After step 5 | Layer |
|---|---|---|
| `SKILL.md` | `SKILL.md`, skill `design-harness` | Core |
| `references/component-spec.md`, `screens.md`, `tokens.md`, `review-checklist.md` | `references/` | Core |
| `references/rules.md` | `references/rules.md` (core rules) and `systems/atlas/docs/rules.md` (Atlas rules), step 4 | Split |
| `references/code.md` | `adapters/react/code.md` | React |
| `references/figma.md` | `adapters/figma/figma.md`; the file key and ids stay only in `library.json` | Figma |
| `evals/*` | `evals/*`; the scaffold copies `systems/atlas/`, not the repository | Core |
| `scripts/eval-e2e.sh` | `bin/eval-e2e.sh` | Core |
| `scripts/build-tokens.mjs`, `check-raw-values.mjs` | `adapters/react/` | React |
| `scripts/check-states.mjs` | `adapters/describe-me/` | describe-me |
| `scripts/build-claude-design.mjs`, `scripts/claude-design/preview.js`, `preview.css` | `adapters/claude-design/` | Claude Design |
| `scripts/claude-design/brand-book.md`, `cover.html`, `previews/*` | `systems/atlas/claude-design/` | System |
| `docs/claude-design.md` | `adapters/claude-design/claude-design.md`; the artifact link in `systems/atlas/README.md` | Split |
| `docs/evals.md` | `evals/README.md` | Core |
| `docs/plans/`, `docs/architecture.md` | `docs/` | Core |
| `src/test/setup.ts`, `a11y.ts`, `PhoneFrame.tsx`, `PhoneFrame.module.css`, `layout.module.css`, `respond.ts` | `adapters/react/test/`, exported as `design-harness/test` | React |
| `src/test/canvas.css` | `systems/atlas/src/test/canvas.css`; it names Atlas tokens | System |
| `vitest.config.ts` | `systems/atlas/vitest.config.ts`, built on the preset from `design-harness/vitest` | Split |
| `tokens/`, `docs/foundations.md`, `components/`, `screens/`, `figma/library.json` | `systems/atlas/` | System |
| `src/components/`, `src/screens/`, `src/foundations/`, `src/styles/`, `src/index.ts`, `src/vite-env.d.ts` | `systems/atlas/src/` | System |
| `package.json`, `tsconfig.json`, `vite.config.ts` | The root package is the harness (CLI, exports); `systems/atlas/` gets its own, depending on `file:../..` | Split |
| `README.md` | The root README is the harness's; `systems/atlas/README.md` describes Atlas | Split |
| `.idea/` | Removed from git | None |

## How a project uses the harness

1. Clone the harness into `~/.claude/skills/design-harness` at a tag.
2. In the project, add `design-harness` as a git dependency at the same tag, the npm scripts of the checks contract, a `vitest.config.ts` on the preset, and `design-harness.yaml`.
3. Write the tokens file and the Figma library record, or import them from the project's Figma or CSS (step 6).
4. Ask for the first change; the skill reads the manifest and starts at the `frame` gate.

## Not decided here

- Which rules are core and which are Atlas's: step 4.
- How the inventory sets the order in the three outputs: step 1c.
- The CI action and its access to the repository: step 7.
- What the skill does in a repository without a manifest (offer to set one up, or stay silent): step 5, with the trigger description.
