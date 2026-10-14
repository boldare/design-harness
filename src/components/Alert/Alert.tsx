import { Icon } from '../Icon';
import styles from './Alert.module.css';

export interface AlertProps {
  /** Only the danger tone exists; success is shown with the success mark (see docs/foundations.md). */
  tone?: 'danger';
  /** What happened: "Email or password is incorrect". */
  title: string;
  /** What to do: "Check your details and try again, or reset your password." */
  description?: string;
}

/** A message about the whole form or screen. role="alert" makes screen readers announce it when it appears. */
export function Alert({ tone = 'danger', title, description }: AlertProps) {
  return (
    <div role="alert" className={`${styles.alert} ${styles[tone]}`}>
      <span className={styles.iconLine}>
        <Icon name="alert-circle" size="md" />
      </span>
      <div className={styles.text}>
        <p className={styles.title}>{title}</p>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  );
}
