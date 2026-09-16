import * as THREE from 'three';

/* ============================== WARCRAFT 3D — Orcs & Humans ============================== */
const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const dist2 = (ax, az, bx, bz) => Math.hypot(ax - bx, az - bz);
const rand = (a, b) => a + Math.random() * (b - a);
const MAP_HALF = 43;

/* ---------------- Audio (procedural, no assets) ---------------- */
let AC = null;
function audio() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch {} } return AC; }
function tone(f, d = 0.12, type = 'square', v = 0.08, slide = 0) {
  const ac = audio(); if (!ac || ac.state === 'suspended') return;
  try {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, ac.currentTime);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), ac.currentTime + d);
    g.gain.setValueAtTime(v, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + d);
    o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + d);
  } catch {}
}
const SFX = {
  select() { tone(660, 0.07, 'square', 0.05); },
  move() { tone(440, 0.09, 'triangle', 0.07); tone(550, 0.08, 'triangle', 0.05); },
  sword() { tone(220, 0.1, 'sawtooth', 0.06, -120); },
  bow() { tone(900, 0.12, 'sine', 0.06, -500); },
  coin() { tone(1320, 0.09, 'sine', 0.07); setTimeout(() => tone(1760, 0.12, 'sine', 0.07), 70); },
  chop() { tone(300, 0.07, 'square', 0.05, -80); },
  build() { tone(180, 0.15, 'square', 0.06, 60); },
  train() { tone(523, 0.12, 'triangle', 0.07); setTimeout(() => tone(784, 0.16, 'triangle', 0.07), 110); },
  error() { tone(150, 0.2, 'sawtooth', 0.07); },
  horn() { tone(196, 0.4, 'sawtooth', 0.1); setTimeout(() => tone(147, 0.5, 'sawtooth', 0.1), 250); },
  win() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.25, 'triangle', 0.09), i * 160)); },
  lose() { [392, 330, 262, 196].forEach((f, i) => setTimeout(() => tone(f, 0.3, 'sawtooth', 0.08), i * 200)); },
};

/* ---------------- Balance ---------------- */
const UNIT_DEFS = {
  peasant: { name: 'Peasant', icon: '🧑‍🌾', hp: 60, dmg: 5, range: 1.8, speed: 7.5, cd: 1.0, sight: 12, supply: 1, cost: { g: 75, w: 0 }, time: 7, desc: 'Gathers gold & lumber. Right-click a mine or tree, then a Town Hall.' },
  footman: { name: 'Footman', icon: '🗡️', hp: 130, dmg: 12, range: 2.0, speed: 7.0, cd: 1.1, sight: 12, supply: 2, cost: { g: 150, w: 40 }, time: 13, desc: 'Sturdy melee infantry. Strong vs archers & peasants.' },
  archer: { name: 'Archer', icon: '🏹', hp: 80, dmg: 9, range: 13, speed: 7.2, cd: 1.4, sight: 15, supply: 2, cost: { g: 130, w: 60 }, time: 13, desc: 'Long-range archer. Fragile — keep behind Footmen.' },
  grunt: { name: 'Grunt', icon: '👹', hp: 140, dmg: 13, range: 2.0, speed: 6.8, cd: 1.15, sight: 12, supply: 2, cost: { g: 150, w: 40 }, time: 13, desc: 'Orc brute with a heavy axe.' },
  troll: { name: 'Axe Thrower', icon: '🪓', hp: 85, dmg: 10, range: 13, speed: 7.0, cd: 1.45, sight: 15, supply: 2, cost: { g: 130, w: 60 }, time: 13, desc: 'Orc ranged attacker.' },
  peon: { name: 'Peon', icon: '👺', hp: 60, dmg: 5, range: 1.8, speed: 7.5, cd: 1.0, sight: 12, supply: 1, cost: { g: 75, w: 0 }, time: 7, desc: 'Orc worker.' },
};
const BUILD_DEFS = {
  town: { name: 'Town Hall', hp: 900, radius: 4.2 },
  barracks: { name: 'Barracks', hp: 650, radius: 3.8 },
  tower: { name: 'Guard Tower', hp: 450, radius: 1.8, dmg: 16, range: 17, cd: 1.2 },
};
const SUPPLY_CAP = 24;

/* ---------------- State ---------------- */
const state = {
  started: false, over: false, win: false,
  gold: 650, wood: 350,
  eGold: 500, eWood: 300,
  waveNum: 0, waveT: 75, nextWaveIn: 75, waveInterval: 65,
  eTrainT: 20, trickleT: 0,
  time: 0,
};
const units = [], buildings = [], resources = [], projectiles = [], particles = [], corpses = [];

/* ---------------- Renderer / Scene ---------------- */
const canvas = $('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87b5e0);
scene.fog = new THREE.Fog(0x9fc3e2, 70, 160);
const camera = new THREE.PerspectiveCamera(50, 1, 0.5, 400);

const hemi = new THREE.HemisphereLight(0xcfe8ff, 0x3d5a2a, 0.95);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2d0, 1.9);
sun.position.set(40, 60, 20);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -60; sun.shadow.camera.right = 60;
sun.shadow.camera.top = 60; sun.shadow.camera.bottom = -60;
sun.shadow.camera.far = 160; sun.shadow.bias = -0.0006;
scene.add(sun);

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();

/* ---------------- Terrain ---------------- */
function grassTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#5d8f3e'; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 5200; i++) {
    const x = Math.random() * 512, y = Math.random() * 512;
    g.fillStyle = `rgba(${40 + Math.random() * 60 | 0},${110 + Math.random() * 70 | 0},${35 + Math.random() * 40 | 0},0.5)`;
    g.fillRect(x, y, 2, 2 + Math.random() * 3);
  }
  // dirt roads between bases
  g.strokeStyle = 'rgba(150,118,70,0.85)'; g.lineCap = 'round';
  g.lineWidth = 26; g.beginPath(); g.moveTo(90, 430); g.lineTo(420, 90); g.stroke();
  g.strokeStyle = 'rgba(120,92,52,0.9)'; g.lineWidth = 20; g.beginPath(); g.moveTo(90, 430); g.lineTo(420, 90); g.stroke();
  for (let i = 0; i < 300; i++) {
    g.fillStyle = 'rgba(90,66,36,0.5)';
    g.fillRect(90 + Math.random() * 330, 90 + Math.random() * 340, 3, 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
{
  const g = new THREE.PlaneGeometry(96, 96, 1, 1);
  const m = new THREE.MeshLambertMaterial({ map: grassTexture() });
  const ground = new THREE.Mesh(g, m);
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;
  ground.name = 'ground'; scene.add(ground);
  // outer dark surround
  const outer = new THREE.Mesh(new THREE.PlaneGeometry(600, 600),
    new THREE.MeshLambertMaterial({ color: 0x2e4a22 }));
  outer.rotation.x = -Math.PI / 2; outer.position.y = -0.08; scene.add(outer);
}
// lake at center
const lake = { x: 2, z: 0, r: 7 };
{
  const w = new THREE.Mesh(new THREE.CircleGeometry(lake.r, 40),
    new THREE.MeshPhongMaterial({ color: 0x2f7fc4, shininess: 120, transparent: true, opacity: 0.9 }));
  w.rotation.x = -Math.PI / 2; w.position.set(lake.x, 0.05, lake.z); w.receiveShadow = true; scene.add(w);
  const sand = new THREE.Mesh(new THREE.RingGeometry(lake.r, lake.r + 1.6, 40),
    new THREE.MeshLambertMaterial({ color: 0xcbb26a }));
  sand.rotation.x = -Math.PI / 2; sand.position.set(lake.x, 0.04, lake.z); scene.add(sand);
}
// mountains border
{
  const rockMat = new THREE.MeshLambertMaterial({ color: 0x6b6f75 });
  const snowMat = new THREE.MeshLambertMaterial({ color: 0xe8eef2 });
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2;
    const r = 52 + rand(-2, 2);
    const h = rand(6, 13);
    const m = new THREE.Mesh(new THREE.ConeGeometry(rand(3.5, 5.5), h, 5), rockMat);
    m.position.set(Math.cos(a) * r, h / 2 - 0.5, Math.sin(a) * r);
    m.castShadow = true; scene.add(m);
    const s = new THREE.Mesh(new THREE.ConeGeometry(rand(1.2, 2), h * 0.35, 5), snowMat);
    s.position.set(m.position.x, h - h * 0.17 - 0.5, m.position.z); scene.add(s);
  }
}
// clouds
const clouds = [];
{
  const cm = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
  for (let i = 0; i < 7; i++) {
    const grp = new THREE.Group();
    for (let j = 0; j < 4; j++) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(rand(2, 4), 8, 6), cm);
      s.position.set(j * rand(2, 3.4) - 5, rand(-0.5, 0.5), rand(-1.5, 1.5)); s.scale.y = 0.55; grp.add(s);
    }
    grp.position.set(rand(-60, 60), rand(42, 54), rand(-60, 60));
    scene.add(grp); clouds.push({ m: grp, v: rand(0.3, 0.8) });
  }
}

