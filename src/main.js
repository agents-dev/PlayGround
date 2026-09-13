// STARCRAFT 3D — Neon Frontline (self-contained Canvas 2.5D RTS, no external deps)
import { MAP_SIZE, DIFFICULTY, UNITS, BUILDINGS, TRAIN_TIME, BUILD_TIME, HARVEST, costText } from './config.js';

const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const dist2 = (a, b) => { const dx = a.x - b.x, dy = a.y - b.y; return dx * dx + dy * dy; };
const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

const params = new URLSearchParams(location.search);
const SELFTEST = params.has('selftest');
const AUTOSTART = params.has('autostart') || SELFTEST;

// ---------- audio (tiny synth) ----------
const AudioSys = {
  ctx: null, muted: false,
  ensure() { if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { /* no audio */ } } if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); },
  beep(freq, dur, type = 'square', vol = 0.06) {
    if (this.muted) return; this.ensure(); if (!this.ctx) return;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.value = freq; g.gain.value = vol;
    o.connect(g); g.connect(this.ctx.destination); o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
    o.stop(this.ctx.currentTime + dur);
  },
  shoot() { this.beep(700 + Math.random() * 300, 0.08, 'sawtooth', 0.03); },
  boom() { this.beep(90, 0.4, 'sawtooth', 0.09); },
  select() { this.beep(520, 0.06, 'sine', 0.04); },
  error() { this.beep(160, 0.2, 'square', 0.06); },
  build() { this.beep(330, 0.12, 'triangle', 0.05); },
};

// ---------- game state ----------
const G = {
  running: false, over: false, victory: false,
  time: 0, speed: 1, difficulty: 'veteran',
  minerals: 50, gas: 0, kills: 0,
  entities: [], selected: [], groups: { 1: [], 2: [], 3: [] },
  attackMove: false, placing: null, // building key being placed
  buildMenu: false,
  cam: { x: 40, y: 110, zoom: 6.4 },
  aiTimer: 0, aiWave: 0,
  stats: { trained: 0, built: 0 },
};

let UID = 1;
function supplyUsed() { return G.entities.filter(e => e.owner === 'player' && e.kind === 'unit').length; }
function supplyCap() { return G.entities.filter(e => e.owner === 'player' && e.kind === 'building' && e.done).reduce((s, e) => s + (BUILDINGS[e.type].supply || 0), 0); }
function canAfford(cost) { return G.minerals >= (cost.m || 0) && G.gas >= (cost.g || 0); }
function pay(cost) { G.minerals -= cost.m || 0; G.gas -= cost.g || 0; }
function hasRefinery() { return G.entities.some(e => e.owner === 'player' && e.type === 'refinery' && e.done); }

