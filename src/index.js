const FakeDialog = require('./fakeDialog')
const CheapGlkOte = require('./cheapGlkOte')

const noop = () => void null

const noopHandlers = [
  'onInit',
  'onUpdateWindows',
  'onUpdateInputs',
  'onUpdateContent',
  'onDisable',
  'onFileNameRequest',
  'onFileRead',
  'onFileWrite',
  'onExit'
].reduce((acc, x) => ((acc[x] = noop), acc), {})

const defaultLoggers = {
  log: console.log,
  warning: console.warn,
  error: console.error
}

module.exports = (handlers_, loggers = defaultLoggers) => {
  const handlers =
    Object.assign({}, noopHandlers, handlers_)

  const Dialog = new FakeDialog(handlers, loggers)
  const GlkOte = new CheapGlkOte(handlers, loggers)

  const sendFn = GlkOte.sendFn.bind(GlkOte)

  return {
    sendFn,
    glkInterface: {
      Dialog,
      GlkOte,
      Glk: {}
    }
  }
}
