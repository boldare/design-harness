import type { ReactNode } from 'react';
import { PhoneFrame } from './PhoneFrame';
import styles from './ScreenStates.module.css';

export interface ScreenState {
  /** State name exactly as in the screen README. */
  label: string;
  screen: ReactNode;
}

/** Story helper: every state of a screen side by side, each in a phone frame and labelled with its README name. */
export function ScreenStates({ states }: { states: ScreenState[] }) {
  return (
    <div className={styles.states}>
      {states.map(({ label, screen }) => (
        <div key={label} className={styles.state}>
          <span className={`type-caption ${styles.label}`}>{label}</span>
          <PhoneFrame>{screen}</PhoneFrame>
        </div>
      ))}
    </div>
  );
}
