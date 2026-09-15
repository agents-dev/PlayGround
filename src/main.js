import * as THREE from 'three';

// ---------- constants ----------
const FIELD_L = 60; // x axis (goal to goal)
const FIELD_W = 40; // z axis
const WALL_H = 8;
const GOAL_W = 14;
const GOAL_H = 6;
const BALL_R = 1.6;
const GRAVITY = -22;

const state = {
  started: false,
  scoreBlue: 0,
  scoreOrange: 0,
  timeLeft: 300,
  celebrating: 0,
  camMode: 0,
  readySignalled: false
};

// ---------- renderer / scene ----------
const canvas = document.getElementById('game');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x060a18);
scene.fog = new THREE.Fog(0x060a18, 90, 220);

const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 500);

const hemi = new THREE.HemisphereLight(0xbdd4ff, 0x1a2b12, 0.9);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 1.6);
sun.position.set(30, 50, 20);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -50; sun.shadow.camera.right = 50;
sun.shadow.camera.top = 50; sun.shadow.camera.bottom = -50;
scene.add(sun);
const ballLight = new THREE.PointLight(0xffffff, 12, 30);
scene.add(ballLight);

// ---------- arena ----------
function makeFieldTexture() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 680;
  const g = c.getContext('2d');
  g.fillStyle = '#2d9b4f'; g.fillRect(0, 0, c.width, c.height);
  // stripes
  for (let i = 0; i < 12; i++) {
    if (i % 2 === 0) { g.fillStyle = 'rgba(255,255,255,0.06)'; g.fillRect((i * c.width) / 12, 0, c.width / 12, c.height); }
  }
  g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = 6;
  g.strokeRect(30, 30, c.width - 60, c.height - 60);
  g.beginPath(); g.moveTo(c.width / 2, 30); g.lineTo(c.width / 2, c.height - 30); g.stroke();
  g.beginPath(); g.arc(c.width / 2, c.height / 2, 90, 0, Math.PI * 2); g.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(FIELD_L + 8, FIELD_W + 8),
  new THREE.MeshStandardMaterial({ map: makeFieldTexture(), roughness: 0.9, metalness: 0.0 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// outer dark plane
const outer = new THREE.Mesh(
  new THREE.PlaneGeometry(600, 600),
  new THREE.MeshStandardMaterial({ color: 0x0a1230, roughness: 1 })
);
outer.rotation.x = -Math.PI / 2;
outer.position.y = -0.05;
scene.add(outer);

const wallMat = new THREE.MeshStandardMaterial({ color: 0x8fa8d0, transparent: true, opacity: 0.28, roughness: 0.2, metalness: 0.1, side: THREE.DoubleSide });
const wallSolid = new THREE.MeshStandardMaterial({ color: 0x16224a, roughness: 0.7 });

function addWall(w, h, x, z, ry) {
  const grp = new THREE.Group();
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat);
  glass.position.y = h / 2;
  grp.add(glass);
  const base = new THREE.Mesh(new THREE.BoxGeometry(w, 1.1, 0.5), wallSolid);
  base.position.y = 0.55;
  grp.add(base);
  grp.position.set(x, 0, z);
  grp.rotation.y = ry;
  scene.add(grp);
}
// side walls (z = +/-)
addWall(FIELD_L + 8, WALL_H, 0, -FIELD_W / 2 - 4, 0);
addWall(FIELD_L + 8, WALL_H, 0, FIELD_W / 2 + 4, 0);
// end walls with goal gaps: build two segments each
function addEndWall(x, dir) {
  const segW = (FIELD_W + 8 - GOAL_W) / 2;
  const z1 = -(GOAL_W / 2 + segW / 2);
  const z2 = GOAL_W / 2 + segW / 2;
  for (const z of [z1, z2]) {
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(segW, WALL_H), wallMat);
    glass.rotation.y = Math.PI / 2;
    glass.position.set(x, WALL_H / 2, z);
    scene.add(glass);
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.1, segW), wallSolid);
    base.position.set(x, 0.55, z);
    scene.add(base);
  }
  // crossbar
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, GOAL_W), new THREE.MeshStandardMaterial({ color: 0xffffff }));
  bar.position.set(x, GOAL_H, 0);
  scene.add(bar);
  for (const z of [-GOAL_W / 2, GOAL_W / 2]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, GOAL_H, 12), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    post.position.set(x, GOAL_H / 2, z);
    scene.add(post);
  }
  // goal box (net)
  const netMat = new THREE.MeshBasicMaterial({ color: dir > 0 ? 0xff7a1a : 0x2f7bff, transparent: true, opacity: 0.12, side: THREE.DoubleSide, wireframe: true });
  const net = new THREE.Mesh(new THREE.BoxGeometry(4, GOAL_H, GOAL_W), netMat);
  net.position.set(x + dir * 2, GOAL_H / 2, 0);
  scene.add(net);
}
addEndWall(-FIELD_L / 2 - 4, -1);
addEndWall(FIELD_L / 2 + 4, 1);

