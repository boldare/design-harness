# Review checklist and change report

## Checklist
- [ ] Spec written first, and still true after building (gaps found on the way are fixed in the spec).
- [ ] Every value is a token; new tokens are in the tokens file, the foundations, the generated CSS (`paths.tokens_css`) and Figma.
- [ ] Every state in the spec exists as a Figma variant and as a test of that name (`npm run check-states`).
- [ ] The core rules and the system's rules (`docs/rules.md`) hold: focus visible, disabled at the system's disabled opacity, targets at least its minimum size.
- [ ] Every theme checked in Figma (screenshot), by axe in the tests (every theme) and in the viewer (background switch).
- [ ] Labels survive a 40 % longer translation.
- [ ] A colour pair that failed a contrast rule has been looked up across the system, and other places using it are listed under Open.
- [ ] `npm run lint:tokens`, `npm run typecheck`, `npm test`, `npm run check-states` pass.
- [ ] `figma/library.json` (when the manifest has `outputs.figma`) and the inventory table (`components/README.md` or `screens/README.md`) updated, the new row in its group.
- [ ] Claude Design re-synced, when the manifest has `outputs.claude_design`.
- [ ] Every gate the manifest adds (`gates`) passed, or is waiting for its person.

## Change report
End with this, filled in. It is what a reviewer reads first.

```
Change: <what was added or changed, one line>

Reused:      <existing components used, with the variants>
New:         <new components or screens, with their spec paths>
Tokens used: <list>
New tokens:  <name = value, reason>  (or "none")
States:      <list, and where they can be seen: Figma section, test file>
Checks:      lint:tokens <pass/fail>, typecheck <pass/fail>, test <pass/fail>, check-states <pass/fail>, themes <checked>
Spec fixes:  <anything the spec did not say and now does>  (or "none")
Open:        <decisions for the designer>  (or "none")
```
