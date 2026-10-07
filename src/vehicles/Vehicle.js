import * as THREE from 'three'
import { TEAM } from '../world/World.js'

// Vehicles are true rigid bodies simulated by Rapier:
// - tank / buggy: DynamicRayCastVehicleController (spring suspension per wheel,
//   tire friction, steering, engine force) over a heightfield + static colliders
// - interceptor: force/torque-driven flight body with real collisions
const _fwd = new THREE.Vector3()
const _tmp = new THREE.Vector3()
const _up = new THREE.Vector3()
const _axis = new THREE.Vector3()
const _quat = new THREE.Quaternion()

export const VEHICLE_TYPES = {
  tank: {
    key: 'tank', name: 'TANK', kind: 'ground',
    hp: 650, mass: 1100, half: { x: 2.2, y: 0.6, z: 3.0 }, meshOffsetY: -0.55,
    radius: 3.2, bodyOffset: 1.7, camDist: 9, camHeight: 3.6,
    wheels: [
      { x: -1.7, z: -2.2, steer: true }, { x: 1.7, z: -2.2, steer: true },
      { x: -1.7, z: 2.2 }, { x: 1.7, z: 2.2 },
    ],
    connY: -0.35, rest: 0.7, wheelRadius: 0.55,
    susp: { stiff: 46, comp: 7, relax: 11, travel: 0.45, maxForce: 120000, slip: 9, side: 1 },
    engine: 2600, steerMax: 0.5, maxSpeed: 13,
    weapon: { name: 'CANNON', kind: 'shell', cooldown: 1.3, damage: 80, splash: 10, speed: 95, gravity: 22 },
  },
  car: {
    key: 'car', name: 'BUGGY', kind: 'ground',
    hp: 260, mass: 550, half: { x: 1.25, y: 0.35, z: 2.2 }, meshOffsetY: -0.4,
    radius: 1.9, bodyOffset: 0.9, camDist: 7.5, camHeight: 2.8,
    wheels: [
      { x: -1.45, z: -1.55, steer: true }, { x: 1.45, z: -1.55, steer: true },
      { x: -1.45, z: 1.55 }, { x: 1.45, z: 1.55 },
    ],
    connY: -0.15, rest: 0.5, wheelRadius: 0.6,
    susp: { stiff: 30, comp: 5, relax: 8, travel: 0.4, maxForce: 60000, slip: 7, side: 1 },
    engine: 1500, steerMax: 0.55, maxSpeed: 34,
    weapon: { name: 'CHAIN MG', kind: 'mg', cooldown: 0.09, damage: 9, spread: 0.02, range: 200 },
  },
  ship: {
    key: 'ship', name: 'INTERCEPTOR', kind: 'air',
    hp: 240, mass: 320, half: { x: 1.1, y: 0.8, z: 2.6 }, meshOffsetY: 0,
    radius: 2.1, bodyOffset: 1.0, camDist: 11, camHeight: 3.1,
    thrust: 62, vertical: 46, maxSpeed: 85,
    weapon: { name: 'PLASMA', kind: 'plasma', cooldown: 0.14, damage: 14, splash: 3, speed: 170, gravity: 2 },
  },
}

function mat(color, emissive = 0, rough = 0.5, metal = 0.55) {
  return new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: emissive ? 1.1 : 0, roughness: rough, metalness: metal })
}

function buildTank(spec) {
  const g = new THREE.Group()
  const hullMat = mat(0x3a434d)
  const teamMat = mat(spec.color, spec.color, 0.4, 0.4)
  const darkMat = mat(0x1b2026, 0, 0.85, 0.3)

  const hull = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.3, 6.4), hullMat)
  hull.position.y = 1.2
  const skirt = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.7, 6.0), teamMat)
  skirt.position.y = 0.75
  const turretBase = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.7, 0.9, 12), hullMat)
  turretBase.position.set(0, 2.2, 0.2)
  const turret = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.9, 2.6), teamMat)
  turret.position.set(0, 2.75, -0.2)
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 5.2, 12), darkMat)
  barrel.rotation.x = Math.PI / 2
  barrel.position.set(0, 2.75, -3.2)
  const mantlet = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.9, 1.0), hullMat)
  mantlet.position.set(0, 2.75, -1.6)

  const trackL = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 6.8), darkMat)
  trackL.position.set(-2.3, 0.65, 0)
  const trackR = trackL.clone(); trackR.position.x = 2.3

  const headlightL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.12), teamMat)
  headlightL.position.set(-1.4, 1.4, -3.2)
  const headlightR = headlightL.clone(); headlightR.position.x = 1.4

  for (const m of [hull, skirt, turretBase, turret, barrel, mantlet, trackL, trackR, headlightL, headlightR]) {
    m.castShadow = true; m.receiveShadow = true; g.add(m)
  }
  g.userData.turret = turret
  g.userData.turretBase = turretBase
  g.userData.barrel = barrel
  g.userData.wheels = []
  g.userData.teamMat = teamMat
  return g
}