// stadium ring lights (visual)
for (let i = 0; i < 4; i++) {
  const p = new THREE.Mesh(new THREE.BoxGeometry(10, 1, 2), new THREE.MeshBasicMaterial({ color: 0xcfe4ff }));
  const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
  p.position.set(Math.cos(a) * 55, 26, Math.sin(a) * 45);
  p.lookAt(0, 0, 0);
  scene.add(p);
}

// boost pads
const pads = [];
const padGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.12, 24);
for (const [x, z] of [[-12, -10], [12, 10], [-12, 10], [12, -10], [0, -14], [0, 14]]) {
  const m = new THREE.Mesh(padGeo, new THREE.MeshStandardMaterial({ color: 0xffd23e, emissive: 0xff9a00, emissiveIntensity: 1.2 }));
  m.position.set(x, 0.08, z);
  scene.add(m);
  pads.push({ mesh: m, x, z, active: true, t: 0 });
}

// ---------- cars ----------
function buildCar(color) {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.35 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.9, 1.9), bodyMat);
  body.position.y = 0.85;
  body.castShadow = true;
  g.add(body);
  const nose = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.55, 1.7), bodyMat);
  nose.position.set(2.1, 0.65, 0);
  nose.castShadow = true;
  g.add(nose);
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.7, 1.5), new THREE.MeshStandardMaterial({ color: 0x0b1020, roughness: 0.15, metalness: 0.6 }));
  cabin.position.set(-0.2, 1.55, 0);
  cabin.castShadow = true;
  g.add(cabin);
  // spoiler
  const wing = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.12, 2.1), new THREE.MeshStandardMaterial({ color: 0x111111 }));
  wing.position.set(-1.85, 1.5, 0);
  g.add(wing);
  // wheels
  const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.45, 18);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.9 });
  const hubMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7, roughness: 0.3 });
  const wheels = [];
  for (const [x, z] of [[1.25, 1.0], [1.25, -1.0], [-1.25, 1.0], [-1.25, -1.0]]) {
    const w = new THREE.Mesh(wheelGeo, wheelMat);
    w.rotation.x = Math.PI / 2;
    w.position.set(x, 0.5, z);
    w.castShadow = true;
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.47, 12), hubMat);
    hub.rotation.x = Math.PI / 2;
    hub.position.copy(w.position);
    g.add(w, hub);
    wheels.push({ w, hub });
  }
  // headlights
  const hl = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.25, 1.5), new THREE.MeshBasicMaterial({ color: 0xfff6c0 }));
  hl.position.set(2.68, 0.65, 0);
  g.add(hl);
  // boost flame
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.5, 2.2, 12), new THREE.MeshBasicMaterial({ color: 0x66aaff, transparent: true, opacity: 0.0 }));
  flame.rotation.z = Math.PI / 2;
  flame.position.set(-2.6, 0.85, 0);
  g.add(flame);
  scene.add(g);
  return { group: g, wheels, flame, bodyMat };
}

function makeCarState(x, z, yaw, isPlayer) {
  return {
    pos: new THREE.Vector3(x, 0, z),
    vel: new THREE.Vector3(),
    yaw, vy: 0, grounded: true,
    boost: 100, isPlayer,
    steerVis: 0
  };
}

const playerMesh = buildCar(0x2470ff);
const cpuMesh = buildCar(0xff7a1a);
const player = makeCarState(-14, 0, 0, true);
const cpu = makeCarState(14, 0, Math.PI, false);

