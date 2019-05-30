import React from 'react'
import { Link } from 'gatsby'

import { IconGithub } from '../components/common/icons'
import { Image } from '../components/home'
import { Layout } from '../components/common/layout'
import { Seo } from '../components/common/seo'

const IndexPage = () => (
  <Layout className='home-page'>
    <Seo />

    <div className='band'>
      <div className='container'>
        <div className='band-content'>
          <div className='image'>
            <Image />
          </div>
          <div className='text'>
            <p className='description'>
              Microservice based <strong>Streaming</strong> and{' '}
              <strong>Batch</strong> data processing for{' '}
              <a
                href='https://www.cloudfoundry.org/'
                target='_blank'
                rel='noopener noreferrer'
              >
                Cloud Foundry
              </a>{' '}
              and{' '}
              <a
                href='https://kubernetes.io/'
                target='_blank'
                rel='noopener noreferrer'
              >
                Kubernetes
              </a>
            </p>
            <ul className='links'>
              <li>
                <strong>Develop and test microservices</strong> for data
                integration that do one thing and do it well
              </li>
              <li>
                Use <strong>prebuilt microservices</strong> to kick start
                development
              </li>
              <li>
                <strong>Compose complex topologies</strong> for streaming and
                batch data pipelines
              </li>
              <li>
                <strong>Open Source</strong>, Apache Licensed
              </li>
            </ul>
            <p>
              <Link className='button' to='/getting-started/'>
                Getting Started
              </Link>{' '}
              <a
                className='button light icon'
                href='https://github.com/spring-cloud/spring-cloud-dataflow'
                target='_blank'
                rel='noreferrer noopener'
              >
                <IconGithub />
                View on Github
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className='container'>
      <div className='layout-basic'>
        <div className='colset'>
          <div className='col col-1'>
            <a href='/docs/concepts/'>
              <h2>Flexible</h2>
              <p>
                Write Stream and Batch processing logic in multiple programming
                languages. <br />
                Use your favorite messaging middleware for Stream processing.
                <br />
                Interact with popular monitoring systems and dashboards.
              </p>
              <p>
                <span>Read more</span>
              </p>
            </a>
          </div>
          <div className='col col-2'>
            <a href='/docs/concepts/tooling/'>
              <h2>Familiar Tools</h2>
              <p>
                Kick-start the solution for your use-case using our drag and
                drop designer. <br />
                Don’t like designers? Use pipes and filters based textual Domain
                Specific Language instead. <br />
                Integrate using RESTful APIs.
              </p>
              <p>
                <span>Read more</span>
              </p>
            </a>
          </div>
          <div className='col col-3'>
            <a href='/getting-started'>
              <h2>Spring Opinionated</h2>
              <p>
                Are you already building microservices with Spring Boot?
                <br />
                Jump to the developer guide and extend the same learnings to
                build streaming and batch applications.
              </p>
              <p>
                <span>Read more</span>
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  </Layout>
)

export default IndexPage
