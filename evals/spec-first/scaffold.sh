#!/bin/bash
# Copies Atlas (examples/atlas, without dependencies and build output) into the eval workspace, and the package into its
# node_modules, so the skill works on a real Atlas checkout and Atlas's skill link resolves to the copy. The repo root is
# two levels above this script.
set -euo pipefail
REPO="${EVAL_REPO:-$(cd "$(dirname "$0")/../.." && pwd)}"
rsync -a --exclude node_modules --exclude .describe-me --exclude describe-me-dist --exclude .vitest \
  --exclude /claude-design/project/ --exclude /claude-design/publish.json "$REPO/examples/atlas/" ./
mkdir -p node_modules/@boldare
rsync -a --exclude node_modules "$REPO/packages/design-harness/" node_modules/@boldare/design-harness/
test -f design-harness.yaml