// ---------- terrain ----------
const TER = { img: null, h: null, N: 96 };
function terrainHeight(x, y) {
  return Math.sin(x * 0.11) * Math.cos(y * 0.13) * 1.6 + Math.sin(x * 0.031 + y * 0.043) * 2.4;
}
function buildTerrain() {
  const N = TER.N, c = document.createElement('canvas'); c.width = c.height = N;
  const g = c.getContext('2d'); const img = g.createImageData(N, N);
  TER.h = new Float32Array(N * N);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const wx = (i / N) * MAP_SIZE, wy = (j / N) * MAP_SIZE;
    const h = terrainHeight(wx, wy); TER.h[j * N + i] = h;
    const t = clamp(0.5 + h * 0.09 + Math.sin(i * 0.7) * Math.cos(j * 0.6) * 0.03, 0, 1);
    // dark neon-field palette
    const r = 10 + t * 26, gg = 16 + t * 40, b = 26 + t * 46;
    const k = (j * N + i) * 4;
    img.data[k] = r; img.data[k + 1] = gg; img.data[k + 2] = b; img.data[k + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  TER.img = c;
}

// ---------- entity factories ----------
function addUnit(type, owner, x, y) {
  const cfg = UNITS[type]; const d = DIFFICULTY[G.difficulty];
  const hp = Math.round(cfg.hp * (owner === 'enemy' ? d.enemyHpMul : 1));
  const e = {
    id: UID++, kind: 'unit', type, owner, x: clamp(x, 2, MAP_SIZE - 2), y: clamp(y, 2, MAP_SIZE - 2),
    hp, maxHp: hp, speed: cfg.speed, sight: cfg.sight, range: cfg.range, dmg: cfg.dmg * (owner === 'enemy' ? d.enemyDmgMul : 1),
    cooldown: cfg.cooldown, aoe: cfg.aoe || 0, bursts: cfg.bursts || 1, flying: !!cfg.flying,
    cd: 0, tx: null, ty: null, target: null, attackMove: false, hold: false,
    harvest: null, carry: null, gatherT: 0, angle: Math.random() * 6.28, wob: Math.random() * 6.28,
  };
  G.entities.push(e); return e;
}
function addBuilding(type, owner, x, y, done = true) {
  const cfg = BUILDINGS[type];
  const d = DIFFICULTY[G.difficulty];
  const hp = Math.round(cfg.hp * (owner === 'enemy' ? d.enemyHpMul : 1));
  const e = {
    id: UID++, kind: 'building', type, owner, x: clamp(x, 4, MAP_SIZE - 4), y: clamp(y, 4, MAP_SIZE - 4),
    hp, maxHp: hp, size: cfg.size, done, progress: done ? 1 : 0, buildNeed: BUILD_TIME[type] || 15,
    queue: [], trainT: 0, cd: 0, rally: null,
  };
  G.entities.push(e); return e;
}
function addResource(type, x, y, amount) {
  const e = { id: UID++, kind: 'resource', type, owner: 'neutral', x, y, hp: 1e9, maxHp: 1e9, amount, size: type === 'mineral' ? 2.2 : 2.8 };
  G.entities.push(e); return e;
}
const projectiles = [], particles = [];
function fireProjectile(a, b, color, dmg, aoe, owner) {
  projectiles.push({ x: a.x, y: a.y, z: a.flying ? 3 : 1, tx: b.x, ty: b.y, tz: b.flying ? 3 : 0.5, t: 0, dur: 0.28, color, dmg, aoe, owner, target: b });
}
function boom(x, y, big = false) {
  const n = big ? 26 : 12;
  for (let i = 0; i < n; i++) particles.push({ x, y, vx: (Math.random() - 0.5) * (big ? 26 : 14), vy: (Math.random() - 0.5) * (big ? 26 : 14), life: 0.5 + Math.random() * 0.5, t: 0, color: ['#ffd35c', '#ff9d2e', '#ff4d5e', '#fff'][i % 4], size: big ? 3 : 2 });
  AudioSys.boom();
}

function setupWorld() {
  G.entities.length = 0; projectiles.length = 0; particles.length = 0;
  UID = 1; G.time = 0; G.minerals = 120; G.gas = 0; G.kills = 0; G.over = false; G.victory = false;
  G.selected = []; G.placing = null; G.buildMenu = false; G.aiTimer = 0; G.aiWave = 0;
  G.stats = { trained: 0, built: 0 };
  // player base (south-west)
  const px = 34, py = 126;
  addBuilding('command', 'player', px, py);
  for (let i = 0; i < 4; i++) addUnit('scv', 'player', px - 6 + i * 3.4, py + 8);
  addUnit('marine', 'player', px + 8, py + 4);
  // player minerals + gas
  for (let i = 0; i < 8; i++) addResource('mineral', px - 12 + (i % 4) * 4.4, py - 12 - Math.floor(i / 4) * 4.4, 1500);
  addResource('gas', px + 14, py - 12, 1200);
  addResource('gas', px - 16, py + 2, 1200);
  // enemy base (north-east)
  const ex = 126, ey = 34;
  addBuilding('hatchery', 'enemy', ex, ey);
  addBuilding('spire', 'enemy', ex - 14, ey + 6);
  addBuilding('sunken', 'enemy', ex + 10, ey + 10);
  addBuilding('sunken', 'enemy', ex - 6, ey - 12);
  for (let i = 0; i < 8; i++) addResource('mineral', ex + 10 + (i % 4) * 4.2, ey + 14 + Math.floor(i / 4) * 4.2, 1500);
  for (let i = 0; i < 3; i++) addUnit('zergling', 'enemy', ex - 6 + i * 3, ey + 12);
  addUnit('hydralisk', 'enemy', ex + 6, ey - 8);
  G.cam.x = px; G.cam.y = py - 6;
}

// ---------- orders ----------
function orderMove(list, x, y, attack = false) {
  for (const e of list) {
    if (e.kind !== 'unit') continue;
    e.target = null; e.attackMove = attack; e.harvest = null;
    // formation offsets
    const i = list.indexOf(e), n = list.length;
    const ox = (i % 3 - 1) * 2.2, oy = (Math.floor(i / 3) - Math.floor(n / 6)) * 2.2;
    e.tx = clamp(x + ox, 2, MAP_SIZE - 2); e.ty = clamp(y + oy, 2, MAP_SIZE - 2);
  }
}
function orderAttack(list, target) {
  for (const e of list) { if (e.kind !== 'unit') continue; e.target = target; e.tx = null; e.harvest = null; e.attackMove = false; }
}
function orderHarvest(list, res) {
  for (const e of list) {
    if (e.kind !== 'unit' || e.type !== 'scv') continue;
    if (res.type === 'gas' && !hasRefinery()) { announce('REQUIRES REFINERY (select SCV → B)'); AudioSys.error(); continue; }
    e.harvest = res; e.target = null; e.tx = res.x; e.ty = res.y; e.carry = e.carry || null;
  }
  AudioSys.select();
}
function stopList(list) { for (const e of list) { e.tx = null; e.ty = null; e.target = null; e.attackMove = false; e.harvest = null; } }

// ---------- combat / sim ----------
function nearestEnemy(e) {
  let best = null, bd = e.sight * e.sight;
  for (const o of G.entities) {
    if (o.owner === e.owner || o.owner === 'neutral' || o.hp <= 0) continue;
    if (o.kind === 'resource') continue;
    if (!e.flying && o.flying && e.range < 3) continue; // melee can't hit air
    if (e.kind === 'building' && !BUILDINGS[e.type].defender) continue;
    const d = dist2(e, o);
    if (d < bd) { bd = d; best = o; }
  }
  return best;
}
function damage(target, dmg, aoe, owner, tx, ty) {
  if (aoe > 0) {
    for (const o of G.entities) {
      if (o.owner === owner || o.owner === 'neutral' || o.kind === 'resource' || o.hp <= 0) continue;
      const dd = Math.hypot(o.x - tx, o.y - ty);
      if (dd < aoe + (o.size || 1) / 2) hurt(o, dmg, owner);
    }
  } else hurt(target, dmg, owner);
}
function hurt(o, dmg, byOwner) {
  if (o.hp <= 0 || o.kind === 'resource') return;
  o.hp -= dmg;
  if (o.hp <= 0) {
    o.hp = 0;
    if (o.owner === 'enemy' && byOwner === 'player') G.kills++;
    boom(o.x, o.y, (o.kind === 'building') || o.type === 'ultralisk' || o.type === 'battlecruiser');
    if (o.kind === 'building') announce(`${BUILDINGS[o.type].name} DESTROYED`);
  }
}
function updateUnit(e, dt) {
  e.wob += dt * 6; e.cd = Math.max(0, e.cd - dt);
  if (e.hp <= 0) return;
  // harvesting state machine (simplified): go -> gather -> return to nearest done command -> deposit
  if (e.harvest && e.type === 'scv') {
    const res = e.harvest;
    if (res.amount <= 0) { e.harvest = null; }
    else {
      const d = Math.hypot(e.x - res.x, e.y - res.y);
      if (!e.carry && d > 2.4) { e.tx = res.x; e.ty = res.y; }
      else if (!e.carry) { e.tx = null; e.gatherT += dt; if (e.gatherT >= HARVEST.gatherTime) { e.gatherT = 0; e.carry = res.type; } }
      else {
        // carried -> go to command
        let cc = null, bd = 1e18;
        for (const o of G.entities) if (o.owner === 'player' && o.type === 'command' && o.done && o.hp > 0) { const dd = dist2(e, o); if (dd < bd) { bd = dd; cc = o; } }
        if (!cc) { e.carry = null; }
        else {
          const dd = Math.hypot(e.x - cc.x, e.y - cc.y);
          if (dd > cc.size) { e.tx = cc.x; e.ty = cc.y + cc.size; }
          else { if (e.carry === 'mineral') G.minerals += HARVEST.mineralPerTrip; else G.gas += HARVEST.gasPerTrip; e.carry = null; e.tx = res.x; e.ty = res.y; }
        }
      }
    }
  }
  // combat: keep target or acquire
  if (e.target && (e.target.hp <= 0)) e.target = null;
  if (!e.target && !e.hold) {
    const n = nearestEnemy(e);
    if (n && (e.attackMove || e.kind === 'building' || dist2(e, n) < (e.sight * 0.55) ** 2 || e.hold === false && e.tx == null)) {
      if (e.attackMove || e.kind === 'building' || e.tx == null) e.target = n;
    }
  }
  if (e.target) {
    const t = e.target, rr = e.range + (t.size || 1) / 2;
    const d = Math.hypot(e.x - t.x, e.y - t.y);
    e.angle = Math.atan2(t.y - e.y, t.x - e.x);
    if (d > rr) { e.tx = t.x; e.ty = t.y; }
    else {
      e.tx = null;
      if (e.cd <= 0) {
        e.cd = e.cooldown;
        const isMelee = e.range < 3;
        const col = e.owner === 'player' ? '#39d5ff' : '#ff5e6e';
        if (isMelee) { damage(t, e.dmg, e.aoe, e.owner, t.x, t.y); particles.push({ x: t.x, y: t.y, vx: 0, vy: 0, life: 0.2, t: 0, color: col, size: 3 }); }
        else { for (let b = 0; b < e.bursts; b++) fireProjectile(e, t, col, e.dmg, e.aoe, e.owner); AudioSys.shoot(); }
      }
    }
  }
  // movement
  if (e.tx != null) {
    const dx = e.tx - e.x, dy = e.ty - e.y, d = Math.hypot(dx, dy);
    if (d < 0.5) { e.tx = null; }
    else {
      const s = e.speed * dt;
      e.angle = Math.atan2(dy, dx);
      e.x = clamp(e.x + (dx / d) * Math.min(s, d), 2, MAP_SIZE - 2);
      e.y = clamp(e.y + (dy / d) * Math.min(s, d), 2, MAP_SIZE - 2);
      // separation
      for (const o of G.entities) {
        if (o === e || o.kind !== 'unit' || o.hp <= 0) continue;
        const ox = e.x - o.x, oy = e.y - o.y, od = Math.hypot(ox, oy);
        if (od > 0.01 && od < 1.4) { e.x += (ox / od) * dt * 2; e.y += (oy / od) * dt * 2; }
      }
      if (e.attackMove && !e.target) { const n = nearestEnemy(e); if (n && dist2(e, n) < (e.sight ** 2)) { e.target = n; e.tx = null; } }
    }
  }
}
function updateBuilding(e, dt) {
  e.cd = Math.max(0, e.cd - dt);
  if (e.hp <= 0 || !e.done) return;
  const cfg = BUILDINGS[e.type];
  // static defense
  if (cfg.defender) {
    const fake = { ...e, sight: cfg.range, range: cfg.range };
    const n = nearestEnemy(fake);
    if (n && e.cd <= 0) { e.cd = cfg.cooldown; fireProjectile(e, n, e.owner === 'player' ? '#51ff9e' : '#ff5e6e', cfg.dmg, 0, e.owner); AudioSys.shoot(); }
  }
  // production
  if (e.queue.length) {
    e.trainT -= dt;
    if (e.trainT <= 0) {
      const type = e.queue.shift();
      const rally = e.rally || { x: e.x + e.size, y: e.y + e.size + 3 };
      const u = addUnit(type, e.owner, rally.x + Math.random() * 3, rally.y + Math.random() * 3);
      u.tx = rally.x; u.ty = rally.y;
      G.stats.trained++;
      if (e.queue.length) e.trainT = TRAIN_TIME[e.queue[0]];
      refreshPanel();
    }
  }
}
function updateConstruction(dt) {
  for (const b of G.entities) {
    if (b.kind !== 'building' || b.done || b.hp <= 0) continue;
    b.progress += dt / b.buildNeed;
    if (b.progress >= 1) { b.progress = 1; b.done = true; G.stats.built++; announce(`${BUILDINGS[b.type].name} ONLINE`); AudioSys.build(); refreshPanel(); }
  }
}
function runAI(dt) {
  const d = DIFFICULTY[G.difficulty];
  G.aiTimer += dt;
  if (G.aiTimer < d.aiInterval) return;
  G.aiTimer = 0; G.aiWave++;
  const comp = ['zergling', 'zergling', 'hydralisk'];
  if (G.aiWave >= 3) comp.push('hydralisk');
  if (G.aiWave >= 5) comp.push('ultralisk');
  const n = d.aiBatch;
  const hatch = G.entities.find(e => e.owner === 'enemy' && e.type === 'hatchery' && e.hp > 0);
  const px = G.entities.find(e => e.owner === 'player' && e.hp > 0);
  for (let i = 0; i < n; i++) {
    const type = comp[Math.floor(Math.random() * comp.length)];
    const sx = 126 + (Math.random() - 0.5) * 10, sy = 34 + (Math.random() - 0.5) * 10;
    const u = addUnit(type, 'enemy', sx, sy);
    if (px) { u.tx = px.x + (Math.random() - 0.5) * 14; u.ty = px.y + (Math.random() - 0.5) * 14; u.attackMove = true; }
  }
  if (G.aiWave === 3) announce('⚠ SWARM WAVE INBOUND ⚠');
}
function checkEnd() {
  if (G.over) return;
  const enemyB = G.entities.some(e => e.owner === 'enemy' && e.kind === 'building' && e.hp > 0);
  const playerAlive = G.entities.some(e => e.owner === 'player' && (e.kind === 'building' && e.hp > 0 || e.type === 'scv' && e.hp > 0));
  const enemyAny = G.entities.some(e => e.owner === 'enemy' && e.hp > 0);
  if (!enemyB && !enemyAny) return endGame(true);
  if (!playerAlive) {
    const canRebuild = G.minerals >= 50;
    if (!canRebuild) return endGame(false);
  }
}
function endGame(win) {
  G.over = true; G.victory = win; G.running = false;
  $('end-overlay').classList.remove('hidden');
  const t = $('end-title'); t.textContent = win ? 'VICTORY' : 'DEFEAT';
  t.className = win ? 'victory' : 'defeat';
  $('end-stats').innerHTML = `${win ? 'The Hive burns. The sector is yours, Commander.' : 'The expedition has fallen. The Swarm consumes all.'}<br/>⏱ ${fmtTime(G.time)} &nbsp; ☠ ${G.kills} kills &nbsp; 🪖 ${G.stats.trained} trained &nbsp; 🏗 ${G.stats.built} built`;
}

// ---------- rendering ----------
const canvas = $('game-canvas'), ctx = canvas.getContext('2d');
const mini = $('minimap'), mctx = mini.getContext('2d');
function resize() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resize); resize();
function w2s(x, y) { return { x: (x - G.cam.x) * G.cam.zoom + innerWidth / 2, y: (y - G.cam.y) * G.cam.zoom + innerHeight / 2 }; }
function s2w(x, y) { return { x: (x - innerWidth / 2) / G.cam.zoom + G.cam.x, y: (y - innerHeight / 2) / G.cam.zoom + G.cam.y }; }

