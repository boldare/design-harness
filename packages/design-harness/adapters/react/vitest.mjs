// The Vitest preset: a design system's test config, built from its design-harness.yaml.
// A system's vitest.config.ts is `export default defineHarnessConfig()`.

import { existsSync, realpathSync } from 'node:fs';
import { posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeMe } from '@describe-me/vitest/plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { searchForWorkspaceRoot } from 'vite';
import { mergeConfig } from 'vitest/config';
import { loadSystem } from '../../lib/manifest.mjs';
import { describeMeOptions } from '../describe-me/options.mjs';

const systemId = 'virtual:design-harness/system';
const resolvedSystemId = `\0${systemId}`;

/** The module the setup and PhoneFrame import: the system's tokens and canvas, and its frame. */
function systemPlugin(system) {
  const canvas = system.at(posix.join(system.paths.src, 'test/canvas.css'));
  const styles = [system.at(system.paths.tokens_css), ...(existsSync(canvas) ? [canvas] : [])];
  const code = [
    ...styles.map((path) => `import ${JSON.stringify(path)};`),
    `export const frame = ${JSON.stringify(system.frame)};`,
  ].join('\n');
  // No apply: describe-me Live keeps only the plugins without one or with one that applies to serve.
  return {
    name: 'design-harness:system',
    resolveId: (id) => (id === systemId ? resolvedSystemId : undefined),
    load: (id) => (id === resolvedSystemId ? code : undefined),
  };
}

/**
 * The Vitest config of the design system around the working directory. `overrides` merge in with Vitest's
 * mergeConfig, so arrays such as setupFiles and plugins add to the preset's.
 */
export function defineHarnessConfig(overrides = {}) {
  // Here and not at import, because loadSystem exits the process when there is no manifest.
  const system = loadSystem();
  const base = {
    root: system.root,
    plugins: [react(), describeMe(describeMeOptions(system)), systemPlugin(system)],
    server: {
      // A worktree (evals, rollouts) may link node_modules from elsewhere. The browser test server must still serve it.
      fs: { allow: [searchForWorkspaceRoot(system.root), realpathSync(system.at('node_modules'))] },
    },
    test: {
      include: [posix.join(system.paths.src, '**/*.test.tsx')],
      setupFiles: [fileURLToPath(new URL('./test/setup.ts', import.meta.url))],
      // A new system has no tests yet. The states check still fails once an inventory row has no recorded test file.
      passWithNoTests: true,
      // A real browser, so layout, fonts, focus and contrast are the real ones.
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(),
        instances: [{ browser: 'chromium' }],
      },
    },
  };
  return mergeConfig(base, overrides);
}
