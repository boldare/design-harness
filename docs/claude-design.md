# Atlas in Claude Design

Atlas also exists as a claude.ai Design System artifact, so Claude Design and other agents can build with the same tokens and components as Figma and code.

- Artifact: [Atlas](https://claude.ai/artifact/1tmtuAJXcgkirZ25hAMPY5), made from the claude.ai "Design System" artifact type (`https://claude.ai/artifact/5M7UeXXcx16TP3vzVFNDzd`). It is private: others can open it only after it is shared from the page's Share menu.
- This repository is the source of truth. The artifact is generated from it by `scripts/build-claude-design.mjs` and is one more output, next to the Figma library (`figma/library.json`) and the code in `src/`. The scope is the same everywhere: every token in `tokens/tokens.json` and the eleven components in `components/README.md`.
- Edits made on the artifact's page are replaced at the next sync. Change the repository instead.

## What the script writes

`npm run claude-design` writes `claude-design/project/` (gitignored, never committed) and `claude-design/publish.json`, the file map for the publish call. Every path below is a file of the artifact under `project/`.

| File | Built from |
|------|-----------|
| `tokens.json` | `tokens/tokens.json`, in the list shape the page reads (decisions below) |
| `README.md` | The brand book: `scripts/claude-design/brand-book.md`, with the component table and rules from `components/README.md` |
| `foundations.md` | `docs/foundations.md`, copied as a further section |
| `components/<Name>/README.md` | `components/<Name>/README.md`, copied as written |
| `components/<Name>/preview.html` | `scripts/claude-design/previews/<Name>.js`, wrapped with `preview.js` and `preview.css` from the same folder |
| `components/Cover/preview.html` | `scripts/claude-design/cover.html` |
| `components/bundle.js` | `src/index.ts`, built with Vite as one classic script that assigns `window.Atlas` |
| `components/bundle.css` | The token bridge and type classes (generated from `tokens/tokens.json`), then the CSS Modules from `src/components` |
| `components/index.d.ts` | The component props, emitted by TypeScript from `src/components` |
| `design-system.json` | The artifact's index (title, namespace `Atlas`, React 18, `lastChange`) |

The script stops with a message when the output would not work on the page: a token name or value the page drops, a variable used by a component or preview that nothing defines, a component in `components/README.md` that `src/index.ts` does not export (or the reverse), a missing preview, a token named in the brand book that does not exist, an em dash, or a file over the page's size limits.

## Re-sync

Run it after any change to tokens, component specs or component code.

1. `npm run claude-design`. Options: `--out <directory>` (default `claude-design`; may be absolute, because the Artifact tool publishes only from its session's working directory or scratchpad), `--by "<name>"` (defaults to `git config user.name`), `--note "<one line>"`, `--via "<surface>"` (defaults to `design-harness scripts/build-claude-design.mjs`; a pipeline passes a value starting with `CI`, such as `CI · boldare/design-harness@<sha>`, so the page warns that edits there may be overwritten), `--at <ISO date>`.
2. Keep the artifact's own index. Read `project/design-system.json` from the artifact (Artifact tool, `action: "read"`, `path: "project/design-system.json"`), then build again with `--index-from <that saved file>`. The script keeps every key of the current index, its `createdOnFiles` marker included, and changes only `title`, `namespace`, `libraries` and `lastChange`.
3. Publish with the Artifact tool, using `publish.json` in the output directory: `url` = the artifact URL above, `root` and `file_path` as written there (`file_path` is the index, so it is written last), `files` = its `files` map (it sends `index.d.ts` with `contentType: "text/plain"`, because the store does not serve `.ts` without one). One call carries everything (the system is far below the 255 paths a call allows).
4. A file the repository no longer produces (a removed component) is deleted by adding `"project/<path>": null` to `files` in the same call.
5. Read `project/README.md` back from the artifact to confirm the new version is served.

Without `--index-from`, the script writes a new index with `createdOnFiles` set to now. Use that only for a new artifact.

## Format decisions and limitations

- **Token names stay as in the repository** (`surface.page`, `space.4`). The page compiles `tokens.json` into its own `tokens.css` and names each variable after the token as written, with the dot escaped (`--surface\.page`). The components read the repository's CSS names (`--surface-page`, the `naming.web` rule in `figma/library.json`). `bundle.css` starts with a token bridge, generated from `tokens/tokens.json`, that maps one to the other (`--surface-page: var(--surface\.page)`) on `:root` and on any `[data-theme]` element. `accent` has no dot, so it is the same variable on both sides and is not bridged. The bridge holds names, not values: a colour, spacing, radius, size, stroke, shadow, opacity, duration or layer edited on the page reaches the previews.
- **Type styles are carried as values.** The page compiles type styles into classes named after the style (`.title`, `.body`, `.caption`) and defines no variables for them. The components read `--type-<style>-<property>`, so the bridge defines those variables with the values from `tokens/tokens.json`, plus the `.type-<style>` utility classes from `src/styles/tokens.css`. A type style edited on the page changes the page's own specimens, not the components.
- **Shadows with aliases are written out per theme.** `shadow.focus` and `shadow.danger-halo` point at colour tokens in the repository (`{surface.page}`, `{accent}`, `{danger.surface}`). A shadow on the page cannot hold an alias, so the script resolves them for light and dark and writes the two values, with a note on the shadow family. Usage notes are unchanged. On the page, editing `accent` or `surface.page` does not move the focus ring; a re-sync does.
- **Motion.** The type's format guide says there is no motion family, but the page reads any other `{tokens: [...]}` family whose values are plain CSS values, and `800ms` is one. `duration.spin` is therefore kept as its own Duration section. If a later page version drops it, the loading spinner stops turning in previews until the family is handled differently.
- **Other families.** `size`, `stroke`, `opacity`, `duration` and `layer` are published as further families, which the page shows after Shadows.
- **`textTransform` on `caption`.** The page has no field for it. It stays in `tokens.json`, and the bridge carries it as `--type-caption-text-transform`, so components and previews show captions in capitals. The page's own `caption` specimen shows mixed case.
- **`meta`** is rewritten in the provenance shape the type expects (`source`, `repo`, `ref`, `paths`, `components`, `synced`). The repository's original `meta.source` text is kept as `meta.origin`.
- **Type samples** come from `src/foundations/type-samples.ts`, shared with the Type specimen in the describe-me viewer.
- **Fonts.** Geist and Geist Mono are hosted Google faces, named in `type.families` only, with no font files. Geist is not in the page's built-in list of Google fonts, so every preview and the cover load the same Google Fonts stylesheet as the test page and the describe-me viewer (`src/styles/fonts.html`). The page's own Typography view may show the fallback face (`ui-sans-serif`, `system-ui`) unless Geist is installed on the viewer's machine.
- **Components are built, not hand-written.** Vite library mode bundles `src/index.ts` as an IIFE with `react` and `react-dom` external (the page loads React 18 from jsDelivr, as listed in the index `libraries`). The automatic JSX runtime is shimmed over `React.createElement`, because React 18 ships no global JSX runtime. CSS Module classes are named `atlas-<Component>-<class>`, so they cannot collide with the page's type classes such as `.label` or `.body`. `window.Atlas` also exposes `RadioGroup` and `iconNames`.
- **Previews** mirror the state rows of the tests, with the same state names and copy. The focus rows show the components' own `:focus-visible` styles: at load, each such rule is copied under `[data-forced-focus]`, because a static preview has no keyboard (the describe-me viewer replays the focus frames that the tests recorded). Controlled components keep local state, so fields take input and toggles toggle. Preview cells are at most 360 px wide; that width is preview layout, not a token.
- **The cover** follows the type's cover brief: one SVG of blocks and a dot grid bound to tokens (`action.primary`, `accent`, `border.subtle`, `border.control`, `size.dot` at a `space.8` pitch, `radius.md`) and the name with one line under it. The brief allows no components on the cover. Its 120 px display size comes from the brief, not from the type scale.
- **No assets.** The repository has no logo, image or icon files. Icons live in the Icon component and show in the Icon card; the brand book notes that there is no logo.
- **`success.border`.** The Alert README names it on purpose, to explain why there is no success alert. It is not a token, and the script reports it as a note.
- **Re-sync is a rebuild of generated files.** The type's own re-sync guidance merges file by file to keep edits made on the page. Here the repository is the only source, so every generated file is replaced; only the index is merged (`--index-from`).
