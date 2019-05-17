import React from 'react'

import { Layout } from '../components/common/layout'
import { Seo } from '../components/common/seo'

const FeaturesPage = () => (
  <Layout className='page-features'>
    <Seo title='Features' />
    {/* <div className='band'>
      <div className='band-background'>
        <div className='container'>
          <div className='text'>
            <p className='title'>
              Spring Cloud <strong>Data Flow</strong>
            </p>
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
          </div>
          <div className='player'>
            <Video />
          </div>
        </div>
      </div>
    </div> */}
    <div className='container'>
      <div className='layout-basic'>
        <div className='page-title'>
          <h1>Features</h1>
        </div>

        <div className='colset'>
          <div className='col'>
            <article>
              <h2>Security</h2>
              <p>
                Standardized on OAuth2 and OpenID Connect for secure
                authentication and authorization semantics.
              </p>
            </article>

            <article>
              <h2>Continuous Delivery</h2>
              <p>
                Upgrade and rollback streaming data pipelines with zero downtime
                and no data loss
              </p>
            </article>

            <article>
              <h2>Prebuilt Components</h2>
              <p>
                Select from over 60 prebuilt applications to kick start the
                solution for your use-case.
              </p>
            </article>

            <article>
              <h2>Pivotal Data Products</h2>
              <p>
                Ready to connect with Pivotal Data Products including
                Gemfire/Geode, PCC, GPDB, Pivotal RabbitMQ, Pivotal Redis,
                Pivotal PostgreSQL, and Pivotal MySQL
              </p>
            </article>
          </div>

          <div className='col'>
            <article>
              <h2>Programming Model</h2>
              <p>
                Build streaming and batch applications using Spring Cloud Stream
                and Spring Cloud Task projects. Choose from several event-driven
                programming models: Channels, Java 8 Functional, and Kafka
                Streams.
              </p>
            </article>
            <article>
              <h2>Polyglot</h2>
              <p>
                Develop using Kafka Streams, Python, .NET, or other programming
                model primitives
              </p>
            </article>
            <article>
              <h2>Pluggable Message Broker</h2>
              <p>
                Use the same application code and bind to your preferred message
                broker. Support for RabbitMQ, Apache Kafka, Kafka Streams,
                Amazon Kinesis, Google Pub/Sub, Solace PubSub+, Azure Event
                Hubs, or RocketMQ
              </p>
            </article>
          </div>
          <div className='col'>
            <article>
              <h2>Manage Spring Batch Jobs</h2>
              <p>
                Use the Dashboard to manage the execution of Batch Jobs. You can
                view the detailed status report and restart the failed jobs.
              </p>
            </article>
            <article>
              <h2>Batch Jobs as a Connected Graph</h2>
              <p>
                Use the Dashboard to design the large-scale and
                compute-intensive batch data pipeline
              </p>
            </article>
            <article>
              <h2>Schedule Batch Jobs</h2>
              <p>
                Integration with Cloud Foundry and Kubernetes scheduler
                components.
              </p>
            </article>
          </div>
        </div>
      </div>
    </div>
  </Layout>
)

export default FeaturesPage
