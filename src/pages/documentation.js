import React from 'react'
import get from 'lodash.get'
import { Link, graphql } from 'gatsby'

import { IconSearch } from '../components/common/icons'
import { Layout } from '../components/common/layout'
import { Seo } from '../components/common/seo'

class DocumentationPage extends React.Component {
  render() {
    const edges = this.props.data.pages

    console.log(edges)
    const pages = [
      {
        id: 'get-started',
        icon: <IconSearch width='14px' />,
        title: get(edges, 'edges[0].node.frontmatter.title'),
        description: get(edges, 'edges[0].node.frontmatter.description'),
        path: get(edges, 'edges[0].node.fields.path'),
      },
      {
        id: 'concepts',
        icon: <IconSearch width='14px' />,
        title: get(edges, 'edges[1].node.frontmatter.title'),
        description: get(edges, 'edges[1].node.frontmatter.description'),
        path: get(edges, 'edges[1].node.fields.path'),
      },
      {
        id: 'developer-guides',
        icon: <IconSearch width='14px' />,
        title: get(edges, 'edges[2].node.frontmatter.title'),
        description: get(edges, 'edges[2].node.frontmatter.description'),
        path: get(edges, 'edges[2].node.fields.path'),
      },
      {
        id: 'featured-guides',
        icon: <IconSearch width='14px' />,
        title: get(edges, 'edges[3].node.frontmatter.title'),
        description: get(edges, 'edges[3].node.frontmatter.description'),
        path: get(edges, 'edges[3].node.fields.path'),
      },
      {
        id: 'recipes',
        icon: <IconSearch width='14px' />,
        title: get(edges, 'edges[4].node.frontmatter.title'),
        description: get(edges, 'edges[4].node.frontmatter.description'),
        path: get(edges, 'edges[4].node.fields.path'),
      },
      {
        id: 'resources',
        icon: <IconSearch width='14px' />,
        title: get(edges, 'edges[5].node.frontmatter.title'),
        description: get(edges, 'edges[5].node.frontmatter.description'),
        path: get(edges, 'edges[5].node.fields.path'),
      },
    ]
    return (
      <Layout>
        <Seo title='Spring Cloud Data Flow Documentation' />
        <div className='container'>
          <div className='layout-basic'>
            <ul className='summary documentation'>
              {pages.map(page => (
                <li key={`li${page.id}`}>
                  <Link to={page.path}>
                    <div key={`d1${page.id}`} className='icon'>
                      {page.icon}
                    </div>
                    <div key={`d2${page.id}`} className='title'>
                      {page.title}
                    </div>
                    <div key={`d3${page.id}`} className='description'>
                      {page.description}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    )
  }
}

export const articleQuery = graphql`
  query {
    pages: allMarkdownRemark(
      filter: {
        fields: {
          hash: { eq: "documentation" }
          root: { eq: true }
          version: { eq: "master" }
        }
      }
      sort: { fields: fields___slug, order: ASC }
    ) {
      edges {
        node {
          id
          fields {
            path
            version
          }
          frontmatter {
            title
            description
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
