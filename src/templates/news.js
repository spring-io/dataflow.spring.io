import PropTypes from 'prop-types'
import React from 'react'
import get from 'lodash.get'
import { graphql } from 'gatsby'

import { Layout, Seo } from '../components/common'
import { parseDate } from '../components/news'

class NewsTemplate extends React.Component {
  render() {
    const { page } = this.props.data
    return (
      <Layout>
        <Seo />
        <Seo title='News' />
        <div className='container'>
          <div className='layout-basic'>
            <article className='article-news single'>
              <h1 className='title'>{get(page, 'frontmatter.title')}</h1>
              <p className='date'>{parseDate(get(page, 'frontmatter.date'))}</p>
              <div className='post-content md'>
                <div dangerouslySetInnerHTML={{ __html: page.html }} />
              </div>
            </article>
          </div>
        </div>
      </Layout>
    )
  }
}

NewsTemplate.propTypes = {
  data: PropTypes.shape({
    page: PropTypes.object.isRequired,
  }).isRequired,
}

export const articleQuery = graphql`
  query($slug: String) {
    page: markdownRemark(frontmatter: { path: { eq: $slug } }) {
      html
      frontmatter {
        title
        date
        category
        path
      }
    }
  }
`

export default NewsTemplate
