import * as THREE from 'three';
import { heightAt, RED_BASE, WORLD_HALF } from './terrain.js';

// ---------------------------------------------------------------------------
// Enemy drones: hover, wander, defend the red base, fire plasma bolts
// ---------------------------------------------------------------------------

const DRONE_COUNT = 9;
const AGGRO_RANGE = 150;
const HOVER_MIN = 7, HOVER_MAX = 16;
const FIRE_INTERVAL = 2.4;
const RESPAWN_TIME = 6;

const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();

export class Drones {
  constructor(scene, combat) {
    this.scene = scene;
    this.combat = combat;
    this.list = [];
    this.time = 0;

    const bodyGeo = new THREE.OctahedronGeometry(1.35, 0);
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x8a2f26 });
    const eyeGeo = new THREE.SphereGeometry(0.42, 10, 10);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffd050 });
    const ringGeo = new THREE.TorusGeometry(1.9, 0.14, 6, 20);
    const ringMat = new THREE.MeshLambertMaterial({ color: 0x3c3f45 });

    for (let i = 0; i < DRONE_COUNT; i++) {
      const g = new THREE.Group();
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(0, 0, -1.1);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      g.add(body, eye, ring);
      scene.add(g);

      // defenders cluster near the red base, a few roam the midfield
      let ax, az;
      if (i < 5) {
        const a = (i / 5) * Math.PI * 2;
        ax = RED_BASE.x + Math.cos(a) * (55 + (i % 2) * 40);
        az = RED_BASE.z + Math.sin(a) * (55 + (i % 2) * 40);
      } else {
        ax = -200 + (i - 5) * 260;
        az = (i % 2 ? -1 : 1) * (240 + (i - 5) * 60);
      }
      ax = THREE.MathUtils.clamp(ax, -WORLD_HALF + 100, WORLD_HALF - 100);
      az = THREE.MathUtils.clamp(az, -WORLD_HALF + 100, WORLD_HALF - 100);

      const d = {
        group: g, body, ring,
        vel: new THREE.Vector3(),
        anchor: new THREE.Vector3(ax, 0, az),
        hp: 100, dead: false, respawn: 0,
        fireTimer: 1.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        wander: new THREE.Vector3(ax, 0, az),
        wanderTimer: 0,
        hurt(dmg) { this.hp -= dmg; },
      };
      this.respawnDrone(d);
      this.list.push(d);
    }
  }

  respawnDrone(d) {
    d.hp = 100;
    d.dead = false;
    d.group.visible = true;
    d.group.position.set(
      d.anchor.x + (Math.random() - 0.5) * 30, 0,
      d.anchor.z + (Math.random() - 0.5) * 30);
    d.group.position.y = heightAt(d.group.position.x, d.group.position.z) + 10;
    d.vel.set(0, 0, 0);
    d.fireTimer = 2 + Math.random() * 2;
  }

  update(dt, player) {
    this.time += dt;
    const playerPos = _v2.copy(player.pos).setY(player.pos.y + 1.2);

    for (const d of this.list) {
      if (d.dead) {
        d.respawn -= dt;
        if (d.respawn <= 0) this.respawnDrone(d);
        continue;
      }

      const p = d.group.position;
      const groundH = heightAt(p.x, p.z);
      const distToPlayer = p.distanceTo(playerPos);
      const aggro = !player.dead && distToPlayer < AGGRO_RANGE;

      // pick a target position
      if (aggro) {
        // orbit the player at ~35m, above them
        const a = this.time * 0.5 + d.phase;
        _v.set(playerPos.x + Math.cos(a) * 35, playerPos.y + 14, playerPos.z + Math.sin(a) * 35);
      } else {
        d.wanderTimer -= dt;
        if (d.wanderTimer <= 0) {
          d.wanderTimer = 4 + Math.random() * 4;
          d.wander.set(
            d.anchor.x + (Math.random() - 0.5) * 90, 0,
            d.anchor.z + (Math.random() - 0.5) * 90);
        }
        _v.set(d.wander.x, 0, d.wander.z);
        _v.y = heightAt(d.wander.x, d.wander.z) + 10 + Math.sin(this.time + d.phase) * 3;
      }

      // steer toward target
      _v.sub(p);
      const dist = _v.length();
      if (dist > 1) {
        _v.normalize().multiplyScalar(Math.min(aggro ? 26 : 14, dist * 1.2));
        d.vel.lerp(_v, 1 - Math.exp(-dt * 1.6));
      }
      p.addScaledVector(d.vel, dt);

      // stay above terrain
      const minY = groundH + HOVER_MIN, maxY = groundH + HOVER_MAX + 30;
      if (p.y < minY) p.y = minY;
      if (p.y > maxY) p.y = maxY;

      // bob + face player or movement
      d.body.position.y = Math.sin(this.time * 2.2 + d.phase) * 0.3;
      d.ring.rotation.z += dt * 9;
      if (aggro) {
        d.group.lookAt(playerPos);
        d.fireTimer -= dt;
        if (d.fireTimer <= 0) {
          d.fireTimer = FIRE_INTERVAL * (0.85 + Math.random() * 0.3);
          // aim with a little error
          _v.copy(playerPos);
          _v.x += (Math.random() - 0.5) * 6;
          _v.y += (Math.random() - 0.5) * 3;
          _v.z += (Math.random() - 0.5) * 6;
          const muzzle = d.body.getWorldPosition(new THREE.Vector3());
          this.combat.fireBolt(muzzle, _v);
        }
      } else if (d.vel.lengthSq() > 1) {
        _v.copy(p).add(d.vel);
        d.group.lookAt(_v);
      }
    }
  }

  kill(d) {
    d.dead = true;
    d.respawn = RESPAWN_TIME;
    d.group.visible = false;
  }
}
