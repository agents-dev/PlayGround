#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
/usr/bin/time -p bash -n start.sh
URL="${CAPTURE_URL:-http://127.0.0.1:3000}"
DIR="${CAPTURE_DIR:-./screenshots}"
mkdir -p "$DIR"
/usr/bin/time -p playwright-cli --help >/dev/null
echo "capturing $URL -> $DIR"
/usr/bin/time -p playwright-cli open "$URL"
# wait for Three.js scene-ready signal
/usr/bin/time -p playwright-cli eval 'async () => { const t0 = Date.now(); while (Date.now() - t0 < 25000) { if (window.__sceneReady) return "ready:" + (Date.now()-t0) + "ms"; await new Promise(r => setTimeout(r, 300)); } return "timeout-ready=" + !!window.__sceneReady; }'
/usr/bin/time -p sleep 2
# dismiss menu -> enter FPS gameplay so screenshots show real 3D action
/usr/bin/time -p playwright-cli eval 'async () => { const b = document.getElementById("deploy-btn"); if (b) b.click(); await new Promise(r=>setTimeout(r,3500)); return "playing=" + (window.__game ? window.__game.G.playing : "?"); }'
/usr/bin/time -p playwright-cli resize 1440 900
/usr/bin/time -p sleep 1
/usr/bin/time -p playwright-cli screenshot --filename="$DIR/final-desktop.png"
/usr/bin/time -p playwright-cli resize 390 844
/usr/bin/time -p sleep 1
/usr/bin/time -p playwright-cli screenshot --filename="$DIR/final-mobile.png"
/usr/bin/time -p playwright-cli close
ls -la "$DIR/final-desktop.png" "$DIR/final-mobile.png"
echo "capture done"
