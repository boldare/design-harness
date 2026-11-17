# Figma

The system's Figma file is in `figma/library.json` (`outputs.figma.library` in the manifest): the file key and URL, the naming rules, the variable collections with their ids and modes, the pages, and every component's node ids. Read it first and never guess an id. A system without `outputs.figma` skips this step.

Use the Figma MCP `use_figma` tool and load the `figma-use` skill before the first call (and `figma-generate-library` for components). Calls are sequential, never parallel.

## Pages
- `Foundations`: overview drawn from variables. Update it when you add a token family.
- `Components`: one section per group of the components inventory (the Group column of `components/README.md`), named after the group, stacked top to bottom in the order of the table. Inside a group, one section per component, named after it and stacked top to bottom in table order, with the component set inside and the variants in a wrapping auto-layout grid.
- `Screens`: the same for the screens inventory, one section per group, then one section per screen, with one row per theme (the first theme on top, then a clone with the colour collection set to each other mode).

A new component or screen goes into the section of its group, at its place in the table. A new group is a new section at its place among the groups. Move the sections below it down, and grow the group section, so that nothing overlaps. `library.json` lists the group sections and the sections in them (`pages.<Page>.groups`).

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

## Starting a library
The foundations of an empty system, when there is no `figma/library.json` yet. The designer gives the file: an empty one, or the client's file with a page for the library. Create a new file with the MCP only when the designer asks, in the team and project they name.

1. Collections: `Primitives` (one mode, `Value`, every variable hidden with scopes `[]`), `Color` (one mode per theme, named as the themes in the tokens file, semantic colours as aliases of primitives), `Dimensions` (one mode, `Value`: spacing, radius, size, stroke, opacity). Duration and layer are code only.
2. Text styles `<group>/<style>` from `type.groups`, and effect styles `Shadow/<name>` from `shadow`. Load each font first; a font the file cannot load is an open point, not a substitute.
3. Pages `Foundations`, `Components` and, when the manifest has `frame`, `Screens`. The Foundations page is drawn from the variables and styles, nothing typed by hand: colour swatches per theme side by side, one specimen per text style, the spacing, radius and size scales as bars, and one sample per shadow.
4. `figma/library.json` in Atlas's shape: `file` (name, key, URL, team, project), `naming`, `collections` with ids, modes and what each `holds`, `syncedAt`, `counts`, `pages` (the Foundations root frame, `groups: {}` on the others), `components: {}`, `figmaNotes: []`. Then `outputs.figma: { library: figma/library.json }` in the manifest.

Check: screenshot the Foundations page in every theme, and compare the counts in `library.json` with the tokens file.

## Components
- Variant names `Axis=value, Axis=value`, axes and values exactly as in the spec's states table.
- Combine with `figma.combineAsVariants`, then give the set a wrapping auto-layout (gaps `space.6` / `space.8`, padding `space.8`, fill `surface.page`), put it in its own section inside the section of its group and set the set's description to the spec's first sentence plus `Spec: components/<Name>/README.md`.
- Text and booleans that screens change become component properties (`Label`, `Description`).

## Pitfalls already met
- Opacity variables are 0-100 in Figma (55 = 0.55).
- A spread shadow (a focus ring, a halo) renders only on a frame that clips its content, and any clipping parent cuts it off: the focused frame clips, its parents do not.
- A frame with no fill casts no shadow: focus variants of fill-less components get `surface.page` as fill.
- Wrapping text needs `textAutoResize = 'HEIGHT'` after it has been appended and set to fill.
- `resize()` resets sizing modes, so call it before setting `layoutSizing*` or binding width and height.

## Check
Screenshot the new section, look at every variant, then check one screen or instance in every other theme. Fix what is clipped, cut off or unbound before reporting. Add the new ids to `figma/library.json`.

Then list the sections of the page and compare them with its inventory table: the same groups, in the same order, and in each group the same names in the same order. A difference fails the gate, and is fixed in Figma, not in the table.

```js
const page = figma.root.children.find(p => p.name === 'Components'); await figma.setCurrentPageAsync(page);
const sections = n => n.children.filter(c => c.type === 'SECTION').sort((a, b) => a.y - b.y);
return sections(page).map(g => `${g.name}: ${sections(g).map(s => s.name).join(', ')}`);
```
