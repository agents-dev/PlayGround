// ---------------------------------------------------------------------------
// HUD DOM bindings
// ---------------------------------------------------------------------------

export class Hud {
  constructor() {
    this.root = document.getElementById('hud');
    this.msg = document.getElementById('msg');
    this.flagStatus = document.getElementById('flag-status');
    this.speedVal = document.getElementById('speed-val');
    this.speedBox = document.getElementById('speed');
    this.healthFill = document.getElementById('health-fill');
    this.energyFill = document.getElementById('energy-fill');
    this.caps = document.getElementById('caps');
    this.kills = document.getElementById('kills');
    this.deaths = document.getElementById('deaths');
    this.hitmarker = document.getElementById('hitmarker');
    this.msgTimer = null;
    this.hitTimer = null;
  }

  show() { this.root.classList.remove('hidden'); }
  hide() { this.root.classList.add('hidden'); }

  message(text, ms = 2400) {
    this.msg.textContent = text;
    this.msg.classList.add('show');
    clearTimeout(this.msgTimer);
    this.msgTimer = setTimeout(() => this.msg.classList.remove('show'), ms);
  }

  flag(text) { this.flagStatus.textContent = text; }

  hit() {
    this.hitmarker.classList.add('show');
    clearTimeout(this.hitTimer);
    this.hitTimer = setTimeout(() => this.hitmarker.classList.remove('show'), 60);
  }

  update(player, caps, kills, deaths) {
    const kmh = Math.round(player.vel.length() * 3.6);
    this.speedVal.textContent = kmh;
    this.speedBox.classList.toggle('fast', kmh > 100);
    this.healthFill.style.width = `${Math.max(0, player.health)}%`;
    this.healthFill.classList.toggle('low', player.health < 35);
    this.energyFill.style.width = `${Math.max(0, player.energy)}%`;
    this.caps.textContent = caps;
    this.kills.textContent = kills;
    this.deaths.textContent = deaths;
  }
}
