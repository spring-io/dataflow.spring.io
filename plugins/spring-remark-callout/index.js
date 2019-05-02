const visit = require(`unist-util-visit`)
const get = require(`lodash.get`)

module.exports = ({ markdownAST, markdownNode }) => {
  /**
   * Parsing code block to create the html callout
   * 3 identifiers are used to identify a callout code
   */
  visit(markdownAST, `html`, node => {
    let { value } = node
    const getNext = () => {
      let val = value.match(/;; (&lt;|<)[0-9]{1,2}(&gt;|>)/)
      if (!val) {
        val = value.match(/# (&lt;|<)[0-9]{1,2}(&gt;|>)/)
      }
      if (!val) {
        val = value.match(/\/\/ (&lt;|<)[0-9]{1,2}(&gt;|>)/)
      }
      if (val) {
        return {
          value: val[0],
          number: val[0]
            .replace('&gt;', '>')
            .replace('&lt;', '<')
            .split('>')[0]
            .split('<')[1],
        }
      }
      return false
    }
    if (value) {
      let element = getNext()
      while (element) {
        value = value.replace(
          element.value,
          `<i class="code-callout" data-value="${element.number}"></i>`
        )
        element = getNext()
      }
      node.value = value
    }
  })

  /**
   * Parsing lists to select the callouts description
   * The callout description has to be a list and start with <?>
   */
  visit(markdownAST, `list`, node => {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i]
      const value = get(child, 'children[0].children[0].value')
      const parent = get(child, 'children[0]')
      if (value && value.match(/^(<[0-9]{1,2}>)/)) {
        node.data = { hProperties: { className: 'callouts' } }
        const parse = value.split('<')[1].split('>')
        parent.children.shift()
        parent.children = [
          {
            type: 'html',
            value: `<i class="callout" data-value="${parse[0]}"></i>`,
          },
          {
            type: 'text',
            value: `${parse[1]}`,
          },
          ...parent.children,
        ]
      }
    }
  })

  return markdownAST
}
