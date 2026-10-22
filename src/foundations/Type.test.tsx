import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { expectAccessible } from '../test/a11y';
import { TypeSpecimen } from './TypeSpecimen';
import { tokens } from './tokens';

// Foundations in the viewer lists the type tokens one by one; this shows each text style whole, with its sample and usage note.
describe('Text styles', () => {
  it('every style with its sample and usage', async () => {
    const screen = await render(<TypeSpecimen />);
    for (const group of tokens.type.groups) {
      await expect.element(screen.getByRole('heading', { name: group.name })).toBeVisible();
    }
    await expectAccessible();
  });
});
