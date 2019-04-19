---
path: 'feature-guides/streams/application-count/'
title: 'Application Count'
description: 'How many instances of a stream application to initially deploy'
---


In the following example, you can specify the number of instances on each application in the stream pipeline.

```
dataflow:> stream create http-ingest --definition "http --server.port=9000 | log"
```

When deploying the stream, you can specify the `count`

```
dataflow:> stream deploy http-ingest "deployer.log.count=3"
```
