// const h = require('virtual-dom/h')
const noop = require('noop2')
const test = require('tape')

const sheetRouter = require('./')

test('should assert input types', function (t) {
  t.plan(1)
  t.throws(sheetRouter)
})

test('should route paths', function (t) {
  t.plan(1)
  const router = sheetRouter(function (route) {
    return [
      route('/', function (params) {
        t.pass('called')
      }),
      route('/foo', noop)
    ]
  })

  router('/')
})

test('should match a default path', function (t) {
  t.plan(1)
  const router = sheetRouter('/404', function (route) {
    return [
      route('/404', function (params) {
        t.pass('called')
      }),
      route('/', noop)
    ]
  })

  router('/foo')
})

test('should deliver arbitrary objects', function (t) {
  t.plan(2)
  const router = sheetRouter(function (route) {
    return [
      route('/', function (params, foo, bar) {
        t.equal(foo, 'foo', 'is foo')
        t.equal(bar, 'bar', 'is bar')
      }),
      route('/foo', noop)
    ]
  })

  router('/', 'foo', 'bar')
})

test('should route nested paths 2 levels deep', function (t) {
  t.plan(1)
  const router = sheetRouter(function (route) {
    return [
      route('/foo', [
        route('/bar', function () {
          t.pass('called')
        })
      ])
    ]
  })

  router('/foo/bar')
})

test('should route vanilla paths 2 levels deep', function (t) {
  t.plan(1)
  const router = sheetRouter(function (route) {
    return [
      route('/foo', [
        route('/', function () {
          t.pass('called')
        })
      ])
    ]
  })

  router('/foo')
})

test('should route nested paths 3 levels deep', function (t) {
  t.plan(1)
  const router = sheetRouter(function (route) {
    return [
      route('/foo', [
        route('/baz', [
          route('/bar', function () {
            t.pass('called')
          })
        ])
      ])
    ]
  })

  router('/foo/baz/bar')
})

test('should route cojoined paths 3 levels deep', function (t) {
  t.plan(1)
  const router = sheetRouter(function (route) {
    return [
      route('/foo', [
        route('/baz/ban', [
          route('/bar', function () {
            t.pass('called')
          })
        ])
      ])
    ]
  })

  router('/foo/baz/ban/bar')
})

test('should route partial cojoined paths 3 levels deep', function (t) {
  t.plan(2)
  const router = sheetRouter(function (route) {
    return [
      route('/foo', [
        route('/baz/:barp', [
          route('/bar', function (params) {
            t.equal(params.barp, 'ban', 'params match')
            t.pass('called')
          })
        ])
      ])
    ]
  })

  router('/foo/baz/ban/bar')
})
