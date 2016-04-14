const window = require('global/window')
const assert = require('assert')

module.exports = history

// handle a click if is anchor tag with an href
// and url lives on the same domain. Replaces
// trailing '#' so empty links work as expected.
// fn(str) -> null
function history (cb) {
  assert.equal(typeof cb, 'function', 'cb must be a function')

  window.onclick = function (e) {
    if (e.target.localName !== 'a') return
    if (e.target.href === undefined) return
    if (window.location.host !== e.target.host) return
    const href = e.target.href.replace(/#$/, '')
    e.preventDefault()
    cb(href)
    window.history.pushState({}, null, href)
  }
}
