import * as THREE from 'three'
import { makeRng } from '../core/noise.js'
import { TEAM } from '../world/World.js'

const _v = new THREE.Vector3()
const _to = new THREE.Vector3()

function buildBody(color) {
  const group = new THREE.Group()
  const armor = new THREE.MeshStandardMaterial({ color: 0x3d4650, roughness: 0.55, metalness: 0.5 })
  const teamMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.05, roughness: 0.35, metalness: 0.3 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x1a1f26, roughness: 0.8, metalness: 0.2 })

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.0, 0.55), armor)
  torso.position.y = 1.25
  const chest = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.35, 0.6), teamMat)
  chest.position.y = 1.45
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.44), armor)
  head.position.y = 1.95
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.14, 0.06), new THREE.MeshStandardMaterial({ color: 0x66d9ff, emissive: 0x66d9ff, emissiveIntensity: 1.6 }))
  visor.position.set(0, 1.96, 0.23)
  const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 0.3), dark)
  backpack.position.set(0, 1.4, -0.38)
  const packGlow = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.08), teamMat)
  packGlow.position.set(0, 1.4, -0.55)

  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.85, 0.32), dark)
  legL.position.set(-0.24, 0.45, 0)
  const legR = legL.clone(); legR.position.x = 0.24
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.8, 0.26), armor)
  armL.position.set(-0.6, 1.25, 0)
  const armR = armL.clone(); armR.position.x = 0.6
  const gun = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.9), dark)
  gun.position.set(0.6, 1.2, 0.4)

  for (const m of [torso, chest, head, visor, backpack, packGlow, legL, legR, armL, armR, gun]) {
    m.castShadow = true
    group.add(m)
  }
  group.userData = { visor, chest, packGlow, legL, legR, armL, armR }
  return group
}

export class Bot {
  constructor(game, team, position, index = 0) {
    this.game = game
    this.team = team
    this.spec = TEAM[team]
    this.name = `${this.spec.name}-${index + 1}`
    this.position = position.clone()
    this.velocity = new THREE.Vector3()
    this.radius = 0.7
    this.bodyOffset = 1.0
    this.hp = 100
    this.maxHp = 100
    this.alive = true
    this.onGround = false
    this.respawnTimer = 0
    this.fireTimer = 1 + Math.random() * 2.5
    this.strafeDir = Math.random() < 0.5 ? -1 : 1
    this.strafeTimer = 1 + Math.random() * 2
    this.jetTimer = 2 + Math.random() * 4
    this.jetBurst = 0
    this.yaw = 0
    this.walkPhase = 0
    this.hitFlash = 0
    this.target = null
    this.home = position.clone()
    this.rng = makeRng((Math.random() * 1e9) | 0)

    this.mesh = buildBody(this.spec.color)
    this.mesh.position.copy(this.position)
    this.game.scene.add(this.mesh)
  }

  takeDamage(amount) {
    if (!this.alive) return
    this.hp -= amount
    this.hitFlash = 0.15
    if (this.hp <= 0) this.die()
  }

  die() {
    this.alive = false
    this.mesh.visible = false
    this.game.effects.explosion(this.position.clone().setY(this.position.y + 1), { radius: 5, color: this.spec.color })
    this.game.audio.explosion()
    this.respawnTimer = 4 + Math.random() * 4
  }

  respawn() {
    const base = this.game.world.bases[this.team]
    const a = this.rng() * Math.PI * 2
    const r = 18 + this.rng() * 55
    this.position.set(base.core.x + Math.cos(a) * r, 0, base.core.z + Math.sin(a) * r)
    this.position.y = this.game.world.terrain.heightAt(this.position.x, this.position.z)
    this.home.copy(this.position)
    this.velocity.set(0, 0, 0)
    this.hp = this.maxHp
    this.alive = true
    this.mesh.visible = true
    this.hitFlash = 0
    this.fireTimer = 1 + this.rng() * 2.5
    this.strafeTimer = 1 + this.rng() * 2
    this.jetTimer = 2 + this.rng() * 4
    this.jetBurst = 0
  }

