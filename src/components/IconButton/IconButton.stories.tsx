import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { FORCED_FOCUS, StateMatrix } from '../../storybook/StateMatrix';
import { iconNames } from '../Icon';
import { IconButton, type IconButtonProps } from './IconButton';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  args: { icon: 'eye', label: 'Show password', disabled: false, onPress: fn() },
  argTypes: { icon: { control: 'select', options: iconNames } },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A toggle with a fixed label: aria-pressed carries the state. The password toggle in TextField changes its label instead. */
export const PasswordToggle: Story = {
  render: function Render(args: IconButtonProps) {
    const [visible, setVisible] = useState(false);
    return (
      <IconButton
        {...args}
        icon={visible ? 'eye-off' : 'eye'}
        label="Show password"
        pressed={visible}
        onPress={() => setVisible(!visible)}
      />
    );
  },
};

const cell = (props: Partial<IconButtonProps> = {}) => (
  <IconButton icon="eye" label="Show password" onPress={fn()} {...props} />
);

export const States: Story = {
  parameters: { pseudo: { focusVisible: `${FORCED_FOCUS} button` } },
  render: () => (
    <StateMatrix
      rows={[
        { label: 'default', cells: [cell()] },
        { label: 'focus', cells: [cell()], forceFocus: true },
        { label: 'disabled', cells: [cell({ disabled: true })] },
      ]}
    />
  ),
};
