// Tiny synthesized SFX engine (WebAudio, no assets).
let ctx = null;
let muted = false;

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

export function ensureAudio() { try { ac(); } catch { /* noop */ } }
export function toggleMute() { muted = !muted; return muted; }

function env(g, t0, peak, dur) {
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
}

function tone(freq, dur = 0.2, type = 'sine', vol = 0.25, slideTo = null) {
  if (muted) return;
  const c = ac(); if (!c) return;
  const t0 = c.currentTime;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t0);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  env(g, t0, vol, dur);
  o.connect(g).connect(c.destination);
  o.start(t0); o.stop(t0 + dur + 0.05);
}

function noiseBurst(dur = 0.6, vol = 0.5, lowpass = 900) {
  if (muted) return;
  const c = ac(); if (!c) return;
  const t0 = c.currentTime;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource(); src.buffer = buf;
  const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lowpass;
  const g = c.createGain();
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  src.connect(f).connect(g).connect(c.destination);
  src.start(t0);
}

export const sfx = {
  click()   { tone(660, 0.07, 'square', 0.12); },
  jump()    { tone(300, 0.18, 'square', 0.14, 620); },
  launch()  { noiseBurst(0.35, 0.3, 2400); tone(180, 0.3, 'sawtooth', 0.16, 90); },
  bounce()  { tone(220, 0.09, 'triangle', 0.18, 140); },
  shotgun() { noiseBurst(0.25, 0.55, 3800); tone(120, 0.2, 'square', 0.25, 60); },
  explosion(big = 1) { noiseBurst(0.9 * big, 0.7, 700); tone(70, 0.7 * big, 'sine', 0.5, 30); },
  splash()  { noiseBurst(0.5, 0.35, 1200); },
  hurt()    { tone(420, 0.16, 'sawtooth', 0.2, 180); },
  teleport(){ tone(880, 0.35, 'sine', 0.2, 220); tone(220, 0.35, 'sine', 0.15, 880); },
  turn()    { tone(520, 0.12, 'triangle', 0.2); setTimeout(() => tone(780, 0.14, 'triangle', 0.2), 120); },
  win()     { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.25, 'triangle', 0.25), i * 140)); },
  whistle() { tone(1400, 0.8, 'sine', 0.12, 700); },
};
