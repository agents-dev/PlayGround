import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Terrain: analytic heightfield (cheap heightAt/normalAt lookups, no raycasts)
// ---------------------------------------------------------------------------

export const WORLD_SIZE = 4000;          // meters, square
export const WORLD_HALF = WORLD_SIZE / 2;

// Base plateaus (flattened areas for the two flag bases)
export const BLUE_BASE = new THREE.Vector3(-760, 0, -120);
export const RED_BASE  = new THREE.Vector3( 760, 0,  140);
const PLATEAU_RADIUS = 95;
const PLATEAU_BLEND  = 60;

function rawHeight(x, z) {
  let h = 0;
  h += Math.sin(x * 0.0042 + 1.7) * Math.cos(z * 0.0036 - 0.6) * 58;
  h += Math.sin(x * 0.0113 - 0.4) * Math.cos(z * 0.0102 + 1.2) * 21;
  h += Math.sin(x * 0.031 + 2.9) * Math.cos(z * 0.027 + 0.3) * 6.5;
  h += Math.sin(x * 0.083 + 0.7) * Math.cos(z * 0.074 + 2.1) * 1.8;
  // A long central valley running roughly north-south, fun to ski across
  h -= Math.exp(-Math.pow((x - Math.sin(z * 0.0016) * 220) / 260, 2)) * 30;
  return h;
}

function plateauHeight(cx, cz) { return rawHeight(cx, cz); }

export function heightAt(x, z) {
  let h = rawHeight(x, z);
  for (const b of [BLUE_BASE, RED_BASE]) {
    const dx = x - b.x, dz = z - b.z;
    const d = Math.sqrt(dx * dx + dz * dz);
    if (d < PLATEAU_RADIUS + PLATEAU_BLEND) {
      const t = THREE.MathUtils.smoothstep(d, PLATEAU_RADIUS, PLATEAU_RADIUS + PLATEAU_BLEND);
      h = THREE.MathUtils.lerp(plateauHeight(b.x, b.z), h, t);
    }
  }
  return h;
}

const _n = new THREE.Vector3();
export function normalAt(x, z, out = _n) {
  const e = 0.75;
  const hL = heightAt(x - e, z), hR = heightAt(x + e, z);
  const hD = heightAt(x, z - e), hU = heightAt(x, z + e);
  out.set(hL - hR, 2 * e, hD - hU).normalize();
  return out;
}

// ---------------------------------------------------------------------------

export function buildTerrain(scene) {
  const segs = 220;
  const geo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, segs, segs);
  geo.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const cGrass = new THREE.Color(0x4a7d3a);
  const cGrassDry = new THREE.Color(0x8a8a4d);
  const cRock = new THREE.Color(0x6d6a66);
  const cSnow = new THREE.Color(0xe8f2f8);
  const cSand = new THREE.Color(0x9c8f66);
  const c = new THREE.Color();
  const n = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const h = heightAt(x, z);
    pos.setY(i, h);

    normalAt(x, z, n);
    const slope = 1 - n.y;                       // 0 flat .. ~1 cliff
    c.copy(cGrass);
    const dry = THREE.MathUtils.clamp((Math.sin(x * 0.021 + z * 0.017) + 1) * 0.5, 0, 1);
    c.lerp(cGrassDry, dry * 0.7);
    if (h < -14) c.lerp(cSand, THREE.MathUtils.clamp((-14 - h) / 10, 0, 1));
    c.lerp(cRock, THREE.MathUtils.smoothstep(slope, 0.18, 0.42));
    c.lerp(cSnow, THREE.MathUtils.smoothstep(h, 34, 58) * THREE.MathUtils.clamp(1 - slope * 2.2, 0, 1));
    // subtle variation
    const v = 1 + Math.sin(x * 0.35 + z * 0.31) * 0.045;
    colors[i * 3] = c.r * v; colors[i * 3 + 1] = c.g * v; colors[i * 3 + 2] = c.b * v;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'terrain';
  scene.add(mesh);

  scatterDecorations(scene);
  buildBase(scene, BLUE_BASE, 0x3f9dff, 'blue');
  buildBase(scene, RED_BASE, 0xff5040, 'red');

  return { mesh, heightAt, normalAt };
}

// ---------------------------------------------------------------------------

