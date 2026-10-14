import { Icon } from '../Icon';
import styles from './StatusMark.module.css';

export interface StatusMarkProps {
  /** Only the success tone exists: other tones need colours the system does not have yet. */
  tone?: 'success';
}

/**
 * A large mark that confirms an outcome, once per screen, above the heading.
 * Decorative: the heading next to it carries the message, inside a role="status" region.
 */
export function StatusMark({ tone = 'success' }: StatusMarkProps) {
  return (
    <div className={`${styles.statusMark} ${styles[tone]}`} aria-hidden="true">
      {/*
       * SPEC GAP: Icon comes in sm and md only, with no stroke width for size.icon-lg.
       * The check is drawn with the md stroke and sized to size.icon-lg in this component's stylesheet.
       */}
      <Icon name="check" size="md" className={styles.icon} />
    </div>
  );
}
