import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { IconButton } from '../IconButton';
import { FieldMessage } from './FieldMessage';
import styles from './TextField.module.css';

export interface TextFieldProps {
  /** Always visible. The placeholder never replaces it. */
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  /** Called when the field loses focus, for values saved on blur. */
  onBlur?: () => void;
  /** Shows the format, such as "name@company.com". */
  placeholder?: string;
  /** Says how to fix the value. Turns the field into its error state. */
  error?: string;
  disabled?: boolean;
  /** A Link on the right of the label row, such as "Forgot password?". */
  labelAction?: ReactNode;
  /** Lets keyboards and password managers help: "email", "current-password". */
  autoComplete?: string;
  name?: string;
  id?: string;
}

export function TextField({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  disabled = false,
  labelAction,
  autoComplete,
  name,
  id,
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = type === 'password';

  // A disabled field takes no interaction, its label action included (React 18 has no inert prop yet).
  const labelActionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (labelActionRef.current) labelActionRef.current.inert = disabled;
  }, [disabled]);

  return (
    <div className={[styles.textField, disabled && styles.disabled].filter(Boolean).join(' ')}>
      <div className={styles.labelRow}>
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
        {labelAction && <div ref={labelActionRef}>{labelAction}</div>}
      </div>

      <div className={[styles.control, isPassword && styles.withToggle].filter(Boolean).join(' ')}>
        <input
          id={inputId}
          className={styles.input}
          type={isPassword && passwordVisible ? 'text' : type}
          name={name}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? messageId : undefined}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
        />
        {isPassword && (
          <IconButton
            className={styles.toggle}
            icon={passwordVisible ? 'eye-off' : 'eye'}
            label={passwordVisible ? 'Hide password' : 'Show password'}
            disabled={disabled}
            onPress={() => setPasswordVisible(!passwordVisible)}
          />
        )}
      </div>

      {error && <FieldMessage id={messageId}>{error}</FieldMessage>}
    </div>
  );
}
