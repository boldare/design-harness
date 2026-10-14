import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FORCED_FOCUS, StateMatrix } from '../../storybook/StateMatrix';
import { Button, type ButtonProps } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Sign in',
    loadingLabel: 'Signing in…',
    variant: 'primary',
    loading: false,
    disabled: false,
    fullWidth: true,
    onPress: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'quiet'] },
    icon: { control: 'select', options: [undefined, 'check', 'chevron-down'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Primary says what is happening while loading; quiet keeps its label (README states table).
const variants: { variant: ButtonProps['variant']; label: string; loadingLabel?: string }[] = [
  { variant: 'primary', label: 'Sign in', loadingLabel: 'Signing in…' },
  { variant: 'quiet', label: 'Use a different account' },
];

const row = (label: string, props: Partial<ButtonProps>, forceFocus = false) => ({
  label,
  forceFocus,
  cells: variants.map(({ variant, label: text, loadingLabel }) => (
    <Button key={variant} variant={variant} fullWidth={false} loadingLabel={loadingLabel} onPress={fn()} {...props}>
      {text}
    </Button>
  )),
});

/** Variant × State, as in the README. */
export const States: Story = {
  parameters: { pseudo: { focusVisible: `${FORCED_FOCUS} button` } },
  render: () => (
    <StateMatrix
      columns={['primary', 'quiet']}
      rows={[
        row('default', {}),
        row('focus', {}, true),
        row('disabled', { disabled: true }),
        row('loading', { loading: true }),
      ]}
    />
  ),
};
