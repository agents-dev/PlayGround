#!/usr/bin/env bash
# cURL equivalent for the hosted-sandbox report task.
# Requires: OPENAI_API_KEY with api.agents.read/write + api.responses.write
set -euo pipefail
: "${OPENAI_API_KEY:?Set OPENAI_API_KEY first (see .env.example)}"

echo "== create session (streams events) =="
curl --no-buffer --fail-with-body https://api.openai.com/v1/agents/sessions \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agent": { "model": "gpt-6-astra" },
    "environment": {
      "type": "openai_hosted",
      "network": { "access": "disabled" },
      "files": [{ "type": "inline", "path": "/workspace/amounts.csv", "data": "YW1vdW50CjEwCjIwCjMwCg==" }]
    },
    "input": "Use Python to sum the amount column in /workspace/amounts.csv. Write a JSON object with the total to /workspace/outputs/summary.json, then read it back to verify it.",
    "stream": true
  }'
echo
echo "== next: save session.id, wait for agent.session.turn.completed,"
echo "== list artifacts, download /workspace/outputs/summary.json, delete session =="
echo "== see examples/report.py:download_artifact and quickstart cleanup docs =="
