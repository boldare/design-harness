// Types of manifest.mjs, for vitest.config.ts. Keep them in step with the module by hand: skipLibCheck skips this file.

export const MANIFEST: 'design-harness.yaml';

export interface SystemPaths {
  tokens: string;
  tokens_css: string;
  foundations: string;
  rules: string;
  components: string;
  screens: string;
  src: string;
  preview_head: string;
}

export interface Gate {
  id: string;
  after?: string;
  approval?: 'auto' | 'human';
  check?: string;
}

export interface System {
  root: string;
  name: string;
  /** Relative to the root, defaults filled in. */
  paths: SystemPaths;
  frame: { width: number; height: number } | null;
  outputs: {
    figma: { library?: string } | null;
    claude_design: { sources?: string; namespace?: string } | null;
  };
  gates: Gate[];
  /** The absolute path of a path relative to the system's root. */
  at(path: string): string;
  /** A path relative to the system's root, for messages. */
  rel(path: string): string;
}

/** The design system around `from`. Exits with a message when there is no manifest or it is not valid. */
export function loadSystem(from?: string): System;
