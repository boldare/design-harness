#!/bin/bash
# Atlas, as evals/lib/atlas.sh sets it up.
set -euo pipefail
"$(cd "$(dirname "$0")" && pwd)/../lib/atlas.sh"
