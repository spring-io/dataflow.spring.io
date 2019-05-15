const get = require('lodash.get')

module.exports = node => {
  const h1 = node.headings.filter(item => item.depth === 1)
  if (h1.length !== 1) {
    if (h1.length === 0) {
      console.log(`Missing h1 on page ${node.fileAbsolutePath}`)
    }
    if (h1.length > 1) {
      console.log(`Too many h1 on page ${node.fileAbsolutePath}`)
    }
  }
  if (!get(node, 'frontmatter.title')) {
    console.log(`Title missing on page ${node.fileAbsolutePath}`)
  }
  if (!get(node, 'frontmatter.title')) {
    console.log(`Description missing on page ${node.fileAbsolutePath}`)
  }
}
