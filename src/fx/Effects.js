import * as THREE from 'three'

const PARTICLE_VERT = /* glsl */`
  attribute float aSize;
  attribute float aAlpha;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = color;
    vAlpha = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (330.0 / max(-mv.z, 1.0));
    gl_Position = projectionMatrix * mv;
  }
`

const PARTICLE_FRAG = /* glsl */`
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 d = gl_PointCoord - 0.5;
    float r = length(d);
    if (r > 0.5) discard;
    float soft = smoothstep(0.5, 0.12, r);
    gl_FragColor = vec4(vColor, vAlpha * soft);
  }
`

function makeParticleSystem(capacity, blending) {
  const geo = new THREE.BufferGeometry()
  const positions = new Float32Array(capacity * 3)
  const colors = new Float32Array(capacity * 3)
  const sizes = new Float32Array(capacity)
  const alphas = new Float32Array(capacity)
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geo.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1))
  const mat = new THREE.ShaderMaterial({
    vertexShader: PARTICLE_VERT,
    fragmentShader: PARTICLE_FRAG,
    transparent: true,
    depthWrite: false,
    blending,
    vertexColors: true,
  })
  const points = new THREE.Points(geo, mat)
  points.frustumCulled = false
  return points
}

export class Effects {
  constructor(scene) {
    this.scene = scene
    this.capacity = 1600
    this.points = makeParticleSystem(this.capacity, THREE.AdditiveBlending)
    this.scene.add(this.points)
    this.particles = []
    for (let i = 0; i < this.capacity; i++) {
      this.particles.push({
        life: 0, max: 1, size: 1, drag: 0.9, gravity: 0,
        pos: new THREE.Vector3(), vel: new THREE.Vector3(),
        color: new THREE.Color(), fade: 1,
      })
    }
    this.cursor = 0

    // Tracer pool.
    this.tracerCount = 128
    this.tracerIndex = 0
    this.tracerGeo = new THREE.BufferGeometry()
    this.tracerPos = new Float32Array(this.tracerCount * 2 * 3)
    this.tracerCol = new Float32Array(this.tracerCount * 2 * 3)
    this.tracerLife = new Float32Array(this.tracerCount)
    this.tracerBase = new Float32Array(this.tracerCount * 3)
    this.tracerGeo.setAttribute('position', new THREE.BufferAttribute(this.tracerPos, 3))
    this.tracerGeo.setAttribute('color', new THREE.BufferAttribute(this.tracerCol, 3))
    this.tracers = new THREE.LineSegments(this.tracerGeo, new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    }))
    this.tracers.frustumCulled = false
    this.scene.add(this.tracers)

    this.explosions = []
    // Pooled point lights so the scene light count never changes (avoids shader recompiles).
    this.lightPool = []
    this.lightCursor = 0
    for (let i = 0; i < 4; i++) {
      const light = new THREE.PointLight(0xffa030, 0, 60, 2)
      this.scene.add(light)
      this.lightPool.push(light)
    }
    this.muzzle = this._makeMuzzleFlash()
    this.scene.add(this.muzzle)
    this.muzzleTimer = 0
    this.shake = 0
  }

  _makeMuzzleFlash() {
    const group = new THREE.Group()
    const mat = new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 10), mat)
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.1, 8), mat)
    cone.rotation.x = Math.PI / 2
    cone.position.z = 0.5
    group.add(core, cone)
    const light = new THREE.PointLight(0xffb14a, 0, 14, 2)
    group.add(light)
    group.userData.light = light
    group.userData.mat = mat
    group.visible = false
    return group
  }

  _spawn() {
    const p = this.particles[this.cursor]
    this.cursor = (this.cursor + 1) % this.capacity
    return p
  }

  spawnBurst(origin, {
    count = 12, speed = 6, speedVar = 0.7, life = 0.6, size = 6,
    color = 0xffa640, colorVar = 0, gravity = 6, drag = 0.86, spread = 1,
  } = {}) {
    for (let i = 0; i < count; i++) {
      const p = this._spawn()
      p.pos.copy(origin)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const sp = speed * (1 - speedVar + Math.random() * speedVar * 2)
      p.vel.set(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi) * 0.5 + 0.5,
        Math.sin(phi) * Math.sin(theta)
      ).multiplyScalar(sp * spread)
      p.life = p.max = life * (0.6 + Math.random() * 0.7)
      p.size = size * (0.6 + Math.random() * 0.8)
      p.gravity = gravity
      p.drag = drag
      p.color.set(color)
      if (colorVar) p.color.offsetHSL((Math.random() - 0.5) * colorVar, 0, (Math.random() - 0.5) * colorVar)
      p.fade = 1
    }
  }

  spawnDirectional(origin, dir, opts = {}) {
    const p = this._spawn()
    p.pos.copy(origin)
    p.vel.copy(dir).multiplyScalar(opts.speed ?? 8)
    p.life = p.max = opts.life ?? 0.4
    p.size = opts.size ?? 7
    p.gravity = opts.gravity ?? 4
    p.drag = opts.drag ?? 0.9
    p.color.set(opts.color ?? 0xffc060)
    p.fade = 1
    return p
  }

  tracer(from, to, color = 0xffe08a) {
    const i = this.tracerIndex
    this.tracerIndex = (this.tracerIndex + 1) % this.tracerCount
    const o = i * 6
    this.tracerPos[o] = from.x; this.tracerPos[o + 1] = from.y; this.tracerPos[o + 2] = from.z
    this.tracerPos[o + 3] = to.x; this.tracerPos[o + 4] = to.y; this.tracerPos[o + 5] = to.z
    const c = new THREE.Color(color)
    this.tracerBase[i * 3] = c.r; this.tracerBase[i * 3 + 1] = c.g; this.tracerBase[i * 3 + 2] = c.b
    this.tracerCol[o] = c.r; this.tracerCol[o + 1] = c.g; this.tracerCol[o + 2] = c.b
    this.tracerCol[o + 3] = c.r * 0.3; this.tracerCol[o + 4] = c.g * 0.3; this.tracerCol[o + 5] = c.b * 0.3
    this.tracerLife[i] = 0.09
    this.tracerGeo.attributes.position.needsUpdate = true
    this.tracerGeo.attributes.color.needsUpdate = true
  }

  explosion(position, { radius = 6, color = 0xffa030 } = {}) {
    const mat = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), mat)
    mesh.position.copy(position)
    this.scene.add(mesh)
    const light = this.lightPool[this.lightCursor]
    this.lightCursor = (this.lightCursor + 1) % this.lightPool.length
    light.color.set(color)
    light.position.copy(position)
    light.intensity = 6
    this.explosions.push({ mesh, light, t: 0, max: 0.55, radius })
    this.spawnBurst(position, { count: 26, speed: radius * 1.7, life: 0.7, size: 10, color, gravity: 5, drag: 0.82 })
    this.spawnBurst(position, { count: 14, speed: radius * 1.1, life: 1.1, size: 16, color: 0xff5a20, gravity: -1, drag: 0.9 })
    this.spawnBurst(position, { count: 12, speed: radius * 0.8, life: 1.4, size: 22, color: 0x333333, gravity: -2, drag: 0.94 })
    this.shake = Math.max(this.shake, radius * 0.06)
  }

  impact(position, normal, color = 0xffd080) {
    this.spawnBurst(position, { count: 8, speed: 4, life: 0.35, size: 5, color, gravity: 10, spread: 0.8 })
    for (let i = 0; i < 3; i++) {
      this.spawnDirectional(position, normal, { speed: 2 + Math.random() * 3, life: 0.3, size: 10, color: 0x9aa4ad, gravity: -1, drag: 0.9 })
    }
  }

  showMuzzle(worldPos, worldQuat) {
    this.muzzle.visible = true
    this.muzzle.position.copy(worldPos)
    this.muzzle.quaternion.copy(worldQuat)
    this.muzzle.userData.light.intensity = 4
    this.muzzleTimer = 0.045
  }

  addShake(v) { this.shake = Math.min(1.2, this.shake + v) }

  update(dt) {
    const pos = this.points.geometry.attributes.position.array
    const col = this.points.geometry.attributes.color.array
    const size = this.points.geometry.attributes.aSize.array
    const alpha = this.points.geometry.attributes.aAlpha.array
    for (let i = 0; i < this.capacity; i++) {
      const p = this.particles[i]
      const o = i * 3
      if (p.life > 0) {
        p.life -= dt
        p.vel.y -= p.gravity * dt
        const d = Math.pow(p.drag, dt * 60)
        p.vel.multiplyScalar(d)
        p.pos.addScaledVector(p.vel, dt)
        const t = Math.max(0, p.life / p.max)
        pos[o] = p.pos.x; pos[o + 1] = p.pos.y; pos[o + 2] = p.pos.z
        col[o] = p.color.r; col[o + 1] = p.color.g; col[o + 2] = p.color.b
        size[i] = p.size * (0.4 + t * 0.9)
        alpha[i] = Math.min(1, t * 1.6)
      } else {
        alpha[i] = 0
        size[i] = 0
      }
    }
    this.points.geometry.attributes.position.needsUpdate = true
    this.points.geometry.attributes.color.needsUpdate = true
    this.points.geometry.attributes.aSize.needsUpdate = true
    this.points.geometry.attributes.aAlpha.needsUpdate = true

    // Tracers.
    let anyTracer = false
    for (let i = 0; i < this.tracerCount; i++) {
      if (this.tracerLife[i] <= 0) continue
      this.tracerLife[i] -= dt
      anyTracer = true
      const f = Math.max(0, this.tracerLife[i] / 0.09)
      const o = i * 6
      const r = this.tracerBase[i * 3], g = this.tracerBase[i * 3 + 1], b = this.tracerBase[i * 3 + 2]
      this.tracerCol[o] = r * f; this.tracerCol[o + 1] = g * f; this.tracerCol[o + 2] = b * f
      this.tracerCol[o + 3] = r * 0.3 * f; this.tracerCol[o + 4] = g * 0.3 * f; this.tracerCol[o + 5] = b * 0.3 * f
    }
    if (anyTracer) this.tracerGeo.attributes.color.needsUpdate = true

    // Explosions.
    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const e = this.explosions[i]
      e.t += dt
      const t = e.t / e.max
      e.mesh.scale.setScalar(0.5 + t * e.radius * 0.8)
      e.mesh.material.opacity = Math.max(0, 0.72 * (1 - t))
      e.light.intensity = Math.max(0, 4 * (1 - t))
      if (t >= 1) {
        this.scene.remove(e.mesh)
        e.light.intensity = 0
        e.mesh.geometry.dispose(); e.mesh.material.dispose()
        this.explosions.splice(i, 1)
      }
    }

    // Muzzle.
    if (this.muzzleTimer > 0) {
      this.muzzleTimer -= dt
      this.muzzle.userData.light.intensity *= 0.7
      this.muzzle.userData.mat.opacity = Math.max(0, this.muzzleTimer / 0.045) * 0.9
      if (this.muzzleTimer <= 0) { this.muzzle.visible = false; this.muzzle.userData.light.intensity = 0 }
    }

    this.shake *= Math.pow(0.02, dt)
    if (this.shake < 0.001) this.shake = 0
  }
}
