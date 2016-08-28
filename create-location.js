const document = require('global/document')
const assert = require('assert')
const xtend = require('xtend')

module.exports = createLocation

// takes an initial representation of the location state
// and then synchronize a mutation across all fields
//
// scenarios:
// - create a state object from document.location; we got no state yet
// - create a new state object from a string we pass in; full override mode
// - patch a state object with some value we pass in - lil patchy stuff
//
// (obj?, str?) -> obj
function createLocation (state, patch) {
  if (!state) {
    const newLocation = {
      pathname: document.location.pathname,
      search: document.location.search,
      hash: document.location.hash
    }
    newLocation.href = createHref(newLocation)
    return newLocation
  } else {
    assert.equal(typeof state, 'object', 'sheet-router/create-location: state should be an object')
    if (typeof patch === 'string') {
      const newLocation = parseUrl(patch)
      newLocation.href = createHref(newLocation)
      return newLocation
    } else {
      assert.equal(typeof patch, 'object', 'sheet-router/create-location: patch should be an object')
      const newLocation = xtend(state, patch)
      newLocation.href = createHref(newLocation)
      return newLocation
    }
  }

  // compute a href similar to node's href
  // (obj) -> str
  function createHref (location) {
    var ret = location.pathname
    if (location.hash) ret += (location.hash)
    if (location.search) ret += (location.search)
    return ret
  }

  // parse a URL into a kv object inside the browser
  // str -> obj
  function parseUrl (url) {
    const a = document.createElement('a')
    a.href = url

    return {
      href: a.pathname,
      search: a.search,
      hash: a.hash
    }
  }
}
