'use strict'
// file upload - to folder
// file delete - to folder
// file upload - to oss
// file delete - to oss
// import / export
// table for tables
// Test access rights
// Improve on validation...
// in progress: use __key instead of key
// TBD - DB set user For Audit Logs
// auto detect yaml / json
const express = require('express')
const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const csvParse = require('csv-parse')
const { Parser } = require('@json2csv/plainjs')

const svc = require('@es-labs/node/services')
const { validateColumn } = require('esm')(module)('@es-labs/esm/t4t-validate') // TOREMOVE use T4T config files to validate instead...
const { memoryUpload, storageUpload } = require('@es-labs/node/express/upload')

const { TABLE_CONFIGS_FOLDER_PATH, UPLOAD_STATIC, UPLOAD_MEMORY } = process.env

const uploadStatic =  JSON.parse(UPLOAD_STATIC || [])
const uploadMemory =  JSON.parse(UPLOAD_MEMORY || [])

// const { authUser } = require('@es-labs/node/auth')
const mockAuthUser = async (req, res, next) => {
  console.log('WARNING Auth bypass in t4t.js')
  req.decoded = {
    id: 'testuser'
  }
  next()
}

const authUser = mockAuthUser

const inputTypeNumbers = ['number', 'range', 'date', 'datetime-local', 'month', 'time', 'week']
const inputTypeText = ['text','tel','email','password','url','search']

const isInvalidInput = (colUi, val) => {
  // TBD check for required also...
  if (colUi?.tag === 'input') {
    const attrs = colUi?.attrs
    if (attrs) {
      if (inputTypeText.includes(attrs.type)) {
        if (attrs.pattern) {
          if ( !(new RegExp(attrs.pattern)).test(val) ) return { status: 'error', message: 'wrong format' }
        }
        if (attrs.maxLength) {
          if (val.length > Number(attrs.maxlength)) return { status: 'error', message: 'max length exceeded' }
        }
      } else if (inputTypeNumbers.includes(attrs.type)) {
        if (Number(val) < Number(attrs.min)) return { status: 'error', message: 'min exceeded' }
        if (Number(val) > Number(attrs.max)) return { status: 'error', message: 'min exceeded' }
      }
    }
  } else if (colUi?.tag === 'select') {
    // if options present, validate with it
  }
  return false
}

const processJson = async (req, res, next) => {
  if (req.files) { // it is formdata
    let obj = {}
    for (let key in req.body) {
      const part = req.body[key]
      obj = JSON.parse(part)
    }
    req.body = obj
  }
  next()
}

// __key is reserved property for identifying row in a multiKey table
// | is reserved for seperating columns that make the multiKey
async function generateTable (req, res, next) { // TODO get config info from a table
  try {
    const tableKey = req.params.table // 'books' // its the table name also
    // const docPath = path.resolve(__dirname, `./tables/${tableKey}.yaml`)
    const docPath = TABLE_CONFIGS_FOLDER_PATH + `${tableKey}.yaml`
    const doc = yaml.load(fs.readFileSync(docPath, 'utf8'));
    req.table = JSON.parse(JSON.stringify(doc))
    // generated items
    req.table.pk = ''
    req.table.multiKey = []
    req.table.required = []
    req.table.auto = []
    req.table.nonAuto = []

    const acStr = '/autocomplete'
    const acLen = acStr.length
    if (req.path.substring(req.path.length - acLen) === acStr) return next()

    // can return for autocomplete... req.path
    const cols = req.table.cols
    for (let key in cols) {
      if (cols[key].auto) {
        if (cols[key].auto === 'pk') {
          req.table.pk = key
        } else {
          req.table.auto.push(key)
        }
      } else {
        req.table.nonAuto.push(key)
      }
      if (cols[key].multiKey) req.table.multiKey.push(key)
      if (cols[key].required) req.table.required.push(key)
    }
    // console.log(req.table)
    return next()
  } catch (e) {
    return res.status(500).json({ error: e.toString() })
  }
}

