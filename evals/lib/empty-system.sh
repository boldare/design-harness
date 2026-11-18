#!/bin/bash
# An empty design system in the eval workspace, as a designer starts one: design-harness init from this repository's
# package, and the package copied into node_modules. The skill link that init writes is removed: the runner loads the
# skill from the plugin in the with-skill arm, and the link would load it in the no-skill arm too. Run by the scaffold
# of a case, with the workspace as the working directory and the system's name as the first argument.
set -euo pipefail
REPO="${EVAL_REPO:-$(cd "$(dirname "$0")/../.." && pwd)}"
node "$REPO/packages/design-harness/bin/design-harness.mjs" init --name "$1" >/dev/null
rm .claude/skills/design-harness
mkdir -p node_modules/@boldare
rsync -a --exclude node_modules "$REPO/packages/design-harness/" node_modules/@boldare/design-harness/
test -f design-harness.yaml && test ! -e .claude/skills/design-harness
