#!/bin/bash
# Atlas (examples/atlas, without dependencies and build output) in the eval workspace, and the package in its
# node_modules. Atlas's skill link is left out: the runner loads the skill from the plugin in the with-skill arm, and the
# link would load it in the no-skill arm too. Run by the scaffold of a case, with the workspace as the working directory.
set -euo pipefail
REPO="${EVAL_REPO:-$(cd "$(dirname "$0")/../.." && pwd)}"
rsync -a --exclude node_modules --exclude .describe-me --exclude describe-me-dist --exclude .vitest \
  --exclude /claude-design/project/ --exclude /claude-design/publish.json --exclude /.claude/skills/ \
  "$REPO/examples/atlas/" ./
mkdir -p node_modules/@boldare
rsync -a --exclude node_modules "$REPO/packages/design-harness/" node_modules/@boldare/design-harness/
test -f design-harness.yaml && test ! -e .claude/skills/design-harness
