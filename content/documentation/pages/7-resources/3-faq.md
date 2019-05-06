---
path: 'resources/faq/'
title: 'Frequently Asked Questions'
description: 'FAQ'
---

# Applications

**Q: Where to find the latest Spring Cloud Stream and Spring Cloud Task applications?**

**A:** The latest releases of supported applications are published to Maven Central and Docker Hub. You can find the latest release versions from the Spring Cloud Stream App Starters and Spring Cloud Task App Starters project sites.

**Q: Where do I find the docs to the latest application releases?**

**A:** Refer to the [Reference Documentation](%currentPath%/resources/reference-docs/) section for more details.

**Q: Is it possible to patch and extend the out-of-the-box applications?**

**A:** Yes. More details in the [reference guide](https://docs.spring.io/spring-cloud-stream-app-starters/docs/Einstein.SR2/reference/htmlsingle/#_patching_pre_built_applications).

**Q: How to build a new application based on the same infrastructure as the out-of-the-box applications?**

**A:** More details in the [reference guide](https://docs.spring.io/spring-cloud-stream-app-starters/docs/Einstein.SR2/reference/htmlsingle/#_general_faq_on_spring_cloud_stream_app_starters).

**Q: Where can I download the latest applications?**

**A:** Links available in the [stream](http://cloud.spring.io/spring-cloud-stream-app-starters/#http-repository-location-for-apps) and [task](http://cloud.spring.io/spring-cloud-task-app-starters/#http-repository-location-for-apps) apps project sites.

**Q: Where are the Docker images hosted?**

**A:** See [stream](https://hub.docker.com/u/springcloudstream) and [task](https://hub.docker.com/u/springcloudtask) apps in Docker Hub.

# Data Flow

**Q: How are streaming applications and SCDF related?**

**A:** Streaming applications are standalone and they communicate with other applications through message brokers like RabbitMQ or Apache Kafka. They run independently and there's no dependency between applications and SCDF. Based on a user action, SCDF can attempt to query the current status of the applications, however.

**Q: How are batch applications and SCDF related?**

**A:** Though batch/task applications are standalone Spring Boot applications, to orchestrate the deployment of batch/task applications in SCDF, it is _required_ to connect both SCDF and the batch applications to the same database. The individual batch applications (deployed by SCDF) in turn attempt to update their execution status to the shared database, which in turn is used by SCDF to show the execution history and among other details about the batch applications in SCDF's dashboard.

**Q: What is the relationship of [Composed Task Runner](https://github.com/spring-cloud-task-app-starters/composed-task-runner) and SCDF?**

**A:** The [Composed Tasks](http://docs.spring.io/spring-cloud-dataflow/docs/%scdf-version-latest%/reference/htmlsingle/#spring-cloud-dataflow-composed-tasks) feature in SCDF delegates and relies on CTR to orchestrate the launching of Tasks defined in the composed task graph. To use Composed Tasks, it is _required_ to connect SCDF, CTR, and the batch applications to a shared database. Only then, you will be able to track all of their execution history from SCDF's dashboard.

**Q: Does SCDF use message broker?**

**A:** No. Streaming applications independently connect to the message broker to publish and consume messages.

**Q: What is the role of Skipper in SCDF?**

**A:** SCDF delegates and relies on Skipper for the lifecycle management of streaming applications. With Skipper, the streaming data pipelines can be versioned, rolling-updated, and rolled-back to previous versions.

**Q: What tools are available to interact with SCDF?**

**A:** [Shell](http://docs.spring.io/spring-cloud-dataflow/docs/%scdf-version-latest%/reference/htmlsingle/#shell), [Dashboard](http://docs.spring.io/spring-cloud-dataflow/docs/%scdf-version-latest%/reference/htmlsingle/#dashboard), [Java DSL](http://docs.spring.io/spring-cloud-dataflow/docs/%scdf-version-latest%/reference/htmlsingle/#spring-cloud-dataflow-stream-java-dsl), and [REST-APIs](http://docs.spring.io/spring-cloud-dataflow/docs/%scdf-version-latest%/reference/htmlsingle/#api-guide-resources).

**Q: Why SCDF is not in Spring Initializr?**

**A:** Unlike other Spring projects (that are simple libraries), SCDF is a full-blown Spring Boot Application - a runtime even. Because it is a runtime-like application, it is hard to handle the various autoconfiguration's that we rely on internally and the dependencies that the users might choose from Spring Initializr, which results in various bootstrap ordering issues and downstream inconsistencies. We ship the binaries directly instead. And we expect the users either use the binaries as-is or extend by building SCDF locally from the source.

**Q: Can SCDF work with Oracle database?**

**A:** Yes. Read more about the supported databases in the [reference guide](http://docs.spring.io/spring-cloud-dataflow/docs/%scdf-version-latest%/reference/htmlsingle/#configuration-local-rdbms).

**Q: When/Where to use Task properties vs. arguments?**

**A:** If the configuration for each task execution remains the same across all task launches, then set the properties at the time in which you create the task definition.

```bash
task create myTaskDefinition --definition "timestamp --format='yyyy'"
```

If the configuration for each task execution changes for each task launch then you will want to use the arguments at task launch time. For example:

```bash
task launch myTaskDefinition "--server.port=8080"
```

[[note]]
| When using Spring Cloud Data Flow to orchestrate the launches of my task app that utilizes Spring Batch: You will want to use arguments so as to set the Job Parameters required for your batch job.  
|
| Remember: if your argument is a non identifying parameter suffix the argument with `--`.

# Streaming

**Q: What if I want to connect to existing RabbitMQ queues?**

**A:** Follow the steps in the [reference guide](https://cloud.spring.io/spring-cloud-static/spring-cloud-stream-binder-rabbit/2.2.0.RC1/spring-cloud-stream-binder-rabbit.html#_using_existing_queuesexchanges) to connect with existing RabbitMQ queues.

**Q: What is the Apache Kafka vs. Spring Cloud Stream compatibility?**

**A:** See the [compatibility matrix](https://github.com/spring-cloud/spring-cloud-stream/wiki/Kafka-Client-Compatibility) in the Wiki.

# Batch

**Q: What is a Composed Task Runner (CTR)?**

**A:** The [Composed Tasks](http://docs.spring.io/spring-cloud-dataflow/docs/%scdf-version-latest%/reference/htmlsingle/#spring-cloud-dataflow-composed-tasks) feature in SCDF delegates and relies on CTR to orchestrate the launching of Tasks defined in the composed task graph. The Composed Task Runner (CTR) parses the graph DSL and for each node in the graph it will execute a restful call against a specified Spring Cloud Data Flow instance to launch the associated task definition. For each task definition that is executed the Composed Task Runner will poll the database to verify that the task completed. Once complete the Composed Task Runner will either continue to the next task in the graph or fail based on how the DSL specified the sequence of tasks should be executed.

**Q: How do I restart a Spring Batch Job from the beginning, not from where it failed?**

**A:** In short, you will need to create a new Job Instance for the new task launch. This can be done by changing an existing identifying job parameter or add a new identifying job parameter on the next task launch. For example:

```bash
task launch myBatchApp --arguments="foo=bar"
```

Assuming this task launch fails we can now launch the task and a new job instance will be created if we change the value of the `foo` parameter as shown here:

```bash
task launch myBatchApp --arguments="foo=que"
```

But the preferred way is to write your task/batch app such that it can handle be restarted with a new job instance. One way to do this is to set a `JobParamsIncrementer` for your batch job as discussed in the Spring Batch [reference guide](https://docs.spring.io/spring-batch/trunk/reference/html/configureJob.html#JobParametersIncrementer).
