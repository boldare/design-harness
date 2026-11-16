import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { expectAccessible } from '../../test/a11y';
import { StatusMark } from './StatusMark';

// The README has no states table: the one tone that exists, success.
describe('StatusMark', () => {
  it('success', async () => {
    const screen = await render(<StatusMark tone="success" />);
    // Decorative: the heading next to it carries the message.
    const mark = screen.container.firstElementChild as HTMLElement;
    expect(mark.getAttribute('aria-hidden')).toBe('true');
    await expect.element(mark).toBeVisible();
    await expectAccessible();
  });
});
