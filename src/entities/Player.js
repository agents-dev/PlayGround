import * as THREE from 'three'
import { Viewmodel } from './Viewmodel.js'

const EYE = 1.62
const GRAVITY = 26
const WALK_SPEED = 10
const SKI_MAX = 46

export const WEAPONS = [
  { name: 'SPINFUSOR', kind: 'disc', mag: 6, reserve: 24, cooldown: 0.82, reload: 2.4, speed: 68, gravity: 13, damage: 55, splash: 7.5, color: 0x66d9ff },
  { name: 'CHAINGUN', kind: 'chain', mag: 150, reserve: 450, cooldown: 0.08, reload: 3.0, speed: 400, damage: 12, spread: 0.022, color: 0xffd27a },
]

const _fwd = new THREE.Vector3()
const _right = new THREE.Vector3()
const _wish = new THREE.Vector3()
const _n = new THREE.Vector3()
const _camPos = new THREE.Vector3()
const _camTarget = new THREE.Vector3()

export class Player {
  constructor({ camera, world, input, effects, audio, game }) {
    this.camera = camera
    this.world = world
    this.input = input
    this.effects = effects
    this.audio = audio
    this.game = game

    this.position = new THREE.Vector3()
    this.velocity = new THREE.Vector3()
    this.yaw = 0
    this.pitch = 0
    this.onGround = false
    this.isJetpacking = false
    this.isSkiing = false
    this.radius = 0.62
    this.bodyOffset = 1.0
    this.team = 'blue'

    this.maxHealth = 100
    this.health = 100
    this.maxEnergy = 100
    this.energy = 100
    this.alive = true
    this.respawnTimer = 0
    this.kills = 0
    this.deaths = 0
    this.speed = 0

    this.weaponIndex = 0
    this.weapons = WEAPONS.map(w => ({ ...w, ammo: w.mag, reserve: w.reserve, cooldown: 0, reloading: 0 }))
    this.fireHeld = false
    this.reloadHint = false

    this.viewmodel = new Viewmodel(camera)
    this._localMuzzlePos = new THREE.Vector3()
    this._localMuzzleQuat = new THREE.Quaternion()
    this.footTimer = 0
    this.sens = 0.0022

    this.vehicle = null
    this._footRadius = this.radius
    this._footBodyOffset = this.bodyOffset
  }

  enterVehicle(vehicle) {
    if (this.vehicle || !vehicle || !vehicle.alive || vehicle.driver) return false
    this.vehicle = vehicle
    vehicle.enter(this)
    this._footRadius = this.radius
    this._footBodyOffset = this.bodyOffset
    this.radius = vehicle.radius
    this.bodyOffset = vehicle.bodyOffset
    this.viewmodel.root.visible = false
    this.game.ui.toast(`BOARDING ${vehicle.name}`, 1.4)
    this.audio.ui()
    return true
  }

  exitVehicle() {
    const v = this.vehicle
    if (!v) return
    v.exit()
    this.vehicle = null
    this.radius = this._footRadius ?? 0.62
    this.bodyOffset = this._footBodyOffset ?? 1.0
    const rx = Math.cos(v.yaw), rz = -Math.sin(v.yaw)
    this.position.copy(v.position)
    this.position.x += rx * (v.radius + 1.4)
    this.position.z += rz * (v.radius + 1.4)
    this.position.y = this.groundHeight(this.position.x, this.position.z)
    this.velocity.set(0, 0, 0)
    this.onGround = true
    this.viewmodel.root.visible = true
  }

  updateDriving(dt) {
    const v = this.vehicle
    v.drive(dt, this)
    this.position.copy(v.position)
    this.velocity.copy(v.velocity)
    v.cameraPosition(_camPos)
    v.cameraTarget(_camTarget)
    this.camera.position.copy(_camPos)
    this.camera.lookAt(_camTarget)
    if (this.input.wasPressed('KeyE')) this.exitVehicle()
  }

  spawn(position) {
    if (this.vehicle) { this.vehicle.exit(); this.vehicle = null }
    this.radius = this._footRadius ?? 0.62
    this.bodyOffset = this._footBodyOffset ?? 1.0
    this.viewmodel.root.visible = true
    this.position.copy(position)
    this.position.y = this.world.terrain.heightAt(position.x, position.z)
    this.velocity.set(0, 0, 0)
    this.health = this.maxHealth
    this.energy = this.maxEnergy
    this.alive = true
    this.yaw = Math.atan2(position.x, position.z)
    this.pitch = 0
    for (const w of this.weapons) { w.ammo = w.mag; w.reserve = w.reserve }
    this.updateCamera(0)
  }

  groundHeight(x, z) {
    let g = this.world.terrain.heightAt(x, z)
    for (const c of this.world.colliders) {
      if (Math.abs(x - c.center.x) < c.half.x + 0.4 && Math.abs(z - c.center.z) < c.half.z + 0.4) {
        const top = c.center.y + c.half.y
        if (this.position.y > top - 1.2) g = Math.max(g, top)
      }
    }
    return g
  }

