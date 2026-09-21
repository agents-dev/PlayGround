import * as THREE from 'three';

/* ============================================================
   MINECRAFT RACING — Blocky Kart Grand Prix
   Voxel speedway, 3 laps vs 3 AI miners, boost pads + emeralds
   ============================================================ */

const TOTAL_LAPS = 3;
const ROAD_HALF = 6.5;
const CURB_HALF = 8.0;

const $ = id => document.getElementById(id);
const loadingEl = $('loading'), menuEl = $('menu'), hudEl = $('hud'),
  finishEl = $('finish'), countdownEl = $('countdown'), touchEl = $('touch');

// ---------- Renderer / scene ----------
const container = $('game-container');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 120, 420);

const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 8, -14);

scene.add(new THREE.HemisphereLight(0xbfe3ff, 0x5a7d3c, 0.95));
const sun = new THREE.DirectionalLight(0xfff6d8, 1.6);
sun.position.set(80, 120, 40);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -120; sun.shadow.camera.right = 120;
sun.shadow.camera.top = 120; sun.shadow.camera.bottom = -120;
sun.shadow.camera.far = 400;
scene.add(sun);

// ---------- Pixel textures (Minecraft feel) ----------
function pixelTex(draw, size = 64) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d'); draw(g, size);
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const rnd = (a, b) => a + Math.random() * (b - a);
function noiseOver(g, size, n, colors) {
  for (let i = 0; i < n; i++) {
    g.fillStyle = colors[(Math.random() * colors.length) | 0];
    const s = 4; g.fillRect((Math.random() * size) | 0, (Math.random() * size) | 0, s, s);
  }
}
const grassTex = pixelTex((g, s) => {
  g.fillStyle = '#6abe30'; g.fillRect(0, 0, s, s);
  noiseOver(g, s, 140, ['#5db32b', '#79d143', '#4e9e26', '#8ae05a']);
});
grassTex.repeat.set(60, 60);
const dirtTex = pixelTex((g, s) => {
  g.fillStyle = '#8a5a32'; g.fillRect(0, 0, s, s);
  noiseOver(g, s, 160, ['#754a28', '#9c6a3d', '#6b4225']);
});
const roadTex = pixelTex((g, s) => {
  g.fillStyle = '#5b5b5b'; g.fillRect(0, 0, s, s);
  noiseOver(g, s, 120, ['#525252', '#646464', '#4a4a4a']);
  g.fillStyle = '#d8d8d8'; // dashed center line along travel (v axis)
  for (let i = 0; i < s; i += 16) g.fillRect(s / 2 - 2, i, 4, 8);
});
roadTex.repeat.set(1, 1); // tiling comes from ribbon UVs (v: 0..50)
const curbRedTex = pixelTex((g, s) => { g.fillStyle = '#c1272d'; g.fillRect(0, 0, s, s); noiseOver(g, s, 60, ['#a01f24', '#d94a4a']); });
const curbWhiteTex = pixelTex((g, s) => { g.fillStyle = '#e8e8e8'; g.fillRect(0, 0, s, s); noiseOver(g, s, 60, ['#cfcfcf', '#ffffff']); });
const goldTex = pixelTex((g, s) => { g.fillStyle = '#f7c948'; g.fillRect(0, 0, s, s); noiseOver(g, s, 90, ['#e0a92e', '#ffe27a', '#c98f1b']); });
const leafTex = pixelTex((g, s) => { g.fillStyle = '#2f9e2f'; g.fillRect(0, 0, s, s); noiseOver(g, s, 130, ['#278a27', '#3fbf3f', '#1f6e1f']); });

// ---------- Track ----------
const controlPts = [
  [0, 0, -62], [48, 0, -55], [72, 0, -18], [66, 0, 22], [38, 0, 42],
  [30, 0, 66], [-8, 0, 62], [-30, 0, 40], [-62, 0, 30], [-74, 0, -8], [-46, 0, -38], [-22, 0, -52],
].map(p => new THREE.Vector3(...p));
const curve = new THREE.CatmullRomCurve3(controlPts, true, 'catmullrom', 0.6);
const SAMPLES = 600;
const centerPts = curve.getSpacedPoints(SAMPLES - 1); // length SAMPLES
centerPts.pop(); centerPts.push(centerPts[0].clone());
const trackLen = curve.getLength();

function tangentAt(i) {
  const a = centerPts[(i - 1 + SAMPLES) % SAMPLES], b = centerPts[(i + 1) % SAMPLES];
  return new THREE.Vector3().subVectors(b, a).normalize();
}
function closestIndex(pos, hint, window = 40) {
  let best = hint, bd = Infinity;
  for (let k = -window; k <= window; k++) {
    const i = (hint + k + SAMPLES) % SAMPLES;
    const d = (centerPts[i].x - pos.x) ** 2 + (centerPts[i].z - pos.z) ** 2;
    if (d < bd) { bd = d; best = i; }
  }
  // global fallback on first call
  if (bd > 1e9) { for (let i = 0; i < SAMPLES; i += 4) { const d = (centerPts[i].x - pos.x) ** 2 + (centerPts[i].z - pos.z) ** 2; if (d < bd) { bd = d; best = i; } } }
  return { index: best, dist: Math.sqrt(bd) };
}
function fullClosest(pos) {
  let best = 0, bd = Infinity;
  for (let i = 0; i < SAMPLES; i++) {
    const d = (centerPts[i].x - pos.x) ** 2 + (centerPts[i].z - pos.z) ** 2;
    if (d < bd) { bd = d; best = i; }
  }
  return { index: best, dist: Math.sqrt(bd) };
}

