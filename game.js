import * as THREE from 'three';
// ============ PG: BATTLEGROUNDS 3D — third-person battle royale ============
const $ = id => document.getElementById(id);
const canvas = $('game');

// ---------- Audio (procedural, no assets) ----------
let AC = null;
function beep(freq = 440, dur = 0.08, type = 'square', vol = 0.08) {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === 'suspended') AC.resume();
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.value = freq; g.gain.value = vol;
    o.connect(g); g.connect(AC.destination); o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + dur);
    o.stop(AC.currentTime + dur);
  } catch (e) {}
}
const SFX = {
  shoot: w => beep({ pistol: 700, smg: 900, rifle: 520, shotgun: 200, sniper: 150, fists: 300 }[w] || 600, .07, 'square', .05),
  distant: d => beep(180, .09, 'square', Math.max(0.008, 0.05 - d * 0.00008)),
  hit: () => beep(1200, .05, 'square', .07),
  hurt: () => beep(160, .15, 'sawtooth', .12),
  pickup: () => beep(880, .09, 'sine', .1),
  zone: () => beep(220, .4, 'sawtooth', .1),
  kill: () => { beep(660, .08, 'square', .1); setTimeout(() => beep(990, .12, 'square', .1), 90); },
  win: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, .25, 'triangle', .12), i * 180)),
};

// ---------- Config ----------
const GUNS = {
  fists:   { name: 'FISTS',  dmg: 16, cd: 420,  mag: Infinity, reserve: Infinity, reload: 0,    spread: 0,    pellets: 1, range: 4,   auto: false, brate: 0,   color: 0xcccccc, len: 0 },
  pistol:  { name: 'P1911',  dmg: 18, cd: 300,  mag: 12, reload: 1100, spread: 0.025, pellets: 1, range: 170, auto: false, brate: 950,  color: 0xe8d44d, len: 1.1 },
  smg:     { name: 'VECTOR', dmg: 13, cd: 105,  mag: 32, reload: 1600, spread: 0.045, pellets: 1, range: 190, auto: true,  brate: 800,  color: 0x59c2ff, len: 1.2 },
  rifle:   { name: 'AK-M',   dmg: 24, cd: 145,  mag: 30, reload: 2000, spread: 0.022, pellets: 1, range: 300, auto: true,  brate: 1000, color: 0xff9f43, len: 1.7 },
  shotgun: { name: 'S686',   dmg: 9,  cd: 850,  mag: 6,  reload: 2300, spread: 0.09,  pellets: 7, range: 110, auto: false, brate: 650,  color: 0xff5d5d, len: 1.5 },
  sniper:  { name: 'AWM',    dmg: 92, cd: 1600, mag: 5,  reload: 3000, spread: 0.004, pellets: 1, range: 500, auto: false, brate: 1600, color: 0xb98cff, len: 2.1 },
};
const LOOT_W = ['pistol', 'pistol', 'smg', 'rifle', 'rifle', 'shotgun', 'sniper', 'medkit', 'medkit', 'ammo', 'armor'];
const NAMES = ['Shroud','Ninja','Panda','Viper','Ghost','Reaper','Falcon','Tiger','Wolf','Storm','Blaze','Cobra','Duke','Echo','Fury','Grizz','Havoc','Ivy','Jax','Kruger','Lynx','Mamba','Nova','Onyx','Piper','Quinn','Rogue','Sarge','Tex','Uzi','Vandal','Wraith','Xeno','Yuri','Zeus','Ash','Boris','Casper','Dagger','Ember'];

// ---------- State ----------
let W = 1600, BOT_N = 19;
let players = [], loots = [], walls = [], rocks = [], trees = [];
let keys = {}, mouseDown = false, ads = false, mouseClicked = false;
let yaw = 0, pitch = -0.08, dragging = false, lastMX = 0, lastMY = 0;
let me = null, state = 'menu', startT = 0, elapsed = 0;
let zone = { x: 0, z: 0, r: 0, tx: 0, tz: 0, tr: 0, phase: 0, mode: 'wait', t: 0, sx: 0, sz: 0, sr: 0 };
const PHASES = [{ wait: 16, shrink: 24, dps: 2 }, { wait: 12, shrink: 20, dps: 5 }, { wait: 10, shrink: 16, dps: 9 }, { wait: 8, shrink: 14, dps: 14 }, { wait: 7, shrink: 12, dps: 20 }, { wait: 6, shrink: 11, dps: 28 }];
let plane = { x1: 0, z1: 0, x2: 0, z2: 0 };
let frames = 0, fpsT = 0, fps = 0;
const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ---------- Three.js setup ----------
let renderer = null;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
} catch (e) {
  $('nogl').classList.remove('hidden');
  throw e;
}
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.25));
function resize() { renderer.setSize(innerWidth, innerHeight); }
addEventListener('resize', resize); resize();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87bfe8);
scene.fog = new THREE.Fog(0x9fcbe8, 120, 950);
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 3000);
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });
scene.add(new THREE.HemisphereLight(0xcfe8ff, 0x4a7a40, 1.0));
const sun = new THREE.DirectionalLight(0xfff2d9, 1.6);
sun.position.set(300, 500, 200);
scene.add(sun);

// ground with painted texture
function makeGroundTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 1024;
  const g = c.getContext('2d');
  g.fillStyle = '#5c8a4a'; g.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 5200; i++) {
    g.fillStyle = `rgba(${40 + Math.random() * 50 | 0},${110 + Math.random() * 60 | 0},${50 + Math.random() * 40 | 0},0.5)`;
    g.fillRect(Math.random() * 1024, Math.random() * 1024, 3, 3);
  }
  return c;
}
const groundCanvas = makeGroundTexture();
const groundTex = new THREE.CanvasTexture(groundCanvas);
groundTex.colorSpace = THREE.SRGBColorSpace;
groundTex.anisotropy = 4;
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(W + 600, W + 600),
  new THREE.MeshLambertMaterial({ map: groundTex })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);
function paintTowns(townC) {
  const g = groundCanvas.getContext('2d');
  const s = 1024 / (W + 600);
  for (const t of townC) {
    g.fillStyle = '#b09a6a';
    g.fillRect((t.x + (W + 600) / 2 - 90) * s, (t.z + (W + 600) / 2 - 90) * s, 180 * s, 180 * s);
  }
  groundTex.needsUpdate = true;
}

// zone wall + target ring
const zoneWall = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 1, 140, 72, 1, true),
  new THREE.MeshBasicMaterial({ color: 0x3a7bff, transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false })
);
zoneWall.position.y = 60;
scene.add(zoneWall);
const targetRing = new THREE.Mesh(
  new THREE.RingGeometry(0.97, 1.0, 72),
  new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false })
);
targetRing.rotation.x = -Math.PI / 2;
targetRing.position.y = 0.15;
scene.add(targetRing);

// plane (visual flyover)
const planeMesh = new THREE.Group();
{
  const m = new THREE.MeshLambertMaterial({ color: 0x444c55 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 22), m);
  const wing = new THREE.Mesh(new THREE.BoxGeometry(30, 0.8, 6), m);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(10, 0.8, 4), m);
  tail.position.set(0, 2, 10);
  planeMesh.add(body, wing, tail);
  planeMesh.visible = false;
  scene.add(planeMesh);
}

// shared geometries/materials
const GEO = {
  leg: new THREE.BoxGeometry(0.34, 0.85, 0.36),
  torso: new THREE.BoxGeometry(0.95, 1.0, 0.52),
  head: new THREE.BoxGeometry(0.55, 0.55, 0.55),
  arm: new THREE.BoxGeometry(0.28, 0.28, 0.9),
  chute: new THREE.ConeGeometry(3.2, 2.2, 8),
};
const MAT = {
  skin: new THREE.MeshLambertMaterial({ color: 0xd9a066 }),
  pants: new THREE.MeshLambertMaterial({ color: 0x3a4a3a }),
  wall: new THREE.MeshLambertMaterial({ color: 0xc9a06a }),
  wallTop: new THREE.MeshLambertMaterial({ color: 0x8a5f3a }),
  rock: new THREE.MeshLambertMaterial({ color: 0x8d8d8d }),
  trunk: new THREE.MeshLambertMaterial({ color: 0x6b4a2f }),
  leaf: new THREE.MeshLambertMaterial({ color: 0x2f7a34 }),
};
function playerMaterials(color) {
  return {
    torso: new THREE.MeshLambertMaterial({ color }),
    leg: MAT.pants, head: MAT.skin,
  };
}
const GUN_MAT = new THREE.MeshLambertMaterial({ color: 0x222222 });

