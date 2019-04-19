---
path: 'concepts/what-are-streams/'
title: 'What are streams'
description: 'Concepts on Streaming pipelines'
---

# What are streams

A streaming data pipeline is made up off independent event-driven streaming applications that connect using `messaging middleware`.
The streaming data pipeline can be `linear` or `non-linear` based on the data flow through the independent applications that comprise the streaming data pipeline.
As an application developer can focus on developing your application’s business logic while delegating the underlying messaging concerns to the Spring Cloud Stream framework. Control over the detailed settings of the underlying messaging middleware is done declaratively though application configuration.

**TODO I think what is below can go into the stream development guide**

## Spring Cloud Stream

The streaming application can produce or consume events to/from the messaging middleware or the streaming platform.
In Spring Cloud Stream:

- the application’s endpoints which produce the events to the messaging middleware or the streaming platform represent the `outbound` boundary
- the application's endpoints which consume the events from the messaging middleware or the streaming platform represent the `inbound` boundary.

Spring Cloud Stream framework provides `@Input` and `@Output` annotations which you can use to qualify these input and output elements.

### Spring Cloud Stream Binding

When the Spring Cloud Stream application gets deployed, its `input` and `output` elements that are configured using the `@Input` and `@Output` annotations are bound to the messaging middleware or the streaming platform using the `binding` properties per destination on the messaging middleware or the streaming platform.

#### Spring Cloud Stream Binding Properties

Binding properties require `spring.cloud.stream.bindings.<inbound/outbound-name>` prefix.

Currently, following properties are supported:

- destination - the destination on the messaging middleware or the streaming platform (example: RabbitMQ exchange or Apache Kafka topic)
- group - the consumer group name to be used for the application. Only for consumer applications. In Spring Cloud Data Flow, this will always be the `stream name`.
- contentType - the content type to be used
- binder - the name of the binder to use for the binding. This property is useful for multi binder use cases.

#### Spring Cloud Stream Properties for Messaging Middleware

Depending on the binder used for binding your application to the Messaging Middleware or the Streaming platform, you can provide the configuration properties for each binder.
All these properties would take the prefix as `spring.cloud.stream.<binderName>.binder`.

For instance, all the Apache Kafka binder related configuration properties have the prefix `spring.cloud.stream.kafka.binder`

### Streams in Spring Cloud Data Flow

When the Spring Cloud Stream application gets deployed, the following properties are implicitly assigned as follows:

- The property `spring.cloud.stream.bindings.<input/output>.destination` is assigned to use the `streamName.<application/label name>`
- The property `spring.cloud.stream.bindings.<input/output>.group` is set to use the stream `name`.

You can still override these properties by setting the bindings properties explicitly for each application.
