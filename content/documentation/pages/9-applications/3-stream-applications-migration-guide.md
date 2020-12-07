---
path: 'applications/migration'
title: 'Migration Guide for Pre-packaged Stream Applications'
description: 'Guide for migrating fom 2.x to 3.x Stream Applications'
keywords:
  - application
  - migration
  - pre-packaged
toc: true
summary: false
---

# Migrating from 2.x to 3.x Stream Applications

Recently, the Spring team [redesigned the pre-packaged stream applications](https://spring.io/blog/2020/07/13/introducing-java-functions-for-spring-cloud-stream-applications-part-0).
These will be released in bulk using calendar-based release names, such as `2020.0.0-M2`.
We also refer to the `3.x`(+) version, since stream applications included in these releases start with version `3.0.0`.
Along with many important enhancements, we introduced some changes that are incompatible with the `2.x` line. This means that existing Spring Cloud Data Flow stream definitions based on `2.x` applications do not translate directly to `3.x` applications. The following is a summary of changes that you need to be aware of when migrating `2.x` Spring Cloud Stream applications to `3.x`:

- Some applications have been renamed.
- In some cases, applications have been retired, replaced with equivalent functionality, or combined with other applications.
- Property prefixes have changed.
- In some cases, properties have been removed or added.
- All pre-built sources now support function composition.

<!--CAUTTION-->

We do not support pipelines that mix `2.x` and `3.x` applications.
They use different versions of the Spring Cloud Stream binder. Trying to combine them has been known to cause problems in some cases. If you have an existing data pipeline that requires an app that is not available in `3.x`, we recommend that you do not upgrade.

<!--END_CAUTION-->

## Application changes

The following applications have been retired, replaced, or renamed in the `3.x` line.
`None` in the replacement column indicates that the application will be discontinued, unless there is sufficient interest in the community.

| Retired                               | Replacement                                                                                                                                               |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| counter-processor                     | None                                                                                                                                                      |
| counter-sink                          | analytics-sink                                                                                                                                            |
| gemfire-cq-source                     | geode-source with cq option                                                                                                                               |
| gemfire-source                        | geode-source                                                                                                                                              |
| gemfire-sink                          | geode-sink                                                                                                                                                |
| groovy-filter-processor               | groovy-processor                                                                                                                                          |
| groovy-transform-processor            | groovy-processor                                                                                                                                          |
| grpc-processor                        | None                                                                                                                                                      |
| hdfs-sink                             | None                                                                                                                                                      |
| httpclient-processor                  | http-request-processor                                                                                                                                    |
| loggregator-source                    | None                                                                                                                                                      |
| pmml-processor                        | None                                                                                                                                                      |
| pose-estimation-processor             | None                                                                                                                                                      |
| python-http-processor                 | Use [Polyglot recipe](%currentPath%/recipes/polyglot/)                                                                                                    |
| python-jython-processor               | Use [Polyglot recipe](%currentPath%/recipes/polyglot/)                                                                                                    |
| redis-pubsub-sink                     | redis-sink                                                                                                                                                |
| scriptable-transform-processor        | script-processor                                                                                                                                          |
| sftp-dataflow-source                  | sftp-source with function composition                                                                                                                     |
| task-launcher-dataflow-sink           | tasklauncher-sink                                                                                                                                         |
| tasklaunchrequest-transform-processor | None                                                                                                                                                      |
| tcp-client-processor                  | None                                                                                                                                                      |
| tcp-client-source                     | None                                                                                                                                                      |
| tensorflow-processor                  | Custom app using [tensorflow-common](https://github.com/spring-cloud/stream-applications/blob/master/functions/common/tensorflow-common) function library |
| trigger-source                        | time-source                                                                                                                                               |
| triggertask-source                    | time-source                                                                                                                                               |
| twitter-sentiment-processor           | None                                                                                                                                                      |
| twitterstream-source                  | twitter-stream-source                                                                                                                                     |

## Property names

The following table provides a detailed comparison of property keys used for the `2.x` applications that have been ported to the `3.x` line with the same name. For some of these apps, all the properties are identical but have been included here for reference.

| Sources                                                                             | Processors                                                                                      | Sinks                                                                   |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [cdc-debezium-source](%currentPath%/applications/migration/cdc-debezium-source)     | [aggregator-processor](%currentPath%/applications/migration/aggregator-processor)               | [cassandra-sink](%currentPath%/applications/migration/cassandra-sink)   |
| [file-source](%currentPath%/applications/migration/file-source)                     | [filter-processor](%currentPath%/applications/migration/filter-processor)                       | [file-sink](%currentPath%/applications/migration/file-sink)             |
| [ftp-source](%currentPath%/applications/migration/ftp-source)                       | [header-enricher-processor](%currentPath%/applications/migration/header-enricher-processor)     | [ftp-sink](%currentPath%/applications/migration/ftp-sink)               |
| [http-source](%currentPath%/applications/migration/http-source)                     | [image-recognition-processor](%currentPath%/applications/migration/image-recognition-processor) | [jdbc-sink](%currentPath%/applications/migration/jdbc-sink)             |
| [jdbc-source](%currentPath%/applications/migration/jdbc-source)                     | [object-detection-processor](%currentPath%/applications/migration/object-detection-processor)   | [log-sink](%currentPath%/applications/migration/log-sink)               |
| [jms-source](%currentPath%/applications/migration/jms-source)                       | [splitter-processor](%currentPath%/applications/migration/splitter-processor)                   | [mondodb-sink](%currentPath%/applications/migration/mongodb-sink)       |
| [load-generator-source](%currentPath%/applications/migration/load-generator-source) |                                                                                                 | [mqtt-sink](%currentPath%/applications/migration/mqtt-sink)             |
| [mail-source](%currentPath%/applications/migration/mail-source)                     |                                                                                                 | [pgpcopy-sink](%currentPath%/applications/migration/pgcopy-sink)        |
| [mongodb-source](%currentPath%/applications/migration/mongodb-source)               |                                                                                                 | [rabbit-sink](%currentPath%/applications/migration/rabbit-sink)         |
| [mqtt-source](%currentPath%/applications/migration/mqtt-source)                     |                                                                                                 | [router-sink](%currentPath%/applications/migration/router-sink)         |
| [rabbit-source](%currentPath%/applications/migration/rabbit-source)                 |                                                                                                 | [s3-sink](%currentPath%/applications/migration/s3-sink)                 |
| [s3-source](%currentPath%/applications/migration/s3-source)                         |                                                                                                 | [sftp-sink](%currentPath%/applications/migration/sftp-sink)             |
| [sftp-source](%currentPath%/applications/migration/sftp-source)                     |                                                                                                 | [tcp-sink](%currentPath%/applications/migration/tcp-sink)               |
| [syslog-source](%currentPath%/applications/migration/syslog-source)                 |                                                                                                 | [throughput-sink](%currentPath%/applications/migration/throughput-sink) |
| [tcp-source](%currentPath%/applications/migration/tcp-source)                       |                                                                                                 | [websocket-sink](%currentPath%/applications/migration/websocket-sink)   |
| [time-source](%currentPath%/applications/migration/time-source)                     |                                                                                                 |                                                                         |

## Function Composition

The `3.x` stream applications are function-based, meaning that most of the logic is provided in a dependent artifact that exposes a functional interface.
This design lends itself to [function composition](https://github.com/spring-cloud/stream-applications/blob/master/docs/FunctionComposition.adoc). In fact, all of the pre-packaged sources include the necessary dependencies to support composition of functions to perform filtering, transformation, header enrichment, and the creation of task launch requests within the source app itself. Some examples are shown in the [time source tests](https://github.com/spring-cloud/stream-applications/blob/master/applications/source/time-source/src/test/java/org/springframework/cloud/stream/app/source/time/TimeSourceTests.java), and the [sftp source tests](https://github.com/spring-cloud/stream-applications/blob/master/applications/source/sftp-source/src/test/java/org/springframework/cloud/stream/app/source/sftp/SftpSourceTests.java).
