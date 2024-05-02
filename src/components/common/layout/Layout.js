import '../../../styles/app.scss'

import PropTypes from 'prop-types'
import React from 'react'

import Footer from './Footer'
import Header from './Header'

const Layout = ({ children, version, className }) => (
  <>
    <div className={className}>
      <div className='springone-banner'>
        <div>
          SpringOne registration is open—
          <a href='https://springone.io' target='_blank'>
            Early bird pricing
          </a>{' '}
          ends June 11
        </div>
      </div>
      <Header version={version} />
      <main>{children}</main>
      <Footer />
    </div>
  </>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  version: PropTypes.string,
}

export default Layout
