// @dsCard group="Feedback" height=216
// The Alert with and without its description, as in the Alert story. Only the danger tone exists.
mount(
  matrix(null, [
    {
      label: 'title and description',
      cells: [
        h(Atlas.Alert, {
          title: 'Email or password is incorrect',
          description: 'Check your details and try again, or reset your password.',
        }),
      ],
    },
    { label: 'title only', cells: [h(Atlas.Alert, { title: 'The device didn’t respond. Try again.' })] },
  ]),
);
