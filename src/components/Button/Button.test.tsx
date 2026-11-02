import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { expectAccessible } from '../../test/a11y';
import layout from '../../test/layout.module.css';
import { Button, type ButtonProps } from './Button';

// Variant × State, as in the README. Primary says what is happening while loading; quiet keeps its label.
const variants = (props: Partial<ButtonProps> = {}, onPress = vi.fn()) => (
  <div className={layout.row}>
    <Button fullWidth={false} loadingLabel="Signing in…" onPress={onPress} {...props}>
      Sign in
    </Button>
    <Button variant="quiet" fullWidth={false} onPress={onPress} {...props}>
      Use a different account
    </Button>
  </div>
);

describe('Button', () => {
  it('default', async () => {
    const onPress = vi.fn();
    const screen = await render(variants({}, onPress));
    await screen.getByRole('button', { name: 'Sign in' }).click();
    expect(onPress).toHaveBeenCalledTimes(1);
    await expectAccessible();
  });

  it('focus', async () => {
    const screen = await render(variants());
    await userEvent.tab();
    await expect.element(screen.getByRole('button', { name: 'Sign in' })).toHaveFocus();
    await expectAccessible();
  });

  it('disabled', async () => {
    const screen = await render(variants({ disabled: true }));
    await expect.element(screen.getByRole('button', { name: 'Sign in' })).toBeDisabled();
    await expect.element(screen.getByRole('button', { name: 'Use a different account' })).toBeDisabled();
    await expectAccessible();
  });

  it('loading', async () => {
    const onPress = vi.fn();
    const screen = await render(variants({ loading: true }, onPress));
    const primary = screen.getByRole('button', { name: 'Signing in…' });
    await expect.element(primary).toHaveAttribute('aria-busy', 'true');
    await expect.element(screen.getByRole('button', { name: 'Use a different account' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    // Repeated presses are ignored while the request runs; the button stays focusable.
    await primary.click();
    expect(onPress).not.toHaveBeenCalled();
    await expectAccessible();
  });
});
