#!/usr/bin/env bash
# Serve the Hotline Miami 3D static project in the foreground on $PORT (default 3000).
set -euo pipefail

/usr/bin/time -p bash -c 'cd "$(dirname "$0")" && pwd'
cd "$(dirname "$0")"

/usr/bin/time -p bash -c 'echo "startup dir: $(pwd) PORT=${PORT:-3000}"'

PORT="${PORT:-3000}"
export PORT

# Install dependencies when a manifest exists (static project: usually skipped).
if /usr/bin/time -p test -f package.json; then
  if /usr/bin/time -p test -f package-lock.json; then
    /usr/bin/time -p npm ci --no-audit --no-fund
  else
    /usr/bin/time -p npm install --no-audit --no-fund
  fi
  # Build when a build script is declared.
  if /usr/bin/time -p npm run | grep -q " build"; then
    /usr/bin/time -p npm run build
  fi
else
  /usr/bin/time -p echo "no package.json: static serve only"
fi

# Entrypoint check.
/usr/bin/time -p test -f index.html

/usr/bin/time -p echo "serving on 127.0.0.1:${PORT}"
# Foreground server (controller owns the tmux session; do not background here).
/usr/bin/time -p python3 -m http.server "${PORT}" --bind 127.0.0.1
