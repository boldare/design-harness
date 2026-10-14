import type { Meta, StoryObj } from '@storybook/react';
import { StateMatrix } from '../../storybook/StateMatrix';
import { AccountCard } from './AccountCard';

const meta = {
  title: 'Components/AccountCard',
  component: AccountCard,
  args: { name: 'Maja Nowak', email: 'maja.nowak@company.com' },
} satisfies Meta<typeof AccountCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The README has no states table: initials from the name, given initials, and a long email truncated. */
export const States: Story = {
  render: () => (
    <StateMatrix
      rows={[
        { label: 'initials from name', cells: [<AccountCard key="a" name="Maja Nowak" email="maja.nowak@company.com" />] },
        {
          label: 'initials given',
          cells: [<AccountCard key="b" name="Ana María López" email="ana.lopez@company.com" initials="AL" />],
        },
        {
          label: 'long email',
          cells: [
            <AccountCard
              key="c"
              name="Krzysztof Wiśniewski"
              email="krzysztof.wisniewski@facilities.northern-region.company.com"
            />,
          ],
        },
      ]}
    />
  ),
};
