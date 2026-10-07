import * as THREE from 'three'

const _prev = new THREE.Vector3()
const _center = new THREE.Vector3()
const _dir = new THREE.Vector3()
const _seg = new THREE.Vector3()
const _toC = new THREE.Vector3()
const _point = new THREE.Vector3()

function makeDiscMesh(color) {
  const group = new THREE.Group()
  const core = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.35, 0.1, 18),
    new THREE.MeshBasicMaterial({ color })
  )
  core.rotation.x = Math.PI / 2
  group.add(core)
  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 12, 10),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false })
  )
  group.add(glow)
  return group
}

// Closest approach of a ray (origin, unit dir) to a sphere centre; returns distance along ray or -1.
function raySphere(origin, dir, center, radius) {
  _toC.subVectors(center, origin)
  const t = _toC.dot(dir)
  if (t < 0) return -1
  const distSq = _toC.lengthSq() - t * t
  const rSq = radius * radius
  if (distSq > rSq) return -1
  return t - Math.sqrt(rSq - distSq)
}

// Swept test against a segment to avoid tunnelling at high projectile speed.
function segmentSphere(a, b, center, radius) {
  _seg.subVectors(b, a)
  const lenSq = _seg.lengthSq()
  _toC.subVectors(center, a)
  let t = lenSq > 0 ? _toC.dot(_seg) / lenSq : 0
  t = Math.max(0, Math.min(1, t))
  _point.copy(a).addScaledVector(_seg, t)
  return _point.distanceToSquared(center) <= radius * radius
}

export class Projectiles {
  constructor({ scene, world, effects, targetProvider, onDamage, onBlast = null }) {
    this.scene = scene
    this.world = world
    this.effects = effects
    this.targetProvider = targetProvider
    this.onDamage = onDamage
    this.onBlast = onBlast
    this.list = []
  }

  spawn({ origin, dir, speed = 70, gravity = 14, ownerTeam, owner = null, weapon = 'DISC', damage = 55, splash = 7, color = 0x66d9ff, size = 1 }) {
    const mesh = makeDiscMesh(color)
    mesh.position.copy(origin)
    mesh.scale.setScalar(size)
    this.scene.add(mesh)
    const p = {
      mesh,
      pos: origin.clone(),
      vel: dir.clone().normalize().multiplyScalar(speed),
      gravity,
      ownerTeam,
      owner,
      weapon,
      damage,
      splash,
      color,
      life: 4,
      trailTimer: 0,
    }
    this.list.push(p)
    return p
  }

  _explode(p, point) {
    this.effects.explosion(point, { radius: p.splash * 0.9, color: p.color })
    this.onBlast?.(point, p.ownerTeam, p.damage, p.splash)
    const targets = this.targetProvider(p.ownerTeam)
    for (const t of targets) {
      if (!t.alive) continue
      const radius = t.radius ?? 1
      const d = t.position.distanceTo(point)
      if (d < p.splash + radius) {
        const falloff = 1 - Math.min(1, d / (p.splash + radius))
        this.onDamage(t, p.damage * (0.35 + falloff * 0.65), point, true, p.owner, p.weapon)
      }
    }
    // Self-splash enables disc-jumping (reduced damage + impulse).
    const owner = p.owner
    if (owner && owner.alive) {
      _center.copy(owner.position).setY(owner.position.y + (owner.bodyOffset ?? 1))
      const d = _center.distanceTo(point)
      if (d < p.splash * 1.15 && d > 1.2) {
        const falloff = 1 - Math.min(1, d / (p.splash * 1.15))
        owner.takeDamage?.(p.damage * 0.22 * falloff, point, true)
        if (owner.velocity) {
          _dir.subVectors(_center, point).normalize()
          const boost = 16 * falloff + 4
          owner.velocity.x += _dir.x * boost
          owner.velocity.z += _dir.z * boost
          owner.velocity.y += Math.max(0.35, _dir.y) * boost + 6
        }
      }
    }
    this.scene.remove(p.mesh)
    p.mesh.traverse(o => { o.geometry?.dispose?.(); o.material?.dispose?.() })
  }

