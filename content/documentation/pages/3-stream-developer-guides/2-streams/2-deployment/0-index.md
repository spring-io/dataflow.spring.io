---
path: 'stream-developer-guides/streams/deployment'
title: 'Stream Application Deployment'
description: 'Deploy stream sample applications'
---

# Deployment

In this section, we walk through how to deploy the [sample stream applications](%currentPath%/stream-developer-guides/streams/standalone-stream-sample) as standalone applications to the local host, Kubernetes, or Cloud Foundry.

<!--TIP-->

This section describes standalone deployment of a distributed streaming pipeline using only native utilities for the selected platform. If you want to skip these steps by using Spring Cloud DataFlow, please see [Stream Processing using Spring Cloud Data Flow](%currentPath%/stream-developer-guides/streams/data-flow-stream/).

<!--END_TIP-->

When you deploy these three applications (`UsageDetailSender`, `UsageCostProcessor`, and `UsageCostLogger`), they form a pipeline in which the message flow is:

```
UsageDetailSender -> UsageCostProcessor -> UsageCostLogger
```

The `UsageDetailSender` source application's `Supplier` output is connected to the `UsageCostProcessor` processor application's `Function` input.
The `UsageCostProcessor` application's `Function` output is connected to the `UsageCostLogger` sink application's `Consumer` input.

When these applications run, the configured Message binder binds the configured inputs and outputs to the message broker's configured destinations (exchanges, queues, topics). The message broker must be running and accessible to the application runtime environment. Spring Cloud Stream will programmatically create the required resources if necessary, or use existing ones.

Select one of the following deployment platforms for detailed deployment instructions:

- [Local](%currentPath%/stream-developer-guides/streams/deployment/local)
- [Kubernetes](%currentPath%/stream-developer-guides/streams/deployment/kubernetes)
- [Cloud Foundry](%currentPath%/stream-developer-guides/streams/deployment/cloudfoundry)
