import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'gatsby'

const isDisplay = ({ children }, depth, depthMax) => {
  return children.length > 0 && depth < depthMax
}

const SidebarNav = ({ tree, depth, depthMax }) => {
  return (
    <ul className={`level${depth}`}>
      {tree.map(item => (
        <li className={`level${depth}`} key={item.id}>
          <Link
            className={`level${depth}`}
            activeClassName='active'
            key={`link${item.id}`}
            to={item.path}
          >
            {item.title}
          </Link>
          {isDisplay(item, depth, depthMax) && (
            <SidebarNav
              key={`child${item.id}`}
              tree={item.children}
              depth={depth + 1}
            />
          )}
        </li>
      ))}
    </ul>
  )
}

SidebarNav.defaultProps = {
  depth: 0,
  depthMax: 1,
}

SidebarNav.propTypes = {
  tree: PropTypes.arrayOf(PropTypes.object).isRequired,
  depth: PropTypes.number,
  depthMax: PropTypes.number,
}

export default SidebarNav
