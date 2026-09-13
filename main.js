import * as THREE from 'three';

/* ============================================================
   MiniCraft — a tiny Minecraft clone (static, no build step)
   - Procedural voxel terrain (value-noise fBm)
   - Chunked meshing with procedural texture atlas
   - FPS controls, AABB physics, break/place, hotbar, save
   ============================================================ */

// ---------- Config ----------
const WORLD_X = 64;
const WORLD_Y = 48;
const WORLD_Z = 64;
const CHUNK = 16;
const WATER_Y = 11;
const REACH = 6;

const BLOCK = {
  AIR: 0, GRASS: 1, DIRT: 2, STONE: 3, LOG: 4, LEAVES: 5,
  SAND: 6, WATER: 7, PLANKS: 8, GLASS: 9, BRICK: 10,
};

const BLOCK_INFO = {
  [BLOCK.GRASS]:  { name: 'Grass',  tiles: { top: 0, side: 1, bottom: 2 } },
  [BLOCK.DIRT]:   { name: 'Dirt',   tiles: { top: 2, side: 2, bottom: 2 } },
  [BLOCK.STONE]:  { name: 'Stone',  tiles: { top: 3, side: 3, bottom: 3 } },
  [BLOCK.LOG]:    { name: 'Oak Log',tiles: { top: 5, side: 4, bottom: 5 } },
  [BLOCK.LEAVES]: { name: 'Leaves', tiles: { top: 6, side: 6, bottom: 6 } },
  [BLOCK.SAND]:   { name: 'Sand',   tiles: { top: 7, side: 7, bottom: 7 } },
  [BLOCK.WATER]:  { name: 'Water',  tiles: { top: 8, side: 8, bottom: 8 } },
  [BLOCK.PLANKS]: { name: 'Planks', tiles: { top: 9, side: 9, bottom: 9 } },
  [BLOCK.GLASS]:  { name: 'Glass',  tiles: { top: 10, side: 10, bottom: 10 } },
  [BLOCK.BRICK]:  { name: 'Bricks', tiles: { top: 11, side: 11, bottom: 11 } },
};

const HOTBAR = [BLOCK.GRASS, BLOCK.DIRT, BLOCK.STONE, BLOCK.LOG, BLOCK.LEAVES, BLOCK.SAND, BLOCK.PLANKS, BLOCK.GLASS, BLOCK.BRICK];
const TRANSPARENT = new Set([BLOCK.AIR, BLOCK.WATER, BLOCK.GLASS, BLOCK.LEAVES]);

// ---------- Seeded RNG + noise ----------
let seed = (Math.random() * 1e9) | 0;
try {
  const s = JSON.parse(localStorage.getItem('minicraft-meta') || 'null');
  if (s && typeof s.seed === 'number') seed = s.seed;
} catch { /* fresh */ }

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
let rng = mulberry32(seed);

