---
path: 'batch-developer-guides/batch/'
title: 'Batch Development'
description: 'Batch Developer Guide'
summary: true
---

This section will cover the basics of creating a Spring Cloud Task application as well as a Spring Batch Application that can be deployed to Cloud Foundry, Kubernates, or a local instance.
This section will show you how to deploy these applications using the tools available for each platform, but more importantly how Spring Cloud Data Flow can simplify the deployment and montoring of these applications.

The sample business case that this section will support will be one of a cell phone company that needs to run an application that will generate the billing statements for their customers.
This will be done in two phases. Phase one will be a Spring Cloud Task application will prepare the database for the bill run. Phase two will be a bill run that will generate a billing statement record based on the usage data provided.
