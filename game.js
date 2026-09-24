import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.168.0/build/three.module.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.168.0/examples/jsm/controls/PointerLockControls.js';

const sceneHost = document.querySelector('#scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa9d7f4);
scene.fog = new THREE.Fog(0xa9d7f4, 24, 70);
const camera = new THREE.PerspectiveCamera(68, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 4.2, 8);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
sceneHost.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xe1f4ff, 0x69784d, 2.1));
const sun = new THREE.DirectionalLight(0xffe6b3, 3.2);
sun.position.set(-12, 20, 8); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -24; sun.shadow.camera.right = 24; sun.shadow.camera.top = 24; sun.shadow.camera.bottom = -24;
sun.shadow.bias = -0.0005; scene.add(sun);
const controls = new PointerLockControls(camera, renderer.domElement);
const raycaster = new THREE.Raycaster(); raycaster.far = 6;
const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
const materials = {};
const blockTypes = [
  { name: 'Grass', color: 0x84b75a, css: '#87ae55', count: 48 },
  { name: 'Dirt', color: 0xa87850, css: '#a87850', count: 32 },
  { name: 'Stone', color: 0x9ba6a2, css: '#9ba6a2', count: 24 },
  { name: 'Wood', color: 0xbf8b54, css: '#bf8b54', count: 16 },
  { name: 'Sand', color: 0xe5d29a, css: '#e5d29a', count: 24 },
  { name: 'Leaves', color: 0x72a66a, css: '#72a66a', count: 16 },
];
blockTypes.forEach((type) => { materials[type.name] = new THREE.MeshStandardMaterial({ color: type.color, roughness: 1 }); });
const blocks = new Map();
const keyFor = (x, y, z) => `${x},${y},${z}`;
function addBlock(x, y, z, type = 'Grass', removable = true) {
  const key = keyFor(x, y, z);
  if (blocks.has(key)) return;
  const mesh = new THREE.Mesh(blockGeometry, materials[type] || materials.Grass);
  mesh.position.set(x, y, z); mesh.castShadow = y > 0; mesh.receiveShadow = true;
  mesh.userData = { x, y, z, type, removable };
  scene.add(mesh); blocks.set(key, mesh);
}
function terrainHeight(x, z) {
  return Math.floor(0.65 * Math.sin(x * 0.31) + 0.48 * Math.cos(z * 0.39) + 0.3 * Math.sin((x + z) * 0.25));
}
for (let x = -21; x <= 21; x++) for (let z = -21; z <= 21; z++) {
  const top = terrainHeight(x, z);
  for (let y = -3; y <= top; y++) addBlock(x, y, z, y === top ? 'Grass' : y === top - 1 ? 'Dirt' : 'Stone');
}
// A stream, a gentle tree line, and little patches of wildflowers bring the meadow to life.
for (let z = -20; z <= 20; z++) {
  const x = Math.round(7 + Math.sin(z * 0.21) * 2);
  for (let dx = -1; dx <= 1; dx++) {
    const px = x + dx, py = terrainHeight(px, z);
    const top = blocks.get(keyFor(px, py, z));
    if (top && py === 0) { top.material = new THREE.MeshStandardMaterial({ color: 0x91b4a0, roughness: 0.88 }); }
  }
}
const flowerGeometry = new THREE.BoxGeometry(0.16, 0.26, 0.16);
const flowerMaterials = [0xe9c772, 0xf1e7d2, 0xc78492];
for (let x = -17; x <= 16; x++) for (let z = -18; z <= 18; z++) {
  if ((Math.abs(x) < 3 && Math.abs(z) < 3) || Math.abs(x - 7) < 1 || Math.abs(z) > 15) continue;
  if (Math.abs(Math.sin(x * 12.4 + z * 8.7)) > 0.965) {
    const flower = new THREE.Mesh(flowerGeometry, new THREE.MeshStandardMaterial({ color: flowerMaterials[Math.abs(x + z) % 3], roughness: 1 }));
    flower.position.set(x + 0.2, terrainHeight(x, z) + 0.59, z - 0.2); flower.castShadow = true; scene.add(flower);
  }
}
function makeTree(x, z, height = 3) {
  const base = terrainHeight(x, z);
  if (base > 1 || base < -1) return;
  for (let y = 1; y <= height; y++) addBlock(x, base + y, z, 'Wood', false);
  for (let dy = height - 1; dy <= height + 1; dy++) for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) {
    if (Math.abs(dx) + Math.abs(dz) + Math.max(0, Math.abs(dy - height)) <= 3 && !(dx === 0 && dz === 0 && dy <= height)) addBlock(x + dx, base + dy, z + dz, 'Leaves', false);
  }
}
makeTree(-8, -7, 3); makeTree(-12, -3, 4); makeTree(-9, 4, 3); makeTree(13, 1, 4); makeTree(11, 9, 3); makeTree(-15, 11, 3);
// The walkable earth stays perfectly level around the spawn point.
const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: 0x86ae61, roughness: 1 }));
ground.rotation.x = -Math.PI / 2; ground.position.y = -2.53; ground.receiveShadow = true; scene.add(ground);

