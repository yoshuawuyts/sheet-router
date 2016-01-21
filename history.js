const document = require('global/document')
const window = require('global/window')
const assert = require('assert')

module.exports = history

// attach a router to history
// and trigger a callback on change
// fn(str) -> null
function history (cb) {
  assert.equal(typeof cb, 'function', 'cb must be a function')

  // handle a click if is anchor tag with an href
  // and url lives on the same domain
  window.onclick = function (e) {
    if (e.target.localName !== 'a') return
    if (e.target.href === undefined) return
    if (window.location.host !== e.target.host) return
    e.preventDefault()
    cb(e.target.href)
    window.history.pushState({}, null, e.target.href)
  }

  // listen to html5 pushstate events
  // and update router accordingly
  window.onpopstate = function () {
    cb(document.location.href)
  }
}
