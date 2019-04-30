const visit = require(`unist-util-visit`)

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

  for (let i = 0; i < markdownAST.children.length; i++) {
    let node = markdownAST.children[i]
    if (node.value === '<!--CODE_TABS-->') {
      const tabs = []
      i++
      node = markdownAST.children[i]

      while (node.value !== '<!--END_CODE_TABS-->') {
        tabs.push(node)
        i++
        node = markdownAST.children[i]
      }

      const content = splitTabsToTitleAndContent(
        tabs.map(tab => tab.value).join('')
      )

      const items = content.map((item, index) => {
        return `<div class="tab-item ${index === 0 ? 'active' : ''}">${
          item.content
        }</div>`
      })

      const headers = content.map((item, index) => {
        return `<a onClick="changeTab(event, ${index});return false;" class="tab-item ${
          index === 0 ? 'active' : ''
        }">${item.title}</a>`
      })

      children.push({
        type: 'html',
        value: `<div class="tabs"><div class="tabs-headers">${headers.join(
          ''
        )}</div><div class="tabs-items">${items.join('')}</div></div>`,
        data: { hProperties: {} },
      })
    } else {
      children.push(node)
    }
  }

  markdownAST.children = children

  return markdownAST
}
