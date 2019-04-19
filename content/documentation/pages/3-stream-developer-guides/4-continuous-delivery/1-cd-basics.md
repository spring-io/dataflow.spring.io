---
path: 'stream-developer-guides/continuous-delivery/cd-basics/'
title: 'Continuous Delivery of streaming applications'
description: 'Continuous Delivery of Streaming applications'
---

# Introduction

The applications composed in the streaming dta pipeline will often need to be changed.
The change can be a new version of the application that fixes a bug or setting a different value of an application property.
To avoid downtime from stream processing, we would like to do a rolling upgrade of just the applications in the stream that have changed.
Furthermore, should the upgrade not be what is desired, a quick rollback to a previous version of the application should be easy to perform.

Spring Cloud Data Flow provides support for continuous delivery of event streaming applications via the Skipper server.

To demonstrate this, lets use some of the out of the box streaming applications that were already registered when installing Data Flow.
We will showcase this functionality using the local platform, which uses Kafka by default when installing via docker compose.

## Stream create and deploy

Create and deploy a stream that has source which ingests `http` events and the `transform` processor that applies a transformation logic and the `log` sink that shows the result of the transformed events.

**TODO the port is there I presume because it for local server, but transform and log don't have server port's specified**

**TODO do we want to show this in the UI, for this case the shell seems to get the point across very effectively.**

```
stream create http-ingest --definition "http --server.port=9000 | transform --expression=payload.toUpperCase() | log" --deploy
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

Post some data from the Spring Cloud Data Flow shell:

```
http post --target "http://localhost:9000" --data "spring"
```

From the log file of the `log` application, you will see the following:

```
log-sink                                 :  SPRING
```

The command `stream manifest http-events-transformer` shows all the applications and their properties for this version fo the the stream.

```
stream manifest http-events-transformer
```

**TODO highlight version line numbers**
You can see the following result:

```
"apiVersion": "skipper.spring.io/v1"
"kind": "SpringCloudDeployerApplication"
"metadata":
  "name": "log"
"spec":
  "resource": "maven://org.springframework.cloud.stream.app:log-sink-kafka:jar"
  "resourceMetadata": "maven://org.springframework.cloud.stream.app:log-sink-kafka:jar:jar:metadata:2.1.1.RELEASE"
  "version": "2.1.1.RELEASE"
  "applicationProperties":
    "spring.cloud.dataflow.stream.app.label": "log"
    "management.metrics.export.influx.uri": "http://influxdb:8086"
    "spring.cloud.stream.kafka.streams.binder.zkNodes": "zookeeper:2181"
    "spring.cloud.stream.metrics.properties": "spring.application.name,spring.application.index,spring.cloud.application.*,spring.cloud.dataflow.*"
    "spring.cloud.dataflow.stream.name": "http-events-transformer"
    "spring.cloud.stream.kafka.streams.binder.brokers": "PLAINTEXT://kafka:9092"
    "spring.metrics.export.triggers.application.includes": "integration**"
    "spring.cloud.stream.metrics.key": "http-events-transformer.log.${spring.cloud.application.guid}"
    "spring.cloud.stream.bindings.input.group": "http-events-transformer"
    "management.metrics.export.influx.enabled": "true"
    "management.metrics.export.influx.db": "myinfluxdb"
    "spring.cloud.stream.kafka.binder.zkNodes": "zookeeper:2181"
    "spring.cloud.dataflow.stream.app.type": "sink"
    "spring.cloud.stream.bindings.input.destination": "http-events-transformer.transform"
    "spring.cloud.stream.kafka.binder.brokers": "PLAINTEXT://kafka:9092"
  "deploymentProperties":
    "spring.cloud.deployer.group": "http-events-transformer"
---
"apiVersion": "skipper.spring.io/v1"
"kind": "SpringCloudDeployerApplication"
"metadata":
  "name": "http"
