import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { Icon } from '../Icon';
import { FieldMessage } from '../TextField/FieldMessage';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label: string;
  /** Short lists, up to about 7 options. Longer lists use the platform picker. */
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Says how to fix the choice. Turns the field into its error state. */
  error?: string;
  disabled?: boolean;
  /** Opens the menu on first render without moving focus. For previews and tests. */
  defaultOpen?: boolean;
  id?: string;
}

/**
 * A select-only combobox. While the menu is open, focus moves through the options,
 * so the active option shows the focus ring; Enter and Escape return focus to the field.
 */
export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = 'Choose…',
  error,
  disabled = false,
  defaultOpen = false,
  id,
}: SelectProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const labelId = `${fieldId}-label`;
  const menuId = `${fieldId}-menu`;
  const messageId = `${fieldId}-message`;

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex];

  const [open, setOpen] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState(Math.max(selectedIndex, 0));
  const rootRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  // True once the person opened the menu. A menu opened by defaultOpen does not take focus.
  const focusOptions = useRef(false);

  useEffect(() => {
    if (open && focusOptions.current) optionRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  // A press anywhere outside closes the menu.
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);

  function openMenu(index: number) {
    focusOptions.current = true;
    setActiveIndex(index);
    setOpen(true);
  }

  function closeMenu({ returnFocus }: { returnFocus: boolean }) {
    focusOptions.current = false;
    setOpen(false);
    if (returnFocus) fieldRef.current?.focus();
  }

  function choose(index: number) {
    onChange(options[index].value);
    closeMenu({ returnFocus: true });
  }

  // Enter and Space reach onClick, because the field is a button.
  function handleFieldKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const fallback = event.key === 'ArrowDown' ? 0 : options.length - 1;
      openMenu(selectedIndex >= 0 ? selectedIndex : fallback);
    }
  }

  function handleMenuKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      // Hand focus back to the field; the browser's Tab then moves on from there, forwards or backwards.
      closeMenu({ returnFocus: true });
      return;
    }
    const last = options.length - 1;
    const moves: Record<string, () => void> = {
      ArrowDown: () => setActiveIndex(Math.min(activeIndex + 1, last)),
      ArrowUp: () => setActiveIndex(Math.max(activeIndex - 1, 0)),
      Home: () => setActiveIndex(0),
      End: () => setActiveIndex(last),
      Enter: () => choose(activeIndex),
      ' ': () => choose(activeIndex),
      Escape: () => closeMenu({ returnFocus: true }),
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      move();
    }
  }

  return (
    <div
      ref={rootRef}
      className={[styles.select, disabled && styles.disabled].filter(Boolean).join(' ')}
      // Focus leaving the select by any other route (a click elsewhere, assistive tech) closes the menu.
      onBlur={(event) => {
        if (open && !rootRef.current?.contains(event.relatedTarget)) closeMenu({ returnFocus: false });
      }}
    >
      <label
        id={labelId}
        className={styles.label}
        htmlFor={fieldId}
        // Like a native select: the label focuses the field but does not open it.
        onClick={(event) => {
          event.preventDefault();
          fieldRef.current?.focus();
        }}
      >
        {label}
      </label>

      <div className={styles.control}>
        <button
          ref={fieldRef}
          id={fieldId}
          type="button"
          role="combobox"
          className={styles.field}
          aria-labelledby={labelId}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? messageId : undefined}
          disabled={disabled}
          onClick={() => (open ? closeMenu({ returnFocus: false }) : openMenu(Math.max(selectedIndex, 0)))}
          onKeyDown={handleFieldKeyDown}
        >
          <span className={selected ? styles.value : `${styles.value} ${styles.placeholder}`}>
            {selected ? selected.label : placeholder}
          </span>
          <Icon name="chevron-down" size="md" className={styles.chevron} />
        </button>

        {open && (
          <ul id={menuId} role="listbox" aria-labelledby={labelId} className={styles.menu} onKeyDown={handleMenuKeyDown}>
            {options.map((option, index) => {
              const isSelected = index === selectedIndex;
              return (
                <li
                  key={option.value}
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={-1}
                  className={isSelected ? `${styles.option} ${styles.selected}` : styles.option}
                  onClick={() => choose(index)}
                >
                  <span>{option.label}</span>
                  {isSelected && <Icon name="check" size="md" />}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {error && <FieldMessage id={messageId}>{error}</FieldMessage>}
    </div>
  );
}
