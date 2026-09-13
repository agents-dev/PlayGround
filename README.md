# PlayGround — OpenAI-hosted sandboxes demo

Source: https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted
(via https://share.google/ZBAQrKytHIFELNpfW)

An OpenAI-hosted sandbox gives an agent a Linux workspace (`/workspace`)
with Python, Node.js, and CLI tools. OpenAI provisions and connects it;
your app supplies the task and retrieves results.

This repo is a minimal, offline-verifiable demo of that flow.
All project changes are intentionally left **uncommitted** —
the OpenCode workflow commits the source and pushes the result branch.

## What this demo does

Implements the docs example "Create a report":

- Input CSV (`examples/amounts.csv`) containing `10`, `20`, `30`
- Agent instruction: sum the `amount` column with Python,
  write `{ "total": 60 }` to `/workspace/outputs/summary.json`, read it back
- Network mode: `disabled`
- Files supplied inline as base64; outputs under `/workspace/outputs`
  are published as immutable artifacts when a turn completes

## Files

- `index.html` — browser entrypoint + interactive local CSV-sum demo
- `src/csvSum.js` — pure CSV-sum logic shared by browser and Node (offline)
- `src/hostedSandbox.js` — payload builder + session runner (Agents API, beta)
- `src/createReport.js` — JS end-to-end example (needs `OPENAI_API_KEY`)
- `src/create_report.py` — Python end-to-end example (needs `OPENAI_API_KEY`)
- `examples/amounts.csv` — sample input
- `examples/curl-create-session.sh` — curl equivalent from the docs
- `tests/test.mjs` — offline tests (no network, no API key)

## Configure the sandbox (from docs)

`environment.type = "openai_hosted"`, working directory `/workspace`:

- `packages`: `python` / `system` / `npm` lists, pin versions (e.g. `pandas==2.2.3`)
- `setup_commands`: ordered shell commands before the agent starts,
  e.g. `[{ "command": "mkdir -p reports" }]`
- `files`: Files API ID or inline base64 content
- `env`: string env vars (`PATH`, `CODEX_*`, `OPENAI_API_KEY` rejected)
- `skills`, `plugins`, `capability_directories`
- `environment_template_id`: reuse saved config; network overrides
  cannot broaden its policy

| `network.access` | behavior |
| --- | --- |
| `enabled` | allow outbound (default unless template says otherwise) |
| `disabled` | block outbound |
| `restricted` | allow only `allowed_domains` (1–100 exact hostnames, no wildcards/protocols/paths/ports) |

Check setup: `GET /v1/agents/environments/{environment_id}` —
`provisioning` = running, `connected` = ready, `failed` = read
`environment.error` in the `agent.session.environment.failed` event.
Wait for `connected` before live file ops.

## Run (live, needs key)

```sh
export OPENAI_API_KEY=sk-...
npm install
node src/createReport.js
# or
pip install openai
python src/create_report.py
# or
bash examples/curl-create-session.sh
```

Save `session.id` from `agent.session.created`. After
`agent.session.turn.completed`, list artifacts, download
`summary.json` — expect `{ "total": 60 }`.
A completed turn does not guarantee every tool succeeded;
on failure inspect session items. Delete the session when done
(retry on `409`); closing the event stream does not cancel the task.
Sandbox expires after ~1h without activity/keep-alives.
See [pricing](https://developers.openai.com/api/docs/pricing#built-in-tools).

## Verify (offline, no key)

```sh
npm test
```

Covers: base64 round-trip of the CSV, CSV-sum logic (`60`),
payload shape (`type: openai_hosted`, `network.access: disabled`,
inline file path, model, input), and `summary.json` shape.

## Troubleshooting (from docs)

| problem | check |
| --- | --- |
| setup fails | environment-failure event; fix package/file/setup-command |
| request blocked | `network` + redirect hosts |
| live file op fails | sandbox `connected`? expired? recreate + resupply inputs |
| status/file-list `5xx` | retry with backoff + deadline, keep request ID |
