import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import {
  parseCsvAmounts,
  sumAmounts,
  runLocalSandboxTurn,
  buildSessionPayload,
  validateEnvConfig,
  toBase64,
  fromBase64,
  DEFAULT_CSV,
} from "../sandbox-demo.js";

describe("doc report example", () => {
  it("sums 10+20+30 to 60 and writes /workspace/outputs/summary.json", () => {
    const r = runLocalSandboxTurn(DEFAULT_CSV);
    assert.deepEqual(r.values, [10, 20, 30]);
    assert.equal(r.total, 60);
    assert.equal(r.artifactPath, "/workspace/outputs/summary.json");
    assert.equal(r.artifact, JSON.stringify({ total: 60 }));
  });

  it("rejects bad CSV input", () => {
    assert.throws(() => parseCsvAmounts(""), /empty/);
    assert.throws(() => parseCsvAmounts("amount\nfoo\n"), /not a number/);
    assert.throws(() => parseCsvAmounts("wrong\n10\n"), /header/);
  });

  it("sumAmounts handles custom rows", () => {
    assert.equal(sumAmounts(parseCsvAmounts("amount\n1\n2.5\n3\n")), 6.5);
  });
});

describe("session payload", () => {
  it("matches the doc shape and round-trips the CSV base64", () => {
    const p = buildSessionPayload();
    assert.equal(p.agent.model, "gpt-6-astra");
    assert.equal(p.environment.type, "openai_hosted");
    assert.equal(p.environment.network.access, "disabled");
    assert.equal(p.environment.files[0].path, "/workspace/amounts.csv");
    assert.equal(fromBase64(p.environment.files[0].data), DEFAULT_CSV);
    assert.equal(toBase64(DEFAULT_CSV), "YW1vdW50CjEwCjIwCjMwCg==");
    assert.deepEqual(validateEnvConfig(p.environment), []);
  });

  it("flags reserved env vars and bad network config", () => {
    assert.ok(
      validateEnvConfig({ type: "openai_hosted", env: { OPENAI_API_KEY: "x" } }).length > 0,
    );
    assert.ok(
      validateEnvConfig({ type: "openai_hosted", network: { access: "nope" } }).length > 0,
    );
    assert.ok(
      validateEnvConfig({ type: "openai_hosted", network: { access: "restricted" } }).length > 0,
    );
    assert.deepEqual(
      validateEnvConfig({
        type: "openai_hosted",
        network: { access: "restricted", allowed_domains: ["api.example.com"] },
      }),
      [],
    );
  });
});

describe("browser entrypoint", () => {
  it("index.html exists with required demo sections", () => {
    assert.ok(existsSync(new URL("../index.html", import.meta.url)));
    const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
    for (const s of ["OpenAI-Hosted Sandboxes", "/workspace/outputs/summary.json", "payload", "amounts.csv"]) {
      assert.ok(html.includes(s), `missing ${s}`);
    }
  });
});