// tracers pool
const tracers = [];
for (let i = 0; i < 48; i++) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
  const mat = new THREE.LineBasicMaterial({ color: 0xffe66d, transparent: true, opacity: 0 });
  const line = new THREE.Line(geo, mat);
  line.frustumCulled = false;
  scene.add(line);
  tracers.push({ line, t: 1 });
}
let tracerIdx = 0;
const _v1 = new THREE.Vector3(), _v2 = new THREE.Vector3();
function spawnTracer(a, b, color = 0xffe66d) {
  const t = tracers[tracerIdx++ % tracers.length];
  const p = t.line.geometry.attributes.position.array;
  p[0] = a.x; p[1] = a.y; p[2] = a.z; p[3] = b.x; p[4] = b.y; p[5] = b.z;
  t.line.geometry.attributes.position.needsUpdate = true;
  t.line.material.color.setHex(color);
  t.line.material.opacity = 0.95;
  t.t = 0;
}
const muzzleLight = new THREE.PointLight(0xffcc66, 0, 30);
scene.add(muzzleLight);
let muzzleT = 0;

// impact puffs pool (small expanding spheres)
const puffs = [];
{
  const pg = new THREE.SphereGeometry(0.3, 8, 6);
  for (let i = 0; i < 24; i++) {
    const m = new THREE.Mesh(pg, new THREE.MeshBasicMaterial({ color: 0xbb6622, transparent: true, opacity: 0 }));
    scene.add(m); puffs.push({ m, t: 1 });
  }
}
let puffIdx = 0;
function spawnPuff(p, color = 0xbb6622) {
  const q = puffs[puffIdx++ % puffs.length];
  q.m.position.copy(p); q.m.material.color.setHex(color);
  q.m.material.opacity = 0.9; q.m.scale.setScalar(0.6); q.t = 0;
}

// ---------- Map gen ----------
function genMap() {
  players = []; loots = []; walls = []; rocks = []; trees = [];
  const towns = [], townC = [];
  for (let i = 0; i < 6; i++) townC.push({ x: rnd(-W * 0.36, W * 0.36), z: rnd(-W * 0.36, W * 0.36) });
  paintTowns(townC);
  for (const t of townC) {
    const n = 3 + Math.floor(rnd(0, 3));
    for (let i = 0; i < n; i++) {
      const hx = t.x + rnd(-90, 90), hz = t.z + rnd(-90, 90);
      const hw = rnd(22, 34), hd = rnd(18, 28);
      towns.push({ x: hx, z: hz });
      const th = 0.8, H = 4;
      // 4 walls, door gap on south side
      addWall(hx - hw / 2, hz - hd / 2, hw, th, H);
      addWall(hx - hw / 2, hz + hd / 2 - th, hw * 0.32, th, H);
      addWall(hx + hw / 2 - hw * 0.32, hz + hd / 2 - th, hw * 0.32, th, H);
      addWall(hx - hw / 2, hz - hd / 2, th, hd, H);
      addWall(hx + hw / 2 - th, hz - hd / 2, th, hd, H);
      const ln = 2 + Math.floor(rnd(0, 3));
      for (let k = 0; k < ln; k++) spawnLoot(hx + rnd(-hw / 3, hw / 3), hz + rnd(-hd / 3, hd / 3));
    }
  }
  for (let i = 0; i < 60; i++) spawnLoot(rnd(-W / 2 + 30, W / 2 - 30), rnd(-W / 2 + 30, W / 2 - 30));
  for (let i = 0; i < 70; i++) rocks.push({ x: rnd(-W / 2, W / 2), z: rnd(-W / 2, W / 2), r: rnd(1.2, 3.4) });
  for (let i = 0; i < 240; i++) trees.push({ x: rnd(-W / 2, W / 2), z: rnd(-W / 2, W / 2), s: rnd(0.8, 1.5) });
  const ang = rnd(0, Math.PI * 2);
  plane = { x1: -Math.cos(ang) * W * 0.7, z1: -Math.sin(ang) * W * 0.7, x2: Math.cos(ang) * W * 0.7, z2: Math.sin(ang) * W * 0.7 };
  zone = { x: 0, z: 0, r: W * 0.72, tx: 0, tz: 0, tr: W * 0.72, phase: 0, mode: 'wait', t: PHASES[0].wait, sx: 0, sz: 0, sr: W * 0.72 };
  pickNextCircle();
  return towns;
}
function addWall(x, z, w, d, h) { walls.push({ x, z, w, d, h }); }
function spawnLoot(x, z, force) {
  const k = force || LOOT_W[Math.floor(Math.random() * LOOT_W.length)];
  if (k === 'ammo') loots.push({ x, z, kind: 'ammo', ammo: 30 });
  else if (k === 'medkit') loots.push({ x, z, kind: 'medkit' });
  else if (k === 'armor') loots.push({ x, z, kind: 'armor', lvl: Math.random() < 0.25 ? 2 : 1 });
  else loots.push({ x, z, kind: 'gun', gun: k, ammo: GUNS[k].mag });
}

// ---------- World meshes (rebuilt per match) ----------
let worldGroup = null, treeMeshes = null;
function buildWorld() {
  if (worldGroup) { scene.remove(worldGroup); worldGroup.traverse(o => { if (o.geometry && !Object.values(GEO).includes(o.geometry)) o.geometry.dispose?.(); }); }
  worldGroup = new THREE.Group();
  scene.add(worldGroup);
  for (const wl of walls) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(wl.w, wl.h, wl.d), MAT.wall);
    m.position.set(wl.x + wl.w / 2, wl.h / 2, wl.z + wl.d / 2);
    const top = new THREE.Mesh(new THREE.BoxGeometry(wl.w, 0.3, wl.d), MAT.wallTop);
    top.position.set(wl.x + wl.w / 2, wl.h + 0.15, wl.z + wl.d / 2);
    worldGroup.add(m, top);
    wl.mesh = m;
  }
  for (const r of rocks) {
    const m = new THREE.Mesh(new THREE.DodecahedronGeometry(r.r, 0), MAT.rock);
    m.position.set(r.x, r.r * 0.45, r.z);
    m.rotation.set(rnd(0, 3), rnd(0, 3), rnd(0, 3));
    worldGroup.add(m);
    r.mesh = m;
  }
  // trees as instanced meshes
  const trunkG = new THREE.CylinderGeometry(0.5, 0.8, 4.5, 6);
  const leafG = new THREE.IcosahedronGeometry(3.2, 0);
  const trunks = new THREE.InstancedMesh(trunkG, MAT.trunk, trees.length);
  const leaves = new THREE.InstancedMesh(leafG, MAT.leaf, trees.length);
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), S = new THREE.Vector3(), P = new THREE.Vector3();
  trees.forEach((t, i) => {
    P.set(t.x, 2.2 * t.s, t.z); S.set(t.s, t.s, t.s); Q.identity();
    M.compose(P, Q, S); trunks.setMatrixAt(i, M);
    P.set(t.x, (4.5 + 2.4) * t.s, t.z);
    M.compose(P, Q, S); leaves.setMatrixAt(i, M);
  });
  trunks.instanceMatrix.needsUpdate = true; leaves.instanceMatrix.needsUpdate = true;
  worldGroup.add(trunks, leaves);
  treeMeshes = [trunks, leaves];
  // loot meshes
  for (const l of loots) {
    const m = makeLootMesh(l);
    m.position.set(l.x, 0.7, l.z);
    worldGroup.add(m);
    l.mesh = m;
  }
}
function makeLootMesh(l) {
  let m;
  if (l.kind === 'gun') {
    m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, GUNS[l.gun].len + 0.6), new THREE.MeshLambertMaterial({ color: GUNS[l.gun].color, emissive: GUNS[l.gun].color, emissiveIntensity: 0.25 }));
    const label = makeTextSprite(GUNS[l.gun].name, '#fff', 64);
    label.scale.set(3, 0.75, 1); label.position.y = 1.2;
    const g = new THREE.Group(); g.add(m, label); return g;
  } else if (l.kind === 'ammo') {
    m = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.7), new THREE.MeshLambertMaterial({ color: 0xffd57a, emissive: 0xffd57a, emissiveIntensity: 0.4 }));
  } else if (l.kind === 'medkit') {
    const g = new THREE.Group();
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.9), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    const c1 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.2, 0.7), new THREE.MeshBasicMaterial({ color: 0xe63946 }));
    const c2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.25), new THREE.MeshBasicMaterial({ color: 0xe63946 }));
    c1.position.y = c2.position.y = 0.35;
    g.add(box, c1, c2); return g;
  } else {
    m = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.4), new THREE.MeshLambertMaterial({ color: 0x2980b9, emissive: 0x2980b9, emissiveIntensity: 0.35 }));
  }
  return m;
}
function makeTextSprite(text, color = '#fff', size = 48) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 64;
  const g = c.getContext('2d');
  g.font = `bold ${size}px sans-serif`; g.textAlign = 'center';
  g.fillStyle = 'rgba(0,0,0,0.55)'; g.fillRect(0, 0, 256, 64);
  g.fillStyle = color; g.fillText(text, 128, 46);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
  s.renderOrder = 20;
  return s;
}

