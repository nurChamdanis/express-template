
'use strict'
const { describe, it, before, after } = require('node:test')
const assert = require('node:assert')

let sqldb

require('../env')

if (false) {


before(async () => {
  await require('@es-labs/node/config')(process.cwd())
  const StoreKnex = require('@es-labs/node/services/db/knex') 
  sqldb = new StoreKnex()
  await sqldb.open()
})

after(async () => {
  await sqldb.close()
})  

describe('Test Services', () => {
  it.skip('Test Knex', async () => {
    let knex = sqldb.get()
    const rv = ( await knex('users').where({ username: 'ais-one' }).first() ).githubId
    assert.strictEqual(rv, 4284574)
  })
})

describe('Services Test', () => {
  it.skip('should pass', () => {
    assert.strictEqual(true, true)
  })
})

}