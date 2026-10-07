import * as THREE from 'three';
import { heightAt, normalAt, WORLD_HALF } from './terrain.js';

// ---------------------------------------------------------------------------
// Tribes-style player movement:
//  - hold SPACE on ground  => ski (near-frictionless, accelerate downhill)
//  - tap SPACE             => jump
//  - RMB (or SPACE in air) => jetpack
// ---------------------------------------------------------------------------

const G = 30;                 // gravity m/s^2
const WALK_MAX = 11;          // m/s
const WALK_ACCEL = 90;
const GROUND_FRICTION = 9;
const SKI_FRICTION = 0.035;
const SKI_STEER = 5;
const AIR_ACCEL = 14;
const AIR_MAX = 14;           // air-control contribution cap
const JUMP_VEL = 9.5;
const JET_ACCEL = 62;
const JET_MAX_UP = 24;
const MAX_SPEED = 130;

const _g = new THREE.Vector3(0, -G, 0);
const _wish = new THREE.Vector3();
const _fwd = new THREE.Vector3();
const _right = new THREE.Vector3();
const _n = new THREE.Vector3();
const _tmp = new THREE.Vector3();
const _tmp2 = new THREE.Vector3();

export class Player {
  constructor() {
    this.pos = new THREE.Vector3();        // feet position
    this.vel = new THREE.Vector3();
    this.yaw = 0;
    this.pitch = 0;
    this.eyeHeight = 1.7;
    this.onGround = false;
    this.skiing = false;
    this.jetting = false;
    this.energy = 100;
    this.health = 100;
    this.dead = false;
    this.lastHurtAt = -10;
    this.respawnTimer = 0;
    this.speedH = 0;
    this.kickPitch = 0;                     // weapon recoil, decays
    this.spawn();
  }

  spawn() {
    // Spawn on a ridge west of the blue base, facing down the valley (fun start)
    this.pos.set(-830, 0, -420);
    this.pos.y = heightAt(this.pos.x, this.pos.z);
    this.vel.set(0, 0, 0);
    this.yaw = Math.PI * 0.72;             // face roughly toward blue base / valley
    this.pitch = -0.1;
    this.health = 100;
    this.energy = 100;
    this.dead = false;
    this.respawnTimer = 0;
  }

  lookDelta(dx, dy) {
    const s = 0.0023;
    this.yaw -= dx * s;
    this.pitch -= dy * s;
    this.pitch = THREE.MathUtils.clamp(this.pitch, -1.45, 1.45);
  }

  forwardDir(out = _fwd) {
    out.set(-Math.sin(this.yaw) * Math.cos(this.pitch), Math.sin(this.pitch), -Math.cos(this.yaw) * Math.cos(this.pitch));
    return out;
  }

  eyePos(out) { return out.copy(this.pos).setY(this.pos.y + this.eyeHeight); }

  hurt(dmg, now) {
    if (this.dead) return;
    this.health -= dmg;
    this.lastHurtAt = now;
    if (this.health <= 0) { this.health = 0; this.dead = true; this.respawnTimer = 3; }
  }

  update(dt, input, now) {
    if (this.dead) {
      this.respawnTimer -= dt;
      this.vel.multiplyScalar(Math.max(0, 1 - 3 * dt));
      this.integrate(dt);
      if (this.respawnTimer <= 0) this.spawn();
      return;
    }

    // health regen after quiet time
    if (now - this.lastHurtAt > 6 && this.health < 100) {
      this.health = Math.min(100, this.health + 18 * dt);
    }

    // wish direction on the ground plane from yaw
    _fwd.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    _right.set(-_fwd.z, 0, _fwd.x);
    _wish.set(0, 0, 0)
      .addScaledVector(_fwd, input.moveY)
      .addScaledVector(_right, input.moveX);
    if (_wish.lengthSq() > 1) _wish.normalize();

    const groundH = heightAt(this.pos.x, this.pos.z);
    const grounded = this.pos.y <= groundH + 0.06;
    normalAt(this.pos.x, this.pos.z, _n);

    this.skiing = false;
    this.jetting = false;
    this.justJumped = false;

    // jump is a discrete keypress; ski is holding the same key (Tribes-style)
    if (input.jumpPressed) {
      input.jumpPressed = false;
      if (grounded) {
        this.vel.addScaledVector(_n, JUMP_VEL);
        this.justJumped = true;
      }
    }

    if (grounded) {
      if (input.ski) {
        // ---- SKI: project gravity onto the slope, almost no friction ----
        this.skiing = true;
        _tmp.copy(_g).addScaledVector(_n, -_g.dot(_n));   // g along slope
        this.vel.addScaledVector(_tmp, dt);
        this.vel.multiplyScalar(Math.max(0, 1 - SKI_FRICTION * dt));
        this.vel.addScaledVector(_wish, SKI_STEER * dt);  // gentle steering
      } else {
        // ---- WALK ----
        // split velocity into normal / tangential parts
        const vn = _n.dot(this.vel);
        _tmp.copy(this.vel).addScaledVector(_n, -vn);     // tangential
        _tmp.multiplyScalar(Math.max(0, 1 - GROUND_FRICTION * dt));
        // Quake-style accelerate toward wish dir
        const cur = _tmp.dot(_wish);
        const add = WALK_MAX - cur;
        if (add > 0) _tmp.addScaledVector(_wish, Math.min(WALK_ACCEL * dt, add));
        this.vel.copy(_tmp).addScaledVector(_n, vn);
      }
    } else {
      // ---- AIR ----
      this.vel.y -= G * dt;
      // limited air control: add only up to AIR_MAX along wish
      const cur = _tmp.copy(this.vel).setY(0).dot(_wish);
      const add = AIR_MAX - cur;
      if (add > 0) this.vel.addScaledVector(_wish, Math.min(AIR_ACCEL * dt, add));

      // jetpack
      if (input.jet && this.energy > 0) {
        this.jetting = true;
        this.energy = Math.max(0, this.energy - 34 * dt);
        // thrust up, with a little forward lean from view direction
        this.forwardDir(_tmp2);
        _tmp.copy(UP).addScaledVector(_tmp2, 0.35).normalize();
        this.vel.addScaledVector(_tmp, JET_ACCEL * dt);
        if (this.vel.y > JET_MAX_UP) this.vel.y = JET_MAX_UP;
      }
    }

    // energy regen
    if (!this.jetting) {
      this.energy = Math.min(100, this.energy + (grounded ? 42 : 14) * dt);
    }

    if (this.vel.length() > MAX_SPEED) this.vel.setLength(MAX_SPEED);

    this.integrate(dt);

    // world bounds
    this.pos.x = THREE.MathUtils.clamp(this.pos.x, -WORLD_HALF + 40, WORLD_HALF - 40);
    this.pos.z = THREE.MathUtils.clamp(this.pos.z, -WORLD_HALF + 40, WORLD_HALF - 40);

    this.kickPitch = Math.max(0, this.kickPitch - dt * 6);
    this.speedH = _tmp.copy(this.vel).setY(0).length();
  }

  integrate(dt) {
    this.pos.addScaledVector(this.vel, dt);
    const h = heightAt(this.pos.x, this.pos.z);
    if (this.pos.y <= h) {
      this.pos.y = h;
      normalAt(this.pos.x, this.pos.z, _n);
      const vn = this.vel.dot(_n);
      if (vn < 0) this.vel.addScaledVector(_n, -vn); // slide along terrain
      this.onGround = true;
    } else {
      this.onGround = this.pos.y - h < 0.06;
    }
  }
}

const UP = new THREE.Vector3(0, 1, 0);
