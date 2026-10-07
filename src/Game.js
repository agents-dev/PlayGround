import * as THREE from 'three'
import { Input } from './core/Input.js'
import { World } from './world/World.js'
import { Effects } from './fx/Effects.js'
import { AudioEngine } from './audio/Audio.js'
import { Projectiles } from './combat/Projectiles.js'
import { Player } from './entities/Player.js'
import { Bot } from './entities/Bot.js'
import { Vehicle, VEHICLE_TYPES } from './vehicles/Vehicle.js'
import { Physics } from './physics/Physics.js'
import { TERRAIN_SIZE } from './world/Terrain.js'
import { HUD } from './ui/HUD.js'

const MAX_SCORE = 15
const BOT_COUNT = 5

const _blast = new THREE.Vector3()
const _ram = new THREE.Vector3()
const _actor = new THREE.Vector3()

export class Game {
  constructor(canvas) {
    this.canvas = canvas
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.14

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(78, window.innerWidth / window.innerHeight, 0.1, 3200)
    this.scene.add(this.camera)
    this.camera.rotation.order = 'YXZ'

    this.input = new Input(canvas)
    this.world = new World(this.scene, this.renderer)
    // Rigid-body world: terrain heightfield + base/prop statics (Rapier, WASM ready in main.js).
    this.physics = new Physics({
      size: TERRAIN_SIZE,
      heightAt: (x, z) => this.world.terrain.heightAt(x, z),
      boxColliders: this.world.colliders,
      padColliders: this.world.padColliders,
      treeSpots: this.world.treeSpots,
      rockSpots: this.world.rockSpots,
    })
    this.effects = new Effects(this.scene)
    this.audio = new AudioEngine()
    this.ui = new HUD()

    this.projectiles = new Projectiles({
      scene: this.scene,
      world: this.world,
      effects: this.effects,
      targetProvider: (team) => this.targetsFor(team),
      onDamage: (target, amount, point, splash, owner, weapon) => this.handleDamage(target, amount, point, splash, owner, weapon),
      onBlast: (point, ownerTeam, damage, splash) => this.damageVehicles(point, ownerTeam, damage, splash),
    })

    this.player = new Player({
      camera: this.camera, world: this.world, input: this.input,
      effects: this.effects, audio: this.audio, game: this,
    })
    this.player.spawn(this.world.bases.blue.spawn)

    this.bots = []
    for (const team of ['blue', 'red']) {
      const base = this.world.bases[team]
      for (let i = 0; i < BOT_COUNT; i++) {
        const a = Math.random() * Math.PI * 2
        const r = 18 + Math.random() * 60
        const pos = new THREE.Vector3(base.core.x + Math.cos(a) * r, 0, base.core.z + Math.sin(a) * r)
        this.bots.push(new Bot(this, team, pos, i))
      }
    }

    this.vehicles = []
    this._spawnVehicles()

    this.scores = { blue: 0, red: 0 }
    this.state = 'menu'
    this.active = false
    this.elapsed = 0
    this.carriedFlag = null
    this._last = performance.now()
    this._raf = 0

    this._bind()
  }

