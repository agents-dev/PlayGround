"use strict";
/* audio: Web Audio SFX synth. Read-only wrt sim state; driven by events. */
function createAudio(getPrefs) {
  let ctx = null, master = null;
  function ensure() {
    if (ctx) return true;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.35;
      master.connect(ctx.destination);
      return true;
    } catch { return false; }
  }
  function muted() { try { return !!(getPrefs && getPrefs().mute); } catch { return false; } }
  function blip(freq0, freq1, dur, type, vol) {
    if (muted()) return;
    if (!ensure()) return;
    try {
      if (ctx.state === "suspended") ctx.resume();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type || "square";
      o.frequency.setValueAtTime(freq0, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(Math.max(20, freq1), ctx.currentTime + dur);
      g.gain.setValueAtTime(vol || 0.5, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      o.connect(g); g.connect(master);
      o.start(); o.stop(ctx.currentTime + dur + 0.02);
    } catch {}
  }
  function noise(dur, vol) {
    if (muted()) return;
    if (!ensure()) return;
    try {
      if (ctx.state === "suspended") ctx.resume();
      const n = Math.floor(ctx.sampleRate * dur);
      const buf = ctx.createBuffer(1, n, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const src = ctx.createBufferSource(); src.buffer = buf;
      const g = ctx.createGain(); g.gain.value = vol || 0.4;
      src.connect(g); g.connect(master); src.start();
    } catch {}
  }
  function play(ev) {
    switch (ev.type) {
      case "shoot": blip(880, 220, 0.08, "square", 0.25); break;
      case "gearHit": blip(300, 180, 0.05, "square", 0.3); break;
      case "gearBreak": noise(0.09, 0.35); break;
      case "headKill": noise(0.18, 0.5); blip(520, 90, 0.16, "sawtooth", 0.35); break;
      case "bodyKill": noise(0.12, 0.4); blip(420, 120, 0.1, "sawtooth", 0.3); break;
      case "crawlerKill": blip(660, 1400, 0.12, "triangle", 0.4); break;
      case "dispenserKill": noise(0.2, 0.5); break;
      case "dispenserHit": blip(200, 150, 0.06, "square", 0.3); break;
      case "droneKill": blip(1200, 2400, 0.2, "sine", 0.45); break;
      case "playerDeath": noise(0.5, 0.6); blip(300, 40, 0.5, "sawtooth", 0.4); break;
      case "extraLife": blip(523, 1046, 0.25, "sine", 0.5); break;
      case "waveStart": blip(392, 784, 0.2, "triangle", 0.4); break;
      case "electrify": blip(1500, 900, 0.07, "sine", 0.25); break;
      default: break;
    }
  }
  function unlock() { ensure(); }
  return { play, unlock, ensure };
}
if (typeof module !== "undefined") module.exports = { createAudio };
if (typeof window !== "undefined") window.MechAudio = { createAudio };
