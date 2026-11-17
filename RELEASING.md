# Releasing

How `@boldare/design-harness` gets to GitHub Packages (`npm.pkg.github.com`, the `@boldare` scope). It is the only published package; Atlas (`examples/atlas`) is private and never published. How a system installs it: "Access" in [`packages/design-harness/README.md`](packages/design-harness/README.md).

## Before every release

1. CI green on `main`: `pnpm check`, the Claude Design build, and `scripts/check-init.sh`, which packs the package, installs the tarball into an empty directory, runs `init` and the check there, and checks every path the linked skill names.
2. A change to the skill's text: the evals (`evals/README.md`) before the PR merges, and their results recorded there. Agents that open PRs do not run them.
3. A changeset for every change a user can see (`pnpm changeset`).

## Versioning

[Changesets](https://github.com/changesets/changesets).

- `pnpm changeset` in a feature branch writes the changeset file, and the PR carries it.
- On every push to `main`, the `version` job of `release.yml` runs `changesets/action`. With pending changesets it opens or refreshes the "Version Packages" PR (`pnpm version-packages`: bumps the version, writes `CHANGELOG.md` from the changeset texts with PR links, refreshes the lockfile). The action pushes that commit through the GitHub API, so GitHub signs it.
- Merging that PR starts the `publish` job (`pnpm release`, which is `changeset publish`; it publishes through pnpm to the registry in `publishConfig`, and tags the release). The job runs in the `npm` environment, which deploys only from `main` and waits for a maintainer's approval in Actions. Nothing is published before that approval.
- The publish job can be started again by hand (`workflow_dispatch`) when a publish failed.
- CI does not start by itself on the "Version Packages" PR, because the default `GITHUB_TOKEN` pushes it, and the ruleset on `main` requires `check`. Close and reopen the PR to start it.

The first release is `0.1.0` (`.changeset/first-release.md`). Anything below `1.0.0` may change its contracts and exports between minors; the changelog entry says so.

## Publishing

- `publishConfig.registry` sends the package to `https://npm.pkg.github.com`. The scope `@boldare` is the GitHub organisation, which owns the package.
- The publish job authenticates with the workflow's `GITHUB_TOKEN` (`packages: write`). `actions/setup-node` writes it into a user `.npmrc` and points `NPM_CONFIG_USERCONFIG` at it, which pnpm reads. No token is stored in the repository, and no first publish by hand is needed: the first publish creates the package and links it to this repository (`repository` in `package.json`).
- **After the first publish**, on the package's page in the organisation (Packages → `design-harness` → Package settings): check its visibility (private, visible to members of `boldare`, until the licence is settled), and under "Manage Actions access" give read access to each system repository whose CI installs it.
- GitHub Packages has no npm provenance. Nothing to set.

## Manifest rules

- `files` lists exactly what ships. `README.md` sits in `packages/design-harness/`, because npm picks it up only from the package's folder.
- No `license` yet: the organisation decides it before the package goes public.
- `engines.node` is `^20.19.0 || >=22.12.0`, the floor of Vite 8, whose native bindings are skipped silently on an older Node.
- No build step: the package ships its sources (`.mjs`, and `.ts`/`.tsx` test helpers that the system's Vite compiles).
