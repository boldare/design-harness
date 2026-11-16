// Builds a design system for Claude Design (a claude.ai "Design System" artifact) from its repository.
//
// The repository is the source of truth. This script turns it into the files the artifact keeps under project/,
// in claude-design/project/ (gitignored), so a re-sync after a token or component change is: run it, publish.
// What the artifact is, how to publish and every format decision: docs/claude-design.md.
//
//   node scripts/build-claude-design.mjs [--out claude-design (or an absolute directory)] [--by "Name"] [--via "..."] [--note "..."]
//                                        [--at 2026-10-14T12:00:00Z] [--index-from <design-system.json read from the artifact>]
//
// Inputs, at the paths of design-harness.yaml: the tokens file, the components inventory and READMEs, the foundations,
// <src>/index.ts (built with Vite), <src>/foundations/type-samples.ts (type samples, optional), the preview head (font URL)
// and outputs.claude_design.sources (brand book text, one preview script per component, cover).
// The preview helpers shared by every card are this script's own, in claude-design/ next to it.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import vm from 'node:vm';
import { loadSystem } from './lib/manifest.mjs';

const require = createRequire(import.meta.url);
const system = loadSystem();
const { root, name: systemName, paths } = system;
if (!system.outputs.claude_design) {
  console.error('build-claude-design: design-harness.yaml has no outputs.claude_design, so this system has no Claude Design output.');
  process.exit(1);
}
// The global the bundle assigns and the previews read (window.Atlas). Derived from the name unless the manifest sets it.
const namespace = system.outputs.claude_design.namespace ?? systemName.replace(/[^A-Za-z0-9_$]/g, '');
if (!/^[A-Za-z_$][\w$]*$/.test(namespace)) {
  console.error(`build-claude-design: "${namespace}" is not a JavaScript name; set outputs.claude_design.namespace in design-harness.yaml.`);
  process.exit(1);
}
const escapedNamespace = namespace.replaceAll('$', '\\$');
// The preview helpers shared by every system, and the system's own sources (brand book, cover, previews).
const helpers = fileURLToPath(new URL('./claude-design', import.meta.url));
const sources = system.at(system.outputs.claude_design.sources);
const read = (path) => readFileSync(join(root, path), 'utf8');

const { values: args } = parseArgs({
  options: {
    out: { type: 'string', default: 'claude-design' },
    by: { type: 'string' },
    via: { type: 'string', default: 'design-harness scripts/build-claude-design.mjs' },
    note: { type: 'string' },
    at: { type: 'string' },
    'index-from': { type: 'string' },
  },
});

const problems = [];
const fail = (message) => problems.push(message);
const stopIfProblems = (stage) => {
  if (problems.length === 0) return;
  console.error(`build-claude-design: ${stage} failed:\n- ${problems.join('\n- ')}`);
  process.exit(1);
};

// ---------------------------------------------------------------------------------------------------------------
// Provenance
// ---------------------------------------------------------------------------------------------------------------

