import React from 'react'
import { StaticQuery, graphql } from 'gatsby'

import { List } from './index'

const Latest = () => {
  return (
    <StaticQuery
      query={graphql`
        {
          allMarkdownRemark(
            filter: { fields: { hash: { eq: "news" } } }
            sort: { fields: fileAbsolutePath, order: DESC }
            limit: 4
          ) {
            edges {
              node {
                id
                frontmatter {
                  title
                  description
                  path
                  category
                  date
                  external
                  image {
                    childImageSharp {
                      fluid {
                        ...GatsbyImageSharpFluid
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `}
      render={data => {
        return <List items={data.allMarkdownRemark.edges} />
      }}
    />
  )
}

export default Latest
