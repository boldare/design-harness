import type { Meta, StoryObj } from '@storybook/react';
import styles from './Foundations.module.css';
import { tokens } from './tokens';

const meta = {
  title: 'Foundations/Type',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample copy from Atlas screens. Styles come from tokens/tokens.json; a new style shows its own name.
const samples: Record<string, string> = {
  title: 'Sign in to Atlas',
  heading: 'Device settings',
  body: 'Pair a device to see its readings here.',
  'body-strong': 'Maja Nowak',
  label: 'Email',
  'body-sm': 'Enter a valid email, like name@company.com',
  caption: 'Signed in as',
  button: 'Sign in',
  input: 'maja.nowak@company.com',
};

type Style = (typeof tokens.type.groups)[number]['styles'][number];

const specOf = (style: Style) =>
  [style.fontSize, style.lineHeight, style.fontWeight, 'letterSpacing' in style ? style.letterSpacing : null]
    .filter((value) => value !== null)
    .join(' / ');

/** Every type style, grouped as in Figma (Headings, Text, Controls). Each sample uses its .type-<style> class. */
export const TypeStyles: Story = {
  render: () => (
    <div>
      {tokens.type.groups.map((group) => (
        <section key={group.name} className={styles.group}>
          <h2 className={`type-caption ${styles.groupTitle}`}>{group.name}</h2>
          <ul className={styles.list}>
            {group.styles.map((style) => (
              <li key={style.name} className={styles.details}>
                <p className={`type-${style.name} ${styles.typeSample}`}>{samples[style.name] ?? style.name}</p>
                <span className={`type-body-sm ${styles.meta}`}>
                  {group.name}/{style.name} · {specOf(style)}
                </span>
                <p className={`type-body-sm ${styles.usage}`}>{style.usage}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  ),
};
