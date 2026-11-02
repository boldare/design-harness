// @dsCard group="Selection" height=272
// State rows, as in the Slider README, with LED brightness from DeviceSettings at the minimum, in the middle and at the maximum. Each thumb moves.
function percent(value) {
  return value + '%';
}

function row(label, disabled, focus) {
  return {
    label: label,
    focus: focus,
    cells: [10, 50, 100].map(function (value) {
      return controlled(value, function (current, setCurrent) {
        return h(Atlas.Slider, {
          label: 'LED brightness',
          min: 10,
          max: 100,
          step: 10,
          value: current,
          formatValue: percent,
          disabled: disabled,
          onChange: setCurrent,
        });
      });
    }),
  };
}

mount(matrix(['value: 10%', 'value: 50%', 'value: 100%'], [row('default', false), row('focus', false, true), row('disabled', true)]));
