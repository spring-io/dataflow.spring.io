---
path: 'stream-developer-guides/continuous-delivery/'
title: 'Continuous Delivery'
description: 'CD using Skipper'
summary: true
---

# Continuous Delivery

The applications composed in the event streaming pipeline can undergo changes autonomously, such as a feature toggle enablement or a bug fix. To avoid downtime from stream processing, it is essential to update or roll back such changes to the required applications without affecting the entire data pipeline.

Spring Cloud Data Flow provides native support for continuous deployment of event streaming applications. The application registry in Spring Cloud Data Flow lets you register multiple versions for the same event streaming application. With that, when updating an event streaming pipeline running in production, you have the option to switch to a specific version of the application(s) or change any of the configuration properties of the application(s) composed in the event streaming pipeline.

In this section, you will see how you can:

- Continuous deliver streaming applications with some examples
