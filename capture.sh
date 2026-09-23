#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
 : "${CAPTURE_URL:?Set CAPTURE_URL to the exact preview URL}"
 : "${CAPTURE_DIR:?Set CAPTURE_DIR to an output directory}"
/usr/bin/time -p node "${RUNTIME_DIR:?}/scripts/default-capture.mjs"
