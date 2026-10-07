import * as THREE from 'three';
import { heightAt } from './terrain.js';

// ---------------------------------------------------------------------------
// Spinfusor discs, drone plasma bolts, explosions, particle pool
// ---------------------------------------------------------------------------

const DISC_SPEED = 150;
const DISC_INHERIT = 0.5;      // inherit 50% of shooter velocity (Tribes-style)
const DISC_GRAVITY = 3;
const DISC_LIFE = 5;
const SPLASH_RADIUS = 10;
const SPLASH_DMG = 75;
const DIRECT_DMG = 100;
const BOLT_SPEED = 65;
const BOLT_DMG = 13;

const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();

export class Combat {
  constructor(scene) {
    this.scene = scene;
    this.projectiles = [];
    this.onPlayerHit = null;   // cb(dmg)
    this.onDroneHit = null;    // cb(drone, dmg)
    this.onExplosion = null;   // cb(pos)
    this.time = 0;

    // shared resources
    this.discGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16);
    this.discGeo.rotateX(Math.PI / 2);
    this.discMat = new THREE.MeshBasicMaterial({ color: 0x7cf2ff });
    this.discGlowMat = new THREE.SpriteMaterial({
      map: glowTexture(), color: 0x66e8ff, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    this.boltGeo = new THREE.SphereGeometry(0.32, 8, 8);
    this.boltMat = new THREE.MeshBasicMaterial({ color: 0xff7a50 });
    this.boltGlowMat = new THREE.SpriteMaterial({
      map: glowTexture(), color: 0xff9a60, blending: THREE.AdditiveBlending, depthWrite: false,
    });

    // reusable explosion flash light
    this.flash = new THREE.PointLight(0xffc080, 0, 90, 1.8);
    scene.add(this.flash);
    this.flashLife = 0;

    // particle pool
    this.pool = [];
    this.poolIdx = 0;
    const N = 24;
    for (let i = 0; i < N; i++) {
      const p = makeExplosionSprite();
      p.visible = false;
      scene.add(p);
      this.pool.push({ sprite: p, life: 0, max: 1, grow: 1 });
    }
  }

  fireDisc(origin, dir, shooterVel) {
    const mesh = new THREE.Mesh(this.discGeo, this.discMat);
    const glow = new THREE.Sprite(this.discGlowMat.clone());
    glow.scale.setScalar(3.2);
    mesh.add(glow);
    mesh.position.copy(origin).addScaledVector(dir, 1.4);
    mesh.lookAt(_v.copy(mesh.position).add(dir));
    this.scene.add(mesh);
    this.projectiles.push({
      kind: 'disc', mesh,
      vel: _v2.copy(dir).multiplyScalar(DISC_SPEED).addScaledVector(shooterVel, DISC_INHERIT).clone(),
      life: DISC_LIFE, fromPlayer: true,
    });
  }

  fireBolt(origin, target) {
    const mesh = new THREE.Mesh(this.boltGeo, this.boltMat);
    const glow = new THREE.Sprite(this.boltGlowMat.clone());
    glow.scale.setScalar(2.6);
    mesh.add(glow);
    mesh.position.copy(origin);
    this.scene.add(mesh);
    const vel = _v.copy(target).sub(origin).normalize().multiplyScalar(BOLT_SPEED).clone();
    this.projectiles.push({ kind: 'bolt', mesh, vel, life: 6, fromPlayer: false });
  }

  explode(pos, fromPlayer, player, drones, splashDmg = SPLASH_DMG) {
    // particles
    for (let i = 0; i < 3; i++) this.spawnParticle(pos, 0.55 + i * 0.22, 6 + i * 7);
    // flash
    this.flash.position.copy(pos).y += 1.5;
    this.flash.intensity = 260;
    this.flashLife = 0.16;
    if (this.onExplosion) this.onExplosion(pos);

    // player splash (enables the classic disc-jump)
    _v.copy(player.pos).setY(player.pos.y + 1).sub(pos);
    const d = _v.length();
    if (d < SPLASH_RADIUS) {
      const t = 1 - d / SPLASH_RADIUS;
      _v.normalize();
      _v.y += 0.55; _v.normalize();
      player.vel.addScaledVector(_v, t * 30);
      player.hurt(fromPlayer ? splashDmg * 0.5 * t : splashDmg * t, this.time);
    }

    // drone splash
    for (const dr of drones) {
      if (dr.dead) continue;
      _v.copy(dr.group.position).sub(pos);
      const dd = _v.length();
      if (dd < SPLASH_RADIUS) {
        const t = 1 - dd / SPLASH_RADIUS;
        dr.vel.addScaledVector(_v.normalize(), t * 14);
        dr.hurt(splashDmg * t);
        if (this.onDroneHit) this.onDroneHit(dr, splashDmg * t);
      }
    }
  }

  spawnParticle(pos, max, grow) {
    const p = this.pool[this.poolIdx++ % this.pool.length];
    p.sprite.visible = true;
    p.sprite.position.copy(pos);
    p.life = 0; p.max = max; p.grow = grow;
    p.sprite.material.opacity = 0.9;
    p.sprite.scale.setScalar(2);
  }

  update(dt, player, drones) {
    this.time += dt;

    // flash decay
    if (this.flashLife > 0) {
      this.flashLife -= dt;
      this.flash.intensity = Math.max(0, this.flashLife / 0.16) * 260;
    }

    // particles
    for (const p of this.pool) {
      if (!p.sprite.visible) continue;
      p.life += dt;
      const t = p.life / p.max;
      if (t >= 1) { p.sprite.visible = false; continue; }
      p.sprite.scale.setScalar(2 + t * p.grow);
      p.sprite.material.opacity = 0.9 * (1 - t);
      p.sprite.position.y += dt * 6;
    }

    // projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const pr = this.projectiles[i];
      pr.life -= dt;
      if (pr.kind === 'disc') pr.vel.y -= DISC_GRAVITY * dt;
      pr.mesh.position.addScaledVector(pr.vel, dt);
      if (pr.kind === 'disc') pr.mesh.rotateZ(dt * 20);
      const p = pr.mesh.position;

      let dead = pr.life <= 0;

      // terrain hit
      if (!dead && p.y <= heightAt(p.x, p.z)) {
        p.y = heightAt(p.x, p.z);
        this.explode(p, pr.fromPlayer, player, drones);
        dead = true;
      }

      // drone hit (player discs only): contact hit or proximity airburst
      if (!dead && pr.fromPlayer) {
        for (const dr of drones) {
          if (dr.dead) continue;
          const d2 = p.distanceToSquared(dr.group.position);
          if (d2 < 6 * 6) {
            if (d2 < 3.5 * 3.5) {
              dr.hurt(DIRECT_DMG);
              if (this.onDroneHit) this.onDroneHit(dr, DIRECT_DMG);
            }
            this.explode(p, true, player, drones);
            dead = true;
            break;
          }
        }
      }

      // player hit (enemy bolts only)
      if (!dead && !pr.fromPlayer && !player.dead) {
        _v.copy(player.pos); _v.y += 1.2;
        if (p.distanceToSquared(_v) < 1.5 * 1.5) {
          if (this.onPlayerHit) this.onPlayerHit(BOLT_DMG);
          this.explode(p, false, player, drones, 18);
          dead = true;
        }
      }

      if (dead) {
        this.scene.remove(pr.mesh);
        this.projectiles.splice(i, 1);
      }
    }
  }
}

// ---------------------------------------------------------------------------

let _glowTex = null;
function glowTexture() {
  if (_glowTex) return _glowTex;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,.5)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  _glowTex = new THREE.CanvasTexture(c);
  return _glowTex;
}

function makeExplosionSprite() {
  const mat = new THREE.SpriteMaterial({
    map: glowTexture(), color: 0xffb060,
    blending: THREE.AdditiveBlending, depthWrite: false, transparent: true,
  });
  return new THREE.Sprite(mat);
}