function buildCar(spec) {
  const g = new THREE.Group()
  const bodyMat = mat(0x2f6d5a, 0, 0.45, 0.5)
  const teamMat = mat(spec.color, spec.color, 0.4, 0.4)
  const darkMat = mat(0x15191e, 0, 0.9, 0.3)

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.6, 4.6), bodyMat)
  chassis.position.y = 0.95
  const nose = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.45, 1.4), teamMat)
  nose.position.set(0, 0.95, -2.4)
  const cockpit = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.8, 1.8), bodyMat)
  cockpit.position.set(0, 1.5, 0.4)
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.55, 1.4), mat(0x0d2136, 0, 0.15, 0.9))
  canopy.position.set(0, 1.85, 0.1)
  const roll = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.16, 0.16), darkMat)
  roll.position.set(0, 2.15, 0.9)
  const spoiler = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.14, 0.7), teamMat)
  spoiler.position.set(0, 1.6, 2.4)

  // Wheel meshes wrapped in steer groups so suspension travel, spin and
  // steering can be applied independently from the raycast controller state.
  const wheels = []
  const wheelGroups = []
  for (const [x, z] of [[-1.5, -1.6], [1.5, -1.6], [-1.5, 1.6], [1.5, 1.6]]) {
    const steer = new THREE.Group()
    steer.position.set(x, 0.6, z)
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.5, 12), darkMat)
    w.rotation.z = Math.PI / 2
    w.castShadow = true
    steer.add(w)
    g.add(steer)
    wheels.push(w)
    wheelGroups.push(steer)
  }
  for (const m of [chassis, nose, cockpit, canopy, roll, spoiler]) { m.castShadow = true; g.add(m) }
  g.userData.wheels = wheels
  g.userData.wheelGroups = wheelGroups
  g.userData.teamMat = teamMat
  return g
}

function buildShip(spec) {
  const g = new THREE.Group()
  const hullMat = mat(0x454f5c)
  const teamMat = mat(spec.color, spec.color, 0.35, 0.45)
  const darkMat = mat(0x12161b, 0, 0.7, 0.4)

  const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.3, 6.5, 10), hullMat)
  fuselage.rotation.x = Math.PI / 2
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.9, 2.2, 10), teamMat)
  nose.rotation.x = -Math.PI / 2
  nose.position.z = -4.3
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.6, 2.2), mat(0x0d2136, 0, 0.15, 0.9))
  canopy.position.set(0, 0.6, -1.6)

  const wingL = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.22, 1.9), hullMat)
  wingL.position.set(-2.4, 0, 0.8)
  wingL.rotation.z = 0.08
  const wingR = wingL.clone(); wingR.position.x = 2.4; wingR.rotation.z = -0.08
  const tipL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.9, 1.2), teamMat)
  tipL.position.set(-4.4, 0.2, 0.9)
  const tipR = tipL.clone(); tipR.position.x = 4.4

  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.8, 1.6), hullMat)
  tail.position.set(0, 1.0, 2.6)
  const tailFin = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.0, 1.2), teamMat)
  tailFin.position.set(0, 1.9, 2.9)

  const engineGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 1.2, 10), mat(0x66d9ff, 0x66d9ff, 0.3, 0.2))
  engineGlow.rotation.x = Math.PI / 2
  engineGlow.position.z = 3.2
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.7, 2.4, 10), new THREE.MeshBasicMaterial({ color: spec.color === 0x39a9ff ? 0x66d9ff : 0xff8a5a, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false }))
  flame.rotation.x = -Math.PI / 2
  flame.position.z = 4.7

  for (const m of [fuselage, nose, canopy, wingL, wingR, tipL, tipR, tail, tailFin, engineGlow, flame]) {
    m.castShadow = true; g.add(m)
  }
  g.userData.flame = flame
  g.userData.teamMat = teamMat
  g.userData.wheels = []
  return g
}

