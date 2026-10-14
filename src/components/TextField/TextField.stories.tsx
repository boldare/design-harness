import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { FORCED_FOCUS, StateMatrix } from '../../storybook/StateMatrix';
import { Link } from '../Link';
import { TextField, type TextFieldProps } from './TextField';

/** Keeps the typed value in local state, so the field can be used in Storybook. */
function ControlledTextField(props: TextFieldProps) {
  const [value, setValue] = useState(props.value);
  return (
    <TextField
      {...props}
      value={value}
      onChange={(next) => {
        setValue(next);
        props.onChange(next);
      }}
    />
  );
}

const meta = {
  title: 'Components/TextField',
  component: TextField,
  args: {
    label: 'Email',
    type: 'email',
    value: '',
    placeholder: 'name@company.com',
    autoComplete: 'email',
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['text', 'email', 'password'] },
    labelAction: { control: false },
  },
  render: (args) => <ControlledTextField key={`${args.type}-${args.value}`} {...args} />,
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: undefined,
    autoComplete: 'current-password',
    labelAction: (
      <Link size="sm" href="#forgot-password">
        Forgot password?
      </Link>
    ),
  },
};

// One column per type, with copy from Atlas sign-in and device settings.
const fields: { column: string; props: TextFieldProps; filled: string; error: { value: string; message: string } }[] = [
  {
    column: 'text',
    props: { label: 'Device name', type: 'text', value: '', placeholder: 'Kitchen sensor', onChange: fn() },
    filled: 'Hallway thermostat',
    error: { value: '', message: 'Give the device a name, like Kitchen sensor' },
  },
  {
    column: 'email',
    props: { label: 'Email', type: 'email', value: '', placeholder: 'name@company.com', autoComplete: 'email', onChange: fn() },
    filled: 'maja.nowak@company.com',
    error: { value: 'maja.nowak@company', message: 'Enter a valid email, like name@company.com' },
  },
  {
    column: 'password',
    props: {
      label: 'Password',
      type: 'password',
      value: '',
      autoComplete: 'current-password',
      labelAction: (
        <Link size="sm" href="#forgot-password">
          Forgot password?
        </Link>
      ),
      onChange: fn(),
    },
    filled: 'atlas-demo-2026',
    error: { value: '', message: 'Enter your password to sign in' },
  },
];

const row = (label: string, cell: (field: (typeof fields)[number]) => Partial<TextFieldProps>, forceFocus = false) => ({
  label,
  forceFocus,
  cells: fields.map((field) => <ControlledTextField key={field.column} {...field.props} {...cell(field)} />),
});

/** Type × State, as in the README. */
export const States: Story = {
  parameters: { pseudo: { focusVisible: `${FORCED_FOCUS} input` } },
  render: () => (
    <StateMatrix
      columns={fields.map(({ column }) => column)}
      rows={[
        row('empty', () => ({})),
        row('filled', ({ filled }) => ({ value: filled })),
        row('focus', ({ filled }) => ({ value: filled }), true),
        row('error', ({ error }) => ({ value: error.value, error: error.message })),
        row('disabled', ({ filled }) => ({ value: filled, disabled: true })),
      ]}
    />
  ),
};
