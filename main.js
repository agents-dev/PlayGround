import * as THREE from 'three';

// ============ Константы ============
const WX = 64, WY = 40, WZ = 64;
const SAVE_KEY = 'mini-minecraft-save-v1';

const AIR = 0, GRASS = 1, DIRT = 2, STONE = 3, LOG = 4, LEAVES = 5,
      SAND = 6, PLANKS = 7, BRICK = 8, GLASS = 9;

const BLOCKS = {
  [GRASS]:  { name: 'Трава' },
  [DIRT]:   { name: 'Земля' },
  [STONE]:  { name: 'Камень' },
  [LOG]:    { name: 'Дерево' },
  [LEAVES]: { name: 'Листва' },
  [SAND]:   { name: 'Песок' },
  [PLANKS]: { name: 'Доски' },
  [BRICK]:  { name: 'Кирпич' },
  [GLASS]:  { name: 'Стекло' },
};
const HOTBAR = [GRASS, DIRT, STONE, LOG, PLANKS, LEAVES, SAND, BRICK, GLASS];

// ============ Процедурные текстуры 16x16 ============
function canvasTex(draw) {
  const c = document.createElement('canvas');
  c.width = 16; c.height = 16;
  const g = c.getContext('2d');
  draw(g);
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  return { tex: t, canvas: c };
}
function noisy(g, base, vary, n = 90) {
  g.fillStyle = base; g.fillRect(0, 0, 16, 16);
  for (let i = 0; i < n; i++) {
    const v = (Math.random() - 0.5) * vary;
    const shade = v > 0 ? 255 : 0;
    g.fillStyle = `rgba(${shade},${shade},${shade},${Math.abs(v)})`;
    g.fillRect((Math.random() * 16) | 0, (Math.random() * 16) | 0, 1, 1);
  }
}
const T = {};
T.dirt = canvasTex(g => noisy(g, '#8a5a32', 0.18));
T.grassTop = canvasTex(g => noisy(g, '#5fae3f', 0.22));
T.grassSide = canvasTex(g => {
  noisy(g, '#8a5a32', 0.18);
  g.fillStyle = '#5fae3f'; g.fillRect(0, 0, 16, 4);
  g.fillStyle = '#4e9433';
  for (let x = 0; x < 16; x++) {
    const h = 4 + ((x * 7 + 3) % 3);
    g.fillRect(x, 4, 1, h - 4);
  }
});
T.stone = canvasTex(g => noisy(g, '#8d8d8d', 0.14));
T.logSide = canvasTex(g => {
  noisy(g, '#6b4a2b', 0.2);
  g.fillStyle = 'rgba(0,0,0,0.35)';
  for (let x = 2; x < 16; x += 4) g.fillRect(x, 0, 1, 16);
});
T.logTop = canvasTex(g => {
  noisy(g, '#a67c4e', 0.12);
  g.strokeStyle = '#6b4a2b'; g.lineWidth = 1;
  g.strokeRect(1.5, 1.5, 13, 13); g.strokeRect(4.5, 4.5, 7, 7);
});
T.leaves = canvasTex(g => {
  noisy(g, '#2f7d26', 0.35);
  g.fillStyle = 'rgba(0,0,0,0.4)';
  for (let i = 0; i < 22; i++) g.fillRect((Math.random() * 16) | 0, (Math.random() * 16) | 0, 2, 1);
});
T.sand = canvasTex(g => noisy(g, '#e3d79b', 0.12));
T.planks = canvasTex(g => {
  noisy(g, '#b08a4f', 0.12);
  g.fillStyle = 'rgba(0,0,0,0.4)';
  for (let y = 3; y < 16; y += 4) g.fillRect(0, y, 16, 1);
  g.fillRect(8, 0, 1, 4); g.fillRect(4, 4, 1, 4); g.fillRect(12, 8, 1, 4); g.fillRect(6, 12, 1, 4);
});
T.brick = canvasTex(g => {
  g.fillStyle = '#9e4a3c'; g.fillRect(0, 0, 16, 16);
  g.fillStyle = '#c9c9c9'; g.fillRect(0, 0, 16, 16);
  g.fillStyle = '#9e4a3c';
  g.fillRect(0, 0, 7, 3); g.fillRect(8, 0, 8, 3);
  g.fillRect(0, 4, 3, 3); g.fillRect(4, 4, 7, 3); g.fillRect(12, 4, 4, 3);
  g.fillRect(0, 8, 7, 3); g.fillRect(8, 8, 8, 3);
  g.fillRect(0, 12, 3, 3); g.fillRect(4, 12, 7, 3); g.fillRect(12, 12, 4, 3);
  noisy(g, 'rgba(0,0,0,0)', 0.08, 40);
});
T.glass = canvasTex(g => {
  g.fillStyle = 'rgba(190,230,240,0.9)'; g.fillRect(0, 0, 16, 16);
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, 16, 1); g.fillRect(0, 0, 1, 16);
  g.fillRect(0, 15, 16, 1); g.fillRect(15, 0, 1, 16);
  g.fillStyle = 'rgba(255,255,255,0.85)';
  g.fillRect(3, 10, 2, 3); g.fillRect(5, 8, 2, 3); g.fillRect(7, 5, 2, 4);
});

function mat(map, opts = {}) {
  return new THREE.MeshLambertMaterial({ map: map.tex, ...opts });
}
const MATERIALS = {
  [GRASS]:  [mat(T.grassSide), mat(T.grassSide), mat(T.grassTop), mat(T.dirt), mat(T.grassSide), mat(T.grassSide)],
  [DIRT]:   mat(T.dirt),
  [STONE]:  mat(T.stone),
  [LOG]:    [mat(T.logSide), mat(T.logSide), mat(T.logTop), mat(T.logTop), mat(T.logSide), mat(T.logSide)],
  [LEAVES]: mat(T.leaves),
  [SAND]:   mat(T.sand),
  [PLANKS]: mat(T.planks),
  [BRICK]:  mat(T.brick),
  [GLASS]:  mat(T.glass, { transparent: true, opacity: 0.55 }),
};

// ============ Мир (воксельные данные) ============
let seed = (Math.random() * 1e9) | 0;
let data = new Uint8Array(WX * WY * WZ);
const idx = (x, y, z) => (y * WZ + z) * WX + x;

