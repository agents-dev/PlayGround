import * as THREE from 'three';

const canvas = document.getElementById('game');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87a5c4);
scene.fog = new THREE.Fog(0x87a5c4, 45, 150);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.05, 400);
camera.rotation.order = 'YXZ';

scene.add(new THREE.HemisphereLight(0xcfe5ff, 0x8a6f4d, 0.95));
const sun = new THREE.DirectionalLight(0xfff2d8, 1.7);
sun.position.set(30, 48, 18);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -50; sun.shadow.camera.right = 50;
sun.shadow.camera.top = 50; sun.shadow.camera.bottom = -50;
scene.add(sun);

// ---------------- map ----------------
const colliders = [];
const solids = [];
function addBox(w, h, d, x, y, z, color, rough = 0.92) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color, roughness: rough }));
  m.position.set(x, y, z);
  m.castShadow = true; m.receiveShadow = true;
  scene.add(m);
  solids.push(m);
  colliders.push(new THREE.Box3().setFromObject(m));
  return m;
}
function crate(x, z, s = 2, color = 0x9a6b3f, dy = 0) {
  const c = addBox(s, s, s, x, s / 2 + dy, z, color);
  const e = new THREE.LineSegments(new THREE.EdgesGeometry(c.geometry),
    new THREE.LineBasicMaterial({ color: 0x3a2a18 }));
  e.position.copy(c.position); scene.add(e);
  return c;
}

const SAND = 0xcfa96f, SAND_D = 0xb98f56, WALL = 0xd6c096, STONE = 0x9d968a, WOOD = 0x8f6238;
{ // ground with grid texture feel via canvas
  const cv = document.createElement('canvas'); cv.width = cv.height = 256;
  const g = cv.getContext('2d');
  g.fillStyle = '#cfa96f'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2500; i++) {
    g.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
    g.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(24, 24);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 120),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;
  scene.add(ground);
}

// perimeter
addBox(70, 6, 1.2, 0, 3, -30, WALL);
addBox(70, 6, 1.2, 0, 3, 30, WALL);
addBox(1.2, 6, 62, -30, 3, 0, WALL);
addBox(1.2, 6, 62, 30, 3, 0, WALL);
// mid wall with double doors (dust style)
addBox(10, 4.5, 1, -14, 2.25, 0, STONE);
addBox(10, 4.5, 1, 14, 2.25, 0, STONE);
addBox(8, 1.2, 1, 0, 3.9, 0, STONE); // lintel over mid doors
addBox(1, 2.8, 1, -4, 1.4, 0, WOOD);
addBox(1, 2.8, 1, 4, 1.4, 0, WOOD);
// long corridor walls
addBox(1, 3.5, 24, -10, 1.75, -16, WALL);
addBox(20, 3.5, 1, -19, 1.75, -10, WALL);
addBox(1, 3.5, 20, 12, 1.75, 16, WALL);
addBox(16, 3.5, 1, 20, 1.75, 10, WALL);
// bombsites platforms
addBox(12, 0.3, 12, -20, 0.15, 18, SAND_D); // A
addBox(12, 0.3, 12, 20, 0.15, -18, SAND_D); // B
// site boxes / cover
crate(-22, 16, 2.2); crate(-19.5, 16, 2.2); crate(-21, 18.4, 2.2);
crate(22, -16, 2.2, 0x7d8a99); crate(19.5, -16, 2.2, 0x7d8a99); crate(21, -18.4, 2.2, 0x7d8a99);
crate(0, -8, 2, WOOD); crate(2.4, -8, 2, WOOD); crate(1.2, -8, 2, WOOD, 2);
crate(-2, 8, 2); crate(2, 8.5, 1.6); crate(0, 12, 2.4, WOOD);
crate(-14, -4, 2); crate(14, 4, 2); crate(-8, 20, 2.5); crate(8, -20, 2.5);
// tunnels / arches
addBox(6, 1, 6, -20, 3.5, 2, WALL);
addBox(1, 3.5, 6, -23, 1.75, 2, WALL);
addBox(1, 3.5, 6, -17, 1.75, 2, WALL);
// palm-ish decoration (cylinders + cones) — cheap but reads as dust
for (const [x, z] of [[-26, -24], [26, 24], [-26, 26], [26, -26]]) {
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 5, 8),
    new THREE.MeshStandardMaterial({ color: 0x6b4a2c }));
  trunk.position.set(x, 2.5, z); trunk.castShadow = true; scene.add(trunk);
  const top = new THREE.Mesh(new THREE.ConeGeometry(2.2, 2.4, 8),
    new THREE.MeshStandardMaterial({ color: 0x4d7a3a }));
  top.position.set(x, 5.8, z); top.castShadow = true; scene.add(top);
}
// site letters
function textSprite(t, x, z) {
  const cv = document.createElement('canvas'); cv.width = cv.height = 128;
  const c = cv.getContext('2d');
  c.fillStyle = 'rgba(0,0,0,0.55)'; c.fillRect(0, 0, 128, 128);
  c.fillStyle = '#fff'; c.font = 'bold 84px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(t, 64, 70);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), depthTest: false }));
  sp.position.set(x, 6, z); sp.scale.set(4, 4, 1); scene.add(sp);
}
textSprite('A', -20, 18); textSprite('B', 20, -18);

