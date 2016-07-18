'use strict'
const fs = require('fs-extra')
const path = require('path')
const dataDir = path.resolve(__dirname, '..', 'data')
fs.ensureDirSync(dataDir)
module.exports = dataDir
