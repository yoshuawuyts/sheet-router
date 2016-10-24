const test = require('tape')

const p = require('../_pathname')

test('pathname', (t) => {
  t.plan(5)
  t.equal(p('https://foobar.com/bin/baz#bar'), 'bin/baz/bar')
  t.equal(p('http://foobar.com/bin/baz#bar'), 'bin/baz/bar')
  t.equal(p('http://foobar.com/bin/baz#bar?beep=boop'), 'bin/baz/bar')
  t.equal(p('http://foobar.com/bin/baz#bar?beep=boop'), 'bin/baz/bar')
  t.equal(p('/Users/dat/index.html/bin/baz', true), 'bin/baz')
})
