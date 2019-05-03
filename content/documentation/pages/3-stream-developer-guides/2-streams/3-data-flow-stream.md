---
path: 'stream-developer-guides/streams/data-flow-stream/'
title: 'Streaming pipeline in Spring Cloud Data Flow'
description: 'Create and Deploy a Stream Processing Pipeline using Spring Cloud Data Flow'
---

# Stream Processing with Data Flow using RabbitMQ

In this section we will show how to register stream applications with Data Flow, create a Stream DSL, and deploy the stream to Cloud Foundry, Kubernetes and your local machine.

## Development

In the previous guide, we created `Source`, `Processor` and `Sink` streaming applications and deployed them as standalone applications on multiple platforms.
In this guide, we will create and deploy streaming data pipeline using these streaming applications using the Data Flow Dashboard.

### The Data Flow Dashboard

Assuming Data Flow is [installed](%currentPath%/installation/) and running on one of the supported platforms, open your browser at `<data-flow-url>/dashboard`. Here, `<data-flow-url>` depends on the platform. Consult the [installation guide](%currentPath%/installation) to determining the base URL for your installation. If Data Flow is running on your local machine, go to http://localhost:9393/dashboard.

### Application Registration

The Data Flow Dashboard will land on the Application Registration view where we will register the source, processor, and sink apps.

![Add an application](images/SCDF-add-applications.png)

#### Application Registration Concepts

