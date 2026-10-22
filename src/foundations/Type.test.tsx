import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { expectAccessible } from '../test/a11y';
import { TypeSpecimen } from './TypeSpecimen';
import { tokens } from './tokens';

describe('Foundations', () => {
  it('type styles', async () => {
    const screen = await render(<TypeSpecimen />);
    for (const group of tokens.type.groups) {
      await expect.element(screen.getByRole('heading', { name: group.name })).toBeVisible();
    }
    await expectAccessible();
  });
});
