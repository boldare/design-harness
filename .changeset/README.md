# Changesets

Every change a user of `@boldare/design-harness` can see ships with a changeset: a small markdown file in this directory that names the package, the bump (`patch`, `minor`, `major`) and a line for the changelog. Create one with:

```sh
pnpm changeset
```

A change to the skill's text counts: it changes what the skill does in every system that installs the package. Atlas (`examples/atlas`) is private and is never versioned or published.

On merge to `main`, the release workflow collects the pending changesets into a "Version Packages" pull request. Merging that PR bumps the version, writes the CHANGELOG and publishes to GitHub Packages. See `RELEASING.md` at the repo root.
