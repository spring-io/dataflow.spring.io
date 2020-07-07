---
path: 'concepts/monitoring/'
title: 'Monitoring'
description: 'Runtime monitoring of Stream data pipelines'
---

# Monitoring

The Data Flow metrics architecture is designed around the Micrometer library, which is a vendor-neutral application metrics facade, supporting the most popular monitoring systems.

![Data Flow Stream&Task Monitoring Architecture](images/SCDF-monitoring-architecture.png)

The Micrometer instrumentation library powers the delivery of application metrics from Spring Boot and includes metrics for message rates and errors, which is critical to the monitoring of deployed streams.

The prebuilt applications are configured to support two of the most popular monitoring systems, Prometheus, Wavefront and InfluxDB. You can declaratively select which monitoring system to use.

To help you get started, Data Flow provides Grafana and Wavefront dashboards that you can customize for your needs.
You can also opt for the [Wavefront Data Flow Integration Tile](https://www.wavefront.com/integrations/).

Follow the [Stream Monitoring Feature Guide](%currentPath%/feature-guides/streams/monitoring/) and [Task Monitoring Feature Guide](%currentPath%/feature-guides/batch/monitoring/) for detailed information on how to set up the monitoring infrastructure.

The following image shows Data Flow with enabled monitoring and Grafana buttons:

![Two stream definitions](images/SCDF-monitoring-grafana-buttons.png)

The following image shows the Stream applications view in the Grafana dashboard:

![Grafana Streams Dashboard|250X190](images/SCDF-monitoring-grafana-stream.png)

Here's the Tasks & Batch applications view in Grafana dashboard:

![Grafana Tasks Dashboard](images/SCDF-monitoring-grafana-task.png)

Here's Wavefront Stream applications dashboard:

![Wavefront Stream Application Dashboard](images/SCDF-monitoring-wavefront-applications.png)

Next: visit the [Stream Monitoring Feature Guide](%currentPath%/feature-guides/streams/monitoring/) and [Task Monitoring Feature Guide](%currentPath%/feature-guides/batch/monitoring/) guides for further information on how to set up the Data Flow monitoring infrastructure.
