#!/bin/bash
# Atlas (examples/atlas, without dependencies and build output) in the eval workspace, and the package in its
# node_modules, so Atlas's skill link resolves to the copy. Run by the scaffold of a case, with the workspace as the
# working directory. With evals/.no-skill present (scripts/eval-baseline.sh), the skill is left out, the link and the
# package's skill folder, for the no-skill baseline.
set -euo pipefail
REPO="${EVAL_REPO:-$(cd "$(dirname "$0")/../.." && pwd)}"
NO_SKILL=()
[ -e "$REPO/evals/.no-skill" ] && NO_SKILL=(--exclude /.claude/skills/ --exclude /skill/)
rsync -a --exclude node_modules --exclude .describe-me --exclude describe-me-dist --exclude .vitest \
  --exclude /claude-design/project/ --exclude /claude-design/publish.json ${NO_SKILL[@]+"${NO_SKILL[@]}"} "$REPO/examples/atlas/" ./
mkdir -p node_modules/@boldare
rsync -a --exclude node_modules ${NO_SKILL[@]+"${NO_SKILL[@]}"} "$REPO/packages/design-harness/" node_modules/@boldare/design-harness/
test -f design-harness.yaml
if [ -e "$REPO/evals/.no-skill" ]; then ! test -e .claude/skills/design-harness; else test -f .claude/skills/design-harness/SKILL.md; fi