function scatterDecorations(scene) {
  const rng = mulberry32(1337);

  // Trees: trunk + cone foliage, instanced
  const treeCount = 420;
  const trunkGeo = new THREE.CylinderGeometry(0.35, 0.55, 4, 5);
  const leafGeo = new THREE.ConeGeometry(2.6, 8, 6);
  const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5a4128 });
  const leafMat = new THREE.MeshLambertMaterial({ color: 0x2c5a2e });
  const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, treeCount);
  const leaves = new THREE.InstancedMesh(leafGeo, leafMat, treeCount);

  // Rocks
  const rockCount = 220;
  const rockGeo = new THREE.DodecahedronGeometry(1.6, 0);
  const rockMat = new THREE.MeshLambertMaterial({ color: 0x75706a });
  const rocks = new THREE.InstancedMesh(rockGeo, rockMat, rockCount);

  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();

  let ti = 0, ri = 0, guard = 0;
  while ((ti < treeCount || ri < rockCount) && guard++ < 30000) {
    const x = (rng() * 2 - 1) * (WORLD_HALF - 120);
    const z = (rng() * 2 - 1) * (WORLD_HALF - 120);
    const h = heightAt(x, z);
    normalAt(x, z, n);
    const slope = 1 - n.y;
    const nearBase = Math.min(
      dist2(x, z, BLUE_BASE.x, BLUE_BASE.z),
      dist2(x, z, RED_BASE.x, RED_BASE.z)) < (PLATEAU_RADIUS + 30) ** 2;
    if (nearBase || slope > 0.35) continue;

    if (h > -6 && h < 26 && ti < treeCount) {
      const sc = 0.8 + rng() * 1.1;
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rng() * Math.PI * 2);
      s.set(sc, sc, sc);
      p.set(x, h + 1.8 * sc, z);
      m.compose(p, q, s); trunks.setMatrixAt(ti, m);
      p.y = h + (4 + 3.4) * sc;
      m.compose(p, q, s); leaves.setMatrixAt(ti, m);
      ti++;
    } else if (h >= -10 && h < 48 && ri < rockCount) {
      const sc = 0.6 + rng() * 2.4;
      q.setFromEuler(new THREE.Euler(rng() * 3, rng() * 3, rng() * 3));
      s.set(sc, sc * (0.6 + rng() * 0.5), sc);
      p.set(x, h + 0.4 * sc, z);
      m.compose(p, q, s); rocks.setMatrixAt(ri, m);
      ri++;
    }
  }
  trunks.count = ti; leaves.count = ti; rocks.count = ri;
  scene.add(trunks, leaves, rocks);
}

function dist2(x1, z1, x2, z2) { const dx = x1 - x2, dz = z1 - z2; return dx * dx + dz * dz; }

// ---------------------------------------------------------------------------
// Bases: pad, flag pole, banner, light beam landmark
// ---------------------------------------------------------------------------

function buildBase(scene, center, color, team) {
  const g = new THREE.Group();
  const h = heightAt(center.x, center.z);
  g.position.set(center.x, h, center.z);

  const pad = new THREE.Mesh(
    new THREE.CylinderGeometry(14, 16, 1.2, 24),
    new THREE.MeshLambertMaterial({ color: 0x3a4652 }));
  pad.position.y = 0.6;
  g.add(pad);

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 12, 8),
    new THREE.MeshLambertMaterial({ color: 0xb8c4cc }));
  pole.position.y = 7;
  g.add(pole);

  const banner = new THREE.Mesh(
    new THREE.PlaneGeometry(4.4, 2.6),
    new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
  banner.name = `${team}-banner`;
  banner.position.set(2.3, 11.2, 0);
  g.add(banner);

  // Sky beam so bases are visible from far away
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 2.6, 320, 10, 1, true),
    new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.16,
      blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false,
    }));
  beam.position.y = 160;
  g.add(beam);

  // A few bunkers around the pad
  const bunkerMat = new THREE.MeshLambertMaterial({ color: 0x4c5866 });
  for (let i = 0; i < 3; i++) {
    const a = i * 2.1 + (team === 'red' ? 0.7 : 0);
    const b = new THREE.Mesh(new THREE.BoxGeometry(7, 3, 5), bunkerMat);
    b.position.set(Math.cos(a) * 26, 1.5, Math.sin(a) * 26);
    b.rotation.y = -a;
    g.add(b);
  }

  scene.add(g);
  return { group: g, team, banner, poleTop: new THREE.Vector3(center.x, h + 12, center.z) };
}

// deterministic PRNG so the map is identical every load
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
