import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { FORCED_FOCUS, StateMatrix } from '../../storybook/StateMatrix';
import { Checkbox, type CheckboxProps } from './Checkbox';

/** Keeps the checked state locally, so the checkbox can be used in Storybook. */
function ControlledCheckbox(props: CheckboxProps) {
  const [checked, setChecked] = useState(props.checked);
  return (
    <Checkbox
      {...props}
      checked={checked}
      onChange={(next) => {
        setChecked(next);
        props.onChange(next);
      }}
    />
  );
}

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: {
    label: 'Share usage data with Atlas',
    description: 'Anonymous readings help us improve pairing. You can change this later in settings.',
    checked: false,
    disabled: false,
    onChange: fn(),
  },
  render: (args) => <ControlledCheckbox key={String(args.checked)} {...args} />,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const consent = {
  label: 'I accept the Atlas terms of use',
  error: 'Atlas can’t create your account without your agreement',
};

const row = (label: string, props: Partial<CheckboxProps>, forceFocus = false) => ({
  label,
  forceFocus,
  cells: [false, true].map((checked) => (
    <ControlledCheckbox key={String(checked)} label={consent.label} checked={checked} onChange={fn()} {...props} />
  )),
});

/** Checked × State, as in the README. */
export const States: Story = {
  parameters: { pseudo: { focusVisible: `${FORCED_FOCUS} input` } },
  render: () => (
    <StateMatrix
      columns={['checked: false', 'checked: true']}
      rows={[
        row('default', {}),
        row('focus', {}, true),
        row('error', { error: consent.error }),
        row('disabled', { disabled: true }),
      ]}
    />
  ),
};
