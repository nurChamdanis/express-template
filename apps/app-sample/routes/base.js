'use strict'

const express = require('express')
const s = require('@es-labs/node/services')

module.exports = express.Router()
  .get('/', (req, res) => res.send({ status: 'app-sample OK' }))
  .get('/healthcheck', (req, res) => res.send({ status: 'app-sample/healthcheck OK' }))
  .get('/check-db', async (req, res) => {
    const connectionName = req.query.conn || 'knex1'
    const connQuery = req.query.sql || 'SELECT 1'
    try {
      const clientName = s.get(connectionName).context.client.config.client
      // const a = s.get('knex1').context.client.config.client
      // console.log(a, a.config, a.database, a.context.client.config.client)
      const rv = await s.get(connectionName).raw(connQuery)
      return res.status(200).json({
        connectionName,
        db: clientName
      })
    } catch (e) {
      console.log(e)
      return res.status(500).json(e)
    }
  })
