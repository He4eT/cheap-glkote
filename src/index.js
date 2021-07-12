const FakeDialog = require('./fakeDialog')
const CheapGlkOte = require('./cheapGlkOte')

const noop = () => void null

const defaultHandlers = [
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

const defaultSize = {
  width: 80,
  height: 25
}

module.exports = (handlers_, {loggers: loggers_, size: size_ } = {}) => {
  const handlers =
    Object.assign({}, defaultHandlers, handlers_)
  const loggers =
    Object.assign({}, defaultLoggers, size_)
  const size =
    Object.assign({}, defaultSize, size_)

  const Dialog = new FakeDialog(handlers, loggers)
  const GlkOte = new CheapGlkOte(handlers, loggers, size)

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