/* ---------------- Materials ---------------- */
const MAT = {
  blue: new THREE.MeshLambertMaterial({ color: 0x2a6bff }),
  red: new THREE.MeshLambertMaterial({ color: 0xd63a2a }),
  skin: new THREE.MeshLambertMaterial({ color: 0xe8b88a }),
  orcSkin: new THREE.MeshLambertMaterial({ color: 0x5da244 }),
  clothBlue: new THREE.MeshLambertMaterial({ color: 0x3b5fa0 }),
  leather: new THREE.MeshLambertMaterial({ color: 0x6b4a26 }),
  wood: new THREE.MeshLambertMaterial({ color: 0x7a5230 }),
  woodDark: new THREE.MeshLambertMaterial({ color: 0x4f3319 }),
  stone: new THREE.MeshLambertMaterial({ color: 0x9a9a9a }),
  stoneDark: new THREE.MeshLambertMaterial({ color: 0x6e6e6e }),
  gold: new THREE.MeshPhongMaterial({ color: 0xffc93a, shininess: 90 }),
  roofBlue: new THREE.MeshLambertMaterial({ color: 0x27407a }),
  roofRed: new THREE.MeshLambertMaterial({ color: 0x7a2727 }),
  plume: new THREE.MeshLambertMaterial({ color: 0xffffff }),
  steel: new THREE.MeshPhongMaterial({ color: 0xb9c4cc, shininess: 60 }),
  leaf: new THREE.MeshLambertMaterial({ color: 0x2f6e2a }),
  leaf2: new THREE.MeshLambertMaterial({ color: 0x3f8a34 }),
  trunk: new THREE.MeshLambertMaterial({ color: 0x5a3a1e }),
  white: new THREE.MeshLambertMaterial({ color: 0xf2ede0 }),
  black: new THREE.MeshLambertMaterial({ color: 0x1c1c1c }),
};
function shadowify(o) { o.traverse((m) => { if (m.isMesh) { m.castShadow = true; } }); }

/* ---------------- Mesh factories ---------------- */
function baseHumanoid(skinMat, clothMat, trimMat, opts = {}) {
  const g = new THREE.Group();
  const s = opts.scale || 1;
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.42 * s, 0.55 * s, 1.1 * s, 8), clothMat);
  body.position.y = 0.85 * s; g.add(body);
  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.46 * s, 0.46 * s, 0.14 * s, 8), MAT.leather);
  belt.position.y = 0.62 * s; g.add(belt);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34 * s, 10, 8), skinMat);
  head.position.y = 1.68 * s; g.add(head);
  const helm = new THREE.Mesh(new THREE.SphereGeometry(0.37 * s, 10, 6, 0, Math.PI * 2, 0, 1.5), trimMat);
  helm.position.y = 1.74 * s; g.add(helm);
  const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.11 * s, 0.11 * s, 0.7 * s, 6), clothMat);
  armL.position.set(-0.55 * s, 1.0 * s, 0); armL.rotation.z = 0.25; g.add(armL);
  const armR = armL.clone(); armR.position.x = 0.55 * s; armR.rotation.z = -0.25; g.add(armR);
  const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.13 * s, 0.13 * s, 0.6 * s, 6), MAT.leather);
  legL.position.set(-0.2 * s, 0.3 * s, 0); g.add(legL);
  const legR = legL.clone(); legR.position.x = 0.2 * s; g.add(legR);
  g.userData.armR = armR; g.userData.armL = armL; g.userData.head = head;
  shadowify(g);
  return g;
}
function makeUnitMesh(kind, faction) {
  const trim = faction === 'player' ? MAT.blue : MAT.red;
  let g;
  if (kind === 'peasant' || kind === 'peon') {
    const skin = kind === 'peasant' ? MAT.skin : MAT.orcSkin;
    const cloth = kind === 'peasant' ? MAT.clothBlue : new THREE.MeshLambertMaterial({ color: 0x6e3b22 });
    g = baseHumanoid(skin, cloth, trim, { scale: 0.92 });
    const sack = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 6), MAT.wood);
    sack.position.set(0, 1.0, -0.5); g.add(sack); g.userData.sack = sack;
    if (kind === 'peon') { const tusk = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.22, 5), MAT.white); tusk.position.set(0.12, 1.55, 0.3); g.add(tusk); }
  } else if (kind === 'footman' || kind === 'grunt') {
    const skin = kind === 'footman' ? MAT.skin : MAT.orcSkin;
    g = baseHumanoid(skin, MAT.steel, trim, { scale: 1.05 });
    const sword = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.0, 0.16), MAT.steel);
    sword.position.set(0.75, 1.2, 0.2); sword.rotation.x = 0.5; g.add(sword); g.userData.weapon = sword;
    const shield = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.08, 10), trim);
    shield.position.set(-0.7, 1.0, 0.15); shield.rotation.z = Math.PI / 2; g.add(shield);
    if (kind === 'grunt') { const axe = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.3, 0.06), MAT.stoneDark); axe.position.set(0.75, 1.75, 0.35); g.add(axe); }
  } else { // archers
    const skin = kind === 'archer' ? MAT.skin : MAT.orcSkin;
    g = baseHumanoid(skin, faction === 'player' ? new THREE.MeshLambertMaterial({ color: 0x2a6e3a }) : new THREE.MeshLambertMaterial({ color: 0x4a2a5a }), trim, { scale: 0.98 });
    const bowMat = MAT.woodDark;
    const bow = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.05, 6, 12, Math.PI * 1.2), bowMat);
    bow.position.set(0.62, 1.15, 0.25); bow.rotation.y = Math.PI / 2; bow.rotation.z = 0.4; g.add(bow); g.userData.weapon = bow;
    const hood = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.5, 8), trim);
    hood.position.y = 2.0; g.add(hood);
  }
  // team banner pole
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.0, 5), MAT.woodDark);
  pole.position.set(0, 1.6, -0.42); g.add(pole);
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.26), new THREE.MeshBasicMaterial({ color: faction === 'player' ? 0x2a6bff : 0xff3b30, side: THREE.DoubleSide }));
  flag.position.set(0.22, 1.95, -0.42); g.add(flag);
  return g;
}
function makeBuildingMesh(type, faction) {
  const g = new THREE.Group();
  const trimRoof = faction === 'player' ? MAT.roofBlue : MAT.roofRed;
  if (type === 'town') {
    const base = new THREE.Mesh(new THREE.BoxGeometry(6.4, 3.2, 6.4), MAT.stone); base.position.y = 1.6; g.add(base);
    const wood2 = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.8, 5.2), MAT.wood); wood2.position.y = 4.0; g.add(wood2);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(4.6, 2.6, 4), trimRoof); roof.position.y = 6.2; roof.rotation.y = Math.PI / 4; g.add(roof);
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 0.2), MAT.woodDark); door.position.set(0, 1.1, 3.25); g.add(door);
    const win = new THREE.Mesh(new THREE.BoxGeometry(5.3, 0.5, 5.3), new THREE.MeshBasicMaterial({ color: 0xffe9a8 })); win.position.y = 3.4; g.add(win);
    const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.4, 6), MAT.woodDark); flagPole.position.y = 8.6; g.add(flagPole);
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), new THREE.MeshBasicMaterial({ color: faction === 'player' ? 0x2a6bff : 0xff3b30, side: THREE.DoubleSide })); flag.position.set(0.85, 9.4, 0); g.add(flag);
    g.userData.flag = flag;
  } else if (type === 'barracks') {
    const base = new THREE.Mesh(new THREE.BoxGeometry(6.8, 2.6, 4.6), MAT.wood); base.position.y = 1.3; g.add(base);
    const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 2.6, 4.8, 3, 1), trimRoof);
    roof.position.y = 4.2; roof.rotation.z = Math.PI / 2; roof.rotation.x = Math.PI; roof.scale.z = 1.6; g.add(roof);
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.0, 0.2), MAT.black); door.position.set(0, 1.0, 2.35); g.add(door);
    for (const sx of [-2.4, 2.4]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.6, 6), MAT.woodDark); post.position.set(sx, 1.3, 2.6); g.add(post);
      const torch = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffa63a })); torch.position.set(sx, 2.75, 2.6); g.add(torch);
    }
  } else { // tower
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.5, 4.6, 8), MAT.stone); shaft.position.y = 2.3; g.add(shaft);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.4, 1.4, 8), MAT.wood); top.position.y = 5.2; g.add(top);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(2.2, 1.6, 8), trimRoof); roof.position.y = 6.7; g.add(roof);
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.2), new THREE.MeshBasicMaterial({ color: 0xffe9a8 })); win.position.set(0, 5.2, 1.55); g.add(win);
  }
  shadowify(g);
  g.traverse((m) => { if (m.isMesh) m.receiveShadow = true; });
  return g;
}
function makeTreeMesh(big = false) {
  const g = new THREE.Group();
  const s = big ? rand(1.2, 1.5) : rand(0.85, 1.15);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.28 * s, 0.4 * s, 1.6 * s, 7), MAT.trunk);
  trunk.position.y = 0.8 * s; g.add(trunk);
  const lm = Math.random() < 0.5 ? MAT.leaf : MAT.leaf2;
  for (let i = 0; i < 3; i++) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry((1.5 - i * 0.32) * s, 1.5 * s, 8), lm);
    cone.position.y = (1.7 + i * 0.95) * s; g.add(cone);
  }
  shadowify(g);
  return g;
}
function makeMineMesh() {
  const g = new THREE.Group();
  for (let i = 0; i < 7; i++) {
    const r = new THREE.Mesh(new THREE.DodecahedronGeometry(rand(0.5, 1.1)), MAT.gold);
    r.position.set(rand(-2, 2), rand(0.2, 1.2), rand(-1.6, 1.6));
    r.rotation.set(rand(0, 3), rand(0, 3), 0); g.add(r);
  }
  const frame = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.4, 0.4), MAT.woodDark); frame.position.y = 2.6; g.add(frame);
  for (const sx of [-2.5, 2.5]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.8, 6), MAT.woodDark); leg.position.set(sx, 1.3, 0); g.add(leg); }
  shadowify(g);
  return g;
}

/* ---------------- Selection ring + health bar ---------------- */
function makeRing(color) {
  const m = new THREE.Mesh(new THREE.RingGeometry(0.8, 1.0, 28),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.06; m.visible = false;
  return m;
}
function makeHealthBar(w = 1.9) {
  const grp = new THREE.Group();
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.24), new THREE.MeshBasicMaterial({ color: 0x401010, depthTest: false, transparent: true }));
  const fg = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.24), new THREE.MeshBasicMaterial({ color: 0x35e055, depthTest: false, transparent: true }));
  fg.position.z = 0.01; grp.add(bg, fg); grp.renderOrder = 999;
  bg.renderOrder = 999; fg.renderOrder = 1000;
  grp.userData.set = (f) => {
    fg.scale.x = Math.max(0.001, f);
    fg.position.x = -w * (1 - f) / 2;
    fg.material.color.set(f > 0.55 ? 0x35e055 : f > 0.28 ? 0xffc93a : 0xff4444);
  };
  return grp;
}

