/// <reference path="./system.d.ts" />
import type { ReactNode } from 'react';
import { frame } from 'virtual:design-harness/system';
import styles from './PhoneFrame.module.css';

/**
 * The screen mockup from `frame` in the manifest: its width and at least its height. Longer screens grow.
 * These are mockup dimensions, not design tokens, so they live in the tests and never in a screen stylesheet.
 */

/** Test helper: one screen in a phone frame. Pass it as the `wrapper` of render, so the test is named after the screen. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  // Here and not at import, because the component tests of a system without screens import the same helpers.
  if (!frame) throw new Error('PhoneFrame needs `frame` in design-harness.yaml. A system without a frame has no screens.');
  return (
    <div className={styles.frame} style={{ width: frame.width, minHeight: frame.height }}>
      {children}
    </div>
  );
}
