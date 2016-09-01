import window from 'global/window'
import assert from 'assert'

const noRoutingAttrName = 'data-no-routing'

// handle a click if is anchor tag with an href
// and url lives on the same domain. Replaces
// trailing '#' so empty links work as expected.
// fn(str) -> null
export function href (cb) {
  assert.equal(typeof cb, 'function', 'sheet-router/href: cb must be a function')

  window.onclick = function (e) {
    if ((e.button && e.button !== 0) || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return

    const node = (function traverse (node) {
      if (!node) return
      if (node.localName !== 'a') return traverse(node.parentNode)
      if (node.href === undefined) return traverse(node.parentNode)
      if (window.location.host !== node.host) return traverse(node.parentNode)
      return node
    })(e.target)

    if (!node) return

    const isRoutingDisabled = node.hasAttribute(noRoutingAttrName)
    if (isRoutingDisabled) return

    e.preventDefault()
    const href = node.href.replace(/#$/, '')
    cb(href)
    window.history.pushState({}, null, href)
  }
}
