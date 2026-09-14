import { loadPlugin } from '@pascal-app/core';
import type { AnyNode, AnyNodeId } from '@pascal-app/core/schema';
import { builtinPlugin } from '@pascal-app/nodes';
import { Viewer } from '@pascal-app/viewer';
import useScene from '@pascal-app/core/store';
import { useEffect, useState } from 'react';
import sceneGraph from '../house/scene.json';

const registryReady = loadPlugin(builtinPlugin);

type SceneFile = {
  nodes: Record<string, AnyNode>;
  rootNodeIds: AnyNodeId[];
  collections?: Record<string, never>;
  materials?: Record<string, never>;
};

const graph = sceneGraph as unknown as SceneFile;

type GpuProbe = {
  ok: boolean;
  /** Lowercased WebGPU backend string (e.g. "metal", "d3d12", "vulkan"), or null. */
  backend: string | null;
};

async function probeGpu(timeoutMs = 8000): Promise<GpuProbe> {
  const none = { ok: false, backend: null };
  try {
    const nav = navigator as Navigator & {
      gpu?: {
        requestAdapter: () => Promise<{ info?: { backendType?: unknown } } | null>;
      };
    };
    if (!nav.gpu) return none;
    const adapter = await Promise.race([
      nav.gpu.requestAdapter(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs)),
    ]);
    if (!adapter) return none;
    let backend: string | null = null;
    try {
      const raw = adapter.info?.backendType;
      if (typeof raw === 'string' && raw.length > 0) backend = raw.toLowerCase();
    } catch {
      backend = null;
    }
    return { ok: true, backend };
  } catch {
    return none;
  }
}

function HouseSummary() {
  const nodes = Object.values(graph.nodes);
  const byType = (t: string) => nodes.filter((n) => n.type === t);
  const zones = byType('zone') as Array<{ name?: string }>;
  const walls = byType('wall') as Array<{ start: [number, number]; end: [number, number] }>;
  const xs = walls.flatMap((w) => [w.start[0], w.end[0]]);
  const zs = walls.flatMap((w) => [w.start[1], w.end[1]]);
  const footprint =
    xs.length > 0
      ? `${(Math.max(...xs) - Math.min(...xs)).toFixed(0)} × ${(Math.max(...zs) - Math.min(...zs)).toFixed(0)} m`
      : '—';
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 640 }}>
      <h2 style={{ marginTop: 0 }}>3D view needs WebGPU</h2>
      <p style={{ color: '#4b5563' }}>
        This browser did not provide a WebGPU adapter, so the Pascal 3D viewer cannot start here.
        The house data below comes from the same <code>house/scene.json</code> the 3D view renders
        on a WebGPU-capable browser.
      </p>
      <ul>
        <li>Footprint: {footprint}</li>
        <li>
          Walls: {byType('wall').length} · Doors: {byType('door').length} · Windows:{' '}
          {byType('window').length}
        </li>
        <li>
          Zones: {zones.map((z) => z.name ?? 'zone').join(', ')} · Fences:{' '}
          {byType('fence').length} · Roofs: {byType('roof').length}
        </li>
        <li>Total nodes: {nodes.length}</li>
      </ul>
    </div>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [gpu, setGpu] = useState<GpuProbe | null>(null);

  useEffect(() => {
    let cancelled = false;
    void registryReady.then(() => {
      // Hydrate the Pascal scene store with the exported house graph.
      useScene.getState().setScene(graph.nodes, graph.rootNodeIds, {
        ...(graph.collections ? { collections: graph.collections } : {}),
        ...(graph.materials ? { materials: graph.materials } : {}),
      });
      if (!cancelled) setReady(true);
    });
    void probeGpu().then((probe) => {
      if (!cancelled) setGpu(probe);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready || gpu === null)
    return <div style={{ padding: 24, fontFamily: 'sans-serif' }}>Loading house…</div>;

  // The viewer's TSL post-processing pipeline (SSGI/denoise/ink/outline) hits
  // a Tint IR backend-compiler bug on Metal ("swizzle view instruction still
  // has usages after lowering" → invalid RenderPipeline every frame), which
  // poisons the whole command buffer so nothing presents. Render the scene
  // directly on Metal; full post-FX stays on elsewhere. The viewer also
  // honors `?disable=postFx` in the URL as a manual override.
  const disablePostFx = gpu.backend !== null && gpu.backend.includes('metal');

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          padding: '10px 16px',
          fontFamily: 'sans-serif',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          gap: 12,
          alignItems: 'baseline',
        }}
      >
        <strong>PlayGround House</strong>
        <span style={{ color: '#6b7280', fontSize: 13 }}>
          12 × 8 m garden house · built with pascalorg/editor · 21 nodes
        </span>
      </header>
      <div style={{ flex: 1, minHeight: 0 }}>
        {gpu.ok ? <Viewer disablePostFx={disablePostFx} /> : <HouseSummary />}
      </div>
    </div>
  );
}
