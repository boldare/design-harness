import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { expectAccessible } from '../../test/a11y';
import layout from '../../test/layout.module.css';
import { Link } from '../Link';
import { TextField, type TextFieldProps } from './TextField';

/**
 * Keeps the typed value in local state, so the field takes input. The "Forgot password?" Link is made here,
 * not passed in: a Link element among the props would name the test after the Link instead of the TextField.
 */
function ControlledTextField({ forgotPassword, ...props }: TextFieldProps & { forgotPassword?: boolean }) {
  const [value, setValue] = useState(props.value);
  return (
    <TextField
      {...props}
      labelAction={
        forgotPassword ? (
          <Link size="sm" href="#forgot-password">
            Forgot password?
          </Link>
        ) : undefined
      }
      value={value}
      onChange={(next) => {
        setValue(next);
        props.onChange(next);
      }}
    />
  );
}

// One column per type, with copy from Atlas sign-in and device settings.
const fields: {
  props: TextFieldProps & { forgotPassword?: boolean };
  filled: string;
  error: { value: string; message: string };
}[] = [
  {
    props: { label: 'Device name', type: 'text', value: '', placeholder: 'Kitchen sensor', onChange: vi.fn() },
    filled: 'Hallway thermostat',
    error: { value: '', message: 'Give the device a name, like Kitchen sensor' },
  },
  {
    props: { label: 'Email', type: 'email', value: '', placeholder: 'name@company.com', autoComplete: 'email', onChange: vi.fn() },
    filled: 'maja.nowak@company.com',
    error: { value: 'maja.nowak@company', message: 'Enter a valid email, like name@company.com' },
  },
  {
    props: {
      label: 'Password',
      type: 'password',
      value: '',
      autoComplete: 'current-password',
      forgotPassword: true,
      onChange: vi.fn(),
    },
    filled: 'atlas-demo-2026',
    error: { value: '', message: 'Enter your password to sign in' },
  },
];

// Type × State, as in the README.
const row = (cell: (field: (typeof fields)[number]) => Partial<TextFieldProps> = () => ({})) => (
  <div className={layout.row}>
    {fields.map((field) => (
      <div key={field.props.label} className={layout.cell}>
        <ControlledTextField {...field.props} {...cell(field)} />
      </div>
    ))}
  </div>
);

describe('TextField', () => {
  it('empty', async () => {
    const screen = await render(row());
    await expect.element(screen.getByLabelText('Email')).toHaveAttribute('placeholder', 'name@company.com');
    await expect.element(screen.getByLabelText('Email')).toHaveValue('');
    await expectAccessible();
  });

  it('filled', async () => {
    const screen = await render(row(({ filled }) => ({ value: filled })));
    await expect.element(screen.getByLabelText('Email')).toHaveValue('maja.nowak@company.com');
    await expectAccessible();
  });

  it('focus', async () => {
    const screen = await render(row(({ filled }) => ({ value: filled })));
    await userEvent.tab();
    await expect.element(screen.getByLabelText('Device name')).toHaveFocus();
    await expectAccessible();
  });

  it('error', async () => {
    const screen = await render(row(({ error }) => ({ value: error.value, error: error.message })));
    const email = screen.getByLabelText('Email');
    await expect.element(email).toHaveAttribute('aria-invalid', 'true');
    // The message says how to fix it, and the field points at it.
    await expect.element(email).toHaveAccessibleDescription('Enter a valid email, like name@company.com');
    await expectAccessible();
  });

  it('disabled', async () => {
    const screen = await render(row(({ filled }) => ({ value: filled, disabled: true })));
    await expect.element(screen.getByLabelText('Email')).toBeDisabled();
    await expect.element(screen.getByLabelText('Password')).toBeDisabled();
    await expectAccessible();
  });

  it('password toggle', async () => {
    const onChange = vi.fn();
    const screen = await render(
      <ControlledTextField label="Password" type="password" value="" autoComplete="current-password" onChange={onChange} />,
    );
    const password = screen.getByLabelText('Password');
    await password.fill('atlas-demo-2026');
    expect(onChange).toHaveBeenLastCalledWith('atlas-demo-2026');
    await screen.getByRole('button', { name: 'Show password' }).click();
    await expect.element(password).toHaveAttribute('type', 'text');
    await expect.element(screen.getByRole('button', { name: 'Hide password' })).toBeVisible();
    await expectAccessible();
  });
});
