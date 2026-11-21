#!/bin/bash
# End-to-end eval of foundations first, run headless on a new, empty system in a throwaway folder:
#   setup    pack the package, add the tarball to an empty repository, run init, add the Kestrel brand book (evals/foundations-first)
#   phase 1  "start the system from the brand book"; the skill must write the proposal in docs/foundations.md and stop, tokens empty
#   phase 2  "approved, with your proposals for the open points"; the skill writes the tokens; then the system's checks run
# Figma and Claude Design are switched off: this checks the source and the code, not the outputs.
# Usage: scripts/eval-e2e-foundations.sh     Results: evals-e2e/results/<timestamp>-foundations/ (summary.txt, report.md, traces)
set -uo pipefail
REPO=$(git rev-parse --show-toplevel)
PROMPT="Start our design system from the brand book in docs/brand-book.md."
OUT=${EVAL_OUT:-$REPO/evals-e2e/results/$(date +%Y%m%dT%H%M%S)-foundations}
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT
mkdir -p "$OUT"

# As scripts/check-init.sh: the packed package, so nothing comes from the registry under @boldare.
(cd "$REPO/packages/design-harness" && pnpm pack --pack-destination "$WORK" >/dev/null)
mkdir "$WORK/kestrel" && cd "$WORK/kestrel"
git init -q
pnpm add -D "$WORK"/boldare-design-harness-*.tgz >/dev/null
pnpm exec design-harness init --name Kestrel >/dev/null
pnpm install --no-frozen-lockfile >/dev/null
cp "$REPO/evals/foundations-first/brand-book.md" docs/brand-book.md
git add -A && git -c user.name=e2e -c user.email=e2e@example.invalid -c commit.gpgsign=false commit -q -m init

OFF="mcp__plugin_figma_figma,Artifact"
READ="Read,Glob,Grep,Skill,Write,Edit"
BUILD="Bash(npm run check),Bash(npm run tokens),Bash(npm run lint:tokens),Bash(npm run typecheck),Bash(npm test),Bash(npm run check-states)"
BUILD="$BUILD,Bash(pnpm run check),Bash(pnpm check),Bash(pnpm run tokens),Bash(pnpm run lint:tokens),Bash(pnpm run typecheck),Bash(pnpm test),Bash(pnpm run check-states)"
FAIL=0
check() { if bash -c "$2" >/dev/null 2>&1; then echo "PASS  $1"; else echo "FAIL  $1"; FAIL=1; fi; }

start=$(date +%s)
claude -p "$PROMPT" --permission-mode dontAsk --allowedTools "$READ" --disallowedTools "$OFF" \
  --max-budget-usd 3 --output-format stream-json --verbose > "$OUT/phase1.jsonl" 2>"$OUT/phase1.err"
SID=$(jq -r 'select(.type=="system" and .subtype=="init") | .session_id' "$OUT/phase1.jsonl" | head -1)
jq -r 'select(.type=="result") | .result' "$OUT/phase1.jsonl" > "$OUT/proposal-reply.md"
cp docs/foundations.md "$OUT/foundations-proposal.md" 2>/dev/null
p1=$(( $(date +%s) - start ))
{
echo "Prompt: $PROMPT"
echo "Phase 1 (proposal): ${p1}s"
check "phase 1 leaves the tokens file empty"     "git diff --quiet HEAD -- tokens/tokens.json"
check "phase 1 leaves src/ untouched"            "[ -z \"\$(git status --porcelain -- src)\" ]"
check "phase 1 writes the proposal"              "! git diff --quiet HEAD -- docs/foundations.md"
check "the proposal keeps the brand's teal"      "grep -qi '#0F5C63' docs/foundations.md"
check "phase 1 asks for approval"                "grep -qiE 'approv|go-ahead|go ahead|decide' '$OUT/proposal-reply.md'"
} | tee "$OUT/summary.txt"

SHELL_NOTE="The shell runs only the checks, with npm or pnpm: check, tokens, lint:tokens, typecheck, test, check-states. Other commands are denied; read and search with the file tools."
claude -p "Approved as proposed, and take your proposals for the open points. Figma and Claude Design are not available in this run: skip those steps and say so in the report. $SHELL_NOTE" \
  --resume "$SID" --permission-mode dontAsk --allowedTools "$READ,$BUILD" --disallowedTools "$OFF" \
  --max-budget-usd 6 --output-format stream-json --verbose > "$OUT/phase2.jsonl" 2>"$OUT/phase2.err"
jq -r 'select(.type=="result") | .result' "$OUT/phase2.jsonl" > "$OUT/report.md"
total=$(( $(date +%s) - start ))
{
echo "Total: ${total}s"
check "colour tokens written"                    "node -e 'process.exit(require(\"./tokens/tokens.json\").color.tokens.length > 0 ? 0 : 1)'"
check "the brand's teal is a token"              "grep -qi '#0F5C63' tokens/tokens.json"
check "text styles in Work Sans"                 "grep -q 'Work Sans' tokens/tokens.json"
check "every token has a usage note"             "node -e 'const t=require(\"./tokens/tokens.json\"); const all=[...t.color.tokens, ...t.type.groups.flatMap(g=>g.styles), ...Object.values(t).flatMap(f=>f&&Array.isArray(f.tokens)&&f!==t.color?f.tokens:[])]; process.exit(all.every(x=>x.usage)?0:1)'"
check "the font is loaded for the tests"         "grep -q 'Work' src/styles/fonts.html"
check "the system rules name the core tokens"    "! git diff --quiet HEAD -- docs/rules.md"
check "tokens build"                             "pnpm run -s tokens"
check "lint:tokens"                              "pnpm run -s lint:tokens"
check "check (typecheck, tests, states)"         "pnpm run -s check"
check "nothing in src/components"                "[ ! -d src/components ] || [ -z \"\$(ls -A src/components)\" ]"
for f in 'Change:' 'New tokens:' 'Checks:' 'Preview:' 'Open:'; do
  check "report has $f"                          "grep -q '$f' '$OUT/report.md'"
done
jq -r 'select(.type=="result") | "Cost USD: \(.total_cost_usd)"' "$OUT/phase1.jsonl" "$OUT/phase2.jsonl"
} | tee -a "$OUT/summary.txt"
cp tokens/tokens.json docs/foundations.md docs/rules.md "$OUT/" 2>/dev/null
git status --porcelain > "$OUT/changed-files.txt"
grep -q '^FAIL' "$OUT/summary.txt" && exit 1 || exit 0
