---
path: 'applications/'
title: 'Applications'
description: 'Using stream and task applications'
summary: true
---

# Using Applications with Spring Cloud Data Flow

Spring Cloud Data Flow provides native support for applications built with [Spring Cloud Stream](https://spring.io/projects/spring-cloud-stream) or [Spring Cloud Task](https://spring.io/projects/spring-cloud-task).
Given a stream definition such as `http | log`, Data Flow will expect `http` to be a stream source with an `output` destination configured.
Likewise `log`, as a sink, must have an `input` destination configured.

To run this pipeline without Data Flow, you must manually configure these applications with [Spring Cloud Stream binding properties](https://cloud.spring.io/spring-cloud-static/spring-cloud-stream/3.0.4.RELEASE/reference/html/spring-cloud-stream.html#binding-properties) so that:

- The output of `http` is the same named destination as the input of `log`
- The applications have the same message broker connection properties
- A unique consumer group is defined

Then deploy these applications individually to the platform of your choice.

Data Flow takes care of all this for you, and more!

For task applications, Data Flow initializes database schema for Spring Cloud Task and Spring Batch and provides the necessary JDBC connection properties when launching a task to allow the task to track its execution status. The Data Flow UI also provides views of this information.

The Data Flow model has subsequently been extended to support applications that don't necessarily conform to the standard conventions and must be manually configured.
You can find more details in the [Application DSL](%currentPath%/feature-guides/streams/stream-application-dsl/) page and also in the [Polyglot Recipe](%currentPath%/recipes/polyglot).

## Pre-packaged Applications

The Spring team provides and supports a selection of [pre-packaged applications](%currentPath%/applications/pre-packaged/) used to assemble various data integration and processing pipelines and to support production Spring Cloud Data Flow development, learning and experimentation.

## Application Registration

In order to use an application in Data Flow, you must first register it.
[Stream Processing with Data Flow](%currentPath%/stream-developer-guides/streams/data-flow-stream/#application-registration) explains how to register an individual application. This can be one of the pre-packaged applications or a custom application.

### Bulk Registration

The [pre-packaged applications](%currentPath%/applications/pre-packaged/) covers how to bulk register pre-packaged applications.

If you want to create a file to bulk register only applications that you use, including your own applications, the format of this file is:

`<type>.<name>=<app-url>` where `<type>` contains a supported application type (source, processor, sink, task, app), `<name>` contains the registration name, and `<app-url>` is the location of the executable artifact.

<!--TIP-->

The URL may be any standard URL or may use one of the Data Flow `maven://` or `docker://` formats described in [Stream Processing with Data Flow](%currentPath%/stream-developer-guides/streams/data-flow-stream/#application-registration).

<!--END_TIP-->

To optimize performance, you may package [application metadata](%currentPath%/feature-guides/general/application-metadata), which contains the names and descriptions of exposed application properties, in a separate smaller artifact. This is not required but, since the metadata is typically accessed before the application binary is needed, it allows more efficient use of network resources when using Data Flow. In this case, add a registration entry for the metadata artifact as `<type>.<name>.metadata=app-metadata-url`.

Here is a snippet of a bulk registration file used to register Maven artifacts:

```
sink.cassandra=maven://org.springframework.cloud.stream.app:cassandra-sink-rabbit:2.1.2.RELEASE
sink.cassandra.metadata=maven://org.springframework.cloud.stream.app:cassandra-sink-rabbit:jar:metadata:2.1.2.RELEASE
sink.s3=maven://org.springframework.cloud.stream.app:s3-sink-rabbit:2.1.2.RELEASE
sink.s3.metadata=maven://org.springframework.cloud.stream.app:s3-sink-rabbit:jar:metadata:2.1.2.RELEASE
```

From the Data Flow Shell, you can bulk register the applications:

```bash
dataflow:>app import --uri file://path-to-my-app-registration.properties
```

You can also pass the --local option (which is true by default) to indicate whether the properties file location should be resolved within the shell process itself. If the location should be resolved from the Data Flow Server process, specify --local false.

<!--CAUTION-->

When using either `app register` or `app import`, if an app is already registered with the provided name and type and version, it is not overridden by default. If you would like to override the pre-existing app uri or metadata-uri coordinates, then include the --force option.

Note, however, that, once downloaded, applications may be cached locally on the Data Flow server, based on the resource location. If the resource location does not change (even though the actual resource bytes may be different), then it is not re-downloaded. When using maven:// resources on the other hand, using a constant location may still circumvent caching (if using -SNAPSHOT versions).

Moreover, if a stream is already deployed and using some version of a registered app, then (forcibly) re-registering a different app has no effect until the stream is deployed again.

<!--END_CAUTION-->
