const { fragmentTransformer } = require('./algolia-transforms')
const get = require('lodash.get')
const versions = require('./../content/versions.json')

const queryDocumentation = `{
	pages: allMarkdownRemark(
      filter: { 
				fields: { 
					hash: { eq: "documentation" } 
          exclude: { ne: true }
					version: { ne: "next" }
				} 
				frontmatter: { 
					exclude: { eq: null } 
				}
			}
	) {
	  edges {
	    node {
	      objectID:id
				html
				fields {
					category
					version
					path
					slug
				}
        frontmatter {
          title
					description
					summary
        }
	    }
	  }
	}
}`

const documentationNode = ({ node }) => {
  node.title = get(node, 'frontmatter.title')
  node.url = get(node, 'fields.path')
  node.path = get(node, 'fields.path')
  node.slug = get(node, 'fields.slug')
  node.version = get(node, 'fields.version')
  node.description = get(node, 'frontmatter.description')
  node.section = 'documentation'
  node.category = get(node, 'fields.category')
  node.summary = get(node, 'frontmatter.summary', false)
  delete node.frontmatter
  delete node.fields
  return node
}

const queries = Object.entries(versions)
  .filter(([, version]) => version !== 'next')
  .map(([, version]) => {
    return {
      query: queryDocumentation,
      transformer: ({ data }) => {
        const nodes = data.pages.edges
          .map(documentationNode)
          .filter(node => node.version === version)

        const records = nodes
          .filter(node => !node.summary)
          .reduce(fragmentTransformer, [])

        nodes
          .filter(node => node.summary)
          .forEach(node => {
            records.push({
              objectID: node.objectID,
              title: node.title,
              url: node.url,
              slug: node.slug,
              category: node.category,
              fullTitle: node.title,
              version: node.version,
              html: `<p>${node.description ? node.description : ''}</p>`,
            })
          })

        return records
      },
      indexName: `doc-${version}`,
      settings: { attributesToSnippet: [`excerpt:20`] },
    }
  })

module.exports = queries
