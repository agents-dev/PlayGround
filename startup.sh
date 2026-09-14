#!/usr/bin/env bash
set -euo pipefail
PORT="${PORT:-3000}"
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"
echo "kkrieger-96k listening on $PORT"
exec node server.mjs
