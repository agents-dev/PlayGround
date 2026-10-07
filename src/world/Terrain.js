import * as THREE from 'three'
import { fbm, ridged } from '../core/noise.js'

export const TERRAIN_SIZE = 760
const SEGMENTS = 180

const BASES = [
  { x: -250, z: 0, r: 46, height: 10 }, // blue
  { x: 250, z: 0, r: 46, height: 14 },  // red
]

function smoothstep(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export function terrainHeight(x, z) {
  const s = 0.0042
  let h = (fbm(x * s, z * s, { octaves: 5, gain: 0.52 }) - 0.5) * 46
  const r = ridged(x * s * 1.6 + 11.3, z * s * 1.6 - 7.7, { octaves: 4 })
  h += Math.pow(r, 2.2) * 30

  // Rolling dunes detail.
  h += (fbm(x * 0.02, z * 0.02, { octaves: 3, seed: 90 }) - 0.5) * 5

  // Ring mountains so the arena is bounded.
  const d = Math.hypot(x, z) / (TERRAIN_SIZE * 0.5)
  const rim = smoothstep(0.56, 1.02, d)
  h += rim * rim * 120

  // Flatten the two base pads.
  for (const b of BASES) {
    const dist = Math.hypot(x - b.x, z - b.z)
    const flat = 1 - smoothstep(b.r * 0.55, b.r * 1.35, dist)
    h = THREE.MathUtils.lerp(h, b.height, flat)
  }

  // Slightly flatten the arena heart so fights are readable.
  const centre = 1 - smoothstep(40, 170, Math.hypot(x, z))
  h = THREE.MathUtils.lerp(h, 6, centre * 0.5)
  return h
}

export function terrainNormal(x, z, out = new THREE.Vector3()) {
  const e = 1.2
  const hl = terrainHeight(x - e, z)
  const hr = terrainHeight(x + e, z)
  const hd = terrainHeight(x, z - e)
  const hu = terrainHeight(x, z + e)
  out.set(hl - hr, 2 * e, hd - hu).normalize()
  return out
}

function makeGroundTexture() {
  const size = 256
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  const img = ctx.createImageData(size, size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n = fbm(x * 0.09, y * 0.09, { octaves: 4, seed: 5 })
      const speck = fbm(x * 0.5, y * 0.5, { octaves: 2, seed: 77 })
      const v = 150 + n * 60 + (speck - 0.5) * 40
      const i = (y * size + x) * 4
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(90, 90)
  tex.anisotropy = 4
  return tex
}

const LOW = new THREE.Color('#3b5844')
const MID = new THREE.Color('#6d6857')
const ROCK = new THREE.Color('#6b6f78')
const SNOW = new THREE.Color('#eef6ff')

export function createTerrain(scene) {
  const geo = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, SEGMENTS, SEGMENTS)
  geo.rotateX(-Math.PI / 2)
  const pos = geo.attributes.position
  const colors = new Float32Array(pos.count * 3)
  const c = new THREE.Color()

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    const h = terrainHeight(x, z)
    pos.setY(i, h)

    const n = terrainNormal(x, z)
    const slope = 1 - n.y

    let base
    if (h > 46) base = SNOW.clone().lerp(ROCK, Math.min(0.4, slope))
    else if (h > 24 || slope > 0.45) base = ROCK.clone()
    else base = LOW.clone().lerp(MID, Math.min(1, h / 24 + slope))
    base.lerp(SNOW, smoothstep(0.62, 0.95, slope) * (h > 30 ? 0.5 : 0.15))
    const variation = fbm(x * 0.06, z * 0.06, { octaves: 3, seed: 21 }) * 0.18 + 0.9
    base.multiplyScalar(variation)
    c.copy(base)
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geo.computeVertexNormals()

  const mat = new THREE.MeshLambertMaterial({
    vertexColors: true,
    map: makeGroundTexture(),
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.receiveShadow = true
  mesh.name = 'terrain'
  scene.add(mesh)

  return {
    mesh,
    size: TERRAIN_SIZE,
    bases: BASES,
    heightAt: terrainHeight,
    normalAt: terrainNormal,
  }
}
