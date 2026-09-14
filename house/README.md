# PlayGround House — built with [pascalorg/editor](https://github.com/pascalorg/editor)

Single-family garden house generated through the Pascal local MCP workflow
(`@pascal-app/cli` → `pascal mcp connect`), exported as an editable Pascal
scene graph and rendered here with the published `@pascal-app/*` viewer packages.

## Contents

- `house/scene.json` — editable Pascal scene graph (`{ nodes, rootNodeIds, collections, materials }`), 21 nodes
- `house/metadata.json` — build provenance, project handoff evidence, validation results
- `src/App.tsx` — React viewer: `loadPlugin(builtinPlugin)` + `useScene.setScene(...)` + `<Viewer />`
- `scripts/validate.mjs` — validates `house/scene.json` against `@pascal-app/core` schemas

## House

- Footprint: **12 m × 8 m** house + **12 m × 6 m** fenced back garden (north)
- 4 perimeter walls (0.15 m thick, 2.7 m high)
- 1 front door (south, 1.0 m) + 1 garden door (north, 1.6 m)
- 4 windows (2 south, 1 east, 1 west)
- Zones: Living (96 m²) + Back garden (72 m²)
- 3 privacy fences (N/E/W of garden, 1.8 m high)
- 1 gable roof (pitch 35°, 0.45 m overhang) on a dedicated roof level

## Pascal handoff (build machine)

- Project: `PlayGround House` (`2f2347dd7922`), version 2, 21 nodes
- Graph hash: `03bb2721fb99b24c94f8c11fb5a45d35379d4788f980c0ee1c9565af4032ad58`
- `validate_scene`: `{"valid":true}`
- `verify_scene`: `ok:true, valid:true` with expected template advisories (no slabs/ceilings; door/window extent notes)
- `check_collisions` (0.3 m): `checked`, 0 collisions
- `export_glb`: `not_implemented` in the open-source headless server — not claimed as a deliverable

Reopen locally (on the build machine): `pascal open 2f2347dd7922`

## Run the viewer

```bash
npm install
npm run validate   # schema check of house/scene.json
npm run dev        # Vite dev server
npm run build      # production build
```
