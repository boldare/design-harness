---
name: atlas-design-system
description: Use for ANY change to how Atlas looks or behaves, so the change stays inside the design system: a new component (for example a range slider or a badge), a new screen or flow (for example a multi-step onboarding), a new state or variant, a change of colour, size, spacing or type on an existing component or screen ("make this button red", "make the field taller"), or a change to tokens. Keeps the spec, tokens, Figma library, code and Claude Design in step, and refuses values that bypass the tokens.
---

# Atlas design system

You work inside an existing design system. Your job is not to invent a look; it is to extend a system that already has one, so that the result could have been made by the person who made the rest. The repo is the source of truth. Figma, code and Claude Design are outputs of it.

## Before anything else, read

1. `tokens/tokens.json`: every value you may use, each with a usage note that says when to use it.
2. `docs/foundations.md`: where values came from, what was decided, and the one rule below.
3. `components/README.md` and the README of every component you might reuse.
4. For a screen: `screens/README.md` and one existing screen spec as a model.
5. `references/rules.md` in this skill. It is short and every line is a requirement.

Do not start from what a typical design system would have. Start from what this one has.

## The rule

Every value comes from a token. No colour, size, spacing, radius, font size or duration is typed in by hand, in Figma or in code. When nothing fits, you do not approximate: you propose a token (name, value, usage note, reason) using `references/tokens.md`, and it is added to `tokens/tokens.json` and recorded in `docs/foundations.md` before anything uses it.

## Workflow

### 1. Frame the request
State in two or three lines what is being added, which existing components it reuses, and which it needs that do not exist. Prefer reuse: a new component is justified only when no existing one, or a variant of one, does the job.

### 2. Write the spec first
- Component: `components/<Name>/README.md` from `references/component-spec.md`.
- Screen: `screens/<Name>/README.md` from `references/screens.md`.
- New tokens: proposals in the format of `references/tokens.md`.

Show the spec and any token proposals and wait for the designer's go-ahead, unless the request says to go straight through. This is the moment where a person decides; everything after it is execution.

### 3. Tokens
Add approved tokens to `tokens/tokens.json` with usage notes, record them in `docs/foundations.md`, run `npm run tokens`, and create the matching Figma variables (`references/figma.md`, "Variables").

### 4. Figma
Build the component or screen in the Atlas Figma file following `references/figma.md`: every fill, stroke, padding, gap, radius, size and opacity bound to a variable, every text on an Atlas text style, every state from the spec as a variant, and a screenshot to check it in both themes.

### 5. Code
Implement in `src/` following `references/code.md`: the component or screen, a test for every state (the tests are the stories), and the checks (`npm run check`: lint:tokens, typecheck, test, check-states) passing.

### 6. Claude Design
Re-sync the published design system as described in `docs/claude-design.md`.

### 7. Review and report
Go through `references/review-checklist.md`. Finish with the change report it defines. If anything in the spec turned out to be unclear while building, fix the spec, not only the output.

## When something does not fit

- A spec gap found while building goes back into the spec, then into Figma and code.
- A request that contradicts a rule (for example a hard-coded colour "just this once") is answered with the rule and an alternative that respects it.
- If two specs contradict each other, stop and ask which one wins.