const git = (...gitArgs) => {
  try {
    return execFileSync('git', gitArgs, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
};

const at = args.at ?? new Date().toISOString();
if (Number.isNaN(Date.parse(at))) fail(`--at is not an ISO-8601 date: ${at}`);
const repo = /github\.com[:/](.+?)(?:\.git)?$/.exec(git('remote', 'get-url', 'origin'))?.[1] ?? basename(root);
const sha = git('rev-parse', '--short', 'HEAD') || 'unknown';
const branch = git('rev-parse', '--abbrev-ref', 'HEAD') || 'HEAD';
const inputs = [paths.tokens, paths.components, paths.foundations, paths.src, system.rel(sources), system.rel(helpers), system.rel(fileURLToPath(import.meta.url))];
const dirty = git('status', '--porcelain', '--', ...inputs) !== '';
const ref = `${branch}@${sha}${dirty ? '+uncommitted' : ''}`;
const by = args.by ?? (git('config', 'user.name') || 'Claude');

// ---------------------------------------------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------------------------------------------

const inventory = `${paths.components}/README.md`;
const tokens = JSON.parse(read(paths.tokens));
const componentsIndex = read(inventory);

// The component inventory is the table in the components README, in its order.
const componentRows = [...componentsIndex.matchAll(/^\|\s*\[([A-Za-z]+)\]\(\1\/README\.md\)\s*\|([^|]*)\|([^|]*)\|\s*$/gm)].map(
  ([, name, purpose, buildsOn]) => ({ name, purpose: purpose.trim(), buildsOn: buildsOn.trim() }),
);
const components = componentRows.map((row) => row.name);
const entry = `${paths.src}/index.ts`;
const exported = [...read(entry).matchAll(/export \* from '\.\/components\/(\w+)'/g)].map((match) => match[1]);
if (components.length === 0) fail(`no components found in the table of ${inventory}`);
for (const name of components) if (!exported.includes(name)) fail(`${name} is in ${inventory} but not exported from ${entry}`);
for (const name of exported) if (!components.includes(name)) fail(`${name} is exported from ${entry} but missing from ${inventory}`);

const componentRules = /## Rules for every component\n+([\s\S]*?)(?:\n## |\s*$)/.exec(componentsIndex)?.[1].trim();
if (!componentRules) fail(`${inventory} has no "Rules for every component" section`);

// Google Fonts URL of the text styles, as the test page and the describe-me viewer load them.
const fontUrl = /href="(https:\/\/fonts\.googleapis\.com\/css2\?[^"]+)"/.exec(read(paths.preview_head))?.[1];
if (!fontUrl) fail(`no Google Fonts stylesheet found in ${paths.preview_head}`);

// Sample copy for each type style, shared with the Type specimen in the viewer. Without the file, the page's own samples.
const typeSamplesPath = `${paths.src}/foundations/type-samples.ts`;
const typeSamples = Object.fromEntries(
  [...(/const samples[^=]*=\s*\{([\s\S]*?)\n\};/.exec(existsSync(join(root, typeSamplesPath)) ? read(typeSamplesPath) : '')?.[1] ?? '').matchAll(
    /^\s*'?([\w-]+)'?:\s*'((?:[^'\\]|\\.)*)',?\s*$/gm,
  )].map(([, style, sample]) => [style, sample.replace(/\\'/g, "'")]),
);

stopIfProblems('reading sources');

// ---------------------------------------------------------------------------------------------------------------
// tokens.json, in the shape the Design System page reads (artifact-type/reference/format.md)
// ---------------------------------------------------------------------------------------------------------------

const themeIds = tokens.color.themes.map((theme) => theme.id);
const colourByName = new Map(tokens.color.tokens.map((token) => [token.name, token]));

/** A colour token's literal value in one theme, following aliases such as "{neutral.50}". */
function resolveColour(name, theme, seen = []) {
  const token = colourByName.get(name);
  if (!token) throw new Error(`alias {${name}} names no colour token`);
  if (seen.includes(name)) throw new Error(`alias cycle: ${[...seen, name].join(' -> ')}`);
  const value = typeof token.value === 'string' ? token.value : (token.value[theme] ?? token.value[themeIds[0]]);
  const alias = /^\{(.+)\}$/.exec(value);
  return alias ? resolveColour(alias[1], theme, [...seen, name]) : value;
}

const hasAlias = (value) => typeof value === 'string' && /\{[^}]+\}/.test(value);

// Shadows may not hold aliases on the page, so a shadow that points at colour tokens is written out per theme.
const expandedShadows = tokens.shadow.tokens.filter((token) => hasAlias(token.value)).map((token) => token.name);
const shadowFamily = {
  ...(expandedShadows.length > 0 && {
    note: `${expandedShadows.join(' and ')} point at colour tokens in the repository. A shadow here cannot hold an alias, so each is written out per theme from those colours.`,
  }),
  tokens: tokens.shadow.tokens.map((token) =>
    hasAlias(token.value)
      ? {
          ...token,
          value: Object.fromEntries(
            themeIds.map((theme) => [theme, token.value.replace(/\{([^}]+)\}/g, (_, ref) => resolveColour(ref, theme).toLowerCase())]),
          ),
        }
      : token,
  ),
};

