// ---------------------------------------------------------------------------
// Minimal procedural WebAudio: jetpack/wind loops, blips, booms. No assets.
// ---------------------------------------------------------------------------

export class GameAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.jetGain = null;
    this.windGain = null;
    this.enabled = false;
  }

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch { return; }
    const ctx = this.ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0.5;
    this.master.connect(ctx.destination);

    // shared noise buffer
    const len = ctx.sampleRate * 2;
    this.noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

    // jetpack loop: band-passed noise
    this.jetGain = this.loopNoise(400, 0.8, 0);
    // wind loop: low-passed noise, gain follows speed
    this.windGain = this.loopNoise(900, 0.4, 0);

    this.enabled = true;
  }

  loopNoise(freq, q, gain) {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    const filt = ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = freq;
    filt.Q.value = q;
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(filt).connect(g).connect(this.master);
    src.start();
    return g;
  }

  setJet(on) {
    if (!this.enabled) return;
    this.jetGain.gain.setTargetAtTime(on ? 0.16 : 0, this.ctx.currentTime, 0.08);
  }

  setWind(speed01) {
    if (!this.enabled) return;
    this.windGain.gain.setTargetAtTime(speed01 * 0.22, this.ctx.currentTime, 0.15);
  }

  blip(freqA, freqB, dur, type = 'sawtooth', vol = 0.3) {
    if (!this.enabled) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freqA, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(1, freqB), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(this.master);
    o.start(t); o.stop(t + dur + 0.02);
  }

  boom(vol = 0.7, dur = 0.5) {
    if (!this.enabled) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(1400, t);
    filt.frequency.exponentialRampToValueAtTime(80, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filt).connect(g).connect(this.master);
    src.start(t); src.stop(t + dur + 0.05);
  }

  fire()      { this.blip(880, 160, 0.22, 'sawtooth', 0.28); this.boom(0.2, 0.15); }
  hit()       { this.blip(1400, 900, 0.08, 'square', 0.18); }
  hurt()      { this.blip(220, 90, 0.25, 'triangle', 0.3); }
  explosion() { this.boom(0.75, 0.55); }
  pickup()    { this.blip(520, 1040, 0.18, 'sine', 0.3); }
  capture()   { this.blip(520, 780, 0.14, 'sine', 0.3); setTimeout(() => this.blip(780, 1560, 0.3, 'sine', 0.3), 140); }
  jump()      { this.blip(300, 500, 0.09, 'sine', 0.1); }
}
