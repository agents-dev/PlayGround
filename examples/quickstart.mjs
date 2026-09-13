import OpenAI from "openai";

// Quickstart: https://developers.openai.com/api/docs/guides/agents-api/quickstart
// Creates tree.py in an OpenAI-hosted sandbox, runs it, streams progress.
const client = new OpenAI(); // reads OPENAI_API_KEY from env

const events = await client.beta.agents.sessions.create({
  agent: {
    model: "gpt-6-astra",
    instructions: "Write clean code, run it, and report the actual output.",
  },
  environment: { type: "openai_hosted" },
  input:
    "Create tree.py, a Python script that prints a readable tree of the files in the current directory. Run it and show me the output.",
  stream: true,
});

let sessionId = null;
try {
  for await (const event of events) {
    if (event?.type === "agent.session.created") {
      sessionId = event?.session?.id ?? event?.session_id ?? sessionId;
    }
    console.log(JSON.stringify(event));
    const t = event?.type ?? "";
    if (
      t === "agent.session.turn.completed" ||
      t === "agent.session.turn.failed" ||
      t === "agent.session.turn.cancelled" ||
      t === "agent.session.failed"
    ) {
      if (t !== "agent.session.turn.completed") {
        console.error(`Terminal event: ${t}`);
        process.exitCode = 1;
      }
      break;
    }
  }
} finally {
  events.controller.abort();
}

if (sessionId) console.log(`\nsession_id=${sessionId}`);
