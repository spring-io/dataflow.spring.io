import React from "react"
import Helmet from "react-helmet"
import PropTypes from "prop-types"
import _ from "lodash"

const Seo = ({ siteMetadata, title, description, meta }) => {
  const canonical = ""

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:site_name" content={siteMetadata.title} />
        <meta name="og:type" content="article" />
        <meta name="og:title" content={meta.title} />
        <meta name="og:description" content={meta.description} />
        <meta property="og:url" content={canonical} />
        {meta.keywords && meta.keywords.length
          ? meta.keywords.map((keyword, i) => (
              <meta property="article:tag" content={keyword} key={i} />
            ))
          : null}
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:url" content={canonical} />
        <meta name="twitter:site" content="@springcentral" />
        <meta name="twitter:creator" content="@springcentral" />
      </Helmet>
    </>
  )
}

export default Seo
