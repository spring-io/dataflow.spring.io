import React from 'react'

import {
  IconGithub,
  IconGitter,
  IconStackOverflow,
  IconZenHub,
} from '../components/common/icons'
import { Layout } from '../components/common/layout'
import { Seo } from '../components/common/seo'
import { ZenhubImage } from '../components/community'

const CommunityPage = () => {
  return (
    <Layout className='page-community'>
      <Seo title='Community' />
      <div className='container'>
        <div className='layout-basic'>
          <div className='page-title'>
            <h1>Community</h1>
            <p>
              All our projects are hosted on{' '}
              <a href='https://GitHub.com/spring-cloud/'>GitHub</a>
            </p>
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
                  href='https://stackoverflow.com/questions/tagged/spring-cloud-task'
                  target='_blank'
                  rel='noreferrer noopener'
                >
                  <IconStackOverflow />
                </a>
              </p>
            </article>
          </div>

          <div className='more'>
            <p>
              Several <strong>community members</strong> have made
              implementations of Data Flow that deploy to other platforms.{' '}
              <strong>Thanks!</strong>
            </p>
            <p>
              Discover Spring Cloud Dataflow for{' '}
              <a
                target='_blank'
                rel='noreferrer noopener'
                href='https://github.com/donovanmuller/spring-cloud-dataflow-server-nomad'
              >
                HashiCorp Nomad
              </a>
              ,{' '}
              <a
                target='_blank'
                rel='noreferrer noopener'
                href='https://github.com/donovanmuller/spring-cloud-dataflow-server-openshift'
              >
                Red Hat OpenShift
              </a>
              ,{' '}
              <a
                target='_blank'
                rel='noreferrer noopener'
                href='https://github.com/trustedchoice/spring-cloud-dataflow-server-mesos'
              >
                Apache Mesos
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
