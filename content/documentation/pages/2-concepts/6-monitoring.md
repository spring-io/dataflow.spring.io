---
path: 'concepts/monitoring/'
title: 'Monitoring'
description: 'Runtime monitoring of Stream data pipelines'
---

# Monitoring

The Data Flow metrics architecture is designed around the Micrometer library, which is a vendor-neutral application metrics facade, supporting the most popular monitoring systems.

![Data Flow Stream&Task Monitoring Architecture](images/SCDF-monitoring-architecture.png)

The Micrometer instrumentation library powers the delivery of application metrics from Spring Boot and includes metrics for message rates and errors, which is critical to the monitoring of deployed streams.

The prebuilt applications are configured to support two of the most popular monitoring systems, Prometheus and InfluxDB. You can declaratively select which monitoring system to use.

To help you get started, Data Flow provides Grafana Dashboards that you can customize for your needs.

The following image shows the creation of two streams defined with the `time | filter | log` DSL expression:

![Two stream definitions](images/monitoring-stream-defs.png)

The following image shows the Stream applications view in the Grafana dashboard:

![Grafana Streams Dashboard](images/grafana-dashboard.png)

Here's the Tasks & Batch applications view in Grafana dashboard:

![Grafana Tasks Dashboard](images/SCDF-metrics-grafana-task.png)

The [Stream Monitoring Feature Guide](%currentPath%/feature-guides/streams/monitoring/) and [Task Monitoring Feature Guide](%currentPath%/feature-guides/batch/monitoring/) contains detailed information on how to set up the monitoring infrastructure.
