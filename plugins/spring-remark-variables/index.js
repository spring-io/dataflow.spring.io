const visit = require(`unist-util-visit`)

const transformer = require(`./transformer`)

module.exports = (
  { markdownAST, markdownNode },
  options = { variables: null }
) => {
  // console.log('markdownNode', markdownNode)
  visit(markdownAST, `text`, node => {
    node.value = transformer(node.value, options.variables || {})
  })
  visit(markdownAST, `link`, node => {
    node.url = transformer(node.url, options.variables || {})
  })
  visit(markdownAST, `code`, node => {
    node.value = transformer(node.value, options.variables || {})
  })
  visit(markdownAST, `inlineCode`, node => {
    node.value = transformer(node.value, options.variables || {})
  })
  return markdownAST
}
