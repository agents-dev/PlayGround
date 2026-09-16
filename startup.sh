#!/usr/bin/env bash
# startup.sh — install dependencies, build when needed, serve foreground on PORT (default 3000).
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"
echo "startup.sh working directory: $PWD"

/usr/bin/time -p node --version
/usr/bin/time -p test -f package.json
/usr/bin/time -p test -f start.mjs

# Install dependencies when a manifest exists but node_modules is absent.
if /usr/bin/time -p test ! -d node_modules; then
  /usr/bin/time -p npm install --no-audit --no-fund
else
  echo 'node_modules present; skipping npm install.'
fi

# Build only when package.json defines a build script.
if /usr/bin/time -p node -e "process.exit(require('./package.json').scripts && require('./package.json').scripts.build ? 0 : 1)"; then
  /usr/bin/time -p npm run build
else
  echo 'No build script; skipping build.'
fi

PORT="${PORT:-3000}"
export PORT
echo "Serving Hearthstone clone on port $PORT"
/usr/bin/time -p node start.mjs --port "$PORT"
