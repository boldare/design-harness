import type { ReactNode } from 'react';
import { Icon } from '../Icon';
import styles from './FieldMessage.module.css';

export interface FieldMessageProps {
  /** Referenced by aria-describedby on the control. */
  id: string;
  /** Says how to fix it: "Enter a valid email, like name@company.com". */
  children: ReactNode;
}

/** The validation message under a field, as specified in the TextField README. Shared by Select, Checkbox and Radio. */
export function FieldMessage({ id, children }: FieldMessageProps) {
  return (
    <p id={id} className={styles.message}>
      <span className={styles.iconLine}>
        <Icon name="alert-circle" size="sm" />
      </span>
      <span>{children}</span>
    </p>
  );
}