// ---------------- bomb (plant / defuse) ----------------
const SITES = { A: new THREE.Vector3(-20, 0, 18), B: new THREE.Vector3(20, 0, -18) };
const SITE_R = 5.5, PLANT_TIME = 3, BOT_DEFUSE_TIME = 6, PLAYER_DEFUSE_TIME = 5, BOMB_TICK = 35;
const bombMesh = new THREE.Group();
{
  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.35),
    new THREE.MeshStandardMaterial({ color: 0x2b2b2e, roughness: 0.6 }));
  pack.position.y = 0.15; pack.castShadow = true; bombMesh.add(pack);
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xff2222 }));
  lamp.position.set(0.15, 0.34, 0); lamp.name = 'lamp'; bombMesh.add(lamp);
}
const bombLight = new THREE.PointLight(0xff2222, 0, 12);
bombLight.position.y = 1; bombMesh.add(bombLight);
bombMesh.visible = false; scene.add(bombMesh);
const bomb = {
  state: 'carried', carrier: null, site: 'B', pos: new THREE.Vector3(),
  plantProg: 0, defuseProg: 0, tickT: 0, beepT: 0, defuser: null,
};
let playerDefuse = 0, shakeT = 0, boomFx = null;
function hideChannel() {
  document.getElementById('channel-wrap').classList.add('hidden');
  document.getElementById('defuse-prompt').classList.add('hidden');
}
function resetBomb() {
  const carriers = botAlive('T');
  bomb.carrier = carriers.length ? carriers[Math.floor(Math.random() * carriers.length)] : null;
  bomb.site = Math.random() < 0.5 ? 'A' : 'B';
  bomb.state = bomb.carrier ? 'carried' : 'dropped';
  if (!bomb.carrier) bomb.pos.set(0, 0.4, 0);
  bomb.plantProg = 0; bomb.defuseProg = 0; bomb.tickT = 0; bomb.beepT = 0; bomb.defuser = null;
  bombMesh.visible = false;
  playerDefuse = 0; hideChannel(); updateHud();
}
function dropBombIfCarrier(b) {
  if (bomb.state === 'carried' && bomb.carrier === b) {
    bomb.state = 'dropped'; bomb.carrier = null; bomb.plantProg = 0;
    bomb.pos.copy(b.mesh.position); bomb.pos.y = 0.4;
    bombMesh.position.copy(bomb.pos); bombMesh.visible = true;
    killfeed(`💣 bomb <b>DROPPED</b>`);
    updateHud();
  }
}
function plantBomb(b) {
  bomb.state = 'planted'; bomb.carrier = null;
  bomb.pos.copy(b.mesh.position); bomb.pos.y = 0.4;
  bomb.tickT = BOMB_TICK; bomb.beepT = 0; bomb.defuseProg = 0;
  bombMesh.position.copy(bomb.pos); bombMesh.visible = true;
  sfx.plant();
  killfeed(`💣 <b style="color:#ffbe6b">T-bot</b> PLANTED at <b>${bomb.site}</b>`);
  banner(`💣 BOMB PLANTED at ${bomb.site} — DEFUSE IT (hold E)`);
  updateHud();
}
function detonateBomb() {
  explosionFx(bomb.pos);
  sfx.explosion();
  killfeed(`💥 <b>BOMB DETONATED</b> at ${bomb.site}`);
  bombMesh.visible = false; hideChannel();
  endRound('T', '💥 T WIN — bomb detonated');
}
function defuseWin(byPlayer) {
  sfx.defuse();
  killfeed(`💣 BOMB DEFUSED${byPlayer ? ' by <b style="color:#7cc4ff">YOU</b>' : ' by <b style="color:#7cc4ff">CT-bot</b>'}`);
  bombMesh.visible = false; hideChannel();
  if (byPlayer) player.money += 300;
  endRound('CT', '💣 CT WIN — bomb defused');
}
function explosionFx(p) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff8830, transparent: true, opacity: 0.95 }));
  m.position.copy(p); scene.add(m);
  const l = new THREE.PointLight(0xff7722, 30, 45);
  l.position.set(p.x, p.y + 2, p.z); scene.add(l);
  boomFx = { m, l, t: 0.9 };
  shakeT = 0.7;
}

// ---------------- audio (procedural) ----------------
let AC = null;
function audio() { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); return AC; }
function boom(freq, dur, vol, type = 'square', slide = 0) {
  try {
    const ac = audio(), o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, ac.currentTime);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), ac.currentTime + dur);
    g.gain.setValueAtTime(vol, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
    o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime + dur);
  } catch { /* no audio */ }
}
const sfx = {
  shot: (heavy) => { boom(heavy ? 90 : 160, 0.14, 0.25, 'sawtooth', -60); boom(1200, 0.05, 0.12, 'square', -900); },
  enemyShot: () => boom(130, 0.12, 0.1, 'sawtooth', -50),
  hit: () => boom(900, 0.07, 0.18, 'square'),
  hurt: () => boom(220, 0.2, 0.25, 'sawtooth', -120),
  reload: () => boom(500, 0.09, 0.15, 'square', 200),
  dry: () => boom(1400, 0.05, 0.12, 'square'),
  round: () => { boom(440, 0.25, 0.2, 'triangle'); setTimeout(() => boom(660, 0.3, 0.2, 'triangle'), 180); },
  beep: () => boom(1200, 0.08, 0.2, 'square'),
  plant: () => { boom(300, 0.15, 0.2, 'square', 150); setTimeout(() => boom(450, 0.2, 0.2, 'square', 150), 160); },
  defuse: () => { boom(600, 0.12, 0.2, 'triangle', 300); setTimeout(() => boom(900, 0.25, 0.2, 'triangle'), 140); },
  explosion: () => { boom(60, 1.2, 0.4, 'sawtooth', -30); boom(45, 1.5, 0.35, 'square', -15); },
};

// ---------------- weapons ----------------
const WEAPONS = {
  rifle: { name: 'AK-47', dmg: 34, head: 2.4, rpm: 600, mag: 30, reserve: 90, spread: 0.018, auto: true, price: 2500, color: 0x222222 },
  smg: { name: 'MP5', dmg: 24, head: 2.0, rpm: 800, mag: 30, reserve: 120, spread: 0.03, auto: true, price: 1500, color: 0x333333 },
  awp: { name: 'AWP', dmg: 110, head: 2.0, rpm: 41, mag: 5, reserve: 20, spread: 0.001, auto: false, price: 4750, color: 0x1a3a1a },
};
let weapon = JSON.parse(JSON.stringify(WEAPONS.rifle));
let magAmmo = 30, reserveAmmo = 90;

