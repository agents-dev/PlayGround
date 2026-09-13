import OpenAI from "openai";
import { writeFileSync, mkdirSync } from "node:fs";

// Docs: https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted
// Task: sum `amount` column in amounts.csv -> /workspace/outputs/summary.json {"total":60}
// Input CSV (10,20,30) as base64: YW1vdW50CjEwCjIwCjMwCg==
const AMOUNTS_B64 = "YW1vdW50CjEwCjIwCjMwCg==";
const ARTIFACT_PATH = "/workspace/outputs/summary.json";

const client = new OpenAI();
const stream = await client.beta.agents.sessions.create({
  agent: { model: "gpt-6-astra" },
  environment: {
    type: "openai_hosted",
    network: { access: "disabled" },
    files: [{ type: "inline", path: "/workspace/amounts.csv", data: AMOUNTS_B64 }],
  },
  input:
    "Use Python to sum the amount column in /workspace/amounts.csv. " +
    "Write a JSON object with the total to /workspace/outputs/summary.json, then read it back to verify it.",
  stream: true,
});

let sessionId = null;
let turnId = null;
try {
  for await (const event of stream) {
    console.log(JSON.stringify(event));
    if (event?.type === "agent.session.created") {
      sessionId = event?.session?.id ?? sessionId;
    }
    // Turn id is carried on turn.completed events; keep the latest.
    if (event?.type === "agent.session.turn.completed") {
      turnId = event?.turn?.id ?? event?.turn_id ?? turnId;
      break;
    }
    if (
      event?.type === "agent.session.turn.failed" ||
      event?.type === "agent.session.turn.cancelled" ||
      event?.type === "agent.session.failed"
    ) {
      console.error(`Terminal event: ${event.type}`);
      process.exitCode = 1;
      break;
    }
    // Fallbacks: some SDKs surface ids on other events
    sessionId ??= event?.session_id ?? event?.session?.id ?? null;
    turnId ??= event?.turn_id ?? event?.turn?.id ?? null;
  }
} finally {
  stream.controller.abort();
}

if (!sessionId) {
  console.error("No session_id captured; cannot list artifacts.");
  process.exit(1);
}
console.log(`\nsession_id=${sessionId} turn_id=${turnId}`);

// List artifacts, find summary.json for the completed turn, download it.
const artifacts = await client.beta.agents.sessions.artifacts.list(sessionId);
const match = artifacts.data.find(
  (a) => a.path === ARTIFACT_PATH && (turnId == null || a.turn_id === turnId),
);
if (!match) {
  console.error(`No artifact for ${ARTIFACT_PATH} in turn ${turnId}`);
  console.error(JSON.stringify(artifacts.data, null, 2));
  process.exit(1);
}
const content = await client.beta.agents.sessions.artifacts.content(match.id, {
  session_id: sessionId,
});
mkdirSync("outputs", { recursive: true });
const buf = Buffer.from(await content.arrayBuffer());
writeFileSync("outputs/summary.json", buf);
console.log(`Downloaded ${ARTIFACT_PATH} -> outputs/summary.json: ${buf.toString()}`);

// Cleanup: delete session to request sandbox cleanup (409 => retry while busy).
await client.beta.agents.sessions.delete(sessionId);
console.log(`Deleted session ${sessionId}`);
