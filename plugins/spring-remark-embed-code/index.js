const visit = require(`async-unist-util-visit`)
const request = require('request-promise')
const transformer = require(`../spring-remark-variables/transformer`)
const get = require('lodash.get')

const highlightCode = require(`gatsby-remark-prismjs/highlight-code`)

const KEY = /^(<!--CODE:)(.*?)-->/

const FILE_EXTENSION_TO_LANGUAGE_MAP = {
  js: `jsx`,
  md: `markup`,
  sh: `bash`,
  rb: `ruby`,
}

const getLanguage = file => {
  if (!file.includes(`.`)) {
    return `none`
  }
  const extension = file.split(`.`).pop()
  return FILE_EXTENSION_TO_LANGUAGE_MAP.hasOwnProperty(extension)
    ? FILE_EXTENSION_TO_LANGUAGE_MAP[extension]
    : extension.toLowerCase()
}

module.exports = async ({ markdownAST, markdownNode }, options) => {
  const classPrefix = `language-`
  return await visit(markdownAST, `html`, async node => {
    const { value } = node

    const find = get(options, 'arrVars', []).find(item => {
      return item.version === markdownNode.fields.version
    })
    let vars = get(find, 'vars', {})
    if (value && value.match(KEY)) {
      const url = transformer(
        value.replace('<!--CODE:', '').replace('-->', ''),
        vars || {}
      )
      try {
        const filename = url.split('/').slice(-1)[0]
        const code = await request(url)
        const language = getLanguage(filename)
        const className = language
          .split(` `)
          .map(token => `${classPrefix}${token}`)
          .join(` `)
        node.value = `<div class="gatsby-highlight">
        <pre class="${className}"><code>${highlightCode(
          language,
          code
        ).trim()}</code></pre>
        </div>`
        node.type = `html`
      } catch (e) {
        throw Error(
          `Error embed ${url} / ${markdownNode.fields.version} / ${markdownNode.fields.slug}`
        )
      }
    }
    return markdownAST
  })
}
