'use strict';
const W = 960, H = 540;
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const menuEl = document.getElementById('menu');
const overEl = document.getElementById('over');
const overTitle = document.getElementById('overTitle');
const overSub = document.getElementById('overSub');
const playBtn = document.getElementById('playBtn');
const againBtn = document.getElementById('againBtn');
const helpBtn = document.getElementById('helpBtn');
const helpEl = document.getElementById('help');
const modeSel = document.getElementById('mode');
const statusEl = document.getElementById('status');
const hpEls = [document.getElementById('hp1'), document.getElementById('hp2')];
const livesEls = [document.getElementById('lives1'), document.getElementById('lives2')];
const nameEls = [document.getElementById('name1'), document.getElementById('name2')];
const timerEl = document.getElementById('timer');

// ---------- audio (procedural, no assets) ----------
let AC = null;
function audio() { try { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) {} return AC; }
function beep(freq, dur, type, vol) {
  try {
    const ac = audio(); if (!ac) return;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'square'; o.frequency.value = freq;
    g.gain.setValueAtTime(vol || 0.06, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
    o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + dur);
  } catch (e) {}
}
function boomSound(big) {
  try {
    const ac = audio(); if (!ac) return;
    const len = Math.floor(ac.sampleRate * (big ? 0.5 : 0.25));
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    const s = ac.createBufferSource(); s.buffer = buf;
    const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = big ? 900 : 1600;
    const g = ac.createGain(); g.gain.value = big ? 0.35 : 0.2;
    s.connect(f); f.connect(g); g.connect(ac.destination); s.start();
  } catch (e) {}
}

// ---------- terrain (destructible) ----------
const terrain = document.createElement('canvas');
terrain.width = W; terrain.height = H;
const tctx = terrain.getContext('2d', { willReadFrequently: true });
let solid = new Uint8Array(W * H);
const sIdx = (x, y) => y * W + x;
function isSolid(x, y) {
  x |= 0; y |= 0;
  if (x < 0 || x >= W) return true;
  if (y < 0) return false;
  if (y >= H) return true;
  return solid[sIdx(x, y)] === 1;
}
function surfaceY(x) {
  x = Math.max(0, Math.min(W - 1, x | 0));
  for (let y = 0; y < H; y++) if (solid[sIdx(x, y)]) return y;
  return H;
}
function buildTerrain() {
  solid.fill(0);
  tctx.globalCompositeOperation = 'source-over';
  tctx.clearRect(0, 0, W, H);
  // rolling hills: layered sines + randomness (deterministic-ish per match)
  const p1 = Math.random() * 6.28, p2 = Math.random() * 6.28, p3 = Math.random() * 6.28;
  const base = 350 + Math.random() * 40;
  const hgt = new Array(W);
  for (let x = 0; x < W; x++) {
    hgt[x] = base + Math.sin(x * 0.008 + p1) * 55 + Math.sin(x * 0.021 + p2) * 22 + Math.sin(x * 0.05 + p3) * 8;
    hgt[x] = Math.max(150, Math.min(470, hgt[x]));
  }
  for (let x = 0; x < W; x++) { const y0 = hgt[x] | 0; for (let y = y0; y < H; y++) solid[sIdx(x, y)] = 1; }
  // one floating island for vertical play
  const iw = 150 + (Math.random() * 60 | 0), ix = 200 + (Math.random() * (W - 400 - iw) | 0), iy = 170 + (Math.random() * 60 | 0), ih = 26;
  for (let x = ix; x < ix + iw; x++) for (let y = iy; y < iy + ih; y++) if (x >= 0 && x < W && y >= 0 && y < H) solid[sIdx(x, y)] = 1;
  // paint
  tctx.fillStyle = '#6b4a2f';
  const img = tctx.createImageData(W, H);
  const dd = img.data;
  let seed = 1234567;
  const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!solid[sIdx(x, y)]) continue;
      const i = (y * W + x) * 4;
      const top = y === 0 || !solid[sIdx(x, y - 1)];
      const nearTop = top || (y > 1 && !solid[sIdx(x, y - 2)] && rnd() < 0.7) || (y > 2 && !solid[sIdx(x, y - 3)] && rnd() < 0.3);
      if (nearTop) { dd[i] = 70; dd[i + 1] = 194; dd[i + 2] = 90; }
      else {
        const v = rnd();
        if (v < 0.12) { dd[i] = 58; dd[i + 1] = 38; dd[i + 2] = 22; }
        else if (v < 0.2) { dd[i] = 130; dd[i + 1] = 92; dd[i + 2] = 55; }
        else { dd[i] = 107; dd[i + 1] = 74; dd[i + 2] = 47; }
      }
      dd[i + 3] = 255;
    }
  }
  tctx.putImageData(img, 0, 0);
}
function carve(x, y, r) {
  const r2 = r * r;
  for (let yy = Math.max(0, (y - r) | 0); yy <= Math.min(H - 1, (y + r) | 0); yy++) {
    for (let xx = Math.max(0, (x - r) | 0); xx <= Math.min(W - 1, (x + r) | 0); xx++) {
      const dx = xx - x, dy = yy - y;
      if (dx * dx + dy * dy <= r2) solid[sIdx(xx, yy)] = 0;
    }
  }
  tctx.globalCompositeOperation = 'destination-out';
  tctx.beginPath(); tctx.arc(x, y, r, 0, 6.2832); tctx.fill();
  tctx.globalCompositeOperation = 'source-over';
}

