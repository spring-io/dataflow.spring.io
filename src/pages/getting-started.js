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
              In order to use Spring Cloud Data Flow, you will need to choose
              what platform you want to run it on and install the server
              component on that platform. Data Flow supports three platforms out
              of the box: Local, CloudFoundry, and Kubernetes. If you are new to
              Data Flow, we recommend trying out Local for simplicity to get
              comfortable with the concepts. Once you are ready to try it out on
              a platform, the guides for CloudFoundry and Kubernetes are here
              for you as well.
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
              Once you have the Data Flow server installed on the platform you
              are using, you will want to get started in writing and deploying
              the microservices that Data Flow orchestrates. Below we have
              guides on how to get started with both stream processing (message
              based microservices) and batch processing (microservices for
              finite workloads).
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
