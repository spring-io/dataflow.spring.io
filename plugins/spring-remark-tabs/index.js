const get = require(`lodash.get`)

module.exports = ({ markdownAST, markdownNode }, options = {}) => {
  const children = []
  const isNodeHeader = str => {
    const KEYS = [
      /^(<!--TEMPLATE:)(.*?)-->/,
      /^(<!--CODE:)(.*?)-->/,
      /^(<!--VIDEO:)(.*?)-->/,
    ]
    if (str.match(/<!--(.*?)-->/gms) !== null) {
      return KEYS.filter(key => str.match(key) !== null).length === 0
    }
    return false
  }

  for (let i = 0; i < markdownAST.children.length; i++) {
    let node = markdownAST.children[i]
    if (node.value === '<!--TABS-->') {
      const tabs = []
      i++
      node = markdownAST.children[i]

      while (node.value !== '<!--END_TABS-->') {
        tabs.push(node)
        i++
        node = markdownAST.children[i]
      }

      const content = []
      for (let j = 0; j < tabs.length; j = j + 1) {
        const title = tabs[j].value
          .substring(4, tabs[j].value.length - 3)
          .trim()

        const ast = []
        j++
        while (j < tabs.length && !isNodeHeader(get(tabs[j], 'value', ''))) {
          ast.push(tabs[j])
          j++
        }
        j--

        content.push({ title: title, ast: ast })
      }

      const headers = content
        .map((item, index) => {
          return `<a onClick="changeTab(event, ${index});return false;" class="tab-item ${
            index === 0 ? 'active' : ''
          }">${item.title}</a>`
        })
        .join('')

      children.push({
        type: 'element',
        tagName: 'div',
        data: { hProperties: { className: 'tabs' } },
        children: [
          {
            type: 'html',
            value: `<div class="tabs-headers">${headers}</div>`,
          },
          {
            type: 'element',
            tagName: 'div',
            data: { hProperties: { className: 'tabs-items' } },
            children: content.map((item, index) => {
              return {
                type: 'element',
                tagName: 'div',
                data: {
                  hProperties: {
                    className: `tab-item ${index === 0 ? 'active' : ''}`,
                  },
                },
                children: item.ast,
              }
            }),
          },
        ],
      })
    } else {
      children.push(node)
    }
  }

  markdownAST.children = children

  return markdownAST
}