// ---------- game state ----------
const WEAPONS = [
  { name: 'Rifle', cd: 11, color: '#ffd54a' },
  { name: 'Scatter', cd: 48, color: '#ff9d4a' },
  { name: 'Lobber', cd: 60, color: '#7dff6a' },
];
let worms = [], bullets = [], grenades = [], parts = [], crates = [], floaters = [];
let shake = 0, state = 'menu', mode = 'ai', frames = 0, crateTimer = 0, over = false;

function spawnPoints() {
  const xs = [W * 0.15, W * 0.38, W * 0.62, W * 0.85].sort(() => Math.random() - 0.5);
  return xs.map(x => {
    const y = surfaceY(x | 0);
    carve(x, y - 20, 26);
    return { x, y: y - 26 };
  });
}
function makeWorm(name, color, x, y) {
  return {
    name, color, x, y, vx: 0, vy: 0, w: 16, h: 22,
    dir: x < W / 2 ? 1 : -1, aim: x < W / 2 ? -0.15 : Math.PI + 0.15,
    hp: 100, lives: 5, cd: 0, weapon: 0, fuel: 100, onGround: false,
    dead: false, respawn: 0, invuln: 150, aimOff: 0, aiT: 0, aiMove: 0, aiJump: 0,
  };
}
function startGame() {
  audio();
  mode = modeSel.value;
  buildTerrain();
  const pts = spawnPoints();
  // force the two worms far apart so neither gets spawn-killed point-blank
  pts.sort((a, b) => a.x - b.x);
  const pair = [pts[0], pts[pts.length - 1]];
  if (Math.random() < 0.5) pair.reverse();
  worms = [makeWorm('P1', '#4aa8ff', pair[0].x, pair[0].y), makeWorm(mode === 'ai' ? 'CPU' : 'P2', '#ff5b5b', pair[1].x, pair[1].y)];
  if (mode === 'ai') worms[1].weapon = 0;
  bullets = []; grenades = []; parts = []; crates = []; floaters = [];
  shake = 0; frames = 0; crateTimer = 60 * 10; over = false; state = 'play';
  menuEl.hidden = true; overEl.hidden = true;
  nameEls[0].textContent = 'P1'; nameEls[1].textContent = mode === 'ai' ? 'CPU' : 'P2';
  statusEl.textContent = mode === 'ai' ? 'vs CPU' : 'local versus';
  beep(660, 0.12, 'square', 0.08);
}
function endGame(winner) {
  over = true; state = 'over';
  overTitle.textContent = winner.name + ' wins!';
  const secs = (frames / 60) | 0;
  overSub.textContent = `${winner.name} takes the arena in ${secs}s · ${winner.lives} ${winner.lives === 1 ? 'life' : 'lives'} left. Press Restart (R).`;
  overEl.hidden = false;
  beep(880, 0.3, 'sawtooth', 0.08);
}

