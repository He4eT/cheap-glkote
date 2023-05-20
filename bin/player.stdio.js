#!/usr/bin/env node

/**
 * @see: https://github.com/curiousdannii/emglken/blob/master/bin/emglken.js
 */

import { readFileSync } from 'fs'
import minimist from 'minimist'

import CheapGlkOte from '../src/index.js'

import { handlers } from './stdio.js'

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

import(`emglken/src/${format.id}.js`)
  .then(({default: engine}) => engine)
  .then((engine) => new engine())
  .then((vm) => {
    const cheapGlkOte = CheapGlkOte(handlers)

    handlers.setSend(cheapGlkOte.send)

    vm.init(readFileSync(storyfile), {
      Dialog: cheapGlkOte.Dialog,
      GlkOte: cheapGlkOte.GlkOte,
      Glk: {},
      wasmBinary: readFileSync(new URL(`../node_modules/emglken/build/${format.id}-core.wasm`, import.meta.url))
    })
    vm.start()
  })
