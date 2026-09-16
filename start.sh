#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

/usr/bin/time -p npm install --no-audit --no-fund
/usr/bin/time -p npm run build

# Static export output from Next.js (`output: 'export'` -> ./out)
OUT_DIR="$PWD/out"
/usr/bin/time -p test -f "$OUT_DIR/index.html"

# Declare deployment output for OMGithub publishing
if [[ -n "${OPENCODE_WEB_DIR:-}" ]]; then
  /usr/bin/time -p mkdir -p "$OPENCODE_WEB_DIR"
/usr/bin/time -p node -e "require('fs').writeFileSync(require('path').join(process.env.OPENCODE_WEB_DIR,'deployment-output.json'), JSON.stringify({project: process.cwd(), directory: require('path').join(process.cwd(),'out')}))"
fi

# Serve static output on $PORT
PORT="${PORT:-3000}"
export PORT OUT_DIR
/usr/bin/time -p node ./scripts/serve-out.mjs
