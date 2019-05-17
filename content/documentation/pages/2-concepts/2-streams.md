---
path: 'concepts/streams/'
title: 'Stream Processing'
description: 'Stream Processing Framework and Concepts'
---

# Stream Processing

Stream processing, is defined as the processing of infinite amount of data without interaction or interruption. Applications that implement stream processing are referred to long lived apps. An example of a stream processing would be the real-time credit card fraud detection, IoT, or real-time predictive analytics.

A streaming data pipeline is made up of independent event-driven streaming applications that connect using messaging middleware (example: RabbitMQ, Apache Kafka, or others).
The streaming data pipeline can be linear or non-linear depending on the data flows between the applications.

## Spring Cloud Stream

[Spring Cloud Stream](https://spring.io/projects/spring-cloud-stream) is a framework for building highly scalable event-driven microservices connected with shared messaging systems.

As a developer, you can focus on developing the application’s business logic while delegating the underlying connectivity and configuration boilerplate with the message broker to Spring Cloud Stream.

At a high level, streaming applications can produce or consume events to/from the messaging middleware. In Spring Cloud Stream:

- An app that produce the events to the messaging middleware represents the `outbound` destination
- An app that consume the events from the messaging middleware represents the `inbound` destination

### Spring Cloud Stream Binding

When a Spring Cloud Stream application is deployed, by default, the `inbound` and `outbound` destinations are automatically configured using the `@Input` and `@Output` annotations by the framework, which are then bound to the messaging middleware using the `binding` properties for each destination.

#### Spring Cloud Stream Binding Properties

Binding properties require `spring.cloud.stream.bindings.<inbound/outbound-name>` prefix.

Currently, the following properties are supported:

- `destination` - the destination on the messaging middleware
- `group` - the consumer group name to be used for the application. Only for consumer applications. In Spring Cloud Data Flow, this will always be the `stream name`
- `contentType` - the content type to be used
- `binder` - the name of the binder to use for the binding. This property is useful for multi-binder use cases

#### Spring Cloud Stream Properties for Messaging Middleware

Spring Cloud Stream provides a Binder abstraction for use in connecting to physical destinations at the external middleware.

Depending on the binder implementation in use, you can customize to override the configuration properties between the application and the messaging middleware.
All these properties would take the prefix as `spring.cloud.stream.<binderName>.binder`.

For instance, all the Apache Kafka binder configuration properties will have the `spring.cloud.stream.kafka.binder` prefix.

You can learn more about the binder properties in Spring Cloud Stream [reference guide](https://cloud.spring.io/spring-cloud-static/spring-cloud-stream/%stream-version%/spring-cloud-stream.html#_binder_implementations).

### Streams in Spring Cloud Data Flow

Spring Cloud Data Flow automates the configuration and deployment of Spring Cloud Stream application. For instance, the following properties automatically derived and assigned to the deployed applications:

- The value for `<input/output>` in `spring.cloud.stream.bindings.<input/output>.destination` is derived based on `streamName.<application/label name>` naming convention.
- The value for `<input/output>` in `spring.cloud.stream.bindings.<input/output>.group` is derived based on the stream name naming convention.

You can still override these properties explicitly for each application.

## Next Steps

If your interested in writing and deploying your first stream processing application, take a look at our [Stream Developer Guides](%currentPath%/stream-developer-guides/).
