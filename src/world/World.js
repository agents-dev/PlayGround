import * as THREE from 'three'
import { createTerrain } from './Terrain.js'
import { createSky, SUN_DIR } from './Sky.js'
import { makeRng } from '../core/noise.js'

export const TEAM = {
  blue: { name: 'AZURE', color: 0x39a9ff, css: '#46b6ff', accent: 0xbfe9ff },
  red: { name: 'CRIMSON', color: 0xff5a4d, css: '#ff5a4d', accent: 0xffd2cc },
}

export class World {
  constructor(scene, renderer) {
    this.scene = scene
    this.renderer = renderer
    this.terrain = createTerrain(scene)
    this.sky = createSky(scene, renderer)
    this.colliders = []
    this.padColliders = []
    this.treeSpots = []
    this.rockSpots = []
    this.bases = {}
    this.lights = []
    this._computeVehicleHomes()
    this._buildLights()
    this._buildProps()
    for (const team of ['blue', 'red']) {
      const b = this.terrain.bases[team === 'blue' ? 0 : 1]
      this.bases[team] = this._buildBase(team, b.x, b.z, b.height)
    }
  }

  _computeVehicleHomes() {
    // Cleared pads where vehicles spawn; also used to keep props away.
    this.vehicleHomes = { blue: [], red: [] }
    const defs = [
      { type: 'tank', dx: 96, dz: 22, yaw: 0.4 },
      { type: 'car', dx: 96, dz: -22, yaw: -0.4 },
      { type: 'ship', dx: 116, dz: 0, yaw: 0 },
    ]
    const teams = [['blue', 0, 1], ['red', 1, -1]]
    for (const [team, baseIdx, inward] of teams) {
      const b = this.terrain.bases[baseIdx]
      for (const d of defs) {
        this.vehicleHomes[team].push({
          type: d.type,
          x: b.x + d.dx * inward,
          z: b.z + d.dz,
          yaw: (team === 'blue' ? -Math.PI / 2 : Math.PI / 2) + d.yaw * inward,
        })
      }
    }
  }

  _nearVehicleHome(x, z, r) {
    for (const team of ['blue', 'red']) {
      for (const h of this.vehicleHomes[team]) {
        if (Math.hypot(x - h.x, z - h.z) < r) return true
      }
    }
    return false
  }

  _buildLights() {
    const hemi = new THREE.HemisphereLight(0xd8ecff, 0x4a5a48, 1.15)
    this.scene.add(hemi)

    const sun = new THREE.DirectionalLight(0xfff3d6, 2.7)
    sun.position.copy(SUN_DIR).multiplyScalar(320)
    sun.castShadow = true
    sun.shadow.mapSize.set(1536, 1536)
    sun.shadow.camera.near = 40
    sun.shadow.camera.far = 900
    const d = 360
    sun.shadow.camera.left = -d
    sun.shadow.camera.right = d
    sun.shadow.camera.top = d
    sun.shadow.camera.bottom = -d
    sun.shadow.bias = -0.0006
    sun.shadow.normalBias = 0.8
    this.scene.add(sun)
    this.scene.add(sun.target)
    this.sun = sun

    const fill = new THREE.DirectionalLight(0x88b6ff, 0.55)
    fill.position.set(-1, 0.5, 0.6).multiplyScalar(200)
    this.scene.add(fill)
  }

  _placeOnGround(object, x, z, yOffset = 0) {
    const y = this.terrain.heightAt(x, z)
    object.position.set(x, y + yOffset, z)
    return object
  }

  _buildBase(team, x, z, height) {
    const spec = TEAM[team]
    const group = new THREE.Group()
    group.position.set(x, height, z)
    const hull = new THREE.MeshStandardMaterial({ color: 0x2b333d, roughness: 0.7, metalness: 0.55 })
    const trim = new THREE.MeshStandardMaterial({ color: spec.color, emissive: spec.color, emissiveIntensity: 2.3, roughness: 0.4, metalness: 0.3 })
    const glass = new THREE.MeshStandardMaterial({ color: 0x0d2136, roughness: 0.15, metalness: 0.9, emissive: spec.color, emissiveIntensity: 0.5 })

    const addBox = (w, h, d, px, py, pz, mat = hull) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
      m.position.set(px, py, pz)
      m.castShadow = true; m.receiveShadow = true
      group.add(m)
      return m
    }

