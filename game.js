/* Worms Armageddon — browser clone. No dependencies. */
(() => {
'use strict';
const W = 1280, H = 720;
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const WATER_Y = H - 56;
const GRAV = 0.5;

// ---------- tiny audio (synthesized, no assets) ----------
let AC = null;
function ac() {
  if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } }
  if (AC && AC.state === 'suspended') AC.resume();
  return AC;
}
function tone(freq, dur, type, vol, slide) {
  const a = ac(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type || 'square'; o.frequency.setValueAtTime(freq, a.currentTime);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, slide), a.currentTime + dur);
  g.gain.setValueAtTime(vol || 0.12, a.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
  o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + dur);
}
function noiseBurst(dur, vol, low) {
  const a = ac(); if (!a) return;
  const n = Math.floor(a.sampleRate * dur);
  const buf = a.createBuffer(1, n, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const src = a.createBufferSource(); src.buffer = buf;
  const f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = low || 900;
  const g = a.createGain(); g.gain.value = vol || 0.4;
  src.connect(f); f.connect(g); g.connect(a.destination); src.start();
}
const SFX = {
  shoot() { tone(220, 0.25, 'sawtooth', 0.15, 60); noiseBurst(0.2, 0.15, 2000); },
  bounce() { tone(300, 0.08, 'square', 0.06, 150); },
  jump() { tone(300, 0.15, 'square', 0.08, 600); },
  boom() { noiseBurst(0.9, 0.6, 500); tone(70, 0.8, 'sine', 0.35, 28); },
  splash() { noiseBurst(0.5, 0.35, 1200); },
  hurt() { tone(400, 0.2, 'square', 0.1, 120); },
  click() { tone(700, 0.06, 'square', 0.07); },
  fuse() { tone(1200, 0.1, 'square', 0.05); },
  win() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.3, 'square', 0.12), i * 160)); },
};

// ---------- state ----------
const WEAPONS = [
  { id: 'bazooka',  name: 'Bazooka',  key: '1', desc: 'Wind-affected rocket', charge: true },
  { id: 'grenade',  name: 'Grenade',  key: '2', desc: 'Bounce · 3s fuse', charge: true },
  { id: 'shotgun', name: 'Shotgun',  key: '3', desc: '2 shots / turn', charge: false },
  { id: 'dynamite', name: 'Dynamite', key: '4', desc: 'Drop & run!', charge: false },
  { id: 'bat',      name: 'Bat',      key: '5', desc: 'Melee launch', charge: false },
  { id: 'teleport', name: 'Teleport', key: '6', desc: 'Click map to warp', charge: false },
];
const state = {
  mode: 'menu', turnTimeMax: 30, turnTime: 30,
  teams: [], worms: [], projectiles: [], particles: [], texts: [],
  currentTeam: 0, wormOrder: [], wormCursor: 0,
  active: null, weapon: 'bazooka', aim: 0, facing: 1,
  charging: false, power: 0, hasFired: false, shotsLeft: 2,
  settleTimer: 0, wind: 0, shake: 0, time: 0,
  clouds: [], waves: Math.random() * 10,
};
for (let i = 0; i < 7; i++) state.clouds.push({ x: Math.random() * W, y: 30 + Math.random() * 180, s: 0.5 + Math.random(), v: 0.2 + Math.random() * 0.4 });

