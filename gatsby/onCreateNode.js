const { createFilePath } = require(`gatsby-source-filesystem`)
const { startsWith, get } = require(`lodash`)

module.exports.createMarkdownNodeFields = async ({
  node,
  getNode,
  actions,
}) => {
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
