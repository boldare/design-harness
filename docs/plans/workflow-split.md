# Plan: split the workflow from the Atlas design system

Status: draft for review (16.10.2026, decisions added 22.10.2026). Step 0 and step 1 done: baseline and branch evals in `docs/evals.md`, the swap in PR #3, the first component built through it (Slider) in PR #5. Owner: Grzegorz Łotysz.

## Why

The BAT demo (15.10.2026) showed that the way of working is what clients buy: one source of truth in the repo, a skill that reads it, a designer who approves the spec, and Figma, code and Claude Design built from it. Boldare wants this as the design workflow across projects. Today the workflow and one design system (Atlas) live in the same files, so a second project would have to copy Atlas and delete it.

## Decisions (22.10.2026)

1. **Core of the harness:** an ordered Figma library and a Live mount preview in describe-me. Everything else (Claude Design, CI, npm) is an output or a packaging of those two.
2. **Storybook is replaced by describe-me**, on Atlas, before the split (step 1 below). Tests are the stories; Foundations reads the tokens from the CSS the tests load; Live mounts a component or screen for the designer. The swap removes `src/storybook/*` and `.storybook/*` from the inventory, so the split moves less.
3. **Stack default is React** with CSS custom properties, as today. Other stacks are profiles the manifest selects; none is built until a project needs it. A DOM adapter for vanilla JS has been ordered on the describe-me side.
4. **Pseudo-states:** Live shows real `:focus-visible` and `:hover`. Recorded frames cannot, so until describe-me captures matched pseudo-classes as attributes (on its roadmap, to be filed again), components put the states they need in the frames into the DOM (`data-state`, `data-focus-visible`).
5. **Claude Design stays as an optional output.** It may be dropped later; nothing in the workflow depends on it.
6. **Distribution:** like rollout. The repo is the skill, cloned into `~/.claude/skills/design-harness`, with the scripts in `bin/`. npm packaging, and a possible SaaS for both design-harness and rollout, come after the flow is proven on a second system.
7. **Atlas stays in this repo** as `systems/atlas/`, the reference system and the test bed. Web React only for now.

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
stack: react              # profile: code rules, lint, test adapter, Claude Design builder
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
- **Only steps 1 and 1b add capability.** Steps 2-6 move and parametrise; they do not change what the skill does.

## Steps

### 0. Baseline
Run the four evals one at a time (`-j 1`, quiet account) and the first full `scripts/eval-e2e.sh`. Record the results in `docs/evals.md`. This is the yardstick for every later step.
Done when: one clean run of all four evals and the e2e script is recorded.

### 1. Storybook to describe-me
Replace Storybook with Vitest (browser mode, so layout and fonts are real) and describe-me. Each state from a component README becomes an `it` that asserts what the README says (`aria-invalid`, `aria-describedby`, `aria-busy`, roles) and so records a story. Screens keep `respond()` from the prototype helper, which is browser-only already, so Live can click through them. Foundations replaces the three foundation stories. axe runs in every test in both themes. `references/code.md` and the review checklist change from "States story" to "a test per state", and a script compares the states in the specs with the stories in `.describe-me/manifest.json`.
What is lost: controls on `Default` (Live covers part of it), and forced pseudo-states in recorded frames (decision 4).
Done when: every component and screen shows every README state in the viewer, Live mounts the three screens, the evals pass as in step 0, and `storybook-static`, `.storybook/` and `src/storybook/` are gone.

### 1b. Visual tests
Browser mode already runs Playwright, so each recorded state gets a screenshot check (`toHaveScreenshot`) in both themes, stored next to the test and compared in CI. A state that changes its pixels without a spec change fails the PR. Start with components (small, stable frames), then screens; exclude frames with motion. This is a gate in the manifest (`id: visual, approval: auto`), and the first place where a designer reviews a diff image instead of code.
Not part of the step 1 PR, so that PR stays about the swap. It goes to the issue tracker once the harness has its own repo.
Done when: every component state has a baseline image in both themes, a one-token colour change fails the check, and the baselines update with one command.

### 2. Boundary spec
Write `docs/architecture.md`: which file belongs to which layer (the inventory below), the manifest schema above, and how a project uses the workflow. Review it with the guild before any code moves.
Done when: the guild agrees on the boundary.

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
Onboard one real system (internal first). It will find what is still Atlas-shaped. Most Boldare projects work in the client's Figma, so the pilot likely needs an import step: read the Figma variables and components, or the CSS the project already has (describe-me's Foundations reader already parses custom properties, Tailwind `@theme` and MUI themes), into a draft `tokens.json` and `library.json` that a designer then annotates with usage notes.
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
| `vitest.config.ts`, test setup, axe helper | Workflow | New in step 1; a profile per stack |
| `tokens/`, `docs/foundations.md`, `components/`, `screens/`, `figma/library.json`, `src/components`, `src/screens`, `src/foundations` | System | |
| `docs/claude-design.md` | Split | How the sync works to the workflow, the artifact link to the system |

## Open questions

1. Does the claude.ai Design System artifact type accept components without React? It decides whether the vanilla profile can have a Claude Design output. Check before promising vanilla to any project.
2. describe-me features the workflow waits for: pseudo-classes captured as attributes in recorded frames, and the DOM adapter. Both filed on the describe-me side; pin the version the workflow is tested with.
3. Which internal system is the pilot for step 6.

## Lessons that shape the work

- The skill's findings differ between runs (rehearsals 2 and 2b), so the evals, not single runs, decide whether a change helped.
- Evals share the account's rate limit: run them one at a time when nothing else runs.
- The trigger description missed "make this button red" once; step 5's new description is checked by the evals.
- The live demo's Storybook crash came from a file rewritten while the dev server ran. With describe-me the viewer repaints after a test run, not on a half-written file; the rule about editing tools stays in `references/code.md` until step 1 removes the reason for it.
- Figma sign-in sometimes appears only after the spec is approved; the onboarding guide covers signing in before the first prompt.
