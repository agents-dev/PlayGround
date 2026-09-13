// Very small turn-based AI: walk toward nearest enemy, then lob a bazooka.
export class WormAI {
  constructor() {
    this.plan = null;
  }

  startTurn(game, worm) {
    const foes = game.worms.filter((w) => w.alive && w.team !== worm.team);
    if (!foes.length) return null;
    let best = foes[0], bd = 1e9;
    for (const f of foes) {
      const d = worm.pos.distanceTo(f.pos);
      if (d < bd) { bd = d; best = f; }
    }
    this.plan = {
      target: best,
      phase: bd > 14 ? 'walk' : 'aim',
      t: 0,
      aimT: 0,
      walkDir: null,
      lockedYaw: 0,
      lockedPitch: 42,
      lockedPower: 0.65,
    };
    if (bd > 14) {
      const dx = best.pos.x - worm.pos.x, dz = best.pos.z - worm.pos.z;
      this.plan.walkDir = Math.atan2(dx, dz);
    }
    return this.plan;
  }

  // Solves a rough ballistic (no wind comp — adds error like a human).
  solve(worm, target, wind) {
    const dx = target.pos.x - worm.pos.x, dz = target.pos.z - worm.pos.z;
    const dist = Math.hypot(dx, dz);
    const yaw = Math.atan2(dx, dz);
    const pitch = 38 + Math.min(22, dist * 0.55) + (Math.random() * 8 - 4);
    const power = Math.min(1, 0.34 + dist / 52 + Math.random() * 0.08);
    // wind compensation attempt (imperfect)
    const comp = Math.max(-0.12, Math.min(0.12, -wind * 0.008));
    return { yaw: yaw + comp + (Math.random() - 0.5) * 0.1, pitch, power };
  }
}