// ---------- input ----------
const keys = Object.create(null);
const mouse = { x: W / 2, y: H / 2, down: false };
addEventListener('keydown', e => {
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
  keys[e.code] = true;
  if (e.code === 'Digit1') worms[0] && (worms[0].weapon = 0);
  if (e.code === 'Digit2') worms[0] && (worms[0].weapon = 1);
  if (e.code === 'Digit3') worms[0] && (worms[0].weapon = 2);
  if (e.code === 'Comma' && worms[1]) worms[1].weapon = ((worms[1].weapon + 1) % 3);
  if (e.code === 'KeyR' && state === 'over') startGame();
  if (e.code === 'Enter' && state === 'menu') startGame();
});
addEventListener('keyup', e => { keys[e.code] = false; });
function canvasPos(e) {
  const r = canvas.getBoundingClientRect();
  const cx = (e.touches ? e.touches[0].clientX : e.clientX), cy = (e.touches ? e.touches[0].clientY : e.clientY);
  return { x: (cx - r.left) * (W / r.width), y: (cy - r.top) * (H / r.height) };
}
canvas.addEventListener('mousemove', e => { const p = canvasPos(e); mouse.x = p.x; mouse.y = p.y; });
canvas.addEventListener('mousedown', e => { audio(); const p = canvasPos(e); mouse.x = p.x; mouse.y = p.y; mouse.down = true; });
addEventListener('mouseup', () => { mouse.down = false; });
canvas.addEventListener('touchstart', e => { audio(); const p = canvasPos(e); mouse.x = p.x; mouse.y = p.y; mouse.down = true; e.preventDefault(); }, { passive: false });
canvas.addEventListener('touchmove', e => { const p = canvasPos(e); mouse.x = p.x; mouse.y = p.y; e.preventDefault(); }, { passive: false });
canvas.addEventListener('touchend', () => { mouse.down = false; });
playBtn.addEventListener('click', startGame);
againBtn.addEventListener('click', startGame);
helpBtn.addEventListener('click', () => { helpEl.hidden = !helpEl.hidden; });

// ---------- physics helpers ----------
function boxHits(x, y, w, h) {
  for (let px = x; px <= x + w; px += 4) { if (isSolid(px, y) || isSolid(px, y + h)) return true; }
  for (let py = y; py <= y + h; py += 4) { if (isSolid(x, py) || isSolid(x + w, py)) return true; }
  return false;
}
function moveBody(b) {
  const nx = b.x + b.vx;
  if (!boxHits(nx - b.w / 2, b.y - b.h, b.w, b.h)) b.x = nx;
  else { b.vx = 0; b.hitWall = true; }
  b.x = Math.max(b.w / 2, Math.min(W - b.w / 2, b.x));
  const ny = b.y + b.vy;
  b.onGround = false;
  if (!boxHits(b.x - b.w / 2, ny - b.h, b.w, b.h)) b.y = ny;
  else {
    if (b.vy > 7) hurt(b, ((b.vy - 7) * 4) | 0, null);
    if (b.vy > 0) b.onGround = true;
    b.vy = 0;
  }
  if (b.y > H - 2) { b.y = H - 2; b.vy = 0; b.onGround = true; }
}
function losClear(x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const n = Math.ceil(Math.hypot(dx, dy) / 8);
  let blocked = 0;
  for (let i = 1; i < n; i++) if (isSolid(x1 + dx * i / n, y1 + dy * i / n)) { blocked++; if (blocked > 3) return false; }
  return blocked <= 3;
}
function hurt(w, dmg, from) {
  if (w.dead || w.invuln > 0 || over) return;
  w.hp -= dmg;
  blood(w.x, w.y - 10, Math.min(14, 4 + (dmg | 0)));
  if (w.hp <= 0) kill(w, from);
}
function kill(w, from) {
  w.hp = 0; w.dead = true; w.lives--; w.respawn = 100;
  explodeVisual(w.x, w.y - 10, 26, false);
  boomSound(true);
  floaters.push({ x: w.x, y: w.y - 34, t: 90, txt: (from && from !== w ? from.name + ' +1' : 'wasted') });
  const other = worms[1 - worms.indexOf(w)];
  if (w.lives <= 0) endGame(other && !other.dead ? other : (from || worms[0]));
  else beep(220, 0.25, 'sawtooth', 0.09);
}

