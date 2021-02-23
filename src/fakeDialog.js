class FakeDialog {
  constructor(handlers) {
    this.streaming = false
    this.handlers = handlers
    this.path = 'fake/path'
  }

  file_ref_exists = ref => false

  file_construct_ref(filename, usage, gameid) {
    return {
      filename: [this.path, filename].join('/'),
      usage: usage || ''
    }
  }

  file_read(dirent, israw) {
    console.log('fake_file_read', dirent, israw)
    return 'content'
  }

  file_write(dirent, content, israw) {
    if (content.length === 0) return (void null)
    console.log('fake_file_write', dirent, israw, content.length)
  }

  open(tosave, usage, gameid, callback) {
    this.handlers.onFileNameRequest(tosave, usage, callback)
  }

  log(message) {
    console.log(message)
  }
}

module.exports = FakeDialog
