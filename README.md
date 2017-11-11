# SelectFrom

Dead simple utility for running basic SQL-like queries against arrays of objects in Javascript

## Installation

**NPM**

```javascript
npm i select-from
```

**Yarn**
```javascript
yarn add select-from
```

## Getting Started

**Node/Require.js**
```javascript
const select = require('select-from')
```

**Web**
```html
<script src="select-from.js"></script>
```

## Usage

```javascript
let  = [
  { a: true,  b: 'Hello', c: 492 },
  { a: false, b: 'Hello', c: 992 },
  { a: true,  b: 'World', c: 433 }
]

select('*')
  .from()
  .where('a')
  .eq(true)
  .done()

// Returns:
// [ {a: true, b:'Hello', c: 492},
//   {a: true, b:'World', c: 433} ]
```

## API

Each query chain follows a pattern similar to (but not exactly like) basic SQL `SELECT` queries.

1. `select([keys])`
2. `from(objectArray)`
3. `where(keys)`*
4. Condition(s)*
  * `eq(values)`
  * `notEq(values)`
  * `gt(values)`
  * `gte(values)`
  * `lt(values)`
  * `lte(values)`
  * `includes(values)`
  * `notIncludes(values)`
5. `done()`

*\*`where` conditions are optional and chainable, but each call to `where` must be followed by a condition (see Conditions)*

### `select([keys])`

> Prepares a query to filter an array of objects by `key(s)`

To select all keys, pass `'*'` or no arguments to `select`

**Examples:**

```javascript
// Sample data
let data = [
  { a: true,  b: 'Hello', c: 492 },
  { a: false, b: 'Hello', c: 992 },
  { a: true,  b: 'World', c: 433 }
]

// Returns the entire set
select() // Same as select('*')
  .from(data)
  .done()

// [ { a: true,  b: 'Hello', c: 492 },
//   { a: false, b: 'Hello', c: 992 },
//   { a: true,  b: 'World', c: 433 } ]

// Returns only 'a' keys from the set
select('a')
  .from(data)
  .done()

// [ {a: true}, {a: false}, {a: true} ]

// Returns the only the selected keys
// in the order they were passed to 'select'
select('c', 'a') // note the order of keys
  .from(data)
  .done()

// [ { c: 492, a: true },
//   { c: 992, a: false },
//   { c: 433, a: true } ]

// Returns empty array as no object contain key 'd'
select('d')
  .from(data)
  .done()

// []
```

### `from(objectArray)`

> Formats filtered results for further filtering

This works best when `objectArray` is an array of similar objects, where the keys and values of each object follow a predictable pattern or schema. Differences in patterns may lead to errors or unpredictable behavior.

### `where(keys)`

> Prepares `keys` to be filtered by a condition

A condition must always come after a call to `where` (see Conditions)

### `apply()`

> Applies the filters to the data set

`where` conditions filter the original data, regardless of the keys passed in `select`. This allows a user to `select` keys in a set and filter based on conditions applied to other keys that may not be returned in the final results.

Calling `apply()` in a chain commits the filtered data so that subsequent `where` conditions are applied to the data as it was filtered when `apply()` was called. Filters will continue to reference the data in this state until `apply()` is called again or the chain is finished by calling `done()`

**Example:**
```javascript
// Sample data
let data = [
  { a: true,  b: 'Hello', c: 492 },
  { a: false, b: 'Hello', c: 992 },
  { a: true,  b: 'World', c: 433 }
]

// No 'apply' called
select('c')
  .from(data)
  .where('a')
  .eq(true)
  .done()

// [ {c: 492}, {c: 433 } ]

// 'apply' the filtered data to the set
select('c')
  .from(data)
  .apply() // Commit the filtered data to subsequent filters
  .where('a')
  .eq(true)
  .done()


// []
// Since we applied the filter that only selected
// 'c' keys, there were no 'a' keys to select after
// we called 'apply', so we get an empty array
```

### `done()`

> Finishes the query and formats the results into a usable array of objects

Neglecting to end a query chain with a call to `done` will return an instance of the internal `Selection` class whose internal methods are not documented here.

## Conditions

Each condition must have the same number of values as the keys passed into `where` and will be compared in the order in which they are passed.

Failure to match the number of arguments passed to `where` with the number of arguments passed to the associated condition will result in an error.

**Examples:**
```javascript
// Sample data
let data = [
  { a: 12, b: 'Hello', c: 492 },
  { a: 47, b: 'Hello', c: 992 },
  { a: 76, b: 'World', c: 433 }
]

// Returns all keys from objects where 'c' > 500
select()
  .from(data)
  .where('c')
  .gt(500)
  .done()

// [ { a: 47, b: 'Hello', c: 992 } ]

// Returns all keys from objects
// where 'a' < 50 AND 'c' < 500
select()
  .from(data)
  .where('a', 'c')
  .lt(50, 500)
  .done()

// [ { a: 12, b: 'Hello', c: 492 } ]

// Pass the same key to where multiple times
// to quickly filter it by a compound condition

// Returns all keys from objects
// where 'a' === 47 OR 'a' === 76
select()
  .from(data)
  .where('a', 'a')
  .eq(47, 76)
  .done()

// [ { a: 47, b: 'Hello', c: 992 },
//   { a: 76, b: 'World', c: 492 } ]

// Incorrect, as 'where' has 2 args while 'eq' has 1
select()
  .from(data)
  .where('a', 'b')
  .gte(10)
  .done()

// Error: Inequal number of key and value arguments in where(keys).gte(values)
//
```

Chain as many `where` conditions as needed to filter data to your heart's content

**Example:**
```javascript
select('a', 'b')
  .from(data)
  .where('b')
  .contains('ello')
  .where('c')
  .lte(500)
  .where('a')
  .eq(12)
  .done()

// [ { a: 12, b: 'Hello', c: 492 } ]
```

### `eq(tests)`

> **Equal to**

### `notEq(tests)`

> **Not equal to**

### `gt(tests)`

> **Greater than**

### `gte(tests)`

> **Greater than OR equal to**

### `lt(tests)`

> **Less than**

### `lte(tests)`

> **Less than OR equal to**

### `includes(tests)`

> **Whether `value` in `where` includes `test`**

Test if a `String` contains a subtring or an `Array` contains a value

### `notIncludes(tests)`

> **Whether `value` in `where` does not include `test`**

Test if a `String` does not contain a subtring or an `Array` does not contain a value

## License

SelectFrom is licensed under the terms of [WTFPL](http://www.wtfpl.net)

Copyright (c) 2017 Joshua Chumbley