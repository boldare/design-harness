import { useId } from 'react';
import { FieldMessage } from '../TextField/FieldMessage';
import styles from './Radio.module.css';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioProps extends RadioOption {
  /** Shared by every option in the group, so arrow keys move between them. */
  name: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/** One option row. RadioGroup renders these; use Radio alone only inside your own fieldset. */
export function Radio({ name, value, label, description, checked, onChange, disabled = false }: RadioProps) {
  const inputId = useId();
  const labelId = `${inputId}-label`;
  const descriptionId = `${inputId}-description`;

  return (
    <label className={[styles.row, disabled && styles.disabled].filter(Boolean).join(' ')}>
      <span className={styles.control}>
        <input
          id={inputId}
          className={styles.input}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          aria-labelledby={labelId}
          aria-describedby={description ? descriptionId : undefined}
          onChange={() => onChange(value)}
        />
        <span className={styles.circle} aria-hidden="true">
          <span className={styles.dot} />
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
  );
}

export interface RadioGroupProps {
  legend: string;
  /** 2 to 4 options. More than that is a Select. */
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  name?: string;
}

export function RadioGroup({ legend, options, value, onChange, error, disabled = false, name }: RadioGroupProps) {
  const generatedName = useId();
  const groupName = name ?? generatedName;
  const messageId = `${groupName}-message`;

  return (
    // A disabled fieldset disables every option, and the opacity is applied once, here.
    <fieldset
      className={[styles.group, disabled && styles.disabled].filter(Boolean).join(' ')}
      disabled={disabled}
      aria-describedby={error ? messageId : undefined}
    >
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.options}>
        {options.map((option) => (
          <Radio
            key={option.value}
            {...option}
            name={groupName}
            checked={option.value === value}
            onChange={onChange}
          />
        ))}
      </div>
      {error && <FieldMessage id={messageId}>{error}</FieldMessage>}
    </fieldset>
  );
}
