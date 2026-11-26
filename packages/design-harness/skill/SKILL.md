---
name: design-harness
description: Use for ANY change to how the design system looks or behaves, so the change stays inside it: a new component (for example a range slider or a badge), a new screen or flow (for example a multi-step onboarding), a new state or variant, a change of colour, size, spacing or type on an existing component or screen ("make this button red", "make the field taller"), or a change to tokens. Keeps the spec, tokens, Figma library, code and Claude Design in step, and refuses values that bypass the tokens.
---

# Design system workflow

You work inside an existing design system. Your job is not to invent a look; it is to extend a system that already has one, so that the result could have been made by the person who made the rest. The repo is the source of truth. Figma, code and Claude Design are outputs of it.

## Before anything else, read

1. `design-harness.yaml` at the root of the system: its name, its paths, its frame, its outputs and any gates it adds. The paths below and in the references are the defaults; where the manifest sets one, use the manifest's.
2. `tokens/tokens.json` (`paths.tokens`): every value you may use, each with a usage note that says when to use it.
3. `docs/foundations.md` (`paths.foundations`): where values came from, what was decided, and the one rule below.
4. `components/README.md` (`paths.components`), the inventory, and the README of every component you might reuse.
5. For a screen: `screens/README.md` (`paths.screens`) and one existing screen spec as a model.
6. The rules: `references/rules.md` in this skill (the core rules), then the system's rules (`paths.rules`, `docs/rules.md`), which name the tokens the core rules use and add the system's own. Both are short and every line is a requirement.

Do not start from what a typical design system would have. Start from what this one has.

The guides for each tool (Figma, code, Claude Design) are not in this skill but in the package's adapters, at `node_modules/@boldare/design-harness/adapters/` from the root of the system. Open them by that path: this skill is usually a link, so a path relative to it does not resolve.

## The rule

Every value comes from a token. No colour, size, spacing, radius, font size or duration is typed in by hand, in Figma or in code. When nothing fits, you do not approximate: you propose a token (name, value, usage note, reason) using `references/tokens.md`, and it is added to the tokens file and recorded in the foundations before anything uses it.

## An empty system: foundations first

When the tokens file has no tokens yet (a system just made with `design-harness init`), the first change is the foundations, whatever was asked: a component or screen needs values that do not exist. Say so, and do not start the component. An empty system has no look to extend, and you do not invent one: the look comes from a source the designer names, such as a brand book (PDF, Markdown or images), the variables and styles of a Figma file, or the CSS or theme a project already has.

- With no source named, ask for one and stop. Do not propose a palette, a typeface or a scale of your own, and write nothing.
- With a source, the foundations go through the seven steps below. The spec is the proposal in `docs/foundations.md`, written by `references/foundations.md`: every token with its value, its usage note and where in the source it came from, the values the source's components use outside its tokens and what each becomes, the tokens the core rules need, and the open points, split into decisions and defaults. The `spec` and `tokens` gates stop together: show the proposal by "Showing the proposal" in that reference, with every open point, and wait.
- After approval: the tokens file, the foundations, the system's rules (the tokens for the core rules), the fonts in `paths.preview_head`, then `npm run tokens` and `npm run check`, which passes with no components, and the viewer by "The viewer" in step 7, where the designer sees the Foundations. Figma, when the manifest has `outputs.figma` or the designer gives a file: the variables, the text and effect styles and the Foundations page, by "Starting a library" in the Figma adapter. Code has nothing else to build.
- Foundations already approved, and a Figma file given later: run step 4 alone, by "Starting a library", then the report.

## Workflow

Seven steps, each closed by a gate. A `human` gate is a stop: show what it needs and wait for the person. An `auto` gate passes when its check does. The manifest can add gates (`gates`: `id`, `after` the gate it follows, `approval`, `check`) and make an `auto` gate `human`; run each added gate right after the one it follows. An output the manifest leaves out (`outputs.figma`, `outputs.claude_design`) skips its step and its gate; say so in the report.

| Gate | Step | Approval |
|---|---|---|
| `frame` | 1. Frame the request | auto |
| `spec` | 2. Spec | human |
| `tokens` | 3. Tokens | human, only with new tokens |
| `figma` | 4. Figma | auto |
| `code` | 5. Code | auto |
| `states` | 5. Code | auto |
| `sync` | 6. Claude Design | auto |
| `report` | 7. Review and report | human |

### 1. Frame the request (`frame`)
State in two or three lines what is being added, which existing components it reuses, and which it needs that do not exist. Prefer reuse: a new component is justified only when no existing one, or a variant of one, does the job.

### 2. Write the spec first (`spec`)
- Component: `components/<Name>/README.md` from `references/component-spec.md`.
- Screen: `screens/<Name>/README.md` from `references/screens.md`.
- New tokens: proposals in the format of `references/tokens.md`.
- The inventory row: a new component or screen gets its row in the inventory table (`components/README.md` or `screens/README.md`) with its spec, in its group. The Group column sets the groups, the rows of a group stand together, and the order of the table is the order of the library in the viewer, in Figma and in Claude Design. Put the row among the rows of the group it belongs to, where it fits, usually last. Start a new group only when no existing group fits, put it where it fits among the groups, and list it in the spec as an open point for the designer.

Show the spec and any token proposals and wait for the designer's go-ahead, unless the request says to go straight through. This is the moment where a person decides; everything after it is execution.

### 3. Tokens (`tokens`)
Add approved tokens to the tokens file with usage notes, record them in the foundations, run `npm run tokens`, and create the matching Figma variables (`node_modules/@boldare/design-harness/adapters/figma/figma.md`, "Variables").

### 4. Figma (`figma`)
Build the component or screen in the system's Figma file following `node_modules/@boldare/design-harness/adapters/figma/figma.md`: every fill, stroke, padding, gap, radius, size and opacity bound to a variable, every text on one of the system's text styles, every state from the spec as a variant, the section in its group at its place in the inventory table, and a screenshot to check it in every theme.

### 5. Code (`code`, `states`)
Implement in `src/` (`paths.src`) following `node_modules/@boldare/design-harness/adapters/react/code.md`: the component or screen, a test for every state (the tests are the stories), and the checks passing: `npm run check` (lint:tokens, typecheck, test, check-states) closes `code`, and `check-states` closes `states`.

### 6. Claude Design (`sync`)
Re-sync the published design system as described in `node_modules/@boldare/design-harness/adapters/claude-design/claude-design.md`.

### 7. Review and report (`report`)
Go through `references/review-checklist.md`. Finish with the change report it defines. If anything in the spec turned out to be unclear while building, fix the spec, not only the output.

The viewer: once the checks pass, the designer looks at the change in the describe-me viewer (`npm run dev`, http://localhost:6006). When nothing answers on that port, start `npm run dev` as a background command: it does not exit, so never in the foreground. The report's `Preview:` line gives the address and what to open there. When you cannot run a background command, it gives the command instead.

## When something does not fit

- A spec gap found while building goes back into the spec, then into Figma and code.
- A request that contradicts a rule (for example a hard-coded colour "just this once") is answered with the rule and an alternative that respects it.
- If two specs contradict each other, stop and ask which one wins.
