import React from 'react'
import { Link } from 'gatsby'

import { Image } from '../components/home'
import { Layout } from '../components/common/layout'
import { Seo } from '../components/common/seo'

const IndexPage = () => (
  <Layout className='home-page'>
    <Seo title='Spring Cloud Data Flow' />

    <div className='band'>
      <div className='container'>
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
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p>
            <Link className='button' to='/getting-started/'>
              Getting Started
            </Link>
          </p>
        </div>
        <div className='image'>
          <Image />
        </div>
      </div>
    </div>

    <div className='container'>
      <div className='layout-basic'>
        <div className='colset'>
          <div className='col col-1'>
            <article>
              <h2>Familiar Tools</h2>
              <p>
                Kick-start the solution for your use-case using our drag and
                drop designer. Don’t like designers? Use pipes and filters based
                textual Domain Specific Language instead. Integrate using a
                RESTful API.
              </p>
              <p>
                <a className='button' href='#'>
                  Learn more
                </a>
              </p>
            </article>
          </div>
          <div className='col col-2'>
            <article>
              <h2>Flexible</h2>
              <p>
                Write Stream and Batch processing logic in multiple programming
                languages. Use your favorite messaging middleware for Stream
                processing. Interact with popular monitoring systems and
                dashboards.
              </p>
              <p>
                <a className='button' href='#'>
                  Learn more
                </a>
              </p>
            </article>
          </div>
          <div className='col col-3'>
            <article>
              <h2>Spring Opinionated</h2>
              <p>
                Are you already building microservices with Spring Boot? Jump to
                the developer guide and extend the same learnings to build
                streaming and batch applications.
              </p>
              <p>
                <a className='button' href='#'>
                  Learn more
                </a>
              </p>
            </article>
          </div>
        </div>
      </div>
    </div>
  </Layout>
)

export default IndexPage