let selected = 0;
let toastTimer;
const toast = document.querySelector('#toast');
function showToast(message) { toast.textContent = message; toast.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('visible'), 1500); }
function drawSlots(host, inventory = false) {
  host.innerHTML = '';
  blockTypes.forEach((type, index) => {
    const slot = document.createElement('button');
    slot.className = `slot${index === selected ? ' selected' : ''}`;
    slot.setAttribute('aria-label', `${type.name}, ${type.count} blocks`);
    slot.innerHTML = `<span class="slot-number">${index + 1}</span><span class="block-icon" style="--block-color:${type.css}"></span><span class="slot-name">${type.name}</span><span class="block-count">${type.count}</span>`;
    slot.addEventListener('click', () => selectBlock(index));
    host.appendChild(slot);
  });
}
function selectBlock(index) { selected = (index + blockTypes.length) % blockTypes.length; drawSlots(document.querySelector('#hotbar')); drawSlots(document.querySelector('#inventory-grid'), true); }
drawSlots(document.querySelector('#hotbar')); drawSlots(document.querySelector('#inventory-grid'), true);

const startScreen = document.querySelector('#start-screen');
const pauseScreen = document.querySelector('#pause-screen');
const inventoryScreen = document.querySelector('#inventory-screen');
const hint = document.querySelector('#interaction-hint');
let hasStarted = false;
let gameActive = false;
document.querySelector('#play-button').addEventListener('click', () => { hasStarted = true; gameActive = true; startScreen.classList.add('hidden'); controls.lock(); });
document.querySelector('#resume-button').addEventListener('click', () => { gameActive = true; controls.lock(); });
controls.addEventListener('lock', () => { gameActive = true; pauseScreen.classList.add('hidden'); inventoryScreen.classList.add('hidden'); hint.style.opacity = '0'; });
controls.addEventListener('unlock', () => {
  hint.style.opacity = '1';
  if (hasStarted && inventoryScreen.classList.contains('hidden')) { gameActive = false; pauseScreen.classList.remove('hidden'); }
});
document.querySelector('#objective-close').addEventListener('click', (event) => event.currentTarget.closest('.objective-card').remove());
document.querySelector('#inventory-button').addEventListener('click', () => { gameActive = false; inventoryScreen.classList.remove('hidden'); if (controls.isLocked) controls.unlock(); });
document.querySelector('#inventory-close').addEventListener('click', () => { inventoryScreen.classList.add('hidden'); if (hasStarted) gameActive = true; });
document.querySelector('#map-button').addEventListener('click', () => showToast('A whole meadow to find your way around ✦'));
document.querySelector('#sound-toggle').addEventListener('click', (event) => { event.currentTarget.textContent = event.currentTarget.textContent === '♫' ? '♪' : '♫'; showToast('A little quiet, a little music ✦'); });

