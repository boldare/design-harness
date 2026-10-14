import type { MouseEvent, ReactNode } from 'react';
import { Icon, type IconName } from '../Icon';
import styles from './Button.module.css';

export interface ButtonProps {
  /** Label, written as a verb: "Sign in", "Pair device", "Save changes". */
  children: ReactNode;
  variant?: 'primary' | 'quiet';
  /** Shows the spinner, sets aria-busy and ignores presses. The button stays focusable. */
  loading?: boolean;
  /** Label while loading, saying what is happening: "Signing in…". Defaults to the label. */
  loadingLabel?: ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
  onPress: () => void;
  /** Optional leading icon. The spinner takes its place while loading. */
  icon?: IconName;
  type?: 'button' | 'submit';
}

export function Button({
  children,
  variant = 'primary',
  loading = false,
  loadingLabel,
  disabled = false,
  fullWidth = true,
  onPress,
  icon,
  type = 'button',
}: ButtonProps) {
  const leadingIcon = loading ? 'spinner' : icon;
  const classes = [styles.button, styles[variant], fullWidth && styles.fullWidth, loading && styles.loading]
    .filter(Boolean)
    .join(' ');

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (loading) {
      // Repeated presses, including a second form submit, are ignored while the request runs.
      event.preventDefault();
      return;
    }
    onPress();
  }

  return (
    <button type={type} className={classes} disabled={disabled} aria-busy={loading || undefined} onClick={handleClick}>
      {leadingIcon && <Icon name={leadingIcon} size="md" />}
      <span>{loading && loadingLabel ? loadingLabel : children}</span>
    </button>
  );
}
