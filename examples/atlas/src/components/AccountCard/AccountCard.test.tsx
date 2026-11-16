import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { expectAccessible } from '../../test/a11y';
import layout from '../../test/layout.module.css';
import { AccountCard } from './AccountCard';

// The README has no states table: initials from the name, given initials, and a long email truncated.
describe('AccountCard', () => {
  it('initials from name', async () => {
    const screen = await render(
      <div className={layout.cell}>
        <AccountCard name="Maja Nowak" email="maja.nowak@company.com" />
      </div>,
    );
    await expect.element(screen.getByText('MN')).toBeVisible();
    await expect.element(screen.getByText('maja.nowak@company.com')).toBeVisible();
    await expectAccessible();
  });

  it('initials given', async () => {
    const screen = await render(
      <div className={layout.cell}>
        <AccountCard name="Ana María López" email="ana.lopez@company.com" initials="AL" />
      </div>,
    );
    await expect.element(screen.getByText('AL')).toBeVisible();
    await expectAccessible();
  });

  it('long email', async () => {
    const email = 'krzysztof.wisniewski@facilities.northern-region.company.com';
    const screen = await render(
      <div className={layout.cell}>
        <AccountCard name="Krzysztof Wiśniewski" email={email} />
      </div>,
    );
    // Truncated with an ellipsis on screen; the full value stays in the accessible text.
    await expect.element(screen.getByText(email)).toHaveTextContent(email);
    await expectAccessible();
  });
});
