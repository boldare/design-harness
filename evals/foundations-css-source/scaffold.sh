#!/bin/bash
# An empty system named Pebble, and the CSS of Pebble's current web app (a made-up product) at legacy/styles/.
# The theme has tokens; the component styles also type values by hand, some near a token, some repeated, one off the palette.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
"$HERE/../lib/empty-system.sh" Pebble
mkdir -p legacy
cp -R "$HERE/legacy/styles" legacy/styles
