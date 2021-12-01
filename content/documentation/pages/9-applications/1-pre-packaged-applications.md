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

<!--TIP-->

This page contains information about the latest 3.x versions (release 2020.0.0 +) of `stream-applications`, which introduces many new features and some changes that are incompatible with the 2.x (Einstein) release. If you are looking for information about the 2.x release, see [pre-packaged applications 2.x](%currentPath%/applications/pre-packaged2x/).

<!--END_TIP-->

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

## Stream Applications

The Spring team develops and maintains [stream applications](https://spring.io/projects/spring-cloud-stream-applications#learn) and publishes these applications to the [Spring public Maven repository](https://repo.spring.io/release/org/springframework/cloud/stream/app/) and to [Dockerhub](https://hub.docker.com/u/springcloudstream) in accordance with a release schedule, normally following significant Spring Boot or Spring Cloud Stream releases.
The pre-packaged stream applications are Spring Boot executable jars that are built with a specific binder implementation.
For each stream app, we provide separate executable applications for RabbitMQ and Kafka.

The following table shows the currently available stream applications:

| Source                                                                                           | Processor                                                                                                       | Sink                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [cdc-debezium](%stream-applications-doc%/#spring-cloud-stream-modules-cdc-debezium-source)       | [aggregator](%stream-applications-doc%/#spring-cloud-stream-modules-aggregator-processor)                       | [analytics](%stream-applications-doc%/#spring-cloud-stream-modules-analytics-sink)                                                                                              |
| [file](%stream-applications-doc%/#spring-cloud-stream-modules-file-source)                       | [bridge](%stream-applications-doc%/#spring-cloud-stream-modules-bridge-processor)                               | [cassandra](%stream-applications-doc%/#spring-cloud-stream-modules-cassandra-sink)                                                                                              |
| [ftp](%stream-applications-doc%/#spring-cloud-stream-modules-ftp-source)                         | [filter](%stream-applications-doc%/#spring-cloud-stream-modules-filter-processor)                               | [dataflow-tasklauncher](https://github.com/spring-cloud/spring-cloud-dataflow/blob/main/spring-cloud-dataflow-tasklauncher/spring-cloud-dataflow-tasklauncher-sink/README.adoc) |
| [geode](%stream-applications-doc%/#spring-cloud-stream-modules-geode-source)                     | [groovy](%stream-applications-doc%/#spring-cloud-stream-modules-groovy-processor)                               | [elasticsearch](%stream-applications-doc%/#spring-cloud-stream-modules-elasticsearch-sink)                                                                                      |
| [http](%stream-applications-doc%/#spring-cloud-stream-modules-http-source)                       | [header-enricher](%stream-applications-doc%/#spring-cloud-stream-modules-header-enricher-processor)             | [file](%stream-applications-doc%/#spring-cloud-stream-modules-file-sink)                                                                                                        |
| [jdbc](%stream-applications-doc%/#spring-cloud-stream-modules-jdbc-source)                       | [http-request](%stream-applications-doc%/#spring-cloud-stream-modules-http-request-processor)                   | [ftp](%stream-applications-doc%/#spring-cloud-stream-modules-ftp-sink)                                                                                                          |
| [jms](%stream-applications-doc%/#spring-cloud-stream-modules-jms-source)                         | [image-recognition](%stream-applications-doc%/#spring-cloud-stream-modules-image-recognition-processor)         | [geode](%stream-applications-doc%/#spring-cloud-stream-modules-geode-sink)                                                                                                      |
| [load-generator](%stream-applications-doc%/#spring-cloud-stream-modules-load-generator-source)   | [object-detection](%stream-applications-doc%/#spring-cloud-stream-modules-object-detection-processor)           | [jdbc](%stream-applications-doc%/#spring-cloud-stream-modules-jdbc-sink)                                                                                                        |
| [mail](%stream-applications-doc%/#spring-cloud-stream-modules-mail-source)                       | [semantic-segmentation](%stream-applications-doc%/#spring-cloud-stream-modules-semantic-segmentation-processor) | [log](%stream-applications-doc%/#spring-cloud-stream-modules-log-sink)                                                                                                          |
| [mongodb](%stream-applications-doc%/#spring-cloud-stream-modules-mongodb-source)                 | [script](%stream-applications-doc%/#spring-cloud-stream-modules-script-processor)                               | [mongodb](%stream-applications-doc%/#spring-cloud-stream-modules-mongodb-sink)                                                                                                  |
| [mqtt](%stream-applications-doc%/#spring-cloud-stream-modules-mqtt-source)                       | [splitter](%stream-applications-doc%/#spring-cloud-stream-modules-splitter-processor)                           | [mqtt](%stream-applications-doc%/#spring-cloud-stream-modules-mqtt-sink)                                                                                                        |
| [rabbit](%stream-applications-doc%/#spring-cloud-stream-modules-rabbit-source)                   | [transform](%stream-applications-doc%/#spring-cloud-stream-modules-transform-processor)                         | [pgcopy](%stream-applications-doc%/#spring-cloud-stream-modules-pgcopy-sink)                                                                                                    |
| [s3](%stream-applications-doc%/#spring-cloud-stream-modules-s3-source)                           | [twitter-trend](%stream-applications-doc%/#spring-cloud-stream-modules-twitter-trend-processor)                 | [rabbit](%stream-applications-doc%/#spring-cloud-stream-modules-rabbit-sink)                                                                                                    |
| [sftp](%stream-applications-doc%/#spring-cloud-stream-modules-sftp-source)                       |                                                                                                                 | [redis](%stream-applications-doc%/#spring-cloud-stream-modules-redis-sink)                                                                                                      |
| [syslog](%stream-applications-doc%/#spring-cloud-stream-modules-syslog-source)                   |                                                                                                                 | [router](%stream-applications-doc%/#spring-cloud-stream-modules-router-sink)                                                                                                    |
| [tcp](%stream-applications-doc%/#spring-cloud-stream-modules-tcp-source)                         |                                                                                                                 | [rsocket](%stream-applications-doc%/#spring-cloud-stream-modules-rsocket-sink)                                                                                                  |
| [time](%stream-applications-doc%/#spring-cloud-stream-modules-time-source)                       |                                                                                                                 | [s3](%stream-applications-doc%/#spring-cloud-stream-modules-s3-sink)                                                                                                            |
| [twitter-message](%stream-applications-doc%/#spring-cloud-stream-modules-twitter-message-source) |                                                                                                                 | [sftp](%stream-applications-doc%/#spring-cloud-stream-modules-sftp-sink)                                                                                                        |
| [twitter-search](%stream-applications-doc%/#spring-cloud-stream-modules-twitter-search-source)   |                                                                                                                 | [tcp](%stream-applications-doc%/#spring-cloud-stream-modules-tcp-sink)                                                                                                          |
| [twitter-stream](%stream-applications-doc%/#spring-cloud-stream-modules-twitter-stream-source)   |                                                                                                                 | [throughput](%stream-applications-doc%/#spring-cloud-stream-modules-throughput-sink)                                                                                            |
| [websocket](%stream-applications-doc%/#spring-cloud-stream-modules-websocket-source)             |                                                                                                                 | [twitter-message](%stream-applications-doc%/#spring-cloud-stream-modules-twitter-message-sink)                                                                                  |
| [zeromq](%stream-applications-doc%/#spring-cloud-stream-modules-zeromq-source)                   |                                                                                                                 | [twitter-update](%stream-applications-doc%/#spring-cloud-stream-modules-twitter-update-sink)                                                                                    |
|                                                                                                  |                                                                                                                 | [wavefront](%stream-applications-doc%/#spring-cloud-stream-modules-wavefront-sink)                                                                                              |
|                                                                                                  |                                                                                                                 | [websocket](%stream-applications-doc%/#spring-cloud-stream-modules-websocket-sink)                                                                                              |
|                                                                                                  |                                                                                                                 | [zeromq](%stream-applications-doc%/#spring-cloud-stream-modules-zeromq-sink)                                                                                                    |

# Bulk Registration of Stream Applications

Spring Cloud Data Flow supports bulk registration of applications, through a standard properties file format.
For convenience, we publish static properties files with application URIs (for either maven or docker) for all the out-of-the-box stream and task and batch apps.
You can use these files in Spring Cloud Data Flow to register all the application URIs in bulk.
Alternately, you can register them individually or provide your own custom property file with only the required application URIs in it.
Bulk registration is convenient for getting started with SCDF.
To reduce clutter, we recommend maintaining a "focused" list of desired application URIs in a custom property file.

# Supported Spring Cloud Stream Applications

| Artifact Type                       | Latest Stable Release                                                  | SNAPSHOT Release                                                                         |
| ----------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
|                                     | spring-cloud-stream 3.1.x<br>spring-boot 2.5.x                         |                                                                                          |
| RabbitMQ + Maven                    | [%stream-app-rabbit-maven-latest%](%stream-app-rabbit-maven-latest%)   | [%stream-app-rabbit-maven-latest-snapshot%](%stream-app-rabbit-maven-latest-snapshot%)   |
| RabbitMQ + Docker (Docker Hub)      | [%stream-app-rabbit-docker-latest%](%stream-app-rabbit-docker-latest%) | [%stream-app-rabbit-docker-latest-snapshot%](%stream-app-rabbit-docker-latest-snapshot%) |
| RabbitMQ + Docker (Harbor Registry) | [%stream-app-rabbit-harbor-latest%](%stream-app-rabbit-harbor-latest%) | N/A                                                                                      |
| Kafka + Maven                       | [%stream-app-kafka-maven-latest%](%stream-app-kafka-maven-latest%)     | [%stream-app-kafka-maven-latest-snapshot%](%stream-app-kafka-maven-latest-snapshot%)     |
| Kafka + Docker                      | [%stream-app-kafka-docker-latest%](%stream-app-kafka-docker-latest%)   | [%stream-app-kafka-docker-latest-snapshot%](%stream-app-kafka-docker-latest-snapshot%)   |
| Kafka + Docker (Harbor Registry)    | [%stream-app-kafka-harbor-latest%](%stream-app-kafka-harbor-latest%)   | N/A                                                                                      |

# Supported Spring Cloud Task and Batch Applications

| Artifact Type | Latest Stable Release                                  | SNAPSHOT Release                                         |
| ------------- | ------------------------------------------------------ | -------------------------------------------------------- |
|               | spring-cloud-stream 2.1.x<br>spring-boot 2.1.x         |                                                          |
| Maven         | [%task-app-maven-version%](%task-app-maven-version%])  | [%task-app-maven-snapshot%](%task-app-maven-snapshot%)   |
| Docker        | [%task-app-docker-version%](%task-app-docker-version%) | [%task-app-docker-snapshot%](%task-app-docker-snapshot%) |

The following table lists previous releases for reference only.
NOTE: These may no longer be supported (i.e. they depend on an EOL spring-boot release):

# Previous Releases of Stream Applications (2020)

| Artifact Type                       | Latest Stable Release                                                | SNAPSHOT Release                                                                     |
| ----------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
|                                     | spring-cloud-stream 3.0.x<br>spring-boot 2.3.x                       |                                                                                      |
| RabbitMQ + Maven                    | [%stream-app-rabbit-maven-2020%](%stream-app-rabbit-maven-2020%)     | [%stream-app-rabbit-maven-2020-snapshot"%](%stream-app-rabbit-maven-2020-snapshot"%) |
| RabbitMQ + Docker (Docker Hub)      | [%stream-app-rabbit-docker-2020%](%stream-app-rabbit-docker-latest%) | [%stream-app-rabbit-docker-2020-snapshot%](stream-app-rabbit-docker-2020-snapshot)   |
| RabbitMQ + Docker (Harbor Registry) | [%stream-app-rabbit-harbor-2020%](%stream-app-rabbit-harbor-latest%) | N/A                                                                                  |
| Kafka + Maven                       | [%stream-app-kafka-maven-2020%](%stream-app-kafka-maven-2020%)       | [%stream-app-kafka-maven-2020-snapshot%](%stream-app-kafka-maven-2020-snapshot%)     |
| Kafka + Docker                      | [%stream-app-kafka-docker-2020%](%stream-app-kafka-docker-2020%)     | [%stream-app-kafka-docker-2020-snapshot%](%stream-app-kafka-docker-2020-snapshot%)   |
| Kafka + Docker (Harbor Registry)    | [%stream-app-kafka-harbor-2020%](%stream-app-kafka-harbor-2020%)     | N/A                                                                                  |

# Previous Releases of Stream Applications (Einstein)

| Artifact Type     | Previous Release                                                           |
| ----------------- | -------------------------------------------------------------------------- |
|                   | spring-cloud-stream 2.0.x<br>spring-boot 2.0.x                             |
| RabbitMQ + Maven  | [%stream-app-rabbit-maven-einstein%](%stream-app-rabbit-maven-einstein%)   |
| RabbitMQ + Docker | [%stream-app-rabbit-docker-einstein%](%stream-app-rabbit-docker-einstein%) |
| Kafka + Maven     | [%stream-app-kafka-maven-einstein%](%stream-app-kafka-maven-einstein%)     |
| Kafka + Docker    | [%stream-app-kafka-docker-einstein%](%stream-app-kafka-docker-einstein%)   |

# Previous Releases of Spring Cloud Task and Batch Applications

| Artifact Type | Previous Release                                         |
| ------------- | -------------------------------------------------------- |
|               | spring-cloud-stream 2.0.x<br>spring-boot 2.0.x           |
| Maven         | [%task-app-maven-previous%](%task-app-maven-previous%)   |
| Docker        | [%task-app-docker-previous%](%task-app-docker-previous%) |
