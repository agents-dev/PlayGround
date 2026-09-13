import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  AGENT_INPUT,
  WORKSPACE_CSV,
  buildSessionPayload,
  csvToBase64,
} from '../src/hostedSandbox.js';
import { sumAmounts, toSummaryJson } from '../src/csvSum.js';

const EXPECTED_B64 = 'YW1vdW50CjEwCjIwCjMwCg==';

describe('openai-hosted sandbox demo (offline)', () => {
  it('ships the docs CSV input', () => {
    const csv = readFileSync(new URL('../examples/amounts.csv', import.meta.url), 'utf8');
    assert.equal(csvToBase64(csv), EXPECTED_B64);
  });

  it('sums the amount column to 60', () => {
    const csv = readFileSync(new URL('../examples/amounts.csv', import.meta.url), 'utf8');
    assert.equal(sumAmounts(csv), 60);
    assert.equal(toSummaryJson(60), '{"total":60}');
  });

  it('builds the documented openai_hosted payload', () => {
    const payload = buildSessionPayload(EXPECTED_B64);
    assert.equal(payload.environment.type, 'openai_hosted');
    assert.equal(payload.environment.network.access, 'disabled');
    assert.equal(payload.environment.files[0].path, WORKSPACE_CSV);
    assert.equal(payload.environment.files[0].data, EXPECTED_B64);
    assert.equal(payload.agent.model, 'gpt-6-astra');
    assert.equal(payload.input, AGENT_INPUT);
    assert.ok(AGENT_INPUT.includes('/workspace/outputs/summary.json'));
  });

  it('rejects live runs without an API key', async () => {
    const { createSession } = await import('../src/hostedSandbox.js');
    await assert.rejects(() => createSession({ apiKey: '', csvText: 'amount\n1\n' }), /OPENAI_API_KEY/);
  });
});