// ---------- destructible terrain ----------
const terrain = document.createElement('canvas');
terrain.width = W; terrain.height = H;
const tctx = terrain.getContext('2d', { willReadFrequently: true });
let solid = new Uint8Array(W * H);
const sidx = (x, y) => y * W + x;
function isSolid(x, y) {
  x = Math.floor(x); y = Math.floor(y);
  if (x < 0 || x >= W) return true;
  if (y < 0) return false;
  if (y >= H) return false;
  return solid[sidx(x, y)] === 1;
}
function surfaceY(x) {
  x = Math.max(1, Math.min(W - 2, Math.floor(x)));
  for (let y = 0; y < H; y++) if (solid[sidx(x, y)] === 1) return y;
  return H;
}
function genTerrain() {
  solid = new Uint8Array(W * H);
  tctx.clearRect(0, 0, W, H);
  // island heightfield: layered sines + random walk, smoothed
  const p1 = Math.random() * 6.28, p2 = Math.random() * 6.28, p3 = Math.random() * 6.28;
  const a1 = 60 + Math.random() * 50, a2 = 25 + Math.random() * 30, a3 = 8 + Math.random() * 14;
  const base = 470 + Math.random() * 40;
  const walk = new Float32Array(W);
  let w = 0;
  for (let x = 0; x < W; x++) { w += (Math.random() - 0.5) * 14; w *= 0.96; walk[x] = w; }
  const hgt = new Float32Array(W);
  for (let x = 0; x < W; x++) {
    const edge = Math.min(1, x / 130, (W - 1 - x) / 130); // taper to sea at edges
    const m = 0.35 + 0.65 * Math.max(0, edge);
    hgt[x] = base - (Math.sin(x * 0.004 + p1) * a1 + Math.sin(x * 0.011 + p2) * a2 + Math.sin(x * 0.03 + p3) * a3 + walk[x]) * m + (1 - m) * 130;
    hgt[x] = Math.max(180, Math.min(WATER_Y - 24, hgt[x]));
  }
  // smooth
  for (let k = 0; k < 3; k++) for (let x = 1; x < W - 1; x++) hgt[x] = (hgt[x - 1] + hgt[x] * 2 + hgt[x + 1]) / 4;
  // paint + fill grid
  const g = tctx.createLinearGradient(0, 150, 0, H);
  g.addColorStop(0, '#6abe4f'); g.addColorStop(0.12, '#4f9c3e');
  g.addColorStop(0.35, '#6b4a2b'); g.addColorStop(1, '#3a2a1a');
  tctx.fillStyle = g;
  tctx.beginPath(); tctx.moveTo(0, H);
  for (let x = 0; x < W; x++) tctx.lineTo(x, hgt[x]);
  tctx.lineTo(W, H); tctx.closePath(); tctx.fill();
  // grass highlight
  tctx.strokeStyle = '#8be06a'; tctx.lineWidth = 5; tctx.beginPath();
  for (let x = 0; x < W; x++) { const y = hgt[x]; x === 0 ? tctx.moveTo(x, y) : tctx.lineTo(x, y); }
  tctx.stroke();
  // speckles
  for (let i = 0; i < 2500; i++) {
    const x = (Math.random() * W) | 0, y = (hgt[x | 0] + Math.random() * (H - hgt[x | 0])) | 0;
    if (y >= H) continue;
    tctx.fillStyle = Math.random() < 0.5 ? 'rgba(0,0,0,.18)' : 'rgba(255,255,255,.08)';
    tctx.fillRect(x, y, 2, 2);
  }
  for (let x = 0; x < W; x++) {
    const top = Math.floor(hgt[x]);
    for (let y = top; y < H; y++) solid[sidx(x, y)] = 1;
  }
  // carve a few starting caves/pockets for fun
  for (let i = 0; i < 4; i++) carveCircle(Math.random() * W, 300 + Math.random() * 200, 22 + Math.random() * 26, true);
}
function carveCircle(cx, cy, r, silent) {
  cx |= 0; cy |= 0; r |= 0;
  for (let y = Math.max(0, cy - r); y < Math.min(H, cy + r); y++)
    for (let x = Math.max(0, cx - r); x < Math.min(W, cx + r); x++) {
      const dx = x - cx, dy = y - cy;
      if (dx * dx + dy * dy <= r * r) solid[sidx(x, y)] = 0;
    }
  if (!silent) {
    tctx.save(); tctx.globalCompositeOperation = 'destination-out';
    tctx.beginPath(); tctx.arc(cx, cy, r, 0, 6.283); tctx.fill(); tctx.restore();
  } else {
    // repaint-safe silent carve: redraw hole into terrain canvas too
    tctx.save(); tctx.globalCompositeOperation = 'destination-out';
    tctx.beginPath(); tctx.arc(cx, cy, r, 0, 6.283); tctx.fill(); tctx.restore();
  }
}

// ---------- worms / teams ----------
const NAMES_R = ['Blitz', 'Rambo', 'Killer', 'Sarge', 'Boom', 'Fury'];
const NAMES_B = ['Wormy', 'Slinky', 'Diggy', 'Noodle', 'Pinky', 'Guts'];
function spawnTeams(perTeam) {
  state.worms = [];
  state.teams = [
    { id: 0, name: 'RED', color: '#ff5d5d', dark: '#a02c2c' },
    { id: 1, name: 'BLUE', color: '#4da3ff', dark: '#2456a0' },
  ];
  const xs = [];
  const margin = 90, span = W - margin * 2;
  const total = perTeam * 2;
  for (let i = 0; i < total; i++) xs.push(margin + (span * (i + 0.5)) / total + (Math.random() - 0.5) * 40);
  // shuffle so teams interleave
  xs.sort(() => Math.random() - 0.5);
  let ri = 0, bi = 0;
  for (let i = 0; i < total; i++) {
    const team = i % 2;
    const nm = team === 0 ? NAMES_R[ri++ % NAMES_R.length] : NAMES_B[bi++ % NAMES_B.length];
    const x = Math.max(20, Math.min(W - 20, xs[i]));
    const y = surfaceY(x) - 26;
    state.worms.push({
      id: state.worms.length, team, name: nm, x, y, vx: 0, vy: 0,
      w: 16, h: 24, hp: 100, alive: true, onGround: false,
      dir: x < W / 2 ? 1 : -1, fallPeak: 0, slideT: 0,
    });
  }
}
function aliveWorms(team) { return state.worms.filter(w => w.alive && w.team === team); }
function nextTurn(first) {
  state.projectiles = []; state.charging = false; state.power = 0;
  state.hasFired = false; state.shotsLeft = 2; state.settleTimer = 0;
  state.turnTime = state.turnTimeMax;
  state.wind = Math.round((Math.random() * 2 - 1) * 22);
  if (first) state.currentTeam = Math.random() < 0.5 ? 0 : 1;
  else state.currentTeam = 1 - state.currentTeam;
  // pick next living worm of that team (round-robin)
  let cand = aliveWorms(state.currentTeam);
  if (cand.length === 0) return gameOver(1 - state.currentTeam);
  const other = aliveWorms(1 - state.currentTeam);
  if (other.length === 0) return gameOver(state.currentTeam);
  state.wormCursor = (state.wormCursor + 1) % 64;
  state.active = cand[state.wormCursor % cand.length];
  state.facing = state.active.dir;
  state.aim = state.facing === 1 ? -0.35 : Math.PI + 0.35;
  toast(`${state.currentTeam === 0 ? '🔴 RED' : '🔵 BLUE'} · ${state.active.name}'s turn`);
  updateHUD();
}
function gameOver(winner) {
  state.mode = 'over'; state.active = null;
  const el = document.getElementById('gameover');
  document.getElementById('go-title').textContent = winner === 0 ? '🏆 RED TEAM WINS!' : '🏆 BLUE TEAM WINS!';
  const red = aliveWorms(0).length, blue = aliveWorms(1).length;
  document.getElementById('go-sub').textContent = `Survivors — Red: ${red}, Blue: ${blue}. The island remembers.`;
  el.classList.remove('hidden');
  SFX.win();
}

