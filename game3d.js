import * as THREE from './vendor/three.module.js';

// 3D Nexus Wars tug-of-war: Blue (you, left) vs Red AI (right). No dependencies besides vendored three.
const canvas = document.getElementById('battle3d');
const statusEl = document.getElementById('battle-status');
const blueHpEl = document.getElementById('hp-blue');
const redHpEl = document.getElementById('hp-red');
const minEl = document.getElementById('g-minerals');
const incEl = document.getElementById('g-income');
const supEl = document.getElementById('g-supply');
const waveEl = document.getElementById('g-wave');
const msgEl = document.getElementById('g-msg');
const overlay = document.getElementById('g-overlay');
const overlayText = document.getElementById('g-overlay-text');

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
} catch (e) {
  statusEl.textContent = 'WebGL unavailable in this browser.';
  throw e;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070b18);
scene.fog = new THREE.Fog(0x070b18, 70, 140);

const camera = new THREE.PerspectiveCamera(50, 2, 0.1, 300);
// custom orbit (no addons, keeps vendor to one file)
const orbit = { theta: -Math.PI / 2, phi: 0.98, radius: 44, target: new THREE.Vector3(0, 0, 0) };
function applyCamera() {
  const { theta, phi, radius, target } = orbit;
  camera.position.set(
    target.x + radius * Math.sin(phi) * Math.cos(theta),
    target.y + radius * Math.cos(phi),
    target.z + radius * Math.sin(phi) * Math.sin(theta)
  );
  camera.lookAt(target);
}
let dragging = false, px = 0, py = 0;
canvas.addEventListener('pointerdown', (e) => { dragging = true; px = e.clientX; py = e.clientY; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  orbit.theta -= (e.clientX - px) * 0.005;
  orbit.phi = Math.min(1.35, Math.max(0.35, orbit.phi - (e.clientY - py) * 0.004));
  px = e.clientX; py = e.clientY;
});
canvas.addEventListener('pointerup', () => { dragging = false; });
canvas.addEventListener('wheel', (e) => { e.preventDefault(); orbit.radius = Math.min(90, Math.max(25, orbit.radius + e.deltaY * 0.03)); }, { passive: false });

scene.add(new THREE.HemisphereLight(0x8fb4ff, 0x0a0d20, 0.9));
const sun = new THREE.DirectionalLight(0xffffff, 1.1);
sun.position.set(20, 40, 10);
scene.add(sun);

const ARENA_X = 28, LANES = [-7, 7];
function resize() {
  const w = canvas.clientWidth || 640, h = canvas.clientHeight || 360;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);

// --- map ---
{
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(90, 44),
    new THREE.MeshStandardMaterial({ color: 0x0d1430, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
  const grid = new THREE.GridHelper(90, 45, 0x24305e, 0x18224d);
  grid.position.y = 0.02;
  scene.add(grid);
  for (const z of LANES) {
    const lane = new THREE.Mesh(
      new THREE.PlaneGeometry(70, 4.6),
      new THREE.MeshBasicMaterial({ color: 0x1b2560, transparent: true, opacity: 0.55 })
    );
    lane.rotation.x = -Math.PI / 2;
    lane.position.set(0, 0.03, z);
    scene.add(lane);
  }
  const mid = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 40),
    new THREE.MeshBasicMaterial({ color: 0xffd257, transparent: true, opacity: 0.25 })
  );
  mid.rotation.x = -Math.PI / 2;
  mid.position.y = 0.03;
  scene.add(mid);
  const mkBase = (x, color) => {
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(6, 7, 1, 24),
      new THREE.MeshStandardMaterial({ color, roughness: 0.8 })
    );
    base.position.set(x, 0.5, 0);
    scene.add(base);
  };
  mkBase(-ARENA_X, 0x123a6b);
  mkBase(ARENA_X, 0x6b1212);
}

function makeNexus(x, crystalColor) {
  const g = new THREE.Group();
  const ped = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 2.8, 2, 8),
    new THREE.MeshStandardMaterial({ color: 0x1c2757, roughness: 0.6, metalness: 0.3 })
  );
  ped.position.y = 1;
  g.add(ped);
  const cry = new THREE.Mesh(
    new THREE.OctahedronGeometry(2.2),
    new THREE.MeshStandardMaterial({ color: crystalColor, emissive: crystalColor, emissiveIntensity: 0.7, roughness: 0.2 })
  );
  cry.position.y = 4.2;
  g.add(cry);
  const light = new THREE.PointLight(crystalColor, 30, 25);
  light.position.y = 5;
  g.add(light);
  g.position.x = x;
  scene.add(g);
  return { group: g, crystal: cry, hp: 1000, maxHp: 1000 };
}
const blueNexus = makeNexus(-ARENA_X, 0x3ea6ff);
const redNexus = makeNexus(ARENA_X, 0xff5d5d);

