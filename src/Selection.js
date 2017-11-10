class Selection {
  constructor(objectArray) {
    this.value = objectArray
  }
}

Selection.prototype.done = function() {
  return this.value
}

Selection.prototype.where = function() {
  if (!arguments.length)
    throw new Error('Missing keys in where() method')

  const keys = Array.from(arguments)

  return selectWhere(this, keys)

}

Selection.prototype.iter = function(fn) {
  // fn takes parameters k (key), v (value), and o (entire object)
  for (let o of this.value) {
    for (let k of Object.keys(o))
      fn(k, o[k], o)
  }
}

// Internal function returning functions
// returned by Selection#where
function selectWhere(self, keys) {
  const whereFns = {
    eq() {
      if (!arguments.length === keys.length)
        throw new Error('Inequal number of key and value arguments in where(keys).eq(values)')

      const values = Array.from(arguments)

      let filteredValues = []
      
      for (let i of keys) {
        for (let j of values) {
          self.iter( (k, v, o) => {
            if (k === i && v === j)
              filteredValues.push(o)
          })
        }
      }

      return new Selection(filteredValues)

    },

    notEq() {
      if (!arguments.length === keys.length)
        throw new Error('Inequal number of key and value arguments in where(keys).eq(values)')

      const values = Array.from(arguments)

      let filteredValues = []
      
      for (let i of keys) {
        for (let j of values) {
          self.iter( (k, v, o) => {
            if (k === i && v !== j)
              filteredValues.push(o)
          })
        }
      }

      return new Selection(filteredValues)

    },

    gt() {
      if (!arguments.length === keys.length)
        throw new Error('Inequal number of key and value arguments in where(keys).eq(values)')

      const values = Array.from(arguments)

      let filteredValues = []
      
      for (let i of keys) {
        for (let j of values) {
          self.iter( (k, v, o) => {
            if (k === i && v > j)
              filteredValues.push(o)
          })
        }
      }

      return new Selection(filteredValues)

    },

    gte() {
      if (!arguments.length === keys.length)
        throw new Error('Inequal number of key and value arguments in where(keys).eq(values)')

      const values = Array.from(arguments)

      let filteredValues = []
      
      for (let i of keys) {
        for (let j of values) {
          self.iter( (k, v, o) => {
            if (k === i && v >= j)
              filteredValues.push(o)
          })
        }
      }

      return new Selection(filteredValues)

    },

    lt() {
      if (!arguments.length === keys.length)
        throw new Error('Inequal number of key and value arguments in where(keys).eq(values)')

      const values = Array.from(arguments)

      let filteredValues = []
      
      for (let i of keys) {
        for (let j of values) {
          self.iter( (k, v, o) => {
            if (k === i && v < j)
              filteredValues.push(o)
          })
        }
      }

      return new Selection(filteredValues)

    },

    lte() {
      if (!arguments.length === keys.length)
        throw new Error('Inequal number of key and value arguments in where(keys).eq(values)')

      const values = Array.from(arguments)

      let filteredValues = []
      
      for (let i of keys) {
        for (let j of values) {
          self.iter( (k, v, o) => {
            if (k === i && v <= j)
              filteredValues.push(o)
          })
        }
      }

      return new Selection(filteredValues)

    },

    includes() {

      if (!arguments.length === keys.length)
        throw new Error('Inequal number of key and value arguments in where(keys).eq(values)')

      const values = Array.from(arguments)

      let filteredValues = []
      
      for (let i of keys) {
        for (let j of values) {
          self.iter( (k, v, o) => {
            if (k === i && v.includes(j))
              filteredValues.push(o)
          })
        }
      }

      return new Selection(filteredValues)

    },

    notIncludes() {

      if (!arguments.length === keys.length)
        throw new Error('Inequal number of key and value arguments in where(keys).eq(values)')

      const values = Array.from(arguments)

      let filteredValues = []
      
      for (let i of keys) {
        for (let j of values) {
          self.iter( (k, v, o) => {
            if (k === i && !v.includes(j))
              filteredValues.push(o)
          })
        }
      }

      return new Selection(filteredValues)

    },
  }

  return whereFns
}

module.exports = Selection