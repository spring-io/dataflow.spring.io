import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'
import { navigate } from 'gatsby'

import { IconChevronDown } from './../common/icons'

class VersionSelect extends React.Component {
  state = {
    menu: false,
  }

  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside = event => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ menu: false })
    }
  }

  setWrapperRef = node => {
    this.wrapperRef = node
  }

  render() {
    const currentVersion = this.props.versions.find(
      version => version.key === this.props.version
    )
    return (
      <>
        <div
          className={classNames('dropdown', this.state.menu ? 'active' : '')}
          ref={this.setWrapperRef}
        >
          <div
            className='dropdown-toggle'
            onClick={e => {
              this.setState({ menu: true })
              e.preventDefault()
            }}
          >
            Version: <strong>{currentVersion.title}</strong>
            <IconChevronDown />
          </div>
          <div className='dropdown-menu'>
            {this.props.versions.map(version => (
              <div
                className={classNames(
                  'item',
                  this.props.version === version.key ? 'selected' : ''
                )}
                onClick={() => {
                  if (this.props.version !== version.key) {
                    navigate(version.path)
                  }
                }}
                key={`a${version.key}`}
              >
                {version.title}
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }
}

VersionSelect.propTypes = {
  version: PropTypes.string.isRequired,
  versions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default VersionSelect
