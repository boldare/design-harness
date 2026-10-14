import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useRef } from 'react';
import { PhoneFrame } from '../../storybook/PhoneFrame';
import { respond } from '../../storybook/prototypeServer';
import { ScreenStates } from '../../storybook/ScreenStates';
import { SignIn, type SignInCredentials, type SignInProps, type SignInState } from './SignIn';

/**
 * The prototype server: it answers after responseDelay, rejects the first valid sign-in and accepts the next,
 * so both outcomes can be shown. Every attempt is also logged in the Actions panel.
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

const states: SignInState[] = ['empty', 'validation', 'loading', 'error', 'success'];

const meta = {
  title: 'Screens/SignIn',
  component: SignIn,
  args: { state: 'empty', onSignIn: fn(), onContinue: fn() },
  argTypes: { state: { control: 'inline-radio', options: states } },
  // A state picked in the controls opens the screen afresh.
  render: (args) => <SignInPrototype key={args.state} {...args} />,
} satisfies Meta<typeof SignIn>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The interactive prototype. Sign in with a valid email and password: the first attempt fails, the second succeeds. */
export const Default: Story = {
  decorators: [
    (Story) => (
      <PhoneFrame>
        <Story />
      </PhoneFrame>
    ),
  ],
};

/** The five states from the README, side by side. Each one is live and moves on as it is used. */
export const States: Story = {
  parameters: { controls: { exclude: ['state'] } },
  render: (args) => (
    <ScreenStates
      states={states.map((state) => ({ label: state, screen: <SignInPrototype {...args} state={state} /> }))}
    />
  ),
};
