import window from 'global/window'
import assert from 'assert'

// listen to window hashchange events
// and update router accordingly
// fn(cb) -> null
export function hash (cb) {
  assert.equal(typeof cb, 'function', 'sheet-router/hash: cb must be a function')
  window.onhashchange = function (e) {
    cb(window.location.hash)
  }
}
