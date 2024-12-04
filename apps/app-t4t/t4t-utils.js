
exports.noAuthFunc = (req, res, next) => {
    const message = 'no user auth middleware set'
    console.log({
      error: message,
      expectedFormat: {
        'req.decoded': {
          id: 'testuser',
          groups: 'admin,user'
        }
      }
    })
    res.status(500).send(message)
}

exports.isInvalidInput = (col, val) => {
  const inputTypeNumbers = ['number', 'range', 'date', 'datetime-local', 'month', 'time', 'week']
  const inputTypeText = ['text','tel','email','password','url','search']
  const { ui, required, multiKey } = col
  // TBD check for required also...
  if (required || multiKey) {
    if (val !== 0 && !val) return { status: 'error', message: 'required input' }
  }
  if (ui?.tag === 'input') {
    const attrs = ui?.attrs
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
  } else if (ui?.tag === 'select') {
    // TBD if options present, validate with it
  }
  return false
}

exports.processJson = async (req, res, next) => {
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

// both are comma seperated strings
exports.roleOperationMatch = (role, operation, col = null) => {
  // console.log('roleOperationMatch (col, role, operation)', col, role, operation)
  try {
    const operations = operation.split(',')
    const roles = role.split(',')
    for (const _role of roles) {
      for (const _operation of operations) {
        if (_operation === _role) return true
      }
    }
  } catch (e) {
  }
  return false
}

exports.formUniqueKey = (table, args) => {
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

exports.mapRelation = (key, col) => {
  const table1Id = key
  const table2 = col?.options?.tableName
  const table2Id = col?.options?.key
  const table2Text = col?.options?.text
  if (table2 && table2Id && table2Text && table1Id) {
    return { table2, table2Id, table2Text, table1Id }
  }
  return null
}

// for reads
// map a key value of a row from DB read...  to desired output for that key (db field)
exports.kvDb2Col = (_row, _joinCols, _tableCols) => {
  for (let k in _row) {
    if (_tableCols[k]) {
      if (_tableCols[k].hide === 'omit') delete _row[k]
      else if (_tableCols[k].hide === 'blank') _row[k] = ''
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

exports.setAuditData = (req, op, keys = '', body = {}) => ({
  user: req?.decoded?.id,
  timestamp: new Date(),
  db_name: req.table.db,
  table_name: req.table.name,
  op,
  where_cols: keys ? req?.table?.pk || req?.table?.multiKey?.join('|') || '' : '',
  where_vals: keys,
  cols_changed: JSON.stringify(Object.keys(body)),
  prev_values: '',
  new_values: JSON.stringify(Object.values(body)),
})
