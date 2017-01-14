# sheet-router [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5] [![test coverage][6]][7]
[![downloads][8]][9] [![js-standard-style][10]][11]

sheet-router is a fast, modular client-side router. It enables view composition
and is tuned for performance by statically declaring routes in a
[radix-trie][12]. Weighs `1.5KB` minified and gzipped.

## Installation
```sh
$ npm install sheet-router
```

## Features
- View composition through functions
- Tuned for performance by generating a [radix-trie][12]
- Not bound to any framework
- Minimal dependencies and tiny code size
- HTML5 history support
- Catch and handle `<a href="">` links

## Usage
sheet-router tries to make routing understandable and pleasant to work with. It
does so by using a lisp-like structure which is internally compiled to an
efficient data structure. Here each route takes either an array of children or
a callback, which are then translated to paths that take callbacks
```js
const sheetRouter = require('sheet-router')
const html = require('bel')

// default to `/404` if no path matches
const router = sheetRouter({ default: '/404' }, [
  ['/', (params) => html`<div>Welcome to router land!</div>`],
  ['/:username', (params) => html`<div>${params.username}</div>`, [
    ['/orgs', (params) => html`<div>${params.username}'s orgs!</div>`]
  ]],
  ['/404', (params) => html`<div>Oh no, path not found!</div>`],
])

router('/hughsk/orgs')
```

### history
Interacting with the browser history is a common action, sheet-router
supports this out of the box. When the `forwards` or `backwards` buttons in the
browser are clicked, or `history.back` / `history.go` are called sheet-router
will update accordingly.
```js
const history = require('sheet-router/history')
history(function (href) {
  router(href)
  console.log('history changed: ' + href)
})
```

### hash
Interacting with hash changes is often a common fallback scenario for those who
don't have support for browser history. Whenever a `hashchange` event is
triggered, sheet-router will trigger an update as seen below. However in order
to match hash prefixed routes, the `hash-match` module can be used to normalize
routes (ex: `#/foo` becomes `/foo`).
```js
const hash = require('sheet-router/hash')
const match = require('hash-match')
hash(function (href) {
  router(match(href))
  console.log('hash location changed: ' + href)
})
```

### href
In HTML links are represented with `<a href="">` style tags. Sheet-router can
be smart about these and handle them globally. This way there's no need to
attach specific listeners to each link and static HTML templates can be
upgraded seemlessly to include single-page routing.
```js
const href = require('sheet-router/href')
href(function (href) {
  router(href)
  console.log('link was clicked: ' + href)
})
```

You can ignore specific links that you do not want to process through routing
by adding the `data-no-routing` attribute.

```html
<a href="/my-external-link" data-no-routing>Non routed link</a>
<a href="/another-external-link" data-no-routing="true">Not routed either</a>
```

Also, if you pass an optional `root` node reference as a second argument to `href`, it will never intercept clicks outside that node. This is useful when your app is confined to a widget in a larger document.

```js
href(function (href) {
  router(href)
  console.log('link was clicked: ' + href)
}, document.getElementById("app-root"))
```

### qs
Sometimes [query strings][mdn-qs] must be decoded. In order to do this, the
`./qs.js` file is included.
```js
const qs = require('./qs')
qs('https://www.npmjs.com/search?q=query+string')
// => { q: 'query+string' }
```

### walk
Sometimes it's necessary to walk the `trie` to apply transformations. In order
to access the raw callback and prevent unnecessary function calls we need to
disable the default thunking mechanism by passing `{ thunk: false }`:
```js
const sheetRouter = require('sheet-router')
const walk = require('sheet-router/walk')

const router = sheetRouter({ thunk: false }, [
  ['/multiply', (x, y) => x * y],
  ['/divide', (x, y) => x / y]
])

walk(router, (route, cb) => {
  const y = 2
  return function (params, x) {
    return cb(x, y)
  }
})

router('/multiply', 4)
// => 8
router('/divide', 8)
// => 4
```

