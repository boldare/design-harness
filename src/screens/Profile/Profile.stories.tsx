import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PhoneFrame } from '../../storybook/PhoneFrame';
import { respond } from '../../storybook/prototypeServer';
import { ScreenStates } from '../../storybook/ScreenStates';
import { Profile, type ProfileProps, type ProfileState, type ProfileValues } from './Profile';

/** The prototype server: it saves every valid profile after responseDelay. Saves are also logged in the Actions panel. */
function ProfilePrototype({ onSave, ...props }: ProfileProps) {
  function save(values: ProfileValues) {
    onSave(values);
    return respond(undefined);
  }

  return <Profile {...props} onSave={save} />;
}

const states: ProfileState[] = ['default', 'error', 'saving'];

const meta = {
  title: 'Screens/Profile',
  component: Profile,
  args: { state: 'default', onSave: fn() },
  argTypes: { state: { control: 'inline-radio', options: states } },
  // A state picked in the controls opens the screen afresh.
  render: (args) => <ProfilePrototype key={args.state} {...args} />,
} satisfies Meta<typeof Profile>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The interactive screen. Make the email invalid and press Save changes: focus moves to the field. */
export const Default: Story = {
  decorators: [
    (Story) => (
      <PhoneFrame>
        <Story />
      </PhoneFrame>
    ),
  ],
};

/** The three states from the README, side by side. Each one is live and moves on as it is used. */
export const States: Story = {
  // Show the story's own code: in dev, the generated JSX source recurses through the array of screens and crashes the story.
  parameters: { controls: { exclude: ['state'] }, docs: { source: { type: 'code' } } },
  render: (args) => (
    <ScreenStates
      states={states.map((state) => ({ label: state, screen: <ProfilePrototype {...args} state={state} /> }))}
    />
  ),
};