// Ground — big voxel grass plane
{
  const g = new THREE.Mesh(new THREE.BoxGeometry(600, 2, 600),
    new THREE.MeshLambertMaterial({ map: grassTex }));
  g.position.y = -1.6; g.receiveShadow = true; scene.add(g);
  // dirt under-layer rim visible at edges
  const rim = new THREE.Mesh(new THREE.BoxGeometry(600, 1.2, 600),
    new THREE.MeshLambertMaterial({ map: dirtTex }));
  rim.position.y = -3; scene.add(rim);
}

// Road ribbon + curbs
{
  const verts = [], uvs = [], idx = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const p = centerPts[i % SAMPLES], t = tangentAt(i % SAMPLES);
    const n = new THREE.Vector3(-t.z, 0, t.x);
    const l = p.clone().addScaledVector(n, ROAD_HALF), r = p.clone().addScaledVector(n, -ROAD_HALF);
    verts.push(l.x, 0.02, l.z, r.x, 0.02, r.z);
    uvs.push(0, i / 12, 1, i / 12);
    if (i < SAMPLES) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(idx); geo.computeVertexNormals();
  const road = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ map: roadTex, side: THREE.DoubleSide }));
  road.receiveShadow = true; scene.add(road);

  // curbs: red/white checker strips on both edges (vertex-colored)
  for (const side of [1, -1]) {
    const v = [], col = [], ix = [];
    const cRed = new THREE.Color(0xc1272d), cWhite = new THREE.Color(0xe8e8e8);
    for (let i = 0; i <= SAMPLES; i++) {
      const p = centerPts[i % SAMPLES], t = tangentAt(i % SAMPLES);
      const n = new THREE.Vector3(-t.z, 0, t.x);
      const inner = p.clone().addScaledVector(n, side * ROAD_HALF);
      const outer = p.clone().addScaledVector(n, side * CURB_HALF);
      v.push(inner.x, 0.04, inner.z, outer.x, 0.04, outer.z);
      const c = ((i >> 3) % 2) ? cRed : cWhite;
      col.push(c.r, c.g, c.b, c.r, c.g, c.b);
      if (i < SAMPLES) { const a = i * 2; ix.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    const cg = new THREE.BufferGeometry();
    cg.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    cg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    cg.setIndex(ix); cg.computeVertexNormals();
    const mat = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide });
    const strip = new THREE.Mesh(cg, mat); strip.receiveShadow = true; scene.add(strip);
    void curbWhiteTex;
  }

  // Start/finish checker line
  const p0 = centerPts[0], t0 = tangentAt(0);
  const n0 = new THREE.Vector3(-t0.z, 0, t0.x);
  const lineTex = pixelTex((g, s) => {
    const q = s / 8;
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? '#111' : '#fff'; g.fillRect(x * q, y * q, q, q); }
  });
  const line = new THREE.Mesh(new THREE.PlaneGeometry(ROAD_HALF * 2, 3),
    new THREE.MeshBasicMaterial({ map: lineTex }));
  line.rotation.x = -Math.PI / 2;
  line.rotation.z = Math.atan2(t0.x, t0.z) + Math.PI / 2;
  line.position.copy(p0).add(new THREE.Vector3(0, 0.06, 0));
  scene.add(line);

  // Start gantry: two pillars + banner
  const pilMat = new THREE.MeshLambertMaterial({ color: 0x8a5a32 });
  for (const s of [1, -1]) {
    const pil = new THREE.Mesh(new THREE.BoxGeometry(1.5, 12, 1.5), pilMat);
    pil.position.copy(p0).addScaledVector(n0, s * (ROAD_HALF + 2)).add(new THREE.Vector3(0, 6, 0));
    pil.castShadow = true; scene.add(pil);
  }
  const bannerCanvas = document.createElement('canvas');
  bannerCanvas.width = 512; bannerCanvas.height = 64;
  {
    const g = bannerCanvas.getContext('2d');
    g.fillStyle = '#1a1a1a'; g.fillRect(0, 0, 512, 64);
    g.fillStyle = '#f5f5f5'; g.font = 'bold 40px monospace'; g.textAlign = 'center';
    g.fillText('★ START ★', 256, 47);
  }
  const bannerTex = new THREE.CanvasTexture(bannerCanvas);
  bannerTex.magFilter = THREE.NearestFilter; bannerTex.colorSpace = THREE.SRGBColorSpace;
  const bannerGroup = new THREE.Group();
  const bannerSlab = new THREE.Mesh(new THREE.BoxGeometry((ROAD_HALF + 2) * 2, 2.2, 0.8),
    new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
  bannerSlab.castShadow = true; bannerGroup.add(bannerSlab);
  const bannerMat = new THREE.MeshBasicMaterial({ map: bannerTex });
  for (const s of [1, -1]) {
    const face = new THREE.Mesh(new THREE.PlaneGeometry((ROAD_HALF + 2) * 2 - 0.5, 1.9), bannerMat);
    face.position.z = s * 0.41;
    if (s < 0) face.rotation.y = Math.PI;
    bannerGroup.add(face);
  }
  const banner = bannerGroup;
  banner.position.copy(p0).add(new THREE.Vector3(0, 12, 0));
  banner.rotation.y = Math.atan2(t0.x, t0.z) + Math.PI; // face the approaching karts
  banner.castShadow = true; scene.add(banner);
}

