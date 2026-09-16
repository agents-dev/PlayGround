import * as THREE from 'three';
import {
  BatchedRenderer, ParticleSystem, PointEmitter,
  ConstantValue, IntervalValue, ConstantColor,
  ColorOverLife, SizeOverLife, ApplyForce,
  Gradient, PiecewiseBezier, Bezier, RenderMode,
} from 'three.quarks';

// ============ BRUTALSTRIKE — tactical browser FPS ============
const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const params = new URLSearchParams(location.search);

const app = $('app'), hud = $('hud'), menu = $('menu'), gameoverEl = $('gameover');
const dmgEl = $('dmg'), healEl = $('heal'), toastEl = $('toast');

// ---------- renderer / scene ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap; // PCFSoftShadowMap was removed in three r166+
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
renderer.domElement.className = 'game';
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87a6c4);
scene.fog = new THREE.Fog(0x9db3c8, 40, 160);

const camera = new THREE.PerspectiveCamera(78, innerWidth / innerHeight, 0.08, 500);
camera.position.set(0, 1.7, 14);
camera.rotation.order = 'YXZ';

scene.add(new THREE.HemisphereLight(0xbdd3ea, 0x3a3f35, 0.85));
const sun = new THREE.DirectionalLight(0xfff1d6, 2.2);
sun.position.set(-38, 55, 22);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -70; sun.shadow.camera.right = 70;
sun.shadow.camera.top = 70; sun.shadow.camera.bottom = -70;
sun.shadow.camera.far = 160; sun.shadow.bias = -0.0004;
scene.add(sun);
const fill = new THREE.DirectionalLight(0x88aaff, 0.35);
fill.position.set(30, 20, -40); scene.add(fill);

// sky dome (gradient shader) + sun disc + clouds
{
  const skyGeo = new THREE.SphereGeometry(400, 24, 16);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(0x3d6ca8) }, mid: { value: new THREE.Color(0x87a6c4) }, bot: { value: new THREE.Color(0xd8c9a8) } },
    vertexShader: 'varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: 'varying vec3 vP; uniform vec3 top,mid,bot; void main(){ float h=normalize(vP).y; vec3 c=h>0.0?mix(mid,top,pow(h,0.6)):mix(mid,bot,pow(-h,0.7)); gl_FragColor=vec4(c,1.0); }'
  });
  scene.add(new THREE.Mesh(skyGeo, skyMat));
  const sunSpr = new THREE.Mesh(new THREE.CircleGeometry(14, 32),
    new THREE.MeshBasicMaterial({ color: 0xfff6dd, fog: false, transparent: true, opacity: 0.95 }));
  sunSpr.position.set(-190, 200, 110); sunSpr.lookAt(0, 0, 0); scene.add(sunSpr);
  const glow = new THREE.Mesh(new THREE.CircleGeometry(30, 32),
    new THREE.MeshBasicMaterial({ color: 0xfff2c4, fog: false, transparent: true, opacity: 0.28 }));
  glow.position.copy(sunSpr.position); glow.lookAt(0, 0, 0); scene.add(glow);
}

