import { useId, type CSSProperties } from 'react';
import styles from './Slider.module.css';

export interface SliderProps {
  label: string;
  /** Applied as it changes, without a Save button. If the change fails, return to the previous value and say why in an Alert. */
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** The text shown next to the label and announced, in the unit people know: "50%". */
  formatValue?: (value: number) => string;
  disabled?: boolean;
  name?: string;
  id?: string;
}

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  formatValue = String,
  disabled = false,
  name,
  id,
}: SliderProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const valueText = formatValue(value);
  // Runtime value: how far along the track the value lies, from 0 to 1. It places the thumb and ends the filled part.
  const fill = { '--rt-fill': (value - min) / (max - min) } as CSSProperties;

  return (
    <div className={[styles.slider, disabled && styles.disabled].filter(Boolean).join(' ')}>
      {/* The value is announced through aria-valuetext on the input, so it is hidden here and the name stays the label. */}
      <label htmlFor={inputId} className={styles.labelRow}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value} aria-hidden="true">
          {valueText}
        </span>
      </label>
      {/* The whole track area is the target. */}
      <div className={styles.area} style={fill}>
        <input
          id={inputId}
          className={styles.input}
          type="range"
          name={name}
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-valuetext={valueText}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <span className={styles.track} aria-hidden="true" />
        <span className={styles.thumb} aria-hidden="true" />
      </div>
    </div>
  );
}
