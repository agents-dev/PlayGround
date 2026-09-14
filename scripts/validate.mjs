// Structural validation of house/scene.json (Pascal scene graph).
// Authoritative schema validation was done via Pascal MCP `validate_scene`
// at build time (see house/metadata.json: {"valid":true}).
// This script re-checks structure + referential integrity without requiring
// the (currently extensionless-broken) Node ESM entry of @pascal-app/core.
// Run: npm run validate
import { readFileSync } from 'node:fs';

const scene = JSON.parse(readFileSync(new URL('../house/scene.json', import.meta.url), 'utf8'));
const meta = JSON.parse(readFileSync(new URL('../house/metadata.json', import.meta.url), 'utf8'));
const errors = [];

const nodes = scene.nodes ?? {};
const rootNodeIds = scene.rootNodeIds ?? [];
if (Object.keys(nodes).length === 0) errors.push('no nodes');
for (const r of rootNodeIds) if (!nodes[r]) errors.push(`missing root node: ${r}`);

const requiredByType = {
  site: ['polygon', 'children'],
  building: ['children'],
  level: ['children'],
  wall: ['start', 'end', 'thickness'],
  door: ['wallId', 'width', 'height'],
  window: ['wallId', 'width', 'height'],
  zone: ['polygon'],
  fence: ['start', 'end', 'height'],
  roof: ['children'],
};

const counts = {};
for (const [id, n] of Object.entries(nodes)) {
  if (!n || typeof n !== 'object') { errors.push(`${id}: not an object`); continue; }
  if (n.id !== id) errors.push(`${id}: id mismatch (${n.id})`);
  const t = n.type;
  if (!t) { errors.push(`${id}: missing type`); continue; }
  counts[t] = (counts[t] ?? 0) + 1;
  for (const f of requiredByType[t] ?? []) {
    if (n[f] === undefined) errors.push(`${id} (${t}): missing field ${f}`);
  }
  if (n.parentId !== null && n.parentId !== undefined && !nodes[n.parentId]) {
    // doors/windows parent to walls which must exist
    errors.push(`${id} (${t}): missing parent ${n.parentId}`);
  }
  for (const c of n.children ?? []) {
    if (!nodes[c]) errors.push(`${id} (${t}): missing child ${c}`);
  }
}

// Cross-check against build metadata
const expected = meta?.contents ?? {};
const checks = [
  ['wall', expected.walls],
  ['door', expected.doors],
  ['window', expected.windows],
  ['zone', expected.zones],
  ['fence', expected.fences],
  ['roof', 1],
];
for (const [t, want] of checks) {
  if (want !== undefined && counts[t] !== want) errors.push(`count ${t}: got ${counts[t] ?? 0}, want ${want}`);
}
if (meta?.pascalProject?.nodeCount !== Object.keys(nodes).length) {
  errors.push(`nodeCount mismatch: scene has ${Object.keys(nodes).length}, metadata says ${meta?.pascalProject?.nodeCount}`);
}

console.log(`nodes: ${Object.keys(nodes).length}`);
console.log(`roots: ${JSON.stringify(rootNodeIds)}`);
console.log(`counts: ${JSON.stringify(counts)}`);
console.log(`mcp validate_scene: ${JSON.stringify(meta?.checks?.validate_scene)}`);
if (errors.length > 0) {
  console.error(`INVALID: ${errors.length} problem(s)`);
  for (const e of errors.slice(0, 30)) console.error(` - ${e}`);
  process.exit(1);
}
console.log('validate: OK (structure + integrity + metadata cross-check)');
