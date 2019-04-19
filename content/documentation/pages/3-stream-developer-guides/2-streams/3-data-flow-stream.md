---
path: 'stream-developer-guides/streams/data-flow-stream/'
title: 'Streaming pipeline in Spring Cloud Data Flow'
description: 'Create and Deploy a Stream Processing Pipeline using Spring Cloud Data Flow'
---

# Stream Processing with Data Flow using RabbitMQ

In this section we will show how to register stream applications with Data Flow, create a Stream DSL, and deploy the stream to Cloud Foundry, Kubernetes and your local machine.

**TODO this guide is using the shell, I think we want the UI first, shell second in terms of priority...**

## Development

In the previous guide, we created `Source`, `Processor` and `Sink` streaming applications and deployed them as standalone applications on multiple platforms.
In this guide, we will create and deploy streaming data pipeline using these streaming applications using Data Flow using the Dashboard and the shell.

### Application Registration

Spring Cloud Data Flow server has an application registry for Spring Cloud Stream applications.
In this step, we will register the applications we created previously.
When you register an application, you provide:

- it's location URI (maven, http, docker, file etc.,)
- application version
- application type (Source, Processor, Sink)
- application name

**TODO: The node below needs to provide more detailed instructions of what to do for local file access with docs**

**TODO: the file:// approach won't work for CF and K8s.**

**TODO: We could show how to host a .jar on github**

**TODO: We should create the maven artifact and docker artifact for these OOTB apps so that they can perform the steps quickly without having to create a container or have a public maven repository available**

[[note]]
| If you are running Spring Cloud Data Flow server on the docker environment, make sure that your application artifact URIs are accessible.
|For instance, you may not be able to access `file:/` from SCDF/Skipper docker containers unless you have the application locations
|accessible. It is recommended to use `http://`, `maven://` or `docker://` for applications' URIs.

Let's assume you are running Spring Cloud Data Flow, Skipper servers running on your local development environment.

Register the `UsageDetailSender` source application:

```
app register --name usage-detail-sender --type source --uri file://<YOUR_GITHUB_CLONE_DIR>/spring-cloud/spring-cloud-dataflow-samples/dataflow-website/stream-developer-guides/streams/usage-detail-sender/target/usage-detail-sender-0.0.1-SNAPSHOT.jar
```

Register the `UsageCostProcessor` processor application:

```
app register --name usage-cost-processor --type processor --uri file://<YOUR_GITHUB_CLONE_DIR>/spring-cloud/spring-cloud-dataflow-samples/dataflow-website/stream-developer-guides/streams/usage-cost-processor/target/usage-cost-processor-0.0.1-SNAPSHOT.jar
```

Register the `UsageCostLogger` sink application:

```
app register --name usage-cost-logger --type sink --uri file://<YOUR_GITHUB_CLONE_DIR>/spring-cloud/spring-cloud-dataflow-samples/dataflow-website/stream-developer-guides/streams/usage-cost-logger/target/usage-cost-logger-0.0.1-SNAPSHOT.jar
```

### Create Stream DSL

Create a streaming pipeline that has the `Source`, `Processor` and `Sink` applications as registered above.

```
stream create usage-cost-logger --definition "usage-detail-sender | usage-cost-processor | usage-cost-logger"
```

### Validate Stream DSL

Make sure the app coordinates are correct for the stream.

The command:

```
stream validate usage-cost-logger
```

will show the following result:

```
╔═════════════════╤══════════════════════════════════════════════════════════════╗
║   Stream Name   │                      Stream Definition                       ║
╠═════════════════╪══════════════════════════════════════════════════════════════╣
║usage-cost-logger│usage-detail-sender | usage-cost-processor | usage-cost-logger║
╚═════════════════╧══════════════════════════════════════════════════════════════╝


usage-cost-logger is a valid stream.
╔══════════════════════════════╤═════════════════╗
║           App Name           │Validation Status║
╠══════════════════════════════╪═════════════════╣
║source:usage-detail-sender    │valid            ║
║processor:usage-cost-processor│valid            ║
║sink:usage-cost-logger        │valid            ║
╚══════════════════════════════╧═════════════════╝

```

## Deployment

Deploy to local, Cloud Foundry and Kubernetes

### Local

Deploy the stream:

**TODO: this won't work due to port collisions**

```
stream deploy usage-cost-logger
```

Once the stream is deployed on `Local` development environment, you can look the runtime applications via Dashboard's runtime page or using the SCDF Shell command `runtime apps`.
The runtime applications show information about where each application is running in the local environment and their log files locations.

```
2019-04-19 22:16:04.864  INFO 95238 --- [container-0-C-1] c.e.demo.UsageCostLoggerApplication      : {"userId": "Mark", "callCost": "0.17", "dataCost": "0.32800000000000007" }
2019-04-19 22:16:04.872  INFO 95238 --- [container-0-C-1] c.e.demo.UsageCostLoggerApplication      : {"userId": "Janne", "callCost": "0.20800000000000002", "dataCost": "0.298" }
2019-04-19 22:16:04.872  INFO 95238 --- [container-0-C-1] c.e.demo.UsageCostLoggerApplication      : {"userId": "Ilaya", "callCost": "0.175", "dataCost": "0.16150000000000003" }
2019-04-19 22:16:04.872  INFO 95238 --- [container-0-C-1] c.e.demo.UsageCostLoggerApplication      : {"userId": "Glenn", "callCost": "0.145", "dataCost": "0.269" }
2019-04-19 22:16:05.256  INFO 95238 --- [container-0-C-1] c.e.demo.UsageCostLoggerApplication      : {"userId": "Ilaya", "callCost": "0.083", "dataCost": "0.23800000000000002" }
2019-04-19 22:16:06.257  INFO 95238 --- [container-0-C-1] c.e.demo.UsageCostLoggerApplication      : {"userId": "Janne", "callCost": "0.251", "dataCost": "0.026500000000000003" }
2019-04-19 22:16:07.264  INFO 95238 --- [container-0-C-1] c.e.demo.UsageCostLoggerApplication      : {"userId": "Janne", "callCost": "0.15100000000000002", "dataCost": "0.08700000000000001" }
2019-04-19 22:16:08.263  INFO 95238 --- [container-0-C-1] c.e.demo.UsageCostLoggerApplication      : {"userId": "Sabby", "callCost": "0.10100000000000002", "dataCost": "0.33" }
2019-04
```

### Cloud Foundry

### Kubernetes

## Comparison with standalone deployment

**Discuss what is being done behind the scenes to simplify the experience..make the case for data flow**
