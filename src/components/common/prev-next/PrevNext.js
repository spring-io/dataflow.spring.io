import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'gatsby'

import { IconChevronLeft, IconChevronRight } from './../icons'

const PrevNext = ({ prev, next }) => (
  <div className='prev-next'>
    <div className='prev'>
      {prev && (
        <Link to={prev.path}>
          <IconChevronLeft />
          <div className='parent'>{prev.parent}</div>
          <div className='title'>{prev.title}</div>
        </Link>
      )}
    </div>
    <div className='next'>
      {next && (
        <Link to={next.path}>
          <IconChevronRight />
          <div className='parent'>{next.parent}</div>
          <div className='title'>{next.title}</div>
        </Link>
      )}
    </div>
  </div>
)

PrevNext.propTypes = {
  prev: PropTypes.shape({
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    parent: PropTypes.string,
    description: PropTypes.string,
  }),
  next: PropTypes.shape({
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    parent: PropTypes.string,
    description: PropTypes.string,
  }),
}

export default PrevNext
