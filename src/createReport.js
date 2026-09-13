// JS end-to-end example from the docs (needs OPENAI_API_KEY).
// Streams session events; save session.id from agent.session.created,
// then after agent.session.turn.completed list artifacts and download summary.json.
import OpenAI from 'openai';
import { AGENT_INPUT, WORKSPACE_CSV, csvToBase64, loadCsvExample } from './hostedSandbox.js';

const client = new OpenAI();
const csv = loadCsvExample();

const stream = await client.beta.agents.sessions.create({
  agent: { model: 'gpt-6-astra' },
  environment: {
    type: 'openai_hosted',
    network: { access: 'disabled' },
    files: [{ type: 'inline', path: WORKSPACE_CSV, data: csvToBase64(csv) }],
  },
  input: AGENT_INPUT,
  stream: true,
});

for await (const event of stream) {
  console.log(event);
}