// ---------- combat ----------
function shoot(w) {
  if (w.cd > 0 || w.dead) return;
  const a = w.aim;
  const mx = w.x + Math.cos(a) * 16, my = (w.y - 12) + Math.sin(a) * 16;
  if (w.weapon === 0) {
    bullets.push({ x: mx, y: my, vx: Math.cos(a) * 11, vy: Math.sin(a) * 11, life: 70, dmg: 12, owner: w, r: 2.5, grav: 0.02, blast: 10 });
    w.cd = WEAPONS[0].cd; w.vx -= Math.cos(a) * 0.5;
    beep(900 + Math.random() * 200, 0.07, 'square', 0.05);
  } else if (w.weapon === 1) {
    for (let i = 0; i < 6; i++) {
      const sa = a + (Math.random() - 0.5) * 0.45;
      bullets.push({ x: mx, y: my, vx: Math.cos(sa) * (8 + Math.random() * 2.5), vy: Math.sin(sa) * (8 + Math.random() * 2.5), life: 30, dmg: 7, owner: w, r: 2, grav: 0.05, blast: 7 });
    }
    w.cd = WEAPONS[1].cd; w.vx -= Math.cos(a) * 1.6;
    beep(300, 0.14, 'sawtooth', 0.08);
  } else {
    grenades.push({ x: mx, y: my, vx: Math.cos(a) * 6.5, vy: Math.sin(a) * 6.5 - 1.5, owner: w, fuse: 135, r: 5, minFuse: 25, bounced: false });
    w.cd = WEAPONS[2].cd;
    beep(420, 0.12, 'sine', 0.08);
  }
  parts.push({ x: mx, y: my, vx: Math.cos(a) * 2, vy: Math.sin(a) * 2, life: 6, max: 6, c: '#ffea80', r: 4 });
}
function explodeVisual(x, y, r, damageTerrain) {
  if (damageTerrain !== false) carve(x, y, r);
  shake = Math.min(14, shake + r * 0.22);
  for (let i = 0; i < r * 1.4; i++) {
    const a = Math.random() * 6.28, s = 1 + Math.random() * 4;
    parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, life: 25 + Math.random() * 25, max: 50, r: 2 + Math.random() * 3, c: ['#ffd54a', '#ff9d4a', '#8a5a33', '#555'][i % 4] });
  }
  parts.push({ x, y, vx: 0, vy: 0, life: 10, max: 10, r, c: '#fff2c0', ring: true });
  boomSound(r > 30);
}
function explode(x, y, r, maxDmg, owner) {
  explodeVisual(x, y, r, true);
  for (const w of worms) {
    if (w.dead) continue;
    const d = Math.hypot(w.x - x, (w.y - 11) - y);
    if (d < r + 14) {
      const f = 1 - d / (r + 16);
      hurt(w, maxDmg * f, owner);
      w.vx += (w.x - x) / (d + 6) * f * 9;
      w.vy += ((w.y - 11 - y) / (d + 6)) * f * 9 - f * 3;
    }
  }
}
function blood(x, y, n) {
  for (let i = 0; i < n; i++) parts.push({ x, y, vx: (Math.random() - 0.5) * 4, vy: -Math.random() * 3, life: 30, max: 30, r: 2, c: '#c22' });
}