"spec":
  "resource": "maven://org.springframework.cloud.stream.app:http-source-kafka:jar"
  "resourceMetadata": "maven://org.springframework.cloud.stream.app:http-source-kafka:jar:jar:metadata:2.1.0.RELEASE"
  "version": "2.1.0.RELEASE"
  "applicationProperties":
    "spring.cloud.dataflow.stream.app.label": "http"
    "management.metrics.export.influx.uri": "http://influxdb:8086"
    "spring.cloud.stream.kafka.streams.binder.zkNodes": "zookeeper:2181"
    "spring.cloud.stream.metrics.properties": "spring.application.name,spring.application.index,spring.cloud.application.*,spring.cloud.dataflow.*"
    "spring.cloud.dataflow.stream.name": "http-events-transformer"
    "spring.cloud.stream.kafka.streams.binder.brokers": "PLAINTEXT://kafka:9092"
    "spring.metrics.export.triggers.application.includes": "integration**"
    "spring.cloud.stream.metrics.key": "http-events-transformer.http.${spring.cloud.application.guid}"
    "spring.cloud.stream.bindings.output.producer.requiredGroups": "http-events-transformer"
    "server.port": "9000"
    "management.metrics.export.influx.enabled": "true"
    "management.metrics.export.influx.db": "myinfluxdb"
    "spring.cloud.stream.bindings.output.destination": "http-events-transformer.http"
    "spring.cloud.stream.kafka.binder.zkNodes": "zookeeper:2181"
    "spring.cloud.dataflow.stream.app.type": "source"
    "spring.cloud.stream.kafka.binder.brokers": "PLAINTEXT://kafka:9092"
  "deploymentProperties":
    "spring.cloud.deployer.group": "http-events-transformer"
---
"apiVersion": "skipper.spring.io/v1"
"kind": "SpringCloudDeployerApplication"
"metadata":
  "name": "transform"
"spec":
  "resource": "maven://org.springframework.cloud.stream.app:transform-processor-kafka:jar"
  "resourceMetadata": "maven://org.springframework.cloud.stream.app:transform-processor-kafka:jar:jar:metadata:2.1.0.RELEASE"
  "version": "2.1.0.RELEASE"
  "applicationProperties":
    "spring.cloud.dataflow.stream.app.label": "transform"
    "management.metrics.export.influx.uri": "http://influxdb:8086"
    "spring.cloud.stream.kafka.streams.binder.zkNodes": "zookeeper:2181"
    "spring.cloud.stream.metrics.properties": "spring.application.name,spring.application.index,spring.cloud.application.*,spring.cloud.dataflow.*"
    "spring.cloud.dataflow.stream.name": "http-events-transformer"
    "spring.cloud.stream.kafka.streams.binder.brokers": "PLAINTEXT://kafka:9092"
    "spring.metrics.export.triggers.application.includes": "integration**"
    "spring.cloud.stream.metrics.key": "http-events-transformer.transform.${spring.cloud.application.guid}"
    "spring.cloud.stream.bindings.input.group": "http-events-transformer"
    "transformer.expression": "payload.toUpperCase()"
    "spring.cloud.stream.bindings.output.producer.requiredGroups": "http-events-transformer"
    "management.metrics.export.influx.enabled": "true"
    "management.metrics.export.influx.db": "myinfluxdb"
    "spring.cloud.stream.bindings.output.destination": "http-events-transformer.transform"
    "spring.cloud.stream.kafka.binder.zkNodes": "zookeeper:2181"
    "spring.cloud.dataflow.stream.app.type": "processor"
    "spring.cloud.stream.bindings.input.destination": "http-events-transformer.http"
    "spring.cloud.stream.kafka.binder.brokers": "PLAINTEXT://kafka:9092"
  "deploymentProperties":
    "spring.cloud.deployer.group": "http-events-transformer"

```

For instance, you can see the `transform` application has the property "transformer.expression": "payload.toUpperCase()".
The command `stream history http-events-transformer` shows the history for this event stream, listing all the available versions.

```
stream history --name http-events-transformer
```

```
╔═══════╤════════════════════════════╤════════╤═══════════════════════╤═══════════════╤════════════════╗
║Version│        Last updated        │ Status │     Package Name      │Package Version│  Description   ║
╠═══════╪════════════════════════════╪════════╪═══════════════════════╪═══════════════╪════════════════╣
║1      │Fri Apr 19 20:51:48 IST 2019│DEPLOYED│http-events-transformer│1.0.0          │Install complete║
╚═══════╧════════════════════════════╧════════╧═══════════════════════╧═══════════════╧════════════════╝
```

## Stream Update

If you want to update the existing deployed stream to use a different version of the `log` application, you can perform stream `update` action.

First, you can register the required version of the `log` application:

```
app register --name log --type sink --uri maven://org.springframework.cloud.stream.app:log-sink-kafka:2.1.0.RELEASE
```

and perform the stream update as follows:

```
stream update --name http-events-transformer --properties "app.log.version=2.1.0.RELEASE"
```

Once the stream update is completed, you can verify the `stream manifest` to see if the version of the `log` application is changed.

```
dataflow:>stream manifest http-events-transformer
```

**TODO need to line highlight what has changed....maybe cut off the rest of the application properties...so noisy**

**TODO showing the output of a jps command where the java process is running helps to really show that the app has been updated to a new version number.**

```
"apiVersion": "skipper.spring.io/v1"
"kind": "SpringCloudDeployerApplication"
"metadata":
  "name": "log"
