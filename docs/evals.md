# Eval results

The yardstick for every change to the skill (`docs/plans/workflow-split.md`, step 0). The four cases live in `.claude/skills/atlas-design-system/evals/`, the end-to-end script is `scripts/eval-e2e.sh`. Single runs are noisy; these numbers are three runs per case, one at a time, with a no-skill arm for the delta.

Run them with `claude plugin eval .claude/skills/atlas-design-system --scaffold --allow-tools Write Edit -j 1` from a detached worktree of the commit under test, then `scripts/eval-e2e.sh`.

## Baseline: `5a0322b` (before the describe-me swap), 23.10.2026

| Case | With skill | Without | Δ | Note |
|---|---|---|---|---|
| refuse-hardcode | 1.00 | 0.33 | +0.67 | `no-hex-edited` had the same `(?i)` bug: it threw whenever Edit was called (the no-skill arm), and passed with the skill only because the skill never edited. Fixed with the other. |
| reuse-screen | 1.00 | 0.50 | +0.50 | |
| spec-first | 1.00 | 0.33 | +0.67 | |
| token-proposal | 0.67 | 0.33 | +0.33 | `proposal-block` threw on `(?i)` in its regex in every run; the other two graders passed 3/3. Fixed on the describe-me branch, so later runs score it. |

Overall 0.92, mean Δ +0.54, 29 minutes, 8.42 USD. Runs took 6 to 20 turns and 23 to 77 seconds.

End-to-end (`In Device settings, LED brightness should be a slider, not three radio buttons.`): all 15 checks pass. Spec phase 281 s, total 515 s, 1.19 + 2.93 USD.
