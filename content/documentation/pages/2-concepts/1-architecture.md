---
path: 'concepts/architecture/'
title: 'Architecture'
description: 'Lorem markdownum madefacta, circumtulit aliis, restabat'
---

# Architecture

TODO

## System Requirements

**Java:** Data Flow uses Java 8.

**Database:** The Data Flow Server and Skipper Server need to have an RDBMS installed.
By default, the servers use an embedded H2 database.
You can easily configure the servers to use external databases.
The supported databases are H2, HSQLDB, MySQL, Oracle, Postgresql, DB2, and SqlServer.
The schemas are automatically created when each server starts.

**Messaging Middleware:** Deployed stream applications communicate via messaging middleware
product.
We provide prebuilt stream applications that use [RabbitMQ](https://www.rabbitmq.com) or
[Kafka](https://kafka.apache.org).
However, other [messaging middleware products](https://cloud.spring.io/spring-cloud-stream/#binder-implementations)
such as
[Kafka Streams](https://kafka.apache.org/documentation/streams/),
[Amazon Kinesis](https://aws.amazon.com/kinesis/),
[Google Pub/Sub](https://cloud.google.com/pubsub/docs/)
[Solace PubSub+](https://solace.com/software/)
and
[Azure Event Hubs](https://azure.microsoft.com/en-us/services/event-hubs/)
are supported.