We could change our transformed function to be thunked by changing `walk` to
return a function, and setting `{ thunk: 'match' }` so only the `match`
function thunks. This is pretty advanced stuff, so don't sweat it too much -
but it's super useful to create performant frameworks!
```js
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

router('/multiply', 4)
// => 8
router('/multiply', 4)
// => 8 (but this time around this is computed faster)
router('/divide', 8)
// => 4
```

### create-location
Sometimes you want to mirror the browser location API inside an object to use
inside a framework. The hard part is to compute the new `href` from a set of
changes. `create-location` provides an API to do just that:
```js
const createLocation = require('sheet-router/create-location')

document.location = '/foo/bar#hey?beep=boop'
var location = createLocation()
// => {
//    pathname: '/',
//    hash: '#hey',
//    search: { beep: 'boop' },
//    href: '/foo/bar#hey?beep=boop'
//  }

const hashPatch = { hash: '#oh-no' }
var location = createLocation(location, hashPatch)
// => {
//    pathname: '/',
//    hash: '#oh-no',
//    search: { beep: 'boop' },
//    href: '/foo/bar#oh-no?beep=boop'
//  }

const uriPatch = '/hey/hello'
var location = createLocation(location, uriPatch)
// => {
//    pathname: '/hey/hello',
//    hash: '',
//    search: { },
//    href: '/hey/hello'
//  }
```

### virtual-dom example
```js
const render = require('virtual-dom/create-element')
const sheetRouter = require('sheet-router')
const h = require('virtual-dom/h')
const hyperx = require('hyperx')

const html = hyperx(h)

const router = sheetRouter([
  ['/foo/bar', (params, h, state) => html`<div>hello world!</div>`]
])

const node = render(router('/foo/bar', h, { name: 'Jane' }))
document.body.appendChild(node)
```
```html
<body>
  <div>hello world</div>
</body>
```

### react example
```js
const sheetRouter = require('sheet-router')
const render = require('react-dom')
const hyperx = require('hyperx')
const react = require('react')

const html = hyperx(react.createElement)

const router = sheetRouter([
  ['/foo/bar', (params, h, state) => html`<div>hello world!</div>`]
])

render(router('/foo', react.createElement, { name: 'Jane' }), document.body)
```
```html
<body>
  <div>hello world</div>
</body>
```

## API
### router = sheetRouter(opts?, [routes])
Create a new router from a nested array. Takes an optional options object as
the first argument. Options are:
- __opts.default__: defaults to `'/404'`, default path to use if no paths match
- __opts.thunk__: defaults to `true`. Toggle if callbacks should be thunked or
  not. Can be set to `'match'` to only have the returned `router.match()`
  function expect thunks to exist. Useful to write a custom `walk` function
  that creates a different signature

### router(path, [,...])
Match a route on the router. Takes a path and an arbitrary list of arguments
that are then passed to the matched routes. Cleans urls to only match the
[pathname][15].

### history(cb(href))
Call a callback to handle html5 pushsState history.

### href(cb(href))
Call a callback to handle `<a href="#">` clicks.

## See Also
- [wayfarer][12]
- [hyperx][14]
- [choo](https://github.com/yoshuawuyts/choo)

## License
[MIT](https://tldrlegal.com/license/mit-license)

[mdn-qs]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search
[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/sheet-router.svg?style=flat-square
[3]: https://npmjs.org/package/sheet-router
[4]: https://img.shields.io/travis/yoshuawuyts/sheet-router/master.svg?style=flat-square
[5]: https://travis-ci.org/yoshuawuyts/sheet-router
[6]: https://img.shields.io/codecov/c/github/yoshuawuyts/sheet-router/master.svg?style=flat-square
[7]: https://codecov.io/github/yoshuawuyts/sheet-router
[8]: http://img.shields.io/npm/dm/sheet-router.svg?style=flat-square
[9]: https://npmjs.org/package/sheet-router
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
[12]: https://github.com/yoshuawuyts/wayfarer
[13]: https://github.com/Matt-Esch/virtual-dom
[14]: https://github.com/substack/hyperx
[15]: https://nodejs.org/api/url.html#url_url_parsing
