// Fails when a state in a spec (the "## States" section of a component or screen README) has no test of that name
// in the component's test file, as recorded in .describe-me/manifest.json by the last test run.
// Every state is a story because every state is a test; this check keeps the specs and the tests in step.
// It also fails when the recorded sidebar differs from the inventory tables, which set the groups and their order.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, posix } from 'node:path';
import { readInventory, sidebarGroups } from './lib/inventory.mjs';
import { loadSystem } from './lib/manifest.mjs';

const system = loadSystem();
const inventory = readInventory(system);
const root = system.root;
const manifestPath = join(root, '.describe-me/manifest.json');
if (!existsSync(manifestPath)) {
  console.error('No .describe-me/manifest.json. Run `npm test` first: the tests record the stories this check reads.');
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const testsByModule = new Map(manifest.modules.map((module) => [module.id, module.tests.map((test) => test.name)]));

/**
 * The state names of a spec: the first column of the States table, or, in the inline form, the backticked names
 * in the first sentence of the section after the last "×". Notes in later sentences ("No `error` state: …") do not count.
 */
function statesOf(readme) {
  const section = /^## States[^\n]*\n([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(readme)?.[1];
  if (!section) return [];
  const rows = section.split('\n').filter((line) => line.trim().startsWith('|'));
  if (rows.length > 2) {
    return rows.slice(2).flatMap((row) => {
      const first = row.split('|')[1] ?? '';
      const name = /`([a-z][a-z-]*)`/.exec(first)?.[1];
      return name ? [name] : [];
    });
  }
  const sentence = section.trim().split(/\.(?:\s|$)/)[0];
  const list = sentence.split('×').at(-1);
  return [...list.matchAll(/`([a-z][a-z-]*)`/g)].map((match) => match[1]);
}

const kinds = [
  { dir: system.paths.components, src: join(system.paths.src, 'components') },
  { dir: system.paths.screens, src: join(system.paths.src, 'screens') },
];
const problems = [];
let checked = 0;

for (const kind of kinds) {
  const names = readdirSync(join(root, kind.dir), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  for (const name of names) {
    const states = statesOf(readFileSync(join(root, kind.dir, name, 'README.md'), 'utf8'));
    if (states.length === 0) continue;
    const module = `${kind.src}/${name}/${name}.test.tsx`;
    const tests = testsByModule.get(module);
    if (!tests) {
      problems.push(`${kind.dir}/${name}: no recorded tests in ${module} (states: ${states.join(', ')})`);
      continue;
    }
    for (const state of states) {
      checked += 1;
      if (!tests.includes(state)) problems.push(`${kind.dir}/${name}: state \`${state}\` has no test named "${state}" in ${module}`);
    }
  }
}

// The order: every row's test file in its group, no test file without a row, and the sidebar in table order.
const groups = sidebarGroups(system, inventory);
const modulesById = new Map(manifest.modules.map((module) => [module.id, module]));
const tables = [
  { top: 'Components', table: inventory.components, src: posix.join(system.paths.src, 'components') },
  { top: 'Screens', table: inventory.screens, src: posix.join(system.paths.src, 'screens') },
];
const orderProblems = [];

for (const { top, table, src } of tables) {
  for (const row of table.rows) {
    const expected = `${top}/${row.group}/${row.name}`;
    const found = modulesById.get(groups[expected])?.group?.join('/') ?? 'none';
    if (found !== expected) orderProblems.push(`${table.file}:${row.line}: ${row.name}: expected group ${expected}, found ${found}`);
  }
  const names = new Set(table.rows.map((row) => row.name));
  for (const module of manifest.modules) {
    if (!module.id.startsWith(`${src}/`)) continue;
    const [name, file, ...rest] = module.id.slice(src.length + 1).split('/');
    if (file === `${name}.test.tsx` && rest.length === 0 && !names.has(name)) {
      orderProblems.push(`${module.id}: ${name} has no row in ${table.file}`);
    }
  }
}

const expectedOrder = tables.flatMap(({ top, table }) => {
  if (table.rows.length === 0) return [];
  const namesByGroup = new Map();
  for (const row of table.rows) namesByGroup.set(row.group, [...(namesByGroup.get(row.group) ?? []), row.name]);
  return [top, ...[...namesByGroup].flatMap(([group, names]) => [`${top}/${group}`, ...names.map((name) => `${top}/${group}/${name}`)])];
});
const recordedOrder = (manifest.sidebar?.groups ?? [])
  .filter((group) => ['Components', 'Screens'].includes(group[0]))
  .map((group) => group.join('/'));
const entries = Math.max(expectedOrder.length, recordedOrder.length);
let differs = 0;
while (differs < entries && expectedOrder[differs] === recordedOrder[differs]) differs += 1;
if (differs < entries) {
  orderProblems.push(
    `.describe-me/manifest.json: sidebar.groups, entry ${differs + 1} of Components and Screens: ` +
      `expected ${expectedOrder[differs] ?? 'no entry'}, found ${recordedOrder[differs] ?? 'no entry'}`,
  );
}

if (problems.length > 0) {
  console.error(`States without a test. Each state in a spec needs an it('<state>') in the component's test file:\n\n${problems.join('\n')}\n`);
}
if (orderProblems.length > 0) {
  console.error(`The sidebar does not follow the inventory tables:\n\n${orderProblems.join('\n')}\n`);
}
if (problems.length > 0 || orderProblems.length > 0) {
  console.error('After changing a spec or an inventory table, run `npm test` first: the test run records the tests and the sidebar this check reads.');
  process.exit(1);
}
const groupCount = tables.reduce((count, { table }) => count + new Set(table.rows.map((row) => row.group)).size, 0);
console.log(`Every spec state has a test (${checked} states).`);
console.log(
  `The sidebar follows the inventory (${inventory.components.rows.length} components, ${inventory.screens.rows.length} screens, ${groupCount} groups).`,
);
