---
path: 'feature-guides/streams/partitioning/'
title: 'Data Partitioning'
description: 'How to use partitioning'
---


Partitioning support allows for content-based routing of payloads to downstream application instances in an event streaming pipeline.
This is especially useful when you want to have your downstream application instances processing data from specific partitions.
For instance, if a processor application in the data pipeline that is performing operations based on a unique identifier from the payload (e.g., customerId), the stream can be partitioned based on that unique identity.

