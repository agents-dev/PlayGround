#!/bin/sh
# Validation startup for the StarCraft 3D pocket RTS (static site).
# Portable POSIX sh: cd to script dir -> install deps -> build (when needed)
# -> serve in the FOREGROUND on $PORT (default 3000). Each phase is timed.
# Game sources are left untouched; only startup/build setup lives here.
set -eu

PORT="${PORT:-3000}"
export PORT

SCRIPT_DIR="$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)"
cd "$SCRIPT_DIR"

elapsed() { # $1 = start epoch seconds -> prints elapsed seconds
  _now=$(date +%s)
  printf '%s' "$((_now - $1))"
}

phase_begin() { # $1 = label
  printf '[startup] >>> %s ...\n' "$1"
  _phase_start=$(date +%s)
}

phase_end() { # $1 = label
  printf '[startup] <<< %s done in %ss\n' "$1" "$(elapsed "$_phase_start")"
}

TOTAL_START=$(date +%s)

# --- 1. runtime check ---
phase_begin "runtime check (node)"
command -v node >/dev/null 2>&1 || {
  echo "[startup] ERROR: node is required but not found on PATH" >&2
  exit 1
}
node --version
phase_end "runtime check (node)"

# --- 2. dependencies (only when a manifest exists) ---
phase_begin "install dependencies"
if [ -f package-lock.json ]; then
  npm ci --no-audit --no-fund
elif [ -f package.json ]; then
  npm install --no-audit --no-fund
else
  echo "[startup] no package.json; nothing to install (static site, CDN deps only)"
fi
phase_end "install dependencies"

# --- 3. build (only when a build script exists) ---
phase_begin "build"
if [ -f package.json ] && node -e "process.exit(require('./package.json').scripts && require('./package.json').scripts.build ? 0 : 1)" 2>/dev/null; then
  npm run build
else
  echo "[startup] no build script; skipping (no build step for this static site)"
fi
phase_end "build"

# --- 4. serve in the foreground (controller owns this process) ---
phase_begin "serve"
echo "[startup] serving ${SCRIPT_DIR} on port ${PORT} (foreground, pid $$)"
echo "[startup] total setup time: $(elapsed "$TOTAL_START")s"
exec node server.js
