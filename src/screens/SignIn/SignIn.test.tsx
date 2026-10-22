import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { expectAccessible } from '../../test/a11y';
import { PhoneFrame } from '../../test/PhoneFrame';
import { respond, responseDelay } from '../../test/respond';
import { SignIn, type SignInCredentials, type SignInProps, type SignInState } from './SignIn';

/**
 * The prototype server: it answers after responseDelay, rejects the first valid sign-in and accepts the next,
 * so both outcomes can be shown. Browser-only, so Live runs it too.
 */
function SignInPrototype({ onSignIn, ...props }: SignInProps) {
  // Opened in the error state, the first attempt has already been rejected.
  const rejectNext = useRef(props.state !== 'error');

  function answer(credentials: SignInCredentials) {
    onSignIn(credentials);
    const accepted = !rejectNext.current;
    rejectNext.current = accepted;
    return respond(accepted);
  }

  return <SignIn {...props} onSignIn={answer} />;
}

// The screen in a phone frame. The wrapper keeps the test named after the screen.
const open = (state: SignInState, handlers: Partial<Pick<SignInProps, 'onSignIn' | 'onContinue'>> = {}) =>
  render(<SignInPrototype state={state} onSignIn={vi.fn()} onContinue={vi.fn()} {...handlers} />, {
    wrapper: PhoneFrame,
  });

// A server answer takes responseDelay; assertions on it wait a little longer.
const afterServer = { timeout: responseDelay * 2 };

describe('SignIn', () => {
  it('empty', async () => {
    const screen = await open('empty');
    await expect.element(screen.getByLabelText('Email')).toHaveValue('');
    await expect.element(screen.getByLabelText('Email')).toHaveAttribute('placeholder', 'name@company.com');
    await expect.element(screen.getByLabelText('Password')).toHaveAttribute('placeholder', 'At least 8 characters');
    // Sign in is always enabled.
    await expect.element(screen.getByRole('button', { name: 'Sign in' })).toBeEnabled();
    await expectAccessible();
  });

  it('validation', async () => {
    const screen = await open('validation');
    const email = screen.getByLabelText('Email');
    const password = screen.getByLabelText('Password');
    await expect.element(email).toHaveAttribute('aria-invalid', 'true');
    await expect.element(email).toHaveAccessibleDescription('Enter a valid email, like name@company.com');
    await expect.element(password).toHaveAttribute('aria-invalid', 'true');
    await expect.element(password).toHaveAccessibleDescription('Use at least 8 characters');
    await expectAccessible();
  });

  it('loading', async () => {
    const screen = await open('loading');
    await expect.element(screen.getByLabelText('Email')).toBeDisabled();
    await expect.element(screen.getByLabelText('Password')).toBeDisabled();
    await expect.element(screen.getByRole('button', { name: 'Signing in…' })).toHaveAttribute('aria-busy', 'true');
    await expectAccessible();
  });

  it('error', async () => {
    const screen = await open('error');
    await expect.element(screen.getByRole('alert')).toMatchTextContent(/Email or password is incorrect/);
    // Input is kept.
    await expect.element(screen.getByLabelText('Email')).toHaveValue('anna.kowalska@example.com');
    await expectAccessible();
  });

  it('success', async () => {
    const onContinue = vi.fn();
    const screen = await open('success', { onContinue });
    await expect.element(screen.getByRole('status')).toMatchTextContent(/You're signed in/);
    await expect.element(screen.getByText('anna.kowalska@example.com')).toBeVisible();
    await expectAccessible();
    await screen.getByRole('button', { name: 'Continue' }).click();
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('signs in', async () => {
    const onSignIn = vi.fn();
    const screen = await open('empty', { onSignIn });
    const email = screen.getByLabelText('Email');
    const password = screen.getByLabelText('Password');
    const signIn = screen.getByRole('button', { name: 'Sign in' });

    // An empty submit shows both messages and moves focus to the first invalid field.
    await signIn.click();
    await expect.element(email).toHaveAccessibleDescription('Enter your email address');
    await expect.element(password).toHaveAccessibleDescription('Enter your password');
    await expect.element(email).toHaveFocus();
    expect(onSignIn).not.toHaveBeenCalled();

    // The message updates as the person types, and clears once the email is valid.
    await email.fill('anna.kowalska@');
    await expect.element(email).toHaveAccessibleDescription('Enter a valid email, like name@company.com');
    await email.fill('anna.kowalska@example.com');
    await expect.element(email).not.toHaveAttribute('aria-invalid');
    await password.fill('correct-horse');

    // The first attempt is rejected: the Alert is announced and both fields keep their input.
    await signIn.click();
    await expect.element(screen.getByRole('button', { name: 'Signing in…' })).toHaveAttribute('aria-busy', 'true');
    await expect.element(screen.getByRole('alert'), afterServer).toMatchTextContent(/Email or password is incorrect/);
    await expect.element(email).toHaveValue('anna.kowalska@example.com');
    expect(onSignIn).toHaveBeenCalledWith({ email: 'anna.kowalska@example.com', password: 'correct-horse' });

    // The second succeeds, and Sign out returns to the empty form.
    await signIn.click();
    await expect.element(screen.getByRole('status'), afterServer).toMatchTextContent(/You're signed in/);
    await screen.getByRole('button', { name: 'Not you? Sign out' }).click();
    await expect.element(screen.getByLabelText('Email')).toHaveValue('');
  });
});
