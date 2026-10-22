import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { expectAccessible } from '../../test/a11y';
import layout from '../../test/layout.module.css';
import { Switch, type SwitchProps } from './Switch';

/** Keeps the checked state locally, so the switch toggles. */
function ControlledSwitch(props: SwitchProps) {
  const [checked, setChecked] = useState(props.checked);
  return (
    <Switch
      {...props}
      checked={checked}
      onChange={(next) => {
        setChecked(next);
        props.onChange(next);
      }}
    />
  );
}

// Checked × State, as in the README: one cell off, one on.
const row = (disabled = false, onChange = vi.fn()) => (
  <div className={layout.row}>
    {[false, true].map((checked) => (
      <div key={String(checked)} className={layout.cell}>
        <ControlledSwitch
          label="Child lock"
          description="Buttons on the device stop responding"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
        />
      </div>
    ))}
  </div>
);

describe('Switch', () => {
  it('default', async () => {
    const onChange = vi.fn();
    const screen = await render(row(false, onChange));
    const switches = screen.getByRole('switch', { name: 'Child lock' });
    await expect.element(switches.first()).not.toBeChecked();
    await expect.element(switches.last()).toBeChecked();
    // Applied immediately, without a Save button.
    await switches.first().click();
    await expect.element(switches.first()).toBeChecked();
    expect(onChange).toHaveBeenCalledWith(true);
    await expectAccessible();
  });

  it('focus', async () => {
    const screen = await render(row());
    await userEvent.tab();
    await expect.element(screen.getByRole('switch', { name: 'Child lock' }).first()).toHaveFocus();
    await expectAccessible();
  });

  it('disabled', async () => {
    const screen = await render(row(true));
    await expect.element(screen.getByRole('switch', { name: 'Child lock' }).first()).toBeDisabled();
    await expectAccessible();
  });
});
