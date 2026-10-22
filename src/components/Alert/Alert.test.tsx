import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { expectAccessible } from '../../test/a11y';
import layout from '../../test/layout.module.css';
import { Alert } from './Alert';

// The README has no states table: the Alert is shown with and without its description.
describe('Alert', () => {
  it('title and description', async () => {
    const screen = await render(
      <div className={layout.cell}>
        <Alert
          title="Email or password is incorrect"
          description="Check your details and try again, or reset your password."
        />
      </div>,
    );
    // role="alert" makes screen readers announce it when it appears.
    await expect.element(screen.getByRole('alert')).toMatchTextContent(/Email or password is incorrect/);
    await expect.element(screen.getByRole('alert')).toMatchTextContent(/Check your details and try again/);
    await expectAccessible();
  });

  it('title only', async () => {
    const screen = await render(
      <div className={layout.cell}>
        <Alert title="The device didn’t respond. Try again." />
      </div>,
    );
    await expect.element(screen.getByRole('alert')).toMatchTextContent(/The device didn’t respond\. Try again\./);
    await expectAccessible();
  });
});
