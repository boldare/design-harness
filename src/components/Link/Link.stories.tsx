import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FORCED_FOCUS, StateMatrix } from '../../storybook/StateMatrix';
import { Link, type LinkProps } from './Link';

const meta = {
  title: 'Components/Link',
  component: Link,
  args: { children: 'Forgot password?', href: '#forgot-password', tone: 'accent', size: 'body' },
  argTypes: {
    tone: { control: 'inline-radio', options: ['accent', 'strong', 'subtle'] },
    size: { control: 'inline-radio', options: ['body', 'sm'] },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** `accent` inside forms, `strong` for the call to action in a sentence, `subtle` for header utilities. */
const appearances: { column: string; props: LinkProps }[] = [
  { column: 'accent / body', props: { tone: 'accent', size: 'body', href: '#forgot-password', children: 'Forgot password?' } },
  { column: 'accent / sm', props: { tone: 'accent', size: 'sm', href: '#forgot-password', children: 'Forgot password?' } },
  { column: 'strong / body', props: { tone: 'strong', size: 'body', href: '#sign-up', children: 'Create an account' } },
  { column: 'subtle / body', props: { tone: 'subtle', size: 'body', onPress: fn(), children: 'Help' } },
  { column: 'subtle / sm', props: { tone: 'subtle', size: 'sm', onPress: fn(), children: 'Help' } },
];

const row = (label: string, forceFocus = false) => ({
  label,
  forceFocus,
  cells: appearances.map(({ column, props }) => <Link key={column} {...props} />),
});

/** Tone × Size × State. `strong` exists only at body size. */
export const States: Story = {
  parameters: { pseudo: { focusVisible: [`${FORCED_FOCUS} a`, `${FORCED_FOCUS} button`] } },
  render: () => (
    <StateMatrix columns={appearances.map(({ column }) => column)} rows={[row('default'), row('focus', true)]} />
  ),
};

/** The touch target grows to size.target-min without changing the line height of the sentence. */
export const InASentence: Story = {
  render: () => (
    <p className="type-body">
      New to Atlas?{' '}
      <Link tone="strong" href="#sign-up">
        Create an account
      </Link>
    </p>
  ),
};
