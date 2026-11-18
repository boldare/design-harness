#!/bin/bash
# The no-skill baseline: the eval suite with the skill left out of every workspace. The scaffolds put the system's own
# skill in the workspace, as a designer's system has it (the link and the package's skill folder), because the eval
# sandbox does not let the with-skill arm read the plugin's references. A no-skill arm would find that copy and read it,
# so this run tells the scaffolds to leave it out (evals/.no-skill, which they read) and runs both arms. Only the
# no-skill column measures anything: the with-skill arm here has the skill without its references. Extra arguments go
# to claude plugin eval, for example -j 3 or --json out.json.
set -euo pipefail
cd "$(dirname "$0")/.."
touch evals/.no-skill
trap 'rm -f evals/.no-skill' EXIT
claude plugin eval . --scaffold --allow-tools Write Edit --ablation with-without --trust-plugin "$@"
