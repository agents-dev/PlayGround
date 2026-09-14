#!/bin/sh
# Start the browser FPS prototype on port 3000.
# Reuses serve.py (raw sockets, no reverse-DNS lookups that hang stdlib http.server).
set -e
cd "$(dirname "$0")"
if [ ! -f ./index.html ] && [ ! -f ./dist/index.html ]; then
  echo "startup.sh: no playable entrypoint (./index.html or ./dist/index.html)" >&2
  exit 1
fi
if [ -f ./dist/index.html ]; then
  echo "startup.sh: serving $(pwd) (dist/index.html present)"
else
  echo "startup.sh: serving $(pwd) (./index.html present)"
fi
exec python3 serve.py 3000