function hash2(x, y) {
  let h = (x * 374761393 + y * 668265263 + seed * 974634211) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function smooth(t) { return t * t * (3 - 2 * t); }
function valueNoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const a = hash2(xi, yi), b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
  const u = smooth(xf), v = smooth(yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y) {
  return valueNoise(x, y) * 0.55 + valueNoise(x * 2.1 + 7.3, y * 2.1 + 3.1) * 0.28 + valueNoise(x * 4.3 + 13.7, y * 4.3 + 9.2) * 0.17;
}

// ---------- Voxel store ----------
const world = new Uint8Array(WORLD_X * WORLD_Y * WORLD_Z);
const idx = (x, y, z) => (y * WORLD_Z + z) * WORLD_X + x;
function inBounds(x, y, z) {
  return x >= 0 && y >= 0 && z >= 0 && x < WORLD_X && y < WORLD_Y && z < WORLD_Z;
}
function getBlock(x, y, z) {
  if (!inBounds(x, y, z)) return (y < 0) ? BLOCK.STONE : BLOCK.AIR;
  return world[idx(x, y, z)];
}
function setBlock(x, y, z, v) {
  if (!inBounds(x, y, z)) return;
  world[idx(x, y, z)] = v;
}
function isOpaque(x, y, z) {
  const b = getBlock(x, y, z);
  if (b === BLOCK.AIR || b === BLOCK.WATER || b === BLOCK.GLASS) return false;
  if (b === BLOCK.LEAVES) return false; // show inner faces for leafy look
  return true;
}

// ---------- World generation ----------
function generate() {
  world.fill(BLOCK.AIR);
  rng = mulberry32(seed);
  const heights = new Int16Array(WORLD_X * WORLD_Z);
  for (let x = 0; x < WORLD_X; x++) {
    for (let z = 0; z < WORLD_Z; z++) {
      const n = fbm(x / 18, z / 18);
      const hill = fbm(x / 7 + 40, z / 7 + 40);
      let h = Math.floor(9 + n * 12 + hill * 5);
      h = Math.max(3, Math.min(WORLD_Y - 12, h));
      heights[z * WORLD_X + x] = h;
      for (let y = 0; y <= h; y++) {
        let b;
        if (y === h) b = h <= WATER_Y + 1 ? BLOCK.SAND : BLOCK.GRASS;
        else if (y > h - 4) b = (h <= WATER_Y + 1) ? BLOCK.SAND : BLOCK.DIRT;
        else b = BLOCK.STONE;
        setBlock(x, y, z, b);
      }
      for (let y = h + 1; y <= WATER_Y; y++) setBlock(x, y, z, BLOCK.WATER);
    }
  }
  // Trees
  for (let i = 0; i < 90; i++) {
    const x = 2 + Math.floor(rng() * (WORLD_X - 4));
    const z = 2 + Math.floor(rng() * (WORLD_Z - 4));
    const h = heights[z * WORLD_X + x];
    if (h <= WATER_Y + 1 || h > WORLD_Y - 16) continue;
    if (getBlock(x, h, z) !== BLOCK.GRASS) continue;
    if (rng() < 0.45) continue;
    const trunk = 3 + Math.floor(rng() * 3);
    for (let t = 1; t <= trunk; t++) setBlock(x, h + t, z, BLOCK.LOG);
    for (let dy = trunk - 2; dy <= trunk + 1; dy++) {
      const r = dy >= trunk ? 1 : 2;
      for (let dx = -r; dx <= r; dx++) {
        for (let dz = -r; dz <= r; dz++) {
          if (dx === 0 && dz === 0 && dy <= trunk) continue;
          if (Math.abs(dx) === r && Math.abs(dz) === r && rng() < 0.6) continue;
          const bx = x + dx, by = h + dy, bz = z + dz;
          if (inBounds(bx, by, bz) && getBlock(bx, by, bz) === BLOCK.AIR) setBlock(bx, by, bz, BLOCK.LEAVES);
        }
      }
    }
  }
}

// ---------- Texture atlas (procedural, 4x4 tiles of 16px) ----------
function makeAtlas() {
  const T = 16, COLS = 4;
  const c = document.createElement('canvas');
  c.width = COLS * T; c.height = COLS * T;
  const g = c.getContext('2d');
  const R = mulberry32(1337);
  function px(tx, ty, x, y, col) { g.fillStyle = col; g.fillRect(tx * T + x, ty * T + y, 1, 1); }
  function fill(tx, ty, base, vary, varyAmt = 18) {
    const [r, gg, b] = base;
    for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
      const v = (R() - 0.5) * 2 * varyAmt;
      px(tx, ty, x, y, `rgb(${(r + v) | 0},${(gg + v) | 0},${(b + v) | 0})`);
    }
    if (vary) vary(tx, ty);
  }
  const tilePos = (t) => [t % COLS, Math.floor(t / COLS)];
  // 0 grass top
  let [tx, ty] = tilePos(0); fill(tx, ty, [106, 176, 74]);
  // 1 grass side
  [tx, ty] = tilePos(1); fill(tx, ty, [134, 106, 72], () => {
    for (let y = 0; y < 5; y++) for (let x = 0; x < T; x++) {
      const v = (R() - 0.5) * 22;
      px(tx, ty, x, y, `rgb(${(106 + v) | 0},${(176 + v) | 0},${(74 + v) | 0})`);
    }
  });
  // 2 dirt
  [tx, ty] = tilePos(2); fill(tx, ty, [134, 106, 72], () => {
    for (let i = 0; i < 14; i++) px(tx, ty, (R() * T) | 0, (R() * T) | 0, '#6e5638');
  });
  // 3 stone
  [tx, ty] = tilePos(3); fill(tx, ty, [128, 128, 128], () => {
    for (let i = 0; i < 10; i++) px(tx, ty, (R() * T) | 0, (R() * T) | 0, '#6f6f6f');
  });
  // 4 log side
  [tx, ty] = tilePos(4); fill(tx, ty, [104, 80, 52], () => {
    g.fillStyle = '#5d4429';
    for (let x = 2; x < T; x += 4) g.fillRect(tx * T + x, ty * T, 1, T);
  });
  // 5 log top (rings)
  [tx, ty] = tilePos(5); fill(tx, ty, [184, 150, 100], () => {
    g.strokeStyle = '#8a6f45'; g.lineWidth = 1;
    for (let r = 7; r > 0; r -= 2) { g.strokeRect(tx * T + 8 - r, ty * T + 8 - r, r * 2, r * 2); }
  });
  // 6 leaves
  [tx, ty] = tilePos(6); fill(tx, ty, [52, 128, 44], () => {
    for (let i = 0; i < 26; i++) px(tx, ty, (R() * T) | 0, (R() * T) | 0, '#1e4d1a');
  }, 26);
  // 7 sand
  [tx, ty] = tilePos(7); fill(tx, ty, [220, 208, 170], () => {}, 8);
  // 8 water
  [tx, ty] = tilePos(8); fill(tx, ty, [58, 110, 220], () => {
    g.fillStyle = 'rgba(255,255,255,0.35)';
    for (let y = 2; y < T; y += 5) g.fillRect(tx * T, ty * T + y, T, 1);
  }, 10);
  // 9 planks
  [tx, ty] = tilePos(9); fill(tx, ty, [168, 132, 78], () => {
    g.fillStyle = '#7d5f36';
    for (let y = 3; y < T; y += 4) g.fillRect(tx * T, ty * T + y, T, 1);
    g.fillRect(tx * T + 7, ty * T, 1, T);
  });
  // 10 glass
  [tx, ty] = tilePos(10);
  g.clearRect(tx * T, ty * T, T, T);
  g.fillStyle = 'rgba(220,240,255,0.55)'; g.fillRect(tx * T, ty * T, T, T);
  g.strokeStyle = '#e8f4ff'; g.lineWidth = 2; g.strokeRect(tx * T + 1, ty * T + 1, T - 2, T - 2);
  g.strokeStyle = 'rgba(255,255,255,0.9)'; g.beginPath();
  g.moveTo(tx * T + 3, ty * T + 11); g.lineTo(tx * T + 7, ty * T + 5); g.stroke();
  // 11 brick
  [tx, ty] = tilePos(11); fill(tx, ty, [158, 84, 70], () => {
    g.fillStyle = '#d8c8bd';
    for (let y = 3; y < T; y += 4) g.fillRect(tx * T, ty * T + y, T, 1);
    for (let y = 0; y < T; y += 4) { const off = (y / 4) % 2 ? 4 : 0; for (let x = off; x < T; x += 8) g.fillRect(tx * T + x, ty * T + y, 1, 4); }
  });
  const tex = new THREE.CanvasTexture(c);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = false;
  return { canvas: c, texture: tex };
}
const atlas = makeAtlas();

