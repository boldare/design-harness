// design-harness init: writes the skeleton of a design system from templates/ into the working directory and links the
// package's skill into .claude/skills/design-harness (docs/architecture.md, "How a designer starts a system").
// It never overwrites a file and lists what it skipped, so a second run on an unchanged folder only fixes a wrong link.
//
//   design-harness init [--name <name>]    The name defaults to the name of the working directory.

import { lstatSync, mkdirSync, readdirSync, readFileSync, readlinkSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { parseDocument } from 'yaml';
import { MANIFEST } from './manifest.mjs';

const usage = 'Usage: design-harness init [--name <name>]';
const templates = fileURLToPath(new URL('../templates/', import.meta.url));
const ownPackage = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const cwd = process.cwd();

const link = '.claude/skills/design-harness';
// Relative, so the link survives a move or a clone of the system's repository.
const linkTarget = '../../node_modules/@boldare/design-harness/skill';
// What `npm init -y` and `pnpm add` in a folder without package.json write. Kept, it would fail the check.
const placeholderTest = 'echo "Error: no test specified" && exit 1';
const dependencyFields = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];

function stop(message, withUsage = false) {
  console.error(withUsage ? `${message}\n${usage}` : message);
  process.exit(1);
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** The lstat of a path, or null when nothing is there. A dangling link is something. */
function lstat(path) {
  try {
    return lstatSync(path);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function report(verb, path, note) {
  console.log(`${verb.padEnd(9)}${path}${note ? `  (${note})` : ''}`);
}

let options;
try {
  options = parseArgs({ options: { name: { type: 'string' } }, strict: true, allowPositionals: false }).values;
} catch (error) {
  stop(error.message, true);
}
const name = (options.name ?? basename(cwd)).trim();
if (name === '') stop('The name of the design system is empty.', true);

// Read before writing anything, so a package.json that does not parse stops init with nothing written.
const packagePath = join(cwd, 'package.json');
let existingPackage = null;
if (lstat(packagePath)) {
  try {
    existingPackage = JSON.parse(readFileSync(packagePath, 'utf8'));
  } catch (error) {
    stop(`package.json: ${error.message}`);
  }
  if (!isObject(existingPackage)) stop('package.json: the file is not a JSON object.');
  for (const field of ['scripts', ...dependencyFields]) {
    if (existingPackage[field] !== undefined && !isObject(existingPackage[field])) stop(`package.json: "${field}" is not an object.`);
  }
}

/** The template files, relative to templates/, in a stable order. */
const templateFiles = (dir = '') =>
  readdirSync(join(templates, dir), { withFileTypes: true }).flatMap((entry) => {
    const path = posix.join(dir, entry.name);
    return entry.isDirectory() ? templateFiles(path) : [path];
  });

/** What init writes for a template file: the manifest and the tokens file with the system's name, the rest as is. */
function contentOf(path) {
  const text = readFileSync(join(templates, path), 'utf8');
  if (path === MANIFEST) {
    // A document, not parse(), so the template's comments stay. Names such as 2027 or "Acme: Web" come out quoted.
    const document = parseDocument(text);
    document.set('name', name);
    return document.toString();
  }
  if (path === 'tokens/tokens.json') {
    const tokens = JSON.parse(text);
    tokens.name = name;
    return `${JSON.stringify(tokens, null, 2)}\n`;
  }
  return text;
}

/** Writes package.json, or adds to it what the template has and it lacks. Changes nothing that is already set. */
function mergePackage() {
  const template = JSON.parse(readFileSync(join(templates, 'package.json'), 'utf8'));
  const npmName = basename(cwd).trim().toLowerCase().replace(/[^a-z0-9._-]/g, '-').replace(/^[._]+/, '');
  const pkg = existingPackage ?? { ...(npmName ? { name: npmName } : {}), private: true };
  const changes = [];

  if (pkg.type === undefined) {
    pkg.type = template.type;
    changes.push(['added', 'type']);
  } else if (pkg.type !== template.type) changes.push(['kept', 'type', JSON.stringify(pkg.type)]);

  pkg.scripts ??= {};
  for (const [script, command] of Object.entries(template.scripts)) {
    const current = pkg.scripts[script];
    if (current === command) continue;
    if (current === undefined) {
      pkg.scripts[script] = command;
      changes.push(['added', `scripts.${script}`]);
    } else if (script === 'test' && current === placeholderTest) {
      pkg.scripts.test = command;
      changes.push(['replaced', 'scripts.test', "npm's placeholder"]);
    } else changes.push(['kept', `scripts.${script}`, JSON.stringify(current)]);
  }

  const devDependencies = { ...template.devDependencies, '@boldare/design-harness': `^${ownPackage.version}` };
  const present = new Set(dependencyFields.flatMap((field) => Object.keys(pkg[field] ?? {})));
  const missing = Object.keys(devDependencies).filter((dependency) => !present.has(dependency));
  if (missing.length > 0) {
    const merged = { ...pkg.devDependencies, ...Object.fromEntries(missing.map((dependency) => [dependency, devDependencies[dependency]])) };
    pkg.devDependencies = Object.fromEntries(Object.keys(merged).sort().map((dependency) => [dependency, merged[dependency]]));
    changes.push(...missing.map((dependency) => ['added', `devDependencies.${dependency}`, devDependencies[dependency]]));
  }

  const json = `${JSON.stringify(pkg, null, 2)}\n`;
  if (!existingPackage) {
    writeFileSync(packagePath, json, { flag: 'wx' });
    report('wrote', 'package.json');
    return;
  }
  for (const [verb, what, note] of changes) report(verb, `package.json: ${what}`, note);
  if (changes.some(([verb]) => verb !== 'kept')) writeFileSync(packagePath, json);
}

for (const file of templateFiles().sort()) {
  if (file === 'package.json') {
    mergePackage();
    continue;
  }
  // pnpm pack leaves out a .gitignore, so the template has none.
  const target = file === 'gitignore' ? '.gitignore' : file;
  if (lstat(join(cwd, target))) {
    report('skipped', target, 'it exists');
    continue;
  }
  mkdirSync(dirname(join(cwd, target)), { recursive: true });
  writeFileSync(join(cwd, target), contentOf(file), { flag: 'wx' });
  report('wrote', target);
}

// The link may dangle until the install puts the package in node_modules.
const linkPath = join(cwd, link);
const linkStat = lstat(linkPath);
if (!linkStat) {
  mkdirSync(dirname(linkPath), { recursive: true });
  symlinkSync(linkTarget, linkPath, 'dir');
  report('linked', link, `to ${linkTarget}`);
} else if (linkStat.isSymbolicLink()) {
  const current = readlinkSync(linkPath);
  if (current !== linkTarget) {
    unlinkSync(linkPath);
    symlinkSync(linkTarget, linkPath, 'dir');
    report('replaced', link, `it pointed to ${current}, now to ${linkTarget}`);
  }
} else report('skipped', link, 'it exists and is not a link, so the skill is not linked');

console.log(`
Next:
  pnpm install
  pnpm exec playwright install chromium    the browser of the component tests, before the first one
  pnpm run check
  claude                                   Claude Code, with the design-harness skill`);
