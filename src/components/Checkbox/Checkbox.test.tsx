import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { expectAccessible } from '../../test/a11y';
import layout from '../../test/layout.module.css';
import { Checkbox, type CheckboxProps } from './Checkbox';

/** Keeps the checked state locally, so the checkbox toggles. */
function ControlledCheckbox(props: CheckboxProps) {
  const [checked, setChecked] = useState(props.checked);
  return (
    <Checkbox
      {...props}
      checked={checked}
      onChange={(next) => {
        setChecked(next);
        props.onChange(next);
      }}
    />
  );
}

const consent = {
  label: 'I accept the Atlas terms of use',
  error: 'Atlas can’t create your account without your agreement',
};

// Checked × State, as in the README: one cell unchecked, one checked.
const row = (props: Partial<CheckboxProps> = {}, onChange = vi.fn()) => (
  <div className={layout.row}>
    {[false, true].map((checked) => (
      <div key={String(checked)} className={layout.cell}>
        <ControlledCheckbox label={consent.label} checked={checked} onChange={onChange} {...props} />
      </div>
    ))}
  </div>
);

describe('Checkbox', () => {
  it('default', async () => {
    const onChange = vi.fn();
    const screen = await render(row({}, onChange));
    const boxes = screen.getByRole('checkbox', { name: consent.label });
    await expect.element(boxes.first()).not.toBeChecked();
    await expect.element(boxes.last()).toBeChecked();
    await boxes.first().click();
    await expect.element(boxes.first()).toBeChecked();
    expect(onChange).toHaveBeenCalledWith(true);
    await expectAccessible();
  });

  it('focus', async () => {
    const screen = await render(row());
    await userEvent.tab();
    await expect.element(screen.getByRole('checkbox', { name: consent.label }).first()).toHaveFocus();
    await expectAccessible();
  });

  it('error', async () => {
    const screen = await render(row({ error: consent.error }));
    const box = screen.getByRole('checkbox', { name: consent.label }).first();
    await expect.element(box).toHaveAttribute('aria-invalid', 'true');
    await expect.element(box).toHaveAccessibleDescription(consent.error);
    await expectAccessible();
  });

  it('disabled', async () => {
    const screen = await render(row({ disabled: true }));
    await expect.element(screen.getByRole('checkbox', { name: consent.label }).first()).toBeDisabled();
    await expectAccessible();
  });

  it('with a description', async () => {
    const screen = await render(
      <ControlledCheckbox
        label="Share usage data with Atlas"
        description="Anonymous readings help us improve pairing. You can change this later in settings."
        checked={false}
        onChange={vi.fn()}
      />,
    );
    // The accessible name is the label alone; the description is read after it.
    await expect.element(screen.getByRole('checkbox', { name: 'Share usage data with Atlas' })).toHaveAccessibleDescription(
      'Anonymous readings help us improve pairing. You can change this later in settings.',
    );
    await expectAccessible();
  });
});
