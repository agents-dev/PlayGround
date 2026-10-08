import * as THREE from 'three';

// ---------- constants ----------
const ARENA_HW = 60;        // half width  (x)
const ARENA_HL = 100;       // half length (z)
const WALL_H = 40;
const GOAL_HW = 11;         // goal half width
const GOAL_H = 9;
const BALL_R = 2.2;
const CAR_R = 2.6;
const GRAVITY = 60;
const MAX_SPEED = 42;
const BOOST_SPEED = 72;
const ACCEL = 28;
const BOOST_ACCEL = 55;
const BRAKE = 45;
const REVERSE_SPEED = 18;
const BOOST_DRAIN = 33;     // per second
const BOOST_MAX = 100;
const JUMP_V = 18;
const BALL_MAX = 110;
const MATCH_TIME = 300;
const COUNTDOWN = 3;
const GOAL_PAUSE = 3;
const UP = new THREE.Vector3(0, 1, 0);

const wrap = (a) => {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
};
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// ---------- input ----------
const keys = {};
let jumpQueued = false;
let restartQueued = false;
const GAME_KEYS = ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight'];
window.addEventListener('keydown', (e) => {
  if (GAME_KEYS.includes(e.code)) e.preventDefault();
  if (e.code === 'Space' && !e.repeat) jumpQueued = true;
  if (e.code === 'KeyR' && !e.repeat) restartQueued = true;
  keys[e.code] = true;
});
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

function readPlayerInput() {
  const up = keys.KeyW || keys.ArrowUp;
  const down = keys.KeyS || keys.ArrowDown;
  const left = keys.KeyA || keys.ArrowLeft;
  const right = keys.KeyD || keys.ArrowRight;
  const jump = jumpQueued;
  jumpQueued = false;
  return {
    throttle: (up ? 1 : 0) - (down ? 1 : 0),
    steer: (left ? 1 : 0) - (right ? 1 : 0),   // positive = turn left (yaw increases)
    boost: !!(keys.ShiftLeft || keys.ShiftRight),
    drift: !!(keys.ControlLeft || keys.ControlRight),
    jump,
  };
}

// ---------- renderer / scene ----------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a1426);
scene.fog = new THREE.Fog(0x0a1426, 220, 420);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);

scene.add(new THREE.HemisphereLight(0xbfd8ff, 0x203040, 0.9));
const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.position.set(40, 90, 30);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -120, right: 120, top: 120, bottom: -120, near: 1, far: 300 });
scene.add(sun);

// ---------- arena ----------
{
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(ARENA_HW * 2, ARENA_HL * 2),
    new THREE.MeshStandardMaterial({ color: 0x1b2a4a, roughness: 0.9 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const pts = [];
  for (let x = -ARENA_HW; x <= ARENA_HW; x += 10) pts.push(x, 0.05, -ARENA_HL, x, 0.05, ARENA_HL);
  for (let z = -ARENA_HL; z <= ARENA_HL; z += 10) pts.push(-ARENA_HW, 0.05, z, ARENA_HW, 0.05, z);
  const gridGeo = new THREE.BufferGeometry();
  gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  scene.add(new THREE.LineSegments(gridGeo, new THREE.LineBasicMaterial({ color: 0x2f5a8a })));

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x2a5fd0, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false,
  });
  const addWall = (w, h, d, x, y, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
    m.position.set(x, y, z);
    scene.add(m);
  };
  addWall(1, WALL_H, ARENA_HL * 2, -ARENA_HW, WALL_H / 2, 0);
  addWall(1, WALL_H, ARENA_HL * 2, ARENA_HW, WALL_H / 2, 0);
  addWall(ARENA_HW * 2, WALL_H, 1, 0, WALL_H / 2, -ARENA_HL);
  addWall(ARENA_HW * 2, WALL_H, 1, 0, WALL_H / 2, ARENA_HL);

  // goals: +z goal (blue scores here), -z goal (orange scores here)
  const goal = (z, color) => {
    const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.6 });
    const dir = Math.sign(z);
    for (const sx of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(1, GOAL_H, 1), mat);
      post.position.set(sx * GOAL_HW, GOAL_H / 2, z);
      scene.add(post);
    }
    const bar = new THREE.Mesh(new THREE.BoxGeometry(GOAL_HW * 2 + 1, 1, 1), mat);
    bar.position.set(0, GOAL_H, z);
    scene.add(bar);
    const netGeo = new THREE.BoxGeometry(GOAL_HW * 2, GOAL_H, 12);
    const net = new THREE.LineSegments(
      new THREE.WireframeGeometry(netGeo),
      new THREE.LineBasicMaterial({ color })
    );
    net.position.set(0, GOAL_H / 2, z + dir * 6);
    scene.add(net);
  };
  goal(ARENA_HL, 0x2d8cff);
  goal(-ARENA_HL, 0xff8a1e);
}

