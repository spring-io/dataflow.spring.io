---
path: 'recipes/polyglot/'
title: 'Polyglot'
description: 'Polyglot App, Processors and Task Recipes'
summary: true
---

# Using multiple programming languages in Data Flow.

When applications are registered as Docker containers, they can be deployed by Data Flow if even the application is not a Spring Boot Application.

Applications written in other languages can be deployed by Data Flow.
However, those applications are responsible for reading environment variables that correspond to Spring Boot's well known configuration properties.
If the application is consuming or producing messages, the client library for the messaging middleware needs to be included as part of the application to participate in a Stream.
To participate as a Task, the application needs to write to the Task table created by Data Flow.

To demonstrate this functionality, we will create three types of Python applications and package it as a Docker container.

- The first application will be deployed by Data Flow as `processor` in a Stream by including the [kafka-python](https://github.com/dpkp/kafka-python) library to create consumer and producer connections.
- The second application will be deployed by Data Flow as a Task.
- The third application will be deployed by Data Flow as an `applications` in a Stream. This is different than deploying a `source`, `processor` or `sink` since Data Flow will not set environment variables that wire up the producers and consumers.
  Instead you must set those environment variables yourself as deployment properties.
  It uses the [kafka-python](https://github.com/dpkp/kafka-python) to consume from the `orders` topic and publishes to either a `cold.drink` or `hot.drink` topic.
