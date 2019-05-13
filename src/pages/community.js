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
                Microservice based Streaming and Batch data processing for Cloud
                Foundry and Kubernetes
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
                Event-driven Spring Boot microservices that communicate with one
                another via messaging middleware
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
                Short-lived Spring Boot microservices that stores task execution
                information in a database
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
            <div className='page-colset'>
              <p>
                Several community members have made implementations of Data Flow
                that deploy to other platforms. Thanks!
              </p>
              <ul className='links'>
                <li>
                  <a href='https://github.com/donovanmuller/spring-cloud-dataflow-server-nomad'>
                    Spring Cloud Data Flow for HashiCorp Nomad
                  </a>
                </li>
                <li>
                  <a href='https://github.com/donovanmuller/spring-cloud-dataflow-server-openshift'>
                    Spring Cloud Data Flow for Red Hat OpenShift
                  </a>
                </li>
                <li>
                  <a href='https://github.com/trustedchoice/spring-cloud-dataflow-server-mesos'>
                    Spring Cloud Data Flow for Apache Mesos
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className='box'>
            <div className='zenhub'>
              <div className='zenhub-content'>
                <h2>
                  We use <strong>ZenHub</strong> to manage our backlog.
                </h2>
                <p>
                  To view the backlog please install the ZenHub browser plugin.
                  ZenHub is available for Google Chrome and Mozilla Firefox as
                  an extension.
                </p>
                <p>
                  <a
                    href='https://github.com/spring-cloud/spring-cloud-dataflow/pulls#workspaces/scdf-combined--573b0ae28867c41f233bb0f7/board?repos=39469487,52819699,45694880,96455695,72460646,52798744,52803867,126892412,143091335,126892627,47708564,73841717,179378165'
                    className='button'
                  >
                    View the backlog
                  </a>
                </p>
                <div className='image'>
                  <IconZenHub />
                  <ZenhubImage alt='ZenHub' title='ZenHub' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CommunityPage
