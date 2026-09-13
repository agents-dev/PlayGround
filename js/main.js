import * as THREE from 'three';
import { Game } from './game.js';

const canvas = document.getElementById('scene');
const game = new Game(canvas);
window.__wormsGame = game; // debug handle

let mode = 'ai', count = 3, island = 'random';
document.querySelectorAll('#mode-seg button').forEach((b) => {
  b.onclick = () => {
    document.querySelectorAll('#mode-seg button').forEach((x) => x.classList.remove('active'));
    b.classList.add('active'); mode = b.dataset.mode;
  };
});
document.querySelectorAll('#count-seg button').forEach((b) => {
  b.onclick = () => {
    document.querySelectorAll('#count-seg button').forEach((x) => x.classList.remove('active'));
    b.classList.add('active'); count = Number(b.dataset.n);
  };
});
document.querySelectorAll('#island-seg button').forEach((b) => {
  b.onclick = () => {
    document.querySelectorAll('#island-seg button').forEach((x) => x.classList.remove('active'));
    b.classList.add('active'); island = b.dataset.seed;
  };
});

document.getElementById('btn-start').onclick = () => game.newBattle(mode, count, island);
document.getElementById('btn-rematch').onclick = () => game.newBattle(mode, count, 'random');
document.getElementById('btn-tomenu').onclick = () => location.reload();

// boot: render loop with an idle orbiting camera behind the menu
game.resize();

const clock = new THREE.Clock();
function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, clock.getDelta());
  // idle menu camera drift
  if (game.state === 'menu' && !game.terrain) {
    const t = performance.now() * 0.0001;
    game.camera.position.set(Math.sin(t) * 60, 30, Math.cos(t) * 60);
    game.camera.lookAt(0, 0, 0);
    game.env.clouds.children.forEach((c, i) => { c.position.x += dt * 0.5; if (c.position.x > 170) c.position.x = -170; });
  } else {
    game.update(dt);
  }
  game.renderer.render(game.scene, game.camera);
}
document.getElementById('loading').style.display = 'none';
loop();
