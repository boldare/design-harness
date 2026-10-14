// @dsCard group="Identity" height=320
// Initials from the name, given initials, and a long email truncated, as in the AccountCard story.
mount(
  matrix(null, [
    { label: 'initials from name', cells: [h(Atlas.AccountCard, { name: 'Maja Nowak', email: 'maja.nowak@company.com' })] },
    {
      label: 'initials given',
      cells: [h(Atlas.AccountCard, { name: 'Ana María López', email: 'ana.lopez@company.com', initials: 'AL' })],
    },
    {
      label: 'long email',
      cells: [
        h(Atlas.AccountCard, {
          name: 'Krzysztof Wiśniewski',
          email: 'krzysztof.wisniewski@facilities.northern-region.company.com',
        }),
      ],
    },
  ]),
);
