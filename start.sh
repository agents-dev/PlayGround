#!/usr/bin/env bash
# Install, build when needed, record deployment output, then serve in the foreground.
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$PROJECT_DIR"
: "${OPENCODE_WEB_DIR:?OPENCODE_WEB_DIR must be set}"
PORT="${PORT:-3000}"
[[ "$PORT" =~ ^[1-9][0-9]*$ ]] || { echo "PORT must be a positive integer." >&2; exit 1; }

# Run a command, print its wall-clock duration and exit status, and return the status.
run_timed() {
  local label="$1"; shift
  local started ended status=0
  started=$(date +%s%N)
  "$@" || status=$?
  ended=$(date +%s%N)
  printf '[time] %s: %d ms (exit %d)\n' "$label" $(( (ended - started) / 1000000 )) "$status"
  return "$status"
}

OUT=""
if [[ -f package.json ]]; then
  # Reinstall only when the manifest or lockfile changes.
  stamp="node_modules/.omgithub-deps-stamp"
  hash="$(cat package.json package-lock.json 2>/dev/null | sha256sum | cut -d' ' -f1)"
  if [[ ! -d node_modules ]] || [[ "$(cat "$stamp" 2>/dev/null)" != "$hash" ]]; then
    if [[ -f package-lock.json ]]; then
      run_timed "npm ci" npm ci --no-audit --no-fund
    else
      run_timed "npm install" npm install --no-audit --no-fund
    fi
    mkdir -p node_modules
    printf '%s' "$hash" > "$stamp"
  else
    echo "[time] dependencies: up to date, skipping install"
  fi

  if node -e 'process.exit(require("./package.json").scripts?.build ? 0 : 1)'; then
    run_timed "npm run build" npm run build
    [[ -f dist/index.html ]] || { echo "Build did not produce dist/index.html." >&2; exit 1; }
    OUT="$PROJECT_DIR/dist"
  elif [[ -f index.html ]]; then
    OUT="$PROJECT_DIR"
  else
    echo "package.json has no build script and there is no index.html to serve." >&2
    exit 1
  fi
elif [[ -f index.html ]]; then
  OUT="$PROJECT_DIR"
else
  echo "No app found in $PROJECT_DIR: add package.json with a build script or an index.html." >&2
  exit 1
fi

mkdir -p "$OPENCODE_WEB_DIR"
run_timed "write deployment-output.json" python3 - "$OPENCODE_WEB_DIR/deployment-output.json" "$PROJECT_DIR" "$OUT" <<'PY'
import json, sys
target, project, directory = sys.argv[1:4]
with open(target, "w") as handle:
    json.dump({"project": project, "directory": directory}, handle)
PY

echo "Serving $OUT on port $PORT"
exec python3 -m http.server "$PORT" --bind 0.0.0.0 --directory "$OUT"
