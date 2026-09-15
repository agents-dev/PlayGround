// Live animated backdrop: drifting particles + aurora blobs + grid.
// Playable: pointer stirs particles, click/tap fires a burst.
// Signals readiness via `window.__sceneReady` for automated browser checks.

const canvas = document.getElementById("backdrop");
const ctx = canvas.getContext("2d");
const fpsEl = document.getElementById("fps");
const pcountEl = document.getElementById("pcount");
const rendererEl = document.getElementById("renderer");
const statusEl = document.getElementById("status");
const densityEl = document.getElementById("density");
const burstBtn = document.getElementById("burst");
const pauseBtn = document.getElementById("pause");

window.__sceneReady = false;
window.__scene = { renderer: "canvas2d", renderedFrames: 0, webgpu: null };

const rand = (min, max) => min + Math.random() * (max - min);

let W = 0;
let H = 0;
let particles = [];
let paused = false;
let showGrid = true;
let frames = 0;
let lastFpsT = performance.now();
const pointer = { x: -9999, y: -9999, active: false };

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = Math.floor(W * dpr);
  canvas.height = Math.floor(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function makeParticle(burstX, burstY) {
  const burst = burstX !== undefined;
  return {
    x: burst ? burstX : rand(0, W),
    y: burst ? burstY : rand(0, H),
    vx: burst ? rand(-3.4, 3.4) : rand(-0.35, 0.35),
    vy: burst ? rand(-3.4, 3.4) : rand(-0.3, 0.3),
    r: rand(1, burst ? 3.4 : 2.6),
    hue: rand(150, 210),
    life: burst ? rand(50, 130) : Infinity,
  };
}

function setDensity(n) {
  const target = Math.max(20, Math.min(900, n));
  while (particles.length < target) particles.push(makeParticle());
  particles.length = target;
  pcountEl.textContent = String(particles.length);
}

function burst(x, y, n = 42) {
  for (let i = 0; i < n; i += 1) particles.push(makeParticle(x, y));
  // Trim oldest non-burst particles to bound memory.
  if (particles.length > 1100) particles.splice(0, particles.length - 1100);
  pcountEl.textContent = String(particles.length);
}

function drawBackground(t) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#070d1f");
  g.addColorStop(0.55, "#0a1830");
  g.addColorStop(1, "#0b1026");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Aurora blobs.
  const blobs = [
    { x: W * (0.22 + 0.08 * Math.sin(t / 2600)), y: H * 0.3, r: Math.min(W, H) * 0.42, c: "rgba(56,189,248,0.20)" },
    { x: W * (0.78 + 0.07 * Math.cos(t / 3100)), y: H * 0.62, r: Math.min(W, H) * 0.48, c: "rgba(93,242,200,0.16)" },
    { x: W * (0.55 + 0.1 * Math.sin(t / 4200 + 1)), y: H * 0.85, r: Math.min(W, H) * 0.36, c: "rgba(167,139,250,0.18)" },
  ];
  for (const b of blobs) {
    const rg = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
    rg.addColorStop(0, b.c);
    rg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
  }

  if (showGrid) {
    ctx.strokeStyle = "rgba(148,163,184,0.10)";
    ctx.lineWidth = 1;
    const step = 56;
    ctx.beginPath();
    for (let x = (t / 60) % step; x < W; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
    }
    for (let y = 0; y < H; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
    }
    ctx.stroke();
  }
}

function step(t) {
  drawBackground(t);

  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const p = particles[i];
    // Pointer stir.
    const dx = p.x - pointer.x;
    const dy = p.y - pointer.y;
    const d2 = dx * dx + dy * dy;
    if (pointer.active && d2 < 160 * 160 && d2 > 1) {
      const d = Math.sqrt(d2);
      const f = ((160 - d) / 160) * 0.9;
      p.vx += (dx / d) * f;
      p.vy += (dy / d) * f;
    }
    p.vx *= 0.985;
    p.vy *= 0.985;
    // Gentle drift keeps the field alive even after damping.
    p.x += p.vx + Math.sin(t / 1400 + p.hue) * 0.18;
    p.y += p.vy + Math.cos(t / 1700 + p.hue) * 0.18;

    if (p.life !== Infinity) {
      p.life -= 1;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
    }

    if (p.x < -20) p.x = W + 20;
    if (p.x > W + 20) p.x = -20;
    if (p.y < -20) p.y = H + 20;
    if (p.y > H + 20) p.y = -20;

    const alpha = p.life === Infinity ? 0.9 : Math.min(0.9, p.life / 60);
    ctx.beginPath();
    ctx.fillStyle = `hsla(${p.hue}, 90%, 68%, ${alpha})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pointer beacon.
  if (pointer.active) {
    ctx.beginPath();
    ctx.strokeStyle = "rgba(93,242,200,0.55)";
    ctx.lineWidth = 1.5;
    ctx.arc(pointer.x, pointer.y, 22 + 4 * Math.sin(t / 240), 0, Math.PI * 2);
    ctx.stroke();
  }
}

function frame(t) {
  if (!paused) step(t ?? performance.now());
  frames += 1;
  window.__scene.renderedFrames = frames;

  const now = performance.now();
  if (now - lastFpsT >= 500) {
    fpsEl.textContent = String(Math.round((frames / (now - lastFpsT)) * 1000));
    frames = 0;
    lastFpsT = now;
  }

  if (!window.__sceneReady && window.__scene.renderedFrames >= 3) {
    window.__sceneReady = true;
    statusEl.textContent = `ready frames=${window.__scene.renderedFrames} particles=${particles.length} webgpu=${window.__scene.webgpu ? "yes" : "no"}`;
    document.dispatchEvent(new CustomEvent("scene-ready"));
  }

  requestAnimationFrame(frame);
}

async function probeWebGPU() {
  try {
    const gpu = navigator.gpu;
    if (!gpu) return;
    const adapter = await gpu.requestAdapter();
    if (!adapter) return;
    window.__scene.webgpu = {
      vendor: adapter.info?.vendor ?? "unknown",
      architecture: adapter.info?.architecture ?? "unknown",
      isFallbackAdapter: Boolean(adapter.info?.isFallbackAdapter),
    };
    rendererEl.textContent = "canvas2d+webgpu-probed";
  } catch {
    // Canvas backdrop stays playable without WebGPU.
  }
}

// Events: playable controls.
window.addEventListener("resize", resize);
window.addEventListener("pointermove", (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  pointer.active = true;
});
window.addEventListener("pointerleave", () => {
  pointer.active = false;
});
window.addEventListener("pointerdown", (e) => burst(e.clientX, e.clientY));
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    paused = !paused;
    pauseBtn.textContent = paused ? "Resume" : "Pause";
  } else if (e.key === "g" || e.key === "G") {
    showGrid = !showGrid;
  } else if (e.key === "b" || e.key === "B") {
    burst(rand(0, W), rand(0, H));
  }
});
densityEl.addEventListener("input", () => setDensity(Number(densityEl.value)));
burstBtn.addEventListener("click", () => burst(W / 2 + rand(-80, 80), H / 2 + rand(-60, 60), 80));
pauseBtn.addEventListener("click", () => {
  paused = !paused;
  pauseBtn.textContent = paused ? "Resume" : "Pause";
});

resize();
setDensity(Number(densityEl.value));
burst(W * 0.5, H * 0.42, 60);
probeWebGPU();
requestAnimationFrame(frame);