// ---------- Players ----------
function buildCharacter(colorHex, name, isMe) {
  const g = new THREE.Group();
  const mats = playerMaterials(colorHex);
  const legL = new THREE.Mesh(GEO.leg, mats.leg); legL.position.set(-0.22, 0.43, 0);
  const legR = new THREE.Mesh(GEO.leg, mats.leg); legR.position.set(0.22, 0.43, 0);
  const torso = new THREE.Mesh(GEO.torso, mats.torso); torso.position.y = 1.35;
  const head = new THREE.Mesh(GEO.head, mats.head); head.position.y = 2.15;
  const gun = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 1.6), GUN_MAT);
  gun.position.set(0.35, 1.5, -0.7);
  const arm = new THREE.Mesh(GEO.arm, mats.head); arm.position.set(0.35, 1.5, -0.3);
  const chute = new THREE.Mesh(GEO.chute, new THREE.MeshLambertMaterial({ color: 0xff8c42, side: THREE.DoubleSide }));
  chute.position.y = 5.2; chute.visible = false;
  const tag = makeTextSprite(name, isMe ? '#7dff8a' : '#ffd0d0', 44);
  tag.scale.set(4.4, 1.1, 1); tag.position.y = 3.4;
  g.add(legL, legR, torso, head, gun, arm, chute, tag);
  g.traverse(o => { o.frustumCulled = false; });
  return { group: g, legL, legR, torso, head, gun, arm, chute, tag };
}
function mkPlayer(name, isBot, x, z) {
  const color = isBot ? [0xe74c3c, 0xc0392b, 0xd35400, 0x8e44ad][Math.floor(Math.random() * 4)] : 0x2ecc71;
  const c = buildCharacter(color, name, !isBot);
  scene.add(c.group);
  return {
    name, isBot, x, z, y: 0, vy: 0, hp: 100, armor: 0, alive: true, deadT: 0,
    gun: 'fists', mag: GUNS.fists.mag, reserve: 0, reloading: 0, cd: 0,
    meds: 0, kills: 0, mesh: c, walkT: 0,
    ai: { tx: x, tz: z, t: 0, mode: 'loot', strafe: Math.random() < 0.5 ? 1 : -1, react: rnd(0.4, 1.0), stuck: 0, lx: x, lz: z, burst: 3 + Math.floor(rnd(0, 4)), pause: 0 },
    chute: isBot ? rnd(0, 1) : 0, shield: 4, zoneTick: 0, healT: 0,
    hitMeshes: [c.torso, c.head],
  };
}
function refreshTag(p) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = 'rgba(0,0,0,0.55)'; g.fillRect(0, 0, 256, 64);
  g.font = 'bold 30px sans-serif'; g.textAlign = 'center';
  g.fillStyle = p === me ? '#7dff8a' : '#ffd0d0';
  g.fillText(p === me ? 'YOU' : p.name, 128, 30);
  g.fillStyle = '#222'; g.fillRect(28, 40, 200, 12);
  g.fillStyle = p.hp > 50 ? '#2ecc40' : p.hp > 25 ? '#f39c12' : '#e74c3c';
  g.fillRect(28, 40, 200 * Math.max(0, p.hp) / 100, 12);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  p.mesh.tag.material.map.dispose();
  p.mesh.tag.material.map = tex;
  p.mesh.tag.material.needsUpdate = true;
}
function spawnAll(dropX, dropZ) {
  const names = [...NAMES].sort(() => Math.random() - 0.5);
  me = mkPlayer('YOU', false, dropX, dropZ);
  me.y = 150; me.chute = 3; me.shield = 9;
  me.mesh.chute.visible = true;
  spawnLoot(dropX + 6, dropZ, 'rifle');
  spawnLoot(dropX - 7, dropZ + 4, 'ammo');
  spawnLoot(dropX + 1, dropZ - 8, 'medkit');
  players.push(me);
  yaw = Math.atan2(-(dropX), -(dropZ)) + Math.PI; // face map center initially
  for (let i = 0; i < BOT_N; i++) {
    const p = mkPlayer(names[i % names.length] + (i >= names.length ? ' ' + (1 + Math.floor(i / names.length)) : ''), true, 0, 0);
    const t = Math.random();
    p.x = clamp(plane.x1 + (plane.x2 - plane.x1) * t + rnd(-120, 120), -W / 2 + 10, W / 2 - 10);
    p.z = clamp(plane.z1 + (plane.z2 - plane.z1) * t + rnd(-120, 120), -W / 2 + 10, W / 2 - 10);
    if (Math.hypot(p.x - dropX, p.z - dropZ) < 160) { p.x = clamp(p.x + (p.x > dropX ? 220 : -220), -W / 2 + 10, W / 2 - 10); p.z = clamp(p.z + (p.z > dropZ ? 220 : -220), -W / 2 + 10, W / 2 - 10); }
    p.y = 150 + rnd(0, 30); p.chute = 2 + rnd(0, 1.5); p.shield = 8;
    p.mesh.chute.visible = true;
    p.ai.tx = clamp(p.x + rnd(-200, 200), -W / 2 + 10, W / 2 - 10);
    p.ai.tz = clamp(p.z + rnd(-200, 200), -W / 2 + 10, W / 2 - 10);
    players.push(p);
  }
  for (const p of players) { p.hitMeshes.forEach(m => m.userData.player = p); refreshTag(p); }
  me.mesh.tag.visible = false; // hide own tag (HUD shows HP)
  buildWorld();
  // loot spawned for player drop needs meshes too
  for (const l of loots) {
    if (!l.mesh) { const m = makeLootMesh(l); m.position.set(l.x, 0.7, l.z); worldGroup.add(m); l.mesh = m; }
  }
}

