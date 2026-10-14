import type { Meta, StoryObj } from '@storybook/react';
import styles from './Foundations.module.css';
import { cssVariable, tokens } from './tokens';

const meta = {
  title: 'Foundations/Spacing',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The spacing scale on a 4 px grid, read from tokens/tokens.json. Each bar is as wide as its token. */
export const SpacingScale: Story = {
  render: () => (
    <ul className={styles.list}>
      {tokens.spacing.tokens.map(({ name, value, usage }) => (
        <li key={name} className={styles.details}>
          <span className={`type-body-strong ${styles.name}`}>{name}</span>
          <span className={styles.bar} style={{ width: `var(${cssVariable(name)})` }} />
          <span className={`type-body-sm ${styles.meta}`}>
            var({cssVariable(name)}) · {value}
          </span>
          <p className={`type-body-sm ${styles.usage}`}>{usage}</p>
        </li>
      ))}
    </ul>
  ),
};
