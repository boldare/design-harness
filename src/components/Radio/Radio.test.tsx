import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { expectAccessible } from '../../test/a11y';
import layout from '../../test/layout.module.css';
import { Radio, RadioGroup, type RadioGroupProps } from './Radio';

const notifications = [
  { value: 'all', label: 'All activity', description: 'Every reading and every alert' },
  { value: 'alerts', label: 'Alerts only', description: 'Only when something needs your attention' },
  { value: 'none', label: 'None' },
];

/** Keeps the chosen value locally, so the group changes. */
function ControlledRadioGroup(props: RadioGroupProps) {
  const [value, setValue] = useState(props.value);
  return (
    <RadioGroup
      {...props}
      value={value}
      onChange={(next) => {
        setValue(next);
        props.onChange(next);
      }}
    />
  );
}

// Selected × State, as in the README: one option row per cell, each in its own group.
const row = (disabled = false) => (
  <div className={layout.row}>
    {[false, true].map((checked) => (
      <div key={String(checked)} className={layout.cell}>
        <Radio
          name={`radio-${checked}`}
          value="alerts"
          label="Alerts only"
          description="Only when something needs your attention"
          checked={checked}
          disabled={disabled}
          onChange={vi.fn()}
        />
      </div>
    ))}
  </div>
);

describe('Radio', () => {
  it('default', async () => {
    const screen = await render(row());
    const options = screen.getByRole('radio', { name: 'Alerts only' });
    await expect.element(options.first()).not.toBeChecked();
    await expect.element(options.last()).toBeChecked();
    await expectAccessible();
  });

  it('focus', async () => {
    const screen = await render(row());
    await userEvent.tab();
    await expect.element(screen.getByRole('radio', { name: 'Alerts only' }).first()).toHaveFocus();
    await expectAccessible();
  });

  it('disabled', async () => {
    const screen = await render(row(true));
    await expect.element(screen.getByRole('radio', { name: 'Alerts only' }).first()).toBeDisabled();
    await expectAccessible();
  });

  it('group', async () => {
    const onChange = vi.fn();
    const screen = await render(
      <ControlledRadioGroup legend="Notifications" options={notifications} value="alerts" onChange={onChange} />,
    );
    await expect.element(screen.getByRole('group', { name: 'Notifications' })).toBeVisible();
    await screen.getByRole('radio', { name: 'None' }).click();
    await expect.element(screen.getByRole('radio', { name: 'None' })).toBeChecked();
    expect(onChange).toHaveBeenCalledWith('none');
    await expectAccessible();
  });

  it('group disabled', async () => {
    // The fieldset disables every option, and the opacity is applied once.
    const screen = await render(
      <ControlledRadioGroup legend="Notifications" options={notifications} value="alerts" disabled onChange={vi.fn()} />,
    );
    await expect.element(screen.getByRole('radio', { name: 'All activity' })).toBeDisabled();
    await expectAccessible();
  });
});
