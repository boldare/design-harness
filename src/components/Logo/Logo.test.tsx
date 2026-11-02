import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { expectAccessible } from '../../test/a11y';
import { Logo } from './Logo';

// The README has no states table: the mark with and without the wordmark.
describe('Logo', () => {
  it('wordmark: true', async () => {
    const screen = await render(<Logo />);
    await expect.element(screen.getByText('Atlas')).toBeVisible();
    await expectAccessible();
  });

  it('wordmark: false', async () => {
    // Without the wordmark, the mark alone carries the name.
    const screen = await render(<Logo wordmark={false} />);
    await expect.element(screen.getByRole('img', { name: 'Atlas' })).toBeVisible();
    await expectAccessible();
  });
});
