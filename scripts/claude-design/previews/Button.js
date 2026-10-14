// @dsCard group="Actions" height=376
// Variant by State, as in the Button README. Primary says what is happening while loading; quiet keeps its label.
var variants = [
  { variant: 'primary', label: 'Sign in', loadingLabel: 'Signing in…' },
  { variant: 'quiet', label: 'Use a different account' },
];

function row(label, props, focus) {
  return {
    label: label,
    focus: focus,
    cells: variants.map(function (variant) {
      return h(
        Atlas.Button,
        Object.assign({ variant: variant.variant, fullWidth: false, loadingLabel: variant.loadingLabel, onPress: noop }, props),
        variant.label,
      );
    }),
  };
}

mount(
  matrix(
    ['primary', 'quiet'],
    [row('default', {}), row('focus', {}, true), row('disabled', { disabled: true }), row('loading', { loading: true })],
  ),
);
