import * as THREE from 'three';

/* ============================================================
   LEAGUE OF LEGENDS 3D — RIFT ARENA
   A fan-made browser MOBA demo. Not affiliated with Riot Games.
   Single-lane MOBA: last-hit minions, destroy towers, kill Nexus.
   ============================================================ */

const canvas = document.getElementById('game-canvas');
const $ = (id) => document.getElementById(id);

// ---------- tiny helpers ----------
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const dist2d = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
const lerp = (a, b, t) => a + (b - a) * t;
const TEAM_COLOR = { blue: 0x35b6ff, red: 0xff4d5e };
const TEAM_CSS = { blue: '#35b6ff', red: '#ff4d5e' };

// ---------- audio (procedural WebAudio, no assets) ----------
const AudioSys = {
  ctx: null, muted: false,
  init() {
    if (this.ctx) return;
    try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* no audio */ }
  },
  beep(freq, dur = 0.12, type = 'sine', vol = 0.15, slide = 0) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(t); o.stop(t + dur + 0.02);
  },
  hit() { this.beep(220, 0.08, 'square', 0.06, -80); },
  tower() { this.beep(140, 0.25, 'sawtooth', 0.1, -40); },
  ability() { this.beep(520, 0.18, 'sine', 0.12, 300); },
  ult() { this.beep(90, 0.7, 'sawtooth', 0.16, 220); },
  gold() { this.beep(880, 0.1, 'sine', 0.08, 220); },
  kill() { this.beep(330, 0.3, 'triangle', 0.14, -150); this.beep(495, 0.35, 'triangle', 0.1, -200); },
  death() { this.beep(160, 0.6, 'sawtooth', 0.14, -110); },
  level() { [523, 659, 784].forEach((f, i) => setTimeout(() => this.beep(f, 0.15, 'triangle', 0.1), i * 90)); },
};

// ---------- champion templates ----------
const CHAMPS = {
  blade:    { name: 'Azure Blade',  emoji: '⚔️', maxHp: 620, maxMp: 320, ad: 62, ap: 0, armor: 24, speed: 7.2, atkRange: 3.2, atkTime: 0.95, color: 0x3fa9ff, desc: 'Balanced duelist' },
  assassin: { name: 'Shadow Fang',  emoji: '🗡️', maxHp: 480, maxMp: 340, ad: 74, ap: 0, armor: 14, speed: 8.4, atkRange: 2.9, atkTime: 0.8,  color: 0x9b5bff, desc: 'Fast assassin' },
  golem:    { name: 'Iron Golem',   emoji: '🛡️', maxHp: 860, maxMp: 260, ad: 55, ap: 0, armor: 40, speed: 6.4, atkRange: 3.4, atkTime: 1.1,  color: 0xffa63f, desc: 'Unkillable tank' },
};
const ENEMY_CHAMP = { name: 'Crimson Fang', emoji: '👹', maxHp: 640, maxMp: 320, ad: 64, ap: 0, armor: 22, speed: 7.0, atkRange: 3.2, atkTime: 1.0, color: 0xff3f6e };

const ABILITIES = {
  Q: { cd: 5,  mana: 40, name: 'Moon Bolt' },
  W: { cd: 11, mana: 50, name: 'Swift Dash' },
  E: { cd: 9,  mana: 45, name: 'Blade Cyclone' },
  R: { cd: 45, mana: 100, name: 'Starfall' },
};

// ---------- game state ----------
const G = {
  running: false, over: false, time: 0, lastWave: -99,
  blueKills: 0, redKills: 0, firstBlood: false,
  minions: [], towers: [], projectiles: [], particles: [], markers: [],
  player: null, enemy: null, nexus: { blue: null, red: null },
  camMode: 'follow', camOffset: new THREE.Vector3(0, 30, 17),
  camPos: new THREE.Vector3(0, 30, 60), camLook: new THREE.Vector3(0, 0, 40),
  shake: 0, selectedChamp: 'blade', attackMove: false,
};

// ---------- three.js setup ----------
let renderer, scene, camera, raycaster, groundMesh, clock;
const mouseNDC = new THREE.Vector2();
const MAP_HALF = 52;

function initThree() {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a1420);
  scene.fog = new THREE.Fog(0x0a1420, 70, 150);
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 400);
  camera.position.copy(G.camPos);
  camera.lookAt(G.camLook);
  raycaster = new THREE.Raycaster();
  clock = new THREE.Clock();

  const hemi = new THREE.HemisphereLight(0xbdd7ff, 0x1d3a1d, 0.85);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff2d0, 1.6);
  sun.position.set(30, 55, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -60; sun.shadow.camera.right = 60;
  sun.shadow.camera.top = 60; sun.shadow.camera.bottom = -60;
  sun.shadow.camera.far = 140;
  scene.add(sun);
  const blueGlow = new THREE.PointLight(0x35b6ff, 60, 40); blueGlow.position.set(0, 6, 44); scene.add(blueGlow);
  const redGlow = new THREE.PointLight(0xff4d5e, 60, 40); redGlow.position.set(0, 6, -44); scene.add(redGlow);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ---------- map textures ----------
function makeGroundTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#2d6a2d'; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2600; i++) {
    const x = Math.random() * 512, y = Math.random() * 512;
    const shades = ['#2a6229', '#337533', '#285c28', '#3a7f3a', '#2f7030'];
    g.fillStyle = shades[(Math.random() * shades.length) | 0];
    g.fillRect(x, y, 2 + Math.random() * 3, 2 + Math.random() * 3);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(6, 6);
  return tex;
}

function buildMap() {
  // ground
  const gtex = makeGroundTexture();
  groundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(MAP_HALF * 2 + 16, MAP_HALF * 2 + 16),
    new THREE.MeshStandardMaterial({ map: gtex, roughness: 1 })
  );
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.receiveShadow = true;
  groundMesh.name = 'ground';
  scene.add(groundMesh);

  // center lane (sandy strip along z)
  const lane = new THREE.Mesh(
    new THREE.PlaneGeometry(12, MAP_HALF * 2 + 8),
    new THREE.MeshStandardMaterial({ color: 0xb89a5e, roughness: 1 })
  );
  lane.rotation.x = -Math.PI / 2; lane.position.y = 0.02; lane.receiveShadow = true;
  scene.add(lane);
  const laneEdge = new THREE.Mesh(
    new THREE.PlaneGeometry(14.5, MAP_HALF * 2 + 8),
    new THREE.MeshStandardMaterial({ color: 0x8a743f, roughness: 1 })
  );
  laneEdge.rotation.x = -Math.PI / 2; laneEdge.position.y = 0.01;
  scene.add(laneEdge);

  // river across middle
  const river = new THREE.Mesh(
    new THREE.PlaneGeometry(MAP_HALF * 2 + 16, 9),
    new THREE.MeshStandardMaterial({ color: 0x2e9fc4, roughness: 0.25, metalness: 0.35, transparent: true, opacity: 0.9 })
  );
  river.rotation.x = -Math.PI / 2; river.position.y = 0.03;
  scene.add(river);

  // side walls (low stone borders)
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x5a6170, roughness: 0.9 });
  const mkWall = (w, d, x, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, 2.2, d), wallMat);
    m.position.set(x, 1.1, z); m.castShadow = m.receiveShadow = true; scene.add(m);
  };
  const W = MAP_HALF + 8;
  mkWall(W * 2, 2, 0, W); mkWall(W * 2, 2, 0, -W);
  mkWall(2, W * 2, W, 0); mkWall(2, W * 2, -W, 0);

  // decorative trees (two forests left/right)
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b4a2b, roughness: 1 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x1f6e2a, roughness: 1 });
  const leafMat2 = new THREE.MeshStandardMaterial({ color: 0x2c8a38, roughness: 1 });
  const treeSpots = [];
  for (let i = 0; i < 26; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    treeSpots.push([side * (16 + Math.random() * 30), -48 + Math.random() * 96]);
  }
  for (const [x, z] of treeSpots) {
    if (Math.abs(x) < 12) continue;
    const t = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 2.4, 6), trunkMat);
    trunk.position.y = 1.2; trunk.castShadow = true; t.add(trunk);
    const lm = Math.random() < 0.5 ? leafMat : leafMat2;
    for (let k = 0; k < 3; k++) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(2.2 - k * 0.5, 2.2, 7), lm);
      cone.position.y = 3 + k * 1.3; cone.castShadow = true; t.add(cone);
    }
    t.position.set(x, 0, z);
    const s = 0.8 + Math.random() * 0.7; t.scale.setScalar(s);
    scene.add(t);
  }

  // bushes near river (tall grass blobs)
  const bushMat = new THREE.MeshStandardMaterial({ color: 0x2fae4e, roughness: 1, transparent: true, opacity: 0.92 });
  for (const [x, z] of [[-10, 8], [10, -8], [-10, -8], [10, 8], [-13, 0], [13, 0]]) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(2.2, 8, 6), bushMat);
    b.position.set(x, 1, z); b.scale.y = 0.7; b.castShadow = true; scene.add(b);
  }

  // center scuttle statue
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 3, 1.6, 8), wallMat);
  ped.position.set(9, 0.8, 0); ped.castShadow = true; scene.add(ped);
  const orb = new THREE.Mesh(new THREE.OctahedronGeometry(1.2), new THREE.MeshStandardMaterial({ color: 0x9be8ff, emissive: 0x2288aa, emissiveIntensity: 0.9, roughness: 0.2 }));
  orb.position.set(9, 3, 0); orb.castShadow = true; scene.add(orb);
  orb.name = 'midOrb';
}
// ================= PART 2: units, health bars, combat =================
function makeHpBar(w = 3.4) {
  const grp = new THREE.Group();
  const bg = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0x14090c, depthTest: false }));
  bg.scale.set(w, 0.42, 1); bg.renderOrder = 50; grp.add(bg);
  const fg = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0x3fe05a, depthTest: false }));
  fg.scale.set(w, 0.28, 1); fg.renderOrder = 51; grp.add(fg);
  grp.userData.set = (frac, team) => {
    fg.scale.x = Math.max(0.001, w * clamp(frac, 0, 1));
    fg.position.x = -w * (1 - clamp(frac, 0, 1)) / 2;
    fg.material.color.set(frac > 0.55 ? 0x3fe05a : frac > 0.28 ? 0xffc93f : 0xff4444);
    if (team === 'blue') bg.material.color.set(0x0a2a3a);
  };
  return grp;
}

