#!/usr/bin/env bash
# capture.sh — screenshot CAPTURE_URL at desktop + mobile sizes into CAPTURE_DIR.
# Env: CAPTURE_URL (exact URL), CAPTURE_DIR (output dir, kept outside source).
# Leaves the app running; closes only its own browser; exits nonzero on failure.
set -euo pipefail

: "${CAPTURE_URL:?CAPTURE_URL must be set to the exact URL to capture}"
: "${CAPTURE_DIR:?CAPTURE_DIR must be set to the output directory}"

/usr/bin/time -p mkdir -p "$CAPTURE_DIR"

SESS="capture-$$"
echo "capture session: $SESS -> $CAPTURE_URL"

cleanup() {
  /usr/bin/time -p playwright-cli "-s=$SESS" close 2>/dev/null || true
}
trap cleanup EXIT

wait_ready() {
  local attempt ready
  ready=false
  for ((attempt=0; attempt<30; attempt++)); do
    if /usr/bin/time -p playwright-cli "-s=$SESS" eval "() => document.querySelector('#player-hand .card, #table, main, canvas') ? 'ready-marker' : 'not-ready'" 2>/dev/null | grep -q ready-marker; then
      ready=true
      break
    fi
    /usr/bin/time -p sleep 2
  done
  [[ "$ready" == true ]]
}

/usr/bin/time -p playwright-cli "-s=$SESS" open "$CAPTURE_URL"
wait_ready || { echo 'Desktop view did not render content.' >&2; exit 1; };
/usr/bin/time -p playwright-cli "-s=$SESS" resize 1280 800
/usr/bin/time -p sleep 1
/usr/bin/time -p playwright-cli "-s=$SESS" screenshot --filename "$CAPTURE_DIR/final-desktop.png"

/usr/bin/time -p playwright-cli "-s=$SESS" resize 390 844
/usr/bin/time -p playwright-cli "-s=$SESS" goto "$CAPTURE_URL"
wait_ready || { echo 'Mobile view did not render content.' >&2; exit 1; }
/usr/bin/time -p sleep 1
/usr/bin/time -p playwright-cli "-s=$SESS" screenshot --filename "$CAPTURE_DIR/final-mobile.png"

for name in final-desktop.png final-mobile.png; do
  /usr/bin/time -p test -f "$CAPTURE_DIR/$name"
  /usr/bin/time -p test -s "$CAPTURE_DIR/$name"
  if ! /usr/bin/time -p head -c 8 "$CAPTURE_DIR/$name" | /usr/bin/time -p od -An -tx1 | grep -q '89 50 4e 47 0d 0a 1a 0a'; then
    echo "Capture did not produce a PNG: $name" >&2
    exit 1
  fi
done

/usr/bin/time -p ls -la "$CAPTURE_DIR"
/usr/bin/time -p playwright-cli "-s=$SESS" close
trap - EXIT
echo 'Capture complete.'
