#! /usr/bin/env node
'use strict'
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const notifier = require('node-notifier')
const opener = require('opener')
const extList = require('ext-list')

// Convenience functions
const trimtrim = (x) => x.trim().split('\n').map((x) => x.trim()).filter((x) => x !== '')

// File extension lists
const knownEvil       = trimtrim(fs.readFileSync(path.resolve(__dirname, 'knownEvil.txt'), 'utf8'))
const knownExtensions = trimtrim(fs.readFileSync(path.resolve(__dirname, 'knownExt.txt' ), 'utf8')).concat(Object.keys(extList()))

// Load learned file usage.
let graph = {}
let training_mode = false
try {
  graph = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'graph.json'), 'utf8'))
} catch (e) {
  training_mode = true
  setTimeout(function () { training_mode = false }, 30 * 60 * 1000)
}

notifier.on('click', (notifierObject, options) => opener(options.message))

const root_dir = (process.platform === 'win32') ? 'C:\\' : '/'

// Watch the root drive (typically C: but whatever drive this file is in technically.
fs.watch(root_dir, {recursive: true}, (event, filename) => {
  // Regardless of the type of event, this callback gets fired,
  // so we might as well look at the filename and ignore the event name.
  // And chokidar was right, it does double-fire quite a lot. But chokidar
  // crashes with permissions errors, and this doesn't. So there.
  if (filename) {
    let f = path.parse(filename)
    // Don't worry about directories or files without a file extension
    if (f.ext) {
      let ext = f.ext.toLowerCase().replace('.', '')
      let dir = path.resolve('C:\\', f.dir) // Normalization is a bitch

      let propPath = [ext, dir]
      // Report known evil file extensions!
      if (knownEvil.includes(ext)) {
        notifier.notify({
          title: 'Ransomware detected!',
          message: dir,
          wait: true,
          sound: true
        })
        console.log('!!! !!!\t' + ext + '\t' + dir)
      // Log other file access
      } else if (knownExtensions.includes(ext)) {
        console.log('-\t' + ext + '\t' + dir)
      } else {
        console.log('??\t' + ext + '\t' + dir)
      }

      // Report unusual activity
      let count = _.get(graph, propPath, 0)
      if (count === 0) {
        if (!training_mode) {
          notifier.notify({
            title: 'New .' + ext + ' file activity',
            message: dir,
            wait: true
          })
        }
        console.log('***new\t' + ext + '\t' + dir)
      }
      _.set(graph, propPath, count + 1)
    }
  }
})

// Periodically save graph to file.
setInterval(() => {
  fs.writeFileSync(path.resolve(__dirname, 'graph.json'), JSON.stringify(graph, null, 2))
}, 10000)

// ES7 polyfill (by me, not Mozilla)
if (!Array.prototype.includes) {
  Array.prototype.includes = function (value) {
    return this.indexOf(value) > -1
  }
}