function getBlock(x, y, z) {
  if (y < 0) return STONE; // пол под миром
  if (x < 0 || y >= WY || z < 0 || x >= WX || z >= WZ) return AIR;
  return data[idx(x, y, z)];
}
function setBlock(x, y, z, v) {
  if (x < 0 || y < 0 || z < 0 || x >= WX || y >= WY || z >= WZ) return;
  data[idx(x, y, z)] = v;
}
const isOpaque = t => t !== AIR && t !== GLASS;
const isSolid = t => t !== AIR;

// Детерминированный value-noise
function hash2(x, z) {
  let h = (x * 374761393 + z * 668265263 + seed * 974634211) | 0;
  h = (h ^ (h >> 13)) | 0;
  h = (h * 1274126177) | 0;
  h = (h ^ (h >> 16)) >>> 0;
  return h / 4294967295;
}
function smooth(t) { return t * t * (3 - 2 * t); }
function valueNoise(x, z) {
  const xi = Math.floor(x), zi = Math.floor(z);
  const xf = x - xi, zf = z - zi;
  const a = hash2(xi, zi), b = hash2(xi + 1, zi), c = hash2(xi, zi + 1), d = hash2(xi + 1, zi + 1);
  const u = smooth(xf), v = smooth(zf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function heightAt(x, z) {
  const n1 = valueNoise(x * 0.06, z * 0.06);
  const n2 = valueNoise(x * 0.18 + 100, z * 0.18 + 100);
  return Math.floor(10 + n1 * 9 + n2 * 3 + Math.sin(x * 0.15) * 1.2 + Math.cos(z * 0.13) * 1.2);
}

function generateWorld() {
  data = new Uint8Array(WX * WY * WZ);
  for (let x = 0; x < WX; x++) {
    for (let z = 0; z < WZ; z++) {
      const h = Math.min(WY - 8, Math.max(2, heightAt(x, z)));
      for (let y = 0; y <= h; y++) {
        let b = STONE;
        if (y === h) b = h <= 8 ? SAND : GRASS;
        else if (y >= h - 2) b = h <= 8 ? SAND : DIRT;
        setBlock(x, y, z, b);
      }
    }
  }
  // Деревья
  let trees = 0, guard = 0;
  while (trees < 42 && guard++ < 2000) {
    const x = 3 + ((Math.random() * (WX - 6)) | 0);
    const z = 3 + ((Math.random() * (WZ - 6)) | 0);
    const h = heightAt(x, z);
    if (h <= 8 || h + 6 >= WY) continue;
    if (getBlock(x, h, z) !== GRASS) continue;
    const th = 4 + ((Math.random() * 2) | 0);
    for (let i = 1; i <= th; i++) setBlock(x, h + i, z, LOG);
    for (let dx = -2; dx <= 2; dx++)
      for (let dz = -2; dz <= 2; dz++)
        for (let dy = th - 2; dy <= th + 1; dy++) {
          if (Math.abs(dx) === 2 && Math.abs(dz) === 2) continue;
          if (dy === th + 1 && (Math.abs(dx) + Math.abs(dz) > 1)) continue;
          const px = x + dx, py = h + dy, pz = z + dz;
          if (getBlock(px, py, pz) === AIR) setBlock(px, py, pz, LEAVES);
        }
    setBlock(x, h + th + 1, z, LEAVES);
    trees++;
  }
}

// ============ Three.js сцена ============
const canvas = document.getElementById('game');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 30, 110);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 500);

const hemi = new THREE.HemisphereLight(0xcfe8ff, 0x6b8e4e, 0.95);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 1.1);
sun.position.set(40, 60, 20);
scene.add(sun);
const moonLight = new THREE.DirectionalLight(0x8fa8ff, 0.0);
moonLight.position.set(-40, 60, -20);
scene.add(moonLight);
const amb = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(amb);

// ============ Смена дня и ночи 🌞🌙 ============
const DAY_LEN = 420; // секунд на полные сутки
const timeState = { t: 0.32, paused: false }; // t: 0=полночь, 0.25=рассвет, 0.5=полдень, 0.75=закат
const WORLD_C = new THREE.Vector3(WX / 2, 0, WZ / 2);

const SKY = {
  night: new THREE.Color(0x0b1026),
  dawn: new THREE.Color(0xff9a56),
  day: new THREE.Color(0x87ceeb),
  sunset: new THREE.Color(0xff7e47),
};
const _skyTmp = new THREE.Color();

// Солнце и луна — плоские диски, всегда повёрнуты к камере
const sunMesh = new THREE.Mesh(
  new THREE.CircleGeometry(9, 24),
  new THREE.MeshBasicMaterial({ color: 0xffdd55, fog: false, transparent: true, opacity: 0.95 })
);
const moonMesh = new THREE.Mesh(
  new THREE.CircleGeometry(6, 24),
  new THREE.MeshBasicMaterial({ color: 0xe8ecf5, fog: false, transparent: true, opacity: 0.95 })
);
scene.add(sunMesh, moonMesh);

// Звёзды
let starMat;
{
  const N = 450;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(Math.random() * 0.95); // верхняя полусфера
    const r = 280;
    pos[i * 3] = WORLD_C.x + r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.cos(ph) - 20;
    pos[i * 3 + 2] = WORLD_C.z + r * Math.sin(ph) * Math.sin(th);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false });
  scene.add(new THREE.Points(g, starMat));
}

function updateDayNight(dt) {
  if (!timeState.paused) {
    timeState.t = (timeState.t + dt / DAY_LEN) % 1;
  }
  const ang = (timeState.t - 0.25) * Math.PI * 2; // высота солнца
  const sh = Math.sin(ang); // -1..1
  const daylight = Math.max(0, Math.min(1, sh * 1.6 + 0.25));
  const dusk = Math.max(0, 1 - Math.abs(sh) * 3.2) * (sh > -0.15 ? 1 : 0); // полоса у горизонта
  const night = 1 - daylight;

  // Позиции солнца и луны на орбите вокруг центра мира
  const R = 180;
  const cx = Math.cos(ang), sy = Math.sin(ang);
  sun.position.set(WORLD_C.x + cx * R, sy * R, WORLD_C.z + 40);
  sunMesh.position.set(WORLD_C.x + cx * R, sy * R, WORLD_C.z + 40 - 60);
  sunMesh.lookAt(camera.position);
  const mang = ang + Math.PI;
  moonLight.position.set(WORLD_C.x + Math.cos(mang) * R, Math.max(8, Math.sin(mang) * R), WORLD_C.z - 40);
  moonMesh.position.set(WORLD_C.x + Math.cos(mang) * R, Math.max(10, Math.sin(mang) * R), WORLD_C.z - 100);
  moonMesh.lookAt(camera.position);

  // Свет
  sun.intensity = 0.05 + daylight * 1.1;
  sun.color.setHex(0xffffff).lerp(new THREE.Color(0xff9a3c), dusk * 0.85);
  moonLight.intensity = night * 0.35;
  hemi.intensity = 0.22 + daylight * 0.75;
  amb.intensity = 0.12 + daylight * 0.16;

  // Небо: ночь -> рассвет/закат -> день
  const isDawn = Math.cos(ang) > 0; // восход (утро) или закат (вечер)
  const edge = isDawn ? SKY.dawn : SKY.sunset;
  _skyTmp.copy(SKY.night).lerp(SKY.day, daylight).lerp(edge, dusk * 0.55);
  scene.background.copy(_skyTmp);
  scene.fog.color.copy(_skyTmp);

  starMat.opacity = night * 0.9;
  cloudMat.color.setScalar(0.25 + daylight * 0.75);
  cloudMat.opacity = 0.45 + daylight * 0.3;
  sunMesh.material.opacity = sh > -0.12 ? 0.95 : 0;
  moonMesh.material.opacity = Math.sin(mang) > -0.05 ? 0.95 : 0;
  return { daylight, dusk, night };
}

