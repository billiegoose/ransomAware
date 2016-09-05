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

function check () {
  // Check for updates
  // `status` returns true if there is a new update available
  console.log('checking for updates...')
  updater.check((err, status) => {
    console.log('err =', err)
    console.log('status =', status)
    if (err) {
      notifier.notify({
        title: 'ransomAware',
        message: err.message,
        wait: false
      })
      return
    }
    if (status) {
      dialog.showMessageBox({
        title: 'ransomAware',
        message: 'An update is available. Would you like to download this update now?',
        buttons: ['No', 'Yes']
      }, (button) => {
        if (button === 1) {
          // Download the update
          notifier.notify({
            title: 'ransomAware',
            message: 'Downloading update...'
          })
          updater.download()
        }
      })
    }
  })
}

// When an update has been downloaded
updater.on('update-downloaded', (info) => {
  // Restart the app and install the update
  dialog.showMessageBox({
    title: 'ransomAware',
    message: 'An update is ready to install. Would you like to restart the application to install the update now?',
    buttons: ['No', 'Yes']
  }, (button) => {
    if (button === 1) {
      // Install the update
      updater.install()
    }
  })
})

module.exports = {
  check: check
}