// --- units ---
const TYPES = {
  zealot: { cost: 50, hp: 130, dmg: 12, range: 3.0, speed: 5.0, cd: 0.9, supply: 2, bounty: 10 },
  tank: { cost: 140, hp: 300, dmg: 34, range: 7.5, speed: 2.7, cd: 1.6, supply: 4, bounty: 22 },
  ling: { cost: 30, hp: 55, dmg: 7, range: 1.8, speed: 7.0, cd: 0.6, supply: 1, bounty: 5 },
};
const GEO = {
  zealot: new THREE.OctahedronGeometry(1.0),
  tank: new THREE.BoxGeometry(2.0, 1.1, 1.4),
  ling: new THREE.TetrahedronGeometry(0.85),
};
const MAT = {
  blue: {
    zealot: new THREE.MeshStandardMaterial({ color: 0x3ea6ff, emissive: 0x1a5fb0, emissiveIntensity: 0.8 }),
    tank: new THREE.MeshStandardMaterial({ color: 0x7cc4ff, roughness: 0.4, metalness: 0.5 }),
    ling: new THREE.MeshStandardMaterial({ color: 0x27e0c8, emissive: 0x0b6b5e, emissiveIntensity: 0.7 }),
  },
  red: {
    zealot: new THREE.MeshStandardMaterial({ color: 0xff5d5d, emissive: 0xa01a1a, emissiveIntensity: 0.8 }),
    tank: new THREE.MeshStandardMaterial({ color: 0xff9a6b, roughness: 0.4, metalness: 0.5 }),
    ling: new THREE.MeshStandardMaterial({ color: 0xffb03a, emissive: 0x7a3a00, emissiveIntensity: 0.7 }),
  },
  boltBlue: new THREE.MeshBasicMaterial({ color: 0x9adcff }),
  boltRed: new THREE.MeshBasicMaterial({ color: 0xffb09a }),
};
const BOLT_GEO = new THREE.SphereGeometry(0.16, 6, 6);

const units = [];
const bolts = [];
const flashes = [];
let minerals = 220, pylons = 0, spawners = 0, supply = 0, kills = 0;
let queue = [];
let aiQueue = [];
let waveT = 8, incomeT = 10, aiT = 6, elapsed = 0, over = false;
let playerNuke = 1, aiNuke = 1, aiIncome = 14;

function incomePerTick() { return 10 + pylons * 8 + spawners * 2; }
function supplyUsed(list) { return list.reduce((s, u) => s + TYPES[u.type].supply, 0); }

function spawnUnit(side, type, lane) {
  const t = TYPES[type];
  const mesh = new THREE.Mesh(GEO[type], MAT[side][type]);
  const dir = side === 'blue' ? 1 : -1;
  mesh.position.set(side === 'blue' ? -ARENA_X + 4 : ARENA_X - 4, 0.8, lane + (Math.random() - 0.5) * 2.4);
  scene.add(mesh);
  units.push({ side, type, mesh, hp: t.hp, maxHp: t.hp, lane, dir, cd: Math.random() * 0.5, flash: null });
}
function spawnBolt(from, target) {
  const m = new THREE.Mesh(BOLT_GEO, from.side === 'blue' ? MAT.boltBlue : MAT.boltRed);
  m.position.copy(from.mesh.position);
  scene.add(m);
  bolts.push({ mesh: m, target, dmg: TYPES[from.type].dmg, side: from.side, life: 1.2 });
}
function boom(pos, color, size = 1) {
  const m = new THREE.Mesh(
    new THREE.SphereGeometry(0.6 * size, 10, 10),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 })
  );
  m.position.copy(pos);
  scene.add(m);
  flashes.push({ mesh: m, life: 0.4 });
}
// pylon visuals: stacked pylons behind blue base
const pylonGroup = new THREE.Group();
pylonGroup.position.set(-ARENA_X - 1, 0, -11);
scene.add(pylonGroup);
const PYLON_GEO = new THREE.OctahedronGeometry(0.9);
const PYLON_MAT = new THREE.MeshStandardMaterial({ color: 0xffd257, emissive: 0x8a6a00, emissiveIntensity: 0.9 });
function renderPylons() {
  while (pylonGroup.children.length) scene.remove(pylonGroup.children.pop());
  for (let i = 0; i < pylons; i++) {
    const m = new THREE.Mesh(PYLON_GEO, PYLON_MAT);
    m.position.set((i % 4) * 1.8, 0.9 + Math.floor(i / 4) * 1.8, 0);
    pylonGroup.add(m);
  }
}

