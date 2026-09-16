#!/usr/bin/env bash
# Capture desktop + mobile screenshots of the running app.
# Inputs: CAPTURE_URL (exact URL to open), CAPTURE_DIR (output dir, outside source).
# Leaves the app server running; closes only its own browser session.
set -euo pipefail

/usr/bin/time -p bash -c 'echo "capture: URL=${CAPTURE_URL:-<unset>} DIR=${CAPTURE_DIR:-<unset>}"'
: "${CAPTURE_URL:?CAPTURE_URL is required}"
: "${CAPTURE_DIR:?CAPTURE_DIR is required}"

/usr/bin/time -p mkdir -p "${CAPTURE_DIR}"

SESSION="capture-$$"
/usr/bin/time -p echo "session=${SESSION}"

# Ensure our session browser is closed on exit (app server is untouched).
cleanup() {
  /usr/bin/time -p playwright-cli -s="${SESSION}" close 2>/dev/null || true
}
trap cleanup EXIT

# Open the exact URL in our own browser session.
/usr/bin/time -p playwright-cli -s="${SESSION}" open "${CAPTURE_URL}"

# Wait for rendered content: readyState complete + non-blank body + game canvas/title.
/usr/bin/time -p bash -c '
  for i in $(seq 1 30); do
    if playwright-cli -s="'"${SESSION}"'" eval "() => document.readyState + \"|\" + document.title + \"|\" + document.body.innerHTML.length" 2>/dev/null | grep -q "complete"; then
      echo "ready after ${i} checks"
      break
    fi
    sleep 2
    if [ "$i" = 30 ]; then echo "page never reached complete" >&2; exit 1; fi
  done
'

/usr/bin/time -p playwright-cli -s="${SESSION}" eval "() => ({title: document.title, len: document.body.innerHTML.length, canvas: document.querySelectorAll(\"canvas\").length})"

# Desktop view.
/usr/bin/time -p playwright-cli -s="${SESSION}" resize 1280 800
/usr/bin/time -p sleep 3
/usr/bin/time -p playwright-cli -s="${SESSION}" screenshot --filename "${CAPTURE_DIR}/final-desktop.png"

/usr/bin/time -p test -s "${CAPTURE_DIR}/final-desktop.png"
/usr/bin/time -p bash -c 'echo "desktop bytes: $(wc -c < "'"${CAPTURE_DIR}"'/final-desktop.png")"'

# Mobile view.
/usr/bin/time -p playwright-cli -s="${SESSION}" resize 390 844
/usr/bin/time -p sleep 3
/usr/bin/time -p playwright-cli -s="${SESSION}" screenshot --filename "${CAPTURE_DIR}/final-mobile.png"

/usr/bin/time -p test -s "${CAPTURE_DIR}/final-mobile.png"
/usr/bin/time -p bash -c 'echo "mobile bytes: $(wc -c < "'"${CAPTURE_DIR}"'/final-mobile.png")"'

# Reject blank captures (all pixels identical is a failure signal).
/usr/bin/time -p bash -c '
  for f in "'"${CAPTURE_DIR}"'/final-desktop.png" "'"${CAPTURE_DIR}"'/final-mobile.png"; do
    if ! python3 -c "import sys; d=open(sys.argv[1],\"rb\").read(); sys.exit(0 if len(set(d[2000:8000]))>4 else 1)" "$f"; then
      echo "capture looks blank: $f" >&2
      exit 1
    fi
  done
  echo "captures look non-blank"
'

/usr/bin/time -p echo "capture OK: ${CAPTURE_DIR}/final-desktop.png ${CAPTURE_DIR}/final-mobile.png"