// Boost pads (gold blocks) on the road
const boosts = [];
{
  const geo = new THREE.BoxGeometry(3.4, 0.25, 2.2);
  const mat = new THREE.MeshLambertMaterial({ map: goldTex, emissive: 0x664400, emissiveIntensity: 0.4 });
  for (const frac of [0.14, 0.36, 0.58, 0.8]) {
    const i = Math.floor(frac * SAMPLES) % SAMPLES;
    const p = centerPts[i], t = tangentAt(i);
    const m = new THREE.Mesh(geo, mat);
    m.position.set(p.x, 0.18, p.z);
    m.rotation.y = Math.atan2(t.x, t.z);
    scene.add(m);
    boosts.push({ x: p.x, z: p.z, cd: 0 });
  }
}

// Emeralds to collect
const emeralds = [];
{
  const geo = new THREE.OctahedronGeometry(0.7);
  const mat = new THREE.MeshLambertMaterial({ color: 0x2ee62e, emissive: 0x0a5a0a, emissiveIntensity: 0.7 });
  const fracs = [0.07, 0.2, 0.3, 0.44, 0.52, 0.66, 0.74, 0.88, 0.93, 0.97];
  for (const f of fracs) {
    const i = Math.floor(f * SAMPLES) % SAMPLES;
    const p = centerPts[i], t = tangentAt(i);
    const n = new THREE.Vector3(-t.z, 0, t.x);
    const off = (f * 7 % 2 - 0.5) * 6;
    const m = new THREE.Mesh(geo, mat);
    m.position.set(p.x + n.x * off, 1.2, p.z + n.z * off);
    m.castShadow = true; scene.add(m);
    emeralds.push({ mesh: m, taken: false, respawn: 0 });
  }
}

// Decor: voxel trees, hills, clouds, torches, stands
function addTree(x, z) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3, 1.2),
    new THREE.MeshLambertMaterial({ map: dirtTex }));
  trunk.position.y = 1.5; trunk.castShadow = true; g.add(trunk);
  const lm = new THREE.MeshLambertMaterial({ map: leafTex });
  const c1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.4, 3.6), lm);
  c1.position.y = 4.2; c1.castShadow = true; g.add(c1);
  const c2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.6, 2.2), lm);
  c2.position.y = 6; c2.castShadow = true; g.add(c2);
  g.position.set(x, 0, z);
  const s = rnd(0.8, 1.5); g.scale.setScalar(s);
  scene.add(g);
}
function farFromTrack(x, z) {
  const { dist } = fullClosest({ x, z });
  return dist > 14;
}
{
  let placed = 0, guard = 0;
  while (placed < 90 && guard++ < 2000) {
    const x = rnd(-160, 160), z = rnd(-140, 140);
    if (farFromTrack(x, z)) { addTree(x, z); placed++; }
  }
  // blocky hills
  const hillMat = new THREE.MeshLambertMaterial({ map: grassTex });
  for (let i = 0; i < 14; i++) {
    const x = rnd(-220, 220), z = rnd(-200, 200);
    if (!farFromTrack(x, z)) continue;
    const h = new THREE.Mesh(new THREE.BoxGeometry(rnd(14, 30), rnd(3, 9), rnd(14, 30)), hillMat);
    h.position.set(x, rnd(0.5, 2), z); h.castShadow = h.receiveShadow = true; scene.add(h);
  }
  // torches along track
  const torchMat = new THREE.MeshLambertMaterial({ color: 0x6b4a2e });
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xffc233 });
  for (let i = 0; i < SAMPLES; i += 30) {
    const p = centerPts[i], t = tangentAt(i);
    const n = new THREE.Vector3(-t.z, 0, t.x);
    for (const s of [1, -1]) {
      const pole = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3, 0.4), torchMat);
      pole.position.set(p.x + n.x * s * (CURB_HALF + 1.5), 1.5, p.z + n.z * s * (CURB_HALF + 1.5));
      scene.add(pole);
      const fl = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), flameMat);
      fl.position.set(pole.position.x, 3.3, pole.position.z); scene.add(fl);
    }
  }
  // grandstand
  const standMat = new THREE.MeshLambertMaterial({ color: 0x9e2b25 });
  const p0 = centerPts[0], t0 = tangentAt(0);
  const n0 = new THREE.Vector3(-t0.z, 0, t0.x);
  const stand = new THREE.Mesh(new THREE.BoxGeometry(24, 6, 8), standMat);
  stand.position.copy(p0).addScaledVector(n0, 20).add(new THREE.Vector3(0, 2.4, 0));
  stand.rotation.y = Math.atan2(t0.x, t0.z);
  stand.castShadow = true; scene.add(stand);
}
const clouds = [];
{
  const cm = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.92 });
  for (let i = 0; i < 12; i++) {
    const g = new THREE.Group();
    for (let j = 0; j < 4; j++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(rnd(6, 14), rnd(2, 3), rnd(4, 8)), cm);
      b.position.set(rnd(-8, 8), rnd(-1, 1), rnd(-4, 4)); g.add(b);
    }
    g.position.set(rnd(-250, 250), rnd(45, 75), rnd(-250, 250));
    scene.add(g); clouds.push({ g, v: rnd(0.8, 2) });
  }
}

