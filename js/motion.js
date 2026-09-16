"use strict";
/* motion: visual interpolation between sim ticks. Copies positions, never mutates sim. */
function createMotion() {
  let prev = null, curr = null;
  function cloneDyn(state) {
    // copy only animated fields
    return {
      tick: state.tick,
      player: { ...state.player },
      bolt: state.bolt ? { ...state.bolt } : null,
      chains: state.chains.map(c => ({ dir: c.dir, segs: c.segs.map(s => ({ ...s })) })),
      crawler: state.crawler ? { ...state.crawler } : null,
      dispenser: state.dispenser ? { ...state.dispenser } : null,
      drone: state.drone ? { ...state.drone } : null,
    };
  }
  function push(state) { prev = curr; curr = cloneDyn(state); if (!prev) prev = curr; }
  function reset(state) { prev = cloneDyn(state); curr = cloneDyn(state); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function sample(alpha) {
    if (!prev || !curr) return curr;
    // interpolate player + bolt + segs by index (chains matched by order; splits may pop — fallback to curr)
    const out = {
      player: { x: lerp(prev.player.x, curr.player.x, alpha), y: lerp(prev.player.y, curr.player.y, alpha), alive: curr.player.alive },
      bolt: null, chains: [], crawler: null, dispenser: null, drone: null,
    };
    if (curr.bolt && prev.bolt) out.bolt = { x: lerp(prev.bolt.x, curr.bolt.x, alpha), y: lerp(prev.bolt.y, curr.bolt.y, alpha) };
    else if (curr.bolt) out.bolt = { ...curr.bolt };
    const n = Math.min(prev.chains.length, curr.chains.length);
    for (let i = 0; i < curr.chains.length; i++) {
      const cc = curr.chains[i], pp = prev.chains[Math.min(i, prev.chains.length - 1)];
      const segs = cc.segs.map((s, j) => {
        const q = pp && pp.segs[Math.min(j, pp.segs.length - 1)];
        if (!q) return { ...s };
        return { x: lerp(q.x, s.x, alpha), y: lerp(q.y, s.y, alpha), poison: s.poison };
      });
      out.chains.push({ dir: cc.dir, segs });
    }
    if (curr.crawler) out.crawler = prev.crawler ? { ...curr.crawler, x: lerp(prev.crawler.x, curr.crawler.x, alpha), y: lerp(prev.crawler.y, curr.crawler.y, alpha) } : { ...curr.crawler };
    if (curr.dispenser) out.dispenser = prev.dispenser ? { ...curr.dispenser, x: lerp(prev.dispenser.x, curr.dispenser.x, alpha), y: lerp(prev.dispenser.y, curr.dispenser.y, alpha) } : { ...curr.dispenser };
    if (curr.drone) out.drone = prev.drone ? { ...curr.drone, x: lerp(prev.drone.x, curr.drone.x, alpha) } : { ...curr.drone };
    return out;
  }
  return { push, reset, sample };
}
if (typeof module !== "undefined") module.exports = { createMotion };
if (typeof window !== "undefined") window.MechMotion = { createMotion };
