// Validates house/scene.json against @pascal-app/core node schemas.
// Run: npm run validate
import { readFileSync } from 'node:fs';
import { AnyNode } from '@pascal-app/core/schema';

const raw = JSON.parse(readFileSync(new URL('../house/scene.json', import.meta.url), 'utf8'));
const nodes = raw.nodes ?? {};
const rootNodeIds = raw.rootNodeIds ?? [];

let errors = [];
for (const [id, node] of Object.entries(nodes)) {
  const res = AnyNode.safeParse(node);
  if (!res.success) {
    for (const issue of res.error.issues) {
      errors.push(`${id}:${issue.path.map(String).join('.')}: ${issue.message}`);
    }
  }
}

const missingRoots = rootNodeIds.filter((r) => !nodes[r]);
const counts = {};
for (const node of Object.values(nodes)) {
  const t = node?.type ?? 'unknown';
  counts[t] = (counts[t] ?? 0) + 1;
}

console.log(`nodes: ${Object.keys(nodes).length}`);
console.log(`roots: ${JSON.stringify(rootNodeIds)}`);
console.log(`counts: ${JSON.stringify(counts)}`);
if (missingRoots.length > 0) {
  console.error(`missing root nodes: ${missingRoots.join(', ')}`);
  process.exit(1);
}
if (errors.length > 0) {
  console.error(`INVALID: ${errors.length} schema errors`);
  for (const e of errors.slice(0, 20)) console.error(` - ${e}`);
  process.exit(1);
}
console.log('validate_scene: {"valid":true}');
