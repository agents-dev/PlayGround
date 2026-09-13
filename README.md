# PlayGround — OpenAI-Hosted Sandboxes Demo

Offline-runnable demo of the [OpenAI-hosted sandboxes guide](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted)
(`environment.type = "openai_hosted"`, Agents API).

Open `index.html` (static, no build): explains configure → network → `connected` →
`/workspace/outputs` artifacts → expiry/pricing, runs the doc's
`amounts.csv → summary.json` report locally, builds the session payload, and shows
JS/Python/cURL calls. Runnable API copies live in `examples/`.

```sh
npm test            # offline Node tests (CSV sum, payload, validation, index.html)
npm start           # serve http://localhost:8000
OPENAI_API_KEY=... node examples/create-report.mjs   # live hosted run (optional)
```

Live runs need an SDK with the beta Agents API; keep `OPENAI_API_KEY` outside the sandbox.
Expected artifact: `{ "total": 60 }`.
