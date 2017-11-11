const Selection = require('./Selection')

function select() {
  // TODO: Define notation to select nested keys

  let keys = Array.from(arguments)

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

  const fromFn = function(objectArray) {

    if (!Array.isArray(objectArray))
      throw new Error('Invalid argument passed to from(). Should be an array of objects')

    let selection = new Selection(objectArray)

    return selection.filterKeys(keyArray)

  }

  return fromFn

}

module.exports = select