// ---------- ball ----------
const ball = new THREE.Mesh(
  new THREE.SphereGeometry(BALL_R, 32, 24),
  new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
);
// pentagon-ish pattern via canvas texture
(function paintBall() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#f5f5f5'; g.fillRect(0, 0, 256, 256);
  g.fillStyle = '#111'; g.font = 'bold 120px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('⬢', 64, 80); g.fillText('⬢', 190, 150); g.fillText('⬢', 80, 210);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  ball.material.map = t;
})();
ball.castShadow = true;
scene.add(ball);
const ballState = { pos: new THREE.Vector3(0, 4, 0), vel: new THREE.Vector3(0, 0, 0) };

// ---------- audio (tiny synth, no assets) ----------
let actx = null;
function beep(freq, dur = 0.15, type = 'square', gain = 0.08) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(); const gn = actx.createGain();
    o.type = type; o.frequency.value = freq;
    gn.gain.value = gain;
    o.connect(gn); gn.connect(actx.destination);
    o.start(); gn.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
    o.stop(actx.currentTime + dur);
  } catch { /* ignore */ }
}

// ---------- input ----------
const keys = {};
window.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  keys[k] = true;
  if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault();
  if (k === 'r') resetKickoff(false);
  if (k === 'c') state.camMode = (state.camMode + 1) % 3;
  if (k === ' ' && state.started) doJump(player);
});
window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

// touch buttons
const touchState = { up: false, down: false, left: false, right: false, boost: false, jump: false };
document.querySelectorAll('#touch button').forEach((b) => {
  const k = b.dataset.k;
  const on = (e) => { e.preventDefault(); touchState[k] = true; if (k === 'jump') doJump(player); };
  const off = (e) => { e.preventDefault(); touchState[k] = false; };
  b.addEventListener('pointerdown', on);
  b.addEventListener('pointerup', off);
  b.addEventListener('pointerleave', off);
});

function inputForPlayer() {
  return {
    up: keys['w'] || keys['arrowup'] || touchState.up,
    down: keys['s'] || keys['arrowdown'] || touchState.down,
    left: keys['a'] || keys['arrowleft'] || touchState.left,
    right: keys['d'] || keys['arrowright'] || touchState.right,
    boost: keys['shift'] || touchState.boost,
    jump: keys[' '] || touchState.jump
  };
}

// ---------- game logic ----------
function doJump(car) {
  if (car.grounded) { car.vy = 8.5; car.grounded = false; beep(300, 0.12, 'square'); }
}

function driveCar(car, mesh, inp, dt, topSpeed = 24) {
  const fwd = new THREE.Vector3(Math.cos(car.yaw), 0, -Math.sin(car.yaw));
  const accel = inp.up ? 30 : 0;
  const brake = inp.down ? 26 : 0;
  let maxSpd = topSpeed;
  const boosting = inp.boost && car.boost > 1 && inp.up;
  if (boosting) { maxSpd = 38; car.boost = Math.max(0, car.boost - 32 * dt); mesh.flame.material.opacity = 0.9; }
  else { mesh.flame.material.opacity = 0; car.boost = Math.min(100, car.boost + 4 * dt); }

  const fwdSpeed = car.vel.dot(fwd);
  if (inp.up) car.vel.addScaledVector(fwd, accel * dt);
  if (inp.down) {
    if (fwdSpeed > 1) car.vel.addScaledVector(fwd, -brake * dt);
    else car.vel.addScaledVector(fwd, -14 * dt); // reverse
  }
  // clamp forward speed
  const f2 = car.vel.dot(fwd);
  if (f2 > maxSpd) car.vel.addScaledVector(fwd, maxSpd - f2);
  if (f2 < -10) car.vel.addScaledVector(fwd, -10 - f2);

  // steering (stronger at speed, no turn when parked)
  const spd = Math.min(1, Math.abs(fwdSpeed) / 10);
  const dir = fwdSpeed >= 0 ? 1 : -1;
  if (inp.left) car.yaw += 2.4 * spd * dir * dt;
  if (inp.right) car.yaw -= 2.4 * spd * dir * dt;
  car.steerVis = inp.left ? 1 : inp.right ? -1 : 0;

  // drag + rolling resistance
  car.vel.multiplyScalar(1 - Math.min(0.9, (inp.up ? 0.25 : 1.1) * dt));
  // lateral grip: kill sideways slide
  const right = new THREE.Vector3(-fwd.z, 0, fwd.x);
  const lat = car.vel.dot(right);
  car.vel.addScaledVector(right, -lat * Math.min(1, 8 * dt));

  car.pos.addScaledVector(car.vel, dt);
  // vertical
  if (!car.grounded) {
    car.vy += GRAVITY * dt;
    car.pos.y += car.vy * dt;
    if (car.pos.y <= 0) { car.pos.y = 0; car.vy = 0; car.grounded = true; }
  }
  // arena clamp (cars can't enter goals deeply)
  const hx = FIELD_L / 2 + 2.5, hz = FIELD_W / 2 + 2.5;
  car.pos.x = THREE.MathUtils.clamp(car.pos.x, -hx, hx);
  car.pos.z = THREE.MathUtils.clamp(car.pos.z, -hz, hz);
  // goal-box block: keep cars out of net except through mouth — simple clamp is fine

  mesh.group.position.copy(car.pos);
  mesh.group.rotation.y = car.yaw;
  // lean / pitch juice
  mesh.group.rotation.z = THREE.MathUtils.clamp(-fwdSpeed * 0.004 + (boosting ? -0.03 : 0), -0.12, 0.12);
  mesh.group.rotation.x = car.grounded ? 0 : THREE.MathUtils.clamp(-car.vy * 0.02, -0.3, 0.3);
  const spin = fwdSpeed * dt * 2;
  mesh.wheels.forEach((w) => { w.w.rotation.y += spin; w.hub.rotation.y += spin; });
}

