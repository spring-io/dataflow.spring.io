---
path: 'stream-developer-guides/getting-started/simple-stream'
title: 'Simple Stream'
description: 'Create and Deploy a simple streaming pipeline '
---

# Introduction

Spring Cloud Data Flow provides a list of streaming applications that you can use out of the box and address some of the common streaming use cases.
You can also extend from these out of the box applications or create your custom applications.
All the out-of-the-box streaming applications are:

- Available as Apache Maven artifacts or Docker images
- RabbitMQ or the Apache Kafka binder implementation libraries in their classpath
- Micrometer support for Prometheus and InfluxDB metrics

## Registering the out of the box applications

When registering the out of the box streaming applications, you can choose your artifact type `Maven` or `Docker` depending on the target platform.
The `Local` development and the `CloudFoundry` platform support both `Maven` and `Docker` applications.
The `Kubernetes` platform supports only `Docker` based applications.

You can also choose the messaging middleware or the streaming platform: either `RabbitMQ` or `Apache Kafka`.

### Registering applications using the Dashboard UI

### Registering out of the box streaming applications using the Shell

If you are using `RabbitMQ` as the messaging middleware and `maven` artifacts:

```
app import --uri  http://bit.ly/Einstein-SR2-stream-applications-rabbit-maven
```

If you are using `RabbitMQ` as the messaging middleware and `docker` images:

```
app import --uri  http://bit.ly/Einstein-SR2-stream-applications-rabbit-docker
```

If you are using `Kafka` as the Streaming platform and `maven` artifacts:

```
app import --uri  http://bit.ly/Einstein-SR2-stream-applications-kafka-maven
```

If you are using `Kafka` as the Streaming platform and `docker` images:

```
app import --uri  http://bit.ly/Einstein-SR2-stream-applications-kafka-docker
```

## Create the stream

Spring Cloud Data Flow provides a Domain Specific Language (DSL) for creating a stream pipeline.
The individual applications inside the streaming pipeline are connected via a `|` symbol.
This pipe symbol is the logical representation of the messaging middleware or the streaming platform you would use to connect your applications in the streaming pipeline.
For instance, the stream DSL `time | log` represents `time` application sending timestamp data to the messaging middleware and the `log` application receiving the timestamp data from the messaging middleware.

### Streaming data pipeline configuration

The streaming data pipeline can have configuration properties at:

- application level
- deployer level

The `application` properties are applied as the configuration for each individual application.
The `application` properties can be set during the stream `creation` or the `deployment` time.
When set during the stream `deployment`, these properties need to be prefixed with `app.<application-name>`

The `deployer` properties are specific to the target deployment platform `Local`, `CloudFoundry` or `Kubernetes`.
The `deployer` properties can be set only when deploying the stream.
These properties need to be prefixed with `deployer.<application-name>`

Let's create a stream that ingests incoming HTTP events (Source) into a logging application (Sink).

The stream DSL `http --server.port=9000 | log` can represent the streaming pipeline that has `http` source application ingesting http events into `log` sink application.
The symbol `|` represents the messaging middleware or the streaming platform that connects the `http` application to `log` application.
The property `server.port` is the `http` application properties set at the stream creation.

## Dashboard UI

Screen shots here

## Shell

### Stream Creation

To create the stream definition:

```
stream create http-ingest --definition "http --server.port=9000 | log"
```

### Stream Deployment

To the deploy the stream:

```
stream deploy http-ingest
```

You can verify stream status from the `stream list` command.

```
stream list
```

```
╔═══════════╤═════════════════════════════╤═════════════════════════════════════════╗
║Stream Name│      Stream Definition      │                 Status                  ║
╠═══════════╪═════════════════════════════╪═════════════════════════════════════════╣
║http-ingest│http --server.port=9000 | log│The stream is being deployed             ║
╚═══════════╧═════════════════════════════╧═════════════════════════════════════════╝
```

```
stream list
```

```
╔═══════════╤═════════════════════════════╤═════════════════════════════════════════╗
║Stream Name│      Stream Definition      │                 Status                  ║
╠═══════════╪═════════════════════════════╪═════════════════════════════════════════╣
║http-ingest│http --server.port=9000 | log│The stream has been successfully deployed║
╚═══════════╧═════════════════════════════╧═════════════════════════════════════════╝
```

Once the stream is deployed and running, you can now post some `HTTP` events:

```
http post --data "Happy streaming" --target http://localhost:9000

```

If the HTTP POST is successfully sent, you will the response as follows:

```
> POST (text/plain) http://localhost:9000 Happy streaming
> 202 ACCEPTED
```

Now, you can check the `runtime apps` to see the running applications and get the `stdout` log file for the `log` sink application to see the consumed message from the `http` source application.

```
runtime apps
```

Depending on the target runtime environment, you will have to access the `stdout` log file of the `log` application.

#### Local Depoloyment

If the stream is deployed on `Local` development environment, the runtime applications show information about where each application is running in the local environment and their log files locations.

**NOTE** If you are running SCDF on docker, to access the log files of the streaming applications:

`docker exec <stream-application-docker-container-id> tail -f <stream-application-log-file>`

#### Cloud Foundry

#### Kubernetes

### Verification

Once you are able to access the `stdout` file of the `log` application, you will see the message posted from the `http` source application in there:

```
log-sink                                 : Happy streaming
```
