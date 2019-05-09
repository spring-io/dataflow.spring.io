import React from 'react'

import { Layout } from '../components/common/layout'
import { Seo } from '../components/common/seo'

const DownloadPage = () => (
  <Layout className='page-download'>
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
            <h1>Download</h1>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco.
            </p>

            <ul className='installation-links'>
              <li>
                <a
                  href='/documentation/master/installation/kubernetes/'
                  className='kubernetes'
                >
                  Installation
                  <strong>Kubernetes</strong>
                </a>
              </li>
              <li>
                <a
                  href='/documentation/master/installation/cloudfoundry/'
                  className='cloudfoundry'
                >
                  Installation
                  <strong>Cloud Foundry</strong>
                </a>
              </li>
              <li>
                <a
                  href='/documentation/master/installation/local/'
                  className='local'
                >
                  Installation
                  <strong>Local machine</strong>
                </a>
              </li>
            </ul>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco:
            </p>
            <ul className='links'>
              <li>
                <a href='/'>Spring Cloud Data Flow for HashiCorp Nomad</a>
              </li>
              <li>
                <a href='/'>Spring Cloud Data Flow for Red Hat OpenShift</a>
              </li>
              <li>
                <a href='/'>Spring Cloud Data Flow for Apache Mesos</a>
              </li>
            </ul>

            <h2>Download Spring Cloud Data Flow</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod:
            </p>
            <table>
              <tbody>
                <tr>
                  <td>Kubernetes Server 2.0.1</td>
                  <td>
                    <a href='/'>Download</a>
                  </td>
                  <td>
                    <a href='/'>Documentation</a>
                  </td>
                </tr>
                <tr>
                  <td>Cloud Foundry Server 2.0.1</td>
                  <td>
                    <a href='/'>Download</a>
                  </td>
                  <td>
                    <a href='/'>Documentation</a>
                  </td>
                </tr>
                <tr>
                  <td>Local Server 2.0.1</td>
                  <td>
                    <a href='/'>Download</a>
                  </td>
                  <td>
                    <a href='/'>Documentation</a>
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              Lorem ipsum dolor sit amet, <a href='/'>view all the releases</a>.
            </p>

            <h2>More resources</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod:
            </p>
            <ul className='links'>
              <li>
                <a href='/'>Lorem ipsum dolor sit amet</a>
              </li>
              <li>
                <a href='/'>Consectetur adipiscing elit sed do eiusmod</a>
              </li>
              <li>
                <a href='/'>Excepteur sint occaecat cupidatat non proident</a>
              </li>
              <li>
                <a href='/'>Duis aute irure dolor in reprehenderit </a>
              </li>
              <li>
                <a href='/'>Nemo enim ipsam voluptatem quia voluptas</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </Layout>
)

export default DownloadPage
