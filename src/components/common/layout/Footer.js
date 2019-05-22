import React from 'react'

import Logo from './Logo'
import { IconGithub, IconGitter, IconStackOverflow } from '../icons'

const Footer = () => (
  <footer className='footer'>
    <div className='container'>
      <div className='colset'>
        <div className='col col-copyright'>
          <div className='logo'>
            <Logo />
            <span>
              Powered by{' '}
              <a
                target='_blank'
                rel='noreferrer noopener'
                href='https://pivotal.io/'
              >
                Pivotal
              </a>
            </span>
          </div>
          <div className='copyright-links'>
            <div className='social'>
              <a
                target='_blank'
                rel='noreferrer noopener'
                href='https://github.com/spring-cloud/spring-cloud-dataflow'
              >
                <IconGithub className='github' />
              </a>
              <a
                target='_blank'
                rel='noreferrer noopener'
                href='https://gitter.im/spring-cloud/spring-cloud-dataflow'
              >
                <IconGitter className='gitter' />
              </a>
              <a
                target='_blank'
                rel='noreferrer noopener'
                href='https://stackoverflow.com/questions/tagged/spring-cloud-dataflow'
              >
                <IconStackOverflow className='stackoverflow' />
              </a>
            </div>
            <div className='copyright'>
              <p>
                © 2013-{new Date().getFullYear()} Pivotal Software, Inc. All
                Rights Reserved.
              </p>
              <p>Spring Cloud Data Flow is under the Apache 2.0 license.</p>
            </div>
            <ul>
              <li>
                <a
                  target='_blank'
                  rel='noreferrer noopener'
                  href='https://pivotal.io/legal'
                >
                  Terms of service
                </a>
              </li>
              <li>
                <a
                  target='_blank'
                  rel='noreferrer noopener'
                  href='https://pivotal.io/privacy-policy'
                >
                  Privacy
                </a>
              </li>
              <li>
                <span id='teconsent' />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
