/**
 * @see: https://github.com/curiousdannii/glkote-term/blob/master/src/glkote-dumb.js
 * @see: https://github.com/curiousdannii/glkote-term/blob/master/src/electrofs.js
 */

class FakeDialog {
  constructor(handlers, loggers) {
    this.streaming = false
    this.handlers = handlers
  }

  file_ref_exists({ usage }) {
    return usage === 'save'
      ? true
      : false
  }

  file_remove_ref (ref) {
    return true
  }

  file_construct_ref(filename, usage, gameid) {
    return {
      filename,
      usage: usage || ''
    }
  }

  file_read(dirent, israw) {
    return this.handlers.onFileRead(dirent, israw)
  }

  file_write(dirent, content, israw) {
    if (content.length === 0) return (void null)
    this.handlers.onFileWrite(dirent, content, israw)
  }

  open(tosave, usage, gameid, callback) {
    this.handlers.onFileNameRequest(tosave, usage, gameid, callback)
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

module.exports = FakeDialog