// ---------- AI ----------
function aiControl(w, foe) {
  w.aiT--;
  if (w.aiT <= 0) {
    w.aiT = 14;
    const dx = foe.x - w.x;
    w.aiMove = Math.abs(dx) > 26 ? Math.sign(dx) : 0;
    const dy = foe.y - w.y;
    if (Math.abs(dx) < 260 && Math.abs(dy) < 160) {
      w.weapon = Math.abs(dx) < 110 ? 1 : (Math.random() < 0.35 ? 2 : 0);
    } else w.weapon = Math.random() < 0.5 ? 2 : 0;
    // keep a little standoff distance with rifle/lobber instead of face-hugging
    if (w.weapon !== 1 && Math.abs(dx) < 70) w.aiMove = -Math.sign(dx) || (Math.random() < 0.5 ? 1 : -1);
    w.aiJump = 0;
    if (w.hitWall && w.onGround) w.aiJump = 1;
    else if (Math.random() < 0.12 && w.onGround) w.aiJump = 1;
    // jet if foe is well above or we are stuck in a hole
    w.aiJet = (dy < -70 && w.fuel > 25 && Math.abs(dx) < 220) || (w.hitWall && !w.onGround && w.fuel > 10);
  }
  const range = Math.hypot(foe.x - w.x, foe.y - w.y);
  const want = Math.atan2((foe.y - 12) - (w.y - 12), foe.x - w.x);
  let d = want - w.aim;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  w.aim += Math.max(-0.09, Math.min(0.09, d)) + (Math.random() - 0.5) * 0.02;
  if (range < 540 && !foe.dead && foe.invuln <= 0 && losClear(w.x, w.y - 12, foe.x, foe.y - 12)) {
    if (w.cd <= 0) shoot(w);
  }
}