// ---------- combat ----------
function muzzle(w) {
  const ax = Math.cos(state.aim), ay = Math.sin(state.aim);
  return { x: w.x + ax * 22, y: w.y - 6 + ay * 22 };
}
function fireActive() {
  const w = state.active;
  if (!w || !w.alive || state.mode !== 'play') return;
  const m = muzzle(w);
  const pwr = state.weapon === 'bazooka' || state.weapon === 'grenade' ? state.power : 50;
  const spd = 3 + (pwr / 100) * 11;
  if (state.weapon === 'bazooka') {
    state.projectiles.push({ type: 'bazooka', x: m.x, y: m.y, vx: Math.cos(state.aim) * spd, vy: Math.sin(state.aim) * spd, r: 46, dmg: 55, life: 600 });
    SFX.shoot(); afterShot(false);
  } else if (state.weapon === 'grenade') {
    state.projectiles.push({ type: 'grenade', x: m.x, y: m.y, vx: Math.cos(state.aim) * spd, vy: Math.sin(state.aim) * spd - 2, fuse: 180, r: 42, dmg: 48, bounce: 0.55, life: 600 });
    SFX.shoot(); afterShot(false);
  } else if (state.weapon === 'shotgun') {
    const a = state.aim + (Math.random() - 0.5) * 0.08;
    state.projectiles.push({ type: 'pellet', x: m.x, y: m.y, vx: Math.cos(a) * 16, vy: Math.sin(a) * 16, r: 26, dmg: 28, life: 40 });
    SFX.shoot();
    state.shotsLeft--;
    if (state.shotsLeft <= 0) afterShot(false);
    else { state.settleTimer = 20; }
  } else if (state.weapon === 'dynamite') {
    state.projectiles.push({ type: 'dynamite', x: w.x + w.dir * 14, y: w.y - 4, vx: w.dir * 1.5, vy: -3, fuse: 260, r: 72, dmg: 78, bounce: 0.3, life: 600 });
    SFX.fuse(); afterShot(false);
  } else if (state.weapon === 'bat') {
    // melee: shove + damage everything in arc
    SFX.shoot();
    burst(w.x + w.dir * 20, w.y - 10, 10, ['#fff', '#ffd34d'], 4);
    let hit = false;
    for (const o of state.worms) {
      if (!o.alive || o === w) continue;
      const dx = o.x - w.x, dy = (o.y - 10) - (w.y - 10);
      if (Math.abs(dx) < 46 && Math.abs(dy) < 34 && Math.sign(dx) === w.dir) {
        damageWorm(o, 35, w);
        o.vx = w.dir * (9 + Math.random() * 3); o.vy = -9;
        addText(o.x, o.y - 34, 'SMASH!', '#ffd34d');
        hit = true;
      }
    }
    carveCircle(w.x + w.dir * 26, w.y - 6, 12);
    if (!hit) addText(w.x, w.y - 40, 'miss…', '#9fb3d8');
    afterShot(false);
  }
}
function afterShot(teleported) {
  state.charging = false; state.power = 0;
  state.hasFired = true; state.settleTimer = teleported ? 40 : 90;
}
function explode(x, y, r, dmg, owner) {
  carveCircle(x, y, r);
  SFX.boom();
  state.shake = Math.min(16, 6 + r / 8);
  burst(x, y, 26 + r / 2, ['#ffdd55', '#ff9933', '#ff5522', '#555', '#222'], 7);
  flash(x, y, r);
  for (const w of state.worms) {
    if (!w.alive) continue;
    const dx = w.x - x, dy = (w.y - 10) - y;
    const d = Math.hypot(dx, dy);
    if (d < r + 26) {
      const f = Math.max(0.15, 1 - d / (r + 30));
      damageWorm(w, Math.round(dmg * f), owner);
      const kn = 4 + 9 * f;
      w.vx += (dx / (d + 1)) * kn; w.vy += (dy / (d + 1)) * kn - 4 * f;
      w.onGround = false;
    }
  }
  checkWinSoon();
}
function damageWorm(w, dmg, owner) {
  if (!w.alive || state.mode === 'over') return;
  w.hp -= dmg;
  addText(w.x + (Math.random() - 0.5) * 10, w.y - 36, '-' + dmg, dmg >= 30 ? '#ffb84d' : '#fff');
  burst(w.x, w.y - 12, 8, ['#ff6666', '#fff'], 4);
  SFX.hurt();
  if (w.hp <= 0) {
    w.hp = 0; w.alive = false;
    burst(w.x, w.y - 12, 22, ['#ff5d5d', '#fff', '#888'], 6);
    addText(w.x, w.y - 52, '☠ ' + w.name, '#ff8080');
    toast(`☠ ${w.name} dies${owner && owner !== w ? ' — nice shot, ' + owner.name + '!' : ''}`);
    if (state.active === w) { state.settleTimer = Math.max(state.settleTimer, 60); state.hasFired = true; }
    checkWinSoon();
  }
  updateHUD();
}
let winChecked = false;
function checkWinSoon() {
  if (winChecked || state.mode !== 'play') return;
  const r = aliveWorms(0).length, b = aliveWorms(1).length;
  if (r === 0 || b === 0) { winChecked = true; setTimeout(() => gameOver(r === 0 ? 1 : 0), 1200); }
}

