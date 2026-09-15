#!/usr/bin/env bash
# BrutalStrike startup: install deps, build when needed, serve dist in foreground.
# Serves on PORT (defaults to 3000). Keeps running in the foreground for tmux.
set -euo pipefail
/usr/bin/time -p bash -c 'cd "$(dirname "$0")"'
cd "$(dirname "$0")"
PORT="${PORT:-3000}"
export PORT
/usr/bin/time -p bash -c 'test -f package.json'
if /usr/bin/time -p test ! -d node_modules; then
  /usr/bin/time -p npm install --no-audit --no-fund
else
  /usr/bin/time -p npm install --no-audit --no-fund --prefer-offline
fi
if /usr/bin/time -p bash -c 'test ! -f dist/index.html || find index.html vite.config.js package.json src public -newer dist/index.html -print -quit 2>/dev/null | grep -q .'; then
  /usr/bin/time -p npm run build
else
  /usr/bin/time -p echo 'dist is up to date; skipping build'
fi
/usr/bin/time -p bash -c 'test -f dist/index.html'
exec /usr/bin/time -p npx vite preview --port "$PORT" --host --strictPort
