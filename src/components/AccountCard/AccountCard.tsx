import styles from './AccountCard.module.css';

export interface AccountCardProps {
  name: string;
  /** Shown on one line and truncated with an ellipsis; the full value stays in the accessible text. */
  email: string;
  /** Defaults to the first letters of the first two words of `name`. */
  initials?: string;
}

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

/** Shows who is signed in. Not a button: put actions next to it. */
export function AccountCard({ name, email, initials = initialsOf(name) }: AccountCardProps) {
  return (
    <div className={styles.accountCard}>
      <span className={styles.avatar} aria-hidden="true">
        {initials}
      </span>
      <div className={styles.text}>
        <span className={styles.name}>{name}</span>
        <span className={styles.email}>{email}</span>
      </div>
    </div>
  );
}
