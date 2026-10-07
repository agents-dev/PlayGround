import * as THREE from 'three'

function metal(color, rough = 0.5, metal = 0.62) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal })
}

function buildSpinfusor() {
  const g = new THREE.Group()
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.8), metal(0x3b4550))
  body.position.set(0, 0, -0.2)
  g.add(body)
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.9, 16), metal(0x2a323b))
  barrel.rotation.x = Math.PI / 2
  barrel.position.set(0, 0.02, -0.85)
  g.add(barrel)
  const muzzle = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.03, 8, 20), metal(0x39a9ff, 0.3, 0.7))
  muzzle.position.set(0, 0.02, -1.28)
  g.add(muzzle)
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.05, 20), new THREE.MeshStandardMaterial({ color: 0x66d9ff, emissive: 0x39a9ff, emissiveIntensity: 1.2 }))
  disc.rotation.z = Math.PI / 2
  disc.rotation.y = Math.PI / 2
  disc.position.set(0, 0.02, -1.15)
  g.add(disc)
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.28, 0.12), metal(0x171b20))
  grip.position.set(0, -0.22, 0.02)
  grip.rotation.x = -0.2
  g.add(grip)
  const sight = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, 0.12), new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xffb020, emissiveIntensity: 0.8 }))
  sight.position.set(0, 0.16, -0.35)
  g.add(sight)
  g.userData.muzzleOffset = new THREE.Vector3(0, 0.02, -1.35)
  return g
}

function buildChaingun() {
  const g = new THREE.Group()
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.26, 0.7), metal(0x3b4550))
  body.position.set(0, 0, -0.1)
  g.add(body)
  const barrels = new THREE.Group()
  for (let i = 0; i < 6; i++) {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.9, 8), metal(0x252c34))
    const a = (i / 6) * Math.PI * 2
    b.position.set(Math.cos(a) * 0.085, Math.sin(a) * 0.085, -0.75)
    b.rotation.x = Math.PI / 2
    barrels.add(b)
  }
  g.add(barrels)
  g.userData.barrels = barrels
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.025, 8, 20), metal(0x3a4149))
  ring.position.set(0, 0, -1.2)
  g.add(ring)
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.28, 0.12), metal(0x171b20))
  grip.position.set(0, -0.24, 0.05)
  grip.rotation.x = -0.2
  g.add(grip)
  const mag = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.3, 0.22), metal(0x22282f))
  mag.position.set(0, -0.28, -0.12)
  g.add(mag)
  g.userData.muzzleOffset = new THREE.Vector3(0, 0, -1.3)
  return g
}

export class Viewmodel {
  constructor(camera) {
    this.camera = camera
    this.root = new THREE.Group()
    this.root.position.set(0.3, -0.27, -0.6)
    this.root.scale.setScalar(0.8)
    this.root.renderOrder = 2
    camera.add(this.root)

    this.spinfusor = buildSpinfusor()
    this.chaingun = buildChaingun()
    this.spinfusor.traverse(o => { o.renderOrder = 2; if (o.material) o.material.depthTest = true })
    this.chaingun.traverse(o => { o.renderOrder = 2; if (o.material) o.material.depthTest = true })
    this.root.add(this.spinfusor, this.chaingun)
    this.weapons = [this.spinfusor, this.chaingun]

    this.bobTime = 0
    this.recoil = 0
    this.sway = new THREE.Vector2()
    this.basePos = this.root.position.clone()
    this.current = 0
    this.setWeapon(0)
  }

  setWeapon(i) {
    this.current = i
    this.weapons.forEach((w, idx) => { w.visible = idx === i })
    this.recoil = 0.12
  }

  fire(kind) {
    this.recoil = kind === 'chain' ? 0.05 : 0.22
  }

  update(dt, speed, moving, mouseDX, mouseDY, elapsed) {
    this.bobTime += dt * (moving ? 6 + speed * 0.4 : 1.4)
    const bobAmt = Math.min(0.05, speed * 0.004)
    const bx = Math.cos(this.bobTime) * bobAmt
    const by = Math.abs(Math.sin(this.bobTime)) * bobAmt

    this.sway.x += (-mouseDX * 0.0008 - this.sway.x) * Math.min(1, dt * 10)
    this.sway.y += (-mouseDY * 0.0008 - this.sway.y) * Math.min(1, dt * 10)
    this.sway.x = THREE.MathUtils.clamp(this.sway.x, -0.05, 0.05)
    this.sway.y = THREE.MathUtils.clamp(this.sway.y, -0.05, 0.05)

    this.recoil = Math.max(0, this.recoil - dt * 1.6)
    const kick = this.recoil

    this.root.position.set(
      this.basePos.x + bx + this.sway.x,
      this.basePos.y + by + this.sway.y - kick * 0.04,
      this.basePos.z + kick * 0.12
    )
    this.root.rotation.set(
      this.sway.y * 1.5 - kick * 0.12,
      this.sway.x * 1.5,
      kick * 0.08
    )

    const w = this.weapons[this.current]
    if (w.userData.barrels) w.userData.barrels.rotation.z += dt * 30 * (1 + this.recoil * 8)
  }

  muzzleWorld(outPos, outQuat) {
    const w = this.weapons[this.current]
    const off = w.userData.muzzleOffset
    outPos.copy(off).applyMatrix4(w.matrixWorld)
    w.getWorldQuaternion(outQuat)
  }
}
