---
path: 'stream-developer-guides/streams/data-flow-stream/'
title: 'Streaming pipeline in Spring Cloud Data Flow'
description: 'Create and Deploy a Stream Processing Pipeline using Spring Cloud Data Flow'
---

# Stream Processing with Data Flow using RabbitMQ

In this section we will show how to register stream applications with Data Flow, create a Stream DSL, and deploy the stream to Cloud Foundry, Kubernetes and your local machine.

In the previous guide, we created `Source`, `Processor` and `Sink` streaming applications and deployed them as standalone applications on multiple platforms.
In this guide, we will register these applications with Data Flow, create a Stream DSL and deploy the stream to Cloud Foundry, Kubernetes, and your local machine.

## Development

All the sample applications from the previous guide are available as `maven` and `docker` artifacts at the `https://repo.spring.io` maven repository.

For the `UsageDetailSender` source:

```
maven://io.spring.dataflow.sample:usage-detail-sender-rabbit:0.0.1-SNAPSHOT
```

```
docker://springcloudstream/usage-detail-sender-rabbit:0.0.1-SNAPSHOT
```

For the `UsageCostProcessor` processor:

```
maven://io.spring.dataflow.sample:usage-cost-processor-rabbit:0.0.1-SNAPSHOT
```

```
docker://springcloudstream/usage-cost-processor-rabbit:0.0.1-SNAPSHOT
```

For the `UsageCostLogger` sink:

```
maven://io.spring.dataflow.sample:usage-cost-logger-rabbit:0.0.1-SNAPSHOT
```

```
docker://springcloudstream/usage-cost-logger-rabbit:0.0.1-SNAPSHOT
```

### The Data Flow Dashboard

Assuming Data Flow is [installed](%currentPath%/installation/) and running on one of the supported platforms, open your browser at `<data-flow-url>/dashboard`. Here, `<data-flow-url>` depends on the platform. Consult the [installation guide](%currentPath%/installation) to determining the base URL for your installation. If Data Flow is running on your local machine, go to http://localhost:9393/dashboard.

### Application Registration

Applications in Data Flow are registered as named resources so that they may be referenced when using the Data Flow DSL to configure and compose streaming pipelines.
Registration associates a logical application name and type with a physical resource, given by a URI.
The URI conforms to a [schema](http://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#spring-cloud-dataflow-register-stream-apps) and may represent a Maven artifact, a Docker image, or an actual `http(s)` or `file` URL.
Data Flow defines a some logical application types which indicate its role as a streaming component, a task, or a standalone application.
For streaming applications, as you might expect, we will use `Source`,`Processor`, and `Sink` types.

The Data Flow Dashboard will land on the Application Registration view where we will register the source, processor, and sink apps.

![Add an application](images/SCDF-add-applications.png)

In this step, we will register the applications we created previously.
When you register an application, you provide:

- it's location URI (maven, http, docker, file etc.,)
- application version
- application type (Source, Processor, Sink)
- application name

[[note]]
| If you are running Spring Cloud Data Flow server on the docker environment, make sure that your application artifact URIs are accessible.
|For instance, you may not be able to access `file:/` from SCDF/Skipper docker containers unless you have the application locations
|accessible. It is recommended to use `http://`, `maven://` or `docker://` for applications' URIs.

Let's assume you are running Spring Cloud Data Flow, Skipper servers running on your local development environment.

**TODO - the images are too small to see what to type.....**
**TODO - for k8s deployment, they will need to be docker:: , need to handle this so that users don't try to deploy maven:// registered artifact on docker.**

Register the `UsageDetailSender` source application:

From the Applications view, select `Add Application(s)`.
This will display a view to allow you to register applications.

![Register source application](images/SCDF-register-source-rabbit.png)

Select `Register one or more applications` and enter the `name`, `type`, and `URI` for the source application.

Click on `New application` to display another instance of the form to enter the values for the processor.

Register the `UsageCostProcessor` processor application:

![Register source application](images/SCDF-register-processor-rabbit.png)

Register the `UsageCostLogger` sink application:

![Register sink application](images/SCDF-register-sink-rabbit.png)

Click on `Register the application(s)` to complete the registration. This will take you back to the Applications view which lists your applications.

![Registered applications](images/SCDF-registered-apps.png)

### Create the Stream Definition

Select `Streams` from the left navigation bar. This will display the main Streams view.

![Create streams](images/SCDF-create-streams.png)

Select `Create stream(s)` to display a graphical editor to create the stream definition.

![Create usage cost logger stream](images/SCDF-create-usage-cost-logger-stream.png)

You will see the `Source`, `Processor` and `Sink` applications, as registered above, in the left panel. Drag and drop each app to the canvas and then use the handles to connect them together. Notice the equivalent Data Flow DSL definition in the top text panel. Click `Create Stream`.

## Deployment

Click on the arrow head icon to deploy the stream. This will take you to the Deploy Stream page from where you may enter additional deployment properties.

Select `Deploy Stream`.

![Stream created](images/SCDF-stream-created.png)

![Deploy stream](images/SCDF-deploy-stream.png)

When all the applications are running, the stream is successfully deployed.

![Stream deployed](images/SCDF-stream-deployed.png)

The process described above is basically the same for all platforms. The following sections addresses platform-specific details for deploying on Data Flow on Local, Cloud Foundry, and Kubernetes.

### Local

**NOTE** If you are deploying the stream on `local` environment, you need to set a unique value for the `server.port` application property for each application so that they can use different port on `local`.

Once the stream is deployed on `Local` development environment, you can look the runtime applications via Dashboard's runtime page or using the SCDF Shell command `runtime apps`.
The runtime applications show information about where each application is running in the local environment and their log files locations.

**NOTE** If you are running SCDF on docker, to access the log files of the streaming applications:

`docker exec <stream-application-docker-container-id> tail -f <stream-application-log-file>`

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

**TODO - not finished**

##### List the Pods

The following command (with output) shows how to list the pods.

    $ kubectl get pods
    NAME                              READY     STATUS    RESTARTS   AGE
    mystream-log-v1-0-2k4r8             1/1       Running   0          2m
    mystream-time-v1-qhdqq              1/1       Running   0          2m
    mysql-777890292-z0dsw          1/1       Running   0          49m
    rabbitmq-317767540-2qzrr       1/1       Running   0          49m
    scdf-server-2734071167-bjd3g   1/1       Running   0          12m
    skipper-2408247821-50z31       1/1       Running   0          15m

    ...
    ...

##### Verify the Logs

To be sure the steps in the previous sections have worked correctly, you
should verify the logs. The following example shows how to make sure
that the values you expect appear in the logs:

    $ kubectl logs -f mystream-log-v1-0-2k4r8
    ...
    ...
    2017-10-30 22:59:04.966  INFO 1 --- [ mystream.time.mystream-1] log-sink                                 : 10/30/17 22:59:04
    2017-10-30 22:59:05.968  INFO 1 --- [ mystream.time.mystream-1] log-sink                                 : 10/30/17 22:59:05
    2017-10-30 22:59:07.000  INFO 1 --- [ mystream.time.mystream-1] log-sink                                 : 10/30/17 22:59:06

## Comparison with standalone deployment

**Discuss what is being done behind the scenes to simplify the experience..make the case for data flow**
