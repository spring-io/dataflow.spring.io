import React from "react"
import { Link, graphql } from "gatsby"
import get from "lodash.get"
import { Layout } from "../components/common/layout"
import { SummaryNav } from "../components/documentation"
import { Seo } from "../components/common/seo"

class DocumentationPage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const pages = this.props.data.pages.edges.map(({ node }) => {
      return {
        id: get(node, "id"),
        title: get(node, "frontmatter.title"),
        description: get(node, "frontmatter.description"),
        path: get(node, "frontmatter.path"),
        children: [],
      }
    })
    return (
      <Layout>
        <Seo title="Spring Cloud Data Flow Documentation" />
        <div className="container">
          <div className="layout-basic">
            <h1>Documentation</h1>
            <div className="summary md">
              <SummaryNav tree={pages} />
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export const articleQuery = graphql`
  query {
    pages: allMarkdownRemark(
      filter: { fields: { hash: { eq: "documentation" }, root: { eq: true } } }
      sort: { fields: fields___slug, order: ASC }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            description
            path
            meta_title
            meta_description
            keywords
          }
        }
      }
    }
  }
`

export default DocumentationPage
