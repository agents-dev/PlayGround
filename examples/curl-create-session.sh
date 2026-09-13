#!/bin/sh
# curl equivalent from the docs. Needs OPENAI_API_KEY in the environment.
# Keep the key outside the sandbox.
set -eu
curl --no-buffer --fail-with-body https://api.openai.com/v1/agents/sessions \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "agent": {
    "model": "gpt-6-astra"
  },
  "environment": {
    "type": "openai_hosted",
    "network": {
      "access": "disabled"
    },
    "files": [
      {
        "type": "inline",
        "path": "/workspace/amounts.csv",
        "data": "YW1vdW50CjEwCjIwCjMwCg=="
      }
    ]
  },
  "input": "Use Python to sum the amount column in /workspace/amounts.csv. Write a JSON object with the total to /workspace/outputs/summary.json, then read it back to verify it.",
  "stream": true
}'