function makeRing(color, r = 1.6) {
  const m = new THREE.Mesh(
    new THREE.RingGeometry(r - 0.28, r, 28),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
  );
  m.rotation.x = -Math.PI / 2; m.position.y = 0.06;
  return m;
}

function makeChampionMesh(tpl, team) {
  const g = new THREE.Group();
  const col = tpl.color;
  const bodyMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.5, metalness: 0.25 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1c2433, roughness: 0.7 });
  const teamMat = new THREE.MeshStandardMaterial({ color: TEAM_COLOR[team], emissive: TEAM_COLOR[team], emissiveIntensity: 0.35, roughness: 0.4 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.85, 1.5, 4, 10), bodyMat);
  body.position.y = 1.9; body.castShadow = true; g.add(body);
  const belt = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.16, 8, 16), teamMat);
  belt.rotation.x = Math.PI / 2; belt.position.y = 1.5; g.add(belt);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 10), new THREE.MeshStandardMaterial({ color: 0xf2c89b, roughness: 0.7 }));
  head.position.y = 3.35; head.castShadow = true; g.add(head);
  const helm = new THREE.Mesh(new THREE.ConeGeometry(0.62, 0.9, 8), darkMat);
  helm.position.y = 3.85; helm.castShadow = true; g.add(helm);
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.6, 0.34), new THREE.MeshStandardMaterial({ color: 0xdfe9ff, metalness: 0.9, roughness: 0.2, emissive: team === 'blue' ? 0x113355 : 0x551111, emissiveIntensity: 0.5 }));
  blade.position.set(1.25, 2.1, 0.3); blade.rotation.z = -0.5; blade.castShadow = true; g.add(blade);
  blade.name = 'sword';
  const shield = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.12, 12), teamMat);
  shield.position.set(-1.15, 2.0, 0); shield.rotation.z = Math.PI / 2; g.add(shield);
  g.add(makeRing(TEAM_COLOR[team], 1.7));
  const bar = makeHpBar(3.6); bar.position.y = 4.7; g.add(bar);
  g.userData.bar = bar; g.userData.sword = blade;
  return g;
}

function makeMinionMesh(team, caster) {
  const g = new THREE.Group();
  const c = team === 'blue' ? 0x2e7fd9 : 0xd93a4b;
  const bodyMat = new THREE.MeshStandardMaterial({ color: c, roughness: 0.8 });
  const h = caster ? 1.0 : 1.3;
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, h, 0.7), bodyMat);
  body.position.y = h / 2 + 0.35; body.castShadow = true; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 8, 8), new THREE.MeshStandardMaterial({ color: 0xd8dee9, roughness: 0.8 }));
  head.position.y = h + 0.75; head.castShadow = true; g.add(head);
  if (!caster) {
    const sw = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 0.2), new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7, roughness: 0.3 }));
    sw.position.set(0.6, 0.9, 0.2); sw.rotation.z = -0.4; g.add(sw);
  } else {
    const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.8, 6), new THREE.MeshStandardMaterial({ color: 0x6b4a2b }));
    staff.position.set(0.55, 1.1, 0); g.add(staff);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), new THREE.MeshStandardMaterial({ color: TEAM_COLOR[team], emissive: TEAM_COLOR[team], emissiveIntensity: 1 }));
    tip.position.set(0.55, 2.0, 0); g.add(tip);
  }
  g.add(makeRing(TEAM_COLOR[team], 0.95));
  const bar = makeHpBar(2.2); bar.position.y = h + 1.5; g.add(bar);
  g.userData.bar = bar;
  return g;
}

function makeTowerMesh(team) {
  const g = new THREE.Group();
  const c = TEAM_COLOR[team];
  const stone = new THREE.MeshStandardMaterial({ color: 0x8b93a5, roughness: 0.85 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 3.1, 2.2, 8), stone);
  base.position.y = 1.1; base.castShadow = base.receiveShadow = true; g.add(base);
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.9, 6.5, 8), stone);
  shaft.position.y = 5.4; shaft.castShadow = true; g.add(shaft);
  const gemMat = new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1.2, roughness: 0.2 });
  const gem = new THREE.Mesh(new THREE.OctahedronGeometry(1.3), gemMat);
  gem.position.y = 9.6; gem.castShadow = true; g.add(gem); gem.name = 'gem';
  const ringM = new THREE.Mesh(new THREE.TorusGeometry(2.9, 0.18, 8, 24), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.6 }));
  ringM.rotation.x = Math.PI / 2; ringM.position.y = 0.4; g.add(ringM);
  const bar = makeHpBar(5.2); bar.position.y = 11.4; g.add(bar);
  g.userData.bar = bar; g.userData.gem = gem;
  return g;
}

function makeNexusMesh(team) {
  const g = new THREE.Group();
  const c = TEAM_COLOR[team];
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 4, 1.8, 8), new THREE.MeshStandardMaterial({ color: 0x707a8e, roughness: 0.85 }));
  ped.position.y = 0.9; ped.castShadow = ped.receiveShadow = true; g.add(ped);
  const crys = new THREE.Mesh(new THREE.OctahedronGeometry(2.4), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1.1, roughness: 0.15, transparent: true, opacity: 0.95 }));
  crys.position.y = 4.4; crys.castShadow = true; g.add(crys); crys.name = 'crystal';
  const light = new THREE.PointLight(c, 80, 26); light.position.y = 5; g.add(light);
  const bar = makeHpBar(6.4); bar.position.y = 7.6; g.add(bar);
  g.userData.bar = bar; g.userData.crystal = crys;
  return g;
}

function makeFountain(team, z) {
  const c = TEAM_COLOR[team];
  const g = new THREE.Group();
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(5, 5.4, 0.5, 20), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.35, roughness: 0.5 }));
  disc.position.y = 0.25; disc.receiveShadow = true; g.add(disc);
  g.position.set(0, 0, z);
  g.name = team === 'blue' ? 'fountain-blue' : 'fountain-red';
  scene.add(g);
}

