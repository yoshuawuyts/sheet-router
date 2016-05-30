const window = require('global/window')
const assert = require('assert')

module.exports = hash

function hash (cb) {
  assert.equal(typeof cb, 'function', 'cb must be a function')
  window.onhashchange = function (e) {
    cb(window.location.hash)
  }
}
