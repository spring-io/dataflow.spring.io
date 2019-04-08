const path = require(`path`)

module.exports.createDocumentationPages = async ({ graphql, actions }) => {
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