export class Vehicle {
  constructor(game, physics, typeKey, team, position, yaw = 0) {
    this.game = game
    this.physics = physics
    this.type = VEHICLE_TYPES[typeKey]
    this.teamKey = team
    this.spec = TEAM[team]
    this.kind = this.type.kind
    this.name = `${this.spec.name} ${this.type.name}`
    this.maxHp = this.type.hp
    this.hp = this.maxHp
    this.alive = true
    this.radius = this.type.radius
    this.bodyOffset = this.type.bodyOffset
    this.position = position.clone()
    this.velocity = new THREE.Vector3()
    this.speed = 0
    this.yaw = yaw
    this.pitch = 0
    this.cmdYaw = yaw
    this.cmdPitch = 0
    this.lookYaw = 0
    this.lookPitch = 0
    this.driver = null
    this.weaponCooldown = 0
    this.hitTimer = 0
    this.respawnTimer = 0
    this.wheelSpin = 0
    this.throttleVisual = 0
    this._preSpeed = 0
    this._steerCmd = 0
    this._engineCmd = 0
    this._brakeCmd = 0

    if (typeKey === 'tank') this.mesh = buildTank(this.spec)
    else if (typeKey === 'car') this.mesh = buildCar(this.spec)
    else this.mesh = buildShip(this.spec)

    this.home = position.clone()
    this.homeYaw = yaw

    const { body, collider } = physics.createChassis({
      position, yaw,
      halfExtents: this.type.half,
      mass: this.type.mass,
      angularDamping: this.kind === 'air' ? 5.0 : 3.5,
    })
    this.body = body
    this.collider = collider
    physics.registerVehicle(this, collider)

    if (this.kind === 'ground') {
      this.controller = physics.createVehicleController(body)
      const t = this.type
      t.wheels.forEach((w) => {
        this.controller.addWheel(
          { x: w.x, y: t.connY, z: w.z },
          { x: 0, y: -1, z: 0 },
          { x: 1, y: 0, z: 0 },
          t.rest, t.wheelRadius
        )
      })
      for (let i = 0; i < this.controller.numWheels(); i++) {
        this.controller.setWheelSuspensionStiffness(i, t.susp.stiff)
        this.controller.setWheelSuspensionCompression(i, t.susp.comp)
        this.controller.setWheelSuspensionRelaxation(i, t.susp.relax)
        this.controller.setWheelMaxSuspensionForce(i, t.susp.maxForce)
        this.controller.setWheelMaxSuspensionTravel(i, t.susp.travel)
        this.controller.setWheelFrictionSlip(i, t.susp.slip)
        this.controller.setWheelSideFrictionStiffness(i, t.susp.side)
      }
      this._excludeSelf = (col) => col.handle !== this.collider.handle
    } else {
      this.controller = null
      this._excludeSelf = null
    }

    this.mesh.position.copy(position)
    this.mesh.rotation.order = 'YXZ'
    this.mesh.rotation.y = yaw
    this.game.scene.add(this.mesh)
    this.syncFromBody()
  }

  enter(actor) {
    this.driver = actor
    this.syncFromBody()
    this.cmdYaw = this.yaw
    this.cmdPitch = this.pitch
  }
  exit() { this.driver = null }

  takeDamage(amount) {
    if (!this.alive) return
    this.hp -= amount
    this.hitTimer = 0.12
    if (this.hp <= 0) this.destroy()
  }

  destroy() {
    this.alive = false
    this.hp = 0
    this._scorch(true)
    this.game.effects.explosion(this.position.clone().setY(this.position.y + this.bodyOffset), { radius: 8, color: this.spec.color })
    this.game.effects.explosion(this.position.clone().setY(this.position.y + 1), { radius: 5, color: 0xffa030 })
    this.game.audio.explosion()
    this.respawnTimer = 9
    this.game.onVehicleDestroyed(this)
  }

