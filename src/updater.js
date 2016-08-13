'use strict'
const {app, dialog} = require('electron')
// https://github.com/jenslind/electron-gh-releases/blob/master/docs/2.x/api.md#usage-example
const GhReleases = require('electron-gh-releases')
const notifier = require('node-notifier')

let options = {
  repo: 'wmhilton/ransomAware',
  currentVersion: app.getVersion()
}

const updater = new GhReleases(options)

// Check for updates
// `status` returns true if there is a new update available
updater.check((err, status) => {
  if (!err && status) {
    dialog.showMessageBox({
      buttons: ['No', 'Yes'],
      message: 'An update is available. Would you like to download this update now?'
    }, (err, button) => {
      if (err) console.log('err =', err)
      if (button === 1) {
        // Download the update
        updater.download()
      }
    })
  } else if (!err && !status) {
    notifier.notify({
      title: 'No update',
      message: 'You are using Ransom Aware v' + app.getVersion()
    })
  } else {
    notifier.notify({
      title: 'RansomAware updater error',
      message: err.message
    })
  }
})

// When an update has been downloaded
updater.on('update-downloaded', (info) => {
  // Restart the app and install the update
  dialog.showMessageBox({
    buttons: ['No', 'Yes'],
    message: 'An update is ready to install. Would you like to restart the application to install the update now?'
  }, (err, button) => {
    if (err) console.log('err =', err)
    if (button === 1) {
      // Download the update
      updater.install()
    }
  })
})
