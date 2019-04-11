---
path: "/documentation/get-started/local/"
title: "Get started with local server"
description: Getting Started Data Flow using the local server
---

Intro text here

# System Requirements

You need Java 8 to run and to build you need to have Maven.

Both the Data Flow Server and Skipper Server need to have an RDBMS installed.  The Data Flow Server stores stream and task definitions.  It also stores the execution state of deployed tasks.  The Skipper server stores the execution state of deployed streams.

By default, the Data Flow server uses embedded H2 database for this purpose but you can easily configure the server to use another external database.

For the deployed streams applications communicate a messaging middleware product needs to be installed.
We provide prebuilt stream applications that use [RabbitMQ](https://www.rabbitmq.com) or [Kafka](https://kafka.apache.org), however other [messaging middleware products](https://cloud.spring.io/spring-cloud-stream/#binder)-implementations are supported.


