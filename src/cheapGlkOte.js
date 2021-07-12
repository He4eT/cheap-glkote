/**
 * @see: https://github.com/curiousdannii/glkote-term/blob/master/src/glkote-dumb.js
 */

const GlkOte = require('./glkOte/glkote-term')

class CheapGlkOte extends GlkOte {
  constructor(handlers, loggers, size) {
    super(size)

    this.current_input_type = null

    this.handlers = handlers
  }

  sendFn(message, window) {
    this.send_response(
      this.current_input_type,
      window,
      message)
    this.current_input_type = null
  }

  init(iface) {
    this.handlers.onInit()
    super.init(iface)
  }

  update_inputs(data) {
    if (!data.length) return null

    const { type } = data[0]
    if (['char', 'line'].includes(type)) {
      this.current_input_type = type
      this.handlers.onUpdateInputs(type)
    }
  }

  accept_specialinput(data) {
    if (data.type === 'fileref_prompt') {
      const callback = ref =>
        this.send_response(
          'specialresponse', null, 'fileref_prompt', ref)

      this.interface.Dialog.open(
        data.filemode !== 'read',
        data.filetype,
        data.gameid,
        callback)
    } else {
      this.error(
        'Request for unknown special input type: ' + data.type)
    }
  }

  update_content(messages) {
    this.handlers.onUpdateContent(messages)
  }

  exit() {
    this.handlers.onExit()
    super.exit()
  }

  cancel_inputs(data) {
    if (data.length === 0) {
      this.current_input_type = null
      this.handlers.onUpdateInputs(null)
    }
  }

  disable(disable) {
    this.disabled = disable
    this.handlers.onDisable(disable)
  }

  update_windows(windows) {
    if (windows.length) {
      this.handlers.onUpdateWindows(windows)
    }
  }

  log(message) {
    loggers.log(message)
  }

  warning(message) {
    loggers.warn(message)
  }

  error(message) {
    loggers.error(message)
  }
}

module.exports = CheapGlkOte
