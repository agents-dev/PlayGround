"use strict";
/* renderer: reads sim state read-only, never mutates. Vector sprites + bg image/procedural. */
function createRenderer(canvas) {
  const ctx = canvas.getContext("2d");
  const LW = 240, LH = 256;
  let bgImg = null, bgReady = false;
  let bgCache = null;

  const BG_CANDIDATES = ["assets/machine-interior.jpg", "assets/machine-interior.png", "assets/machine-interior.webp", "assets/machine-interior.jpeg"];

  function tryLoadBackground() {
    // fetch-probe first so missing optional skins stay console-clean
    let i = 0;
    function next() {
      if (i >= BG_CANDIDATES.length) return;
      const url = BG_CANDIDATES[i];
      fetch(url, { method: "GET" }).then(r => {
        if (!r.ok) throw new Error("missing");
        return r.blob();
      }).then(blob => {
        const img = new Image();
        img.onload = () => { bgImg = img; bgReady = true; URL.revokeObjectURL(img.src); };
        img.onerror = () => { i++; next(); };
        img.src = URL.createObjectURL(blob);
      }).catch(() => { i++; next(); });
    }
    next();
  }

  function buildProceduralBG() {
    const c = document.createElement("canvas");
    c.width = LW; c.height = LH;
    const g = c.getContext("2d");
    // calm central steel backplate
    const grad = g.createLinearGradient(0, 0, 0, LH);
    grad.addColorStop(0, "#23282f"); grad.addColorStop(0.5, "#2c333c"); grad.addColorStop(1, "#1d2228");
    g.fillStyle = grad; g.fillRect(0, 0, LW, LH);
    // brushed lines
    g.globalAlpha = 0.06;
    for (let y = 8; y < LH; y += 3) { g.fillStyle = y % 6 ? "#ffffff" : "#000000"; g.fillRect(18, y, LW - 36, 1); }
    g.globalAlpha = 1;
    // panel seams + rivets
    g.strokeStyle = "rgba(0,0,0,0.5)"; g.lineWidth = 1;
    g.strokeRect(18.5, 8.5, LW - 37, LH - 17);
    g.fillStyle = "#3d454f";
    for (let x = 22; x < LW - 18; x += 24) for (const y of [12, LH - 12]) { g.beginPath(); g.arc(x, y, 1.6, 0, 7); g.fill(); g.fillStyle = "#14171b"; g.beginPath(); g.arc(x - 0.4, y - 0.4, 0.6, 0, 7); g.fill(); g.fillStyle = "#3d454f"; }
    // dense edge machinery left/right
    for (const side of [0, 1]) {
      const x0 = side === 0 ? 0 : LW - 18;
      const eg = g.createLinearGradient(x0, 0, x0 + 18, 0);
      eg.addColorStop(0, "#101318"); eg.addColorStop(1, "#232a33");
      g.fillStyle = side === 0 ? eg : "#1a2027";
      g.fillStyle = "#12161b"; g.fillRect(x0, 0, 18, LH);
      // pipes
      g.fillStyle = "#2e3640"; g.fillRect(x0 + 3, 0, 4, LH);
      g.fillStyle = "#454f5b"; g.fillRect(x0 + 3, 0, 1.5, LH);
      g.fillStyle = "#22282f"; g.fillRect(x0 + 10, 0, 5, LH);
      // vents
      g.fillStyle = "#0a0d10";
      for (let y = 20; y < LH - 10; y += 14) g.fillRect(x0 + 10, y, 5, 6);
      g.fillStyle = "rgba(255,255,255,0.08)";
      for (let y = 20; y < LH - 10; y += 14) g.fillRect(x0 + 10, y, 5, 1);
      // bolts
      g.fillStyle = "#59626d";
      for (let y = 10; y < LH; y += 32) { g.beginPath(); g.arc(x0 + 9, y, 1.4, 0, 7); g.fill(); }
    }
    // top/bottom rails
    g.fillStyle = "#0e1115"; g.fillRect(0, 0, LW, 8); g.fillRect(0, LH - 8, LW, 8);
    g.fillStyle = "#39414b"; g.fillRect(0, 7, LW, 1); g.fillRect(0, LH - 8, LW, 1);
    bgCache = c;
  }

  function drawGearSprite(g, x, y, hp, electrified, tick) {
    // brass gear, hp 1..4 (missing teeth as damaged), electrified cyan glow
    const cx = x, cy = y;
    if (electrified) {
      g.save();
      g.shadowColor = "#38e1ff"; g.shadowBlur = 8;
      g.strokeStyle = "rgba(56,225,255,0.8)"; g.lineWidth = 1;
      g.beginPath(); g.arc(cx, cy, 5.5 + Math.sin(tick * 0.2) * 0.6, 0, 7); g.stroke();
      g.restore();
    }
    const teeth = 8;
    g.save();
    g.translate(cx, cy);
    g.fillStyle = electrified ? "#7adfff" : "#c9a227";
    g.strokeStyle = electrified ? "#0e6b84" : "#6b5312";
    g.lineWidth = 1;
    g.beginPath();
    for (let i = 0; i < teeth; i++) {
      // damaged: skip teeth when hp low
      const alive = i < 2 + hp * 1.5;
      const a = (i / teeth) * Math.PI * 2;
      const r1 = alive ? 5 : 3.6, r0 = 3.2;
      const x1 = Math.cos(a) * r1, y1 = Math.sin(a) * r1;
      const x0 = Math.cos(a) * r0, y0 = Math.sin(a) * r0;
      if (i === 0) g.moveTo(x1, y1); else g.lineTo(x1, y1);
      g.lineTo(x0, y0);
    }
    g.closePath(); g.fill(); g.stroke();
    // hub
    g.fillStyle = electrified ? "#12333d" : "#3a2f0c";
    g.beginPath(); g.arc(0, 0, 1.8, 0, 7); g.fill();
    g.fillStyle = electrified ? "#38e1ff" : "#f4d35e";
    g.beginPath(); g.arc(0, 0, 0.9, 0, 7); g.fill();
    // damage cracks
    if (hp <= 2) { g.strokeStyle = "rgba(0,0,0,0.6)"; g.beginPath(); g.moveTo(-2, -1); g.lineTo(2, 1.5); g.stroke(); }
    g.restore();
  }

  function drawConvoySeg(g, x, y, isHead, poison, dir, tick) {
    g.save();
    g.translate(x, y);
    if (poison) { g.shadowColor = "#38e1ff"; g.shadowBlur = 7; }
    else if (isHead) { g.shadowColor = "#ffb020"; g.shadowBlur = 5; }
    // tracks
    g.fillStyle = "#4a5158";
    g.fillRect(-4.5, -3.4, 9, 2.2); g.fillRect(-4.5, 1.2, 9, 2.2);
    g.fillStyle = "#22262b";
    for (let i = -4; i <= 4; i += 2) { g.fillRect(i, -3.4, 1, 2.2); g.fillRect(i, 1.2, 1, 2.2); }
    // hull steel
    const hull = g.createLinearGradient(0, -2, 0, 2);
    hull.addColorStop(0, isHead ? "#ffd27a" : "#c3cad2");
    hull.addColorStop(0.5, isHead ? "#e89b1c" : "#8b939c");
    hull.addColorStop(1, isHead ? "#8a5a0c" : "#4c545c");
    g.fillStyle = poison ? "#9be9ff" : hull;
    g.fillRect(-3.5, -1.8, 7, 3.6);
    g.strokeStyle = "rgba(0,0,0,0.55)"; g.lineWidth = 0.8;
    g.strokeRect(-3.5, -1.8, 7, 3.6);
    // dome / eye
    g.fillStyle = isHead ? "#ff3b30" : "#2b3138";
    g.beginPath(); g.arc(dir >= 0 ? 2 : -2, 0, 1.3, 0, 7); g.fill();
    g.fillStyle = "#fff";
    g.fillRect(dir >= 0 ? 1.6 : -2.4, -0.4, 0.8, 0.8);
    // antenna for head
    if (isHead) { g.strokeStyle = "#ffb020"; g.beginPath(); g.moveTo(0, -1.8); g.lineTo(dir >= 0 ? 3 : -3, -4); g.stroke(); g.fillStyle = "#ff3b30"; g.beginPath(); g.arc(dir >= 0 ? 3 : -3, -4, 0.9, 0, 7); g.fill(); }
    g.restore();
  }

  function drawPlayer(g, x, y, tick) {
    g.save(); g.translate(x, y);
    g.shadowColor = "#38e1ff"; g.shadowBlur = 6;
    // cutter body: small triangular tool
    g.fillStyle = "#d7dde3";
    g.strokeStyle = "#111"; g.lineWidth = 0.8;
    g.beginPath(); g.moveTo(0, -5); g.lineTo(-4, 3.5); g.lineTo(0, 1.5); g.lineTo(4, 3.5); g.closePath();
    g.fill(); g.stroke();
    // cyan cutting tip
    g.fillStyle = "#38e1ff";
    g.fillRect(-1, -6.5, 2, 2.4);
    // base glow
    g.fillStyle = "#ff3b30";
    g.fillRect(-2.5, 3.5, 1.2, 1.2); g.fillRect(1.3, 3.5, 1.2, 1.2);
    g.restore();
  }

  function render(state, interp, ui) {
    // ui: {mode, alpha-independent overlays handled by DOM; tick for lamps}
    const scale = canvas.width / LW;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // background
    ctx.imageSmoothingEnabled = false;
    if (bgReady && bgImg) {
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
      // darken + calm overlay so playfield stays readable
      ctx.fillStyle = "rgba(10,14,18,0.62)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      if (!bgCache) buildProceduralBG();
      ctx.drawImage(bgCache, 0, 0, canvas.width, canvas.height);
    }
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.lineWidth = 1 / scale;

    const tick = state.tick || 0;
    // restrained red lamps on rails (blink slowly)
    for (const lx of [30, 120, 210]) {
      const on = ((tick >> 5) + lx) % 4 !== 0;
      ctx.fillStyle = on ? "#ff3b30" : "#5a1712";
      ctx.beginPath(); ctx.arc(lx, 4, 1.8, 0, 7); ctx.fill();
    }
    // player zone line
    ctx.strokeStyle = "rgba(56,225,255,0.25)";
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(18, 204.5); ctx.lineTo(LW - 18, 204.5); ctx.stroke();
    ctx.setLineDash([]);

    // gears (read-only iteration)
    const gears = state.gears;
    for (const k in gears) {
      const gg = gears[k];
      drawGearSprite(ctx, gg.cx * 8 + 4, gg.cy * 8 + 4, gg.hp, gg.electrified, tick);
    }
    // convoy (use interpolated positions when provided)
    const chains = (interp && interp.chains) || state.chains;
    for (const c of chains) {
      for (let i = 0; i < c.segs.length; i++) {
        const s = c.segs[i];
        drawConvoySeg(ctx, s.x, s.y, i === 0, !!s.poison, c.dir, tick);
      }
    }
    // bolt
    const bolt = (interp && interp.bolt) || state.bolt;
    if (bolt) {
      ctx.save();
      ctx.shadowColor = "#aef4ff"; ctx.shadowBlur = 6;
      ctx.fillStyle = "#e8fdff";
      ctx.fillRect(bolt.x - 1, bolt.y - 5, 2, 7);
      ctx.fillStyle = "#38e1ff";
      ctx.fillRect(bolt.x - 1, bolt.y - 5, 2, 2);
      ctx.restore();
    }
    // crawler (beetle)
    const cr = (interp && interp.crawler) || state.crawler;
    if (cr) {
      ctx.save(); ctx.translate(cr.x, cr.y);
      ctx.fillStyle = "#b06cff"; ctx.strokeStyle = "#2a1040"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(0, 0, 5, 3, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#b06cff";
      const w = Math.sin(tick * 0.6) * 2;
      for (const s of [-1, 1]) for (let l = -1; l <= 1; l++) { ctx.beginPath(); ctx.moveTo(s * 3, l * 1.5); ctx.lineTo(s * 6, l * 1.5 + w); ctx.stroke(); }
      ctx.fillStyle = "#ff3b30"; ctx.beginPath(); ctx.arc(3.5, 0, 1, 0, 7); ctx.fill();
      ctx.restore();
    }
    // dispenser
    const dp = (interp && interp.dispenser) || state.dispenser;
    if (dp) {
      ctx.save(); ctx.translate(dp.x, dp.y);
      ctx.fillStyle = "#3ddc84"; ctx.strokeStyle = "#0c3a22"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(4, 2); ctx.lineTo(0, 5); ctx.lineTo(-4, 2); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = dp.hp > 1 ? "#eafff3" : "#ffcf3f";
      ctx.fillRect(-1.5, -1.5, 3, 3);
      ctx.restore();
    }
    // drone
    const dr = (interp && interp.drone) || state.drone;
    if (dr) {
      ctx.save(); ctx.translate(dr.x, dr.y);
      ctx.shadowColor = "#38e1ff"; ctx.shadowBlur = 8;
      ctx.fillStyle = "#12333d"; ctx.strokeStyle = "#38e1ff"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(0, 0, 6, 2.6, 0, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#38e1ff";
      ctx.beginPath(); ctx.arc(dr.dir >= 0 ? 4 : -4, 0, 1.2, 0, 7); ctx.fill();
      // electric tail
      ctx.strokeStyle = "rgba(56,225,255,0.7)";
      ctx.beginPath(); ctx.moveTo(-dr.dir * 6, 0);
      ctx.lineTo(-dr.dir * 9, -2 + Math.sin(tick * 0.8) * 2); ctx.lineTo(-dr.dir * 9, 2); ctx.closePath(); ctx.stroke();
      ctx.restore();
    }
    // player
    const pl = (interp && interp.player) || state.player;
    if (pl && pl.alive && (ui.mode === "playing" || ui.mode === "paused" || ui.mode === "dying")) {
      const blink = ui.mode === "dying" ? (tick % 8 < 4) : true;
      if (blink) drawPlayer(ctx, pl.x, pl.y, tick);
    }
  }

  tryLoadBackground();
  buildProceduralBG();
  return { render, tryLoadBackground };
}
if (typeof module !== "undefined") module.exports = { createRenderer };
if (typeof window !== "undefined") window.MechRender = { createRenderer };
