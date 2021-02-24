# cheap-glkote

This is an abstract implementation of the [GlkOte](https://github.com/erkyrath/glkote) library interface designed to be used with [Emglken](https://github.com/curiousdannii/emglken).<br>
Can be used in Node.js or in a web browser.


## Usage

This repository includes examples of [stdio interface implementation](https://github.com/He4eT/cheap-glkote/blob/master/bin/stdio.js) and [integration with Emglken](https://github.com/He4eT/cheap-glkote/blob/master/bin/player.stdio.js).

### Initialization
```js
const { glkInterface, sendFn } = CheapGlkOte(handlers [, loggers])
```

### Input
```js
sendFn('open door', windowObject)
```
You can received `windowObject` in `onUpdateWindows` handler.<br>
You should respect input type setted by `onUpdateInputs`.

### Output and lifecycle
```js
const handlers = {
  onInit: () => {
    /**
      * It's time to prepare the user interface.
      */
  },
  onUpdateWindows: windows => {
    /**
      * Game wants to change the number of windows.
      */
  },
  onUpdateInputs: type => {
    /**
      * Game wants to change input type.
      * Supported types: 'char', 'line'.
      */
  },
  onUpdateContent: messages => {
    /**
      * Process the game output here.
      */
  },
  onDisable: () => {
    /**
      * Game wants to disable user interface.
      */
  },
  onFileNameRequest: (tosave, usage, gameid, callback) => {
    /**
      * Game wants the user to specify the file name.
      * This name will be passed as an argument
      * to the "onFileRead" and "onFileWrite" functions.
      */
    callback({ filename: 'filename', usage })
  },
  onFileRead: filename => {
    /**
      * Game wants to read the contents from the file.
      */
    return 'content'
  },
  onFileWrite: (filename, content) => {
    /**
      * Game wants to write the contents in the file.
      */
  },
  onExit: () => {
    /**
      * Game is over.
      */
  }
}
```
### Logging
By default, the `console` is used for logging, but you can pass custom loggers to the constructor.

Default loggers:
```js
const defaultLoggers = {
  log: console.log,
  warning: console.warn,
  error: console.error
}
```

## Inspired and powered by

- [glkote-term](https://github.com/curiousdannii/glkote-term)
- [GlkOte](https://github.com/erkyrath/glkote)
- [Cheapglk](https://github.com/erkyrath/cheapglk)
- [Emglken](https://github.com/curiousdannii/emglken)