function formatTime() {
  const mins = Math.floor(timeState.t * 24 * 60);
  return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
}
function timeIcon() {
  if (timeState.paused) return '⏸️';
  const h = timeState.t * 24;
  if (h < 4.5 || h >= 20.5) return '🌙';
  if (h < 6 || h >= 19) return '🌆';
  if (h < 17) return '☀️';
  return '🌇';
}
function updateTimeBadge() {
  const el = document.getElementById('time-badge');
  if (el) el.textContent = `${timeIcon()} ${formatTime()}`;
}

// Облака
const clouds = [];
let cloudMat;
{
  cloudMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 });
  const cg = new THREE.BoxGeometry(1, 1, 1);
  for (let i = 0; i < 22; i++) {
    const m = new THREE.Mesh(cg, cloudMat);
    m.position.set(Math.random() * WX, 30 + Math.random() * 4, Math.random() * WZ);
    m.scale.set(4 + Math.random() * 7, 1, 3 + Math.random() * 5);
    scene.add(m); clouds.push(m);
  }
}

// Подсветка выбранного блока
const highlight = new THREE.LineSegments(
  new THREE.EdgesGeometry(new THREE.BoxGeometry(1.002, 1.002, 1.002)),
  new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.7 })
);
highlight.visible = false;
scene.add(highlight);

// ============ Коровы 🐄 ============
const COW_COUNT = 8;
const cows = [];
const hearts = [];
const cowGroup = new THREE.Group();
scene.add(cowGroup);

T.cowHide = canvasTex(g => {
  g.fillStyle = '#efe9dc'; g.fillRect(0, 0, 16, 16);
  g.fillStyle = '#7a5233';
  const blobs = [[2, 2, 5, 4], [10, 8, 4, 5], [3, 11, 4, 3], [11, 1, 4, 3], [0, 7, 2, 3]];
  for (const [bx, by, w, h] of blobs) g.fillRect(bx, by, w, h);
  g.fillStyle = 'rgba(0,0,0,0.08)';
  for (let i = 0; i < 30; i++) g.fillRect((Math.random() * 16) | 0, (Math.random() * 16) | 0, 1, 1);
});
const cowHideMat = new THREE.MeshLambertMaterial({ map: T.cowHide.tex });
const cowMuzzleMat = new THREE.MeshLambertMaterial({ color: 0xe8a09a });
const cowHornMat = new THREE.MeshLambertMaterial({ color: 0xd8d8d8 });
const cowHoofMat = new THREE.MeshLambertMaterial({ color: 0x3a3a3a });
const cowUdderMat = new THREE.MeshLambertMaterial({ color: 0xe8a0a0 });
const cowEyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });

const heartTex = (() => {
  const c = document.createElement('canvas');
  c.width = 16; c.height = 16;
  const g = c.getContext('2d');
  g.fillStyle = '#ff4d6d';
  const rows = ['01100110', '11111111', '11111111', '11111111', '01111110', '00111100', '00011000'];
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => { if (ch === '1') g.fillRect(x * 2, y * 2 + 1, 2, 2); });
  });
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  return t;
})();

function makeCowMesh() {
  const g = new THREE.Group();
  const parts = {};
  const B = (w, h, d, m, x, y, z, parent = g) => {
    const q = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    q.position.set(x, y, z);
    parent.add(q);
    return q;
  };
  // Тело (вперёд — +X)
  B(1.3, 0.75, 0.7, cowHideMat, 0, 1.05, 0);
  // Вымя
  B(0.3, 0.2, 0.3, cowUdderMat, -0.35, 0.6, 0);
  // Голова на шарнире (для щипания травы)
  const headPivot = new THREE.Group();
  headPivot.position.set(0.65, 1.25, 0);
  g.add(headPivot);
  B(0.45, 0.45, 0.45, cowHideMat, 0.25, 0.05, 0, headPivot);
  B(0.12, 0.22, 0.3, cowMuzzleMat, 0.5, -0.05, 0, headPivot);
  B(0.08, 0.08, 0.02, cowEyeMat, 0.38, 0.12, 0.23, headPivot);
  B(0.08, 0.08, 0.02, cowEyeMat, 0.38, 0.12, -0.23, headPivot);
  B(0.1, 0.14, 0.1, cowHornMat, 0.15, 0.33, 0.15, headPivot);
  B(0.1, 0.14, 0.1, cowHornMat, 0.15, 0.33, -0.15, headPivot);
  B(0.15, 0.08, 0.1, cowHideMat, 0.1, 0.15, 0.28, headPivot);
  B(0.15, 0.08, 0.1, cowHideMat, 0.1, 0.15, -0.28, headPivot);
  parts.headPivot = headPivot;
  // Ноги на шарнирах (для походки)
  parts.legs = [];
  for (const [lx, lz] of [[0.45, 0.22], [0.45, -0.22], [-0.45, 0.22], [-0.45, -0.22]]) {
    const pivot = new THREE.Group();
    pivot.position.set(lx, 0.7, lz);
    g.add(pivot);
    B(0.24, 0.7, 0.24, cowHideMat, 0, -0.35, 0, pivot);
    B(0.26, 0.12, 0.26, cowHoofMat, 0, -0.64, 0, pivot);
    parts.legs.push(pivot);
  }
  // Хвост
  const tailPivot = new THREE.Group();
  tailPivot.position.set(-0.65, 1.25, 0);
  g.add(tailPivot);
  B(0.1, 0.6, 0.1, cowHideMat, 0, -0.3, 0, tailPivot);
  parts.tailPivot = tailPivot;
  g.userData.parts = parts;
  return g;
}

