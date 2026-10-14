// @dsCard group="Selection" height=504
// Selected by State, one option row per cell, as in the Radio README; then the whole group, enabled and disabled.
var notifications = [
  { value: 'all', label: 'All activity', description: 'Every reading and every alert' },
  { value: 'alerts', label: 'Alerts only', description: 'Only when something needs your attention' },
  { value: 'none', label: 'None' },
];

function row(label, disabled, focus) {
  return {
    label: label,
    focus: focus,
    cells: [false, true].map(function (checked) {
      return h(Atlas.Radio, {
        name: 'states-' + label + '-' + checked,
        value: 'alerts',
        label: 'Alerts only',
        description: 'Only when something needs your attention',
        checked: checked,
        disabled: disabled,
        onChange: noop,
      });
    }),
  };
}

function group(props) {
  return controlled('alerts', function (value, setValue) {
    return h(Atlas.RadioGroup, Object.assign({ legend: 'Notifications', options: notifications }, props, { value: value, onChange: setValue }));
  });
}

mount(
  h(
    'div',
    { className: 'pv-stack' },
    matrix(['selected: false', 'selected: true'], [row('default', false), row('focus', false, true), row('disabled', true)]),
    grid(2, [
      { label: 'group', node: group({ name: 'notifications' }) },
      { label: 'disabled group', node: group({ name: 'notifications-disabled', disabled: true }) },
    ]),
  ),
);
