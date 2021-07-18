/**
 * @see: https://github.com/curiousdannii/glkote-term/blob/master/src/glkote-dumb.js
 */

const GlkOte = require('./glkOte/glkote-term')

class CheapGlkOte extends GlkOte {
  constructor(handlers, loggers, size) {
    super(size)

    this.handlers = handlers
  }

  sendFn (message, type, window) {
    this.send_response(
      type,
      window,
      message)
  }

  init (iface) {
    this.handlers.onInit()
    super.init(iface)
  }

  update_inputs (data) {
    if (!data.length) return []
    this.handlers.onUpdateInputs(data)
  }

  accept_specialinput (data) {
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

  update_content (messages) {
    this.handlers.onUpdateContent(messages)
  }

  exit () {
    this.handlers.onExit()
    super.exit()
  }

  cancel_inputs (data) {
    this.handlers.onUpdateInputs(data)
  }

  disable (data) {
    this.handlers.onDisable(data)
  }

  update_windows (windows) {
    this.handlers.onUpdateWindows(windows)
  }

  log (message) {
    this.loggers.log(message)
  }

  warning (message) {
    this.loggers.warn(message)
  }

  error (message) {
    this.loggers.error(message)
  }
}

module.exports = CheapGlkOte