// ---------- boost pads ----------
const pads = [];
{
  const bigSpots = [[-40, -75], [40, -75], [-40, 75], [40, 75], [0, 0]];
  const smallSpots = [[0, -40], [0, 40], [-20, 0], [20, 0], [-30, -30], [30, 30], [30, -30], [-30, 30]];
  const addPad = (x, z, big) => {
    const r = big ? 3.2 : 1.8;
    const mesh = new THREE.Mesh(
      new THREE.CircleGeometry(r, 28).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: big ? 0xffb020 : 0xffe066, transparent: true, opacity: 0.85 })
    );
    mesh.position.set(x, 0.06, z);
    scene.add(mesh);
    pads.push({ pos: new THREE.Vector3(x, 0, z), big, r, active: true, timer: 0, mesh });
  };
  bigSpots.forEach(([x, z]) => addPad(x, z, true));
  smallSpots.forEach(([x, z]) => addPad(x, z, false));
}

// ---------- ball ----------
const ballTex = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#f4f4f4';
  g.fillRect(0, 0, 256, 256);
  g.fillStyle = '#222';
  for (let i = 0; i < 14; i++) {
    g.beginPath();
    g.arc(Math.random() * 256, Math.random() * 256, 12 + Math.random() * 18, 0, Math.PI * 2);
    g.fill();
  }
  return new THREE.CanvasTexture(c);
})();
const ballMesh = new THREE.Mesh(
  new THREE.SphereGeometry(BALL_R, 32, 24),
  new THREE.MeshStandardMaterial({ map: ballTex, roughness: 0.4 })
);
ballMesh.castShadow = true;
scene.add(ballMesh);
const ball = { pos: new THREE.Vector3(), vel: new THREE.Vector3() };

// ---------- cars ----------
function buildCarMesh(color) {
  const g = new THREE.Group();
  const paint = new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.2 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x111418, roughness: 0.8 });
  const add = (geo, mat, x, y, z) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    g.add(m);
    return m;
  };
  add(new THREE.BoxGeometry(2.4, 0.9, 4.8), paint, 0, 0.65, 0);
  add(new THREE.BoxGeometry(1.9, 0.7, 2.2), dark, 0, 1.45, -0.3);
  add(new THREE.BoxGeometry(2.0, 0.3, 0.8), dark, 0, 0.35, 2.6);
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const w = add(new THREE.CylinderGeometry(0.6, 0.6, 0.5, 16), dark, sx * 1.3, 0.6, sz * 1.7);
      w.rotation.z = Math.PI / 2;
    }
  }
  const flame = new THREE.Mesh(
    new THREE.ConeGeometry(0.8, 3, 12).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0x66ccff, transparent: true, opacity: 0.8 })
  );
  flame.position.set(0, 0.7, -3.2);
  flame.visible = false;
  g.add(flame);
  g.userData.flame = flame;
  return g;
}

function createCar(color, isBot) {
  const mesh = buildCarMesh(color);
  scene.add(mesh);
  return {
    pos: new THREE.Vector3(), vel: new THREE.Vector3(), yaw: 0,
    grounded: true, boost: 33, boosting: false, isBot, mesh,
  };
}

const player = createCar(0x1e7bff, false);
const bot = createCar(0xff8a1e, true);
const cars = [player, bot];