// gun viewmodel
const gunGroup = new THREE.Group();
{
  const metal = new THREE.MeshStandardMaterial({ color: 0x2a2c30, roughness: 0.4, metalness: 0.6 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.07, 0.42), metal);
  body.position.set(0.17, -0.15, -0.5); gunGroup.add(body);
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.1, 0.07),
    new THREE.MeshStandardMaterial({ color: 0x8a5a2e }));
  grip.position.set(0.17, -0.22, -0.43); grip.rotation.x = 0.25; gunGroup.add(grip);
  const sight = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.04, 0.015), metal);
  sight.position.set(0.17, -0.1, -0.6); gunGroup.add(sight);
  const flash = new THREE.PointLight(0xffc266, 0, 6);
  flash.position.set(0.17, -0.12, -0.75); flash.name = 'flash'; gunGroup.add(flash);
  const fill = new THREE.PointLight(0xffffff, 0.7, 3);
  fill.position.set(0, 0.2, 0.2); gunGroup.add(fill);
  camera.add(gunGroup); scene.add(camera);
}

// ---------------- player ----------------
const player = {
  pos: new THREE.Vector3(0, 1.7, 24),
  vel: new THREE.Vector3(), yaw: Math.PI, pitch: 0,
  hp: 100, armor: 100, money: 800, alive: true,
  radius: 0.5, speed: 6.2, onGround: true,
};
camera.position.copy(player.pos);

const keys = {};
addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (e.code === 'KeyR') reload();
  if (e.code === 'KeyB') toggleBuy();
  if (['Digit1', 'Digit2', 'Digit3'].includes(e.code)) buyChoice(e.code);
  if (['Space'].includes(e.code)) e.preventDefault();
});
addEventListener('keyup', (e) => keys[e.code] = false);

let locked = false;
const menu = document.getElementById('menu'), hud = document.getElementById('hud');
const playBtn = document.getElementById('play');
playBtn.onclick = () => { canvas.requestPointerLock(); audio(); };
document.addEventListener('pointerlockchange', () => {
  locked = document.pointerLockElement === canvas;
  menu.style.display = locked ? 'none' : 'flex';
  hud.classList.toggle('hidden', !locked && !started);
  document.getElementById('pause-tip').classList.toggle('hidden', locked || !started);
});
document.addEventListener('mousemove', (e) => {
  if (!locked || !player.alive) return;
  const sens = aiming ? 0.0011 : 0.0021;
  player.yaw -= e.movementX * sens;
  player.pitch -= e.movementY * sens;
  player.pitch = Math.max(-1.45, Math.min(1.45, player.pitch));
});
let aiming = false, firing = false, lastShot = 0;
document.addEventListener('mousedown', (e) => {
  if (!locked) return;
  if (e.button === 0) { firing = true; if (!weapon.auto) tryShoot(); }
  if (e.button === 2) aiming = true;
});
document.addEventListener('mouseup', (e) => {
  if (e.button === 0) firing = false;
  if (e.button === 2) aiming = false;
});
addEventListener('contextmenu', (e) => e.preventDefault());

function collide(pos) {
  const p = new THREE.Box3(
    new THREE.Vector3(pos.x - player.radius, pos.y - 1.7, pos.z - player.radius),
    new THREE.Vector3(pos.x + player.radius, pos.y + 0.3, pos.z + player.radius));
  for (const b of colliders) if (p.intersectsBox(b)) return true;
  return false;
}

// ---------------- bots ----------------
const bots = [];
function makeSoldier(color, isEnemy) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.8 });
  const legs = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.8, 0.35), new THREE.MeshStandardMaterial({ color: 0x2b2b2e }));
  legs.position.y = 0.4; g.add(legs);
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.75, 0.4), mat);
  torso.position.y = 1.15; torso.castShadow = true; g.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0xd9b48f }));
  head.position.y = 1.78; head.castShadow = true; head.name = 'head'; g.add(head);
  const helm = new THREE.Mesh(new THREE.SphereGeometry(0.27, 12, 8, 0, Math.PI * 2, 0, 1.4),
    new THREE.MeshStandardMaterial({ color: isEnemy ? 0x5a4a33 : 0x2e4d6b }));
  helm.position.y = 1.82; g.add(helm);
  const gun = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.9),
    new THREE.MeshStandardMaterial({ color: 0x111111 }));
  gun.position.set(0.3, 1.2, -0.4); g.add(gun);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}
function spawnBot(team, x, z) {
  const isEnemy = team === 'T';
  const mesh = makeSoldier(isEnemy ? 0x8a7a4d : 0x3a6ea8, isEnemy);
  mesh.position.set(x, 0, z);
  scene.add(mesh);
  const b = {
    team, mesh, hp: 100, alive: true, respawnT: 0,
    target: new THREE.Vector3((Math.random() - 0.5) * 40, 0, (Math.random() - 0.5) * 40),
    shootCd: Math.random() * 2, strafe: Math.random() * 6.28, speed: 2.6 + Math.random() * 1.2,
  };
  bots.push(b); return b;
}
const ENEMY_SPAWNS = [[20, -24], [24, -20], [16, -24], [22, -12]];
const MATE_SPAWNS = [[-4, 24], [4, 24], [0, 20]];
ENEMY_SPAWNS.forEach(([x, z]) => spawnBot('T', x, z));
MATE_SPAWNS.forEach(([x, z]) => spawnBot('CT', x, z));

