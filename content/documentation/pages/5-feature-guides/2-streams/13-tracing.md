---
path: 'feature-guides/streams/tracing/'
title: 'Stream Distributed Tracing'
description: 'Tracing streaming data pipelines'
---

# Stream Distributed Tracing with Wavefront

This section describes how to trace the applications that were deployed as part of a Stream data pipeline.

The Data Flow distributed tracing architecture is designed around the [Spring Cloud Sleuth](https://spring.io/projects/spring-cloud-sleuth#overview) library, to provide API for distributed tracing solutions that integrates with [OpenZipkin Brave](https://github.com/openzipkin/brave).

Spring Cloud Sleuth is able to trace your requests and messages so that you can correlate that communication to corresponding log entries. You can also export the tracing information to an external system to visualize latency. Spring Cloud Sleuth supports OpenZipkin compatible systems directly.
Such as [Zipkin Server](https://github.com/openzipkin/zipkin/tree/master/zipkin-server) or the [Wavefront Distributed Tracing](https://docs.wavefront.com/tracing_basics.html).

All Spring Cloud [Stream Applications](https://github.com/spring-cloud/stream-applications) are pre-configured to support message distributed tracing. The distributed tracing is enabled by default. You can disable or change the tracing configurations declaratively using the [spring sleuth properties](https://cloud.spring.io/spring-cloud-sleuth/reference/html/appendix.html).

The following image shows the general architecture of how streaming applications are monitored:

![Stream Monitoring Architecture](images/SCDF-stream-traces-architecture.png)

<!--NOTE-->

Tracing for stream application tracing is possible

<!--END_NOTE-->

## Visualize Distributed Tracing Data

You can also export the tracing information to an external system to visualize latency. Spring Cloud Sleuth supports OpenZipkin compatible systems such as [Zipkin Server](https://github.com/openzipkin/zipkin/tree/master/zipkin-server) and the [Wavefront Distributed Tracing](https://docs.wavefront.com/tracing_basics.html).

### Visualize with Wavefront

You can use the [Wavefront to visualize the distributed tracing data](https://docs.wavefront.com/tracing_basics.html#visualize-distributed-tracing-data-in-wavefront) collected from your deployed streaming pipelines. Wavefront offers different dashboards and browsers to view information on your `applications` and `services` and you can navigate from one to another to gather more information.

The Wavefront uses the `application` and `service` concepts to group the distributed traces. For the purpose of Dataflow the Wavefront `application` is mapped to a streaming pipeline which the `service` is mapped to streaming applications. Therefore all deployed Spring Cloud Stream Application Starters are configured with the following two properties:

- `wavefront.application.name`: The name of the stream that contains the applications that send the traces.
- `wavefront.application.service`: The name or label of the application that reports the traces.

To find your streams traces you should navigate the Wavefront dashboard menu to `Applications/Traces`:

![SCDF Wavefront](images/SCDF-stream-tracing-wavefront-application-traces-menu.png)

Then you can search for application names that match your deployed stream names.
For example if you have deployed a stream pipeline named `scdf-stream-traces` you can select its traces collected in Wavefront like this:

![SCDF Wavefront](images/SCDF-stream-tracing-wavefront-search.png)

Push the the `Search` button and the Wavefront dashboards will show similar to the following image:

![SCDF Wavefront](images/SCDF-stream-tracing-wavefront.png)

### Visualize with Zipkin Server

## Local Installation

This section describes how to view application distributed traces for streams that use Wavefront or Zipkin Server as the trace store. Wavefront is a cloud offering, but you still can deploy Data Flow locally and point it to a cloud-managed Wavefront system.

<!--TABS-->

<!--Wavefront -->

### Wavefront

To install Data Flow with Wavefront support, follow the [Monitoring with Wavefront](%currentPath%/installation/local/docker-customize/#wavefront) Docker Compose instructions. Doing so brings up Spring Cloud Data Flow, Skipper, and Apache Kafka.

The Wavefront is a SaaS offering, and you need to create a user account first. With that account, you can set the `WAVEFRONT_KEY` and `WAVEFRONT_URI` environment variables, as explained later in this document.

Once all the containers are running, deploy a simple stream that uses Kafka:

```
dataflow:>stream create scdf-stream-tracing --definition "time --fixed-delay=10 --time-unit=MILLISECONDS | filter --expression=payload.contains('3') | log" --deploy
```

Then follow the [visualize with Wavefront instructions](%currentPath%/feature-guides/streams/tracing/#visualize-with-wavefront).

<!--Zipkin Server -->

### Zipkin Server

You would need latest Stream Application staters (`2020.0.3-SNAPSHOT or newer`). Use the `STREAM_APPS_URI` variable to set the right apps version. (TODO).

To enable message trace collection for the `Zipkin Server` [Zipkin Server](%currentPath%/installation/local/docker-customize/#zipkin-server) Docker Compose instructions. Doing so brings up Spring Cloud Data Flow, Skipper, Apache Kafka, Zipkin Server and enables the message tracing for it.

Once all the containers are running, you can access the Spring Cloud Data Flow Dashboard at http://localhost:9393/dashboard

Also you can reach the Zipkin UI at http://localhost:9411/zipkin . To see the dashboard in action, deploy a simple stream that uses Kafka:

```
dataflow:>app import --uri https://dataflow.spring.io/kafka-maven-latest --force
dataflow:>stream create stream2 --definition "time --fixed-delay=10 --time-unit=MILLISECONDS | filter --expression=payload.contains('3') | log" --deploy
```

You should see Zipkin dashboards similar to those shown in the following image:

![SCDF Stream Distributed Tracing - Zipkin](images/scdf-stream-distributed-tracing-zipkin.gif)

<!--END_TABS-->

## Kubernetes Installation

This section describes how to view streams distributed traces on a cloud-managed Wavefront system.

<!--TABS-->

<!--Wavefront -->

### Wavefront

Wavefront is a SaaS offering. You need to create a user account first and obtain the `API-KEY` and `WAVEFRONT-URI` assigned to your account.

Follow the general [Data Flow Kubernetes installation instructions](%currentPath%/installation/kubernetes/).

Then add the following properties to your Spring Cloud Data Flow server configuration (for example, `src/kubernetes/server/server-config.yaml`) to enable the Wavefront integration:

```yml
management:
  metrics:
    export:
      wavefront:
        enabled: true
        api-token: <YOUR API-KEY>
        uri: <YOUR WAVEFRONT-URI>
        source: demo-scdf-source
```

Then follow the [visualize with Wavefront instructions](%currentPath%/feature-guides/streams/tracing/#visualize-with-wavefront).

<!--END_TABS-->

## Cloud Foundry Installation

This section describes how to view application distributed traces for streams that Wavefront store on Cloud Foundry.

<!--TABS-->

<!--Wavefront -->

### Wavefront

Wavefront is a SaaS offering. You need to create a user account first and obtain the `API-KEY` and `WAVEFRONT-URI` assigned to your account.

To configure the Data Flow Server to send metrics data from stream applications to the Wavefront monitoring system, follow the [manifest-based Wavefront configuration instructions](%currentPath%/installation/cloudfoundry/cf-cli/#configuration-for-wavefront).

TThen follow the [visualize with Wavefront instructions](%currentPath%/feature-guides/streams/tracing/#visualize-with-wavefront).

<!--END_TABS-->