// ---------- physics: car ----------
function updateCar(car, inp, dt) {
  const right = new THREE.Vector3();
  const fwd = new THREE.Vector3();
  const setDirs = () => {
    fwd.set(Math.sin(car.yaw), 0, Math.cos(car.yaw));
    right.set(Math.cos(car.yaw), 0, -Math.sin(car.yaw));
  };
  setDirs();
  car.boosting = false;

  if (car.grounded) {
    car.vel.y = 0;
    let fSpeed = car.vel.dot(fwd);
    const dir = fSpeed < -0.5 ? -1 : 1;
    const turnFactor = Math.min(1, Math.abs(fSpeed) / 12);
    car.yaw += inp.steer * 2.6 * turnFactor * dir * dt;
    setDirs();
    fSpeed = car.vel.dot(fwd);

    const wantBoost = inp.boost && inp.throttle > 0 && car.boost > 0;
    if (wantBoost) {
      car.boost = Math.max(0, car.boost - BOOST_DRAIN * dt);
      car.boosting = true;
    }

    if (inp.throttle > 0) {
      const acc = wantBoost ? BOOST_ACCEL : ACCEL;
      const cap = wantBoost ? BOOST_SPEED : MAX_SPEED;
      if (fSpeed < cap) car.vel.addScaledVector(fwd, acc * dt);
    } else if (inp.throttle < 0) {
      if (fSpeed > 0.5) car.vel.addScaledVector(fwd, -BRAKE * dt);
      else if (fSpeed > -REVERSE_SPEED) car.vel.addScaledVector(fwd, -ACCEL * 0.6 * dt);
    } else {
      car.vel.multiplyScalar(Math.exp(-0.8 * dt)); // coasting
    }

    // lateral grip (less when drifting)
    const l = car.vel.dot(right);
    const grip = inp.drift ? 1.2 : 6;
    const newL = l * Math.exp(-grip * dt);
    car.vel.addScaledVector(right, newL - l);

    if (inp.jump) {
      car.vel.y = JUMP_V;
      car.grounded = false;
    }
  } else {
    car.vel.y -= GRAVITY * dt;
    car.yaw += inp.steer * 1.2 * dt; // weak air control
    setDirs();
    if (inp.boost && car.boost > 0) {
      car.boost = Math.max(0, car.boost - BOOST_DRAIN * dt);
      car.boosting = true;
      car.vel.addScaledVector(fwd, BOOST_ACCEL * 0.5 * dt);
    }
  }

  car.pos.addScaledVector(car.vel, dt);

  if (car.pos.y <= 0) {
    car.pos.y = 0;
    if (car.vel.y < 0) car.vel.y = 0;
    car.grounded = true;
  } else {
    car.grounded = false;
  }
  if (car.pos.y > 30) { car.pos.y = 30; car.vel.y = Math.min(0, car.vel.y); }

  // arena clamp
  const lx = ARENA_HW - CAR_R, lz = ARENA_HL - CAR_R;
  if (car.pos.x > lx) { car.pos.x = lx; car.vel.x = -Math.abs(car.vel.x) * 0.3; }
  if (car.pos.x < -lx) { car.pos.x = -lx; car.vel.x = Math.abs(car.vel.x) * 0.3; }
  if (car.pos.z > lz) { car.pos.z = lz; car.vel.z = -Math.abs(car.vel.z) * 0.3; }
  if (car.pos.z < -lz) { car.pos.z = -lz; car.vel.z = Math.abs(car.vel.z) * 0.3; }
}

function collideCars(a, b) {
  const ca = a.pos.clone().addScaledVector(UP, 1);
  const cb = b.pos.clone().addScaledVector(UP, 1);
  const d = cb.sub(ca);
  const dist = d.length();
  const minD = CAR_R * 2 * 0.9;
  if (dist < minD && dist > 1e-4) {
    const n = d.divideScalar(dist);
    const overlap = minD - dist;
    a.pos.addScaledVector(n, -overlap * 0.5);
    b.pos.addScaledVector(n, overlap * 0.5);
    const rel = b.vel.clone().sub(a.vel).dot(n);
    if (rel < 0) {
      a.vel.addScaledVector(n, rel * 0.5);
      b.vel.addScaledVector(n, -rel * 0.5);
    }
  }
}

function collideBallCar(car) {
  const c = car.pos.clone().addScaledVector(UP, 1);
  const d = ball.pos.clone().sub(c);
  const dist = d.length();
  const minD = BALL_R + CAR_R;
  if (dist < minD && dist > 1e-4) {
    const n = d.divideScalar(dist);
    ball.pos.copy(c).addScaledVector(n, minD);
    const rel = ball.vel.clone().sub(car.vel).dot(n);
    if (rel < 0) ball.vel.addScaledVector(n, -rel * 1.6);
    ball.vel.addScaledVector(n, car.boosting ? 14 : 5); // kick
  }
}