const typeFamily = {
  fonts: [],
  families: tokens.type.families,
  groups: tokens.type.groups.map((group) => ({
    ...group,
    styles: group.styles.map((style) => (typeSamples[style.name] ? { ...style, sample: typeSamples[style.name] } : style)),
  })),
};

const meta = {
  source: 'github',
  repo,
  ref,
  package: '.',
  paths: {
    tokens: [paths.tokens],
    fonts: [],
    assets: [],
    docs: [paths.foundations, inventory, ...components.map((name) => `${paths.components}/${name}/README.md`)],
  },
  components: Object.fromEntries(components.map((name) => [name, `${paths.src}/components/${name}/${name}.tsx`])),
  synced: at.slice(0, 10),
  ...(tokens.meta?.source && { origin: tokens.meta.source }),
  generatedBy: 'scripts/build-claude-design.mjs',
};

// Same key order as the repository's file; meta, type and shadow are replaced, everything else is copied.
const pageTokens = Object.fromEntries(
  Object.entries(tokens).map(([key, value]) => {
    if (key === 'meta') return [key, meta];
    if (key === 'type') return [key, typeFamily];
    if (key === 'shadow') return [key, shadowFamily];
    return [key, value];
  }),
);
if (!('meta' in pageTokens)) pageTokens.meta = meta;

// Families other than color and type, as the page sees them (each a {tokens:[...]} list).
const builtIn = ['name', 'version', 'meta', 'color', 'type'];
const listFamilies = Object.keys(pageTokens).filter((key) => !builtIn.includes(key));
const otherFamilies = listFamilies.filter((key) => !['spacing', 'radius', 'shadow'].includes(key));

