'use strict'
const router = require('express').Router()

module.exports = ({ app, routePrefix }) => {
  app.use(routePrefix,
    router.use('/auth', require('./auth').myauthRoute),
    router.use('/oidc', require('./auth').oidcRoute),
    router.use('/oauth', require('./auth').oauthRoute),
    router.use('/saml', require('./auth').samlRoute)
  )
}