// ---------- particles / texts ----------
function burst(x, y, n, colors, spd) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * 6.283, s = (0.5 + Math.random()) * (spd || 5);
    state.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 2, life: 30 + Math.random() * 40, max: 70, color: colors[(Math.random() * colors.length) | 0], size: 2 + Math.random() * 4, grav: 0.25 });
  }
}
function flash(x, y, r) { state.particles.push({ x, y, vx: 0, vy: 0, life: 8, max: 8, color: '#fff3c4', size: r * 1.4, grav: 0, ring: true }); }
function splashP(x, y) { burst(x, y, 16, ['#7fd4ff', '#fff'], 4); }
function addText(x, y, s, c) { state.texts.push({ x, y, s, c, life: 80 }); }

// ---------- input ----------
const keys = {};
let mouse = { x: W / 2, y: H / 2, down: false, gx: W / 2, gy: H / 2 };
function canvasPos(e) {
  const r = canvas.getBoundingClientRect();
  const cx = (e.clientX - r.left) * (W / r.width);
  const cy = (e.clientY - r.top) * (H / r.height);
  return { x: cx, y: cy };
}
window.addEventListener('keydown', e => {
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
  if (e.repeat) return;
  keys[e.code] = true; ac();
  const w = state.active;
  if (state.mode === 'play' && w && w.alive) {
    if (e.code === 'Enter' || e.code === 'KeyJ') jump(w, false);
    if (e.code === 'Backspace') jump(w, true);
    if (e.code === 'Space') { if (isChargeable()) { state.charging = true; state.power = 0; } }
    const wi = WEAPONS.findIndex(k => 'Digit' + k.key === e.code || 'Numpad' + k.key === e.code);
    if (wi >= 0) selectWeapon(WEAPONS[wi].id);
    if (e.code === 'Space' && !isChargeable()) fireActive();
  }
  if (e.code === 'Space' && state.mode === 'menu') startGame();
});
window.addEventListener('keyup', e => {
  keys[e.code] = false;
  if (e.code === 'Space' && state.charging && state.mode === 'play') fireActive();
});
canvas.addEventListener('mousemove', e => { const p = canvasPos(e); mouse.x = p.x; mouse.y = p.y; });
canvas.addEventListener('mousedown', e => {
  ac();
  const p = canvasPos(e); mouse.down = true;
  if (state.mode !== 'play' || !state.active) return;
  if (state.weapon === 'teleport') {
    const w = state.active;
    if (!isSolid(p.x, p.y) && p.y < WATER_Y - 10) {
      burst(w.x, w.y - 12, 14, ['#c9a6ff', '#fff'], 4);
      w.x = p.x; w.y = p.y - 10; w.vx = 0; w.vy = 0;
      burst(w.x, w.y - 12, 14, ['#c9a6ff', '#fff'], 4);
      SFX.click(); afterShot(true);
    } else toast('⛔ No warp there');
    return;
  }
  if (isChargeable()) { state.charging = true; state.power = 0; }
  else fireActive();
});
window.addEventListener('mouseup', () => {
  mouse.down = false;
  if (state.charging && state.mode === 'play') fireActive();
});
function isChargeable() {
  const w = WEAPONS.find(k => k.id === state.weapon);
  return !!(w && w.charge);
}
function jump(w, flip) {
  if (!w.onGround) return;
  SFX.jump();
  w.vy = flip ? -11 : -9.5;
  w.vx = flip ? -w.dir * 4.5 : w.dir * 1.2;
  w.onGround = false;
}
function selectWeapon(id) {
  state.weapon = id; state.charging = false; state.power = 0;
  SFX.click(); updateHUD();
}

