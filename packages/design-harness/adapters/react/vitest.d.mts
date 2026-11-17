// Types of vitest.mjs, for a system's vitest.config.ts. Keep them in step with the module by hand, because skipLibCheck skips this file.

import type { ViteUserConfig } from 'vitest/config';

/** The Vitest config of the design system around the working directory, with `overrides` merged in. */
export function defineHarnessConfig(overrides?: ViteUserConfig): ViteUserConfig;
