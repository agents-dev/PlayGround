// Fully synthesized WebAudio sound engine (no external assets).
export class AudioEngine {
  constructor() {
    this.ctx = null
    this.master = null
    this.muted = false
    this.enabled = false
  }

  init() {
    if (this.ctx) return
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    this.ctx = new Ctx()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0.55
    this.master.connect(this.ctx.destination)
    this.noise = this._noiseBuffer(2)
    this._startAmbient()
    this.enabled = true
  }

  resume() { this.ctx?.resume?.() }

  setMuted(m) {
    this.muted = m
    if (this.master) this.master.gain.value = m ? 0 : 0.55
  }

  _noiseBuffer(seconds) {
    const len = Math.floor(this.ctx.sampleRate * seconds)
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    return buf
  }

  _noiseSource() {
    const src = this.ctx.createBufferSource()
    src.buffer = this.noise
    src.loop = true
    return src
  }

  _env(gain, attack, decay, peak) {
    const t = this.ctx.currentTime
    gain.gain.cancelScheduledValues(t)
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(peak, t + attack)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay)
  }

  _startAmbient() {
    const src = this._noiseSource()
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 380
    const gain = this.ctx.createGain()
    gain.gain.value = 0.05
    src.connect(filter).connect(gain).connect(this.master)
    src.start()
    this.ambient = { src, gain }

    // Jetpack loop (silent until used).
    const jp = this._noiseSource()
    const bp = this.ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 900
    bp.Q.value = 0.8
    const jpGain = this.ctx.createGain()
    jpGain.gain.value = 0
    jp.connect(bp).connect(jpGain).connect(this.master)
    jp.start()
    this.jetpack = { gain: jpGain, filter: bp }
  }

  shot(kind = 'disc') {
    if (!this.enabled) return
    const t = this.ctx.currentTime
    if (kind === 'chain') {
      const src = this._noiseSource()
      const bp = this.ctx.createBiquadFilter()
      bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = 1.2
      const g = this.ctx.createGain()
      this._env(g, 0.001, 0.08, 0.5)
      src.connect(bp).connect(g).connect(this.master)
      src.start(t); src.stop(t + 0.12)
      const osc = this.ctx.createOscillator()
      osc.type = 'square'; osc.frequency.setValueAtTime(180, t)
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.08)
      const og = this.ctx.createGain(); this._env(og, 0.001, 0.07, 0.25)
      osc.connect(og).connect(this.master); osc.start(t); osc.stop(t + 0.1)
    } else {
      const osc = this.ctx.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(420, t)
      osc.frequency.exponentialRampToValueAtTime(70, t + 0.28)
      const g = this.ctx.createGain(); this._env(g, 0.002, 0.3, 0.5)
      const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1600
      osc.connect(lp).connect(g).connect(this.master)
      osc.start(t); osc.stop(t + 0.34)
      const src = this._noiseSource()
      const bp = this.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 700; bp.Q.value = 0.6
      const ng = this.ctx.createGain(); this._env(ng, 0.001, 0.2, 0.4)
      src.connect(bp).connect(ng).connect(this.master)
      src.start(t); src.stop(t + 0.3)
    }
  }

  explosion() {
    if (!this.enabled) return
    const t = this.ctx.currentTime
    const src = this._noiseSource()
    const lp = this.ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(1800, t)
    lp.frequency.exponentialRampToValueAtTime(120, t + 0.7)
    const g = this.ctx.createGain(); this._env(g, 0.005, 0.8, 0.9)
    src.connect(lp).connect(g).connect(this.master)
    src.start(t); src.stop(t + 0.9)
    const sub = this.ctx.createOscillator()
    sub.type = 'sine'; sub.frequency.setValueAtTime(120, t)
    sub.frequency.exponentialRampToValueAtTime(35, t + 0.5)
    const sg = this.ctx.createGain(); this._env(sg, 0.005, 0.55, 0.8)
    sub.connect(sg).connect(this.master); sub.start(t); sub.stop(t + 0.6)
  }

  hit(kill = false) {
    if (!this.enabled) return
    const t = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(kill ? 900 : 1500, t)
    osc.frequency.exponentialRampToValueAtTime(kill ? 300 : 1100, t + 0.12)
    const g = this.ctx.createGain(); this._env(g, 0.001, kill ? 0.22 : 0.1, 0.4)
    osc.connect(g).connect(this.master); osc.start(t); osc.stop(t + 0.25)
  }

  setJetpack(intensity) {
    if (!this.enabled || !this.jetpack) return
    const t = this.ctx.currentTime
    this.jetpack.gain.gain.setTargetAtTime(Math.min(0.35, intensity * 0.35), t, 0.05)
    this.jetpack.filter.frequency.setTargetAtTime(700 + intensity * 900, t, 0.08)
  }

  footstep() {
    if (!this.enabled) return
    const t = this.ctx.currentTime
    const src = this._noiseSource()
    const bp = this.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 300; bp.Q.value = 0.8
    const g = this.ctx.createGain(); this._env(g, 0.001, 0.09, 0.22)
    src.connect(bp).connect(g).connect(this.master)
    src.start(t); src.stop(t + 0.12)
  }

  ui() {
    if (!this.enabled) return
    const t = this.ctx.currentTime
    const osc = this.ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = 660
    const g = this.ctx.createGain(); this._env(g, 0.001, 0.09, 0.2)
    osc.connect(g).connect(this.master); osc.start(t); osc.stop(t + 0.12)
  }
}