function botAlive(team) { return bots.filter((b) => b.team === team && b.alive); }
function botGoto(b, dest, dt) {
  const d = dest.clone().sub(b.mesh.position); d.y = 0;
  if (d.length() < 0.8) return true;
  d.normalize();
  const base = Math.atan2(d.x, d.z);
  // try straight, then slide along obstacles at increasing angles
  for (const off of [0, 0.5, -0.5, 1.0, -1.0, 1.6, -1.6]) {
    const a = base + off;
    const dir = new THREE.Vector3(Math.sin(a), 0, Math.cos(a));
    const np = b.mesh.position.clone().add(dir.multiplyScalar(b.speed * dt));
    const box = new THREE.Box3(new THREE.Vector3(np.x - 0.4, 0, np.z - 0.4), new THREE.Vector3(np.x + 0.4, 2, np.z + 0.4));
    let hit = false;
    for (const c of colliders) if (box.intersectsBox(c)) { hit = true; break; }
    if (!hit) {
      b.mesh.position.copy(np);
      b.mesh.lookAt(b.mesh.position.x + dir.x, 0, b.mesh.position.z + dir.z);
      return off === 0;
    }
  }
  return false;
}

// ---------------- combat ----------------
const ray = new THREE.Raycaster();
const tracers = [], puffs = [];
function tracer(from, to, color = 0xffe08a) {
  const geo = new THREE.BufferGeometry().setFromPoints([from, to]);
  const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 }));
  scene.add(line); tracers.push({ line, t: 0.09 });
}
function puff(p, color = 0xcfc0a0) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 }));
  m.position.copy(p); scene.add(m); puffs.push({ m, t: 0.35, v: new THREE.Vector3(0, 1.4, 0) });
}
function killfeed(html) {
  const kf = document.getElementById('killfeed');
  const d = document.createElement('div'); d.innerHTML = html;
  kf.prepend(d);
  while (kf.children.length > 6) kf.lastChild.remove();
  setTimeout(() => d.remove(), 6000);
}
function hitmark() {
  const h = document.getElementById('hitmarker');
  h.classList.remove('show'); void h.offsetWidth; h.classList.add('show');
}
function damageFlash() {
  const v = document.getElementById('damage-vignette');
  v.style.opacity = 1; setTimeout(() => v.style.opacity = 0, 180);
}

function shootRay(origin, dir, spread) {
  dir = dir.clone();
  dir.x += (Math.random() - 0.5) * spread * 2;
  dir.y += (Math.random() - 0.5) * spread * 2;
  dir.z += (Math.random() - 0.5) * spread * 2;
  dir.normalize();
  ray.set(origin, dir); ray.far = 120;
  const meshes = [];
  bots.forEach((b) => { if (b.alive) b.mesh.traverse((o) => { if (o.isMesh) { o.userData.bot = b; meshes.push(o); } }); });
  solids.forEach((s) => meshes.push(s));
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hits = ray.intersectObjects(meshes, false);
  let dist = 120, point = origin.clone().add(dir.clone().multiplyScalar(120)), bot = null, head = false;
  if (hits.length) { dist = hits[0].distance; point = hits[0].point; if (hits[0].object.userData.bot) { bot = hits[0].object.userData.bot; head = hits[0].object.name === 'head'; } }
  else {
    const gp = new THREE.Vector3();
    if (ray.ray.intersectPlane(groundPlane, gp)) { dist = origin.distanceTo(gp); point = gp; }
  }
  return { dist, point, bot, head, dir };
}

function tryShoot() {
  const now = performance.now();
  const interval = 60000 / weapon.rpm;
  if (now - lastShot < interval || reloading) return;
  if (magAmmo <= 0) { sfx.dry(); lastShot = now; reload(); return; }
  lastShot = now; magAmmo--;
  sfx.shot(weapon.name === 'AWP');
  const flash = gunGroup.getObjectByName('flash');
  flash.intensity = 6; setTimeout(() => flash.intensity = 0, 50);
  gunGroup.position.z = 0.09; setTimeout(() => gunGroup.position.z = 0, 60);
  // recoil
  player.pitch += weapon.name === 'AWP' ? 0.035 : 0.008;
  const spread = weapon.spread + (moving ? 0.02 : 0) + (airborne ? 0.04 : 0) + (aiming ? -0.012 : 0);
  camera.getWorldDirection(tmpDir);
  const origin = camera.position.clone();
  const r = shootRay(origin, tmpDir, Math.max(0.0008, spread));
  tracer(camera.localToWorld(new THREE.Vector3(0.22, -0.16, -0.75)), r.point);
  if (r.bot && r.bot.alive) {
    const dmg = r.dist > 30 ? weapon.dmg * 0.8 : weapon.dmg;
    hurtBot(r.bot, dmg * (r.head ? weapon.head : 1), r.head, true);
  } else if (r.dist < 120) puff(r.point);
  updateHud();
  if (magAmmo === 0) setTimeout(reload, 250);
}
const tmpDir = new THREE.Vector3();

function hurtBot(b, dmg, head, byPlayer) {
  b.hp -= dmg; hitmark(); sfx.hit(); puff(b.mesh.position.clone().add(new THREE.Vector3(0, 1.3, 0)), 0xaa2222);
  if (b.hp <= 0 && b.alive) {
    b.alive = false;
    dropBombIfCarrier(b);
    if (bomb.defuser === b) { bomb.defuser = null; bomb.defuseProg = 0; }
    b.mesh.rotation.x = -Math.PI / 2; b.mesh.position.y = 0.3;
    killfeed(`${byPlayer ? '<b style="color:#7cc4ff">YOU</b>' : b.team} 🔫 <b style="color:#ffbe6b">${b.team}-bot</b>${head ? ' <i>HEADSHOT</i>' : ''}`);
    if (byPlayer) { player.money += head ? 400 : 300; }
    checkRoundEnd();
    setTimeout(() => { // respawn next round only; hide briefly handled by round reset
      if (!roundLive) return;
    }, 1000);
  }
  updateHud();
}

