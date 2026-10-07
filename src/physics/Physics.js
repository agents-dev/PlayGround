import RAPIER from '@dimforge/rapier3d-compat'

// Production rigid-body physics (Rapier) backing all vehicles:
// - analytic terrain baked into a heightfield collider
// - static colliders for bases, trees and rocks
// - raycast suspension vehicles (tank / buggy) via DynamicRayCastVehicleController
// - force-driven flight body for the interceptor
// - fixed-timestep accumulator with crash event reporting
export const PHYS_DT = 1 / 60
const MAX_STEPS = 4
const HF_SUBDIVS = 150

export class Physics {
  static async ready() {
    await RAPIER.init()
  }

  constructor({ size, heightAt, boxColliders, padColliders, treeSpots, rockSpots, gravity = -20 }) {
    this.R = RAPIER
    this.size = size
    this.heightAt = heightAt
    this.world = new RAPIER.World({ x: 0, y: gravity, z: 0 })
    this.world.timestep = PHYS_DT
    this.acc = 0
    this.events = new RAPIER.EventQueue(true)
    this.vehicleByCollider = new Map()
    this.vehicles = []
    this._ray = new RAPIER.Ray({ x: 0, y: 1000, z: 0 }, { x: 0, y: -1, z: 0 })

    this._buildTerrain()
    this._buildStatics(boxColliders, padColliders, treeSpots, rockSpots)
    // Prime the query pipeline so raycasts work immediately.
    this.world.step()
  }

  _buildTerrain() {
    const N = HF_SUBDIVS
    const half = this.size / 2
    const heights = new Float32Array((N + 1) * (N + 1))
    for (let i = 0; i <= N; i++) {
      const x = -half + (i / N) * this.size
      for (let j = 0; j <= N; j++) {
        const z = -half + (j / N) * this.size
        heights[i * (N + 1) + j] = this.heightAt(x, z)
      }
    }
    const desc = RAPIER.ColliderDesc.heightfield(N, N, heights, { x: this.size, y: 1, z: this.size })
      .setFriction(1.0)
      .setRestitution(0)
    this.world.createCollider(desc)
  }

  _buildStatics(boxes, pads, trees, rocks) {
    for (const c of boxes) {
      this.world.createCollider(
        RAPIER.ColliderDesc.cuboid(c.half.x, c.half.y, c.half.z)
          .setTranslation(c.center.x, c.center.y, c.center.z)
          .setFriction(0.8)
          .setRestitution(0)
      )
    }
    for (const p of pads) {
      this.world.createCollider(
        RAPIER.ColliderDesc.cylinder(p.halfHeight, p.radius)
          .setTranslation(p.x, p.y, p.z)
          .setFriction(0.9)
          .setRestitution(0)
      )
    }
    for (const t of trees) {
      this.world.createCollider(
        RAPIER.ColliderDesc.cylinder(2.2, 0.4)
          .setTranslation(t.x, t.y + 1.4, t.z)
          .setFriction(0.7)
          .setRestitution(0)
      )
    }
    for (const r of rocks) {
      this.world.createCollider(
        RAPIER.ColliderDesc.ball(Math.max(0.5, r.s * 0.75))
          .setTranslation(r.x, r.y + r.s * 0.3, r.z)
          .setFriction(0.8)
          .setRestitution(0.05)
      )
    }
  }

  createChassis({ position, yaw, halfExtents, mass, friction = 0.55, linearDamping = 0.05, angularDamping = 3.5, ccd = true }) {
    const qy = yaw / 2
    const body = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(position.x, position.y, position.z)
        .setRotation({ x: 0, y: Math.sin(qy), z: 0, w: Math.cos(qy) })
        .setAdditionalMass(mass)
        .setLinearDamping(linearDamping)
        .setAngularDamping(angularDamping)
        .setCcdEnabled(ccd)
        .setCanSleep(false)
    )
    const collider = this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(halfExtents.x, halfExtents.y, halfExtents.z)
        .setFriction(friction)
        .setRestitution(0.02)
        .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS),
      body
    )
    return { body, collider }
  }

  createVehicleController(body) {
    return this.world.createVehicleController(body)
  }

  registerVehicle(vehicle, collider) {
    this.vehicles.push(vehicle)
    this.vehicleByCollider.set(collider.handle, vehicle)
  }

  raycastDown(x, y, z, maxDist, excludeCollider = null) {
    this._ray.origin.x = x; this._ray.origin.y = y; this._ray.origin.z = z
    const hit = this.world.castRay(this._ray, maxDist, true, undefined, undefined, excludeCollider ?? undefined)
    return hit ? y - hit.timeOfImpact : null
  }

  // Fixed-step simulation. Returns crash events as [{ vehicle, speed }].
  step(dt) {
    const crashes = []
    this.acc = Math.min(this.acc + dt, PHYS_DT * MAX_STEPS)
    while (this.acc >= PHYS_DT) {
      for (const v of this.vehicles) {
        v._preSpeed = v.body ? v.body.linvel().x ** 2 + v.body.linvel().y ** 2 + v.body.linvel().z ** 2 : 0
        v._preSpeed = Math.sqrt(v._preSpeed)
        v.preStep(PHYS_DT)
      }
      this.world.step(this.events)
      this.acc -= PHYS_DT
    }
    this.events.drainCollisionEvents((h1, h2, started) => {
      if (!started) return
      const v = this.vehicleByCollider.get(h1) ?? this.vehicleByCollider.get(h2)
      if (v && v._preSpeed > 13) crashes.push({ vehicle: v, speed: v._preSpeed })
    })
    return crashes
  }
}
