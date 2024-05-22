---
path: 'applications/pre-packaged'
title: 'Pre-packaged Applications'
description: 'Pre-packaged stream applications version 3.x'
keywords:
  - application
  - pre-packaged
toc: true
summary: false
---

# Pre-packaged Applications

The Spring team provides and supports a selection of pre-packaged applications that you can use to assemble various data integration and processing pipelines and to support Spring Cloud Data Flow development, learning, and experimentation.

## Getting Started

All pre-packaged streaming applications:

- Are available as Apache Maven artifacts or Docker images.
- Use RabbitMQ or Apache Kafka.
- Support monitoring through [Prometheus](https://prometheus.io/) and [InfluxDB](https://www.influxdata.com/).
- Contain metadata for application properties used in the UI and code completion in the shell.

You can register stream and task applications by using the Data Flow UI or the shell.

You can register applications individually by using the `app register` command or in bulk by using the `app import` command.

For streams, depending on whether you use Kafka or RabbitMQ, you can register the applications by using their respective URLs:

### Kafka

- [%stream-app-kafka-docker-latest%](%stream-app-kafka-docker-latest%)
- [%stream-app-kafka-maven-latest%](%stream-app-kafka-maven-latest%)

### RabbitMQ

- [%stream-app-rabbit-docker-latest%](%stream-app-rabbit-docker-latest%)
- [%stream-app-rabbit-maven-latest%](%stream-app-rabbit-maven-latest%)

When you use the Data Flow UI, the links shown in the following image are included for pre-fill:

![Bulk register applications](images/bulk-registration.png)

From the Data Flow Shell, you can bulk import and register the applications, as the following example shows:

```bash
dataflow:>app import --uri https://dataflow.spring.io/kafka-maven-milestone
```

## Available Applications

You can find a list of the available applications [here](https://github.com/spring-cloud/stream-applications#reusable-spring-cloud-stream-applications).

# Bulk Registration of Stream Applications

Spring Cloud Data Flow supports bulk registration of applications, through a standard properties file format.
For convenience, we publish static properties files with application URIs (for either maven or docker) for all the out-of-the-box stream and task and batch apps.
You can use these files in Spring Cloud Data Flow to register all the application URIs in bulk.
Alternately, you can register them individually or provide your own custom property file with only the required application URIs in it.
Bulk registration is convenient for getting started with SCDF.
To reduce clutter, we recommend maintaining a "focused" list of desired application URIs in a custom property file.

# Supported Spring Cloud Stream Applications

| Artifact Type                  | Latest Stable Release                                                                         | SNAPSHOT Release                                                                         |
| ------------------------------ | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
|                                | 2021.1.2 based on<br>&#8226;&nbsp;spring-cloud-stream 3.2.4<br>&#8226;&nbsp;spring-boot 2.6.8 | 2021.1.3-SNAPSHOT                                                                        |
| RabbitMQ + Maven               | [%stream-app-rabbit-maven-latest%](%stream-app-rabbit-maven-latest%)                          | [%stream-app-rabbit-maven-latest-snapshot%](%stream-app-rabbit-maven-latest-snapshot%)   |
| RabbitMQ + Docker (Docker Hub) | [%stream-app-rabbit-docker-latest%](%stream-app-rabbit-docker-latest%)                        | [%stream-app-rabbit-docker-latest-snapshot%](%stream-app-rabbit-docker-latest-snapshot%) |
| Kafka + Maven                  | [%stream-app-kafka-maven-latest%](%stream-app-kafka-maven-latest%)                            | [%stream-app-kafka-maven-latest-snapshot%](%stream-app-kafka-maven-latest-snapshot%)     |
| Kafka + Docker                 | [%stream-app-kafka-docker-latest%](%stream-app-kafka-docker-latest%)                          | [%stream-app-kafka-docker-latest-snapshot%](%stream-app-kafka-docker-latest-snapshot%)   |

# Supported Spring Cloud Task and Batch Applications

| Artifact Type | Latest Stable Release                                  |
| ------------- | ------------------------------------------------------ |
|               | spring-cloud-task 2.4.x<br>spring-boot 2.7.x           |
| Maven         | [%task-app-maven-version%](%task-app-maven-version%])  |
| Docker        | [%task-app-docker-version%](%task-app-docker-version%) |

The following table lists previous releases for reference only.
NOTE: Some of these may no longer be supported (i.e. they depend on an EOL spring-boot release):

# Previous Releases of Stream Applications (2021)

| Artifact Type                  | Previous Stable Release                                                                       |
| ------------------------------ | --------------------------------------------------------------------------------------------- |
|                                | 2021.0.1 based on<br>&#8226;&nbsp;spring-cloud-stream 3.1.x<br>&#8226;&nbsp;spring-boot 2.5.x |
| RabbitMQ + Maven               | [%stream-app-rabbit-maven-previous%](%stream-app-rabbit-maven-previous%)                      |
| RabbitMQ + Docker (Docker Hub) | [%stream-app-rabbit-docker-previous%](%stream-app-rabbit-docker-previous%)                    |
| Kafka + Maven                  | [%stream-app-kafka-maven-previous%](%stream-app-kafka-maven-previous%)                        |
| Kafka + Docker                 | [%stream-app-kafka-docker-previous%](%stream-app-kafka-docker-previous%)                      |

# Previous Releases of Stream Applications (2020)

| Artifact Type                  | Latest Stable Release                                              | SNAPSHOT Release                                                                     |
| ------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
|                                | spring-cloud-stream 3.0.x<br>spring-boot 2.3.x                     |                                                                                      |
| RabbitMQ + Maven               | [%stream-app-rabbit-maven-2020%](%stream-app-rabbit-maven-2020%)   | [%stream-app-rabbit-maven-2020-snapshot"%](%stream-app-rabbit-maven-2020-snapshot"%) |
| RabbitMQ + Docker (Docker Hub) | [%stream-app-rabbit-docker-2020%](%stream-app-rabbit-docker-2020%) | [%stream-app-rabbit-docker-2020-snapshot%](stream-app-rabbit-docker-2020-snapshot)   |
| Kafka + Maven                  | [%stream-app-kafka-maven-2020%](%stream-app-kafka-maven-2020%)     | [%stream-app-kafka-maven-2020-snapshot%](%stream-app-kafka-maven-2020-snapshot%)     |
| Kafka + Docker                 | [%stream-app-kafka-docker-2020%](%stream-app-kafka-docker-2020%)   | [%stream-app-kafka-docker-2020-snapshot%](%stream-app-kafka-docker-2020-snapshot%)   |

# Previous Releases of Spring Cloud Task and Batch Applications

| Artifact Type | Previous Release                                         |
| ------------- | -------------------------------------------------------- |
|               | spring-cloud-stream 2.0.x<br>spring-boot 2.0.x           |
| Maven         | [%task-app-maven-previous%](%task-app-maven-previous%)   |
| Docker        | [%task-app-docker-previous%](%task-app-docker-previous%) |