function cpuInput(dt) {
  // simple chase-ball AI aiming at player's goal (+x is orange goal? player attacks +x)
  // CPU (orange) defends +x goal? Actually CPU car is orange, attacks -x (blue goal).
  const toBall = new THREE.Vector3().subVectors(ballState.pos, cpu.pos);
  const targetYaw = Math.atan2(-toBall.z, toBall.x);
  let dy = targetYaw - cpu.yaw;
  while (dy > Math.PI) dy -= Math.PI * 2;
  while (dy < -Math.PI) dy += Math.PI * 2;
  return {
    up: true,
    down: false,
    left: dy > 0.12,
    right: dy < -0.12,
    boost: Math.abs(dy) < 0.3 && toBall.length() > 12 && cpu.boost > 20,
    jump: false
  };
}

function collideCarBall(car, power = 1) {
  const carC = new THREE.Vector3(car.pos.x, car.pos.y + 0.9, car.pos.z);
  const ballC = ballState.pos;
  const diff = new THREE.Vector3().subVectors(ballC, carC);
  const dist = diff.length();
  const minD = BALL_R + 1.5;
  if (dist < minD && dist > 1e-4) {
    const n = diff.clone().normalize();
    // push ball out
    ballState.pos.copy(carC).addScaledVector(n, minD);
    const carSpeed = car.vel.length();
    const hit = 6 + carSpeed * 1.05 * power;
    ballState.vel.addScaledVector(n, hit);
    // inherit car velocity
    ballState.vel.addScaledVector(car.vel, 0.75);
    // pop up a bit on fast hits
    if (carSpeed > 12) ballState.vel.y += 3;
    ballState.vel.y = Math.max(ballState.vel.y, 1.5);
    beep(140 + Math.min(300, carSpeed * 10), 0.1, 'triangle', 0.1);
  }
}

