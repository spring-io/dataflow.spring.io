const path = require('path')
const fs = require('fs')
const unified = require('unified')
const parse = require('remark-parse')
const get = require(`lodash.get`)
const request = require('request-promise')

const KEY = /^(<!--TEMPLATE:)(.*?)-->/

/**
 * Navigates in the root's children to find include declarations
 * Loads and parses a MD file to an AST object. This AST replaces the include declaration.
 */
module.exports = async ({ markdownAST, markdownNode }) => {
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

      let param = value.replace('<!--TEMPLATE:', '').replace('-->', '')

      let code
      const filename = filenameArr.pop()
      const filePath = `${pathFolder}${filenameArr.join('/')}/_${filename}`
      try {
        if (!fs.existsSync(filePath)) {
          code = await request(param)
        } else {
          code = fs.readFileSync(filePath, 'utf8')
        }
        const markdown = unified().use(parse)
        const ast = markdown.parse(code)
        children.push(...ast.children)
      } catch (e) {
        throw Error(`Error embed markdown ${param}`)
      }
    } else {
      children.push(node)
    }
  }
  markdownAST.children = children
  return markdownAST
}

/*

"<!--TEMPLATE:https://raw.githubusercontent.com/spring-io/dataflow.spring.io/master/content/documentation/pages/8-markdown/template/_sample.md-->"
.replace('<!--TEMPLATE:', '')
.replace('-->', '')

 */
