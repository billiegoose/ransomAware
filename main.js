'use strict'
const electron = require('electron')
const {app, BrowserWindow} = electron

app.on('ready', () => {
  let win = new BrowserWindow()
  win.loadURL(`file://${__dirname}/pages/settings.html`)
})