/* ---------------- Entities ---------------- */
let eid = 1;
function spawnUnit(kind, faction, x, z, opts = {}) {
  const def = UNIT_DEFS[kind];
  const mesh = makeUnitMesh(kind, faction);
  mesh.position.set(x, 0, z);
  scene.add(mesh);
  const ring = makeRing(faction === 'player' ? 0x35ff6e : 0xff4444);
  ring.scale.setScalar(kind === 'peasant' || kind === 'peon' ? 1 : 1.25);
  mesh.add(ring);
  const bar = makeHealthBar();
  bar.position.y = kind === 'peasant' || kind === 'peon' ? 2.3 : 2.6;
  mesh.add(bar);
  const u = {
    id: eid++, kind: 'unit', ukind: kind, faction, mesh, ring, bar, def,
    hp: def.hp, maxHp: def.hp, speed: def.speed * rand(0.95, 1.05),
    x, z, tx: x, tz: z, angle: rand(0, 6.28),
    order: { type: 'idle' }, cooldown: rand(0, 0.5), hold: false,
    target: null, harvestT: 0, phase: 'toRes', carry: null, carryN: 0,
    resTarget: null, home: null, bob: rand(0, 6), swing: 0,
    dead: false, buildTarget: null,
  };
  if (opts.carry) { u.carry = opts.carry; }
  mesh.userData.ent = u;
  units.push(u);
  return u;
}
function spawnBuilding(type, faction, x, z) {
  const def = BUILD_DEFS[type];
  const mesh = makeBuildingMesh(type, faction);
  mesh.position.set(x, 0, z);
  if (type !== 'tower') mesh.rotation.y = (faction === 'player' ? -0.6 : 2.5);
  scene.add(mesh);
  const ring = makeRing(faction === 'player' ? 0x35ff6e : 0xff4444);
  ring.scale.setScalar(def.radius * 0.95); mesh.add(ring);
  const bar = makeHealthBar(def.radius * 1.5);
  bar.position.y = type === 'town' ? 8.6 : type === 'barracks' ? 6.0 : 7.8;
  mesh.add(bar);
  const b = {
    id: eid++, kind: 'building', btype: type, faction, mesh, ring, bar, def,
    hp: def.hp, maxHp: def.hp, x, z, radius: def.radius,
    queue: [], qTime: 0, cooldown: 0, rally: { x: x + (faction === 'player' ? 5 : -5), z: z + 3 },
    dead: false, constructing: false, buildHp: 0,
  };
  mesh.userData.ent = b;
  buildings.push(b);
  return b;
}
function spawnResource(kind, x, z, amount) {
  const mesh = kind === 'gold' ? makeMineMesh() : makeTreeMesh();
  mesh.position.set(x, 0, z);
  if (kind === 'wood') mesh.rotation.y = rand(0, 6.28);
  scene.add(mesh);
  const r = { id: eid++, kind: 'resource', rtype: kind, mesh, x, z, amount, maxAmount: amount, radius: kind === 'gold' ? 3.2 : 1.1, dead: false };
  mesh.userData.ent = r;
  resources.push(r);
  return r;
}

/* ---------------- Map layout ---------------- */
const P_BASE = { x: -26, z: 26 }, E_BASE = { x: 26, z: -26 };
function clearOfBases(x, z) {
  return dist2(x, z, P_BASE.x, P_BASE.z) > 14 && dist2(x, z, E_BASE.x, E_BASE.z) > 14 && dist2(x, z, lake.x, lake.z) > lake.r + 3;
}
function buildMap() {
  // forests
  const forestSpots = [[-12, 8, 16], [-34, -6, 14], [12, -8, 0], [34, 6, 14], [-6, 34, 12], [6, -34, 12], [-14, -22, 10], [14, 22, 0]];
  for (const [fx, fz, n] of forestSpots) {
    for (let i = 0; i < n; i++) {
      const x = fx + rand(-9, 9), z = fz + rand(-9, 9);
      if (!clearOfBases(x, z) && Math.random() < 0.7) continue;
      if (Math.abs(x) > MAP_HALF - 2 || Math.abs(z) > MAP_HALF - 2) continue;
      if (dist2(x, z, lake.x, lake.z) < lake.r + 2) continue;
      spawnResource('wood', x, z, 150);
    }
  }
  // gold mines near each base + center
  spawnResource('gold', P_BASE.x + 8, P_BASE.z - 2, 2500);
  spawnResource('gold', E_BASE.x - 8, E_BASE.z + 2, 2500);
  spawnResource('gold', -8, -8, 1500);
  spawnResource('gold', 10, 8, 1500);
  // decorative rocks
  const rockG = new THREE.Group();
  for (let i = 0; i < 14; i++) {
    const x = rand(-44, 44), z = rand(-44, 44);
    if (!clearOfBases(x, z)) continue;
    const r = new THREE.Mesh(new THREE.DodecahedronGeometry(rand(0.4, 1.0)), MAT.stoneDark);
    r.position.set(x, 0.3, z); r.castShadow = true; rockG.add(r);
  }
  scene.add(rockG);
}
function buildBases() {
  spawnBuilding('town', 'player', P_BASE.x, P_BASE.z);
  spawnBuilding('barracks', 'player', P_BASE.x + 11, P_BASE.z + 1);
  spawnBuilding('tower', 'player', P_BASE.x + 4, P_BASE.z - 7);
  spawnBuilding('town', 'enemy', E_BASE.x, E_BASE.z);
  spawnBuilding('barracks', 'enemy', E_BASE.x - 11, E_BASE.z - 1);
  spawnBuilding('tower', 'enemy', E_BASE.x - 4, E_BASE.z + 7);
  spawnBuilding('tower', 'enemy', E_BASE.x - 10, E_BASE.z + 5);
  // workers ring the town hall at a walkable distance
  const pW = [[6, 0], [0, 6], [-6, 0], [0, -6]];
  for (const [ox, oz] of pW) {
    const s = findClear(P_BASE.x + ox, P_BASE.z + oz);
    spawnUnit('peasant', 'player', s.x, s.z);
  }
  for (const [ox, oz] of [[4, 7], [6, 6], [2, 8]]) {
    const s = findClear(P_BASE.x + ox, P_BASE.z + oz);
    spawnUnit(ox === 2 ? 'archer' : 'footman', 'player', s.x, s.z);
  }
  const eW = [[6, 0], [0, 6], [-6, 0], [0, -6]];
  for (const [ox, oz] of eW) {
    const s = findClear(E_BASE.x + ox, E_BASE.z + oz);
    spawnUnit('peon', 'enemy', s.x, s.z);
  }
  for (const [ox, oz, k] of [[-4, -7, 'grunt'], [-6, -6, 'grunt'], [-2, -8, 'troll']]) {
    const s = findClear(E_BASE.x + ox, E_BASE.z + oz);
    spawnUnit(k, 'enemy', s.x, s.z);
  }
  // rally points on walkable ground
  for (const b of buildings) {
    const r = findClear(b.rally.x, b.rally.z);
    b.rally.x = r.x; b.rally.z = r.z;
  }
}
buildMap(); buildBases();

/* ---------------- Camera rig ---------------- */
const cam = { tx: -14, tz: 14, yaw: 0.7, dist: 40, pitch: 0.98 };
function updateCamera() {
  const cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
  camera.position.set(
    cam.tx + Math.sin(cam.yaw) * cp * cam.dist,
    sp * cam.dist,
    cam.tz + Math.cos(cam.yaw) * cp * cam.dist
  );
  camera.lookAt(cam.tx, 0, cam.tz);
}
updateCamera();

/* ---------------- Input: selection & orders ---------------- */
const ray = new THREE.Raycaster();
const mouseNDC = new THREE.Vector2();
const selected = new Set();
let attackMoveMode = false, buildMode = false, buildGhost = null;
let dragStart = null, dragCur = null;
const selboxEl = $('selbox');

function setNDC(e) {
  const r = canvas.getBoundingClientRect();
  mouseNDC.x = ((e.clientX - r.left) / r.width) * 2 - 1;
  mouseNDC.y = -((e.clientY - r.top) / r.height) * 2 + 1;
}
function groundPoint(e) {
  setNDC(e); ray.setFromCamera(mouseNDC, camera);
  const t = -ray.ray.origin.y / ray.ray.direction.y;
  if (!isFinite(t) || t < 0) return null;
  const p = ray.ray.origin.clone().add(ray.ray.direction.clone().multiplyScalar(t));
  return { x: clamp(p.x, -MAP_HALF, MAP_HALF), z: clamp(p.z, -MAP_HALF, MAP_HALF) };
}
function pickEntity(e, playerOnlySelectable = true) {
  setNDC(e); ray.setFromCamera(mouseNDC, camera);
  const targets = [];
  for (const u of units) if (!u.dead) targets.push(u.mesh);
  for (const b of buildings) if (!b.dead) targets.push(b.mesh);
  for (const r of resources) if (!r.dead && r.amount > 0) targets.push(r.mesh);
  const hits = ray.intersectObjects(targets, true);
  for (const h of hits) {
    let o = h.object;
    while (o && !o.userData.ent) o = o.parent;
    if (o) {
      const ent = o.userData.ent;
      if (playerOnlySelectable && ent.kind === 'unit' && ent.faction !== 'player') return { ent, enemy: true };
      if (playerOnlySelectable && ent.kind === 'building' && ent.faction !== 'player') return { ent, enemy: true };
      return { ent };
    }
  }
  return null;
}
function clearSelection() {
  for (const e of selected) e.ring.visible = false;
  selected.clear();
}
function selectEnt(ent, additive) {
  if (!additive) clearSelection();
  if (selected.has(ent)) { selected.delete(ent); ent.ring.visible = false; }
  else { selected.add(ent); ent.ring.visible = true; }
  refreshUI();
}
function selectPlayerUnitsInRect(x0, y0, x1, y1, additive) {
  const minX = Math.min(x0, x1), maxX = Math.max(x0, x1);
  const minY = Math.min(y0, y1), maxY = Math.max(y0, y1);
  if (!additive) clearSelection();
  const v = new THREE.Vector3();
  for (const u of units) {
    if (u.dead || u.faction !== 'player') continue;
    v.set(u.x, 1, u.z).project(camera);
    const sx = (v.x * 0.5 + 0.5) * innerWidth, sy = (-v.y * 0.5 + 0.5) * innerHeight;
    if (sx >= minX && sx <= maxX && sy >= minY && sy <= maxY && v.z < 1) {
      selected.add(u); u.ring.visible = true;
    }
  }
  if (selected.size) SFX.select();
  refreshUI();
}
function playerUnits() { return [...selected].filter((e) => e.kind === 'unit'); }

