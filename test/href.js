const tape = require('tape')
const href = require('../href')
const window = require('global/window') // will be empty object shared with href
const sinon = require('sinon')

window.history = { pushState: sinon.spy() }
window.location = {}

const nonCatchEvents = {
  'non-links': {
    target: { localName: 'p' },
    preventDefault: sinon.spy()
  },
  'link without href': {
    target: { localName: 'a', hasAttribute: () => {} },
    preventDefault: sinon.spy()
  },
  'link with data-no-routing': {
    target: { localName: 'a', href: 'someUrl#', hasAttribute: (a) => a === 'data-no-routing' },
    preventDefault: sinon.spy()
  },
  'event with ctrlKey': {
    ctrlKey: true,
    target: { localName: 'a', href: 'someUrl#', hasAttribute: () => {} },
    preventDefault: sinon.spy()
  },
  'event with metaKey': {
    metaKey: true,
    target: { localName: 'a', href: 'someUrl#', hasAttribute: () => {} },
    preventDefault: sinon.spy()
  },
  'event with altKey': {
    altKey: true,
    target: { localName: 'a', href: 'someUrl#', hasAttribute: () => {} },
    preventDefault: sinon.spy()
  },
  'event with shiftKey': {
    shiftKey: true,
    target: { localName: 'a', href: 'someUrl#', hasAttribute: () => {} },
    preventDefault: sinon.spy()
  },
  'button click': {
    button: true,
    target: { localName: 'a', href: 'someUrl#', hasAttribute: () => {} },
    preventDefault: sinon.spy()
  }
}

tape('href', (t) => {
  t.test('should capture link click', (t) => {
    t.plan(5)
    const event = {
      target: {
        localName: 'somethingOtherThanALink',
        parentNode: {
          localName: 'stillNotALink',
          parentNode: {
            localName: 'a', href: 'someUrl#', hasAttribute: () => {}
          }
        }
      },
      preventDefault: sinon.spy()
    }
    const previousPushCount = window.history.pushState.callCount
    const cb = sinon.spy()
    href(cb)
    window.onclick(event)

    t.equal(event.preventDefault.callCount, 1)
    t.equal(cb.callCount, 1)
    t.equal(cb.lastCall.args[0], 'someUrl')
    t.equal(window.history.pushState.callCount, previousPushCount + 1)
    t.deepEqual(window.history.pushState.lastCall.args, [{}, null, 'someUrl'])
  })

  for (var nonCatchEvent in nonCatchEvents) {
    t.test('should avoid ' + nonCatchEvent, (t) => {
      t.plan(3)
      const event = nonCatchEvents[nonCatchEvent]
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
          parentNode: {
            localName: 'a', href: 'someUrl#', hasAttribute: () => {}
          }
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
