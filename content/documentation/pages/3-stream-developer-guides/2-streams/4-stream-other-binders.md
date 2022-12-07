---
path: 'stream-developer-guides/streams/stream-other-binders/'
title: 'Spring Application Development on other Messaging Middleware'
description: 'Create your own microservices for Stream processing using other messaging middleware such as Google Pub/Sub, Amazon Kinesis, and Solace JMS'
---

Spring Cloud Stream provides binders for the following messaging middleware and streaming platforms:

- RabbitMQ
- Apache Kafka
- Apache Kafka Streams
- Amazon Kinesis
- Google Cloud PubSub
- Solace's PubSub+
- Azure Event Hubs

However, Spring Cloud Dataflow focuses mainly on `RabbitMQ` and `Apache Kafka`.
The other binders may need additional configuration - please see the docs for [each particular binder](<[binders](https://spring.io/projects/spring-cloud-stream)>) for more information.
