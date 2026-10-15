import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PhoneFrame } from '../../storybook/PhoneFrame';
import { ScreenStates } from '../../storybook/ScreenStates';
import { DeviceSettings, type DeviceSettingsState } from './DeviceSettings';

const states: DeviceSettingsState[] = ['connected', 'disconnected'];

const meta = {
  title: 'Screens/DeviceSettings',
  component: DeviceSettings,
  args: { state: 'connected', onSaveName: fn() },
  argTypes: { state: { control: 'inline-radio', options: states } },
} satisfies Meta<typeof DeviceSettings>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The interactive screen: switches and radios apply at once, the name is saved when the field loses focus.
 * Pick disconnected in the controls: the controls keep their last values and lock.
 */
export const Default: Story = {
  decorators: [
    (Story) => (
      <PhoneFrame>
        <Story />
      </PhoneFrame>
    ),
  ],
};

/** The two states from the README, side by side. */
export const States: Story = {
  // Show the story's own code: in dev, the generated JSX source recurses through the array of screens and crashes the story.
  parameters: { controls: { exclude: ['state'] }, docs: { source: { type: 'code' } } },
  render: (args) => (
    <ScreenStates
      states={states.map((state) => ({ label: state, screen: <DeviceSettings {...args} state={state} /> }))}
    />
  ),
};
