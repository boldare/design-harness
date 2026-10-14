import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { FORCED_FOCUS, StateMatrix } from '../../storybook/StateMatrix';
import { Switch, type SwitchProps } from './Switch';

/** Keeps the checked state locally, so the switch can be used in Storybook. */
function ControlledSwitch(props: SwitchProps) {
  const [checked, setChecked] = useState(props.checked);
  return (
    <Switch
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
  title: 'Components/Switch',
  component: Switch,
  args: {
    label: 'Vibration',
    description: 'The device buzzes when it needs your attention',
    checked: true,
    disabled: false,
    onChange: fn(),
  },
  render: (args) => <ControlledSwitch key={String(args.checked)} {...args} />,
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const row = (label: string, disabled: boolean, forceFocus = false) => ({
  label,
  forceFocus,
  cells: [false, true].map((checked) => (
    <ControlledSwitch
      key={String(checked)}
      label="Child lock"
      description="Buttons on the device stop responding"
      checked={checked}
      disabled={disabled}
      onChange={fn()}
    />
  )),
});

/** Checked × State, as in the README. */
export const States: Story = {
  parameters: { pseudo: { focusVisible: `${FORCED_FOCUS} input` } },
  render: () => (
    <StateMatrix
      columns={['checked: false', 'checked: true']}
      rows={[row('default', false), row('focus', false, true), row('disabled', true)]}
    />
  ),
};
