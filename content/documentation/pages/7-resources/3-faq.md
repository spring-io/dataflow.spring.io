---
path: 'resources/faq/'
title: 'Frequently Asked Questions'
description: ''
---

# Frequently Asked Questions

## Application Starters

<!--QUESTION-->

Where to find the latest Spring Cloud Stream and Spring Cloud Task application starters?

The latest releases of Stream and Task application starters are published to Maven Central and Docker Hub.
You can find the latest release versions from the [Spring Cloud Stream App Starters](https://cloud.spring.io/spring-cloud-stream-app-starters/) and [Spring Cloud Task App Starters](https://cloud.spring.io/spring-cloud-task-app-starters/) project sites.

<!--END_QUESTION-->

<!--QUESTION-->

Where to find the latest Spring Cloud Stream and Spring Cloud Task application starters?

The latest releases of Stream and Task application starters are published to Maven Central and Docker Hub.
You can find the latest release versions from the [Spring Cloud Stream App Starters](https://cloud.spring.io/spring-cloud-stream-app-starters/) and [Spring Cloud Task App Starters](https://cloud.spring.io/spring-cloud-task-app-starters/) project sites.

<!--END_QUESTION-->

<!--QUESTION-->

Where do I find the docs for the latest application releases?

Refer to the [Spring Cloud Stream App Starters](https://cloud.spring.io/spring-cloud-stream-app-starters/) and [Spring Cloud Task App Starters](https://cloud.spring.io/spring-cloud-task-app-starters/) project sites.

<!--END_QUESTION-->

<!--QUESTION-->

Is it possible to patch and extend the out-of-the-box applications?

Yes. More details in the reference guide section on [Patching Application Starters](https://docs.spring.io/spring-cloud-stream-app-starters/docs/%streaming-apps-version%/reference/htmlsingle/#_patching_pre_built_applications) as well as documentation on Functional Composition.
**TODO Link to functional composition.**

<!--END_QUESTION-->

<!--QUESTION-->

How to build a new application based on the same infrastructure as the out-of-the-box applications?

More details in the Spring Cloud Stream App Starter's reference guide section [FAQ on Spring Cloud Stream App Starters](https://docs.spring.io/spring-cloud-stream-app-starters/docs/%streaming-apps-version%/reference/htmlsingle/#_general_faq_on_spring_cloud_stream_app_starters).

<!--END_QUESTION-->

<!--QUESTION-->

Where can I download the latest applications?

Links available in the [stream](http://cloud.spring.io/spring-cloud-stream-app-starters/#http-repository-location-for-apps) and [task](http://cloud.spring.io/spring-cloud-task-app-starters/#http-repository-location-for-apps) apps project sites.

<!--END_QUESTION-->

<!--QUESTION-->

Where are the Docker images hosted?

See [stream](https://hub.docker.com/u/springcloudstream) and [task](https://hub.docker.com/u/springcloudtask) apps in Docker Hub.

<!--END_QUESTION-->

## Data Flow

<!--QUESTION-->

How are streaming applications and SCDF related?

Streaming applications are standalone and they communicate with other applications through message brokers like RabbitMQ or Apache Kafka.
They run independently and there's no runtime dependency between applications and SCDF.
However, based on user actions, SCDF will interact with the platform runtime to update the currently running application, query the current status, or stop the application from running.

<!--END_QUESTION-->

<!--QUESTION-->

How are task and batch applications and SCDF related?

Though batch/task applications are standalone Spring Boot applications, to record the execution status of batch/task applications, it is _required_ to connect both SCDF and the batch applications to the same database. The individual batch applications (deployed by SCDF) in turn attempt to update their execution status to the shared database, which in turn is used by SCDF to show the execution history and among other details about the batch applications in SCDF's dashboard. You can also construct your batch/task applications to connect to the SCDF Database only for recording execution status but performing work in another database.

<!--END_QUESTION-->

<!--QUESTION-->

What is the relationship of [Composed Task Runner](https://github.com/spring-cloud-task-app-starters/composed-task-runner) and SCDF?

The [Composed Tasks](http://docs.spring.io/spring-cloud-dataflow/docs/%dataflow-version%/reference/htmlsingle/#spring-cloud-dataflow-composed-tasks) delegates the execution of the collection of Tasks to a separate application, named the Composed Task Runner (CTR).
The CTR orchestrates the launching of Tasks defined in the composed task graph.
To use Composed Tasks, it is required to connect SCDF, CTR, and batch applications to a shared database. Only then, you will be able to track all of their execution history from SCDF’s dashboard.

<!--END_QUESTION-->

<!--QUESTION-->

Does SCDF use message broker?

No. The Data Flow and Skipper servers do not interact with the message broker.  
Streaming applications deployed by Data flow connect to the message broker to publish and consume messages.

<!--END_QUESTION-->

<!--QUESTION-->

What is the role of Skipper in SCDF?

SCDF delegates and relies on Skipper for the life cycle management of streaming applications. With Skipper, applications contained within the streaming data pipelines are versioned and can be rolling-updated and rolled-back to previous versions.

<!--END_QUESTION-->

<!--QUESTION-->

What tools are available to interact with SCDF?

[Shell](http://docs.spring.io/spring-cloud-dataflow/docs/%dataflow-version%/reference/htmlsingle/#shell), [Dashboard](http://docs.spring.io/spring-cloud-dataflow/docs/%dataflow-version%/reference/htmlsingle/#dashboard), [Java DSL](http://docs.spring.io/spring-cloud-dataflow/docs/%dataflow-version%/reference/htmlsingle/#spring-cloud-dataflow-stream-java-dsl), and [REST-APIs](http://docs.spring.io/spring-cloud-dataflow/docs/%dataflow-version%/reference/htmlsingle/#api-guide-resources).

<!--END_QUESTION-->

<!--QUESTION-->

Why SCDF is not in Spring Initializr?

Initializr's goal is to provide a getting started experience to creating a Spring Boot Application.
It is not the goal of initializr to create a production ready server application.
We had tried this in the past, but were not able to succeed because of the need for us to have very fine grained control over dependent libraries.
As such, we ship the binaries directly instead. And we expect the users either use the binaries as-is or extend by building SCDF locally from the source.

<!--END_QUESTION-->

<!--QUESTION-->

Can SCDF work with Oracle database?

Yes. Read more about the [supported databases here.](http://docs.spring.io/spring-cloud-dataflow/docs/%dataflow-version%/reference/htmlsingle/#configuration-local-rdbms).

<!--END_QUESTION-->

<!--QUESTION-->

When/Where to use Task properties vs. arguments?

If the configuration for each task execution remains the same across all task launches, then set the properties at the time in which you create the task definition.

```
task create myTaskDefinition --definition "timestamp --format='yyyy'"
```

If the configuration for each task execution changes for each task launch then you will want to use the arguments at task launch time. For example:

```
task launch myTaskDefinition "--server.port=8080"
```

[[note]]
| When using Spring Cloud Data Flow to orchestrate the launches of my task app that utilizes Spring Batch: You will want to use arguments so as to set the Job Parameters required for your batch job.  
|
| Remember: if your argument is a non identifying parameter suffix the argument with `--`.

<!--END_QUESTION-->

## Streaming

<!--QUESTION-->

What if I want to connect to existing RabbitMQ queues?

Follow the steps in the [reference guide](https://cloud.spring.io/spring-cloud-static/spring-cloud-stream-binder-rabbit/2.2.0.RC1/spring-cloud-stream-binder-rabbit.html#_using_existing_queuesexchanges) to connect with existing RabbitMQ queues.

<!--END_QUESTION-->

<!--QUESTION-->

What is the Apache Kafka vs. Spring Cloud Stream compatibility?

See the [compatibility matrix](https://github.com/spring-cloud/spring-cloud-stream/wiki/Kafka-Client-Compatibility) in the Wiki.

<!--END_QUESTION-->

## Batch

<!--QUESTION-->

What is a Composed Task Runner (CTR)?

The [Composed Tasks](http://docs.spring.io/spring-cloud-dataflow/docs/%dataflow-version%/reference/htmlsingle/#spring-cloud-dataflow-composed-tasks) feature in SCDF that delegates the execution of the composed to an separate application, named the Composed Task Runner (CTR).
The CTR to orchestrate the launching of Tasks defined in the composed task graph.
The Composed Task Runner (CTR) parses the graph DSL and for each node in the graph it will execute a RESTful call against a specified Spring Cloud Data Flow instance to launch the associated task definition.
For each task definition that is executed the Composed Task Runner will poll the database to verify that the task completed.
Once complete the Composed Task Runner will either continue to the next task in the graph or fail based on how the DSL specified the sequence of tasks should be executed.

<!--END_QUESTION-->

<!--QUESTION-->

How do I restart a Spring Batch Job from the beginning, not from where it failed?

In short, you will need to create a new Job Instance for the new task launch. This can be done by changing an existing identifying job parameter or add a new identifying job parameter on the next task launch. For example:

```
task launch myBatchApp --arguments="foo=bar"
```

Assuming this task launch fails we can now launch the task and a new job instance will be created if we change the value of the `foo` parameter as shown here:

```
task launch myBatchApp --arguments="foo=que"
```

But the preferred way is to write your task/batch app such that it can handle be restarted with a new job instance. One way to do this is to set a `JobParamsIncrementer` for your batch job as discussed in the Spring Batch [reference guide](https://docs.spring.io/spring-batch/trunk/reference/html/configureJob.html#JobParametersIncrementer).

<!--END_QUESTION-->