function tileUV(tile) {
  const COLS = 4, ROWS = 4;
  const tx = tile % COLS, ty = Math.floor(tile / COLS);
  const s = 1 / COLS, t = 1 / ROWS;
  // flip Y because canvas texture
  const u0 = tx * s, v1 = 1 - ty * t, v0 = v1 - t;
  const pad = 0.5 / 64; // bleed guard
  return [u0 + pad, v0 + pad, u0 + s - pad, v1 - pad];
}

// ---------- Three.js scene ----------
const canvas = document.getElementById('game');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 30, 110);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const sun = new THREE.DirectionalLight(0xffffff, 1.15);
sun.position.set(40, 80, 20);
scene.add(sun);
scene.add(new THREE.AmbientLight(0xbfd8ff, 0.75));
const hemi = new THREE.HemisphereLight(0xcfe8ff, 0x6b5b3e, 0.5);
scene.add(hemi);

const opaqueMat = new THREE.MeshLambertMaterial({ map: atlas.texture, vertexColors: true });
const waterMat = new THREE.MeshLambertMaterial({ map: atlas.texture, vertexColors: true, transparent: true, opacity: 0.75, depthWrite: false, side: THREE.FrontSide });
const glassMat = new THREE.MeshLambertMaterial({ map: atlas.texture, vertexColors: true, transparent: true, opacity: 0.6, depthWrite: false });

