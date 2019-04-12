import React from 'react'
import { Link } from 'gatsby'

import Logo from './Logo'

const Footer = () => (
  <footer className='footer'>
    <div className='container'>
      <div className='colset'>
        <div className='col col-copyright'>
          <div className='logo'>
            <Logo />
            <div>
              Spring Cloud <strong>Data Flow</strong>
              <br />
              <span>Powered by Pivotal</span>
            </div>
          </div>
          <div className='copyright-links'>
            <div className='copyright'>
              <p>
                © 2013-{new Date().getFullYear()} Pivotal Software, Inc. All
                Rights Reserved.
              </p>
              <p>Spring CLoud Data Flow is under the Apache 2.0 license.</p>
            </div>
            <ul>
              <li>
                <Link to='/'>Terms of service</Link>
              </li>
              <li>
                <Link to='/'>Privacy</Link>
              </li>
              <li>
                <Link to='/'>Cookie Preferences</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
