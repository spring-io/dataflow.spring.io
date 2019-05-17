import React from 'react'
import { Link } from 'gatsby'

import Logo from './Logo'
import Navigation from './Navigations'

const Header = () => (
  <div className='header'>
    <div className='container'>
      <div className='logo-dataflow'>
        <Link to='/'>
          <Logo />
          Spring Cloud <strong>Data Flow</strong>
        </Link>
      </div>

      <Navigation />
    </div>
  </div>
)

export default Header
