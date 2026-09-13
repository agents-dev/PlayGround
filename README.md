# PlayGround — 🪱 Worms 3D

Turn-based 3D artillery mayhem in the browser. No build step — just serve and play.

Two teams of worms battle on a deformable island. Aim with the wind, crater the terrain,
and dunk your enemies into the sea.

## Play

Serve the folder (any static server) and open it:

```bash
npx serve .        # or: python3 -m http.server
```

Then **START BATTLE**. Modes: **You vs AI** or **Hotseat 2P**, 2–4 worms per team,
4 island generators (Random / Atoll / Peaks / Crater).

## Controls

| Input | Action |
|---|---|
| `WASD` | move worm (camera-relative) |
| `← → ↑ ↓` | aim (yaw / pitch / airstrike distance) |
| hold `SPACE` | charge bazooka / grenade, release to fire |
| tap `SPACE` | jump |
| `1–5` | Bazooka / Grenade / Shotgun / Airstrike / Teleport |
| `ENTER` | fire Shotgun / call Airstrike |
| drag / wheel | orbit / zoom camera |

## Arsenal

- 🚀 **Bazooka** — wind-affected rocket, big crater (60 dmg)
- 💣 **Grenade** — bouncing timed fuse (50 dmg)
- 🔫 **Shotgun** — 2 hitscan shots per turn (26 dmg each)
- ✈️ **Airstrike** — 6-bomb line strike (34 dmg each)
- 🌀 **Teleport** — click any dry land, ends turn

Falls hurt, water kills. 45 s per turn. Wind changes every turn.

## Tech

- `three@0.160` via CDN importmap, vanilla ES modules in `js/`
- Procedural heightfield island (`terrain.js`) with crater deformation
- Custom kinematic physics, pooled point particles, synthesized WebAudio SFX (`audio.js`)
- Simple ballistic AI (`ai.js`), hotseat multiplayer, game-over/rematch flow

## Files

```
index.html  style.css  js/{main,game,terrain,worm,projectiles,particles,ai,audio,config,utils}.js
```
