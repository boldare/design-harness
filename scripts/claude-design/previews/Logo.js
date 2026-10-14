// @dsCard group="Identity" height=176
// The Atlas mark with and without the wordmark, as in the Logo story.
mount(
  matrix(null, [
    { label: 'with wordmark', cells: [h(Atlas.Logo, {})] },
    { label: 'mark only', cells: [h(Atlas.Logo, { wordmark: false })] },
  ]),
);
