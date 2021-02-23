#!/usr/bin/env node

/**
 * @see: https://github.com/curiousdannii/emglken/blob/master/bin/emglken.js
 */

const fs = require('fs')
const minimist = require('minimist')

const CheapGlkOte = require('../src/')
const { handlers } = require('../src/stdio')

const formats = [
  {
    id: 'bocfel',
    extensions: /z([3458]|blorb)$/,
    engine: 'bocfel.js',
  },

  {
    id: 'glulxe',
    extensions: /(gblorb|ulx)$/,
    engine: 'glulxe.js',
  },

  {
    id: 'git',
    extensions: /(gblorb|ulx)$/,
    engine: 'git.js',
  },

  {
    id: 'hugo',
    extensions: /hex$/,
    engine: 'hugo.js',
  },

  {
    id: 'tads',
    extensions: /(gam|t3)$/,
    engine: 'tads.js',
  },
]

function run() {
  const argv = minimist(process.argv.slice(2))

  const storyfile = argv._[0]

  let format
  for (const formatspec of formats) {
    if (
      formatspec.id === argv.vm ||
      (!argv.vm && formatspec.extensions.test(storyfile))
    ) {
      format = formatspec
      break
    }
  }

  if (!format) {
    console.error('Unknown storyfile format')
    return
  }

  const { glkInterface, sendFn } = CheapGlkOte(handlers)
  handlers.setSend(sendFn)

  const engine = require('emglken/src/' + format.engine)
  const vm = new engine()
  vm.prepare(fs.readFileSync(storyfile), glkInterface)
  vm.start()
}

run()
