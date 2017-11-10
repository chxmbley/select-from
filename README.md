# SelectFrom

Run basic SQL-like queries against arrays of similar objects in Javascript

## Usage

```javascript
const select = require('select-from')

let arr = [
  {
    a: true,
    b: 'Hello',
    c: 492
  },
  {
    a: false,
    b: 'Hello',
    c: 992
  },
  {
    a: true,
    b: 'World',
    c: 433
  }
]

select('*')
  .from(arr)
  .where('a')
  .eq(true)
  .done()

// Returns:
// [{a: true, b:'Hello', c: 492}, {a: true, b:'World', c: 433}]

select('b', 'a')
  .from(arr)
  .where('c')
  .gt(500)
  .done()

// Returns:
// [{b: 'Hello', a: true}]

select('c').from(arr).done()

// Returns:
// [{c: 492}, {c: 992}, {c: 433}]
```