  update(dt, elapsed) {
    if (!this.alive) {
      this.respawnTimer -= dt
      if (this.respawnTimer <= 0) this.respawn()
      this.updateCamera(dt)
      return
    }
    if (this.vehicle) { this.updateDriving(dt); return }
    const input = this.input
    if (input.locked) {
      this.yaw -= input.mouse.dx * this.sens
      this.pitch -= input.mouse.dy * this.sens
      this.pitch = THREE.MathUtils.clamp(this.pitch, -1.53, 1.53)
    }

    const axes = input.axes()
    _fwd.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw))
    _right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw))
    _wish.copy(_fwd).multiplyScalar(axes.z).addScaledVector(_right, axes.x)

    const ski = input.isDown('ShiftLeft') || input.isDown('ShiftRight') || input.isDown('ControlLeft')
    const jetKey = input.isDown('Space')

    // Horizontal acceleration.
    const accel = this.onGround ? (ski ? 26 : 70) : 22
    this.velocity.x += _wish.x * accel * dt
    this.velocity.z += _wish.z * accel * dt

    // Friction.
    let friction
    if (this.onGround && ski) friction = 0.996
    else if (this.onGround) friction = 0.0006
    else friction = 0.4
    const fr = Math.pow(friction, dt)
    this.velocity.x *= fr
    this.velocity.z *= fr

    this.isJetpacking = false
    if (jetKey && this.energy > 1) {
      this.velocity.y += 52 * dt
      this.energy = Math.max(0, this.energy - 33 * dt)
      this.isJetpacking = true
      if (Math.random() < 0.9) {
        const origin = this.position.clone().setY(this.position.y + 0.3)
        origin.x -= _fwd.x * 0.3; origin.z -= _fwd.z * 0.3
        this.effects.spawnBurst(origin, { count: 1, speed: 4, life: 0.45, size: 9, color: Math.random() < 0.5 ? 0xffb24a : 0xfff0c0, gravity: -3, spread: 0.4 })
      }
    }
    if (!this.isJetpacking) {
      const regen = this.onGround ? 26 : 10
      this.energy = Math.min(this.maxEnergy, this.energy + regen * dt)
    }
    this.audio.setJetpack(this.isJetpacking ? 1 : 0)

    this.velocity.y -= GRAVITY * dt

    // Ski slope acceleration.
    if (this.onGround && ski) {
      this.world.terrain.normalAt(this.position.x, this.position.z, _n)
      const slope = Math.hypot(_n.x, _n.z)
      if (slope > 0.02) {
        this.velocity.x += (_n.x / slope) * GRAVITY * slope * 1.15 * dt
        this.velocity.z += (_n.z / slope) * GRAVITY * slope * 1.15 * dt
      }
    }

    // Clamp horizontal speed. Airborne momentum is preserved so ski runs and
    // jetpack boosts carry through the air (core Tribes traversal feel).
    const maxSpeed = this.onGround ? (ski ? SKI_MAX : WALK_SPEED) : 60
    const hs = Math.hypot(this.velocity.x, this.velocity.z)
    if (hs > maxSpeed) {
      const k = 1 - Math.min(1, (hs - maxSpeed) / hs) * Math.min(1, dt * 6)
      this.velocity.x *= k
      this.velocity.z *= k
    }

    this.position.addScaledVector(this.velocity, dt)

    const gY = this.groundHeight(this.position.x, this.position.z)
    if (this.position.y <= gY) {
      const wasAir = !this.onGround
      if (this.velocity.y < -18 && wasAir) {
        this.effects.spawnBurst(this.position.clone(), { count: 8, speed: 4, life: 0.4, size: 6, color: 0xbcd0dd, gravity: 4, spread: 0.6 })
      }
      this.position.y = gY
      if (this.velocity.y < 0) this.velocity.y = 0
      this.onGround = true
    } else {
      this.onGround = false
    }
    if (this.position.y < -80) { this.position.set(0, 60, 0); this.velocity.set(0, 0, 0) }
    const lim = 350
    this.position.x = THREE.MathUtils.clamp(this.position.x, -lim, lim)
    this.position.z = THREE.MathUtils.clamp(this.position.z, -lim, lim)

    this.speed = Math.hypot(this.velocity.x, this.velocity.z)
    this.isSkiing = ski && this.onGround && this.speed > 4

    // Footsteps.
    if (this.onGround && this.speed > 1.5) {
      this.footTimer -= dt * this.speed * 0.12
      if (this.footTimer <= 0) { this.footTimer = 1; this.audio.footstep() }
    }

    // Weapons.
    for (const w of this.weapons) {
      if (w.cooldown > 0) w.cooldown -= dt
      if (w.reloading > 0) {
        w.reloading -= dt
        if (w.reloading <= 0) {
          const need = w.mag - w.ammo
          const take = Math.min(need, w.reserve)
          w.ammo += take
          w.reserve -= take
        }
      }
    }
    if (this.input.wasPressed('Digit1') && this.weaponIndex !== 0) { this.weaponIndex = 0; this.viewmodel.setWeapon(0) }
    if (this.input.wasPressed('Digit2') && this.weaponIndex !== 1) { this.weaponIndex = 1; this.viewmodel.setWeapon(1) }
    const w = this.weapons[this.weaponIndex]
    if (this.input.wasPressed('KeyR')) this.reload()
    w.reloadHint = w.ammo <= 0
    this.reloadHint = w.reloadHint

    if (input.locked && input.mouse.left && this.game.active) {
      if (w.kind === 'chain') this.fire()
      else if (input.mousePressed) this.fire()
    }
    this.fireHeld = input.mouse.left

    this.updateCamera(dt)
    this.viewmodel.update(dt, this.speed, this.speed > 0.6, input.mouse.dx, input.mouse.dy, elapsed)
  }

  reload() {
    const w = this.weapons[this.weaponIndex]
    if (w.reloading > 0 || w.ammo >= w.mag || w.reserve <= 0) return
    w.reloading = w.reload
    this.audio.ui()
  }

  fire() {
    const w = this.weapons[this.weaponIndex]
    if (w.cooldown > 0 || w.reloading > 0) return
    if (w.ammo <= 0) { this.reload(); return }
    w.ammo--
    w.cooldown = WEAPONS[this.weaponIndex].cooldown

    const origin = this.camera.getWorldPosition(new THREE.Vector3())
    const dir = this.camera.getWorldDirection(new THREE.Vector3())
    const muzzle = this.camera.getWorldPosition(new THREE.Vector3())
    // Offset the muzzle a touch toward the model.
    const rightV = new THREE.Vector3().crossVectors(dir, this.camera.up).normalize()
    muzzle.addScaledVector(rightV, 0.18).addScaledVector(this.camera.up, -0.12)

    if (w.kind === 'disc') {
      const spread = 0.006
      dir.x += (Math.random() - 0.5) * spread
      dir.y += (Math.random() - 0.5) * spread
      dir.z += (Math.random() - 0.5) * spread
      this.game.spawnProjectile({
        origin: muzzle, dir, speed: w.speed, gravity: w.gravity,
        ownerTeam: this.team, owner: this, weapon: w.name,
        damage: w.damage, splash: w.splash, color: w.color,
      })
      this.audio.shot('disc')
      this.effects.addShake(0.28)
    } else {
      dir.x += (Math.random() - 0.5) * w.spread * 2
      dir.y += (Math.random() - 0.5) * w.spread * 2
      dir.z += (Math.random() - 0.5) * w.spread * 2
      dir.normalize()
      const rayOrigin = origin.clone().addScaledVector(dir, 1.2)
      this.game.projectiles.hitscan({
        origin: rayOrigin, dir, range: 220, damage: w.damage, ownerTeam: this.team,
        owner: this, weapon: w.name,
      })
      this.audio.shot('chain')
      this.effects.addShake(0.05)
    }
    this.viewmodel.fire(w.kind)
    this.viewmodel.muzzleWorld(this._localMuzzlePos, this._localMuzzleQuat)
    this.effects.showMuzzle(this._localMuzzlePos, this._localMuzzleQuat)
    this.game.onPlayerFired()
  }

  updateCamera(dt) {
    const shake = this.effects.shake
    const sx = (Math.random() - 0.5) * shake * 0.12
    const sy = (Math.random() - 0.5) * shake * 0.12
    this.camera.position.set(this.position.x + sx, this.position.y + EYE + sy, this.position.z)
    this.camera.rotation.order = 'YXZ'
    this.camera.rotation.y = this.yaw + (Math.random() - 0.5) * shake * 0.02
    this.camera.rotation.x = this.pitch + (Math.random() - 0.5) * shake * 0.02
    this.camera.rotation.z = 0
  }

  takeDamage(amount, source, splash = false) {
    if (!this.alive) return
    // While driving, incoming damage is absorbed by the vehicle.
    if (this.vehicle && this.vehicle.alive) {
      this.vehicle.takeDamage(amount)
      this.game.onPlayerDamaged(amount, source)
      return
    }
    this.health -= amount
    this.game.onPlayerDamaged(amount, source)
    this.audio.hit(false)
    if (this.health <= 0) {
      this.health = 0
      this.die()
    }
  }

  die() {
    if (this.vehicle) { this.vehicle.exit(); this.vehicle = null }
    this.radius = this._footRadius ?? 0.62
    this.bodyOffset = this._footBodyOffset ?? 1.0
    this.viewmodel.root.visible = true
    this.alive = false
    this.deaths++
    this.respawnTimer = 3
    this.effects.explosion(this.position.clone().setY(this.position.y + 1), { radius: 6, color: 0x66d9ff })
    this.audio.explosion()
    this.game.onPlayerDeath(this)
  }

  respawn() {
    const base = this.world.bases.blue
    this.spawn(base.spawn)
    this.game.onPlayerRespawn()
  }
}
