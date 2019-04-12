import React from 'react'

import { Layout } from '../components/common/layout'
import { Seo } from '../components/common/seo'

const IndexPage = () => (
  <Layout>
    <Seo title='Spring Cloud Data Flow' />
    <div className='container'>
      <h1>Homepage</h1>
    </div>
  </Layout>
)

export default IndexPage
