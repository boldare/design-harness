import type { Meta, StoryObj } from '@storybook/react';
import { StateMatrix } from '../../storybook/StateMatrix';
import { Icon, iconNames } from './Icon';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  args: { name: 'eye', size: 'md' },
  argTypes: {
    name: { control: 'select', options: iconNames },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The whole set at both sizes. The spinner turns once per duration.spin. */
export const States: Story = {
  render: () => (
    <StateMatrix
      columns={['sm', 'md']}
      rows={iconNames.map((name) => ({
        label: name,
        cells: [<Icon key="sm" name={name} size="sm" />, <Icon key="md" name={name} size="md" />],
      }))}
    />
  ),
};
