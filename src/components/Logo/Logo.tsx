import styles from './Logo.module.css';

export interface LogoProps {
  /** Shows "Atlas" next to the mark. Without it, the mark alone carries the name. */
  wordmark?: boolean;
}

/** The Atlas mark and wordmark, for the header of entry screens. Place it on surface.page only. */
export function Logo({ wordmark = true }: LogoProps) {
  return (
    <span className={styles.logo}>
      {/*
       * The mark is an asset: its geometry is fixed like an icon path, its colours come from tokens.
       * Spec: no token gives the rendered size of the mark. It is drawn at its own 28-unit size.
       */}
      <svg
        className={styles.mark}
        viewBox="0 0 28 28"
        width="28"
        height="28"
        focusable="false"
        {...(wordmark ? { 'aria-hidden': true } : { role: 'img', 'aria-label': 'Atlas' })}
      >
        <rect className={styles.square} width="28" height="28" rx="8" />
        <circle className={styles.dot} cx="14" cy="14" r="5" />
      </svg>
      {wordmark && <span className={styles.wordmark}>Atlas</span>}
    </span>
  );
}
