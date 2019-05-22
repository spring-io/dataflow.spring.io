import '../../../styles/app.scss'

import Helmet from 'react-helmet'
import PropTypes from 'prop-types'
import React from 'react'

import Footer from './Footer'
import Header from './Header'

const Layout = ({ children, className }) => (
  <>
    <Helmet>
      <script
        src='https://consent.trustarc.com/notice?domain=pivotal.com&c=teconsent&js=nj&text=true&pcookie&gtm=1'
        async='async'
      />
    </Helmet>
    <div className={className}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  </>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
