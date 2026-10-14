import { Icon, type IconName } from '../Icon';
import styles from './IconButton.module.css';

export interface IconButtonProps {
  icon: IconName;
  /** Becomes aria-label. For a toggle it names the action, not the state: "Show password", then "Hide password". */
  label: string;
  /** Set only for toggles; becomes aria-pressed. */
  pressed?: boolean;
  disabled?: boolean;
  onPress: () => void;
  className?: string;
}

export function IconButton({ icon, label, pressed, disabled = false, onPress, className }: IconButtonProps) {
  return (
    <button
      type="button"
      className={[styles.iconButton, className].filter(Boolean).join(' ')}
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onPress}
    >
      <Icon name={icon} size="md" />
    </button>
  );
}
