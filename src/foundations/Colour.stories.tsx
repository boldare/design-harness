import type { Meta, StoryObj } from '@storybook/react';
import styles from './Foundations.module.css';
import { aliasName, cssVariable, tokens } from './tokens';

const meta = {
  title: 'Foundations/Colour',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Semantic tokens are the ones with a value per theme; primitives are only reached through them.
const semantic = tokens.color.tokens.flatMap((token) =>
  typeof token.value === 'object' ? [{ name: token.name, usage: token.usage, themes: token.value }] : [],
);

/** Semantic colours, read from tokens/tokens.json. Switch the theme in the toolbar to see the dark values. */
export const SemanticColours: Story = {
  render: () => (
    <ul className={styles.list}>
      {semantic.map(({ name, usage, themes }) => (
        <li key={name} className={styles.item}>
          <span className={styles.swatch} style={{ background: `var(${cssVariable(name)})` }} />
          <div className={styles.details}>
            <span className={`type-body-strong ${styles.name}`}>{name}</span>
            <span className={`type-body-sm ${styles.meta}`}>
              var({cssVariable(name)}) · light {aliasName(themes.light)} · dark {aliasName(themes.dark)}
            </span>
            <p className={`type-body-sm ${styles.usage}`}>{usage}</p>
          </div>
        </li>
      ))}
    </ul>
  ),
};
