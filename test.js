const noop = require('noop2')
const test = require('tape')

const sheetRouter = require('./')
const walk = require('./walk')

test('should assert input types', function (t) {
  t.plan(1)
  t.throws(sheetRouter)
})

test('should route paths', function (t) {
  t.plan(1)
  const router = sheetRouter([
    ['/', (params) => t.pass('called')],
    ['/foo', noop]
  ])

  router('/')
})

test('should match a default path', function (t) {
  t.plan(1)
  const router = sheetRouter('/404', [
    ['/404', () => t.pass('called')],
    ['/', noop]
  ])

  router('/foo')
})

test('should return a value', function (t) {
  t.plan(1)
  const router = sheetRouter('/404', [
    ['/404', (params) => 'foo']
  ])

  t.equal(router('/foo'), 'foo', 'returned value')
})

test('should clean urls before matching', function (t) {
  t.plan(1)
  const router = sheetRouter([
    ['/foo', (params) => t.pass('called')]
  ])

  router('https://foobar.com/foo#hello-world?bar=baz')
})

test('should deliver arbitrary objects', function (t) {
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

test('should route nested paths 2 levels deep', function (t) {
  t.plan(1)
  const router = sheetRouter([
    ['/foo', [
      ['/bar', () => t.pass('called')]
    ]]
  ])

  router('/foo/bar')
})

test('should route vanilla paths 2 levels deep', function (t) {
  t.plan(1)
  const router = sheetRouter([
    ['/foo', [
      ['/', () => t.pass('called')]
    ]]
  ])

  router('/foo')
})

test('should route nested paths 3 levels deep', function (t) {
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

test('should route cojoined paths 3 levels deep', function (t) {
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

test('should route partial cojoined paths 3 levels deep', function (t) {
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

test('should route multiple partials', function (t) {
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

test('should route multiple nested paths 2 levels deep', function (t) {
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

test('should allow for default routes using three args', function (t) {
  t.plan(2)
  const router = sheetRouter([
    ['/foo', () => t.pass('foo called'), [
      ['/bar', () => t.pass('bar called')]
    ]]
  ])

  router('/foo')
  router('/foo/bar')
})

test('walk is exposed', (t) => {
  t.plan(1)
  t.equal(typeof walk, 'function', 'walk exists')
})
