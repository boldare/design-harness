#!/bin/bash
# An empty design system in the eval workspace, as a designer starts one: design-harness init from this repository's
# package, and the package copied into node_modules, so the skill link that init writes resolves. Run by the scaffold
# of a case, with the workspace as the working directory and the system's name as the first argument.
# With evals/.no-skill present (scripts/eval-baseline.sh), the skill is left out, the link and the package's skill
# folder, for the no-skill baseline.
set -euo pipefail
REPO="${EVAL_REPO:-$(cd "$(dirname "$0")/../.." && pwd)}"
node "$REPO/packages/design-harness/bin/design-harness.mjs" init --name "$1" >/dev/null
NO_SKILL=()
if [ -e "$REPO/evals/.no-skill" ]; then rm .claude/skills/design-harness; NO_SKILL=(--exclude /skill/); fi
mkdir -p node_modules/@boldare
rsync -a --exclude node_modules ${NO_SKILL[@]+"${NO_SKILL[@]}"} "$REPO/packages/design-harness/" node_modules/@boldare/design-harness/
test -f design-harness.yaml
if [ -e "$REPO/evals/.no-skill" ]; then ! test -e .claude/skills/design-harness; else test -f .claude/skills/design-harness/SKILL.md; fi