function formUniqueKey(table, args) {
  if (table.pk) return { [table.name + '.' + table.pk] : args } // return for pk
  const where = {} // return for multiKey
  const val_a = args.split('|')
  if (val_a.length !== table.multiKey.length) return null // error numbers do not match
  for (let i=0; i<val_a.length; i++) {
    if (!val_a[i]) return null
    const key = table.multiKey[i]
    where[table.name + '.' + key] = val_a[i]
  }
  return (Object.keys(where).length) ? where : null
}

function mapRelation (key, col) {
  const table1Id = key
  const table2 = col?.options?.tableName
  const table2Id = col?.options?.key
  const table2Text = col?.options?.text
  if (table2 && table2Id && table2Text && table1Id) {
    return { table2, table2Id, table2Text, table1Id }
  }
  return null
}

function kvDb2Col (_row, _joinCols, _tableCols) { // a key value from DB to column
  for (let k in _row) {
    if (_tableCols[k]) {
      if (_tableCols[k].hide === 'omit') delete _row[k]
      else {
        if (_joinCols[k]) {
          const v = _joinCols[k]
          _row[k] = { key: _row[k], text: _row[v] }
          delete _row[v] // remove column created by join
        }
      }
    } else {
      console.log(`Missing Col: ${k}`)
    }
  }
  return _row
}