// ---------- Chunk meshing ----------
const chunkMeshes = new Map();
const chunkKey = (cx, cz) => cx + ',' + cz;

const FACES = [
  { dir: [1, 0, 0],  shade: 0.8,  corners: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], n: [1, 0, 0] },
  { dir: [-1, 0, 0], shade: 0.8,  corners: [[0, 0, 1], [0, 1, 1], [0, 1, 0], [0, 0, 0]], n: [-1, 0, 0] },
  { dir: [0, 1, 0],  shade: 1.0,  corners: [[0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 1, 0]], n: [0, 1, 0] },
  { dir: [0, -1, 0], shade: 0.55, corners: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]], n: [0, -1, 0] },
  { dir: [0, 0, 1],  shade: 0.7,  corners: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]], n: [0, 0, 1] },
  { dir: [0, 0, -1], shade: 0.7,  corners: [[1, 0, 0], [0, 0, 0], [0, 1, 0], [1, 1, 0]], n: [0, 0, -1] },
];

function faceTile(block, faceDir) {
  const info = BLOCK_INFO[block];
  if (!info) return 3;
  if (faceDir[1] === 1) return info.tiles.top;
  if (faceDir[1] === -1) return info.tiles.bottom;
  return info.tiles.side;
}

function buildChunk(cx, cz) {
  const key = chunkKey(cx, cz);
  const old = chunkMeshes.get(key);
  if (old) { old.forEach((m) => { scene.remove(m); m.geometry.dispose(); }); }

  const buckets = { opaque: { pos: [], nrm: [], uv: [], col: [], idx: [] }, water: { pos: [], nrm: [], uv: [], col: [], idx: [] }, glass: { pos: [], nrm: [], uv: [], col: [], idx: [] } };

  const x0 = cx * CHUNK, z0 = cz * CHUNK;
  for (let x = x0; x < x0 + CHUNK; x++) {
    for (let z = z0; z < z0 + CHUNK; z++) {
      for (let y = 0; y < WORLD_Y; y++) {
        const b = getBlock(x, y, z);
        if (b === BLOCK.AIR) continue;
        const bucket = b === BLOCK.WATER ? buckets.water : b === BLOCK.GLASS ? buckets.glass : buckets.opaque;
        for (const f of FACES) {
          const nx = x + f.dir[0], ny = y + f.dir[1], nz = z + f.dir[2];
          const nb = getBlock(nx, ny, nz);
          // cull rules
          if (b === BLOCK.WATER) {
            if (nb === BLOCK.WATER) continue;
            if (f.dir[1] === 1 && nb !== BLOCK.AIR) continue;
          } else if (b === BLOCK.GLASS) {
            if (nb === BLOCK.GLASS) continue;
          } else if (b === BLOCK.LEAVES) {
            if (nb === BLOCK.LEAVES) continue;
            if (isOpaque(nx, ny, nz)) continue;
          } else {
            if (nb !== BLOCK.AIR && nb !== BLOCK.WATER && nb !== BLOCK.GLASS) {
              if (isOpaque(nx, ny, nz)) continue;
            }
            if (nb !== BLOCK.AIR && (nb === b || isOpaque(nx, ny, nz))) {
              if (nb !== BLOCK.WATER && nb !== BLOCK.GLASS) continue;
            }
          }
          const tile = faceTile(b, f.dir);
          const [u0, v0, u1, v1] = tileUV(tile);
          const base = bucket.pos.length / 3;
          const uvs = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
          let shade = f.shade;
          if (b === BLOCK.WATER && f.dir[1] === 1) shade = 1.0;
          for (let i = 0; i < 4; i++) {
            const c = f.corners[i];
            bucket.pos.push(x + c[0], y + c[1], z + c[2]);
            bucket.nrm.push(f.n[0], f.n[1], f.n[2]);
            bucket.uv.push(uvs[i][0], uvs[i][1]);
            bucket.col.push(shade, shade, shade);
          }
          bucket.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
        }
      }
    }
  }

  const made = [];
  function toMesh(bucket, mat) {
    if (bucket.idx.length === 0) return;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(bucket.pos, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(bucket.nrm, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(bucket.uv, 2));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(bucket.col, 3));
    geo.setIndex(bucket.idx);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.matrixAutoUpdate = false;
    scene.add(mesh);
    made.push(mesh);
  }
  toMesh(buckets.opaque, opaqueMat);
  toMesh(buckets.water, waterMat);
  toMesh(buckets.glass, glassMat);
  chunkMeshes.set(key, made);
}

