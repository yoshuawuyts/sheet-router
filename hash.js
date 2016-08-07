const window = require('global/window')
const assert = require('assert')

module.exports = hash

// listen to window hashchange events
// and update router accordingly
// fn(cb) -> null
function hash (cb) {
  assert.equal(typeof cb, 'function', 'sheet-router/hash: cb must be a function')
  window.onhashchange = function (e) {
    cb(window.location.hash)
  }
}
