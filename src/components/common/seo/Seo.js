import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

import ImageSeo from "./ImageSeo"

const Seo = ({ title, description, keywords }) => {
  const canonical = ""

  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            canonical
            twitter
            image
            keywords
          }
        }
      }
    `
  )
  const siteMetadata = site.siteMetadata
  const meta = {
    ...siteMetadata,
    title: title ? title : siteMetadata.title,
    description: description ? description : siteMetadata.description,
    keywords: keywords ? keywords : siteMetadata.keywords,
  }
  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={meta.canonical} />
        <meta property="og:site_name" content={meta.title} />
        <meta name="og:type" content="article" />
        <meta name="og:title" content={meta.title} />
        <meta name="og:description" content={meta.description} />
        <meta property="og:url" content={meta.canonical} />
        {meta.keywords && meta.keywords.length
          ? meta.keywords.map((keyword, i) => (
              <meta property="article:tag" content={keyword} key={i} />
            ))
          : null}
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:url" content={meta.canonical} />
        <meta name="twitter:site" content="@springcentral" />
        <meta name="twitter:creator" content="@springcentral" />
      </Helmet>
      <ImageSeo image={meta.image} />
    </>
  )
}

Seo.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
}

export default Seo
