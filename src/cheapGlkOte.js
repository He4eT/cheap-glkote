/**
 * @see: https://github.com/curiousdannii/glkote-term/blob/master/src/glkote-dumb.js
 */

const GlkOte = require('./glkOte/glkote-term')

class CheapGlkOte extends GlkOte {
  constructor(handlers, loggers) {
    super()

    this.window = null
    this.current_input_type = null

    this.handlers = handlers
  }

  sendFn(message) {
    this.send_response(
      this.current_input_type,
      this.window,
      message)
    this.current_input_type = null
  }

  init(iface) {
    /* Only one window can be opened */
    const glk_window_open = iface.Glk.glk_window_open
    iface.Glk.glk_window_open = (splitwin, ...args) =>
      splitwin
        ? null
        : glk_window_open(splitwin, ...args)

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
    const filtered = messages.filter(
      content => content.id === this.window.id
    )[0]

    this.handlers.onUpdateContent(filtered)
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

  update_windows(data) {
    data.forEach(win => {
      if (win.type === 'buffer') {
        this.window = win
      }
    })
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
