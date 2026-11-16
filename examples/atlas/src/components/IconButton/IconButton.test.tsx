import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { expectAccessible } from '../../test/a11y';
import { IconButton } from './IconButton';

/** A toggle with a fixed label: aria-pressed carries the state. The password toggle in TextField changes its label instead. */
function PasswordToggle() {
  const [visible, setVisible] = useState(false);
  return (
    <IconButton
      icon={visible ? 'eye-off' : 'eye'}
      label="Show password"
      pressed={visible}
      onPress={() => setVisible(!visible)}
    />
  );
}

describe('IconButton', () => {
  it('default', async () => {
    const onPress = vi.fn();
    const screen = await render(<IconButton icon="eye" label="Show password" onPress={onPress} />);
    await screen.getByRole('button', { name: 'Show password' }).click();
    expect(onPress).toHaveBeenCalledTimes(1);
    await expectAccessible();
  });

  it('focus', async () => {
    const screen = await render(<IconButton icon="eye" label="Show password" onPress={vi.fn()} />);
    await userEvent.tab();
    await expect.element(screen.getByRole('button', { name: 'Show password' })).toHaveFocus();
    await expectAccessible();
  });

  it('disabled', async () => {
    const screen = await render(<IconButton icon="eye" label="Show password" disabled onPress={vi.fn()} />);
    await expect.element(screen.getByRole('button', { name: 'Show password' })).toBeDisabled();
    await expectAccessible();
  });

  it('toggle', async () => {
    const screen = await render(<PasswordToggle />);
    const toggle = screen.getByRole('button', { name: 'Show password' });
    await expect.element(toggle).toHaveAttribute('aria-pressed', 'false');
    await toggle.click();
    await expect.element(toggle).toHaveAttribute('aria-pressed', 'true');
    await expectAccessible();
  });
});
