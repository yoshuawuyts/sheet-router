const assert = require('assert')

module.exports = bridge

// create a thunk bridge between a router and a render function
// (fn, str?, fn) -> null
function bridge (render, key, cb) {
  if (!cb) {
    cb = key
    key = 'location'
  }

  assert.equal(typeof render, 'function', 'render must be a function')
  assert.equal(typeof key, 'string', 'key must be a function')
  assert.equal(typeof cb, 'function', 'cb must be a function')

  var currLocation = null
  var currElement = null

  render(function (state) {
    if (currElement && state[key] === currLocation) {
      return currElement(state)
    } else {
      currElement = cb(state)
      currLocation = state[key]
      return currElement(state)
    }
  })
}
