const pathname = require('pathname-match')
const wayfarer = require('wayfarer')
const assert = require('assert')

module.exports = sheetRouter

// Fast, modular client router
// fn(str, any[..]) -> fn(str, any[..])
function sheetRouter (dft, tree) {
  if (!tree) {
    tree = dft
    dft = ''
  }

  assert.equal(typeof dft, 'string', 'sheet-router: dft must be a string')
  assert.ok(Array.isArray(tree), 'sheet-router: tree must be an array')

  const router = wayfarer(dft)
  var lastCallback = null
  var lastRoute = null

  // register tree in router
  // tree[0] is a string, thus a route
  // tree[0] is an array, thus not a route
  // tree[1] is a function
    // tree[2] is an array
    // tree[2] is not an array
  // tree[1] is an array
  ;(function walk (tree, fullRoute) {
    if (typeof tree[0] === 'string') {
      var route = tree[0].replace(/^\//, '')
    } else {
      var rootArr = tree[0]
    }

    const cb = (typeof tree[1] === 'function') ? tree[1] : null
    const children = (Array.isArray(tree[1]))
      ? tree[1]
      : Array.isArray(tree[2]) ? tree[2] : null

    if (rootArr) {
      tree.forEach(function (node) {
        walk(node, fullRoute)
      })
    }

    if (cb) {
      const innerRoute = route
        ? fullRoute.concat(route).join('/')
        : fullRoute.length ? fullRoute.join('/') : route
      router.on(innerRoute, thunkify(cb))
    }

    if (Array.isArray(children)) {
      walk(children, fullRoute.concat(route))
    }
  })(tree, [])

  // match a route on the router
  return function match (route, arg1, arg2, arg3, arg4, arg5) {
    assert.equal(typeof route, 'string', 'route must be a string')
    if (route === lastRoute) {
      return lastCallback(arg1, arg2, arg3, arg4, arg5)
    } else {
      lastRoute = pathname(route)
      lastCallback = router(lastRoute)
      return lastCallback(arg1, arg2, arg3, arg4, arg5)
    }
  }
}

// wrap a function in a function so it can be called at a later time
// fn -> null -> fn
function thunkify (cb) {
  return function (params) {
    return function (arg1, arg2, arg3, arg4, arg5) {
      return cb(params, arg1, arg2, arg3, arg4, arg5)
    }
  }
}
