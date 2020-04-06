import Img from 'gatsby-image'
import PropTypes from 'prop-types'
import React from 'react'
import get from 'lodash.get'
import { Link } from 'gatsby'

import { parseDate } from './index'

const Item = ({ item }) => {
  return (
    <article key={`article-${get(item, 'node.id')}`}>
      <Img
        fluid={get(item, 'node.frontmatter.image.childImageSharp.fluid')}
        alt=''
      />
      <div className='item-content'>
        <h1 key={`h1-${get(item, 'node.id')}`}>
          {get(item, 'node.frontmatter.title')}
        </h1>
        <p className='date'>{parseDate(get(item, 'node.frontmatter.date'))}</p>
        <p className='desc' key={`desc-${get(item, 'node.id')}`}>
          {get(item, 'node.frontmatter.description')}
        </p>
        <p className='link' key={`link-${get(item, 'node.id')}`}>
          Read more
        </p>
      </div>
    </article>
  )
}

const List = ({ items }) => {
  return items.map(item =>
    get(item, 'node.frontmatter.external') ? (
      <a
        className='item'
        key={`item-${get(item, 'node.id')}`}
        target='_blank'
        rel='noopener noreferrer'
        href={get(item, 'node.frontmatter.path')}
      >
        <div>
          <Item item={item} />
        </div>
      </a>
    ) : (
      <Link
        className='item'
        key={`item-${get(item, 'node.id')}`}
        to={`/news${get(item, 'node.frontmatter.path')}`}
      >
        <div>
          <Item item={item} />
        </div>
      </Link>
    )
  )
}

List.defaultProps = {
  items: [],
}

List.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default List