function buy(kind) {
  if (over) return;
  if (kind === 'pylon') {
    if (pylons >= 8) return say('Max 8 pylons');
    if (minerals < 175) return say('Need 175 minerals for pylon');
    minerals -= 175; pylons++; renderPylons(); say(`Pylon ${pylons}/8 (+8 income)`);
    return;
  }
  if (kind === 'nuke') return fireNuke('blue');
  const t = TYPES[kind];
  const n = kind === 'ling' ? 3 : 1;
  const cost = kind === 'ling' ? 90 : t.cost;
  if (minerals < cost) return say(`Need ${cost} minerals`);
  if (supply + (kind === 'ling' ? 3 : t.supply) > 90) return say('Supply capped (90)');
  minerals -= cost;
  spawners += kind === 'ling' ? 2 : 1;
  supply += kind === 'ling' ? 3 : t.supply;
  for (let i = 0; i < n; i++) queue.push({ type: kind, lane: LANES[Math.floor(Math.random() * 2)] });
  say(`${kind} queued — spawns in wave (${Math.ceil(waveT)}s)`);
}
function say(s) { msgEl.textContent = s; }

function fireNuke(side) {
  if (over) return;
  if (side === 'blue') {
    if (!playerNuke) return say('Nuke already used');
    playerNuke = 0;
    document.getElementById('btn-nuke').disabled = true;
  } else {
    if (!aiNuke) return;
    aiNuke = 0;
  }
  boom(new THREE.Vector3(0, 2, 0), 0xffffff, 8);
  boom(new THREE.Vector3(0, 1, 0), 0xffd257, 5);
  for (const u of units) {
    if (Math.abs(u.mesh.position.x) < 16) { u.hp = 0; boom(u.mesh.position, 0xff8844, 1.4); }
  }
  say(side === 'blue' ? '☢ Nuke fired!' : '☢ Enemy nuked your push!');
}

function aiThink() {
  // counter-ish: mirror player mix + randomness, scaling income
  aiIncome = 14 + Math.floor(elapsed / 45) * 4;
  const opts = ['zealot', 'tank', 'ling', 'zealot', 'tank', 'ling'];
  const pick = opts[Math.floor(Math.random() * opts.length)];
  const n = pick === 'ling' ? 3 : pick === 'tank' ? 1 : 2;
  if (supplyUsed(units.filter((u) => u.side === 'red')) < 88) {
    for (let i = 0; i < n; i++) aiQueue.push({ type: pick, lane: LANES[Math.floor(Math.random() * 2)] });
  }
  if (aiNuke && blueNexus.hp < blueNexus.maxHp * 0.5 && units.some((u) => u.side === 'blue' && u.mesh.position.x > 8)) fireNuke('red');
}

function updateHud() {
  minEl.textContent = Math.floor(minerals);
  incEl.textContent = `${incomePerTick()}/10s`;
  supEl.textContent = `${supply}/90`;
  waveEl.textContent = `${Math.ceil(waveT)}s`;
  blueHpEl.textContent = `● Blue ${Math.max(0, Math.round((blueNexus.hp / blueNexus.maxHp) * 100))}%`;
  redHpEl.textContent = `Red ${Math.max(0, Math.round((redNexus.hp / redNexus.maxHp) * 100))}% ●`;
  statusEl.textContent = over ? 'Game over' : `Battle running… ${units.length} units · ${kills} kills`;
}

function endGame(winner) {
  over = true;
  overlay.style.display = 'flex';
  overlayText.textContent = winner === 'blue' ? 'Victory! Enemy Nexus destroyed.' : 'Defeat — your Nexus fell. Hit Reset to rematch.';
  statusEl.textContent = overlayText.textContent;
}