  respawn() {
    this.alive = true
    this.hp = this.maxHp
    this.yaw = this.homeYaw
    this.pitch = 0
    this.cmdYaw = this.homeYaw
    this.cmdPitch = 0
    this.lookYaw = 0
    this.lookPitch = 0
    const p = this.home
    this.body.setTranslation({ x: p.x, y: p.y, z: p.z }, true)
    this.body.setRotation({ x: 0, y: Math.sin(this.homeYaw / 2), z: 0, w: Math.cos(this.homeYaw / 2) }, true)
    this.body.setLinvel({ x: 0, y: 0, z: 0 }, true)
    this.body.setAngvel({ x: 0, y: 0, z: 0 }, true)
    this._scorch(false)
    this.syncFromBody()
  }

  _scorch(on) {
    this.mesh.traverse((o) => {
      const m = o.material
      if (!m || !m.isMeshStandardMaterial) return
      if (on) {
        if (!o.userData._saved) {
          o.userData._saved = { c: m.color.getHex(), e: m.emissive.getHex(), ei: m.emissiveIntensity }
        }
        m.color.setHex(0x1a1d20)
        m.emissive.setHex(0x000000)
        m.emissiveIntensity = 0
      } else if (o.userData._saved) {
        m.color.setHex(o.userData._saved.c)
        m.emissive.setHex(o.userData._saved.e)
        m.emissiveIntensity = o.userData._saved.ei
        o.userData._saved = null
      }
    })
  }

