#!/usr/bin/env bash
# Capture the app at CAPTURE_URL into CAPTURE_DIR as final-desktop.png + final-mobile.png.
# Opens the exact URL, waits for rendered content, closes its own browser.
# Leaves any app server running. Output stays in CAPTURE_DIR (outside the source tree).
set -euo pipefail
/usr/bin/time -p bash -c 'test -n "${CAPTURE_URL:?CAPTURE_URL is required}"'
/usr/bin/time -p bash -c 'test -n "${CAPTURE_DIR:?CAPTURE_DIR is required}"'
/usr/bin/time -p mkdir -p "$CAPTURE_DIR"
/usr/bin/time -p bash -c 'command -v playwright-cli'
SESSION="capture-$$"
/usr/bin/time -p bash -c 'command -v timeout'
close_browser() {
  /usr/bin/time -p playwright-cli "-s=$SESSION" close >/dev/null 2>&1 || true
}
trap close_browser EXIT
# Work from CAPTURE_DIR so any playwright-cli sidecar files land outside the source tree.
/usr/bin/time -p bash -c 'cd "$0"' "$CAPTURE_DIR"
cd "$CAPTURE_DIR"
/usr/bin/time -p timeout 120 playwright-cli "-s=$SESSION" open "$CAPTURE_URL"
/usr/bin/time -p timeout 60 playwright-cli "-s=$SESSION" resize 1280 800
/usr/bin/time -p timeout 120 playwright-cli "-s=$SESSION" goto "$CAPTURE_URL"
wait_ready() {
  local attempt out
  for attempt in $(/usr/bin/time -p seq 1 45); do
    out=$(/usr/bin/time -p timeout 60 playwright-cli "-s=$SESSION" eval "() => ({rs: document.readyState, canvas: !!document.querySelector('canvas'), ready: !!(window.__game && window.__game.ready)})" 2>&1) || true
    printf '%s\n' "attempt $attempt: $out" >> "$CAPTURE_DIR/wait.log"
    if printf '%s' "$out" | grep -q '"ready": *true'; then
      return 0
    fi
    if [ "$attempt" = 20 ]; then
      /usr/bin/time -p timeout 120 playwright-cli "-s=$SESSION" reload || true
    fi
    /usr/bin/time -p sleep 2
  done
  return 1
}
time -p wait_ready
/usr/bin/time -p sleep 3
/usr/bin/time -p timeout 120 playwright-cli "-s=$SESSION" screenshot --filename="$CAPTURE_DIR/final-desktop.png"
/usr/bin/time -p timeout 60 playwright-cli "-s=$SESSION" resize 390 844
/usr/bin/time -p timeout 120 playwright-cli "-s=$SESSION" reload
time -p wait_ready
/usr/bin/time -p sleep 3
/usr/bin/time -p timeout 120 playwright-cli "-s=$SESSION" screenshot --filename="$CAPTURE_DIR/final-mobile.png"
time -p close_browser
trap - EXIT
/usr/bin/time -p bash -c 'test -f "$0/final-desktop.png" && test -f "$0/final-mobile.png"' "$CAPTURE_DIR"
/usr/bin/time -p bash -c 'test "$(stat -c%s "$0/final-desktop.png")" -gt 1024 && test "$(stat -c%s "$0/final-mobile.png")" -gt 1024' "$CAPTURE_DIR"
/usr/bin/time -p bash -c 'test "$(head -c 8 "$0/final-desktop.png" | od -An -tx1 | tr -d " \\n")" = "89504e470d0a1a0a"' "$CAPTURE_DIR"
/usr/bin/time -p bash -c 'test "$(head -c 8 "$0/final-mobile.png" | od -An -tx1 | tr -d " \\n")" = "89504e470d0a1a0a"' "$CAPTURE_DIR"
/usr/bin/time -p ls -la "$CAPTURE_DIR"
