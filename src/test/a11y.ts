import axe from 'axe-core';
import { expect } from 'vitest';

const themes = ['light', 'dark'] as const;

// Page-level rules do not apply to a component rendered alone on the test page.
const pageRules = ['region', 'landmark-one-main', 'page-has-heading-one', 'html-has-lang', 'document-title'];

/**
 * Runs axe on the page in both themes: contrast, names, roles and states, as rules.md requires.
 * Call it at the end of a test, after the state under test is on the page.
 */
export async function expectAccessible() {
  const root = document.documentElement;
  const before = root.dataset.theme;
  try {
    for (const theme of themes) {
      root.dataset.theme = theme;
      const { violations } = await axe.run(document.body, {
        resultTypes: ['violations'],
        rules: Object.fromEntries(pageRules.map((rule) => [rule, { enabled: false }])),
      });
      const report = violations.map(
        (violation) =>
          `${violation.id} (${violation.impact}): ${violation.help}\n` +
          violation.nodes.map((node) => `  ${node.target.join(' ')}\n  ${node.failureSummary}`).join('\n'),
      );
      expect(report, `axe violations in the ${theme} theme`).toEqual([]);
    }
  } finally {
    // The closing frame is taken after the test: leave the theme as it was.
    if (before === undefined) delete root.dataset.theme;
    else root.dataset.theme = before;
  }
}
