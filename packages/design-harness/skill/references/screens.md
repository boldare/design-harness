# Screens

A screen is a composition. It adds layout and copy, never new visual values. Read the screens inventory (`screens/README.md` under `paths.screens`) for the layout rules (frame, margins, title block, gaps between fields and sections) and use one existing screen spec as the model (in Atlas, `screens/SignIn/README.md`). A system without `frame` in the manifest has no screens.

## Spec sections
1. **Layout**: the blocks top to bottom, each with the component, its variant and its copy, and the gap to the previous block by token.
2. **States**: a table with what enters each state, what it shows and what leaves it. Include every state the screen can be in: empty, validation, loading, error, success, disabled or offline where they apply.
3. **Acceptance**: Given / When / Then style lines QA can check.

## Multi-step flows
- One screen spec per flow, with a `step` axis in the states table (step 1 of 4 and so on), plus the flow-level states (loading between steps, error on submit).
- Show progress with text ("Step 2 of 4") at minimum. A visual progress indicator is a component and needs its own spec.
- Back keeps what was entered. Each step validates on Continue.
- Copy says what the step is for, in the title, before asking for anything.

## Copy
Realistic, short, in the voice of the existing screens: say what happened and what to do. No lorem ipsum; placeholder names only from the persona in the system's rules.
