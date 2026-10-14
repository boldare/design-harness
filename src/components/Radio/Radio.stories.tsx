import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { FORCED_FOCUS, StateMatrix } from '../../storybook/StateMatrix';
import { Radio, RadioGroup, type RadioGroupProps } from './Radio';

const notifications = [
  { value: 'all', label: 'All activity', description: 'Every reading and every alert' },
  { value: 'alerts', label: 'Alerts only', description: 'Only when something needs your attention' },
  { value: 'none', label: 'None' },
];

/** Keeps the chosen value locally, so the group can be used in Storybook. */
function ControlledRadioGroup(props: RadioGroupProps) {
  const [value, setValue] = useState(props.value);
  return (
    <RadioGroup
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
  title: 'Components/Radio',
  component: RadioGroup,
  args: { legend: 'Notifications', options: notifications, value: 'alerts', disabled: false, onChange: fn() },
  argTypes: {
    value: { control: 'inline-radio', options: notifications.map((option) => option.value) },
  },
  render: (args) => <ControlledRadioGroup key={args.value} {...args} />,
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const row = (label: string, disabled: boolean, forceFocus = false) => ({
  label,
  forceFocus,
  cells: [false, true].map((checked) => (
    <Radio
      key={String(checked)}
      name={`states-${label}-${checked}`}
      value="alerts"
      label="Alerts only"
      description="Only when something needs your attention"
      checked={checked}
      disabled={disabled}
      onChange={fn()}
    />
  )),
});

/** Selected × State, as in the README, one option row per cell. */
export const States: Story = {
  parameters: { pseudo: { focusVisible: `${FORCED_FOCUS} input` } },
  render: () => (
    <StateMatrix
      columns={['selected: false', 'selected: true']}
      rows={[row('default', false), row('focus', false, true), row('disabled', true)]}
    />
  ),
};

/** The whole group disabled: the fieldset disables every option. */
export const DisabledGroup: Story = {
  args: { disabled: true },
};
