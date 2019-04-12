import PropTypes from 'prop-types'
import React from 'react'
import tocbot from 'tocbot'

/**
 * Author: https://github.com/TryGhost/docs/blob/master/src/components/common/TOC.js
 */
class Toc extends React.Component {
  componentDidMount() {
    tocbot.init({
      tocSelector: `.toc-list-container`,
      contentSelector: `.post-content`,
      headingSelector: `h2, h3`,
      headingsOffset: parseInt(this.props.headingsOffset),
    })
  }

  render() {
    return <div className={`toc-list-container`} />
  }
}

Toc.defaultProps = {
  headingsOffset: `1`,
  showHeading: false,
}

Toc.propTypes = {
  headingsOffset: PropTypes.string,
  className: PropTypes.string,
  listClasses: PropTypes.string,
  showHeading: PropTypes.bool,
}

export default Toc
