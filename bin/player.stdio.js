#!/usr/bin/env node

/**
 * @see: https://github.com/curiousdannii/emglken/blob/master/bin/emglken.js
 */

const fs = require('fs')
const minimist = require('minimist')

const CheapGlkOte = require('../src/')
const { handlers } = require('./stdio')

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
  }
]


const argv = minimist(process.argv.slice(2))
const storyfile = argv._[0]

const format = formats.find(x =>
  x.extensions.test(storyfile))

if (!format) {
  console.error('Unknown storyfile format.')
  process.exit(0)
}

const { glkInterface, sendFn } = CheapGlkOte(handlers)
handlers.setSend(sendFn)

const engine = require('emglken/src/' + format.engine)
const vm = new engine()

vm.prepare(
  fs.readFileSync(storyfile),
  glkInterface)
vm.start()
