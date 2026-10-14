// @dsCard group="Icons" height=336
// The whole set at both sizes, as the Icon story. The spinner turns once per duration.spin.
mount(
  matrix(
    ['sm', 'md'],
    Atlas.iconNames.map(function (name) {
      return {
        label: name,
        cells: [h(Atlas.Icon, { name: name, size: 'sm' }), h(Atlas.Icon, { name: name, size: 'md' })],
      };
    }),
  ),
);
