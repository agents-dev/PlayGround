"use strict";
/* input: keyboard + trackball (relative pointer) with momentum, friction, braking.
   Produces per-tick {mx,my,fire,trackDX,trackDY}. Safe cleanup via destroy(). */
function createInput(canvas, getPrefs) {
  const keys = new Set();
  const state = {
    mx: 0, my: 0, fire: false, firePointer: false,
    velX: 0, velY: 0, // trackball momentum in logical px/tick
    pendingDX: 0, pendingDY: 0,
    usingPointer: false,
  };
  const SENS = { low: 0.35, med: 0.7, high: 1.2 };
  function sensScale() {
    const p = (getPrefs && getPrefs()) || {};
    return SENS[p.sensitivity] || SENS.med;
  }
  // Trackball physics constants
  const FRICTION = 0.90;      // per-tick velocity decay
  const STOP_EPS = 0.02;
  const MAX_VEL = 6;

  function onKeyDown(e) {
    if (e.repeat && (e.code === "Space")) { e.preventDefault(); return; }
    keys.add(e.code);
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(e.code)) e.preventDefault();
  }
  function onKeyUp(e) { keys.delete(e.code); }
  function onBlur() { keys.clear(); state.firePointer = false; state.velX = 0; state.velY = 0; }

  function pushRelative(dx, dy) {
    const s = sensScale();
    let vx = dx * s * (240 / canvas.clientWidth || 1) * 0.5;
    let vy = dy * s * (256 / canvas.clientHeight || 1) * 0.5;
    // precision braking: if new input opposes momentum, kill momentum fast
    if (Math.sign(vx) !== 0 && Math.sign(vx) !== Math.sign(state.velX)) state.velX *= 0.25;
    if (Math.sign(vy) !== 0 && Math.sign(vy) !== Math.sign(state.velY)) state.velY *= 0.25;
    // fast-flick momentum: accumulate, clamp
    state.velX = Math.max(-MAX_VEL, Math.min(MAX_VEL, state.velX + vx));
    state.velY = Math.max(-MAX_VEL, Math.min(MAX_VEL, state.velY + vy));
  }

  function onMouseMove(e) {
    if (document.pointerLockElement === canvas) {
      pushRelative(e.movementX || 0, e.movementY || 0);
    }
  }
  function onPointerMove(e) {
    // fallback drag when pointer lock unavailable: relative deltas while button held
    if (state.usingPointer && e.buttons === 1 && e.movementX !== undefined) {
      pushRelative(e.movementX || 0, e.movementY || 0);
    }
  }
  function onPointerDown(e) {
    if (e.button === 0) {
      state.firePointer = true;
      state.usingPointer = true;
      // try pointer lock for true relative trackball (guard errors)
      try {
        if (canvas.requestPointerLock && document.pointerLockElement !== canvas) {
          const p = canvas.requestPointerLock({ unadjustedMovement: true });
          if (p && p.catch) p.catch(() => { try { canvas.requestPointerLock(); } catch {} });
        }
      } catch { try { canvas.requestPointerLock(); } catch {} }
    }
  }
  function onPointerUp(e) {
    if (e.button === 0) { state.firePointer = false; state.usingPointer = false; }
  }
  function onContextLost() { state.firePointer = false; }

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);
  document.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onContextLost);

  function poll() {
    // keyboard axes
    let mx = 0, my = 0;
    if (keys.has("ArrowLeft") || keys.has("KeyA")) mx -= 1;
    if (keys.has("ArrowRight") || keys.has("KeyD")) mx += 1;
    if (keys.has("ArrowUp") || keys.has("KeyW")) my -= 1;
    if (keys.has("ArrowDown") || keys.has("KeyS")) my += 1;
    const fire = keys.has("Space") || state.firePointer;
    // consume momentum: apply current velocity as track delta, then friction
    let tdx = state.velX, tdy = state.velY;
    // precision braking: keyboard input opposing momentum damps harder
    if (mx !== 0 && Math.sign(mx) !== Math.sign(state.velX)) state.velX *= 0.4;
    if (my !== 0 && Math.sign(my) !== Math.sign(state.velY)) state.velY *= 0.4;
    state.velX *= FRICTION; state.velY *= FRICTION;
    if (Math.abs(state.velX) < STOP_EPS) state.velX = 0;
    if (Math.abs(state.velY) < STOP_EPS) state.velY = 0;
    // when pointer lock not held and no flick, deltas decay to zero naturally
    return { mx, my, fire, trackDX: tdx, trackDY: tdy };
  }
  function isPausePressed(e) { return e.code === "KeyP" || e.code === "Escape"; }

  function destroy() {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("blur", onBlur);
    document.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", onContextLost);
    if (document.pointerLockElement === canvas) { try { document.exitPointerLock(); } catch {} }
  }
  return { poll, keys, state, destroy, isPausePressed, exitLock() { if (document.pointerLockElement === canvas) try { document.exitPointerLock(); } catch {} } };
}
if (typeof module !== "undefined") module.exports = { createInput };
if (typeof window !== "undefined") window.MechInput = { createInput };
