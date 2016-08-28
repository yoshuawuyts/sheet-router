const window = require('global/window')

const decodeURIComponent = window.decodeURIComponent
const reg = new RegExp('([^?=&]+)(=([^&]*))?', 'g')

module.exports = qs

// decode a uri into a kv representation :: str -> obj
function qs (uri) {
  const obj = {}
  uri.replace(/^.*\?/, '').replace(reg, map)
  return obj

  function map (a0, a1, a2, a3) {
    obj[decodeURIComponent(a1)] = decodeURIComponent(a3)
  }
}