// ---------- physics ----------
function collideMove(w) {
  // horizontal
  let nx = w.x + w.vx;
  if (hitBox(nx, w.y, w.w, w.h)) {
    // try step-up
    let stepped = false;
    for (let s = 1; s <= 7; s++) {
      if (!hitBox(nx, w.y - s, w.w, w.h)) { w.y -= s; stepped = true; break; }
    }
    if (!stepped) { w.vx = 0; nx = w.x; }
  }
  w.x = Math.max(10, Math.min(W - 10, nx));
  // vertical
  const prevVy = w.vy;
  let ny = w.y + w.vy;
  if (hitBox(w.x, ny, w.w, w.h)) {
    if (w.vy > 0) {
      // land: snap to surface
      let y = w.y;
      for (let i = 0; i < Math.ceil(w.vy) + 2; i++) {
        if (hitBox(w.x, y + 1, w.w, w.h)) break;
        y += 1;
      }
      w.y = y; w.onGround = true;
      if (prevVy > 10) { const d = Math.round((prevVy - 10) * 5); if (d > 0) { damageWorm(w, Math.min(60, d), null); burst(w.x, w.y, 8, ['#fff', '#ccc'], 3); } }
      w.vy = 0;
    } else { w.vy = 0.5; ny = w.y + w.vy; w.y = ny; }
  } else {
    w.y = ny; w.onGround = false;
    if (w.vy < 0) w.fallPeak = Math.min(w.fallPeak, w.vy);
  }
  if (!w.onGround) w.vy = Math.min(14, w.vy + GRAV);
  else w.fallPeak = 0;
}
function hitBox(cx, feetY, w, h) {
  const x0 = Math.floor(cx - w / 2), x1 = Math.floor(cx + w / 2);
  const y0 = Math.floor(feetY - h), y1 = Math.floor(feetY);
  for (let y = y0; y <= y1; y += 3)
    for (let x = x0; x <= x1; x += 3)
      if (isSolid(x, y)) return true;
  return isSolid(cx - w / 2, feetY) || isSolid(cx + w / 2, feetY) || isSolid(cx, feetY - h);
}
function updateWorm(w) {
  if (!w.alive) return;
  const active = w === state.active && state.mode === 'play' && !state.hasFired;
  if (active) {
    let mv = 0;
    if (keys.KeyA || keys.ArrowLeft) mv -= 1;
    if (keys.KeyD || keys.ArrowRight) mv += 1;
    if (mv !== 0) { w.dir = mv; state.facing = mv; w.vx = mv * 1.9; }
    else w.vx *= 0.7;
    if (keys.KeyW || keys.ArrowUp) state.aim += (state.facing === 1 ? -1 : 1) * 0.035;
    if (keys.KeyS || keys.ArrowDown) state.aim -= (state.facing === 1 ? -1 : 1) * 0.035;
    // mouse aim assist (only when mouse moved recently over canvas)
    // keyboard takes precedence; blend mouse aim when no aim keys pressed
    if (!keys.KeyW && !keys.KeyS && !keys.ArrowUp && !keys.ArrowDown) {
      const dx = mouse.x - w.x, dy = mouse.y - (w.y - 10);
      if (Math.hypot(dx, dy) > 40) {
        let ta = Math.atan2(dy, dx);
        // keep aim on facing side to avoid instant flips
        if (state.facing === 1 && (ta > 1.45 || ta < -1.65)) { /* keep */ }
        else if (state.facing === -1 && ta > -1.45 && ta < 1.65) { /* keep */ }
        else state.aim = ta;
      }
    }
    if (state.charging) state.power = Math.min(100, state.power + 1.6);
  } else {
    w.vx *= 0.85;
  }
  collideMove(w);
  // drown
  if (w.y > WATER_Y + 8) {
    w.alive = false; w.hp = 0;
    splashP(w.x, WATER_Y); SFX.splash();
    addText(w.x, WATER_Y - 30, '☠ drowned', '#7fd4ff');
    toast(`🌊 ${w.name} sleeps with the fishes`);
    if (state.active === w) { state.hasFired = true; state.settleTimer = Math.max(state.settleTimer, 60); }
    checkWinSoon(); updateHUD();
  }
  // fell off world safety
  if (w.y > H + 60 && w.alive) { w.alive = false; w.hp = 0; checkWinSoon(); updateHUD(); }
}
function updateProjectile(p) {
  if (p.type === 'dynamite') {
    p.vy = Math.min(12, p.vy + GRAV);
    // move with collision + bounce
    let nx = p.x + p.vx;
    if (isSolid(nx, p.y - 2)) { p.vx *= -(p.bounce || 0.4); nx = p.x; SFX.bounce(); }
    p.x = nx;
    let ny = p.y + p.vy;
    if (isSolid(p.x, ny)) { p.vy *= -(p.bounce || 0.4); p.vx *= 0.7; ny = p.y; if (Math.abs(p.vy) > 1) SFX.bounce(); else p.vy = 0; }
    p.y = ny;
    if (--p.fuse <= 0) { explode(p.x, p.y - 4, p.r, p.dmg, state.active); p.dead = true; }
    if (p.y > WATER_Y) { splashP(p.x, WATER_Y); SFX.splash(); p.dead = true; state.settleTimer = Math.max(state.settleTimer, 40); }
    return;
  }
  if (p.type === 'pellet') {
    p.x += p.vx; p.y += p.vy;
    if (--p.life <= 0) p.dead = true;
    if (isSolid(p.x, p.y)) { explode(p.x, p.y, p.r, p.dmg, state.active); p.dead = true; return; }
    for (const w of state.worms) {
      if (!w.alive) continue;
      if (Math.abs(w.x - p.x) < 12 && p.y > w.y - 26 && p.y < w.y + 2) {
        damageWorm(w, p.dmg, state.active);
        w.vx += Math.sign(p.vx) * 4; w.vy -= 3; w.onGround = false;
        burst(p.x, p.y, 8, ['#ffe9a3', '#fff'], 4);
        p.dead = true; return;
      }
    }
    if (p.y > WATER_Y) { splashP(p.x, WATER_Y); p.dead = true; }
    return;
  }
  // bazooka / grenade
  const windAcc = (p.type === 'bazooka' ? 0.012 : 0.008) * state.wind;
  p.vx += windAcc;
  p.vy = Math.min(14, p.vy + (p.type === 'bazooka' ? 0.22 : 0.35));
  p.x += p.vx; p.y += p.vy;
  if (--p.life <= 0) { explode(p.x, p.y, p.r, p.dmg, state.active); p.dead = true; return; }
  if (p.type === 'grenade' && --p.fuse <= 0) { explode(p.x, p.y, p.r, p.dmg, state.active); p.dead = true; return; }
  if (p.y > WATER_Y) { splashP(p.x, WATER_Y); SFX.splash(); p.dead = true; state.settleTimer = Math.max(state.settleTimer, 50); return; }
  if (p.x < 2 || p.x > W - 2) { p.vx *= -0.6; p.x = Math.max(2, Math.min(W - 2, p.x)); SFX.bounce(); }
  if (isSolid(p.x, p.y)) {
    if (p.type === 'bazooka') { explode(p.x, p.y, p.r, p.dmg, state.active); p.dead = true; }
    else {
      // bounce grenade
      p.x -= p.vx; p.y -= p.vy;
      const bx = isSolid(p.x + p.vx, p.y), by = isSolid(p.x, p.y + p.vy);
      if (bx) p.vx *= -(p.bounce || 0.5);
      if (by) p.vy *= -(p.bounce || 0.5);
      if (!bx && !by) { p.vx *= -0.5; p.vy *= -0.5; }
      p.vx *= 0.92; p.vy *= 0.92;
      p.x += p.vx; p.y += p.vy;
      if (Math.hypot(p.vx, p.vy) > 1.2) SFX.bounce();
    }
  }
  // direct worm hit for bazooka
  if (p.type === 'bazooka' && !p.dead) {
    for (const w of state.worms) {
      if (!w.alive) continue;
      if (Math.abs(w.x - p.x) < 12 && p.y > w.y - 26 && p.y < w.y + 2) { explode(p.x, p.y, p.r, p.dmg, state.active); p.dead = true; break; }
    }
  }
}

