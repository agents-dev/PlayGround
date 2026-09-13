import OpenAI from "openai";

// Mirrors https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted
// Run: OPENAI_API_KEY=... node examples/create-report.mjs
const client = new OpenAI();
const stream = await client.beta.agents.sessions.create({
  agent: { model: "gpt-6-astra" },
  environment: {
    type: "openai_hosted",
    network: { access: "disabled" },
    files: [
      {
        type: "inline",
        path: "/workspace/amounts.csv",
        data: "YW1vdW50CjEwCjIwCjMwCg==", // "amount\n10\n20\n30\n"
      },
    ],
  },
  input:
    "Use Python to sum the amount column in /workspace/amounts.csv. Write a JSON object with the total to /workspace/outputs/summary.json, then read it back to verify it.",
  stream: true,
});

for await (const event of stream) {
  console.log(event);
}
