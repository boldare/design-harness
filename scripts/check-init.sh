#!/bin/bash
# Checks design-harness init on the packed package, the way a designer starts a system, in a throwaway folder:
#   pack the package, add the tarball to an empty repository, run init, install and run the empty system's check,
#   check the skill link and the paths the linked SKILL.md names, then commit and run init again, which must change nothing.
# Needs the npm registry. It downloads no Chromium: the empty system has no tests, so Vitest starts no browser.
# Usage: scripts/check-init.sh
set -euo pipefail
REPO=$(git rev-parse --show-toplevel)
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT
fail() { echo "check-init: $1" >&2; exit 1; }

cd "$REPO/packages/design-harness"
pnpm pack --pack-destination "$WORK"
TARBALLS=("$WORK"/boldare-design-harness-*.tgz)
[ ${#TARBALLS[@]} -eq 1 ] && [ -f "${TARBALLS[0]}" ] || fail "expected one tarball in $WORK, found: ${TARBALLS[*]}"
TARBALL=${TARBALLS[0]}

mkdir "$WORK/system"
cd "$WORK/system"
git init -q
# No package.json before the add: a designer has none.
pnpm add -D "$TARBALL"
pnpm exec design-harness init
grep -qx '@boldare:registry=https://npm.pkg.github.com' .npmrc || fail ".npmrc does not send @boldare to GitHub Packages"
# CI freezes the lockfile by default, and init has just added devDependencies.
pnpm install --no-frozen-lockfile
pnpm run check

LINK=.claude/skills/design-harness
TARGET=../../node_modules/@boldare/design-harness/skill
test -L "$LINK" || fail "$LINK is not a link"
[ "$(readlink "$LINK")" = "$TARGET" ] || fail "$LINK points to $(readlink "$LINK"), not $TARGET"
test -f "$LINK/SKILL.md" || fail "$LINK/SKILL.md does not exist"

# The skill opens the adapters from the system's root, and its references inside the linked folder.
ADAPTERS=0
while read -r path; do
  test -e "$path" || fail "$LINK/SKILL.md names $path, which does not exist from the system's root"
  ADAPTERS=$((ADAPTERS + 1))
done < <(grep -o '`node_modules/@boldare/design-harness/[^`]*`' "$LINK/SKILL.md" | tr -d '`' | sort -u)
REFERENCES=0
while read -r path; do
  test -f "$LINK/$path" || fail "$LINK/SKILL.md names $path, which is not in the linked skill"
  REFERENCES=$((REFERENCES + 1))
done < <(grep -oE 'references/[A-Za-z0-9._-]+\.md' "$LINK/SKILL.md" | sort -u)
echo "check-init: the linked SKILL.md names $ADAPTERS package paths and $REFERENCES references, and all exist."

git add -A
git -c user.name=check-init -c user.email=check-init@example.invalid -c commit.gpgsign=false commit -q -m init
pnpm exec design-harness init
CHANGES=$(git status --porcelain)
[ -z "$CHANGES" ] || fail "the second init changed the system:"$'\n'"$CHANGES"

echo "check-init: passed. init on the packed package gives a system whose check passes, and a second init changes nothing."
