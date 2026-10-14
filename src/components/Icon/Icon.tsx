import type { ReactNode } from 'react';
import styles from './Icon.module.css';

// Paths from the original Atlas design, drawn on a 24-unit grid.
const paths = {
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  'eye-off': (
    <>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.2" />
      <path d="M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7c1.9 0 3.6-.6 5-1.5" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  'alert-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5" />
      <path d="M12 16.3v.2" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  spinner: (
    <>
      <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof paths;
export const iconNames = Object.keys(paths) as IconName[];

export type IconSize = 'sm' | 'md';

// Stroke widths from the Icon spec: 2 at size.icon-sm, 1.8 at size.icon-md.
const strokeWidth: Record<IconSize, number> = { sm: 2, md: 1.8 };

export interface IconProps {
  name: IconName;
  /** `sm` is size.icon-sm, `md` is size.icon-md. */
  size?: IconSize;
  /** Only when the icon is the only carrier of meaning. Without it the icon is decorative. */
  label?: string;
  className?: string;
}

export function Icon({ name, size = 'md', label, className }: IconProps) {
  const classes = [styles.icon, styles[size], name === 'spinner' && styles.spin, className].filter(Boolean).join(' ');

  return (
    <svg
      className={classes}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth[size]}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      {paths[name]}
    </svg>
  );
}