  update(dt, opponents, elapsed) {
    if (!this.alive) {
      this.respawnTimer -= dt
      if (this.respawnTimer <= 0) this.respawn()
      return
    }
    const world = this.game.world

    // Acquire the nearest living opponent.
    let target = null
    let bestD = Infinity
    for (const o of opponents) {
      if (!o.alive) continue
      const d = this.position.distanceToSquared(o.position)
      if (d < bestD) { bestD = d; target = o }
    }
    this.target = target

    const speed = 12
    let wishX = 0, wishZ = 0
    let dist = Infinity
    if (target) {
      _to.subVectors(target.position, this.position)
      _to.y = 0
      dist = _to.length()
      _to.normalize()
      const preferredMin = 22, preferredMax = 55
      if (dist > preferredMax) { wishX += _to.x; wishZ += _to.z }
      else if (dist < preferredMin) { wishX -= _to.x; wishZ -= _to.z }
      this.strafeTimer -= dt
      if (this.strafeTimer <= 0) { this.strafeDir *= -1; this.strafeTimer = 1 + this.rng() * 2 }
      wishX += -_to.z * this.strafeDir * 0.9
      wishZ += _to.x * this.strafeDir * 0.9
    } else {
      // Drift back toward home / patrol.
      _to.subVectors(this.home, this.position); _to.y = 0
      if (_to.lengthSq() > 900) { _to.normalize(); wishX = _to.x; wishZ = _to.z }
      else { wishX = Math.sin(elapsed * 0.5 + this.position.x) * 0.5; wishZ = Math.cos(elapsed * 0.4 + this.position.z) * 0.5 }
    }
    const wl = Math.hypot(wishX, wishZ) || 1
    wishX /= wl; wishZ /= wl

    const accel = this.onGround ? 60 : 18
    this.velocity.x += wishX * accel * dt
    this.velocity.z += wishZ * accel * dt

    const fr = Math.pow(this.onGround ? 0.0009 : 0.35, dt)
    this.velocity.x *= fr
    this.velocity.z *= fr
    const hs = Math.hypot(this.velocity.x, this.velocity.z)
    if (hs > speed) { this.velocity.x *= speed / hs; this.velocity.z *= speed / hs }

    // Jetpack bursts.
    this.jetTimer -= dt
    if (this.jetTimer <= 0 && this.onGround) {
      this.jetBurst = 0.5 + this.rng() * 0.5
      this.jetTimer = 3 + this.rng() * 5
    }
    if (this.jetBurst > 0) {
      this.jetBurst -= dt
      this.velocity.y += 42 * dt
      this.onGround = false
      if (Math.random() < 0.6) {
        this.game.effects.spawnBurst(this.position.clone().setY(this.position.y + 0.4), {
          count: 1, speed: 3, life: 0.4, size: 8, color: 0xffb060, gravity: -2, spread: 0.4,
        })
      }
    }

    this.velocity.y -= 26 * dt
    this.position.addScaledVector(this.velocity, dt)

    const gY = world.terrain.heightAt(this.position.x, this.position.z)
    if (this.position.y <= gY) {
      this.position.y = gY
      if (this.velocity.y < 0) this.velocity.y = 0
      this.onGround = true
    } else {
      this.onGround = false
    }
    if (this.position.y < -50) { this.position.y = 60; this.velocity.set(0, 0, 0) }

    const lim = 340
    this.position.x = THREE.MathUtils.clamp(this.position.x, -lim, lim)
    this.position.z = THREE.MathUtils.clamp(this.position.z, -lim, lim)

    // Face the target (or travel direction).
    const faceX = target ? target.position.x - this.position.x : this.velocity.x
    const faceZ = target ? target.position.z - this.position.z : this.velocity.z
    if (Math.abs(faceX) + Math.abs(faceZ) > 0.01) {
      const targetYaw = Math.atan2(faceX, faceZ)
      let dy = targetYaw - this.yaw
      while (dy > Math.PI) dy -= Math.PI * 2
      while (dy < -Math.PI) dy += Math.PI * 2
      this.yaw += dy * Math.min(1, dt * 6)
    }

    // Shooting.
    if (target) {
      this.fireTimer -= dt
      const canSee = dist < 150 && this._hasLineOfSight(target)
      if (this.fireTimer <= 0 && canSee) {
        this.fireTimer = 1.7 + this.rng() * 1.9
        this._fire(target)
      }
    }

    this._animate(dt)
    this.mesh.position.copy(this.position)
    this.mesh.rotation.y = this.yaw
  }

  _hasLineOfSight(target) {
    const from = this.position.clone().setY(this.position.y + 1.4)
    const to = target.position.clone().setY(target.position.y + (target.bodyOffset ?? 1))
    const steps = Math.max(2, Math.ceil(from.distanceTo(to) / 4))
    const p = new THREE.Vector3()
    for (let i = 1; i < steps; i++) {
      p.lerpVectors(from, to, i / steps)
      if (p.y <= this.game.world.terrain.heightAt(p.x, p.z)) return false
    }
    return true
  }

  _fire(target) {
    const origin = this.position.clone()
    origin.y += 1.4
    origin.x += Math.sin(this.yaw) * 0.8
    origin.z += Math.cos(this.yaw) * 0.8
    const aim = target.position.clone().setY(target.position.y + (target.bodyOffset ?? 1))
    aim.addScaledVector(target.velocity, 0.14)
    const dir = aim.sub(origin).normalize()
    const spread = 0.035
    dir.x += (this.rng() - 0.5) * spread
    dir.y += (this.rng() - 0.5) * spread
    dir.z += (this.rng() - 0.5) * spread
    this.game.spawnProjectile({
      origin, dir, speed: 62, gravity: 12, ownerTeam: this.team, owner: this,
      weapon: 'SPINFUSOR', damage: 22, splash: 5, color: this.spec.color,
    })
    this.game.audio.shot('disc')
    this.game.effects.showMuzzle(origin, this.mesh.quaternion)
  }

  _animate(dt) {
    const u = this.mesh.userData
    const hs = Math.hypot(this.velocity.x, this.velocity.z)
    if (this.onGround && hs > 0.5) this.walkPhase += dt * (4 + hs * 0.5)
    const swing = Math.sin(this.walkPhase) * Math.min(0.6, hs * 0.05)
    u.legL.rotation.x = swing
    u.legR.rotation.x = -swing
    u.armL.rotation.x = -swing * 0.6
    if (this.hitFlash > 0) {
      this.hitFlash -= dt
      const on = this.hitFlash > 0
      u.visor.material.emissiveIntensity = on ? 4 : 1.6
    }
    if (!this.onGround) u.chest.rotation.x = -0.15
    else u.chest.rotation.x *= Math.pow(0.02, dt)
  }
}
