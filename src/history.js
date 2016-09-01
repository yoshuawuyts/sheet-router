import document from 'global/document'
import window from 'global/window'
import assert from 'assert'

// listen to html5 pushstate events
// and update router accordingly
// fn(str) -> null
export function history (cb) {
  assert.equal(typeof cb, 'function', 'sheet-router/history: cb must be a function')
  window.onpopstate = function () {
    cb(document.location.href)
  }
}