// ---------- Collision (XZ plane) ----------
const HB = W / 2 - 2;
function collide(p, rad = 0.9) {
  p.x = clamp(p.x, -HB, HB); p.z = clamp(p.z, -HB, HB);
  for (const o of walls) {
    const nx = clamp(p.x, o.x, o.x + o.w), nz = clamp(p.z, o.z, o.z + o.d);
    let dx = p.x - nx, dz = p.z - nz;
    const d = Math.hypot(dx, dz);
    if (d < rad) {
      if (d < 0.001) { p.z = o.z - rad; }
      else { p.x = nx + dx / d * rad; p.z = nz + dz / d * rad; }
    }
  }
  for (const r of rocks) {
    const dx = p.x - r.x, dz = p.z - r.z;
    const d = Math.hypot(dx, dz), min = r.r * 0.9 + rad;
    if (d < min && d > 0.001) { p.x = r.x + dx / d * min; p.z = r.z + dz / d * min; }
  }
}
const raycaster = new THREE.Raycaster();
function solids() { return walls.map(w => w.mesh).concat(rocks.map(r => r.mesh)); }
let _solids = null;
function losBlocked(ax, ay, az, bx, by, bz) {
  _v1.set(ax, ay, az); _v2.set(bx - ax, by - ay, bz - az);
  const d = _v2.length(); _v2.normalize();
  raycaster.set(_v1, _v2); raycaster.far = d;
  return raycaster.intersectObjects(_solids, false).length > 0;
}

// ---------- Combat ----------
function gunTip(p) {
  return new THREE.Vector3(p.x - Math.sin(yawOf(p)) * 1.6, p.y + 1.6, p.z - Math.cos(yawOf(p)) * 1.6);
}
function yawOf(p) { return p === me ? yaw : p.ai.yaw || 0; }
function shoot(p) {
  const g = GUNS[p.gun];
  if (!p.alive || p.reloading > 0 || p.cd > 0 || p.chute > 0 || p.y > 0.5) return;
  if (g.mag !== Infinity && p.mag <= 0) { startReload(p); return; }
  p.cd = g.cd / 1000;
  if (g.mag !== Infinity) p.mag--;
  const origin = p === me ? camera.position.clone() : gunTip(p);
  const dir = new THREE.Vector3();
  if (p === me) camera.getWorldDirection(dir);
  else {
    const tgt = _v1.set(me.x, me.y + 1.4, me.z);
    dir.copy(tgt).sub(origin).normalize();
  }
  const targets = [];
  for (const q of players) {
    if (!q.alive || q === p || q.chute > 0 || q.shield > 0) continue;
    targets.push(...q.hitMeshes);
  }
  const all = targets.concat(_solids, [ground]);
  for (let i = 0; i < g.pellets; i++) {
    const d = dir.clone();
    d.x += rnd(-g.spread, g.spread); d.y += rnd(-g.spread, g.spread); d.z += rnd(-g.spread, g.spread);
    d.normalize();
    raycaster.set(origin, d); raycaster.far = g.range * 1.6;
    const hits = raycaster.intersectObjects(all, false);
    const tip = p === me ? gunTip(p) : origin;
    if (hits.length) {
      const h = hits[0];
      spawnTracer(tip, h.point, p === me ? 0xffe66d : 0xff8866);
      const vp = h.object.userData.player;
      if (vp && h.distance <= g.range * 1.3) {
        let dmg = g.dmg * clamp(1 - Math.max(0, h.distance - g.range * 0.55) / g.range, 0.4, 1);
        if (h.object === vp.mesh.head) dmg *= 1.8;
        damage(vp, dmg, p);
        spawnPuff(h.point, 0xcc2222);
      } else spawnPuff(h.point);
    } else {
      spawnTracer(tip, origin.clone().add(d.clone().multiplyScalar(g.range)), p === me ? 0xffe66d : 0xff8866);
    }
  }
  muzzleLight.position.copy(p === me ? gunTip(p) : origin);
  muzzleLight.intensity = 60; muzzleT = 0.05;
  if (p === me) SFX.shoot(p.gun);
  else if (p.x !== undefined && me) SFX.distant(Math.hypot(p.x - me.x, p.z - me.z));
}
function startReload(p) {
  const g = GUNS[p.gun];
  if (g.mag === Infinity || p.reloading > 0 || p.reserve <= 0) return;
  p.reloading = g.reload / 1000;
}
function damage(victim, amt, killer) {
  if (!victim.alive || victim.chute > 0 || victim.shield > 0) return;
  if (victim.armor > 0) { const ab = Math.min(victim.armor, amt * 0.5); victim.armor -= ab; amt -= ab; }
  victim.hp -= amt;
  refreshTag(victim);
  if (victim === me) { SFX.hurt(); $('dmgVignette').classList.add('hurt'); setTimeout(() => $('dmgVignette').classList.remove('hurt'), 180); }
  else if (killer === me) { SFX.hit(); const h = $('hitmarker'); h.classList.remove('show'); void h.offsetWidth; h.classList.add('show'); }
  if (victim.hp <= 0) {
    victim.hp = 0; victim.alive = false; victim.deadT = 0;
    victim.mesh.group.rotation.z = Math.PI / 2 * 0.9;
    victim.mesh.tag.visible = false;
    victim.mesh.chute.visible = false;
    dropLootOnDeath(victim);
    if (killer && killer !== victim && killer.alive) { killer.kills++; refreshTag(killer); if (killer === me) SFX.kill(); }
    feed(`${killer ? esc(killer.name) : 'ZONE'} ☠ ${esc(victim.name)}${killer && killer.gun ? ` <i>[${GUNS[killer.gun].name}]</i>` : ''}`);
    checkEnd();
  }
}
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function dropLootOnDeath(p) {
  if (p.gun !== 'fists') loots.push({ x: p.x + rnd(-1, 1), z: p.z + rnd(-1, 1), kind: 'gun', gun: p.gun, ammo: p.mag });
  if (p.reserve > 0) loots.push({ x: p.x + rnd(-2, 2), z: p.z + rnd(-2, 2), kind: 'ammo', ammo: p.reserve });
  if (p.meds > 0) loots.push({ x: p.x + rnd(-2, 2), z: p.z + rnd(-2, 2), kind: 'medkit' });
}
function feed(html) {
  const d = document.createElement('div'); d.innerHTML = html;
  $('feed').prepend(d);
  while ($('feed').children.length > 6) $('feed').lastChild.remove();
  setTimeout(() => d.remove(), 9000);
}
function toast(msg, ms = 2200) {
  const t = $('toast'); t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.add('hidden'), ms);
}

// ---------- Zone ----------
function pickNextCircle() {
  const shrinkF = [0.62, 0.55, 0.5, 0.45, 0.35, 0.2][Math.min(zone.phase, 5)] || 0.2;
  const nr = zone.r * shrinkF;
  const maxOff = Math.max(0, zone.r - nr);
  const a = rnd(0, Math.PI * 2), d = rnd(0, maxOff * 0.7);
  zone.tx = clamp(zone.x + Math.cos(a) * d, -W / 2 + nr, W / 2 - nr);
  zone.tz = clamp(zone.z + Math.sin(a) * d, -W / 2 + nr, W / 2 - nr);
  zone.tr = Math.max(25, nr);
}
function updateZone(dt) {
  zone.t -= dt;
  if (zone.sx === undefined || zone.sx === null) { zone.sx = zone.x; zone.sz = zone.z; zone.sr = zone.r; }
  if (zone.mode === 'wait' && zone.t <= 0) {
    zone.mode = 'shrink';
    zone.t = PHASES[Math.min(zone.phase, PHASES.length - 1)].shrink;
    zone.sx = zone.x; zone.sz = zone.z; zone.sr = zone.r;
    SFX.zone(); toast('⚠ ZONE SHRINKING — GET TO SAFETY');
  } else if (zone.mode === 'shrink') {
    const total = PHASES[Math.min(zone.phase, PHASES.length - 1)].shrink;
    const k = clamp(1 - zone.t / total, 0, 1);
    zone.x = zone.sx + (zone.tx - zone.sx) * k;
    zone.z = zone.sz + (zone.tz - zone.sz) * k;
    zone.r = zone.sr + (zone.tr - zone.sr) * k;
    if (zone.t <= 0) {
      zone.phase++; zone.mode = 'wait';
      zone.t = (PHASES[Math.min(zone.phase, PHASES.length - 1)] || { wait: 6 }).wait;
      zone.sx = zone.x; zone.sz = zone.z; zone.sr = zone.r;
      pickNextCircle();
    }
  }
  const dps = (PHASES[Math.min(zone.phase, PHASES.length - 1)] || { dps: 30 }).dps;
  for (const p of players) {
    if (!p.alive || p.chute > 0) continue;
    if (Math.hypot(p.x - zone.x, p.z - zone.z) > zone.r) {
      p.zoneTick += dt;
      if (p.zoneTick > 1) { p.zoneTick = 0; damage(p, dps, null); }
    }
  }
  zoneWall.position.set(zone.x, 60, zone.z);
  zoneWall.scale.set(zone.r, 1, zone.r);
  targetRing.position.set(zone.tx, 0.15, zone.tz);
  targetRing.scale.set(zone.tr, zone.tr, 1);
  if (me) $('zoneVignette').classList.toggle('out', me.alive && Math.hypot(me.x - zone.x, me.z - zone.z) > zone.r);
}

