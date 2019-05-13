---
path: 'concepts/monitoring/'
title: 'Monitoring'
description: 'Runtime monitoring of Stream data pipelines'
---

# Monitoring

The Data Flow metrics architecture is designed around the Micrometer library which is a Vendor-neutral application metrics facade.
It provides a simple facade over the instrumentation clients for the most popular monitoring systems.
Micrometer is the instrumentation library powering the delivery of application metrics from Spring Boot and includes metrics for message rates and errors which is critical to the monitoring of deployed Streams.

The pre-built applications are configured to support two of the most popular monitoring systems, Prometheus and InfluxDB. You can declaratively select which monitoring system to use.

To help you get started monitoring Streams, Data Flow provides Grafana Dashboards you can install and customize for your needs.

The general architecture of how applications are monitored is shown below.

![Data Flow Stream Monitoring Architecture](images/micrometer-arch.png)

Creating two streams defined with the DSL expression `time | filter | log` as shown below

![Two stream defintions](images/monitoring-stream-defs.png)

You can view a dashboard in Grafana as shown below.

![Grafana Dashboard](images/grafana-dashboard.png)

The [Stream Monitoring Feature Guide](%currentPath%/feature-guides/streams/monitoring/) contains detailed information on how to set up the monitoring infrastructure.
