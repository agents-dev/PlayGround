"use strict";
/* main: fixed-step 60Hz loop, state machine, HUD, persistence. Only writer of sim state. */
(function () {
  const Sim = window.MechSim || (typeof require !== "undefined" && null);
  const canvas = document.getElementById("game");
  const hud = {
    score: document.getElementById("score"),
    high: document.getElementById("high"),
    lives: document.getElementById("lives"),
    wave: document.getElementById("wave"),
    msg: document.getElementById("overlay"),
    msgTitle: document.getElementById("overlay-title"),
    msgBody: document.getElementById("overlay-body"),
    live: document.getElementById("live"),
  };
  const buttons = {
    start: document.getElementById("btn-start"),
    resume: document.getElementById("btn-resume"),
    restart: document.getElementById("btn-restart"),
    mute: document.getElementById("btn-mute"),
    full: document.getElementById("btn-full"),
    sens: document.getElementById("sens"),
  };

  const Store = window.MechStore;
  const Input = window.MechInput;
  const AudioM = window.MechAudio;
  const MotionM = window.MechMotion;
  const RenderM = window.MechRender;

  let prefs = Store.loadPrefs();
  let high = Store.loadHigh();
  let seedBase = (parseInt(new URLSearchParams(location.search).get("seed") || "0", 10) || 0xC0FFEE) >>> 0;
  let gameCount = 0;

  let sim = null;
  let mode = "title"; // title | playing | paused | dying | intermission | gameover (mirrors sim.phase + overlays)
  let pausedFrom = null;

  const input = Input.createInput(canvas, () => prefs);
  const audio = AudioM.createAudio(() => prefs);
  const motion = MotionM.createMotion();
  const renderer = RenderM.createRenderer(canvas);

  function applyPrefsToUI() {
    buttons.sens.value = prefs.sensitivity;
    buttons.mute.textContent = prefs.mute ? "Unmute (M)" : "Mute (M)";
    buttons.mute.setAttribute("aria-pressed", String(!!prefs.mute));
  }
  function savePrefs() { Store.savePrefs(prefs); applyPrefsToUI(); }

  function newGame() {
    const seed = (seedBase + gameCount * 1013904223) >>> 0;
    gameCount++;
    sim = Sim.createInitialState(seed, { highScore: high });
    motion.reset(sim);
    mode = "playing";
    hideOverlay();
    announce("Game started. Wave 1.");
    audio.unlock();
  }

  function hideOverlay() { hud.msg.classList.add("hidden"); }
  function showOverlay(title, bodyHTML, showButtons) {
    hud.msgTitle.textContent = title;
    hud.msgBody.innerHTML = bodyHTML;
    buttons.start.classList.toggle("hidden", !(showButtons || []).includes("start"));
    buttons.resume.classList.toggle("hidden", !(showButtons || []).includes("resume"));
    buttons.restart.classList.toggle("hidden", !(showButtons || []).includes("restart"));
    hud.msg.classList.remove("hidden");
  }

  function announce(t) { hud.live.textContent = t; }

  function updateHUD() {
    if (!sim) { hud.score.textContent = "0"; hud.high.textContent = String(high); hud.lives.textContent = "3"; hud.wave.textContent = "1"; return; }
    hud.score.textContent = String(sim.score);
    hud.high.textContent = String(Math.max(high, sim.highScore));
    hud.lives.textContent = String(sim.lives);
    hud.wave.textContent = String(sim.wave);
  }

  function setPaused(p) {
    if (mode !== "playing" && mode !== "paused") return;
    if (p && mode === "playing") {
      pausedFrom = "playing";
      mode = "paused";
      input.exitLock();
      showOverlay("Paused", "<p>Simulation frozen at tick " + sim.tick + ". Press P / Esc or Resume.</p>", ["resume", "restart"]);
      announce("Paused.");
    } else if (!p && mode === "paused") {
      mode = "playing";
      hideOverlay();
      // reset accumulator to avoid time jump (exact freeze)
      lastTime = performance.now();
      acc = 0;
      announce("Resumed.");
    }
  }

  function toggleMute() { prefs.mute = !prefs.mute; savePrefs(); }
  function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
      else document.exitFullscreen().catch(() => {});
    } catch {}
  }

  // ---- fixed-step loop: 60Hz sim independent of display rate ----
  const STEP = 1000 / 60;
  let acc = 0, lastTime = performance.now();

  function frame(now) {
    requestAnimationFrame(frame);
    if (mode === "title" || mode === "gameover") {
      // still render ambient background + overlay; no sim ticks
      if (sim) renderer.render(sim, motion.sample(1), { mode });
      updateHUD();
      return;
    }
    if (mode === "paused") {
      if (sim) renderer.render(sim, motion.sample(1), { mode });
      return; // exact freeze: no ticks, no HUD changes
    }
    // playing / dying / intermission driven by sim.phase
    let elapsed = now - lastTime;
    lastTime = now;
    if (elapsed > 250) elapsed = 250; // avoid spiral after tab switch
    acc += elapsed;
    let steps = 0;
    while (acc >= STEP && steps < 5) {
      const ctl = input.poll();
      const events = Sim.tick(sim, ctl);
      for (const e of events) audio.play(e);
      motion.push(sim);
      acc -= STEP;
      steps++;
      // mirror sim phase into UI mode
      if (sim.phase === "dying") { if (mode !== "dying") { mode = "dying"; announce("Hull breached. Repairing gears."); } }
      else if (sim.phase === "intermission") { if (mode !== "intermission") { mode = "intermission"; announce("Wave " + sim.wave + " cleared."); } }
      else if (sim.phase === "gameover") {
        mode = "gameover";
        input.exitLock();
        if (sim.score > high) { high = sim.score; Store.saveHigh(high); }
        showOverlay("Game Over",
          "<p>Score <strong>" + sim.score + "</strong> · Wave " + sim.wave + " · Best " + high + "</p><p>Press Enter or Start to retry.</p>",
          ["start", "restart"]);
        announce("Game over. Score " + sim.score);
        break;
      } else {
        if (mode === "dying" || mode === "intermission") { mode = "playing"; hideOverlay(); }
        else mode = "playing";
        // intermission text
        if (sim.phase === "playing" && mode === "playing" && sim.tick % 60 === 0) { /* keep HUD fresh */ }
      }
      if (sim.score > high) { high = sim.score; Store.saveHigh(high); }
    }
    if (steps === 5) acc = 0; // drop backlog, keep fixed-step size (no variable dt)
    const alpha = Math.min(1, acc / STEP);
    renderer.render(sim, motion.sample(alpha), { mode });
    updateHUD();
    // dying/intermission banner
    if (mode === "dying") showOverlay("Hull Breach", "<p>Repairing damaged gears… +" + 5 + " each</p>", []);
    else if (mode === "intermission") showOverlay("Wave " + sim.wave + " cleared", "<p>Next formation inbound…</p>", []);
    else if (mode === "playing" && !hud.msg.classList.contains("hidden") && hud.msgTitle.textContent !== "Paused") hideOverlay();
  }

  // ---- events ----
  buttons.start.addEventListener("click", () => { audio.unlock(); newGame(); buttons.start.blur(); });
  buttons.restart.addEventListener("click", () => { audio.unlock(); newGame(); });
  buttons.resume.addEventListener("click", () => setPaused(false));
  buttons.mute.addEventListener("click", toggleMute);
  buttons.full.addEventListener("click", toggleFullscreen);
  buttons.sens.addEventListener("change", () => { prefs.sensitivity = buttons.sens.value; savePrefs(); });

  window.addEventListener("keydown", (e) => {
    if (e.code === "KeyP" || e.code === "Escape") {
      if (mode === "playing" || mode === "paused") { e.preventDefault(); setPaused(mode === "playing"); }
    } else if (e.code === "KeyM") toggleMute();
    else if (e.code === "KeyF") toggleFullscreen();
    else if (e.code === "Enter" || e.code === "Space") {
      if (mode === "title" || mode === "gameover") {
        // Space on title starts (but don't double-fire); Enter anywhere
        if (e.code === "Enter" || mode === "title") { e.preventDefault(); audio.unlock(); newGame(); }
      }
    }
  });
  canvas.addEventListener("pointerdown", () => audio.unlock(), { once: true });
  window.addEventListener("pointerdown", () => audio.unlock(), { once: true });

  // safe cleanup
  window.addEventListener("pagehide", () => { input.destroy(); });
  window.addEventListener("beforeunload", () => { input.destroy(); });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && mode === "playing") setPaused(true);
  });

  // init
  applyPrefsToUI();
  sim = Sim.createInitialState(seedBase, { highScore: high });
  sim.phase = "playing";
  motion.reset(sim);
  // title overlay; freeze sim until start (do not tick)
  mode = "title";
  showOverlay("MECHAPEDE",
    "<p>A mechanical arcade shooter. <strong>12-link tracked convoy</strong>, brass gears, amber leaders.</p>" +
    "<ul><li>Move: <kbd>WASD</kbd>/<kbd>←↑↓→</kbd> or trackball (click canvas, flick)</li>" +
    "<li>Fire: hold <kbd>Space</kbd> or primary-click (1 bolt, 7 px/tick)</li>" +
    "<li><kbd>P</kbd>/<kbd>Esc</kbd> pause · <kbd>M</kbd> mute · <kbd>F</kbd> fullscreen</li>" +
    "<li>Head 100 · Body 10 · Crawler 300/600/900 · Dispenser 200 · Drone 1000 · Extra hull every 12,000 (max 7)</li></ul>",
    ["start"]);
  updateHUD();
  requestAnimationFrame((t) => { lastTime = t; requestAnimationFrame(frame); });

  // test hooks (read-only unless reset with seed)
  window.__mechapede = {
    get sim() { return sim; },
    get mode() { return mode; },
    newGame, setPaused,
    tickOnce(ctl) { return Sim.tick(sim, ctl || { mx: 0, my: 0, fire: false, trackDX: 0, trackDY: 0 }); },
  };
})();
