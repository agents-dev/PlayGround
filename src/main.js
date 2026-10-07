import * as THREE from 'three';
import { buildTerrain, heightAt, BLUE_BASE, RED_BASE } from './terrain.js';
import { Player } from './player.js';
import { Combat } from './weapons.js';
import { Drones } from './enemies.js';
import { Hud } from './hud.js';
import { GameAudio } from './audio.js';

// ---------------------------------------------------------------------------

const DEBUG = new URLSearchParams(location.search).has('debug');
const errors = [];
window.addEventListener('error', (e) => errors.push(String(e.message)));

const app = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xbfd9e8, 250, 2700);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 6000);

// lights
scene.add(new THREE.HemisphereLight(0xbfe3ff, 0x54663f, 0.9));
const sun = new THREE.DirectionalLight(0xfff2dd, 2.0);
sun.position.set(-0.5, 1, -0.35).multiplyScalar(1000);
scene.add(sun);

// sky dome
{
  const skyGeo = new THREE.SphereGeometry(5200, 24, 16);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { sunDir: { value: sun.position.clone().normalize() } },
    vertexShader: `
      varying vec3 vDir;
      void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      varying vec3 vDir; uniform vec3 sunDir;
      void main() {
        float h = clamp(vDir.y, -1.0, 1.0);
        vec3 horizon = vec3(0.80, 0.88, 0.94);
        vec3 zenith  = vec3(0.16, 0.42, 0.72);
        vec3 col = mix(horizon, zenith, smoothstep(0.0, 0.55, h));
        col = mix(col, vec3(0.55, 0.52, 0.42), smoothstep(-0.02, -0.3, h));
        float s = max(dot(vDir, sunDir), 0.0);
        col += vec3(1.0, 0.85, 0.6) * (pow(s, 350.0) * 0.9 + pow(s, 24.0) * 0.16);
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const dome = new THREE.Mesh(skyGeo, skyMat);
  dome.frustumCulled = false;
  scene.add(dome);
  scene.userData.skyDome = dome;
}

// world
const world = buildTerrain(scene);

// game objects
const player = new Player();
const combat = new Combat(scene);
const drones = new Drones(scene, combat);
const hud = new Hud();
const audio = new GameAudio();

// ---------------------------------------------------------------------------
// CTF state (player steals the red flag, returns it to the blue stand)
// ---------------------------------------------------------------------------

const redBanner = scene.getObjectByName('red-banner');
const redFlagHome = { parent: redBanner.parent, pos: redBanner.position.clone() };
let carrying = false;
let caps = 0, kills = 0, deaths = 0;

// carried-flag beacon attached to player view
let _bt = null;
const carryMarker = new THREE.Sprite(new THREE.SpriteMaterial({
  map: bannerGlowTexture(), color: 0xff5040, blending: THREE.AdditiveBlending, depthWrite: false,
}));
carryMarker.scale.setScalar(6);
carryMarker.visible = false;
scene.add(carryMarker);

function bannerGlowTexture() {
  if (_bt) return _bt;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
  _bt = new THREE.CanvasTexture(c);
  return _bt;
}

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

const input = { moveX: 0, moveY: 0, ski: false, jet: false, jumpPressed: false, firing: false };
const keys = new Set();

function refreshMove() {
  input.moveX = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0);
  input.moveY = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0);
  input.ski = keys.has('Space');
  input.jet = keys.has('ShiftLeft') || keys.has('ShiftRight') || mouse.right;
}

addEventListener('keydown', (e) => {
  if (e.code === 'Space') e.preventDefault();
  if (e.code === 'Space' && !e.repeat) input.jumpPressed = true;
  keys.add(e.code);
  refreshMove();
});
addEventListener('keyup', (e) => { keys.delete(e.code); refreshMove(); });

const mouse = { right: false };
addEventListener('mousedown', (e) => {
  if (!playing) return;
  if (e.button === 0) input.firing = true;
  if (e.button === 2) { mouse.right = true; refreshMove(); }
});
addEventListener('mouseup', (e) => {
  if (e.button === 0) input.firing = false;
  if (e.button === 2) { mouse.right = false; refreshMove(); }
});
addEventListener('contextmenu', (e) => e.preventDefault());
addEventListener('mousemove', (e) => {
  if (document.pointerLockElement === renderer.domElement && playing) {
    player.lookDelta(e.movementX, e.movementY);
  }
});

// ---------------------------------------------------------------------------
// Menu / pointer lock / lifecycle
// ---------------------------------------------------------------------------

const menu = document.getElementById('menu');
const deathScreen = document.getElementById('death');
const deathInfo = document.getElementById('death-info');
let playing = false;
let prevDead = false;
let shake = 0;

document.getElementById('play').addEventListener('click', () => {
  audio.init();
  startPlay();
  renderer.domElement.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement !== renderer.domElement && playing && !DEBUG) {
    playing = false;
    menu.classList.remove('hidden');
    hud.hide();
  }
});
function startPlay() {
  playing = true;
  menu.classList.add('hidden');
  hud.show();
}

if (DEBUG) {
  startPlay();
  audio.enabled = false;
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// ---------------------------------------------------------------------------
// Combat wiring
// ---------------------------------------------------------------------------

let fireCooldown = 0;

combat.onDroneHit = (dr, dmg) => {
  hud.hit();
  audio.hit();
  if (dr.hp <= 0 && !dr.dead) {
    drones.kill(dr);
    kills++;
    audio.explosion();
    hud.message('DRONE DESTROYED', 1200);
  }
};

combat.onPlayerHit = (dmg) => {
  player.hurt(dmg, combat.time);
  audio.hurt();
};

combat.onExplosion = (pos) => {
  const d = pos.distanceTo(player.pos);
  if (d < 120) audio.boom(0.5 * Math.max(0.15, 1 - d / 120), 0.5);
  if (d < 26) shake = Math.max(shake, (1 - d / 26) * 0.6);
};

// ---------------------------------------------------------------------------
// Flag logic
// ---------------------------------------------------------------------------

const _fp = new THREE.Vector3();
const _fp2 = new THREE.Vector3();

function updateFlag() {
  const blueStand = _fp.set(BLUE_BASE.x, heightAt(BLUE_BASE.x, BLUE_BASE.z) + 2, BLUE_BASE.z);

  if (!carrying) {
    // pickup: near the flag stand (pole base), not the banner up the pole
    redBanner.getWorldPosition(_fp2);
    _fp2.y = heightAt(_fp2.x, _fp2.z) + 1;
    if (!player.dead && player.pos.distanceTo(_fp2) < 7) {
      carrying = true;
      scene.attach(redBanner);           // keep world transform, move to scene
      audio.pickup();
      hud.message('FLAG TAKEN!', 2000);
    }
  } else {
    // flag rides above the player
    redBanner.position.set(player.pos.x, player.pos.y + 3.6, player.pos.z);
    redBanner.rotation.y += 0.05;
    carryMarker.visible = true;
    carryMarker.position.copy(redBanner.position).y += 0.5;

    if (player.dead) {
      returnFlag();
      hud.message('FLAG RETURNED', 1800);
    } else if (player.pos.distanceTo(blueStand) < 16) {
      caps++;
      returnFlag();
      audio.capture();
      hud.message('FLAG CAPTURED!  +1', 2600);
    }
  }

  carryMarker.visible = carrying;
  hud.flag(carrying ? 'YOU HAVE THE FLAG — RETURN TO THE BLUE STAND' : '');
}

function returnFlag() {
  carrying = false;
  redFlagHome.parent.add(redBanner);
  redBanner.position.copy(redFlagHome.pos);
  redBanner.rotation.set(0, 0, 0);
  carryMarker.visible = false;
}

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------

const clock = new THREE.Clock();
const _eye = new THREE.Vector3();
const _dir = new THREE.Vector3();
let bobPhase = 0;

function tick() {
  requestAnimationFrame(tick);
  const dt = Math.min(clock.getDelta(), 0.05);
  const now = clock.elapsedTime;

  if (playing) {
    // fire spinfusor
    fireCooldown -= dt;
    if (input.firing && fireCooldown <= 0 && !player.dead) {
      fireCooldown = 0.85;
      player.eyePos(_eye);
      player.forwardDir(_dir);
      combat.fireDisc(_eye, _dir, player.vel);
      player.kickPitch = 0.035;
      shake = Math.max(shake, 0.08);
      audio.fire();
    }

    player.update(dt, input, now);
    if (player.justJumped) audio.jump();
    drones.update(dt, player);
    combat.update(dt, player, drones.list);
    updateFlag();

    audio.setJet(player.jetting);
    audio.setWind(THREE.MathUtils.clamp(player.vel.length() / 70, 0, 1));

    // death transition
    if (player.dead && !prevDead) {
      deaths++;
      deathInfo.textContent = `Captures ${caps} · Kills ${kills}`;
      deathScreen.classList.remove('hidden');
    } else if (!player.dead && prevDead) {
      deathScreen.classList.add('hidden');
    }
    prevDead = player.dead;

    hud.update(player, caps, kills, deaths);
  }

  // ---- camera ----
  player.eyePos(_eye);
  // walk bob
  if (player.onGround && !player.skiing && player.speedH > 1 && !player.dead) {
    bobPhase += dt * player.speedH * 1.4;
    _eye.y += Math.sin(bobPhase) * 0.05;
  }
  shake = Math.max(0, shake - dt * 2.2);
  if (shake > 0) {
    _eye.x += (Math.random() - 0.5) * shake * 0.5;
    _eye.y += (Math.random() - 0.5) * shake * 0.5;
  }
  camera.position.copy(_eye);
  const roll = THREE.MathUtils.clamp(-input.moveX * 0.012 - (player.skiing ? player.speedH * 0.0004 : 0), -0.05, 0.05);
  camera.rotation.set(player.pitch + player.kickPitch, player.yaw, roll, 'YXZ');

  // speed FOV kick
  const targetFov = 75 + Math.min(player.speedH, 70) * 0.32;
  camera.fov += (targetFov - camera.fov) * Math.min(1, dt * 5);
  camera.updateProjectionMatrix();

  scene.userData.skyDome.position.copy(camera.position);
  renderer.render(scene, camera);
}

tick();

// debug / verification hooks
window.__game = {
  THREE, scene, renderer, camera, player, drones, combat, input,
  errors,
  heightAt,
  isCarrying: () => carrying,
  isPlaying: () => playing,
  getCooldown: () => fireCooldown,
  teleport: (x, z) => { player.pos.set(x, heightAt(x, z) + 2, z); player.vel.set(0, 0, 0); },
  stats: () => ({
    calls: renderer.info.render.calls,
    triangles: renderer.info.render.triangles,
    playerPos: player.pos.toArray().map((v) => +v.toFixed(1)),
    speed: +player.vel.length().toFixed(1),
    health: player.health,
    dronesAlive: drones.list.filter((d) => !d.dead).length,
    errors,
  }),
};
