import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { expectAccessible } from '../../test/a11y';
import layout from '../../test/layout.module.css';
import { Link, type LinkProps } from './Link';

// Tone × Size, as in the README: `accent` inside forms, `strong` for the call to action in a sentence,
// `subtle` for header utilities. `strong` exists only at body size.
const appearances: LinkProps[] = [
  { tone: 'accent', size: 'body', href: '#forgot-password', children: 'Forgot password?' },
  { tone: 'accent', size: 'sm', href: '#forgot-password', children: 'Forgot password?' },
  { tone: 'strong', size: 'body', href: '#sign-up', children: 'Create an account' },
  { tone: 'subtle', size: 'body', onPress: vi.fn(), children: 'Help' },
  { tone: 'subtle', size: 'sm', onPress: vi.fn(), children: 'Help' },
];

const row = () => (
  <div className={layout.row}>
    {appearances.map((props, index) => (
      <Link key={index} {...props} />
    ))}
  </div>
);

describe('Link', () => {
  it('default', async () => {
    const screen = await render(row());
    // A real <a href> for navigation, a <button> styled as a link for in-page actions.
    await expect.element(screen.getByRole('link', { name: 'Create an account' })).toHaveAttribute('href', '#sign-up');
    await expect.element(screen.getByRole('button', { name: 'Help' }).first()).toBeVisible();
    await expectAccessible();
  });

  it('focus', async () => {
    const screen = await render(row());
    await userEvent.tab();
    await expect.element(screen.getByRole('link', { name: 'Forgot password?' }).first()).toHaveFocus();
    await expectAccessible();
  });

  it('in a sentence', async () => {
    // The touch target grows to size.target-min without changing the line height of the sentence.
    const screen = await render(
      <p className="type-body">
        New to Atlas?{' '}
        <Link tone="strong" href="#sign-up">
          Create an account
        </Link>
      </p>,
    );
    await expect.element(screen.getByRole('link', { name: 'Create an account' })).toBeVisible();
    await expectAccessible();
  });
});
