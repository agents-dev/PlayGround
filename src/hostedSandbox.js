// Payload builder + runner for the OpenAI-hosted sandbox demo.
// Follows https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted
// Docs example: CSV with 10/20/30 -> /workspace/outputs/summary.json { total: 60 }.
import { readFileSync } from 'node:fs';

export const WORKSPACE_CSV = '/workspace/amounts.csv';
export const WORKSPACE_OUTPUT = '/workspace/outputs/summary.json';
export const AGENT_MODEL = 'gpt-6-astra';
export const AGENT_INPUT = `Use Python to sum the amount column in ${WORKSPACE_CSV}. Write a JSON object with the total to ${WORKSPACE_OUTPUT}, then read it back to verify it.`;

export function csvToBase64(csvText) {
  return Buffer.from(csvText, 'utf8').toString('base64');
}

export function buildSessionPayload(csvBase64) {
  return {
    agent: { model: AGENT_MODEL },
    environment: {
      type: 'openai_hosted',
      network: { access: 'disabled' },
      files: [{ type: 'inline', path: WORKSPACE_CSV, data: csvBase64 }],
    },
    input: AGENT_INPUT,
    stream: true,
  };
}

export async function createSession({ apiKey, csvText, fetchImpl = fetch }) {
  if (!apiKey) throw new Error('OPENAI_API_KEY is required for a live session');
  const payload = buildSessionPayload(csvToBase64(csvText));
  const res = await fetchImpl('https://api.openai.com/v1/agents/sessions', {
    method: 'POST',
    headers: {
      'OpenAI-Beta': 'agents=v1',
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`session create failed: ${res.status}`);
  return res;
}

export function loadCsvExample() {
  return readFileSync(new URL('../examples/amounts.csv', import.meta.url), 'utf8');
}
