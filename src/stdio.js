/**
 * @see: https://github.com/curiousdannii/glkote-term/blob/master/src/glkote-dumb.js
 */

const readline = require('readline')
const MuteStream = require('mute-stream')
const ansiEscapes = require('ansi-escapes')

const stdin = process.stdin
const stdout = new MuteStream()
stdout.pipe(process.stdout)
const rl = readline.createInterface({
  input: stdin,
  output: stdout,
  prompt: ''
})

let send = _ => _

const setSend = fn => {
  send = fn
}

const onInit = () => {
  if (stdin.isTTY) {
    stdin.setRawMode(true)
  }
  readline.emitKeypressEvents(stdin)
  rl.resume()
}

const onUpdateContent = messages =>
  messages.text.forEach(({ append, content }) => {
    if (!append) {
      stdout.write('\n')
    }

    if (content) {
      content.forEach(x => {
        if (x.text === '>') return null

        if (x.style === 'input') {
          if (stdout.isTTY) {
            stdout.write(ansiEscapes.eraseLines(2))
            stdout.write('> ')
          }
        }

        stdout.write(
          typeof x === 'string'
            ? x
            : x.text)
      })
    }
  })

const onUpdateInputs = type => {
  type
    ? attach_handlers(type)
    : detach_handlers()
}

const onExit = () => {
  detach_handlers()
  rl.close()
  stdout.write('\n')
}

const onDisable = disable =>
  disable
    ? detach_handlers()
    : attach_handlers()

const onFileNameRequest = (tosave, usage, callback) => {
  stdout.write('\n')
  rl.question(
    'Please enter a file name (without an extension): ',
    filename => callback(filename
      ? { filename, usage }
      : null))
}

const handle_char_input = (str, key) => {
  const key_replacements = {
    '\x7F': 'delete',
    '\t': 'tab',
  }

  detach_handlers()

  // Make sure this char isn't being remembered for the next line input
  rl._line_buffer = null
  rl.line = ''

  // Process special keys
  const res =
    key_replacements[str] ||
    str ||
    key.name.replace(/f(\d+)/, 'func$1')

  send(res)
}

const attach_handlers = type => {
  if (type === 'char') {
    stdout.mute()
    stdin.on('keypress', handle_char_input)
  }
  if (type === 'line') {
    rl.on('line', handle_line_input)
  }
}

const detach_handlers = () => {
  stdin.removeListener('keypress', handle_char_input)
  rl.removeListener('line', handle_line_input)
  stdout.unmute()
}

const handle_line_input = line => {
  if (stdout.isTTY) {
    stdout.write(ansiEscapes.eraseLines(1))
  }
  detach_handlers()

  send(line)
}

module.exports.handlers = {
  onInit,
  onUpdateContent,
  onDisable,
  onUpdateInputs,
  onFileNameRequest,
  onExit,
  setSend
}