"spec":
  "resource": "maven://org.springframework.cloud.stream.app:log-sink-kafka:jar"
  "resourceMetadata": "maven://org.springframework.cloud.stream.app:log-sink-kafka:jar:jar:metadata:2.1.0.RELEASE"
  "version": "2.1.0.RELEASE"
  "applicationProperties":
    "spring.cloud.dataflow.stream.app.label": "log"
    "management.metrics.export.influx.uri": "http://influxdb:8086"
    "spring.cloud.stream.kafka.streams.binder.zkNodes": "zookeeper:2181"
    "spring.cloud.stream.metrics.properties": "spring.application.name,spring.application.index,spring.cloud.application.*,spring.cloud.dataflow.*"
    "spring.cloud.dataflow.stream.name": "http-events-transformer"
    "version": "2.1.0.RELEASE"
    "spring.cloud.stream.kafka.streams.binder.brokers": "PLAINTEXT://kafka:9092"
    "spring.metrics.export.triggers.application.includes": "integration**"
    "spring.cloud.stream.metrics.key": "http-events-transformer.log.${spring.cloud.application.guid}"
    "spring.cloud.stream.bindings.input.group": "http-events-transformer"
    "management.metrics.export.influx.enabled": "true"
    "management.metrics.export.influx.db": "myinfluxdb"
    "spring.cloud.stream.kafka.binder.zkNodes": "zookeeper:2181"
    "spring.cloud.dataflow.stream.app.type": "sink"
    "spring.cloud.stream.bindings.input.destination": "http-events-transformer.transform"
    "spring.cloud.stream.kafka.binder.brokers": "PLAINTEXT://kafka:9092"
  "deploymentProperties":
    "spring.cloud.deployer.count": "1"
    "spring.cloud.deployer.group": "http-events-transformer"
---
...
...

```

```
stream history --name http-events-transformer
```

```
╔═══════╤════════════════════════════╤════════╤═══════════════════════╤═══════════════╤════════════════╗
║Version│        Last updated        │ Status │     Package Name      │Package Version│  Description   ║
╠═══════╪════════════════════════════╪════════╪═══════════════════════╪═══════════════╪════════════════╣
║2      │Fri Apr 19 21:00:03 IST 2019│DEPLOYED│http-events-transformer│1.0.0          │Upgrade complete║
║1      │Fri Apr 19 20:51:48 IST 2019│DELETED │http-events-transformer│1.0.0          │Delete complete ║
╚═══════╧════════════════════════════╧════════╧═══════════════════════╧═══════════════╧════════════════╝
```

You can also change the configuration properties of the application without using the new version of the app.
Let’s say you want to change the transformation logic used in the `transform` application without redeploying the entire stream and update the `transform` application in isolation.

```
stream update http-events-transformer --properties "app.transform.expression=payload.toUpperCase().concat('!!!')"
```

When you run the `stream manifest http-events-transformer` command again, you will see the `transform` application is now changed to include the expression property, which transforms each of the payloads by appending !!! at the end.

Let’s test the update:

```
http post --target "http://localhost:9000" --data "spring"
```

From `log` application's log file, you will now see the following:

```
log-sink                                 : SPRING!!!
```

The command `stream history http-events-transformer` will include the new event in the history of this stream.

## Stream Rollback

If you want to roll back the event stream to a specific version, you can use the command `stream rollback http-events-transformer --releaseVersion <release-version>`.

After rolling back to the initial version of the event stream (where the `transform` application just did uppercase conversion):

```
stream rollback http-events-transformer --releaseVersion 1
```

```
http post --target "http://localhost:9000" --data "spring"
```

In the `log` application's log file, you will now see:

```
log-sink : SPRING
```

### UI

TBD