// ---------- Karts (blocky minecart-cars) ----------
function buildKart(bodyColor, driverShirt) {
  const kart = new THREE.Group();
  const bodyMat = new THREE.MeshLambertMaterial({ color: bodyColor });
  const darkMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.7, 3.4), bodyMat);
  body.position.y = 0.75; body.castShadow = true; kart.add(body);
  const nose = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 0.9), bodyMat);
  nose.position.set(0, 0.65, 2.05); nose.castShadow = true; kart.add(nose);
  // driver torso + head (minecraft-ish)
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.55), new THREE.MeshLambertMaterial({ color: driverShirt }));
  torso.position.set(0, 1.5, -0.3); torso.castShadow = true; kart.add(torso);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.85, 0.85), new THREE.MeshLambertMaterial({ color: 0xe0ac69 }));
  head.position.set(0, 2.35, -0.3); head.castShadow = true; kart.add(head);
  const eyeM = new THREE.MeshBasicMaterial({ color: 0x1a1a4a });
  for (const s of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.05), eyeM);
    eye.position.set(s * 0.2, 2.4, 0.14); head.add(eye);
  }
  // helmet brim
  const helm = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.25, 1.0), bodyMat);
  helm.position.set(0, 2.85, -0.3); kart.add(helm);
  // wheels
  const wheels = [];
  const wg = new THREE.BoxGeometry(0.55, 0.9, 0.9);
  for (const [x, z] of [[-1.25, 1.2], [1.25, 1.2], [-1.25, -1.2], [1.25, -1.2]]) {
    const w = new THREE.Mesh(wg, darkMat);
    w.position.set(x, 0.45, z); w.castShadow = true; kart.add(w); wheels.push(w);
  }
  kart.userData.wheels = wheels;
  return kart;
}

const PLAYER_COLORS = [0x2456e0, 0xd02a2a, 0x2a9e2a, 0xe09a1a];
const SHIRTS = [0x2a9edb, 0x7a2a2a, 0x3a6e2a, 0x6e5a1a];
const NAMES = ['YOU', 'Steve', 'Alex', 'Herobrine'];

function spawnOnTrack(frac, lateral) {
  const i = Math.floor(frac * SAMPLES) % SAMPLES;
  const p = centerPts[i], t = tangentAt(i);
  const n = new THREE.Vector3(-t.z, 0, t.x);
  return {
    pos: new THREE.Vector3(p.x + n.x * lateral, 0, p.z + n.z * lateral),
    heading: Math.atan2(t.x, t.z),
  };
}

const racers = [];
function gridSlot(k) { return k === 0 ? 3 : k - 1; } // player starts at the back
function gridSpawn(k) {
  const slot = gridSlot(k);
  return spawnOnTrack(0.997 - slot * 0.008, (slot % 2 ? -2.5 : 2.5));
}
for (let k = 0; k < 4; k++) {
  const s = gridSpawn(k);
  const mesh = buildKart(PLAYER_COLORS[k], SHIRTS[k]);
  mesh.position.copy(s.pos); mesh.rotation.y = s.heading;
  scene.add(mesh);
  racers.push({
    name: NAMES[k], mesh, isPlayer: k === 0,
    pos: s.pos.clone(), heading: s.heading, speed: 0,
    idx: Math.floor((0.997 - gridSlot(k) * 0.008) * SAMPLES) % SAMPLES,
    lap: 1, totalDist: -gridSlot(k) * 8, lastLapT: 0, lapTimes: [],
    baseSpeed: [0, 24.5, 23.2, 25.6][k], // AI pace variety
    lateral: (gridSlot(k) % 2 ? -2 : 2), wob: Math.random() * 10,
    offroad: false, boostT: 0, score: 0,
  });
}
const player = racers[0];

// dust particles
const dustPool = [];
{
  const dg = new THREE.BoxGeometry(0.35, 0.35, 0.35);
  for (let i = 0; i < 120; i++) {
    const m = new THREE.Mesh(dg, new THREE.MeshBasicMaterial({ color: 0xcfb78f, transparent: true, opacity: 0 }));
    m.visible = false; scene.add(m);
    dustPool.push({ m, life: 0, vel: new THREE.Vector3() });
  }
}
function puff(x, y, z, color = 0xcfb78f) {
  const p = dustPool.find(d => d.life <= 0); if (!p) return;
  p.life = rnd(0.4, 0.8); p.m.visible = true;
  p.m.material.color.setHex(color); p.m.material.opacity = 0.9;
  p.m.position.set(x, y, z);
  p.vel.set(rnd(-3, 3), rnd(2, 5), rnd(-3, 3));
}