// Верхняя свободная клетка над твёрдым блоком
function groundTopY(x, z) {
  const xi = Math.floor(x), zi = Math.floor(z);
  for (let y = WY - 1; y >= 0; y--) {
    if (isSolid(getBlock(xi, y, zi))) return y + 1;
  }
  return 1;
}

function clearCows() {
  for (const c of cows) cowGroup.remove(c.mesh);
  cows.length = 0;
}

function randomGrassSpot() {
  for (let t = 0; t < 300; t++) {
    const x = 2 + Math.random() * (WX - 4);
    const z = 2 + Math.random() * (WZ - 4);
    const h = Math.min(WY - 3, Math.max(2, heightAt(x | 0, z | 0)));
    if (getBlock(x | 0, h, z | 0) === GRASS &&
        getBlock(x | 0, h + 1, z | 0) === AIR &&
        getBlock(x | 0, h + 2, z | 0) === AIR) {
      return { x: x + 0.5, y: h + 1, z: z + 0.5 };
    }
  }
  const cx = WX / 2, cz = WZ / 2;
  return { x: cx, y: groundTopY(cx, cz), z: cz };
}

function addCow(x, y, z, yaw = Math.random() * Math.PI * 2) {
  const mesh = makeCowMesh();
  mesh.position.set(x, y, z);
  const cow = {
    mesh, yaw,
    state: 'idle', timer: 1 + Math.random() * 2,
    walkPhase: Math.random() * 6, vy: 0,
    mooTimer: 8 + Math.random() * 20,
    petT: 0, phase: Math.random() * 10,
  };
  mesh.userData.cowRef = cow;
  cowGroup.add(mesh);
  cows.push(cow);
  return cow;
}

function spawnCows(n = COW_COUNT) {
  clearCows();
  for (let i = 0; i < n; i++) {
    const s = randomGrassSpot();
    addCow(s.x, s.y, s.z);
  }
  const el = document.getElementById('cows');
  if (el) el.textContent = `🐄 ${cows.length}`;
}

function updateCows(dt) {
  const now = performance.now() / 1000;
  const px = player.pos.x, pz = player.pos.z;
  for (const c of cows) {
    const p = c.mesh.position;
    c.timer -= dt;
    c.mooTimer -= dt;
    if (c.petT > 0) c.petT -= dt;

    const dx = p.x - px, dz = p.z - pz;
    const distP = Math.hypot(dx, dz);

    // Испуг: игрок слишком близко — убегаем
    if (distP < 2.5 && c.state !== 'flee') {
      c.state = 'flee';
      c.timer = 1.2;
      c.yaw = Math.atan2(dz, dx);
      moo(0.35, 200);
    }
    if (c.timer <= 0) {
      const r = Math.random();
      if (c.state === 'flee') { c.state = 'walk'; c.timer = 1 + Math.random() * 2; }
      else if (r < 0.4) { c.state = 'idle'; c.timer = 1 + Math.random() * 2; }
      else if (r < 0.7) { c.state = 'graze'; c.timer = 2 + Math.random() * 2.5; }
      else { c.state = 'walk'; c.timer = 2 + Math.random() * 3; c.yaw += (Math.random() - 0.5) * 2; }
    }

    const speed = c.state === 'walk' ? 1.3 : c.state === 'flee' ? 3.2 : 0;
    if (speed > 0) {
      if (c.state === 'walk') c.yaw += (Math.random() - 0.5) * 1.5 * dt;
      const nx = p.x + Math.cos(c.yaw) * speed * dt;
      const nz = p.z + Math.sin(c.yaw) * speed * dt;
      if (nx < 2 || nx > WX - 2 || nz < 2 || nz > WZ - 2) {
        c.yaw += Math.PI / 2;
      } else {
        const feetY = Math.floor(p.y);
        const aheadHigh = isSolid(getBlock(Math.floor(nx), feetY + 1, Math.floor(nz))) &&
                          isSolid(getBlock(Math.floor(nx), feetY + 2, Math.floor(nz)));
        const gyAhead = groundTopY(nx, nz);
        if (aheadHigh) c.yaw += (Math.random() < 0.5 ? 1 : -1) * 1.2;
        else if (p.y - gyAhead > 3.5) c.yaw += 1.4; // не падаем с обрывов
        else { p.x = nx; p.z = nz; c.walkPhase += dt * speed * 3; }
      }
    }

    // Вертикаль: прыжки + следование рельефу
    const gy = groundTopY(p.x, p.z);
    if (c.vy !== 0 || p.y > gy + 0.02) {
      c.vy -= 20 * dt;
      p.y += c.vy * dt;
      if (p.y <= gy) { p.y = gy; c.vy = 0; }
    } else if (p.y < gy) {
      p.y = Math.min(gy, p.y + 3 * dt); // подъём на ступеньку
    }

    c.mesh.rotation.y = -c.yaw;

    // Анимация ног (диагональные пары)
    const parts = c.mesh.userData.parts;
    const sw = speed > 0 ? Math.sin(c.walkPhase) * 0.6 : 0;
    parts.legs[0].rotation.z = sw;
    parts.legs[3].rotation.z = sw;
    parts.legs[1].rotation.z = -sw;
    parts.legs[2].rotation.z = -sw;

    // Голова: пасёмся — вниз, иначе лёгкое покачивание
    const headTarget = c.state === 'graze' ? -0.9 : Math.sin(now * 1.3 + c.phase) * 0.08;
    parts.headPivot.rotation.z += (headTarget - parts.headPivot.rotation.z) * Math.min(1, 4 * dt);

    // Хвост виляет
    parts.tailPivot.rotation.x = Math.sin(now * 2.2 + c.phase) * 0.35;

    // Погладили — пружинистый скейл
    const s = c.petT > 0 ? 1 + Math.sin(c.petT * 12) * 0.06 * c.petT : 1;
    c.mesh.scale.set(s, s, s);

    // Случайное мычание рядом с игроком
    if (c.mooTimer <= 0) {
      c.mooTimer = 12 + Math.random() * 18;
      if (distP < 28) moo(Math.max(0.08, 0.35 - distP * 0.01), 150 + Math.random() * 30);
    }
  }
  // Разделяем коров, чтобы не слипались
  for (let i = 0; i < cows.length; i++) {
    for (let j = i + 1; j < cows.length; j++) {
      const a = cows[i].mesh.position, b = cows[j].mesh.position;
      const dx = b.x - a.x, dz = b.z - a.z;
      const d = Math.hypot(dx, dz);
      if (d < 1 && d > 0.001) {
        const push = (1 - d) * 0.5 * dt * 3;
        const ux = dx / d, uz = dz / d;
        a.x -= ux * push; a.z -= uz * push;
        b.x += ux * push; b.z += uz * push;
      }
    }
  }
}

