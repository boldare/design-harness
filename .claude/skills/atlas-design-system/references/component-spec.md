# Component spec template

Every component README has these sections, in this order. `components/TextField/README.md` and `components/Switch/README.md` are good models.

```
# <Name>

<One sentence: what it is for. This sentence is reused as the description in Figma and Claude Design.>

## Anatomy
<The parts, top to bottom or left to right, each with the tokens it uses. Gaps and paddings named by token.>

## Props
| Prop | Values | Default |
<Only what a screen needs to control. Names match existing components (label, description, disabled, error, onChange).>

## Variants and states (Figma: <Axis> × <Axis>)
<Every state from rules.md that applies, and what changes in each, by token.>

## Tokens
<Every token used, in one line. Review checks this list against Figma bindings and CSS.>

## Accessibility
<Element, role, keyboard behaviour, names, what is announced.>

## Do / Don't
<Two to four lines: when to use it and the most likely misuse.>
```

## Before you write it
- List which existing components it composes (Icon, IconButton, the TextField shell, the message row).
- Check the closest existing component for naming: an on / off control is `checked`, a choice is `selected`, a field problem is `error`.
- If it needs a value no token covers, write the proposal now, not later.
