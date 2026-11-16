// Reads design-harness.yaml, the manifest of a design system (docs/architecture.md, "The manifest").
// Every script finds the system through it, so no script names a system's paths or its name.

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { parse } from 'yaml';

export const MANIFEST = 'design-harness.yaml';

const defaultPaths = {
  tokens: 'tokens/tokens.json',
  tokens_css: 'src/styles/tokens.css',
  foundations: 'docs/foundations.md',
  rules: 'docs/rules.md',
  components: 'components',
  screens: 'screens',
  src: 'src',
  preview_head: 'src/styles/fonts.html',
};

const outputKeys = { figma: ['library'], claude_design: ['sources', 'namespace'] };
const gateKeys = ['id', 'after', 'approval', 'check'];

/** The nearest directory at or above `from` that holds a manifest. */
function findRoot(from) {
  for (let dir = from; ; dir = dirname(dir)) {
    if (existsSync(join(dir, MANIFEST))) return dir;
    if (dirname(dir) === dir) return null;
  }
}

function unknownKeys(where, object, known) {
  return Object.keys(object ?? {})
    .filter((key) => !known.includes(key))
    .map((key) => `${where}: unknown key "${key}" (known: ${known.join(', ')})`);
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** The problems in a parsed manifest; empty when it is valid. */
function validate(raw) {
  if (!isObject(raw)) return ['the file is not a YAML mapping'];
  const problems = unknownKeys('top level', raw, ['name', 'paths', 'frame', 'outputs', 'gates']);
  if (typeof raw.name !== 'string' || raw.name.trim() === '') problems.push('"name" is required: the name of the design system');
  if (raw.paths !== undefined) {
    if (!isObject(raw.paths)) problems.push('"paths" must be a mapping');
    else {
      problems.push(...unknownKeys('paths', raw.paths, Object.keys(defaultPaths)));
      for (const [key, value] of Object.entries(raw.paths)) {
        if (typeof value !== 'string' || value === '') problems.push(`paths.${key} must be a path`);
      }
    }
  }
  if (raw.frame !== undefined) {
    const sizes = isObject(raw.frame) ? [raw.frame.width, raw.frame.height] : [];
    if (!sizes.every((size) => Number.isInteger(size) && size > 0) || sizes.length !== 2) {
      problems.push('"frame" must be { width, height } in whole pixels');
    } else problems.push(...unknownKeys('frame', raw.frame, ['width', 'height']));
  }
  if (raw.outputs !== undefined) {
    if (!isObject(raw.outputs)) problems.push('"outputs" must be a mapping');
    else {
      problems.push(...unknownKeys('outputs', raw.outputs, Object.keys(outputKeys)));
      for (const [output, keys] of Object.entries(outputKeys)) {
        const value = raw.outputs[output];
        if (value === undefined || value === null) continue;
        if (!isObject(value)) problems.push(`outputs.${output} must be a mapping`);
        else problems.push(...unknownKeys(`outputs.${output}`, value, keys));
      }
    }
  }
  if (raw.gates !== undefined) {
    if (!Array.isArray(raw.gates)) problems.push('"gates" must be a list');
    else {
      raw.gates.forEach((gate, index) => {
        if (!isObject(gate) || typeof gate.id !== 'string') problems.push(`gates[${index}] needs an "id"`);
        else problems.push(...unknownKeys(`gates[${index}]`, gate, gateKeys));
        if (isObject(gate) && gate.approval !== undefined && !['auto', 'human'].includes(gate.approval)) {
          problems.push(`gates[${index}].approval must be auto or human`);
        }
      });
    }
  }
  return problems;
}

/**
 * The design system around the working directory: its root, its name, its paths (relative to the root, defaults
 * filled in), the frame and the outputs. Exits with a message when there is no manifest or it is not valid.
 */
export function loadSystem(from = process.cwd()) {
  const root = findRoot(from);
  if (!root) {
    console.error(`No ${MANIFEST} in ${from} or above it. Run the command inside a design system.`);
    process.exit(1);
  }
  let raw;
  try {
    raw = parse(readFileSync(join(root, MANIFEST), 'utf8'));
  } catch (error) {
    console.error(`${MANIFEST}: ${error.message}`);
    process.exit(1);
  }
  const problems = validate(raw);
  if (problems.length > 0) {
    console.error(`${MANIFEST} is not valid:\n- ${problems.join('\n- ')}`);
    process.exit(1);
  }
  const paths = { ...defaultPaths, ...raw.paths };
  return {
    root,
    name: raw.name.trim(),
    paths,
    frame: raw.frame ?? null,
    outputs: { figma: raw.outputs?.figma ?? null, claude_design: raw.outputs?.claude_design ?? null },
    gates: raw.gates ?? [],
    /** The absolute path of a path relative to the system's root. */
    at: (path) => join(root, path),
    /** A path relative to the system's root, for messages. */
    rel: (path) => relative(root, path),
  };
}
