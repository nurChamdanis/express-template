'use strict'

const express = require('express')

module.exports = express.Router()
  .get('/', (req, res) => res.send('app-sample OK'))
  .get('/healthcheck', (req, res) => res.send('app-sample/healthcheck OK'))
