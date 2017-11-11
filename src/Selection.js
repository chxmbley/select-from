// Selection class

class Selection {
  constructor(objectArray) {
    // Original value
    this.reference = objectArray
    this.filtered  = {}

    for (let i in this.reference)
      this.filtered[i] = this.reference[i]

  }
}

Selection.prototype.filterKeys = function(keys) {
  if (Array.isArray(keys) && !keys.length)
    return this

  let filtered = {}

  for (let i in this.reference) {
    // ignore non-object items in the array
    if (typeof this.reference[i] !== 'object')
      continue

    let obj = {}

    for (let j of keys) {
      if (this.reference[i].hasOwnProperty(j)) {
        obj[j] = this.reference[i][j]
      }
    }

    if (Object.keys(obj).length)
      filtered[i] = obj
  }

  this.filtered = filtered
  return this
}

Selection.prototype.where = function() {
  if (!arguments.length)
    throw new Error('Missing keys in where() method')

  const keys = Array.from(arguments)

  return selectWhere(this, keys)

}

Selection.prototype.iter = function(fn) {
  // fn takes parameters x (index), k (key), v (value)
  for (let i in this.reference) {
    for (let k of Object.keys(this.reference[i])) {
      // i = index
      // k = key
      // this.reference[i][k] = value
      fn(i, k, this.reference[i][k])
    }
  }
}

Selection.prototype.apply = function() {
  this.reference = this.done()
  this.filtered  = {}
  // Reindex filter
  for (let i in this.reference)
    this.filtered[i] = this.reference[i]

  return this
}

Selection.prototype.done = function() {
  // TODO: Allow users to pass args to format
  //       the returned array, (ex. values only, etc.)
  let results = []
  for (let i of Object.keys(this.filtered))
    results.push(this.filtered[i])
  return results
}

function condition(self, keys, args, type) {
  if (args.length !== keys.length)
    throw new Error(`Inequal number of key and value arguments in where(keys).${type}(values)`)

  const values = Array.from(args)
  
  for (let i of keys) {
    for (let j of values) {
      self.iter( (x, k, v) => {

        let filter = false

        switch (type) {
          case 'eq':
            filter = v === j
            break
          case 'notEq':
            filter = v !== j
            break
          case 'gt':
            filter = v > j
            break
          case 'gte':
            filter = v >= j
            break
          case 'lt':
            filter = v < j
            break
          case 'lte':
            filter = v <= j
            break
          case 'includes':
            filter = v.includes(j)
            break
          case 'notIncludes':
            filter = !v.includes(j)
            break
          default:
            throw new Error('Invalid condition: ' + type)
        }

        if (k === i && !filter && self.filtered[x] !== undefined)
          delete self.filtered[x]

      })
    }
  }

  return self
}

// Internal function used by Select#where
function selectWhere(self, keys) {
  const whereFns = {
    eq()         { return condition(self, keys, arguments, 'eq')         },
    notEq()      { return condition(self, keys, arguments, 'notEq')      },
    gt()         { return condition(self, keys, arguments, 'gt')         },
    gte()        { return condition(self, keys, arguments, 'gte')        },
    lt()         { return condition(self, keys, arguments, 'lt')         },
    lte()        { return condition(self, keys, arguments, 'lte')        },
    includes()   { return condition(self, keys, arguments, 'includes')   },
    notIncludes(){ return condition(self, keys, arguments, 'notIncludes')},
  }
  return whereFns
}

module.exports = Selection