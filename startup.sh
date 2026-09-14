#!/usr/bin/env bash
# .kkrieger fps Madness 96KB — startup script.
# Fresh-Actions-runner safe: changes to its own directory, installs
# dependencies when declared, builds when required, then serves the
# playable entrypoint on ${PORT:-3000} in the foreground.
# Idempotent: repeated launches reuse installed dependencies.
# Tunnel publishing stays in the GitHub workflow, not here.
set -euo pipefail

PORT="${PORT:-3000}"
export PORT

# 0. Run from the project root regardless of caller cwd.
/usr/bin/time -p bash -c 'cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd'
cd "$(dirname "${BASH_SOURCE[0]:-$0}")"

/usr/bin/time -p command -v node
/usr/bin/time -p node --version

# 1. Playable entrypoint must exist: ./index.html or ./dist/index.html.
/usr/bin/time -p test -f index.html || /usr/bin/time -p test -f dist/index.html
if [ -f dist/index.html ]; then
  SERVE_ROOT="$PWD/dist"
else
  SERVE_ROOT="$PWD"
fi
export SERVE_ROOT
echo "entrypoint: ${SERVE_ROOT}/index.html"
/usr/bin/time -p test -f "${SERVE_ROOT}/index.html"
/usr/bin/time -p test -f server.mjs

# 2. Dependencies: no-op unless package.json declares them (reuses node_modules).
if [ -f package.json ]; then
  /usr/bin/time -p npm install
else
  echo "no package.json — skipping dependency install (zero-dependency static app)"
fi

# 3. Build when required: no-op unless package.json declares a build script.
if [ -f package.json ] && /usr/bin/time -p node -e "process.exit(require('./package.json').scripts?.build?0:1)"; then
  /usr/bin/time -p npm run build
  /usr/bin/time -p test -f index.html || /usr/bin/time -p test -f dist/index.html
  if [ -f dist/index.html ]; then
    SERVE_ROOT="$PWD/dist"
    export SERVE_ROOT
  fi
else
  echo "no build script — serving static files directly"
fi

# 4. Serve in the foreground.
echo "kkrieger-96k serving ${SERVE_ROOT}/index.html on ${PORT}"
exec node server.mjs