// ---------- Audio (tiny synth) ----------
let AC = null;
function beep(freq, dur = 0.15, type = 'square', vol = 0.15) {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, AC.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + dur);
    o.connect(g).connect(AC.destination); o.start(); o.stop(AC.currentTime + dur);
  } catch { /* no audio */ }
}

// ---------- Input ----------
const keys = {};
addEventListener('keydown', e => { keys[e.code] = true; if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault(); });
addEventListener('keyup', e => keys[e.code] = false);
function bindHold(id, code) {
  const el = $(id);
  const on = e => { e.preventDefault(); keys[code] = true; };
  const off = e => { e.preventDefault(); keys[code] = false; };
  el.addEventListener('pointerdown', on); el.addEventListener('pointerup', off);
  el.addEventListener('pointerleave', off); el.addEventListener('pointercancel', off);
}
bindHold('t-up', 'ArrowUp'); bindHold('t-down', 'ArrowDown');
bindHold('t-left', 'ArrowLeft'); bindHold('t-right', 'ArrowRight');
const touchDevice = matchMedia('(pointer: coarse)').matches;

// ---------- Game state ----------
let state = 'menu'; // menu | countdown | racing | finished
let raceTime = 0, countdownT = 0, finishOrder = [];
let bestLapStored = parseFloat(localStorage.getItem('mc-race-best') || '0') || 0;
if (bestLapStored) $('menu-best').textContent = fmtTime(bestLapStored);

function fmtTime(t) {
  const m = Math.floor(t / 60), s = t - m * 60;
  return `${m}:${s.toFixed(1).padStart(4, '0')}`;
}

function resetRace() {
  raceTime = 0; finishOrder = [];
  for (let k = 0; k < 4; k++) {
    const r = racers[k];
    const s = gridSpawn(k);
    r.pos.copy(s.pos); r.heading = s.heading; r.speed = 0;
    r.idx = Math.floor((0.997 - gridSlot(k) * 0.008) * SAMPLES) % SAMPLES;
    r.lap = 1; r.totalDist = -gridSlot(k) * 8; r.lapTimes = []; r.lastLapT = 0;
    r.boostT = 0; r.score = 0;
    r.mesh.position.copy(s.pos); r.mesh.rotation.y = s.heading;
  }
  for (const e of emeralds) { e.taken = false; e.respawn = 0; e.mesh.visible = true; }
  finishEl.classList.add('hidden');
  $('lap').textContent = '1'; $('pos').textContent = '4'; $('time').textContent = '0:00.0';
}

function startCountdown() {
  resetRace();
  menuEl.classList.add('hidden'); finishEl.classList.add('hidden');
  hudEl.classList.remove('hidden');
  if (touchDevice) touchEl.classList.remove('hidden');
  state = 'countdown'; countdownT = 0;
  countdownEl.textContent = '';
  // snap chase camera behind player so the countdown starts framed
  const back0 = new THREE.Vector3(-Math.sin(player.heading), 0, -Math.cos(player.heading));
  camPos.copy(player.pos).addScaledVector(back0, 12).add(new THREE.Vector3(0, 6.2, 0));
  camLook.copy(player.pos).add(new THREE.Vector3(0, 2, 0))
    .addScaledVector(new THREE.Vector3(Math.sin(player.heading), 0, Math.cos(player.heading)), 6);
  camera.position.copy(camPos); camera.lookAt(camLook);
  loadingEl.style.display = 'none';
}
$('start-btn').addEventListener('click', () => { beep(660); startCountdown(); });
$('restart-btn').addEventListener('click', () => { beep(660); startCountdown(); });

function showPickup(text, color = '#54ff54') {
  const el = $('pickup-msg'); el.textContent = text; el.style.color = color; el.style.opacity = 1;
  clearTimeout(showPickup._t); showPickup._t = setTimeout(() => el.style.opacity = 0, 1200);
}

