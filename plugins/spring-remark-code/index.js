const visit = require(`unist-util-visit`)

module.exports = (
  { markdownAST, markdownNode },
  options = { variables: null }
) => {
  visit(markdownAST, `html`, node => {
    const { value } = node
    if (value.startsWith(`<div class="gatsby-highlight"`)) {
      node.value = `<div class="spring-code">
        <button onClick="codeToClipboard(event)" class="button button-clipboard" type="button">Copy</button>
        ${value}
      </div>`
    }
  })
  return markdownAST
}
