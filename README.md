# PlayGround

<!-- omgithub:readme:start -->
## 🚀 Build, play, and remix with OMGithub

**Created using [OMGithub.com](https://omgithub.com).**

[![OMGithub](https://img.shields.io/badge/OMGithub-Open%20project-orange?style=for-the-badge)](https://omgithub.com/agents-dev/PlayGround)
[![GitHub](https://img.shields.io/badge/GitHub-Source-181717?logo=github&style=for-the-badge)](https://github.com/agents-dev/PlayGround)

- 🎮 [Open the project](https://omgithub.com/agents-dev/PlayGround).
- ✨ [Remix this project](https://omgithub.com/?remix=agents-dev%2FPlayGround).
- 💻 [Explore the source](https://github.com/agents-dev/PlayGround).
- 🛠️ [Check build runs](https://github.com/agents-dev/PlayGround/actions).
- 🐛 [Report an issue](https://github.com/agents-dev/PlayGround/issues).
- 👤 [Explore the creator's projects](https://omgithub.com/agents-dev).
- 🌍 [Create with OMGithub](https://omgithub.com).
<!-- omgithub:readme:end -->

## SKYFALL — a Tribes-inspired 3D FPS

A browser first-person shooter built with **Three.js**, focused on the classic *Tribes* traversal loop: chain **jetpack** boosts with high-speed **ski** runs to cross a snowy arena and strike from above.

- **Movement**: WASD, hold **Space** for the jetpack (drains energy), hold **Shift** while moving downhill to ski and build momentum.
- **Combat**: **1** spinfusor (arcing disc, splash, disc-jumps), **2** chaingun (hitscan). **R** reload.
- **Teams**: you fight for the **AZURE** (blue) tribe alongside AI squadmates against the **CRIMSON** (red) tribe.
- **Vehicles**: press **E** near a parked vehicle to board an **AZURE TANK** (explosive cannon), **BUGGY** (fast machine gun) or **INTERCEPTOR** (flying plasma gunship) — mouse aims, LMB fires, **E** exits. All vehicles run on real rigid-body physics (Rapier WASM): raycast spring suspension, tire friction and steering for ground vehicles, torque/thrust flight dynamics for the interceptor, plus collisions, crash damage and ramming.
- **Objective**: steal the enemy flag and return it to your stand — first team to 15 wins.
- **Everything is procedural**: terrain, sky, clouds, forests, bases, vehicles, weapon models, characters, particle FX and all sound effects are generated in code (no external assets).

Run it locally:

```sh
npm install
npm run dev      # http://localhost:3002
npm run build    # static output in dist/
```
