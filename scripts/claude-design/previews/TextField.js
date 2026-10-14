// @dsCard group="Inputs" height=640
// Type by State, as in the TextField README, with copy from Atlas sign-in and device settings. Every field takes input.
var fields = [
  {
    column: 'text',
    props: { label: 'Device name', type: 'text', placeholder: 'Kitchen sensor' },
    filled: 'Hallway thermostat',
    error: { value: '', message: 'Give the device a name, like Kitchen sensor' },
  },
  {
    column: 'email',
    props: { label: 'Email', type: 'email', placeholder: 'name@company.com', autoComplete: 'email' },
    filled: 'maja.nowak@company.com',
    error: { value: 'maja.nowak@company', message: 'Enter a valid email, like name@company.com' },
  },
  {
    column: 'password',
    props: {
      label: 'Password',
      type: 'password',
      autoComplete: 'current-password',
      labelAction: h(Atlas.Link, { size: 'sm', href: '#forgot-password' }, 'Forgot password?'),
    },
    filled: 'atlas-demo-2026',
    error: { value: '', message: 'Enter your password to sign in' },
  },
];

function field(props, value) {
  return controlled(value, function (current, setCurrent) {
    return h(Atlas.TextField, Object.assign({}, props, { value: current, onChange: setCurrent }));
  });
}

function row(label, cell, focus) {
  return {
    label: label,
    focus: focus,
    cells: fields.map(function (spec) {
      var extra = cell(spec);
      return field(Object.assign({}, spec.props, extra.props), extra.value);
    }),
  };
}

mount(
  matrix(
    fields.map(function (spec) {
      return spec.column;
    }),
    [
      row('empty', function () {
        return { value: '' };
      }),
      row('filled', function (spec) {
        return { value: spec.filled };
      }),
      row(
        'focus',
        function (spec) {
          return { value: spec.filled };
        },
        true,
      ),
      row('error', function (spec) {
        return { value: spec.error.value, props: { error: spec.error.message } };
      }),
      row('disabled', function (spec) {
        return { value: spec.filled, props: { disabled: true } };
      }),
    ],
  ),
);
