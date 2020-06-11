---
path: 'applications/pre-packaged'
title: 'Pre-packaged Applications'
description: 'Pre-packaged stream and task applications'
keywords:
  - application
  - pre-packaged
toc: true
summary: false
---

# Pre-packaged Applications

The Spring team provides and supports a selection of pre-packaged applications used to assemble various data integration and processing pipelines and to support Spring Cloud Data Flow development, learning and experimentation.

## Getting Started

All pre-packaged streaming applications:

- Are available as Apache Maven artifacts or Docker images
- Use RabbitMQ or Apache Kafka
- Support monitoring through [Prometheus](https://prometheus.io/) and [InfluxDB](https://www.influxdata.com/)
- Contain metadata for application properties used in the UI and code completion in the shell

You can register stream and task applications by using the Data Flow UI or the shell.

You can register applications individually by using the `app register` command or in bulk by using the `app import` command.

For streams, depending on whether you use Kafka or RabbitMQ, you can register the applications by using the respective URLs:

- Kafka

* Docker: https://dataflow.spring.io/kafka-docker-latest
* Maven: https://dataflow.spring.io/kafka-maven-latest

- RabbitMQ

* Docker: https://dataflow.spring.io/rabbitmq-docker-latest (Docker)
* Maven: https://dataflow.spring.io/rabbitmq-maven-latest (Maven)

For tasks, you can use the following URL:

- Docker: https://dataflow.spring.io/task-docker-latest
- Maven: https://dataflow.spring.io/task-maven-latest

Using the Data Flow UI, these links are included for pre-fill:

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
For each stream app, we provide separate exacutable applications for RabbitMQ and Kafka.

Currently available stream applications include:

| Source                                                                                         | Processor                                                                                                                   | Sink                                                                                                         |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [cdc-debezium](%stream-applications-doc%/#spring-cloud-stream-modules-cdc-debezium-source)     | [aggregator](%stream-applications-doc%/#spring-cloud-stream-modules-aggregator-processor)                                   | [cassandra](%stream-applications-doc%/#spring-cloud-stream-modules-cassandra-sink)                           |
| [file](%stream-applications-doc%/#spring-cloud-stream-modules-file-source)                     | [bridge](%stream-applications-doc%/#spring-cloud-stream-modules-bridge-processor)                                           | [counter](%stream-applications-doc%/#spring-cloud-stream-modules-counter-sink)                               |
| [ftp](%stream-applications-doc%/#spring-cloud-stream-modules-ftp-source)                       | [counter](%stream-applications-doc%/#spring-cloud-stream-modules-counter-processor)                                         | [file](%stream-applications-doc%/#spring-cloud-stream-modules-file-sink)                                     |
| [gemfire](%stream-applications-doc%/#spring-cloud-stream-modules-gemfire-source)               | [filter](%stream-applications-doc%/#spring-cloud-stream-modules-filter-processor)                                           | [ftp](%stream-applications-doc%/#spring-cloud-stream-modules-ftp-sink)                                       |
| [gemfire-cq](%stream-applications-doc%/#spring-cloud-stream-modules-gemfire-cq-source)         | [groovy-filter](%stream-applications-doc%/#spring-cloud-stream-modules-groovy-filter-processor)                             | [gemfire](%stream-applications-doc%/#spring-cloud-stream-modules-gemfire-sink)                               |
| [http](%stream-applications-doc%/#spring-cloud-stream-modules-http-source)                     | [groovy-transform](%stream-applications-doc%/#spring-cloud-stream-modules-groovy-transform-processor)                       | [hdfs](%stream-applications-doc%/#spring-cloud-stream-modules-hdfs-sink)                                     |
| [jdbc](%stream-applications-doc%/#spring-cloud-stream-modules-jdbc-source)                     | [grpc](%stream-applications-doc%/#spring-cloud-stream-modules-grpc-processor)                                               | [jdbc](%stream-applications-doc%/#spring-cloud-stream-modules-jdbc-sink)                                     |
| [jms](%stream-applications-doc%/#spring-cloud-stream-modules-jms-source)                       | [header-enricher](%stream-applications-doc%/#spring-cloud-stream-modules-header-enricher-processor)                         | [log](%stream-applications-doc%/#spring-cloud-stream-modules-log-sink)                                       |
| [load-generator](%stream-applications-doc%/#spring-cloud-stream-modules-load-generator-source) | [httpclient](%stream-applications-doc%/#spring-cloud-stream-modules-httpclient-processor)                                   | [mongodb](%stream-applications-doc%/#spring-cloud-stream-modules-mongodb-sink)                               |
| [loggregator](%stream-applications-doc%/#spring-cloud-stream-modules-loggregator-source)       | [image-recognition](%stream-applications-doc%/#spring-cloud-stream-modules-image-recognition-processor)                     | [mqtt](%stream-applications-doc%/#spring-cloud-stream-modules-mqtt-sink)                                     |
| [mail](%stream-applications-doc%/#spring-cloud-stream-modules-mail-source)                     | [object-detection](%stream-applications-doc%/#spring-cloud-stream-modules-object-detection-processor)                       | [pgcopy](%stream-applications-doc%/#spring-cloud-stream-modules-pgcopy-sink)                                 |
| [mongodb](%stream-applications-doc%/#spring-cloud-stream-modules-mongodb-source)               | [pmml](%stream-applications-doc%/#spring-cloud-stream-modules-pmml-processor)                                               | [rabbit](%stream-applications-doc%/#spring-cloud-stream-modules-rabbit-sink)                                 |
| [mqtt](%stream-applications-doc%/#spring-cloud-stream-modules-mqtt-source)                     | [pose-estimation](%stream-applications-doc%/#spring-cloud-stream-modules-pose-estimation-processor)                         | [redis-pubsub](%stream-applications-doc%/#spring-cloud-stream-modules-redis-pubsub-sink)                     |
| [rabbit](%stream-applications-doc%/#spring-cloud-stream-modules-rabbit-source)                 | [python-http](%stream-applications-doc%/#spring-cloud-stream-modules-python-http-processor)                                 | [router](%stream-applications-doc%/#spring-cloud-stream-modules-router-sink)                                 |
| [s3](%stream-applications-doc%/#spring-cloud-stream-modules-s3-source)                         | [python-jython](%stream-applications-doc%/#spring-cloud-stream-modules-python-jython-processor)                             | [s3](%stream-applications-doc%/#spring-cloud-stream-modules-s3-sink)                                         |
| [sftp](%stream-applications-doc%/#spring-cloud-stream-modules-sftp-source)                     | [scriptable-transform](%stream-applications-doc%/#spring-cloud-stream-modules-scriptable-transform-processor)               | [sftp](%stream-applications-doc%/#spring-cloud-stream-modules-sftp-sink)                                     |
| [sftp-dataflow](%stream-applications-doc%/#spring-cloud-stream-modules-sftp-dataflow-source)   | [splitter](%stream-applications-doc%/#spring-cloud-stream-modules-splitter-processor)                                       | [task-launcher-dataflow](%stream-applications-doc%/#spring-cloud-stream-modules-task-launcher-dataflow-sink) |
| [syslog](%stream-applications-doc%/#spring-cloud-stream-modules-syslog-source)                 | [tasklaunchrequest-transform](%stream-applications-doc%/#spring-cloud-stream-modules-tasklaunchrequest-transform-processor) | [tcp](%stream-applications-doc%/#spring-cloud-stream-modules-tcp-sink)                                       |
| [tcp](%stream-applications-doc%/#spring-cloud-stream-modules-tcp-source)                       | [tcp-client](%stream-applications-doc%/#spring-cloud-stream-modules-tcp-client-processor)                                   | [throughput](%stream-applications-doc%/#spring-cloud-stream-modules-throughput-sink)                         |
| [tcp-client](%stream-applications-doc%/#spring-cloud-stream-modules-tcp-client-source)         | [tensorflow](%stream-applications-doc%/#spring-cloud-stream-modules-tensorflow-processor)                                   | [websocket](%stream-applications-doc%/#spring-cloud-stream-modules-websocket-sink)                           |
| [time](%stream-applications-doc%/#spring-cloud-stream-modules-time-source)                     | [transform](%stream-applications-doc%/#spring-cloud-stream-modules-transform-processor)                                     |                                                                                                              |
| [trigger](%stream-applications-doc%/#spring-cloud-stream-modules-trigger-source)               | [twitter-sentiment](%stream-applications-doc%/#spring-cloud-stream-modules-twitter-sentiment-processor)                     |                                                                                                              |
| [triggertask](%stream-applications-doc%/#spring-cloud-stream-modules-triggertask-source)       |                                                                                                                             |                                                                                                              |
| [twitterstream](%stream-applications-doc%/#spring-cloud-stream-modules-twitterstream-source)   |                                                                                                                             |                                                                                                              |

## Task Applications

The Spring team develops and maintains [task/batch applications](https://cloud.spring.io/spring-cloud-task-app-starters/) and publishes these applications to the [Spring public Maven repository](https://repo.spring.io/release/org/springframework/cloud/task/app/) and to [Dockerhub](https://hub.docker.com/u/springcloudtask) in accordance with a planned release schedule, normally following significant Spring Boot, Spring Cloud Task, or Spring Batch releases.

Currently available task/batch applications include the following:

[timestamp](%task-applications-doc%/#spring-cloud-task-modules-tasks)<br/>
[timestamp-batch](%task-applications-doc%/#_timestamp_batch_task)

# Bulk Registration of Stream Applications

Spring Cloud Data Flow supports bulk registration of applications, via a standard properties file format.
For convenience, we publish static properties files with application-URIs (for either maven or docker) for all the out-of-the-box stream and task/batch apps.
You can use these files in Spring Cloud Data Flow to register all the application-URIs in bulk.
Alternately, you can register them individually or provide your own custom property file with only the required application-URIs in it.
Bulk registration is convenient for getting started with SCDF.
To reduce clutter, it is recommended, to maintain a “focused” list of desired application-URIs in a custom property file.

# Supported Spring Cloud Stream Applications

| Artifact Type     | Latest Stable Release                                                  | SNAPSHOT Release                                                           |
| ----------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------- |
|                   | spring-cloud-stream 2.1.x<br>spring-boot 2.1.x                         |
| RabbitMQ + Maven  | [%stream-app-rabbit-maven-latest%](%stream-app-rabbit-maven-latest%)   | [%stream-app-rabbit-maven-snapshot%](%stream-app-rabbit-maven-snapshot%)   |
| RabbitMQ + Docker | [%stream-app-rabbit-docker-latest%](%stream-app-rabbit-docker-latest%) | [%stream-app-rabbit-docker-snapshot%](%stream-app-rabbit-docker-snapshot%) |
| Kafka + Maven     | [%stream-app-kafka-maven-latest%](%stream-app-kafka-maven-latest%)     | [%stream-app-kafka-maven-snapshot%](%stream-app-kafka-maven-snapshot%)     |
| Kafka + Docker    | [%stream-app-kafka-docker-latest%](%stream-app-kafka-docker-latest%)   | [%stream-app-kafka-docker-snapshot%](%stream-app-kafka-docker-snapshot%)   |

# Supported Spring Cloud Task/Batch Applications

| Artifact Type | Latest Stable Release                                  | SNAPSHOT Release                                         |
| ------------- | ------------------------------------------------------ | -------------------------------------------------------- |
|               | spring-cloud-stream 2.1.x<br>spring-boot 2.1.x         |
| Maven         | [%task-app-maven-version%](%task-app-maven-version%)   | [%task-app-maven-snapshot%](%task-app-maven-snapshot%)   |
| Docker        | [%task-app-docker-version%](%task-app-docker-version%) | [%task-app-docker-snapshot%](%task-app-docker-snapshot%) |

The following table lists previous releases for reference only.
NOTE: These may no longer be supported (i.e. they depend on an EOL spring-boot release):

# Previous Releases of Stream Applications

| Artifact Type     | Previous Release                                                           |
| ----------------- | -------------------------------------------------------------------------- |
|                   | spring-cloud-stream 2.0.x<br>spring-boot 2.0.x                             |
| RabbitMQ + Maven  | [%stream-app-rabbit-maven-previous%](%stream-app-rabbit-maven-previous%)   |
| RabbitMQ + Docker | [%stream-app-rabbit-docker-previous%](%stream-app-rabbit-docker-previous%) |
| Kafka + Maven     | [%stream-app-kafka-maven-previous%](%stream-app-kafka-maven-previous%)     |
| Kafka + Docker    | [%stream-app-kafka-docker-previous%](%stream-app-kafka-docker-previous%)   |

# Previous Releases of Spring Cloud Task/Batch Applications

| Artifact Type | Previous Release                                         |
| ------------- | -------------------------------------------------------- |
|               | spring-cloud-stream 2.0.x<br>spring-boot 2.0.x           |
| Maven         | [%task-app-maven-previous%](%task-app-maven-previous%)   |
| Docker        | [%task-app-docker-previous%](%task-app-docker-previous%) |
