import * as THREE from 'three';
import { CFG, WEAPONS, NAMES_RED, NAMES_BLUE } from './config.js';
import { clamp, lerp, rand } from './utils.js';
import { Terrain, buildEnvironment } from './terrain.js';
import { Particles } from './particles.js';
import { Worm } from './worm.js';
import { Projectiles } from './projectiles.js';
import { WormAI } from './ai.js';
import { sfx, ensureAudio } from './audio.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 900);
    this.env = buildEnvironment(this.scene);
    this.particles = new Particles(this.scene);
    this.shots = new Projectiles(this.scene);
    this.ai = new WormAI();

    // boom light
    this.boom = new THREE.PointLight(0xffb45e, 0, 40, 1.8);
    this.scene.add(this.boom);

    // aim helpers
    this.trajGeo = new THREE.BufferGeometry().setFromPoints(new Array(42).fill(0).map(() => new THREE.Vector3()));
    this.traj = new THREE.Line(this.trajGeo, new THREE.LineBasicMaterial({ color: 0xffd54a, transparent: true, opacity: 0.9 }));
    this.traj.frustumCulled = false; this.traj.visible = false;
    this.scene.add(this.traj);
    this.strikeRing = new THREE.Mesh(new THREE.RingGeometry(2.4, 3.1, 40),
      new THREE.MeshBasicMaterial({ color: 0xff5a5a, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
    this.strikeRing.rotation.x = -Math.PI / 2; this.strikeRing.visible = false;
    this.scene.add(this.strikeRing);
    this.teleportRing = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.2, 32),
      new THREE.MeshBasicMaterial({ color: 0x4aa8ff, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
    this.teleportRing.rotation.x = -Math.PI / 2; this.teleportRing.visible = false;
    this.scene.add(this.teleportRing);

    this.ray = new THREE.Raycaster();
    this.mouseNDC = new THREE.Vector2();

    // state
    this.mode = 'ai';
    this.worms = [];
    this.order = [];
    this.orderIdx = 0;
    this.active = null;
    this.state = 'menu'; // menu|play|over
    this.hasFired = false;
    this.shotgunLeft = 0;
    this.settleT = 0;
    this.settleWait = 0;
    this.timer = CFG.turnTime;
    this.wind = 0;
    this.weapon = 'bazooka';
    this.aimYaw = 0; this.aimPitch = 45; this.strikeDist = 14;
    this.charging = false; this.chargeStart = 0;
    this.teleportMode = false;
    this.camYaw = 0.6; this.camPitch = 0.42; this.camDist = 20;
    this.camTarget = new THREE.Vector3();
    this.shake = 0;
    this.aiPlan = null; this.aiT = 0; this.aiFired = false;
    this.time = 0;

    this.keys = new Set();
    this.dragging = false; this.lastMX = 0; this.lastMY = 0;
    this.bindInput();
    this.bindUI();
    this.resize();
    addEventListener('resize', () => this.resize());
  }

  // ---------------- setup ----------------
  newBattle(mode, count, seed) {
    ensureAudio();
    this.mode = mode;
    if (this.terrain) this.terrain.dispose(this.scene);
    for (const w of this.worms) this.scene.remove(w.mesh);
    this.shots.clear();
    const s = seed === 'random' ? 10 + Math.floor(Math.random() * 900) : Number(seed) * 137 + 7;
    this.terrain = new Terrain(this.scene, seed === 'random' ? Math.floor(Math.random() * 1000) : Number(seed) === 0 ? Math.floor(Math.random() * 1000) : s);
    // keep friendly seed value for chosen presets
    this.worms = [];
    const mk = (names, team) => {
      for (let i = 0; i < count; i++) {
        const p = this.terrain.spawnPoint();
        // spread spawns: nudge
        p.x += rand(-18, 18); p.z += rand(-18, 18);
        p.y = this.terrain.heightAt(p.x, p.z) + 0.1;
        const w = new Worm(names[i % names.length] + (count > 1 ? ' ' + (i + 1) : ''), team, p);
        this.scene.add(w.mesh);
        this.worms.push(w);
      }
    };
    // shuffle names
    const r = [...NAMES_RED].sort(() => Math.random() - 0.5);
    const b = [...NAMES_BLUE].sort(() => Math.random() - 0.5);
    mk(r, 'red'); mk(b, 'blue');
    this.order = [...this.worms].sort(() => Math.random() - 0.5);
    this.orderIdx = 0;
    this.state = 'play';
    this.buildTags();
    this.refreshTeams();
    this.nextTurn(true);
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('gameover').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    this.toast(mode === 'ai' ? 'You are RED — good hunting! 🪱' : 'Hotseat: RED goes first!', 2600);
  }

  // ---------------- turns ----------------
  aliveTeams() {
    const r = this.worms.some((w) => w.alive && w.team === 'red');
    const b = this.worms.some((w) => w.alive && w.team === 'blue');
    return { r, b };
  }

  nextTurn(first = false) {
    if (this.state !== 'play') return;
    const { r, b } = this.aliveTeams();
    if (!r || !b) return this.endBattle(r ? 'red' : b ? 'blue' : 'draw');
    // advance to next living worm
    for (let k = 0; k < this.order.length + 4; k++) {
      if (!first) this.orderIdx = (this.orderIdx + 1) % this.order.length;
      else { first = false; break; }
      if (this.order[this.orderIdx].alive) break;
    }
    this.active = this.order[this.orderIdx];
    this.hasFired = false;
    this.shotgunLeft = CFG.shotgun.shots;
    this.settleT = 0; this.settleWait = 0;
    this.timer = CFG.turnTime;
    this.wind = rand(-CFG.windMax, CFG.windMax);
    this.weapon = 'bazooka';
    this.aimPitch = 45; this.strikeDist = 14;
    this.charging = false; this.teleportMode = false;
    this.aiPlan = null; this.aiT = 0; this.aiFired = false;
    // face nearest enemy
    const foe = this.nearestFoe(this.active);
    if (foe) this.aimYaw = Math.atan2(foe.pos.x - this.active.pos.x, foe.pos.z - this.active.pos.z);
    this.active.aimYaw = this.aimYaw;
    // camera snap behind
    this.camYaw = this.aimYaw + Math.PI * 0.15;
    this.camTarget.copy(this.active.pos);
    sfx.turn();
    this.hidePower(); this.hideTeleportHint();
    this.refreshWeaponUI(); this.refreshTeams();
    document.getElementById('turn-text').textContent =
      `${this.active.team === 'red' ? 'Red' : 'Blue'} · ${this.active.name}'s turn` +
      (this.isAITurn() ? ' (AI 🤖)' : '');
    if (this.isAITurn()) this.ai.startTurn(this, this.active);
  }

  isAITurn() { return this.mode === 'ai' && this.active && this.active.team === 'blue'; }
  canAct() { return this.state === 'play' && this.active?.alive && !this.hasFired && !this.isAITurn(); }

  nearestFoe(w) {
    let best = null, bd = 1e9;
    for (const o of this.worms) {
      if (!o.alive || o.team === w.team) continue;
      const d = w.pos.distanceTo(o.pos);
      if (d < bd) { bd = d; best = o; }
    }
    return best;
  }

  endBattle(winner) {
    this.state = 'over';
    this.traj.visible = false; this.strikeRing.visible = false;
    sfx.win();
    const el = document.getElementById('gameover');
    const t = document.getElementById('winner-text');
    const sub = document.getElementById('winner-sub');
    if (winner === 'draw') { t.textContent = 'DRAW!'; sub.textContent = 'Every worm is worm food.'; }
    else {
      t.textContent = winner === 'red' ? '🔴 RED WINS!' : '🔵 BLUE WINS!';
      t.style.color = winner === 'red' ? '#ff5a5a' : '#4aa8ff';
      const surv = this.worms.filter((w) => w.alive && w.team === winner).map((w) => w.name).join(', ');
      sub.textContent = `Survivors: ${surv || 'none'} · ${this.mode === 'ai' && winner === 'red' ? 'Humanity prevails over the machines.' : this.mode === 'ai' ? 'The machines rise. Rematch?' : 'Well fought, both commanders!'}`;
    }
    el.classList.remove('hidden');
    this.onGameOver?.(winner);
  }

  // ---------------- combat ----------------
  muzzlePos() {
    const a = this.active;
    return new THREE.Vector3(a.pos.x, a.pos.y + 1.5, a.pos.z);
  }
  aimDir() {
    const p = (this.aimPitch * Math.PI) / 180;
    return new THREE.Vector3(
      Math.sin(this.aimYaw) * Math.cos(p), Math.sin(p), Math.cos(this.aimYaw) * Math.cos(p)).normalize();
  }

  fireBazooka(power) {
    const dir = this.aimDir();
    this.shots.fireRocket(this.muzzlePos().addScaledVector(dir, 1.2), dir,
      lerp(CFG.bazooka.speedMin, CFG.bazooka.speedMax, power), this.active, CFG.bazooka.windK);
    sfx.launch();
    this.afterFire();
  }
  throwGrenade(power) {
    const dir = this.aimDir();
    this.shots.throwGrenade(this.muzzlePos().addScaledVector(dir, 1.0), dir,
      lerp(CFG.grenade.speedMin, CFG.grenade.speedMax, power), this.active, CFG.grenade.fuse);
    sfx.launch();
    this.afterFire();
  }
  fireShotgun() {
    if (this.shotgunLeft <= 0) return;
    const o = this.muzzlePos(), d = this.aimDir();
    sfx.shotgun();
    this.particles.explosion(o, 0.25);
    // hitscan vs worms
    let best = null, bd = CFG.shotgun.range;
    for (const w of this.worms) {
      if (!w.alive || w === this.active) continue;
      const to = new THREE.Vector3(w.pos.x - o.x, (w.pos.y + 0.9) - o.y, w.pos.z - o.z);
      const along = to.dot(d);
      if (along < 1 || along > CFG.shotgun.range) continue;
      const perp = to.addScaledVector(d, -along).length();
      if (perp < 1.6 && along < bd) { bd = along; best = w; }
    }
    // tracer
    const end = best ? new THREE.Vector3(best.pos.x, best.pos.y + 1, best.pos.z) : o.clone().addScaledVector(d, 40);
    for (let t = 0; t <= 1; t += 0.06) this.particles.trail(o.clone().lerp(end, t), 0xfff2a8);
    if (best) {
      const dmg = best.damage(CFG.shotgun.damage * rand(0.9, 1.1), this);
      best.vel.addScaledVector(d, 9); best.vel.y += 3.5;
      this.toast(`💥 ${best.name} takes ${dmg}!`, 1400);
    } else this.toast('Missed!', 900);
    this.shotgunLeft--;
    this.refreshWeaponUI();
    if (this.shotgunLeft <= 0) this.afterFire();
  }
  callAirstrike() {
    const dir = new THREE.Vector3(Math.sin(this.aimYaw), 0, Math.cos(this.aimYaw));
    const cx = clamp(this.active.pos.x + dir.x * this.strikeDist, -55, 55);
    const cz = clamp(this.active.pos.z + dir.z * this.strikeDist, -55, 55);
    // perpendicular spread line
    const px = -dir.z, pz = dir.x;
    for (let i = 0; i < CFG.airstrike.bombs; i++) {
      const off = (i - (CFG.airstrike.bombs - 1) / 2) * CFG.airstrike.spread;
      this.shots.dropBomb(cx + px * off + rand(-1, 1), cz + pz * off + rand(-1, 1), 42 + rand(0, 6), this.active);
    }
    sfx.whistle();
    this.toast('✈️ Airstrike inbound!', 1500);
    this.afterFire();
  }
  afterFire() {
    this.hasFired = true;
    this.charging = false;
    this.hidePower();
    this.traj.visible = false;
    this.strikeRing.visible = false;
    this.teleportMode = false; this.hideTeleportHint();
    this.refreshWeaponUI();
  }

  explode(p, radius, maxDmg, owner) {
    this.terrain.crater(p.x, p.z, radius, 3.4);
    this.particles.explosion(p, radius / 5.5);
    sfx.explosion(radius / 6);
    this.boom.position.set(p.x, p.y + 3, p.z);
    this.boom.intensity = 90;
    this.shake = Math.min(1.4, 0.5 + radius * 0.09);
    for (const w of this.worms) {
      if (!w.alive) continue;
      const c = new THREE.Vector3(w.pos.x, w.pos.y + 0.9, w.pos.z);
      const d = c.distanceTo(p);
      if (d < radius + 1.2) {
        const fall = 1 - clamp(d / (radius + 1.2), 0, 1);
        const dmg = w.damage(maxDmg * (0.25 + 0.75 * fall), this);
        const push = new THREE.Vector3().subVectors(c, p).normalize();
        push.y = Math.max(push.y, 0.45);
        w.vel.addScaledVector(push, 6 + fall * 13);
        w.grounded = false;
        if (dmg > 0) this.toast(`💥 ${w.name} takes ${dmg}!`, 1300);
      }
    }
    this.refreshTeams();
  }

  // ---------------- per-frame ----------------
  update(dt) {
    this.time += dt;
    if (!this.terrain) return;
    // water anim
    this.terrain.water.position.y = CFG.waterLevel + Math.sin(this.time * 0.9) * 0.12;
    this.env.clouds.children.forEach((c, i) => { c.position.x += dt * (0.4 + (i % 3) * 0.25); if (c.position.x > 170) c.position.x = -170; });
    this.boom.intensity = Math.max(0, this.boom.intensity - dt * 260);
    this.shake = Math.max(0, this.shake - dt * 2.2);

    if (this.state === 'play') {
      this.timer -= dt;
      if (this.timer <= 0) { this.toast(`⏱ ${this.active?.name} ran out of time!`, 1500); this.forceEndTurn(); }
      this.updateTimerUI();
      if (this.isAITurn()) this.updateAI(dt);
      else if (!this.hasFired && this.active?.alive) this.updatePlayerMove(dt);
      this.updateAimKeys(dt);
      this.updateCharging(dt);
    }
    this.updateWormPhysics(dt);
    this.updateProjectiles(dt);
    this.updateSettle(dt);
    this.particles.update(dt);
    this.updateCamera(dt);
    this.updateHelpers();
    this.updateTags();
  }

  forceEndTurn() {
    if (this.state !== 'play') return;
    this.charging = false; this.hidePower();
    this.hasFired = true;
    this.settleWait = 0.6;
  }

  updatePlayerMove(dt) {
    const a = this.active;
    let ix = 0, iz = 0;
    if (this.keys.has('KeyW')) iz += 1;
    if (this.keys.has('KeyS')) iz -= 1;
    if (this.keys.has('KeyA')) ix -= 1;
    if (this.keys.has('KeyD')) ix += 1;
    if (ix || iz) {
      // camera-relative
      const f = new THREE.Vector3(-Math.sin(this.camYaw), 0, -Math.cos(this.camYaw));
      const r = new THREE.Vector3(-f.z, 0, f.x);
      const mv = new THREE.Vector3().addScaledVector(f, iz).addScaledVector(r, ix).normalize();
      const nx = a.pos.x + mv.x * CFG.moveSpeed * dt;
      const nz = a.pos.z + mv.z * CFG.moveSpeed * dt;
      const hNow = this.terrain.heightAt(a.pos.x, a.pos.z);
      const hNew = this.terrain.heightAt(nx, nz);
      if (hNew - a.pos.y < 1.5 && hNew > CFG.waterLevel + 0.25) {
        a.pos.x = clamp(nx, -58, 58); a.pos.z = clamp(nz, -58, 58);
        a.faceYaw = Math.atan2(mv.x, mv.z);
        a.aimYaw = a.faceYaw;
        this.aimYaw = a.faceYaw;
        if (a.grounded && Math.random() < dt * 8)
          this.particles.spawn(a.pos.x, a.pos.y + 0.2, a.pos.z, rand(-1, 1), rand(1, 2), rand(-1, 1), 0.4, 0xcbb98a, 8, 1);
      }
    }
  }

  updateAimKeys(dt) {
    if (!this.canAct() && !this.isAITurn()) { if (!this.canAct()) return; }
    if (this.state !== 'play' || !this.active?.alive || this.hasFired) return;
    if (this.isAITurn()) return; // AI drives its own aim
    const spd = 75 * dt;
    if (this.keys.has('ArrowUp')) { this.aimPitch = clamp(this.aimPitch + spd, 5, 85); }
    if (this.keys.has('ArrowDown')) { this.aimPitch = clamp(this.aimPitch - spd, 5, 85); }
    if (this.keys.has('ArrowLeft')) { this.aimYaw += spd * (Math.PI / 180); }
    if (this.keys.has('ArrowRight')) { this.aimYaw -= spd * (Math.PI / 180); }
    if (this.weapon === 'airstrike') {
      if (this.keys.has('ArrowUp')) this.strikeDist = clamp(this.strikeDist + 20 * dt, 6, 32);
      if (this.keys.has('ArrowDown')) this.strikeDist = clamp(this.strikeDist - 20 * dt, 6, 32);
    }
    this.active.aimYaw = this.aimYaw;
    document.getElementById('aim-angle').textContent = `∠ ${Math.round(this.aimPitch)}°`;
    document.getElementById('aim-dir').textContent = `➤ ${Math.round(((this.aimYaw * 180) / Math.PI) % 360)}°`;
  }

  // Hold duration in seconds (wall-clock, so charge power is
  // frame-rate independent even on slow software renderers).
  chargeHeld() {
    if (!this.charging) return 0;
    return (performance.now() - this.chargeStart) / 1000;
  }

  updateCharging(dt) {
    if (!this.charging) return;
    const p = clamp(this.chargeHeld() / 1.15, 0, 1);
    document.getElementById('power-fill').style.width = `${p * 100}%`;
    if (p >= 1) this.releaseFire(); // auto-fire at max
  }

  startCharge() {
    if (!this.canAct()) return;
    if (this.weapon !== 'bazooka' && this.weapon !== 'grenade') return;
    this.charging = true; this.chargeStart = performance.now();
    document.getElementById('power-wrap').classList.remove('hidden');
  }
  releaseFire() {
    if (!this.charging) return;
    const held = this.chargeHeld();
    this.charging = false; this.hidePower();
    if (held < 0.18) { this.tryJump(); return; } // tap = jump
    const power = clamp(held / 1.15, 0.15, 1);
    if (this.weapon === 'bazooka') this.fireBazooka(power);
    else if (this.weapon === 'grenade') this.throwGrenade(power);
  }
  tryJump() {
    const a = this.active;
    if (a?.grounded && this.canAct()) { a.vel.y = CFG.jumpSpeed; a.grounded = false; sfx.jump(); }
  }
  hidePower() { document.getElementById('power-wrap').classList.add('hidden'); }

  // --- AI driver ---
  updateAI(dt) {
    const a = this.active;
    if (!a?.alive || this.hasFired) return;
    if (!this.aiPlan) this.ai.startTurn(this, a);
    const plan = this.aiPlan;
    if (!plan) { this.forceEndTurn(); return; }
    this.aiT += dt;
    if (plan.phase === 'walk') {
      // waddle toward enemy for ~1.4s
      const mv = new THREE.Vector3(Math.sin(plan.walkDir), 0, Math.cos(plan.walkDir));
      const nx = a.pos.x + mv.x * CFG.moveSpeed * 0.9 * dt;
      const nz = a.pos.z + mv.z * CFG.moveSpeed * 0.9 * dt;
      const hNew = this.terrain.heightAt(nx, nz);
      if (hNew - a.pos.y < 1.5 && hNew > CFG.waterLevel + 0.3) { a.pos.x = nx; a.pos.z = nz; }
      a.faceYaw = plan.walkDir;
      if (Math.random() < dt * 3 && a.grounded && hNew - a.pos.y > 0.7) { a.vel.y = CFG.jumpSpeed; a.grounded = false; }
      if (this.aiT > 1.5) {
        plan.phase = 'aim';
        const s = this.ai.solve(a, plan.target, this.wind);
        plan.lockedYaw = s.yaw; plan.lockedPitch = s.pitch; plan.lockedPower = s.power;
        plan.aimT = 0;
        this.weapon = 'bazooka'; this.refreshWeaponUI();
      }
    } else {
      plan.aimT += dt;
      this.aimYaw = lerp(this.aimYaw, plan.lockedYaw, Math.min(1, dt * 4));
      this.aimPitch = lerp(this.aimPitch, plan.lockedPitch, Math.min(1, dt * 4));
      a.aimYaw = this.aimYaw;
      if (plan.aimT > 1.0 && !this.aiFired) {
        this.aiFired = true;
        this.fireBazooka(plan.lockedPower);
      }
    }
  }

  // --- physics ---
  updateWormPhysics(dt) {
    for (const w of this.worms) {
      if (!w.alive) continue;
      if (w.fallStart === null && !w.grounded) w.fallStart = w.pos.y;
      w.vel.y -= CFG.gravity * dt;
      // water drag above? no
      w.pos.x += w.vel.x * dt;
      w.pos.y += w.vel.y * dt;
      w.pos.z += w.vel.z * dt;
      w.pos.x = clamp(w.pos.x, -59, 59); w.pos.z = clamp(w.pos.z, -59, 59);
      const h = this.terrain.heightAt(w.pos.x, w.pos.z);
      if (w.pos.y <= h) {
        // landing
        if (w.fallStart !== null) {
          const fall = w.fallStart - h;
          w.fallStart = null;
          if (fall > CFG.fallDamageMin && w.vel.y < -8) {
            const dmg = Math.round((fall - CFG.fallDamageMin) * 4);
            if (dmg > 0) { w.damage(dmg, this); this.toast(`🤕 ${w.name} falls ${Math.round(fall)}m: -${dmg}`, 1400); }
          }
        }
        w.pos.y = h;
        if (w.vel.y < -16) this.particles.splash({ x: w.pos.x, y: h, z: w.pos.z });
        w.vel.y = 0;
        w.vel.x *= 1 - Math.min(0.9, 8 * dt);
        w.vel.z *= 1 - Math.min(0.9, 8 * dt);
        w.grounded = true;
      } else {
        w.grounded = false;
        w.vel.x *= 1 - Math.min(0.5, 0.4 * dt);
        w.vel.z *= 1 - Math.min(0.5, 0.4 * dt);
      }
      // drown
      if (w.pos.y < CFG.waterLevel - 0.25) {
        w.alive = false; w.hp = 0;
        this.particles.splash({ x: w.pos.x, y: CFG.waterLevel, z: w.pos.z });
        sfx.splash();
        this.onWormDeath(w, true);
        this.refreshTeams();
        continue;
      }
      w.updateVisual(dt);
    }
  }

  updateProjectiles(dt) {
    if (!this.shots.list.length) return;
    const windX = this.wind;
    for (let i = this.shots.list.length - 1; i >= 0; i--) {
      const p = this.shots.list[i];
      if (p.kind === 'rocket') {
        p.vel.y -= CFG.gravity * dt;
        p.vel.x += windX * p.windK * dt;
        p.mesh.position.addScaledVector(p.vel, dt);
        p.mesh.lookAt(p.mesh.position.clone().add(p.vel));
        p.trailT += dt;
        if (p.trailT > 0.02) { p.trailT = 0; this.particles.trail(p.mesh.position); }
        p.life -= dt;
        const mp = p.mesh.position;
        let boom = p.life <= 0;
        if (mp.y <= this.terrain.heightAt(mp.x, mp.z)) boom = true;
        if (!boom) for (const w of this.worms) {
          if (!w.alive) continue;
          if (Math.hypot(w.pos.x - mp.x, (w.pos.y + 0.9) - mp.y, w.pos.z - mp.z) < 1.3) { boom = true; break; }
        }
        if (mp.y < CFG.waterLevel) { this.particles.splash(mp); sfx.splash(); this.killShot(i); continue; }
        if (boom) { this.killShot(i); this.explode(mp, CFG.bazooka.radius, CFG.bazooka.damage, p.owner); }
      } else if (p.kind === 'grenade') {
        p.fuse -= dt;
        p.vel.y -= CFG.gravity * dt;
        p.vel.x += windX * 0.12 * dt;
        p.mesh.position.addScaledVector(p.vel, dt);
        const mp = p.mesh.position;
        const h = this.terrain.heightAt(mp.x, mp.z);
        if (mp.y <= h + 0.28 && mp.y > CFG.waterLevel) {
          mp.y = h + 0.28;
          if (Math.abs(p.vel.y) > 2) sfx.bounce();
          p.vel.y = -p.vel.y * CFG.grenade.bounce;
          p.vel.x *= 0.7; p.vel.z *= 0.7;
          if (Math.abs(p.vel.y) < 1.2) p.vel.y = 0;
          // roll friction
          p.vel.x *= 1 - Math.min(0.8, 2 * dt); p.vel.z *= 1 - Math.min(0.8, 2 * dt);
        }
        // worm bounce
        for (const w of this.worms) {
          if (!w.alive) continue;
          if (Math.hypot(w.pos.x - mp.x, (w.pos.y + 0.7) - mp.y, w.pos.z - mp.z) < 1.0) {
            p.vel.y = Math.abs(p.vel.y) + 3; p.vel.x += rand(-3, 3); p.vel.z += rand(-3, 3);
          }
        }
        if (mp.y < CFG.waterLevel) { this.particles.splash(mp); sfx.splash(); this.killShot(i); continue; }
        if (p.fuse <= 0) { this.killShot(i); this.explode(mp, CFG.grenade.radius, CFG.grenade.damage, p.owner); }
      } else if (p.kind === 'bomb') {
        p.vel.y -= 30 * dt;
        p.vel.x += windX * 0.25 * dt;
        p.mesh.position.addScaledVector(p.vel, dt);
        const mp = p.mesh.position;
        const h = this.terrain.heightAt(mp.x, mp.z);
        if (mp.y <= h + 0.3 || mp.y < CFG.waterLevel) {
          if (mp.y < CFG.waterLevel && mp.y <= h) { /* underwater */ }
          this.killShot(i);
          if (mp.y >= CFG.waterLevel) this.explode(new THREE.Vector3(mp.x, Math.max(mp.y, h + 0.4), mp.z), CFG.airstrike.radius, CFG.airstrike.damage, p.owner);
          else { this.particles.splash(mp); sfx.splash(); }
        }
      }
    }
  }
  killShot(i) { const [p] = this.shots.list.splice(i, 1); this.scene.remove(p.mesh); }

  updateSettle(dt) {
    if (this.state !== 'play' || !this.hasFired) return;
    if (!this.active?.alive && this.shots.list.length === 0) { this.settleWait += dt; }
    if (this.shots.list.length === 0) {
      // all calm?
      let moving = false;
      for (const w of this.worms) {
        if (!w.alive) continue;
        if (!w.grounded || w.vel.length() > 1.2) { moving = true; break; }
      }
      if (!moving) this.settleT += dt; else this.settleT = 0;
      this.settleWait += dt;
      if ((this.settleT > 1.0 && this.settleWait > 1.5) || this.settleWait > 9) {
        const { r, b } = this.aliveTeams();
        if (!r || !b) this.endBattle(r ? 'red' : b ? 'blue' : 'draw');
        else this.nextTurn();
      }
    } else { this.settleT = 0; this.settleWait += dt; if (this.settleWait > 14) { this.shots.clear(); this.nextTurn(); } }
  }

  // --- camera / helpers / tags ---
  followPoint() {
    if (this.shots.list.length) return this.shots.list[0].mesh.position;
    if (this.active) return new THREE.Vector3(this.active.pos.x, this.active.pos.y + 2, this.active.pos.z);
    return new THREE.Vector3();
  }
  updateCamera(dt) {
    const want = this.followPoint();
    this.camTarget.lerp(want, Math.min(1, dt * 4));
    const cp = this.camPitch, cy = this.camYaw;
    const cx = this.camTarget.x + Math.sin(cy) * Math.cos(cp) * this.camDist;
    const cz = this.camTarget.z + Math.cos(cy) * Math.cos(cp) * this.camDist;
    const cyy = this.camTarget.y + Math.sin(cp) * this.camDist;
    const h = this.terrain ? this.terrain.heightAt(cx, cz) + 1.2 : cyy;
    this.camera.position.set(cx, Math.max(cyy, h), cz);
    // shake
    if (this.shake > 0) {
      this.camera.position.x += rand(-1, 1) * this.shake * 0.35;
      this.camera.position.y += rand(-1, 1) * this.shake * 0.3;
    }
    this.camera.lookAt(this.camTarget.x, this.camTarget.y, this.camTarget.z);
  }

  updateHelpers() {
    const showTraj = this.state === 'play' && (this.canAct() || this.isAITurn()) && !this.hasFired &&
      (this.weapon === 'bazooka' || this.weapon === 'grenade') && this.active?.alive;
    this.traj.visible = !!showTraj;
    this.strikeRing.visible = this.state === 'play' && !this.hasFired && this.weapon === 'airstrike' && !!this.active?.alive;
    this.teleportRing.visible = this.teleportMode && !!this.active?.alive;
    if (showTraj) {
      const power = this.charging ? clamp(this.chargeHeld() / 1.15, 0.15, 1) : 0.62;
      const cfg = this.weapon === 'bazooka' ? CFG.bazooka : CFG.grenade;
      const sp = lerp(cfg.speedMin, cfg.speedMax, power);
      const pos = this.muzzlePos();
      const vel = this.aimDir().multiplyScalar(sp);
      if (this.weapon === 'grenade') vel.y += 3.2;
      const pts = this.trajGeo.attributes.position;
      const p = pos.clone(), v = vel.clone();
      const step = 0.09;
      for (let k = 0; k < 42; k++) {
        v.y -= CFG.gravity * step;
        if (this.weapon === 'bazooka') v.x += this.wind * cfg.windK * step;
        p.addScaledVector(v, step);
        pts.setXYZ(k, p.x, Math.max(p.y, -4), p.z);
        if (p.y <= this.terrain.heightAt(p.x, p.z)) { for (let j = k + 1; j < 42; j++) pts.setXYZ(j, p.x, p.y, p.z); break; }
      }
      pts.needsUpdate = true;
    }
    if (this.strikeRing.visible) {
      const d = new THREE.Vector3(Math.sin(this.aimYaw), 0, Math.cos(this.aimYaw));
      const x = clamp(this.active.pos.x + d.x * this.strikeDist, -55, 55);
      const z = clamp(this.active.pos.z + d.z * this.strikeDist, -55, 55);
      this.strikeRing.position.set(x, this.terrain.heightAt(x, z) + 0.35, z);
      this.strikeRing.scale.setScalar(1 + Math.sin(this.time * 5) * 0.06);
    }
    // launcher prop follows aim
    for (const w of this.worms) {
      const tube = w.mesh.userData.tube;
      const show = this.active === w && !this.hasFired &&
        (this.weapon === 'bazooka' || this.weapon === 'grenade' || this.weapon === 'shotgun');
      tube.visible = !!show;
      if (show) tube.rotation.x = -((this.aimPitch * Math.PI) / 180);
    }
  }

  // ---------------- input & UI ----------------
  bindInput() {
    addEventListener('keydown', (e) => {
      if (e.code === 'Space') e.preventDefault();
      if (e.repeat) return;
      this.keys.add(e.code);
      ensureAudio();
      if (this.state !== 'play') return;
      if (e.code === 'Space') this.startCharge();
      if (e.code === 'Digit1') this.selectWeapon('bazooka');
      if (e.code === 'Digit2') this.selectWeapon('grenade');
      if (e.code === 'Digit3') this.selectWeapon('shotgun');
      if (e.code === 'Digit4') this.selectWeapon('airstrike');
      if (e.code === 'Digit5') this.selectWeapon('teleport');
      if (e.code === 'Enter' && this.weapon === 'shotgun' && this.canAct()) this.fireShotgun();
      if (e.code === 'Enter' && this.weapon === 'airstrike' && this.canAct()) this.callAirstrike();
      if (e.code === 'Escape' && this.teleportMode) { this.teleportMode = false; this.hideTeleportHint(); }
    });
    addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
      if (e.code === 'Space') this.releaseFire();
    });
    this.canvas.addEventListener('mousedown', (e) => {
      ensureAudio();
      if (this.teleportMode && this.state === 'play' && this.canAct()) { this.tryTeleport(e); return; }
      this.dragging = true; this.lastMX = e.clientX; this.lastMY = e.clientY;
    });
    addEventListener('mousemove', (e) => {
      if (this.teleportMode) this.hoverTeleport(e);
      if (!this.dragging) return;
      this.camYaw -= (e.clientX - this.lastMX) * 0.005;
      this.camPitch = clamp(this.camPitch + (e.clientY - this.lastMY) * 0.004, 0.08, 1.25);
      this.lastMX = e.clientX; this.lastMY = e.clientY;
    });
    addEventListener('mouseup', () => { this.dragging = false; });
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.camDist = clamp(this.camDist + e.deltaY * 0.02, 8, 46);
    }, { passive: false });
    // touch orbit (basic)
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) { this.dragging = true; this.lastMX = e.touches[0].clientX; this.lastMY = e.touches[0].clientY; }
    }, { passive: true });
    this.canvas.addEventListener('touchmove', (e) => {
      if (!this.dragging || !e.touches.length) return;
      this.camYaw -= (e.touches[0].clientX - this.lastMX) * 0.006;
      this.camPitch = clamp(this.camPitch + (e.touches[0].clientY - this.lastMY) * 0.005, 0.08, 1.25);
      this.lastMX = e.touches[0].clientX; this.lastMY = e.touches[0].clientY;
    }, { passive: true });
    this.canvas.addEventListener('touchend', () => { this.dragging = false; });
  }

  screenToTerrain(e) {
    const r = this.canvas.getBoundingClientRect();
    this.mouseNDC.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    this.ray.setFromCamera(this.mouseNDC, this.camera);
    const hit = this.ray.intersectObject(this.terrain.mesh, false)[0];
    return hit || null;
  }
  hoverTeleport(e) {
    const hit = this.screenToTerrain(e);
    if (hit && hit.point.y > CFG.waterLevel + 0.3) {
      this.teleportRing.visible = true;
      this.teleportRing.position.set(hit.point.x, hit.point.y + 0.3, hit.point.z);
    }
  }
  tryTeleport(e) {
    const hit = this.screenToTerrain(e);
    if (!hit) return;
    if (hit.point.y < CFG.waterLevel + 0.3) { this.toast('Too wet to teleport there! 🌊', 1400); return; }
    const a = this.active;
    a.pos.set(hit.point.x, hit.point.y + 0.4, hit.point.z);
    a.vel.set(0, 0, 0);
    for (let k = 0; k < 20; k++) this.particles.trail(a.pos, 0x9fd4ff);
    sfx.teleport();
    this.toast(`🌀 ${a.name} teleports!`, 1300);
    this.afterFire();
  }

  selectWeapon(id) {
    if (!this.canAct()) return;
    if (id === 'teleport') {
      this.weapon = 'teleport';
      this.teleportMode = true;
      document.getElementById('teleport-hint').classList.remove('hidden');
      sfx.click();
      this.refreshWeaponUI();
      return;
    }
    if (id === 'shotgun' && this.weapon !== 'shotgun') this.shotgunLeft = CFG.shotgun.shots;
    this.weapon = id;
    this.teleportMode = false; this.hideTeleportHint();
    sfx.click();
    if (id === 'shotgun') this.toast('🔫 Shotgun: ENTER or click Fire — 2 shots!', 1600);
    if (id === 'airstrike') this.toast('✈️ Aim with ← → ↑ ↓, ENTER to strike!', 1600);
    this.refreshWeaponUI();
  }
  hideTeleportHint() { document.getElementById('teleport-hint').classList.add('hidden'); }

  bindUI() {
    const w = document.getElementById('weapons');
    w.innerHTML = '';
    WEAPONS.forEach((def) => {
      const b = document.createElement('button');
      b.className = 'wbtn'; b.dataset.w = def.id;
      b.innerHTML = `<span class="ico">${def.ico}</span><span>${def.name}</span><span class="key">${def.key}</span>`;
      b.onclick = () => {
        ensureAudio();
        if (def.id === 'shotgun' && this.weapon === 'shotgun' && this.canAct()) return this.fireShotgun();
        if (def.id === 'airstrike' && this.canAct()) { this.selectWeapon('airstrike'); return this.callAirstrike(); }
        this.selectWeapon(def.id);
      };
      w.appendChild(b);
    });
    // Fire button (extra, mobile friendly)
    const fire = document.createElement('button');
    fire.className = 'wbtn'; fire.id = 'btn-fire';
    fire.innerHTML = `<span class="ico">🔥</span><span>Fire</span><span class="key">Space/↵</span>`;
    fire.onclick = () => {
      ensureAudio();
      if (this.weapon === 'shotgun') this.canAct() && this.fireShotgun();
      else if (this.weapon === 'airstrike') this.canAct() && this.callAirstrike();
      else if (!this.charging) { this.startCharge(); setTimeout(() => this.releaseFire(), 650); }
    };
    w.appendChild(fire);
    document.getElementById('btn-skip').onclick = () => { ensureAudio(); sfx.click(); this.forceEndTurn(); };
    document.getElementById('btn-menu').onclick = () => location.reload();
  }

  refreshWeaponUI() {
    document.querySelectorAll('.wbtn[data-w]').forEach((b) => {
      b.classList.toggle('active', b.dataset.w === this.weapon);
      b.disabled = this.hasFired || !this.active?.alive;
      if (b.dataset.w === 'shotgun' && this.weapon === 'shotgun' && this.shotgunLeft > 0 && this.shotgunLeft < CFG.shotgun.shots)
        b.querySelector('span:nth-child(2)').textContent = `Shotgun (${this.shotgunLeft})`;
      else if (b.dataset.w === 'shotgun') b.querySelector('span:nth-child(2)').textContent = 'Shotgun';
    });
    const f = document.getElementById('btn-fire');
    if (f) f.disabled = this.hasFired;
  }

  refreshTeams() {
    const r = this.worms.filter((w) => w.team === 'red' && w.alive).length;
    const b = this.worms.filter((w) => w.team === 'blue' && w.alive).length;
    document.querySelector('#team-a .tscore').textContent = `❤ ${r} left`;
    document.querySelector('#team-b .tscore').textContent = `❤ ${b} left`;
    document.getElementById('team-a').classList.toggle('active', !!this.active && this.active.team === 'red' && this.state === 'play');
    document.getElementById('team-b').classList.toggle('active', !!this.active && this.active.team === 'blue' && this.state === 'play');
    this.refreshWeaponUI();
  }

  updateTimerUI() {
    const t = Math.max(0, this.timer);
    document.getElementById('timer-text').textContent = Math.ceil(t);
    document.getElementById('timer-bar').style.width = `${(t / CFG.turnTime) * 100}%`;
    const w = document.getElementById('wind-text');
    w.textContent = `${this.wind >= 0 ? '+' : ''}${this.wind.toFixed(0)} wind`;
    document.getElementById('wind-arrow').style.transform = `rotate(${this.wind >= 0 ? 0 : 180}deg) scaleX(${0.4 + Math.min(1, Math.abs(this.wind) / CFG.windMax)})`;
  }

  buildTags() {
    const wrap = document.getElementById('worm-tags');
    wrap.innerHTML = '';
    for (const w of this.worms) {
      const d = document.createElement('div');
      d.className = 'wtag';
      d.innerHTML = `<div class="nm" style="color:${w.team === 'red' ? '#ff8a8a' : '#9cc8ff'}">${w.name}</div>
        <div class="hpbar"><div class="hpfill"></div></div>`;
      wrap.appendChild(d);
      w.tagEl = d;
    }
  }
  updateTags() {
    const v = new THREE.Vector3();
    for (const w of this.worms) {
      if (!w.tagEl) continue;
      if (!w.alive) { w.tagEl.classList.add('dead'); continue; }
      v.set(w.pos.x, w.pos.y + 2.7, w.pos.z).project(this.camera);
      const vis = v.z < 1;
      w.tagEl.style.display = vis ? 'block' : 'none';
      if (!vis) continue;
      w.tagEl.style.left = `${((v.x + 1) / 2) * innerWidth}px`;
      w.tagEl.style.top = `${((-v.y + 1) / 2) * innerHeight}px`;
      w.tagEl.classList.toggle('active', w === this.active);
      const fill = w.tagEl.querySelector('.hpfill');
      fill.style.width = `${w.hp}%`;
      fill.classList.toggle('low', w.hp <= 35);
    }
  }

  onWormHurt(w) { sfx.hurt(); this.refreshTeams(); }
  onWormDeath(w, drowned = false) {
    sfx.explosion(0.7);
    this.particles.explosion(new THREE.Vector3(w.pos.x, w.pos.y + 1, w.pos.z), 0.7);
    this.toast(drowned ? `🌊 ${w.name} drowned!` : `💀 ${w.name} is out!`, 1700);
    if (w.tagEl) w.tagEl.classList.add('dead');
    this.scene.remove(w.mesh);
    if (w === this.active && this.state === 'play') this.forceEndTurn();
    this.refreshTeams();
  }

  toast(msg, ms = 1800) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.remove('hidden');
    clearTimeout(this._toastT);
    this._toastT = setTimeout(() => t.classList.add('hidden'), ms);
  }

  resize() {
    const w = innerWidth, h = innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
}
