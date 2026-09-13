import * as THREE from 'three';
import { CFG } from './config.js';
import { fbm, clamp } from './utils.js';

// Heightfield island terrain with deformable craters.
export class Terrain {
  constructor(scene, seed = 7) {
    this.seed = seed;
    this.size = CFG.worldSize;
    this.n = CFG.gridN;
    this.count = this.n + 1;
    this.heights = new Float32Array(this.count * this.count);
    this.buildBase();
    this.mesh = this.buildMesh();
    scene.add(this.mesh);
    this.water = this.buildWater(scene);
    this.geoVersion = 0;
  }

  baseHeight(x, z) {
    const s = this.seed;
    const r = Math.hypot(x, z) / (this.size * 0.52); // 0 center .. ~1.4 corner
    const island = Math.max(0, 1 - Math.pow(r, 2.2));
    const hills = fbm(x * 0.035 + s * 3.1, z * 0.035 - s * 1.7, 4, s * 13);
    const detail = fbm(x * 0.11, z * 0.11, 2, s * 77);
    let h = island * (3.2 + hills * 9.0) + (detail - 0.5) * 1.6 * island;
    // island presets
    if (s === 1) h = island * (2.0 + hills * 4.0);                    // atoll: flat
    if (s === 2) h = island * (4.0 + hills * 13.0);                   // peaks
    if (s === 3) {                                                    // crater ring
      const d = Math.hypot(x, z);
      h = island * (5.0 + hills * 7.0) - Math.exp(-(d * d) / 220) * 7.0;
    }
    // seabed falloff outside island
    if (r >= 1) h = -3.5 - (r - 1) * 8.0;
    return h;
  }

  buildBase() {
    const half = this.size / 2;
    for (let j = 0; j < this.count; j++) {
      for (let i = 0; i < this.count; i++) {
        const x = -half + (i / this.n) * this.size;
        const z = -half + (j / this.n) * this.size;
        this.heights[j * this.count + i] = this.baseHeight(x, z);
      }
    }
  }

