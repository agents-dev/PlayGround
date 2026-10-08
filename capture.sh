#!/usr/bin/env bash
# Capture desktop and mobile screenshots of CAPTURE_URL into CAPTURE_DIR.
# Exit codes: 0 success, 75 temporary navigation/browser failure, 1 script or render defect.
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$PROJECT_DIR"
: "${CAPTURE_URL:?CAPTURE_URL must be set}" "${CAPTURE_DIR:?CAPTURE_DIR must be set}"
RUNTIME_DIR="${RUNTIME_DIR:-/home/runner/work/_temp/omgithub-runtime}"
# Wait for the WebGL canvas (the page body is visible before the game renders).
export CAPTURE_READY_SELECTOR="${CAPTURE_READY_SELECTOR:-canvas}"
[[ -f "$RUNTIME_DIR/scripts/default-capture.mjs" ]] || { echo "Missing capture runtime at $RUNTIME_DIR." >&2; exit 1; }

# Capture output must stay outside the source tree.
mkdir -p "$CAPTURE_DIR"
capture_real="$(cd "$CAPTURE_DIR" && pwd -P)"
if [[ "$capture_real" == "$PROJECT_DIR" || "$capture_real" == "$PROJECT_DIR"/* ]]; then
  echo "CAPTURE_DIR must be outside $PROJECT_DIR." >&2
  exit 1
fi

# Run a command, print its wall-clock duration and exit status, and return the status.
run_timed() {
  local label="$1"; shift
  local started ended status=0
  started=$(date +%s%N)
  "$@" || status=$?
  ended=$(date +%s%N)
  printf '[time] %s: %d ms (exit %d)\n' "$label" $(( (ended - started) / 1000000 )) "$status"
  return "$status"
}

status=0
run_timed "capture desktop and mobile" node "$RUNTIME_DIR/scripts/default-capture.mjs" || status=$?

for shot in final-desktop.png final-mobile.png; do
  if [[ "$status" -eq 0 && ! -s "$CAPTURE_DIR/$shot" ]]; then
    echo "Expected $CAPTURE_DIR/$shot was not written." >&2
    status=1
  fi
done

exit "$status"
