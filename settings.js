'use strict'
// main
function main () {
  let settings = new ElectronSettings(_ElectronSettings_)
  const init = _init_(settings)

  init('watchDir', (process.platform === 'win32') ? 'C:\\' : '/')
  init('notifications', true)
  init('startOnLogin', false)

  return settings
}

// imports
const ElectronSettings = require('electron-settings')

// helpers
const _ElectronSettings_ = {
  configDirPath: __dirname,
  configFileName: 'settings'
}

function _init_ (settings) {
  return (key, value) => {
    if (typeof settings.get(key) === 'undefined') {
      settings.set(key, value)
    }
  }
}

module.exports = main()
