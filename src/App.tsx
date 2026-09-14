import { loadPlugin } from '@pascal-app/core';
import { builtinPlugin } from '@pascal-app/nodes';
import { Viewer } from '@pascal-app/viewer';
import useScene from '@pascal-app/core/store';
import { useEffect, useState } from 'react';
import sceneGraph from '../house/scene.json';

const registryReady = loadPlugin(builtinPlugin);

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void registryReady.then(() => {
      // Hydrate the Pascal scene store with the exported house graph.
      // scene.json shape: { nodes, rootNodeIds, collections, materials }
      const graph = sceneGraph as {
        nodes: Record<string, never>;
        rootNodeIds: string[];
        collections?: Record<string, never>;
        materials?: Record<string, never>;
      };
      useScene.getState().setScene(
        graph.nodes as Parameters<typeof useScene.getState().setScene>[0],
        graph.rootNodeIds as Parameters<typeof useScene.getState().setScene>[1],
        {
          ...(graph.collections ? { collections: graph.collections as never } : {}),
          ...(graph.materials ? { materials: graph.materials as never } : {}),
        } as never,
      );
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
