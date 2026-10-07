import * as THREE from 'three'
import { fbm } from '../core/noise.js'

export const SUN_DIR = new THREE.Vector3(0.55, 0.42, -0.72).normalize()
export const FOG_COLOR = new THREE.Color('#a9c6de')

const skyVert = /* glsl */`
  varying vec3 vWorld;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const skyFrag = /* glsl */`
  varying vec3 vWorld;
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  uniform vec3 uBottom;
  uniform vec3 uSun;
  uniform vec3 uSunColor;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float fbm(vec2 p) {
    float s = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; }
    return s;
  }

  void main() {
    vec3 dir = normalize(vWorld);
    float h = dir.y;
    vec3 col = mix(uHorizon, uTop, pow(clamp(h, 0.0, 1.0), 0.62));
    col = mix(uBottom, col, smoothstep(-0.22, 0.06, h));

    float sun = max(dot(dir, normalize(uSun)), 0.0);
    col += uSunColor * pow(sun, 320.0) * 2.4;
    col += uSunColor * pow(sun, 48.0) * 0.34;
    col += uSunColor * pow(sun, 6.0) * 0.05;

    // Soft cloud banding near the horizon.
    float band = fbm(vec2(dir.x * 4.0 + 3.0, dir.z * 4.0 + dir.y * 2.0));
    col += vec3(0.06) * smoothstep(0.55, 0.9, band) * smoothstep(0.0, 0.35, h);

    gl_FragColor = vec4(col, 1.0);
  }
`

function makeCloudTexture() {
  const s = 128
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')
  const img = ctx.createImageData(s, s)
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const nx = x / s, ny = y / s
      const n = fbm(nx * 6, ny * 6) * fbm(nx * 2.3 + 10, ny * 2.3 + 10)
      const edge = Math.pow(Math.sin(nx * Math.PI) * Math.sin(ny * Math.PI), 1.2)
      const a = Math.max(0, n * 2.4 - 0.55) * edge
      const i = (y * s + x) * 4
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 255
      img.data[i + 3] = Math.min(255, Math.pow(a, 1.4) * 255)
    }
  }
  ctx.putImageData(img, 0, 0)
  return new THREE.CanvasTexture(c)
}

export function createSky(scene, renderer) {
  const geo = new THREE.SphereGeometry(2600, 32, 20)
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTop: { value: new THREE.Color('#2f6fb0') },
      uHorizon: { value: new THREE.Color('#cfe3f2') },
      uBottom: { value: new THREE.Color('#7f97ad') },
      uSun: { value: SUN_DIR.clone() },
      uSunColor: { value: new THREE.Color('#fff2cc') },
    },
    vertexShader: skyVert,
    fragmentShader: skyFrag,
  })
  const sky = new THREE.Mesh(geo, mat)
  sky.name = 'sky'
  sky.frustumCulled = false
  scene.add(sky)

  // Image-based lighting generated from the sky so metals and PBR surfaces read correctly.
  try {
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envScene = new THREE.Scene()
    const envGeo = geo.clone()
    const envMat = mat.clone()
    envScene.add(new THREE.Mesh(envGeo, envMat))
    const rt = pmrem.fromScene(envScene, 0.03, 1, 6000)
    scene.environment = rt.texture
    if ('environmentIntensity' in scene) scene.environmentIntensity = 0.85
    envGeo.dispose()
    envMat.dispose()
    pmrem.dispose()
  } catch (error) {
    console.warn('Environment map generation skipped:', error.message)
  }

  // A few layered cloud sprites high above the basin.
  const tex = makeCloudTexture()
  const clouds = new THREE.Group()
  const cloudMat = new THREE.SpriteMaterial({
    map: tex, transparent: true, opacity: 0.4, depthWrite: false, fog: false,
    color: 0xeaf2fb,
  })
  for (let i = 0; i < 18; i++) {
    const s = new THREE.Sprite(cloudMat)
    const a = (i / 18) * Math.PI * 2 + (i % 3)
    const r = 640 + (i % 5) * 150
    s.position.set(Math.cos(a) * r, 360 + (i % 6) * 34, Math.sin(a) * r)
    const sc = 300 + (i % 6) * 110
    s.scale.set(sc * 1.9, sc, 1)
    s.material = cloudMat.clone()
    s.material.opacity = 0.26 + (i % 4) * 0.07
    clouds.add(s)
  }
  clouds.renderOrder = 1
  scene.add(clouds)

  scene.fog = new THREE.FogExp2(FOG_COLOR.getHex(), 0.0013)
  scene.background = FOG_COLOR.clone()

  renderer.setClearColor(FOG_COLOR, 1)
  return { sky, clouds }
}
