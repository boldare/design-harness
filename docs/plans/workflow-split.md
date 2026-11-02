# Plan: split the workflow from the Atlas design system

Status: draft for review (16.10.2026, decisions added 22.10.2026; decisions 1, 3 and 4 revised, decision 8 and step 1c added 02.11.2026). Step 0 and step 1 done: baseline and branch evals in `docs/evals.md`, the swap in PR #3, the first component built through it (Slider) in PR #5. Owner: Grzegorz Łotysz.

## Why

The BAT demo (15.10.2026) showed that the way of working is what clients buy: one source of truth in the repo, a skill that reads it, a designer who approves the spec, and Figma, code and Claude Design built from it. Boldare wants this as the design workflow across projects. Today the workflow and one design system (Atlas) live in the same files, so a second project would have to copy Atlas and delete it.

## Decisions (22.10.2026)

1. **Core of the harness:** the flow (spec, approval, tokens, design, code, states, report) and the contracts between its steps (step 2). The tools are adapters behind those contracts, as frameworks are in describe-me: Figma for the library, describe-me for the states and Live, React for the code, Claude Design for the optional output. What a project gets is still an ordered Figma library and a Live preview; CI and npm are packaging.
2. **Storybook is replaced by describe-me**, on Atlas, before the split (step 1 below). Tests are the stories; Foundations reads the tokens from the CSS the tests load; Live mounts a component or screen for the designer. The swap removes `src/storybook/*` and `.storybook/*` from the inventory, so the split moves less.
3. **React is the stack** (revised 02.11.2026): React on the web with CSS custom properties, as today, and the only stack the workflow supports for now. It is the default adapter behind the tokens and code contracts (step 2), and the manifest has no `stack` key until a second stack is built (decision 8). React Native is another stack, not a variant of this one. Questions that only another stack raises, such as a Claude Design output without React, wait until that stack is needed.
4. **Pseudo-states:** Live shows real `:focus-visible` and `:hover`, and since describe-me 0.12 recorded frames do too (02.11.2026): a test that hovers or tabs records `:hover`, `:focus`, `:focus-visible` and `:focus-within` in the frame's snapshot, never in the page. A hover or focus state in a spec is a test that makes the gesture; components put nothing into the DOM for it. PR #3 moved to describe-me 0.12.1 before its merge.
5. **Claude Design stays as an optional output.** It may be dropped later; nothing in the workflow depends on it.
6. **Distribution:** like rollout. The repo is the skill, cloned into `~/.claude/skills/design-harness`, with the scripts in `bin/`. npm packaging, and a possible SaaS for both design-harness and rollout, come after the flow is proven on a second system.
7. **Atlas stays in this repo** as `systems/atlas/`, the reference system and the test bed. Web React only for now.
8. **Only the default adapters are built** (02.11.2026): Figma, describe-me, React and Claude Design. A team that keeps Storybook keeps it; the workflow does not ask it to migrate, and no Storybook adapter is built until a project needs one. An adapter's interface comes from its second implementation, not from a guess: a spike on Opal (React Native with an Expo web target and Storybook RN) showed that describe-me in browser mode with react-native-web records 257 of the team's 267 existing stories through `composeStories`, so that adapter may belong in describe-me, not here. An adapter here is mostly text for the skill (a file in `references/`), a few scripts and its own evals, so each one also costs eval runs.

## Goal

Two layers with a clear boundary:

| Layer | What it holds | Owned by |
|---|---|---|
| **Workflow** (shared) | The skill and its references, the core rules, spec templates, scripts (tokens, raw-value lint, gate checks, Claude Design build), the describe-me setup and test helpers, evals, CI checks | Boldare design guild, versioned |
| **Design system** (per project) | `tokens/tokens.json`, `docs/foundations.md`, component and screen specs, `figma/library.json`, components and tests in code, brand book, system rules | The project team |

A project plugs its design system into the workflow through one manifest. Atlas stays as the reference system and the test bed for the workflow.

## The manifest

`design-harness.yaml` in the project repo (the system is the project's, so its manifest is in its git, unlike a rollout's). Draft shape:

```yaml
name: Atlas
paths:
  tokens: tokens/tokens.json
  foundations: docs/foundations.md
  components: components      # specs
  screens: screens
  src: src
  rules: docs/rules.md        # system rules; the core rules live in the skill
  brand: docs/brand-book.md
frame: { width: 390, height: 844 }
text_styles: [display, title, body, caption]
outputs:
  figma: { file: XHhJ2l7C09Si5uQu3EBmUH }   # leave out and step 4 is skipped
  claude_design: { global: Atlas }          # optional
gates:
  - { id: frame,  approval: auto }
  - { id: spec,   approval: human }
  - { id: tokens, approval: human, when: new-tokens }
  - { id: figma,  approval: auto, check: screenshot-both-themes }
  - { id: code,   approval: auto, check: "npm test && npm run lint:tokens && npm run typecheck" }
  - { id: states, approval: auto, check: spec-states-vs-manifest }
  - { id: sync,   approval: auto }
  - { id: report, approval: human }
```

