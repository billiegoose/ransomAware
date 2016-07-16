'use strict'
const electron = require('electron')

let tray = null
let settingsWindow = null

electron.app.on('ready', () => {
  tray = new electron.Tray('./folder-saved-search-32px.png')
  tray.setToolTip('Ransom Aware')
  tray.on('double-click', () => {
    settingsWindow = new electron.BrowserWindow()
    settingsWindow.loadURL(`file://${__dirname}/pages/settings.html`)
  })
})
