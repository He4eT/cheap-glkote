/**
 * @see: https://github.com/curiousdannii/glkote-term/blob/master/src/glkote-term.js
 */

import packageJSON from '../../package.json' assert { type: 'json' }

class GlkOte {
  constructor({width, height}) {
    this.width = width
    this.height = height

    this.current_metrics = null
    this.disabled = false
    this.generation = 0
    this.interface = null
    this.version = packageJSON.version
  }

  measure_window() {
    return {
      width: this.width,
      height: this.height,
      buffercharheight: 1,
      buffercharwidth: 1,
      buffermarginx: 0,
      buffermarginy: 0,
      graphicsmarginx: 0,
      graphicsmarginy: 0,
      gridcharheight: 1,
      gridcharwidth: 1,
      gridmarginx: 0,
      gridmarginy: 0,
      inspacingx: 0,
      inspacingy: 0,
      outspacingx: 0,
      outspacingy: 0
    }
  }

  getinterface() {
    return this.interface
  }

  init(iface) {
    if (!iface) {
      this.error('No game interface object has been provided.')
    }
    if (!iface.accept) {
      this.error('The game interface object must have an accept() function.')
    }

    this.interface = iface
    this.current_metrics = this.measure_window()

    this.send_response('init', null, this.current_metrics)
  }

  update(data) {
    if (data.type === 'error') {
      this.error(data.message)
    }
    if (data.type === 'pass') {
      return
    }
    if (data.type !== 'update' && data.type !== 'exit') {
      this.log(`Ignoring unknown message type: ${data.type}`)
      return
    }
    if (data.gen === this.generation) {
      this.log(`Ignoring repeated generation number: ${data.gen}`)
      return
    }
    if (data.gen < this.generation) {
      this.log(
        `Ignoring out-of-order generation number: got ${data.gen}, currently at ${this.generation}`
      )
      return
    }
    this.generation = data.gen

    if (this.disabled) {
      this.disable(false)
    }

    /* Handle the update */
    if (data.input != null) {
      this.cancel_inputs(data.input)
    }
    if (data.windows != null) {
      this.update_windows(data.windows)
    }
    if (data.content != null && data.content.length) {
      this.update_content(data.content)
    }
    if (data.input != null) {
      this.update_inputs(data.input)
    }

    /* Disable everything if requested */
    this.disabled = false
    if (data.disabled || data.specialinput) {
      this.disable(true)
    }

    if (data.specialinput != null) {
      this.accept_specialinput(data.specialinput)
    }

    /* Detach all handlers and exit */
    if (data.type === 'exit') {
      this.exit()
    }
  }

  send_response(type, win, val, val2) {
    const res = {
      type: type,
      gen: this.generation,
    }

    if (win) {
      res.window = win.id
    }

    if (type === 'init' || type === 'arrange') {
      res.metrics = val
    }

    if (type === 'init') {
      res.support = this.support()
    }

    if (type === 'char') {
      res.value = val
    }

    if (type === 'line') {
      res.value = val
    }

    if (type === 'specialresponse') {
      res.response = val
      res.value = val2
    }

    this.interface.accept(res)
  }

  support() {
    return []
  }
}

export default GlkOte
