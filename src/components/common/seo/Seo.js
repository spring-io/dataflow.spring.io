import Helmet from 'react-helmet'
import PropTypes from 'prop-types'
import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'

import ImageSeo from './ImageSeo'

const Seo = ({ title, description, keywords }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            siteUrl
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
    title: `${title ? title + ' | ' : ''} ${siteMetadata.title} `,
    description: description ? description : siteMetadata.description,
    keywords: keywords ? keywords : siteMetadata.keywords,
  }
  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <html lang='en' className='f-dataflow' />
        <meta name='description' content={meta.description} />
        <link rel='canonical' href={meta.siteUrl} />
        <meta property='og:site_name' content={meta.title} />
        <meta name='og:type' content='article' />
        <meta name='og:title' content={meta.title} />
        <meta name='og:description' content={meta.description} />
        <meta property='og:url' content={meta.siteUrl} />
        {meta.keywords && meta.keywords.length
          ? meta.keywords.map((keyword, i) => (
              <meta property='article:tag' content={keyword} key={i} />
            ))
          : null}
        <meta name='twitter:title' content={meta.title} />
        <meta name='twitter:description' content={meta.description} />
        <meta name='twitter:url' content={meta.siteUrl} />
        <meta name='twitter:site' content='@springcentral' />
        <meta name='twitter:creator' content='@springcentral' />
      </Helmet>
      <ImageSeo image={meta.image} />
    </>
  )
}

Seo.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
}

export default Seo
