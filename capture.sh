#!/usr/bin/env bash
set -euo pipefail
time -p cd "$(dirname "$0")"
/usr/bin/time -p pwd
/usr/bin/time -p bash -c 'test -n "${CAPTURE_URL:-}" || { echo "Set CAPTURE_URL." >&2; exit 1; }'
/usr/bin/time -p bash -c 'test -n "${CAPTURE_DIR:-}" || { echo "Set CAPTURE_DIR." >&2; exit 1; }'
/usr/bin/time -p mkdir -p "$CAPTURE_DIR"
/usr/bin/time -p bash -c 'echo "capturing $CAPTURE_URL -> $CAPTURE_DIR"'
RUNTIME="${RUNTIME_DIR:-$PWD/.omgithub-runtime}"
export RUNTIME_DIR="$RUNTIME"
/usr/bin/time -p test -f "$RUNTIME_DIR/scripts/default-capture.mjs"
set +e
/usr/bin/time -p node "$RUNTIME_DIR/scripts/default-capture.mjs"
status=$?
set -e
/usr/bin/time -p bash -c 'echo "capture exit:$0"' "$status"
/usr/bin/time -p ls -l "$CAPTURE_DIR"
/usr/bin/time -p test -f "$CAPTURE_DIR/final-desktop.png"
/usr/bin/time -p test -f "$CAPTURE_DIR/final-mobile.png"
/usr/bin/time -p bash -c 'for f in "$0"/final-desktop.png "$0"/final-mobile.png; do test -s "$f" || { echo "empty screenshot: $f" >&2; exit 1; }; done' "$CAPTURE_DIR"
exit $status