  _bind() {
    window.addEventListener('resize', () => this.onResize())
    this.input.onLockChange = (locked) => {
      if (this.state !== 'playing') return
      if (!locked) this.pause()
    }
    this.input.onLockError = () => { if (this.state === 'playing') this.pause() }
    this.ui.el.play.addEventListener('click', () => this.start())
    this.ui.el.resume.addEventListener('click', () => this.resume())
    document.getElementById('how').addEventListener('click', () => {
      this.ui.toast('WASD move · SPACE jetpack · SHIFT ski · E vehicles · CLICK fire · 1/2 weapons', 3.2)
    })
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        if (this.state === 'playing') this.pause()
      }
      if (e.code === 'KeyM') { this.audio.setMuted(!this.audio.muted); this.ui.toast(this.audio.muted ? 'AUDIO MUTED' : 'AUDIO ON') }
    })
  }

  onResize() {
    const w = window.innerWidth, h = window.innerHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
  }

  start() {
    this.audio.init()
    this.audio.resume()
    this.resetMatch()
    this.state = 'playing'
    this.active = true
    this.ui.hideMenu()
    this.ui.hidePause()
    this.ui.hideLoading()
    this.ui.showHud()
    this.player.spawn(this.world.bases.blue.spawn)
    this.player.updateCamera(0)
    this._lock()
    this.ui.toast('JET. SKI. STRIKE.', 1.6)
    if (!this._raf) this.loop()
  }

  _lock() {
    const p = this.input.requestLock()
    if (p && typeof p.catch === 'function') p.catch(() => this.pause())
  }

  resetMatch() {
    this.scores = { blue: 0, red: 0 }
    this.carriedFlag = null
    for (const team of ['blue', 'red']) {
      const base = this.world.bases[team]
      base.flagCarrier = null
      base.flag.position.copy(base.flagRest)
    }
    this.player.kills = 0
    this.player.deaths = 0
    for (const b of this.bots) {
      b.hp = b.maxHp
      b.alive = false
      b.mesh.visible = false
      b.respawn()
    }
    for (const v of this.vehicles) {
      v.driver = null
      v.respawn()
    }
  }

  pause() {
    if (this.state !== 'playing') return
    this.state = 'paused'
    this.active = false
    this.input.exitLock()
    this.ui.showPause()
  }

  resume() {
    this.state = 'playing'
    this.active = true
    this.ui.hidePause()
    this.audio.resume()
    this._lock()
  }

  _spawnVehicles() {
    for (const team of ['blue', 'red']) {
      for (const h of this.world.vehicleHomes[team]) {
        const y = this.world.terrain.heightAt(h.x, h.z) + 1
        this.vehicles.push(new Vehicle(this, this.physics, h.type, team, new THREE.Vector3(h.x, y, h.z), h.yaw))
      }
    }
  }

  nearestVehicle(position, radius) {
    let best = null
    let bestD = radius * radius
    for (const v of this.vehicles) {
      if (!v.alive || v.driver) continue
      const d = position.distanceToSquared(v.position)
      if (d < bestD) { bestD = d; best = v }
    }
    return best
  }

  targetsFor(ownerTeam) {
    const out = []
    if (this.player.team !== ownerTeam && this.player.alive) out.push(this.player)
    for (const b of this.bots) {
      if (b.team !== ownerTeam && b.alive) out.push(b)
    }
    return out
  }

  spawnProjectile(opts) {
    return this.projectiles.spawn(opts)
  }

  handleDamage(target, amount, point, splash, owner = null, weapon = 'DISC') {
    if (!target.alive) return
    const isPlayer = target === this.player
    target.takeDamage(amount, point, splash)
    if (!isPlayer) {
      const killed = !target.alive
      this.ui.hit(killed)
      if (killed) this.ui.toast('TARGET DOWN', 1.0)
    }
    if (target.alive) return
    // Award the kill to the attacker's team (no score for self/friendly fire).
    const killerTeam = owner?.team ?? owner?.teamKey ?? null
    if (!killerTeam || killerTeam === target.team) return
    this.scores[killerTeam]++
    const killerName = owner === this.player ? 'YOU' : (owner?.name ?? (killerTeam === 'blue' ? 'AZURE' : 'CRIMSON'))
    const victimName = isPlayer ? 'YOU' : (target.name ?? 'UNKNOWN')
    this.ui.addKillFeed(killerName, victimName, weapon, killerTeam !== this.player.team)
    if (owner === this.player) this.player.kills++
    this.audio.hit(true)
    if (this.scores.blue >= MAX_SCORE) this.endMatch(true)
    else if (this.scores.red >= MAX_SCORE) this.endMatch(false)
  }

  onPlayerFired() { this.ui.fireFeedback() }

  onPlayerDeath() {
    if (this.carriedFlag) this.returnFlag(this.carriedFlag)
  }

  onVehicleDestroyed(vehicle) {
    if (vehicle.driver === this.player) {
      this.player.exitVehicle()
      this.player.takeDamage(25, null, true)
      this.ui.toast('VEHICLE DESTROYED', 1.6)
    }
    vehicle.driver = null
  }

  // Splash damage against rigid-body vehicles (no friendly fire).
  damageVehicles(point, ownerTeam, damage, splash) {
    for (const v of this.vehicles) {
      if (!v.alive || v.teamKey === ownerTeam) continue
      _blast.copy(v.position)
      _blast.y += v.bodyOffset
      const d = _blast.distanceTo(point)
      if (d < splash + 2) {
        const falloff = 1 - Math.min(1, d / (splash + 2))
        v.takeDamage(damage * (0.3 + falloff * 0.7))
      }
    }
  }

  handleCrashes(crashes) {
    for (const { vehicle, speed } of crashes) {
      if (!vehicle.alive) continue
      const dmg = (speed - 13) * 5
      vehicle.takeDamage(dmg)
      this.effects.spawnBurst(vehicle.position.clone().setY(vehicle.position.y + 1), {
        count: 10, speed: 6, life: 0.4, size: 8, color: 0xffcf7a, gravity: 8, spread: 0.8,
      })
      this.effects.addShake(0.3)
      if (vehicle.driver === this.player) this.ui.toast('HULL IMPACT', 0.8)
    }
  }

  // Rigid chassis shove kinematic actors out of the way; fast opposing
  // vehicles ram for damage.
  resolveVehicleActors() {
    const actors = [this.player, ...this.bots]
    for (const v of this.vehicles) {
      if (!v.alive) continue
      _ram.copy(v.position)
      _ram.y += v.bodyOffset * 0.5
      for (const a of actors) {
        if (!a.alive || a.vehicle) continue
        _actor.copy(a.position)
        _actor.y += 1.0
        const rr = v.radius + (a.radius ?? 0.7) + 0.4
        const dx = _actor.x - _ram.x, dy = _actor.y - _ram.y, dz = _actor.z - _ram.z
        const d = Math.hypot(dx, dy, dz)
        if (d < rr && d > 1e-4) {
          const push = (rr - d) / d
          a.position.x += dx * push
          a.position.z += dz * push
          if (a.velocity && v.speed > 9 && a.team !== v.teamKey) {
            a.velocity.x += dx * push * 6
            a.velocity.z += dz * push * 6
            a.velocity.y += 4
            this.handleDamage(a, 45, a.position.clone(), false, v.driver ?? v, v.type.weapon.name)
          }
        }
      }
    }
  }

  onPlayerDamaged() { this.ui.damageIndicator() }
  onPlayerRespawn() { this.ui.toast('REDEPLOYED', 1.2) }

  returnFlag(team) {
    const base = this.world.bases[team]
    base.flagCarrier = null
    base.flag.position.copy(base.flagRest)
    if (this.carriedFlag === team) this.carriedFlag = null
  }

  updateFlags(dt) {
    const player = this.player
    if (!player.alive) return
    const red = this.world.bases.red
    const blue = this.world.bases.blue

    // Pick up the enemy (red) flag.
    if (!this.carriedFlag && !red.flagCarrier) {
      const d = Math.hypot(player.position.x - red.flagHome.x, player.position.z - red.flagHome.z)
      if (d < 7 && Math.abs(player.position.y - red.flagHome.y) < 16) {
        red.flagCarrier = player
        this.carriedFlag = 'red'
        this.ui.toast('ENEMY FLAG TAKEN — RETURN IT HOME', 2.2)
        this.audio.ui()
      }
    }
    if (this.carriedFlag === 'red') {
      red.flag.position.set(player.position.x, player.position.y + 2.4, player.position.z)
      // Capture at own stand.
      const d = Math.hypot(player.position.x - blue.flagHome.x, player.position.z - blue.flagHome.z)
      if (d < 7) {
        this.scores.blue++
        this.ui.toast('FLAG CAPTURED!', 2)
        this.ui.addKillFeed('YOU', 'FLAG', 'CAPTURE', false)
        this.returnFlag('red')
        if (this.scores.blue >= MAX_SCORE) this.endMatch(true)
      }
    }
  }

  endMatch(won) {
    this.state = 'over'
    this.active = false
    this.input.exitLock()
    this.ui.toast(won ? 'MATCH WON — AZURE DOMINATES' : 'MATCH LOST — CRIMSON PREVAILS', 5)
    setTimeout(() => {
      this.resetMatch()
      this.player.spawn(this.world.bases.blue.spawn)
      this.ui.showMenu()
      this.ui.hideHud()
      this.state = 'menu'
    }, 5000)
  }

  loop = () => {
    this._raf = requestAnimationFrame(this.loop)
    const now = performance.now()
    const dt = Math.min(0.05, (now - this._last) / 1000)
    this._last = now
    this.elapsed += dt

    if (this.state === 'playing') {
      // Rigid-body simulation first; vehicles sync from their bodies after.
      const crashes = this.physics.step(dt)
      for (const v of this.vehicles) {
        if (v.driver === this.player) continue
        v.update(dt, this.elapsed)
      }
      for (const v of this.vehicles) v.syncFromBody()
      this.handleCrashes(crashes)
      this.resolveVehicleActors()
      this.player.update(dt, this.elapsed)
      if (this.player.alive && !this.player.vehicle && this.input.wasPressed('KeyE')) {
        const v = this.nearestVehicle(this.player.position, 8)
        if (v) this.player.enterVehicle(v)
      }
      for (const b of this.bots) b.update(dt, this.targetsFor(b.team), this.elapsed)
      this.projectiles.update(dt)
      this.updateFlags(dt)
      const near = (!this.player.vehicle && this.player.alive) ? this.nearestVehicle(this.player.position, 8) : null
      this.ui.setEnterPrompt(near ? near.name : null)
      this.ui.update(dt, this.player, this.scores)
    } else {
      // Idle camera drift on menu.
      if (this.state === 'menu') {
        const t = this.elapsed * 0.08
        this.camera.position.set(Math.cos(t) * 180, 70 + Math.sin(t * 0.6) * 12, Math.sin(t) * 180)
        this.camera.lookAt(0, 8, 0)
      }
    }

    this.world.update(dt, this.elapsed, this.state === 'playing' ? this.camera : null)
    this.effects.update(dt)
    this.input.endFrame()
    // The menu is an opaque overlay; skip the expensive 3D render so UI events stay responsive.
    if (this.state !== 'menu') this.renderer.render(this.scene, this.camera)
  }
}
