import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { expectAccessible } from '../../test/a11y';
import layout from '../../test/layout.module.css';
import { Slider, type SliderProps } from './Slider';

/** Keeps the value locally, so the thumb moves. */
function ControlledSlider(props: SliderProps) {
  const [value, setValue] = useState(props.value);
  return (
    <Slider
      {...props}
      value={value}
      onChange={(next) => {
        setValue(next);
        props.onChange(next);
      }}
    />
  );
}

const percent = (value: number) => `${value}%`;

// LED brightness from DeviceSettings at the minimum, in the middle and at the maximum: the thumb stays inside the track.
const row = (disabled = false, onChange = vi.fn()) => (
  <div className={layout.row}>
    {[10, 50, 100].map((value) => (
      <div key={value} className={layout.cell}>
        <ControlledSlider
          label="LED brightness"
          min={10}
          max={100}
          step={10}
          value={value}
          formatValue={percent}
          disabled={disabled}
          onChange={onChange}
        />
      </div>
    ))}
  </div>
);

describe('Slider', () => {
  it('default', async () => {
    const screen = await render(row());
    const middle = screen.getByRole('slider', { name: 'LED brightness' }).nth(1);
    await expect.element(middle).toHaveValue('50');
    // Announced in the unit people know, not as a bare number.
    await expect.element(middle).toHaveAttribute('aria-valuetext', '50%');
    await expect.element(screen.getByText('50%')).toBeVisible();
    await expectAccessible();
  });

  it('focus', async () => {
    const screen = await render(row());
    await userEvent.tab();
    await expect.element(screen.getByRole('slider', { name: 'LED brightness' }).first()).toHaveFocus();
    await expectAccessible();
  });

  it('disabled', async () => {
    const screen = await render(row(true));
    await expect.element(screen.getByRole('slider', { name: 'LED brightness' }).nth(1)).toBeDisabled();
    await expectAccessible();
  });

  it('moves one step with the arrow keys', async () => {
    const onChange = vi.fn();
    const screen = await render(row(false, onChange));
    await userEvent.tab();
    await userEvent.tab();
    const middle = screen.getByRole('slider', { name: 'LED brightness' }).nth(1);
    await expect.element(middle).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    // Applied immediately, without a Save button.
    expect(onChange).toHaveBeenLastCalledWith(60);
    await expect.element(middle).toHaveAttribute('aria-valuetext', '60%');
    await expect.element(screen.getByText('60%')).toBeVisible();
    await userEvent.keyboard('{Home}');
    expect(onChange).toHaveBeenLastCalledWith(10);
  });

  it('moves the thumb to where the track is pressed', async () => {
    const onChange = vi.fn();
    const screen = await render(row(false, onChange));
    const middle = screen.getByRole('slider', { name: 'LED brightness' }).nth(1);
    const { width, height } = middle.element().getBoundingClientRect();
    // The whole track area is the target, so a press at its right end sets the maximum.
    await middle.click({ position: { x: width - 1, y: height / 2 } });
    expect(onChange).toHaveBeenLastCalledWith(100);
    await expect.element(middle).toHaveAttribute('aria-valuetext', '100%');
  });
});
