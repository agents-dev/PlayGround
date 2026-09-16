"use strict";
/* storage: high score + prefs in localStorage. No gameplay mutation. */
const HIGH_KEY = "mechapede.high";
const PREFS_KEY = "mechapede.prefs";
const DEFAULT_PREFS = { sensitivity: "med", mute: false, trackball: true };

function loadHigh() {
  try { return parseInt(localStorage.getItem(HIGH_KEY) || "0", 10) || 0; }
  catch { return 0; }
}
function saveHigh(v) {
  try { localStorage.setItem(HIGH_KEY, String(v | 0)); } catch {}
}
function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch { return { ...DEFAULT_PREFS }; }
}
function savePrefs(p) {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(p)); } catch {}
}
if (typeof module !== "undefined") module.exports = { loadHigh, saveHigh, loadPrefs, savePrefs };
if (typeof window !== "undefined") window.MechStore = { loadHigh, saveHigh, loadPrefs, savePrefs };
