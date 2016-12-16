const test = require('tape')

const p = require('../_pathname')

test('pathname', (t) => {
  t.plan(7)
  t.equal(p('https://foobar.com/bin/baz#bar'), 'bin/baz/bar')
  t.equal(p('http://foobar.com/bin/baz#bar'), 'bin/baz/bar')
  t.equal(p('http://foobar.com/bin/baz#bar?beep=boop'), 'bin/baz/bar')
  t.equal(p('http://foobar.com/bin/baz#bar?beep=boop'), 'bin/baz/bar')
  t.equal(p('/Users/dat/index.html/bin/baz', true), 'bin/baz')
  t.equal(p('file:///Users/anon/src/juliangruber/dat-desktop/index.html', true), '')
  t.equal(p('file:///preferences', true), '/preferences')
})
