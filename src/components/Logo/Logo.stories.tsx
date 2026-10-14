import type { Meta, StoryObj } from '@storybook/react';
import { StateMatrix } from '../../storybook/StateMatrix';
import { Logo } from './Logo';

const meta = {
  title: 'Components/Logo',
  component: Logo,
  args: { wordmark: true },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The README has no states table: the mark with and without the wordmark. Without it, the mark is labelled "Atlas". */
export const States: Story = {
  render: () => (
    <StateMatrix
      rows={[
        { label: 'wordmark: true', cells: [<Logo key="wordmark" />] },
        { label: 'wordmark: false', cells: [<Logo key="mark" wordmark={false} />] },
      ]}
    />
  ),
};
