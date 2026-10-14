import type { CSSProperties, ReactNode } from 'react';
import styles from './StateMatrix.module.css';

/**
 * Cells in a row marked `forceFocus` carry this attribute. Stories point the
 * pseudo-states addon at it, so the real :focus-visible styles show without a keyboard.
 */
export const FORCED_FOCUS = '[data-forced-focus]';

export interface StateRow {
  /** State name exactly as in the component README. */
  label: string;
  cells: ReactNode[];
  forceFocus?: boolean;
}

export interface StateMatrixProps {
  /** Column headings, such as variants or Checked true / false. Leave out for a single column. */
  columns?: string[];
  rows: StateRow[];
}

/** Story helper: renders every state of a component at once, labelled with the names from its README. */
export function StateMatrix({ columns, rows }: StateMatrixProps) {
  const columnCount = columns?.length ?? 1;
  const grid = { '--columns': columnCount } as CSSProperties;

  return (
    <div className={styles.matrix} style={grid}>
      {columns && (
        <>
          <span />
          {columns.map((column) => (
            <span key={column} className={`type-caption ${styles.heading}`}>
              {column}
            </span>
          ))}
        </>
      )}
      {rows.map((row) => (
        <div key={row.label} className={styles.row}>
          <span className={`type-caption ${styles.heading}`}>{row.label}</span>
          {row.cells.map((cell, index) => (
            <div key={index} className={styles.cell} data-forced-focus={row.forceFocus || undefined}>
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