// ---------- Physics / AI update ----------
function updatePlayer(r, dt) {
  const fwd = keys.ArrowUp || keys.KeyW, back = keys.ArrowDown || keys.KeyS;
  const left = keys.ArrowLeft || keys.KeyA, right = keys.ArrowRight || keys.KeyD;
  const { index, dist } = closestIndex(r.pos, r.idx);
  // lap counting via index wrap
  let dIdx = index - r.idx;
  if (dIdx < -SAMPLES / 2) dIdx += SAMPLES;
  if (dIdx > SAMPLES / 2) dIdx -= SAMPLES;
  r.totalDist += dIdx * (trackLen / SAMPLES);
  r.idx = index;
  r.offroad = dist > CURB_HALF;

  const onBoost = r.boostT > 0;
  const maxSp = onBoost ? 40 : (r.offroad ? 11 : 29);
  if (fwd) r.speed += 20 * dt;
  else if (back) r.speed -= (r.speed > 1 ? 34 : 12) * dt;
  else r.speed -= Math.sign(r.speed) * Math.min(Math.abs(r.speed), 8 * dt);
  if (r.offroad && !onBoost) r.speed -= Math.sign(r.speed) * Math.min(Math.abs(r.speed), 14 * dt);
  r.speed = THREE.MathUtils.clamp(r.speed, -8, maxSp);
  if (r.boostT > 0) r.boostT -= dt;

  const grip = r.offroad ? 0.55 : 1;
  const steerPower = 2.3 * grip * THREE.MathUtils.clamp(Math.abs(r.speed) / 8, 0, 1);
  if (left) r.heading += steerPower * dt * Math.sign(r.speed || 1);
  if (right) r.heading -= steerPower * dt * Math.sign(r.speed || 1);

  // wall clamp at curb edge
  if (dist > CURB_HALF + 0.4) {
    const c = centerPts[index];
    const dir = new THREE.Vector3(r.pos.x - c.x, 0, r.pos.z - c.z).normalize();
    r.pos.set(c.x + dir.x * (CURB_HALF + 0.4), 0, c.z + dir.z * (CURB_HALF + 0.4));
    r.speed *= 0.94;
    if (Math.abs(r.speed) > 6 && Math.random() < 0.5) puff(r.pos.x, 0.6, r.pos.z);
  }

  r.pos.x += Math.sin(r.heading) * r.speed * dt;
  r.pos.z += Math.cos(r.heading) * r.speed * dt;

  // boost pads
  for (const b of boosts) {
    const d2 = (r.pos.x - b.x) ** 2 + (r.pos.z - b.z) ** 2;
    if (d2 < 6 && r.boostT <= 0) {
      r.boostT = 1.4; r.speed = Math.max(r.speed, 34);
      beep(880, 0.25, 'sawtooth'); showPickup('⚡ BOOST! ⚡', '#ffd94d');
      for (let i = 0; i < 8; i++) puff(r.pos.x, 0.8, r.pos.z, 0xffd94d);
    }
  }
  // emeralds
  for (const e of emeralds) {
    if (e.taken) continue;
    const dx = r.pos.x - e.mesh.position.x, dz = r.pos.z - e.mesh.position.z;
    if (dx * dx + dz * dz < 4.5) {
      e.taken = true; e.respawn = 20; e.mesh.visible = false;
      r.score += 100; beep(1320, 0.18, 'square');
      showPickup('+100 ⬢ emerald!');
      for (let i = 0; i < 6; i++) puff(e.mesh.position.x, 1.2, e.mesh.position.z, 0x2ee62e);
    }
  }

  // lap detection: totalDist crosses multiples of trackLen
  const lapsDone = Math.floor(r.totalDist / trackLen);
  if (r.lap - 1 < lapsDone && lapsDone >= 0) {
    r.lap = lapsDone + 1;
    const lt = raceTime - r.lastLapT; r.lastLapT = raceTime; r.lapTimes.push(lt);
    if (r.isPlayer) {
      if (r.lap <= TOTAL_LAPS) { beep(990, 0.2); showPickup(`LAP ${r.lap}/${TOTAL_LAPS} — ${fmtTime(lt)}`, '#ffff54'); }
      $('lap').textContent = Math.min(r.lap, TOTAL_LAPS);
    }
  }
  if (r.offroad && Math.abs(r.speed) > 5 && Math.random() < 0.35) puff(r.pos.x, 0.5, r.pos.z);
}

function updateAI(r, dt, t) {
  r.wob += dt;
  const targetSpeed = r.baseSpeed * (1 + 0.06 * Math.sin(r.wob * 0.7)) + (r.totalDist < player.totalDist - 60 ? 2.5 : 0);
  r.speed += THREE.MathUtils.clamp(targetSpeed - r.speed, -12 * dt, 10 * dt);
  // advance along track
  const step = (r.speed * dt / trackLen) * SAMPLES;
  // lateral wiggle + avoid player slightly
  const wantLat = Math.sin(r.wob * 0.5 + r.lateral) * 3;
  const ahead = centerPts[(r.idx + 12) % SAMPLES];
  const toP = new THREE.Vector3(player.pos.x - ahead.x, 0, player.pos.z - ahead.z);
  const tng = tangentAt((r.idx + 12) % SAMPLES);
  const side = toP.x * -tng.z + toP.z * tng.x;
  let lat = wantLat;
  if (toP.length() < 8) lat += side > 0 ? -3 : 3;
  lat = THREE.MathUtils.clamp(lat, -ROAD_HALF + 1.4, ROAD_HALF - 1.4);

  const newIdx = (Math.round(r.idx + step) + SAMPLES) % SAMPLES;
  let dIdx = newIdx - r.idx;
  if (dIdx < -SAMPLES / 2) dIdx += SAMPLES;
  if (dIdx > SAMPLES / 2) dIdx -= SAMPLES;
  r.totalDist += dIdx * (trackLen / SAMPLES);
  r.idx = ((r.idx + Math.round(step)) % SAMPLES + SAMPLES) % SAMPLES;
  const c = centerPts[r.idx], tn = tangentAt(r.idx);
  const n = new THREE.Vector3(-tn.z, 0, tn.x);
  // smooth lateral
  r.lateral += (lat - r.lateral) * Math.min(1, dt * 2);
  r.pos.set(c.x + n.x * r.lateral, 0, c.z + n.z * r.lateral);
  const targetHeading = Math.atan2(tn.x, tn.z);
  let dh = targetHeading - r.heading;
  while (dh > Math.PI) dh -= 2 * Math.PI;
  while (dh < -Math.PI) dh += 2 * Math.PI;
  r.heading += dh * Math.min(1, dt * 6);

  const lapsDone = Math.floor(r.totalDist / trackLen);
  if (r.lap - 1 < lapsDone && lapsDone >= 0) {
    r.lap = lapsDone + 1;
    const lt = raceTime - r.lastLapT; r.lastLapT = raceTime; r.lapTimes.push(lt);
  }
  void t;
}

