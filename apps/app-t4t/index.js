'use strict'

const router = require('express').Router()

// export your routes here - make sure no clashes
function mockAuthUser (req, res, next) {
  console.log('WARNING Auth bypass in t4t.js')
  req.decoded = {
    id: 'testuser',
    groups: 'admin,editor,viewer', // rename to roles?
    orgId: null, // for filtering by organization
  }
  next()
}

const t4t = require('./t4t')({ authFunc: mockAuthUser })

module.exports = ({ app, routePrefix }) => {
  app.use(routePrefix, router.use('/', t4t))
}
