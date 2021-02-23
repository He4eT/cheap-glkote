const FakeDialog = require('./fakeDialog')
const CheapGlkOte = require('./cheapGlkOte')

const noop = () => void null

const noopHandlers = [
  'onInit',
  'onUpdateContent',
  'onDisable',
  'onUpdateInputs',
  'onFileNameRequest',
  'onExit',
  'setSend'
].reduce((acc, x) => (acc[x] = noop, acc), {})

module.exports = handlers_ => {
  const handlers =
    Object.assign({}, noopHandlers, handlers_)

  const Dialog = new FakeDialog(handlers)
  const GlkOte = new CheapGlkOte(handlers)

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
