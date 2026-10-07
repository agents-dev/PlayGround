// Deterministic value-noise + fBm helpers shared by terrain and props.
function hash2(x, y, seed) {
  let h = x * 374761393 + y * 668265263 + seed * 2246822519
  h = (h ^ (h >>> 13)) >>> 0
  h = Math.imul(h, 1274126177) >>> 0
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295
}

function smooth(t) {
  return t * t * (3 - 2 * t)
}

export function valueNoise(x, y, seed = 1337) {
  const xi = Math.floor(x), yi = Math.floor(y)
  const xf = x - xi, yf = y - yi
  const a = hash2(xi, yi, seed)
  const b = hash2(xi + 1, yi, seed)
  const c = hash2(xi, yi + 1, seed)
  const d = hash2(xi + 1, yi + 1, seed)
  const u = smooth(xf), v = smooth(yf)
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v
}

export function fbm(x, y, { octaves = 5, lacunarity = 2.0, gain = 0.5, seed = 1337 } = {}) {
  let amplitude = 1, frequency = 1, sum = 0, norm = 0
  for (let i = 0; i < octaves; i++) {
    sum += amplitude * valueNoise(x * frequency, y * frequency, seed + i * 101)
    norm += amplitude
    amplitude *= gain
    frequency *= lacunarity
  }
  return sum / norm
}

export function ridged(x, y, opts = {}) {
  const n = fbm(x, y, opts)
  return 1 - Math.abs(n * 2 - 1)
}

// Mulberry32 seeded PRNG.
export function makeRng(seed = 1) {
  let s = seed >>> 0
  return function rng() {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