function issueOrder(ent, order) {
  ent.order = order; ent.hold = order.type === 'hold';
  ent.target = order.type === 'attack' ? order.target : null;
  if (order.x !== undefined) ent.tx = order.x;
  if (order.z !== undefined) ent.tz = order.z;
  if (order.type === 'gather') { ent.phase = 'toRes'; ent.resTarget = order.res; ent.harvestT = 0; }
  ent.buildTarget = order.type === 'build' ? order.site : null;
}
function rightClick(e) {
  if (!state.started || state.over) return;
  const mine = playerUnits();
  if (!mine.length) return;
  const pick = pickEntity(e, false);
  // build placement confirm
  if (buildMode) {
    const p = groundPoint(e);
    if (p && tryPlaceTower(p.x, p.z)) { buildMode = false; removeGhost(); }
    return;
  }
  if (pick && pick.ent.kind === 'resource' && pick.ent.amount > 0) {
    const peas = mine.filter((u) => u.ukind === 'peasant');
    const others = mine.filter((u) => u.ukind !== 'peasant');
    if (peas.length) {
      for (const p of peas) issueOrder(p, { type: 'gather', res: pick.ent });
      toast(`★ Gathering ${pick.ent.rtype === 'gold' ? 'gold' : 'lumber'}!`);
      SFX.move();
    }
    if (others.length) moveAttackGroup(others, pick.ent.x, pick.ent.z);
    return;
  }
  if (pick && pick.enemy) {
    for (const u of mine) issueOrder(u, { type: 'attack', target: pick.ent });
    toast('★ Attack!'); SFX.sword();
    return;
  }
  if (pick && !pick.enemy && (pick.ent.kind === 'unit' || pick.ent.kind === 'building')) {
    if (e.shiftKey) { for (const u of mine) selectEnt(pick.ent, true); }
    else { clearSelection(); selectEnt(pick.ent, false); SFX.select(); }
    return;
  }
  const p = groundPoint(e);
  if (!p) return;
  if (attackMoveMode) {
    for (const u of mine) { const t = findClear(p.x, p.z); issueOrder(u, { type: 'attackmove', x: t.x, z: t.z }); }
    attackMoveMode = false; canvas.style.cursor = 'default';
    spawnPing(p.x, p.z, 0xff4444); SFX.sword();
  } else {
    moveAttackGroup(mine, p.x, p.z);
  }
}
function moveAttackGroup(list, x, z) {
  const c = findClear(x, z);
  list.forEach((u, i) => {
    const a = (i / Math.max(1, list.length)) * Math.PI * 2;
    const t = findClear(c.x + Math.cos(a) * (i > 0 ? 1.6 : 0), c.z + Math.sin(a) * (i > 0 ? 1.6 : 0));
    issueOrder(u, { type: 'move', x: t.x, z: t.z });
  });
  spawnPing(c.x, c.z, 0x35ff6e); SFX.move();
}
canvas.addEventListener('mousedown', (e) => {
  if (!state.started || state.over) return;
  if (e.button === 0) { dragStart = { x: e.clientX, y: e.clientY }; dragCur = { ...dragStart }; }
});
canvas.addEventListener('mousemove', (e) => {
  if (dragStart) {
    dragCur = { x: e.clientX, y: e.clientY };
    const dx = Math.min(dragStart.x, dragCur.x), dy = Math.min(dragStart.y, dragCur.y);
    selboxEl.style.display = 'block';
    selboxEl.style.left = dx + 'px'; selboxEl.style.top = dy + 'px';
    selboxEl.style.width = Math.abs(dragCur.x - dragStart.x) + 'px';
    selboxEl.style.height = Math.abs(dragCur.y - dragStart.y) + 'px';
  }
  if (buildMode && buildGhost) {
    const p = groundPoint(e);
    if (p) { buildGhost.position.set(p.x, 0, p.z); buildGhost.material.opacity = canPlace(p.x, p.z) ? 0.55 : 0.25; }
  }
});
addEventListener('mouseup', (e) => {
  if (!dragStart || e.button !== 0) return;
  const moved = Math.hypot(e.clientX - dragStart.x, e.clientY - dragStart.y);
  if (moved > 8) {
    selectPlayerUnitsInRect(dragStart.x, dragStart.y, e.clientX, e.clientY, e.shiftKey);
  } else if (e.target === canvas) {
    if (buildMode) {
      const p = groundPoint(e);
      if (p && tryPlaceTower(p.x, p.z)) { buildMode = false; removeGhost(); }
    } else if (attackMoveMode) {
      const p = groundPoint(e);
      if (p) { const ms = playerUnits(); const t = findClear(p.x, p.z); ms.forEach((u) => issueOrder(u, { type: 'attackmove', x: t.x, z: t.z })); attackMoveMode = false; canvas.style.cursor = 'default'; spawnPing(t.x, t.z, 0xff4444); }
    } else {
      const pick = pickEntity(e, false);
      if (pick && (pick.ent.kind === 'unit' || pick.ent.kind === 'building') && (pick.ent.faction === 'player' || pick.ent.kind === 'building' || true)) {
        if (pick.ent.faction === 'player') { selectEnt(pick.ent, e.shiftKey); SFX.select(); }
        else { // clicked enemy: attack with selection
          const ms = playerUnits();
          if (ms.length && pick.ent.kind !== 'resource') { for (const u of ms) issueOrder(u, { type: 'attack', target: pick.ent }); toast('★ Attack!'); }
        }
      } else if (pick && pick.ent.kind === 'resource') {
        const peas = playerUnits().filter((u) => u.ukind === 'peasant');
        if (peas.length && pick.ent.amount > 0) { for (const p of peas) issueOrder(p, { type: 'gather', res: pick.ent }); SFX.move(); }
        else if (!peas.length) toast('Select a Peasant to gather!');
      } else { if (!e.shiftKey) { clearSelection(); refreshUI(); } }
    }
  }
  dragStart = null; selboxEl.style.display = 'none';
});
canvas.addEventListener('contextmenu', (e) => { e.preventDefault(); rightClick(e); });
// touch: tap = smart select/order, drag = box select
let touchStart = null;
canvas.addEventListener('touchstart', (e) => { touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() }; }, { passive: true });
canvas.addEventListener('touchend', (e) => {
  if (!touchStart) return;
  const t = e.changedTouches[0];
  const moved = Math.hypot(t.clientX - touchStart.x, t.clientY - touchStart.y);
  if (moved < 14 && Date.now() - touchStart.t < 400) {
    const fake = { clientX: t.clientX, clientY: t.clientY, shiftKey: false, target: canvas };
    const pick = pickEntity(fake, false);
    const ms = playerUnits();
    if (pick && pick.ent.faction !== 'player' && (pick.ent.kind === 'unit' || pick.ent.kind === 'building') && ms.length) {
      for (const u of ms) issueOrder(u, { type: 'attack', target: pick.ent });
    } else if (pick && pick.ent.kind === 'resource' && ms.some((u) => u.ukind === 'peasant')) {
      for (const u of ms.filter((u) => u.ukind === 'peasant')) issueOrder(u, { type: 'gather', res: pick.ent });
    } else if (pick && pick.ent.faction === 'player') { selectEnt(pick.ent, false); }
    else if (ms.length) { const p = groundPoint(fake); if (p) moveAttackGroup(ms, p.x, p.z); }
  }
  touchStart = null;
}, { passive: true });

