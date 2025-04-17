'use strict'

// routes to your custom application here
module.exports = (app) => {
  // your can add more routes here ensure no clash in urlPrefix
  // require('./app-2nd/routes')({ app, urlPrefix: '/api/app-second'})

  // some sample/demo routes - you can remove if not needed
  require('./app-sample/routes')({ app, routePrefix: '/api/app-sample'})

  // table for table experimental app
  require('./app-t4t')({ app, routePrefix: '/api/t4t'}) // TODO: need to fix t4t-fe.js to make URL configurable

  // authentication stuff Below - you can remove if not needed (be aware of routing if you are customizing your auth)
  // routes used are: /api/auth (own auth rollout), /api/oauth, /api/oidc, /api/saml
  require('./app-auth')({ app, routePrefix: '/api'})
  require('./app-auth')({ app, routePrefix: '/api/custom-app/file-and-json' })
}
