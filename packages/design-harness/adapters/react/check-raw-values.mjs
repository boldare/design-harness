// Fails when a CSS Module of the system types a value by hand instead of using a token (the rule in the foundations).
// Flags hex / rgb / hsl colours, numbers with a unit, and font-size / font-weight / line-height without var().

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadSystem } from './lib/manifest.mjs';

const system = loadSystem();

const rules = [
  { name: 'raw colour', test: (line) => /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(/i.test(line) },
  { name: 'raw length or duration', test: (line) => /(?<!\w)\d*\.?\d+(px|rem|em|ms|s)\b/.test(line) },
  {
    name: 'raw type value',
    test: (line) => /^\s*(font-size|font-weight|line-height)\s*:/.test(line) && !line.includes('var('),
  },
];

const cssModules = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return cssModules(path);
    return entry.name.endsWith('.module.css') ? [path] : [];
  });

// Blank out comments but keep their newlines, so line numbers stay right.
const withoutComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '));

// Every CSS Module under paths.src: components, screens (they add layout only, never new visual values), test helpers.
const files = cssModules(system.at(system.paths.src));
const problems = files.flatMap((file) =>
  withoutComments(readFileSync(file, 'utf8'))
    .split('\n')
    .flatMap((line, index) =>
      rules
        .filter((rule) => rule.test(line))
        .map((rule) => `${system.rel(file)}:${index + 1}  ${rule.name}  ${line.trim()}`),
    ),
);

if (problems.length > 0) {
  console.error(`Raw values found. Use a token from ${system.paths.tokens} instead:\n\n${problems.join('\n')}`);
  process.exit(1);
}

console.log(`No raw values in ${files.length} component, screen and test stylesheets.`);
