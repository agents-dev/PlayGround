#!/usr/bin/env bash
# Playable browser entrypoint launcher.
# - Changes to its own directory (portable on fresh runners)
# - Installs dependencies (idempotent, safe to re-run)
# - Builds only when a build script exists
# - Serves the app in the FOREGROUND on ${PORT:-3000}
set -euo pipefail

cd "$(dirname "$0")"
PORT="${PORT:-3000}"
export PORT

# Per-command timing: prefer /usr/bin/time -p, fall back to date-based timing.
timed() {
  if [ -x /usr/bin/time ]; then
    /usr/bin/time -p "$@"
  else
    start=$(date +%s)
    "$@"
    code=$?
    end=$(date +%s)
    echo "elapsed ${end}s (fallback timer, exit ${code})" >&2
    return $code
  fi
}

echo "workdir: $(pwd)"
echo "port: ${PORT}"

timed node --version
timed npm --version

if [ -f package-lock.json ]; then
  timed npm ci --no-audit --no-fund
elif [ -f package.json ]; then
  timed npm install --no-audit --no-fund
else
  echo "no package.json; skipping dependency install"
fi

if [ -f index.html ] || [ -f dist/index.html ]; then
  echo "entrypoint check: OK"
else
  echo "missing playable entrypoint: expected ./index.html or ./dist/index.html" >&2
  exit 1
fi
timed test -f startup.sh

# Build only when the project defines one (keeps static sites fast/offline-safe).
if [ -f package.json ] && [ "$(npm pkg get scripts.build 2>/dev/null || echo '{}')" != "{}" ]; then
  timed npm run build
else
  echo "no build script; skipping build"
fi

# Serve in the foreground (no backgrounding, no tmux here; the caller decides that).
if [ ! -f index.html ] && [ -f dist/index.html ]; then
  echo "serving dist/ on port ${PORT}"
  cd dist
fi

if [ -f package.json ] && [ "$(npm pkg get scripts.start 2>/dev/null || echo '{}')" != "{}" ]; then
  timed npm start
elif [ -f ../server.mjs ]; then
  timed node ../server.mjs
elif [ -f server.mjs ]; then
  timed node server.mjs
else
  timed npx --yes serve -l "${PORT}" .
fi
