// @dsCard group="Inputs" height=680
// States from the Select README, with the room picker from Atlas device settings. The open state shows the menu.
var rooms = [
  { value: 'living-room', label: 'Living room' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'hallway', label: 'Hallway' },
  { value: 'office', label: 'Office' },
];

function select(props, value) {
  return controlled(value, function (current, setCurrent) {
    return h(Atlas.Select, Object.assign({ label: 'Room', options: rooms }, props, { value: current, onChange: setCurrent }));
  });
}

mount(
  grid(2, [
    { label: 'empty', node: select({}, '') },
    { label: 'filled', node: select({}, 'kitchen') },
    { label: 'focus', node: select({}, 'kitchen'), focus: true },
    { label: 'error', node: select({ error: 'Choose the room this device is in' }, '') },
    { label: 'disabled', node: select({ disabled: true }, 'kitchen') },
    { label: 'open', node: select({ defaultOpen: true }, 'kitchen') },
  ]),
);