// ---------- entity factories ----------
function spawnChampion(tpl, team, isPlayer) {
  const mesh = makeChampionMesh(tpl, team);
  const startZ = team === 'blue' ? 38 : -38;
  mesh.position.set(team === 'blue' ? 2.5 : -2.5, 0, startZ);
  scene.add(mesh);
  const u = {
    kind: 'champ', team, tpl, mesh, isPlayer: !!isPlayer,
    x: mesh.position.x, z: mesh.position.z,
    hp: tpl.maxHp, maxHp: tpl.maxHp, mp: tpl.maxMp, maxMp: tpl.maxMp,
    ad: tpl.ad, bonusAd: 0, apBonus: 0, armor: tpl.armor,
    speed: tpl.speed, atkRange: tpl.atkRange, atkTime: tpl.atkTime,
    level: 1, xp: 0, xpNeed: 120, gold: isPlayer ? 475 : 475,
    kills: 0, deaths: 0, assists: 0, cs: 0,
    alive: true, respawn: 0, moveTarget: null, atkTarget: null,
    atkCd: 0, cds: { Q: 0, W: 0, E: 0, R: 0 },
    shield: 0, shieldT: 0, recallT: 0, lastTowerAggro: -99,
    hitFlash: 0, walkPhase: Math.random() * 6, items: [],
    ai: { state: 'lane', retreatT: 0, wanderX: 0, abilityT: 2 },
  };
  mesh.userData.unit = u;
  return u;
}

function spawnMinion(team, caster, laneX) {
  const mesh = makeMinionMesh(team, caster);
  const z = team === 'blue' ? 40 : -40;
  mesh.position.set(laneX, 0, z);
  scene.add(mesh);
  const u = {
    kind: caster ? 'caster' : 'melee', team, mesh,
    x: laneX, z,
    hp: caster ? 200 : 340, maxHp: caster ? 200 : 340,
    ad: caster ? 38 : 26, armor: 6,
    speed: caster ? 5.2 : 5.6, atkRange: caster ? 9 : 2.4, atkTime: caster ? 1.3 : 1.1,
    alive: true, atkCd: Math.random() * 0.5, atkTarget: null,
    worth: caster ? 45 : 42, xpWorth: caster ? 40 : 34,
    hitFlash: 0, walkPhase: Math.random() * 6,
  };
  mesh.userData.unit = u;
  G.minions.push(u);
  return u;
}

function spawnTower(team, z) {
  const mesh = makeTowerMesh(team);
  mesh.position.set(0, 0, z);
  scene.add(mesh);
  const u = {
    kind: 'tower', team, mesh, x: 0, z,
    hp: 1300, maxHp: 1300, ad: 95, armor: 40,
    atkRange: 11.5, atkTime: 1.1, alive: true, atkCd: 1, atkTarget: null,
    worth: 250, xpWorth: 60, hitFlash: 0,
  };
  mesh.userData.unit = u;
  G.towers.push(u);
  return u;
}

function spawnNexus(team, z) {
  const mesh = makeNexusMesh(team);
  mesh.position.set(0, 0, z);
  scene.add(mesh);
  const u = {
    kind: 'nexus', team, mesh, x: 0, z,
    hp: 1600, maxHp: 1600, ad: 0, armor: 40,
    alive: true, worth: 0, xpWorth: 0, hitFlash: 0,
  };
  mesh.userData.unit = u;
  G.nexus[team] = u;
  return u;
}

// ---------- combat ----------
function armorMult(armor) { return 100 / (100 + Math.max(0, armor)); }

function dealDamage(src, tgt, raw, type = 'phys') {
  if (!tgt || !tgt.alive || G.over) return 0;
  if (tgt.kind === 'nexus') {
    // nexus shielded while any tower of that team stands
    if (G.towers.some((t) => t.team === tgt.team && t.alive)) return 0;
  }
  let dmg = raw;
  if (type === 'phys') dmg *= armorMult(tgt.armor || 0);
  if (type === 'magic') dmg *= armorMult((tgt.armor || 0) * 0.6);
  if (type === 'true') dmg = raw;
  if (tgt.shield > 0 && tgt.kind === 'champ') {
    const absorbed = Math.min(tgt.shield, dmg);
    tgt.shield -= absorbed; dmg -= absorbed;
  }
  tgt.hp -= dmg;
  tgt.hitFlash = 0.15;
  spawnHitParticles(tgt.x, 1.5, tgt.z, type === 'magic' ? 0x9b5bff : 0xffd75e, 6);
  if (tgt.isPlayer) {
    flashDamageVignette();
    AudioSys.hit();
  }
  if (tgt.hp <= 0) killUnit(src, tgt);
  return dmg;
}

function killUnit(src, tgt) {
  if (!tgt.alive) return;
  tgt.alive = false; tgt.hp = 0;
  spawnHitParticles(tgt.x, 2, tgt.z, tgt.team === 'blue' ? 0x35b6ff : 0xff4d5e, 26);
  if (tgt.kind === 'tower') {
    tgt.mesh.userData.gem.material.emissiveIntensity = 0.05;
    tgt.mesh.userData.gem.material.opacity = 0.4;
    announce(tgt.team === 'red' ? 'ENEMY TURRET DESTROYED!' : 'ALLY TURRET DESTROYED!');
    feed(`${srcName(src)} destroyed a ${tgt.team === 'red' ? 'red' : 'blue'} turret`);
    AudioSys.kill();
    if (src && src.kind === 'champ') { src.gold += tgt.worth; src.xp += tgt.xpWorth; checkLevel(src); }
  } else if (tgt.kind === 'nexus') {
    endGame(tgt.team === 'red' ? 'blue' : 'red');
    return;
  } else if (tgt.kind === 'champ') {
    tgt.deaths++;
    tgt.respawn = 5 + tgt.level * 2;
    if (src && src.kind === 'champ' && src !== tgt) {
      src.kills++; src.gold += 300; src.xp += 120; checkLevel(src);
      if (!G.firstBlood) { G.firstBlood = true; announce('FIRST BLOOD!'); }
      else announce(src.isPlayer ? 'ENEMY SLAIN!' : 'YOU HAVE BEEN SLAIN!');
      feed(`${srcName(src)} ⚔️ ${srcName(tgt)}`);
      AudioSys.kill();
    } else {
      feed(`${srcName(tgt)} died`);
    }
    if (tgt.isPlayer) { showDeath(); AudioSys.death(); }
    else if (src && src.isPlayer) AudioSys.gold();
    // clear targeting of dead unit
    for (const m of G.minions) if (m.atkTarget === tgt) m.atkTarget = null;
    for (const t of G.towers) if (t.atkTarget === tgt) t.atkTarget = null;
    if (G.player.atkTarget === tgt) G.player.atkTarget = null;
    if (G.enemy.atkTarget === tgt) G.enemy.atkTarget = null;
    tgt.mesh.visible = false;
  } else {
    // minion
    removeUnitMesh(tgt);
    if (src && src.kind === 'champ' && src.team !== tgt.team) {
      const lastHit = src.atkTarget === tgt || dist2d(src, tgt) < src.atkRange + 6;
      if (lastHit) { src.gold += tgt.worth; src.cs++; if (src.isPlayer) AudioSys.gold(); }
      // xp shared with nearby allied champs
      for (const c of [G.player, G.enemy]) {
        if (c && c.alive && c.team !== tgt.team && dist2d(c, tgt) < 22) { c.xp += tgt.xpWorth; checkLevel(c); }
      }
    }
  }
}

function srcName(u) {
  if (!u) return 'Minions';
  if (u.kind === 'tower') return u.team === 'blue' ? 'Blue turret' : 'Red turret';
  if (u.isPlayer) return `<b style="color:#35b6ff">${u.tpl.name} (You)</b>`;
  if (u.kind === 'champ') return `<b style="color:#ff4d5e">${u.tpl.name}</b>`;
  return u.team === 'blue' ? 'Blue minion' : 'Red minion';
}

