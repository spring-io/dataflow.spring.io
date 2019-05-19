import React from 'react'

import { Layout } from '../components/common/layout'
import { Seo } from '../components/common/seo'

const GettingStartedPage = () => (
  <Layout className='page-getting-started'>
    <Seo title='Getting Started' />
    <div className='container'>
      <div className='layout-sidebars layout-2-sidebars'>
        <div className='sidebar'>
          <div className='box'>
            <div className='box-title'>Learning</div>
            <ul>
              <li>
                <a href='/docs/concepts/architecture/'>
                  Data Flow Architecture
                </a>
              </li>
              <li>
                <a href='/docs/concepts/streams/'>Stream Concepts</a>
              </li>
              <li>
                <a href='/docs/concepts/batch-jobs/'>Batch Concepts</a>
              </li>
              {/* <li>
                <a href='/'>Pre-built Stream and Batch microservices.</a>
              </li> */}
            </ul>
          </div>
        </div>
        <div className='main'>
          <div className='main-content'>
            <h1>Getting started</h1>
            <p>
              In order to use <strong>Spring Cloud Data Flow</strong>, you will
              need to choose what platform you want to run it on and install the
              server components on that platform.
            </p>
            <p>
              <strong>Data Flow</strong> supports three platforms out of the
              box: <strong>Local</strong>, <strong>Cloud Foundry</strong>, and{' '}
              <strong>Kubernetes</strong>. If you are new to{' '}
              <strong>Data Flow</strong>, we recommend trying out Local for
              simplicity to get comfortable with the concepts. Once you are
              ready to try it out on a platform, the guides for{' '}
              <strong>Cloud Foundry</strong> and <strong>Kubernetes</strong> are
              here for you as well.
            </p>

            <ul className='block-links'>
              <li>
                <a href='/docs/installation/local/' className='local'>
                  Installation
                  <strong>Local machine</strong>
                </a>
              </li>
              <li>
                <a
                  href='/docs/installation/cloudfoundry/'
                  className='cloudfoundry'
                >
                  Installation
                  <strong>Cloud Foundry</strong>
                </a>
              </li>
              <li>
                <a href='/docs/installation/kubernetes/' className='kubernetes'>
                  Installation
                  <strong>Kubernetes</strong>
                </a>
              </li>
            </ul>
            <h2>Developer Guides</h2>
            <p>
              After installing <strong>Data Flow</strong> you will want to get
              started deploying prebuilt microservices that Data Flow
              orchestrates. Below are the guides on how to get started with both
              Stream and Batch processing.
            </p>
            <ul className='block-links'>
              <li>
                <a
                  href='/docs/stream-developer-guides/getting-started/stream/'
                  className='stream-processing'
                >
                  <strong>Stream</strong>
                  Processing
                </a>
              </li>
              <li>
                <a
                  href='/docs/batch-developer-guides/getting-started/task/'
                  className='batch-processing'
                >
                  <strong>Batch</strong> Processing
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </Layout>
)

export default GettingStartedPage