let reloading = false;
function reload() {
  if (reloading || magAmmo >= weapon.mag || reserveAmmo <= 0 || !player.alive) return;
  reloading = true; sfx.reload();
  document.getElementById('roundmsg').textContent = 'reloading…';
  setTimeout(() => {
    const need = weapon.mag - magAmmo, take = Math.min(need, reserveAmmo);
    magAmmo += take; reserveAmmo -= take; reloading = false;
    document.getElementById('roundmsg').textContent = '';
    updateHud();
  }, weapon.name === 'AWP' ? 2200 : 1400);
}

// ---------------- rounds ----------------
let started = false, roundLive = false, roundT = 120, ctWins = 0, tWins = 0, roundNum = 1;
const WIN_SCORE = 5;
function resetRound(msg) {
  player.hp = 100; player.armor = 100; player.alive = true;
  player.pos.set(0, 1.7, 24); player.yaw = Math.PI; player.pitch = 0;
  magAmmo = weapon.mag; reserveAmmo = weapon.reserve;
  bots.forEach((b) => {
    b.alive = true; b.hp = 100; b.mesh.rotation.x = 0; b.mesh.position.y = 0;
    const sp = b.team === 'T' ? ENEMY_SPAWNS[Math.floor(Math.random() * ENEMY_SPAWNS.length)]
      : MATE_SPAWNS[Math.floor(Math.random() * MATE_SPAWNS.length)];
    b.mesh.position.set(sp[0] + Math.random() * 2, 0, sp[1] + Math.random() * 2);
  });
  botAlive('CT').forEach((m, i) => m.guard = i % 2 ? 'B' : 'A'); // CT mates each guard a site
  resetBomb();
  roundT = 120; roundLive = true; started = true;
  const rm = document.getElementById('roundmsg');
  rm.textContent = msg || `ROUND ${roundNum} — GO`;
  setTimeout(() => { if (rm.textContent.startsWith('ROUND')) rm.textContent = ''; }, 2500);
  updateHud();
}
function endRound(winner, reason) {
  if (!roundLive) return;
  roundLive = false;
  if (winner === 'CT') { ctWins++; player.money += 1400; }
  else tWins++;
  banner(reason); sfx.round(); updateHud();
  if (ctWins >= WIN_SCORE || tWins >= WIN_SCORE) {
    setTimeout(() => { banner(ctWins > tWins ? '🏆 CT VICTORY' : '🏆 T VICTORY'); }, 1200);
    setTimeout(() => { ctWins = 0; tWins = 0; roundNum = 1; resetRound('NEW MATCH — GO'); }, 4500);
  } else { roundNum++; setTimeout(() => resetRound(), 3000); }
}
function checkRoundEnd() {
  if (!roundLive) return;
  const t = botAlive('T').length;
  const ctAlive = (player.alive ? 1 : 0) + botAlive('CT').length;
  if (bomb.state === 'planted') {
    // planted bomb decides: CT must defuse; T already wins if no CT left alive
    if (ctAlive === 0) endRound('T', 'T WIN — no defuse possible');
    return;
  }
  if (t === 0) endRound('CT', 'CT WIN — site held');
  else if (ctAlive === 0) endRound('T', 'T WIN — site taken');
}
function banner(t) { document.getElementById('roundmsg').textContent = t; }
function hurtPlayer(dmg) {
  if (!player.alive || !roundLive) return;
  const absorbed = Math.min(player.armor, dmg * 0.5);
  player.armor -= absorbed; player.hp -= (dmg - absorbed * 0.5);
  sfx.hurt(); damageFlash();
  if (player.hp <= 0) {
    player.hp = 0; player.alive = false; playerDefuse = 0; hideChannel();
    killfeed(`<b style="color:#ffbe6b">T-bot</b> 🔫 <b style="color:#7cc4ff">YOU</b>`);
    banner('YOU DIED — spectating');
    checkRoundEnd();
    setTimeout(() => { if (!player.alive && roundLive) { /* stay dead till round end */ } }, 500);
  }
  updateHud();
}

// buy menu
function toggleBuy(force) {
  const bm = document.getElementById('buy-menu');
  const show = force !== undefined ? force : bm.classList.contains('hidden');
  bm.classList.toggle('hidden', !show);
}
function buyChoice(code) {
  const bm = document.getElementById('buy-menu');
  if (bm.classList.contains('hidden')) {
    if (code === 'Digit1') setWeapon('rifle', true);
    return;
  }
  if (code === 'Digit1') buy('rifle');
  if (code === 'Digit2') buy('smg');
  if (code === 'Digit3') buy('awp');
  if (code === 'Digit0') toggleBuy(false);
}
function setWeapon(k, free) {
  weapon = JSON.parse(JSON.stringify(WEAPONS[k]));
  magAmmo = weapon.mag; reserveAmmo = weapon.reserve;
  document.getElementById('weapon-name').textContent = weapon.name;
  updateHud();
}
function buy(k) {
  const w = WEAPONS[k];
  if (player.money < w.price) { banner('not enough money'); return; }
  player.money -= w.price; setWeapon(k); toggleBuy(false); banner(`${w.name} equipped`);
}

