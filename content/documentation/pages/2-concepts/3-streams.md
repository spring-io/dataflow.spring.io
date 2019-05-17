---
path: 'concepts/streams/'
title: 'Stream Processing'
description: 'Stream Processing Framework and Concepts'
---

# Stream Processing

Stream processing, is defined as the processing of infinite amount of data without interaction or interruption.
Use cases for stream processing are real-time credit card fraud detection or predictive analytics.

Stream processing in Data Flow is implemented architecturally as a collection of independent event-driven streaming applications that connect using messaging middleware, for example RabbitMQ or Apache Kafka.
The collection of application is referred to as a streaming data pipelines.
The pipeline can be linear or non-linear depending on the data flows between the applications.

## Messaging Middleware

Deployed stream applications communicate via messaging middleware product.
We provide prebuilt stream applications that communicate [RabbitMQ](https://www.rabbitmq.com) or
[Kafka](https://kafka.apache.org) that you can use to integrate with various data products.

Other [messaging middleware products](https://cloud.spring.io/spring-cloud-stream/#binder-implementations) such as
[Kafka Streams](https://kafka.apache.org/documentation/streams/),
[Amazon Kinesis](https://aws.amazon.com/kinesis/),
[Google Pub/Sub](https://cloud.google.com/pubsub/docs/)
[Solace PubSub+](https://solace.com/software/)
and
[Azure Event Hubs](https://azure.microsoft.com/en-us/services/event-hubs/)
are also supported.

The middleware to use is determined by adding a Spring Cloud Stream Binder library as a dependency to the application.

## Spring Cloud Stream

For Spring developers, we suggest writing custom Stream applications using the [Spring Cloud Stream](https://spring.io/projects/spring-cloud-stream) framework. Spring Cloud Stream lets you easily build highly scalable event-driven microservices connected with shared messaging systems.

As a developer, you can focus on developing the application’s business logic while delegating the underlying API complexity and connectivity boilerplate with the message broker to Spring Cloud Stream.

At a high level, streaming applications can produce or consume events via the messaging middleware.

## Running Streaming Apps in the Cloud

Both Cloud Foundry and Kubernetes support the concept of running long lived applications on their platforms.
Cloud Foundry refers to them as Long Running Process (LRP) and on Kubernetes you can use a Deployment resource which in turn manages ReplicaSets that keep the specified number of Pods with your application up and running.

While Spring Cloud Stream can simplify your life when writing a Streaming application, when a collection of independent Spring Cloud Streaming applications are deployed, you will need to

- Configure all of the applications input and output destinations.
- Configure the common name of a shared consumer group property to ensure there can be competing consumers on a destination.
- Configure several properties that enable application identification and publishing of metrics information for monitoring purposes.
- Configure the connection to your messaging middleware.
- Create the necessary platform resources to run the applications.

When you deploy a Stream with Data Flow, it will handle all of these configuration tasks for you and also create the necessary platform resources to run your application on the target platform.
Various deployment properties let you customize the deployment, for example setting common properties such as memory resources, or platform specific properties such as the buildpack on Cloud Foundry or setting Labels on Kubernetes deployments.

## Orchestrating Streaming Apps

![Data Flow Stream Orchestration](images/SCDF-stream-orchestration.png)

Once you have written your stream applications using Spring Cloud Stream or use one of the many prebuilt Spring Cloud Stream applications, how do define the applications that will compose the streaming data pipeline and how do orchestrate the launching of all the applications?
This is where Spring Cloud Data Flow can help.

Spring Cloud Data Flow allows you to define the Stream using a Drag and Drop designer or using a text based Domain Specific language with a familiar pipes and filter syntax.
See the [Tooling](%currentPath%/concepts/tooling/) guide for more information.

You can then select to deploy to either Kubernetes or Cloud Foundry.
Once deployed, if you need to update an individual application, Data Flow makes that easy by providing a simple upgrade command that triggers a blue/green deployment on the platform. See the [Continuous Delivery](%currentPath%/stream-developer-guides/continuous-delivery/) guide for more information.

Streams can be monitored using a variety of popular monitoring systems, we demonstrate Prometheus and InfluxDB , and viewed with provided Grafana dashboard template. See the [Monitoring](%currentPath%/feature-guides/streams/monitoring/) for more information.

## Next Steps

If you are interested in using the prebuilt applications to create streaming data pipeline,
look at the [Stream Getting Started Guide](%currentPath%/stream/developer-guides/getting-started/)

If your interested in writing and deploying your a custom stream processing application using Spring Cloud Stream, take a look at our [Stream Developer Guides](%currentPath%/stream-developer-guides/streams).