function stepBall(dt) {
  ballState.vel.y += GRAVITY * dt;
  ballState.vel.multiplyScalar(1 - 0.25 * dt);
  ballState.pos.addScaledVector(ballState.vel, dt);

  const hx = FIELD_L / 2 + 4, hz = FIELD_W / 2 + 4;
  // ground bounce
  if (ballState.pos.y < BALL_R) {
    ballState.pos.y = BALL_R;
    if (ballState.vel.y < 0) {
      ballState.vel.y *= -0.72;
      if (Math.abs(ballState.vel.y) < 1.2) ballState.vel.y = 0;
      // ground friction
      ballState.vel.x *= 0.985; ballState.vel.z *= 0.985;
    }
  }
  // ceiling (rare)
  if (ballState.pos.y > 24) { ballState.pos.y = 24; ballState.vel.y *= -0.6; }
  // side walls
  if (Math.abs(ballState.pos.z) > hz - BALL_R) {
    ballState.pos.z = Math.sign(ballState.pos.z) * (hz - BALL_R);
    ballState.vel.z *= -0.75;
    beep(200, 0.08, 'sine', 0.06);
  }
  // end walls / goals: goal mouth |z| < GOAL_W/2 lets ball pass into net
  const inMouth = Math.abs(ballState.pos.z) < GOAL_W / 2 - 0.3 && ballState.pos.y < GOAL_H;
  if (Math.abs(ballState.pos.x) > hx - BALL_R) {
    if (inMouth && Math.abs(ballState.pos.x) < hx + 2.5) {
      // flying into net — let it travel until back net, goal triggers at hx+0.5
      if (Math.abs(ballState.pos.x) > hx + 1.5) {
        ballState.pos.x = Math.sign(ballState.pos.x) * (hx + 1.5);
        ballState.vel.x *= -0.3;
      }
    } else {
      ballState.pos.x = Math.sign(ballState.pos.x) * (hx - BALL_R);
      ballState.vel.x *= -0.75;
      beep(200, 0.08, 'sine', 0.06);
    }
  }
  // goal detection
  if (state.started && state.celebrating <= 0) {
    if (ballState.pos.x > hx + 0.4) onGoal('blue');
    else if (ballState.pos.x < -hx - 0.4) onGoal('orange');
  }
  // ball spin visual
  ball.rotation.x += ballState.vel.z * dt * 0.3;
  ball.rotation.z -= ballState.vel.x * dt * 0.3;
  ball.position.copy(ballState.pos);
  ballLight.position.copy(ballState.pos).add(new THREE.Vector3(0, 3, 0));
}

function onGoal(team) {
  if (team === 'blue') state.scoreBlue++;
  else state.scoreOrange++;
  document.getElementById('score-blue').textContent = state.scoreBlue;
  document.getElementById('score-orange').textContent = state.scoreOrange;
  state.celebrating = 2.6;
  const msg = document.getElementById('message');
  msg.textContent = team === 'blue' ? 'GOAL! ⚽' : 'CPU SCORES!';
  msg.className = team === 'blue' ? 'goal-blue' : 'goal-orange';
  beep(team === 'blue' ? 523 : 220, 0.5, 'sawtooth', 0.12);
  setTimeout(() => beep(team === 'blue' ? 784 : 330, 0.5, 'sawtooth', 0.1), 150);
  setTimeout(() => { if (state.celebrating <= 0.2) resetKickoff(true); }, 2600);
}

function resetKickoff(silent) {
  player.pos.set(-14, 0, 0); player.vel.set(0, 0, 0); player.yaw = 0; player.vy = 0; player.grounded = true;
  cpu.pos.set(14, 0, 0); cpu.vel.set(0, 0, 0); cpu.yaw = Math.PI; cpu.vy = 0; cpu.grounded = true;
  ballState.pos.set(0, 4, 0); ballState.vel.set(0, 0, 0);
  if (!silent) {
    const k = document.getElementById('kickoff');
    k.textContent = 'KICKOFF!';
    k.style.opacity = 1;
    setTimeout(() => (k.style.opacity = 0.25), 1200);
  }
}

// ---------- camera ----------
const camPos = new THREE.Vector3(-22, 10, 0);
function updateCamera(dt) {
  const fwd = new THREE.Vector3(Math.cos(player.yaw), 0, -Math.sin(player.yaw));
  let desired, look;
  if (state.camMode === 2) {
    // top-down broadcast
    desired = new THREE.Vector3(0, 55, 0.01);
    look = new THREE.Vector3(0, 0, 0);
    camPos.lerp(desired, Math.min(1, 3 * dt));
    camera.position.copy(camPos);
    camera.lookAt(look);
    return;
  }
  if (state.camMode === 1) {
    // ball cam: behind player relative to ball
    const toBall = new THREE.Vector3().subVectors(ballState.pos, player.pos).setY(0).normalize();
    desired = player.pos.clone().addScaledVector(toBall, -9).add(new THREE.Vector3(0, 5.2, 0));
    look = ballState.pos.clone();
  } else {
    desired = player.pos.clone().addScaledVector(fwd, -10).add(new THREE.Vector3(0, 5.4, 0));
    look = player.pos.clone().addScaledVector(fwd, 8).add(new THREE.Vector3(0, 1.5, 0));
  }
  // keep camera inside arena bounds-ish
  desired.x = THREE.MathUtils.clamp(desired.x, -FIELD_L / 2 - 14, FIELD_L / 2 + 14);
  desired.z = THREE.MathUtils.clamp(desired.z, -FIELD_W / 2 - 14, FIELD_W / 2 + 14);
  desired.y = Math.max(2.5, desired.y);
  camPos.lerp(desired, Math.min(1, 5 * dt));
  camera.position.copy(camPos);
  camera.lookAt(look);
}