// ---------------- HUD ----------------
function updateHud() {
  document.getElementById('hp').textContent = Math.max(0, Math.ceil(player.hp));
  document.getElementById('armor').textContent = Math.max(0, Math.ceil(player.armor));
  document.getElementById('money').textContent = '$' + player.money;
  document.getElementById('mag').textContent = magAmmo;
  document.getElementById('reserve').textContent = '/ ' + reserveAmmo;
  document.getElementById('weapon-name').textContent = weapon.name;
  document.getElementById('ct-wins').textContent = ctWins;
  document.getElementById('t-wins').textContent = tWins;
  if (bomb.state === 'planted') {
    document.getElementById('timer').textContent = `💣 0:${String(Math.max(0, Math.ceil(bomb.tickT))).padStart(2, '0')}`;
  } else {
    const m = Math.floor(Math.max(0, roundT) / 60), s = Math.floor(Math.max(0, roundT) % 60);
    document.getElementById('timer').textContent = `${m}:${String(s).padStart(2, '0')}`;
  }
  const bs = document.getElementById('bomb-status');
  if (bs) {
    if (bomb.state === 'carried') bs.textContent = `💣 T pushing → ${bomb.site}`;
    else if (bomb.state === 'dropped') bs.textContent = `💣 BOMB DROPPED — T recovering`;
    else if (bomb.state === 'planted') bs.textContent = `💣 PLANTED ${bomb.site} — ${Math.max(0, Math.ceil(bomb.tickT))}s — HOLD E NEAR IT`;
    bs.style.color = bomb.state === 'planted' ? '#ff6b5e' : '#ffd47a';
  }
}
function drawMinimap() {
  const cv = document.getElementById('minimap'), c = cv.getContext('2d');
  c.clearRect(0, 0, 160, 160);
  c.fillStyle = '#0e141b'; c.fillRect(0, 0, 160, 160);
  c.strokeStyle = '#2b3a4d'; c.strokeRect(8, 8, 144, 144);
  c.fillStyle = '#ffd47a'; c.font = 'bold 12px Arial';
  c.fillText('A', 28, 130); c.fillText('B', 122, 40);
  const dot = (x, z, col, big) => {
    c.fillStyle = col;
    c.beginPath(); c.arc(8 + ((x + 30) / 60) * 144, 8 + ((z + 30) / 60) * 144, big ? 4 : 3, 0, 7); c.fill();
  };
  bots.forEach((b) => { if (b.alive) dot(b.mesh.position.x, b.mesh.position.z, b.team === 'T' ? '#ff6b5e' : '#5eb1ff'); });
  if (player.alive) dot(player.pos.x, player.pos.z, '#39ff7a', true);
  if (bomb.state === 'planted') {
    if (Math.floor(performance.now() / 300) % 2 === 0) dot(bomb.pos.x, bomb.pos.z, '#ff2222', true);
  } else if (bomb.state === 'dropped') dot(bomb.pos.x, bomb.pos.z, '#ff9d2e', true);
  else if (bomb.state === 'carried' && bomb.carrier && bomb.carrier.alive)
    dot(bomb.carrier.mesh.position.x, bomb.carrier.mesh.position.z, '#ff9d2e');
}

