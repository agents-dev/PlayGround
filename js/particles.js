import * as THREE from 'three';

// Pooled point-sprite particles: explosions, smoke, splash, trails, muzzle.
export class Particles {
  constructor(scene, max = 1500) {
    this.max = max;
    this.pos = new Float32Array(max * 3);
    this.col = new Float32Array(max * 3);
    this.data = []; // {i,vx,vy,vz,life,maxLife,size,grav,drag}
    this.free = [];
    for (let i = max - 1; i >= 0; i--) this.free.push(i);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(this.col, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.9, vertexColors: true, transparent: true, opacity: 0.95,
      depthWrite: false, sizeAttenuation: true,
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
    scene.add(this.points);
    this.tmpC = new THREE.Color();
    // hide unused far away
    for (let i = 0; i < max; i++) { this.pos[i * 3 + 1] = -999; }
  }

  spawn(x, y, z, vx, vy, vz, life, color, grav = 0, drag = 0) {
    if (!this.free.length) return;
    const i = this.free.pop();
    this.pos[i * 3] = x; this.pos[i * 3 + 1] = y; this.pos[i * 3 + 2] = z;
    this.tmpC.set(color);
    // slight variance
    const v = 0.85 + Math.random() * 0.3;
    this.col[i * 3] = Math.min(1, this.tmpC.r * v);
    this.col[i * 3 + 1] = Math.min(1, this.tmpC.g * v);
    this.col[i * 3 + 2] = Math.min(1, this.tmpC.b * v);
    this.data.push({ i, vx, vy, vz, life, maxLife: life, grav, drag });
  }

  explosion(p, big = 1) {
    const n = Math.floor(46 * big);
    for (let k = 0; k < n; k++) {
      const a = Math.random() * Math.PI * 2, e = Math.random() * Math.PI - Math.PI / 2;
      const sp = (4 + Math.random() * 11) * big;
      this.spawn(p.x, p.y + 0.5, p.z,
        Math.cos(a) * Math.cos(e) * sp, Math.abs(Math.sin(e)) * sp + 3, Math.sin(a) * Math.cos(e) * sp,
        0.5 + Math.random() * 0.7,
        Math.random() < 0.45 ? 0xffd54a : (Math.random() < 0.5 ? 0xff7a2e : 0xfff3c4), 18, 1.2);
    }
    for (let k = 0; k < 22 * big; k++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 2 + Math.random() * 5;
      this.spawn(p.x, p.y + 1, p.z, Math.cos(a) * sp, 4 + Math.random() * 5, Math.sin(a) * sp,
        1.1 + Math.random() * 0.9, 0x555560, -2.5, 1.6);
    }
    // dirt chunks
    for (let k = 0; k < 14 * big; k++) {
      const a = Math.random() * Math.PI * 2, sp = 3 + Math.random() * 7;
      this.spawn(p.x, p.y + 0.4, p.z, Math.cos(a) * sp, 6 + Math.random() * 7, Math.sin(a) * sp,
        0.9 + Math.random() * 0.6, 0x6b5b45, 22, 0.4);
    }
  }

  splash(p) {
    for (let k = 0; k < 26; k++) {
      const a = Math.random() * Math.PI * 2, sp = 1 + Math.random() * 4;
      this.spawn(p.x, p.y + 0.3, p.z, Math.cos(a) * sp, 3 + Math.random() * 5, Math.sin(a) * sp,
        0.5 + Math.random() * 0.5, 0x9fd4ff, 20, 0.6);
    }
  }

  trail(p, color = 0xffe9a8) {
    this.spawn(p.x, p.y, p.z, (Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5),
      0.35 + Math.random() * 0.25, color, -1, 2);
  }

  jetpack(p) {
    this.spawn(p.x, p.y - 0.6, p.z, (Math.random() - 0.5) * 2, -4 - Math.random() * 3, (Math.random() - 0.5) * 2,
      0.3 + Math.random() * 0.25, Math.random() < 0.5 ? 0xffb02e : 0xfff6c8, 0, 1);
  }

  update(dt) {
    if (!this.data.length) return;
    const alive = [];
    for (const pt of this.data) {
      pt.life -= dt;
      if (pt.life <= 0) {
        this.pos[pt.i * 3 + 1] = -999;
        this.free.push(pt.i);
        continue;
      }
      pt.vy -= pt.grav * dt;
      const dr = 1 - Math.min(0.9, pt.drag * dt);
      pt.vx *= dr; pt.vy *= dr; pt.vz *= dr;
      this.pos[pt.i * 3] += pt.vx * dt;
      this.pos[pt.i * 3 + 1] += pt.vy * dt;
      this.pos[pt.i * 3 + 2] += pt.vz * dt;
      // fade to dark as it dies (cheap)
      const f = pt.life / pt.maxLife;
      if (f < 0.35) {
        this.col[pt.i * 3] *= 0.96; this.col[pt.i * 3 + 1] *= 0.96; this.col[pt.i * 3 + 2] *= 0.96;
      }
      alive.push(pt);
    }
    this.data = alive;
    this.points.geometry.attributes.position.needsUpdate = true;
    this.points.geometry.attributes.color.needsUpdate = true;
  }
}