// ---------- Bot AI ----------
function botThink(p, dt) {
  const ai = p.ai; ai.t -= dt;
  const dz = Math.hypot(p.x - zone.tx, p.z - zone.tz);
  const outside = Math.hypot(p.x - zone.x, p.z - zone.z) > zone.r * 0.92;
  const matchAge = elapsed;
  const sight = matchAge < 25 ? 110 : 240;
  let foe = null, fd = sight;
  for (const q of players) {
    if (q === p || !q.alive || q.chute > 0 || q.shield > 0) continue;
    const d = Math.hypot(p.x - q.x, p.z - q.z);
    if (d < fd) { fd = d; foe = q; }
  }
  if (foe && fd < 220 && matchAge > 9 && (p.gun !== 'fists' || fd < 40)) { if (ai.mode !== 'fight') ai.react = rnd(0.4, 1.0); ai.mode = 'fight'; }
  else if (outside) ai.mode = 'zone';
  else if (ai.mode === 'fight' && !foe) ai.mode = 'loot';
  else if (ai.t <= 0 && ai.mode !== 'fight') {
    ai.mode = Math.random() < 0.55 ? 'loot' : 'roam'; ai.t = rnd(3, 7);
    if (ai.mode === 'loot') {
      let bl = null, bd = 1e9;
      for (const l of loots) { const d = Math.hypot(p.x - l.x, p.z - l.z); if (d < bd) { bd = d; bl = l; } }
      if (bl && bd < 400) { ai.tx = bl.x; ai.tz = bl.z; }
      else { ai.tx = clamp(zone.tx + rnd(-zone.tr, zone.tr), -HB, HB); ai.tz = clamp(zone.tz + rnd(-zone.tr, zone.tr), -HB, HB); }
    } else { ai.tx = clamp(zone.tx + rnd(-zone.tr, zone.tr), -HB, HB); ai.tz = clamp(zone.tz + rnd(-zone.tr, zone.tr), -HB, HB); }
  }
  let mvx = 0, mvz = 0, wantShoot = false;
  if (ai.mode === 'fight' && foe) {
    ai.react -= dt;
    const dx = foe.x - p.x, dz2 = foe.z - p.z, d = Math.max(1, fd);
    ai.yaw = Math.atan2(-dx, -dz2) + rnd(-0.09, 0.09);
    const g = GUNS[p.gun];
    const want = p.gun === 'sniper' ? 190 : p.gun === 'shotgun' ? 55 : 120;
    if (d > want + 20) { mvx = dx / d; mvz = dz2 / d; }
    else if (d < want - 30) { mvx = -dx / d; mvz = -dz2 / d; }
    else { mvx = -dz2 / d * ai.strafe; mvz = dx / d * ai.strafe; if (Math.random() < 0.01) ai.strafe *= -1; }
    if (outside) { mvx += (zone.tx - p.x) / Math.max(1, dz) * 0.8; mvz += (zone.tz - p.z) / Math.max(1, dz) * 0.8; }
    wantShoot = p.gun !== 'fists' && fd < g.range * 0.9 && ai.react <= 0 && Math.random() < (p.gun === 'sniper' ? 0.15 : 0.32);
    autoPickup(p, true);
  } else {
    const dx = ai.tx - p.x, dz2 = ai.tz - p.z, d = Math.hypot(dx, dz2);
    if (d > 3) { mvx = dx / d; mvz = dz2 / d; }
    ai.yaw = Math.atan2(-mvx, -mvz);
    if (outside) { mvx = (zone.tx - p.x) / Math.max(1, dz); mvz = (zone.tz - p.z) / Math.max(1, dz); }
    autoPickup(p, false);
    if (p.hp < 55 && p.meds > 0 && fd > 120 && !p.healT) p.healT = 3;
  }
  // unstick
  ai.stuck += dt;
  if (ai.stuck > 1.2) {
    if (Math.hypot(p.x - ai.lx, p.z - ai.lz) < 2 && (mvx || mvz)) {
      ai.tx = clamp(p.x + rnd(-150, 150), -HB, HB); ai.tz = clamp(p.z + rnd(-150, 150), -HB, HB); ai.t = rnd(2, 4);
    }
    ai.lx = p.x; ai.lz = p.z; ai.stuck = 0;
  }
  const sp = outside ? 24 : 18;
  const l = Math.hypot(mvx, mvz) || 1;
  p.vx = mvx / l * sp; p.vz = mvz / l * sp;
  if (wantShoot && ai.pause <= 0 && p.cd <= 0 && p.reloading <= 0) {
    if (p.mag <= 0) startReload(p);
    else {
      shoot(p);
      if (--ai.burst <= 0) { ai.pause = rnd(0.8, 1.7); ai.burst = 3 + Math.floor(rnd(0, 4)); }
    }
  } else ai.pause -= dt;
  if (p.healT > 0) { p.vx *= 0.3; p.vz *= 0.3; }
  if (p.reloading <= 0 && p.mag <= 0) startReload(p);
}
function autoPickup(p, inFight) {
  if (p.reloading > 0) return;
  for (let i = loots.length - 1; i >= 0; i--) {
    const l = loots[i];
    if (Math.hypot(p.x - l.x, p.z - l.z) > 3) continue;
    if (l.kind === 'gun') {
      const rank = { fists: 0, pistol: 1, smg: 2, shotgun: 2, rifle: 3, sniper: 4 };
      if (rank[l.gun] > rank[p.gun]) {
        if (p.gun !== 'fists') loots.push({ x: p.x, z: p.z, kind: 'gun', gun: p.gun, ammo: p.mag });
        p.gun = l.gun; p.mag = l.ammo; p.reserve = Math.max(p.reserve, 30); loots.splice(i, 1);
      } else if (p.reserve < 90) { p.reserve += l.ammo; loots.splice(i, 1); }
    } else if (l.kind === 'ammo') { if (p.gun !== 'fists') { p.reserve = Math.min(180, p.reserve + l.ammo); loots.splice(i, 1); } }
    else if (l.kind === 'medkit') { if (p.meds < 4) { p.meds++; loots.splice(i, 1); } }
    else if (l.kind === 'armor') { p.armor = Math.max(p.armor, l.lvl === 2 ? 75 : 50); loots.splice(i, 1); }
    if (inFight) break;
  }
}