// ---------------- loop ----------------
let moving = false, airborne = false, prevT = performance.now();
const fwd = new THREE.Vector3(), right = new THREE.Vector3(), wish = new THREE.Vector3();
function step() {
  requestAnimationFrame(step);
  const now = performance.now();
  const dt = Math.min(0.05, (now - prevT) / 1000); prevT = now;

  if (locked && started && player.alive) {
    // movement
    fwd.set(-Math.sin(player.yaw), 0, -Math.cos(player.yaw));
    right.set(-fwd.z, 0, fwd.x);
    wish.set(0, 0, 0);
    if (keys.KeyW) wish.add(fwd); if (keys.KeyS) wish.sub(fwd);
    if (keys.KeyD) wish.add(right); if (keys.KeyA) wish.sub(right);
    moving = wish.lengthSq() > 0;
    if (moving) wish.normalize();
    const sp = (keys.ShiftLeft ? 8.4 : player.speed) * (aiming ? 0.55 : 1);
    const nx = player.pos.x + wish.x * sp * dt, nz = player.pos.z + wish.z * sp * dt;
    const tryP = player.pos.clone(); tryP.x = nx; tryP.z = nz;
    // vertical
    if (keys.Space && player.onGround) { player.vel.y = 5.2; player.onGround = false; }
    player.vel.y -= 14 * dt;
    let ny = player.pos.y + player.vel.y * dt;
    if (ny <= 1.7) { ny = 1.7; player.vel.y = 0; player.onGround = true; } else player.onGround = false;
    airborne = !player.onGround;
    tryP.y = ny;
    const feet = tryP.clone(); feet.x = nx;
    if (!collide(new THREE.Vector3(nx, player.pos.y, player.pos.z))) player.pos.x = nx;
    if (!collide(new THREE.Vector3(player.pos.x, player.pos.y, nz))) player.pos.z = nz;
    if (!collide(new THREE.Vector3(player.pos.x, ny, player.pos.z))) player.pos.y = ny;
    else { player.vel.y = 0; player.onGround = true; }
    player.pos.x = Math.max(-29, Math.min(29, player.pos.x));
    player.pos.z = Math.max(-29, Math.min(29, player.pos.z));
    camera.position.copy(player.pos);
    camera.rotation.set(player.pitch, player.yaw, 0);
    const targetFov = aiming ? (weapon.name === 'AWP' ? 22 : 50) : 75;
    camera.fov += (targetFov - camera.fov) * 0.18; camera.updateProjectionMatrix();
    if (firing) tryShoot();
    // crosshair spread viz
    document.getElementById('crosshair').style.setProperty('--gap', `${6 + (moving ? 6 : 0) + (airborne ? 8 : 0) + (weapon.name === 'AWP' && !aiming ? 14 : 0)}px`);
    document.getElementById('crosshair').style.opacity = aiming && weapon.name === 'AWP' ? 0 : 1;
  }

  // bots AI
  if (roundLive) {
    roundT -= dt;
    if (roundT <= 0) { // time -> CT win, unless the bomb is planted (then it decides)
      if (bomb.state === 'planted') roundT = 0;
      else endRound('CT', 'TIME — CT WIN');
    }
    // planted bomb countdown
    if (roundLive && bomb.state === 'planted') {
      bomb.tickT -= dt;
      bomb.beepT -= dt;
      if (bomb.beepT <= 0) { sfx.beep(); bomb.beepT = Math.max(0.15, bomb.tickT / BOMB_TICK); }
      if (bomb.tickT <= 0) detonateBomb();
    }
    // player defuse: hold E near the planted bomb
    if (roundLive && bomb.state === 'planted' && player.alive) {
      const near = Math.hypot(player.pos.x - bomb.pos.x, player.pos.z - bomb.pos.z) < 3.2;
      document.getElementById('defuse-prompt').classList.toggle('hidden', !near);
      if (near && keys.KeyE) {
        playerDefuse += dt;
        if (Math.floor(playerDefuse * 3) !== Math.floor((playerDefuse - dt) * 3)) sfx.beep();
        if (playerDefuse >= PLAYER_DEFUSE_TIME) { playerDefuse = 0; defuseWin(true); }
      } else playerDefuse = Math.max(0, playerDefuse - dt * 2);
      const chW = document.getElementById('channel-wrap');
      if (playerDefuse > 0 || near) {
        chW.classList.remove('hidden');
        document.getElementById('channel-fill').style.width = `${Math.min(100, playerDefuse / PLAYER_DEFUSE_TIME * 100)}%`;
        document.getElementById('channel-label').textContent = `DEFUSING… ${Math.max(0, Math.ceil(PLAYER_DEFUSE_TIME - playerDefuse))}s`;
      } else chW.classList.add('hidden');
    } else if (!roundLive) hideChannel();
    for (const b of bots) {
      if (!b.alive) continue;
      b.strafe += dt;
      // ----- bomb orders -----
      let holdPos = false, orderDest = null;
      if (b.team === 'T') {
        if (bomb.state === 'carried' && bomb.carrier === b) {
          const s = SITES[bomb.site];
          const dSite = Math.hypot(b.mesh.position.x - s.x, b.mesh.position.z - s.z);
          if (dSite < SITE_R) {
            holdPos = true; // planting — stand still, channel
            b.mesh.lookAt(s.x, 0, s.z);
            bomb.plantProg += dt;
            if (Math.floor(bomb.plantProg * 4) !== Math.floor((bomb.plantProg - dt) * 4)) sfx.beep();
            if (bomb.plantProg >= PLANT_TIME) plantBomb(b);
          } else orderDest = s;
        } else if (bomb.state === 'dropped') {
          let best = null, bd = 1e9;
          for (const t of botAlive('T')) { const d = t.mesh.position.distanceTo(bomb.pos); if (d < bd) { bd = d; best = t; } }
          if (best === b) {
            if (bd < 1.8) {
              bomb.state = 'carried'; bomb.carrier = b; bomb.plantProg = 0;
              bombMesh.visible = false;
              killfeed(`💣 <b style="color:#ffbe6b">T-bot</b> picked up the bomb`);
              updateHud();
            } else orderDest = bomb.pos;
          } else if (bomb.carrier && bomb.carrier.alive) {
            orderDest = bomb.carrier.mesh.position;
          }
        } else if (bomb.state === 'planted') {
          const a = b.strafe * 0.6 + b.speed; // defend ring around the bomb
          orderDest = new THREE.Vector3(bomb.pos.x + Math.cos(a) * 5, 0, bomb.pos.z + Math.sin(a) * 5);
        } else if (bomb.carrier && bomb.carrier.alive && bomb.carrier !== b) {
          const c = bomb.carrier.mesh.position; // escort the carrier
          orderDest = new THREE.Vector3(c.x + Math.cos(b.strafe * 0.5) * 3, 0, c.z + Math.sin(b.strafe * 0.5) * 3);
        }
      } else {
        if (bomb.state === 'planted') {
          let best = null, bd = 1e9; // nearest mate defuses, rest retake
          for (const m of botAlive('CT')) { const d = m.mesh.position.distanceTo(bomb.pos); if (d < bd) { bd = d; best = m; } }
          bomb.defuser = best;
          if (best === b) {
            if (bd < 2.2) {
              holdPos = true;
              b.mesh.lookAt(bomb.pos.x, 0, bomb.pos.z);
              bomb.defuseProg += dt;
              if (bomb.defuseProg >= BOT_DEFUSE_TIME) defuseWin(false);
            } else orderDest = bomb.pos;
          } else {
            const a = b.strafe * 0.7;
            orderDest = new THREE.Vector3(bomb.pos.x + Math.cos(a) * 6, 0, bomb.pos.z + Math.sin(a) * 6);
          }
        } else {
          orderDest = SITES[b.guard || 'A']; // guard assigned site
        }
      }
      // pick target: player if CT... enemies target player + CT bots; mates target T bots
      // stuck detour: if ordered movement made no progress, sidestep briefly
      if (!holdPos && b.detour && b.detour.t > 0) {
        b.detour.t -= dt; orderDest = b.detour.p;
      }
      let foe = null, foePos = null;
      const candidates = [];
      if (b.team === 'T') {
        if (player.alive) candidates.push({ p: player.pos, isP: true, hp: player.hp });
        botAlive('CT').forEach((m) => candidates.push({ p: m.mesh.position.clone().add(new THREE.Vector3(0, 1.4, 0)), bot: m }));
      } else {
        botAlive('T').forEach((m) => candidates.push({ p: m.mesh.position.clone().add(new THREE.Vector3(0, 1.4, 0)), bot: m }));
      }
      let best = 1e9;
      for (const c of candidates) {
        const d = b.mesh.position.distanceTo(new THREE.Vector3(c.p.x, 0, c.p.z));
        if (d < best) { best = d; foe = c; foePos = c.p; }
      }
      const eye = b.mesh.position.clone(); eye.y = 1.5;
      let seen = false;
      if (foe) {
        const dir = foePos.clone().sub(eye); const dist = dir.length(); dir.normalize();
        ray.set(eye, dir); ray.far = dist + 0.5;
        const block = ray.intersectObjects(solids, false);
        seen = !(block.length && block[0].distance < dist - 0.6) && dist < 55;
      }
      if (seen && foe && !holdPos) {
        // face foe
        b.mesh.lookAt(foePos.x, 0, foePos.z);
        b.shootCd -= dt;
        if (b.shootCd <= 0) {
          b.shootCd = 0.7 + Math.random() * 0.9;
          sfx.enemyShot();
          const from = eye.clone();
          tracer(from, foePos.clone(), 0xff7a6b);
          const hitChance = best < 10 ? 0.32 : best < 22 ? 0.18 : 0.08;
          if (Math.random() < hitChance) {
            if (foe.isP) hurtPlayer(8 + Math.random() * 14);
            else { foe.bot.hp -= 20 + Math.random() * 20; puff(foePos, 0xaa2222);
              if (foe.bot.hp <= 0 && foe.bot.alive) {
                foe.bot.alive = false; foe.bot.mesh.rotation.x = -Math.PI / 2; foe.bot.mesh.position.y = 0.3;
                dropBombIfCarrier(foe.bot);
                if (bomb.defuser === foe.bot) { bomb.defuser = null; bomb.defuseProg = 0; }
                const kCol = b.team === 'T' ? '#ffbe6b' : '#7cc4ff';
                const vCol = b.team === 'T' ? '#7cc4ff' : '#ffbe6b';
                killfeed(`<b style="color:${kCol}">${b.team}-bot</b> 🔫 <b style="color:${vCol}">${foe.bot.team}-bot</b>`);
                checkRoundEnd(); } }
          } else if (foePos) puff(foePos.clone().add(new THREE.Vector3((Math.random()-0.5)*2, 0, (Math.random()-0.5)*2)));
        }
      } else if (holdPos) {
        // channeling plant/defuse — stand still
      } else if (orderDest) {
        if (!b.lastPos) { b.lastPos = b.mesh.position.clone(); b.stuckT = 0; }
        botGoto(b, orderDest, dt);
        if (b.mesh.position.distanceTo(b.lastPos) < Math.max(0.02, b.speed * dt * 0.35)) b.stuckT += dt;
        else { b.stuckT = 0; b.lastPos.copy(b.mesh.position); }
        if (b.stuckT > 1.2) { // sidestep waypoint for 1s to unstick
          b.detour = { p: new THREE.Vector3(b.mesh.position.x + (Math.random() - 0.5) * 12, 0, b.mesh.position.z + (Math.random() - 0.5) * 12), t: 1.0 };
          b.stuckT = 0; b.lastPos.copy(b.mesh.position);
        }
      } else {
        // wander toward target
        if (b.mesh.position.distanceTo(b.target) < 2)
          b.target.set((Math.random() - 0.5) * 44, 0, (Math.random() - 0.5) * 44);
        const d = b.target.clone().sub(b.mesh.position); d.y = 0;
        if (d.length() > 0.2) {
          d.normalize();
          b.mesh.lookAt(b.mesh.position.x + d.x, 0, b.mesh.position.z + d.z);
          const stepV = d.multiplyScalar(b.speed * dt);
          const np = b.mesh.position.clone().add(stepV);
          const box = new THREE.Box3(new THREE.Vector3(np.x - 0.4, 0, np.z - 0.4), new THREE.Vector3(np.x + 0.4, 2, np.z + 0.4));
          let hit = false;
          for (const c of colliders) if (box.intersectsBox(c)) { hit = true; break; }
          if (!hit) b.mesh.position.copy(np);
          else b.target.set((Math.random() - 0.5) * 44, 0, (Math.random() - 0.5) * 44);
        }
      }
      // mate bots help: same logic already targets T
    }
    if (Math.floor(now / 250) !== Math.floor((now - dt * 1000) / 250)) { updateHud(); drawMinimap(); }
  }

  // fx decay
  for (let i = tracers.length - 1; i >= 0; i--) {
    tracers[i].t -= dt;
    tracers[i].line.material.opacity = Math.max(0, tracers[i].t * 8);
    if (tracers[i].t <= 0) { scene.remove(tracers[i].line); tracers.splice(i, 1); }
  }
  for (let i = puffs.length - 1; i >= 0; i--) {
    puffs[i].t -= dt;
    puffs[i].m.position.add(puffs[i].v.clone().multiplyScalar(dt));
    puffs[i].m.material.opacity = Math.max(0, puffs[i].t * 2);
    puffs[i].m.scale.multiplyScalar(1.04);
    if (puffs[i].t <= 0) { scene.remove(puffs[i].m); puffs.splice(i, 1); }
  }

  // explosion fx
  if (boomFx) {
    boomFx.t -= dt;
    boomFx.m.scale.multiplyScalar(1.18);
    boomFx.m.material.opacity = Math.max(0, boomFx.t);
    boomFx.l.intensity = Math.max(0, boomFx.t * 30);
    if (boomFx.t <= 0) { scene.remove(boomFx.m); scene.remove(boomFx.l); boomFx = null; }
  }
  // bomb blink
  if (bombMesh.visible) {
    const on = Math.floor(now / (bomb.state === 'planted' ? 150 : 500)) % 2 === 0;
    bombLight.intensity = on ? 6 : 0.4;
    const lamp = bombMesh.getObjectByName('lamp');
    if (lamp) lamp.visible = on;
  }
  // explosion camera shake (locked play only, so no drift when spectating)
  if (shakeT > 0 && locked) {
    shakeT -= dt;
    camera.position.x += (Math.random() - 0.5) * shakeT * 1.4;
    camera.position.y += (Math.random() - 0.5) * shakeT * 1.4;
  }

  renderer.render(scene, camera);
  if (!window.__sceneReady) {
    window.__sceneReady = true;
    document.getElementById('scene-ready').style.display = 'block';
    document.getElementById('load-status').textContent = 'map loaded — click deploy';
  }
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// auto-start round in background so screenshots show action even before lock
resetRound('ROUND 1 — CLICK DEPLOY');
roundLive = true;
updateHud(); drawMinimap();
window.__game = { bomb, player, bots, SITES, get roundLive() { return roundLive; } };
step();
