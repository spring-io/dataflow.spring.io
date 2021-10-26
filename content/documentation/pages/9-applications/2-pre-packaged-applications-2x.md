---
path: 'applications/pre-packaged2x'
title: 'Pre-packaged Applications 2.x'
description: 'Pre-packaged stream and task applications (Einstein release)'
keywords:
  - application
  - pre-packaged
toc: true
summary: false
---

# Pre-packaged Applications (Einstein.SR9)

<!--TIP-->

This page contains information about the 2.x release version (Einstein.SR9) of `stream-applications`, which are incompatible with the latest (2020.0.0 +) release. If you are looking for information about the latest release, see [pre-packaged applications](%currentPath%/applications/pre-packaged/).

<!--END_TIP-->

The Spring team provides and supports a selection of pre-packaged applications that you can use to assemble various data integration and processing pipelines and to support Spring Cloud Data Flow development, learning, and experimentation.

## Getting Started

<!--TIP-->

If you are interested in upgrading existing data pipelines to use `3.x` applications, see the [Migration Guide](%currentPath%/applications/migration).

<!--END_TIP-->

All pre-packaged streaming applications:

- Are available as Apache Maven artifacts or Docker images.
- Use RabbitMQ or Apache Kafka.
- Support monitoring through [Prometheus](https://prometheus.io/) and [InfluxDB](https://www.influxdata.com/).
- Contain metadata for application properties that are used in the UI and code completion in the shell.

You can register stream and task applications by using the Data Flow UI or the shell.

You can register applications individually by using the `app register` command or in bulk by using the `app import` command.

For streams, depending on whether you use Kafka or RabbitMQ, you can register the applications by using their respective URLs:

- Kafka

* Docker: [%stream-app-kafka-docker-einstein%]()
* Maven: [%stream-app-kafka-maven-einstein%]()

- RabbitMQ

* Docker: [%stream-app-rabbit-docker-einstein%]()
* Maven: [%stream-app-rabbit-maven-einstein%]()

For tasks, you can use the following URLs:

- Docker: https://dataflow.spring.io/task-docker-latest
- Maven: https://dataflow.spring.io/task-maven-latest

When you use the Data Flow UI, the links shown in the following image are included for pre-fill:

![Bulk register applications](images/bulk-registration.png)

From the Data Flow Shell, you can bulk import and register the applications, as the following example shows:

```bash
dataflow:>app import --uri https://dataflow.spring.io/kafka-maven-latest
```

<!--TIP-->

The `latest` bulk-registration links are updated as part of the release process. There are additional [bulk-registration](#bulk-registration-of-stream-applications) links to pre-packaged applications for a specific release.

<!--END_TIP-->

## Stream Applications

The Spring team develops and maintains [stream applications](https://cloud.spring.io/spring-cloud-stream-app-starters/) and publishes these applications to the [Spring public Maven repository](https://repo.spring.io/release/org/springframework/cloud/stream/app/) and to [Dockerhub](https://hub.docker.com/u/springcloudstream) in accordance with a release schedule, normally following significant Spring Boot or Spring Cloud Stream releases.
The pre-packaged stream applications are Spring Boot executable jars that are built with a specific binder implementation.
For each stream app, we provide separate executable applications for RabbitMQ and Kafka.

The following table shows the currently available stream applications:

| Source                                                                                            | Processor                                                                                                                      | Sink                                                                                                            |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| [cdc-debezium](%stream-applications-doc-2x%/#spring-cloud-stream-modules-cdc-debezium-source)     | [aggregator](%stream-applications-doc-2x%/#spring-cloud-stream-modules-aggregator-processor)                                   | [cassandra](%stream-applications-doc-2x%/#spring-cloud-stream-modules-cassandra-sink)                           |
| [file](%stream-applications-doc-2x%/#spring-cloud-stream-modules-file-source)                     | [bridge](%stream-applications-doc-2x%/#spring-cloud-stream-modules-bridge-processor)                                           | [counter](%stream-applications-doc-2x%/#spring-cloud-stream-modules-counter-sink)                               |
| [ftp](%stream-applications-doc-2x%/#spring-cloud-stream-modules-ftp-source)                       | [counter](%stream-applications-doc-2x%/#spring-cloud-stream-modules-counter-processor)                                         | [file](%stream-applications-doc-2x%/#spring-cloud-stream-modules-file-sink)                                     |
| [gemfire](%stream-applications-doc-2x%/#spring-cloud-stream-modules-gemfire-source)               | [filter](%stream-applications-doc-2x%/#spring-cloud-stream-modules-filter-processor)                                           | [ftp](%stream-applications-doc-2x%/#spring-cloud-stream-modules-ftp-sink)                                       |
| [gemfire-cq](%stream-applications-doc-2x%/#spring-cloud-stream-modules-gemfire-cq-source)         | [groovy-filter](%stream-applications-doc-2x%/#spring-cloud-stream-modules-groovy-filter-processor)                             | [gemfire](%stream-applications-doc-2x%/#spring-cloud-stream-modules-gemfire-sink)                               |
| [http](%stream-applications-doc-2x%/#spring-cloud-stream-modules-http-source)                     | [groovy-transform](%stream-applications-doc-2x%/#spring-cloud-stream-modules-groovy-transform-processor)                       | [hdfs](%stream-applications-doc-2x%/#spring-cloud-stream-modules-hdfs-sink)                                     |
| [jdbc](%stream-applications-doc-2x%/#spring-cloud-stream-modules-jdbc-source)                     | [grpc](%stream-applications-doc-2x%/#spring-cloud-stream-modules-grpc-processor)                                               | [jdbc](%stream-applications-doc-2x%/#spring-cloud-stream-modules-jdbc-sink)                                     |
| [jms](%stream-applications-doc-2x%/#spring-cloud-stream-modules-jms-source)                       | [header-enricher](%stream-applications-doc-2x%/#spring-cloud-stream-modules-header-enricher-processor)                         | [log](%stream-applications-doc-2x%/#spring-cloud-stream-modules-log-sink)                                       |
| [load-generator](%stream-applications-doc-2x%/#spring-cloud-stream-modules-load-generator-source) | [httpclient](%stream-applications-doc-2x%/#spring-cloud-stream-modules-httpclient-processor)                                   | [mongodb](%stream-applications-doc-2x%/#spring-cloud-stream-modules-mongodb-sink)                               |
| [loggregator](%stream-applications-doc-2x%/#spring-cloud-stream-modules-loggregator-source)       | [image-recognition](%stream-applications-doc-2x%/#spring-cloud-stream-modules-image-recognition-processor)                     | [mqtt](%stream-applications-doc-2x%/#spring-cloud-stream-modules-mqtt-sink)                                     |
| [mail](%stream-applications-doc-2x%/#spring-cloud-stream-modules-mail-source)                     | [object-detection](%stream-applications-doc-2x%/#spring-cloud-stream-modules-object-detection-processor)                       | [pgcopy](%stream-applications-doc-2x%/#spring-cloud-stream-modules-pgcopy-sink)                                 |
| [mongodb](%stream-applications-doc-2x%/#spring-cloud-stream-modules-mongodb-source)               | [pmml](%stream-applications-doc-2x%/#spring-cloud-stream-modules-pmml-processor)                                               | [rabbit](%stream-applications-doc-2x%/#spring-cloud-stream-modules-rabbit-sink)                                 |
| [mqtt](%stream-applications-doc-2x%/#spring-cloud-stream-modules-mqtt-source)                     | [pose-estimation](%stream-applications-doc-2x%/#spring-cloud-stream-modules-pose-estimation-processor)                         | [redis-pubsub](%stream-applications-doc-2x%/#spring-cloud-stream-modules-redis-pubsub-sink)                     |
| [rabbit](%stream-applications-doc-2x%/#spring-cloud-stream-modules-rabbit-source)                 | [python-http](%stream-applications-doc-2x%/#spring-cloud-stream-modules-python-http-processor)                                 | [router](%stream-applications-doc-2x%/#spring-cloud-stream-modules-router-sink)                                 |
| [s3](%stream-applications-doc-2x%/#spring-cloud-stream-modules-s3-source)                         | [python-jython](%stream-applications-doc-2x%/#spring-cloud-stream-modules-python-jython-processor)                             | [s3](%stream-applications-doc-2x%/#spring-cloud-stream-modules-s3-sink)                                         |
| [sftp](%stream-applications-doc-2x%/#spring-cloud-stream-modules-sftp-source)                     | [scriptable-transform](%stream-applications-doc-2x%/#spring-cloud-stream-modules-scriptable-transform-processor)               | [sftp](%stream-applications-doc-2x%/#spring-cloud-stream-modules-sftp-sink)                                     |
| [sftp-dataflow](%stream-applications-doc-2x%/#spring-cloud-stream-modules-sftp-dataflow-source)   | [splitter](%stream-applications-doc-2x%/#spring-cloud-stream-modules-splitter-processor)                                       | [task-launcher-dataflow](%stream-applications-doc-2x%/#spring-cloud-stream-modules-task-launcher-dataflow-sink) |
| [syslog](%stream-applications-doc-2x%/#spring-cloud-stream-modules-syslog-source)                 | [tasklaunchrequest-transform](%stream-applications-doc-2x%/#spring-cloud-stream-modules-tasklaunchrequest-transform-processor) | [tcp](%stream-applications-doc-2x%/#spring-cloud-stream-modules-tcp-sink)                                       |
| [tcp](%stream-applications-doc-2x%/#spring-cloud-stream-modules-tcp-source)                       | [tcp-client](%stream-applications-doc-2x%/#spring-cloud-stream-modules-tcp-client-processor)                                   | [throughput](%stream-applications-doc-2x%/#spring-cloud-stream-modules-throughput-sink)                         |
| [tcp-client](%stream-applications-doc-2x%/#spring-cloud-stream-modules-tcp-client-source)         | [tensorflow](%stream-applications-doc-2x%/#spring-cloud-stream-modules-tensorflow-processor)                                   | [websocket](%stream-applications-doc-2x%/#spring-cloud-stream-modules-websocket-sink)                           |
| [time](%stream-applications-doc-2x%/#spring-cloud-stream-modules-time-source)                     | [transform](%stream-applications-doc-2x%/#spring-cloud-stream-modules-transform-processor)                                     |                                                                                                                 |
| [trigger](%stream-applications-doc-2x%/#spring-cloud-stream-modules-trigger-source)               | [twitter-sentiment](%stream-applications-doc-2x%/#spring-cloud-stream-modules-twitter-sentiment-processor)                     |                                                                                                                 |
| [triggertask](%stream-applications-doc-2x%/#spring-cloud-stream-modules-triggertask-source)       |                                                                                                                                |                                                                                                                 |
| [twitterstream](%stream-applications-doc-2x%/#spring-cloud-stream-modules-twitterstream-source)   |                                                                                                                                |                                                                                                                 |

## Task Applications

The Spring team develops and maintains [task and batch applications](https://cloud.spring.io/spring-cloud-task-app-starters/) and publishes these applications to the [Spring public Maven repository](https://repo.spring.io/release/org/springframework/cloud/task/app/) and to [Dockerhub](https://hub.docker.com/u/springcloudtask) in accordance with a planned release schedule, normally following significant Spring Boot, Spring Cloud Task, or Spring Batch releases.

The currently available task and batch applications are as follows:

[timestamp](%task-applications-doc%/#spring-cloud-task-modules-tasks)<br/>
[timestamp-batch](%task-applications-doc%/#_timestamp_batch_task)

# Bulk Registration of Stream Applications

Spring Cloud Data Flow supports bulk registration of applications, through a standard properties file format.
For convenience, we publish static properties files with application URIs (for either Maven or Docker) for all the out-of-the-box stream and task and batch apps.
You can use these files in Spring Cloud Data Flow to register all the application URIs in bulk.
Alternately, you can register them individually or provide your own custom property file with only the required application URIs in it.
Bulk registration is convenient for getting started with SCDF.
To reduce clutter, we recommended maintaining a "focused" list of desired application URIs in a custom property file.