function racePositions() {
  return [...racers].sort((a, b) => b.totalDist - a.totalDist);
}

// ---------- Minimap ----------
const mm = $('minimap').getContext('2d');
function drawMinimap() {
  const W = 170, H = 170;
  mm.clearRect(0, 0, W, H);
  // bounds
  let minX = 1e9, maxX = -1e9, minZ = 1e9, maxZ = -1e9;
  for (const p of centerPts) { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z); }
  const sx = (W - 20) / (maxX - minX), sz = (H - 20) / (maxZ - minZ);
  const s = Math.min(sx, sz);
  const X = x => 10 + (x - minX) * s + ((W - 20) - (maxX - minX) * s) / 2;
  const Z = z => 10 + (z - minZ) * s + ((H - 20) - (maxZ - minZ) * s) / 2;
  mm.lineWidth = 7; mm.strokeStyle = '#555'; mm.lineJoin = 'round';
  mm.beginPath();
  centerPts.forEach((p, i) => i ? mm.lineTo(X(p.x), Z(p.z)) : mm.moveTo(X(p.x), Z(p.z)));
  mm.closePath(); mm.stroke();
  mm.lineWidth = 4; mm.strokeStyle = '#aaa'; mm.stroke();
  const order = racePositions();
  for (const r of order) {
    mm.fillStyle = r.isPlayer ? '#3a7bff' : '#ff4444';
    mm.beginPath(); mm.arc(X(r.pos.x), Z(r.pos.z), r.isPlayer ? 5 : 4, 0, 7); mm.fill();
    mm.lineWidth = 2; mm.strokeStyle = '#000'; mm.stroke();
  }
}

// ---------- Camera ----------
const camPos = new THREE.Vector3(0, 8, -14), camLook = new THREE.Vector3();
function updateCamera(dt) {
  const back = new THREE.Vector3(-Math.sin(player.heading), 0, -Math.cos(player.heading));
  const want = player.pos.clone().addScaledVector(back, 12).add(new THREE.Vector3(0, 6.2, 0));
  // keep camera above ground & out of hills roughly
  want.y = Math.max(want.y, 3.5);
  camPos.lerp(want, 1 - Math.pow(0.001, dt));
  camera.position.copy(camPos);
  camLook.lerp(player.pos.clone().add(new THREE.Vector3(0, 2, 0)).addScaledVector(new THREE.Vector3(Math.sin(player.heading), 0, Math.cos(player.heading)), 6), 1 - Math.pow(0.0005, dt));
  camera.lookAt(camLook);
}

// menu orbit camera
let menuAngle = 0;
function menuCamera(dt) {
  menuAngle += dt * 0.12;
  const c = centerPts[0];
  camera.position.set(c.x + Math.sin(menuAngle) * 55, 26, c.z + Math.cos(menuAngle) * 55);
  camera.lookAt(c.x, 0, c.z);
}

// ---------- Finish ----------
function endRace() {
  state = 'finished';
  const order = racePositions();
  const pPos = order.indexOf(player) + 1;
  const won = pPos === 1;
  beep(won ? 1046 : 330, 0.5, 'square', 0.2);
  setTimeout(() => beep(won ? 1318 : 262, 0.5, 'square', 0.2), 250);
  $('finish-title').textContent = won ? '🏆 YOU WIN!' : `#${pPos} — ${order[0].name.toUpperCase()} WINS`;
  $('finish-sub').textContent = won ? 'You conquered the Overworld Speedway!' : 'The mineshaft echoes… try again, racer!';
  const best = Math.min(...player.lapTimes);
  if (player.lapTimes.length && (!bestLapStored || best < bestLapStored)) {
    bestLapStored = best; localStorage.setItem('mc-race-best', String(best));
    $('menu-best').textContent = fmtTime(best);
  }
  $('finish-table').innerHTML = order.map((r, i) =>
    `<div>${['🥇', '🥈', '🥉', '4️⃣'][i]} ${r.name} — ${r.lapTimes.length ? fmtTime(r.lapTimes.reduce((a, b) => a + b, 0)) : '--'} ${r.isPlayer ? `&nbsp;⬢${r.score}` : ''}</div>`
  ).join('') + `<div style="color:#ffd94d">Best lap: ${player.lapTimes.length ? fmtTime(Math.min(...player.lapTimes)) : '--'}</div>`;
  setTimeout(() => finishEl.classList.remove('hidden'), 900);
  touchEl.classList.add('hidden');
}