function buildAll() {
  for (let cx = 0; cx < WORLD_X / CHUNK; cx++)
    for (let cz = 0; cz < WORLD_Z / CHUNK; cz++) buildChunk(cx, cz);
}

function rebuildAround(x, z) {
  const cx = Math.floor(x / CHUNK), cz = Math.floor(z / CHUNK);
  buildChunk(cx, cz);
  if (x % CHUNK === 0 && cx > 0) buildChunk(cx - 1, cz);
  if (x % CHUNK === CHUNK - 1 && cx < WORLD_X / CHUNK - 1) buildChunk(cx + 1, cz);
  if (z % CHUNK === 0 && cz > 0) buildChunk(cx, cz - 1);
  if (z % CHUNK === CHUNK - 1 && cz < WORLD_Z / CHUNK - 1) buildChunk(cx, cz + 1);
}

// ---------- Player ----------
const player = {
  pos: new THREE.Vector3(WORLD_X / 2 + 0.5, 24, WORLD_Z / 2 + 0.5),
  vel: new THREE.Vector3(),
  yaw: Math.PI * 0.25, pitch: -0.1,
  onGround: false, fly: false,
  w: 0.3, h: 1.8, eye: 1.62,
};

function spawn() {
  const sx = Math.floor(WORLD_X / 2), sz = Math.floor(WORLD_Z / 2);
  for (let y = WORLD_Y - 1; y > 0; y--) {
    const b = getBlock(sx, y, sz);
    if (b !== BLOCK.AIR && b !== BLOCK.WATER) {
      player.pos.set(sx + 0.5, y + 1.01, sz + 0.5);
      player.vel.set(0, 0, 0);
      return;
    }
  }
  player.pos.set(sx + 0.5, 24, sz + 0.5);
}

function collide(axis) {
  const p = player.pos, w = player.w, h = player.h;
  const minX = Math.floor(p.x - w), maxX = Math.floor(p.x + w);
  const minY = Math.floor(p.y), maxY = Math.floor(p.y + h - 0.001);
  const minZ = Math.floor(p.z - w), maxZ = Math.floor(p.z + w);
  for (let x = minX; x <= maxX; x++) for (let y = minY; y <= maxY; y++) for (let z = minZ; z <= maxZ; z++) {
    const b = getBlock(x, y, z);
    if (b === BLOCK.AIR || b === BLOCK.WATER) continue;
    // AABB overlap -> resolve along axis
    if (axis === 'x') { player.pos.x = player.vel.x > 0 ? x - w - 0.001 : x + 1 + w + 0.001; player.vel.x = 0; }
    if (axis === 'z') { player.pos.z = player.vel.z > 0 ? z - w - 0.001 : z + 1 + w + 0.001; player.vel.z = 0; }
    if (axis === 'y') {
      if (player.vel.y <= 0) { player.pos.y = y + 1; player.onGround = true; }
      else { player.pos.y = y - h - 0.001; }
      player.vel.y = 0;
    }
  }
}

