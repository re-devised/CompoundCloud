const express = require('express')
const app = express()
const consola = require('consola')
require('./startup/validation')()
//


const db = require('./db/db');
db.connect();


require('./routes/index')(app)

module.exports = {
  path: '/api',
  handler: app
}

