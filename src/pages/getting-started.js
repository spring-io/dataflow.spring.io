import React from 'react'

import { Layout } from '../components/common/layout'
import { Seo } from '../components/common/seo'

const GettingStartedPage = () => (
  <Layout className='page-getting-started'>
    <Seo title='Spring Cloud Data Flow Download' />
    <div className='container'>
      <div className='layout-sidebars layout-2-sidebars'>
        <div className='sidebar'>
          <div className='box'>
            <div className='box-title'>Download App Starters 2.0.1</div>
            <ul>
              <li>
                <a href='http://bit.ly/Einstein-SR2-stream-applications-rabbit-maven'>
                  Stream Apps for <strong>Rabbit</strong>
                </a>
              </li>
              <li>
                <a href='http://bit.ly/Einstein-SR2-stream-applications-rabbit-docker'>
                  Stream Apps for <strong>Kafka</strong>
                </a>
              </li>
              <li>
                <a href='http://bit.ly/Einstein-SR2-stream-applications-kafka-maven'>
                  Task Apps for <strong>Rabbit</strong>
                </a>
              </li>
              <li>
                <a href='http://bit.ly/Einstein-SR2-stream-applications-kafka-docker'>
                  Task Apps for <strong>Kafka</strong>
                </a>
              </li>
            </ul>
          </div>
          <div className='box'>
            <div className='box-title'>View Github Projects</div>
            <ul>
              <li>
                <a href='https://github.com/spring-cloud/spring-cloud-dataflow'>
                  Spring Cloud <strong>Data Flow</strong>
                </a>
              </li>
              <li>
                <a href='https://github.com/spring-cloud/spring-cloud-dataflow-ui'>
                  Spring Cloud <strong>Data Flow UI</strong>
                </a>
              </li>
              <li>
                <a href='https://github.com/spring-cloud/spring-cloud-skipper'>
                  Spring Cloud <strong>Skipper</strong>
                </a>
              </li>
              <li>
                <a href='https://github.com/spring-cloud/spring-cloud-stream'>
                  Spring Cloud <strong>Stream</strong>
                </a>
              </li>
              <li>
                <a href='https://github.com/spring-cloud/spring-cloud-task'>
                  Spring Cloud <strong>Task</strong>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className='main'>
          <div className='main-content'>
            <h1>Getting started</h1>

            <p>
              The first step in getting started is to install Data Flow on your
              preferred platform.
            </p>

            <ul className='installation-links'>
              <li>
                <a
                  href='/documentation/master/installation/local/'
                  className='local'
                >
                  <strong>Local machine</strong>
                </a>
              </li>
              <li>
                <a
                  href='/documentation/master/installation/cloudfoundry/'
                  className='cloudfoundry'
                >
                  <strong>Cloud Foundry</strong>
                </a>
              </li>
              <li>
                <a
                  href='/documentation/master/installation/kubernetes/'
                  className='kubernetes'
                >
                  <strong>Kubernetes</strong>
                </a>
              </li>
            </ul>

            <p>
              Once installed, follow the links below to try out a simple example
              for Stream and Batch processing.
            </p>

            <ul className='links'>
              <li>
                <a href='/docs/stream-developer-guides/getting-started/stream'>
                  Getting started with Stream Processing
                </a>
              </li>
              <li>
                <a href='/docs/batch-developer-guides/getting-started/task/'>
                  Getting started with Batch Processing
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
