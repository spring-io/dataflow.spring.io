const path = require("path")
const createPages = require(`./gatsby/createPages`)
const onCreateNode = require(`./gatsby/onCreateNode`)

exports.createPages = ({ actions, graphql }) =>
  Promise.all([createPages.createDocumentationPages({ graphql, actions })])

exports.onCreateNode = async ({ node, getNode, actions }) =>
  await onCreateNode.createMarkdownNodeFields({ node, getNode, actions })
