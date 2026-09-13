import { runLocalSandboxTurn, buildSessionPayload, validateEnvConfig, DEFAULT_CSV } from "./sandbox-demo.js";

const csvEl = document.getElementById("csv");
const outEl = document.getElementById("out");
const runBtn = document.getElementById("run");
const resetBtn = document.getElementById("reset");
const netEl = document.getElementById("net");
const modelEl = document.getElementById("model");
const payloadEl = document.getElementById("payload");
const validationEl = document.getElementById("validation");

function renderPayload() {
  const payload = buildSessionPayload({ csvText: csvEl.value || DEFAULT_CSV, networkAccess: netEl.value, model: modelEl.value.trim() || "gpt-6-astra" });
  payloadEl.textContent = JSON.stringify(payload, null, 2);
  const errors = validateEnvConfig(payload.environment);
  validationEl.className = errors.length ? "bad" : "ok";
  validationEl.textContent = errors.length ? `Config invalid: ${errors.join("; ")}` : "Config valid for environment.type = openai_hosted.";
}

runBtn.addEventListener("click", () => {
  try {
    const r = runLocalSandboxTurn(csvEl.value);
    outEl.textContent = JSON.stringify({ workspace: "/workspace/amounts.csv", rows: r.values, artifact: r.artifactPath, summary: JSON.parse(r.artifact) }, null, 2);
  } catch (e) {
    outEl.textContent = JSON.stringify({ error: String(e.message || e) }, null, 2);
  }
  renderPayload();
});

resetBtn.addEventListener("click", () => {
  csvEl.value = DEFAULT_CSV;
  outEl.textContent = '{ "hint": "press Run" }';
  renderPayload();
});

for (const el of [csvEl, netEl, modelEl]) el.addEventListener("input", renderPayload);

for (const btn of document.querySelectorAll(".tabs button")) {
  btn.addEventListener("click", () => {
    for (const b of document.querySelectorAll(".tabs button")) b.classList.toggle("active", b === btn);
    for (const id of ["js", "py", "sh"]) document.getElementById(`tab-${id}`).hidden = id !== btn.dataset.tab;
  });
}

renderPayload();
