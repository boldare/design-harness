// @dsCard group="Actions" height=352
// Tone by Size by State, as in the Link README (strong exists only at body size), and a link inside a sentence.
var appearances = [
  { label: 'accent / body', props: { tone: 'accent', size: 'body', href: '#forgot-password' }, text: 'Forgot password?' },
  { label: 'accent / sm', props: { tone: 'accent', size: 'sm', href: '#forgot-password' }, text: 'Forgot password?' },
  { label: 'strong / body', props: { tone: 'strong', size: 'body', href: '#sign-up' }, text: 'Create an account' },
  { label: 'subtle / body', props: { tone: 'subtle', size: 'body', onPress: noop }, text: 'Help' },
  { label: 'subtle / sm', props: { tone: 'subtle', size: 'sm', onPress: noop }, text: 'Help' },
];

function sentence() {
  return h('p', { className: 'type-body' }, 'New to Atlas? ', h(Atlas.Link, { tone: 'strong', href: '#sign-up' }, 'Create an account'));
}

mount(
  matrix(
    ['default', 'focus'],
    appearances
      .map(function (appearance) {
        return {
          label: appearance.label,
          cells: [h(Atlas.Link, appearance.props, appearance.text), h('div', { 'data-forced-focus': '' }, h(Atlas.Link, appearance.props, appearance.text))],
        };
      })
      .concat([{ label: 'in a sentence', cells: [sentence(), h('div', { 'data-forced-focus': '' }, sentence())] }]),
  ),
);
