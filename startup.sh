#!/usr/bin/env bash
set -euo pipefail
PORT="${PORT:-3000}"
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"
/usr/bin/time -p python3 -m http.server "$PORT" --bind 127.0.0.1