A gate is data, not prose: a project adds one (for example axe after code) without editing the skill. `approval: human` is where the skill stops and waits; today that moment exists only for the spec.

## Constraints

- **Atlas keeps working after every step.** Each step is one PR; the evals and `scripts/eval-e2e.sh` run before and after it, and the result does not get worse.
- **Spec first.** Each PR starts by changing this plan or the docs it touches, then the code.
- **Only steps 1, 1b and 1c add capability.** Steps 2-6 move and parametrise; they do not change what the skill does.

## Steps

### 0. Baseline
Run the four evals one at a time (`-j 1`, quiet account) and the first full `scripts/eval-e2e.sh`. Record the results in `docs/evals.md`. This is the yardstick for every later step.
Done when: one clean run of all four evals and the e2e script is recorded.

### 1. Storybook to describe-me
Replace Storybook with Vitest (browser mode, so layout and fonts are real) and describe-me. Each state from a component README becomes an `it` that asserts what the README says (`aria-invalid`, `aria-describedby`, `aria-busy`, roles) and so records a story. Screens keep `respond()` from the prototype helper, which is browser-only already, so Live can click through them. Foundations replaces the three foundation stories. axe runs in every test in both themes. `references/code.md` and the review checklist change from "States story" to "a test per state", and a script compares the states in the specs with the stories in `.describe-me/manifest.json`.
What is lost: controls on `Default` (Live covers part of it). Pseudo-states in recorded frames were lost with describe-me 0.11 and are back in 0.12 (decision 4).
Done when: every component and screen shows every README state in the viewer, Live mounts the three screens, the evals pass as in step 0, and `storybook-static`, `.storybook/` and `src/storybook/` are gone.

### 1b. Visual tests
Browser mode already runs Playwright, so each recorded state gets a screenshot check (`toHaveScreenshot`) in both themes, stored next to the test and compared in CI. A state that changes its pixels without a spec change fails the PR. Start with components (small, stable frames), then screens; exclude frames with motion. This is a gate in the manifest (`id: visual, approval: auto`), and the first place where a designer reviews a diff image instead of code.
Not part of the step 1 PR, so that PR stays about the swap. It goes to the issue tracker once the harness has its own repo.
Done when: every component state has a baseline image in both themes, a one-token colour change fails the check, and the baselines update with one command.

### 1c. One order for the library
The inventory tables in `components/README.md` and `screens/README.md` get a Group column and become the only place that sets the groups of the library and their order. The describe-me sidebar (`sidebar.groups`, describe-me 0.12) is built from them in `vitest.config.ts`, the Claude Design build takes each card's group from them instead of the `@dsCard group=` line of each preview, and the figma gate checks the sections of the Components and Screens pages against them. The skill puts a new component or screen in its group in the table, and the three outputs follow.
Today they disagree: the groups exist only in the Claude Design previews; Figma and the table share one order, which splits Feedback (Alert, then StatusMark after Identity); describe-me lists the files by path. Inside a group describe-me sorts the files by path too, so each component gets its own subgroup named after its `describe`, which the viewer shows as the file, and the table order holds inside groups as well.
Done when: the describe-me sidebar, the Figma pages and Claude Design show the same groups in the same order, and a check fails when a component's group or place differs from the table.

### 2. Boundary spec
Write `docs/architecture.md`: which file belongs to which layer (the inventory below), the manifest schema above, the contracts between the core and its adapters (decision 1), and how a project uses the workflow. Review it with the guild before any code moves.

The contracts are data the core reads, not an adapter API. No manifest key gets a single allowed value, and each tool's files stay in one place, so a second adapter later is a move, not a rewrite:

| Contract | What the core reads | Default adapter |
|---|---|---|
| Tokens for a platform | `tokens/tokens.json` | React with CSS custom properties: `build-tokens`, the raw-value lint |
| Groups and order | the inventory tables with their Group column (step 1c) | every adapter: the describe-me sidebar, the Figma page sections, the Claude Design groups |
| States and preview | the states of each component and screen, as the tests recorded them | describe-me: `.describe-me/manifest.json`, read by the states check |
| Design | the library structure (`figma/library.json`) and the method | Figma: `references/figma.md`, the file key in the manifest |
| Code | how to write a component and its states | React: `references/code.md`, the Vitest setup |
| Output | the built design system | Claude Design: `build-claude-design` (optional) |

Done when: the guild agrees on the boundary and the contracts.

### 3. Manifest instead of hard-coded paths
Add `design-harness.yaml` for Atlas with today's values. `build-tokens`, `check-raw-values`, `build-claude-design` and the states check read it.
Done when: the scripts have no Atlas path or name in them, and their output for Atlas is unchanged byte for byte.

