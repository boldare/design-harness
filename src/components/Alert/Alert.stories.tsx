import type { Meta, StoryObj } from '@storybook/react';
import { StateMatrix } from '../../storybook/StateMatrix';
import { Alert } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  args: {
    tone: 'danger',
    title: 'Email or password is incorrect',
    description: 'Check your details and try again, or reset your password.',
  },
  argTypes: { tone: { control: false } },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The README has no states table: the Alert is shown with and without its description. */
export const States: Story = {
  render: () => (
    <StateMatrix
      rows={[
        {
          label: 'title and description',
          cells: [
            <Alert
              key="full"
              title="Email or password is incorrect"
              description="Check your details and try again, or reset your password."
            />,
          ],
        },
        { label: 'title only', cells: [<Alert key="title" title="The device didn’t respond. Try again." />] },
      ]}
    />
  ),
};
