import FakeDialog from './fakeDialog.js'
import CheapGlkOte from './cheapGlkOte.js'

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
  'onExit',
].reduce((acc, x) => ((acc[x] = noop), acc), {})

const defaultLoggers = {
  log: console.log,
  warning: console.warn,
  error: console.error,
}

const defaultSize = {
  width: 80,
  height: 25,
}

export default (handlers_, {loggers: loggers_, size: size_ } = {}) => {
  const handlers =
    Object.assign({}, defaultHandlers, handlers_)
  const loggers =
    Object.assign({}, defaultLoggers, loggers_)
  const size =
    Object.assign({}, defaultSize, size_)

  const Dialog = new FakeDialog(handlers, loggers)
  const GlkOte = new CheapGlkOte(handlers, loggers, size)

  const send = GlkOte.sendFn.bind(GlkOte)

  return {
    Dialog,
    GlkOte,
    send,
  }
}
