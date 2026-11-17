// Types of inventory.mjs, for vitest.config.ts. Keep them in step with the module by hand: skipLibCheck skips this file.

import type { System } from './manifest.mjs';

export interface InventoryRow {
  /** The name in the link of the first cell. */
  name: string;
  /** The link target, `<Name>/README.md`. */
  link: string;
  group: string;
  /** 1-based. */
  line: number;
  /** The trimmed text of every cell, in column order. */
  cells: string[];
}

export interface InventoryTable {
  /** Relative to the system's root, for example `components/README.md`. */
  file: string;
  /** The header texts. */
  columns: string[];
  rows: InventoryRow[];
}

export interface Inventory {
  components: InventoryTable;
  screens: InventoryTable;
}

/** The inventory tables of the components and the screens. Exits with every problem when one is not valid. */
export function readInventory(system: System): Inventory;

/** The sidebar groups for `describeMe({ sidebar: { groups } })`, in sidebar order. */
export function sidebarGroups(system: System, inventory: Inventory): Record<string, string>;
