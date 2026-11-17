#!/bin/bash
# An empty system named Kestrel, and the Kestrel brand book (a made-up brand) at docs/brand-book.md.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
"$HERE/../lib/empty-system.sh" Kestrel
cp "$HERE/brand-book.md" docs/brand-book.md
