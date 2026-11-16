# Figma

The system's Figma file is in `figma/library.json` (`outputs.figma.library` in the manifest): the file key and URL, the naming rules, the variable collections with their ids and modes, the pages, and every component's node ids. Read it first and never guess an id. A system without `outputs.figma` skips this step.

Use the Figma MCP `use_figma` tool and load the `figma-use` skill before the first call (and `figma-generate-library` for components). Calls are sequential, never parallel.

## Pages
- `Foundations`: overview drawn from variables. Update it when you add a token family.
- `Components`: one section per component, in the order of the components inventory, component set inside, variants in a wrapping auto-layout grid.
- `Screens`: one section per screen, in the order of the screens inventory, one row per theme (the first theme on top, then a clone with the colour collection set to each other mode).

## Helpers
Start every script with these, then build. They bind everything to variables and styles, which is the rule in Figma terms.

```js
const TSs = await figma.getLocalTextStylesAsync(); const TS = n => TSs.find(s => s.name === n);
await Promise.all(TSs.map(s => figma.loadFontAsync(s.fontName)));
const vars = await figma.variables.getLocalVariablesAsync();
const V = n => { const v = vars.find(x => x.name === n.replace(/\./g, '/')); if (!v) throw new Error('No variable ' + n); return v; };
const ESs = await figma.getLocalEffectStylesAsync(); const ES = n => ESs.find(s => s.name === n);
const P = (t, p) => figma.variables.setBoundVariableForPaint(p || { type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', V(t));
const fill = (n, t) => { n.fills = t ? [P(t)] : []; };
const stroke = (n, t, w) => { n.strokes = [P(t)]; n.setBoundVariable('strokeWeight', V(w || 'stroke.default')); };
const pad = (n, v, h) => { if (v) { n.setBoundVariable('paddingTop', V(v)); n.setBoundVariable('paddingBottom', V(v)); } if (h) { n.setBoundVariable('paddingLeft', V(h)); n.setBoundVariable('paddingRight', V(h)); } };
const radius = (n, t) => ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius'].forEach(c => n.setBoundVariable(c, V(t)));
async function text(parent, chars, style, color, name) { const t = figma.createText(); await t.setTextStyleIdAsync(TS(style).id); t.characters = chars; fill(t, color); if (name) t.name = name; parent.appendChild(t); return t; }
const al = (dir, gap, name) => { const f = figma.createAutoLayout(dir, { name }); f.fills = []; f.clipsContent = false; if (gap) f.setBoundVariable('itemSpacing', V(gap)); return f; };
```

Icons: create an instance of the icon component from the Components page (`Icon/<name>` in the library), bind its width and height to the system's icon size tokens, and map each vector stroke with `P(colorToken, paint)` so the paint keeps its opacity.

## Variables
Use the collections listed in `figma/library.json`, by what each `holds`: dimensions (FLOAT) in one, colour primitives in another (hidden, scopes `[]`), and semantic colours as aliases with one mode per theme. Always set scopes, a description from the usage note, and code syntax as the library's `naming` says (WEB `var(--name)`, ANDROID camelCase).

## Components
- Variant names `Axis=value, Axis=value`, axes and values exactly as in the spec's states table.
- Combine with `figma.combineAsVariants`, then give the set a wrapping auto-layout (gaps `space.6` / `space.8`, padding `space.8`, fill `surface.page`), put it in its own section and set the set's description to the spec's first sentence plus `Spec: components/<Name>/README.md`.
- Text and booleans that screens change become component properties (`Label`, `Description`).

## Pitfalls already met
- Opacity variables are 0-100 in Figma (55 = 0.55).
- A spread shadow (a focus ring, a halo) renders only on a frame that clips its content, and any clipping parent cuts it off: the focused frame clips, its parents do not.
- A frame with no fill casts no shadow: focus variants of fill-less components get `surface.page` as fill.
- Wrapping text needs `textAutoResize = 'HEIGHT'` after it has been appended and set to fill.
- `resize()` resets sizing modes, so call it before setting `layoutSizing*` or binding width and height.

## Check
Screenshot the new section, look at every variant, then check one screen or instance in every other theme. Fix what is clipped, cut off or unbound before reporting. Add the new ids to `figma/library.json`.
