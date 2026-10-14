// @dsCard group="Actions" height=128
// States from the IconButton README, and the password toggle, which names the next action ("Show password").
function cell(props) {
  return h(Atlas.IconButton, Object.assign({ icon: 'eye', label: 'Show password', onPress: noop }, props));
}

mount(
  grid(4, [
    { label: 'default', node: cell({}) },
    { label: 'focus', node: cell({}), focus: true },
    { label: 'disabled', node: cell({ disabled: true }) },
    {
      label: 'toggle',
      node: controlled(false, function (visible, setVisible) {
        return cell({
          icon: visible ? 'eye-off' : 'eye',
          label: visible ? 'Hide password' : 'Show password',
          onPress: function () {
            setVisible(!visible);
          },
        });
      }),
    },
  ]),
);
