/* eslint-disable no-useless-escape */
const electron = '^(file\:|\/).*\/.*\.html?\/?'
const protocol = '^(http(s)?(:\/\/))?(www\.)?'
const domain = '[a-zA-Z0-9-_\.]+(:[0-9]{1,5})?(\/{1})?'
const qs = '[\?].*$'
/* eslint-enable no-useless-escape */

const stripElectron = new RegExp(electron)
const prefix = new RegExp(protocol + domain)
const normalize = new RegExp('#')
const suffix = new RegExp(qs)

module.exports = pathname

// replace everything in a route but the pathname and hash
// TODO(yw): ditch 'suffix' and allow qs routing
// (str, bool) -> str
function pathname (route, isElectron) {
  if (isElectron) route = route.replace(stripElectron, '')
  else route = route.replace(prefix, '')
  return route.replace(suffix, '').replace(normalize, '/')
}
