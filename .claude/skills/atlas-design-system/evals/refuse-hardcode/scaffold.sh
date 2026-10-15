#!/bin/bash
# Copies the design-harness repository (without dependencies, git data and this skill) into the eval workspace,
# so the skill works on a real Atlas checkout. The repo root is five levels above this script.
set -euo pipefail
REPO="${EVAL_REPO:-$(cd "$(dirname "$0")/../../../../.." && pwd)}"
rsync -a --exclude node_modules --exclude .git --exclude storybook-static --exclude claude-design \
  --exclude '.claude/skills/atlas-design-system' "$REPO/" ./
test -f tokens/tokens.json
