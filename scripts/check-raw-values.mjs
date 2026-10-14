// Fails when component or screen CSS types a value by hand instead of using a token (rule: docs/foundations.md).
// Flags hex / rgb / hsl colours, numbers with a unit, and font-size / font-weight / line-height without var().

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
// Screens add layout only, never new visual values (screens/README.md), so they follow the same rule.
const scannedDirs = ['src/components', 'src/screens'].map((dir) => join(root, dir));

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

const files = scannedDirs.flatMap(cssModules);
const problems = files.flatMap((file) =>
  withoutComments(readFileSync(file, 'utf8'))
    .split('\n')
    .flatMap((line, index) =>
      rules
        .filter((rule) => rule.test(line))
        .map((rule) => `${relative(root, file)}:${index + 1}  ${rule.name}  ${line.trim()}`),
    ),
);

if (problems.length > 0) {
  console.error(`Raw values found. Use a token from tokens/tokens.json instead:\n\n${problems.join('\n')}`);
  process.exit(1);
}

console.log(`No raw values in ${files.length} component and screen stylesheets.`);