function removeUnitMesh(u) {
  scene.remove(u.mesh);
  const i = G.minions.indexOf(u);
  if (i >= 0) G.minions.splice(i, 1);
}

function checkLevel(c) {
  while (c.xp >= c.xpNeed && c.level < 12) {
    c.xp -= c.xpNeed; c.level++;
    c.xpNeed = Math.round(c.xpNeed * 1.35);
    c.maxHp += 95; c.hp = Math.min(c.maxHp, c.hp + c.maxHp * 0.35);
    c.maxMp += 30; c.mp = c.maxMp;
    c.ad += 7; c.armor += 3;
    spawnHitParticles(c.x, 2.5, c.z, 0xf5d67b, 30);
    if (c.isPlayer) { AudioSys.level(); feed(`You reached level ${c.level}!`); }
  }
}
// ================= PART 3: projectiles, waves, AI, abilities =================
function spawnProjectile(o) {
  const color = o.color || 0xfff2a8;
  const size = o.size || 0.45;
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(size, 10, 8),
    new THREE.MeshBasicMaterial({ color })
  );
  const glow = new THREE.PointLight(color, 8, 8);
  mesh.add(glow);
  mesh.position.set(o.x, o.y || 1.6, o.z);
  scene.add(mesh);
  G.projectiles.push({
    mesh, x: o.x, z: o.z, y: o.y || 1.6,
    dx: o.dx, dz: o.dz, speed: o.speed || 26,
    dmg: o.dmg, src: o.src, team: o.src ? o.src.team : o.team,
    target: o.target || null, homing: !!o.target,
    range: o.range || 30, traveled: 0, type: o.type || 'phys',
    aoe: o.aoe || 0, color, size,
  });
}

function updateProjectiles(dt) {
  for (let i = G.projectiles.length - 1; i >= 0; i--) {
    const p = G.projectiles[i];
    if (p.homing && p.target && p.target.alive) {
      const d = Math.max(0.001, dist2d(p, p.target));
      p.dx = (p.target.x - p.x) / d; p.dz = (p.target.z - p.z) / d;
      if (d < 1.1) {
        hitProjectile(p, p.target);
        scene.remove(p.mesh); G.projectiles.splice(i, 1); continue;
      }
    }
    p.x += p.dx * p.speed * dt; p.z += p.dz * p.speed * dt;
    p.traveled += p.speed * dt;
    p.mesh.position.set(p.x, p.y, p.z);
    let hitSomething = false;
    if (!p.homing) {
      const victims = allCombatants(p.team === 'blue' ? 'red' : 'blue');
      for (const v of victims) {
        if (!v.alive) continue;
        const r = v.kind === 'tower' || v.kind === 'nexus' ? 2.6 : 1.4;
        if (dist2d(p, v) < r) {
          if (p.aoe > 0) {
            for (const w of allCombatants(p.team === 'blue' ? 'red' : 'blue')) {
              if (w.alive && dist2d(p, w) < p.aoe) dealDamage(p.src, w, p.dmg, p.type);
            }
            spawnHitParticles(p.x, 1.5, p.z, p.color, 22);
            G.shake = Math.min(1, G.shake + 0.35);
          } else {
            dealDamage(p.src, v, p.dmg, p.type);
          }
          hitSomething = true; break;
        }
      }
    }
    if (hitSomething || p.traveled > p.range || Math.abs(p.x) > MAP_HALF + 6 || Math.abs(p.z) > MAP_HALF + 6) {
      if (!hitSomething) spawnHitParticles(p.x, 1, p.z, p.color, 5);
      scene.remove(p.mesh); G.projectiles.splice(i, 1);
    }
  }
}

function hitProjectile(p, tgt) {
  if (p.color === 0xff2222 || p.color === 0xff3344) AudioSys.tower();
  dealDamage(p.src, tgt, p.dmg, p.type);
}

function allCombatants(enemyOf) {
  // returns alive damageable units of the given team + champs
  const out = [];
  for (const m of G.minions) if (m.team === enemyOf && m.alive) out.push(m);
  for (const t of G.towers) if (t.team === enemyOf && t.alive) out.push(t);
  const n = G.nexus[enemyOf];
  if (n && n.alive) out.push(n);
  const c = enemyOf === 'blue' ? G.player : G.enemy;
  if (c && c.alive) out.push(c);
  const c2 = enemyOf === 'red' ? G.player : G.enemy;
  void c2;
  return out;
}

function allEnemiesOf(unit) {
  return allCombatants(unit.team === 'blue' ? 'red' : 'blue');
}

function nearestEnemy(unit, range, kinds) {
  let best = null, bd = range;
  for (const v of allEnemiesOf(unit)) {
    if (kinds && !kinds.includes(v.kind) && !(v.kind === 'melee' || v.kind === 'caster')) {
      if (kinds && !kinds.includes(v.kind)) continue;
    }
    const d = dist2d(unit, v);
    if (d < bd) { bd = d; best = v; }
  }
  return best;
}

// ---------- particles ----------
function spawnHitParticles(x, y, z, color, n = 8) {
  for (let i = 0; i < n; i++) {
    const s = 0.08 + Math.random() * 0.16;
    const m = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), new THREE.MeshBasicMaterial({ color }));
    m.position.set(x + (Math.random() - 0.5), y + (Math.random() - 0.5), z + (Math.random() - 0.5));
    scene.add(m);
    G.particles.push({
      mesh: m, life: 0.4 + Math.random() * 0.35, age: 0,
      vx: (Math.random() - 0.5) * 9, vy: Math.random() * 7, vz: (Math.random() - 0.5) * 9,
    });
  }
  if (G.particles.length > 500) {
    const extra = G.particles.splice(0, G.particles.length - 500);
    for (const p of extra) scene.remove(p.mesh);
  }
}

function updateParticles(dt) {
  for (let i = G.particles.length - 1; i >= 0; i--) {
    const p = G.particles[i];
    p.age += dt;
    p.vy -= 16 * dt;
    p.mesh.position.x += p.vx * dt;
    p.mesh.position.y += p.vy * dt;
    p.mesh.position.z += p.vz * dt;
    p.mesh.rotation.x += dt * 5; p.mesh.rotation.y += dt * 4;
    if (p.age >= p.life || p.mesh.position.y < 0) {
      scene.remove(p.mesh); G.particles.splice(i, 1);
    }
  }
}

// ---------- click markers ----------
function spawnMarker(x, z, attack) {
  const m = new THREE.Mesh(
    new THREE.RingGeometry(0.5, 0.9, 20),
    new THREE.MeshBasicMaterial({ color: attack ? 0xff3333 : 0x33ff77, transparent: true, opacity: 1, side: THREE.DoubleSide })
  );
  m.rotation.x = -Math.PI / 2; m.position.set(x, 0.08, z);
  scene.add(m);
  G.markers.push({ mesh: m, age: 0 });
}

function updateMarkers(dt) {
  for (let i = G.markers.length - 1; i >= 0; i--) {
    const mk = G.markers[i];
    mk.age += dt;
    mk.mesh.scale.setScalar(1 + mk.age * 2);
    mk.mesh.material.opacity = Math.max(0, 1 - mk.age * 1.6);
    if (mk.age > 0.65) { scene.remove(mk.mesh); G.markers.splice(i, 1); }
  }
}

// ---------- minion waves ----------
function spawnWave() {
  for (const team of ['blue', 'red']) {
    const xs = [-2.6, -0.9, 0.9, -1.8, 1.8];
    xs.forEach((x, i) => spawnMinion(team, i >= 3, x));
  }
  feed('Minion wave spawned');
}

