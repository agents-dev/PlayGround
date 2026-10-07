export class HUD {
  constructor() {
    this.el = {
      hud: document.getElementById('hud'),
      menu: document.getElementById('menu'),
      pause: document.getElementById('pause'),
      loading: document.getElementById('loading'),
      loaderFill: document.getElementById('loader-fill'),
      loadStatus: document.getElementById('load-status'),
      healthFill: document.getElementById('health-fill'),
      healthValue: document.getElementById('health-value'),
      energyFill: document.getElementById('energy-fill'),
      energyValue: document.getElementById('energy-value'),
      weaponName: document.getElementById('weapon-name'),
      ammoMag: document.getElementById('ammo-mag'),
      ammoReserve: document.getElementById('ammo-reserve'),
      speed: document.getElementById('speed-value'),
      ski: document.getElementById('ski-indicator'),
      crosshair: document.getElementById('crosshair'),
      hitmarker: document.getElementById('hitmarker'),
      killfeed: document.getElementById('killfeed'),
      damage: document.getElementById('damage-flash'),
      toast: document.getElementById('toast'),
      scoreBlue: document.getElementById('score-blue'),
      scoreRed: document.getElementById('score-red'),
      reloadHint: document.getElementById('reload-hint'),
      weaponCard: document.getElementById('weapon-card'),
      vehiclePanel: document.getElementById('vehicle-panel'),
      vehicleName: document.getElementById('vehicle-name'),
      vehicleHealthFill: document.getElementById('vehicle-health-fill'),
      enterPrompt: document.getElementById('enter-prompt'),
      enterName: document.getElementById('enter-name'),
      play: document.getElementById('play'),
      resume: document.getElementById('resume'),
    }
    this._hitTimer = 0
    this._toastTimer = 0
    this._firingTimer = 0
    this._damageTimer = 0
  }

  setLoading(pct, label) {
    if (this.el.loaderFill) this.el.loaderFill.style.width = `${Math.round(pct * 100)}%`
    if (label && this.el.loadStatus) this.el.loadStatus.textContent = label
  }

  hideLoading() { this.el.loading.classList.add('hidden') }
  showMenu() { this.el.menu.classList.remove('hidden') }
  hideMenu() { this.el.menu.classList.add('hidden') }
  showPause() { this.el.pause.classList.remove('hidden') }
  hidePause() { this.el.pause.classList.add('hidden') }
  showHud() { this.el.hud.classList.remove('hidden') }
  hideHud() { this.el.hud.classList.add('hidden') }

  update(dt, player, scores) {
    const h = Math.max(0, player.health) / player.maxHealth
    this.el.healthFill.style.width = `${h * 100}%`
    this.el.healthValue.textContent = Math.ceil(Math.max(0, player.health))
    const e = player.energy / player.maxEnergy
    this.el.energyFill.style.width = `${e * 100}%`
    this.el.energyValue.textContent = Math.ceil(player.energy)

    const w = player.weapons[player.weaponIndex]
    this.el.weaponName.textContent = w.name
    this.el.ammoMag.textContent = w.reloading > 0 ? '--' : w.ammo
    this.el.ammoReserve.textContent = `/ ${w.reserve}`
    this.el.speed.textContent = Math.round(player.speed * 3.6)
    this.el.ski.classList.toggle('on', player.isSkiing)
    this.el.reloadHint.classList.toggle('hidden', !player.reloadHint || w.reloading > 0)

    if (player.vehicle) {
      const v = player.vehicle
      this.el.vehiclePanel.classList.remove('hidden')
      this.el.weaponCard.classList.add('hidden')
      this.el.vehicleName.textContent = v.name
      this.el.vehicleHealthFill.style.width = `${Math.max(0, v.hp) / v.maxHp * 100}%`
    } else {
      this.el.vehiclePanel.classList.add('hidden')
      this.el.weaponCard.classList.remove('hidden')
    }

    this.el.scoreBlue.textContent = scores.blue
    this.el.scoreRed.textContent = scores.red

    if (this._firingTimer > 0) {
      this._firingTimer -= dt
      this.el.crosshair.classList.toggle('firing', this._firingTimer > 0)
    }
    if (this._hitTimer > 0) {
      this._hitTimer -= dt
      if (this._hitTimer <= 0) this.el.hitmarker.classList.remove('show')
    }
    if (this._toastTimer > 0) {
      this._toastTimer -= dt
      if (this._toastTimer <= 0) this.el.toast.classList.remove('show')
    }
    if (this._damageTimer > 0) {
      this._damageTimer -= dt
      this.el.damage.style.opacity = Math.max(0, this._damageTimer / 0.5) * 0.9
    }
  }

  fireFeedback() {
    this._firingTimer = 0.05
    this.el.crosshair.classList.add('firing')
  }

  setEnterPrompt(name) {
    if (name) {
      this.el.enterName.textContent = name
      this.el.enterPrompt.classList.remove('hidden')
    } else {
      this.el.enterPrompt.classList.add('hidden')
    }
  }

  hit(kill = false) {
    const h = this.el.hitmarker
    h.classList.remove('show')
    h.classList.toggle('kill', kill)
    void h.offsetWidth
    h.classList.add('show')
    this._hitTimer = 0.3
  }

  damageIndicator() {
    this._damageTimer = 0.5
  }

  toast(text, duration = 1.6) {
    this.el.toast.textContent = text
    this.el.toast.classList.add('show')
    this._toastTimer = duration
  }

  addKillFeed(killer, victim, weapon, killerEnemy) {
    const div = document.createElement('div')
    div.className = 'kf'
    div.innerHTML = `<span class="who ${killerEnemy ? 'enemy' : ''}">${killer}</span> <span class="wep">[${weapon}]</span> <span class="who ${!killerEnemy ? 'enemy' : ''}">${victim}</span>`
    this.el.killfeed.prepend(div)
    while (this.el.killfeed.children.length > 5) this.el.killfeed.lastChild.remove()
    setTimeout(() => div.remove(), 5000)
  }
}