// ============ Звук: синтезированное «му-у» (WebAudio, без файлов) ============
let audioCtx = null, lastPetToast = 0;
function ensureAudio() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  } catch { /* без звука */ }
}
function moo(vol = 0.4, f0 = 165) {
  if (!audioCtx) return;
  try {
    const t0 = audioCtx.currentTime;
    const dur = 0.7;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, vol), t0 + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    const filt = audioCtx.createBiquadFilter();
    filt.type = 'lowpass'; filt.frequency.value = 600; filt.Q.value = 2;
    const o1 = audioCtx.createOscillator();
    o1.type = 'sawtooth';
    o1.frequency.setValueAtTime(f0, t0);
    o1.frequency.linearRampToValueAtTime(f0 * 0.58, t0 + dur);
    const o2 = audioCtx.createOscillator();
    o2.type = 'triangle';
    o2.frequency.setValueAtTime(f0 * 0.5, t0);
    o2.frequency.linearRampToValueAtTime(f0 * 0.36, t0 + dur);
    const lfo = audioCtx.createOscillator();
    lfo.frequency.value = 7;
    const lfoG = audioCtx.createGain();
    lfoG.gain.value = f0 * 0.05;
    lfo.connect(lfoG); lfoG.connect(o1.frequency);
    o1.connect(filt); o2.connect(filt);
    filt.connect(gain); gain.connect(audioCtx.destination);
    for (const o of [o1, o2, lfo]) { o.start(t0); o.stop(t0 + dur + 0.05); }
  } catch { /* без звука */ }
}

function spawnHearts(pos) {
  for (let i = 0; i < 4; i++) {
    const m = new THREE.SpriteMaterial({ map: heartTex, transparent: true, depthWrite: false });
    const s = new THREE.Sprite(m);
    s.position.set(pos.x + (Math.random() - 0.5) * 0.8, pos.y + 1.6 + Math.random() * 0.4, pos.z + (Math.random() - 0.5) * 0.8);
    s.scale.set(0.35, 0.35, 1);
    scene.add(s);
    hearts.push({ s, life: 1 });
  }
}
function updateHearts(dt) {
  for (let i = hearts.length - 1; i >= 0; i--) {
    const h = hearts[i];
    h.life -= dt;
    h.s.position.y += dt * 1.2;
    h.s.material.opacity = Math.max(0, h.life);
    if (h.life <= 0) {
      scene.remove(h.s);
      h.s.material.dispose();
      hearts.splice(i, 1);
    }
  }
}

function petCow(c) {
  ensureAudio();
  moo(0.5);
  c.vy = 5; // подпрыгивание от радости
  c.petT = 0.6;
  if (c.state === 'graze' || c.state === 'idle') { c.state = 'idle'; c.timer = 2; }
  spawnHearts(c.mesh.position);
  const now = performance.now();
  if (now - lastPetToast > 2500) {
    lastPetToast = now;
    toast('🐄 Му-у!');
  }
}

// Меши мира (InstancedMesh по типам)
const worldGroup = new THREE.Group();
scene.add(worldGroup);
const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const dummy = new THREE.Object3D();
let meshDirty = true;

function rebuildWorld() {
  // удалить старые
  while (worldGroup.children.length) {
    const m = worldGroup.children.pop();
    worldGroup.remove(m);
    m.dispose?.();
  }
  const perType = new Map();
  for (let x = 0; x < WX; x++)
    for (let y = 0; y < WY; y++)
      for (let z = 0; z < WZ; z++) {
        const t = data[idx(x, y, z)];
        if (t === AIR) continue;
        // скрыть полностью окружённые непрозрачными
        if (isOpaque(getBlock(x + 1, y, z)) && isOpaque(getBlock(x - 1, y, z)) &&
            isOpaque(getBlock(x, y + 1, z)) && isOpaque(getBlock(x, y - 1, z)) &&
            isOpaque(getBlock(x, y, z + 1)) && isOpaque(getBlock(x, y, z - 1))) continue;
        if (!perType.has(t)) perType.set(t, []);
        perType.get(t).push([x + 0.5, y + 0.5, z + 0.5]);
      }
  for (const [type, list] of perType) {
    const im = new THREE.InstancedMesh(boxGeo, MATERIALS[type], list.length);
    list.forEach((p, i) => { dummy.position.set(p[0], p[1], p[2]); dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix); });
    im.instanceMatrix.needsUpdate = true;
    worldGroup.add(im);
  }
  meshDirty = false;
}

// ============ Игрок / физика ============
const player = {
  pos: new THREE.Vector3(WX / 2 + 0.5, 20, WZ / 2 + 0.5), // ноги
  vel: new THREE.Vector3(),
  yaw: Math.PI * 0.25, pitch: -0.1,
  onGround: false, fly: false,
  halfW: 0.3, height: 1.8, eye: 1.62,
};
function spawnPlayer() {
  const cx = (WX / 2) | 0, cz = (WZ / 2) | 0;
  player.pos.set(cx + 0.5, heightAt(cx, cz) + 2, cz + 0.5);
  player.vel.set(0, 0, 0);
}

function collides(px, py, pz) {
  const x0 = Math.floor(px - player.halfW), x1 = Math.floor(px + player.halfW);
  const y0 = Math.floor(py), y1 = Math.floor(py + player.height - 0.01);
  const z0 = Math.floor(pz - player.halfW), z1 = Math.floor(pz + player.halfW);
  for (let x = x0; x <= x1; x++)
    for (let y = y0; y <= y1; y++)
      for (let z = z0; z <= z1; z++)
        if (isSolid(getBlock(x, y, z))) return true;
  return false;
}

