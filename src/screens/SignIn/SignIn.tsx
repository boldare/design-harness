import { useId, useState } from 'react';
import { AccountCard } from '../../components/AccountCard';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { Link } from '../../components/Link';
import { Logo } from '../../components/Logo';
import { StatusMark } from '../../components/StatusMark';
import { TextField } from '../../components/TextField';
import layout from '../layout.module.css';
import { emailError } from '../validation';
import styles from './SignIn.module.css';

/** The five states from the SignIn README. */
export type SignInState = 'empty' | 'validation' | 'loading' | 'error' | 'success';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignInProps {
  /** The state the screen opens in, for previews and tests. From there it moves on as the person uses it. */
  state?: SignInState;
  /** Called with valid credentials only. Resolves to true when the server accepts them. */
  onSignIn: (credentials: SignInCredentials) => Promise<boolean>;
  onContinue: () => void;
}

type Request = 'none' | 'pending' | 'rejected' | 'accepted';

const empty: SignInCredentials = { email: '', password: '' };

// Spec: the README does not give the values the states show. They come from the original Atlas design.
const filled: SignInCredentials = { email: 'anna.kowalska@example.com', password: 'correct-horse' };
const opening: Record<SignInState, { credentials: SignInCredentials; validated: boolean; request: Request }> = {
  empty: { credentials: empty, validated: false, request: 'none' },
  validation: { credentials: { email: 'anna.kowalska@', password: '1234' }, validated: true, request: 'none' },
  loading: { credentials: filled, validated: true, request: 'pending' },
  error: { credentials: filled, validated: true, request: 'rejected' },
  success: { credentials: filled, validated: true, request: 'accepted' },
};

// Spec: the README gives the AccountCard no values. The name is Anna's from the Profile README;
// the email is the one she signed in with, as in the original Atlas design.
const accountName = 'Anna Kowalska';

function passwordError(password: string) {
  if (!password) return 'Enter your password';
  if (password.length < 8) return 'Use at least 8 characters';
  return undefined;
}

const errorsOf = (credentials: SignInCredentials) => ({
  email: emailError(credentials.email),
  password: passwordError(credentials.password),
});

/** The Atlas sign-in screen. Validates on Sign in, then updates the messages as the person types. */
export function SignIn({ state = 'empty', onSignIn, onContinue }: SignInProps) {
  const [credentials, setCredentials] = useState(opening[state].credentials);
  // True from the first Sign in: messages show, and update as the person types.
  const [validated, setValidated] = useState(opening[state].validated);
  const [request, setRequest] = useState(opening[state].request);
  const emailId = useId();
  const passwordId = useId();

  const errors = validated ? errorsOf(credentials) : undefined;
  const loading = request === 'pending';
  const signedIn = request === 'accepted';

  function edit(field: keyof SignInCredentials, value: string) {
    setCredentials((current) => ({ ...current, [field]: value }));
    // Any edit clears the Alert.
    if (request === 'rejected') setRequest('none');
  }

  async function signIn() {
    const found = errorsOf(credentials);
    setValidated(true);
    if (found.email || found.password) {
      setRequest('none');
      // Spec: the SignIn README does not say where focus goes. As in Profile, it moves to the first invalid field.
      document.getElementById(found.email ? emailId : passwordId)?.focus();
      return;
    }
    setRequest('pending');
    setRequest((await onSignIn(credentials)) ? 'accepted' : 'rejected');
  }

  function signOut() {
    setCredentials(empty);
    setValidated(false);
    setRequest('none');
  }

  return (
    <div className={layout.screen}>
      <div className={styles.header}>
        <Logo />
        <Link tone="subtle" href="#help">
          Help
        </Link>
      </div>

      {/* In the page from the start, so screen readers announce the outcome when it appears inside. */}
      <div role="status" className={signedIn ? styles.outcome : undefined}>
        {signedIn && (
          <>
            <StatusMark />
            <div className={layout.titleBlock}>
              <h1 className={layout.title}>You're signed in</h1>
              <p className={layout.intro}>Good to see you again, Anna.</p>
            </div>
            <AccountCard name={accountName} email={credentials.email} />
          </>
        )}
      </div>

      {signedIn ? (
        <div className={layout.actions}>
          <Button onPress={onContinue}>Continue</Button>
          <Button variant="quiet" onPress={signOut}>
            Not you? Sign out
          </Button>
        </div>
      ) : (
        <>
          <div className={`${layout.titleBlock} ${styles.welcome}`}>
            <h1 className={layout.title}>Welcome back</h1>
            <p className={layout.intro}>Sign in with the email you used to create your account.</p>
          </div>

          {request === 'rejected' && (
            <div className={styles.alert}>
              <Alert
                title="Email or password is incorrect"
                description="Check your details and try again, or reset your password."
              />
            </div>
          )}

          <form className={styles.form} noValidate onSubmit={(event) => event.preventDefault()}>
            <TextField
              id={emailId}
              label="Email"
              type="email"
              placeholder="name@company.com"
              autoComplete="email"
              value={credentials.email}
              onChange={(value) => edit('email', value)}
              error={errors?.email}
              disabled={loading}
            />
            <TextField
              id={passwordId}
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              autoComplete="current-password"
              labelAction={
                <Link size="sm" href="#forgot-password">
                  Forgot password?
                </Link>
              }
              value={credentials.password}
              onChange={(value) => edit('password', value)}
              error={errors?.password}
              disabled={loading}
            />
            {/* Enter in a field clicks the submit button, so onPress handles both. */}
            <Button type="submit" loading={loading} loadingLabel="Signing in…" onPress={signIn}>
              Sign in
            </Button>
          </form>

          <p className={styles.footer}>
            New to Atlas?{' '}
            <Link tone="strong" href="#create-account">
              Create an account
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
