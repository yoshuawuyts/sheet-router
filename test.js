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
  }, '/404')

  router('/')
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
  }, '/404')

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
  }, '/404')

  router('/foo/bar')
})
