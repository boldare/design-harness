// The describe-me plugin options of a design system, read from its manifest and its inventory tables.

import { readFileSync } from 'node:fs';
import { readInventory, sidebarGroups } from '../../lib/inventory.mjs';

/** The options for describeMe(): the preview head and the sidebar groups. */
export function describeMeOptions(system) {
  // The web fonts of the text styles. Every replayed frame gets them here.
  const previewHead = readFileSync(system.at(system.paths.preview_head), 'utf8');
  // The inventory tables set the groups of the sidebar and their order.
  const groups = sidebarGroups(system, readInventory(system));
  return { previewHead, sidebar: { groups } };
}
