/**
 * @see: https://github.com/curiousdannii/glkote-term/blob/master/src/glkote-dumb.js
 */

import { createInterface, emitKeypressEvents } from 'readline'
import MuteStream from 'mute-stream'
import ansiEsc from 'ansi-escapes'

const stdin = process.stdin
const stdout = new MuteStream()
stdout.pipe(process.stdout)
const rl = createInterface({
  input: stdin,
  output: stdout,
  prompt: ''
})

let currentWindowId = null
let currentWindow = null
let currentInputType = null

let send = _ => _

const setSend = fn => {
  send = fn
}

const onInit = () => {
  if (stdin.isTTY) {
    stdin.setRawMode(true)
  }
  emitKeypressEvents(stdin)
  rl.resume()
  clearScreen()
}

const onUpdateWindows = windows => {
  currentWindow = currentWindowId
    ? windows
      .find(x => x.id === currentWindowId)
    : windows
      .filter(x => x.type === 'buffer')
      .slice(-1)[0]
}

const onUpdateInputs = data => {
  if (data.length === 0) return null
  const { id, type } = data[0]

  currentWindowId = id

  if (['char', 'line'].includes(type)) {
    detach_handlers()
    attach_handlers(type)
  }
}

const clearScreen = () => {
  stdout.write('\u001B[2J\u001B[0;0f')
}

const drawBuffer = messages => {
  messages.text.forEach(({ append, content }) => {
    if (!append) {
      stdout.write('\n')
    }

    if (content) {
      content.forEach(x => {
        if (x.text === '>') return null

        if (x.style === 'input') {
          if (stdout.isTTY) {
            stdout.write(ansiEsc.eraseLines(2))
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
}

const drawGrid = messages => {
  clearScreen()
  messages.lines
    .map(x => x.content)
    .map(([x]) => x)
    .map(({text}) => text)
    .map(x => x.trim())
    .forEach(x => stdout.write(`${x}\n`))
}

const onUpdateContent = allMessages => {
  detach_handlers()

  const messages = allMessages.find(
    content => content.id === currentWindow.id
  )

  ;({
    'buffer': drawBuffer,
    'grid': drawGrid
  })[currentWindow.type](messages)
}

const onDisable = disable => {
  if (disable) detach_handlers()
}

const onExit = () => {
  detach_handlers()
  rl.close()
  stdout.write('\n')
}

const onFileNameRequest = (tosave, usage, gameid, callback) => {
  stdout.write('\n')
  rl.question(
    'Please enter a file name: ',
    filename => callback(filename
      ? { filename, usage }
      : null))
}

const onFileRead = (dirent, israw) =>
  void console.log('onFileRead:', dirent)

const onFileWrite = (dirent, content, israw) =>
  void console.log('onFileWrite:', dirent, content.length)

const handle_char_input = (str, key) => {
  const key_replacements = {
    '\x7F': 'delete',
    '\t': 'tab',
  }

  // Make sure this char isn't being remembered for the next line input
  rl._line_buffer = null
  rl.line = ''

  // Process special keys
  const res =
    key_replacements[str] ||
    str ||
    key.name.replace(/f(\d+)/, 'func$1')

  send(res, currentInputType, currentWindow)
  detach_handlers()
}

const attach_handlers = type => {
  currentInputType = type
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
  currentInputType = null
}

const handle_line_input = line => {
  if (stdout.isTTY) {
    stdout.write(ansiEsc.eraseLines(1))
  }
  send(line, currentInputType, currentWindow)
  detach_handlers()
}

export const handlers = {
  onInit,
  onUpdateWindows,
  onUpdateInputs,
  onUpdateContent,
  onDisable,
  onFileNameRequest,
  onFileRead,
  onFileWrite,
  onExit,
  /* */
  setSend
}