addEventListener('keydown', (e) => {
  if (!state.started || state.over) return;
  const k = e.key.toLowerCase();
  if (k === 'a') { attackMoveMode = true; canvas.style.cursor = 'crosshair'; toast('★ Attack-move: left-click a destination'); }
  if (k === 's') { for (const u of playerUnits()) issueOrder(u, { type: 'idle' }); }
  if (k === 'h') { for (const u of playerUnits()) issueOrder(u, { type: 'hold' }); toast('🛡️ Hold position'); }
  if (k === 'escape') { attackMoveMode = false; buildMode = false; removeGhost(); canvas.style.cursor = 'default'; clearSelection(); refreshUI(); }
});
addEventListener('wheel', (e) => { cam.dist = clamp(cam.dist + e.deltaY * 0.03, 18, 70); }, { passive: true });
// camera keys + edge pan
const keysDown = new Set();
addEventListener('keydown', (e) => keysDown.add(e.key.toLowerCase()));
addEventListener('keyup', (e) => keysDown.delete(e.key.toLowerCase()));
let mouseEdge = { x: -1, y: -1 };
let mouseSeen = false;
addEventListener('mousemove', (e) => { mouseEdge = { x: e.clientX, y: e.clientY }; mouseSeen = true; });
function updateCameraControl(dt) {
  const sp = 26 * dt;
  const fwd = { x: -Math.sin(cam.yaw), z: -Math.cos(cam.yaw) };
  const rgt = { x: Math.cos(cam.yaw), z: -Math.sin(cam.yaw) };
  let mx = 0, mz = 0;
  if (keysDown.has('w') || keysDown.has('arrowup')) { mx += fwd.x; mz += fwd.z; }
  if (keysDown.has('s') || keysDown.has('arrowdown')) { mx -= fwd.x; mz -= fwd.z; }
  // note: 's' doubles as stop; only pan when no units selected? keep pan always — fine
  if (keysDown.has('a') && !attackMoveMode) { mx -= rgt.x; mz -= rgt.z; }
  if (keysDown.has('d')) { mx += rgt.x; mz += rgt.z; }
  if (keysDown.has('q')) cam.yaw += 1.6 * dt;
  if (keysDown.has('e')) cam.yaw -= 1.6 * dt;
  const m = 14;
  if (state.started && !state.over && mouseSeen && document.hasFocus()) {
    if (mouseEdge.x < m) { mx -= rgt.x; mz -= rgt.z; }
    if (mouseEdge.x > innerWidth - m) { mx += rgt.x; mz += rgt.z; }
    if (mouseEdge.y < m + 44) { mx += fwd.x; mz += fwd.z; }
    if (mouseEdge.y > innerHeight - m - 140) { mx -= fwd.x; mz -= fwd.z; }
  }
  const l = Math.hypot(mx, mz);
  if (l > 0) { cam.tx = clamp(cam.tx + (mx / l) * sp * Math.min(1, l), -MAP_HALF, MAP_HALF); cam.tz = clamp(cam.tz + (mz / l) * sp * Math.min(1, l), -MAP_HALF, MAP_HALF); }
  updateCamera();
}
// minimap
const mm = $('minimap').getContext('2d');
$('minimap').addEventListener('click', (e) => {
  const r = $('minimap').getBoundingClientRect();
  const nx = (e.clientX - r.left) / r.width, ny = (e.clientY - r.top) / r.height;
  cam.tx = clamp(nx * 96 - 48, -MAP_HALF, MAP_HALF);
  cam.tz = clamp(ny * 96 - 48, -MAP_HALF, MAP_HALF);
});

/* ---------------- Build tower placement ---------------- */
function canPlace(x, z) {
  if (Math.abs(x) > MAP_HALF - 3 || Math.abs(z) > MAP_HALF - 3) return false;
  if (dist2(x, z, lake.x, lake.z) < lake.r + 2.5) return false;
  for (const b of buildings) if (!b.dead && dist2(x, z, b.x, b.z) < b.radius + 2.4) return false;
  for (const r of resources) if (!r.dead && r.amount > 0 && dist2(x, z, r.x, r.z) < r.radius + 1.6) return false;
  return true;
}
function removeGhost() { if (buildGhost) { scene.remove(buildGhost); buildGhost = null; } }
function startBuildMode() {
  if (!playerUnits().some((u) => u.ukind === 'peasant')) { toast('Select a Peasant to build!'); SFX.error(); return; }
  if (state.gold < 120 || state.wood < 80) { toast('Need 120g + 80w for a Tower!'); SFX.error(); return; }
  buildMode = true;
  removeGhost();
  buildGhost = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 5, 10),
    new THREE.MeshBasicMaterial({ color: 0x35ff6e, transparent: true, opacity: 0.5 }));
  buildGhost.position.set(0, 2.5, 0); scene.add(buildGhost);
  toast('🗼 Click a spot to build a Guard Tower (Esc cancels)');
}
function tryPlaceTower(x, z) {
  if (!canPlace(x, z)) { toast('Cannot build here!'); SFX.error(); return false; }
  const peas = playerUnits().filter((u) => u.ukind === 'peasant');
  if (!peas.length) return false;
  if (state.gold < 120 || state.wood < 80) { toast('Need 120g + 80w!'); SFX.error(); return false; }
  state.gold -= 120; state.wood -= 80;
  const u = peas[0];
  issueOrder(u, { type: 'build', site: { x, z, progress: 0, total: 14 } });
  toast('🗼 Peasant is building a Tower…'); SFX.build();
  return true;
}

/* ---------------- Combat / orders helpers ---------------- */
function nearestEnemy(x, z, faction, range, kinds = null) {
  let best = null, bd = range;
  for (const u of units) {
    if (u.dead || u.faction === faction) continue;
    if (kinds && !kinds.includes(u.kind)) continue;
    const d = dist2(x, z, u.x, u.z);
    if (d < bd) { bd = d; best = u; }
  }
  for (const b of buildings) {
    if (b.dead || b.faction === faction) continue;
    const d = dist2(x, z, b.x, b.z) - b.radius;
    if (d < bd) { bd = d; best = b; }
  }
  return best;
}
function nearestHall(faction, x, z) {
  let best = null, bd = 1e9;
  for (const b of buildings) {
    if (b.dead || b.faction !== faction || b.btype !== 'town') continue;
    const d = dist2(x, z, b.x, b.z);
    if (d < bd) { bd = d; best = b; }
  }
  return best;
}
function dealDamage(target, dmg) {
  if (!target || target.dead) return;
  target.hp -= dmg;
  if (target.hp <= 0) killEnt(target);
}
function killEnt(ent) {
  if (ent.dead) return;
  ent.dead = true;
  ent.ring.visible = false;
  selected.delete(ent);
  if (ent.kind === 'unit') {
    // death poof + corpse
    burst(ent.x, 0.6, ent.z, ent.faction === 'player' ? 0x3b5fa0 : 0xd63a2a, 14);
    scene.remove(ent.mesh);
    const idx = units.indexOf(ent); if (idx >= 0) units.splice(idx, 1);
    if (ent.faction === 'player') toast(`${ent.def.icon} ${ent.def.name} has fallen!`);
  } else {
    burst(ent.x, 2, ent.z, 0xff8830, 40);
    burst(ent.x, 3, ent.z, 0x555555, 30);
    scene.remove(ent.mesh);
    const idx = buildings.indexOf(ent); if (idx >= 0) buildings.splice(idx, 1);
    SFX.horn();
    if (ent.btype === 'town') {
      if (ent.faction === 'enemy') endGame(true, 'You razed the Orc Stronghold! The Horde flees — Azeroth is yours, Commander! 🏆');
      else endGame(false, 'Your Town Hall has fallen! The Horde overruns the Alliance…');
    } else {
      toast(ent.faction === 'enemy' ? `🔥 Enemy ${ent.def.name} destroyed!` : `🔥 Your ${ent.def.name} was destroyed!`);
    }
  }
  refreshUI();
}
function fireArrow(from, target, dmg, faction) {
  const g = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 5), MAT.woodDark);
  shaft.rotation.x = Math.PI / 2; g.add(shaft);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.25, 5), MAT.steel);
  tip.position.z = 0.55; tip.rotation.x = Math.PI / 2; g.add(tip);
  g.position.set(from.x, 1.6, from.z);
  scene.add(g);
  projectiles.push({ mesh: g, target, dmg, speed: 34, dead: false, x: from.x, z: from.z, t: 0 });
  SFX.bow();
}
function spawnPing(x, z, color) {
  const m = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.8, 24),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1, side: THREE.DoubleSide, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.set(x, 0.1, z); scene.add(m);
  particles.push({ mesh: m, vel: new THREE.Vector3(), life: 0.7, maxLife: 0.7, grow: 4, fade: true });
}
function burst(x, y, z, color, n = 12) {
  for (let i = 0; i < n; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(rand(0.08, 0.22), 6, 5),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 }));
    m.position.set(x + rand(-0.5, 0.5), y + rand(0, 0.8), z + rand(-0.5, 0.5));
    scene.add(m);
    particles.push({
      mesh: m, life: rand(0.3, 0.7), maxLife: 0.7,
      vel: new THREE.Vector3(rand(-4, 4), rand(2, 7), rand(-4, 4)), fade: true,
    });
  }
}

/* ---------------- Training ---------------- */
function supplyUsed(faction) {
  let s = 0;
  for (const u of units) if (!u.dead && u.faction === faction) s += u.def.supply;
  for (const b of buildings) if (!b.dead && b.faction === faction) for (const q of b.queue) s += UNIT_DEFS[q.key].supply;
  return s;
}
function tryTrain(building, key) {
  if (!building || building.dead || state.over) return;
  const def = UNIT_DEFS[key];
  const isPlayer = building.faction === 'player';
  const G = isPlayer ? state.gold : state.eGold, W = isPlayer ? state.wood : state.eWood;
  if (G < def.cost.g || W < def.cost.w) { if (isPlayer) { toast(`Need ${def.cost.g}g ${def.cost.w ? `+ ${def.cost.w}w` : ''}!`); SFX.error(); } return false; }
  if (supplyUsed(building.faction) + def.supply > SUPPLY_CAP) { if (isPlayer) { toast('Supply blocked! (max 24)'); SFX.error(); } return false; }
  if (building.queue.length >= 5) { if (isPlayer) toast('Queue is full!'); return false; }
  if (isPlayer) { state.gold -= def.cost.g; state.wood -= def.cost.w; }
  else { state.eGold -= def.cost.g; state.eWood -= def.cost.w; }
  building.queue.push({ key, t: 0, total: def.time });
  if (isPlayer) { toast(`${def.icon} Training ${def.name}…`); SFX.build(); }
  refreshUI();
  return true;
}

