---
path: 'feature-guides/streams/application-count/'
title: 'Application Count'
description: 'Initiate stream deployment with multiple application instances'
---

# Application Count

In the following example, you can specify the number of instances on each application in the stream pipeline:

```
 stream create http-ingest --definition "http --server.port=9000 | log"
```

When deploying the stream, you can specify the `count`, as follows:

```
 stream deploy http-ingest "deployer.log.count=3"
```
