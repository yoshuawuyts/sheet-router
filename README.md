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
const h = require('virtual-dom/h')

const router = sheetRouter('/404', function (route) {
  return [
    route('/', (params, h, state) => h('div', 'index path')),
    route('/foo', [
      route('/', (params, h, state) => h('div', 'foo path')),
      route('/:name/text', (params, h, state) => h('div', state.text))
    ])
  ]
})

router('/foo/hugh/text', h, { text: 'hello world' })
```

sheet-router can also be used to compose multiple views. Composing views is
useful because often views share a lot of the same layout.

Say we would want to have a base view with a sidebar and header, and different
content based on the url, we could declare a view called `base.js` using
[virtual-dom][13].
```js
module.exports = function (content) {
  return function (params, h, state) {
    return h('main', [
      h('header'),
      h('aside'),
      content(params, h, state)
    ])
  }
}
```

Say we would want to render a `/foo` and `/bar` views that extend our base
view, we could pass the arguments into `./base` which then renders it out as
content.
```js
const sheetRouter = require('sheet-router')
const h = require('virtual-dom/h')
const base = require('./base')

const router = sheetRouter(function (route) {
  return [
    route('/foo', (params, h, state) => base(h('section', 'this is bar path')),
    route('/bar', (params, h, state) => base(h('section', 'this is foo path'))
  ]
})

router('/foo')
```

Calling the router with `/foo` will then return the following html:
```html
<main>
  <menu></menu>
  <aside></aside>
  <section>this is foo path</section>
</main>
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
### router = sheetRouter(dft?, createTree(route))
Create a new router from a nested array. Takes an optional default path as the
first argument.

### router(route, [,...])
Match a route on the router. Takes a path and an arbitrary list of arguments
that are then passed to the matched routes. Cleans urls to only match the
[pathname][15].

### history(cb(href))
Call a callback to handle html5 pushsState history and handle `<a href="">`
clicks.

### bridge(render, stateKey?, router(state))
Bridge a render function that passes a state object to sheet-router.
sheet-router is then wrapped in a thunk, and will only diff paths if the route
on the state object has changed. This requires routes to return a thunk which
takes additional arguments, which can be done by calling the second argument of
`t` (for thunk) instead of `r` to create routes.
```js
const bridge = require('sheet-router/bridge')
const sheetRouter = require('sheet-router')
const createApp = require('virtual-app')

const app = createApp(document.body, vdom)
const render = app.start(modifyState, initialState)
bridge(render, (state) => router(state.location, app.h))
```

## See Also
- [wayfarer][12]
- [virtual-dom][13]
- [hyperx][14]

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