// ---------- physics: ball ----------
// returns 'blue' / 'orange' if a goal was scored this step, else null
function stepBall(dt) {
  const b = ball;
  b.vel.y -= GRAVITY * dt;
  b.vel.multiplyScalar(Math.exp(-0.03 * dt));
  b.pos.addScaledVector(b.vel, dt);

  if (b.pos.y < BALL_R) {
    b.pos.y = BALL_R;
    if (b.vel.y < 0) b.vel.y *= -0.6;
    b.vel.x *= Math.exp(-0.25 * dt);
    b.vel.z *= Math.exp(-0.25 * dt);
  }
  if (b.pos.y > WALL_H - BALL_R) {
    b.pos.y = WALL_H - BALL_R;
    b.vel.y = -Math.abs(b.vel.y) * 0.6;
  }
  if (Math.abs(b.pos.x) > ARENA_HW - BALL_R) {
    b.pos.x = Math.sign(b.pos.x) * (ARENA_HW - BALL_R);
    b.vel.x *= -0.7;
  }

  const inOpening = Math.abs(b.pos.x) < GOAL_HW && b.pos.y < GOAL_H;
  if (Math.abs(b.pos.z) >= ARENA_HL && inOpening) {
    return b.pos.z > 0 ? 'blue' : 'orange';
  }
  if (Math.abs(b.pos.z) > ARENA_HL - BALL_R && !inOpening) {
    b.pos.z = Math.sign(b.pos.z) * (ARENA_HL - BALL_R);
    b.vel.z *= -0.7;
  }

  if (b.vel.length() > BALL_MAX) b.vel.setLength(BALL_MAX);
  return null;
}

// ---------- bot ----------
function botInput(me) {
  // bot attacks the -z goal
  const toGoal = new THREE.Vector3(0, 0, -ARENA_HL).sub(ball.pos);
  toGoal.y = 0;
  if (toGoal.lengthSq() > 1e-6) toGoal.normalize();
  const behind = ball.pos.clone().addScaledVector(toGoal, -9);
  const dBehind = Math.hypot(behind.x - me.pos.x, behind.z - me.pos.z);
  const target = dBehind > 5 ? behind : ball.pos;

  const dx = target.x - me.pos.x;
  const dz = target.z - me.pos.z;
  const dist = Math.hypot(dx, dz);
  const diff = wrap(Math.atan2(dx, dz) - me.yaw);
  const steer = clamp(diff * 2.5, -1, 1);
  const throttle = Math.abs(diff) > 2.2 ? 0.3 : 1;
  const boost = Math.abs(diff) < 0.25 && dist > 30 && me.boost > 25;
  const ballDist = Math.hypot(ball.pos.x - me.pos.x, ball.pos.z - me.pos.z);
  const jump = me.grounded && ball.pos.y > 4 && ballDist < 6;
  return { throttle, steer, boost, drift: false, jump };
}

// ---------- match state ----------
const st = {
  phase: 'countdown',   // countdown | play | goal | over
  t: COUNTDOWN,
  timeLeft: MATCH_TIME,
  scores: { blue: 0, orange: 0 },
  overtime: false,
  msgUntil: 0,
};

const el = {
  sb: document.getElementById('sb'),
  so: document.getElementById('so'),
  timer: document.getElementById('timer'),
  boostNum: document.getElementById('boostNum'),
  boostFill: document.getElementById('boostFill'),
  msg: document.getElementById('msg'),
};

let msgText = '';
function setMsg(text, seconds = Infinity) {
  msgText = text;
  st.msgUntil = seconds === Infinity ? Infinity : elapsed + seconds;
}

function resetKickoff() {
  player.pos.set(0, 0, -30); player.yaw = 0;
  bot.pos.set(0, 0, 30); bot.yaw = Math.PI;
  for (const c of cars) {
    c.vel.set(0, 0, 0);
    c.grounded = true;
    c.boost = 33;
  }
  ball.pos.set(0, BALL_R, 0);
  ball.vel.set(0, 0, 0);
}

function restartMatch() {
  st.scores.blue = 0;
  st.scores.orange = 0;
  st.timeLeft = MATCH_TIME;
  st.overtime = false;
  st.phase = 'countdown';
  st.t = COUNTDOWN;
  for (const p of pads) { p.active = true; p.timer = 0; }
  resetKickoff();
}

function updatePads(dt) {
  for (const p of pads) {
    if (!p.active) {
      p.timer -= dt;
      if (p.timer <= 0) p.active = true;
    }
    p.mesh.visible = p.active;
    if (!p.active) continue;
    for (const c of cars) {
      const d = Math.hypot(c.pos.x - p.pos.x, c.pos.z - p.pos.z);
      if (d < p.r + CAR_R * 0.6) {
        c.boost = Math.min(BOOST_MAX, c.boost + (p.big ? 100 : 12));
        p.active = false;
        p.timer = p.big ? 10 : 4;
        p.mesh.visible = false;
        break;
      }
    }
  }
}

// ---------- main loop ----------
const PHYSICS_STEPS = 4;
let elapsed = 0;
let last = performance.now();
const camPos = new THREE.Vector3();
const camLook = new THREE.Vector3();
let camInit = false;

