---
path: 'recipes/polyglot/'
title: 'Polyglot'
description: 'Using multiple programming languages'
summary: true
---

# Using multiple programming languages

When an application is registered as a Docker container, it can be deployed by Data Flow even if the application is not a Spring Boot application. Applications written in other languages can also be deployed by Data Flow.
However, those applications are responsible for reading environment variables that correspond to Spring Boot's well known configuration properties.
If the application consumes or produces messages, the client library for the messaging middleware needs to be included as part of the application to participate in a stream.
To participate as a task, the application needs to write to the `Task` table (which is created by Data Flow).

To demonstrate this functionality, we create three types of Python applications and package them in Docker containers.

- The first application is deployed by Data Flow as a `processor` in a stream by including the [kafka-python](https://github.com/dpkp/kafka-python) library to create consumer and producer connections.
- The second application is deployed by Data Flow as a Task.
- The third application is deployed by Data Flow as an `application` in a Stream. This is different than deploying a `source`, `processor`, or `sink`, since Data Flow does not set the environment variables that wire up the producers and consumers.
  Instead you must set those environment variables yourself as deployment properties.
  The recipe implements the [Dynamic Router](https://www.enterpriseintegrationpatterns.com/patterns/messaging/DynamicRouter.html) integration pattern to dispatch an `input` stream of timestamps to either `even` or `odd` downstream channels.