const keys = {};
addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (e.code === 'KeyF' && document.pointerLockElement) {
    player.fly = !player.fly;
    player.vel.set(0, 0, 0);
    toast(player.fly ? '🕊️ Fly mode ON' : '🚶 Walk mode');
  }
  if (e.code.startsWith('Digit')) {
    const n = +e.code.slice(5);
    if (n >= 1 && n <= 9) selectSlot(n - 1);
  }
  if (['Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) e.preventDefault();
});
addEventListener('keyup', (e) => { keys[e.code] = false; });

function update(dt) {
  const speed = player.fly ? 14 : (keys.KeyW && keys.ShiftLeft ? 8 : 5.2);
  const sin = Math.sin(player.yaw), cos = Math.cos(player.yaw);
  let ix = 0, iz = 0;
  if (keys.KeyW) { ix -= sin; iz -= cos; }
  if (keys.KeyS) { ix += sin; iz += cos; }
  if (keys.KeyA) { ix -= cos; iz += sin; }
  if (keys.KeyD) { ix += cos; iz -= sin; }
  const len = Math.hypot(ix, iz) || 1;
  ix /= len; iz /= len;

  if (player.fly) {
    player.vel.x = ix * speed; player.vel.z = iz * speed;
    player.vel.y = 0;
    if (keys.Space) player.vel.y += speed * 0.8;
    if (keys.ShiftLeft || keys.ShiftRight) player.vel.y -= speed * 0.8;
    player.pos.x += player.vel.x * dt;
    collide('x');
    player.pos.z += player.vel.z * dt;
    collide('z');
    player.pos.y += player.vel.y * dt;
    collide('y');
  } else {
    player.vel.x = ix * speed; player.vel.z = iz * speed;
    player.vel.y -= 26 * dt;
    if (player.vel.y < -30) player.vel.y = -30;
    // step into water slows fall / swim up
    const feet = getBlock(Math.floor(player.pos.x), Math.floor(player.pos.y + 0.3), Math.floor(player.pos.z));
    if (feet === BLOCK.WATER) {
      player.vel.y = Math.max(player.vel.y, -4);
      if (keys.Space) player.vel.y = 4;
    } else if (keys.Space && player.onGround) {
      player.vel.y = 8.5;
      player.onGround = false;
    }
    player.onGround = false;
    player.pos.x += player.vel.x * dt;
    collide('x');
    player.pos.z += player.vel.z * dt;
    collide('z');
    player.pos.y += player.vel.y * dt;
    collide('y');
    if (player.pos.y < -10) spawn();
  }

  camera.position.set(player.pos.x, player.pos.y + player.eye, player.pos.z);
  camera.rotation.set(0, 0, 0);
  camera.rotation.order = 'YXZ';
  camera.rotation.y = player.yaw;
  camera.rotation.x = player.pitch;
}

// ---------- Look / pointer lock ----------
const menu = document.getElementById('menu');
const playBtn = document.getElementById('play');
playBtn.addEventListener('click', () => canvas.requestPointerLock());
document.addEventListener('pointerlockchange', () => {
  menu.classList.toggle('hidden', !!document.pointerLockElement);
});
document.addEventListener('mousemove', (e) => {
  if (!document.pointerLockElement) return;
  player.yaw -= e.movementX * 0.0025;
  player.pitch -= e.movementY * 0.0025;
  player.pitch = Math.max(-1.55, Math.min(1.55, player.pitch));
});

