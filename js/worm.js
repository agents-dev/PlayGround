import * as THREE from 'three';
import { CFG } from './config.js';

// Cute capsule worm with eyes + team beanie + bazooka prop.
export function makeWormMesh(teamColor) {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf2c9a0, roughness: 0.7 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.55, 0.7, 6, 14), bodyMat);
  body.position.y = 0.85;
  body.castShadow = true;
  g.add(body);
  // belly segments
  for (let i = 0; i < 2; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55 - i * 0.03, 0.045, 8, 20),
      new THREE.MeshStandardMaterial({ color: 0xd9a06f, roughness: 0.8 }));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.6 + i * 0.35;
    g.add(ring);
  }
  // eyes
  const eyeW = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const pupM = new THREE.MeshStandardMaterial({ color: 0x14181f, roughness: 0.3 });
  for (const s of [-1, 1]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 10), eyeW);
    e.position.set(s * 0.2, 1.55, 0.42);
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 8), pupM);
    p.position.set(s * 0.2, 1.56, 0.57);
    g.add(e, p);
  }
  // team beanie
  const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.5, 0.34, 14),
    new THREE.MeshStandardMaterial({ color: teamColor, roughness: 0.6 }));
  hat.position.y = 1.85; hat.castShadow = true;
  const pom = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0xffffff }));
  pom.position.y = 2.08;
  g.add(hat, pom);
  // bazooka tube on the back (rotates when aiming)
  const tube = new THREE.Group();
  const tm = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 1.5, 10),
    new THREE.MeshStandardMaterial({ color: 0x2e3642, roughness: 0.5, metalness: 0.4 }));
  tm.rotation.x = Math.PI / 2;
  tube.add(tm);
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.22, 10),
    new THREE.MeshStandardMaterial({ color: 0xff5a5a, roughness: 0.5 }));
  tip.rotation.x = Math.PI / 2; tip.position.z = 0.8;
  tube.add(tip);
  tube.position.set(0.35, 1.15, -0.25);
  tube.visible = false;
  g.add(tube);
  g.userData.tube = tube;
  return g;
}

export class Worm {
  constructor(name, team, pos) {
    this.name = name;
    this.team = team; // 'red' | 'blue'
    this.pos = pos.clone();
    this.vel = new THREE.Vector3();
    this.hp = 100;
    this.alive = true;
    this.grounded = false;
    this.fallStart = null;
    this.mesh = makeWormMesh(team === 'red' ? 0xe14b4b : 0x3f8cff);
    this.mesh.position.copy(this.pos);
    this.faceYaw = Math.random() * Math.PI * 2;
    this.tagEl = null;
  }

  get headPos() { return new THREE.Vector3(this.pos.x, this.pos.y + 1.6, this.pos.z); }

  damage(amount, game, opts = {}) {
    if (!this.alive) return 0;
    const dmg = Math.max(0, Math.round(amount));
    this.hp -= dmg;
    if (!opts.silent) game?.onWormHurt?.(this, dmg);
    if (this.hp <= 0) {
      this.hp = 0; this.alive = false;
      game?.onWormDeath?.(this);
    }
    return dmg;
  }

  updateVisual(dt) {
    this.mesh.position.copy(this.pos);
    // face movement / aim smoothly
    const target = this.aimYaw !== undefined ? this.aimYaw : this.faceYaw;
    let d = target - this.mesh.rotation.y;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    this.mesh.rotation.y += d * Math.min(1, dt * 10);
    // squash & stretch by vertical velocity
    const s = 1 + Math.min(0.18, Math.max(-0.15, -this.vel.y * 0.008));
    this.mesh.scale.set(2 - s > 1.25 ? 1.25 : 1 / Math.sqrt(s), s, 1 / Math.sqrt(s));
    if (this.grounded) this.mesh.scale.set(1, 1, 1);
  }
}