const clock = new THREE.Clock();
function step() {
  requestAnimationFrame(step);
  const dt = Math.min(clock.getDelta(), 0.05);
  if (!over) {
    elapsed += dt;
    waveT -= dt; incomeT -= dt; aiT -= dt;
    if (incomeT <= 0) { incomeT = 10; minerals += incomePerTick(); }
    if (aiT <= 0) { aiT = 11; aiThink(); minerals += 0; }
    if (waveT <= 0) {
      waveT = 8;
      for (const q of queue) spawnUnit('blue', q.type, q.lane);
      for (const q of aiQueue) { spawnUnit('red', q.type, q.lane); }
      // AI free units funded by aiIncome
      let budget = aiIncome;
      while (budget > 50 && units.length < 110) {
        const t = ['zealot', 'ling', 'tank'][Math.floor(Math.random() * 3)];
        const cost = t === 'ling' ? 30 : TYPES[t].cost;
        if (budget < cost) break;
        budget -= cost;
        spawnUnit('red', t, LANES[Math.floor(Math.random() * 2)]);
      }
      queue = []; aiQueue = [];
    }
    // units: acquire + move + fire
    for (const u of units) {
      if (u.hp <= 0) continue;
      u.cd -= dt;
      let best = null, bestD = TYPES[u.type].range;
      for (const v of units) {
        if (v.side === u.side || v.hp <= 0) continue;
        const d = u.mesh.position.distanceTo(v.mesh.position);
        if (d < bestD) { bestD = d; best = v; }
      }
      if (best) {
        if (u.cd <= 0) { u.cd = TYPES[u.type].cd; spawnBolt(u, best); }
      } else {
        u.mesh.position.x += u.dir * TYPES[u.type].speed * dt;
        u.mesh.rotation.y += dt * 2;
      }
      // reached nexus?
      if (u.side === 'blue' && u.mesh.position.x > ARENA_X - 2) { redNexus.hp -= TYPES[u.type].dmg * dt * 4; u.hp -= 30 * dt; }
      if (u.side === 'red' && u.mesh.position.x < -ARENA_X + 2) { blueNexus.hp -= TYPES[u.type].dmg * dt * 4; u.hp -= 30 * dt; }
    }
    // bolts
    for (const b of bolts) {
      if (b.target.hp <= 0) { b.life = 0; continue; }
      const dir = b.target.mesh.position.clone().sub(b.mesh.position);
      const d = dir.length();
      if (d < 0.7) {
        b.target.hp -= b.dmg;
        boom(b.target.mesh.position, b.side === 'blue' ? 0x9adcff : 0xff9a6b, 0.5);
        if (b.target.hp <= 0 && b.side === 'blue') { minerals += TYPES[b.target.type].bounty; kills++; }
        b.life = 0;
      } else {
        b.mesh.position.addScaledVector(dir.normalize(), dt * 26);
        b.life -= dt;
      }
    }
    // cleanup
    for (let i = units.length - 1; i >= 0; i--) {
      if (units[i].hp <= 0) {
        boom(units[i].mesh.position, 0x8899ff, 0.8);
        scene.remove(units[i].mesh);
        units.splice(i, 1);
      }
    }
    for (let i = bolts.length - 1; i >= 0; i--) {
      if (bolts[i].life <= 0) { scene.remove(bolts[i].mesh); bolts.splice(i, 1); }
    }
    for (let i = flashes.length - 1; i >= 0; i--) {
      flashes[i].life -= dt;
      flashes[i].mesh.scale.multiplyScalar(1 + dt * 6);
      flashes[i].mesh.material.opacity = Math.max(0, flashes[i].life * 2);
      if (flashes[i].life <= 0) { scene.remove(flashes[i].mesh); flashes.splice(i, 1); }
    }
    blueNexus.crystal.rotation.y += dt;
    redNexus.crystal.rotation.y -= dt;
    blueNexus.crystal.position.y = 4.2 + Math.sin(elapsed * 2) * 0.25;
    redNexus.crystal.position.y = 4.2 + Math.cos(elapsed * 2) * 0.25;
    if (blueNexus.hp <= 0 || redNexus.hp <= 0) endGame(redNexus.hp <= 0 ? 'blue' : 'red');
    updateHud();
  }
  applyCamera();
  renderer.render(scene, camera);
}

document.getElementById('btn-zealot').onclick = () => buy('zealot');
document.getElementById('btn-tank').onclick = () => buy('tank');
document.getElementById('btn-ling').onclick = () => buy('ling');
document.getElementById('btn-pylon').onclick = () => buy('pylon');
document.getElementById('btn-nuke').onclick = () => buy('nuke');
document.getElementById('btn-reset').onclick = () => {
  for (const u of units) scene.remove(u.mesh);
  units.length = 0;
  for (const b of bolts) scene.remove(b.mesh);
  bolts.length = 0;
  minerals = 220; pylons = 0; spawners = 0; supply = 0; kills = 0;
  queue = []; aiQueue = []; waveT = 8; incomeT = 10; elapsed = 0; over = false;
  playerNuke = 1; aiNuke = 1; aiIncome = 14;
  blueNexus.hp = blueNexus.maxHp; redNexus.hp = redNexus.maxHp;
  overlay.style.display = 'none';
  document.getElementById('btn-nuke').disabled = false;
  renderPylons();
  for (let i = 0; i < 4; i++) spawnUnit('blue', 'zealot', LANES[i % 2]);
  for (let i = 0; i < 4; i++) spawnUnit('red', 'zealot', LANES[i % 2]);
  say('Rematch started — opening waves sent.');
};

// opening waves so screenshots show action immediately
for (let i = 0; i < 5; i++) spawnUnit('blue', i % 2 ? 'ling' : 'zealot', LANES[i % 2]);
for (let i = 0; i < 5; i++) spawnUnit('red', i % 2 ? 'zealot' : 'ling', LANES[i % 2]);
spawnUnit('blue', 'tank', LANES[0]);
spawnUnit('red', 'tank', LANES[1]);

resize();
applyCamera();
updateHud();
step();
window.__gameReady = true;
