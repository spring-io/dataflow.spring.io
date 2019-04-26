const visit = require(`unist-util-visit`)

const transformer = require(`./transformer`)

module.exports = ({ markdownAST, markdownNode }, options = { arrVars: [] }) => {
  const { vars } = options.arrVars.find(item => {
    return item.version === markdownNode.fields.version
  })
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
