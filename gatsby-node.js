const path = require("path")
const get = require("lodash.get")
const startsWith = require("lodash.startswith")
const { createFilePath } = require("gatsby-source-filesystem")

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
                frontmatter {
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
            path: node.frontmatter.path,
            component: DocumentationTemplate,
            context: {
              slug: node.frontmatter.path,
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
  if (get(node, "internal.type") === `MarkdownRemark`) {
    const path = get(node, "frontmatter.path", "default")
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    if (path !== "/documentation/" && startsWith(path, "/documentation/")) {
      const parentPath =
        path
          .split("/")
          .slice(0, 3)
          .join("/") + "/"
      createNodeField({
        node,
        name: `hash`,
        value: `documentation`,
      })
      createNodeField({
        node,
        name: `parent`,
        value: parentPath,
      })
      createNodeField({
        node,
        name: `slug`,
        value: slug,
      })
    }
  }
}
