# cheap-glkote
[![NPM Version](https://img.shields.io/npm/v/cheap-glkote.svg?style=flat-square)](https://www.npmjs.org/package/cheap-glkote)

This is an abstract implementation of the [GlkOte](https://github.com/erkyrath/glkote) library interface designed to be used with [Emglken](https://github.com/curiousdannii/emglken).<br>
Can be used in Node.js or in a web browser.


## Usage

This repository includes examples of [stdio interface implementation](https://github.com/He4eT/cheap-glkote/blob/master/bin/stdio.js) and [integration with Emglken](https://github.com/He4eT/cheap-glkote/blob/master/bin/player.stdio.js).

### Initialization
```js
const { glkInterface, sendFn } =
  CheapGlkOte(handlers [, { loggers, size }])
```

### Input
```js
sendFn('open door', inputType, targetWindow)
```
You can receive `inputType` and `id` of `targetWindow` in `onUpdateInputs` handler.<br>
You can receive `targetWindow` by its `is` in `onUpdateWindows` handler.<br>
As I know, `inputType` can be `line` or `char`.

### Output and lifecycle
```js
const handlers = {
  onInit: () => {
    /**
      * It's time to initialize the user interface.
      */
  },
  onUpdateWindows: windows => {
    /**
      * Game wants to change the number of windows.
      */
  },
  onUpdateInputs: data => {
    /**
      * Game wants to change input type.
      * 'data' is a list with info about
      * the target window and the input type.
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

### Size
Default sizes:
```js
const defaultSize = {
  width: 80,
  height: 25
}
```

## Inspired and powered by

- [glkote-term](https://github.com/curiousdannii/glkote-term)
- [GlkOte](https://github.com/erkyrath/glkote)
- [Cheapglk](https://github.com/erkyrath/cheapglk)
- [Emglken](https://github.com/curiousdannii/emglken)