// ---------- Voxel raycast (Amanatides & Woo) ----------
function raycastVoxel(origin, dir, maxDist) {
  let x = Math.floor(origin.x), y = Math.floor(origin.y), z = Math.floor(origin.z);
  const stepX = Math.sign(dir.x), stepY = Math.sign(dir.y), stepZ = Math.sign(dir.z);
  const tDeltaX = stepX !== 0 ? Math.abs(1 / dir.x) : Infinity;
  const tDeltaY = stepY !== 0 ? Math.abs(1 / dir.y) : Infinity;
  const tDeltaZ = stepZ !== 0 ? Math.abs(1 / dir.z) : Infinity;
  const fx = origin.x - x, fy = origin.y - y, fz = origin.z - z;
  let tMaxX = stepX !== 0 ? (stepX > 0 ? (1 - fx) : fx) * tDeltaX : Infinity;
  let tMaxY = stepY !== 0 ? (stepY > 0 ? (1 - fy) : fy) * tDeltaY : Infinity;
  let tMaxZ = stepZ !== 0 ? (stepZ > 0 ? (1 - fz) : fz) * tDeltaZ : Infinity;
  let face = [0, 0, 0], t = 0;
  for (let i = 0; i < 128; i++) {
    if (tMaxX < tMaxY && tMaxX < tMaxZ) { x += stepX; t = tMaxX; tMaxX += tDeltaX; face = [-stepX, 0, 0]; }
    else if (tMaxY < tMaxZ) { y += stepY; t = tMaxY; tMaxY += tDeltaY; face = [0, -stepY, 0]; }
    else { z += stepZ; t = tMaxZ; tMaxZ += tDeltaZ; face = [0, 0, -stepZ]; }
    if (t > maxDist) return null;
    const b = getBlock(x, y, z);
    if (b !== BLOCK.AIR && b !== BLOCK.WATER) return { x, y, z, face, block: b };
  }
  return null;
}

const highlight = new THREE.LineSegments(
  new THREE.EdgesGeometry(new THREE.BoxGeometry(1.002, 1.002, 1.002)),
  new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.6 })
);
highlight.visible = false;
scene.add(highlight);
let targeted = null;

function breakBlock() {
  if (!targeted) return;
  const { x, y, z } = targeted;
  if (getBlock(x, y, z) === BLOCK.AIR) return;
  setBlock(x, y, z, BLOCK.AIR);
  rebuildAround(x, z);
  dirtySave();
}
function placeBlock() {
  if (!targeted) return;
  const { x, y, z, face } = targeted;
  const px = x + face[0], py = y + face[1], pz = z + face[2];
  if (!inBounds(px, py, pz)) return;
  const cur = getBlock(px, py, pz);
  if (cur !== BLOCK.AIR && cur !== BLOCK.WATER) return;
  // don't place inside player
  const p = player.pos;
  const overlap =
    px + 1 > p.x - player.w && px < p.x + player.w &&
    pz + 1 > p.z - player.w && pz < p.z + player.w &&
    py + 1 > p.y && py < p.y + player.h;
  if (overlap) return;
  setBlock(px, py, pz, HOTBAR[selected]);
  rebuildAround(px, pz);
  dirtySave();
}

document.addEventListener('mousedown', (e) => {
  if (!document.pointerLockElement) return;
  if (e.button === 0) breakBlock();
  if (e.button === 2) placeBlock();
});
document.addEventListener('contextmenu', (e) => e.preventDefault());
addEventListener('wheel', (e) => {
  if (!document.pointerLockElement) return;
  selectSlot((selected + (e.deltaY > 0 ? 1 : HOTBAR.length - 1)) % HOTBAR.length);
}, { passive: true });

