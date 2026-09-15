#!/usr/bin/env bash
# Rocket League 3D — portable startup script.
# - changes to its own directory
# - installs dependencies
# - builds when a build script exists
# - serves the app in the foreground on ${PORT:-3000}
# - prints per-command timing
set -euo pipefail

cd "$(dirname "$0")"

PORT="${PORT:-3000}"
export PORT

now_s() { date +%s; }

timed() {
  local label="$1"; shift
  local start end dur code
  start=$(now_s)
  echo "==> [startup] start: ${label} ($*)"
  set +e
  "$@"
  code=$?
  set -e
  end=$(now_s)
  dur=$((end - start))
  if [ "$code" -ne 0 ]; then
    echo "==> [startup] FAIL: ${label} after ${dur}s (exit ${code})" >&2
    exit "$code"
  fi
  echo "==> [startup] done: ${label} in ${dur}s"
}

echo "==> [startup] dir: $(pwd)  port: ${PORT}"

if ! command -v node >/dev/null 2>&1; then
  echo "==> [startup] ERROR: node is required but not installed" >&2
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "==> [startup] ERROR: npm is required but not installed" >&2
  exit 1
fi

timed "check node/npm" node --version
timed "check npm" npm --version

if [ -f package.json ]; then
  if [ -f package-lock.json ] && command -v npm >/dev/null 2>&1; then
    if [ ! -d node_modules ]; then
      timed "install dependencies (npm ci)" npm ci --no-audit --no-fund
    else
      timed "install dependencies (npm ci --prefer-offline)" npm ci --no-audit --no-fund --prefer-offline || timed "install dependencies fallback (npm install)" npm install --no-audit --no-fund
    fi
  else
    timed "install dependencies (npm install)" npm install --no-audit --no-fund
  fi
else
  echo "==> [startup] no package.json, skipping install"
fi

# Build when a build script exists (e.g. vite build -> dist/).
if [ -f package.json ] && node -e "process.exit(require('./package.json').scripts && require('./package.json').scripts.build ? 0 : 1)" 2>/dev/null; then
  timed "build" npm run build
else
  echo "==> [startup] no build script, skipping build"
fi

echo "==> [startup] serving on http://0.0.0.0:${PORT} (foreground)"

# Prefer vite preview (serves dist/); fall back to a static server for dist/ or root.
if [ -d dist ] && [ -f package.json ] && node -e "try{require('./node_modules/vite/package.json');process.exit(0)}catch{process.exit(1)}" 2>/dev/null; then
  start=$(now_s)
  echo "==> [startup] start: serve (npx vite preview --host 0.0.0.0 --port ${PORT})"
  exec npx vite preview --host 0.0.0.0 --port "${PORT}"
elif [ -d dist ]; then
  if command -v python3 >/dev/null 2>&1; then
    start=$(now_s)
    echo "==> [startup] start: serve (python3 http.server for dist/)"
    exec python3 -m http.server "${PORT}" --bind 0.0.0.0 --directory dist
  else
    exec npx --yes serve -s dist -l "${PORT}"
  fi
else
  if command -v python3 >/dev/null 2>&1; then
    start=$(now_s)
    echo "==> [startup] start: serve (python3 http.server for ./)"
    exec python3 -m http.server "${PORT}" --bind 0.0.0.0
  else
    exec npx --yes serve -s . -l "${PORT}"
  fi
fi