// ---------- Input ----------
addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) e.preventDefault();
  if (state !== 'playing' || !me || !me.alive) return;
  if (e.key.toLowerCase() === 'e') tryPickup(me);
  if (e.key.toLowerCase() === 'r') startReload(me);
  if (e.key.toLowerCase() === 'q') useMedkit(me);
});
addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
addEventListener('mousemove', e => {
  if (state !== 'playing') return;
  const locked = document.pointerLockElement === canvas;
  if (locked) {
    const s = (ads ? 0.0009 : 0.0023);
    yaw += e.movementX * s; pitch -= e.movementY * s;
  } else if (dragging) {
    const s = (ads ? 0.002 : 0.005);
    yaw += (e.clientX - lastMX) * s; pitch -= (e.clientY - lastMY) * s;
    lastMX = e.clientX; lastMY = e.clientY;
  }
  pitch = clamp(pitch, -1.35, 1.35);
});
canvas.addEventListener('mousedown', e => {
  if (state !== 'playing') return;
  if (e.button === 2) { ads = true; return; }
  if (document.pointerLockElement !== canvas && !isTouch) { try { canvas.requestPointerLock(); } catch (err) {} }
  mouseDown = true;
});
addEventListener('mouseup', e => { if (e.button === 2) ads = false; else mouseDown = false; });
addEventListener('contextmenu', e => e.preventDefault());
canvas.addEventListener('mousedown', e => { dragging = true; lastMX = e.clientX; lastMY = e.clientY; });
addEventListener('mouseup', () => dragging = false);
document.addEventListener('pointerlockchange', () => document.body.classList.toggle('locked', document.pointerLockElement === canvas));
// touch
const isTouch = matchMedia('(pointer: coarse)').matches;
let touchMove = null, touchLook = null;
if (isTouch) {
  addEventListener('touchstart', e => {
    for (const t of e.changedTouches) {
      if (t.clientX < innerWidth * 0.4 && t.clientY > innerHeight * 0.4 && !touchMove) touchMove = { id: t.identifier, x0: t.clientX, y0: t.clientY, x: t.clientX, y: t.clientY };
      else if (!touchLook) touchLook = { id: t.identifier, x: t.clientX, y: t.clientY };
    }
  }, { passive: true });
  addEventListener('touchmove', e => {
    for (const t of e.changedTouches) {
      if (touchMove && t.identifier === touchMove.id) { touchMove.x = t.clientX; touchMove.y = t.clientY; }
      if (touchLook && t.identifier === touchLook.id) {
        yaw += (t.clientX - touchLook.x) * 0.006; pitch = clamp(pitch - (t.clientY - touchLook.y) * 0.006, -1.35, 1.35);
        touchLook.x = t.clientX; touchLook.y = t.clientY;
      }
    }
  }, { passive: true });
  addEventListener('touchend', e => {
    for (const t of e.changedTouches) {
      if (touchMove && t.identifier === touchMove.id) touchMove = null;
      if (touchLook && t.identifier === touchLook.id) touchLook = null;
    }
  });
  $('fireBtn').addEventListener('touchstart', e => { mouseDown = true; e.preventDefault(); }, { passive: false });
  $('fireBtn').addEventListener('touchend', () => mouseDown = false);
  $('jumpBtn').addEventListener('touchstart', e => { keys[' '] = true; setTimeout(() => keys[' '] = false, 150); e.preventDefault(); }, { passive: false });
}
function tryPickup(p) {
  let best = null, bd = 5;
  for (const l of loots) { const d = Math.hypot(p.x - l.x, p.z - l.z); if (d < bd) { bd = d; best = l; } }
  if (!best) return;
  if (best.kind === 'gun') {
    const old = p.gun, om = p.mag;
    p.gun = best.gun; p.mag = best.ammo; if (p.reserve < 30) p.reserve = 30;
    removeLoot(best);
    if (old !== 'fists') { const nl = { x: p.x, z: p.z, kind: 'gun', gun: old, ammo: om }; loots.push(nl); addLootMesh(nl); }
    if (p === me) { toast('Picked up ' + GUNS[p.gun].name); SFX.pickup(); }
    syncGunMesh(p);
  } else if (best.kind === 'ammo') {
    if (p.gun === 'fists') { if (p === me) toast('Need a gun first!'); return; }
    p.reserve = Math.min(240, p.reserve + best.ammo); removeLoot(best);
    if (p === me) { toast('+ammo'); SFX.pickup(); }
  } else if (best.kind === 'medkit') {
    if (p.meds >= 5) { if (p === me) toast('Medkits full'); return; }
    p.meds++; removeLoot(best);
    if (p === me) { toast('+medkit (Q to heal)'); SFX.pickup(); }
  } else if (best.kind === 'armor') {
    p.armor = best.lvl === 2 ? 75 : 50; removeLoot(best);
    if (p === me) { toast(best.lvl === 2 ? 'Lvl.2 Vest!' : 'Vest equipped'); SFX.pickup(); }
  }
}
function removeLoot(l) {
  loots.splice(loots.indexOf(l), 1);
  if (l.mesh && worldGroup) worldGroup.remove(l.mesh);
}
function addLootMesh(l) {
  const m = makeLootMesh(l);
  m.position.set(l.x, 0.7, l.z);
  worldGroup.add(m); l.mesh = m;
}
function syncGunMesh(p) {
  const g = GUNS[p.gun];
  p.mesh.gun.visible = p.gun !== 'fists';
  p.mesh.gun.scale.z = (g.len || 1.2) / 1.6;
  p.mesh.gun.material = new THREE.MeshLambertMaterial({ color: g.color });
}
function useMedkit(p) {
  if (p.meds <= 0) { toast('No medkits!'); return; }
  if (p.hp >= 100) { toast('HP full'); return; }
  if (p.healT > 0) return;
  p.healT = 3; toast('Healing…');
}

// ---------- Flow ----------
$('dropBtn').onclick = () => {
  BOT_N = clamp(parseInt($('botCount').value) || 19, 1, 39);
  genMap();
  $('menu').classList.add('hidden');
  $('dropScreen').classList.remove('hidden');
  drawDropMap();
};
$('randomDrop').onclick = () => startGame(rnd(-W / 4, W / 4), rnd(-W / 4, W / 4));
$('againBtn').onclick = () => location.reload();
$('dropMap').onclick = e => {
  const r = $('dropMap').getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width * W - W / 2;
  const z = (e.clientY - r.top) / r.height * W - W / 2;
  startGame(x, z);
};
function drawDropMap() {
  const c = $('dropMap'), g = c.getContext('2d');
  g.fillStyle = '#5c8a4a'; g.fillRect(0, 0, 420, 420);
  const s = 420 / W;
  g.fillStyle = '#c9a06a';
  for (const wl of walls) g.fillRect((wl.x + W / 2) * s, (wl.z + W / 2) * s, wl.w * s, wl.d * s);
  g.strokeStyle = '#fff'; g.lineWidth = 2; g.setLineDash([6, 4]);
  g.beginPath();
  g.moveTo((plane.x1 + W / 2) * s, (plane.z1 + W / 2) * s);
  g.lineTo((plane.x2 + W / 2) * s, (plane.z2 + W / 2) * s);
  g.stroke(); g.setLineDash([]);
  g.fillStyle = '#fff'; g.font = '12px sans-serif';
  g.fillText('✈ plane path — click to drop', 10, 18);
}
function startGame(x, z) {
  $('dropScreen').classList.add('hidden');
  $('hud').classList.remove('hidden');
  if (isTouch) $('touchUI').classList.remove('hidden');
  $('crosshair').style.display = 'block';
  spawnAll(clamp(x, -HB, HB), clamp(z, -HB, HB));
  _solids = solids();
  state = 'playing'; startT = performance.now(); elapsed = 0;
  planeMesh.visible = true;
  toast('Survive! ' + players.length + ' dropped');
  for (const p of players) syncGunMesh(p);
}
function checkEnd() {
  if (state !== 'playing') return;
  const alive = players.filter(p => p.alive);
  if (!me.alive) endGame(false);
  else if (alive.length === 1 && alive[0] === me) endGame(true);
}
function endGame(win) {
  state = 'over'; SFX.win();
  document.exitPointerLock?.();
  $('endScreen').classList.remove('hidden');
  const aliveN = players.filter(p => p.alive).length;
  $('endTitle').textContent = win ? 'WINNER WINNER CHICKEN DINNER!' : '#' + (aliveN + 1) + ' — YOU DIED';
  const t = Math.floor((performance.now() - startT) / 1000);
  $('endSub').textContent = win ? `Last one standing out of ${players.length}. Legendary.` : 'Better luck next drop, soldier.';
  $('stats').innerHTML = `<div><b>${me.kills}</b><span>kills</span></div><div><b>${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}</b><span>survived</span></div><div><b>${players.length}</b><span>dropped</span></div>`;
}