function updateMinion(m, dt) {
  if (!m.alive) return;
  m.atkCd -= dt;
  const foe = nearestEnemy(m, m.kind === 'caster' ? 13 : 7);
  const dir = m.team === 'blue' ? -1 : 1; // blue marches toward -z
  if (foe && dist2d(m, foe) <= m.atkRange + (foe.kind === 'tower' || foe.kind === 'nexus' ? 2 : 0)) {
    // attack
    faceToward(m, foe);
    if (m.atkCd <= 0) {
      m.atkCd = m.atkTime;
      if (m.kind === 'caster') {
        const d = Math.max(0.001, dist2d(m, foe));
        spawnProjectile({ x: m.x, z: m.z, dx: (foe.x - m.x) / d, dz: (foe.z - m.z) / d, speed: 22, dmg: m.ad, src: m, range: 16, color: m.team === 'blue' ? 0x66c2ff : 0xff8866, size: 0.32 });
      } else {
        dealDamage(m, foe, m.ad, 'phys');
        AudioSys.hit();
      }
    }
  } else if (foe && dist2d(m, foe) < 14) {
    moveUnitToward(m, foe.x, foe.z, dt);
  } else {
    // march down lane with slight wobble
    const tx = m.x * 0.985;
    moveUnitToward(m, tx, m.z + dir * 10, dt);
    // leash inside map
    m.x = clamp(m.x, -7, 7);
  }
  syncMesh(m, dt);
}

function moveUnitToward(u, tx, tz, dt, mult = 1) {
  const dx = tx - u.x, dz = tz - u.z;
  const d = Math.hypot(dx, dz);
  if (d < 0.15) return true;
  const step = Math.min(d, u.speed * mult * dt);
  u.x += (dx / d) * step; u.z += (dz / d) * step;
  u.x = clamp(u.x, -MAP_HALF, MAP_HALF);
  u.z = clamp(u.z, -MAP_HALF, MAP_HALF);
  u.facing = Math.atan2(dx, dz);
  return step >= d - 0.001;
}

function faceToward(u, t) { u.facing = Math.atan2(t.x - u.x, t.z - u.z); }

function syncMesh(u, dt) {
  u.mesh.position.x = u.x; u.mesh.position.z = u.z;
  if (u.facing !== undefined) u.mesh.rotation.y = u.facing;
  // walk bob
  u.walkPhase += dt * 9;
  const moving = true;
  u.mesh.position.y = moving ? Math.abs(Math.sin(u.walkPhase)) * 0.12 : 0;
  // hit flash (cache original emissive so team glow is restored)
  if (u.hitFlash > 0) {
    u.hitFlash -= dt;
    u.mesh.traverse((o) => { if (o.isMesh && o.material && o.material.emissive) { if (o.material.userData._e === undefined) o.material.userData._e = o.material.emissive.getHex(); o.material.emissive.setHex(0x771111); } });
    if (u.hitFlash <= 0) {
      u.mesh.traverse((o) => { if (o.isMesh && o.material && o.material.emissive && o.material.userData._e !== undefined) { o.material.emissive.setHex(o.material.userData._e); } });
    }
  }
  if (u.mesh.userData.bar) u.mesh.userData.bar.userData.set(u.hp / u.maxHp, u.team);
}

// ---------- tower AI ----------
function updateTower(t, dt) {
  if (!t.alive) return;
  t.atkCd -= dt;
  const enemyTeam = t.team === 'blue' ? 'red' : 'blue';
  // prefer minions
  let target = null;
  let bd = t.atkRange;
  for (const m of G.minions) {
    if (m.team !== enemyTeam || !m.alive) continue;
    const d = dist2d(t, m);
    if (d < bd) { bd = d; target = m; }
  }
  const champ = enemyTeam === 'blue' ? G.player : G.enemy;
  if (champ && champ.alive && dist2d(t, champ) < t.atkRange) {
    const champAttacked = (G.time - champ.lastTowerAggro) < 3;
    if (!target || champAttacked) target = champ;
  }
  t.atkTarget = target;
  if (target && t.atkCd <= 0) {
    t.atkCd = t.atkTime;
    spawnProjectile({
      x: t.x, z: t.z, y: 9, dx: 0, dz: 0, speed: 20,
      dmg: target.kind === 'champ' ? t.ad * (1 + 0.25 * Math.min(3, (G.time - (t.rampStart || G.time)) / 2)) : t.ad,
      src: t, target, range: 30, color: 0xff3344, size: 0.55, type: 'magic',
    });
    AudioSys.tower();
  }
  if (t.mesh.userData.gem) t.mesh.userData.gem.rotation.y += dt * 1.5;
  if (t.mesh.userData.bar) t.mesh.userData.bar.userData.set(t.hp / t.maxHp, t.team);
}
// ================= PART 4: abilities, input, enemy AI, HUD, loop =================
function champTotalAd(c) { return c.ad + c.bonusAd; }

function castAbility(c, key, tx, tz) {
  const ab = ABILITIES[key];
  if (!c.alive || c.cds[key] > 0 || G.over) return false;
  if (c.mp < ab.mana) { if (c.isPlayer) feed(`Not enough mana for ${ab.name}!`); return false; }
  c.mp -= ab.mana; c.cds[key] = ab.cd;
  faceToward(c, { x: tx, z: tz });
  const dx = tx - c.x, dz = tz - c.z;
  const d = Math.max(0.001, Math.hypot(dx, dz));
  const nx = dx / d, nz = dz / d;
  if (key === 'Q') {
    spawnProjectile({ x: c.x, z: c.z, dx: nx, dz: nz, speed: 30, dmg: 70 + champTotalAd(c) * 0.7 + c.apBonus, src: c, range: 20, color: 0x9be8ff, size: 0.55, type: 'magic' });
    AudioSys.ability();
  } else if (key === 'W') {
    c.x = clamp(c.x + nx * 8, -MAP_HALF, MAP_HALF);
    c.z = clamp(c.z + nz * 8, -MAP_HALF, MAP_HALF);
    c.shield = 90 + c.level * 12; c.shieldT = 3;
    c.moveTarget = { x: c.x + nx * 4, z: c.z + nz * 4 };
    spawnHitParticles(c.x, 1.5, c.z, 0x66ffcc, 18);
    AudioSys.ability();
  } else if (key === 'E') {
    spawnHitParticles(c.x, 1.5, c.z, 0xffb63f, 26);
    G.shake = Math.min(1, G.shake + 0.3);
    for (const v of allEnemiesOf(c)) {
      if (v.alive && dist2d(c, v) < 7) dealDamage(c, v, 60 + champTotalAd(c) * 0.6 + c.apBonus * 0.7, 'phys');
    }
    AudioSys.ability();
  } else if (key === 'R') {
    G.shake = 1;
    AudioSys.ult();
    spawnHitParticles(tx, 1, tz, 0xffd75e, 40);
    // meteor marker then delayed blast
    setTimeout(() => {
      if (G.over) return;
      spawnHitParticles(tx, 1.5, tz, 0xff6a00, 46);
      for (const v of allEnemiesOf(c)) {
        if (v.alive && Math.hypot(v.x - tx, v.z - tz) < 7.5) {
          dealDamage(c, v, 220 + champTotalAd(c) * 0.8 + c.apBonus, 'magic');
          if (v.kind === 'champ' && v.isPlayer !== c.isPlayer) { /* chunk */ }
        }
      }
    }, 450);
  }
  return true;
}

// ---------- player input ----------
function groundPoint(clientX, clientY) {
  mouseNDC.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(mouseNDC, camera);
  const hits = raycaster.intersectObject(groundMesh);
  return hits.length ? hits[0].point : null;
}

function unitAt(clientX, clientY) {
  mouseNDC.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(mouseNDC, camera);
  const meshes = [];
  for (const m of G.minions) if (m.alive) meshes.push(m.mesh);
  for (const t of G.towers) if (t.alive) meshes.push(t.mesh);
  if (G.enemy && G.enemy.alive) meshes.push(G.enemy.mesh);
  if (G.nexus.red && G.nexus.red.alive) meshes.push(G.nexus.red.mesh);
  const hits = raycaster.intersectObjects(meshes, true);
  if (!hits.length) return null;
  let o = hits[0].object;
  while (o && !o.userData.unit) o = o.parent;
  return o ? o.userData.unit : null;
}

