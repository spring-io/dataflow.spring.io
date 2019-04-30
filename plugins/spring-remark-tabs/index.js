const visit = require(`unist-util-visit`)
const get = require(`lodash.get`)

const splitTabsToTitleAndContent = content => {
  const titles = content.match(/<!--(.*?)-->/gms)
  const tabs = content.split(/<!--.*?-->/gms)
  if (!titles || !tabs || !titles.length || !tabs.length) {
    return []
  }
  tabs.shift()
  return titles.map((title, idx) => ({
    title: title.substring(4, title.length - 3).trim(),
    content: tabs[idx],
  }))
}

module.exports = ({ markdownAST, markdownNode }, options = {}) => {
  const children = []
  const isNodeHeader = str => {
    return str.match(/<!--(.*?)-->/gms) !== null
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