/* ---------------- UI ---------------- */
let toastT = null;
function toast(msg, ms = 2200) {
  const el = $('toast');
  el.textContent = msg; el.style.display = 'block';
  clearTimeout(toastT); toastT = setTimeout(() => (el.style.display = 'none'), ms);
}
function refreshUI() {
  lastSelKey = selKey();
  $('gold').textContent = Math.floor(state.gold);
  $('wood').textContent = Math.floor(state.wood);
  $('food').textContent = `${supplyUsed('player')}/${SUPPLY_CAP}`;
  $('army').textContent = units.filter((u) => !u.dead && u.faction === 'player' && u.ukind !== 'peasant').length;
  const grid = $('cmdGrid'); grid.innerHTML = '';
  const sel = [...selected].filter((e) => !e.dead);
  const one = sel.length === 1 ? sel[0] : null;
  const addBtn = (emoji, label, cost, fn, enabled = true, title = '') => {
    const b = document.createElement('button');
    b.className = 'cmd'; b.disabled = !enabled; b.title = title;
    b.innerHTML = `<span class="e">${emoji}</span><span>${label}</span>${cost ? `<span class="cost">${cost}</span>` : ''}`;
    b.onclick = (ev) => { ev.stopPropagation(); fn(); };
    grid.appendChild(b);
  };
  if (!sel.length) {
    $('unitName').textContent = 'No selection';
    $('unitDesc').textContent = 'Left-click / drag to select. Right-click to command.';
    $('portrait').textContent = '⚔️'; $('hpBar').style.width = '100%';
    $('cmdTitle').textContent = 'COMMANDS';
    addBtn('⛏️', 'Select', '', () => {
      const p = units.find((u) => !u.dead && u.faction === 'player' && u.ukind === 'peasant');
      if (p) { clearSelection(); selectEnt(p, false); cam.tx = p.x; cam.tz = p.z; }
    });
    addBtn('🏠', 'Town Hall', '', () => focusBuilding('town'));
    addBtn('⚔️', 'Barracks', '', () => focusBuilding('barracks'));
    addBtn('❓', 'Help', '', () => toast('Right-click mine/tree to gather. Build army, destroy Orc Town Hall!'));
    return;
  }
  if (sel.length > 1) {
    $('unitName').textContent = `${sel.length} units selected`;
    $('unitDesc').textContent = 'Right-click to move / attack. A = attack-move, S = stop, H = hold.';
    $('portrait').textContent = '🛡️';
    addBtn('⚔️', 'Attack', 'A', () => { attackMoveMode = true; canvas.style.cursor = 'crosshair'; });
    addBtn('✋', 'Stop', 'S', () => playerUnits().forEach((u) => issueOrder(u, { type: 'idle' })));
    addBtn('🛡️', 'Hold', 'H', () => playerUnits().forEach((u) => issueOrder(u, { type: 'hold' })));
    return;
  }
  const e = one;
  if (e.kind === 'unit') {
    $('unitName').textContent = `${e.def.icon} ${e.def.name}`;
    $('unitDesc').textContent = e.def.desc + ` HP ${Math.ceil(e.hp)}/${e.maxHp} · DMG ${e.def.dmg}`;
    $('portrait').textContent = e.def.icon;
    $('hpBar').style.width = (100 * e.hp / e.maxHp) + '%';
    $('cmdTitle').textContent = `${e.def.name.toUpperCase()} — COMMANDS`;
    addBtn('⚔️', 'Attack', 'A', () => { attackMoveMode = true; canvas.style.cursor = 'crosshair'; }, true, 'Attack-move (A)');
    addBtn('✋', 'Stop', 'S', () => issueOrder(e, { type: 'idle' }));
    addBtn('🛡️', 'Hold', 'H', () => issueOrder(e, { type: 'hold' }));
    if (e.ukind === 'peasant') {
      addBtn('🗼', 'Tower', '120g 80w', () => startBuildMode());
      const q = e.order.type === 'gather' ? `Carrying ${e.carryN || 0}` : e.order.type;
      addBtn('⛏️', 'Gather', q, () => toast('Right-click a gold mine or tree!'), false);
    } else {
      addBtn('🗡️', 'Focus', '', () => toast('Right-click an enemy to focus it!'), false);
    }
  } else if (e.kind === 'building') {
    const q = e.queue.map((x) => UNIT_DEFS[x.key].icon).join(' ');
    $('unitName').textContent = `${e.faction === 'player' ? '🏰' : '🛖'} ${e.def.name}`;
    $('unitDesc').textContent = `HP ${Math.ceil(e.hp)}/${e.maxHp}${q ? ` · Queue: ${q}` : ''}`;
    $('portrait').textContent = e.btype === 'town' ? '🏰' : e.btype === 'barracks' ? '⚔️' : '🗼';
    $('hpBar').style.width = (100 * e.hp / e.maxHp) + '%';
    $('cmdTitle').textContent = `${e.def.name.toUpperCase()} — TRAIN`;
    if (e.faction !== 'player') { addBtn('⚔️', 'Attack!', '', () => { for (const u of units.filter((u) => !u.dead && u.faction === 'player' && u.kind === 'unit')) issueOrder(u, { type: 'attack', target: e }); }); return; }
    if (e.btype === 'town') {
      addBtn('🧑‍🌾', 'Peasant', '75g', () => tryTrain(e, 'peasant'));
      addBtn('✋', 'Stop', '', () => playerUnits().forEach((u) => issueOrder(u, { type: 'idle' })));
    } else if (e.btype === 'barracks') {
      addBtn('🗡️', 'Footman', '150g 40w', () => tryTrain(e, 'footman'));
      addBtn('🏹', 'Archer', '130g 60w', () => tryTrain(e, 'archer'));
    } else {
      addBtn('🗼', 'Tower', 'defends', () => toast('Tower auto-attacks enemies in range!'), false);
    }
    if (e.queue.length) addBtn('❌', 'Cancel', e.queue[0].key, () => {
      const c = e.queue.shift();
      state.gold += UNIT_DEFS[c.key].cost.g; state.wood += UNIT_DEFS[c.key].cost.w;
      refreshUI();
    });
  } else {
    $('unitName').textContent = e.rtype === 'gold' ? '⛏️ Gold Mine' : '🌲 Tree';
    $('unitDesc').textContent = `${Math.ceil(e.amount)} remaining. Select a Peasant, right-click to gather.`;
    $('portrait').textContent = e.rtype === 'gold' ? '🪙' : '🌲';
  }
}
function focusBuilding(type) {
  const b = buildings.find((b) => !b.dead && b.faction === 'player' && b.btype === type);
  if (b) { clearSelection(); selectEnt(b, false); cam.tx = b.x; cam.tz = b.z; SFX.select(); }
}

/* ---------------- End / start ---------------- */
function endGame(win, text) {
  if (state.over) return;
  state.over = true; state.win = win;
  $('endTitle').textContent = win ? '🏆 VICTORY!' : '💀 DEFEAT';
  $('endTitle').className = win ? 'win' : 'lose';
  $('endText').textContent = text + `  (Time ${Math.floor(state.time / 60)}:${String(Math.floor(state.time % 60)).padStart(2, '0')} · Waves survived: ${state.waveNum})`;
  $('endOverlay').style.display = 'flex';
  win ? SFX.win() : SFX.lose();
}
$('playBtn').onclick = () => {
  audio(); if (AC && AC.state === 'suspended') AC.resume();
  $('startOverlay').style.display = 'none';
  state.started = true;
  toast('★ For the Alliance! Gather, train, destroy the Orc Town Hall!', 3500);
  SFX.horn();
};
$('restartBtn').onclick = () => location.reload();