module.exports = express.Router()
  .get('/healthcheck', (req, res) => res.send('t4t ok - 0.0.1'))

  .post('/:table/autocomplete', generateTable, async (req, res) => {
    let rows = {}
    const { table } = req

    let { key, text, search, parentTableColName, parentTableColVal, limit = 20 } = req.body
    // TBD use key to parentTable Col

    const query = svc.get(table.conn)(table.name).where(key, 'like', `%${search}%`).orWhere(text, 'like', `%${search}%`)
    if (parentTableColName && parentTableColVal !== undefined) query.andWhere(parentTableColName, parentTableColVal) // AND filter - OK
    rows = await query.clone().limit(limit) // TODO orderBy

    rows = rows.map(row => ({
      key: row[key],
      text: text ? row[text] : row[key]
    }))
    res.json(rows)
  })

  .get('/config/:table', authUser, generateTable, async (req, res) => {
    res.json(req.table) // return the table info...
  })
  .get('/find/:table', authUser, generateTable, async (req, res) => { // page is 1 based
    const { table } = req
    let { page = 1, limit = 25, filters = null, sorter = null, csv = '' } = req.query
    page = parseInt(page) // 1-based
    limit = parseInt(limit)
    // console.log('t4t filters and sort', filters, sorter, table.name, page, limit)
    filters = JSON.parse(filters ? filters : null) // ignore where col === null, sort it 'or' first then 'and' // [ { col, op, val, andOr } ]
    sorter = JSON.parse(sorter ? sorter : '[]') // [ { column, order: 'asc' } ] / [] order = asc, desc
    if (page < 1) page = 1
    let rv = { results: [], total: 0 }
    let rows
    let query = null

    let columns = [`${table.name}.*`]
    if (table.select) columns = table.select.split(',') // custom columns... TODO need to add table name?

    query = svc.get(table.conn)(table.name)
    query = query.where({})

    // TODO handle filters for joins...
    let prevFilter = {}
    const joinCols = {}
    if (filters && filters.length) for (let filter of filters) {
      const key = filter.col
      const op = filter.op
      const value = op === 'like' ? `%${filter.val}%` : filter.val
      let _key = key
      if (prevFilter.andOr || prevFilter.andOr === 'and') query = query.andWhere(_key, op, value)
      else query = query.orWhere(_key, op, value)
      prevFilter = filter
    }
    if (limit === 0 || csv) {
      rows = await query.clone().orderBy(sorter)
      rv.total = rows.length
    } else {
      let total = await query.clone().count()
      rv.total = Object.values(total[0])[0]
      const maxPage = Math.ceil(rv.total / limit)
      if (page > maxPage) page = maxPage

      for (let key in table.cols) {
        const rel = mapRelation(key, table.cols[key])
        if (rel) { // if has relation and is key-value
          const { table2, table2Id, table2Text, table1Id } = rel
          query = query.leftOuterJoin(table2, table.name + '.' + table1Id, '=', table2 + '.' + table2Id) // handles joins...
          const joinCol = table1Id + '_' + table2Text
          joinCols[table1Id] = joinCol
          columns = [...columns, table2 + '.' + table2Text + ' as ' + joinCols[table1Id]] // add a join column
        }
      }
      rows = await query.clone().column(...columns).orderBy(sorter).limit(limit).offset((page > 0 ? page - 1 : 0) * limit)
      rows = rows.map((row) => kvDb2Col(row, joinCols, table.cols))
    }
    if (csv) {
      const parser = new Parser({})
      const csvRows = parser.parse(rows)
      return res.json({ csv: csvRows })
    } else {
      rv.results = rows.map(row => { // make column for UI to identify each row
        if (table.pk) {
          row.__key = row[table.pk]
        } else {
          const val = []
          for (let k of table.multiKey) val.push(row[k])
          row.__key = val.join('|')
        }
        return row
      })
      return res.json(rv) 
    }
  })

  .get('/find-one/:table', authUser, generateTable, async (req, res) => {
    // TBD: do not return hidden fields?
    const { table } = req
    const where = formUniqueKey(table, req.query.__key)
    if (!where) return res.status(400).json({}) // bad request
    let rv = {}
    let columns = [`${table.name}.*`]
    if (table.select) columns = table.select.split(',') // custom columns... TODO need to add table name?
    let query = svc.get(table.conn)(table.name).where(where)  
    const joinCols = {}
    for (let key in table.cols) {
      const col = table.cols[key]
      const rel = mapRelation(key, table.cols[key])
      if (rel) { // if has relation and is key-value
        const { table2, table2Id, table2Text, table1Id } = rel
        query = query.leftOuterJoin(table2, table.name + '.' + table1Id, '=', table2 + '.' + table2Id) // handles joins...
        const joinCol = table1Id + '_' + table2Text
        joinCols[table1Id] = joinCol
        columns = [...columns, table2 + '.' + table2Text + ' as ' + joinCol] // add a join colomn
      }
    }

    rv = await query.column(...columns).first()
    rv = rv ? kvDb2Col(rv, joinCols, table.cols) : null // return null if not found
    return res.status(rv ? 200 : 404).json(rv)  
  })

  .patch('/update/:table/:id?',
    authUser,
    generateTable,
    storageUpload(uploadStatic[0]).any(),
    processJson,
    async (req, res) => {
    const { body, table } = req
    const where = formUniqueKey(table, req.query.__key)
    let count = 0

    if (!where) return res.status(400).json({}) // bad request
    for (let key in body) { // formally used table.cols, add in auto fields?
      const { ui, type } = table.cols[key]
      if (ui) {
        const invalid = isInvalidInput(ui, body[key]);
        if (invalid) return res.status(400).json(invalid)
      }

      const col = table.cols[key]
      if (col.auto && col.auto === 'user') {
        body[key] = req?.decoded?.id || 'unknown'
      } else if (col.auto && col.auto === 'ts') {
        body[key] = (new Date()).toISOString()
      } else {
        // TRANSFORM INPUT
        body[key] = ['integer', 'decimal'].includes(table.cols[key].type) ? Number(body[key])
        : ['datetime', 'date', 'time'].includes(table.cols[key].type) ? (body[key] ? new Date(body[key]) : null)
        : body[key]
      }
    }
    // return res.json({ count: 1 })

    // transaction and promise all
    count = await svc.get(table.conn)(table.name).update(body).where(where)
    // TBD delete all related records in other tables?
    if (!count) {
      // nothing was updated...
      // if (table.upsert) do insert ?
    }
    return res.json({count})
  })

  .post('/create/:table', authUser, generateTable, storageUpload(uploadStatic[0]).any(), processJson, async (req, res) => {
    const { table, body } = req
    for (let key in table.cols) {
      const { ui, type, required } = table.cols[key]
      if (ui) {
        const invalid = isInvalidInput(ui, body[key]);
        if (invalid) return res.status(400).json(invalid)
      }
      const col = table.cols[key]
      if (col.auto && col.auto === 'user') {
        body[key] = req?.decoded?.id || 'unknown'
      } else if (col.auto && col.auto === 'ts') {
        body[key] = (new Date()).toISOString()
      } else {
        // TRANSFORM INPUT
        body[key] = ['integer', 'decimal'].includes(table.cols[key].type) ? Number(body[key])
        : ['datetime', 'date', 'time'].includes(table.cols[key].type) ? (body[key] ? new Date(body[key]) : null)
        : body[key]
      }
      if (col.auto && col.auto === 'pk' && key in body) delete body[key]
    }

    let rv = null
    let query = svc.get(table.conn)(table.name).insert(body)
    if (table.pk) query = query.returning(table.pk)
    rv = await query.clone()
    if (rv && rv[0]) { // id
      // disallow link tables input... for creation
    }
    return res.status(201).json(rv)
  })

  .post('/remove/:table', authUser, generateTable, async (req, res) => {
    const { table } = req
    const { ids } = req.body
    if (!table.delete) return res.status(400).json({ error: 'Delete not allowed' })
    if (table.delete !== -1 && ids.length > table.delete) return res.status(400).json({ error: `Select up to ${table.delete} items` })
    if (ids.length < 1) return res.status(400).json({ error: 'No item selected' })

    // TODO delete relations junction, do not delete if value is in use...

    if (table.pk) { // delete using pk
      await svc.get(table.conn)(table.name).whereIn('id', ids).delete()
    } else { // delete using keys
      const keys = ids.map(id => {
        let id_a = id.split('|')
        const multiKey = {}
        for (let i=0; i<id_a.length; i++) {
          const keyName = table.multiKey[i]
          multiKey[keyName] = id_a[i]
        }
        return svc.get(table.conn)(table.name).where(multiKey).delete() 
      })
      await Promise.allSettled(keys)
    }
    return res.json()
  })