  buildMesh() {
    const geo = new THREE.PlaneGeometry(this.size, this.size, this.n, this.n, false);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let v = 0; v < pos.count; v++) {
      const x = pos.getX(v), z = pos.getZ(v);
      pos.setY(v, this.sampleBase(x, z));
    }
    geo.computeVertexNormals();
    const colors = new Float32Array(pos.count * 3);
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.paintColors(geo);
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0.0 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    this.geo = geo;
    return mesh;
  }

  sampleBase(x, z) {
    const half = this.size / 2;
    const fx = clamp((x + half) / this.size, 0, 1) * this.n;
    const fz = clamp((z + half) / this.size, 0, 1) * this.n;
    const i0 = Math.floor(fx), j0 = Math.floor(fz);
    const i1 = Math.min(i0 + 1, this.n), j1 = Math.min(j0 + 1, this.n);
    const tx = fx - i0, tz = fz - j0;
    const c = this.count;
    const a = this.heights[j0 * c + i0], b = this.heights[j0 * c + i1];
    const cc = this.heights[j1 * c + i0], d = this.heights[j1 * c + i1];
    return a * (1 - tx) * (1 - tz) + b * tx * (1 - tz) + cc * (1 - tx) * tz + d * tx * tz;
  }

  heightAt(x, z) {
    const half = this.size / 2;
    if (Math.abs(x) > half || Math.abs(z) > half) return -6;
    return this.sampleBase(x, z);
  }

  // Lower terrain in a crater; returns actual displaced volume (for fx scaling).
  crater(x, z, radius, depth) {
    const half = this.size / 2;
    const step = this.size / this.n;
    const R = radius;
    const iC = Math.round((x + half) / step), jC = Math.round((z + half) / step);
    const cells = Math.ceil(R / step);
    for (let j = Math.max(0, jC - cells); j <= Math.min(this.n, jC + cells); j++) {
      for (let i = Math.max(0, iC - cells); i <= Math.min(this.n, iC + cells); i++) {
        const wx = -half + i * step, wz = -half + j * step;
        const d = Math.hypot(wx - x, wz - z);
        if (d < R) {
          const fall = Math.cos((d / R) * Math.PI * 0.5);
          const idx = j * this.count + i;
          this.heights[idx] -= depth * fall * fall;
          if (this.heights[idx] < -5.5) this.heights[idx] = -5.5;
        }
      }
    }
    this.refreshMesh(x, z, R + 2);
  }

  refreshMesh(x, z, R) {
    const pos = this.geo.attributes.position;
    const half = this.size / 2;
    for (let v = 0; v < pos.count; v++) {
      const vx = pos.getX(v), vz = pos.getZ(v);
      const dx = vx - x, dz = vz - z;
      if (dx * dx + dz * dz < (R + 3) * (R + 3)) pos.setY(v, this.sampleBase(vx, vz));
    }
    pos.needsUpdate = true;
    this.geo.computeVertexNormals();
    this.paintColors(this.geo, x, z, R + 4);
  }

  paintColors(geo, cx = 0, cz = 0, R = 1e9) {
    const pos = geo.attributes.position;
    const col = geo.attributes.color;
    const c = new THREE.Color();
    const grass = new THREE.Color(0x58b368);
    const grassHi = new THREE.Color(0x8fd18a);
    const sand = new THREE.Color(0xd9c27a);
    const rock = new THREE.Color(0x8a7f72);
    const deep = new THREE.Color(0x3d6b4f);
    for (let v = 0; v < pos.count; v++) {
      const vx = pos.getX(v), vy = pos.getY(v), vz = pos.getZ(v);
      if ((vx - cx) ** 2 + (vz - cz) ** 2 > R * R) continue;
      const slope = 1 - (geo.attributes.normal ? geo.attributes.normal.getY(v) : 1);
      if (vy < CFG.waterLevel + 0.7) c.copy(sand);
      else if (vy > 8.5) c.copy(rock).lerp(grassHi, 0.15);
      else c.copy(grass).lerp(grassHi, clamp((vy - 1) / 6, 0, 1) * 0.7);
      if (slope > 0.35) c.lerp(rock, clamp((slope - 0.35) * 2.2, 0, 0.8));
      if (vy < -2) c.lerp(deep, 0.4);
      // crater scorch: darkened near fresh craters is handled by slope/normal shift; add noise
      const n = fbm(vx * 0.4, vz * 0.4, 2, 5) * 0.12;
      col.setXYZ(v, c.r * (1 - n) + n * 0.3, c.g * (1 - n), c.b * (1 - n));
    }
    col.needsUpdate = true;
  }

  buildWater(scene) {
    const geo = new THREE.PlaneGeometry(this.size * 2.2, this.size * 2.2, 1, 1);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1e6f9e, transparent: true, opacity: 0.78,
      roughness: 0.25, metalness: 0.35,
    });
    const m = new THREE.Mesh(geo, mat);
    m.position.y = CFG.waterLevel;
    scene.add(m);
    return m;
  }

  // Random flat-ish spawn point above water.
  spawnPoint(tries = 60) {
    const half = this.size * 0.38;
    for (let t = 0; t < tries; t++) {
      const x = (Math.random() * 2 - 1) * half;
      const z = (Math.random() * 2 - 1) * half;
      const h = this.heightAt(x, z);
      if (h > CFG.waterLevel + 1.2 && h < 11) return new THREE.Vector3(x, h + 1.2, z);
    }
    return new THREE.Vector3(0, this.heightAt(0, 0) + 1.2, 0);
  }

  dispose(scene) {
    scene.remove(this.mesh); scene.remove(this.water);
    this.geo.dispose(); this.mesh.material.dispose();
    this.water.geometry.dispose(); this.water.material.dispose();
  }
}

export function buildEnvironment(scene) {
  scene.background = new THREE.Color(0x87b5e0);
  scene.fog = new THREE.Fog(0x87b5e0, 90, 260);

  const hemi = new THREE.HemisphereLight(0xcfe8ff, 0x3a5f43, 0.95);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff2d8, 1.9);
  sun.position.set(45, 70, 25);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -75; sun.shadow.camera.right = 75;
  sun.shadow.camera.top = 75; sun.shadow.camera.bottom = -75;
  sun.shadow.camera.far = 220;
  sun.shadow.bias = -0.0006;
  scene.add(sun);

  // gradient sky dome
  const skyGeo = new THREE.SphereGeometry(400, 16, 12);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(0x3f7cd6) }, bot: { value: new THREE.Color(0xcfe6f7) } },
    vertexShader: 'varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: 'varying vec3 vP; uniform vec3 top; uniform vec3 bot;' +
      'void main(){ float h=normalize(vP).y*0.5+0.5; gl_FragColor=vec4(mix(bot,top,pow(max(h,0.0),0.75)),1.0); }',
  });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);

  // distant clouds (cheap sprites)
  const clouds = new THREE.Group();
  const cm = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: 0.85 });
  for (let i = 0; i < 10; i++) {
    const g = new THREE.Group();
    const n = 2 + Math.floor(Math.random() * 3);
    for (let k = 0; k < n; k++) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(3 + Math.random() * 4, 10, 8), cm);
      s.position.set(k * 5 - n * 2.2, Math.random() * 1.5, Math.random() * 3);
      s.scale.y = 0.55;
      g.add(s);
    }
    const a = Math.random() * Math.PI * 2, r = 95 + Math.random() * 70;
    g.position.set(Math.cos(a) * r, 38 + Math.random() * 22, Math.sin(a) * r);
    clouds.add(g);
  }
  scene.add(clouds);
  return { sun, sky, clouds };
}
