import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'
import { Link } from 'gatsby'

const isDisplay = (item, page, depth, depthMax) => {
  if (!item.children.length > 0 || !(depth < depthMax)) {
    return false
  }
  if (item.category === page.fields.category) {
    if (depth > 0) {
      return page.fields.path.startsWith(item.path)
    }
    return true
  }
  return false
}

class SidebarNav extends React.Component {
  render() {
    const { depth, page, depthMax, tree } = this.props
    return (
      <ul className={classNames(`level${depth}`)}>
        {tree.map((item, index) => (
          <li className={`level${depth}`} key={item.id}>
            <Link
              className={classNames(
                `level${depth}`,
                index + 1 === tree.length ? 'last' : ''
              )}
              activeClassName='active'
              key={`link${item.id}`}
              to={item.path}
            >
              {item.title}
            </Link>
            {isDisplay(item, page, depth, depthMax) && (
              <SidebarNav
                key={`child${item.id}`}
                tree={item.children}
                depth={depth + 1}
                page={page}
              />
            )}
          </li>
        ))}
      </ul>
    )
  }
}

SidebarNav.defaultProps = {
  depth: 0,
  depthMax: 2,
}

SidebarNav.propTypes = {
  tree: PropTypes.arrayOf(PropTypes.object).isRequired,
  page: PropTypes.shape({
    fields: PropTypes.shape({
      category: PropTypes.string,
    }),
  }),
  depth: PropTypes.number,
  depthMax: PropTypes.number,
}

export default SidebarNav