const keys = {};
addEventListener('keydown', e => {
  if (e.code === 'Digit1') selectSlot(0);
  if (e.code === 'Digit2') selectSlot(1);
  if (e.code === 'Digit3') selectSlot(2);
  if (e.code === 'Digit4') selectSlot(3);
  if (e.code === 'Digit5') selectSlot(4);
  if (e.code === 'Digit6') selectSlot(5);
  if (e.code === 'Digit7') selectSlot(6);
  if (e.code === 'Digit8') selectSlot(7);
  if (e.code === 'Digit9') selectSlot(8);
  if (e.code === 'KeyF') { player.fly = !player.fly; player.vel.y = 0; toast(player.fly ? '🕊️ Полёт включён' : '🚶 Режим ходьбы'); updateBadge(); }
  if (e.code === 'KeyN') { timeState.paused = !timeState.paused; updateTimeBadge(); toast(timeState.paused ? '⏸️ Время остановлено' : '▶ Время идёт'); }
  if (e.code === 'KeyT') { timeState.t = (timeState.t + 1 / 24) % 1; updateTimeBadge(); }
  keys[e.code] = true;
  if (e.code === 'Space') e.preventDefault();
});
addEventListener('keyup', e => { keys[e.code] = false; });

function stepPlayer(dt) {
  dt = Math.min(dt, 0.05);
  const sprint = keys['ShiftLeft'] || keys['ShiftRight'];
  const speed = player.fly ? 11 : (sprint ? 6.8 : 4.6);

  const sin = Math.sin(player.yaw), cos = Math.cos(player.yaw);
  let f = 0, s = 0;
  if (keys['KeyW']) f += 1;
  if (keys['KeyS']) f -= 1;
  if (keys['KeyA']) s -= 1;
  if (keys['KeyD']) s += 1;
  const len = Math.hypot(f, s) || 1;
  f /= len; s /= len;
  // направление: yaw=0 смотрит на -Z
  const wishX = (-sin * f + cos * s) * speed;
  const wishZ = (-cos * f - sin * s) * speed;

  if (player.fly) {
    player.vel.x = wishX; player.vel.z = wishZ;
    player.vel.y = 0;
    if (keys['Space']) player.vel.y += 9;
    if (keys['ShiftLeft'] || keys['ShiftRight']) player.vel.y -= 9;
    moveAxis(dt, 'fly');
  } else {
    // плавное ускорение по земле/воздуху
    const accel = player.onGround ? 14 : 5;
    player.vel.x += (wishX - player.vel.x) * Math.min(1, accel * dt);
    player.vel.z += (wishZ - player.vel.z) * Math.min(1, accel * dt);
    player.vel.y -= 27 * dt;
    if (player.vel.y < -45) player.vel.y = -45;
    if (keys['Space'] && player.onGround) { player.vel.y = 9; player.onGround = false; }
    moveAxis(dt, 'walk');
  }
  // выпал из мира — респаун
  if (player.pos.y < -20) { spawnPlayer(); toast('💫 Вы возродились'); }
}

function moveAxis(dt, mode) {
  const p = player.pos, v = player.vel;
  // X
  let nx = p.x + v.x * dt;
  if (collides(nx, p.y, p.z)) v.x = 0; else p.x = nx;
  // Z
  let nz = p.z + v.z * dt;
  if (collides(p.x, p.y, nz)) v.z = 0; else p.z = nz;
  // Y
  let ny = p.y + v.y * dt;
  player.onGround = false;
  if (collides(p.x, ny, p.z)) {
    if (v.y < 0) { player.onGround = true; }
    v.y = 0;
  } else p.y = ny;
  // границы мира по XZ
  p.x = Math.max(1, Math.min(WX - 1, p.x));
  p.z = Math.max(1, Math.min(WZ - 1, p.z));
}

// ============ Рейкаст по вокселям (DDA) ============
function raycastVoxel(origin, dir, maxDist = 7) {
  let x = Math.floor(origin.x), y = Math.floor(origin.y), z = Math.floor(origin.z);
  const stepX = Math.sign(dir.x), stepY = Math.sign(dir.y), stepZ = Math.sign(dir.z);
  const tDeltaX = stepX !== 0 ? Math.abs(1 / dir.x) : Infinity;
  const tDeltaY = stepY !== 0 ? Math.abs(1 / dir.y) : Infinity;
  const tDeltaZ = stepZ !== 0 ? Math.abs(1 / dir.z) : Infinity;
  const bx = x, by = y, bz = z;
  let tMaxX = stepX !== 0 ? (stepX > 0 ? (bx + 1 - origin.x) * tDeltaX : (origin.x - bx) * tDeltaX) : Infinity;
  let tMaxY = stepY !== 0 ? (stepY > 0 ? (by + 1 - origin.y) * tDeltaY : (origin.y - by) * tDeltaY) : Infinity;
  let tMaxZ = stepZ !== 0 ? (stepZ > 0 ? (bz + 1 - origin.z) * tDeltaZ : (origin.z - bz) * tDeltaZ) : Infinity;
  let nx = 0, ny = 0, nz = 0, t = 0;
  for (let i = 0; i < 128; i++) {
    if (tMaxX < tMaxY && tMaxX < tMaxZ) { x += stepX; t = tMaxX; tMaxX += tDeltaX; nx = -stepX; ny = 0; nz = 0; }
    else if (tMaxY < tMaxZ) { y += stepY; t = tMaxY; tMaxY += tDeltaY; nx = 0; ny = -stepY; nz = 0; }
    else { z += stepZ; t = tMaxZ; tMaxZ += tDeltaZ; nx = 0; ny = 0; nz = -stepZ; }
    if (t > maxDist) return null;
    const b = getBlock(x, y, z);
    if (b !== AIR) return { x, y, z, nx, ny, nz, type: b };
  }
  return null;
}
function cameraDir() {
  const d = new THREE.Vector3(0, 0, -1);
  d.applyEuler(new THREE.Euler(player.pitch, player.yaw, 0, 'YXZ'));
  return d;
}
function eyePos() {
  return new THREE.Vector3(player.pos.x, player.pos.y + player.eye, player.pos.z);
}

// ============ Ввод: мышь, тач, хотбар ============
const menu = document.getElementById('menu');
let locked = false;
canvas.addEventListener('click', () => { if (menu.classList.contains('hidden')) canvas.requestPointerLock?.(); });
document.addEventListener('pointerlockchange', () => {
  locked = document.pointerLockElement === canvas;
});
document.addEventListener('mousemove', e => {
  if (!locked) return;
  player.yaw -= e.movementX * 0.0024;
  player.pitch -= e.movementY * 0.0024;
  player.pitch = Math.max(-1.55, Math.min(1.55, player.pitch));
});
document.addEventListener('contextmenu', e => e.preventDefault());