function setupInput() {
  window.addEventListener('contextmenu', (e) => e.preventDefault());
  let dragStart = null, dragging = false;

  canvas.addEventListener('mousedown', (e) => {
    AudioSys.init();
    if (!G.running || G.over || !G.player || !G.player.alive) return;
    if (e.button === 2) {
      const p = groundPoint(e.clientX, e.clientY);
      if (!p) return;
      const clicked = unitAt(e.clientX, e.clientY);
      const P = G.player;
      P.recallT = 0;
      if (clicked && clicked.team === 'red') {
        P.atkTarget = clicked; P.moveTarget = null;
        spawnMarker(clicked.x, clicked.z, true);
      } else {
        if (G.attackMove) {
          G.attackMove = false;
          P.moveTarget = { x: clamp(p.x, -MAP_HALF, MAP_HALF), z: clamp(p.z, -MAP_HALF, MAP_HALF), attackMove: true };
          spawnMarker(p.x, p.z, true);
        } else {
          P.atkTarget = null;
          P.moveTarget = { x: clamp(p.x, -MAP_HALF, MAP_HALF), z: clamp(p.z, -MAP_HALF, MAP_HALF) };
          spawnMarker(p.x, p.z, false);
        }
      }
    } else if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      dragStart = { x: e.clientX, y: e.clientY, cx: G.camLook.x, cz: G.camLook.z };
      dragging = true; G.camMode = 'free';
      e.preventDefault();
    } else if (e.button === 0 && G.attackMove) {
      const p = groundPoint(e.clientX, e.clientY);
      if (p) {
        G.player.moveTarget = { x: p.x, z: p.z, attackMove: true };
        G.player.atkTarget = null; G.attackMove = false;
        spawnMarker(p.x, p.z, true);
      }
    }
  });
  window.addEventListener('mousemove', (e) => {
    if (dragging && dragStart) {
      const dx = (e.clientX - dragStart.x) * 0.12, dz = (e.clientY - dragStart.y) * 0.12;
      G.camLook.x = clamp(dragStart.cx - dx, -MAP_HALF, MAP_HALF);
      G.camLook.z = clamp(dragStart.cz - dz, -MAP_HALF, MAP_HALF);
    }
  });
  window.addEventListener('mouseup', () => { dragging = false; });
  window.addEventListener('wheel', (e) => {
    const h = clamp(G.camOffset.y + Math.sign(e.deltaY) * 3, 16, 46);
    G.camOffset.y = h; G.camOffset.z = h * 0.57;
  }, { passive: true });

  window.addEventListener('keydown', (e) => {
    if (!G.running || G.over) return;
    const k = e.key.toUpperCase();
    const P = G.player;
    if (!P) return;
    if (k === 'Q' || k === 'W' || k === 'E' || k === 'R') {
      const p = groundPoint(window.innerWidth / 2, window.innerHeight * 0.42) || { x: P.x, z: P.z - 10 };
      // aim at mouse position
      const mp = lastMouseGround || p;
      castAbility(P, k, mp.x, mp.z);
    } else if (k === 'A') { G.attackMove = true; feed('Attack-move: left-click a spot'); }
    else if (k === ' ') { G.camMode = 'follow'; e.preventDefault(); }
    else if (k === 'B') { startRecall(P); }
    else if (k === 'P') { toggleShop(); }
    else if (k === 'ESCAPE') { $('shop').classList.add('hidden'); }
  });

  // track mouse ground for ability aiming
  window.addEventListener('mousemove', (e) => {
    mouseXY.x = e.clientX; mouseXY.y = e.clientY;
  });
}
const mouseXY = { x: 0, y: 0 };
let lastMouseGround = null;

function startRecall(c) {
  if (!c.alive || c.recallT > 0) return;
  c.recallT = 6; c.moveTarget = null; c.atkTarget = null;
  if (c.isPlayer) feed('Recalling in 6s… (moving cancels)');
}

// ---------- enemy AI ----------
function updateEnemyAI(e, dt) {
  if (G.over) return;
  if (!e.alive) {
    e.respawn -= dt;
    if (e.respawn <= 0) {
      e.alive = true; e.hp = e.maxHp; e.mp = e.maxMp;
      e.x = -2.5; e.z = -38; e.mesh.visible = true;
      e.ai.state = 'lane';
      feed('<b style="color:#ff4d5e">Crimson Fang</b> has returned to the Rift!');
    }
    return;
  }
  // fountain healing
  if (e.z < -34) { e.hp = Math.min(e.maxHp, e.hp + e.maxHp * 0.09 * dt); e.mp = Math.min(e.maxMp, e.mp + e.maxMp * 0.12 * dt); }
  const P = G.player;
  e.atkCd -= dt;
  for (const k of ['Q', 'W', 'E', 'R']) if (e.cds[k] > 0) e.cds[k] -= dt;
  if (e.shieldT > 0) { e.shieldT -= dt; if (e.shieldT <= 0) e.shield = 0; }
  e.ai.abilityT -= dt;

  const fountainZ = -44;
  const hpFrac = e.hp / e.maxHp;
  // retreat when weak
  if (hpFrac < 0.28 && e.ai.state !== 'retreat') { e.ai.state = 'retreat'; }
  if (e.ai.state === 'retreat') {
    moveUnitToward(e, e.x * 0.9, fountainZ, dt);
    if (Math.abs(e.z - fountainZ) < 6) {
      if (hpFrac > 0.85) e.ai.state = 'lane';
    }
    syncMesh(e, dt);
    return;
  }

  // pick target: player if close & killable, else nearest minion, else push
  let target = null;
  if (P && P.alive) {
    const d = dist2d(e, P);
    if (d < 12) target = P;
  }
  if (!target) target = nearestEnemy(e, 14);
  e.atkTarget = null;

  if (target) {
    const d = dist2d(e, target);
    // use abilities
    if (e.ai.abilityT <= 0 && e.mp > 120) {
      if (target.kind === 'champ' && d < 16 && e.cds.Q <= 0) { castAbility(e, 'Q', target.x, target.z); e.ai.abilityT = 1.2; }
      else if (d < 6 && e.cds.E <= 0) { castAbility(e, 'E', e.x + 1, e.z); e.ai.abilityT = 1.4; }
      else if (target.kind === 'champ' && target.hp < 220 && e.cds.R <= 0) { castAbility(e, 'R', target.x, target.z); e.ai.abilityT = 2; }
      else if (d > 8 && hpFrac > 0.5 && e.cds.W <= 0) { castAbility(e, 'W', target.x, target.z); e.ai.abilityT = 1.5; }
      else e.ai.abilityT = 0.5;
    }
    if (d <= e.atkRange + (target.kind === 'tower' ? 2 : 0)) {
      faceToward(e, target);
      if (e.atkCd <= 0) {
        e.atkCd = e.atkTime;
        dealDamage(e, target, champTotalAd(e), 'phys');
        if (target.kind === 'champ') target.lastTowerAggro = G.time;
      }
    } else {
      moveUnitToward(e, target.x, target.z, dt);
    }
  } else {
    // push lane toward blue nexus
    const tx = Math.sin(G.time * 0.3) * 2;
    moveUnitToward(e, tx, e.z + 8, dt);
    e.z = Math.min(e.z, 40);
  }
  syncMesh(e, dt);
}

