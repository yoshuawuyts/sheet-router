const noop = require('noop2')
const test = require('tape')

const sheetRouter = require('../')

test('router', (t) => {
  t.test('should assert input types', function (t) {
    t.plan(1)
    t.throws(sheetRouter)
  })

  t.test('should route paths', function (t) {
    t.plan(1)
    const router = sheetRouter([
      ['/', (params) => t.pass('called')],
      ['/foo', noop]
    ])

    router('/')
  })

  t.test('should match a default path', function (t) {
    t.plan(1)
    const router = sheetRouter({ default: '/404' }, [
      ['/404', () => t.pass('called')],
      ['/', noop]
    ])

    router('/foo')
  })

  t.test('should return a value', function (t) {
    t.plan(1)
    const router = sheetRouter({ default: '/404' }, [
      ['/404', (params) => 'foo']
    ])

    t.equal(router('/foo'), 'foo', 'returned value')
  })

  t.test('should clean urls before matching', function (t) {
    t.plan(2)
    const router = sheetRouter([
      ['/foo', (params) => t.pass('cleaned qs')],
      ['#hello-world', (params) => t.pass('matched hash')]
    ])

    router('https://foobar.com/foo?bar=baz')
    router('https://foobar.com#hello-world?bar=baz')
  })

  t.test('should deliver arbitrary objects', function (t) {
    t.plan(2)
    const router = sheetRouter([
      ['/', (params, foo, bar) => {
        t.equal(foo, 'foo', 'is foo')
        t.equal(bar, 'bar', 'is bar')
      }],
      ['/foo', noop]
    ])

    router('/', 'foo', 'bar')
  })

  t.test('should route nested paths 2 levels deep', function (t) {
    t.plan(1)
    const router = sheetRouter([
      ['/foo', [
        ['/bar', () => t.pass('called')]
      ]]
    ])

    router('/foo/bar')
  })

  t.test('should route vanilla paths 2 levels deep', function (t) {
    t.plan(1)
    const router = sheetRouter([
      ['/foo', [
        ['/', () => t.pass('called')]
      ]]
    ])

    router('/foo')
  })

  t.test('should route nested paths 3 levels deep', function (t) {
    t.plan(1)
    const router = sheetRouter([
      ['/foo', [
        ['/baz', [
          ['/bar', () => t.pass('called')]
        ]]
      ]]
    ])

    router('/foo/baz/bar')
  })

  t.test('should route cojoined paths 3 levels deep', function (t) {
    t.plan(1)
    const router = sheetRouter([
      ['/foo', [
        ['/baz/ban', [
          ['/bar', () => t.pass('called')]
        ]]
      ]]
    ])

    router('/foo/baz/ban/bar')
  })

  t.test('should route partial cojoined paths 3 levels deep', function (t) {
    t.plan(2)
    const router = sheetRouter([
      ['/foo', [
        ['/baz/:barp', [
          ['/bar', (params) => {
            t.equal(params.barp, 'ban', 'params match')
            t.pass('called')
          }]
        ]]
      ]]
    ])

    router('/foo/baz/ban/bar')
  })

  t.test('should route multiple partials', function (t) {
    t.plan(3)
    const router = sheetRouter([
      ['/', () => t.pass('called')],
      ['/:foo', [
        ['/:bar', (params) => {
          t.equal(params.foo, 'first', 'params foo match')
          t.equal(params.bar, 'second', 'params bar match')
        }]
      ]]
    ])

    router('/')
    router('/first/second')
  })

  t.test('should route multiple nested paths 2 levels deep', function (t) {
    t.plan(2)
    const router = sheetRouter([
      ['/foo', [
        ['/bar', () => t.pass('called')],
        ['/baz', () => t.pass('called')]
      ]]
    ])

    router('/foo/bar')
    router('/foo/baz')
  })

  t.test('should allow for default routes using three args', function (t) {
    t.plan(2)
    const router = sheetRouter([
      ['/foo', () => t.pass('foo called'), [
        ['/bar', () => t.pass('bar called')]
      ]]
    ])

    router('/foo')
    router('/foo/bar')
  })
})

test('hash routes', (t) => {
  t.test('should allow for hash routes', (t) => {
    t.plan(2)
    const router = sheetRouter([
      ['/foo', () => t.pass('foo called'), [
        ['#bar', () => t.pass('bar called')]
      ]]
    ])

    router('/foo')
    router('/foo#bar')
  })

  t.test('should allow for hash partials', (t) => {
    t.plan(1)
    const router = sheetRouter([
      ['/foo', () => t.pass('foo called'), [
        ['#:bar', (params) => t.equal(params.bar, 'bar', 'params match')]
      ]]
    ])

    router('/foo#bar')
  })
})
