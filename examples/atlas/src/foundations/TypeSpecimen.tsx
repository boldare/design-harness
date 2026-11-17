import styles from './Foundations.module.css';
import { tokens } from './tokens';
import { samples } from './type-samples';

type Style = (typeof tokens.type.groups)[number]['styles'][number];

const specOf = (style: Style) =>
  [style.fontSize, style.lineHeight, style.fontWeight, 'letterSpacing' in style ? style.letterSpacing : null]
    .filter((value) => value !== null)
    .join(' / ');

/**
 * Every type style, grouped as in Figma (Headings, Text, Controls), each sample in its .type-<style> class.
 * Colour, spacing, radius and shadow tokens need no specimen: Foundations in the viewer reads them from tokens.css.
 */
export function TypeSpecimen() {
  return (
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
  );
}
