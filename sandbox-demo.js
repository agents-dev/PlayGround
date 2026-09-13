// Core offline simulation of the OpenAI-hosted sandbox "Create a report" example.
// Docs: https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted
// Pure functions so they run in the browser and in Node tests without an API key.

export const DEFAULT_CSV = "amount\n10\n20\n30\n";
export const EXPECTED_TOTAL = 60;

const RESERVED_ENV_PREFIXES = ["PATH", "CODEX_", "OPENAI_API_KEY"];
const VALID_NETWORK_ACCESS = new Set(["enabled", "disabled", "restricted"]);

/** Parse the `amount` column of a CSV string. Throws on invalid rows. */
export function parseCsvAmounts(csvText) {
  if (typeof csvText !== "string" || csvText.trim() === "") {
    throw new Error("CSV is empty");
  }
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length < 2) throw new Error("CSV needs a header plus at least one row");
  const header = lines[0].toLowerCase();
  if (header !== "amount") throw new Error(`Expected header "amount", got "${lines[0]}"`);
  return lines.slice(1).map((line, i) => {
    const n = Number(line);
    if (!Number.isFinite(n)) throw new Error(`Row ${i + 2} is not a number: "${line}"`);
    return n;
  });
}

/** Sum an array of numbers. */
export function sumAmounts(values) {
  return values.reduce((a, b) => a + b, 0);
}

/**
 * Simulate one hosted-sandbox turn:
 * read /workspace/amounts.csv -> write /workspace/outputs/summary.json -> read back.
 */
export function runLocalSandboxTurn(csvText = DEFAULT_CSV) {
  const values = parseCsvAmounts(csvText);
  const total = sumAmounts(values);
  const artifactPath = "/workspace/outputs/summary.json";
  const artifact = JSON.stringify({ total });
  // "Read back to verify", mirroring the doc prompt.
  const verified = JSON.parse(artifact);
  if (verified.total !== total) throw new Error("Verification read-back mismatch");
  return { values, total, artifactPath, artifact };
}

/** Base64 helpers that work in browser + Node. */
export function toBase64(text) {
  if (typeof Buffer !== "undefined") return Buffer.from(text, "utf8").toString("base64");
  return btoa(unescape(encodeURIComponent(text)));
}

export function fromBase64(b64) {
  if (typeof Buffer !== "undefined") return Buffer.from(b64, "base64").toString("utf8");
  return decodeURIComponent(escape(atob(b64)));
}

/** Validate an `environment` object for `type: "openai_hosted"`. Returns string errors. */
export function validateEnvConfig(env = {}) {
  const errors = [];
  if (env.type !== "openai_hosted") errors.push('environment.type must be "openai_hosted"');
  const access = env?.network?.access;
  if (access !== undefined && !VALID_NETWORK_ACCESS.has(access)) {
    errors.push(`network.access must be one of ${[...VALID_NETWORK_ACCESS].join(", ")}`);
  }
  if (access === "restricted") {
    const domains = env?.network?.allowed_domains;
    if (!Array.isArray(domains) || domains.length < 1 || domains.length > 100) {
      errors.push("restricted mode needs 1-100 entries in network.allowed_domains");
    } else {
      for (const d of domains) {
        if (!/^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/i.test(d) || d.includes("/") || d.includes(":") || d.includes("*")) {
          errors.push(`allowed_domains entry is not a bare hostname: "${d}"`);
        }
      }
    }
  }
  const reserved = Object.keys(env?.env ?? {}).filter((k) =>
    RESERVED_ENV_PREFIXES.some((p) => k === p || k.startsWith(p)),
  );
  for (const k of reserved) errors.push(`env.${k} is runtime-reserved (PATH, CODEX_*, OPENAI_API_KEY)`);
  for (const f of env?.files ?? []) {
    if (f?.type === "inline") {
      if (typeof f.path !== "string" || !f.path.startsWith("/workspace/")) {
        errors.push(`inline file path must start with /workspace/: "${f.path}"`);
      }
      if (typeof f.data !== "string" || f.data.length === 0) errors.push(`inline file is empty: "${f.path}"`);
    }
  }
  return errors;
}

/** Build the session-creation payload from the doc example. */
export function buildSessionPayload({ csvText = DEFAULT_CSV, networkAccess = "disabled", model = "gpt-6-astra" } = {}) {
  return {
    agent: { model },
    environment: {
      type: "openai_hosted",
      network: { access: networkAccess },
      files: [{ type: "inline", path: "/workspace/amounts.csv", data: toBase64(csvText) }],
    },
    input:
      "Use Python to sum the amount column in /workspace/amounts.csv. " +
      "Write a JSON object with the total to /workspace/outputs/summary.json, then read it back to verify it.",
    stream: true,
  };
}
