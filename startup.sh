#!/usr/bin/env bash
# Arena Strike FPS demo — startup script for fresh Actions runners.
# Serves the static browser app in the FOREGROUND on ${PORT:-3000}.
# Tunnel setup is owned by the workflow, not this script.
set -euo pipefail

# Always operate from this script's own directory (the project root).
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

PORT="${PORT:-3000}"

# Per-command timing helper: prints start/end + elapsed for each step.
t() {
  local label="$1"; shift
  local start end rc
  start="$(date +%s.%N)"
  echo "[startup] START ${label}"
  set +e
  if [ -x /usr/bin/time ]; then
    /usr/bin/time -p "$@" 2>&1
  else
    "$@" 2>&1
  fi
  rc=$?
  set -e
  end="$(date +%s.%N)"
  echo "[startup] END ${label} rc=${rc} elapsed=$(awk "BEGIN{print ${end}-${start}}")s"
  return "$rc"
}

echo "[startup] project root: ${ROOT}"
echo "[startup] port: ${PORT}"

# 1) Entrypoint check: a playable HTML file must exist before serving.
if [ -f "${ROOT}/index.html" ]; then
  ENTRY="index.html"
elif [ -f "${ROOT}/dist/index.html" ]; then
  ENTRY="dist/index.html"
else
  echo "[startup] FATAL: no ./index.html or ./dist/index.html found" >&2
  exit 1
fi
echo "[startup] entrypoint: ${ENTRY}"

# 2) Dependencies (idempotent): this is a dependency-free static app.
#    Reuses existing runtimes; only verifies a Python 3 interpreter exists.
#    Kept as an explicit step so repeated launches are safe no-ops.
if ! command -v python3 >/dev/null 2>&1; then
  echo "[startup] FATAL: python3 is required but not installed" >&2
  exit 1
fi
t "python-version" python3 --version

# 3) Build step: none required for the static single-file app.
#    If a dist/ build ever becomes the entrypoint, build it here.
if [ "$ENTRY" = "dist/index.html" ] && [ -f "${ROOT}/package.json" ] && [ ! -d "${ROOT}/dist" ]; then
  echo "[startup] dist entrypoint requested but dist/ missing and no build defined" >&2
  exit 1
fi
echo "[startup] build: not required (static app)"

# 4) Serve in the foreground so the workflow session owns the lifetime.
echo "[startup] serving ${ENTRY} on port ${PORT} (foreground)"
t "serve" python3 -m http.server "$PORT" --directory "$ROOT"
