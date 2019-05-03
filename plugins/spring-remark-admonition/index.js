const START_KEYS = [
  '<!--IMPORTANT-->',
  '<!--CAUTION-->',
  '<!--WARNING-->',
  '<!--TIP-->',
  '<!--NOTE-->',
]
const END_KEYS = [
  '<!--END_IMPORTANT-->',
  '<!--END_CAUTION-->',
  '<!--END_WARNING-->',
  '<!--END_TIP-->',
  '<!--END_NOTE-->',
]

const CLASSNAMES = ['important', 'caution', 'warning', 'tip', 'note']

module.exports = ({ markdownAST, markdownNode }, options = {}) => {
  const children = []

  for (let i = 0; i < markdownAST.children.length; i++) {
    let node = markdownAST.children[i]
    if (START_KEYS.indexOf(node.value) > -1) {
      const items = []
      const className = CLASSNAMES[START_KEYS.indexOf(node.value)]
      i++
      node = markdownAST.children[i]

      while (
        END_KEYS.indexOf(node.value) === -1 &&
        i < markdownAST.children.length
      ) {
        items.push(node)
        i++
        node = markdownAST.children[i]
      }

      children.push({
        type: 'element',
        tagName: 'div',
        data: { hProperties: { className: 'admonition ' + className } },
        children: items,
      })
    } else {
      children.push(node)
    }
  }

  markdownAST.children = children

  return markdownAST
}
