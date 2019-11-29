const visit = require(`unist-util-visit`)
const find = require(`unist-util-find`)
const isRelativeUrl = require(`is-relative-url`)

module.exports = ({ markdownAST }, options = {}) => {
  const visitor = (link, url) => {
    if (isRelativeUrl(url)) {
      if (url.indexOf('#') === -1) {
        if (url[url.length - 1] !== '/') {
          link.url = `${url}/`
        }
      }
      if (url.indexOf('#') > 0) {
        if (url.indexOf('/#') === -1) {
          link.url = url.replace('#', '/#')
        }
      }
    }
  }

  visit(markdownAST, `linkReference`, link => {
    const def = find(markdownAST, {
      type: 'definition',
      identifier: link.identifier,
    })
    if (def && def.url) visitor(link, def.url)
  })

  visit(markdownAST, `link`, link => {
    visitor(link, link.url)
  })
}
