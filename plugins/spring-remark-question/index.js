const get = require('lodash.get')

const START_KEY = '<!--QUESTION-->'
const END_KEY = '<!--END_QUESTION-->'

const Q_KEY = /^(<!--)(.*?)-->/

module.exports = ({ markdownAST, markdownNode }, options = {}) => {
  const children = []

  for (let i = 0; i < markdownAST.children.length; i++) {
    let node = markdownAST.children[i]
    if (node.value === START_KEY) {
      const items = []
      let title
      i++
      node = markdownAST.children[i]

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
        data: { hProperties: { className: 'question-block ' } },
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