  update(dt) {
    const world = this.world
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i]
      p.life -= dt
      p.vel.y -= p.gravity * dt
      _prev.copy(p.pos)
      p.pos.addScaledVector(p.vel, dt)

      // Trail.
      p.trailTimer -= dt
      if (p.trailTimer <= 0) {
        p.trailTimer = 0.02
        this.effects.spawnDirectional(p.pos, _dir.copy(p.vel).normalize().multiplyScalar(-0.4), {
          speed: 2, life: 0.4, size: 6, color: p.color, gravity: -2, drag: 0.9,
        })
      }

      _dir.copy(p.vel).normalize()

      let hit = null
      // Terrain (sample the swept segment for robustness).
      const steps = Math.max(1, Math.ceil(_prev.distanceTo(p.pos) / 2))
      for (let s = 1; s <= steps; s++) {
        _point.lerpVectors(_prev, p.pos, s / steps)
        if (_point.y <= world.terrain.heightAt(_point.x, _point.z)) { hit = _point.clone(); break }
      }
      // World colliders (base boxes).
      if (!hit) {
        for (const c of world.colliders) {
          const half = c.half
          if (segmentSphere(_prev, p.pos, c.center, Math.hypot(half.x, half.y, half.z))) { hit = p.pos.clone(); break }
        }
      }
      // Targets (swept to prevent tunnelling).
      if (!hit) {
        for (const t of this.targetProvider(p.ownerTeam)) {
          if (!t.alive) continue
          const r = (t.radius ?? 1) + 0.35
          _center.copy(t.position).setY(t.position.y + (t.bodyOffset ?? 1))
          if (segmentSphere(_prev, p.pos, _center, r)) { hit = p.pos.clone(); break }
        }
      }

      if (hit || p.life <= 0 || p.pos.y < -60) {
        this._explode(p, hit || p.pos.clone())
        this.list.splice(i, 1)
      } else {
        p.mesh.position.copy(p.pos)
        p.mesh.lookAt(_point.copy(p.pos).add(p.vel))
      }
    }
  }

  hitscan({ origin, dir, range = 200, damage, ownerTeam, owner = null, weapon = 'HITSCAN', onHit }) {
    const dirN = dir.clone().normalize()

    // Find the nearest solid obstacle first (terrain + base colliders).
    let obstacleDist = range
    const step = 1.5
    for (let d = 0; d < range; d += step) {
      const px = origin.x + dirN.x * d
      const py = origin.y + dirN.y * d
      const pz = origin.z + dirN.z * d
      if (py <= this.world.terrain.heightAt(px, pz)) { obstacleDist = d; break }
      let inBox = false
      for (const c of this.world.colliders) {
        if (Math.abs(px - c.center.x) < c.half.x && Math.abs(py - c.center.y) < c.half.y && Math.abs(pz - c.center.z) < c.half.z) { inBox = true; break }
      }
      if (inBox) { obstacleDist = d; break }
    }

    // Nearest live target strictly in front of the obstacle.
    let best = null
    let bestD = obstacleDist
    for (const t of this.targetProvider(ownerTeam)) {
      if (!t.alive) continue
      _center.copy(t.position).setY(t.position.y + (t.bodyOffset ?? 1))
      const d = raySphere(origin, dirN, _center, t.radius ?? 1)
      if (d >= 0 && d < bestD) { bestD = d; best = t }
    }

    let end
    if (best) {
      end = origin.clone().addScaledVector(dirN, bestD)
      this.onDamage(best, damage, end, false, owner, weapon)
      this.effects.impact(end, dirN.clone().negate(), 0xffd080)
      onHit?.(best, end)
    } else if (obstacleDist < range) {
      end = origin.clone().addScaledVector(dirN, obstacleDist)
      this.effects.impact(end, dirN.clone().negate(), 0xffd080)
    } else {
      end = origin.clone().addScaledVector(dirN, range)
    }
    this.effects.tracer(origin, end, 0xffe08a)
    return { end, hitSomething: !!best }
  }
}
