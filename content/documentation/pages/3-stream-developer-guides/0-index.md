---
path: 'stream-developer-guides/'
title: 'Stream Developer guides '
description: 'Learn how to create Streaming data pipelines using prebuilt microservices or create your own.'
summary: true
---

# Developer guides

There are several guides in this section, but a common starting path through them consists of the following steps:

- Follow the Getting Started guide which shows you how to use the [prebuilt applications](%currentPath%/concepts/app-starters/) to create and deploy a Stream using Data Flow.  
  This gives you a quick feel for how to use the Dashboard to create a stream, deploy it, and look at the logs.

- Develop your own source, processor, and sink application with Spring Cloud Stream, deploy it manually to a platform, and dive into what is happening in the message broker for both RabbitMQ and Apache Kafka.

- Take the source, processor, and sink application just developed and use Data Flow to create the stream and deploy it to the platform.  
  In this way you can more clearly see which parts of the overall development and deployment workflow that Data Flow handling for you when compared to a fully manual development and deployment approach.
