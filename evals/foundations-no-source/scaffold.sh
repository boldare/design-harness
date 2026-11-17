#!/bin/bash
# An empty system named Kestrel, and no source for its look.
set -euo pipefail
"$(cd "$(dirname "$0")" && pwd)/../lib/empty-system.sh" Kestrel