// ---------- HUD / loop ----------
const elTimer = document.getElementById('timer');
const elSpeed = document.getElementById('speed');
const elBoost = document.getElementById('boost-bar');
const elFps = document.getElementById('fps');
const elKickoff = document.getElementById('kickoff');
elKickoff.style.transition = 'opacity .5s';

document.getElementById('btn-start').addEventListener('click', () => {
  state.started = true;
  document.getElementById('panel').style.display = 'none';
  document.getElementById('touch').style.display = '';
  beep(440, 0.15, 'square'); setTimeout(() => beep(660, 0.2, 'square'), 150);
  resetKickoff(false);
  try { actx && actx.resume && actx.resume(); } catch { /* noop */ }
});
document.getElementById('btn-reset').addEventListener('click', () => resetKickoff(false));

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

resetKickoff(true);

let last = performance.now();
let fpsAcc = 0, fpsN = 0, fpsT = 0;
function fmtTime(s) {
  s = Math.max(0, Math.ceil(s));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function signalReady() {
  if (state.readySignalled) return;
  state.readySignalled = true;
  document.body.dataset.sceneReady = 'true';
  document.body.setAttribute('data-scene-ready', 'true');
  window.__SCENE_READY = true;
  window.__GAME = { player, ball: ballState, state };
}

function frame(now) {
  requestAnimationFrame(frame);
  let dt = Math.min(0.033, (now - last) / 1000);
  last = now;

  if (state.started && state.celebrating <= 0) {
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.started = false;
      const msg = document.getElementById('message');
      const win = state.scoreBlue === state.scoreOrange ? "DRAW!" : state.scoreBlue > state.scoreOrange ? "YOU WIN! 🏆" : "CPU WINS!";
      msg.textContent = win;
      msg.className = 'goal-blue';
      document.getElementById('panel').style.display = 'block';
      document.getElementById('btn-start').textContent = 'PLAY AGAIN';
      state.timeLeft = 300;
    }
  }
  if (state.celebrating > 0) {
    state.celebrating -= dt;
    if (state.celebrating <= 0) {
      document.getElementById('message').className = 'hidden';
      resetKickoff(true);
    }
  }

  const inp = state.started && state.celebrating <= 0 ? inputForPlayer() : { up: false, down: false, left: false, right: false, boost: false, jump: false };
  driveCar(player, playerMesh, inp, dt, 24);
  driveCar(cpu, cpuMesh, state.started && state.celebrating <= 0 ? cpuInput(dt) : { up: false }, dt, 20);
  collideCarBall(player, 1.0);
  collideCarBall(cpu, 0.9);
  stepBall(dt);

  // boost pads pickup (player only for simplicity + cpu)
  for (const p of pads) {
    p.mesh.rotation.y += dt * 2;
    if (!p.active) {
      p.t -= dt;
      p.mesh.material.emissiveIntensity = 0.15;
      if (p.t <= 0) { p.active = true; p.mesh.visible = true; p.mesh.material.emissiveIntensity = 1.2; }
      continue;
    }
    for (const [car] of [[player], [cpu]]) {
      const d = Math.hypot(car.pos.x - p.x, car.pos.z - p.z);
      if (d < 2.0) {
        car.boost = 100;
        p.active = false; p.t = 8; p.mesh.visible = false;
        beep(880, 0.12, 'sine', 0.08);
        break;
      }
    }
  }

  updateCamera(dt);
  renderer.render(scene, camera);
  signalReady();

  // HUD
  elTimer.textContent = fmtTime(state.timeLeft);
  elSpeed.textContent = `${Math.round(player.vel.length() * 4)} km/h`;
  elBoost.style.width = `${player.boost}%`;
  fpsAcc += 1 / Math.max(dt, 1e-4); fpsN++; fpsT += dt;
  if (fpsT > 0.5) { elFps.textContent = Math.round(fpsAcc / fpsN); fpsAcc = 0; fpsN = 0; fpsT = 0; }
}
requestAnimationFrame(frame);
