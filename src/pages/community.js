import React from 'react'
import get from 'lodash.get'

import Contributors from '../../content/contributors.json'
import {
  IconGithub,
  IconGitter,
  IconSpring,
  IconStackOverflow,
  IconZenHub,
} from '../components/common/icons'
import { Layout } from '../components/common/layout'
import { Seo } from '../components/common/seo'
import { ZenhubImage } from '../components/community'

const contributors = () =>
  Contributors.sort((a, b) => {
    return get(a, 'lastname') > get(b, 'lastname') ? 1 : -1
  })

const CommunityPage = () => {
  return (
    <Layout className='page-community'>
      <Seo title='Spring Cloud Data Flow Community' />
      <div className='container'>
        <div className='layout-basic'>
          <div className='page-title'>
            <h1>Community</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p className='love'>
              We{' '}
              <span role='img' aria-label='love'>
                ❤️
              </span>{' '}
              Open Source
            </p>
          </div>

          <div className='page-colset'>
            <article>
              <h2>
                Spring Cloud <strong>Data Flow</strong>
              </h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p className='social'>
                <a
                  href='https://github.com/spring-cloud/spring-cloud-dataflow'
                  target='_blank'
                  rel='noreferrer noopener'
                >
                  <IconGithub />
                </a>
                <a
                  href='https://gitter.im/spring-cloud/spring-cloud-dataflow'
                  target='_blank'
                  rel='noreferrer noopener'
                >
                  <IconGitter />
                </a>
                <a
                  href='https://stackoverflow.com/questions/tagged/spring-cloud-dataflow'
                  target='_blank'
                  rel='noreferrer noopener'
                >
                  <IconStackOverflow />
                </a>
              </p>
            </article>
            <article>
              <h2>
                Spring Cloud <strong>Stream</strong>
              </h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p className='social'>
                <a
                  href='https://github.com/spring-cloud/spring-cloud-stream'
                  target='_blank'
                  rel='noreferrer noopener'
                >
                  <IconGithub />
                </a>
                <a
                  href='https://gitter.im/spring-cloud/spring-cloud-stream'
                  target='_blank'
                  rel='noreferrer noopener'
                >
                  <IconGitter />
                </a>
                <a
                  href='https://stackoverflow.com/questions/tagged/spring-cloud-stream'
                  target='_blank'
                  rel='noreferrer noopener'
                >
                  <IconStackOverflow />
                </a>
              </p>
            </article>
            <article>
              <h2>
                Spring Cloud <strong>Task</strong>
              </h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p className='social'>
                <a
                  href='https://github.com/spring-cloud/spring-cloud-task'
                  target='_blank'
                  rel='noreferrer noopener'
                >
                  <IconGithub />
                </a>
                <a
                  href='https://gitter.im/spring-cloud/spring-cloud-task'
                  target='_blank'
                  rel='noreferrer noopener'
                >
                  <IconGitter />
                </a>
                <a
                  href='https://stackoverflow.com/questions/tagged/spring-cloud-task'
                  target='_blank'
                  rel='noreferrer noopener'
                >
                  <IconStackOverflow />
                </a>
              </p>
            </article>
          </div>

          <div className='box'>
            <div className='zenhub'>
              <div className='zenhub-content'>
                <h2>
                  We use <strong>ZenHub</strong>
                </h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor.
                </p>
                <p>
                  <a href='#' className='button'>
                    View the projects
                  </a>
                </p>
                <div className='image'>
                  <IconZenHub />
                  <ZenhubImage alt='ZenHub' title='ZenHub' />
                </div>
              </div>
            </div>

            <div className='contributors'>
              <h2>
                Data Flow <strong>Team</strong>
              </h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

              <div className='contributors-list'>
                {contributors().map(contributor => (
                  <a
                    href={get(contributor, 'github')}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <img
                      title={`${get(contributor, 'firstname')} ${get(
                        contributor,
                        'lastname'
                      )}`}
                      alt={`${get(contributor, 'firstname')} ${get(
                        contributor,
                        'lastname'
                      )}`}
                      src={get(contributor, 'image')}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className='page-footer'>
            <IconSpring />

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
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CommunityPage
