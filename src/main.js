import './style.css'
import { Game } from './Game.js'
import { Physics } from './physics/Physics.js'

const canvas = document.getElementById('scene')
const loaderFill = document.getElementById('loader-fill')
const loading = document.getElementById('loading')

function setProgress(p) {
  if (loaderFill) loaderFill.style.width = `${Math.round(p * 100)}%`
}

function fail(error) {
  loading.innerHTML = `<div class="loader"><div class="loader-title">FAILED TO INITIALISE</div><div style="opacity:.6">${error.message}</div></div>`
  throw error
}

async function boot() {
  setProgress(0.12)
  try {
    // Compile the Rapier WASM physics engine before building the world.
    await Physics.ready()
  } catch (error) {
    fail(error)
  }
  let game
  try {
    game = new Game(canvas)
  } catch (error) {
    fail(error)
  }

  const steps = [
    [0.4, 'GENERATING TERRAIN'],
    [0.65, 'RAISING BASES'],
    [0.88, 'FUELING VEHICLES'],
    [1, 'READY'],
  ]
  let i = 0
  function advance() {
    if (i >= steps.length) {
      loading.classList.add('hidden')
      game.ui.showMenu()
      game.loop()
      return
    }
    const [p, label] = steps[i++]
    setProgress(p)
    game.ui.setLoading(p, label)
    requestAnimationFrame(() => setTimeout(advance, 40))
  }
  requestAnimationFrame(advance)
  window.__skyfall = game
}

setProgress(0.05)
boot()
