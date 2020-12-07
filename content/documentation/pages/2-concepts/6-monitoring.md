---
path: 'concepts/monitoring/'
title: 'Monitoring'
description: 'Runtime monitoring of Servers, Stream and Task data pipelines'
---

# Monitoring

The Data Flow monitoring architecture helps to deliver application metrics critical to the health and performance of the server infrastructure and the deployed stream and task pipelines.

Designed around the Micrometer library, Data Flow monitoring supports some of the most popular monitoring systems, such as [Prometheus](https://prometheus.io/), [Wavefront](https://www.wavefront.com/), and [InfluxDB](https://www.influxdata.com/).

![Data Flow Servers, Streams & Tasks Monitoring Architecture](images/SCDF-monitoring-architecture.png)

[Wavefront](https://docs.wavefront.com/wavefront_introduction.html) is a high-performance streaming analytics platform that supports 3D observability (metrics, histograms, and traces and spans). It scales to very high data ingestion rates and query loads while also collecting data from many services and sources across your entire application stack.

[Prometheus](https://prometheus.io/) is a popular pull-based time series database that pulls the metrics from the target applications with pre-configured endpoints and provides a query language to select and aggregate time series data in real time.

<!--NOTE-->

The Data Flow architecture employs the [Prometheus RSocket Proxy](https://github.com/micrometer-metrics/prometheus-rsocket-proxy) to provide uniform support of both `long-lived` (streams) and `short-lived` (tasks) applications.

<!--END_NOTE-->

[InfluxDB](https://www.influxdata.com/) is a popular open-source push-based Time Series Database. It supports downsampling, automatically expiring and deleting unwanted data, and backup and restore. Analysis of data is done through an SQL-like query language.

Data Flow lets you declaratively select and configure which monitoring system to use. To do so, you can apply the Spring Boot [metrics configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html#production-ready-metrics-getting-started) to enable and configure the Data Flow monitoring support. Usually, you add the following configurations to your Data Flow and Skipper server configurations:

```
management.metrics.export.<your-meter-registry>.enabled=true // <1>
management.metrics.export.<your-meter-registry>.<meter-specific-properties>=... // <2>
```

- <1> Replace the `<your-meter-registry>` with `influx`, `wavefront`, or `prometheus`. (Note: If you use Prometheus, enable the Prometheus Rsocket proxy as well: `management.metrics.export.prometheus.rsocket.enabled=true`).

- <2> Use the Spring Boot- and Micrometer-specific configurations provided for [Wavefront](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html#production-ready-metrics-export-wavefront), [InfluxDB](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html#production-ready-metrics-export-influx) and [Prometheus](Spring Boot Actuator: Production-ready Features) and [RSocket Proxy](https://github.com/micrometer-metrics/prometheus-rsocket-proxy).

By default, the Micrometer configuration is reused for both the server infrastructure and the data pipeline monitoring.

To help you get started, Data Flow provides [Grafana](https://grafana.com/) and [Wavefront](https://docs.wavefront.com/ui_dashboards.html) dashboards that you can customize.

You can also opt for the [Wavefront Data Flow SaaS](https://www.wavefront.com/integrations/scdf) tile.

For detailed information on how to set up the monitoring infrastructure, see the following feature guides:

- [Servers Monitoring Feature Guide](%currentPath%/feature-guides/general/server-monitoring/)
- [Stream Monitoring Feature Guide](%currentPath%/feature-guides/streams/monitoring/)
- [Task Monitoring Feature Guide](%currentPath%/feature-guides/batch/monitoring/)

The following image shows Data Flow with enabled monitoring and Grafana buttons:

![Two stream definitions](images/SCDF-monitoring-grafana-buttons.png)

The following image shows the Stream applications view in the Grafana dashboard:

![Grafana Streams Dashboard](images/SCDF-monitoring-grafana-stream.png)

The following image shows the Tasks & Batch applications view in the Grafana dashboard:

![Grafana Tasks Dashboard](images/SCDF-monitoring-grafana-task.png)

The following image shows the Wavefront Stream applications dashboard:

![Wavefront Stream Application Dashboard](images/SCDF-monitoring-wavefront-applications.png)

Next, visit the [Servers Monitoring Feature Guide](%currentPath%/feature-guides/general/server-monitoring/), the [Stream Monitoring Feature Guide](%currentPath%/feature-guides/streams/monitoring/) and the [Task Monitoring Feature Guide](%currentPath%/feature-guides/batch/monitoring/) for further information on how to set up the Data Flow monitoring infrastructure.
