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
      <Icon name="check" size="lg" />
    </div>
  );
}