// ---------- Main loop ----------
const clock = new THREE.Clock();
let flashT = 0;
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  // clouds drift
  for (const c of clouds) { c.g.position.x += c.v * dt; if (c.g.position.x > 260) c.g.position.x = -260; }
  // emeralds spin + respawn
  for (const e of emeralds) {
    if (e.taken) { e.respawn -= dt; if (e.respawn <= 0) { e.taken = false; e.mesh.visible = true; } }
    else { e.mesh.rotation.y += dt * 2; e.mesh.position.y = 1.2 + Math.sin(t * 3 + e.mesh.position.x) * 0.25; }
  }
  // dust
  for (const d of dustPool) {
    if (d.life <= 0) continue;
    d.life -= dt;
    d.vel.y -= 6 * dt;
    d.m.position.addScaledVector(d.vel, dt);
    d.m.material.opacity = Math.max(0, d.life);
    d.m.rotation.x += dt * 3;
    if (d.life <= 0) d.m.visible = false;
  }
  // boost pad pulse
  boosts.forEach((b, i) => { /* static gold blocks, subtle via emissive already */ void i; });

  if (state === 'menu') {
    menuCamera(dt);
    // idle karts bob
    racers.forEach((r, i) => { r.mesh.position.y = Math.sin(t * 2 + i) * 0.05; });
  } else if (state === 'countdown') {
    countdownT += dt;
    updateCamera(0.016);
    drawMinimap();
    const step = Math.floor(countdownT / 0.8);
    const labels = ['3', '2', '1', 'GO!'];
    const cur = labels[Math.min(step, 3)];
    if (countdownEl.textContent !== cur) {
      countdownEl.textContent = cur;
      countdownEl.style.color = cur === 'GO!' ? '#54ff54' : '#ffff54';
      beep(cur === 'GO!' ? 880 : 440, cur === 'GO!' ? 0.4 : 0.15);
      if (cur === 'GO!') { const f = $('go-flash'); f.style.opacity = 1; setTimeout(() => f.style.opacity = 0, 300); }
    }
    if (countdownT > 3.2) { countdownEl.textContent = ''; state = 'racing'; }
  } else if (state === 'racing') {
    raceTime += dt;
    updatePlayer(player, dt);
    for (const r of racers) if (!r.isPlayer) updateAI(r, dt, t);
    updateCamera(dt);
    // check finish
    for (const r of racers) {
      if (r.lap > TOTAL_LAPS && !finishOrder.includes(r)) {
        finishOrder.push(r);
        if (r.isPlayer) { endRace(); break; }
        else showPickup(`${r.name} finished!`, '#ff9a9a');
      }
    }
    if (state === 'racing' && finishOrder.length === 4) endRace();
    else if (state === 'racing' && player.lap > TOTAL_LAPS) endRace();
    // HUD
    $('time').textContent = fmtTime(raceTime);
    $('speed').textContent = Math.round(Math.abs(player.speed) * 3.6);
    $('pos').textContent = racePositions().indexOf(player) + 1;
    drawMinimap();
  } else if (state === 'finished') {
    updateCamera(dt);
    for (const r of racers) {
      if (r.lap <= TOTAL_LAPS) { if (r.isPlayer) updatePlayer(r, dt); else updateAI(r, dt, t); }
      else { // victory cruise: keep rolling slowly
        r.pos.x += Math.sin(r.heading) * 8 * dt; r.pos.z += Math.cos(r.heading) * 8 * dt;
      }
    }
    $('time').textContent = fmtTime(raceTime);
    drawMinimap();
  }

  // sync meshes
  for (const r of racers) {
    r.mesh.position.set(r.pos.x, r.mesh.position.y * 0 + 0, r.pos.z);
    // small suspension bounce by speed
    r.mesh.position.y = Math.min(0.25, Math.abs(r.speed) * 0.006) + (r.offroad ? Math.sin(t * 30) * 0.08 : 0);
    r.mesh.rotation.y = r.heading;
    r.mesh.rotation.z = 0;
    // wheel spin
    for (const w of r.mesh.userData.wheels) w.rotation.x += r.speed * dt * 1.5;
    // lean into steering
    if (r.isPlayer) {
      const lean = ((keys.ArrowLeft || keys.KeyA) ? 0.06 : 0) - ((keys.ArrowRight || keys.KeyD) ? 0.06 : 0);
      r.mesh.rotation.z = lean * Math.min(1, Math.abs(r.speed) / 15);
    }
  }

  renderer.render(scene, camera);
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

loadingEl.style.display = 'none';
animate();

// quick self-check hook for automated verification
window.__mcRace = { racers, get state() { return state; }, start: startCountdown };