  aimDir(out) {
    const yaw = this.kind === 'air' ? this.cmdYaw : this.yaw + this.lookYaw
    const pitch = this.kind === 'air' ? this.cmdPitch : this.lookPitch
    out.set(-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch))
    return out.normalize()
  }

  cameraPosition(out) {
    this.aimDir(_fwd)
    out.copy(this.position)
    out.y += this.type.camHeight
    out.addScaledVector(_fwd, -this.type.camDist)
    const ground = this.game.world.terrain.heightAt(out.x, out.z) + 1.2
    if (out.y < ground) out.y = ground
    return out
  }

  cameraTarget(out) {
    this.aimDir(_fwd)
    out.copy(this.position)
    out.y += this.bodyOffset
    out.addScaledVector(_fwd, 14)
    return out
  }

  // Per-frame (render rate): read driver intent, fire weapons.
  drive(dt, player) {
    if (!this.alive) return
    const input = this.game.input
    const axes = input.axes()
    const sens = 0.0022

    if (input.locked) {
      if (this.kind === 'air') {
        this.cmdYaw -= input.mouse.dx * sens
        this.cmdPitch = THREE.MathUtils.clamp(this.cmdPitch - input.mouse.dy * sens, -1.2, 1.2)
      } else {
        this.lookYaw = THREE.MathUtils.clamp(this.lookYaw - input.mouse.dx * sens, -2.7, 2.7)
        this.lookPitch = THREE.MathUtils.clamp(this.lookPitch - input.mouse.dy * sens, -0.55, 0.55)
      }
    }

    if (this.kind === 'air') {
      this._throttleVisual = axes.z
      this._spaceHeld = input.isDown('Space')
      this._shiftHeld = input.isDown('ShiftLeft') || input.isDown('ShiftRight')
    } else {
      // Steering tapers at speed for stability; engine tapers near top speed.
      const speedFactor = Math.min(1, this.speed / Math.max(1, this.type.maxSpeed))
      this._steerCmd = -axes.x * this.type.steerMax * (1 - speedFactor * 0.65)
      const taper = THREE.MathUtils.clamp(1 - speedFactor, 0, 1)
      if (axes.z > 0.05) {
        this._engineCmd = this.type.engine * taper
        this._brakeCmd = 0
      } else if (axes.z < -0.05) {
        if (this._forwardSpeed() > 1.5) { this._engineCmd = 0; this._brakeCmd = this.type.engine * 1.6 }
        else { this._engineCmd = -this.type.engine * 0.55 * Math.min(1, 1 - this.speed / 8); this._brakeCmd = 0 }
      } else {
        this._engineCmd = 0
        this._brakeCmd = this.type.engine * 0.35
      }
      this.throttleVisual = Math.abs(axes.z)
    }

    this.weaponCooldown -= dt
    if (input.locked && input.mouse.left && this.weaponCooldown <= 0) this.fire(player)

    if (this.hitTimer > 0) this.hitTimer -= dt
    this._applyHitFlash()
  }

  _forwardSpeed() {
    _fwd.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw))
    return this.velocity.dot(_fwd)
  }

  // Per physics substep: apply suspension/steering/engine or flight forces.
  preStep(dt) {
    if (!this.alive) return
    if (this.kind === 'ground') {
      const n = this.controller.numWheels()
      for (let i = 0; i < n; i++) {
        const steerable = !!this.type.wheels[i]?.steer
        this.controller.setWheelSteering(i, steerable ? this._steerCmd : 0)
        this.controller.setWheelEngineForce(i, this._engineCmd)
        this.controller.setWheelBrake(i, this._brakeCmd)
      }
      this.controller.updateVehicle(dt, this.physics.R.QueryFilterFlags.EXCLUDE_SENSORS, undefined, this._excludeSelf)
      this._stabilityAssist(dt)
    } else {
      this._flyStep(dt)
    }
  }

  _stabilityAssist(dt) {
    // Gentle self-righting torque so flips recover instead of stranding the driver.
    const q = this.body.rotation()
    _quat.set(q.x, q.y, q.z, q.w)
    _up.set(0, 1, 0).applyQuaternion(_quat)
    _axis.crossVectors(_up, { x: 0, y: 1, z: 0 })
    const tilt = _axis.length()
    if (tilt > 0.08) {
      const strength = (tilt > 1.2 ? 26 : 7) * this.type.mass
      _axis.normalize()
      this.body.applyTorqueImpulse({ x: _axis.x * strength * dt, y: _axis.y * strength * dt, z: _axis.z * strength * dt }, true)
    }
  }

  _flyStep(dt) {
    // Attitude-hold flight assist toward the commanded yaw/pitch + thrust.
    const qy = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.cmdYaw)
    const qp = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.cmdPitch)
    _quat.copy(qy).multiply(qp)
    const cur = this.body.rotation()
    const qc = new THREE.Quaternion(cur.x, cur.y, cur.z, cur.w)
    const qErr = _quat.clone().multiply(qc.clone().invert())
    let angle = 2 * Math.acos(THREE.MathUtils.clamp(qErr.w, -1, 1))
    if (angle > Math.PI) angle -= Math.PI * 2
    const s = Math.sqrt(Math.max(0, 1 - qErr.w * qErr.w))
    if (s > 1e-4 && Math.abs(angle) > 1e-3) {
      _axis.set(qErr.x / s, qErr.y / s, qErr.z / s)
      const kp = 24 * this.type.mass
      const kd = 14 * this.type.mass
      const av = this.body.angvel()
      this.body.applyTorqueImpulse({
        x: (_axis.x * angle * kp - av.x * kd) * dt,
        y: (_axis.y * angle * kp - av.y * kd) * dt,
        z: (_axis.z * angle * kp - av.z * kd) * dt,
      }, true)
    }
    // Thrust along body forward + vertical lift (impulse = force * dt).
    const f = this.body.rotation()
    _quat.set(f.x, f.y, f.z, f.w)
    _fwd.set(0, 0, -1).applyQuaternion(_quat)
    const m = this.type.mass
    const th = this._throttleVisual || 0
    const lift = (this._spaceHeld ? this.type.vertical : 0) - (this._shiftHeld ? this.type.vertical : 0)
    this.body.applyImpulse({
      x: _fwd.x * th * this.type.thrust * m * dt,
      y: _fwd.y * th * this.type.thrust * m * dt + lift * m * dt,
      z: _fwd.z * th * this.type.thrust * m * dt,
    }, true)
    // Cap top speed.
    const lv = this.body.linvel()
    const sp = Math.hypot(lv.x, lv.y, lv.z)
    if (sp > this.type.maxSpeed) {
      const k = this.type.maxSpeed / sp
      this.body.setLinvel({ x: lv.x * k, y: lv.y * k, z: lv.z * k }, true)
    }
    this.throttleVisual = Math.abs(th)
  }

  fire(driver) {
    const w = this.type.weapon
    this.weaponCooldown = w.cooldown
    this.aimDir(_fwd)
    const origin = this.position.clone()
    origin.y += this.bodyOffset
    origin.addScaledVector(_fwd, this.kind === 'tank' ? 4 : 2.4)
    const color = this.spec.color

    if (w.kind === 'mg') {
      const dir = _fwd.clone()
      dir.x += (Math.random() - 0.5) * w.spread * 2
      dir.y += (Math.random() - 0.5) * w.spread * 2
      dir.z += (Math.random() - 0.5) * w.spread * 2
      this.game.projectiles.hitscan({
        origin, dir, range: w.range, damage: w.damage, ownerTeam: this.teamKey, owner: driver, weapon: w.name,
      })
      this.game.audio.shot('chain')
      this.game.effects.addShake(0.05)
    } else {
      const spread = w.kind === 'shell' ? 0.004 : 0.02
      const dir = _fwd.clone()
      dir.x += (Math.random() - 0.5) * spread
      dir.y += (Math.random() - 0.5) * spread
      dir.z += (Math.random() - 0.5) * spread
      this.game.spawnProjectile({
        origin, dir, speed: w.speed, gravity: w.gravity, ownerTeam: this.teamKey,
        owner: driver, weapon: w.name, damage: w.damage, splash: w.splash,
        color: w.kind === 'shell' ? 0xffd166 : color, size: w.kind === 'shell' ? 1.4 : 1,
      })
      this.game.audio.shot('disc')
      this.game.effects.addShake(w.kind === 'shell' ? 0.35 : 0.08)
    }
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, this.kind === 'air' ? this.cmdYaw : this.yaw + this.lookYaw, 0))
    this.game.effects.showMuzzle(origin, q)
  }

  syncFromBody() {
    const t = this.body.translation()
    const r = this.body.rotation()
    this.position.set(t.x, t.y, t.z)
    const v = this.body.linvel()
    this.velocity.set(v.x, v.y, v.z)
    this.speed = Math.hypot(v.x, v.z)
    // Yaw/pitch extraction (YXZ).
    const qx = r.x, qy = r.y, qz = r.z, qw = r.w
    this.yaw = Math.atan2(2 * (qw * qy + qx * qz), 1 - 2 * (qy * qy + qx * qx))
    this.pitch = Math.asin(THREE.MathUtils.clamp(2 * (qw * qx - qy * qz), -1, 1))

    this.mesh.position.set(t.x, t.y + this.type.meshOffsetY, t.z)
    this.mesh.quaternion.set(qx, qy, qz, qw)
    if (this.kind === 'ground') {
      if (this.mesh.userData.turret) this.mesh.userData.turret.rotation.y = this.lookYaw
      if (this.mesh.userData.turretBase) this.mesh.userData.turretBase.rotation.y = this.lookYaw
      if (this.mesh.userData.barrel) {
        this.mesh.userData.barrel.rotation.x = Math.PI / 2 - this.lookPitch
        this.mesh.userData.barrel.position.set(
          Math.sin(this.lookYaw) * 2.6, 2.75 + Math.sin(this.lookPitch) * 1.4, -Math.cos(this.lookYaw) * 2.3
        )
      }
      this._syncWheels()
    } else {
      if (this.mesh.userData.flame) {
        this.mesh.userData.flame.scale.setScalar(0.7 + this.throttleVisual * 0.6 + Math.random() * 0.12)
      }
    }
    if (this.position.y < -80 || Math.abs(this.position.x) > 700 || Math.abs(this.position.z) > 700) {
      this.respawn()
    }
  }

  _syncWheels() {
    const groups = this.mesh.userData.wheelGroups
    if (!groups || !this.controller) return
    const t = this.type
    for (let i = 0; i < groups.length && i < this.controller.numWheels(); i++) {
      const len = this.controller.wheelSuspensionLength(i) ?? t.rest
      groups[i].position.y = 0.6 - (t.rest - len) * 0.9
      const wheels = this.mesh.userData.wheels
      if (wheels?.[i]) wheels[i].rotation.x = this.wheelSpin
      if (t.wheels[i]?.steer) groups[i].rotation.y = this._steerCmd
    }
    this.wheelSpin += this.speed * 0.033 * 1.6
  }

  _applyHitFlash() {
    const tm = this.mesh.userData.teamMat
    if (tm) tm.emissiveIntensity = this.hitTimer > 0 ? 3.2 : 1.1
  }

  update(dt, elapsed) {
    if (!this.alive) {
      this.respawnTimer -= dt
      if (this.respawnTimer <= 0) this.respawn()
      return
    }
    if (this.hitTimer > 0) this.hitTimer -= dt
    this._applyHitFlash()
    if (this.mesh.userData.flame && !this.driver) {
      this.mesh.userData.flame.scale.setScalar(0.8 + Math.sin(elapsed * 20) * 0.15)
    }
  }
}
