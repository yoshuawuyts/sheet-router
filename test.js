const noop = require('noop2')
const test = require('tape')

const sheetRouter = require('./')

test('should assert input types', function (t) {
  t.plan(1)
  t.throws(sheetRouter)
})

test('should route paths', function (t) {
  t.plan(1)
  const router = sheetRouter((route) => [
    route('/', function (params) {
      t.pass('called')
    }),
    route('/foo', noop)
  ])

  router('/')
})

test('should match a default path', function (t) {
  t.plan(1)
  const router = sheetRouter('/404', (route) => [
    route('/404', () => t.pass('called')),
    route('/', noop)
  ])

  router('/foo')
})

test('should return a value', function (t) {
  t.plan(1)
  const router = sheetRouter('/404', (route) => [
    route('/404', (params) => 'foo')
  ])

  t.equal(router('/foo'), 'foo', 'returned value')
})

test('should clean urls before matching', function (t) {
  t.plan(1)
  const router = sheetRouter((route) => [
    route('/foo', (params) => t.pass('called'))
  ])

  router('https://foobar.com/foo#hello-world?bar=baz')
})

test('should deliver arbitrary objects', function (t) {
  t.plan(2)
  const router = sheetRouter((route) => [
    route('/', (params, foo, bar) => {
      t.equal(foo, 'foo', 'is foo')
      t.equal(bar, 'bar', 'is bar')
    }),
    route('/foo', noop)
  ])

  router('/', 'foo', 'bar')
})

test('should route nested paths 2 levels deep', function (t) {
  t.plan(1)
  const router = sheetRouter((route) => [
    route('/foo', [
      route('/bar', function () {
        t.pass('called')
      })
    ])
  ])

  router('/foo/bar')
})

test('should route vanilla paths 2 levels deep', function (t) {
  t.plan(1)
  const router = sheetRouter((route) => [
    route('/foo', [
      route('/', function () {
        t.pass('called')
      })
    ])
  ])

  router('/foo')
})

test('should route nested paths 3 levels deep', function (t) {
  t.plan(1)
  const router = sheetRouter((route) => [
    route('/foo', [
      route('/baz', [
        route('/bar', function () {
          t.pass('called')
        })
      ])
    ])
  ])

  router('/foo/baz/bar')
})

test('should route cojoined paths 3 levels deep', function (t) {
  t.plan(1)
  const router = sheetRouter((route) => [
    route('/foo', [
      route('/baz/ban', [
        route('/bar', function () {
          t.pass('called')
        })
      ])
    ])
  ])

  router('/foo/baz/ban/bar')
})

test('should route partial cojoined paths 3 levels deep', function (t) {
  t.plan(2)
  const router = sheetRouter((route) => [
    route('/foo', [
      route('/baz/:barp', [
        route('/bar', function (params) {
          t.equal(params.barp, 'ban', 'params match')
          t.pass('called')
        })
      ])
    ])
  ])

  router('/foo/baz/ban/bar')
})

test('should route multiple partials', function (t) {
  t.plan(3)
  const router = sheetRouter((route) => [
    route('/', function () {
      t.pass('called')
    }),
    route('/:foo', [
      route('/:bar', function (params) {
        t.equal(params.foo, 'first', 'params foo match')
        t.equal(params.bar, 'second', 'params bar match')
      })
    ])
  ])

  router('/')
  router('/first/second')
})

test('should route multiple nested paths 2 levels deep', function (t) {
  t.plan(2)
  const router = sheetRouter((route) => [
    route('/foo', [
      route('/bar', function () {
        t.pass('called')
      }),
      route('/baz', function () {
        t.pass('called')
      })
    ])
  ])

  router('/foo/bar')
  router('/foo/baz')
})

test('should allow for default routes using three args', function (t) {
  t.plan(2)
  const router = sheetRouter((route) => [
    route('/foo', () => t.pass('foo called'), [
      route('/bar', () => t.pass('bar called'))
    ])
  ])

  router('/foo')
  router('/foo/bar')
})

test('should allow for a custom createRoute function', function (t) {
  t.plan(2)
  const router = sheetRouter('', (route) => {
    return [
      route('/foo/:bin', (state, send) => {
        const expected = {
          foo: 'bar',
          params: { bin: 'baz' }
        }
        t.deepEqual(state, expected, 'state was merged')
        t.equal(send, 'oi')
      })
    ]
  }, createRoute)

  router('/foo/baz', { foo: 'bar' })

  function createRoute (routeFn) {
    return function (route, inline, child) {
      if (!child) inline = wrap(inline)
      else child = wrap(child)
      return routeFn(route, inline, child)
    }

    function wrap (child) {
      const send = 'oi'
      return function wrap (params, state) {
        state.params = params
        return child(state, send)
      }
    }
  }
})
