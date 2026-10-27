import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { expectAccessible } from '../../test/a11y';
import { PhoneFrame } from '../../test/PhoneFrame';
import { DeviceSettings, type DeviceSettingsState } from './DeviceSettings';

// The screen in a phone frame. The wrapper keeps the test named after the screen.
const open = (state: DeviceSettingsState, onSaveName = vi.fn()) =>
  render(<DeviceSettings state={state} onSaveName={onSaveName} />, { wrapper: PhoneFrame });

describe('DeviceSettings', () => {
  it('connected', async () => {
    const screen = await open('connected');
    await expect.element(screen.getByText('Atlas One, connected')).toBeVisible();
    await expect.element(screen.getByLabelText('Device name')).toHaveValue("Anna's Atlas One");
    await expect.element(screen.getByRole('switch', { name: 'Vibration' })).toBeChecked();
    await expect.element(screen.getByRole('switch', { name: 'Device lock' })).not.toBeChecked();
    await expect.element(screen.getByRole('slider', { name: 'LED brightness' })).toHaveAttribute('aria-valuetext', '50%');
    await expectAccessible();
  });

  it('disconnected', async () => {
    const screen = await open('disconnected');
    await expect.element(screen.getByText('Atlas One, not connected')).toBeVisible();
    await expect.element(screen.getByRole('alert')).toMatchTextContent(/Device not found/);
    // Every control keeps its last known value and cannot be changed.
    await expect.element(screen.getByLabelText('Device name')).toBeDisabled();
    await expect.element(screen.getByRole('switch', { name: 'Vibration' })).toBeDisabled();
    await expect.element(screen.getByRole('switch', { name: 'Vibration' })).toBeChecked();
    await expect.element(screen.getByRole('slider', { name: 'LED brightness' })).toBeDisabled();
    await expect.element(screen.getByRole('slider', { name: 'LED brightness' })).toHaveAttribute('aria-valuetext', '50%');
    await expectAccessible();
  });

  it('applies changes at once', async () => {
    const screen = await open('connected');
    await screen.getByRole('switch', { name: 'Device lock' }).click();
    await expect.element(screen.getByRole('switch', { name: 'Device lock' })).toBeChecked();
    // The slider follows the Device lock switch in the tab order.
    const brightness = screen.getByRole('slider', { name: 'LED brightness' });
    await userEvent.tab();
    await expect.element(brightness).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect.element(brightness).toHaveAttribute('aria-valuetext', '60%');
  });

  it('saves the name when the field loses focus', async () => {
    const onSaveName = vi.fn();
    const screen = await open('connected', onSaveName);
    const name = screen.getByLabelText('Device name');
    await name.fill('Kitchen Atlas One');
    expect(onSaveName).not.toHaveBeenCalled();
    await userEvent.tab();
    expect(onSaveName).toHaveBeenCalledWith('Kitchen Atlas One');
  });
});
