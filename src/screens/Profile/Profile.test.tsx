import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { expectAccessible } from '../../test/a11y';
import { PhoneFrame } from '../../test/PhoneFrame';
import { respond, responseDelay } from '../../test/respond';
import { Profile, type ProfileProps, type ProfileState, type ProfileValues } from './Profile';

/** The prototype server: it saves every valid profile after responseDelay. Browser-only, so Live runs it too. */
function ProfilePrototype({ onSave, ...props }: ProfileProps) {
  function save(values: ProfileValues) {
    onSave(values);
    return respond(undefined);
  }

  return <Profile {...props} onSave={save} />;
}

// The screen in a phone frame. The wrapper keeps the test named after the screen.
const open = (state: ProfileState, onSave = vi.fn()) =>
  render(<ProfilePrototype state={state} onSave={onSave} />, { wrapper: PhoneFrame });

// A server answer takes responseDelay; assertions on it wait a little longer.
const afterServer = { timeout: responseDelay * 2 };

describe('Profile', () => {
  it('default', async () => {
    const screen = await open('default');
    await expect.element(screen.getByLabelText('Full name')).toHaveValue('Anna Kowalska');
    await expect.element(screen.getByRole('combobox', { name: 'Country' })).toMatchTextContent(/Poland/);
    await expect.element(screen.getByRole('radio', { name: 'Every week' })).toBeChecked();
    await expect.element(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled();
    await expectAccessible();
  });

  it('error', async () => {
    const screen = await open('error');
    const email = screen.getByLabelText('Email');
    await expect.element(email).toHaveAttribute('aria-invalid', 'true');
    await expect.element(email).toHaveAccessibleDescription('Enter a valid email, like name@company.com');
    const country = screen.getByRole('combobox', { name: 'Country' });
    await expect.element(country).toHaveAttribute('aria-invalid', 'true');
    await expect.element(country).toHaveAccessibleDescription('Choose the country where you use your device');
    await expectAccessible();
  });

  it('saving', async () => {
    const screen = await open('saving');
    await expect.element(screen.getByLabelText('Full name')).toBeDisabled();
    await expect.element(screen.getByRole('combobox', { name: 'Country' })).toBeDisabled();
    await expect.element(screen.getByRole('button', { name: 'Saving…' })).toHaveAttribute('aria-busy', 'true');
    await expect.element(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    await expectAccessible();
  });

  it('saves changes', async () => {
    const onSave = vi.fn();
    const screen = await open('default', onSave);
    await screen.getByLabelText('Full name').fill('Anna Nowak');
    await screen.getByRole('button', { name: 'Save changes' }).click();
    await expect.element(screen.getByRole('button', { name: 'Saving…' })).toHaveAttribute('aria-busy', 'true');
    // The AccountCard shows the saved name once the server answers.
    await expect.element(screen.getByText('Anna Nowak').first(), afterServer).toBeVisible();
    await expect.element(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled();
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ name: 'Anna Nowak' }));
  });

  it('keeps what was typed and focuses the first invalid field', async () => {
    const onSave = vi.fn();
    const screen = await open('default', onSave);
    const email = screen.getByLabelText('Email');
    await email.fill('anna.kowalska@');
    await screen.getByRole('button', { name: 'Save changes' }).click();
    await expect.element(email).toHaveAttribute('aria-invalid', 'true');
    await expect.element(email).toHaveValue('anna.kowalska@');
    await expect.element(email).toHaveFocus();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('cancel discards changes', async () => {
    const screen = await open('default');
    const name = screen.getByLabelText('Full name');
    await name.fill('Anna Nowak');
    await screen.getByRole('button', { name: 'Cancel' }).click();
    await expect.element(name).toHaveValue('Anna Kowalska');
  });
});
