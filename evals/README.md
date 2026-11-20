# Eval results

The yardstick for every change to the skill (`docs/plans/workflow-split.md`, step 0). The cases live in `evals/` (four on Atlas, and from step 5b two on an empty system), the end-to-end scripts are `scripts/eval-e2e.sh` (Atlas) and `scripts/eval-e2e-foundations.sh` (an empty system and a brand book). Single runs are noisy; these numbers are three runs per case, one at a time, with a no-skill arm for the delta.

Run them with `claude plugin eval . --scaffold --allow-tools Write Edit --ablation none -j 3` from the root of a checkout of the commit under test, not from a clone in a temporary folder (the eval sandbox denies reads there), then `scripts/eval-e2e.sh`. The scaffolds (`evals/lib/`) copy `examples/atlas/`, or run `design-harness init`, and copy the package into the workspace with the system's own skill link, as a designer's system has it: the sandbox does not let the with-skill arm read the plugin's references, so the skill is read from the workspace. For the no-skill delta run `scripts/eval-baseline.sh -j 3`: it tells the scaffolds to leave the skill out (the link and the package's skill folder), because a no-skill arm finds the copy and reads it, and only its no-skill column measures anything.

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

## Step 5, the layout (PR #12), 17.11.2026

The branch at `c377d14` (merged as `a6fb0f3`), with-skill arm only. The skill is now `packages/design-harness/skill`, named `design-harness` with a description that does not name Atlas; `claude plugin eval .` loads it through `.claude-plugin/plugin.json`, and Atlas through `examples/atlas/.claude/skills/design-harness`. The graders moved to `evals/` unchanged.

| Case | Step 4 | After | Note |
|---|---|---|---|
| refuse-hardcode | 1.00 | 1.00 | |
| reuse-screen | 1.00 | 1.00 | |
| spec-first | 1.00 | 1.00 | |
| token-proposal | 1.00 | 1.00 | |

537 s, 3.65 USD.

End-to-end, the bio prompt of step 4, three runs:
1. From a worktree of a checkout still on the old layout: Claude Code also loads the skills of the main checkout, so the session had `design-harness` and the old `atlas-design-system`, and chose the old one. Not counted. `scripts/eval-e2e.sh` now works in a clone, not a worktree.
2. From a fresh clone: the skill loaded as `design-harness`, read `design-harness.yaml`, both rule files and the references, and wrote the spec. In phase 2 its one command was `pnpm run check`, which the script did not allow (neither `check` with npm nor with pnpm ever was; earlier runs fell back to the single commands). It stopped running commands and left a failing test: 15 of 16. The script now allows `check`.
3. With `check` allowed: all 16 pass. 424 s, 0.66 + 2.38 USD.

## Step 1c, groups in the table and in Figma (PR #23), 17.11.2026

The branch at `64edad9`, with-skill arm only. `spec-first` has a fourth grader, `row-in-group`: a regex on `components/README.md` that passes when the Badge row stands next to a row of its own group, or alone in a new group, so that no group is split. Before the full run it was tested on hand-made tables (after Alert, after StatusMark, a new group at the end: pass; Feedback or Actions after Logo, no row: fail) and on one run (pass, Badge under Feedback after StatusMark).

| Case | Step 5 | After | Note |
|---|---|---|---|
| refuse-hardcode | 1.00 | 0.89 | One run failed `rule-and-alternative` (judge FAIL FAIL FAIL). Its reply refused, gave the rule and three alternatives, the same as a passing run of the same batch; both recommend recolouring the button only in the browser for the screenshot, which the judge sometimes reads as applying the colour. The case does not touch the changed text. |
| reuse-screen | 1.00 | 1.00 | |
| spec-first | 1.00 | 1.00 | `row-in-group` passed 3 of 3. |
| token-proposal | 1.00 | 1.00 | |

560 s, 3.83 USD.

End-to-end, the bio prompt: all 16 pass. 311 s, 0.67 + 1.54 USD. It changes TextField and Profile, no new row, so it checks that nothing else moved.

## Step 5b, foundations first (PR #25), 17-18.11.2026

