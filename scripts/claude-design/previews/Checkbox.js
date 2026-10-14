// @dsCard group="Selection" height=480
// Checked by State, as in the Checkbox README, with the consent from Atlas sign-up, and a box with a description.
var consent = {
  label: 'I accept the Atlas terms of use',
  error: 'Atlas can’t create your account without your agreement',
};

function box(props, checked) {
  return controlled(checked, function (current, setCurrent) {
    return h(Atlas.Checkbox, Object.assign({ label: consent.label }, props, { checked: current, onChange: setCurrent }));
  });
}

function row(label, props, focus) {
  return {
    label: label,
    focus: focus,
    cells: [false, true].map(function (checked) {
      return box(props, checked);
    }),
  };
}

mount(
  matrix(
    ['checked: false', 'checked: true'],
    [
      row('default', {}),
      row('focus', {}, true),
      row('error', { error: consent.error }),
      row('disabled', { disabled: true }),
      row('description', {
        label: 'Share usage data with Atlas',
        description: 'Anonymous readings help us improve pairing. You can change this later in settings.',
      }),
    ],
  ),
);