/* ---------------- Per-frame updates ---------------- */
function blockedAt(x, z, self) {
  if (Math.abs(x) > MAP_HALF || Math.abs(z) > MAP_HALF) return true;
  if (dist2(x, z, lake.x, lake.z) < lake.r + 0.6) return true;
  for (const b of buildings) {
    if (b.dead || b === self) continue;
    if (dist2(x, z, b.x, b.z) < b.radius + 0.5) return true;
  }
  return false;
}
// nearest walkable spot (spiral search) so orders never target inside colliders
function findClear(x, z) {
  x = clamp(x, -MAP_HALF, MAP_HALF); z = clamp(z, -MAP_HALF, MAP_HALF);
  if (!blockedAt(x, z)) return { x, z };
  for (let r = 1; r < 12; r += 0.8) {
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      const nx = clamp(x + Math.cos(a) * r, -MAP_HALF, MAP_HALF);
      const nz = clamp(z + Math.sin(a) * r, -MAP_HALF, MAP_HALF);
      if (!blockedAt(nx, nz)) return { x: nx, z: nz };
    }
  }
  return { x, z };
}
function moveUnit(u, dt) {
  const dx = u.tx - u.x, dz = u.tz - u.z;
  const d = Math.hypot(dx, dz);
  if (d < 0.35) return true;
  let vx = (dx / d) * u.speed, vz = (dz / d) * u.speed;
  // separation
  for (const o of units) {
    if (o === u || o.dead) continue;
    const ox = u.x - o.x, oz = u.z - o.z;
    const od = Math.hypot(ox, oz);
    if (od > 0.01 && od < 1.4) { vx += (ox / od) * 3.2; vz += (oz / od) * 3.2; }
  }
  // obstacle sliding: try direct heading, then angled alternatives
  const sp = Math.hypot(vx, vz) || u.speed;
  const base = Math.atan2(vx, vz);
  const step = sp * dt;
  let moved = false;
  for (const off of [0, 0.5, -0.5, 1.0, -1.0, 1.6, -1.6, Math.PI]) {
    const a = base + off;
    const nx = u.x + Math.sin(a) * step, nz = u.z + Math.cos(a) * step;
    if (!blockedAt(nx, nz, null)) {
      u.x = nx; u.z = nz;
      u.angle = a;
      u.swing += dt * 10;
      moved = true;
      break;
    }
  }
  if (!moved) return false; // stuck against obstacle: keep trying, don't finish order
  return Math.hypot(u.tx - u.x, u.tz - u.z) < 0.5;
}
function updateUnitVisual(u, dt, moving) {
  u.mesh.position.set(u.x, moving ? Math.abs(Math.sin(u.swing)) * 0.12 : 0, u.z);
  u.mesh.rotation.y = u.angle;
  u.bar.quaternion.copy(camera.quaternion);
  u.bar.userData.set(u.hp / u.maxHp);
  u.bar.visible = u.hp < u.maxHp;
  if (u.mesh.userData.armR) u.mesh.userData.armR.rotation.x = moving ? Math.sin(u.swing) * 0.7 : Math.sin(state.time * 2 + u.bob) * 0.06;
  if (u.mesh.userData.sack) u.mesh.userData.sack.visible = !!u.carry;
}
function updateUnit(u, dt) {
  u.cooldown -= dt;
  const o = u.order;
  // hold: don't move, attack in range
  if (o.type === 'hold') {
    const t = nearestEnemy(u.x, u.z, u.faction, u.def.range + 0.6);
    if (t && u.cooldown <= 0) strike(u, t);
    updateUnitVisual(u, dt, false);
    return;
  }
  if (o.type === 'idle') {
    // peasants continue nothing; soldiers guard: engage nearby
    if (u.ukind !== 'peasant' && u.ukind !== 'peon') {
      const t = nearestEnemy(u.x, u.z, u.faction, 8);
      if (t) { u.order = { type: 'attack', target: t }; u.target = t; }
    }
    updateUnitVisual(u, dt, false);
    return;
  }
  if (o.type === 'move') {
    const arrived = moveUnit(u, dt);
    if (arrived) u.order = { type: 'idle' };
    else { const t = (u.ukind !== 'peasant' && u.ukind !== 'peon') ? nearestEnemy(u.x, u.z, u.faction, 5) : null; if (t) { u.order = { type: 'attack', target: t }; } }
    updateUnitVisual(u, dt, !arrived);
    return;
  }
  if (o.type === 'attackmove') {
    const t = nearestEnemy(u.x, u.z, u.faction, 9);
    if (t) { u.order = { type: 'attack', target: t }; updateUnitVisual(u, dt, false); return; }
    const arrived = moveUnit(u, dt);
    if (arrived) u.order = { type: 'idle' };
    updateUnitVisual(u, dt, !arrived);
    return;
  }
  if (o.type === 'attack') {
    const t = o.target;
    if (!t || t.dead) { u.order = { type: 'idle' }; u.target = null; updateUnitVisual(u, dt, false); return; }
    const tp = t.kind === 'building' ? t.radius + u.def.range * 0.6 : u.def.range;
    const d = dist2(u.x, u.z, t.x, t.z) - (t.kind === 'building' ? t.radius : 0);
    if (d <= tp) {
      if (u.cooldown <= 0) strike(u, t);
      u.angle = Math.atan2(t.x - u.x, t.z - u.z);
      updateUnitVisual(u, dt, false);
    } else {
      u.tx = t.x; u.tz = t.z;
      moveUnit(u, dt);
      updateUnitVisual(u, dt, true);
    }
    return;
  }
  if (o.type === 'gather') {
    updateGatherer(u, dt);
    return;
  }
  if (o.type === 'build') {
    updateBuilder(u, dt);
    return;
  }
  updateUnitVisual(u, dt, false);
}
function strike(u, t) {
  u.cooldown = u.def.cd;
  u.angle = Math.atan2(t.x - u.x, t.z - u.z);
  const isRanged = u.def.range > 5;
  if (isRanged) fireArrow(u, t, u.def.dmg, u.faction);
  else {
    SFX.sword();
    burst(t.x, 1.2, t.z, 0xffe9a8, 5);
    dealDamage(t, u.def.dmg * rand(0.9, 1.1));
  }
}
function updateGatherer(u, dt) {
  const res = u.resTarget;
  if (u.carry) {
    // return home: walk to the hall side facing the peasant (always reachable)
    if (!u.home || u.home.dead) u.home = nearestHall(u.faction, u.x, u.z);
    if (!u.home) { u.carry = null; u.order = { type: 'idle' }; updateUnitVisual(u, dt, false); return; }
    const hx = u.home.x, hz = u.home.z;
    let dx = u.x - hx, dz = u.z - hz;
    let dd = Math.hypot(dx, dz);
    if (dd < 0.01) { dx = 1; dz = 0; dd = 1; }
    const stand = u.home.radius + 1.1;
    u.tx = hx + (dx / dd) * stand; u.tz = hz + (dz / dd) * stand;
    if (dist2(u.x, u.z, u.tx, u.tz) < 2.2) {
      if (u.faction === 'player') { state.gold += u.carry === 'gold' ? u.carryN : 0; state.wood += u.carry === 'wood' ? u.carryN : 0; SFX.coin(); }
      else { state.eGold += u.carry === 'gold' ? u.carryN : 0; state.eWood += u.carry === 'wood' ? u.carryN : 0; }
      u.carry = null; u.carryN = 0;
      if (res && !res.dead && res.amount > 0) u.phase = 'toRes';
      else { u.order = { type: 'idle' }; }
      throttledUI();
    } else { moveUnit(u, dt); updateUnitVisual(u, dt, true); }
    return;
  }
  if (!res || res.dead || res.amount <= 0) {
    // find another nearby resource of same type
    let best = null, bd = 1e9;
    for (const r of resources) {
      if (r.dead || r.amount <= 0) continue;
      if (res && r.rtype !== res.rtype) continue;
      const d = dist2(u.x, u.z, r.x, r.z);
      if (d < bd) { bd = d; best = r; }
    }
    if (best) u.resTarget = best;
    else { u.order = { type: 'idle' }; updateUnitVisual(u, dt, false); return; }
    return;
  }
  const rr = u.resTarget.radius + 1.2;
  if (dist2(u.x, u.z, u.resTarget.x, u.resTarget.z) > rr) {
    u.tx = u.resTarget.x; u.tz = u.resTarget.z;
    moveUnit(u, dt); updateUnitVisual(u, dt, true);
    return;
  }
  // harvesting
  u.harvestT += dt;
  u.angle = Math.atan2(u.resTarget.x - u.x, u.resTarget.z - u.z);
  if (u.mesh.userData.armR) u.mesh.userData.armR.rotation.x = Math.sin(state.time * 9) * 1.0;
  u.bar.quaternion.copy(camera.quaternion);
  if (u.harvestT > (u.resTarget.rtype === 'gold' ? 2.2 : 1.6)) {
    u.harvestT = 0;
    const take = Math.min(25, u.resTarget.amount);
    u.resTarget.amount -= take;
    u.carry = u.resTarget.rtype; u.carryN = take;
    u.faction === 'player' ? SFX.chop() : null;
    if (u.resTarget.amount <= 0) {
      u.resTarget.dead = true;
      if (u.resTarget.rtype === 'wood') {
        burst(u.resTarget.x, 1, u.resTarget.z, 0x3f8a34, 16);
        scene.remove(u.resTarget.mesh);
        const i = resources.indexOf(u.resTarget); if (i >= 0) resources.splice(i, 1);
        toast('🌲 Tree harvested!');
      } else { toast('★ Gold mine exhausted!'); }
    } else if (u.resTarget.rtype === 'wood') {
      u.resTarget.mesh.scale.multiplyScalar(0.985);
    }
  }
}
function updateBuilder(u, dt) {
  const s = u.buildTarget;
  if (!s) { u.order = { type: 'idle' }; return; }
  if (dist2(u.x, u.z, s.x, s.z) > 3) {
    u.tx = s.x; u.tz = s.z;
    moveUnit(u, dt); updateUnitVisual(u, dt, true);
    return;
  }
  s.progress += dt;
  u.angle += dt * 2;
  if (u.mesh.userData.armR) u.mesh.userData.armR.rotation.x = Math.sin(state.time * 9) * 1.0;
  u.bar.quaternion.copy(camera.quaternion);
  if (Math.floor(s.progress * 4) !== Math.floor((s.progress - dt) * 4)) burst(s.x + rand(-1, 1), 0.5, s.z + rand(-1, 1), 0xcbb26a, 3);
  if (s.progress >= s.total) {
    spawnBuilding('tower', 'player', s.x, s.z);
    u.order = { type: 'idle' }; u.buildTarget = null;
    toast('🗼 Guard Tower complete!'); SFX.train();
    refreshUI();
  }
  updateUnitVisual(u, dt, false);
}
function updateBuilding(b, dt) {
  b.bar.quaternion.copy(camera.quaternion);
  b.bar.userData.set(b.hp / b.maxHp);
  b.bar.visible = b.hp < b.maxHp;
  if (b.mesh.userData.flag) b.mesh.userData.flag.rotation.y = Math.sin(state.time * 2) * 0.3;
  // training queue
  if (b.queue.length) {
    b.qTime += dt;
    const cur = b.queue[0];
    if (b.qTime >= cur.total) {
      b.qTime = 0; b.queue.shift();
      const sx = b.rally.x + rand(-1.5, 1.5), sz = b.rally.z + rand(-1.5, 1.5);
      const u = spawnUnit(cur.key, b.faction, clamp(sx, -MAP_HALF, MAP_HALF), clamp(sz, -MAP_HALF, MAP_HALF));
      u.order = { type: 'move', x: u.x + (b.faction === 'player' ? 3 : -3), z: u.z + 2 };
      burst(u.x, 1, u.z, 0xffe9a8, 12);
      if (b.faction === 'player') { toast(`${UNIT_DEFS[cur.key].icon} ${UNIT_DEFS[cur.key].name} ready!`); SFX.train(); }
      refreshUI();
    }
    if (b.faction === 'player' && selected.has(b)) refreshDescOnly(b);
  }
  // tower defense
  if (b.btype === 'tower') {
    b.cooldown -= dt;
    if (b.cooldown <= 0) {
      const t = nearestEnemy(b.x, b.z, b.faction, b.def.range);
      if (t) { b.cooldown = b.def.cd; fireArrow({ x: b.x, z: b.z }, t, b.def.dmg, b.faction); }
      else b.cooldown = 0.2;
    }
  }
}
function refreshDescOnly(b) {
  const q = b.queue.map((x) => UNIT_DEFS[x.key].icon).join(' ');
  $('unitDesc').textContent = `HP ${Math.ceil(b.hp)}/${b.maxHp}${q ? ` · Queue: ${q}` : ''}`;
}
function updateProjectiles(dt) {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    if (!p.target || p.target.dead) { scene.remove(p.mesh); projectiles.splice(i, 1); continue; }
    p.t += dt;
    const dx = p.target.x - p.mesh.position.x, dz = p.target.z - p.mesh.position.z;
    const d = Math.hypot(dx, dz);
    const step = p.speed * dt;
    if (d < Math.max(0.9, step)) {
      dealDamage(p.target, p.dmg * rand(0.9, 1.1));
      burst(p.target.x, 1.2, p.target.z, 0xffd76a, 4);
      scene.remove(p.mesh); projectiles.splice(i, 1);
    } else {
      p.mesh.position.x += (dx / d) * step;
      p.mesh.position.z += (dz / d) * step;
      p.mesh.position.y = 1.6 + Math.sin(p.t * 10) * 0.15;
      p.mesh.rotation.y = Math.atan2(dx, dz);
    }
    if (p.t > 4) { scene.remove(p.mesh); projectiles.splice(i, 1); }
  }
}
function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= dt;
    if (p.life <= 0) { scene.remove(p.mesh); particles.splice(i, 1); continue; }
    if (p.vel) { p.mesh.position.addScaledVector(p.vel, dt); p.vel.y -= 12 * dt; }
    if (p.grow) { p.mesh.scale.addScalar(p.grow * dt); }
    if (p.fade) {
      const f = p.life / p.maxLife;
      if (p.mesh.material) { p.mesh.material.transparent = true; p.mesh.material.opacity = f; }
    }
  }
}