// ---------- update ----------
function updateWorm(w, foe, ctl) {
  if (w.dead) { w.respawn--; if (w.respawn <= 0 && !over) respawn(w); return; }
  if (w.invuln > 0) w.invuln--;
  if (w.cd > 0) w.cd--;
  w.hitWall = false;
  // aim
  if (ctl === 'p1') {
    w.aim = Math.atan2(mouse.y - (w.y - 12), mouse.x - w.x);
    w.dir = Math.cos(w.aim) >= 0 ? 1 : -1;
  } else if (ctl === 'p2') {
    const want = Math.atan2((foe.y - 12) - (w.y - 12), foe.x - w.x);
    w.aim = want + w.aimOff;
    if (keys.ArrowUp) w.aimOff = Math.max(-0.6, w.aimOff - 0.03);
    if (keys.ArrowDown) w.aimOff = Math.min(0.6, w.aimOff + 0.03);
    w.dir = Math.cos(w.aim) >= 0 ? 1 : -1;
  }
  // horizontal
  let mv = 0;
  if (ctl === 'p1') mv = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0);
  else if (ctl === 'p2') mv = (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0);
  else if (ctl === 'ai') mv = w.aiMove || 0;
  w.vx += mv * (w.onGround ? 0.7 : 0.4);
  w.vx *= w.onGround ? 0.78 : 0.96;
  w.vx = Math.max(-3.2, Math.min(3.2, w.vx));
  if (mv !== 0) w.dir = mv;
  // jump
  const jumpKey = ctl === 'p1' ? keys.KeyW : ctl === 'p2' ? keys.Period : w.aiJump;
  if (jumpKey && w.onGround) { w.vy = -7.6; w.onGround = false; beep(300 + Math.random() * 80, 0.08, 'sine', 0.04); if (ctl === 'ai') w.aiJump = 0; }
  // jetpack
  const jetKey = ctl === 'p1' ? keys.KeyS : ctl === 'p2' ? keys.ArrowDown : w.aiJet;
  if (jetKey && w.fuel > 0 && !w.onGround) {
    w.vy -= 0.5; w.fuel = Math.max(0, w.fuel - 0.9);
    w.vx += mv * 0.12;
    if ((frames & 1) === 0) parts.push({ x: w.x + (Math.random() - 0.5) * 8, y: w.y, vx: (Math.random() - 0.5), vy: 2 + Math.random(), life: 14, max: 14, r: 2.5, c: '#ffb14a' });
  } else if (w.onGround) w.fuel = Math.min(100, w.fuel + 0.35);
  // gravity
  w.vy = Math.min(9.5, w.vy + 0.45);
  moveBody(w);
  // shoot
  if (ctl === 'p1' && (keys.Space || mouse.down)) shoot(w);
  if (ctl === 'p2' && (keys.Enter || keys.Slash)) shoot(w);
  if (ctl === 'ai') aiControl(w, foe);
  // crates
  for (const c of crates) {
    if (!c.taken && Math.hypot(w.x - c.x, (w.y - 11) - c.y) < 24) {
      c.taken = true;
      w.hp = Math.min(100, w.hp + 30); w.fuel = Math.min(100, w.fuel + 60);
      floaters.push({ x: w.x, y: w.y - 40, t: 80, txt: '+HP +FUEL' });
      beep(520, 0.15, 'sine', 0.08);
    }
  }
}
function respawn(w) {
  const x = W * (0.1 + Math.random() * 0.8);
  const y = surfaceY(x | 0);
  carve(x, y - 20, 26);
  w.x = x; w.y = y - 26; w.vx = 0; w.vy = 0; w.hp = 100; w.fuel = 100; w.dead = false; w.invuln = 150; w.cd = 0;
}
function update() {
  frames++;
  const c0 = mode === 'ai' ? 'p1' : 'p1';
  const c1 = mode === 'ai' ? 'ai' : 'p2';
  updateWorm(worms[0], worms[1], c0);
  updateWorm(worms[1], worms[0], c1);
  // bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.vy += b.grav; b.x += b.vx; b.y += b.vy; b.life--;
    let hit = b.life <= 0 || b.x < 0 || b.x >= W || b.y >= H || isSolid(b.x, b.y);
    if (!hit) for (const w of worms) {
      if (w.dead || w.invuln > 0) continue;
      if (Math.abs(b.x - w.x) < 10 && b.y > w.y - w.h - 2 && b.y < w.y + 2) { hit = true; break; }
    }
    if (hit) {
      explode(b.x, b.y, b.blast, b.dmg, b.owner);
      bullets.splice(i, 1);
    }
  }
  // grenades
  for (let i = grenades.length - 1; i >= 0; i--) {
    const g = grenades[i];
    g.vy = Math.min(9, g.vy + 0.3); g.fuse--;
    if (g.bounced && g.fuse > g.minFuse) g.fuse = g.minFuse;
    const nx = g.x + g.vx, ny = g.y + g.vy;
    if (isSolid(nx, g.y)) { g.vx *= -0.55; g.bounced = true; } else g.x = nx;
    if (isSolid(g.x, ny)) { g.vy *= -0.55; g.vx *= 0.8; g.bounced = true; } else g.y = ny;
    if (g.fuse <= 0 || g.y >= H - 1) {
      explode(g.x, Math.min(g.y, H - 4), 54, 48, g.owner);
      grenades.splice(i, 1);
    }
  }
  // crates
  crateTimer--;
  if (crateTimer <= 0 && crates.filter(c => !c.taken).length < 2) {
    crateTimer = 60 * 14;
    crates.push({ x: 60 + Math.random() * (W - 120), y: 20, vy: 0, taken: false });
  }
  for (const c of crates) {
    if (c.taken) continue;
    c.vy = Math.min(7, c.vy + 0.35);
    if (!isSolid(c.x, c.y + c.vy + 9)) c.y += c.vy;
    else { c.vy = 0; }
  }
  // particles / floaters
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.life--;
    if (p.ring) continue;
    p.vy += 0.12; p.x += p.vx; p.y += p.vy;
    if (p.life <= 0) parts.splice(i, 1);
  }
  if (parts.length > 900) parts.splice(0, parts.length - 900);
  for (let i = floaters.length - 1; i >= 0; i--) { floaters[i].t--; floaters[i].y -= 0.4; if (floaters[i].t <= 0) floaters.splice(i, 1); }
  if (shake > 0) shake *= 0.88;
  // HUD
  hpEls[0].textContent = Math.max(0, Math.ceil(worms[0].hp));
  hpEls[1].textContent = Math.max(0, Math.ceil(worms[1].hp));
  livesEls[0].textContent = '❤×' + worms[0].lives;
  livesEls[1].textContent = '❤×' + worms[1].lives;
  const s = (frames / 60) | 0;
  timerEl.textContent = ((s / 60) | 0) + ':' + String(s % 60).padStart(2, '0');
}

