"use strict";
/* Mechapede pure simulation — deterministic 60Hz, no DOM, no Math.random. */
const W = 240, H = 256, TILE = 8, COLS = 30, ROWS = 32;
const PLAYER_MIN_X = 4, PLAYER_MAX_X = 236, PLAYER_MIN_Y = 208, PLAYER_MAX_Y = 248;
const BOLT_SPEED = 7;
const PLAYER_KEY_SPEED = 2.2;
const MAX_GEARS = 220;
const MAX_SEGS_TOTAL = 28;
const DYING_TICKS = 120;
const INTERMISSION_TICKS = 150;

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Deterministic per-tick helper: hash(seed, tick, salt) -> [0,1)
function hash01(seed, tick, salt) {
  let h = (seed >>> 0) ^ Math.imul(tick + 1, 0x9E3779B1) ^ Math.imul(salt + 1, 0x85EBCA6B);
  h = Math.imul(h ^ (h >>> 15), 0x2C1B3C6D);
  h = Math.imul(h ^ (h >>> 12), 0x297A2D39);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function tileOf(x, y) { return { cx: clamp(Math.floor(x / TILE), 0, COLS - 1), cy: clamp(Math.floor(y / TILE), 0, ROWS - 1) }; }
function gearKey(cx, cy) { return cx + "," + cy; }
function waveSpeed(wave) {
  const base = 1.0 + 0.12 * (wave - 1);
  return wave % 2 === 0 ? base + 0.5 : base;
}
function waveFormationSize(wave) { return Math.max(12 - (wave - 1), 4); }

function makeRngState(seed) { return { seed: seed >>> 0, count: 0 }; }
function rngNext(rs) {
  // deterministic stream based on seed + count (stable across replays)
  const v = hash01(rs.seed, rs.count, 0x1234);
  rs.count++;
  return v;
}

function createInitialState(seed, opts) {
  opts = opts || {};
  const rs = makeRngState(seed >>> 0);
  const state = {
    seed: seed >>> 0,
    tick: 0,
    phase: "playing", // playing | dying | intermission | gameover
    phaseT: 0,
    wave: 1,
    score: 0,
    lives: 3,
    nextExtraAt: 12000,
    totalLivesEarned: 3,
    highScore: opts.highScore || 0,
    player: { x: 120, y: 232, alive: true },
    bolt: null, // {x,y}
    gears: {}, // key -> {cx,cy,hp,electrified}
    gearOrder: [], // insertion order keys for bounded iteration
    chains: [], // [{dir,segs:[{x,y,poison}]}]
    crawler: null, // {x,y,vx,vy}
    crawlerTimer: 420,
    dispenser: null, // {x,y,hp}
    drone: null, // {x,y,dir}
    specialTimer: 300,
    replacementTimer: 0,
    tailTimer: 0,
    rngCount: 0,
    _rs: rs,
    stats: { shots: 0, kills: 0 },
  };
  // scatter initial gears: ~62 gears rows 3..27 avoiding spawn 2-tile radius
  const spawnTX = Math.floor(120 / TILE), spawnTY = Math.floor(232 / TILE);
  let placed = 0, guard = 0;
  while (placed < 62 && guard < 900) {
    guard++;
    const cx = Math.floor(rngNext(rs) * COLS);
    const cy = 3 + Math.floor(rngNext(rs) * 25);
    if (Math.abs(cx - spawnTX) <= 2 && Math.abs(cy - spawnTY) <= 2) continue;
    const k = gearKey(cx, cy);
    if (state.gears[k]) continue;
    state.gears[k] = { cx, cy, hp: 4, electrified: false };
    state.gearOrder.push(k);
    placed++;
  }
  spawnMainFormation(state);
  state.rngCount = rs.count;
  return state;
}

function eligibleTile(state, cx, cy) {
  if (cx < 0 || cx >= COLS || cy < 1 || cy >= 31) return false;
  return !state.gears[gearKey(cx, cy)];
}
function depositGear(state, x, y, events) {
  const t = tileOf(x, y);
  if (!eligibleTile(state, t.cx, t.cy)) return false;
  if (state.gearOrder.length >= MAX_GEARS) return false;
  const k = gearKey(t.cx, t.cy);
  state.gears[k] = { cx: t.cx, cy: t.cy, hp: 4, electrified: false };
  state.gearOrder.push(k);
  return true;
}
function spawnMainFormation(state) {
  const n = waveFormationSize(state.wave);
  const speedY = 16;
  const dir = state.wave % 2 === 1 ? 1 : -1;
  const headX = dir === 1 ? 24 : W - 24;
  const segs = [];
  for (let i = 0; i < n; i++) {
    segs.push({ x: clamp(headX - dir * i * 8, 8, W - 8), y: speedY, poison: false });
  }
  state.chains = [{ dir, segs }];
}
function totalSegs(state) {
  let n = 0;
  for (const c of state.chains) n += c.segs.length;
  return n;
}

function addScore(state, pts, events) {
  state.score += pts;
  if (state.score > state.highScore) state.highScore = state.score;
  // extra life at each 12000, cap 7 total lives (lives value capped at 7)
  while (state.score >= state.nextExtraAt) {
    state.nextExtraAt += 12000;
    if (state.lives < 7) {
      state.lives++;
      if (events) events.push({ type: "extraLife" });
    }
  }
}

function gearAtPixel(state, x, y) {
  // gears occupy 8x8 tile centered? treat tile rect
  const t = tileOf(x, y);
  const g = state.gears[gearKey(t.cx, t.cy)];
  if (!g) return null;
  const gx = g.cx * TILE, gy = g.cy * TILE;
  if (x >= gx - 1 && x <= gx + TILE + 1 && y >= gy - 1 && y <= gy + TILE + 1) return g;
  return null;
}

function killPlayer(state, events) {
  if (state.phase !== "playing") return;
  state.phase = "dying";
  state.phaseT = DYING_TICKS;
  state.player.alive = false;
  events.push({ type: "playerDeath" });
}

function repairAfterDeath(state, events) {
  // repair damaged gears (hp<4) -> full, +5 each
  let repaired = 0;
  for (const k of state.gearOrder) {
    const g = state.gears[k];
    if (g && g.hp < 4) {
      g.hp = 4;
      g.electrified = false;
      repaired++;
      addScore(state, 5, events);
    }
  }
  return repaired;
}

function destroyLink(state, chainIdx, segIdx, events) {
  const chain = state.chains[chainIdx];
  const seg = chain.segs[segIdx];
  const isHead = segIdx === 0;
  addScore(state, isHead ? 100 : 10, events);
  events.push({ type: isHead ? "headKill" : "bodyKill", x: seg.x, y: seg.y });
  state.stats.kills++;
  depositGear(state, seg.x, seg.y, events);
  // split: front part stays as chain (segs before idx), rear part becomes new chain with promoted head
  const front = chain.segs.slice(0, segIdx);
  const rear = chain.segs.slice(segIdx + 1);
  const newChains = [];
  if (front.length > 0) newChains.push({ dir: chain.dir, segs: front });
  if (rear.length > 0) {
    // promote next link: rear[0] becomes amber head (no extra data needed; index 0 = head)
    newChains.push({ dir: chain.dir, segs: rear });
  }
  state.chains.splice(chainIdx, 1, ...newChains);
}

/**
 * Pure fixed-step tick. Mutates `state` (authoritative) deterministically.
 * @param {object} state
 * @param {{mx:number,my:number,fire:boolean,trackDX:number,trackDY:number}} input
 * @returns {Array} events for audio/fx (no state mutation by callers)
 */
function tick(state, input) {
  const events = [];
  state.tick++;
  state._rs.count = state.rngCount;
  const rnd = () => { const v = rngNext(state._rs); state.rngCount = state._rs.count; return v; };

  if (state.phase === "gameover") return events;

  if (state.phase === "dying") {
    state.phaseT--;
    // freeze all motion during dying (exact pause-like freeze except timer)
    if (state.phaseT <= 0) {
      state.lives--;
      if (state.lives <= 0) {
        state.phase = "gameover";
        events.push({ type: "gameOver" });
      } else {
        repairAfterDeath(state, events);
        // reset positions: player + clear bolt/enemies in player zone, keep gears
        state.player.x = 120; state.player.y = 232; state.player.alive = true;
        state.bolt = null;
        state.crawler = null;
        state.dispenser = null;
        state.drone = null;
        state.crawlerTimer = 360;
        state.specialTimer = 300;
        // if convoy empty, spawn fresh main formation for current wave
        if (totalSegs(state) === 0) spawnMainFormation(state);
        else {
          // lift any convoy segs out of player kill zone? keep deterministic: move segs above y=200 up 16px
          for (const c of state.chains) for (const s of c.segs) if (s.y > 200) s.y = 200;
        }
        state.phase = "playing";
        state.phaseT = 0;
        events.push({ type: "respawn" });
      }
    }
    return events;
  }

  if (state.phase === "intermission") {
    state.phaseT--;
    // drift bolt upward / clear? freeze gameplay, just timer
    if (state.phaseT <= 0) {
      state.wave++;
      // keep gears, add a few new ones deterministically
      let added = 0, guard = 0;
      while (added < 5 && guard < 200) {
        guard++;
        const cx = Math.floor(rnd() * COLS), cy = 3 + Math.floor(rnd() * 20);
        if (eligibleTile(state, cx, cy)) {
          const k = gearKey(cx, cy);
          state.gears[k] = { cx, cy, hp: 4, electrified: false };
          state.gearOrder.push(k);
          added++;
        }
      }
      state.player.x = 120; state.player.y = 232; state.player.alive = true;
      state.bolt = null; state.crawler = null; state.dispenser = null; state.drone = null;
      state.crawlerTimer = 420; state.specialTimer = 260; state.replacementTimer = 0;
      spawnMainFormation(state);
      state.phase = "playing";
      events.push({ type: "waveStart", wave: state.wave });
    }
    return events;
  }

  // ---- PLAYING ----
  const speedH = waveSpeed(state.wave);

  // 1. player movement
  if (state.player.alive) {
    let nx = state.player.x + (input.mx || 0) * PLAYER_KEY_SPEED + (input.trackDX || 0);
    let ny = state.player.y + (input.my || 0) * PLAYER_KEY_SPEED + (input.trackDY || 0);
    state.player.x = clamp(nx, PLAYER_MIN_X, PLAYER_MAX_X);
    state.player.y = clamp(ny, PLAYER_MIN_Y, PLAYER_MAX_Y);
    // fire: single bolt
    if (input.fire && !state.bolt) {
      state.bolt = { x: state.player.x, y: state.player.y - 6 };
      state.stats.shots++;
      events.push({ type: "shoot" });
    }
  }
  // 2. bolt move
  if (state.bolt) {
    state.bolt.y -= BOLT_SPEED;
    if (state.bolt.y < -8) state.bolt = null;
  }

  // 3. drone (upper-row electrifier)
  if (state.drone) {
    state.drone.x += state.drone.dir * 2.0;
    // electrify gears it overlaps
    const g = gearAtPixel(state, state.drone.x, state.drone.y);
    if (g && !g.electrified) {
      g.electrified = true;
      events.push({ type: "electrify", x: state.drone.x, y: state.drone.y });
    }
    if (state.drone.x < -10 || state.drone.x > W + 10) state.drone = null;
  }
  // 4. dispenser (falling, 2hp)
  if (state.dispenser) {
    state.dispenser.y += 1.6;
    state.dispenser.x += Math.sin(state.tick * 0.05) * 0.4;
    // trail: every 12 ticks deposit gear if eligible
    if (state.tick % 12 === 0) depositGear(state, state.dispenser.x, state.dispenser.y, events);
    if (state.dispenser.y > H + 8) state.dispenser = null;
  }
  // 5. crawler
  if (state.crawler) {
    const c = state.crawler;
    c.x += c.vx; c.y += c.vy;
    if (c.x < 6 || c.x > W - 6) { c.vx = -c.vx; c.x = clamp(c.x, 6, W - 6); }
    if (c.y < 196 || c.y > 250) { c.vy = -c.vy; c.y = clamp(c.y, 196, 250); }
    // eat gears
    const t = tileOf(c.x, c.y);
    const k = gearKey(t.cx, t.cy);
    if (state.gears[k] && t.cy >= 24) { delete state.gears[k]; state.gearOrder = state.gearOrder.filter(q => q !== k); }
    // randomize slightly deterministically
    if (state.tick % 37 === 0) { c.vx = (hash01(state.seed, state.tick, 77) - 0.5) * 4; c.vy = (hash01(state.seed, state.tick, 78) - 0.5) * 3; }
  } else {
    state.crawlerTimer--;
    if (state.crawlerTimer <= 0) {
      state.crawler = {
        x: 20 + rnd() * (W - 40), y: 214 + rnd() * 30,
        vx: (rnd() < 0.5 ? -1 : 1) * (1.2 + rnd()), vy: (rnd() - 0.5) * 2,
      };
      state.crawlerTimer = 500 + Math.floor(rnd() * 400);
      events.push({ type: "crawlerSpawn" });
    }
  }
  // 6. shared dispenser/drone slot: never coexist
  if (!state.dispenser && !state.drone) {
    state.specialTimer--;
    if (state.specialTimer <= 0) {
      const gearsLow = state.gearOrder.filter(k => state.gears[k] && state.gears[k].cy >= 26).length;
      const roll = rnd();
      if (gearsLow < 8 || roll < 0.45) {
        state.dispenser = { x: 16 + rnd() * (W - 32), y: -6, hp: 2 };
        events.push({ type: "dispenserSpawn" });
      } else {
        const dir = rnd() < 0.5 ? 1 : -1;
        state.drone = { x: dir === 1 ? -8 : W + 8, y: 24 + Math.floor(rnd() * 5) * 8, dir };
        events.push({ type: "droneSpawn" });
      }
      state.specialTimer = 420 + Math.floor(rnd() * 380);
    }
  }

  // 7. convoy movement
  for (const chain of state.chains) {
    for (const seg of chain.segs) {
      if (seg.poison) {
        seg.y += 3.0;
        if (seg.y >= 240) { seg.y = 240; seg.poison = false; }
        continue;
      }
      const nx = seg.x + chain.dir * speedH;
      let blocked = false;
      if (nx < 6 || nx > W - 6) blocked = true;
      else {
        const g = gearAtPixel(state, nx, seg.y);
        if (g) {
          blocked = true;
          if (g.electrified) {
            // poison whole chain? classic poisons that segment; poison this seg + those behind in same chain
            seg.poison = true;
            events.push({ type: "poison", x: seg.x, y: seg.y });
          }
        }
      }
      if (blocked) {
        if (seg.y + TILE <= 244) {
          seg.y += TILE;
          // check electrified at new pos? poison on landing
          const gl = gearAtPixel(state, seg.x, seg.y);
          if (gl && gl.electrified) { seg.poison = true; events.push({ type: "poison", x: seg.x, y: seg.y }); }
        }
        chain.dir = -chain.dir;
        // per-chain flip affects all segs uniformly this tick; break to avoid double flip
      } else {
        seg.x = nx;
      }
    }
  }
  // Bottom-row traversal clamp + tail release
  for (const chain of state.chains) for (const s of chain.segs) { if (s.y > 248) s.y = 248; }
  state.tailTimer++;
  if (state.tailTimer > 320) {
    state.tailTimer = 0;
    // release tail from longest chain in bottom zone
    let best = null;
    for (const c of state.chains) {
      if (c.segs.length >= 4 && c.segs[0].y >= 192) { if (!best || c.segs.length > best.segs.length) best = c; }
    }
    if (best && totalSegs(state) < MAX_SEGS_TOTAL) {
      const tail = best.segs.pop();
      tail.poison = true; // diving entry
      state.chains.push({ dir: best.dir, segs: [tail] });
      events.push({ type: "tailRelease" });
    }
  }
  // Replacement heads when empty (but not wave-clear: wave-clear handled below; only if gears dense?)
  if (totalSegs(state) === 0) {
    state.replacementTimer++;
    if (state.replacementTimer === 1) events.push({ type: "waveClear" });
    if (state.replacementTimer > 90) {
      // if gears remain trivially, still go intermission (wave cleared). Check wave clear first below.
    }
  } else state.replacementTimer = 0;

  // 8. bolt collisions — STRICT PRIORITY: drone > dispenser > crawler > convoy heads > convoy bodies > gears
  if (state.bolt) {
    const b = state.bolt;
    let consumed = false;
    const hitR = (ax, ay, aw, ah) => b.x >= ax - aw / 2 && b.x <= ax + aw / 2 && b.y >= ay - ah / 2 && b.y <= ay + ah / 2;
    // drone
    if (!consumed && state.drone && hitR(state.drone.x, state.drone.y, 12, 8)) {
      addScore(state, 1000, events);
      events.push({ type: "droneKill", x: state.drone.x, y: state.drone.y });
      state.drone = null; state.bolt = null; consumed = true;
      state.stats.kills++;
    }
    // dispenser (2 hits)
    if (!consumed && state.dispenser && hitR(state.dispenser.x, state.dispenser.y, 10, 10)) {
      state.dispenser.hp--;
      state.bolt = null; consumed = true;
      if (state.dispenser.hp <= 0) {
        addScore(state, 200, events);
        events.push({ type: "dispenserKill", x: state.dispenser.x, y: state.dispenser.y });
        state.dispenser = null; state.stats.kills++;
      } else events.push({ type: "dispenserHit", x: b.x, y: b.y });
    }
    // crawler: 300/600/900 by vertical distance to player
    if (!consumed && state.crawler && hitR(state.crawler.x, state.crawler.y, 12, 8)) {
      const d = Math.abs(state.crawler.y - state.player.y);
      const pts = d < 10 ? 900 : d < 30 ? 600 : 300;
      addScore(state, pts, events);
      events.push({ type: "crawlerKill", x: state.crawler.x, y: state.crawler.y, pts });
      state.crawler = null; state.bolt = null; consumed = true;
      state.stats.kills++;
    }
    // convoy heads first
    if (!consumed) {
      let hit = null;
      for (let ci = 0; ci < state.chains.length && !hit; ci++) {
        const c = state.chains[ci];
        if (c.segs.length && hitR(c.segs[0].x, c.segs[0].y, 9, 9)) hit = { ci, si: 0 };
      }
      if (hit) {
        destroyLink(state, hit.ci, hit.si, events);
        state.bolt = null; consumed = true;
      }
    }
    // convoy bodies
    if (!consumed) {
      let hit = null;
      outer: for (let ci = 0; ci < state.chains.length; ci++) {
        const c = state.chains[ci];
        for (let si = 1; si < c.segs.length; si++) {
          if (hitR(c.segs[si].x, c.segs[si].y, 9, 9)) { hit = { ci, si }; break outer; }
        }
      }
      if (hit) {
        destroyLink(state, hit.ci, hit.si, events);
        state.bolt = null; consumed = true;
      }
    }
    // gears (4 hits)
    if (!consumed) {
      const g = gearAtPixel(state, b.x, b.y);
      if (g) {
        g.hp--;
        addScore(state, 1, events);
        events.push({ type: "gearHit", x: b.x, y: b.y });
        if (g.hp <= 0) {
          const k = gearKey(g.cx, g.cy);
          delete state.gears[k];
          state.gearOrder = state.gearOrder.filter(q => q !== k);
          addScore(state, 4, events);
          events.push({ type: "gearBreak", x: b.x, y: b.y });
        }
        state.bolt = null; consumed = true;
      }
    }
  }

  // 9. player collisions (death): convoy | crawler | dispenser | drone
  if (state.player.alive) {
    const p = state.player;
    const overlap = (ax, ay, r) => Math.abs(ax - p.x) < r && Math.abs(ay - p.y) < r;
    let dead = false;
    for (const c of state.chains) for (const s of c.segs) if (overlap(s.x, s.y, 7)) { dead = true; break; }
    if (!dead && state.crawler && overlap(state.crawler.x, state.crawler.y, 7)) dead = true;
    if (!dead && state.dispenser && overlap(state.dispenser.x, state.dispenser.y, 7)) dead = true;
    if (!dead && state.drone && overlap(state.drone.x, state.drone.y, 7)) dead = true;
    if (dead) killPlayer(state, events);
  }

  // 10. wave clear -> intermission (only when convoy empty AND no pending replacement? use timer)
  if (state.phase === "playing" && totalSegs(state) === 0 && state.replacementTimer > 100) {
    state.phase = "intermission";
    state.phaseT = INTERMISSION_TICKS;
    state.replacementTimer = 0;
    events.push({ type: "intermission" });
  }

  // enforce bounds
  if (state.gearOrder.length > MAX_GEARS) {
    const excess = state.gearOrder.length - MAX_GEARS;
    for (let i = 0; i < excess; i++) { const k = state.gearOrder.shift(); delete state.gears[k]; }
  }
  return events;
}

function snapshotForRender(state) {
  // shallow read-only view; renderer must not mutate (frozen top-level)
  return state;
}

if (typeof module !== "undefined") { module.exports = { W, H, TILE, COLS, ROWS, PLAYER_MIN_X, PLAYER_MAX_X, PLAYER_MIN_Y, PLAYER_MAX_Y, BOLT_SPEED, createInitialState, tick, waveSpeed, waveFormationSize, totalSegs, hash01 }; }
if (typeof window !== "undefined") { window.MechSim = { W, H, TILE, COLS, ROWS, PLAYER_MIN_X, PLAYER_MAX_X, PLAYER_MIN_Y, PLAYER_MAX_Y, BOLT_SPEED, createInitialState, tick, waveSpeed, waveFormationSize, totalSegs, hash01 }; }
