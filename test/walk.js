const SheetRouter = require('../dist/bundle')
const sheetRouter = SheetRouter.sheetRouter
const walk = SheetRouter.walk
const tape = require('tape')

tape('walk', function (t) {
  t.test('should walk a trie', (t) => {
    t.plan(2)
    const router = sheetRouter({ thunk: false }, [
      ['/foo', (x, y) => x * y],
      ['/bar', (x, y) => x / y]
    ])

    walk(router, (route, cb) => {
      const y = 2
      return function (params, x) {
        return cb(x, y)
      }
    })

    t.equal(router('/foo', 4), 8, 'multiply')
    t.equal(router('/bar', 8), 4, 'divide')
  })

  t.test('should allow thunking', (t) => {
    t.plan(2)
    const router = sheetRouter({ thunk: 'match' }, [
      ['/foo', (x, y) => x * y],
      ['/bar', (x, y) => x / y]
    ])

    walk(router, (route, cb) => {
      const y = 2
      return function (params) {
        return function (x) {
          return cb(x, y)
        }
      }
    })

    t.equal(router('/foo', 4), 8, 'multiply')
    t.equal(router('/bar', 8), 4, 'divide')
  })
})