/* ---------------- Enemy AI ---------------- */
function enemyAI(dt) {
  // trickle income
  state.trickleT += dt;
  if (state.trickleT > 1) { state.trickleT = 0; state.eGold += 4; state.eWood += 2; }
  // peons gather nearest gold automatically
  for (const u of units) {
    if (u.dead || u.faction !== 'enemy' || u.ukind !== 'peon') continue;
    if (u.order.type === 'idle' && !u.carry) {
      const mine = resources.filter((r) => !r.dead && r.rtype === 'gold' && r.amount > 0)
        .sort((a, b) => dist2(u.x, u.z, a.x, a.z) - dist2(u.x, u.z, b.x, b.z))[0];
      if (mine && dist2(u.x, u.z, mine.x, mine.z) < 30) u.order = { type: 'gather', res: mine };
    }
  }
  // train defenders
  state.eTrainT -= dt;
  if (state.eTrainT <= 0) {
    state.eTrainT = 26;
    const rax = buildings.find((b) => !b.dead && b.faction === 'enemy' && b.btype === 'barracks');
    const counts = { grunt: 0, troll: 0 };
    for (const u of units) if (!u.dead && u.faction === 'enemy') counts[u.ukind] = (counts[u.ukind] || 0) + 1;
    if (rax && rax.queue.length < 3) {
      const wantTroll = (counts.troll || 0) < (counts.grunt || 0) / 2;
      tryTrain(rax, wantTroll ? 'troll' : 'grunt');
    }
    const town = buildings.find((b) => !b.dead && b.faction === 'enemy' && b.btype === 'town');
    if (town) {
      const peons = units.filter((u) => !u.dead && u.faction === 'enemy' && u.ukind === 'peon').length;
      if (peons < 5) tryTrain(town, 'peon');
    }
  }
  // waves
  state.waveT -= dt;
  if (state.waveT <= 0) {
    state.waveT = state.waveInterval;
    state.waveNum++;
    state.waveInterval = Math.max(45, 65 - state.waveNum * 2);
    launchWave();
  }
  $('waveInfo').textContent = state.over ? (state.win ? '🏆 Victory!' : '💀 Defeat') : `🌊 Wave ${state.waveNum + 1} in ${Math.ceil(state.waveT)}s`;
}
function launchWave() {
  const n = 2 + Math.min(5, state.waveNum);
  const pHall = buildings.find((b) => !b.dead && b.faction === 'player' && b.btype === 'town');
  if (!pHall) return;
  toast(`🌊 Orc wave ${state.waveNum} attacks! (${n} raiders)`, 3000);
  SFX.horn();
  for (let i = 0; i < n; i++) {
    const kind = i % 3 === 2 ? 'troll' : 'grunt';
    const u = spawnUnit(kind, 'enemy', E_BASE.x + rand(-6, 6), E_BASE.z + rand(-6, 6));
    u.order = { type: 'attack', target: Math.random() < 0.7 && pHall ? pHall : null };
    if (!u.order.target) u.order = { type: 'attackmove', x: pHall.x + rand(-4, 4), z: pHall.z + rand(-4, 4) };
  }
}

/* ---------------- Minimap + HUD throttle ---------------- */
let mmT = 0, uiT = 0, lastSelKey = '';
function throttledUI() { uiT = 1; }
function selKey() { return [...selected].filter((e) => !e.dead).map((e) => e.id).join(','); }
function drawMinimap() {
  const W = 160, H = 148;
  mm.fillStyle = '#3d5c2c'; mm.fillRect(0, 0, W, H);
  const sx = (x) => ((x + 48) / 96) * W, sz = (z) => ((z + 48) / 96) * H;
  mm.fillStyle = '#2f7fc4';
  mm.beginPath(); mm.arc(sx(lake.x), sz(lake.z), (lake.r / 96) * W, 0, 7); mm.fill();
  for (const r of resources) {
    if (r.dead || r.amount <= 0) continue;
    mm.fillStyle = r.rtype === 'gold' ? '#ffd76a' : '#1d3d1a';
    mm.fillRect(sx(r.x) - 2, sz(r.z) - 2, 4, 4);
  }
  for (const b of buildings) {
    if (b.dead) continue;
    mm.fillStyle = b.faction === 'player' ? '#3b8bff' : '#ff4b3e';
    mm.fillRect(sx(b.x) - 3, sz(b.z) - 3, 6, 6);
  }
  for (const u of units) {
    if (u.dead) continue;
    mm.fillStyle = u.faction === 'player' ? '#bcdcff' : '#ffb3ab';
    mm.fillRect(sx(u.x) - 1, sz(u.z) - 1, 2.5, 2.5);
  }
  // camera rect
  mm.strokeStyle = '#fff'; mm.lineWidth = 1;
  mm.strokeRect(sx(cam.tx) - 14, sz(cam.tz) - 10, 28, 20);
}

/* ---------------- Main loop ---------------- */
const clock = new THREE.Clock();
let firstFrame = true;
function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), 0.05);
  if (state.started && !state.over) {
    state.time += dt;
    updateCameraControl(dt);
    for (let i = units.length - 1; i >= 0; i--) { const u = units[i]; if (!u.dead) updateUnit(u, dt); }
    for (const b of buildings) if (!b.dead) updateBuilding(b, dt);
    updateProjectiles(dt);
    enemyAI(dt);
    // clouds drift
    for (const c of clouds) { c.m.position.x += c.v * dt; if (c.m.position.x > 70) c.m.position.x = -70; }
    mmT += dt; uiT += dt;
    if (mmT > 0.3) { mmT = 0; drawMinimap(); }
    if (uiT > 0.4) {
      uiT = 0;
      $('gold').textContent = Math.floor(state.gold);
      $('wood').textContent = Math.floor(state.wood);
      $('food').textContent = `${supplyUsed('player')}/${SUPPLY_CAP}`;
      $('army').textContent = units.filter((u) => !u.dead && u.faction === 'player' && u.ukind !== 'peasant').length;
      const sk = selKey();
      if (sk !== lastSelKey) { lastSelKey = sk; refreshUI(); }
      const sel = [...selected].filter((e) => !e.dead);
      if (sel.length === 1) {
        const e = sel[0];
        $('hpBar').style.width = (100 * e.hp / e.maxHp) + '%';
        if (e.kind === 'unit') $('unitDesc').textContent = e.def.desc + ` HP ${Math.ceil(e.hp)}/${e.maxHp} · DMG ${e.def.dmg}`;
      }
    }
  } else {
    // idle cinematic: slow orbit before start
    if (!state.started) {
      cam.yaw += dt * 0.06;
      cam.tx += ((-14) - cam.tx) * dt; cam.tz += (14 - cam.tz) * dt;
      updateCamera();
      for (const c of clouds) { c.m.position.x += c.v * dt; if (c.m.position.x > 70) c.m.position.x = -70; }
    }
    updateParticles(dt);
  }
  updateParticles(dt);
  renderer.render(scene, camera);
  if (firstFrame) {
    firstFrame = false;
    $('loading').style.display = 'none';
    drawMinimap();
    refreshUI();
  }
}
updateCameraControl(0.016);
loop();

// auto-select starting peasants for instant readability
{
  const p = units.find((u) => u.faction === 'player' && u.ukind === 'peasant');
  if (p) { selected.add(p); p.ring.visible = true; }
}

// lightweight handle for automated smoke tests (no gameplay effect)
window.__wc = {
  state, units, buildings, resources, selected,
  tryTrain, spawnUnit, dealDamage, launchWave,
  issueOrder, moveUnit, blockedAt, findClear,
  look(x, z, dist) { cam.tx = x; cam.tz = z; if (dist) cam.dist = dist; },
  start() { $('playBtn').click(); },
  counts() {
    return {
      started: state.started, over: state.over, win: state.win,
      gold: Math.floor(state.gold), wood: Math.floor(state.wood),
      pUnits: units.filter((u) => !u.dead && u.faction === 'player').length,
      eUnits: units.filter((u) => !u.dead && u.faction === 'enemy').length,
      pB: buildings.filter((b) => !b.dead && b.faction === 'player').length,
      eB: buildings.filter((b) => !b.dead && b.faction === 'enemy').length,
      time: state.time, wave: state.waveNum,
    };
  },
};
