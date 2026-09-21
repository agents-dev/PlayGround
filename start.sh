#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
PROJECT_ROOT="$(pwd)"
/usr/bin/time -p bash -c 'PORT="${PORT:-3000}"; echo "PORT=$PORT"'
PORT="${PORT:-3000}"
STATIC_DIR="$PROJECT_ROOT"
WEB_DIR="${OPENCODE_WEB_DIR:-$PROJECT_ROOT/.opencode-web}"
/usr/bin/time -p mkdir -p "$WEB_DIR"
/usr/bin/time -p test -f "$STATIC_DIR/index.html"
if /usr/bin/time -p test -f "$PROJECT_ROOT/package.json"; then
  if /usr/bin/time -p test -f "$PROJECT_ROOT/package-lock.json"; then
    /usr/bin/time -p npm ci --no-audit --no-fund
  else
    /usr/bin/time -p npm install --no-audit --no-fund
  fi
  if /usr/bin/time -p npm run --silent build --if-present; then
    true
  fi
  if /usr/bin/time -p test -f "$PROJECT_ROOT/dist/index.html"; then
    STATIC_DIR="$PROJECT_ROOT/dist"
  fi
fi
export PROJECT_ROOT STATIC_DIR WEB_DIR
/usr/bin/time -p node -e 'const fs=require("fs");const path=require("path");const out=path.join(process.env.WEB_DIR,"deployment-output.json");fs.writeFileSync(out,JSON.stringify({project:process.env.PROJECT_ROOT,directory:process.env.STATIC_DIR}));'
/usr/bin/time -p cat "$WEB_DIR/deployment-output.json"
exec python3 -m http.server "$PORT" --directory "$STATIC_DIR" --bind 0.0.0.0
