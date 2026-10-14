// @dsCard group="Selection" height=272
// Checked by State, as in the Switch README. Each switch toggles.
function row(label, disabled, focus) {
  return {
    label: label,
    focus: focus,
    cells: [false, true].map(function (checked) {
      return controlled(checked, function (current, setCurrent) {
        return h(Atlas.Switch, {
          label: 'Child lock',
          description: 'Buttons on the device stop responding',
          checked: current,
          disabled: disabled,
          onChange: setCurrent,
        });
      });
    }),
  };
}

mount(matrix(['checked: false', 'checked: true'], [row('default', false), row('focus', false, true), row('disabled', true)]));