// ---------- Update ----------
const mm = $('minimap').getContext('2d');
let last = performance.now();
function fwdVec() {
  return { x: -Math.sin(yaw), z: -Math.cos(yaw) };
}
function update(dt) {
  elapsed += dt;
  // plane flyover visual
  if (planeMesh.visible) {
    const k = elapsed / 7;
    if (k >= 1) planeMesh.visible = false;
    else {
      planeMesh.position.set(plane.x1 + (plane.x2 - plane.x1) * k, 130, plane.z1 + (plane.z2 - plane.z1) * k);
      planeMesh.rotation.y = Math.atan2(-(plane.x2 - plane.x1), -(plane.z2 - plane.z1));
    }
  }
  // tracers + puffs + muzzle
  for (const t of tracers) if (t.t < 1) { t.t += dt * 14; t.line.material.opacity = Math.max(0, 0.95 * (1 - t.t)); }
  for (const q of puffs) if (q.t < 1) { q.t += dt * 5; q.m.material.opacity = Math.max(0, 0.9 * (1 - q.t)); q.m.scale.setScalar(0.6 + q.t * 2.2); }
  if (muzzleT > 0) { muzzleT -= dt; if (muzzleT <= 0) muzzleLight.intensity = 0; }
  // loot bob + spin
  for (const l of loots) {
    if (!l.mesh) continue;
    l.mesh.position.y = 0.7 + Math.sin(performance.now() / 400 + l.x) * 0.15;
    l.mesh.rotation.y += dt * 1.2;
  }
  if (state !== 'playing') { updateMeshes(dt); return; }
  updateZone(dt);
  // --- me ---
  if (me && me.alive) {
    if (me.shield > 0) me.shield -= dt;
    if (me.chute > 0) {
      // skydive: steer with WASD
      const f = fwdVec();
      let mx = 0, mz = 0;
      if (keys['w'] || keys['arrowup']) { mx += f.x; mz += f.z; }
      if (keys['s'] || keys['arrowdown']) { mx -= f.x; mz -= f.z; }
      if (keys['a'] || keys['arrowleft']) { mx += f.z; mz -= f.x; }
      if (keys['d'] || keys['arrowright']) { mx -= f.z; mz += f.x; }
      me.x += mx * 26 * dt; me.z += mz * 26 * dt;
      me.x = clamp(me.x, -HB, HB); me.z = clamp(me.z, -HB, HB);
      me.y -= 17 * dt;
      if (me.y <= 0) { me.y = 0; me.chute = 0; me.mesh.chute.visible = false; toast('Find a gun! (E to pick up)'); }
    } else {
      const f = fwdVec();
      const r = { x: f.z, z: -f.x };
      let mx = 0, mz = 0;
      if (keys['w'] || keys['arrowup']) { mx += f.x; mz += f.z; }
      if (keys['s'] || keys['arrowdown']) { mx -= f.x; mz -= f.z; }
      if (keys['a'] || keys['arrowleft']) { mx -= r.x; mz -= r.z; }
      if (keys['d'] || keys['arrowright']) { mx += r.x; mz += r.z; }
      if (keys['arrowleft'] && false) {}
      if (touchMove) {
        mx = (touchMove.x - touchMove.x0) / 50; mz = (touchMove.y - touchMove.y0) / 50;
        const fw = { x: -Math.sin(yaw), z: -Math.cos(yaw) }, rt = { x: fw.z, z: -fw.x };
        const ix = mx, iz = mz;
        mx = fw.x * -iz + rt.x * ix; mz = fw.z * -iz + rt.z * ix;
      }
      const l = Math.hypot(mx, mz);
      if (l > 1) { mx /= l; mz /= l; }
      const sprint = keys['shift'] ? 1.4 : 1;
      const sp = (me.healT > 0 ? 8 : ads ? 12 : 21) * sprint;
      me.x += mx * sp * dt; me.z += mz * sp * dt;
      collide(me);
      me.walkT += dt * (l > 0.1 ? sp * 0.55 : 0);
      // jump + gravity
      if (keys[' '] && me.y <= 0.01) me.vy = 9;
      me.vy -= 26 * dt;
      me.y += me.vy * dt;
      if (me.y <= 0) { me.y = 0; me.vy = 0; }
    }
    me.cd -= dt;
    if (me.reloading > 0) {
      me.reloading -= dt;
      if (me.reloading <= 0) {
        const g = GUNS[me.gun], need = g.mag - me.mag, take = Math.min(need, me.reserve);
        me.mag += take; me.reserve -= take;
      }
    }
    if (me.healT > 0) { me.healT -= dt; if (me.healT <= 0) { me.meds--; me.hp = Math.min(100, me.hp + 50); toast('Healed +50'); SFX.pickup(); refreshTag(me); } }
    const g = GUNS[me.gun];
    if (mouseDown && me.chute <= 0 && (g.auto || !mouseClicked)) { shoot(me); mouseClicked = true; }
    if (!mouseDown) mouseClicked = false;
    // ADS zoom
    const wantFov = ads ? (me.gun === 'sniper' ? 22 : 45) : 75;
    camera.fov += (wantFov - camera.fov) * Math.min(1, dt * 12);
    camera.updateProjectionMatrix();
  }
  // --- bots ---
  for (const p of players) {
    if (!p.isBot || !p.alive) continue;
    if (p.shield > 0) p.shield -= dt;
    if (p.chute > 0) {
      const dx = p.ai.tx - p.x, dz = p.ai.tz - p.z, d = Math.hypot(dx, dz);
      if (d > 4) { p.x += dx / d * 24 * dt; p.z += dz / d * 24 * dt; }
      p.y -= 16 * dt;
      if (p.y <= 0) { p.y = 0; p.chute = 0; p.mesh.chute.visible = false; }
      continue;
    }
    p.cd -= dt;
    if (p.reloading > 0) {
      p.reloading -= dt;
      if (p.reloading <= 0) {
        const g = GUNS[p.gun], need = g.mag - p.mag, take = Math.min(need, p.reserve);
        p.mag += take; p.reserve -= take;
      }
    }
    botThink(p, dt);
    p.x += (p.vx || 0) * dt; p.z += (p.vz || 0) * dt;
    collide(p);
    p.walkT += dt * 8;
    if (p.healT > 0) { p.healT -= dt; if (p.healT <= 0) { p.meds--; p.hp = Math.min(100, p.hp + 45); refreshTag(p); } }
  }
  updateMeshes(dt);
  updateHUD();
}
function updateMeshes(dt) {
  for (const p of players) {
    const m = p.mesh;
    m.group.position.set(p.x, p.y, p.z);
    m.group.rotation.y = p === me ? yaw : (p.ai.yaw || 0);
    if (!p.alive) { p.deadT += dt; if (p.deadT > 4) m.group.position.y -= dt * 0.4; continue; }
    // walk bob
    const moving = p === me ? (keys['w'] || keys['a'] || keys['s'] || keys['d'] || touchMove) : (Math.abs(p.vx || 0) + Math.abs(p.vz || 0) > 1);
    if (moving && p.chute <= 0 && p.y <= 0.01) {
      const s = Math.sin(p.walkT * 2.4);
      m.legL.position.z = s * 0.25; m.legR.position.z = -s * 0.25;
    } else { m.legL.position.z = 0; m.legR.position.z = 0; }
    // shield ring (scale pulse via chute cone reuse? use tag color)
    m.chute.visible = p.chute > 0;
  }
  // camera
  if (me) {
    if (state === 'menu') {
      const t = performance.now() / 1000 * 0.08;
      camera.position.set(Math.cos(t) * 500, 220, Math.sin(t) * 500);
      camera.lookAt(0, 0, 0);
      camera.fov = 60; camera.updateProjectionMatrix();
      return;
    }
    const fx = -Math.sin(yaw) * Math.cos(pitch), fy = Math.sin(pitch), fz = -Math.cos(yaw) * Math.cos(pitch);
    const hx = me.x, hy = me.y + 2.4, hz = me.z;
    const dist = me.chute > 0 ? 14 : (ads ? 3.6 : 7.5);
    const hoff = ads ? 1.3 : 2.2;
    _v1.set(hx - fx * dist, hy - fy * dist + hoff, hz - fz * dist);
    // camera collision with walls
    _v2.set(hx - _v1.x, hy - _v1.y, hz - _v1.z);
    const cd = _v2.length(); _v2.normalize();
    raycaster.set(new THREE.Vector3(hx, hy, hz), _v2); raycaster.far = cd;
    const hits = raycaster.intersectObjects(_solids || [], false);
    let k = 1;
    if (hits.length) k = Math.max(0.25, hits[0].distance / cd - 0.08);
    camera.position.set(hx + (_v1.x - hx) * k, Math.max(0.6, hy + (_v1.y - hy) * k), hz + (_v1.z - hz) * k);
    camera.lookAt(hx + fx * 12, hy + fy * 12, hz + fz * 12);
  }
}
function updateHUD() {
  if (!me) return;
  $('alive').textContent = players.filter(p => p.alive).length;
  $('kills').textContent = me.kills;
  $('hpFill').style.width = me.hp + '%';
  $('hpFill').style.background = me.hp > 50 ? 'linear-gradient(90deg,#7dff8a,#2ecc40)' : me.hp > 25 ? 'linear-gradient(90deg,#ffd57a,#e8890c)' : 'linear-gradient(90deg,#ff6b6b,#c0392b)';
  $('hpText').textContent = Math.ceil(me.hp);
  $('armorText').textContent = me.armor > 0 ? '🛡 ' + Math.ceil(me.armor) : '';
  $('meds').textContent = me.meds;
  const g = GUNS[me.gun];
  $('weaponName').textContent = GUNS[me.gun].name + (me.reloading > 0 ? ' — RELOADING' : '') + (me.healT > 0 ? ' — HEALING' : '') + (me.chute > 0 ? ' — SKYDIVING' : '');
  $('ammo').textContent = g.mag === Infinity ? '—' : me.mag + ' / ' + me.reserve;
  const zt = Math.ceil(zone.t);
  $('zoneTimer').textContent = (zone.mode === 'wait' ? '⏳ ' : '🔥 ') + zt + 's P' + (zone.phase + 1);
  let best = null, bd = 5;
  if (me.alive && me.chute <= 0) for (const l of loots) { const d = Math.hypot(me.x - l.x, me.z - l.z); if (d < bd) { bd = d; best = l; } }
  const pp = $('pickupPrompt');
  if (best) {
    pp.classList.remove('hidden');
    pp.textContent = '[E] ' + (best.kind === 'gun' ? 'Take ' + GUNS[best.gun].name : best.kind === 'ammo' ? `+${best.ammo} ammo` : best.kind === 'medkit' ? '+ Medkit' : '+ Armor');
  } else pp.classList.add('hidden');
  drawMinimap();
}
function drawMinimap() {
  const s = 170 / W;
  mm.clearRect(0, 0, 170, 170);
  mm.fillStyle = '#4a7a40'; mm.fillRect(0, 0, 170, 170);
  mm.fillStyle = 'rgba(50,90,255,.4)';
  mm.beginPath(); mm.rect(0, 0, 170, 170);
  mm.arc((zone.x + W / 2) * s, (zone.z + W / 2) * s, zone.r * s, 0, 7, true); mm.fill();
  mm.strokeStyle = '#fff'; mm.lineWidth = 1;
  mm.beginPath(); mm.arc((zone.tx + W / 2) * s, (zone.tz + W / 2) * s, zone.tr * s, 0, 7); mm.stroke();
  for (const l of loots) { mm.fillStyle = '#ffd57a'; mm.fillRect((l.x + W / 2) * s - 1, (l.z + W / 2) * s - 1, 2, 2); }
  for (const p of players) {
    if (!p.alive) continue;
    mm.fillStyle = p === me ? '#2eff6d' : '#ff4d4d';
    mm.beginPath(); mm.arc((p.x + W / 2) * s, (p.z + W / 2) * s, p === me ? 3 : 2, 0, 7); mm.fill();
  }
  // facing
  if (me) {
    mm.strokeStyle = '#2eff6d'; mm.beginPath();
    mm.moveTo((me.x + W / 2) * s, (me.z + W / 2) * s);
    mm.lineTo((me.x + W / 2) * s - Math.sin(yaw) * 14, (me.z + W / 2) * s - Math.cos(yaw) * 14);
    mm.stroke();
  }
}