// ---------- HUD ----------
const wpnBox = document.getElementById('weapons');
const teamsBox = document.getElementById('teams');
function buildWeapons() {
  wpnBox.innerHTML = '';
  const icons = { bazooka: '🚀', grenade: '💣', shotgun: '🔫', dynamite: '🧨', bat: '🏏', teleport: '🌀' };
  for (const w of WEAPONS) {
    const d = document.createElement('div');
    d.className = 'wpn' + (state.weapon === w.id ? ' active' : '');
    d.innerHTML = `<b><span class="key">${w.key}</span>${icons[w.id] || ''} ${w.name}</b><small>${w.desc}</small>`;
    d.onclick = () => { ac(); selectWeapon(w.id); };
    wpnBox.appendChild(d);
  }
}
function updateHUD() {
  buildWeapons();
  document.getElementById('wind-val').textContent = (state.wind > 0 ? '→ +' : state.wind < 0 ? '← ' : '') + state.wind;
  const t = state.active;
  document.getElementById('turn-val').textContent = t ? `${t.name} (${t.team === 0 ? 'RED' : 'BLUE'})` : '—';
  teamsBox.innerHTML = '';
  state.teams.forEach(tm => {
    const div = document.createElement('div');
    div.className = 'team ' + tm.name.toLowerCase();
    let rows = `<h4>${tm.name === 'RED' ? '🔴' : '🔵'} TEAM ${tm.name}</h4>`;
    for (const w of state.worms.filter(k => k.team === tm.id)) {
      rows += `<div class="worm-row${w === state.active ? ' current' : ''}">${w.alive ? '🪱' : '☠'} ${w.name} <div class="hpbar"><i style="width:${w.hp}%"></i></div> ${w.hp}</div>`;
    }
    div.innerHTML = rows;
    teamsBox.appendChild(div);
  });
}
let toastT = null;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2200);
}

