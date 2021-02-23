/**
 * @see: https://github.com/curiousdannii/glkote-term/blob/master/src/glkote-dumb.js
 * @see: https://github.com/curiousdannii/glkote-term/blob/master/src/electrofs.js
 */

class FakeDialog {
  constructor(handlers) {
    this.streaming = false
    this.handlers = handlers
  }

  file_ref_exists = ref => false

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
    console.log(message)
  }
}

module.exports = FakeDialog
