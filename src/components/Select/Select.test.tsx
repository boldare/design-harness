import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { expectAccessible } from '../../test/a11y';
import layout from '../../test/layout.module.css';
import { Select, type SelectProps } from './Select';

const rooms = [
  { value: 'living-room', label: 'Living room' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'hallway', label: 'Hallway' },
  { value: 'office', label: 'Office' },
];

/** Keeps the chosen value in local state, so the select changes. */
function ControlledSelect(props: SelectProps) {
  const [value, setValue] = useState(props.value);
  return (
    <Select
      {...props}
      value={value}
      onChange={(next) => {
        setValue(next);
        props.onChange(next);
      }}
    />
  );
}

const cell = (props: Partial<SelectProps> = {}, onChange = vi.fn()) => (
  <div className={layout.cell}>
    <ControlledSelect label="Room" options={rooms} value="" onChange={onChange} {...props} />
  </div>
);

describe('Select', () => {
  it('empty', async () => {
    const screen = await render(cell());
    await expect.element(screen.getByRole('combobox', { name: 'Room' })).toMatchTextContent(/Choose…/);
    await expectAccessible();
  });

  it('filled', async () => {
    const screen = await render(cell({ value: 'kitchen' }));
    await expect.element(screen.getByRole('combobox', { name: 'Room' })).toMatchTextContent(/Kitchen/);
    await expectAccessible();
  });

  it('focus', async () => {
    const screen = await render(cell({ value: 'kitchen' }));
    await userEvent.tab();
    await expect.element(screen.getByRole('combobox', { name: 'Room' })).toHaveFocus();
    await expectAccessible();
  });

  it('open', async () => {
    const onChange = vi.fn();
    const screen = await render(cell({ value: 'kitchen' }, onChange));
    const field = screen.getByRole('combobox', { name: 'Room' });
    await field.click();
    await expect.element(field).toHaveAttribute('aria-expanded', 'true');
    await expect.element(screen.getByRole('option', { name: 'Kitchen' })).toHaveAttribute('aria-selected', 'true');
    await expectAccessible();
    // Choosing closes the menu and returns focus to the field.
    await screen.getByRole('option', { name: 'Bedroom' }).click();
    expect(onChange).toHaveBeenCalledWith('bedroom');
    await expect.element(field).toMatchTextContent(/Bedroom/);
    await expect.element(field).toHaveAttribute('aria-expanded', 'false');
    await expect.element(field).toHaveFocus();
  });

  it('error', async () => {
    const screen = await render(cell({ error: 'Choose the room this device is in' }));
    const field = screen.getByRole('combobox', { name: 'Room' });
    await expect.element(field).toHaveAttribute('aria-invalid', 'true');
    await expect.element(field).toHaveAccessibleDescription('Choose the room this device is in');
    await expectAccessible();
  });

  it('disabled', async () => {
    const screen = await render(cell({ value: 'kitchen', disabled: true }));
    await expect.element(screen.getByRole('combobox', { name: 'Room' })).toBeDisabled();
    await expectAccessible();
  });
});
