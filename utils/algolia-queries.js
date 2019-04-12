const { fragmentTransformer } = require(`./algolia-transforms`)

const queryDocumentation = `{
	pages: allMarkdownRemark(
      filter: { fields: { hash: { eq: "documentation" } } }
	) {
	  edges {
	    node {
	      objectID:id
				html
				fields {
					category
				}
        frontmatter {
          title
          path
					description
					summary
        }
	    }
	  }
	}
}`

const documentationNode = ({ node }) => {
  node.title = node.frontmatter.title
  node.url = node.frontmatter.path
  node.description = node.frontmatter.description
  node.section = 'documentation'
  node.category = node.fields.category
  node.summary = node.frontmatter.summary ? true : false
  delete node.frontmatter
  delete node.fields
  return node
}

const queries = [
  {
    query: queryDocumentation,
    transformer: ({ data }) => {
      const nodes = data.pages.edges.map(documentationNode)

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
            category: node.category,
            fullTitle: node.title,
            html: `<p>${node.description ? node.description : ''}</p>`,
          })
        })

      return records
    },
    indexName: `Doc`,
    settings: { attributesToSnippet: [`excerpt:20`] },
  },
]

module.exports = queries
