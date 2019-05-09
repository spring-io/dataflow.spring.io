import React from 'react'

import {
  IconGithub,
  IconGitter,
  IconSpring,
  IconStackOverflow,
} from '../components/common/icons'
import { Layout } from '../components/common/layout'
import { Seo } from '../components/common/seo'

const CommunityPage = () => (
  <Layout>
    <Seo title='Spring Cloud Data Flow Community' />
    <div className='container'>
      <div className='layout-basic community'>
        <div className='page-title'>
          <h1>Community</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>

        <div className='page-colset'>
          <article>
            <h2>Spring Cloud Data Flow</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p className='social'>
              <a>
                <IconGithub className='github' />
              </a>
              <a>
                <IconGitter className='gitter' />
              </a>
              <a>
                <IconStackOverflow className='stackoverflow' />
              </a>
            </p>
          </article>
          <article>
            <h2>Spring Cloud Stream</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p className='social'>
              <a>
                <IconGithub className='github' />
              </a>
              <a>
                <IconGitter className='gitter' />
              </a>
              <a>
                <IconStackOverflow className='stackoverflow' />
              </a>
            </p>
          </article>
          <article>
            <h2>Spring Cloud Task</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p className='social'>
              <a>
                <IconGithub className='github' />
              </a>
              <a>
                <IconGitter className='gitter' />
              </a>
              <a>
                <IconStackOverflow className='stackoverflow' />
              </a>
            </p>
          </article>
          <article>
            <h2>Spring Cloud Skipper</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p className='social'>
              <a>
                <IconGithub className='github' />
              </a>
              <a>
                <IconGitter className='gitter' />
              </a>
              <a>
                <IconStackOverflow className='stackoverflow' />
              </a>
            </p>
          </article>
        </div>

        <div className='page-footer'>
          <p className='love'>
            We{' '}
            <span role='img' aria-label='love'>
              ❤️
            </span>{' '}
            Open Source
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut{' '}
            <a
              href='https://spring.io'
              target='_blank'
              rel='noreferrer noopener'
            >
              labore et dolore magna aliqua
            </a>
            .
          </p>
          <IconSpring className='spring' />
        </div>
      </div>
    </div>
  </Layout>
)

export default CommunityPage