    // Central command hall.
    addBox(34, 13, 34, 0, 6.5, 0)
    addBox(36, 1.4, 36, 0, 13.4, 0, trim)
    addBox(24, 6, 24, 0, 16, 0)
    addBox(26, 1.0, 26, 0, 19.2, 0, trim)
    // Windows.
    addBox(34.4, 3.4, 34.4, 0, 8, 0, glass)
    // Entrance ramp.
    addBox(12, 1.5, 16, 0, 0.9, 24)
    // Corner pylons with emissive caps.
    for (const [dx, dz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      const px = dx * 24, pz = dz * 24
      addBox(4, 22, 4, px, 11, pz)
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 2, 16), trim)
      cap.position.set(px, 23, pz)
      group.add(cap)
    }
    // Landing pad.
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(15, 17, 1.6, 32), hull)
    pad.position.set(0, 0.8, -30)
    pad.receiveShadow = true
    group.add(pad)
    this.padColliders.push({ x, y: height + 0.8, z: z - 30, radius: 15, halfHeight: 0.8 })
    const padRing = new THREE.Mesh(new THREE.TorusGeometry(13, 0.5, 8, 40), trim)
    padRing.rotation.x = Math.PI / 2
    padRing.position.set(0, 1.7, -30)
    group.add(padRing)

    // Antenna mast.
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 34, 8), hull)
    mast.position.set(20, 17, 20)
    mast.castShadow = true
    group.add(mast)
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 12), trim)
    beacon.position.set(20, 34, 20)
    group.add(beacon)

    // Team light.
    const lamp = new THREE.PointLight(spec.color, 2.4, 120, 2)
    lamp.position.set(0, 16, 0)
    group.add(lamp)

    // Flag stand.
    const flagX = 0, flagZ = 40
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.8, 2.4, 16), hull)
    stand.position.set(flagX, 1.2, flagZ)
    group.add(stand)
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 22, 10), new THREE.MeshStandardMaterial({ color: 0xdadada, metalness: 0.8, roughness: 0.3 }))
    pole.position.set(flagX, 11, flagZ)
    pole.castShadow = true
    group.add(pole)

    const flag = this._buildFlag(spec.color)
    flag.position.set(x + flagX, height + 20, z + flagZ + 1.4)
    this.scene.add(flag)

    this.scene.add(group)

    // Register simple box colliders for player/bot ground support (approximate).
    for (const [w, h, d, px, py, pz] of [[34, 13, 34, 0, 6.5, 0], [24, 6, 24, 0, 16, 0]]) {
      this.colliders.push({
        center: new THREE.Vector3(x + px, height + py, z + pz),
        half: new THREE.Vector3(w / 2, h / 2, d / 2),
        team,
      })
    }

    return {
      team, spec, group,
      flag,
      flagHome: new THREE.Vector3(x + flagX, height + 1, z + flagZ),
      flagRest: new THREE.Vector3(x + flagX, height + 20, z + flagZ + 1.4),
      flagCarrier: null,
      spawn: new THREE.Vector3(x + (team === 'blue' ? 52 : -52), height, z),
      core: new THREE.Vector3(x, height + 8, z),
    }
  }

  _buildFlag(color) {
    const group = new THREE.Group()
    const clothGeo = new THREE.PlaneGeometry(6, 3.4, 12, 4)
    const clothMat = new THREE.MeshStandardMaterial({
      color, emissive: color, emissiveIntensity: 0.55, side: THREE.DoubleSide, roughness: 0.8,
    })
    const cloth = new THREE.Mesh(clothGeo, clothMat)
    cloth.position.set(3.2, -1.4, 0)
    cloth.castShadow = true
    group.add(cloth)
    group.userData.cloth = cloth
    group.userData.base = clothGeo.attributes.position.array.slice()
    return group
  }

  _buildProps() {
    const rng = makeRng(24601)
    const rockGeo = new THREE.IcosahedronGeometry(1, 1)
    // Perturb rock vertices for a craggy silhouette.
    {
      const p = rockGeo.attributes.position
      const r2 = makeRng(7)
      for (let i = 0; i < p.count; i++) {
        const f = 0.72 + r2() * 0.6
        p.setXYZ(i, p.getX(i) * f, p.getY(i) * f * 0.8, p.getZ(i) * f)
      }
      rockGeo.computeVertexNormals()
    }
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x6c7078, roughness: 0.95, metalness: 0.05, flatShading: true })
    const ROCK_COUNT = 240
    const rocks = new THREE.InstancedMesh(rockGeo, rockMat, ROCK_COUNT)
    rocks.castShadow = rocks.receiveShadow = true
    const dummy = new THREE.Object3D()
    const n = new THREE.Vector3()
    let ri = 0
    for (let i = 0; i < ROCK_COUNT * 6 && ri < ROCK_COUNT; i++) {
      const x = (rng() - 0.5) * 680
      const z = (rng() - 0.5) * 680
      if (this._nearBase(x, z, 66)) continue
      if (this._nearVehicleHome(x, z, 16)) continue
      this.terrain.normalAt(x, z, n)
      if (n.y < 0.55) continue
      const s = 1.2 + rng() * 4.5
      const gy = this.terrain.heightAt(x, z)
      dummy.position.set(x, gy - s * 0.2, z)
      dummy.rotation.set(rng() * 0.4, rng() * Math.PI * 2, rng() * 0.4)
      dummy.scale.set(s, s * (0.7 + rng() * 0.5), s)
      dummy.updateMatrix()
      rocks.setMatrixAt(ri++, dummy.matrix)
      if (s > 1.6) this.rockSpots.push({ x, y: gy, z, s })
    }
    rocks.count = ri
    rocks.instanceMatrix.needsUpdate = true
    this.scene.add(rocks)

    // Conifer trees.
    const trunkGeo = new THREE.CylinderGeometry(0.28, 0.45, 4.4, 6)
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3626, roughness: 1 })
    const canopyGeo = new THREE.ConeGeometry(2.4, 9, 7)
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0x3c6048, roughness: 0.9, flatShading: true })
    const TREE_COUNT = 340
    const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, TREE_COUNT)
    const canopies = new THREE.InstancedMesh(canopyGeo, canopyMat, TREE_COUNT)
    trunks.castShadow = canopies.castShadow = true
    trunks.receiveShadow = canopies.receiveShadow = true
    const palette = [0x3c6048, 0x35604f, 0x2f5340, 0x466b4d, 0x3a6b58].map(h => new THREE.Color(h))
    const tint = new THREE.Color()
    let ti = 0
    for (let i = 0; i < TREE_COUNT * 8 && ti < TREE_COUNT; i++) {
      const x = (rng() - 0.5) * 700
      const z = (rng() - 0.5) * 700
      if (this._nearBase(x, z, 60)) continue
      if (this._nearVehicleHome(x, z, 14)) continue
      const h = this.terrain.heightAt(x, z)
      this.terrain.normalAt(x, z, n)
      if (n.y < 0.82 || h > 34) continue
      const s = 0.7 + rng() * 0.9
      this.treeSpots.push({ x, y: h, z, s })
      dummy.position.set(x, h + 2.2 * s, z)
      dummy.rotation.set(0, rng() * Math.PI * 2, 0)
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      trunks.setMatrixAt(ti, dummy.matrix)
      dummy.position.set(x, h + (4.4 + 4.5) * s, z)
      dummy.updateMatrix()
      canopies.setMatrixAt(ti, dummy.matrix)
      canopies.setColorAt(ti, tint.copy(palette[ti % palette.length]).offsetHSL(0, 0, (rng() - 0.5) * 0.08))
      ti++
    }
    trunks.count = canopies.count = ti
    trunks.instanceMatrix.needsUpdate = true
    canopies.instanceMatrix.needsUpdate = true
    if (canopies.instanceColor) canopies.instanceColor.needsUpdate = true
    this.scene.add(trunks, canopies)
  }

  _nearBase(x, z, r) {
    for (const b of this.terrain.bases) {
      if (Math.hypot(x - b.x, z - b.z) < r) return true
    }
    return false
  }

  update(dt, elapsed, camera) {
    // Animate flags (cloth wave + carried flags bob).
    for (const team of ['blue', 'red']) {
      const b = this.bases[team]
      const cloth = b.flag.userData.cloth
      const base = b.flag.userData.base
      const pos = cloth.geometry.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const x = base[i * 3]
        const y = base[i * 3 + 1]
        const wave = Math.sin(x * 1.6 - elapsed * 6 + y * 1.2) * 0.32 * ((x + 3) / 6)
        pos.setZ(i, base[i * 3 + 2] + wave)
      }
      pos.needsUpdate = true
      cloth.geometry.computeVertexNormals()
      b.flag.rotation.y = Math.sin(elapsed * 1.5) * 0.12
    }
    // Keep sun shadow frustum anchored around the camera.
    if (camera) {
      this.sun.position.copy(camera.position).add(SUN_DIR.clone().multiplyScalar(320))
      this.sun.target.position.copy(camera.position)
      this.sun.target.updateMatrixWorld()
    }
  }
}
