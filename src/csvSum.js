// Pure CSV-sum logic shared by browser demo, Node tests, and the
// task description sent to the OpenAI-hosted sandbox agent.
export function sumAmounts(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error('CSV needs header + rows');
  const header = lines[0].split(',').map((h) => h.trim());
  const idx = header.indexOf('amount');
  if (idx === -1) throw new Error('missing amount column');
  let total = 0;
  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const v = Number(line.split(',')[idx].trim());
    if (!Number.isFinite(v)) throw new Error(`non-numeric amount: ${line}`);
    total += v;
  }
  return total;
}

export function toSummaryJson(total) {
  return JSON.stringify({ total });
}
