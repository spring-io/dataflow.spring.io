import Img from 'gatsby-image'
import React from 'react'
import { StaticQuery, graphql } from 'gatsby'

const Image = () => (
  <StaticQuery
    query={graphql`
      query {
        placeholderImage: file(relativePath: { eq: "screen-dataflow.png" }) {
          childImageSharp {
            fixed(width: 568, height: 469) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    `}
    render={data => <Img fixed={data.placeholderImage.childImageSharp.fixed} />}
  />
)
export default Image
