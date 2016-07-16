#! /usr/bin/env node
'use strict'
// ES7 polyfill (by me, not Mozilla)
if (!Array.prototype.includes) {
  Array.prototype.includes = function (value) {
    return this.indexOf(value) > -1
  }
}
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const notifier = require('node-notifier')
const opener = require('opener')
const extList = require('ext-list')

// Convenience functions
const trimtrim = (x) => x.trim().split('\n').map((x) => x.trim()).filter((x) => x !== '')

// File extension lists
const evilExtensions = trimtrim(fs.readFileSync(path.resolve(__dirname, 'evilExtensions.txt'), 'utf8'))
const fileExtensions = trimtrim(fs.readFileSync(path.resolve(__dirname, 'fileExtensions.txt'), 'utf8')).concat(Object.keys(extList()))

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

function onFileChange (event, filename) {
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
      if (evilExtensions.includes(ext)) {
        notifier.notify({
          title: 'Ransomware detected!',
          message: dir,
          wait: true,
          sound: true
        })
        console.log('!!! !!!\t' + ext + '\t' + dir)
      // Log other file access
      } else if (fileExtensions.includes(ext)) {
        console.log('-\t' + ext + '\t' + dir)
      } else {
        console.log('??\t' + ext + '\t' + dir)
      }

      // Report unusual activity
      let count = _.get(graph, propPath, 0)
      if (count === 0) {
        if (!training_mode && settings.notifications) {
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
}

let theGreatFileWatcher = null
let theGreatInterval = null
let settings = {}
try {
  settings = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'settings.json'), 'utf8'))
} catch (e) {
  // first run, no settings.json file
  settings = {
    watchDir: root_dir,
    notifications: true
  }
}

exports.start = function start () {
  theGreatFileWatcher = fs.watch(settings.watchDir, {recursive: true}, onFileChange)
  // Periodically save graph to file.
  theGreatInterval = setInterval(() => {
    fs.writeFileSync(path.resolve(__dirname, 'graph.json'), JSON.stringify(graph, null, 2))
  }, 10000)
}

exports.stop = function stop () {
  global.clearInterval(theGreatInterval); theGreatFileWatcher.close()
}

exports.settings = function (settings_object) {
  if (settings_object) {
    settings = settings_object
    fs.writeFileSync(path.resolve(__dirname, 'settings.json'), JSON.stringify(settings, null, 2))
    return
  } else {
    return settings
  }
}

if (!module.parent) {
  exports.start({watchDir: root_dir})
  // setTimeout(exports.stop, 15000)
}
