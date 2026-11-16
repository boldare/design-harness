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

## Branch `describe-me` at `bc4f36c` (after the swap), 23.10.2026

| Case | With skill | Without | Δ | Note |
|---|---|---|---|---|
| refuse-hardcode | 1.00 | 0.33 | +0.67 | |
| reuse-screen | 0.83 | 0.50 | +0.33 | One run scored 0.50: the `reuses` judge voted PASS FAIL FAIL on a reply that reused TextField, Button, Alert and StatusMark and asked for approval. Judge noise, not a change in behaviour. |
| spec-first | 1.00 | 0.33 | +0.67 | |
| token-proposal | 1.00 | 0.33 | +0.67 | Scored now that `proposal-block` has a valid regex. |

Overall 0.96, mean Δ +0.58, 31 minutes, 8.66 USD. Runs took 5 to 19 turns and 17 to 83 seconds. Against the baseline: no case got worse once the grader bug is accounted for.

End-to-end (same prompt): the skill wrote the Slider spec, stopped for approval, then built it with a test per state and reported `test pass (71/71)` and `check-states pass`. Two checks of the harness itself failed for a reason outside the skill: the e2e worktree links `node_modules` from elsewhere, and the browser test server refused to serve files from there, so plain `npm test` could not start (the skill noticed and ran the tests through a temporary config). Fixed in `vitest.config.ts` (`server.fs.allow`), verified from a worktree with a linked `node_modules`; the e2e was run again after the fix (below). The skill also found that a note with backticks in the States section was read as states; `check-states` now reads only the first sentence.

End-to-end after the fix (`e5c5c51`): all 15 checks pass. Spec phase 290 s, total 601 s, 0.83 + 2.68 USD. The skill built the Slider with a test per state (68 passed), `check-states` 39 states. In both runs the skill wrote a throwaway screenshot test to check the screen by eye in light and dark and could not delete it (no `rm` in the eval); `code.md` now says to remove such files before the report.

## Step 4 (core and system rules), 16.11.2026

`main` at `ae626e3` against the step 4 branch at `4dafde6`, with-skill arm only (`--ablation none`): the no-skill arm does not change with the skill's text. A rollout ran on the same account at the time.

| Case | Before | After | Note |
|---|---|---|---|
| refuse-hardcode | 1.00 | 1.00 | |
| reuse-screen | 1.00 | 1.00 | |
| spec-first | 1.00 | 0.89 | One run failed `waits` (judge FAIL FAIL FAIL): the reply showed the spec with tokens and asked for approval, then suggested "building the Badge now and specifying Tabs separately", which the judge read as not waiting. Three more runs: 1.00. Over six runs 5 of 6 pass `waits`. |
| token-proposal | 1.00 | 1.00 | |

Before: 526 s, 3.26 USD. After: 571 s, 3.61 USD, plus 1.09 USD for the rerun.

End-to-end. The default prompt (the LED slider) is already on `main` since PR #5, so both commits ran `On the Profile screen, add a short bio field: several lines of text, up to 160 characters, with a character counter.` All 16 checks pass on both. Before: 379 s, 0.59 + 2.12 USD. After: 412 s, 0.66 + 2.20 USD. Both made a `multiline` TextField with a counter and a new text style for it, and recorded it in `docs/foundations.md`. After step 4 the skill read `design-harness.yaml` and `docs/rules.md` in the spec phase; before it, `docs/rules.md` did not exist.
