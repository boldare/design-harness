import type { ReactNode } from 'react';
import styles from './Link.module.css';

/** A real <a href> for navigation, or a <button> styled as a link for in-page actions. */
type LinkTarget = { href: string; onPress?: never } | { onPress: () => void; href?: never };

/** `strong` uses Text/body-strong, so it exists only at body size (as in the Figma library). */
type LinkAppearance = { tone?: 'accent' | 'subtle'; size?: 'body' | 'sm' } | { tone: 'strong'; size?: 'body' };

export type LinkProps = LinkTarget &
  LinkAppearance & {
    /** Makes sense on its own: "Forgot password?", never "click here". */
    children: ReactNode;
  };

export function Link(props: LinkProps) {
  const { children, tone = 'accent', size = 'body' } = props;
  const className = [styles.link, styles[size], styles[tone]].join(' ');

  if (props.href !== undefined) {
    return (
      <a className={className} href={props.href}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={className} onClick={props.onPress}>
      {children}
    </button>
  );
}
