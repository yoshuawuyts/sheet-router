// const h = require('virtual-dom/h')
const noop = require('noop2')
const test = require('tape')

const pageRouter = require('./')

test('should assert input types', function (t) {
  t.plan(1)
  t.throws(pageRouter)
})

test('should route paths', function (t) {
  t.plan(1)
  const router = pageRouter(function (route) {
    return [
      route('/', function (params) {
        t.pass('called')
      }),
      route('/foo', noop)
    ]
  }, '/404')

  router('/')
})
