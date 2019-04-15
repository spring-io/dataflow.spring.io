const path = require('path')
const get = require('lodash.get')
const startsWith = require('lodash.startswith')
const { createFilePath } = require('gatsby-source-filesystem')

/**
 * Create Pages
 */
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  const queryPromises = []

  queryPromises.push(
    new Promise((resolve, reject) => {
      graphql(`
        {
          pages: allMarkdownRemark(
            filter: { fields: { hash: { eq: "documentation" } } }
            limit: 1000
          ) {
            edges {
              node {
                id
                fields {
                  path
                }
              }
            }
          }
        }
      `).then(result => {
        if (result.errors) {
          return reject(result.errors)
        }
        return result.data.pages.edges.forEach(({ node }) => {
          const DocumentationTemplate = path.resolve(
            `./src/templates/documentation.js`
          )
          createPage({
            path: node.fields.path,
            component: DocumentationTemplate,
            context: {
              slug: node.fields.path,
            },
          })
          return resolve()
        })
      })
    })
  )

  return Promise.all(queryPromises)
}

/**
 * Create Node
 */
exports.onCreateNode = async ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (get(node, 'internal.type') === `MarkdownRemark`) {
    const frontmatterPath = get(node, 'frontmatter.path')
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    const relativePath = path.relative(
      path.join(__dirname, 'content'),
      node.fileAbsolutePath
    )
    if (startsWith(relativePath, 'documentation/')) {
      const category = frontmatterPath
        .split('/')
        .slice(0, 1)
        .join('')
      const isRoot = frontmatterPath.split('/').length === 2
      const url = `/documentation/${frontmatterPath}`
      createNodeField({
        node,
        name: `hash`,
        value: `documentation`,
      })
      createNodeField({
        node,
        name: `category`,
        value: category,
      })
      createNodeField({
        node,
        name: `root`,
        value: isRoot,
      })
      createNodeField({
        node,
        name: `slug`,
        value: slug,
      })
      createNodeField({
        node,
        name: `path`,
        value: path.join(url, '/'),
      })
    }
  }
}
