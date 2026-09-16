/* FX — zero-dependency canvas particle engine for the tavern.
 * Inspired by cool GitHub projects:
 *  - fullstackusama/microsparks — fullscreen overlay canvas, DPR-aware scaling,
 *    pointer-events:none, rAF loop that sleeps when idle (zero idle overhead).
 *  - drawcall/Proton — emitter ideas: flames, explosions, fountains, gravity wells.
 *  - catdad/canvas-confetti — directional confetti cannons + celebration presets.
 *  - VincentGarreau/particles.js — ambient floating background particles.
 * Vanilla JS, no assets, no dependencies. */
(function () {
  'use strict';

  const PAL = {
    fire:   ['#ffd23f', '#ff9a3c', '#ff5a3c', '#fff3b0'],
    frost:  ['#bfe9ff', '#7cc7ff', '#ffffff', '#3a86ff'],
    holy:   ['#fff3b0', '#ffd23f', '#ffffff', '#a7f3d0'],
    nature: ['#7cfc00', '#2e8b57', '#d4ff9a', '#ffffff'],
    arcane: ['#c77dff', '#5a189a', '#e0aaff', '#ffffff'],
    shadow: ['#b388ff', '#6a1b9a', '#e1bee7', '#311b92'],
    silver: ['#ffffff', '#e5e7eb', '#9ca3af'],
    smoke:  ['#9aa0a6', '#6b7280', '#d1d5db', '#4b5563'],
    gold:   ['#ffd700', '#ffb700', '#fff3b0', '#ffffff'],
    conf:   ['#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#eccc68', '#ff6b81', '#7bed9f', '#c77dff'],
    ember:  ['#ffb703', '#fb8500', '#ffd60a'],
  };

  const canvas = document.createElement('canvas');
  canvas.id = 'fx-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, DPR = 1;

  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  const parts = [];   // live particles
  const projs = [];   // live projectiles
  let running = false;
  let ambientOn = true;
  let enabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastEmber = 0;

  function wake() {
    if (running || !enabled) return;
    running = true;
    requestAnimationFrame(tick);
  }

  function add(p) {
    if (parts.length > 1400) parts.splice(0, parts.length - 1400);
    parts.push(p);
    wake();
  }

  function burst(x, y, o = {}) {
    if (!enabled) return;
    const { count = 24, colors = PAL.fire, speed = 5, size = 4, life = 50, gravity = 0.12, drag = 0.98, shapes = ['circle', 'spark'] } = o;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = speed * (0.3 + Math.random() * 0.9);
      add({
        shape: shapes[(Math.random() * shapes.length) | 0],
        x, y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - speed * 0.25,
        life: life * (0.5 + Math.random() * 0.7), maxLife: life,
        size: size * (0.5 + Math.random()),
        color: colors[(Math.random() * colors.length) | 0],
        gravity, drag, rot: Math.random() * Math.PI * 2, spin: (Math.random() - 0.5) * 0.3,
      });
    }
  }

  function ring(x, y, o = {}) {
    if (!enabled) return;
    const { color = '#ffffff', maxR = 60, life = 28, width = 4 } = o;
    add({ shape: 'ring', x, y, vx: 0, vy: 0, life, maxLife: life, size: 6, maxR, width, color, gravity: 0, drag: 1, rot: 0, spin: 0 });
  }

  function rise(x, y, o = {}) {
    if (!enabled) return;
    const { count = 18, colors = PAL.nature, size = 4, life = 70, spread = 26 } = o;
    for (let i = 0; i < count; i++) {
      add({
        shape: Math.random() < 0.5 ? 'sparkle' : 'circle',
        x: x + (Math.random() - 0.5) * spread * 2, y: y + Math.random() * 10,
        vx: (Math.random() - 0.5) * 0.6, vy: -(0.8 + Math.random() * 1.4),
        life: life * (0.6 + Math.random() * 0.6), maxLife: life,
        size: size * (0.5 + Math.random() * 0.8),
        color: colors[(Math.random() * colors.length) | 0],
        gravity: -0.01, drag: 0.99, rot: 0, spin: 0,
      });
    }
  }

  function smoke(x, y, o = {}) {
    if (!enabled) return;
    const { count = 12, colors = PAL.smoke, size = 9 } = o;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2, sp = 0.5 + Math.random() * 1.6;
      add({
        shape: 'puff',
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 0.8,
        life: 45 + Math.random() * 25, maxLife: 60, size: size * (0.6 + Math.random() * 0.8),
        color: colors[(Math.random() * colors.length) | 0],
        gravity: -0.02, drag: 0.97, rot: 0, spin: 0,
      });
    }
  }

  // ---- signature effects (game-facing) ----
  function explosion(x, y, scale = 1) {
    burst(x, y, { count: Math.round(34 * scale), colors: PAL.fire, speed: 6 * scale, size: 5, life: 55 });
    burst(x, y, { count: Math.round(14 * scale), colors: PAL.smoke, speed: 2.5, size: 9, life: 60, shapes: ['puff'] });
    ring(x, y, { color: '#ffb703', maxR: 70 * scale, life: 26 });
    shake(Math.min(7, 3 + scale * 2));
  }
  function frostBurst(x, y) {
    burst(x, y, { count: 30, colors: PAL.frost, speed: 5, size: 4, life: 50 });
    ring(x, y, { color: '#bfe9ff', maxR: 55, life: 24 });
  }
  function holyNova(x, y) {
    rise(x, y, { count: 22, colors: PAL.holy, size: 5 });
    ring(x, y, { color: '#ffd23f', maxR: 65, life: 30 });
  }
  function healFx(x, y) { rise(x, y, { count: 22, colors: PAL.nature, size: 5 }); ring(x, y, { color: '#7cfc00', maxR: 45, life: 24 }); }
  function armorFx(x, y) { burst(x, y, { count: 16, colors: ['#7cc7ff', '#ffffff', '#3a86ff'], speed: 2.5, size: 4, life: 45, gravity: -0.05 }); ring(x, y, { color: '#7cc7ff', maxR: 55, life: 30 }); }
  function summonFx(x, y) { smoke(x, y, { count: 10 }); rise(x, y, { count: 14, colors: PAL.gold, size: 4 }); ring(x, y, { color: '#ffd700', maxR: 50, life: 24 }); }
  function deathFx(x, y) { smoke(x, y, { count: 14 }); burst(x, y, { count: 12, colors: ['#ff5a5a', '#4b5563', '#9aa0a6'], speed: 3, size: 4, life: 45 }); }
  function shieldPopFx(x, y) { burst(x, y, { count: 16, colors: PAL.silver, speed: 3.5, size: 3.5, life: 35 }); ring(x, y, { color: '#ffffff', maxR: 40, life: 20 }); }
  function buffFx(x, y) { rise(x, y, { count: 14, colors: PAL.gold, size: 4 }); }
  function drawFx(x, y) { rise(x, y, { count: 12, colors: PAL.arcane, size: 4 }); }
  function slashFx(x1, y1, x2, y2) {
    if (!enabled) return;
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      add({ shape: 'spark', x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t,
        vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3,
        life: 16, maxLife: 16, size: 3, color: '#ffffff', gravity: 0, drag: 0.95, rot: 0, spin: 0 });
    }
    burst(x2, y2, { count: 14, colors: ['#ffffff', '#ffd23f', '#ff9a3c'], speed: 4, size: 3.5, life: 32 });
  }

  function projectile(x1, y1, x2, y2, o = {}) {
    if (!enabled) { if (o.onHit) o.onHit(); return; }
    const { color = '#ff9a3c', trail = PAL.fire, size = 9, speed = 0.09, onHit = null } = o;
    projs.push({ x: x1, y: y1, x1, y1, x2, y2, t: 0, speed, color, trail, size, onHit });
    wake();
  }
  function fireball(a, b, onHit) { projectile(a.x, a.y, b.x, b.y, { color: '#ff7b00', trail: PAL.fire, size: 10, onHit }); }
  function frostbolt(a, b, onHit) { projectile(a.x, a.y, b.x, b.y, { color: '#7cc7ff', trail: PAL.frost, size: 8, onHit }); }
  function fireblast(a, b, onHit) { projectile(a.x, a.y, b.x, b.y, { color: '#ff5a3c', trail: PAL.fire, size: 6, speed: 0.12, onHit }); }

  function confettiBlast(x, y, o = {}) {
    if (!enabled) return;
    const { count = 40, angle = -Math.PI / 2, spread = 0.7, colors = PAL.conf } = o;
    for (let i = 0; i < count; i++) {
      const a = angle + (Math.random() - 0.5) * spread * 2;
      const sp = 4 + Math.random() * 7;
      add({ shape: ['rect', 'circle', 'star'][(Math.random() * 3) | 0],
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 90 + Math.random() * 60, maxLife: 130, size: 4 + Math.random() * 5,
        color: colors[(Math.random() * colors.length) | 0],
        gravity: 0.16, drag: 0.99, rot: Math.random() * 6.28, spin: (Math.random() - 0.5) * 0.4, flutter: true });
    }
  }
  function celebrate() {
    if (!enabled) return;
    const end = Date.now() + 2600;
    (function frame() {
      confettiBlast(Math.random() * W, H * 0.7, { count: 12, angle: -Math.PI / 2, spread: 0.5 });
      if (Math.random() < 0.5) confettiBlast(W * 0.08, H * 0.75, { count: 8, angle: -Math.PI / 3, spread: 0.4 });
      if (Math.random() < 0.5) confettiBlast(W * 0.92, H * 0.75, { count: 8, angle: -2 * Math.PI / 3, spread: 0.4 });
      if (Date.now() < end) setTimeout(frame, 180);
    })();
  }
  function defeatRain() {
    if (!enabled) return;
    for (let i = 0; i < 90; i++) {
      add({ shape: 'circle', x: Math.random() * W, y: -20 - Math.random() * 120,
        vx: (Math.random() - 0.5), vy: 1 + Math.random() * 2,
        life: 160, maxLife: 160, size: 3 + Math.random() * 4,
        color: ['#4b5563', '#7f1d1d', '#1f2937'][(Math.random() * 3) | 0],
        gravity: 0.01, drag: 1, rot: 0, spin: 0 });
    }
  }

  function shake(px) {
    if (!enabled) return;
    const table = document.getElementById('table');
    if (!table) return;
    table.style.transition = 'transform 60ms';
    table.style.transform = `translate(${(Math.random() - 0.5) * px}px, ${(Math.random() - 0.5) * px}px)`;
    setTimeout(() => { table.style.transform = ''; }, 70);
  }

  // ---- main loop (sleeps when idle, microsparks-style) ----
  function tick(now) {
    ctx.clearRect(0, 0, W, H);

    // ambient tavern embers (particles.js-style background, cheap)
    if (ambientOn && enabled && parts.length < 900) {
      if (now - lastEmber > 140) {
        lastEmber = now;
        parts.push({ shape: 'ember', x: Math.random() * W, y: H + 12,
          vx: (Math.random() - 0.5) * 0.3, vy: -(0.4 + Math.random() * 0.7),
          life: 420, maxLife: 420, size: 1.5 + Math.random() * 2.5,
          color: PAL.ember[(Math.random() * PAL.ember.length) | 0],
          gravity: 0, drag: 1, rot: 0, spin: 0, seed: Math.random() * 10 });
      }
    }

    ctx.globalCompositeOperation = 'lighter';
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life--;
      if (p.life <= 0 || p.y < -40 || p.y > H + 40 || p.x < -40 || p.x > W + 40) { parts.splice(i, 1); continue; }
      p.vy += p.gravity || 0;
      p.vx *= p.drag; p.vy *= p.drag;
      if (p.flutter) p.vx += Math.sin((p.life + p.rot * 10) * 0.2) * 0.06;
      p.x += p.vx; p.y += p.vy;
      if (p.spin) p.rot += p.spin;
      draw(p);
    }

    // projectiles (fireballs with live trails)
    for (let i = projs.length - 1; i >= 0; i--) {
      const pr = projs[i];
      pr.t += pr.speed;
      const px = pr.x1 + (pr.x2 - pr.x1) * pr.t;
      const py = pr.y1 + (pr.y2 - pr.y1) * pr.t + Math.sin(pr.t * Math.PI) * -30;
      for (let k = 0; k < 3; k++) {
        parts.push({ shape: 'circle', x: px + (Math.random() - 0.5) * 8, y: py + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 1.5, vy: (Math.random() - 0.5) * 1.5,
          life: 22, maxLife: 22, size: 2 + Math.random() * 4,
          color: pr.trail[(Math.random() * pr.trail.length) | 0], gravity: 0, drag: 0.96, rot: 0, spin: 0 });
      }
      // glowing head
      ctx.fillStyle = pr.color;
      ctx.beginPath(); ctx.arc(px, py, pr.size * (0.7 + Math.random() * 0.5), 0, 7); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(px, py, pr.size * 0.35, 0, 7); ctx.fill();
      if (pr.t >= 1) { projs.splice(i, 1); if (pr.onHit) pr.onHit(); }
    }
    ctx.globalCompositeOperation = 'source-over';

    if (parts.length || projs.length || (ambientOn && enabled)) requestAnimationFrame(tick);
    else { running = false; ctx.clearRect(0, 0, W, H); }
  }

  function draw(p) {
    const a = Math.max(0, Math.min(1, p.life / (p.maxLife || 40)));
    ctx.globalAlpha = p.shape === 'puff' ? a * 0.45 : a;
    if (p.shape === 'spark' || p.shape === 'sparkle') {
      ctx.strokeStyle = p.color; ctx.lineWidth = p.size * 0.6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 2.2, p.y - p.vy * 2.2); ctx.stroke();
      if (p.shape === 'sparkle') { ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.3, 0, 7); ctx.fill(); }
    } else if (p.shape === 'rect') {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    } else if (p.shape === 'star') {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.color; ctx.beginPath();
      for (let k = 0; k < 10; k++) {
        const r = k % 2 ? p.size * 0.45 : p.size;
        const an = (k / 10) * Math.PI * 2;
        ctx[k ? 'lineTo' : 'moveTo'](Math.cos(an) * r, Math.sin(an) * r);
      }
      ctx.closePath(); ctx.fill(); ctx.restore();
    } else if (p.shape === 'ring') {
      const t = 1 - a;
      ctx.strokeStyle = p.color; ctx.lineWidth = p.width * a + 1;
      ctx.beginPath(); ctx.arc(p.x, p.y, 6 + (p.maxR - 6) * t, 0, 7); ctx.stroke();
    } else if (p.shape === 'ember') {
      const sway = Math.sin((p.maxLife - p.life) * 0.03 + (p.seed || 0)) * 12;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x + sway * 0.1, p.y, p.size * (0.7 + 0.3 * Math.sin(Date.now() * 0.01 + (p.seed || 0))), 0, 7); ctx.fill();
    } else { // circle & puff
      ctx.fillStyle = p.color;
      const r = p.shape === 'puff' ? p.size * (1.6 - a * 0.6) : p.size * (0.4 + a * 0.6);
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  window.FX = {
    burst, ring, rise, smoke,
    explosion, frostBurst, holyNova, heal: healFx, armor: armorFx,
    summon: summonFx, death: deathFx, shieldPop: shieldPopFx,
    buff: buffFx, draw: drawFx, slash: slashFx,
    projectile, fireball, frostbolt, fireblast,
    confetti: confettiBlast, celebrate, defeat: defeatRain, shake,
    get enabled() { return enabled; },
    setEnabled(v) { enabled = v; if (enabled) wake(); else { parts.length = 0; projs.length = 0; ctx.clearRect(0, 0, W, H); } },
    setAmbient(v) { ambientOn = v; wake(); },
  };
  wake();
})();