Two new cases on an empty system: the scaffold (`evals/lib/empty-system.sh`) runs `design-harness init --name Kestrel` from this repository's package and copies the package into `node_modules`, as a designer's system would have it.
- `foundations-first`: the Kestrel brand book (`evals/foundations-first/brand-book.md`, a made-up brand: one light look, eight colours, Work Sans, a 4 px grid, and nothing on focus, disabled, errors or touch size) and "Start our design system from the brand book". Graders: no Write or Edit to `tokens/tokens.json` and no Write to `src/` (matched on `file_path`: a first version matched the whole input, and the proposal's own text names `tokens/tokens.json`, so it failed every run of both arms), the brand's teal and ink in `docs/foundations.md`, and two judges: the reply waits for approval, and it names at least two things the brand book does not define as open points.
- `foundations-no-source`: "Set up the design system for our new app, Kestrel. We need a primary button and a text field to start." Graders: no Write, no Edit, and a judge: the reply asks for a source and names no value of its own.

The no-skill arm did not measure these cases, nor the Atlas ones since step 5: the workspace has the system's own link `.claude/skills/design-harness`, so Claude Code loaded the skill in both arms. Fixed after 5b (below).

The branch at `cb3bcd1`, with-skill arm, three runs each:

| Case | Score | Note |
|---|---|---|
| foundations-first | 1.00 | `docs/foundations.md` carries the brand's values with usage and source, one light theme, and contrast measured by hand (Line on white 1.39:1 for input borders, Ember 3.68:1 as text, both raised as open points). |
| foundations-no-source | 0.89 | One run failed the judge (FAIL FAIL FAIL) on a reply that wrote nothing, asked for a brand book, a Figma file or CSS, and named no value. The criterion was made more explicit after the same happened in an earlier run; the judge still misreads it at times. |
| refuse-hardcode | 1.00 | |
| reuse-screen | 1.00 | |
| spec-first | 1.00 | |
| token-proposal | 0.89 | One run failed `proposes-not-approximates` (FAIL FAIL FAIL) on a reply with a full `size.progress-track` proposal and why no token fits. |

482 s, 5.26 USD.

End-to-end, `scripts/eval-e2e-foundations.sh` (pack, `init`, the brand book; phase 1 the request, phase 2 "approved as proposed, and take your proposals for the open points"): all 19 checks pass, twice. The tokens file stays empty until approval, then holds the brand's colours as primitives and semantic tokens with usage notes, the six Work Sans styles, one theme, and the tokens for the core rules, which `docs/rules.md` names; `npm run check` passes with no components. 268 s, 0.77 + 1.43 USD, and 256 s, 0.60 + 1.41 USD. The Atlas e2e (bio prompt): all 16 pass, 332 s.

Figma, by hand: an approved Kestrel system and an empty Figma file ("Kestrel (design-harness foundations demo)", Boldare S.A.), with the request to build the library. `claude -p` had no Figma connection (the MCP's sign-in is per session), and the skill stopped at the `figma` gate and said so. A subagent in a session with the connection, reading only the skill and the adapter, built three collections (8 primitives, 16 semantic colours, 16 dimensions, every one scoped, described and with code syntax), six text styles, one effect style, the Foundations page drawn from them, `figma/library.json` and `outputs.figma`. Its list of what the text left open (the shape of `library.json`, mode names, scopes, unit conversions, the shadow's alpha, the Foundations page's own values, a Figma file given after approval) went into the Figma adapter and the skill.

## The no-skill arm (PR #26), 18.11.2026

The no-skill arm loaded the skill since step 5, through the system's own link in the workspace. Removing the link was not enough: the eval sandbox denies the with-skill arm reads of the plugin's folder, so it lost its references, and the no-skill arm found the package's `skill/SKILL.md` in `node_modules` with a Glob and read it. The scaffold cannot tell the arms apart (its environment is the same in both, and the runner does not pass the caller's), so the baseline is its own run: `scripts/eval-baseline.sh` leaves a marker (`evals/.no-skill`) that the scaffolds read, and they leave the skill out. Checked in the traces: no read of the skill in any no-skill run; the only mentions of `SKILL.md` come from the package's README. The spec-first `no-code-yet` grader now matches the file path only, like the foundations-first ones.

`main` at `21fcf86` plus the fix, three runs each. With the skill: `--ablation none`. Without: `scripts/eval-baseline.sh`.

| Case | With | Without | Δ |
|---|---|---|---|
| foundations-first | 0.94 | 1.00 | -0.06 |
| foundations-no-source | 1.00 | 1.00 | 0 |
| refuse-hardcode | 1.00 | 0.33 | +0.67 |
| reuse-screen | 1.00 | 0.50 | +0.50 |
| spec-first | 1.00 | 0.75 | +0.25 |
| token-proposal | 1.00 | 0.44 | +0.56 |

With: 306 s, 5.33 USD; one `waits` failure (judge FAIL FAIL PASS). Without: 735 s, 12.63 USD for both arms. The two foundations cases do not tell the arms apart: without the skill, Claude still reads the package's README, the empty `docs/foundations.md` and `docs/rules.md` that init writes, and on its own proposes from the brand book and asks for a source when there is none. They guard the skill against regressions, not its value. Two earlier full runs in the same session were dropped: one had no `node_modules` in the clone, so the empty-system scaffold failed, and in both, runs stalled on the API and timed out after 600 s.


## Decisions and defaults, 20.11.2026

The first run on a real brand (Boldare's, from its social media skill) wrote eleven open points into `docs/foundations.md` and showed five of them in the reply, as "the most important". The proposal now splits open points into decisions (numbered, lettered options, one marked "(recommended)") and defaults, the reply shows all of them, and in Claude Code the decisions go through the question picker. The evals run headless, without the picker, so they test the listed form: `open-points` asks for the two groups, and `decisions-and-defaults` checks the file.

`foundations-first` 1.00 (3 runs, 1.61 USD), after a first run at 0.90: one reply marked its recommendations with "✓" and two judges did not count it, so the skill now asks for "(recommended)". `foundations-no-source` 1.00 (3 runs). The replies listed two to four decisions (error colour, input border, touch target, screen frame) and five to eight defaults, and asked about Figma and Claude Design only after approval. End-to-end (`scripts/eval-e2e-foundations.sh`): all 19 checks pass, 275 s, 2.20 USD. The Atlas cases were not run: the change touches only an empty system's foundations.
