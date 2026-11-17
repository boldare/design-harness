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

Show the spec and any token proposals and wait for the designer's go-ahead, unless the request says to go straight through. This is the moment where a person decides; everything after it is execution.

### 3. Tokens (`tokens`)
Add approved tokens to the tokens file with usage notes, record them in the foundations, run `npm run tokens`, and create the matching Figma variables (`node_modules/@boldare/design-harness/adapters/figma/figma.md`, "Variables").

### 4. Figma (`figma`)
Build the component or screen in the system's Figma file following `node_modules/@boldare/design-harness/adapters/figma/figma.md`: every fill, stroke, padding, gap, radius, size and opacity bound to a variable, every text on one of the system's text styles, every state from the spec as a variant, and a screenshot to check it in every theme.

### 5. Code (`code`, `states`)
Implement in `src/` (`paths.src`) following `node_modules/@boldare/design-harness/adapters/react/code.md`: the component or screen, a test for every state (the tests are the stories), and the checks passing: `npm run check` (lint:tokens, typecheck, test, check-states) closes `code`, and `check-states` closes `states`.

### 6. Claude Design (`sync`)
Re-sync the published design system as described in `node_modules/@boldare/design-harness/adapters/claude-design/claude-design.md`.

### 7. Review and report (`report`)
Go through `references/review-checklist.md`. Finish with the change report it defines. If anything in the spec turned out to be unclear while building, fix the spec, not only the output.

## When something does not fit

- A spec gap found while building goes back into the spec, then into Figma and code.
- A request that contradicts a rule (for example a hard-coded colour "just this once") is answered with the rule and an alternative that respects it.
- If two specs contradict each other, stop and ask which one wins.