### 4. Core rules and system rules
Split `references/rules.md` into core rules (every value from a token, states, focus, touch size, themes, contrast, reuse, spec before build, approval gates, report) and Atlas rules (390 × 844 frames, Atlas text styles, Logo and Icon geometry). The skill reads the core rules from itself and the system rules from the path in the manifest. Same for `figma.md` (file key moves to the manifest) and `review-checklist.md`. The gates list drives the workflow section of SKILL.md.
Done when: no Atlas name is left in the skill except in examples, and the evals pass as in step 0.

### 5. Rename and move
Rename the skill from `atlas-design-system` to `design-harness`, with a trigger description that does not name Atlas. Move the workflow into `harness/` (skill, references, `bin/`, test helpers, evals) and Atlas into `systems/atlas/`. The eval scaffold copies a system, not the repo.
Done when: `npm run` commands and the demo flow work as before, from the new layout, and `git clone` of `harness/` into `~/.claude/skills/design-harness` is the install.

### 6. Pilot on a second system
Onboard one real system on React for the web (decision 3), internal first. It will find what is still Atlas-shaped. Most Boldare projects work in the client's Figma, so the pilot likely needs an import step: read the Figma variables and components, or the CSS the project already has (describe-me's Foundations reader already parses custom properties, Tailwind `@theme` and MUI themes), into a draft `tokens.json` and `library.json` that a designer then annotates with usage notes.
Done when: the pilot team ships one component and one screen through the workflow, and every gap it found is either fixed or listed.

### 7. CI quality gates
A GitHub Action for every system repo: token lint, typecheck, the tests (which are the stories and the axe checks), the states check, and the evals on a schedule.
Done when: a PR with a raw value, a missing state or an axe failure is blocked.

### 8. Guild onboarding
A short guide for Boldare designers: when to use the workflow, the approval moments, how to read the change report, how to propose a token, how to open Live. Recorded walkthrough of one change.

### Later: packaging
npm package with a CLI (`design-harness tokens | lint | check | claude-design`) and, if it earns it, a hosted service for both design-harness and rollout. Not before step 6 has run on a real system.

Step 1b and this section move to issues when the harness has its own repo (step 5); until then this plan is their record.

## Inventory (where each file goes)

| Today | Layer | Note |
|---|---|---|
| `.claude/skills/atlas-design-system/SKILL.md` | Workflow | Rename; Atlas only in examples; workflow section from the gates list |
| `references/code.md`, `component-spec.md`, `screens.md`, `tokens.md`, `review-checklist.md` | Workflow | Paths from the manifest; tests instead of stories after step 1 |
| `references/rules.md` | Split | Core rules to the workflow, Atlas rules to the system |
| `references/figma.md` | Split | Method to the workflow, file key to the manifest |
| `evals/` | Workflow | Scaffold copies a test system, not the whole repo |
| `scripts/build-tokens.mjs`, `check-raw-values.mjs`, `eval-e2e.sh` | Workflow | Read the manifest; move to `bin/` |
| `scripts/build-claude-design.mjs` | Workflow | 24 Atlas mentions today, including the `window.Atlas` global; optional output |
| `scripts/claude-design/brand-book.md`, `cover.html`, `previews/*` | System | Per-system content the build reads |
| `src/storybook/*`, `.storybook/*`, `storybook-static/` | Removed in step 1 | `respond()` stays as a test helper in the workflow; frame size from the manifest |
| `vitest.config.ts`, test setup, axe helper | Workflow | New in step 1; React only (decision 3) |
| `tokens/`, `docs/foundations.md`, `components/`, `screens/`, `figma/library.json`, `src/components`, `src/screens`, `src/foundations` | System | |
| `docs/claude-design.md` | Split | How the sync works to the workflow, the artifact link to the system |

## Open questions

1. Which internal system is the pilot for step 6.

The workflow waits for no describe-me feature: pseudo-states in recorded frames shipped in 0.12 (decision 4), and the DOM adapter for vanilla JS matters only with another stack (decision 3). The workflow is tested with 0.12.1, and `^0.12.1` keeps 0.13 out until it is tested.

## Lessons that shape the work

- The skill's findings differ between runs (rehearsals 2 and 2b), so the evals, not single runs, decide whether a change helped.
- Evals share the account's rate limit: run them one at a time when nothing else runs.
- The trigger description missed "make this button red" once; step 5's new description is checked by the evals.
- The live demo's Storybook crash came from a file rewritten while the dev server ran. With describe-me the viewer repaints after a test run, not on a half-written file; the rule about editing tools stays in `references/code.md` until step 1 removes the reason for it.
- Figma sign-in sometimes appears only after the spec is approved; the onboarding guide covers signing in before the first prompt.