function physicsStep(dt, playerInp, botInp) {
  updateCar(player, playerInp, dt);
  updateCar(bot, botInp, dt);
  collideCars(player, bot);
  collideBallCar(player);
  collideBallCar(bot);
  const scorer = stepBall(dt);
  updatePads(dt);
  return scorer;
}

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  elapsed += dt;

  if (restartQueued) { restartQueued = false; restartMatch(); }
  let playerInp = { throttle: 0, steer: 0, boost: false, drift: false, jump: false };
  if (st.phase === 'play') playerInp = readPlayerInput();
  else jumpQueued = false;

  if (st.phase === 'countdown') {
    st.t -= dt;
    if (st.t > 0) setMsg(String(Math.ceil(st.t)));
    else {
      st.phase = 'play';
      setMsg('GO!', 0.8);
    }
  } else if (st.phase === 'play') {
    st.timeLeft -= dt;
    if (st.timeLeft <= 0) {
      st.timeLeft = 0;
      if (st.scores.blue !== st.scores.orange) endMatch();
      else if (!st.overtime) {
        st.overtime = true;
        setMsg('OVERTIME', 2);
      }
    }
    const sub = dt / PHYSICS_STEPS;
    for (let i = 0; i < PHYSICS_STEPS && st.phase === 'play'; i++) {
      const scorer = physicsStep(sub, playerInp, botInput(bot));
      if (scorer) onGoal(scorer);
    }
  } else if (st.phase === 'goal') {
    st.t -= dt;
    if (st.t <= 0) {
      resetKickoff();
      st.phase = 'countdown';
      st.t = COUNTDOWN;
    }
  }

  if (st.msgUntil !== 0 && elapsed > st.msgUntil) { msgText = ''; st.msgUntil = 0; }

  updateVisuals(dt);
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

function onGoal(team) {
  st.scores[team] += 1;
  if (st.overtime) {
    endMatch(team);
    return;
  }
  st.phase = 'goal';
  st.t = GOAL_PAUSE;
  setMsg(team === 'blue' ? 'BLUE SCORES!' : 'ORANGE SCORES!');
}

function endMatch(forced) {
  st.phase = 'over';
  const { blue, orange } = st.scores;
  const winner = forced || (blue > orange ? 'blue' : orange > blue ? 'orange' : null);
  const text = winner === 'blue' ? 'BLUE WINS!' : winner === 'orange' ? 'ORANGE WINS!' : 'DRAW';
  setMsg(text + '  (press R)');
}

function updateVisuals(dt) {
  // cars
  for (const c of cars) {
    c.mesh.position.copy(c.pos);
    c.mesh.rotation.y = c.yaw;
    const flame = c.mesh.userData.flame;
    flame.visible = c.boosting;
    if (c.boosting) flame.scale.setScalar(0.8 + Math.random() * 0.4);
  }

  // ball + rolling
  ballMesh.position.copy(ball.pos);
  const flatV = new THREE.Vector3(ball.vel.x, 0, ball.vel.z);
  const speed = flatV.length();
  if (speed > 1e-3) {
    const axis = new THREE.Vector3().crossVectors(UP, flatV).normalize();
    ballMesh.rotateOnWorldAxis(axis, (speed * dt) / BALL_R);
  }

  // pads
  for (const p of pads) if (p.active) p.mesh.material.opacity = 0.6 + 0.3 * Math.sin(elapsed * 4 + p.pos.x);

  // camera chases the player
  const fwd = new THREE.Vector3(Math.sin(player.yaw), 0, Math.cos(player.yaw));
  const desiredPos = player.pos.clone().addScaledVector(fwd, -14).add(new THREE.Vector3(0, 6, 0));
  const desiredLook = player.pos.clone().addScaledVector(fwd, 5).add(new THREE.Vector3(0, 1.5, 0));
  if (!camInit) {
    camPos.copy(desiredPos);
    camLook.copy(desiredLook);
    camInit = true;
  } else {
    const k = 1 - Math.exp(-8 * dt);
    camPos.lerp(desiredPos, k);
    camLook.lerp(desiredLook, k);
  }
  camera.position.copy(camPos);
  camera.lookAt(camLook);

  // HUD
  el.sb.textContent = st.scores.blue;
  el.so.textContent = st.scores.orange;
  const t = Math.ceil(st.timeLeft);
  el.timer.textContent = st.overtime ? 'OT' : `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
  el.boostNum.textContent = Math.round(player.boost);
  el.boostFill.style.width = `${(player.boost / BOOST_MAX) * 100}%`;
  el.msg.textContent = msgText;
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

resetKickoff();
setMsg('3');
requestAnimationFrame(frame);
