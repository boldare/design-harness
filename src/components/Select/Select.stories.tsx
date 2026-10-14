import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { FORCED_FOCUS, StateMatrix } from '../../storybook/StateMatrix';
import { Select, type SelectProps } from './Select';

const rooms = [
  { value: 'living-room', label: 'Living room' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'hallway', label: 'Hallway' },
  { value: 'office', label: 'Office' },
];

/** Keeps the chosen value in local state, so the select can be used in Storybook. */
function ControlledSelect(props: SelectProps) {
  const [value, setValue] = useState(props.value);
  return (
    <Select
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
  title: 'Components/Select',
  component: Select,
  args: { label: 'Room', options: rooms, value: '', disabled: false, onChange: fn() },
  argTypes: {
    value: { control: 'select', options: ['', ...rooms.map((room) => room.value)] },
  },
  render: (args) => <ControlledSelect key={args.value} {...args} />,
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const cell = (props: Partial<SelectProps> = {}) => (
  <ControlledSelect label="Room" options={rooms} value="" onChange={fn()} {...props} />
);

/** Every state from the README. `open` comes last so its menu has room below it. */
export const States: Story = {
  parameters: { pseudo: { focusVisible: `${FORCED_FOCUS} [role="combobox"]` } },
  render: () => (
    <StateMatrix
      rows={[
        { label: 'empty', cells: [cell()] },
        { label: 'filled', cells: [cell({ value: 'kitchen' })] },
        { label: 'focus', cells: [cell({ value: 'kitchen' })], forceFocus: true },
        { label: 'error', cells: [cell({ error: 'Choose the room this device is in' })] },
        { label: 'disabled', cells: [cell({ value: 'kitchen', disabled: true })] },
        { label: 'open', cells: [cell({ value: 'kitchen', defaultOpen: true })] },
      ]}
    />
  ),
};
