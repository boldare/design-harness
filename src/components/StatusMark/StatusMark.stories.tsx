import type { Meta, StoryObj } from '@storybook/react';
import { StateMatrix } from '../../storybook/StateMatrix';
import { StatusMark } from './StatusMark';

const meta = {
  title: 'Components/StatusMark',
  component: StatusMark,
  args: { tone: 'success' },
  argTypes: { tone: { control: false } },
} satisfies Meta<typeof StatusMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The README has no states table: the one tone that exists, success. */
export const States: Story = {
  render: () => <StateMatrix rows={[{ label: 'success', cells: [<StatusMark key="success" tone="success" />] }]} />,
};