// ---------- render ----------
function drawWorm(w) {
  if (w.dead) return;
  if (w.invuln > 0 && ((frames >> 2) & 1)) return; // blink
  ctx.save();
  ctx.translate(w.x, w.y);
  // jet flame
  // body
  ctx.fillStyle = w.color;
  ctx.beginPath();
  ctx.ellipse(0, -11, 9, 11, 0, 0, 6.2832);
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,.25)';
  ctx.fillRect(-9, -4, 18, 4);
  // eye
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(w.dir * 4, -15, 4.4, 0, 6.2832); ctx.fill();
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(w.dir * 5.6, -15, 2, 0, 6.2832); ctx.fill();
  // gun
  const ga = Math.atan2(Math.sin(w.aim), Math.cos(w.aim)) - 0; // world angle
  ctx.rotate(0); ctx.restore();
  ctx.save();
  ctx.strokeStyle = '#222'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(w.x, w.y - 12);
  ctx.lineTo(w.x + Math.cos(w.aim) * 20, (w.y - 12) + Math.sin(w.aim) * 20);
  ctx.stroke();
  ctx.fillStyle = WEAPONS[w.weapon].color;
  ctx.beginPath(); ctx.arc(w.x + Math.cos(w.aim) * 20, (w.y - 12) + Math.sin(w.aim) * 20, 3.4, 0, 6.2832); ctx.fill();
  ctx.restore();
  // hp bar + name + fuel
  ctx.fillStyle = 'rgba(0,0,0,.55)';
  ctx.fillRect(w.x - 16, w.y - 34, 32, 5);
  ctx.fillStyle = w.hp > 50 ? '#4ade80' : w.hp > 25 ? '#facc15' : '#ef4444';
  ctx.fillRect(w.x - 16, w.y - 34, 32 * Math.max(0, w.hp / 100), 5);
  ctx.fillStyle = '#fff'; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
  ctx.fillText(w.name + ' · ' + WEAPONS[w.weapon].name, w.x, w.y - 38);
  if (w.fuel < 99) {
    ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(w.x - 16, w.y - 29, 32, 2.5);
    ctx.fillStyle = '#38bdf8'; ctx.fillRect(w.x - 16, w.y - 29, 32 * w.fuel / 100, 2.5);
  }
}
function render() {
  ctx.save();
  if (shake > 0.4) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#0d1530'); g.addColorStop(0.55, '#182a52'); g.addColorStop(1, '#0b0e17');
  ctx.fillStyle = g; ctx.fillRect(-20, -20, W + 40, H + 40);
  // stars
  ctx.fillStyle = 'rgba(255,255,255,.5)';
  for (let i = 0; i < 60; i++) {
    const x = (i * 173) % W, y = (i * 97) % 200;
    ctx.fillRect(x, y, 1.5, 1.5);
  }
  // moon
  ctx.fillStyle = '#e8ecf5'; ctx.beginPath(); ctx.arc(830, 70, 26, 0, 6.2832); ctx.fill();
  ctx.fillStyle = '#0d1530'; ctx.beginPath(); ctx.arc(820, 62, 22, 0, 6.2832); ctx.fill();
  ctx.drawImage(terrain, 0, 0);
  // crates
  for (const c of crates) {
    if (c.taken) continue;
    ctx.fillStyle = '#1f7a34'; ctx.fillRect(c.x - 9, c.y - 9, 18, 18);
    ctx.strokeStyle = '#7dff6a'; ctx.lineWidth = 2; ctx.strokeRect(c.x - 9, c.y - 9, 18, 18);
    ctx.fillStyle = '#fff'; ctx.fillRect(c.x - 2, c.y - 6, 4, 12); ctx.fillRect(c.x - 6, c.y - 2, 12, 4);
  }
  // grenades
  for (const gr of grenades) {
    ctx.fillStyle = '#1c1c1c'; ctx.beginPath(); ctx.arc(gr.x, gr.y, 5, 0, 6.2832); ctx.fill();
    ctx.fillStyle = (gr.fuse >> 3) & 1 ? '#ff5252' : '#fff'; ctx.beginPath(); ctx.arc(gr.x, gr.y, 2, 0, 6.2832); ctx.fill();
  }
  // bullets
  for (const b of bullets) {
    ctx.fillStyle = '#ffe27a'; ctx.beginPath(); ctx.arc(b.x, b.y, b.r + 1, 0, 6.2832); ctx.fill();
    ctx.strokeStyle = 'rgba(255,220,100,.5)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - b.vx * 2, b.y - b.vy * 2); ctx.stroke();
  }
  for (const w of worms) drawWorm(w);
  // particles
  for (const p of parts) {
    const a = Math.max(0, p.life / p.max);
    if (p.ring) {
      ctx.strokeStyle = `rgba(255,240,190,${a})`; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1.4 - a * 0.4), 0, 6.2832); ctx.stroke();
    } else {
      ctx.globalAlpha = a; ctx.fillStyle = p.c;
      ctx.fillRect(p.x - p.r / 2, p.y - p.r / 2, p.r, p.r);
      ctx.globalAlpha = 1;
    }
  }
  ctx.fillStyle = '#fff'; ctx.font = 'bold 13px system-ui'; ctx.textAlign = 'center';
  for (const f of floaters) { ctx.globalAlpha = Math.min(1, f.t / 30); ctx.fillText(f.txt, f.x, f.y); ctx.globalAlpha = 1; }
  ctx.restore();
  // aim line for P1
  if (state === 'play' && !worms[0].dead) {
    ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 1; ctx.setLineDash([4, 6]);
    ctx.beginPath(); ctx.moveTo(worms[0].x, worms[0].y - 12);
    ctx.lineTo(worms[0].x + Math.cos(worms[0].aim) * 70, (worms[0].y - 12) + Math.sin(worms[0].aim) * 70);
    ctx.stroke(); ctx.setLineDash([]);
  }
}

// ---------- main loop ----------
buildTerrain(); // backdrop behind menu so first paint is never blank
render();
let last = performance.now(), acc = 0;
function frame(now) {
  requestAnimationFrame(frame);
  acc += Math.min(100, now - last); last = now;
  while (acc >= 1000 / 60) {
    acc -= 1000 / 60;
    if (state === 'play' && !over) update();
  }
  if (state !== 'menu' || (frames & 1) === 0) { if (state === 'play' || state === 'over') render(); }
}
requestAnimationFrame(frame);

// expose for automated checks
window.__game = { get worms() { return worms; }, get state() { return state; }, startGame, explode };