// ---------- render ----------
function draw() {
  ctx.save();
  if (state.shake > 0.3) ctx.translate((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake);
  // sky
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#0e1a3d'); sky.addColorStop(0.55, '#274b8f'); sky.addColorStop(0.8, '#7fb2e5'); sky.addColorStop(1, '#cfe8ff');
  ctx.fillStyle = sky; ctx.fillRect(-20, -20, W + 40, H + 40);
  // sun + clouds
  ctx.fillStyle = '#fff6c9'; ctx.beginPath(); ctx.arc(1080, 120, 44, 0, 6.283); ctx.fill();
  ctx.fillStyle = 'rgba(255,246,201,.25)'; ctx.beginPath(); ctx.arc(1080, 120, 70, 0, 6.283); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  for (const c of state.clouds) {
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, 46 * c.s, 16 * c.s, 0, 0, 6.283);
    ctx.ellipse(c.x + 30 * c.s, c.y + 4, 30 * c.s, 12 * c.s, 0, 0, 6.283);
    ctx.ellipse(c.x - 32 * c.s, c.y + 5, 28 * c.s, 11 * c.s, 0, 0, 6.283);
    ctx.fill();
  }
  // distant hills
  ctx.fillStyle = 'rgba(30,60,110,.5)';
  ctx.beginPath(); ctx.moveTo(-20, WATER_Y);
  for (let x = 0; x <= W; x += 40) ctx.lineTo(x, WATER_Y - 60 - Math.sin(x * 0.008 + 2) * 40);
  ctx.lineTo(W + 20, WATER_Y); ctx.closePath(); ctx.fill();
  // terrain
  ctx.drawImage(terrain, 0, 0);
  // water
  const wg = ctx.createLinearGradient(0, WATER_Y, 0, H);
  wg.addColorStop(0, 'rgba(64,170,255,.9)'); wg.addColorStop(1, 'rgba(10,60,140,.95)');
  ctx.fillStyle = wg;
  ctx.beginPath(); ctx.moveTo(-20, H + 20); ctx.lineTo(-20, WATER_Y + 4);
  for (let x = -20; x <= W + 20; x += 16) ctx.lineTo(x, WATER_Y + 4 + Math.sin(x * 0.05 + state.time * 0.06) * 4);
  ctx.lineTo(W + 20, H + 20); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  for (let x = 0; x < W; x += 64) {
    const y = WATER_Y + 6 + Math.sin(x * 0.05 + state.time * 0.06) * 4;
    ctx.fillRect(x + ((state.time * 2) % 64), y, 26, 2);
  }
  // dynamite blink / projectiles
  for (const p of state.projectiles) drawProjectile(p);
  // worms
  for (const w of state.worms) drawWorm(w);
  // aim guide
  const a = state.active;
  if (a && a.alive && state.mode === 'play' && !state.hasFired) {
    const m = muzzle(a);
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,.65)'; ctx.setLineDash([6, 6]); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(m.x, m.y);
    let px = m.x, py = m.y;
    let vx = Math.cos(state.aim) * 6, vy = Math.sin(state.aim) * 6;
    const ch = isChargeable() ? (3 + (Math.max(state.power, 25) / 100) * 11) / 6 : 2.2;
    vx *= ch; vy *= ch;
    for (let i = 0; i < 26; i++) {
      vy += pGravPreview();
      px += vx; py += vy;
      if (isSolid(px, py)) break;
      if (i % 2 === 0) ctx.lineTo(px, py);
    }
    ctx.stroke(); ctx.restore();
    // power bar
    if (state.charging) {
      ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(a.x - 30, a.y - 62, 60, 10);
      const gr = ctx.createLinearGradient(a.x - 30, 0, a.x + 30, 0);
      gr.addColorStop(0, '#37d67a'); gr.addColorStop(0.7, '#ffd34d'); gr.addColorStop(1, '#ff4444');
      ctx.fillStyle = gr; ctx.fillRect(a.x - 29, a.y - 61, 58 * (state.power / 100), 8);
    }
  }
  // particles
  for (const p of state.particles) {
    const al = Math.max(0, p.life / p.max);
    if (p.ring) {
      ctx.globalAlpha = al; ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (1.2 - al * 0.5), 0, 6.283); ctx.fill();
      ctx.globalAlpha = 1;
    } else {
      ctx.globalAlpha = al; ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      ctx.globalAlpha = 1;
    }
  }
  // texts
  ctx.textAlign = 'center'; ctx.font = 'bold 16px Inter,Arial';
  for (const t of state.texts) {
    ctx.globalAlpha = Math.min(1, t.life / 40);
    ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,.8)';
    ctx.strokeText(t.s, t.x, t.y); ctx.fillStyle = t.c; ctx.fillText(t.s, t.x, t.y);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  // low-time warning vignette
  if (state.mode === 'play' && state.turnTime < 6) {
    ctx.fillStyle = `rgba(255,40,40,${0.08 + 0.05 * Math.sin(state.time * 0.3)})`;
    ctx.fillRect(0, 0, W, H);
  }
}
function pGravPreview() {
  if (state.weapon === 'bazooka') return 0.22;
  if (state.weapon === 'grenade') return 0.35;
  if (state.weapon === 'shotgun') return 0.02;
  return 0.3;
}
function drawProjectile(p) {
  ctx.save(); ctx.translate(p.x, p.y);
  if (p.type === 'bazooka') {
    ctx.rotate(Math.atan2(p.vy, p.vx));
    ctx.fillStyle = '#333'; ctx.fillRect(-10, -3, 20, 6);
    ctx.fillStyle = '#ff4444'; ctx.fillRect(-13, -3, 5, 6);
    ctx.fillStyle = '#ffcc33'; ctx.fillRect(2 + Math.random() * 3, -2, 6, 4);
  } else if (p.type === 'grenade') {
    ctx.fillStyle = '#2f7a33'; ctx.beginPath(); ctx.arc(0, 0, 7, 0, 6.283); ctx.fill();
    ctx.fillStyle = '#999'; ctx.fillRect(-2, -11, 4, 5);
    if (p.fuse % 30 < 15) { ctx.fillStyle = '#ffef9c'; ctx.beginPath(); ctx.arc(0, -12, 3, 0, 6.283); ctx.fill(); }
  } else if (p.type === 'dynamite') {
    ctx.fillStyle = '#c12727'; ctx.fillRect(-9, -7, 18, 14);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 9px Arial'; ctx.textAlign = 'center'; ctx.fillText('TNT', 0, 3);
    if (p.fuse % 40 < 20) { ctx.fillStyle = '#ffe66d'; ctx.beginPath(); ctx.arc(8, -10, 4, 0, 6.283); ctx.fill(); }
  } else if (p.type === 'pellet') {
    ctx.fillStyle = '#fff3a3'; ctx.beginPath(); ctx.arc(0, 0, 3, 0, 6.283); ctx.fill();
  }
  ctx.restore();
}
function drawWorm(w) {
  if (!w.alive) return;
  const bob = w.onGround ? 0 : Math.sin(state.time * 0.3 + w.id) * 1;
  ctx.save(); ctx.translate(w.x, w.y + bob * 0.3);
  // shadow/name
  ctx.font = '11px Inter,Arial'; ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillText(w.name, 0, -46);
  // hp mini bar
  ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(-16, -44, 32, 5);
  ctx.fillStyle = w.hp > 50 ? '#37d67a' : w.hp > 25 ? '#ffd34d' : '#ff5555';
  ctx.fillRect(-15, -43, 30 * (w.hp / 100), 3);
  // body
  const base = w.team === 0 ? '#ffb3b3' : '#bcd8ff';
  const dark = w.team === 0 ? '#a02c2c' : '#2456a0';
  ctx.fillStyle = 'rgba(0,0,0,.25)';
  ctx.beginPath(); ctx.ellipse(0, 1, 12, 11, 0, 0, 6.283); ctx.fill();
  ctx.fillStyle = base;
  ctx.beginPath(); ctx.ellipse(0, -10, 11, 12, 0, 0, 6.283); ctx.fill();
  ctx.fillStyle = dark; ctx.fillRect(-11, -14, 22, 3);
  // eyes face dir
  const ex = w.dir * 4;
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-3 + ex, -14, 4, 0, 6.283); ctx.arc(4 + ex, -14, 4, 0, 6.283); ctx.fill();
  ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(-3 + ex + w.dir, -14, 1.8, 0, 6.283); ctx.arc(4 + ex + w.dir, -14, 1.8, 0, 6.283); ctx.fill();
  // helmet
  ctx.fillStyle = w.team === 0 ? '#d33' : '#2f6fd0';
  ctx.beginPath(); ctx.arc(0, -16, 9, Math.PI, 0); ctx.fill();
  ctx.fillRect(-9, -18, 18, 3);
  // gun direction
  const ang = Math.atan2(Math.sin(state.aim), Math.cos(state.aim));
  if (w === state.active) {
    ctx.save(); ctx.translate(0, -8); ctx.rotate(ang);
    ctx.fillStyle = '#222'; ctx.fillRect(6, -2, 18, 4);
    ctx.restore();
  }
  // active marker
  if (w === state.active && state.mode === 'play') {
    ctx.fillStyle = '#ffd34d';
    const yy = -56 + Math.sin(state.time * 0.15) * 3;
    ctx.beginPath(); ctx.moveTo(-6, yy); ctx.lineTo(6, yy); ctx.lineTo(0, yy + 8); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

// ---------- main loop ----------
let last = 0, hudT = 0;
function frame(ts) {
  requestAnimationFrame(frame);
  state.time++;
  const dt = Math.min(50, ts - last || 16); last = ts;
  for (const c of state.clouds) { c.x += c.v * (dt / 16); if (c.x > W + 80) c.x = -80; }
  if (state.mode === 'play') {
    for (const w of state.worms) updateWorm(w);
    for (const p of state.projectiles) updateProjectile(p);
    state.projectiles = state.projectiles.filter(p => !p.dead);
    // turn timer
    state.turnTime -= dt / 1000;
    document.getElementById('timer-val').textContent = Math.max(0, Math.ceil(state.turnTime));
    if (state.turnTime <= 0 && !state.hasFired) { toast('⏱ Out of time!'); nextTurn(); }
    else if (state.hasFired && state.projectiles.length === 0) {
      if (--state.settleTimer <= 0) {
        // let bodies settle a touch
        const moving = state.worms.some(w => w.alive && Math.abs(w.vx) > 0.4 && !w.onGround);
        if (!moving) nextTurn();
      }
    }
    hudT += dt;
    if (hudT > 300) { hudT = 0; updateHUD(); }
  }
  // particles/texts always animate
  for (const p of state.particles) { p.x += p.vx; p.y += p.vy; p.vy += (p.grav || 0); p.vx *= 0.98; p.life--; }
  state.particles = state.particles.filter(p => p.life > 0);
  if (state.particles.length > 900) state.particles.splice(0, state.particles.length - 900);
  for (const t of state.texts) { t.y -= 0.5; t.life--; }
  state.texts = state.texts.filter(t => t.life > 0);
  state.shake *= 0.88;
  draw();
}

// ---------- boot ----------
function startGame() {
  ac();
  const per = parseInt(document.getElementById('opt-worms').value, 10) || 3;
  state.turnTimeMax = parseInt(document.getElementById('opt-time').value, 10) || 30;
  if (state.worms.length === 0 || state.mode === 'over') { genTerrain(); spawnTeams(per); }
  else if (state.worms.length / 2 !== per) { genTerrain(); spawnTeams(per); }
  state.projectiles = []; state.particles = []; state.texts = [];
  state.mode = 'play'; winChecked = false;
  document.getElementById('menu').classList.add('hidden');
  document.getElementById('gameover').classList.add('hidden');
  state.wormCursor = -1;
  nextTurn(true);
  SFX.click();
}
document.getElementById('btn-start').onclick = startGame;
document.getElementById('btn-restart').onclick = () => { genTerrain(); spawnTeams(state.worms.length / 2 || 3); startGame(); };
document.getElementById('btn-newmap').onclick = () => { ac(); genTerrain(); SFX.click(); toast('🎲 Fresh island generated'); };
genTerrain();
buildWeapons();
updateHUD();
requestAnimationFrame(frame);
})();
