const get = require(`lodash.get`)

const START_KEY = '<!--QUESTION-->'
const KEY = /^(<!--QUESTION#)(.*?)-->/
const END_KEY = '<!--END_QUESTION-->'

module.exports = ({ markdownAST, markdownNode }, options = {}) => {
  const children = []

  for (let i = 0; i < markdownAST.children.length; i++) {
    let node = markdownAST.children[i]
    const value = get(node, 'value')
    if (value && (value === START_KEY || value.match(KEY))) {
      const items = []
      let title
      let anchor = ''
      i++
      node = markdownAST.children[i]

      if (value.match(KEY)) {
        anchor = value
          .replace('<!--QUESTION#', '')
          .replace('-->', '')
          .replace(/ /g, '-')
      }

      while (END_KEY !== node.value && i < markdownAST.children.length) {
        if (!title) {
          title = node
        } else {
          items.push(node)
        }

        i++
        node = markdownAST.children[i]
      }
      children.push({
        type: 'element',
        tagName: 'div',
        data: { hProperties: { className: 'question-block', id: anchor } },
        children: [
          {
            type: 'element',
            tagName: 'div',
            data: {
              hProperties: {
                className: 'question ',
                onClick: 'toggleQuestion(event)',
              },
            },
            children: [title],
          },
          {
            type: 'element',
            tagName: 'div',
            data: { hProperties: { className: 'answer ' } },
            children: items,
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
