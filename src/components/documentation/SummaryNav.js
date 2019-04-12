import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'gatsby'

const SummaryNav = ({ tree, depth }) => {
  return (
    <ul className={`level${depth}`}>
      {tree.map(item => (
        <li key={item.id}>
          <Link key={`${item.id}`} to={item.path} className={`level${depth}`}>
            <div className='title' key={`linktitle${item.id}`}>
              {item.title}
            </div>
            <div className='description'>{item.description}</div>
          </Link>
          {item.children.length > 0 && (
            <SummaryNav tree={item.children} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  )
}

SummaryNav.defaultProps = {
  depth: 0,
}

SummaryNav.propTypes = {
  tree: PropTypes.arrayOf(PropTypes.object).isRequired,
  depth: PropTypes.number,
}

export default SummaryNav
