import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'gatsby'

const SummaryTile = ({ tree, depth }) => {
  return (
    <ul className={`level${depth}`}>
      {tree.map(item => (
        <li key={item.id} className={`level${depth}`}>
          <Link key={`${item.id}`} to={item.path} className={`level${depth}`}>
            <div className='title' key={`linktitle${item.id}`}>
              {item.title}
            </div>
            {depth > 0 && <div className='description'>{item.description}</div>}
          </Link>
          {item.children.length > 0 ? (
            <SummaryTile tree={item.children} depth={depth + 1} />
          ) : (
            <>
              {depth === 0 && (
                <ul className={`level${depth + 1}`}>
                  <li className={`level${depth + 1}`}>
                    <Link
                      key={`${item.id}`}
                      to={item.path}
                      className={`level${depth + 1}`}
                    >
                      <div className='title' key={`linktitle${item.id}`}>
                        {item.title}
                      </div>
                      <div className='description'>{item.description}</div>
                    </Link>
                  </li>
                </ul>
              )}
            </>
          )}
        </li>
      ))}
    </ul>
  )
}

SummaryTile.defaultProps = {
  depth: 0,
}

SummaryTile.propTypes = {
  tree: PropTypes.arrayOf(PropTypes.object).isRequired,
  depth: PropTypes.number,
}

export default SummaryTile
