#!/usr/bin/env node
// The design-harness command. `init` writes a new design system into the working directory. Every other command runs
// one adapter script on the design system whose manifest is found from the working directory up.

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const commands = new Map([
  ['init', '../lib/init.mjs'],
  ['tokens', '../adapters/react/build-tokens.mjs'],
  ['lint', '../adapters/react/check-raw-values.mjs'],
  ['states', '../adapters/describe-me/check-states.mjs'],
  ['claude-design', '../adapters/claude-design/build-claude-design.mjs'],
]);

const [command, ...options] = process.argv.slice(2);
if (!commands.has(command)) {
  console.error(`Usage: design-harness <${[...commands.keys()].join(' | ')}> [options]`);
  process.exit(1);
}

// pnpm run <script> -- <options> passes the -- on, npm run does not.
if (options[0] === '--') options.shift();

// A child process, because each script does its work on import and reads its options from process.argv.
const script = fileURLToPath(new URL(commands.get(command), import.meta.url));
const { status } = spawnSync(process.execPath, [script, ...options], { stdio: 'inherit' });
process.exit(status ?? 1);