// ---------- Hotbar UI ----------
let selected = 0;
const hotbarEl = document.getElementById('hotbar');
const selName = document.getElementById('sel-name');
function blockIcon(block, size = 30) {
  const c = document.createElement('canvas');
  c.width = c.height = 16;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  const info = BLOCK_INFO[block];
  const [ax, ay] = [info.tiles.side % 4, Math.floor(info.tiles.side / 4)];
  g.drawImage(atlas.canvas, ax * 16, ay * 16, 16, 16, 0, 0, 16, 16);
  return c;
}
function renderHotbar() {
  hotbarEl.innerHTML = '';
  HOTBAR.forEach((b, i) => {
    const d = document.createElement('div');
    d.className = 'slot' + (i === selected ? ' active' : '');
    d.innerHTML = `<span class="key">${i + 1}</span>`;
    d.appendChild(blockIcon(b));
    const label = document.createElement('span');
    label.textContent = BLOCK_INFO[b].name.split(' ')[0];
    d.appendChild(label);
    d.addEventListener('click', () => selectSlot(i));
    hotbarEl.appendChild(d);
  });
  selName.textContent = '🧱 ' + BLOCK_INFO[HOTBAR[selected]].name;
}
function selectSlot(i) { selected = i; renderHotbar(); }

// ---------- Save / load ----------
const SAVE_KEY = 'minicraft-world-v1';
let saveTimer = null;
function dirtySave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveNow, 1500);
}
function saveNow() {
  try {
    // RLE compress: [value, count] pairs
    const out = [];
    let run = world[0], n = 1;
    for (let i = 1; i < world.length; i++) {
      if (world[i] === run && n < 65535) { n++; continue; }
      out.push(run, n); run = world[i]; n = 1;
    }
    out.push(run, n);
    localStorage.setItem(SAVE_KEY, JSON.stringify({ seed, data: out }));
    localStorage.setItem('minicraft-meta', JSON.stringify({ seed }));
    toast('💾 World saved');
  } catch { toast('⚠️ Save failed (storage full?)'); }
}
function loadSaved() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (!s || s.seed !== seed || !Array.isArray(s.data)) return false;
    let i = 0, p = 0;
    while (p < s.data.length && i < world.length) {
      const v = s.data[p++], n = s.data[p++];
      for (let k = 0; k < n && i < world.length; k++) world[i++] = v;
    }
    return i === world.length;
  } catch { return false; }
}

document.getElementById('save-world').addEventListener('click', saveNow);
document.getElementById('new-world').addEventListener('click', () => {
  seed = (Math.random() * 1e9) | 0;
  localStorage.setItem('minicraft-meta', JSON.stringify({ seed }));
  localStorage.removeItem(SAVE_KEY);
  generate(); buildAll(); spawn();
  document.getElementById('seed-label').textContent = seed;
  toast('🌍 New world: ' + seed);
});
document.getElementById('reset-spawn').addEventListener('click', () => { spawn(); toast('📍 Respawned'); });

let toastTimer = null;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

// ---------- Boot ----------
document.getElementById('seed-label').textContent = seed;
generate();
if (!loadSaved()) { /* fresh world from generator */ }
buildAll();
spawn();
renderHotbar();

addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------- Main loop ----------
const clock = new THREE.Clock();
const fpsEl = document.getElementById('fps');
const posEl = document.getElementById('pos');
const camDir = new THREE.Vector3();
let acc = 0, frames = 0, fpsT = 0;

function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), 0.05);
  update(dt);

  // block targeting
  camera.getWorldDirection(camDir);
  const eye = new THREE.Vector3(player.pos.x, player.pos.y + player.eye, player.pos.z);
  targeted = raycastVoxel(eye, camDir, REACH);
  if (targeted) {
    highlight.visible = true;
    highlight.position.set(targeted.x + 0.5, targeted.y + 0.5, targeted.z + 0.5);
  } else highlight.visible = false;

  renderer.render(scene, camera);

  frames++; fpsT += dt;
  if (fpsT >= 0.5) {
    fpsEl.textContent = Math.round(frames / fpsT) + ' fps';
    posEl.textContent = `${player.pos.x.toFixed(1)}, ${player.pos.y.toFixed(1)}, ${player.pos.z.toFixed(1)}${player.fly ? ' ✈' : ''}`;
    frames = 0; fpsT = 0;
  }
  void acc;
}
loop();
