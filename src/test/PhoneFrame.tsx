import type { CSSProperties, ReactNode } from 'react';
import styles from './PhoneFrame.module.css';

/**
 * The phone mockup from screens/README.md: 390 wide and at least one screen (844) tall; longer screens grow.
 * These are mockup dimensions, not design tokens, so they live in the tests and never in a screen stylesheet.
 */
const phone: CSSProperties = { width: 390, minHeight: 844 };

/** Test helper: one screen in a phone frame. Pass it as the `wrapper` of render, so the test is named after the screen. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className={styles.frame} style={phone}>
      {children}
    </div>
  );
}