const keys = {};
let velocityY = 0, grounded = false, previousTime = performance.now(), jumpQueued = false;
function pickBlock() {
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  const targets = [...blocks.values()];
  return raycaster.intersectObjects(targets, false)[0] || null;
}
renderer.domElement.addEventListener('contextmenu', (event) => event.preventDefault());
renderer.domElement.addEventListener('mousemove', (event) => {
  if (!gameActive || controls.isLocked || event.buttons !== 1) return;
  camera.rotation.order = 'YXZ';
  camera.rotation.y -= event.movementX * 0.002;
  camera.rotation.x = THREE.MathUtils.clamp(camera.rotation.x - event.movementY * 0.002, -Math.PI / 2, Math.PI / 2);
});
renderer.domElement.addEventListener('mousedown', (event) => {
  if (!gameActive) return;
  const hit = pickBlock();
  if (!hit) return;
  if (event.button === 0) {
    if (hit.object.userData.removable === false) return;
    const data = hit.object.userData; scene.remove(hit.object); blocks.delete(keyFor(data.x, data.y, data.z));
    const type = blockTypes.find((item) => item.name === data.type); if (type) type.count++;
    drawSlots(document.querySelector('#hotbar')); drawSlots(document.querySelector('#inventory-grid'), true);
    document.querySelector('#coordinates').textContent = `X ${Math.round(camera.position.x)}  Y ${Math.floor(camera.position.y)}  Z ${Math.round(camera.position.z)}`;
  } else if (event.button === 2) {
    const normal = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
    const pos = hit.object.position.clone().add(normal); const x = Math.round(pos.x), y = Math.round(pos.y), z = Math.round(pos.z);
    const player = new THREE.Vector3(camera.position.x, camera.position.y - 0.9, camera.position.z);
    if (Math.abs(x - player.x) < 0.8 && Math.abs(z - player.z) < 0.8 && y >= Math.floor(player.y - 1) && y <= Math.floor(camera.position.y)) return;
    if (!blocks.has(keyFor(x, y, z)) && blockTypes[selected].count > 0) { addBlock(x, y, z, blockTypes[selected].name); blockTypes[selected].count--; drawSlots(document.querySelector('#hotbar')); drawSlots(document.querySelector('#inventory-grid'), true); }
  }
});
addEventListener('keydown', (event) => {
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) event.preventDefault();
  if (event.code === 'Escape' && gameActive && !controls.isLocked && inventoryScreen.classList.contains('hidden')) {
    gameActive = false;
    pauseScreen.classList.remove('hidden');
    return;
  }
  if (event.code.startsWith('Digit') && Number(event.code.slice(5)) >= 1 && Number(event.code.slice(5)) <= blockTypes.length) selectBlock(Number(event.code.slice(5)) - 1);
  if (event.code === 'KeyE' && !event.repeat) {
    if (inventoryScreen.classList.contains('hidden')) { gameActive = false; inventoryScreen.classList.remove('hidden'); if (controls.isLocked) controls.unlock(); }
    else { inventoryScreen.classList.add('hidden'); gameActive = true; }
  }
  if (event.code === 'Space' && gameActive) jumpQueued = true;
  keys[event.code] = true;
});
addEventListener('keyup', (event) => { keys[event.code] = false; });
addEventListener('blur', () => { Object.keys(keys).forEach((key) => { keys[key] = false; }); });
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });

let elapsed = 0, lastHudUpdate = 0;
function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min((now - previousTime) / 1000, 0.05); previousTime = now; elapsed += dt;
  if (gameActive && inventoryScreen.classList.contains('hidden') && pauseScreen.classList.contains('hidden')) {
    const forward = Number(keys.KeyW || keys.ArrowUp) - Number(keys.KeyS || keys.ArrowDown);
    const sideways = Number(keys.KeyD || keys.ArrowRight) - Number(keys.KeyA || keys.ArrowLeft);
    if (forward || sideways) {
      const speed = (keys.ShiftLeft ? 6.4 : 4.5) * dt;
      const direction = new THREE.Vector3(); camera.getWorldDirection(direction); direction.y = 0; direction.normalize();
      const right = new THREE.Vector3().crossVectors(direction, camera.up).normalize();
      camera.position.addScaledVector(direction, forward * speed);
      camera.position.addScaledVector(right, sideways * speed);
    }
    const floorY = terrainHeight(Math.round(camera.position.x), Math.round(camera.position.z)) + 2.12;
    if (camera.position.y <= floorY + 0.025) { camera.position.y = floorY; velocityY = 0; grounded = true; }
    else grounded = false;
    if (jumpQueued && grounded) { velocityY = 6.6; grounded = false; }
    jumpQueued = false; velocityY -= 19 * dt; camera.position.y = Math.max(floorY, camera.position.y + velocityY * dt);
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -20.4, 20.4); camera.position.z = THREE.MathUtils.clamp(camera.position.z, -20.4, 20.4);
  }
  const hours = 10 + Math.floor(elapsed / 90) % 10;
  const mins = String(Math.floor((elapsed % 90) / 1.5)).padStart(2, '0');
  document.querySelector('#time-label').textContent = `${hours > 12 ? hours - 12 : hours}:${mins} ${hours >= 12 ? 'PM' : 'AM'}`;
  if (now - lastHudUpdate > 150) {
    document.querySelector('#coordinates').textContent = `X ${Math.round(camera.position.x)}   Y ${Math.floor(camera.position.y)}   Z ${Math.round(camera.position.z)}`;
    lastHudUpdate = now;
  }
  renderer.render(scene, camera);
}
requestAnimationFrame(animate);
