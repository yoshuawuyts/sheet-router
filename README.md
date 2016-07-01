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
const yo = require('yo-yo')

// default to `/404` if no path matches
const router = sheetRouter('/404', function (route) {
  return [
    route('/', (params) => yo`<div>Welcome to router land!</div>`),
    route('/:username', (params) => yo`<div>${params.username}</div>`, [
      route('/orgs', (params) => yo`<div>${params.username}'s orgs!</div>`)
    ]),
    route('/404', (params) => yo`<div>Oh no, path not found!</div>`),
  ]
})

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
Interacting with hash changes is often a common fallback scenario for those who don't have support for browser history. Whenever a `hashchange` event is triggered, sheet-router will trigger an update as seen below. However in order to match hash prefixed routes, the `hash-match` module can be used to normalize routes (ex: `#/foo` becomes `/foo`).
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

### virtual-dom example
```js
const render = require('virtual-dom/create-element')
const sheetRouter = require('sheet-router')
const h = require('virtual-dom/h')

const router = sheetRouter(function (r, t) {
  return [
    r('/foo/bar', function (params, h, state) {
      return h('div', null, 'hello world')
    })
  ]
})

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
const react = require('react')

const router = sheetRouter(function (r, t) {
  return [
    r('/foo/bar', function (params, h, state) {
      h('div', null, 'hello world')
    }
  ]
})

render(router('/foo', react.createElement, { name: 'Jane' }), document.body)
```
```html
<body>
  <div>hello world</div>
</body>
```

## API
### router = sheetRouter(dft?, createTree(route), createRoute?)
Create a new router from a nested array. Takes an optional default path as the
first argument.

If `createRoute(route)` is passed as the third argument, the `route()` function
passed to `createTree()` can be manipulated. This is useful for things like
changing argument order and the like.

### router(route, [,...])
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
