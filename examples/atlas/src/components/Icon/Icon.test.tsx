import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { expectAccessible } from '../../test/a11y';
import layout from '../../test/layout.module.css';
import { Icon, iconNames, type IconSize } from './Icon';

// The whole set at each size. The spinner turns once per duration.spin.
const set = (size: IconSize) => (
  <div className={layout.row}>
    {iconNames.map((name) => (
      <Icon key={name} name={name} size={size} />
    ))}
  </div>
);

describe('Icon', () => {
  it('sm', async () => {
    const screen = await render(set('sm'));
    // Decorative by default: hidden from assistive technology.
    expect(screen.container.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(iconNames.length);
    await expectAccessible();
  });

  it('md', async () => {
    const screen = await render(set('md'));
    expect(screen.container.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(iconNames.length);
    await expectAccessible();
  });

  it('labelled', async () => {
    // Only when the icon is the only carrier of meaning.
    const screen = await render(<Icon name="alert-circle" label="Attention" />);
    await expect.element(screen.getByRole('img', { name: 'Attention' })).toBeVisible();
    await expectAccessible();
  });
});
