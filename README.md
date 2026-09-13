# PlayGround — OpenAI-hosted sandboxes

Run an agent in an OpenAI-hosted Linux sandbox (`environment.type=openai_hosted`).

Source: https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted

## Prereqs

```bash
export OPENAI_API_KEY="your-api-key"  # scopes: api.agents.read/write, api.responses.write
npm install        # node >= 18, pulls `openai`
pip install -r requirements.txt
```

Keep the key outside the sandbox. SDKs send `OpenAI-Beta: agents=v1` automatically.

## Run

```bash
node examples/quickstart.mjs   # create + run tree.py, stream events
python examples/quickstart.py

node examples/report.mjs       # sum amounts.csv -> /workspace/outputs/summary.json, download artifact, delete session
python examples/report.py
bash examples/report.sh        # curl equivalent (stream only; then list artifacts/download/delete)
```

Expected artifact: `{"total": 60}`.

## Notes

- Working dir in sandbox is `/workspace`; publish keepsakes under `/workspace/outputs`.
- Setup: `packages` / `setup_commands` / `files` / `env` run before the agent; nonzero setup exit blocks start.
- Network: `enabled` (default) | `disabled` | `restricted` (+ `allowed_domains`, 1–100 exact hosts).
- After `agent.session.turn.completed`, list artifacts, match `turn_id` + `path`, download, then delete session (retry on 409).
- `agent.session.turn.completed` alone doesn't guarantee every tool succeeded — inspect items/output.
- Sandboxes idle ~1h may be deleted; artifacts under `/workspace/outputs` survive expiry.