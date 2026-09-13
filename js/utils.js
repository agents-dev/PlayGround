// Small math / noise helpers (no dependencies).
export function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
export function lerp(a, b, t) { return a + (b - a) * t; }
export function rand(a = 1, b) { return b === undefined ? Math.random() * a : a + Math.random() * (b - a); }
export function randInt(a, b) { return Math.floor(rand(a, b + 1)); }
export function choice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Deterministic hash-based value noise with fBm — good enough for islands.
function hash2(x, y, seed) {
  let h = (x * 374761393 + y * 668265263 + seed * 974634211) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (((h ^ (h >>> 16)) >>> 0) % 100000) / 100000;
}
function smooth(t) { return t * t * (3 - 2 * t); }
export function valueNoise(x, y, seed = 0) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const a = hash2(xi, yi, seed), b = hash2(xi + 1, yi, seed);
  const c = hash2(xi, yi + 1, seed), d = hash2(xi + 1, yi + 1, seed);
  const u = smooth(xf), v = smooth(yf);
  return lerp(lerp(a, b, u), lerp(c, d, u), v); // 0..1
}
export function fbm(x, y, oct = 4, seed = 0) {
  let s = 0, amp = 0.5, f = 1, norm = 0;
  for (let i = 0; i < oct; i++) {
    s += amp * valueNoise(x * f, y * f, seed + i * 101);
    norm += amp; amp *= 0.5; f *= 2.03;
  }
  return s / norm;
}
export function deg(d) { return (d * Math.PI) / 180; }
