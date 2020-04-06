const visit = require(`unist-util-visit`)
const get = require('lodash.get')

const transformer = require(`./transformer`)

module.exports = ({ markdownAST, markdownNode }, options = {}) => {
  let vars = null
  const search = get(options, 'arrVars', []).find(item => {
    return item.version === markdownNode.fields.version
  })
  if (search) {
    vars = search['vars']
  }
  visit(markdownAST, `text`, node => {
    node.value = transformer(node.value, vars || {})
  })
  visit(markdownAST, `link`, node => {
    node.url = transformer(node.url, vars || {})
  })
  visit(markdownAST, `code`, node => {
    node.value = transformer(node.value, vars || {})
  })
  visit(markdownAST, `inlineCode`, node => {
    node.value = transformer(node.value, vars || {})
  })
  return markdownAST
}
