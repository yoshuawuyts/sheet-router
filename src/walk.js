import walk from 'wayfarer/walk'
import assert from 'assert'

export {walkSheetRouter as walk}

function walkSheetRouter (router, cb) {
  assert.equal(typeof router, 'function', 'sheet-router/walk: router should be a function')
  assert.equal(typeof cb, 'function', 'sheet-router/walk: cb should be a function')

  router = router._router
  return walk(router, cb)
}
