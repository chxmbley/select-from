function select() {
  // TODO: Define notation to select nested keys

  const keys = Array.from(arguments)

  // If the wildchard character is included,
  // select by empty args (same as wildcard)
  if (keys.includes('*'))
    keys = []

  const selectFunctions = {
    from: selectFrom(keys)
  }

  return selectFunctions

}

// Internal function for creating from()
// as returned by select()
function selectFrom(keyArray) {

  let fromFn = function(objectArray) {

    if (!Array.isArray(objectArray))
      throw new Error('Invalid argument passed to from(). Should be an array of objects')

    if (!keyArray.length)
      return objectArray

    let filteredArray = []

    for (let i of objectArray) {
      if (typeof i !== 'object')
        continue

      let obj = {}

      for (let j of keyArray) {
        if (Object.keys(i).includes(j))
          obj[j] = i[j]
      }

      if (Object.keys(obj).length)
        filteredArray.push(obj)
    }

    return filteredArray

  }

  return fromFn

}

module.exports = select