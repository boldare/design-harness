// Reads the inventory tables of a design system, in <components>/README.md and <screens>/README.md
// (docs/architecture.md, "Contracts"). They alone set the groups of the library and their order, and every script
// that needs either takes it from here.

import { existsSync, readFileSync } from 'node:fs';
import { posix } from 'node:path';

const separatorRow = /^\|?(\s*:?-+:?\s*\|)*\s*:?-+:?\s*\|?$/;

/** The trimmed cells of a table line. */
function cellsOf(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
}

/** The first Markdown table of a file and its problems. Lines are 1-based. */
function readTable(system, dir) {
  const file = posix.join(dir, 'README.md');
  const table = { file, columns: [], rows: [] };
  if (!existsSync(system.at(file))) return { table, problems: [`${file}: the file is missing`] };
  const lines = readFileSync(system.at(file), 'utf8').split('\n');
  const isRow = (line) => line?.trimStart().startsWith('|') ?? false;
  const start = lines.findIndex((line, index) => isRow(line) && separatorRow.test(lines[index + 1]?.trim() ?? ''));
  if (start === -1) return { table, problems: [`${file}: the file has no table`] };

  const problems = [];
  table.columns = cellsOf(lines[start]);
  const hasGroup = table.columns[1] === 'Group';
  if (!hasGroup) problems.push(`${file}:${start + 1}: the second column must be Group, found "${table.columns[1] ?? 'none'}"`);

  const firstLineOf = new Map();
  const groupStart = new Map();
  const splitGroups = new Set();
  let previousGroup = null;
  for (let index = start + 2; isRow(lines[index]); index += 1) {
    const line = index + 1;
    const at = `${file}:${line}`;
    const cells = cellsOf(lines[index]);
    const link = /^\[([^\]]*)\]\(([^)]*)\)$/.exec(cells[0]);
    const name = link?.[1] ?? cells[0];
    if (cells.length !== table.columns.length) {
      problems.push(`${at}: ${name}: the row has ${cells.length} cells, the header has ${table.columns.length}`);
      continue;
    }
    if (!link) {
      problems.push(`${at}: the first cell must be a link [Name](Name/README.md), found "${cells[0]}"`);
      continue;
    }
    if (!/^[A-Za-z][A-Za-z0-9]*$/.test(name)) {
      problems.push(`${at}: "${name}" is not a name: letters and digits, starting with a letter`);
      continue;
    }
    if (link[2] !== `${name}/README.md`) problems.push(`${at}: ${name}: the link goes to "${link[2]}", not ${name}/README.md`);
    if (firstLineOf.has(name)) problems.push(`${at}: ${name} is already in the table at line ${firstLineOf.get(name)}`);
    else firstLineOf.set(name, line);

    const group = hasGroup ? cells[1] : '';
    table.rows.push({ name, link: link[2], group, line, cells });
    if (!hasGroup) continue;
    if (group === '') {
      problems.push(`${at}: ${name}: the Group cell is empty`);
      continue;
    }
    // describe-me reads "/" as a level and "*" as a placeholder, and '"' would end the group="..." of a card.
    if (/[/*"]/.test(group)) problems.push(`${at}: ${name}: the group "${group}" contains /, * or ", which a group name cannot hold`);
    if (group !== previousGroup && groupStart.has(group) && !splitGroups.has(group)) {
      splitGroups.add(group);
      problems.push(`${at}: ${name}: the rows of ${group} must stand together, and ${group} starts at line ${groupStart.get(group)}`);
    }
    if (!groupStart.has(group)) groupStart.set(group, line);
    previousGroup = group;
  }
  return { table, problems };
}

/**
 * The inventory tables of the components and the screens, each as { file, columns, rows }. A row is
 * { name, link, group, line, cells }, in table order. Exits with every problem of both tables when one is not valid.
 */
export function readInventory(system) {
  const components = readTable(system, system.paths.components);
  const screens = readTable(system, system.paths.screens);
  const problems = [...components.problems, ...screens.problems];
  if (problems.length > 0) {
    console.error(`The inventory tables are not valid:\n- ${problems.join('\n- ')}`);
    process.exit(1);
  }
  return { components: components.table, screens: screens.table };
}

/**
 * The sidebar groups for describeMe({ sidebar: { groups } }): Foundations (when the system has src/foundations), then
 * every component and every screen under its group, in table order. describe-me lists the groups in key order.
 */
export function sidebarGroups(system, inventory) {
  const src = system.paths.src;
  const entries = (top, dir, rows) =>
    rows.map((row) => [`${top}/${row.group}/${row.name}`, posix.join(src, dir, row.name, `${row.name}.test.tsx`)]);
  return Object.fromEntries([
    // An empty group makes describe-me warn on every run, and a new system has no foundations tests.
    ...(existsSync(system.at(posix.join(src, 'foundations'))) ? [['Foundations', posix.join(src, 'foundations/**')]] : []),
    ...entries('Components', 'components', inventory.components.rows),
    ...entries('Screens', 'screens', inventory.screens.rows),
  ]);
}
