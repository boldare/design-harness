# Screens

Screens are compositions of components. They add layout and copy, never new visual values: a colour, size or style a screen needs and no component has is a gap in a component or in the tokens, and is fixed there first.

| Screen | What it shows |
|--------|---------------|
| [SignIn](SignIn/README.md) | The Atlas sign-in flow in its five states |
| [Profile](Profile/README.md) | A longer form with a select, radios, a checkbox and a save action |
| [DeviceSettings](DeviceSettings/README.md) | Settings that apply immediately, for a connected and a disconnected device |

## Layout rules for every screen

- Frame: 390 × 844 for phone mockups (one screen height; longer screens scroll), fill `surface.page`.
- Margins: `space.6` on both sides, `space.6` at the top, `space.8` at the bottom.
- Title block: title (`Headings/title`) and intro (`Text/body`, `text.secondary`) with gap `space.3`.
- Title block to the first content: `space.8`. Between fields: `space.5`. Between form sections: `space.8`.
- A section starts with `Headings/heading`, `space.5` above its content. Rows of switches or radios inside it are `space.2` apart.
- A footer pinned to the bottom keeps at least `space.10` from the content above it.
- Components fill the screen width between the margins.
- Every screen is checked in both themes.
