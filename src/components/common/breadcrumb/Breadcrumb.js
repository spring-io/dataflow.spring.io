import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'gatsby'

import { IconChevronRight } from './../icons'

const Breadcrumb = ({ pages }) => {
  return (
    <>
      {pages.length > 1 && (
        <div>
          {pages.map((page, index) => (
            <span key={`${index}index`}>
              {pages.length === index + 1 ? (
                <span key={`s${page.path}${index}`}>{page.title}</span>
              ) : (
                <span key={`s2${page.path}${index}`}>
                  <Link to={page.path} key={`a${page.path}${index}`}>
                    {page.title}{' '}
                  </Link>
                  <span className='separator'>
                    <IconChevronRight />
                  </span>
                </span>
              )}
            </span>
          ))}
        </div>
      )}
    </>
  )
}

Breadcrumb.propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ),
}

export default Breadcrumb
