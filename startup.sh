#!/usr/bin/env bash
# Validation startup for the static Worms 3D project.
# - Runs from the script's own directory (portable: no assumptions about CWD).
# - Validates PORT (positive integer, default 3000).
# - Verifies the browser entrypoint (index.html or dist/index.html).
# - Installs dependencies and builds only when the project needs it
#   (package.json present); this game is dependency-free static files.
# - Serves in the foreground on PORT.
# - Times every step (repo convention: /usr/bin/time -p per command).
set -euo pipefail
PORT="${PORT:-3000}"
export PORT
DIR="$(cd "$(dirname "$0")" && pwd)"
# Portable per-command timing: prefer /usr/bin/time -p, fall back to plain
# execution where it is unavailable (e.g. minimal containers).
if [ -x /usr/bin/time ]; then
  run() { /usr/bin/time -p "$@"; }
else
  run() { "$@"; }
fi
run bash -n "$DIR/startup.sh"
run test "$PORT" -ge 1 2>/dev/null || { echo "startup: PORT must be a positive integer (got '${PORT}')" >&2; exit 1; }
run test -f "$DIR/index.html" || run test -f "$DIR/dist/index.html" || { echo "startup: no index.html or dist/index.html in $DIR" >&2; exit 1; }
if command -v python3 >/dev/null 2>&1; then
  PY=python3
elif command -v python >/dev/null 2>&1; then
  PY=python
else
  echo "startup: python3 not found in PATH" >&2; exit 1
fi
cd "$DIR"
if run test -f ./package.json; then
  if run test -f ./package-lock.json; then
    run npm ci
  elif run test -f ./bun.lockb && command -v bun >/dev/null 2>&1; then
    run bun install
  else
    run npm install
  fi
  if run "$PY" -c "import json,sys; sys.exit(0 if json.load(open('./package.json')).get('scripts',{}).get('build') else 1)"; then
    run npm run build
  fi
fi
echo "startup: serving $DIR on http://127.0.0.1:${PORT}/ (foreground; Ctrl-C to stop)" >&2
run "$PY" -m http.server "$PORT" --bind 127.0.0.1