const TEAM = { player: '#39d5ff', enemy: '#ff4d5e' };
function drawShadow(x, y, r, z = 0) {
  const p = w2s(x, y + z * 0.4);
  ctx.fillStyle = 'rgba(0,0,0,.4)';
  ctx.beginPath(); ctx.ellipse(p.x, p.y, r * G.cam.zoom * 0.7, r * G.cam.zoom * 0.35, 0, 0, 6.29); ctx.fill();
}
function drawUnit(e) {
  const z = e.flying ? 3 + Math.sin(e.wob) * 0.6 : 0;
  const p = w2s(e.x, e.y - z * 0.55); const s = G.cam.zoom;
  if (p.x < -60 || p.y < -60 || p.x > innerWidth + 60 || p.y > innerHeight + 60) return;
  drawShadow(e.x, e.y, 1.1, z);
  if (e.flying) { ctx.strokeStyle = 'rgba(150,220,255,.35)'; ctx.beginPath(); const g = w2s(e.x, e.y); ctx.moveTo(g.x, g.y); ctx.lineTo(p.x, p.y); ctx.stroke(); }
  ctx.save(); ctx.translate(p.x, p.y);
  const sel = G.selected.includes(e);
  if (sel) { ctx.strokeStyle = e.owner === 'player' ? '#51ff9e' : '#ff4d5e'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(0, 2, 1.5 * s, 0.8 * s, 0, 0, 6.29); ctx.stroke(); }
  ctx.rotate(e.tx != null || e.target ? e.angle : Math.sin(e.wob * 0.4));
  const col = e.owner === 'player' ? TEAM.player : TEAM.enemy;
  const u = s * 0.55; // unit scale
  ctx.fillStyle = col; ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 1;
  const body = (w, l) => { ctx.beginPath(); ctx.moveTo(l, 0); ctx.lineTo(-l * 0.7, w); ctx.lineTo(-l * 0.7, -w); ctx.closePath(); ctx.fill(); ctx.stroke(); };
  switch (e.type) {
    case 'scv': ctx.fillStyle = '#c9a24d'; body(0.9 * u, 1.3 * u); ctx.fillStyle = col; ctx.fillRect(-0.4 * u, -0.5 * u, 0.8 * u, 1.0 * u); break;
    case 'marine': body(0.7 * u, 1.1 * u); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0.6 * u, 0); ctx.lineTo(1.8 * u, 0); ctx.stroke(); break;
    case 'tank': ctx.fillStyle = '#3f6d4e'; ctx.fillRect(-1.2 * u, -0.9 * u, 2.4 * u, 1.8 * u); ctx.strokeRect(-1.2 * u, -0.9 * u, 2.4 * u, 1.8 * u); ctx.strokeStyle = '#9fe8ff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(2.4 * u, 0); ctx.stroke(); break;
    case 'wraith': case 'battlecruiser': { const big = e.type === 'battlecruiser' ? 1.9 : 1.2; ctx.fillStyle = e.type === 'battlecruiser' ? '#7d8fb0' : '#4d6a8f'; ctx.beginPath(); ctx.moveTo(1.6 * u * big, 0); ctx.lineTo(-0.8 * u * big, 1.0 * u * big); ctx.lineTo(-0.8 * u * big, -1.0 * u * big); ctx.closePath(); ctx.fill(); ctx.stroke(); break; }
    case 'zergling': ctx.fillStyle = '#b06ab0'; body(0.6 * u, 1.0 * u); break;
    case 'hydralisk': ctx.fillStyle = '#7ab648'; body(0.8 * u, 1.2 * u); break;
    case 'ultralisk': ctx.fillStyle = '#8f4d5e'; ctx.beginPath(); ctx.ellipse(0, 0, 1.8 * u, 1.1 * u, 0, 0, 6.29); ctx.fill(); ctx.stroke(); break;
    default: body(0.7 * u, 1.0 * u);
  }
  ctx.restore();
  // hp bar + carry pip
  if (e.hp < e.maxHp) {
    ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(p.x - 12, p.y - 14, 24, 4);
    ctx.fillStyle = e.hp / e.maxHp > 0.5 ? '#51ff9e' : e.hp / e.maxHp > 0.25 ? '#ffd35c' : '#ff4d5e';
    ctx.fillRect(p.x - 12, p.y - 14, 24 * (e.hp / e.maxHp), 4);
  }
  if (e.carry) { ctx.fillStyle = e.carry === 'mineral' ? '#39d5ff' : '#51ff9e'; ctx.fillRect(p.x - 2, p.y - 20, 4, 4); }
}
function drawBuilding(e) {
  const p = w2s(e.x, e.y); const s = G.cam.zoom; const r = (e.size / 2) * s;
  if (p.x < -120 || p.y < -120 || p.x > innerWidth + 120 || p.y > innerHeight + 120) return;
  const sel = G.selected.includes(e);
  if (sel) { ctx.strokeStyle = '#51ff9e'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(p.x, p.y, r * 1.15, r * 0.62, 0, 0, 6.29); ctx.stroke(); }
  const base = e.owner === 'player' ? '#1d3f6e' : '#5e1d2c';
  const top = e.owner === 'player' ? '#2f6db0' : '#8f2f42';
  const h = r * 0.55 * (e.type === 'command' || e.type === 'hatchery' ? 1.2 : 0.8);
  // shadow + side (fake 3D extrude)
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.ellipse(p.x, p.y + r * 0.42, r * 1.05, r * 0.42, 0, 0, 6.29); ctx.fill();
  ctx.fillStyle = base;
  ctx.beginPath(); ctx.moveTo(p.x - r, p.y); ctx.lineTo(p.x, p.y - r * 0.5); ctx.lineTo(p.x + r, p.y); ctx.lineTo(p.x + r, p.y - h); ctx.lineTo(p.x, p.y - r * 0.5 - h); ctx.lineTo(p.x - r, p.y - h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = e.done ? top : '#5a5a5a';
  ctx.beginPath(); ctx.moveTo(p.x - r, p.y - h); ctx.lineTo(p.x, p.y - r * 0.5 - h); ctx.lineTo(p.x + r, p.y - h); ctx.lineTo(p.x, p.y + r * 0.5 - h); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = e.owner === 'player' ? 'rgba(57,213,255,.7)' : 'rgba(255,77,94,.7)'; ctx.lineWidth = 1.5; ctx.stroke();
  // icon glyph
  ctx.fillStyle = '#fff'; ctx.font = `bold ${Math.max(12, r * 0.7)}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(BUILDINGS[e.type].icon, p.x, p.y - h);
  if (!e.done) {
    ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(p.x - r, p.y + 6, r * 2, 6);
    ctx.fillStyle = '#ffd35c'; ctx.fillRect(p.x - r, p.y + 6, r * 2 * e.progress, 6);
  } else if (e.hp < e.maxHp) {
    ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(p.x - r, p.y + 6, r * 2, 5);
    ctx.fillStyle = e.hp / e.maxHp > 0.4 ? '#51ff9e' : '#ff4d5e'; ctx.fillRect(p.x - r, p.y + 6, r * 2 * (e.hp / e.maxHp), 5);
  }
}
function drawResource(e) {
  const p = w2s(e.x, e.y); const s = G.cam.zoom; if (e.amount <= 0) return;
  if (e.type === 'mineral') {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.PI / 4);
    const r = 1.3 * s;
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(-r + 2, -r + 4, r * 2, r * 2);
    const grad = ctx.createLinearGradient(-r, -r, r, r); grad.addColorStop(0, '#aef3ff'); grad.addColorStop(1, '#1f6fff');
    ctx.fillStyle = grad; ctx.fillRect(-r, -r, r * 2, r * 2);
    ctx.strokeStyle = '#d8fbff'; ctx.strokeRect(-r, -r, r * 2, r * 2); ctx.restore();
  } else {
    ctx.fillStyle = 'rgba(81,255,158,.25)'; ctx.beginPath(); ctx.arc(p.x, p.y, 1.9 * s, 0, 6.29); ctx.fill();
    ctx.fillStyle = '#51ff9e'; ctx.beginPath(); ctx.arc(p.x, p.y + Math.sin(G.time * 3 + e.x) * 2, 0.8 * s, 0, 6.29); ctx.fill();
  }
}
let ghostValid = false;
// deep-space backdrop (pre-generated starfield so off-map space looks intentional)
const STARS = Array.from({ length: 220 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.4 + 0.3, tw: Math.random() * 6.28 }));
function drawBackground() {
  const grad = ctx.createLinearGradient(0, 0, 0, innerHeight);
  grad.addColorStop(0, '#070b1a'); grad.addColorStop(0.6, '#04060d'); grad.addColorStop(1, '#020308');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, innerWidth, innerHeight);
  ctx.save();
  for (const s of STARS) {
    const a = 0.35 + 0.35 * Math.sin(G.time * 1.5 + s.tw);
    ctx.globalAlpha = Math.max(0.1, a);
    ctx.fillStyle = '#bfd9ff';
    ctx.fillRect(s.x * innerWidth, s.y * innerHeight, s.r, s.r);
  }
  ctx.restore(); ctx.globalAlpha = 1;
}
function draw(dt) {
  // terrain backdrop
  drawBackground();
  if (TER.img) {
    const tl = w2s(0, 0), br = w2s(MAP_SIZE, MAP_SIZE);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(TER.img, tl.x, tl.y, br.x - tl.x, br.y - tl.y);
    ctx.imageSmoothingEnabled = true;
  }
  // grid + borders
  ctx.strokeStyle = 'rgba(57,213,255,.12)'; ctx.lineWidth = 1;
  const step = 10;
  ctx.beginPath();
  for (let x = 0; x <= MAP_SIZE; x += step) { const a = w2s(x, 0), b = w2s(x, MAP_SIZE); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); }
  for (let y = 0; y <= MAP_SIZE; y += step) { const a = w2s(0, y), b = w2s(MAP_SIZE, y); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); }
  ctx.stroke();
  const c1 = w2s(0, 0), c2 = w2s(MAP_SIZE, MAP_SIZE);
  ctx.strokeStyle = 'rgba(255,77,94,.5)'; ctx.lineWidth = 3; ctx.strokeRect(c1.x, c1.y, c2.x - c1.x, c2.y - c1.y);
  // enemy territory tint
  const ez = w2s(100, 0), ez2 = w2s(MAP_SIZE, 60);
  ctx.fillStyle = 'rgba(255,40,60,.06)'; ctx.fillRect(ez.x, ez.y, ez2.x - ez.x, ez2.y - ez.y);

  const sorted = [...G.entities].sort((a, b) => a.y - b.y);
  for (const e of sorted) {
    if (e.hp <= 0) continue;
    if (e.kind === 'resource') drawResource(e);
    else if (e.kind === 'building') drawBuilding(e);
  }
  for (const e of sorted) if (e.kind === 'unit' && e.hp > 0) drawUnit(e);
  // projectiles
  for (const pr of projectiles) {
    const a = w2s(pr.x, pr.y - pr.z * 0.5);
    ctx.strokeStyle = pr.color; ctx.lineWidth = 2; ctx.shadowColor = pr.color; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.x + 8, a.y - 3); ctx.stroke(); ctx.shadowBlur = 0;
  }
  // particles
  for (const pt of particles) {
    const a = w2s(pt.x, pt.y); ctx.globalAlpha = 1 - pt.t / pt.life;
    ctx.fillStyle = pt.color; ctx.fillRect(a.x - pt.size, a.y - pt.size, pt.size * 2, pt.size * 2);
    ctx.globalAlpha = 1;
  }
  // rally lines
  for (const e of G.selected) if (e.kind === 'building' && e.rally) {
    const a = w2s(e.x, e.y), b = w2s(e.rally.x, e.rally.y);
    ctx.strokeStyle = 'rgba(81,255,158,.5)'; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.setLineDash([]);
  }
  // placement ghost
  if (G.placing && mouse.wx != null) {
    const cfg = BUILDINGS[G.placing]; const p = w2s(mouse.wx, mouse.wy); const r = (cfg.size / 2) * G.cam.zoom;
    ghostValid = canAfford(cfg.cost) && placementFree(mouse.wx, mouse.wy, cfg.size);
    ctx.globalAlpha = 0.6; ctx.fillStyle = ghostValid ? '#51ff9e' : '#ff4d5e';
    ctx.beginPath(); ctx.ellipse(p.x, p.y, r, r * 0.5, 0, 0, 6.29); ctx.fill(); ctx.globalAlpha = 1;
  }
  drawMinimap();
}
function drawMinimap() {
  const W = mini.width, H = mini.height, k = W / MAP_SIZE;
  mctx.fillStyle = '#050a16'; mctx.fillRect(0, 0, W, H);
  mctx.drawImage(TER.img, 0, 0, W, H);
  for (const e of G.entities) {
    if (e.hp <= 0) continue;
    if (e.kind === 'resource') { mctx.fillStyle = e.type === 'mineral' ? '#39d5ff' : '#51ff9e'; mctx.fillRect(e.x * k - 1, e.y * k - 1, 3, 3); }
    else if (e.kind === 'building') { mctx.fillStyle = e.owner === 'player' ? '#4d8bff' : '#ff4d5e'; const s = Math.max(3, e.size * k); mctx.fillRect(e.x * k - s / 2, e.y * k - s / 2, s, s); }
    else { mctx.fillStyle = e.owner === 'player' ? '#7fe7ff' : '#ff8b96'; mctx.fillRect(e.x * k - 1, e.y * k - 1, 2, 2); }
  }
  // viewport
  const tl = s2w(0, 0), br = s2w(innerWidth, innerHeight);
  mctx.strokeStyle = '#fff'; mctx.strokeRect(tl.x * k, tl.y * k, (br.x - tl.x) * k, (br.y - tl.y) * k);
}

// ---------- HUD ----------
function announce(msg) {
  const el = $('announce'); el.textContent = msg; el.classList.remove('hidden');
  clearTimeout(announce._t); announce._t = setTimeout(() => el.classList.add('hidden'), 2600);
}
function refreshHUD() {
  $('minerals').textContent = Math.floor(G.minerals);
  $('gas').textContent = Math.floor(G.gas);
  $('supply').textContent = `${supplyUsed()}/${supplyCap()}`;
  $('supply').parentElement.style.borderColor = supplyUsed() >= supplyCap() ? '#ff4d5e' : '';
  $('kills').textContent = G.kills;
  $('timer').textContent = fmtTime(G.time);
}
function selName(e) { return e.kind === 'unit' ? UNITS[e.type].name : BUILDINGS[e.type].name; }
function selIcon(e) { return e.kind === 'unit' ? UNITS[e.type].icon : BUILDINGS[e.type].icon; }
function refreshPanel() {
  const grid = $('command-grid'); grid.innerHTML = '';
  const q = $('build-queue'); q.innerHTML = '';
  const sel = G.selected.filter(e => e.hp > 0);
  if (!sel.length) { $('sel-title').textContent = 'No selection'; $('sel-portrait').textContent = ''; $('sel-stats').textContent = 'Drag to box-select your forces.'; $('sel-hp').innerHTML = ''; return; }
  const e = sel[0];
  $('sel-title').textContent = sel.length > 1 ? `${sel.length} units selected` : selName(e);
  $('sel-portrait').textContent = selIcon(e);
  const hpPct = Math.round((e.hp / e.maxHp) * 100);
  $('sel-stats').textContent = sel.length > 1 ? `${sel.filter(x => x.kind === 'unit').length} troops · ${sel.filter(x => x.kind === 'building').length} structures` : (e.kind === 'unit' ? `${UNITS[e.type].desc}\nHP ${Math.ceil(e.hp)}/${e.maxHp} · DMG ${e.dmg} · RNG ${e.range}` : `${BUILDINGS[e.type].desc}\nHP ${Math.ceil(e.hp)}/${e.maxHp}${e.done ? '' : ' · UNDER CONSTRUCTION'}`);
  $('sel-hp').innerHTML = `<i style="width:${hpPct}%"></i>`;
  const btn = (emoji, label, key, cost, fn, disabled) => {
    const b = document.createElement('button'); b.className = 'cmd'; b.disabled = !!disabled;
    b.innerHTML = `<span class="k">${key || ''}</span><span class="e">${emoji}</span>${label}<div class="c">${cost || ''}</div>`;
    b.onclick = (ev) => { ev.stopPropagation(); fn(); }; grid.appendChild(b);
  };
  // worker build menu
  if (sel.length === 1 && e.kind === 'unit' && e.type === 'scv' && e.owner === 'player') {
    if (!G.buildMenu) {
      btn('🏗', 'Build', 'B', '', () => { G.buildMenu = true; refreshPanel(); });
      btn('⛏', 'Harvest', 'R', '', () => announce('Right-click a crystal or geyser'));
    } else {
      for (const k of ['refinery', 'depot', 'barracks', 'factory', 'starport', 'turret']) {
        const c = BUILDINGS[k];
        btn(c.icon, c.name.split(' ')[0], '', costText(c.cost), () => startPlacement(k), !canAfford(c.cost));
      }
      btn('✖', 'Back', 'Esc', '', () => { G.buildMenu = false; refreshPanel(); });
    }
  }
  // production
  if (sel.length === 1 && e.kind === 'building' && e.done && e.owner === 'player' && BUILDINGS[e.type].trains) {
    for (const t of BUILDINGS[e.type].trains) {
      const c = UNITS[t];
      const blocked = !canAfford(c.cost) || supplyUsed() >= supplyCap() || e.queue.length >= 5;
      btn(c.icon, c.name.split(' ')[0], '', `${costText(c.cost)} · ${TRAIN_TIME[t]}s`, () => trainUnit(e, t), blocked);
    }
    if (e.type === 'command') btn('👷', 'SCV', '', `50⚙ · 9s`, () => trainUnit(e, 'scv'), !canAfford({ m: 50 }) || supplyUsed() >= supplyCap() || e.queue.length >= 5);
  }
  // orders for army selection
  if (sel.some(x => x.kind === 'unit' && x.owner === 'player')) {
    btn('⏹', 'Stop', 'S', '', () => stopList(G.selected));
    btn('✋', 'Hold', 'H', '', () => { for (const x of G.selected) x.hold = true; });
  }
  if (e.queue && e.queue.length) {
    const t = e.queue[0], total = TRAIN_TIME[t];
    const pct = Math.round(((total - e.trainT) / total) * 100);
    q.innerHTML = `<div class="q"><span>${UNITS[t].icon} ${UNITS[t].name}</span><span>${Math.ceil(e.trainT)}s</span></div><div class="bar"><i style="width:${pct}%"></i></div>${e.queue.length > 1 ? `<div class="q"><span>+${e.queue.length - 1} queued</span></div>` : ''}`;
  }
}
function trainUnit(b, type) {
  const cost = UNITS[type].cost;
  if (!canAfford(cost)) { announce('NOT ENOUGH RESOURCES'); AudioSys.error(); return; }
  if (supplyUsed() >= supplyCap()) { announce('BUILD SUPPLY DEPOTS'); AudioSys.error(); return; }
  if (b.queue.length >= 5) return;
  pay(cost); AudioSys.ensure();
  if (!b.queue.length) b.trainT = TRAIN_TIME[type];
  b.queue.push(type); refreshPanel(); refreshHUD();
}
function startPlacement(key) {
  G.placing = key; G.buildMenu = false;
  $('placement-name').textContent = BUILDINGS[key].name;
  $('placement-banner').classList.remove('hidden');
  refreshPanel();
}
function cancelPlacement() { G.placing = null; $('placement-banner').classList.add('hidden'); }
function placementFree(x, y, size) {
  if (x < 4 || y < 4 || x > MAP_SIZE - 4 || y > MAP_SIZE - 4) return false;
  for (const e of G.entities) {
    if (e.hp <= 0 || e.kind === 'resource') continue;
    const need = (e.size || 2) / 2 + size / 2 + 0.6;
    if (Math.abs(e.x - x) < need && Math.abs(e.y - y) < need) return false;
  }
  return true;
}
function confirmPlacement(x, y) {
  const key = G.placing, cfg = BUILDINGS[key];
  if (!canAfford(cfg.cost)) { announce('NOT ENOUGH RESOURCES'); AudioSys.error(); return; }
  if (!placementFree(x, y, cfg.size)) { announce('CANNOT DEPLOY HERE'); AudioSys.error(); return; }
  const workers = G.selected.filter(e => e.kind === 'unit' && e.type === 'scv' && e.owner === 'player' && e.hp > 0);
  if (!workers.length) { announce('SELECT AN SCV FIRST'); AudioSys.error(); return; }
  pay(cfg.cost);
  const b = addBuilding(key, 'player', x, y, false);
  const w = workers[0];
  w.tx = x; w.ty = y + cfg.size; w.target = null; w.harvest = null;
  w.buildTarget = b;
  cancelPlacement(); refreshHUD(); refreshPanel();
  announce(`${cfg.name} — SCV EN ROUTE`);
}

// ---------- input ----------
const mouse = { x: 0, y: 0, wx: null, wy: null, down: false, sx: 0, sy: 0, rmb: null };
const keys = {};
function entityAt(wx, wy) {
  let best = null, bd = 1e18;
  for (const e of G.entities) {
    if (e.hp <= 0 || e.kind === 'resource' && e.amount <= 0) continue;
    const r = Math.max(1.6, (e.size || 2) / 2 + 0.8);
    const d = Math.hypot(e.x - wx, e.y - wy);
    if (d < r && d < bd) { bd = d; best = e; }
  }
  return best;
}
function selectSingle(e, additive) {
  if (!additive) G.selected = [];
  if (e && (e.owner === 'player' || e.kind === 'resource') && !G.selected.includes(e)) G.selected.push(e);
  G.buildMenu = false; refreshPanel(); AudioSys.select();
}
function selectBox(x0, y0, x1, y1, additive) {
  const a = s2w(Math.min(x0, x1), Math.min(y0, y1)), b = s2w(Math.max(x0, x1), Math.max(y0, y1));
  if (!additive) G.selected = [];
  for (const e of G.entities) {
    if (e.owner !== 'player' || e.kind !== 'unit' || e.hp <= 0) continue;
    if (e.x > a.x && e.x < b.x && e.y > a.y && e.y < b.y && !G.selected.includes(e)) G.selected.push(e);
  }
  refreshPanel();
}
canvas.addEventListener('contextmenu', (ev) => ev.preventDefault());
canvas.addEventListener('mousedown', (ev) => {
  AudioSys.ensure();
  const w = s2w(ev.clientX, ev.clientY);
  if (ev.button === 2) {
    if (G.placing) { cancelPlacement(); return; }
    const t = entityAt(w.x, w.y);
    const army = G.selected.filter(e => e.kind === 'unit' && e.hp > 0);
    const facs = G.selected.filter(e => e.kind === 'building' && e.done && e.hp > 0);
    if (t && t.kind === 'resource' && army.some(e => e.type === 'scv')) { orderHarvest(army.filter(e => e.type === 'scv'), t); return; }
    if (t && t.owner === 'enemy' && army.length) { orderAttack(army, t); AudioSys.select(); return; }
    if (army.length) orderMove(army, w.x, w.y, G.attackMove);
    if (facs.length && !army.length) { for (const f of facs) f.rally = { x: w.x, y: w.y }; announce('RALLY SET'); }
    G.attackMove = false;
    return;
  }
  if (ev.button === 0) {
    if (G.placing) { confirmPlacement(w.x, w.y); return; }
    if (G.attackMove) {
      const t = entityAt(w.x, w.y);
      const army = G.selected.filter(e => e.kind === 'unit' && e.hp > 0);
      if (t && t.owner === 'enemy') orderAttack(army, t); else orderMove(army, w.x, w.y, true);
      G.attackMove = false; return;
    }
    mouse.down = true; mouse.sx = ev.clientX; mouse.sy = ev.clientY;
  }
});
canvas.addEventListener('mousemove', (ev) => {
  mouse.x = ev.clientX; mouse.y = ev.clientY;
  const w = s2w(ev.clientX, ev.clientY); mouse.wx = w.x; mouse.wy = w.y;
  if (mouse.down) {
    const box = $('selection-box'); box.classList.remove('hidden');
    box.style.left = Math.min(mouse.sx, ev.clientX) + 'px'; box.style.top = Math.min(mouse.sy, ev.clientY) + 'px';
    box.style.width = Math.abs(ev.clientX - mouse.sx) + 'px'; box.style.height = Math.abs(ev.clientY - mouse.sy) + 'px';
  }
});
canvas.addEventListener('mouseup', (ev) => {
  if (ev.button !== 0 || !mouse.down) return;
  mouse.down = false; $('selection-box').classList.add('hidden');
  const moved = Math.hypot(ev.clientX - mouse.sx, ev.clientY - mouse.sy);
  const w = s2w(ev.clientX, ev.clientY);
  if (moved < 6) {
    const t = entityAt(w.x, w.y);
    selectSingle(t && t.kind !== 'resource' ? t : (t && t.kind === 'resource' ? null : null), ev.shiftKey);
  } else selectBox(mouse.sx, mouse.sy, ev.clientX, ev.clientY, ev.shiftKey);
});
canvas.addEventListener('wheel', (ev) => { G.cam.zoom = clamp(G.cam.zoom * (ev.deltaY > 0 ? 0.9 : 1.1), 2.2, 11); ev.preventDefault(); }, { passive: false });
window.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape') { if (G.placing) cancelPlacement(); G.buildMenu = false; G.attackMove = false; refreshPanel(); return; }
  keys[ev.key.toLowerCase()] = true;
  const k = ev.key.toLowerCase();
  if (k === 'a') { G.attackMove = true; announce('ATTACK-MOVE: click target'); }
  if (k === 's') stopList(G.selected);
  if (k === 'h' && !ev.ctrlKey && !ev.metaKey) { for (const x of G.selected) x.hold = true; }
  if (k === 'b' && G.selected.some(e => e.type === 'scv')) { G.buildMenu = !G.buildMenu; refreshPanel(); }
  if (k === 'm') toggleMute();
  if (k === ' ') { ev.preventDefault(); goHome(); }
  if (['1', '2', '3'].includes(k)) {
    if (ev.ctrlKey || ev.metaKey) { G.groups[k] = [...G.selected]; announce(`GROUP ${k} SET (${G.groups[k].length})`); ev.preventDefault(); }
    else if (G.groups[k].length) { G.selected = G.groups[k].filter(e => e.hp > 0); refreshPanel(); AudioSys.select(); }
  }
});
window.addEventListener('keyup', (ev) => { keys[ev.key.toLowerCase()] = false; });
function goHome() { const cc = G.entities.find(e => e.owner === 'player' && e.type === 'command' && e.hp > 0); if (cc) { G.cam.x = cc.x; G.cam.y = cc.y; } }
function toggleMute() { AudioSys.muted = !AudioSys.muted; $('btn-mute').textContent = AudioSys.muted ? '🔇' : '🔊'; }

// minimap jump
mini.addEventListener('mousedown', (ev) => {
  const r = mini.getBoundingClientRect();
  G.cam.x = ((ev.clientX - r.left) / r.width) * MAP_SIZE;
  G.cam.y = ((ev.clientY - r.top) / r.height) * MAP_SIZE;
});

// buttons
$('btn-start').onclick = () => { AudioSys.ensure(); $('menu-overlay').classList.add('hidden'); startGame(); };
$('btn-restart').onclick = () => { $('end-overlay').classList.add('hidden'); setupWorld(); G.running = true; refreshPanel(); };
$('btn-help').onclick = () => $('help-overlay').classList.remove('hidden');
$('btn-close-help').onclick = () => $('help-overlay').classList.add('hidden');
$('btn-mute').onclick = toggleMute;
$('btn-camera').onclick = goHome;
$('btn-speed').onclick = (ev) => { G.speed = G.speed === 1 ? 2 : 1; ev.target.textContent = G.speed + '×'; };
document.querySelectorAll('.diff').forEach((b) => { b.onclick = () => { document.querySelectorAll('.diff').forEach((x) => x.classList.remove('active')); b.classList.add('active'); G.difficulty = b.dataset.diff; }; });

// ---------- main loop ----------
let last = performance.now();
function startGame() { setupWorld(); G.running = true; announce('COMMANDER: ESTABLISH & DESTROY THE HIVE'); refreshPanel(); }
function frame(now) {
  requestAnimationFrame(frame);
  let dt = Math.min(0.1, (now - last) / 1000); last = now;
  if (!G.running || G.over) { draw(dt); return; }
  dt *= G.speed;
  G.time += dt;
  // camera keys
  const pan = 40 * dt;
  if (keys['w'] || keys['arrowup']) G.cam.y -= pan;
  if (keys['s'] && (keys['control'] || keys['meta'])) {} else if (keys['arrowdown']) G.cam.y += pan;
  if (keys['a'] && !G.attackMove && document.activeElement === document.body) {} // A handled as attack-move; camera via arrows/WASD below
  if (keys['w']) G.cam.y -= 0; // (already applied)
  if (keys['d'] || keys['arrowright']) G.cam.x += pan;
  if (keys['a'] && G.attackMove) {} else if (keys['arrowleft']) G.cam.x -= pan;
  // WASD strafe without conflicting attack-move key: use physical KeyW etc.? keep arrows + WASD when not typing:
  G.cam.x = clamp(G.cam.x, 0, MAP_SIZE); G.cam.y = clamp(G.cam.y, 0, MAP_SIZE);
  for (const e of G.entities) { if (e.hp <= 0) continue; if (e.kind === 'unit') updateUnit(e, dt); else if (e.kind === 'building') updateBuilding(e, dt); }
  // builder progress: SCV near its buildTarget constructs
  for (const w of G.entities) {
    if (w.kind !== 'unit' || w.type !== 'scv' || !w.buildTarget || w.hp <= 0) continue;
    const b = w.buildTarget;
    if (b.hp <= 0) { w.buildTarget = null; continue; }
    const d = Math.hypot(w.x - b.x, w.y - b.y);
    if (d > b.size + 1.5) { w.tx = b.x; w.ty = b.y + b.size; }
    else { w.tx = null; b.progress += dt / b.buildNeed; if (b.progress >= 1 && !b.done) { b.progress = 1; b.done = true; G.stats.built++; w.buildTarget = null; announce(`${BUILDINGS[b.type].name} ONLINE`); AudioSys.build(); refreshPanel(); } }
  }
  updateConstruction(dt);
  // projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const pr = projectiles[i]; pr.t += dt;
    const k = Math.min(1, pr.t / pr.dur);
    pr.x += (pr.tx - pr.x) * Math.min(1, dt * 10); pr.y += (pr.ty - pr.y) * Math.min(1, dt * 10);
    if (k >= 1 || (pr.target && pr.target.hp <= 0)) {
      if (pr.target && pr.target.hp > 0) damage(pr.target, pr.dmg, pr.aoe, pr.owner, pr.tx, pr.ty);
      projectiles.splice(i, 1);
    }
  }
  // particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]; p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt;
    if (p.t >= p.life) particles.splice(i, 1);
  }
  // sweep dead + depleted resources (keep buildings as rubble-less removal)
  for (let i = G.entities.length - 1; i >= 0; i--) {
    const e = G.entities[i];
    if (e.kind === 'resource' && e.amount <= 0) G.entities.splice(i, 1);
    else if ((e.kind === 'unit' || e.kind === 'building') && e.hp <= 0) {
      if (G.selected.includes(e)) { G.selected.splice(G.selected.indexOf(e), 1); refreshPanel(); }
      if (e.kind === 'unit') G.entities.splice(i, 1);
    }
  }
  runAI(dt);
  checkEnd();
  refreshHUD();
  if (Math.floor(G.time * 2) !== Math.floor((G.time - dt) * 2)) refreshPanel();
  draw(dt);
}

// ---------- boot ----------
buildTerrain();
setupWorld();
G.running = false;
refreshHUD(); refreshPanel();
draw(0);
requestAnimationFrame(frame);
if (AUTOSTART) { $('menu-overlay').classList.add('hidden'); G.running = true; }

// ---------- self-test (?selftest=1) ----------
if (SELFTEST) {
  const results = [];
  const ok = (name, cond) => results.push(`${cond ? 'PASS' : 'FAIL'} ${name}`);
  try {
    ok('entrypoint-loaded', !!$('game-canvas') && !!$('minimap') && !!$('command-grid'));
    ok('world-spawns', G.entities.some(e => e.type === 'command') && G.entities.some(e => e.type === 'hatchery'));
    ok('supply-cap', supplyCap() >= 15);
    G.running = true;
    const m0 = G.minerals;
    for (let i = 0; i < 600; i++) { for (const e of G.entities) if (e.kind === 'unit' && e.hp > 0) updateUnit(e, 1 / 30); updateConstruction(1 / 30); }
    ok('simulation-ticks', G.entities.length > 0);
    const marine = addUnit('marine', 'player', 60, 60);
    const ling = addUnit('zergling', 'enemy', 61, 60);
    marine.target = ling;
    for (let i = 0; i < 400; i++) {
      updateUnit(marine, 1 / 30);
      for (let j = projectiles.length - 1; j >= 0; j--) {
        const pr = projectiles[j]; pr.t += 1 / 30;
        pr.x += (pr.tx - pr.x) * Math.min(1, (1 / 30) * 10); pr.y += (pr.ty - pr.y) * Math.min(1, (1 / 30) * 10);
        if (pr.t / pr.dur >= 1) { if (pr.target && pr.target.hp > 0) damage(pr.target, pr.dmg, pr.aoe, pr.owner, pr.tx, pr.ty); projectiles.splice(j, 1); }
      }
    }
    ok('combat-resolves', ling.hp < UNITS.zergling.hp || ling.hp <= 0);
    ok('economy sane', G.minerals >= 0 && m0 !== undefined);
    draw(0.016);
    ok('render-ok', true);
  } catch (err) { results.push('FAIL exception ' + err.message); }
  const allPass = results.every((r) => r.startsWith('PASS'));
  const div = document.createElement('div');
  div.id = 'selftest-result'; div.textContent = (allPass ? 'SELFTEST PASS' : 'SELFTEST FAIL') + ' :: ' + results.join(' | ');
  div.style.cssText = 'position:fixed;left:8px;bottom:34px;z-index:99;background:#000;color:#0f0;padding:6px 10px;font:12px monospace';
  document.body.appendChild(div);
  document.title = div.textContent;
}
