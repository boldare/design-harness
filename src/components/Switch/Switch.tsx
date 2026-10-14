import { useId } from 'react';
import styles from './Switch.module.css';

export interface SwitchProps {
  label: string;
  description?: string;
  /** Applied immediately, without a Save button. If the change fails, revert it and say why next to it. */
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  id?: string;
}

export function Switch({ label, description, checked, onChange, disabled = false, name, id }: SwitchProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = `${inputId}-label`;
  const descriptionId = `${inputId}-description`;

  return (
    // The whole row is the target.
    <label className={[styles.switch, disabled && styles.disabled].filter(Boolean).join(' ')}>
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
      <span className={styles.control}>
        {/* A native checkbox with role="switch": the browser exposes its checked state as aria-checked. */}
        <input
          id={inputId}
          className={styles.input}
          type="checkbox"
          role="switch"
          name={name}
          checked={checked}
          disabled={disabled}
          aria-labelledby={labelId}
          aria-describedby={description ? descriptionId : undefined}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className={styles.track} aria-hidden="true">
          <span className={styles.thumb} />
        </span>
      </span>
    </label>
  );
}
