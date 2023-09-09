'use strict'
const router = require('express').Router()

// TODO Future Enhancement... using config file
module.exports = function (app) {
  app.use('/api',
    router.use('/', require('./base')),
    router.use('/t4t', require('./t4t')),
  )
}