// ---------- player update ----------
function updatePlayer(P, dt) {
  if (!P.alive) {
    P.respawn -= dt;
    $('respawn-timer').textContent = `${Math.ceil(P.respawn)}s — respawning…`;
    if (P.respawn <= 0) {
      P.alive = true; P.hp = P.maxHp; P.mp = P.maxMp;
      P.x = 2.5; P.z = 38; P.moveTarget = null; P.atkTarget = null;
      P.mesh.visible = true;
      $('death-overlay').classList.add('hidden');
      feed('You respawned');
    }
    return;
  }
  P.atkCd -= dt;
  for (const k of ['Q', 'W', 'E', 'R']) if (P.cds[k] > 0) P.cds[k] -= dt;
  if (P.shieldT > 0) { P.shieldT -= dt; if (P.shieldT <= 0) P.shield = 0; }
  P.mp = Math.min(P.maxMp, P.mp + dt * (6 + P.level));
  // fountain healing
  if (P.z > 34) { P.hp = Math.min(P.maxHp, P.hp + P.maxHp * 0.09 * dt); P.mp = Math.min(P.maxMp, P.mp + P.maxMp * 0.12 * dt); }
  // recall
  if (P.recallT > 0) {
    P.recallT -= dt;
    if (P.recallT <= 0) {
      P.x = 2.5; P.z = 40; P.hp = P.maxHp; P.mp = P.maxMp;
      P.moveTarget = null; feed('Recalled!');
      spawnHitParticles(P.x, 2, P.z, 0x35b6ff, 24);
    }
  }
  // validate attack target
  if (P.atkTarget && (!P.atkTarget.alive || P.atkTarget.hp <= 0)) P.atkTarget = null;
  // auto-acquire for attack-move
  if (P.moveTarget && P.moveTarget.attackMove && !P.atkTarget) {
    const foe = nearestEnemy(P, 8);
    if (foe) P.atkTarget = foe;
  }
  if (P.atkTarget) {
    const t = P.atkTarget;
    const d = dist2d(P, t);
    const rng = P.atkRange + (t.kind === 'tower' || t.kind === 'nexus' ? 2 : 0);
    if (d <= rng) {
      faceToward(P, t);
      if (P.atkCd <= 0) {
        P.atkCd = P.atkTime;
        dealDamage(P, t, champTotalAd(P), 'phys');
        spawnHitParticles(t.x, 1.5, t.z, 0xffffff, 4);
        if (t.kind === 'champ') t.lastTowerAggro = G.time;
        // sword swing anim
        if (P.mesh.userData.sword) P.mesh.userData.sword.rotation.x = 0.9;
      }
    } else {
      moveUnitToward(P, t.x, t.z, dt);
    }
  } else if (P.moveTarget) {
    const arrived = moveUnitToward(P, P.moveTarget.x, P.moveTarget.z, dt);
    if (arrived) P.moveTarget = null;
  }
  if (P.mesh.userData.sword) P.mesh.userData.sword.rotation.x *= 0.85;
  syncMesh(P, dt);
  if (P.mesh.userData.bar) P.mesh.userData.bar.userData.set((P.hp + P.shield) / (P.maxHp + 0), P.team);
}

// ================= HUD =================
function feed(html) {
  const el = document.createElement('div');
  el.className = 'feed-item'; el.innerHTML = html;
  $('killfeed').prepend(el);
  while ($('killfeed').children.length > 5) $('killfeed').lastChild.remove();
  setTimeout(() => { if (el.parentNode) el.remove(); }, 7000);
}
function announce(text) {
  const a = $('announce');
  a.textContent = text; a.classList.remove('hidden');
  a.style.animation = 'none'; void a.offsetWidth; a.style.animation = '';
  clearTimeout(a._t);
  a._t = setTimeout(() => a.classList.add('hidden'), 2500);
}
function showDeath() { $('death-overlay').classList.remove('hidden'); }
function flashDamageVignette() {
  const v = $('damage-vignette');
  v.style.opacity = 0.85;
  clearTimeout(v._t);
  v._t = setTimeout(() => (v.style.opacity = 0), 220);
}

function updateHUD() {
  const P = G.player;
  if (!P) return;
  $('hp-fill').style.width = `${clamp((P.hp / P.maxHp) * 100, 0, 100)}%`;
  $('hp-text').textContent = `${Math.max(0, Math.ceil(P.hp))} / ${P.maxHp}`;
  $('hp-bar').classList.toggle('low', P.hp / P.maxHp < 0.3);
  $('mp-fill').style.width = `${clamp((P.mp / P.maxMp) * 100, 0, 100)}%`;
  $('mp-text').textContent = `${Math.max(0, Math.ceil(P.mp))} / ${P.maxMp}`;
  $('xp-fill').style.width = `${clamp((P.xp / P.xpNeed) * 100, 0, 100)}%`;
  $('level-badge').textContent = P.level;
  $('gold-val').textContent = Math.floor(P.gold);
  $('shop-gold').textContent = `${Math.floor(P.gold)}g`;
  $('kda-val').textContent = `${P.kills} / ${P.deaths} / ${P.cs} CS`;
  const t = Math.floor(G.time);
  $('match-timer').textContent = `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
  $('blue-kills').textContent = G.blueKills; $('red-kills').textContent = G.redKills;
  const bt = G.towers.filter((x) => x.team === 'blue' && x.alive).length;
  const rt = G.towers.filter((x) => x.team === 'red' && x.alive).length;
  $('tower-score').innerHTML = `<span class="blue">${'◆'.repeat(bt)}${'◇'.repeat(2 - bt)}</span> <span id="cs-score">${P.cs} CS</span> <span class="red">${'◆'.repeat(rt)}${'◇'.repeat(2 - rt)}</span>`;
  for (const k of ['Q', 'W', 'E', 'R']) {
    const el = $(`abil-${k.toLowerCase()}`);
    const cd = P.cds[k];
    el.classList.toggle('on-cd', cd > 0);
    el.classList.toggle('no-mana', P.mp < ABILITIES[k].mana);
    el.querySelector('.cd').textContent = cd > 0 ? cd.toFixed(1) : '';
  }
}

function drawMinimap() {
  const c = $('minimap'), g = c.getContext('2d');
  const S = c.width, half = MAP_HALF;
  const px = (x) => ((x + half) / (half * 2)) * S;
  const pz = (z) => ((z + half) / (half * 2)) * S;
  g.fillStyle = '#12331a'; g.fillRect(0, 0, S, S);
  g.fillStyle = '#b89a5e'; g.fillRect(px(-6), 0, px(6) - px(-6), S);
  g.fillStyle = '#2e9fc4'; g.fillRect(0, pz(-4.5), S, pz(4.5) - pz(-4.5));
  const dot = (x, z, color, r = 3) => { g.fillStyle = color; g.beginPath(); g.arc(px(x), pz(z), r, 0, 7); g.fill(); };
  for (const m of G.minions) if (m.alive) dot(m.x, m.z, m.team === 'blue' ? '#5ec9ff' : '#ff7d88', 2);
  for (const t of G.towers) if (t.alive) dot(t.x, t.z, t.team === 'blue' ? '#1f7fff' : '#ff2222', 4);
  if (G.nexus.blue.alive) dot(0, 42, '#1f7fff', 5);
  if (G.nexus.red.alive) dot(0, -42, '#ff2222', 5);
  if (G.player && G.player.alive) dot(G.player.x, G.player.z, '#ffffff', 3.5);
  if (G.enemy && G.enemy.alive) dot(G.enemy.x, G.enemy.z, '#ff00aa', 3.5);
}

// ---------- shop ----------
const SHOP_ITEMS = {
  sword: { cost: 350, apply: (c) => { c.bonusAd += 15; } },
  ruby:  { cost: 400, apply: (c) => { c.maxHp += 180; c.hp += 180; } },
  boots: { cost: 300, apply: (c) => { c.speed *= 1.12; } },
  tome:  { cost: 450, apply: (c) => { c.apBonus += 25; } },
  mana:  { cost: 300, apply: (c) => { c.maxMp += 150; c.mp += 150; } },
  armor: { cost: 400, apply: (c) => { c.armor += 12; } },
};
function toggleShop(force) {
  const s = $('shop');
  const show = force !== undefined ? force : s.classList.contains('hidden');
  s.classList.toggle('hidden', !show);
  $('shop-msg').textContent = '';
}
function setupShop() {
  document.querySelectorAll('.shop-item').forEach((b) => {
    b.addEventListener('click', () => {
      const P = G.player;
      const it = SHOP_ITEMS[b.dataset.item];
      if (P.gold >= it.cost) {
        P.gold -= it.cost;
        it.apply(P);
        if (P.hp > P.maxHp) P.hp = P.maxHp;
        b.classList.add('owned');
        $('shop-msg').textContent = `Purchased ${b.dataset.item}! (+power)`;
        AudioSys.gold();
      } else {
        $('shop-msg').textContent = 'Not enough gold — farm minions!';
      }
    });
  });
  $('shop-close').addEventListener('click', () => toggleShop(false));
  $('shop-btn').addEventListener('click', () => toggleShop());
  $('recall-btn').addEventListener('click', () => startRecall(G.player));
  document.querySelectorAll('.abil').forEach((el) => {
    el.addEventListener('click', () => {
      if (!G.player || !G.running) return;
      const k = el.id.replace('abil-', '').toUpperCase();
      const mg = lastMouseGround || { x: G.player.x, z: G.player.z - 8 };
      castAbility(G.player, k, mg.x, mg.z);
    });
  });
  $('mute-btn').addEventListener('click', () => {
    AudioSys.muted = !AudioSys.muted;
    $('mute-btn').textContent = AudioSys.muted ? '🔇' : '🔊';
  });
}

// ---------- camera ----------
function updateCamera(dt) {
  const P = G.player;
  if (G.camMode === 'follow' && P) {
    G.camLook.x = lerp(G.camLook.x, P.x, 1 - Math.pow(0.001, dt));
    G.camLook.z = lerp(G.camLook.z, P.z + 2, 1 - Math.pow(0.001, dt));
  }
  const want = new THREE.Vector3(G.camLook.x + G.camOffset.x, G.camOffset.y, G.camLook.z + G.camOffset.z);
  G.camPos.lerp(want, 1 - Math.pow(0.0005, dt));
  if (G.shake > 0) {
    G.shake = Math.max(0, G.shake - dt * 2.2);
    G.camPos.x += (Math.random() - 0.5) * G.shake * 1.6;
    G.camPos.y += (Math.random() - 0.5) * G.shake * 1.2;
  }
  camera.position.copy(G.camPos);
  camera.lookAt(G.camLook.x, 0, G.camLook.z);
}

// ---------- game flow ----------
function endGame(winner) {
  if (G.over) return;
  G.over = true;
  AudioSys.kill();
  const win = winner === 'blue';
  const P = G.player;
  setTimeout(() => {
    $('endscreen').classList.remove('hidden');
    $('end-title').textContent = win ? 'VICTORY' : 'DEFEAT';
    $('end-title').className = win ? 'win' : 'lose';
    const t = Math.floor(G.time);
    $('end-stats').innerHTML =
      `${win ? 'The enemy Nexus has exploded! The Rift is yours.' : 'Your Nexus has fallen… Try again, summoner.'}<br>` +
      `⏱️ ${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')} &nbsp;·&nbsp; ⚔️ ${P.kills}/${P.deaths} &nbsp;·&nbsp; 🌾 ${P.cs} CS &nbsp;·&nbsp; Lv ${P.level} &nbsp;·&nbsp; 💰 ${Math.floor(P.gold)}g`;
  }, 1200);
  if (winner === 'blue') announce('VICTORY!');
  else announce('DEFEAT…');
}