// ---------- Boot ----------
genMap();
buildWorld();
_solids = solids();
function loop(t) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, (t - last) / 1000); last = t;
  frames++; fpsT += dt;
  if (fpsT >= 1) { fps = frames; frames = 0; fpsT = 0; }
  update(dt);
  renderer.render(scene, camera);
}
requestAnimationFrame(loop);

// test hooks
window.__game = {
  get state() { return state; },
  get players() { return players; },
  get me() { return me; },
  get fps() { return fps; },
  get rendererInfo() {
    const gl = renderer.getContext();
    return { renderer: gl.getParameter(gl.RENDERER), three: THREE.REVISION };
  },
  look(y, p) { yaw = y; if (p !== undefined) pitch = p; },
  async aimCam() {
    let bq = null, bd = 1e9;
    for (const q of players) {
      if (q === me || !q.alive || q.chute > 0) continue;
      const d = Math.hypot(q.x - me.x, q.z - me.z);
      if (d < bd) { bd = d; bq = q; }
    }
    if (!bq) return null;
    for (let k = 0; k < 5; k++) {
      await new Promise(r => setTimeout(r, 70));
      if (!bq.alive) return null;
      const chest = new THREE.Vector3(bq.x, bq.y + 1.4, bq.z);
      const cp = camera.position.clone();
      const want = chest.clone().sub(cp).normalize();
      const cd = new THREE.Vector3();
      camera.getWorldDirection(cd);
      const yawOf = v => Math.atan2(-v.x, -v.z);
      let dy = yawOf(want) - yawOf(cd);
      while (dy > Math.PI) dy -= Math.PI * 2;
      while (dy < -Math.PI) dy += Math.PI * 2;
      yaw += dy;
      pitch = clamp(pitch + (Math.asin(clamp(want.y, -1, 1)) - Math.asin(clamp(cd.y, -1, 1))), -1.35, 1.35);
    }
    return { name: bq.name, d: Math.round(bd) };
  },
  aimAtNearest() {
    let bd = 1e9, bq = null;
    for (const q of players) {
      if (q === me || !q.alive || q.chute > 0) continue;
      const d = Math.hypot(q.x - me.x, q.z - me.z);
      if (d < bd) { bd = d; bq = q; }
    }
    if (!bq) return null;
    const dx = bq.x - me.x, dz = bq.z - me.z;
    yaw = Math.atan2(-dx, -dz);
    const dh = Math.hypot(dx, dz);
    pitch = Math.atan2((bq.y + 1.4) - (me.y + 2.4), dh);
    return { name: bq.name, d: Math.round(dh) };
  },
  fire(on) { mouseDown = on; },
  start(x, z) {
    if (state === 'menu') {
      BOT_N = clamp(parseInt($('botCount').value) || 19, 1, 39);
      genMap();
      $('menu').classList.add('hidden');
    }
    if (state !== 'playing') startGame(x ?? 0, z ?? 0);
  },
  teleport(x, z) { if (me) { me.x = x; me.z = z; me.y = 0; me.vy = 0; me.chute = 0; me.mesh.chute.visible = false; } },
};
