const fs = require(`fs`)
const path = require(`path`)
const normalizePath = require(`normalize-path`)
const visit = require(`unist-util-visit`)

const highlightCode = require(`gatsby-remark-prismjs/highlight-code`)

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

module.exports = (
  { markdownAST, markdownNode },
  { classPrefix = `language-` } = {}
) => {
  visit(markdownAST, `inlineCode`, node => {
    const { value } = node
    if (value.startsWith(`embed:`)) {
      const file = value.substr(6)
      let pathFile = normalizePath(
        `${path.dirname(markdownNode.fileAbsolutePath)}/${file}`
      )
      if (!fs.existsSync(pathFile)) {
        throw Error(`Invalid snippet specified; no such file "${pathFile}"`)
      }
      const code = fs.readFileSync(pathFile, `utf8`).trim()
      const language = getLanguage(file)
      const className = language
        .split(` `)
        .map(token => `${classPrefix}${token}`)
        .join(` `)
      try {
        node.value = `<div class="gatsby-highlight">
        <pre class="${className}"><code>${highlightCode(
          language,
          code
        ).trim()}</code></pre>
        </div>`
        node.type = `html`
      } catch (e) {
        // rethrow error pointing to a file
        throw Error(`${e.message}\nFile: ${file}`)
      }
    }
  })

  return markdownAST
}