Applications in Data Flow are registered as named resources so that they may be referenced when using the Data Flow DSL to configure and compose streaming pipelines.
Registration associates a logical application name and type with a physical resource, given by a URI.
The URI conforms to a [schema](http://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#spring-cloud-dataflow-register-stream-apps) and may represent a Maven artifact, a Docker image, or an actual `http(s)` or `file` URL.
Data Flow defines a some logical application types which indicate its role as a streaming component, a task, or a standalone application.
For streaming applications, as you might expect, we will use `Source`,`Processor`, and `Sink` types.

### Application Registration

Spring Cloud Data Flow server has an application registry for Spring Cloud Stream applications.
In this step, we will register the applications we created previously.
When you register an application, you provide:

- it's location URI (maven, http, docker, file etc.,)
- application version
- application type (Source, Processor, Sink)
- application name

**TODO: We should create the maven artifact and docker artifacts for these 'custom' apps so that they can perform the steps quickly without having to create a container or have a public maven repository available**

[[note]]
| If you are running Spring Cloud Data Flow server on the docker environment, make sure that your application artifact URIs are accessible.
|For instance, you may not be able to access `file:/` from SCDF/Skipper docker containers unless you have the application locations
|accessible. It is recommended to use `http://`, `maven://` or `docker://` for applications' URIs.

Let's assume you are running Spring Cloud Data Flow, Skipper servers running on your local development environment.

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

### Deploy the Stream

Click on the arrow head icon to deploy the stream. This will take you to the Deploy Stream page from where you may enter additional deployment properties. For this example we don't need any additional properties, so just select `Deploy stream`.

![Stream created](images/SCDF-stream-created.png)

![Deploy stream](images/SCDF-deploy-stream.png)

When all the applications are running, the stream is successfully deployed.

![Stream deployed](images/SCDF-stream-deployed.png)

## Deployment

The process described above is basically the same for all platforms. This section addresses platform-specific details for installing and configuring Data Flow on Local, Cloud Foundry, and Kubernetes platforms, and interacting with applications deployed to these platforms.

### Local

Deploy the stream:

**TODO: add deployer properties so that each app gets a different port**

```
stream deploy usage-cost-logger
```

Once the stream is deployed on `Local` development environment, you can look the runtime applications via Dashboard's runtime page or using the SCDF Shell command `runtime apps`.
The runtime applications show information about where each application is running in the local environment and their log files locations.

**TODO: Add back in the instruction on how get the logs when using the docker-compose local installation**

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

### Kubernetes (Old Content)

**TODO this was cut-n-pasted from the getting started guide. Much can be removed and some can move to the CF section**

#### Deploying Streams

This section covers how to deploy streams with Spring Cloud Data Flow
and Skipper. For more about Skipper, see
<https://cloud.spring.io/spring-cloud-skipper>.

We assume that Spring Cloud Data Flow, [Spring Cloud
Skipper](#getting-started-kubernetes.adoc#getting-started-kubernetes-deploy-services-and-data-flow),
an RDBMS, and your desired messaging middleware is running in Minikube.
We use RabbitMQ as the messaging middleware.

Before you get started, you can see what applications are running. The
following example (with output) shows how to do so:

    $ kubectl get all
    NAME                              READY     STATUS    RESTARTS   AGE
    po/mysql-777890292-z0dsw          1/1       Running   0          38m
    po/rabbitmq-317767540-2qzrr       1/1       Running   0          38m
    po/scdf-server-2734071167-bjd3g   1/1       Running   0          48s
    po/skipper-2408247821-50z31       1/1       Running   0          3m

    ...
    ...

#### Creating Streams

This section describes how to create streams (by using Skipper). The
following sections describe how to do so:

1.  [section_title](#getting-started-kubernetes-create-stream-download-scdf-shell)

2.  [section_title](#getting-started-kubernetes-create-stream-run-scdf-shell)

3.  [section_title](#getting-started-kubernetes-create-stream-verify-registered-platforms-skipper)

4.  [section_title](#getting-started-kubernetes-create-stream-register-docker-images-rabbit-binder-apps)

5.  [section_title](#getting-started-kubernetes-create-stream-create-stream-shell)

6.  [section_title](#getting-started-kubernetes-create-stream-deploy-stream)

7.  [section_title](#getting-started-kubernetes-create-stream-list-pods)

8.  [section_title](#getting-started-kubernetes-create-stream-verify-logs)

9.  [section_title](#getting-started-kubernetes-create-stream-verify-stream-history)

10. [section_title](#getting-started-kubernetes-create-stream-verify-package-manifest)

11. [section_title](#getting-started-kubernetes-create-stream-register-logsink-app)

12. [section_title](#getting-started-kubernetes-create-stream-update-stream)

13. [section_title](#getting-started-kubernetes-create-stream-list-pods-again)

14. [section_title](#getting-started-kubernetes-create-stream-verify-logs-again)

15. [section_title](#getting-started-kubernetes-create-stream-view-updated-package-manifest)

16. [section_title](#getting-started-kubernetes-create-stream-verify-stream-history-again)

##### Download the Spring Cloud Data Flow Shell

To download the Spring Cloud Data Flow shell, run the following command:

    wget https://repo.spring.io/{version-type-lowercase}/org/springframework/cloud/spring-cloud-dataflow-shell/{project-version}/spring-cloud-dataflow-shell-{project-version}.jar

##### Run the Spring Cloud Data Flow Shell

To run the Spring Cloud Data Flow shell, run the following command:

    java -jar spring-cloud-dataflow-shell-{project-version}.jar

You should see the following startup message from the shell:

      ____                              ____ _                __
     / ___| _ __  _ __(_)_ __   __ _   / ___| | ___  _   _  __| |
     \___ \| '_ \| '__| | '_ \ / _` | | |   | |/ _ \| | | |/ _` |
      ___) | |_) | |  | | | | | (_| | | |___| | (_) | |_| | (_| |
     |____/| .__/|_|  |_|_| |_|\__, |  \____|_|\___/ \__,_|\__,_|
      ____ |_|    _          __|___/                 __________
     |  _ \  __ _| |_ __ _  |  ___| | _____      __  \ \ \ \ \ \
     | | | |/ _` | __/ _` | | |_  | |/ _ \ \ /\ / /   \ \ \ \ \ \
     | |_| | (_| | || (_| | |  _| | | (_) \ V  V /    / / / / / /
     |____/ \__,_|\__\__,_| |_|   |_|\___/ \_/\_/    /_/_/_/_/_/

    {scdf-core-version}

    Welcome to the Spring Cloud Data Flow shell. For assistance hit TAB or type "help".
    server-unknown:>

You can connect the Shell to a Data Flow Server running on different
host. To do so, use the `kubectl get svc scdf-server` command to
retrieve the `EXTERNAL-IP` assigned to `scdf-server` and use that to
connect from the shell. The following example shows how to get the
external IP address:

    kubectl get svc scdf-server
    NAME         CLUSTER-IP       EXTERNAL-IP       PORT(S)    AGE
    scdf-server  10.103.246.82    130.211.203.246   80/TCP     4m

In the preceding example, the URL to use is `https://130.211.203.246`.

If you use Minikube, you do not have an external load balancer and the
EXTERNAL-IP column shows `<pending>`. You need to use the NodePort
assigned for the `scdf` service. The following example (with output)
shows how to look up the URL to use:

    $ minikube service --url scdf-server
    https://192.168.99.100:31991

The following example (with output) shows how to configure the Data Flow
server URI (with the default user and password settings):

    server-unknown:>dataflow config server --uri https://130.211.203.246
    Successfully targeted https://130.211.203.246
    dataflow:>

Alternatively, you can use the `--dataflow.uri` command line option. The
shell’s `--help` command line option shows what is available.

> **Note**
>
> If you use Minikube, you must include the port — for example:
> `dataflow config server --uri https://192.168.99.100:31991`

##### Verify the Registered Platforms in Skipper

To verify the registered platforms in Skipper, you can run the
`stream platform-list` command, as the following example (with output)
shows:

    dataflow:>stream platform-list
    ╔════════╤══════════╤════════════════════════════════════════════════════════════════════════════════════════════════╗
    ║  Name  │   Type   │                                      Description                                               ║
    ╠════════╪══════════╪════════════════════════════════════════════════════════════════════════════════════════════════╣
    ║default │kubernetes│master url == [https://kubernetes.default.svc/], namespace == [default], api version == [v1]    ║
    ╚════════╧══════════╧════════════════════════════════════════════════════════════════════════════════════════════════╝

##### Register the Docker Images of the Rabbit Binder-based Applications

You need to Register the Docker images of the Rabbit binder-based `time`
and `log` apps by using the shell.

You should start by deploying a stream with the `time-source` pointing
to the 1.3.0.RELEASE and `log-sink` pointing to the 1.2.0.RELEASE. The
goal is to perform a rolling upgrade of the `log-sink` application to
1.3.0.RELEASE. The following multi-step example (with output after each
command) shows how to do so:

    dataflow:>app register --type source --name time --uri docker://springcloudstream/time-source-rabbit:2.0.1.RELEASE --metadata-uri maven://org.springframework.cloud.stream.app:time-source-rabbit:jar:metadata:2.0.1.RELEASE
    Successfully registered application 'source:time'

    dataflow:>app register --type sink --name log --uri docker://springcloudstream/log-sink-rabbit:2.0.1.RELEASE --metadata-uri maven://org.springframework.cloud.stream.app:log-sink-rabbit:jar:metadata:2.0.1.RELEASE
    Successfully registered application 'sink:log'

    dataflow:>app info time --type source
    Information about source application 'time':
    Version: '2.0.1.RELEASE':
    Default application version: 'true':
    Resource URI: docker://springcloudstream/time-source-rabbit:2.0.1.RELEASE
    ╔══════════════════════════════╤══════════════════════════════╤══════════════════════════════╤══════════════════════════════╗
    ║         Option Name          │         Description          │           Default            │             Type             ║
    ╠══════════════════════════════╪══════════════════════════════╪══════════════════════════════╪══════════════════════════════╣
    ║trigger.time-unit             │The TimeUnit to apply to delay│<none>                        │java.util.concurrent.TimeUnit ║
    ║                              │values.                       │                              │                              ║
    ║trigger.fixed-delay           │Fixed delay for periodic      │1                             │java.lang.Integer             ║
    ║                              │triggers.                     │                              │                              ║
    ║trigger.cron                  │Cron expression value for the │<none>                        │java.lang.String              ║
    ║                              │Cron Trigger.                 │                              │                              ║
    ║trigger.initial-delay         │Initial delay for periodic    │0                             │java.lang.Integer             ║
    ║                              │triggers.                     │                              │                              ║
    ║trigger.max-messages          │Maximum messages per poll, -1 │1                             │java.lang.Long                ║
    ║                              │means infinity.               │                              │                              ║
    ║trigger.date-format           │Format for the date value.    │<none>                        │java.lang.String              ║
    ╚══════════════════════════════╧══════════════════════════════╧══════════════════════════════╧══════════════════════════════╝

    dataflow:>app info log --type sink
    Information about sink application 'log':
    Version: '2.0.1.RELEASE':
    Default application version: 'true':
    Resource URI: docker://springcloudstream/log-sink-rabbit:2.0.1.RELEASE
    ╔══════════════════════════════╤══════════════════════════════╤══════════════════════════════╤══════════════════════════════╗
    ║         Option Name          │         Description          │           Default            │             Type             ║
    ╠══════════════════════════════╪══════════════════════════════╪══════════════════════════════╪══════════════════════════════╣
    ║log.name                      │The name of the logger to use.│<none>                        │java.lang.String              ║
    ║log.level                     │The level at which to log     │<none>                        │org.springframework.integratio║
    ║                              │messages.                     │                              │n.handler.LoggingHandler$Level║
    ║log.expression                │A SpEL expression (against the│payload                       │java.lang.String              ║
    ║                              │incoming message) to evaluate │                              │                              ║
    ║                              │as the logged message.        │                              │                              ║
    ╚══════════════════════════════╧══════════════════════════════╧══════════════════════════════╧══════════════════════════════╝

> **Note**
>
> For Kafka binder application registration may look like the following:

    dataflow:>app register --type source --name time --uri docker://springcloudstream/time-source-kafka:{docker-time-source-kafka-version} --metadata-uri maven://org.springframework.cloud.stream.app:time-source-kafka:jar:metadata:{docker-time-source-kafka-version}
    dataflow:>app register --type sink --name log --uri docker://springcloudstream/log-sink-kafka:{docker-log-sink-kafka-version} --metadata-uri maven://org.springframework.cloud.stream.app:log-sink-kafka:jar:metadata:{docker-log-sink-kafka-version}

Alternatively, if you want to register all out-of-the-box stream
applications for a particular binder in bulk, you can use one of the
following commands:

- RabbitMQ:
  `dataflow:>app import --uri https://bit.ly/Einstein-SR2-stream-applications-rabbit-docker`

- Kafka:
  `dataflow:>app import --uri https://bit.ly/Einstein-SR2-stream-applications-kafka-docker`

##### Create a Stream in the Shell

Now you need to create a stream in the shell. The following example
shows how to do so:

    dataflow:>stream create mystream --definition "time | log"
    Created new stream 'mystream'

##### Deploy the Stream

Now you need to deploy the stream. The following example shows how to do
so:

    dataflow:>stream deploy mystream --platformName default
    Deployment request has been sent for stream 'mystream'

> **Note**
>
> While deploying the stream, the example supplies `--platformName`,
> which indicates the platform repository (in this case, `default`) to
> use when deploying the stream applications with Skipper.

##### List the Pods

The following command (with output) shows how to list the pods. You can
run this from the shell by adding a `!` before the command (which makes
a command run as an OS command):

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

##### Verify the Stream History

You should verify that the steps in the previous sections have worked
correctly by viewing the stream history. The following example (with
output) shows how to display the stream history, so that you can verify
its content:

    dataflow:>stream history --name mystream
    ╔═══════╤════════════════════════════╤════════╤════════════╤═══════════════╤════════════════╗
    ║Version│        Last updated        │ Status │Package Name│Package Version│  Description   ║
    ╠═══════╪════════════════════════════╪════════╪════════════╪═══════════════╪════════════════╣
    ║1      │Mon Oct 30 16:18:28 PDT 2017│DEPLOYED│mystream    │1.0.0          │Install complete║
    ╚═══════╧════════════════════════════╧════════╧════════════╧═══════════════╧════════════════╝

##### Verify the Package Manifest

The `log-sink` should be at 2.0.1.RELEASE. The following example (with
output) shows how to display the package manifest so that you can ensure
the version of the `log-sink` application:

    dataflow:>stream manifest --name mystream

    ---
    # Source: log.yml
    apiVersion: skipper.spring.io/v1
    kind: SpringCloudDeployerApplication
    metadata:
      "name": "log"
    spec:
      resource: "docker:springcloudstream/log-sink-rabbit"
      resourceMetadata: "docker:springcloudstream/log-sink-rabbit:jar:metadata:2.0.1.RELEASE"
      version: "2.0.1.RELEASE"
      applicationProperties:
        "spring.metrics.export.triggers.application.includes": "integration**"
        "spring.cloud.dataflow.stream.app.label": "log"
        "spring.cloud.stream.metrics.key": "mystream.log.${spring.cloud.application.guid}"
        "spring.cloud.stream.bindings.input.group": "mystream"
        "spring.cloud.stream.metrics.properties": "spring.application.name,spring.application.index,spring.cloud.application.*,spring.cloud.dataflow.*"
        "spring.cloud.stream.bindings.applicationMetrics.destination": "metrics"
        "spring.cloud.dataflow.stream.name": "mystream"
        "spring.cloud.dataflow.stream.app.type": "sink"
        "spring.cloud.stream.bindings.input.destination": "mystream.time"
      deploymentProperties:
        "spring.cloud.deployer.group": "mystream"

    ---
    # Source: time.yml
    apiVersion: skipper.spring.io/v1
    kind: SpringCloudDeployerApplication
    metadata:
      "name": "time"
    spec:
      resource: "docker:springcloudstream/time-source-rabbit"
      resourceMetadata: "docker:springcloudstream/time-source-rabbit:jar:metadata:2.0.1.RELEASE"
      version: "2.0.1.RELEASE"
      applicationProperties:
        "spring.metrics.export.triggers.application.includes": "integration**"
        "spring.cloud.dataflow.stream.app.label": "time"
        "spring.cloud.stream.metrics.key": "mystream.time.${spring.cloud.application.guid}"
        "spring.cloud.stream.bindings.output.producer.requiredGroups": "mystream"
        "spring.cloud.stream.metrics.properties": "spring.application.name,spring.application.index,spring.cloud.application.*,spring.cloud.dataflow.*"
        "spring.cloud.stream.bindings.applicationMetrics.destination": "metrics"
        "spring.cloud.stream.bindings.output.destination": "mystream.time"
        "spring.cloud.dataflow.stream.name": "mystream"
        "spring.cloud.dataflow.stream.app.type": "source"
      deploymentProperties:
        "spring.cloud.deployer.group": "mystream"

##### Register the `log-sink` Application

Now you need to register the log-sink application and specify a version.
The following example (with output) shows how to register the `log-sink`
application and update its version:

    dataflow:>app register --name log --type sink --uri docker:springcloudstream/log-sink-rabbit:2.1.0.RELEASE
    Successfully registered application 'sink:log'

The log-sink is updated to the version you specified as part of the
stream update workflow.

##### Update Stream to Use the `log-sink` Application

Now that you have registered the `log-sink` application, you need to
update your stream to use it. The following command (with output) shows
how to do so:

    dataflow:>stream update --name mystream --properties version.log=2.1.0.RELEASE
    Update request has been sent for stream 'mystream'

##### List the Pods Again

Now you should list the pods again, to ensure that the commands in the
preceding sections have worked. The following example (with output)
shows how to list the pods, so that you can see your application in the
list:

    $ kubectl get pods
    NAME                              READY     STATUS        RESTARTS   AGE
    mystream-log-v1-0-2k4r8        1/1       Terminating   0          3m
    mystream-log-v2-0-fjnlt        0/1       Running       0          9s
    mystream-time-v1-qhdqq         1/1       Running       0          3m
    mysql-777890292-z0dsw          1/1       Running       0          51m
    rabbitmq-317767540-2qzrr       1/1       Running       0          51m
    scdf-server-2734071167-bjd3g   1/1       Running       0          14m
    skipper-2408247821-50z31       1/1       Running       0          16m

    ...
    ...

> **Note**
>
> The list shows two versions of the `log-sink` applications. The
> `mystream-log-v1-0-2k4r8` pod is going down and the newly spawned
> `mystream-log-v2-0-fjnlt` pod is bootstrapping. The version number is
> incremented and the version-number (`v2`) is included in the new
> application name.

##### Verify the Logs Again

Once the new pod is up and running, you should verify the logs again.
The following example shows how to display the logs so that you can
verify their content:

    $ kubectl logs -f mystream-log-v2-0-fjnlt
    ...
    ...
    2017-10-30 23:24:30.016  INFO 1 --- [ mystream.time.mystream-1] log-sink                                 : 10/30/17 23:24:30
    2017-10-30 23:24:31.017  INFO 1 --- [ mystream.time.mystream-1] log-sink                                 : 10/30/17 23:24:31
    2017-10-30 23:24:32.018  INFO 1 --- [ mystream.time.mystream-1] log-sink                                 : 10/30/17 23:24:32

##### View the Updated Package Manifest

Now you can view the updated package manifest that was persisted in
Skipper. You should now see the version of `log-sink` be
`2.1.0.RELEASE`. The following example (with output) shows how to view
the updated package manifest:

    dataflow:>stream manifest --name mystream

    ---
    # Source: log.yml
    apiVersion: skipper.spring.io/v1
    kind: SpringCloudDeployerApplication
    metadata:
      "name": "log"
    spec:
      resource: "docker:springcloudstream/log-sink-rabbit"
      resourceMetadata: "docker:springcloudstream/log-sink-rabbit:jar:metadata:2.1.0.RELEASE"
      version: "2.1.0.RELEASE"
      applicationProperties:
        "spring.metrics.export.triggers.application.includes": "integration**"
        "spring.cloud.dataflow.stream.app.label": "log"
        "spring.cloud.stream.metrics.key": "mystream.log.${spring.cloud.application.guid}"
        "spring.cloud.stream.bindings.input.group": "mystream"
        "spring.cloud.stream.metrics.properties": "spring.application.name,spring.application.index,spring.cloud.application.*,spring.cloud.dataflow.*"
        "spring.cloud.stream.bindings.applicationMetrics.destination": "metrics"
        "spring.cloud.dataflow.stream.name": "mystream"
        "spring.cloud.dataflow.stream.app.type": "sink"
        "spring.cloud.stream.bindings.input.destination": "mystream.time"
      deploymentProperties:
        "spring.cloud.deployer.group": "mystream"
        "spring.cloud.deployer.count": "1"

    ---
    # Source: time.yml
    apiVersion: skipper.spring.io/v1
    kind: SpringCloudDeployerApplication
    metadata:
      "name": "time"
    spec:
      resource: "docker:springcloudstream/time-source-rabbit"
      resourceMetadata: "docker:springcloudstream/time-source-rabbit:jar:metadata:2.0.1.RELEASE"
      version: "2.0.1.RELEASE"
      applicationProperties:
        "spring.metrics.export.triggers.application.includes": "integration**"
        "spring.cloud.dataflow.stream.app.label": "time"
        "spring.cloud.stream.metrics.key": "mystream.time.${spring.cloud.application.guid}"
        "spring.cloud.stream.bindings.output.producer.requiredGroups": "mystream"
        "spring.cloud.stream.metrics.properties": "spring.application.name,spring.application.index,spring.cloud.application.*,spring.cloud.dataflow.*"
        "spring.cloud.stream.bindings.applicationMetrics.destination": "metrics"
        "spring.cloud.stream.bindings.output.destination": "mystream.time"
        "spring.cloud.dataflow.stream.name": "mystream"
        "spring.cloud.dataflow.stream.app.type": "source"
      deploymentProperties:
        "spring.cloud.deployer.group": "mystream"

##### Verify Stream History Again

Now you should verify the stream history to ensure that the steps in the
previous sections have worked correctly. The following example (with
output) shows how to display the version history of your stream so that
you can verify the version:

    dataflow:>stream history --name mystream
    ╔═══════╤════════════════════════════╤════════╤════════════╤═══════════════╤════════════════╗
    ║Version│        Last updated        │ Status │Package Name│Package Version│  Description   ║
    ╠═══════╪════════════════════════════╪════════╪════════════╪═══════════════╪════════════════╣
    ║2      │Mon Oct 30 16:21:55 PDT 2017│DEPLOYED│mystream    │1.0.0          │Upgrade complete║
    ║1      │Mon Oct 30 16:18:28 PDT 2017│DELETED │mystream    │1.0.0          │Delete complete ║
    ╚═══════╧════════════════════════════╧════════╧════════════╧═══════════════╧════════════════╝

#### Rolling Back to a Previous Version

Skipper includes a `rollback` command so that you can roll back to a
previous version. The following example (with output) shows how to use
it:

    dataflow:>stream rollback --name mystream
    Rollback request has been sent for the stream 'mystream'

    ...
    ...

    dataflow:>stream history --name mystream
    ╔═══════╤════════════════════════════╤════════╤════════════╤═══════════════╤════════════════╗
    ║Version│        Last updated        │ Status │Package Name│Package Version│  Description   ║
    ╠═══════╪════════════════════════════╪════════╪════════════╪═══════════════╪════════════════╣
    ║3      │Mon Oct 30 16:22:51 PDT 2017│DEPLOYED│mystream    │1.0.0          │Upgrade complete║
    ║2      │Mon Oct 30 16:21:55 PDT 2017│DELETED │mystream    │1.0.0          │Delete complete ║
    ║1      │Mon Oct 30 16:18:28 PDT 2017│DELETED │mystream    │1.0.0          │Delete complete ║
    ╚═══════╧════════════════════════════╧════════╧════════════╧═══════════════╧════════════════╝

### Destroying a Stream

If you need to destroy a stream, you can do so by using the following
command:

    dataflow:>stream destroy --name mystream

where `mystream` is the name of the stream you want to destroy

### Troubleshooting Stream Deployment

To troubleshoot issues such as a container that has a fatal error when
starting, you can add the `--previous` option to view the last
terminated container log. You can also get more detailed information
about the pods by using the `kubctl describe`, as the following example
shows:

    kubectl describe pods/mystream-log-qnk72

> **Note**
>
> If you need to specify any of the application-specific configuration
> properties, you can use the "`long form`" of them by including the
> application-specific prefix (for example,
> `--jdbc.tableName=TEST_DATA`). If you did not register the
> `--metadata-uri` for the Docker based starter applications, this form
> is **required**. In this case, you also do not see the configuration
> properties listed when using the `app info` command or in the
> Dashboard GUI.

### Accessing an Application from Outside the Cluster

If you need to be able to connect from outside of the Kubernetes cluster
to an application that you deploy (such as the `http-source`), you need
to use an external load balancer for the incoming connections or you
need to use a NodePort configuration that exposes a proxy port on each
Kubetnetes node. If your cluster does not support external load
balancers (Minikube does not, for example), you must use the NodePort
approach. You can use deployment properties to configure the access. To
specify that you want to have a load balancer with an external IP
address created for your application’s service, use
`deployer.http.kubernetes.createLoadBalancer=true` for the application.
For the NodePort configuration, use
`deployer.http.kubernetes.createNodePort=<port>`, where `<port>` is a
number between 30000 and 32767.

The following instructions describe how to access an application from
outside the cluster:

1.  Register the `http-source` by using one of the following commands:

    - RabbitMQ:

          dataflow:>app register --type source --name http --uri docker//springcloudstream/http-source-rabbit:{docker-http-source-rabbit-version} --metadata-uri maven://org.springframework.cloud.stream.app:http-source-rabbit:jar:metadata:{docker-http-source-rabbit-version}

    - Kafka:

          dataflow:>app register --type source --name http --uri docker//springcloudstream/http-source-kafka:{docker-http-source-kafka-version} --metadata-uri maven://org.springframework.cloud.stream.app:http-source-kafka:jar:metadata:{docker-http-source-kafka-version}

2.  Create the `http | log` stream without deploying it by using the
    following command:

        dataflow:>stream create --name test --definition "http | log"

    If your cluster supports an External LoadBalancer for the
    `http-source`, you can use the following command to deploy the
    stream:

        dataflow:>stream deploy test --properties "deployer.http.kubernetes.createLoadBalancer=true"

3.  Check whether the pods have started by using the following command:

        dataflow:>! kubectl get pods -l role=spring-app
        command is:kubectl get pods -l role=spring-app
        NAME               READY     STATUS    RESTARTS   AGE
        test-http-2bqx7    1/1       Running   0          3m
        test-log-0-tg1m4   1/1       Running   0          3m

    Pods that are ready show `1/1` in the `READY` column. Now you can
    look up the external IP address for the `http` application (it can
    sometimes take a minute or two for the external IP to get assigned)
    by using the following command:

        dataflow:>! kubectl get service test-http
        command is:kubectl get service test-http
        NAME         CLUSTER-IP       EXTERNAL-IP      PORT(S)    AGE
        test-http    10.103.251.157   130.211.200.96   8080/TCP   58s

    If you use Minikube or any cluster that does not support an external
    load balancer, you should deploy the stream with a NodePort in the
    range of 30000-32767. You can use the following command to deploy
    it:

        dataflow:>stream deploy test --properties "deployer.http.kubernetes.createNodePort=32123"

4.  Check whether the pods have started by using the following command:

        dataflow:>! kubectl get pods -l role=spring-app
        command is:kubectl get pods -l role=spring-app
        NAME               READY     STATUS    RESTARTS   AGE
        test-http-9obkq    1/1       Running   0          3m
        test-log-0-ysiz3   1/1       Running   0          3m

    Pods that are ready show `1/1` in the `READY` column. Now you can
    look up the URL to use with the following command:

        dataflow:>! minikube service --url test-http
        command is:minikube service --url test-http
        https://192.168.99.100:32123

5.  Post some data to the `test-http` application either by using the
    `EXTERNAL_IP` address (mentioned in
    [earlier](#getting-started-kubernetes-deploy-services-and-data-flow))
    with port 8080 or by using the URL provided by the following
    Minikube command:

        dataflow:>http post --target https://130.211.200.96:8080 --data "Hello"

6) View the logs for the `test-log` pod by using the following command:

+

    dataflow:>! kubectl get pods-l role=spring-app
    command is:kubectl get pods-l role=spring-app
    NAME              READY     STATUS             RESTARTS   AGE
    test-http-9obkq   1/1       Running            0          2m
    test-log-0-ysiz3  1/1       Running            0          2m
    dataflow:>! kubectl logs test-log-0-ysiz3
    command is:kubectl logs test-log-0-ysiz3
    ...
    2016-04-27 16:54:29.789  INFO 1 --- [           main] o.s.c.s.b.k.KafkaMessageChannelBinder$3  : started inbound.test.http.test
    2016-04-27 16:54:29.799  INFO 1 --- [           main] o.s.c.support.DefaultLifecycleProcessor  : Starting beans in phase 0
    2016-04-27 16:54:29.799  INFO 1 --- [           main] o.s.c.support.DefaultLifecycleProcessor  : Starting beans in phase 2147482647
    2016-04-27 16:54:29.895  INFO 1 --- [           main] s.b.c.e.t.TomcatEmbeddedServletContainer : Tomcat started on port(s): 8080 (http)
    2016-04-27 16:54:29.896  INFO 1 --- [  kafka-binder-] log.sink                                 : Hello

7. Destroy the stream by using the following command:

+

    dataflow:>stream destroy --name test

## Comparison with standalone deployment

**Discuss what is being done behind the scenes to simplify the experience..make the case for data flow**
