import { useId } from 'react';
import { Icon } from '../Icon';
import { FieldMessage } from '../TextField/FieldMessage';
import styles from './Checkbox.module.css';

export interface CheckboxProps {
  /** The thing being agreed to: "Share usage data with Atlas". */
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** For a required consent, shown only after submit: say what happens without it. */
  error?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
}

export function Checkbox({ label, description, checked, onChange, error, disabled = false, name, id }: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = `${inputId}-label`;
  const descriptionId = `${inputId}-description`;
  const messageId = `${inputId}-message`;
  const describedBy = [description && descriptionId, error && messageId].filter(Boolean).join(' ');

  return (
    <div className={[styles.checkbox, disabled && styles.disabled].filter(Boolean).join(' ')}>
      {/* The whole row is the target. The accessible name is the label alone; the description is read after it. */}
      <label className={styles.row}>
        <span className={styles.control}>
          <input
            id={inputId}
            className={styles.input}
            type="checkbox"
            name={name}
            checked={checked}
            disabled={disabled}
            aria-labelledby={labelId}
            aria-describedby={describedBy || undefined}
            aria-invalid={error ? true : undefined}
            onChange={(event) => onChange(event.target.checked)}
          />
          <span className={styles.box} aria-hidden="true">
            <Icon name="check" size="sm" className={styles.tick} />
          </span>
        </span>
        <span className={styles.text}>
          <span id={labelId} className={styles.label}>
            {label}
          </span>
          {description && (
            <span id={descriptionId} className={styles.description}>
              {description}
            </span>
          )}
        </span>
      </label>

      {error && <FieldMessage id={messageId}>{error}</FieldMessage>}
    </div>
  );
}
