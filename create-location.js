const xtend = require('xtend')

module.exports = createLocation

// takes an initial representation of the location state
// and then synchronize a mutation across all fields
// (obj, str|obj?) -> obj
function createLocation (state, patch) {
  if (!state) {
    const newLoc = {
      pathname: patch.pathname,
      hash: patch.hash,
      search: patch.search
    }
    newLoc.href = createHref(newLoc)
    return newLoc
  } else if (typeof patch === 'string') {
    const newLoc = parseUrl(patch)
    newLoc.href = createHref(newLoc)
    return newLoc
  } else {
    const newLoc = xtend(state, patch)
    newLoc.href = createHref(newLoc)
    return newLoc
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
