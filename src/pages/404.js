import React from 'react'

import { Layout } from '../components/common/layout'
import { Seo } from '../components/common/seo'

const NotFoundPage = () => (
  <Layout>
    <Seo title='404' />
    <div className='container'>
      <div class='layout-basic'>
        <h1>NOT FOUND</h1>
        <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
      </div>
    </div>
  </Layout>
)

export default NotFoundPage