function resetWorld() {
  // remove old entities
  for (const m of [...G.minions]) scene.remove(m.mesh);
  for (const t of [...G.towers]) scene.remove(t.mesh);
  for (const p of [...G.projectiles]) scene.remove(p.mesh);
  for (const pa of [...G.particles]) scene.remove(pa.mesh);
  for (const mk of [...G.markers]) scene.remove(mk.mesh);
  G.minions = []; G.projectiles = []; G.particles = []; G.markers = [];
  G.towers = [];
  if (G.player) scene.remove(G.player.mesh);
  if (G.enemy) scene.remove(G.enemy.mesh);
  if (G.nexus.blue) scene.remove(G.nexus.blue.mesh);
  if (G.nexus.red) scene.remove(G.nexus.red.mesh);
  G.time = 0; G.lastWave = -99; G.blueKills = 0; G.redKills = 0; G.firstBlood = false;
  G.over = false; G.shake = 0;
  $('killfeed').innerHTML = '';
  $('death-overlay').classList.add('hidden');
  $('endscreen').classList.add('hidden');

  const tpl = CHAMPS[G.selectedChamp];
  G.player = spawnChampion(tpl, 'blue', true);
  $('portrait-icon').textContent = tpl.emoji;
  G.enemy = spawnChampion(ENEMY_CHAMP, 'red', false);
  spawnTower('blue', 30); spawnTower('blue', 15);
  spawnTower('red', -30); spawnTower('red', -15);
  spawnNexus('blue', 43); spawnNexus('red', -43);
  if (!scene.getObjectByName('fountain-blue')) {
    makeFountain('blue', 40); makeFountain('red', -40);
  }
  G.camLook.set(0, 0, 36); G.camPos.set(0, 30, 53); G.camMode = 'follow';
  spawnWave(); G.lastWave = 0;
}

// ---------- main loop ----------
let hudT = 0, mmT = 0;
function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, clock.getDelta());
  if (!G.running) {
    // idle menu background orbit
    if (!G.over) {
      const t = performance.now() * 0.00008;
      camera.position.set(Math.sin(t) * 44, 27, Math.cos(t) * 44);
      camera.lookAt(0, 2, 0);
      const orb0 = scene.getObjectByName('midOrb');
      if (orb0) orb0.rotation.y += dt;
    }
    renderer.render(scene, camera);
    return;
  }
  if (G.running && !document.hidden) {
    G.time += dt;
    // passive gold
    if (G.player && G.player.alive) G.player.gold += dt * 2.4;
    if (G.enemy && G.enemy.alive) G.enemy.gold += dt * 2.6;
    // waves
    if (G.time - G.lastWave > 24) { spawnWave(); G.lastWave = G.time; }
    // enemy buys items over time
    if (G.enemy && G.enemy.alive && G.enemy.gold > 700) {
      G.enemy.gold -= 350; G.enemy.bonusAd += 12; G.enemy.maxHp += 100; G.enemy.hp += 100;
    }
    // updates
    updatePlayer(G.player, dt);
    updateEnemyAI(G.enemy, dt);
    for (const m of [...G.minions]) updateMinion(m, dt);
    for (const t of G.towers) updateTower(t, dt);
    updateProjectiles(dt);
    updateParticles(dt);
    updateMarkers(dt);
    // nexus crystal spin
    for (const k of ['blue', 'red']) {
      const n = G.nexus[k];
      if (n && n.alive && n.mesh.userData.crystal) n.mesh.userData.crystal.rotation.y += dt;
      if (n && n.mesh.userData.bar) n.mesh.userData.bar.userData.set(n.hp / n.maxHp, n.team);
    }
    const orb = scene.getObjectByName('midOrb');
    if (orb) { orb.rotation.y += dt * 0.8; orb.position.y = 3 + Math.sin(G.time * 1.5) * 0.25; }
    lastMouseGround = groundPoint(mouseXY.x, mouseXY.y);
    updateCamera(dt);
    hudT += dt;
    if (hudT > 0.12) { hudT = 0; updateHUD(); }
    mmT += dt;
    if (mmT > 0.3) { mmT = 0; drawMinimap(); }
    // track kills for scoreboard
    G.blueKills = (G.enemy ? G.enemy.deaths : 0);
    G.redKills = (G.player ? G.player.deaths : 0);
  }
  renderer.render(scene, camera);
}

// ---------- boot ----------
function boot() {
  try {
    initThree();
  } catch (e) {
    $('loading').textContent = 'WebGL unavailable in this browser.';
    return;
  }
  buildMap();
  setupInput();
  setupShop();
  document.querySelectorAll('.champ-card').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.champ-card').forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      G.selectedChamp = card.dataset.champ;
      AudioSys.init(); AudioSys.gold();
    });
  });
  $('play-btn').addEventListener('click', () => {
    AudioSys.init();
    $('menu').classList.add('hidden');
    ['topbar', 'hud', 'minimap-wrap'].forEach((id) => $(id).classList.remove('hidden'));
    resetWorld();
    G.running = true;
    announce('WELCOME TO THE RIFT!');
    feed('Destroy the <b style="color:#ff5d5d">RED NEXUS</b> to win!');
    setTimeout(() => { if (!G.over) announce('MINIONS HAVE SPAWNED!'); }, 2600);
  });
  $('again-btn').addEventListener('click', () => {
    resetWorld();
    G.running = true;
    announce('WELCOME BACK!');
  });
  G.running = false;
  // idle menu background orbit is handled inside loop() when !G.running
  loop();
  $('loading').style.display = 'none';
  // expose for automated verification
  window.__game = { G, ABILITIES, CHAMPS };
}

boot();
