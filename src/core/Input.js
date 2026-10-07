// Keyboard + pointer-lock mouse input. Tracks edge-triggered and held state.
export class Input {
  constructor(domElement) {
    this.dom = domElement
    this.keys = new Set()
    this.pressed = new Set()
    this.mouse = { dx: 0, dy: 0, left: false, right: false }
    this.mousePressed = false
    this.locked = false
    this.onLockChange = null

    this._onKeyDown = (e) => {
      const code = e.code
      if (!this.keys.has(code)) this.pressed.add(code)
      this.keys.add(code)
      if (['Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'ShiftLeft', 'Tab'].includes(code)) e.preventDefault()
    }
    this._onKeyUp = (e) => this.keys.delete(e.code)
    this._onMouseMove = (e) => {
      if (!this.locked) return
      this.mouse.dx += e.movementX || 0
      this.mouse.dy += e.movementY || 0
    }
    this._onMouseDown = (e) => {
      if (e.button === 0) { this.mouse.left = true; this.mousePressed = true }
      if (e.button === 2) this.mouse.right = true
    }
    this._onMouseUp = (e) => {
      if (e.button === 0) this.mouse.left = false
      if (e.button === 2) this.mouse.right = false
    }
    this._onContext = (e) => e.preventDefault()
    this._onLockChange = () => {
      this.locked = document.pointerLockElement === this.dom
      if (!this.locked) { this.mouse.left = false; this.mouse.right = false }
      this.onLockChange?.(this.locked)
    }
    this._onLockError = () => this.onLockError?.()

    window.addEventListener('keydown', this._onKeyDown)
    window.addEventListener('keyup', this._onKeyUp)
    window.addEventListener('mousemove', this._onMouseMove)
    window.addEventListener('mousedown', this._onMouseDown)
    window.addEventListener('mouseup', this._onMouseUp)
    window.addEventListener('blur', () => { this.keys.clear(); this.mouse.left = false })
    this.dom.addEventListener('contextmenu', this._onContext)
    document.addEventListener('pointerlockchange', this._onLockChange)
    document.addEventListener('pointerlockerror', this._onLockError)
  }

  isDown(code) { return this.keys.has(code) }
  wasPressed(code) { return this.pressed.has(code) }

  requestLock() { return this.dom.requestPointerLock?.() }
  exitLock() { document.exitPointerLock?.() }

  endFrame() {
    this.pressed.clear()
    this.mouse.dx = 0
    this.mouse.dy = 0
    this.mousePressed = false
  }

  axes() {
    let x = 0, z = 0
    if (this.isDown('KeyW') || this.isDown('ArrowUp')) z += 1
    if (this.isDown('KeyS') || this.isDown('ArrowDown')) z -= 1
    if (this.isDown('KeyD') || this.isDown('ArrowRight')) x += 1
    if (this.isDown('KeyA') || this.isDown('ArrowLeft')) x -= 1
    const len = Math.hypot(x, z) || 1
    return { x: x / len, z: z / len }
  }
}