// Checks that mirror the page's grammar, so a value never silently drops after publishing.
{
  const nameRule = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/;
  const colourRule = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$|^(?:rgb|rgba|hsl|hsla|oklch|oklab|lab|lch|color)\([0-9a-z.,%/ -]{1,60}\)$/i;
  const lengthRule = /^-?\d{1,4}(?:\.\d{1,6})?(?:px|rem|em|%)$|^0$/;
  const plainRule = /^[A-Za-z0-9 #%(),./+_-]{1,200}$/;
  const seen = new Map();
  const claim = (family, name) => {
    if (!nameRule.test(name)) fail(`${family} ${name}: name the page cannot read`);
    if (seen.has(name)) fail(`${family} ${name}: name already used by ${seen.get(name)} (one --name across every family)`);
    seen.set(name, family);
  };
  for (const token of pageTokens.color.tokens) {
    claim('color', token.name);
    const values = typeof token.value === 'string' ? [token.value] : Object.values(token.value);
    for (const value of values) {
      const alias = /^\{(.+)\}$/.exec(value);
      if (alias ? !colourByName.has(alias[1]) || alias[1] === token.name : !colourRule.test(value)) {
        fail(`color ${token.name}: value ${value} would drop`);
      }
    }
    if (!token.usage) fail(`color ${token.name}: no usage note`);
  }
  for (const family of listFamilies) {
    const list = pageTokens[family]?.tokens;
    if (!Array.isArray(list)) {
      fail(`${family}: not a {tokens:[...]} list`);
      continue;
    }
    if (list.length > 60) fail(`${family}: more than 60 tokens`);
    for (const token of list) {
      claim(family, token.name);
      if (!token.usage) fail(`${family} ${token.name}: no usage note`);
      const values = typeof token.value === 'object' ? Object.values(token.value) : [String(token.value)];
      for (const value of values) {
        const ok =
          family === 'shadow'
            ? !/[{}]|var\(|url\(/.test(value) && value.length <= 400
            : family === 'spacing' || family === 'radius'
              ? lengthRule.test(value)
              : plainRule.test(value) && !/var\(|url\(/.test(value);
        if (!ok) fail(`${family} ${token.name}: value ${value} would drop`);
      }
    }
  }
  if (otherFamilies.length > 12) fail(`more than 12 extra token families: ${otherFamilies.join(', ')}`);
  for (const group of pageTokens.type.groups) {
    for (const style of group.styles) {
      if (!nameRule.test(style.name)) fail(`type ${style.name}: name the page cannot read`);
      if (!lengthRule.test(style.fontSize)) fail(`type ${style.name}: fontSize ${style.fontSize} would drop the style`);
      const lineHeight = String(style.lineHeight);
      if (!lengthRule.test(lineHeight) && !(Number(lineHeight) > 0 && Number(lineHeight) < 10)) {
        fail(`type ${style.name}: lineHeight ${lineHeight} would drop`);
      }
    }
  }
}
stopIfProblems('tokens');

// ---------------------------------------------------------------------------------------------------------------
// Token bridge: the page names a CSS variable after the token as written (--surface\.page); the components read
// the repository's names (--surface-page, figma/library.json "naming.web"). This maps one to the other.
// ---------------------------------------------------------------------------------------------------------------

const repoVar = (name) => `--${name.replaceAll('.', '-')}`;
const pageVar = (name) => `--${name.replace(/\./g, '\\.')}`;
const kebab = (key) => key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
const typeProperties = (style) => Object.keys(style).filter((key) => !['name', 'usage', 'sample', 'family'].includes(key));
const typeStyles = tokens.type.groups.flatMap((group) => group.styles.map((style) => ({ style, family: style.family ?? group.family })));

const bridgedNames = [...pageTokens.color.tokens, ...listFamilies.flatMap((family) => pageTokens[family].tokens)].map((token) => token.name);
const typeVars = typeStyles.flatMap(({ style }) =>
  typeProperties(style).map((key) => [`--type-${style.name}-${kebab(key)}`, String(style[key])]),
);

const bridgeCss = [
  `/* Token bridge, generated from ${paths.tokens}.`,
  ' * The page compiles tokens.json into tokens.css with each token name as written (--surface\\.page).',
  ` * ${systemName} components read the repository names, "." replaced by "-" (--surface-page). Same values, two names. */`,
  ':root, [data-theme] {',
  // A name without a dot (accent) is the same variable on both sides and is left to the page.
  ...bridgedNames.filter((name) => name.includes('.')).map((name) => `  ${repoVar(name)}: var(${pageVar(name)});`),
  '',
  '  /* Type: the page compiles type styles into classes, not variables, so these carry the values from tokens.json. */',
  ...typeVars.map(([name, value]) => `  ${name}: ${value};`),
  '}',
  '',
  `/* Type utility classes, as in ${paths.tokens_css}. */`,
  ...typeStyles.map(({ style, family }) =>
    [
      `.type-${style.name} {`,
      `  font-family: var(--font-${family});`,
      ...typeProperties(style).map((key) => `  ${kebab(key)}: var(--type-${style.name}-${kebab(key)});`),
      '}',
    ].join('\n'),
  ),
].join('\n');

// Every variable a stylesheet we ship reads must be defined: by the page (--font-<family>), by the bridge, or locally.
const defined = new Set([
  ...Object.keys(tokens.type.families).map((key) => `--font-${key}`),
  ...bridgedNames.map(repoVar),
  ...typeVars.map(([name]) => name),
]);
// Names starting with --rt- are runtime values a component sets inline from its props (a position, a fraction),
// by the convention in the skill's references/code.md. They are not tokens and are allowed.
const checkVars = (label, css, local = []) => {
  for (const [, name] of css.matchAll(/var\((--[A-Za-z0-9_-]+)/g)) {
    if (!defined.has(name) && !local.includes(name) && !name.startsWith('--rt-')) fail(`${label} reads ${name}, which no token defines in the preview`);
  }
};

// ---------------------------------------------------------------------------------------------------------------
// Bundle: the real components from <src>/index.ts, as ONE classic script assigning window[namespace]
// ---------------------------------------------------------------------------------------------------------------

const { build } = await import('vite');

// The automatic JSX runtime, shimmed over window.React.createElement (React 18 ships no global jsx-runtime).
const jsxRuntimeShim = {
  name: 'design-harness-jsx-runtime-shim',
  enforce: 'pre',
  resolveId: (id) => (id === 'react/jsx-runtime' ? '\0design-harness-jsx-runtime' : null),
  load: (id) =>
    id === '\0design-harness-jsx-runtime'
      ? [
          "import * as React from 'react';",
          'export const Fragment = React.Fragment;',
          'export function jsx(type, props, key) {',
          '  return React.createElement(type, key === undefined ? props : Object.assign({}, props, { key }));',
          '}',
          'export const jsxs = jsx;',
        ].join('\n')
      : null,
};

const built = await build({
  configFile: false,
  root,
  logLevel: 'warn',
  publicDir: false,
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  oxc: { jsx: { runtime: 'automatic' } },
  plugins: [jsxRuntimeShim],
  css: {
    modules: {
      // Readable, stable class names (atlas-Button-primary) that cannot meet the page's own type classes (.label, .body).
      generateScopedName: (local, filename) =>
        `${namespace.toLowerCase()}-${basename(filename.split('?')[0]).replace(/\.module\.css$/, '')}-${local}`,
    },
  },
  build: {
    write: false,
    minify: 'oxc',
    target: 'es2020',
    sourcemap: false,
    cssCodeSplit: false,
    reportCompressedSize: false,
    lib: { entry: join(root, entry), formats: ['iife'], name: namespace, fileName: () => 'bundle.js' },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: { globals: { react: 'React', 'react-dom': 'ReactDOM' } },
    },
  },
});

const rollupOutput = (Array.isArray(built) ? built[0] : built).output;
const bundleCode = rollupOutput.find((item) => item.type === 'chunk')?.code ?? '';
const componentCss = rollupOutput.find((item) => item.type === 'asset' && item.fileName.endsWith('.css'))?.source?.toString() ?? '';

// Vite writes `var <namespace>=...` (var Atlas=); the type asks for an explicit window.<namespace>.
const bundleStart = new RegExp(`^var ${escapedNamespace}=`);
if (!bundleStart.test(bundleCode)) fail(`unexpected bundle start (expected "var ${namespace}=")`);
const bundleHeader = `/* @ds-bundle: ${JSON.stringify({ format: 4, namespace, components: components.map((name) => ({ name })) })} */`;
const bundleJs = `${bundleHeader}\n/* ${systemName} ${ref}, built from ${entry} by scripts/build-claude-design.mjs. Reads window.React. */\n${bundleCode
  .replace(bundleStart, () => `window.${namespace}=`)
  .trim()}\n`;

if (/<\/script|<!--/i.test(bundleJs)) fail('bundle.js contains </script or <!--');
if (!componentCss) fail('Vite produced no component stylesheet');

// Run the bundle once with real React to check it assigns window[namespace] with every component.
const namespaceKeys = (() => {
  const React = require('react');
  const ReactDOM = require('react-dom');
  const sandbox = { window: { React, ReactDOM }, React, ReactDOM };
  vm.runInNewContext(bundleJs, sandbox);
  const assigned = sandbox.window[namespace] ?? {};
  for (const name of components) if (typeof assigned[name] !== 'function') fail(`window.${namespace}.${name} is missing after running bundle.js`);
  return Object.keys(assigned);
})();

const bundleCss = [
  `/* ${systemName} ${ref}, generated by scripts/build-claude-design.mjs from ${repo}. Do not edit here: change the repository and re-sync. */`,
  '',
  bridgeCss,
  '',
  `/* Component styles: the CSS Modules from ${paths.src}/components. */`,
  componentCss.trim(),
  '',
].join('\n');

checkVars('component CSS', componentCss);
if (/<\/style/i.test(bundleCss)) fail('bundle.css contains </style');
stopIfProblems('bundle');

// ---------------------------------------------------------------------------------------------------------------
// index.d.ts: the props types, emitted by TypeScript from the component sources
// ---------------------------------------------------------------------------------------------------------------

const ts = (await import('typescript')).default;
const componentFiles = components.map((name) => join(root, `${paths.src}/components/${name}/${name}.tsx`));
const program = ts.createProgram([...componentFiles, join(root, `${paths.src}/vite-env.d.ts`)], {
  declaration: true,
  emitDeclarationOnly: true,
  jsx: ts.JsxEmit.ReactJSX,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  strict: true,
  skipLibCheck: true,
  noEmit: false,
});
const declarations = new Map();
program.emit(undefined, (fileName, text) => declarations.set(fileName, text), undefined, true);

const reactTypes = new Set();
const sections = components.map((name) => {
  const text = [...declarations].find(([fileName]) => fileName.endsWith(`/${paths.src}/components/${name}/${name}.d.ts`))?.[1];
  if (!text) {
    fail(`TypeScript emitted no declarations for ${name}`);
    return '';
  }
  const body = text
    .split('\n')
    .filter((line) => {
      const reactImport = /^import (?:type )?\{([^}]*)\} from 'react';$/.exec(line);
      if (reactImport) {
        for (const part of reactImport[1].split(',')) reactTypes.add(part.replace(/\btype\b/, '').trim());
        return false;
      }
      return !/^import .* from '\.{1,2}\//.test(line) && !/^export \{\};?$/.test(line);
    })
    .join('\n')
    .replaceAll('import("react/jsx-runtime").JSX.Element', 'React.JSX.Element')
    .trim();
  return `// ${name} (${paths.src}/components/${name}/${name}.tsx)\n${body}`;
});
stopIfProblems('types');

const indexDts = [
  `// ${systemName} ${ref}: props of the components on window.${namespace}, emitted by TypeScript from ${paths.src}/components.`,
  '// Generated by scripts/build-claude-design.mjs. Documentation, not type-checked by the page.',
  "import type * as React from 'react';",
  ...(reactTypes.size > 0 ? [`import type { ${[...reactTypes].filter(Boolean).sort().join(', ')} } from 'react';`] : []),
  '',
  sections.join('\n\n'),
  '',
  'declare global {',
  '  interface Window {',
  `    ${namespace}: {`,
  ...namespaceKeys.map((key) => `      ${key}: typeof ${key};`),
  '    };',
  '  }',
  '}',
  '',
].join('\n');

// ---------------------------------------------------------------------------------------------------------------
// Previews, cover, brand book
// ---------------------------------------------------------------------------------------------------------------

const htmlAttr = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
const previewCss = readFileSync(join(helpers, 'preview.css'), 'utf8').trim();
const previewJs = readFileSync(join(helpers, 'preview.js'), 'utf8').trim().replaceAll('{{namespace}}', namespace);
checkVars(system.rel(join(helpers, 'preview.css')), previewCss, ['--pv-columns']);

const previews = {};
for (const name of components) {
  const path = join(sources, 'previews', `${name}.js`);
  let source;
  try {
    source = readFileSync(path, 'utf8');
  } catch {
    fail(`no preview script at ${relative(root, path)}`);
    continue;
  }
  const marker = /^\/\/ (@dsCard [^\n]+)\n/.exec(source);
  if (!marker) {
    fail(`${relative(root, path)}: line 1 must be "// @dsCard group=\\"...\\" height=N"`);
    continue;
  }
  const script = `(function () {\n'use strict';\n${previewJs}\n\n${source.slice(marker[0].length).trim()}\n})();`;
  if (/<\/script|<!--/i.test(script)) fail(`${relative(root, path)} contains </script or <!--`);
  checkVars(relative(root, path), script);
  previews[name] = [
    `<!-- ${marker[1]} -->`,
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    `<title>${name}</title>`,
    `<link rel="stylesheet" href="${htmlAttr(fontUrl)}">`,
    '<style>',
    previewCss,
    '</style>',
    '</head>',
    '<body>',
    '<div id="root" class="pv"></div>',
    '<script>',
    script,
    '</script>',
    '</body>',
    '</html>',
    '',
  ].join('\n');
}

const coverPath = join(sources, 'cover.html');
const cover = readFileSync(coverPath, 'utf8').replaceAll('{{font-url}}', htmlAttr(fontUrl));
checkVars(system.rel(coverPath), cover);

// Brand book: the text in the sources' brand-book.md, with the component table and rules from the components inventory.
const tokenNames = new Set([...pageTokens.color.tokens, ...listFamilies.flatMap((family) => pageTokens[family].tokens)].map((t) => t.name));
const styleRefs = new Set(tokens.type.groups.flatMap((group) => group.styles.flatMap((style) => [style.name, `${group.name}/${style.name}`])));
const familyPrefixes = new Set([...tokenNames].map((name) => name.split('.')[0]));
/** Backticked token names (`surface.page`) and type styles (`Text/body`) that tokens.json does not define. */
const unknownTokenRefs = (text) =>
  [...text.matchAll(/`([A-Za-z][\w-]*(?:[./][\w-]+)+)`/g)]
    .map(([, ref]) => ref)
    .filter((ref) =>
      /^[A-Z][\w-]*\/[\w-]+$/.test(ref)
        ? !styleRefs.has(ref)
        : /^[a-z][\w-]*\.[\w.-]+$/.test(ref) && familyPrefixes.has(ref.split('.')[0]) && !tokenNames.has(ref),
    );

const componentsTable = [
  '| Component | Purpose | Builds on |',
  '|-----------|---------|-----------|',
  ...componentRows.map((row) => `| ${row.name} | ${row.purpose} | ${row.buildsOn} |`),
].join('\n');

const brandBookPath = join(sources, 'brand-book.md');
const brandBook = readFileSync(brandBookPath, 'utf8')
  .replaceAll('{{components-table}}', componentsTable)
  .replaceAll('{{component-rules}}', componentRules)
  .replaceAll('{{font-url}}', fontUrl)
  .replaceAll('{{repo}}', repo)
  .replaceAll('{{ref}}', ref);
if (/\{\{[\w-]+\}\}/.test(brandBook)) fail(`${system.rel(brandBookPath)} has an unknown {{placeholder}}`);
for (const ref of unknownTokenRefs(brandBook)) fail(`${system.rel(brandBookPath)} names ${ref}, which tokens.json does not define`);

// The component READMEs are copied as written; a name they use that tokens.json lacks is reported, not fixed here.
const componentReadmes = Object.fromEntries(components.map((name) => [name, read(`${paths.components}/${name}/README.md`)]));
for (const [name, text] of Object.entries(componentReadmes)) {
  for (const ref of unknownTokenRefs(text)) console.warn(`note: ${paths.components}/${name}/README.md names ${ref}, which tokens.json does not define`);
}

for (const text of [brandBook, ...Object.values(previews), cover]) {
  if (text.includes('\u2014')) fail('generated text contains an em dash');
}
stopIfProblems('previews and docs');

// ---------------------------------------------------------------------------------------------------------------
// The index (project/design-system.json). Written last when publishing.
// ---------------------------------------------------------------------------------------------------------------

const lastChange = {
  by,
  at,
  via: args.via,
  note: args.note ?? `Generated from ${repo} at ${ref}: ${components.length} components, ${tokenNames.size} tokens.`,
};
const libraries = [
  { name: 'react', version: '18' },
  { name: 'react-dom', version: '18' },
];

let index;
if (args['index-from']) {
  // Re-sync: keep every key of the artifact's current index and its marker; change only what this build owns.
  const current = JSON.parse(readFileSync(args['index-from'], 'utf8'));
  if (!current.createdOnFiles && !current.convertedFrom) fail(`${args['index-from']} has no createdOnFiles or convertedFrom marker`);
  index = { ...current, title: systemName, namespace, libraries, lastChange };
} else {
  index = {
    v: 3,
    layout: 'files',
    createdOnFiles: { v: 1, at },
    title: systemName,
    namespace,
    libraries,
    sections: {},
    groups: [],
    assetGroups: {},
    blobs: {},
    docs: { readme: 'project/README.md', sections: [] },
    lastChange,
  };
}
stopIfProblems('index');

// ---------------------------------------------------------------------------------------------------------------
// Write claude-design/project/ and the publish map
// ---------------------------------------------------------------------------------------------------------------

// --out may be absolute: the Artifact tool publishes only from its session's working directory or scratchpad.
const outDir = resolve(root, args.out);
const projectDir = join(outDir, 'project');
rmSync(projectDir, { recursive: true, force: true });

const files = {
  'tokens.json': `${JSON.stringify(pageTokens, null, 2)}\n`,
  'README.md': brandBook.endsWith('\n') ? brandBook : `${brandBook}\n`,
  'foundations.md': read(paths.foundations),
  'components/bundle.js': bundleJs,
  'components/bundle.css': bundleCss,
  'components/index.d.ts': indexDts,
  ...Object.fromEntries(components.flatMap((name) => [
    [`components/${name}/README.md`, componentReadmes[name]],
    [`components/${name}/preview.html`, previews[name]],
  ])),
  'components/Cover/preview.html': cover,
  'design-system.json': `${JSON.stringify(index, null, 2)}\n`,
};

const limits = { 'README.md': 200_000, 'tokens.json': 512_000, 'components/bundle.js': 6_000_000, 'components/bundle.css': 2_000_000 };
for (const [path, text] of Object.entries(files)) {
  const size = Buffer.byteLength(text);
  const limit = limits[path] ?? (path.endsWith('preview.html') ? 256_000 : path.endsWith('README.md') ? 64_000 : 512_000);
  if (size > limit) fail(`${path} is ${size} bytes, over the page's ${limit}`);
  const target = join(projectDir, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, text);
}
stopIfProblems('writing');

// The Artifact publish call: root = the output directory, file_path = the index (sent last), files = everything else.
// The artifact store serves .ts only with an explicit type, so index.d.ts goes as text/plain.
const publishMap = {
  root: outDir,
  file_path: join(projectDir, 'design-system.json'),
  files: Object.fromEntries(
    Object.keys(files)
      .filter((path) => path !== 'design-system.json')
      .sort()
      .map((path) => [
        `project/${path}`,
        path.endsWith('.ts') ? { from: `project/${path}`, contentType: 'text/plain' } : `project/${path}`,
      ]),
  ),
};
writeFileSync(join(outDir, 'publish.json'), `${JSON.stringify(publishMap, null, 2)}\n`);

const shown = (path) => (path.startsWith(root) ? relative(root, path) : path);
const listing = readdirSync(projectDir, { recursive: true }).filter((path) => /\.\w+$/.test(path));
console.log(
  `Wrote ${shown(projectDir)}/ (${listing.length} files) from ${repo} at ${ref}: ` +
    `${components.length} components, ${tokenNames.size} tokens in ${2 + listFamilies.length} families. ` +
    `Publish map: ${shown(join(outDir, 'publish.json'))}`,
);
