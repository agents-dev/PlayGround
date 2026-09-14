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

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void registryReady.then(() => {
      // Hydrate the Pascal scene store with the exported house graph.
      const graph = sceneGraph as unknown as SceneFile;
      useScene.getState().setScene(graph.nodes, graph.rootNodeIds, {
        ...(graph.collections ? { collections: graph.collections } : {}),
        ...(graph.materials ? { materials: graph.materials } : {}),
      });
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return <div style={{ padding: 24, fontFamily: 'sans-serif' }}>Loading house…</div>;

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
      <div style={{ flex: 1 }}>
        <Viewer />
      </div>
    </div>
  );
}
