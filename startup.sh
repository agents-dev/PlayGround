#!/usr/bin/env bash
# Turbo League portable entrypoint.
# - changes to its own directory
# - installs dependencies (timed)
# - builds when a build script exists (timed)
# - serves the app in the foreground on ${PORT:-3000} (timed startup)
set -eu

cd "$(dirname "$0")"

PORT="${PORT:-3000}"
export PORT

timed() {
  _label="$1"; shift
  _start=$(date +%s)
  echo "==> [startup] start: ${_label} (+ $*)"
  "$@"
  _code=$?
  _end=$(date +%s)
  _dur=$((_end - _start))
  echo "==> [startup] done: ${_label} in ${_dur}s (exit ${_code})"
  return $_code
}

timed_skip() {
  _label="$1"; shift
  echo "==> [startup] skip: ${_label} ($*)"
}

echo "==> [startup] root: $(pwd)  port: ${PORT}"

# 1) Install dependencies (only when manifests exist)
if [ -f package.json ] && command -v npm >/dev/null 2>&1; then
  timed "install dependencies" npm install --no-audit --no-fund
elif [ -f requirements.txt ] && command -v pip3 >/dev/null 2>&1; then
  timed "install dependencies" pip3 install -r requirements.txt
elif [ -f package.json ]; then
  timed_skip "install dependencies" "npm not found, skipping npm install"
else
  timed_skip "install dependencies" "no manifest, nothing to install"
fi

# 2) Build when needed (only when a build script is defined)
if [ -f package.json ] && command -v npm >/dev/null 2>&1 && npm run | grep -q " build"; then
  timed "build" npm run build
else
  timed_skip "build" "no build script, static app needs no build"
fi

# 3) Serve in the foreground
echo "==> [startup] start: serve (foreground on port ${PORT})"
_serve_start=$(date +%s)
if command -v node >/dev/null 2>&1 && [ -f server.js ]; then
  echo "==> [startup] serving with node server.js"
  _serve_end=$(date +%s)
  echo "==> [startup] server ready in $((_serve_end - _serve_start))s -> http://localhost:${PORT}"
  exec node server.js
elif command -v python3 >/dev/null 2>&1; then
  echo "==> [startup] serving with python3 http.server"
  _serve_end=$(date +%s)
  echo "==> [startup] server ready in $((_serve_end - _serve_start))s -> http://localhost:${PORT}"
  exec python3 -m http.server "${PORT}"
else
  echo "==> [startup] ERROR: no runtime found (need node or python3)" >&2
  exit 1
fi
