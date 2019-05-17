import '../styles/app.scss'

import React from 'react'
import { Link } from 'gatsby'

import Footer from '../components/common/layout/Footer'
import Logo from '../components/common/layout/Logo'
import { Image } from '../components/404'
import { Seo } from '../components/common/seo'

const NotFoundPage = () => (
  <div className='page-404'>
    <Seo title='404' />

    <div className='container'>
      <main>
        <div className='logo-dataflow'>
          <Link to='/'>
            <Logo />
            Spring Cloud <strong>Data Flow</strong>
          </Link>
        </div>

        <Image />
        <h1>Page not found...</h1>
        <p>You just land nowhere... the sadness.</p>

        <ul>
          <li>
            <Link to='/'>Homepage</Link>
          </li>
          <li>
            <Link to='/features/'>Features</Link>
          </li>
          <li>
            <Link to='/docs/'>Documentation</Link>
          </li>
          <li>
            <Link to='/getting-started/'>Getting Started</Link>
          </li>
          <li>
            <Link to='/community/'>Community</Link>
          </li>
        </ul>
      </main>
      <Footer />
    </div>
  </div>
)

export default NotFoundPage
