# Review checklist and change report

## Checklist
- [ ] Spec written first, and still true after building (gaps found on the way are fixed in the spec).
- [ ] Every value is a token; new tokens are in `tokens/tokens.json`, `docs/foundations.md`, `src/styles/tokens.css` and Figma.
- [ ] Every state in the spec exists as a Figma variant and in the `States` story.
- [ ] Focus visible, disabled at `opacity.disabled`, targets at least `size.target-min`.
- [ ] Light and dark checked in Figma (screenshot) and in Storybook (theme toggle).
- [ ] Labels survive a 40 % longer translation.
- [ ] A colour pair that failed a contrast rule has been looked up across the system, and other places using it are listed under Open.
- [ ] `npm run lint:tokens`, `npm run typecheck`, `npm run build-storybook` pass.
- [ ] `figma/library.json` and the component index (`components/README.md` or `screens/README.md`) updated.
- [ ] Claude Design re-synced.

## Change report
End with this, filled in. It is what a reviewer reads first.

```
Change: <what was added or changed, one line>

Reused:      <existing components used, with the variants>
New:         <new components or screens, with their spec paths>
Tokens used: <list>
New tokens:  <name = value, reason>  (or "none")
States:      <list, and where they can be seen: Figma section, Storybook story>
Checks:      lint:tokens <pass/fail>, typecheck <pass/fail>, build-storybook <pass/fail>, dark mode <checked>
Spec fixes:  <anything the spec did not say and now does>  (or "none")
Open:        <decisions for the designer>  (or "none")
```
