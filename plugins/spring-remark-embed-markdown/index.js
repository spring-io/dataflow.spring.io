const path = require('path')
const fs = require('fs')
const unified = require('unified')
const parse = require('remark-parse')
const get = require(`lodash.get`)

const KEY = /^(<!--TEMPLATE:)(.*?)-->/

/**
 * Navigates in the root's children to find include declarations
 * Loads and parses a MD file to an AST object. This AST replaces the include declaration.
 */
module.exports = ({ markdownAST, markdownNode }) => {
  const children = []
  const relativePath = path.relative(
    `${__dirname}/../../`,
    markdownNode.fileAbsolutePath
  )
  const pathFolder = `./${path.parse(relativePath).dir}/`
  for (let i = 0; i < markdownAST.children.length; i++) {
    const node = markdownAST.children[i]
    const value = get(node, 'value')
    const type = get(node, 'type')
    if (value && value.match(KEY) && type !== 'code') {
      let filenameArr = value
        .replace('<!--TEMPLATE:', '')
        .replace('-->', '')
        .split('/')
      const filename = filenameArr.pop()
      const filePath = `${pathFolder}${filenameArr.join('/')}/_${filename}`
      if (!fs.existsSync(filePath)) {
        throw Error(`Invalid fragment specified; no such file "${filePath}"`)
      }
      const code = fs.readFileSync(filePath, 'utf8')
      const markdown = unified().use(parse)
      const ast = markdown.parse(code)
      children.push(...ast.children)
    } else {
      children.push(node)
    }
  }
  markdownAST.children = children
  return markdownAST
}
