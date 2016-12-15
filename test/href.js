const tape = require('tape')
const href = require('../href')
const window = require('global/window') // will be empty object shared with href
const sinon = require('sinon')

window.history = { pushState: sinon.spy() }
window.location = {}

const goodLink = { localName: 'a', href: 'someUrl#', pathname: 'someUrl', hasAttribute: () => {} }

const nonCatchEvents = {
  'non-links': {
    target: { localName: 'p' }
  },
  'link without href': {
    target: { localName: 'a', hasAttribute: () => {} }
  },
  'link with data-no-routing': {
    target: { localName: 'a', href: 'someUrl#', hasAttribute: (a) => a === 'data-no-routing' }
  },
  'event with ctrlKey': {
    ctrlKey: true
  },
  'event with metaKey': {
    metaKey: true
  },
  'event with altKey': {
    altKey: true
  },
  'event with shiftKey': {
    shiftKey: true
  },
  'button click': {
    button: true
  }
}

tape('href', (t) => {
  t.test('should capture link click', (t) => {
    t.plan(3)
    const event = {
      target: {
        localName: 'somethingOtherThanALink',
        parentNode: {
          localName: 'stillNotALink',
          parentNode: goodLink
        }
      },
      preventDefault: sinon.spy()
    }
    const cb = sinon.spy()
    href(cb)
    window.onclick(event)

    t.equal(event.preventDefault.callCount, 1)
    t.equal(cb.callCount, 1)
    t.deepEqual(cb.lastCall.args[0], {
      hash: undefined, href: 'someUrl#', pathname: 'someUrl', search: {}
    })
  })

  for (var nonCatchEvent in nonCatchEvents) {
    t.test('should avoid ' + nonCatchEvent, (t) => {
      t.plan(3)
      const event = Object.assign({
        target: goodLink,
        preventDefault: sinon.spy()
      }, nonCatchEvents[nonCatchEvent])
      const previousPushCount = window.history.pushState.callCount
      const cb = sinon.spy()
      href(cb)
      window.onclick(event)

      t.equal(event.preventDefault.callCount, 0)
      t.equal(cb.callCount, 0)
      t.equal(window.history.pushState.callCount, previousPushCount)
    })
  }

  t.test('should avoid link outside provided root', (t) => {
    t.plan(3)
    const event = {
      target: {
        localName: 'somethingOtherThanALink',
        parentNode: {
          localName: 'root',
          parentNode: goodLink
        }
      },
      preventDefault: sinon.spy()
    }
    const previousPushCount = window.history.pushState.callCount
    const cb = sinon.spy()
    const root = event.target.parentNode
    href(cb, root)
    window.onclick(event)

    t.equal(event.preventDefault.callCount, 0)
    t.equal(cb.callCount, 0)
    t.equal(window.history.pushState.callCount, previousPushCount)
  })
})
