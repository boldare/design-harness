#!/bin/bash
# End-to-end eval of the atlas-design-system skill, run headless on a throwaway copy of the repository:
#   phase 1  the prompt; the skill must write a spec and stop for approval, with no code changed
#   phase 2  "approved"; the skill builds; then the repository checks run and the report is inspected
# Figma and Claude Design are switched off: this checks the source and the code, not the outputs.
# Usage: scripts/eval-e2e.sh ["prompt"]     Results: evals-e2e/results/<timestamp>/ (summary.txt, report.md, traces)
set -uo pipefail
REPO=$(git rev-parse --show-toplevel)
PROMPT=${1:-"In Device settings, LED brightness should be a slider, not three radio buttons."}
OUT=${EVAL_OUT:-$REPO/evals-e2e/results/$(date +%Y%m%dT%H%M%S)}
WORK=$(mktemp -d)/atlas-e2e
mkdir -p "$OUT"
git -C "$REPO" worktree add --detach -q "$WORK" HEAD
trap 'git -C "$REPO" worktree remove --force "$WORK" >/dev/null 2>&1' EXIT
ln -s "$REPO/node_modules" "$WORK/node_modules"
cd "$WORK"

OFF="mcp__plugin_figma_figma,Artifact"
READ="Read,Glob,Grep,Skill,Write,Edit"
BUILD="Bash(npm run tokens),Bash(npm run lint:tokens),Bash(npm run typecheck),Bash(npm run build-storybook),Bash(npm run claude-design*)"
FAIL=0
check() { if bash -c "$2" >/dev/null 2>&1; then echo "PASS  $1"; else echo "FAIL  $1"; FAIL=1; fi; }

start=$(date +%s)
claude -p "$PROMPT" --permission-mode dontAsk --allowedTools "$READ" --disallowedTools "$OFF" \
  --max-budget-usd 3 --output-format stream-json --verbose > "$OUT/phase1.jsonl" 2>"$OUT/phase1.err"
SID=$(jq -r 'select(.type=="system" and .subtype=="init") | .session_id' "$OUT/phase1.jsonl" | head -1)
jq -r 'select(.type=="result") | .result' "$OUT/phase1.jsonl" > "$OUT/spec-reply.md"
p1=$(( $(date +%s) - start ))
{
echo "Prompt: $PROMPT"
echo "Phase 1 (spec): ${p1}s"
check "phase 1 leaves src/ untouched"            "[ -z \"\$(git status --porcelain -- src)\" ]"
check "phase 1 writes a spec"                    "[ -n \"\$(git status --porcelain -- components screens)\" ]"
check "phase 1 asks for approval"                "grep -qiE 'approv|go-ahead|go ahead|decide' '$OUT/spec-reply.md'"
} | tee "$OUT/summary.txt"

claude -p "Approved, go ahead. Figma and Claude Design are not available in this run: skip those steps and say so in the report." \
  --resume "$SID" --permission-mode dontAsk --allowedTools "$READ,$BUILD" --disallowedTools "$OFF" \
  --max-budget-usd 6 --output-format stream-json --verbose > "$OUT/phase2.jsonl" 2>"$OUT/phase2.err"
jq -r 'select(.type=="result") | .result' "$OUT/phase2.jsonl" > "$OUT/report.md"
total=$(( $(date +%s) - start ))
{
echo "Total: ${total}s"
check "tokens build"                             "npm run -s tokens"
check "lint:tokens (no raw values in CSS)"       "npm run -s lint:tokens"
check "typecheck"                                "npm run -s typecheck"
check "build-storybook"                          "npm run -s build-storybook"
check "no hex colours added in src/"             "! { git diff HEAD -- src ':!src/styles/tokens.css' | grep '^+' ; git ls-files -o --exclude-standard src | xargs cat 2>/dev/null; } | grep -qE '#[0-9a-fA-F]{6}\\b'"
check "new tokens recorded in foundations.md"    "git diff --quiet HEAD -- tokens/tokens.json || ! git diff --quiet HEAD -- docs/foundations.md"
for f in 'Change:' 'Reused:' 'New:' 'Tokens used:' 'States:' 'Checks:'; do
  check "report has $f"                          "grep -q '$f' '$OUT/report.md'"
done
jq -r 'select(.type=="result") | "Cost USD: \(.total_cost_usd)"' "$OUT/phase1.jsonl" "$OUT/phase2.jsonl"
} | tee -a "$OUT/summary.txt"
git status --porcelain > "$OUT/changed-files.txt"
grep -q '^FAIL' "$OUT/summary.txt" && exit 1 || exit 0
