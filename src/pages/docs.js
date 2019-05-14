import React from 'react'
import get from 'lodash.get'
import { Link, graphql } from 'gatsby'

import versions from './../../content/versions.json'
import { Layout } from '../components/common/layout'
import { Seo } from '../components/common/seo'
import { VersionSelect, getVersions } from '../components/documentation'

class DocsPage extends React.Component {
  render() {
    const edges = this.props.data.pages
    const optionVersions = getVersions(versions)

    const pages = [
      [
        {
          id: 'installation',
          title: get(edges, 'edges[0].node.frontmatter.title'),
          description: get(edges, 'edges[0].node.frontmatter.description'),
          path: get(edges, 'edges[0].node.fields.path'),
        },
        {
          id: 'concepts',
          title: get(edges, 'edges[1].node.frontmatter.title'),
          description: get(edges, 'edges[1].node.frontmatter.description'),
          path: get(edges, 'edges[1].node.fields.path'),
        },
        {},
      ],
      [
        {
          id: 'developer-guides',
          title: get(edges, 'edges[2].node.frontmatter.title'),
          description: get(edges, 'edges[2].node.frontmatter.description'),
          path: get(edges, 'edges[2].node.fields.path'),
        },
        {
          id: 'batch-guides',
          title: get(edges, 'edges[3].node.frontmatter.title'),
          description: get(edges, 'edges[3].node.frontmatter.description'),
          path: get(edges, 'edges[3].node.fields.path'),
        },
        {
          id: 'featured-guides',
          title: get(edges, 'edges[4].node.frontmatter.title'),
          description: get(edges, 'edges[4].node.frontmatter.description'),
          path: get(edges, 'edges[4].node.fields.path'),
        },
      ],
      [
        {
          id: 'recipes',
          title: get(edges, 'edges[5].node.frontmatter.title'),
          description: get(edges, 'edges[5].node.frontmatter.description'),
          path: get(edges, 'edges[5].node.fields.path'),
        },
        {
          id: 'polyglot',
          title: get(edges, 'edges[6].node.frontmatter.title'),
          description: get(edges, 'edges[6].node.frontmatter.description'),
          path: get(edges, 'edges[6].node.fields.path'),
        },
        {},
      ],
      [
        {
          id: 'resources',
          title: get(edges, 'edges[7].node.frontmatter.title'),
          description: get(edges, 'edges[7].node.frontmatter.description'),
          path: get(edges, 'edges[7].node.fields.path'),
        },
        {},
        {},
      ],
    ]
    return (
      <Layout className='page-doc'>
        <Seo title='Spring Cloud Data Flow - Documentation' />
        <div className='container'>
          <div className='layout-col'>
            <div className='left'>
              <div className='page-title'>
                <h1>Documentation</h1>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <VersionSelect versions={optionVersions} version={'master'} />
              </div>
            </div>
            <div className='links'>
              {pages.map((block, index) => (
                <div className='col' key={`i1${index}`}>
                  {block.map((page, index2) => {
                    return get(page, 'id') ? (
                      <Link
                        key={`i6${page.id}`}
                        to={page.path}
                        className='item'
                      >
                        <article key={`i3${index2}`}>
                          <h2 key={`i4${index2}`} className='title'>
                            {page.title}
                          </h2>
                          <div key={`i5${index2}`} className='description'>
                            {page.description}
                          </div>
                          <span key={`i7${page.id}`} className='read-me'>
                            Read more
                          </span>
                        </article>
                      </Link>
                    ) : (
                      <div className='item' key={`i8${index2}`} />
                    )
                  })}
                </div>
              ))}
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

export default DocsPage