// ---------- procedural canvas textures ----------
function canvasTex(size, fn, rx = 1, ry = 1) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  fn(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry);
  t.anisotropy = 4; t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const groundTex = canvasTex(512, (g, s) => {
  g.fillStyle = '#8a8478'; g.fillRect(0, 0, s, s);
  for (let i = 0; i < 5200; i++) { g.fillStyle = `rgba(${60 + Math.random() * 40 | 0},${58 + Math.random() * 36 | 0},${50 + Math.random() * 30 | 0},0.5)`; g.fillRect(Math.random() * s, Math.random() * s, 2, 2); }
  g.strokeStyle = 'rgba(0,0,0,0.28)'; g.lineWidth = 3;
  for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * s / 4, 0); g.lineTo(i * s / 4, s); g.stroke(); g.beginPath(); g.moveTo(0, i * s / 4); g.lineTo(s, i * s / 4); g.stroke(); }
  g.fillStyle = 'rgba(70,60,40,0.25)';
  for (let i = 0; i < 14; i++) { g.beginPath(); g.ellipse(Math.random() * s, Math.random() * s, 20 + Math.random() * 50, 12 + Math.random() * 30, Math.random() * 3, 0, 7); g.fill(); }
}, 18, 18);
const wallTex = canvasTex(256, (g, s) => {
  g.fillStyle = '#a89f8d'; g.fillRect(0, 0, s, s);
  g.fillStyle = 'rgba(0,0,0,0.12)';
  for (let y = 0; y < 8; y++) for (let x = 0; x < 4; x++) g.fillRect(x * 64 + (y % 2) * 32, y * 32, 60, 28);
  g.fillStyle = 'rgba(255,255,255,0.08)'; g.fillRect(0, 0, s, 10);
}, 4, 1);
const crateTex = canvasTex(256, (g, s) => {
  g.fillStyle = '#7a5c33'; g.fillRect(0, 0, s, s);
  for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${90 + Math.random() * 50 | 0},${60 + Math.random() * 35 | 0},30,0.4)`; g.fillRect(Math.random() * s, Math.random() * s, 3, 2); }
  g.strokeStyle = '#4a3517'; g.lineWidth = 14; g.strokeRect(0, 0, s, s);
  g.beginPath(); g.moveTo(0, 0); g.lineTo(s, s); g.moveTo(s, 0); g.lineTo(0, s); g.stroke();
}, 1, 1);
function containerTex(color) {
  return canvasTex(256, (g, s) => {
    g.fillStyle = color; g.fillRect(0, 0, s, s);
    g.fillStyle = 'rgba(0,0,0,0.3)';
    for (let x = 0; x < s; x += 32) g.fillRect(x, 0, 10, s);
    g.fillStyle = 'rgba(255,255,255,0.12)';
    for (let x = 5; x < s; x += 32) g.fillRect(x, 0, 4, s);
    g.fillStyle = 'rgba(0,0,0,0.45)'; g.font = 'bold 34px sans-serif'; g.fillText('BRUTAL', 40, 120); g.fillText('CARGO', 55, 160);
  }, 2, 1);
}

// ---------- map ----------
const colliders = []; // {min:Vector3,max:Vector3}
function addCollider(x, y, z, w, h, d) {
  colliders.push({ min: new THREE.Vector3(x - w / 2, y - h / 2, z - d / 2), max: new THREE.Vector3(x + w / 2, y + h / 2, z + d / 2) });
}
const mapGroup = new THREE.Group(); scene.add(mapGroup);
function box(w, h, d, mat, x, y, z, collide = true, shadow = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = shadow; m.receiveShadow = true;
  mapGroup.add(m);
  if (collide) addCollider(x, y, z, w, h, d);
  return m;
}
{
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(140, 140),
    new THREE.MeshStandardMaterial({ map: groundTex, roughness: 0.95, metalness: 0.02 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; mapGroup.add(ground);
  // dark asphalt mid-strip (runway feel)
  const strip = new THREE.Mesh(new THREE.PlaneGeometry(16, 120),
    new THREE.MeshStandardMaterial({ color: 0x3c3f44, roughness: 0.9 }));
  strip.rotation.x = -Math.PI / 2; strip.position.y = 0.01; strip.receiveShadow = true; mapGroup.add(strip);
  for (let i = -5; i <= 5; i++) {
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 3),
      new THREE.MeshBasicMaterial({ color: 0xd8b13a }));
    dash.rotation.x = -Math.PI / 2; dash.position.set(0, 0.02, i * 10); mapGroup.add(dash);
  }
  const wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.9 });
  box(140, 6, 2, wallMat, 0, 3, -60); box(140, 6, 2, wallMat, 0, 3, 60);
  box(2, 6, 122, wallMat, -60, 3, 0); box(2, 6, 122, wallMat, 60, 3, 0);
  // watchtowers
  const woodMat = new THREE.MeshStandardMaterial({ map: crateTex, roughness: 0.85 });
  [[-44, -44], [44, 44], [-44, 44], [44, -44]].forEach(([x, z]) => {
    box(5, 9, 5, woodMat, x, 4.5, z);
    box(7, 0.5, 7, woodMat, x, 9.2, z);
    box(7, 1.2, 0.3, woodMat, x, 10, z - 3.4); box(7, 1.2, 0.3, woodMat, x, 10, z + 3.4);
  });
  // shipping containers
  const contColors = ['#b3402e', '#2e6db3', '#3f8a3c', '#b3892e'];
  const contMats = contColors.map(c => new THREE.MeshStandardMaterial({ map: containerTex(c), roughness: 0.6, metalness: 0.35 }));
  const conts = [
    [-18, 1.5, -20, 0], [-18, 4.1, -20, 0], [18, 1.5, 18, 1], [20, 1.5, -8, 0],
    [-24, 1.5, 12, 1], [8, 1.5, -30, 0], [-8, 1.5, 28, 0], [30, 1.5, -28, 1], [-32, 1.5, -6, 0],
  ];
  conts.forEach(([x, y, z, r], i) => {
    const m = box(12, 2.6, 3, contMats[i % 4], x, y, z);
    if (r) { m.rotation.y = Math.PI / 2; }
    // fix collider after rotation
    colliders.pop();
    addCollider(x, y, z, r ? 3 : 12, 2.6, r ? 12 : 3);
  });
  // crates clusters
  const crateMat = new THREE.MeshStandardMaterial({ map: crateTex, roughness: 0.85 });
  const crateSpots = [[0, -12], [12, 4], [-12, 6], [26, 8], [-28, -22], [6, 22], [-6, -32], [34, 30], [-36, 28], [0, 38]];
  crateSpots.forEach(([x, z]) => {
    box(2, 2, 2, crateMat, x, 1, z);
    if (Math.random() > 0.4) box(2, 2, 2, crateMat, x + 2.1, 1, z + 0.4);
    if (Math.random() > 0.6) box(2, 2, 2, crateMat, x + 0.3, 3, z - 0.2);
  });
  // mid building ruins (two walls + roof slab)
  const ruinMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.95, color: 0xbdb49e });
  box(16, 5, 1, ruinMat, -8, 2.5, -2); box(1, 5, 14, ruinMat, -16, 2.5, 5);
  box(14, 1, 12, ruinMat, 24, 4.5, -14);
  box(1, 4, 10, ruinMat, 17, 2, -14);
  box(1, 4.5, 1, ruinMat, 30.5, 2.25, -19.5); box(1, 4.5, 1, ruinMat, 30.5, 2.25, -8.5);
  box(1, 4.5, 1, ruinMat, 17.5, 2.25, -8.5);
  // barrels
  const barrelMat = new THREE.MeshStandardMaterial({ color: 0x8a2f23, roughness: 0.55, metalness: 0.5 });
  const barrelMat2 = new THREE.MeshStandardMaterial({ color: 0x2f5a3a, roughness: 0.55, metalness: 0.5 });
  for (let i = 0; i < 16; i++) {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.5, 14), i % 2 ? barrelMat : barrelMat2);
    const bx = rand(-50, 50), bz = rand(-50, 50);
    b.position.set(bx, 0.75, bz); b.castShadow = b.receiveShadow = true; mapGroup.add(b);
    addCollider(bx, 0.75, bz, 1.2, 1.5, 1.2);
  }
  // floodlight poles
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x22262b, roughness: 0.5, metalness: 0.7 });
  [[-20, -40], [20, 40], [-40, 20], [40, -20]].forEach(([x, z]) => {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 13, 10), poleMat);
    p.position.set(x, 6.5, z); p.castShadow = true; mapGroup.add(p);
    const head = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.7, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x111318, emissive: 0xffedb8, emissiveIntensity: 1.6 }));
    head.position.set(x, 13, z); mapGroup.add(head);
    const pl = new THREE.PointLight(0xffe6b0, 60, 34, 1.8); pl.position.set(x, 12.4, z); scene.add(pl);
    addCollider(x, 6.5, z, 0.6, 13, 0.6);
  });
}
const spawnPoints = [
  new THREE.Vector3(0, 0, 48), new THREE.Vector3(-40, 0, 30), new THREE.Vector3(40, 0, 30),
  new THREE.Vector3(-45, 0, -35), new THREE.Vector3(45, 0, -35), new THREE.Vector3(0, 0, -48),
  new THREE.Vector3(-25, 0, 0), new THREE.Vector3(25, 0, 0),
];
// team bases: BLUE defends south (+Z), RED defends north (-Z)
const blueSpawns = [
  new THREE.Vector3(0, 0, 48), new THREE.Vector3(-40, 0, 30),
  new THREE.Vector3(40, 0, 30), new THREE.Vector3(-20, 0, 42),
];
const redSpawns = [
  new THREE.Vector3(0, 0, -48), new THREE.Vector3(-45, 0, -35),
  new THREE.Vector3(45, 0, -35), new THREE.Vector3(20, 0, -42),
];
function teamSpawn(team) {
  const list = team === 'blue' ? blueSpawns : redSpawns;
  return list[Math.floor(Math.random() * list.length)].clone();
}

// ---------- audio (all procedural, no assets) ----------
const AudioSys = {
  ctx: null, master: null,
  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.master = this.ctx.createGain(); this.master.gain.value = 0.55;
    this.master.connect(this.ctx.destination);
  },
  env(node, t0, peak, decay) {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + decay);
    node.connect(g); g.connect(this.master);
  },
  shot(suppressed = false, big = false) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const len = big ? 0.35 : 0.22;
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.2);
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    const f = this.ctx.createBiquadFilter(); f.type = 'lowpass';
    f.frequency.value = big ? 900 : suppressed ? 1400 : 3200;
    src.connect(f); this.env(f, t, big ? 0.9 : 0.7, len);
    src.start(t);
    const o = this.ctx.createOscillator(); o.type = 'square';
    o.frequency.setValueAtTime(big ? 120 : 180, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
    this.env(o, t, 0.35, 0.14); o.start(t); o.stop(t + 0.16);
  },
  enemyShot(dist) {
    if (!this.ctx) return;
    const v = clamp(1 - dist / 90, 0.08, 0.6);
    const t = this.ctx.currentTime;
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.18, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.5);
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    const f = this.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1400;
    src.connect(f); this.env(f, t, v, 0.18); src.start(t);
  },
  reload() {
    if (!this.ctx) return; const t = this.ctx.currentTime;
    [0, 0.16, 0.34].forEach((dt, i) => {
      const o = this.ctx.createOscillator(); o.type = 'square';
      o.frequency.value = [700, 420, 900][i];
      this.env(o, t + dt, 0.12, 0.07); o.start(t + dt); o.stop(t + dt + 0.09);
    });
  },
  hit(kill = false) {
    if (!this.ctx) return; const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator(); o.type = 'sine';
    o.frequency.value = kill ? 880 : 1320;
    this.env(o, t, 0.25, kill ? 0.25 : 0.09); o.start(t); o.stop(t + 0.3);
  },
  hurt() {
    if (!this.ctx) return; const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(60, t + 0.25);
    this.env(o, t, 0.4, 0.3); o.start(t); o.stop(t + 0.32);
  },
  step() {
    if (!this.ctx) return; const t = this.ctx.currentTime;
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.07, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const s = this.ctx.createBufferSource(); s.buffer = buf;
    const f = this.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 500;
    s.connect(f); this.env(f, t, 0.10, 0.07); s.start(t);
  }
};

// ---------- weapons ----------
const WEAPONS = [
  { name: 'BR-7 ASSAULT', mag: 30, reserve: 120, rpm: 640, dmg: 26, spread: 0.011, adsSpread: 0.002, reloadT: 1.7, kick: 0.011, range: 90, auto: true, big: true, color: 0x1c1e22 },
  { name: 'VK SMG', mag: 40, reserve: 160, rpm: 800, dmg: 19, spread: 0.017, adsSpread: 0.004, reloadT: 1.4, kick: 0.008, range: 60, auto: true, big: false, color: 0x2a2d33 },
];
const state = {
  mode: 'menu', team: 'blue', kills: 0, deaths: 0, hp: 100, lastHurt: -99,
  blueScore: 0, redScore: 0, targetScore: 30,
  wi: 0, magAmmo: [30, 40], reserveAmmo: [120, 160], reloadingUntil: 0,
  firing: false, ads: false, adsK: 0, nextShot: 0, yaw: 0, pitch: 0,
  pos: new THREE.Vector3(0, 1.7, 48), vel: new THREE.Vector3(),
  onGround: true, crouch: false, bobT: 0, stepT: 0, recoil: 0,
  timeLeft: 300, matchOver: false, shake: 0, spectate: false,
};
const TEAM_COLOR = { blue: '#5aa9ff', red: '#ff6b60' };

// viewmodel rig
const gunRig = new THREE.Group(); camera.add(gunRig); scene.add(camera);
gunRig.position.set(0.28, -0.27, -0.55);
let gunMeshes = [], muzzleFlash, muzzleLight, gunTip;
function buildGun(def) {
  while (gunRig.children.length) {
    const c = gunRig.children.pop();
    c.traverse?.(o => { o.geometry?.dispose?.(); });
  }
  gunMeshes = [];
  const m = (geo, color, x, y, z, emissive = 0, ei = 0) => {
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness: 0.42, metalness: 0.72, emissive, emissiveIntensity: ei }));
    mesh.position.set(x, y, z); gunRig.add(mesh); gunMeshes.push(mesh); return mesh;
  };
  m(new THREE.BoxGeometry(0.07, 0.11, 0.62), def.color, 0, 0, -0.1);            // receiver
  m(new THREE.CylinderGeometry(0.022, 0.022, 0.42, 12), 0x0e0f12, 0, 0.015, -0.55).rotation.x = Math.PI / 2; // barrel
  m(new THREE.BoxGeometry(0.05, 0.09, 0.16), 0x33363c, 0, -0.02, 0.05);          // stock/grip
  m(new THREE.BoxGeometry(0.055, 0.14, 0.09), 0x141518, 0, -0.12, 0.12).rotation.x = 0.25; // grip
  m(new THREE.BoxGeometry(0.05, 0.12, 0.1), 0x141518, 0, -0.1, -0.12);           // mag
  m(new THREE.BoxGeometry(0.02, 0.05, 0.02), 0x111111, 0, 0.085, -0.28);         // front sight
  m(new THREE.BoxGeometry(0.05, 0.02, 0.12), def.big ? 0x8a5a1e : 0x1e5a8a, 0, 0.065, -0.05); // rail accent
  const sight = m(new THREE.BoxGeometry(0.055, 0.055, 0.03), 0x0c0d10, 0, 0.085, 0.02, 0x33ff88, def.big ? 0 : 0.9);
  sight.name = 'sight';
  gunTip = new THREE.Object3D(); gunTip.position.set(0, 0.015, -0.8); gunRig.add(gunTip);
  muzzleFlash = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.34, 8),
    new THREE.MeshBasicMaterial({ color: 0xffd76a, transparent: true, opacity: 0 }));
  muzzleFlash.position.copy(gunTip.position); muzzleFlash.rotation.x = -Math.PI / 2; gunRig.add(muzzleFlash);
  muzzleLight = new THREE.PointLight(0xffc861, 0, 9, 1.8); muzzleLight.position.set(0.2, -0.1, -1.2);
  camera.add(muzzleLight);
}
buildGun(WEAPONS[0]);

// tracers pool
const tracers = [];
for (let i = 0; i < 24; i++) {
  const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xffe2a0, transparent: true, opacity: 0 }));
  scene.add(l); tracers.push({ line: l, life: 0 });
}
function fireTracer(a, b) {
  const t = tracers.find(t => t.life <= 0) || tracers[0];
  t.line.geometry.setFromPoints([a, b]);
  t.line.material.opacity = 0.9; t.life = 0.09;
}
// impact particles — three.quarks (github.com/Alchemist0823/three.quarks, MIT).
// Pooled one-shot systems with batched rendering. The library owns each
// particle's whole lifecycle (spawn → fade → destroy), so dead sparks can
// never freeze mid-air the way a hand-rolled THREE.Points pool can.
const batchedRenderer = new BatchedRenderer();
scene.add(batchedRenderer);
function dotTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 2, 32, 32, 30);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.55, 'rgba(255,255,255,0.85)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const sparkDot = dotTexture();
function makeOneShot({ count, life, speed, size, gravity, colors, alphas, blending }) {
  const sys = new ParticleSystem({
    duration: 1.4, looping: false, prewarm: false,
    shape: new PointEmitter(), // uniform spherical scatter, scaled by startSpeed
    startLife: new IntervalValue(life[0], life[1]),
    startSpeed: new IntervalValue(speed[0], speed[1]),
    startSize: new IntervalValue(size[0], size[1]),
    startColor: new ConstantColor(new THREE.Vector4(1, 1, 1, 1)),
    emissionOverTime: new ConstantValue(0),
    emissionBursts: [{ time: 0, count: new ConstantValue(count), cycle: 1, interval: 0.01, probability: 1 }],
    worldSpace: true,
    material: new THREE.MeshBasicMaterial({
      map: sparkDot, transparent: true, depthWrite: false, blending,
    }),
    renderMode: RenderMode.BillBoard,
    behaviors: [
      new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.85, 0.3, 0), 0]])),
      new ColorOverLife(new Gradient(colors, alphas)),
      new ApplyForce(new THREE.Vector3(...gravity), new ConstantValue(1)),
    ],
  });
  sys.emitter.position.set(0, -100, 0);
  scene.add(sys.emitter);
  batchedRenderer.addSystem(sys);
  return sys;
}
const V3 = (r, g, b) => new THREE.Vector3(r, g, b);
const sparkPool = Array.from({ length: 10 }, () => makeOneShot({
  count: 9, life: [0.2, 0.45], speed: [1.2, 3.5], size: [0.04, 0.08],
  gravity: [0, -9, 0], blending: THREE.AdditiveBlending,
  colors: [[V3(1, 0.85, 0.4), 0], [V3(1, 0.4, 0.1), 0.6], [V3(0.2, 0.05, 0.02), 1]],
  alphas: [[1, 0], [1, 0.5], [0, 1]],
}));
const bloodPool = Array.from({ length: 6 }, () => makeOneShot({
  count: 12, life: [0.25, 0.55], speed: [0.8, 2.5], size: [0.06, 0.11],
  gravity: [0, -9, 0], blending: THREE.NormalBlending,
  colors: [[V3(0.65, 0.05, 0.05), 0], [V3(0.3, 0.02, 0.02), 1]],
  alphas: [[1, 0], [0, 1]],
}));
const dustPool = Array.from({ length: 4 }, () => makeOneShot({
  count: 6, life: [0.5, 1.1], speed: [0.4, 1.0], size: [0.15, 0.3],
  gravity: [0, 1.2, 0], blending: THREE.NormalBlending,
  colors: [[V3(0.5, 0.48, 0.45), 0], [V3(0.35, 0.33, 0.3), 1]],
  alphas: [[0.7, 0], [0, 1]],
}));
let poolCursor = 0;
function firePool(pool, p, shots = 1) {
  for (let i = 0; i < shots; i++) {
    const s = pool[(poolCursor++) % pool.length];
    s.emitter.position.copy(p);
    s.restart(); // one-shot replay: reset clock, fire burst at t=0
  }
}
// same call signature as the old pool: color routes to the right effect
function burst(p, n, color) {
  if (color === 0xa01818) firePool(bloodPool, p, Math.max(1, Math.round(n / 10)));
  else if (color === 0x555550) firePool(dustPool, p, 1);
  else firePool(sparkPool, p, Math.max(1, Math.round(n / 8)));
}
// decals
const decals = [];
function addDecal(p, n) {
  const d = new THREE.Mesh(new THREE.CircleGeometry(0.05 + Math.random() * 0.03, 10),
    new THREE.MeshBasicMaterial({ color: 0x14100b, transparent: true, opacity: 0.65, polygonOffset: true, polygonOffsetFactor: -2 }));
  d.position.copy(p).addScaledVector(n, 0.02);
  d.lookAt(p.clone().add(n));
  scene.add(d); decals.push({ m: d, life: 12 });
  if (decals.length > 40) { const old = decals.shift(); scene.remove(old.m); }
}

// ---------- bots (4v4: YOU + 3 BLUE allies vs 4 RED) ----------
const bots = [];
const BLUE_NAMES = ['Ghost', 'Raptor', 'Wolf'];
const RED_NAMES = ['Viper', 'Havoc', 'Reaper', 'Jinx'];
const blueAccents = [0x2e6db3, 0x2f7fc9, 0x3a5a9a];
const redAccents = [0x7a2020, 0x8a2f23, 0x662222, 0x74301a];
const botBodyMat = new THREE.MeshStandardMaterial({ color: 0x7a2020, roughness: 0.8 });
const botDarkMat = new THREE.MeshStandardMaterial({ color: 0x23211e, roughness: 0.85 });
const botSkinMat = new THREE.MeshStandardMaterial({ color: 0xc9a17e, roughness: 0.7 });
function buildSoldier(accent) {
  const g = new THREE.Group();
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.8, 0.24), botDarkMat);
  const legR = legL.clone(); legL.position.set(-0.14, 0.4, 0); legR.position.set(0.14, 0.4, 0);
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.32), new THREE.MeshStandardMaterial({ color: accent, roughness: 0.8 }));
  torso.position.y = 1.15;
  const vest = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.38), botDarkMat); vest.position.y = 1.15;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.21, 14, 12), botSkinMat); head.position.y = 1.72;
  const helm = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 10, 0, Math.PI * 2, 0, 1.5), botDarkMat); helm.position.y = 1.76;
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.6, 0.18), botDarkMat); armL.position.set(-0.37, 1.2, 0.1);
  const armR = armL.clone(); armR.position.x = 0.37;
  const gun = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, 0.9), new THREE.MeshStandardMaterial({ color: 0x141518, roughness: 0.4, metalness: 0.7 }));
  gun.position.set(0.2, 1.25, -0.4);
  [legL, legR, torso, vest, head, helm, armL, armR, gun].forEach(m => { m.castShadow = true; g.add(m); });
  // hitbox proxies
  const bodyBox = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.5, 0.6), new THREE.MeshBasicMaterial({ visible: false }));
  bodyBox.position.y = 1.0; g.add(bodyBox);
  const headBox = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), new THREE.MeshBasicMaterial({ visible: false }));
  headBox.position.y = 1.72; g.add(headBox);
  // overhead name tag (team-colored) + ground ring so teams read at a glance
  return { group: g, legL, legR, bodyBox, headBox, gunTip: gun };
}
function makeNameTag(name, team) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 64;
  const g = c.getContext('2d');
  const bg = team === 'blue' ? 'rgba(30,90,180,0.88)' : 'rgba(180,40,30,0.88)';
  g.fillStyle = bg;
  g.beginPath(); g.roundRect(28, 8, 200, 40, 10); g.fill();
  g.fillStyle = '#fff'; g.font = 'bold 26px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(name.toUpperCase(), 128, 29);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true }));
  s.scale.set(1.5, 0.375, 1); s.position.y = 2.2; s.renderOrder = 5;
  return s;
}
const roster = [
  ...BLUE_NAMES.map((name, i) => ({ name, team: 'blue', accent: blueAccents[i % blueAccents.length] })),
  ...RED_NAMES.map((name, i) => ({ name, team: 'red', accent: redAccents[i % redAccents.length] })),
];
roster.forEach((r, i) => {
  const s = buildSoldier(r.accent);
  s.group.add(makeNameTag(r.name, r.team));
  const ring = new THREE.Mesh(new THREE.CircleGeometry(0.55, 20),
    new THREE.MeshBasicMaterial({ color: r.team === 'blue' ? 0x3a8cff : 0xff4438, transparent: true, opacity: 0.75 }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.03; s.group.add(ring);
  scene.add(s.group);
  bots.push({
    name: r.name, team: r.team, ...s, ring, hp: 100, alive: true, respawnAt: 0,
    pos: teamSpawn(r.team),
    yaw: 0, speed: rand(3.2, 4.6), state: 'seek', strafeDir: 1, strafeT: 0,
    nextBurst: rand(1, 3), burstLeft: 0, nextBotShot: 0, walkT: Math.random() * 9,
    gunCd: 0,
  });
  s.group.position.copy(bots[i].pos);
});

// collision helper (XZ + step)
function collideMove(p, halfR, height) {
  // ground
  if (p.y < height / 2 + 0) p.y = height / 2;
  if (p.y > 30) p.y = 30;
  p.x = clamp(p.x, -58, 58); p.z = clamp(p.z, -58, 58);
  const min = new THREE.Vector3(p.x - halfR, p.y - height / 2, p.z - halfR);
  const max = new THREE.Vector3(p.x + halfR, p.y + height / 2, p.z + halfR);
  for (const c of colliders) {
    if (max.x > c.min.x && min.x < c.max.x && max.y > c.min.y && min.y < c.max.y && max.z > c.min.z && min.z < c.max.z) {
      // resolve smallest XZ penetration (ignore Y unless standing on top)
      const dx1 = max.x - c.min.x, dx2 = c.max.x - min.x;
      const dz1 = max.z - c.min.z, dz2 = c.max.z - min.z;
      const m = Math.min(dx1, dx2, dz1, dz2);
      if (m === dx1) p.x = c.min.x - halfR;
      else if (m === dx2) p.x = c.max.x + halfR;
      else if (m === dz1) p.z = c.min.z - halfR;
      else p.z = c.max.z + halfR;
      min.set(p.x - halfR, p.y - height / 2, p.z - halfR);
      max.set(p.x + halfR, p.y + height / 2, p.z + halfR);
    }
  }
  return p;
}
function hasLOS(a, b) {
  const dir = b.clone().sub(a); const dist = dir.length(); dir.normalize();
  const rc = new THREE.Raycaster(a, dir, 0, dist);
  const boxes = [];
  // cheap: test segment vs colliders via raycaster on invisible wall meshes is overkill;
  // march in steps
  const steps = Math.ceil(dist / 1.5);
  const p = a.clone();
  for (let i = 1; i < steps; i++) {
    p.copy(a).addScaledVector(dir, (dist * i) / steps);
    for (const c of colliders) {
      if (p.x > c.min.x && p.x < c.max.x && p.y > c.min.y && p.y < c.max.y && p.z > c.min.z && p.z < c.max.z) return false;
    }
  }
  return true;
}

// ---------- input ----------
const keys = {};
addEventListener('keydown', e => {
  keys[e.code] = true;
  if (e.code === 'KeyR') startReload();
  if (e.code === 'Digit1') switchWeapon(0);
  if (e.code === 'Digit2') switchWeapon(1);
  if (e.code === 'KeyC') state.crouch = !state.crouch;
  if (['Space', 'Tab'].includes(e.code)) e.preventDefault();
});
addEventListener('keyup', e => keys[e.code] = false);
addEventListener('mousemove', e => {
  if (document.pointerLockElement !== renderer.domElement || state.mode !== 'playing') return;
  const s = state.ads ? 0.0009 : 0.0021;
  state.yaw -= e.movementX * s; state.pitch -= e.movementY * s;
  state.pitch = clamp(state.pitch, -1.45, 1.45);
});
addEventListener('mousedown', e => {
  if (state.mode !== 'playing') return;
  if (document.pointerLockElement !== renderer.domElement) { renderer.domElement.requestPointerLock(); return; }
  if (e.button === 0) state.firing = true;
  if (e.button === 2) state.ads = true;
});
addEventListener('mouseup', e => {
  if (e.button === 0) state.firing = false;
  if (e.button === 2) state.ads = false;
});
addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement !== renderer.domElement && state.mode === 'playing' && !state.matchOver) {
    toast('Paused — click to resume');
  }
});
renderer.domElement.addEventListener('click', () => {
  if (state.mode === 'playing' && document.pointerLockElement !== renderer.domElement)
    renderer.domElement.requestPointerLock();
});

// ---------- HUD ----------
function toast(msg, ms = 2200) {
  toastEl.textContent = msg; toastEl.style.opacity = 1;
  clearTimeout(toastEl._t); toastEl._t = setTimeout(() => toastEl.style.opacity = 0, ms);
}
function feed(html) {
  const d = document.createElement('div'); d.className = 'feed'; d.innerHTML = html;
  const f = $('killfeed'); f.prepend(d);
  while (f.children.length > 5) f.lastChild.remove();
  setTimeout(() => { d.style.opacity = 0; setTimeout(() => d.remove(), 400); }, 4200);
}
const mmap = $('minimap').getContext('2d');
function drawMinimap() {
  mmap.clearRect(0, 0, 170, 170);
  mmap.fillStyle = 'rgba(10,16,22,0.9)'; mmap.fillRect(0, 0, 170, 170);
  const w2m = (x, z) => [85 + x * (80 / 60), 85 + z * (80 / 60)];
  mmap.strokeStyle = 'rgba(255,255,255,0.25)'; mmap.strokeRect(6, 6, 158, 158);
  mmap.fillStyle = '#8a8478';
  colliders.slice(4, 14).forEach(c => {
    const [x1, z1] = w2m(c.min.x, c.min.z); const [x2, z2] = w2m(c.max.x, c.max.z);
    mmap.fillRect(x1, z1, x2 - x1, z2 - z1);
  });
  bots.forEach(b => {
    if (!b.alive) return;
    const [x, z] = w2m(b.pos.x, b.pos.z);
    mmap.fillStyle = b.team === 'blue' ? '#5aa9ff' : '#ff3b30'; mmap.beginPath(); mmap.arc(x, z, 4, 0, 7); mmap.fill();
  });
  const [px, pz] = w2m(state.pos.x, state.pos.z);
  mmap.save(); mmap.translate(px, pz); mmap.rotate(-state.yaw);
  mmap.fillStyle = '#37e08b'; mmap.beginPath(); mmap.moveTo(0, -7); mmap.lineTo(5, 5); mmap.lineTo(-5, 5); mmap.closePath(); mmap.fill();
  mmap.restore();
}

// ---------- combat ----------
const raycaster = new THREE.Raycaster();
const tmpV = new THREE.Vector3(), tmpV2 = new THREE.Vector3(), tmpV3 = new THREE.Vector3();
function switchWeapon(i) {
  if (i === state.wi || state.reloadingUntil > performance.now() / 1000) return;
  state.wi = i; state.firing = false;
  buildGun(WEAPONS[i]);
  $('wname').textContent = WEAPONS[i].name;
  $('slot1').classList.toggle('active', i === 0);
  $('slot2').classList.toggle('active', i === 1);
  AudioSys.reload();
  updateAmmoHUD();
}
function updateAmmoHUD() {
  $('ammo').innerHTML = `${state.magAmmo[state.wi]} <small>/ ${state.reserveAmmo[state.wi]}</small>`;
}
function startReload() {
  const w = WEAPONS[state.wi];
  if (state.magAmmo[state.wi] === w.mag || state.reserveAmmo[state.wi] <= 0) return;
  if (state.reloadingUntil > performance.now() / 1000) return;
  state.reloadingUntil = performance.now() / 1000 + w.reloadT;
  AudioSys.reload();
  toast('Reloading…', 900);
}
function finishReload() {
  const w = WEAPONS[state.wi];
  const need = w.mag - state.magAmmo[state.wi];
  const take = Math.min(need, state.reserveAmmo[state.wi]);
  state.magAmmo[state.wi] += take; state.reserveAmmo[state.wi] -= take;
  updateAmmoHUD();
}
function showHit(kill) {
  const h = $('hitmarker');
  h.classList.remove('show', 'kill'); void h.offsetWidth;
  if (kill) h.classList.add('kill');
  h.classList.add('show');
}
function playerShoot(now) {
  const w = WEAPONS[state.wi];
  if (state.magAmmo[state.wi] <= 0) { startReload(); state.nextShot = now + 0.25; return; }
  state.magAmmo[state.wi]--;
  const spread = state.ads ? w.adsSpread : w.spread + (sprintFactor() * 0.02);
  raycaster.setFromCamera(new THREE.Vector2(rand(-spread, spread) * 60, rand(-spread, spread) * 60), camera);
  raycaster.far = w.range + 60;
  // test bots — RED are hostile, BLUE allies are immune (friendly fire off)
  let best = null, bestDist = 1e9, headshot = false;
  let allyBlock = null, allyDist = 1e9;
  bots.forEach(b => {
    if (!b.alive) return;
    const hits = raycaster.intersectObjects([b.headBox, b.bodyBox], false);
    if (!hits.length) return;
    if (b.team === 'red') {
      if (hits[0].distance < bestDist) { best = b; bestDist = hits[0].distance; headshot = hits[0].object === b.headBox; }
    } else if (hits[0].distance < allyDist) { allyBlock = b; allyDist = hits[0].distance; }
  });
  // test walls distance
  let wallDist = 1e9, wallPoint = null, wallNormal = null;
  {
    const o = raycaster.ray.origin, d = raycaster.ray.direction;
    // ground plane
    if (d.y < -0.001) {
      const t = -o.y / d.y;
      if (t > 0 && t < wallDist) { wallDist = t; wallPoint = o.clone().addScaledVector(d, t); wallNormal = new THREE.Vector3(0, 1, 0); }
    }
    for (const c of colliders) {
      const box3 = new THREE.Box3(c.min, c.max);
      const pt = new THREE.Vector3();
      if (raycaster.ray.intersectBox(box3, pt)) {
        const dist = pt.distanceTo(o);
        if (dist < wallDist) { wallDist = dist; wallPoint = pt.clone(); wallNormal = new THREE.Vector3(0, 0, 1); }
      }
    }
  }
  const muzzleWorld = new THREE.Vector3(); gunTip.getWorldPosition(muzzleWorld);
  if (allyBlock && allyDist < bestDist && allyDist < wallDist) {
    // ally in the way — spark off them, no damage, no penalty
    fireTracer(muzzleWorld, tmpV2.copy(raycaster.ray.origin).addScaledVector(raycaster.ray.direction, allyDist));
    if (now - lastFriendlyWarn > 2.5) { lastFriendlyWarn = now; toast(`${allyBlock.name} is on your team — friendly fire off`); }
  } else if (best && bestDist < wallDist) {
    const dmg = (headshot ? w.dmg * 2 : w.dmg) * clamp(1 - bestDist / (w.range * 2.2), 0.45, 1);
    best.hp -= dmg;
    burst(tmpV.copy(raycaster.ray.origin).addScaledVector(raycaster.ray.direction, bestDist), 8, 0xa01818, 4);
    fireTracer(muzzleWorld, tmpV2.copy(raycaster.ray.origin).addScaledVector(raycaster.ray.direction, bestDist));
    if (best.hp <= 0 && best.alive) {
      state.kills++;
      damageBot(best, 9999, { name: 'YOU', team: 'blue', isPlayer: true }, headshot, true);
    } else { showHit(false); AudioSys.hit(false); }
  } else if (wallPoint) {
    burst(wallPoint, 7, 0xffcc88, 4.5);
    burst(wallPoint, 4, 0x555550, 2);
    if (wallNormal) addDecal(wallPoint, wallNormal);
    fireTracer(muzzleWorld, wallPoint);
  } else {
    fireTracer(muzzleWorld, tmpV2.copy(raycaster.ray.origin).addScaledVector(raycaster.ray.direction, 90));
  }
  // fx
  muzzleFlash.material.opacity = 0.95; muzzleFlash.rotation.z = Math.random() * 6;
  muzzleFlash.scale.setScalar(rand(0.8, 1.4));
  muzzleLight.intensity = 26;
  state.recoil += w.kick; state.shake = Math.min(0.5, state.shake + 0.12);
  state.pitch = clamp(state.pitch + w.kick * 0.35, -1.45, 1.45);
  AudioSys.shot(false, w.big);
  updateAmmoHUD();
  if (state.magAmmo[state.wi] === 0) startReload();
}
let lastFriendlyWarn = -99;
function teamColorOf(name, team) {
  if (name === 'YOU') return '#37e08b';
  return team === 'blue' ? TEAM_COLOR.blue : TEAM_COLOR.red;
}
function updateScoreHUD() {
  $('blueScore').textContent = state.blueScore;
  $('redScore').textContent = state.redScore;
  $('kd').textContent = `${state.kills}K / ${state.deaths}D`;
}
// victim: bot, killer: {name, team, isPlayer?}
function damageBot(victim, dmg, killer, headshot = false, skipSubtract = false) {
  if (!victim.alive || state.matchOver) return;
  if (!skipSubtract) victim.hp -= dmg;
  if (victim.hp > 0) return;
  victim.alive = false; victim.hp = 0; victim.respawnAt = performance.now() / 1000 + 3;
  victim.group.rotation.x = -Math.PI / 2; victim.group.position.y = 0.25;
  if (killer.team === 'blue') state.blueScore++; else state.redScore++;
  updateScoreHUD();
  const kc = teamColorOf(killer.name, killer.team), vc = teamColorOf(victim.name, victim.team);
  feed(`<b style="color:${kc}">${killer.name}</b> ${headshot ? '🎯 HEADSHOT' : '☠'} <b style="color:${vc}">${victim.name}</b>`);
  burst(victim.pos.clone().add(new THREE.Vector3(0, 1.3, 0)), 16, 0xa01818, 5);
  if (killer.isPlayer) { showHit(true); AudioSys.hit(true); }
  else if (killer.name === 'YOU') { showHit(true); AudioSys.hit(true); }
  if (state.blueScore >= state.targetScore) endMatch('blue');
  else if (state.redScore >= state.targetScore) endMatch('red');
}
function hurtPlayer(dmg, from) {
  if (state.matchOver || state.mode !== 'playing') return;
  state.hp -= dmg; state.lastHurt = performance.now() / 1000;
  dmgEl.style.opacity = clamp(0.4 + dmg / 40, 0, 0.95);
  setTimeout(() => dmgEl.style.opacity = 0, 180);
  AudioSys.hurt();
  state.shake = Math.min(0.7, state.shake + 0.2);
  if (state.hp <= 0) {
    state.hp = 0; state.deaths++;
    state.redScore++;
    updateScoreHUD();
    feed(`<b style="color:${TEAM_COLOR.red}">${from?.name || 'RED'}</b> ☠ <b style="color:#37e08b">YOU</b>`);
    toast('You were eliminated — redeploying with BLUE…');
    state.hp = 100;
    state.pos.copy(teamSpawn('blue')).add(new THREE.Vector3(0, 1.7, 0));
    state.vel.set(0, 0, 0);
    if (state.redScore >= state.targetScore) endMatch('red');
  }
}

// ---------- movement helpers ----------
function sprintFactor() { return (keys.ShiftLeft || keys.ShiftRight) && keys.KeyW ? 1 : 0; }

// ---------- game flow ----------
function startGame(spectate = false) {
  AudioSys.init();
  state.spectate = spectate;
  state.mode = 'playing';
  menu.style.display = 'none'; gameoverEl.style.display = 'none';
  hud.classList.add('on');
  if (!spectate) renderer.domElement.requestPointerLock?.();
  toast(spectate ? 'Spectating 4v4 — BLUE vs RED' : 'Fight for BLUE. First team to 30.');
  $('loading').textContent = '';
  updateScoreHUD();
}
$('playBtn').onclick = () => startGame(false);
$('specBtn').onclick = () => startGame(true);
$('againBtn').onclick = () => location.reload();
function endMatch(result) {
  if (state.matchOver) return;
  state.matchOver = true;
  document.exitPointerLock?.();
  const win = result === 'blue', draw = result === 'draw';
  $('endKicker').textContent = draw ? 'STALEMATE' : win ? 'STRIKE ZONE SECURED' : 'MISSION FAILED';
  $('endTitle').textContent = draw ? 'DRAW' : win ? 'VICTORY' : 'DEFEAT';
  $('endTitle').style.background = draw ? 'linear-gradient(180deg,#fff,#ffd76a)' : win ? 'linear-gradient(180deg,#fff,#37e08b)' : 'linear-gradient(180deg,#fff,#ff3b30)';
  $('endSub').textContent = `BLUE ${state.blueScore} • ${state.redScore} RED — you went ${state.kills}K / ${state.deaths}D • ${fmtTime(state.timeLeft)} left`;
  setTimeout(() => { gameoverEl.style.display = 'flex'; hud.classList.remove('on'); }, 600);
}
function fmtTime(s) { s = Math.max(0, Math.ceil(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }

// ---------- per-frame ----------
const timer = new THREE.Timer(); // Clock is deprecated as of three r186
let fpsAcc = 0, fpsN = 0, fpsT = 0;
function animate() {
  requestAnimationFrame(animate);
  timer.update();
  const dt = Math.min(timer.getDelta(), 0.05);
  const now = performance.now() / 1000;
  // three.quarks owns all particle lifecycles; one update drives every pool
  batchedRenderer.update(dt);
  tracers.forEach(t => { if (t.life > 0) { t.life -= dt; t.line.material.opacity = Math.max(0, t.life / 0.09) * 0.9; } });
  decals.forEach(d => { d.life -= dt; if (d.life < 3) d.m.material.opacity = Math.max(0, d.life / 3) * 0.8; });
  muzzleFlash.material.opacity *= 0.6;
  muzzleLight.intensity *= 0.55;

  if (state.mode === 'playing' && !state.matchOver) {
    state.timeLeft -= dt;
    $('timer').textContent = fmtTime(state.timeLeft);
    if (state.timeLeft <= 0) {
      if (state.blueScore > state.redScore) endMatch('blue');
      else if (state.redScore > state.blueScore) endMatch('red');
      else endMatch('draw');
    }
  }

  if (state.mode === 'playing' && (state.spectate || params.has('autostart'))) {
    // cinematic orbit cam for screenshots / spectate
    const t = now * 0.12;
    camera.position.set(Math.sin(t) * 42, 15 + Math.sin(t * 0.6) * 4, Math.cos(t) * 42);
    camera.lookAt(0, 2, 0);
    gunRig.visible = false;
    if (params.has('autostart') && state.spectate === false && state.mode === 'playing') { /* keep playing physics paused */ }
  } else {
    gunRig.visible = true;
    if (state.mode === 'playing') updatePlayer(dt, now);
  }
  updateBots(dt, now);
  updateGunFx(dt, now);

  // health regen
  if (now - state.lastHurt > 4 && state.hp < 100 && state.mode === 'playing' && !state.matchOver) {
    state.hp = Math.min(100, state.hp + dt * 14);
    healEl.style.opacity = 0.5;
  } else healEl.style.opacity = 0;
  $('healthfill').style.width = state.hp + '%';
  $('healthnum').textContent = Math.ceil(state.hp);
  $('healthfill').style.background = state.hp > 60 ? 'linear-gradient(90deg,#37e08b,#b6ff5e)' : state.hp > 30 ? 'linear-gradient(90deg,#ffb454,#ff7a1a)' : 'linear-gradient(90deg,#ff3b30,#ff7a1a)';
  drawMinimap();

  // fps meter
  fpsAcc += dt; fpsN++;
  if (now - fpsT > 0.5) { $('fps').textContent = `${Math.round(fpsN / fpsAcc)} fps • ${renderer.info.render.triangles / 1000 | 0}k tris`; fpsAcc = 0; fpsN = 0; fpsT = now; }

  renderer.render(scene, camera);
}

function updatePlayer(dt, now) {
  const w = WEAPONS[state.wi];
  if (state.spectate && document.pointerLockElement) { state.spectate = false; }
  camera.rotation.set(state.pitch + state.recoil * 2.2, state.yaw, 0);
  state.recoil *= Math.pow(0.0001, dt);
  state.shake *= Math.pow(0.001, dt);
  camera.position.copy(state.pos);
  camera.position.y += Math.sin(state.bobT) * (sprintFactor() ? 0.05 : 0.028);
  camera.position.x += (Math.random() - 0.5) * state.shake * 0.06;
  camera.position.y += (Math.random() - 0.5) * state.shake * 0.06;

  // reload completion
  if (state.reloadingUntil && now >= state.reloadingUntil) { state.reloadingUntil = 0; finishReload(); }

  // fire — holding aim (RMB) also shoots automatically
  const wantFire = (state.firing || state.ads) && !state.matchOver;
  if (wantFire && now >= state.nextShot && !state.reloadingUntil) {
    playerShoot(now);
    state.nextShot = now + 60 / w.rpm;
    if (!w.auto) state.firing = false;
  }
  // movement
  const speed = state.crouch ? 2.6 : sprintFactor() ? 8.6 : 5.4;
  const f = new THREE.Vector3(-Math.sin(state.yaw), 0, -Math.cos(state.yaw));
  const r = new THREE.Vector3(-f.z, 0, f.x);
  const wish = new THREE.Vector3();
  if (keys.KeyW) wish.add(f); if (keys.KeyS) wish.sub(f);
  if (keys.KeyD) wish.add(r); if (keys.KeyA) wish.sub(r);
  if (wish.lengthSq() > 0) wish.normalize();
  const accel = state.onGround ? 46 : 12;
  state.vel.x += wish.x * accel * dt; state.vel.z += wish.z * accel * dt;
  // friction
  const fr = state.onGround ? Math.pow(0.0001, dt) : Math.pow(0.05, dt);
  if (!wish.lengthSq()) { state.vel.x *= fr; state.vel.z *= fr; }
  const maxS = speed;
  const hs = Math.hypot(state.vel.x, state.vel.z);
  if (hs > maxS) { state.vel.x *= maxS / hs; state.vel.z *= maxS / hs; }
  // gravity / jump
  state.vel.y -= 16 * dt;
  if (keys.Space && state.onGround) { state.vel.y = 5.4; state.onGround = false; }
  state.pos.addScaledVector(state.vel, dt);
  const eyeH = state.crouch ? 1.15 : 1.7;
  if (state.pos.y <= eyeH) { state.pos.y = eyeH; state.vel.y = 0; state.onGround = true; }
  collideMove(state.pos, 0.42, state.crouch ? 1.2 : 1.7);
  // head bob + steps
  if (hs > 1 && state.onGround) {
    state.bobT += dt * (4 + hs * 1.1);
    state.stepT += dt * hs;
    if (state.stepT > 2.4) { state.stepT = 0; AudioSys.step(); }
  }
  // ADS
  state.adsK += ((state.ads ? 1 : 0) - state.adsK) * Math.min(1, dt * 12);
  const k = state.adsK;
  gunRig.position.set(0.28 * (1 - k) + 0.0 * k, -0.27 * (1 - k) - 0.185 * k, -0.55 - 0.12 * k);
  camera.fov = 78 - 22 * k + sprintFactor() * 3;
  camera.updateProjectionMatrix();
  $('crosshair').style.opacity = k > 0.5 ? 0 : 1 - state.recoil * 8;
}

function updateGunFx(dt, now) {
  // weapon sway / bob
  const t = now;
  gunRig.rotation.set(
    Math.sin(state.bobT * 0.5) * 0.008 + state.recoil * 1.4,
    Math.sin(t * 1.3) * 0.004,
    0
  );
  gunRig.position.y += Math.sin(state.bobT * 2) * 0.0012;
  gunRig.position.x += Math.cos(state.bobT) * 0.0012;
}

// nearest living enemy of bot b: RED hunts YOU + BLUE allies, BLUE hunts RED
function nearestEnemy(b) {
  let best = null, bestDist = 1e9, isPlayer = false;
  const consider = (pos, ref, player) => {
    const d = tmpV.copy(pos).sub(b.pos); d.y = 0;
    const dist = d.length();
    if (dist < bestDist) { bestDist = dist; best = ref; isPlayer = player; }
  };
  if (b.team === 'red' && state.mode === 'playing' && !state.spectate && !state.matchOver) {
    consider(state.pos, null, true);
  }
  for (const o of bots) {
    if (o === b || !o.alive || o.team === b.team) continue;
    consider(o.pos.clone().add(new THREE.Vector3(0, 1.2, 0)), o, false);
  }
  return best ? { ref: best, dist: bestDist, isPlayer } : null;
}
function visibleFrom(eye, targetPos) {
  const d = tmpV.copy(targetPos).sub(eye);
  const dist = d.length();
  if (dist > 70) return false;
  return hasLOS(eye, targetPos);
}
function updateBots(dt, now) {
  const playerEye = tmpV3.copy(state.pos);
  let blueAlive = 1, redAlive = 0; // YOU always count for BLUE
  for (const b of bots) {
    if (!b.alive) {
      if (now > b.respawnAt && !state.matchOver) {
        b.alive = true; b.hp = 100;
        b.pos.copy(teamSpawn(b.team));
        b.group.rotation.x = 0; b.group.position.copy(b.pos);
        b.group.visible = true;
      } else { b.group.visible = now % 0.6 < 0.4; }
      continue;
    }
    if (b.team === 'blue') blueAlive++; else redAlive++;
    b.walkT += dt * 6;
    const eye = new THREE.Vector3(b.pos.x, 1.6, b.pos.z);
    // pick target: nearest visible enemy, else keep pushing toward nearest enemy
    const foe = nearestEnemy(b);
    let targetPos = null, targetBot = null, targetIsPlayer = false, canSee = false, dist = 1e9;
    if (foe) {
      const fp = foe.isPlayer ? playerEye : foe.ref.pos.clone().add(new THREE.Vector3(0, 1.3, 0));
      dist = foe.dist;
      if (visibleFrom(eye, fp)) { canSee = true; targetPos = fp; targetBot = foe.ref; targetIsPlayer = foe.isPlayer; }
      else targetPos = foe.isPlayer ? playerEye.clone() : foe.ref.pos.clone();
    } else {
      targetPos = new THREE.Vector3(0, 1, 0); // no foes? push mid
    }
    // movement: strafe at close range vs visible foe, else advance
    tmpV.copy(targetPos).sub(b.pos); tmpV.y = 0;
    const mdist = tmpV.length(); tmpV.normalize();
    let mv = new THREE.Vector3();
    if (canSee && mdist < 14) {
      b.strafeT -= dt;
      if (b.strafeT <= 0) { b.strafeDir *= -1; b.strafeT = rand(0.7, 1.8); }
      mv.addScaledVector(new THREE.Vector3(-tmpV.z, 0, tmpV.x), b.strafeDir * 0.9);
      if (mdist < 7) mv.addScaledVector(tmpV, -0.9);
      else if (mdist > 12) mv.addScaledVector(tmpV, 0.7);
    } else {
      mv.add(tmpV);
      b.strafeT = 0;
    }
    if (mv.lengthSq() > 0) {
      mv.normalize();
      // obstacle feel: probe ahead
      tmpV.copy(b.pos).addScaledVector(mv, 1.4); tmpV.y = 1;
      let blocked = false;
      for (const c of colliders) {
        if (tmpV.x > c.min.x && tmpV.x < c.max.x && tmpV.y > c.min.y && tmpV.y < c.max.y && tmpV.z > c.min.z && tmpV.z < c.max.z) { blocked = true; break; }
      }
      if (blocked) mv.applyAxisAngle(new THREE.Vector3(0, 1, 0), 1.1);
      b.pos.addScaledVector(mv, b.speed * dt);
      collideMove(b.pos, 0.42, 1.7);
      // separation: don't stack into the player or each other
      {
        tmpV.copy(b.pos).sub(state.pos); tmpV.y = 0;
        const pd = tmpV.length();
        if (pd > 0.001 && pd < 1.1) b.pos.addScaledVector(tmpV.normalize(), (1.1 - pd) * 0.8);
        for (const o of bots) {
          if (o === b || !o.alive) continue;
          tmpV.copy(b.pos).sub(o.pos); tmpV.y = 0;
          const od = tmpV.length();
          if (od > 0.001 && od < 0.9) b.pos.addScaledVector(tmpV.normalize(), (0.9 - od) * 0.5);
        }
      }
      b.pos.y = 0; // feet on the ground: collideMove centers bodies, but the soldier rig is feet-origin
      b.legL.rotation.x = Math.sin(b.walkT * 2) * 0.6;
      b.legR.rotation.x = -Math.sin(b.walkT * 2) * 0.6;
    }
    // face visible foe, else face move dir.
    // NOTE: the soldier rig faces -Z (gun at z=-0.4), so yaw needs the
    // negated direction — plain atan2(dx, dz) aims it exactly backwards.
    const faceYaw = canSee
      ? Math.atan2(-(targetPos.x - b.pos.x), -(targetPos.z - b.pos.z))
      : Math.atan2(-mv.x, -mv.z);
    b.group.rotation.y = faceYaw;
    b.group.position.copy(b.pos);
    // shooting — bot-vs-bot battles run even in spectate; the player is only a target while deployed
    const canShootPlayer = targetIsPlayer && !state.spectate;
    const canShootBot = !targetIsPlayer && targetBot && targetBot.alive;
    b.nextBurst -= dt;
    if (canSee && state.mode === 'playing' && !state.matchOver && (canShootPlayer || canShootBot) && dist < 55) {
      if (b.nextBurst <= 0 && b.burstLeft <= 0) { b.burstLeft = 3 + (Math.random() * 3 | 0); b.nextBurst = rand(0.7, 1.8); }
      if (b.burstLeft > 0) {
        b.nextBotShot -= dt;
        if (b.nextBotShot <= 0) {
          b.nextBotShot = 0.16;
          b.burstLeft--;
          const hv = targetIsPlayer ? Math.hypot(state.vel.x, state.vel.z) : 2;
          const hitP = clamp(0.42 - dist / 130 - hv / 40, 0.06, 0.4);
          const from = new THREE.Vector3(b.pos.x, 1.45, b.pos.z);
          const aim = targetPos.clone().add(new THREE.Vector3(rand(-1, 1), rand(-0.5, 0.5), rand(-1, 1)));
          fireTracer(from, aim);
          burst(targetPos.clone(), 2, 0xffdd99, 2);
          AudioSys.enemyShot(dist);
          if (Math.random() < hitP) {
            if (targetIsPlayer) hurtPlayer(rand(7, 15), b);
            else if (targetBot.alive) {
              burst(targetPos.clone(), 5, 0xa01818, 3);
              damageBot(targetBot, rand(9, 18), b, false);
            }
          }
        }
      }
    }
  }
  $('blueAlive').textContent = blueAlive;
  $('redAlive').textContent = redAlive;
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

$('loading').textContent = 'engine ready — 60fps target • WebGL2 • procedural audio';
updateAmmoHUD();
animate();

// test hooks
window.__game = { state, bots, THREE, ready: true, fx: { burst }, pools: { sparkPool, bloodPool, dustPool } };
if (params.has('autostart')) { startGame(true); }
if (params.has('fp')) {
  startGame(false);
  state.spectate = false;
  state.pos.set(0, 1.7, 50);
  state.yaw = Math.PI; state.pitch = 0.02;
  // face map center: yaw 0 looks -Z toward mid from south spawn
  state.yaw = 0; state.pitch = 0.03;
  try { document.exitPointerLock?.(); } catch {}
}