/*
const trx = await svc.get(table.conn).transaction()
for {
  let err = false
  try {
    await svc.get(table.conn)(tableName).insert(data).transacting(trx)
  } catch (e) {
    err = true
  }
  if (err) await trx.rollback()
  else await trx.commit()
}
*/

  // Test country collection upload using a csv file with following contents
  // code,name
  // zzz,1234
  // ddd,5678
  .post('/upload/:table', authUser, generateTable, memoryUpload(uploadMemory[0]).single('csv-file'), async (req, res) => {
    const { table } = req
    const csv = req.file.buffer.toString('utf-8')
    const output = []
    let errors = []
    let keys = []
    let currLine = 0
    csvParse(csv)
      .on('error', (e) => console.error(e.message))
      .on('readable', function () {
        let record
        while ( (record = this.read()) ) {
          currLine++
          if (currLine === 1) {
            keys = [...record]
            continue // ignore first line
          }
          if (record.length === table.nonAuto.length) { // ok
            if (record.join('')) {
              // TODO format before push?
              output.push(record)
            } else {
              errors.push({ currLine, data: record.join(','), msg: 'Empty Row' })
            }
          } else {
            errors.push({ currLine, data: record.join(','), msg: 'Column Count Mismatch' })
          }
        }
      })
      .on('end', async () => {
        let line = 0
        const writes = []
        for (let row of output) {
          line++
          try {
            // TODO: also take care of auto populating fields?
            // TODO: should add validation here
            const obj = {}
            for (let i=0; i<keys.length; i++) {
              obj[ keys[i] ] = row[i]
            }
            writes.push(svc.get(table.conn)(table.name).insert(obj))
          } catch (e) {
            errors.push({ line, data: row.join(','), msg: 'Caught exception: ' + e.toString() })
          }
        }
        await Promise.allSettled(writes)
        return res.status(200).json({ errorCount: errors.length, errors })
      })
  })

  // delete file
  // export async function deleteFile(filePath) {
  //   fs.unlink(filePath, e => {
  //     if (e) console.log(e)
  //     else console.log(filePath +' deleted!')
  //   })  
  // }
