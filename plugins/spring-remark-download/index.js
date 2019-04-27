const visit = require(`unist-util-visit`)

module.exports = (
  { markdownAST, markdownNode },
  options = { variables: null }
) => {
  visit(markdownAST, `inlineCode`, node => {
    const { value } = node
    if (value.startsWith(`download:`)) {
      const params = value.substr(`download:`.length).split(' title=')
      try {
        node.value = `<a class="link-download" href="${
          params[0]
        }" onClick="return downloadLink(event, \`${params[0]}\`)">${
          params[1] ? params[1] : 'Download'
        }</a>`
        node.type = `html`
      } catch (e) {
        throw Error(`Remark-Download invalid syntax: ${value}`)
      }
    }
  })
  return markdownAST
}
