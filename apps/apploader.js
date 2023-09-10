'use strict'

// const websocket = require('@es-labs/node/services/websocket') // .open(null, null) // or set to null
// websocket.setOnClientMessage = async (data, , isBinary ws, _wss) => { }
// websocket.setOnClientCLose =  (ws) => { }

// routes to your custom application here
module.exports = (app) => {
  // your can add more routes here ensure no clash in urlPrefix
  // require('./app-2nd/routes')({ app, urlPrefix: '/api/app-second'})

  // some sample/demo routes - you can remove if not needed
  require('./app-sample/routes')({ app, routePrefix: '/api/app-sample'})

  // table for table experimental app
  require('./app-t4t')({ app, routePrefix: '/api/t4t'})

  // authentication stuff Below - you can remove if not needed (be aware of routing if you are customizing your auth)
  // routes used are: /api/auth (own auth rollout), /api/oauth, /api/oidc, /api/saml
  require('./app-auth')({ app, routePrefix: '/api'})
}
