// Nexus Wars guide widgets: income calc + race tabs. 3D battle lives in game3d.js.
const ip = document.getElementById('in-pylons'), iu = document.getElementById('in-units');
function calc() {
  if (!ip || !iu) return;
  const p = +ip.value, u = +iu.value;
  document.getElementById('out-pylons').textContent = p;
  document.getElementById('out-units').textContent = u;
  document.getElementById('income').textContent = `${10 + p * 8 + u * 2} minerals / 20s (10 base)`;
}
if (ip && iu) { ip.oninput = calc; iu.oninput = calc; calc(); }

// race tabs
const texts = {
  protoss: 'Protoss: Immortals early, Archons mid, Carrier + Mothership Core deathball late. Upgrade shields first.',
  terran: 'Terran: Tanks hold early, Warhounds snipe Immortals/Tanks, Thor + Viking answer air. Best mid flex.',
  zerg: 'Zerg: Infestors (unsynced, max ~12) + Mutas mid, then Scourge + Vipers pull Thors/Colossi. Kerrigan hero closes.'
};
document.querySelectorAll('.race-tabs button').forEach(b => b.onclick = () => {
  document.querySelectorAll('.race-tabs button').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  document.getElementById('race-text').textContent = texts[b.dataset.race];
});
const clockEl = document.getElementById('clock');
if (clockEl) clockEl.textContent = '· ' + new Date().toISOString().slice(0, 10);
