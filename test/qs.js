const qs = require('../qs')
const tape = require('tape')

tape('qs', (t) => {
  t.test('should parse querystrings', (t) => {
    t.plan(1)
    const uri = 'https://foobar.com/binbaz?foo=bar'
    const expected = { foo: 'bar' }
    t.deepEqual(qs(uri), expected, 'res is same')
  })

  t.test('should parse querystrings in hash urls', (t) => {
    t.plan(1)
    const uri = 'https://foobar.com/binbaz#heyo?foo=bar'
    const expected = { foo: 'bar' }
    t.deepEqual(qs(uri), expected, 'res is same')
  })

  t.test('should parse multiple querystrings', (t) => {
    t.plan(1)
    const uri = 'https://foobar.com/binbaz?foo=bar&beep=boop'
    const expected = { foo: 'bar', beep: 'boop' }
    t.deepEqual(qs(uri), expected, 'res is same')
  })
})
