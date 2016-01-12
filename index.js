const wayfarer = require('wayfarer')
const assert = require('assert')
const sliced = require('sliced')

module.exports = pageRouter

// Fast, modular client router
// fn(str, any[..]) -> fn(str, any[..])
function pageRouter (createTree, dft) {
  dft = dft || ''
  assert.equal(typeof createTree, 'function', 'createTree must be a function')
  assert.equal(typeof dft, 'string', 'dft must be a string')

  const router = wayfarer(dft)
  var tree = createTree(function (route, child) {
    assert.equal(typeof route, 'string', 'route must be a string')
    assert.ok(child, 'child exists')
    return [ route, child ]
  })

  tree = Array.isArray(tree) ? tree : [ tree ]

  // register tree in router
  ;(function walk (tree) {
    // handle special case of tree entry
    if (Array.isArray(tree[0])) {
      tree.forEach(function (node) {
        walk(node)
      })
    } else {
      router.on(tree[0], tree[1])
    }
  })(tree)

  // match a route on the router
  return function match (route) {
    assert.equal(typeof route, 'string', 'route must be a string')
    router.apply(null, sliced(arguments))
  }
}
