// Fails when a state in a spec (the "## States" section of a component or screen README) has no test of that name
// in the component's test file, as recorded in .describe-me/manifest.json by the last test run.
// Every state is a story because every state is a test; this check keeps the specs and the tests in step.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const manifestPath = join(root, '.describe-me/manifest.json');
if (!existsSync(manifestPath)) {
  console.error('No .describe-me/manifest.json. Run `npm test` first: the tests record the stories this check reads.');
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const testsByModule = new Map(manifest.modules.map((module) => [module.id, module.tests.map((test) => test.name)]));

/** The state names of a spec: the first column of the States table, or the backticked names after the last "×". */
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
  const list = section.split('×').at(-1);
  return [...list.matchAll(/`([a-z][a-z-]*)`/g)].map((match) => match[1]);
}

const kinds = [
  { dir: 'components', src: 'src/components' },
  { dir: 'screens', src: 'src/screens' },
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

if (problems.length > 0) {
  console.error(`States without a test. Each state in a spec needs an it('<state>') in the component's test file:\n\n${problems.join('\n')}`);
  process.exit(1);
}
console.log(`Every spec state has a test (${checked} states).`);