let currentTarget = null, aimedCow = null, aimedCowDist = Infinity;
const raycaster = new THREE.Raycaster();
canvas.addEventListener('mousedown', e => {
  if (!menu.classList.contains('hidden')) return;
  if (!locked) { canvas.requestPointerLock?.(); return; }
  ensureAudio();
  if (e.button === 0) { if (aimedCow) petCow(aimedCow); else breakBlock(); }
  if (e.button === 2) placeBlock();
});
addEventListener('wheel', e => {
  selectSlot((selected + (e.deltaY > 0 ? 1 : HOTBAR.length - 1)) % HOTBAR.length);
}, { passive: true });

function playerIntersectsBlock(bx, by, bz) {
  const p = player.pos, hw = player.halfW, h = player.height;
  return bx + 1 > p.x - hw && bx < p.x + hw &&
         by + 1 > p.y && by < p.y + h &&
         bz + 1 > p.z - hw && bz < p.z + hw;
}
function breakBlock() {
  if (!currentTarget) return;
  const { x, y, z } = currentTarget;
  if (y === 0) { toast('🪨 Коренную породу сломать нельзя'); return; }
  setBlock(x, y, z, AIR);
  rebuildWorld();
}
function placeBlock() {
  if (!currentTarget) return;
  const { x, y, z, nx, ny, nz } = currentTarget;
  const px = x + nx, py = y + ny, pz = z + nz;
  if (py < 0 || py >= WY) return;
  if (getBlock(px, py, pz) !== AIR) return;
  if (playerIntersectsBlock(px, py, pz)) return; // нельзя ставить в себя
  setBlock(px, py, pz, HOTBAR[selected]);
  rebuildWorld();
}

// Хотбар
let selected = 0;
const hotbarEl = document.getElementById('hotbar');
function buildHotbar() {
  hotbarEl.innerHTML = '';
  HOTBAR.forEach((type, i) => {
    const d = document.createElement('div');
    d.className = 'slot' + (i === selected ? ' selected' : '');
    const prev = document.createElement('canvas');
    prev.width = 16; prev.height = 16;
    const face = type === GRASS ? T.grassTop.canvas : type === LOG ? T.logTop.canvas :
      { [DIRT]: T.dirt, [STONE]: T.stone, [LEAVES]: T.leaves, [SAND]: T.sand, [PLANKS]: T.planks, [BRICK]: T.brick, [GLASS]: T.glass }[type]?.canvas || T.stone.canvas;
    prev.getContext('2d').drawImage(face, 0, 0);
    const key = document.createElement('span'); key.className = 'key'; key.textContent = i + 1;
    const nm = document.createElement('span'); nm.className = 'name'; nm.textContent = BLOCKS[type].name;
    d.append(prev, key, nm);
    d.onclick = () => selectSlot(i);
    hotbarEl.appendChild(d);
  });
}
function selectSlot(i) {
  selected = i;
  [...hotbarEl.children].forEach((el, j) => el.classList.toggle('selected', j === i));
}
window.selectSlot = selectSlot;

// Тач-управление (джойстик + кнопки)
const isTouch = 'ontouchstart' in window;
if (isTouch) {
  const style = document.createElement('style');
  style.textContent = `#touch-ui{position:fixed;inset:auto 0 76px 0;display:flex;justify-content:space-between;padding:0 14px;z-index:15;pointer-events:none}
  #joy{width:110px;height:110px;border-radius:50%;background:rgba(255,255,255,.15);border:2px solid rgba(255,255,255,.4);pointer-events:auto;position:relative}
  #stick{position:absolute;left:50%;top:50%;width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,.6);transform:translate(-50%,-50%)}
  .tbtns{display:flex;gap:8px;pointer-events:auto}
  .tbtn{width:56px;height:56px;border-radius:50%;border:2px solid rgba(255,255,255,.4);background:rgba(0,0,0,.5);color:#fff;font-size:22px}`;
  document.head.appendChild(style);
  const ui = document.createElement('div');
  ui.id = 'touch-ui';
  ui.innerHTML = `<div id="joy"><div id="stick"></div></div>
    <div class="tbtns"><button class="tbtn" id="t-jump">⤒</button><button class="tbtn" id="t-break">⛏</button><button class="tbtn" id="t-place">🧱</button></div>`;
  document.body.appendChild(ui);
  const joy = ui.querySelector('#joy'), stick = ui.querySelector('#stick');
  let joyId = null, jx = 0, jy = 0;
  joy.addEventListener('touchstart', e => { joyId = e.changedTouches[0].identifier; }, { passive: true });
  addEventListener('touchmove', e => {
    for (const t of e.changedTouches) {
      if (t.identifier === joyId) {
        const r = joy.getBoundingClientRect();
        jx = ((t.clientX - (r.left + r.width / 2)) / 45);
        jy = ((t.clientY - (r.top + r.height / 2)) / 45);
        jx = Math.max(-1, Math.min(1, jx)); jy = Math.max(-1, Math.min(1, jy));
        stick.style.transform = `translate(calc(-50% + ${jx * 28}px), calc(-50% + ${jy * 28}px))`;
        keys['KeyW'] = jy < -0.3; keys['KeyS'] = jy > 0.3;
        keys['KeyA'] = jx < -0.3; keys['KeyD'] = jx > 0.3;
      }
    }
  }, { passive: true });
  addEventListener('touchend', e => {
    for (const t of e.changedTouches) if (t.identifier === joyId) {
      joyId = null; jx = jy = 0;
      stick.style.transform = 'translate(-50%,-50%)';
      keys['KeyW'] = keys['KeyS'] = keys['KeyA'] = keys['KeyD'] = false;
    }
  });
  let lookId = null, lx = 0, ly = 0;
  addEventListener('touchstart', e => {
    for (const t of e.changedTouches) {
      if (t.clientX > innerWidth / 2 && lookId === null && !t.target.classList?.contains('tbtn')) { lookId = t.identifier; lx = t.clientX; ly = t.clientY; }
    }
  }, { passive: true });
  addEventListener('touchmove', e => {
    for (const t of e.changedTouches) if (t.identifier === lookId) {
      player.yaw -= (t.clientX - lx) * 0.006;
      player.pitch -= (t.clientY - ly) * 0.006;
      player.pitch = Math.max(-1.55, Math.min(1.55, player.pitch));
      lx = t.clientX; ly = t.clientY;
    }
  }, { passive: true });
  addEventListener('touchend', e => { for (const t of e.changedTouches) if (t.identifier === lookId) lookId = null; });
  ui.querySelector('#t-jump').onclick = () => {
    if (player.fly) player.vel.y = 5; else if (player.onGround) player.vel.y = 9;
    keys['Space'] = true; setTimeout(() => keys['Space'] = false, 150);
  };
  ui.querySelector('#t-break').onclick = () => { if (aimedCow) petCow(aimedCow); else breakBlock(); };
  ui.querySelector('#t-place').onclick = () => placeBlock();
}

