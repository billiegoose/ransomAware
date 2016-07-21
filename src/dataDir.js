'use strict'
const os = require('os')
const fs = require('fs-extra')
const path = require('path')
const dataDir = path.resolve(os.homedir(), '.ransomAware')
fs.ensureDirSync(dataDir)
module.exports = dataDir
