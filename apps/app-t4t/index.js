'use strict'

const router = require('express').Router()

// export your routes here - make sure no clashes
module.exports = ({ app, routePrefix }) => {
  app.use(routePrefix,
    router.use('/', require('./t4t'))
  )
}