// ============ UI: меню, тосты, сейвы ============
const toastEl = document.getElementById('toast');
let toastTimer = null;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}
function updateBadge() {
  document.getElementById('mode-badge').textContent = player.fly ? '🕊️ Полёт' : '🚶 Ходьба';
}
let savedCows = null;
function saveGame() {
  try {
    let bin = '';
    const chunk = 8192;
    for (let i = 0; i < data.length; i += chunk)
      bin += String.fromCharCode(...data.subarray(i, i + chunk));
    const cowData = cows.map(c => ({
      x: +c.mesh.position.x.toFixed(2),
      y: +c.mesh.position.y.toFixed(2),
      z: +c.mesh.position.z.toFixed(2),
      yaw: +c.yaw.toFixed(2),
    }));
    localStorage.setItem(SAVE_KEY, JSON.stringify({ seed, data: btoa(bin), cows: cowData, time: +timeState.t.toFixed(4) }));
    toast('💾 Мир сохранён');
  } catch { toast('⚠️ Не удалось сохранить'); }
}
function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const { seed: s, data: b64, cows: sc, time: st } = JSON.parse(raw);
    const bin = atob(b64);
    if (bin.length !== WX * WY * WZ) return false;
    seed = s;
    data = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) data[i] = bin.charCodeAt(i);
    savedCows = Array.isArray(sc) ? sc : null;
    if (typeof st === 'number' && st >= 0 && st < 1) timeState.t = st;
    return true;
  } catch { return false; }
}
function restoreCows() {
  if (!savedCows || !savedCows.length) return;
  clearCows();
  for (const sc of savedCows.slice(0, COW_COUNT)) {
    const y = Math.min(WY - 1, Math.max(1, sc.y));
    addCow(sc.x, y, sc.z, sc.yaw || 0);
  }
  savedCows = null;
  const el = document.getElementById('cows');
  if (el) el.textContent = `🐄 ${cows.length}`;
}
document.getElementById('play-btn').onclick = () => {
  ensureAudio();
  menu.classList.add('hidden');
  if (!isTouch) canvas.requestPointerLock?.();
};
document.getElementById('save-btn').onclick = saveGame;
document.getElementById('new-world-btn').onclick = () => {
  seed = (Math.random() * 1e9) | 0;
  localStorage.removeItem(SAVE_KEY);
  document.getElementById('loading').classList.add('show');
  setTimeout(() => {
    generateWorld(); rebuildWorld(); spawnPlayer(); spawnCows();
    document.getElementById('loading').classList.remove('show');
    menu.classList.add('hidden');
    if (!isTouch) canvas.requestPointerLock?.();
    toast('🌍 Новый мир создан');
  }, 50);
};
document.getElementById('mode-badge').onclick = () => {
  player.fly = !player.fly; updateBadge();
};
document.getElementById('time-badge').onclick = () => {
  timeState.paused = !timeState.paused;
  updateTimeBadge();
  toast(timeState.paused ? '⏸️ Время остановлено' : '▶ Время идёт');
};

// ============ Главный цикл ============
const fpsEl = document.getElementById('fps');
const posEl = document.getElementById('pos');
const infoEl = document.getElementById('block-highlight-info');
let last = performance.now(), frames = 0, fpsT = 0;

function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;

  if (menu.classList.contains('hidden')) stepPlayer(dt);
  updateCows(dt);
  updateHearts(dt);
  updateDayNight(dt);
  for (const c of clouds) { c.position.x += dt * 0.6; if (c.position.x > WX + 8) c.position.x = -8; }

  camera.position.set(player.pos.x, player.pos.y + player.eye, player.pos.z);
  camera.rotation.set(0, 0, 0);
  camera.rotation.order = 'YXZ';
  camera.rotation.y = player.yaw;
  camera.rotation.x = player.pitch;

  const eye = eyePos(), dir = cameraDir();
  currentTarget = raycastVoxel(eye, dir, 7);

  // Прицел на корову (приоритет — кто ближе)
  aimedCow = null; aimedCowDist = Infinity;
  raycaster.set(eye, dir);
  raycaster.far = 7;
  const cowHits = raycaster.intersectObjects(cowGroup.children, true);
  if (cowHits.length) {
    let o = cowHits[0].object, root = null;
    while (o) { if (o.userData.cowRef) { root = o.userData.cowRef; break; } o = o.parent; }
    if (root) { aimedCow = root; aimedCowDist = cowHits[0].distance; }
  }

  let blockDist = Infinity;
  if (currentTarget) {
    blockDist = eye.distanceTo(new THREE.Vector3(
      currentTarget.x + 0.5, currentTarget.y + 0.5, currentTarget.z + 0.5));
  }
  if (aimedCow && aimedCowDist <= blockDist) {
    highlight.visible = false;
    infoEl.style.display = 'block';
    infoEl.textContent = '🐄 Корова — ЛКМ: погладить';
  } else if (currentTarget) {
    highlight.visible = true;
    highlight.position.set(currentTarget.x + 0.5, currentTarget.y + 0.5, currentTarget.z + 0.5);
    infoEl.style.display = 'block';
    infoEl.textContent = BLOCKS[currentTarget.type]?.name || '';
  } else {
    highlight.visible = false;
    infoEl.style.display = 'none';
  }

  if (meshDirty) rebuildWorld();
  renderer.render(scene, camera);

  frames++; fpsT += dt;
  if (fpsT >= 0.5) {
    fpsEl.textContent = `${Math.round(frames / fpsT)} FPS`;
    posEl.textContent = `X: ${player.pos.x.toFixed(1)} Y: ${player.pos.y.toFixed(1)} Z: ${player.pos.z.toFixed(1)}`;
    updateTimeBadge();
    frames = 0; fpsT = 0;
  }
  window.__sceneReady = true;
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// ============ Старт ============
buildHotbar();
updateBadge();
if (!loadGame()) generateWorld();
rebuildWorld();
spawnPlayer();
spawnCows();
restoreCows();
updateTimeBadge();
window.__game = { cows, player, petCow, moo, spawnCows, getBlock, groundTopY, timeState, updateTimeBadge, formatTime };
requestAnimationFrame(animate);
