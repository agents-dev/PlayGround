import * as THREE from 'three';
import { CFG } from './config.js';

// Live projectiles: bazooka rockets, grenades, falling airstrike bombs.
export class Projectiles {
  constructor(scene) {
    this.scene = scene;
    this.list = [];
    const rocketGeo = new THREE.CapsuleGeometry(0.16, 0.5, 4, 8);
    rocketGeo.rotateX(Math.PI / 2);
    this.rocketGeo = rocketGeo;
    this.rocketMat = new THREE.MeshStandardMaterial({ color: 0x39414e, roughness: 0.4, metalness: 0.5 });
    this.grenadeGeo = new THREE.SphereGeometry(0.28, 12, 10);
    this.grenadeMat = new THREE.MeshStandardMaterial({ color: 0x2f7a3d, roughness: 0.5 });
    this.bombGeo = new THREE.ConeGeometry(0.3, 0.9, 8);
    this.bombMat = new THREE.MeshStandardMaterial({ color: 0x30363f, roughness: 0.5 });
  }

  get active() { return this.list.length > 0; }

  fireRocket(origin, dir, speed, owner, windK) {
    const mesh = new THREE.Mesh(this.rocketGeo, this.rocketMat);
    mesh.castShadow = true;
    mesh.position.copy(origin);
    this.scene.add(mesh);
    this.list.push({
      kind: 'rocket', mesh, owner,
      vel: dir.clone().multiplyScalar(speed),
      windK, life: 8, trailT: 0,
    });
  }

  throwGrenade(origin, dir, speed, owner, fuse) {
    const mesh = new THREE.Mesh(this.grenadeGeo, this.grenadeMat);
    mesh.castShadow = true;
    mesh.position.copy(origin);
    this.scene.add(mesh);
    this.list.push({
      kind: 'grenade', mesh, owner,
      vel: dir.clone().multiplyScalar(speed).add(new THREE.Vector3(0, 3.2, 0)),
      fuse, bounces: 0, trailT: 0,
    });
  }

  dropBomb(x, z, top, owner) {
    const mesh = new THREE.Mesh(this.bombGeo, this.bombMat);
    mesh.position.set(x, top, z);
    mesh.rotation.x = Math.PI;
    this.scene.add(mesh);
    this.list.push({ kind: 'bomb', mesh, owner, vel: new THREE.Vector3(0, -6, 0), life: 8 });
  }

  clear() {
    for (const p of this.list) this.scene.remove(p.mesh);
    this.list = [];
  }
}
