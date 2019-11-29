---
path: 'feature-guides/streams/partitioning/'
title: 'Data Partitioning'
description: 'Learn more about data partitioning support to build stateful streaming data pipelines'
---

# Data Partitioning

Partitioning is a critical concept in stateful processing, for either performance or consistency reasons, to ensure that all related data is processed together.
For example, in a time-windowed average calculation example, it is important that all measurements from any given sensor are processed by the same application instance.
Alternatively, you may want to cache some data related to the incoming events so that it can be enriched without making a remote procedure call to retrieve the related data.

Partitioning support allows for content-based routing of payloads to the downstream application instances in a streaming data pipeline.
This is especially useful when you want to have your downstream application instances processing data from specific partitions from the upstream application.
For instance, if a processor application in the data pipeline is performing operations based on a unique identifier from the payload (such as `customerId`), the stream can be partitioned based on that unique identity.

### Stream partition properties

You can pass the following partition properties during stream deployment to declaratively configure a partitioning strategy to route each message to a specific consumer instance.

The following list shows variations of deploying partitioned streams:

- `app.[app/label name].producer.partitionKeyExtractorClass`: The class name of a `PartitionKeyExtractorStrategy` (default: null).

- `app.[app/label name].producer.partitionKeyExpression`: A SpEL expression that is evaluated against the message to determine the partition key. It applies only if `partitionKeyExtractorClass` is null. If both are null, the application is not partitioned (default: null).

- `app.[app/label name].producer.partitionSelectorClass`: The class name of a `PartitionSelectorStrategy` (default: null).

- `app.[app/label name].producer.partitionSelectorExpression`: A SpEL expression that is evaluated against the partition key to determine the partition index to which the message is routed. The final partition index is the return value (an integer) modulo `[nextModule].count`. If both the class and the expression are null, the underlying binder’s default `PartitionSelectorStrategy` is applied to the key (default: null).

In summary, an application is partitioned if its deployment instances count is >1 and the previous application has a `partitionKeyExtractorClass` or `partitionKeyExpression` (`partitionKeyExtractorClass` takes precedence). When a partition key is extracted, the partitioned application instance is determined by invoking the `partitionSelectorClass`, if present, or the `partitionSelectorExpression % partitionCount`. `partitionCount` is application count (in the case of RabbitMQ) or the underlying partition count of the topic (in the case of Kafka).

If neither a `partitionSelectorClass` nor a `partitionSelectorExpression` is present, the result is `key.hashCode() % partitionCount`.

### Deploying a Stream with Partitioned Downstream Applications

You can set up Spring Cloud Data Flow and Spring Cloud Skipper servers by using the [installation guide](%currentPath%/installation/).

We use the out-of-the-box `http`, `splitter`, and `log` applications in this example.

#### Creating the Stream

This section shows how to create and deploy a partitioned stream.

Consider the following stream:

- An `http` source application listens at port 9001 for an incoming sentence.
- A `splitter` processor application splits the sentence into words and partitions the words based on their hash value (by using the `payload` as the `partitionKeyExpression`).
- A `log` sink application is scaled to run three application instances, and each instance is expected to receive unique hash values from upstream.

To create this stream:

1. From the Spring Cloud Data Flow Dashboard UI, select `Streams` from the left navigation bar. Doing so displays the main Streams view, as the following image shows:

   ![Create stream](images/SCDF-create-stream.png)

1. Select `Create stream(s)` to display a graphical editor to create the stream definition, as the following image shows:

   ![Create partitioned stream definition](images/SCDF-create-partitioned-stream-definition.png)

   You can see the `Source`, `Processor`, and `Sink` applications (registered earlier) in the left panel.

1. Drag and drop each application to the canvas.

1. Use the handles to connect them together.

   Notice the equivalent Data Flow DSL definition in the top text panel.
   You can also enter the Stream DSL text as follows:

   ```
   words=http --server.port=9001 | splitter --expression=payload.split(' ') | log
   ```

1. Click `Create Stream`.

### Deploy the Stream

To deploy a stream, click on the arrowhead icon to deploy the stream.
Doing so takes you to the Deploy Stream page, where you can enter additional deployment properties.

For this stream, we need to specify the following:

- The upstream application's partitioning criteria
- The downstream application count

In our case, we need to set the following properties:

```
app.splitter.producer.partitionKeyExpression=payload
deployer.log.count=3
```

From the Dashboard's stream deployment page, you can enter:

- `producer.partitionKeyExpression`: Set it to `payload` for the `splitter` application.
- `count`: Set it to `3` for the `log` application.

Then click `Deploy stream`, as the following image shows:

![Deploy stream](images/SCDF-deploy-partitioned-stream.png)

You can check the status of the stream from the `Runtime` page.

When all the applications are running, the stream is successfully deployed, as the following image shows:

![Stream deployed](images/SCDF-status-partitioned-stream.png)

Once all the applications are running, we can start posting data to the `http` source.

You can use the following `curl` command to post some data:

```
curl -X POST http://localhost:9001 -H "Content-Type: text/plain" -d "How much wood would a woodchuck chuck if a woodchuck could chuck wood"
```

To access the `log` application instances' log file, click `Runtime` and click the `log` application name (`words.log-v1`) to see the stdout log files location of each `log` application instance.

You can tail the stdout file of each `log` application instance.

From the log, you can see that the output data from `splitter` application is partitioned and received by the `log` application instances.

The following listing shows the log output of `log` instance 1:

```
2019-05-10 20:59:58.574  INFO 13673 --- [itter.words-0-1] log-sink                                 : much
2019-05-10 20:59:58.587  INFO 13673 --- [itter.words-0-1] log-sink                                 : wood
2019-05-10 20:59:58.600  INFO 13673 --- [itter.words-0-1] log-sink                                 : would
2019-05-10 20:59:58.604  INFO 13673 --- [itter.words-0-1] log-sink                                 : if
2019-05-10 20:59:58.609  INFO 13673 --- [itter.words-0-1] log-sink                                 : wood
```

The following listing shows the log output of `log` instance 2:

```
2019-05-10 20:59:58.579  INFO 13674 --- [itter.words-1-1] log-sink                                 : a
2019-05-10 20:59:58.589  INFO 13674 --- [itter.words-1-1] log-sink                                 : chuck
2019-05-10 20:59:58.595  INFO 13674 --- [itter.words-1-1] log-sink                                 : a
2019-05-10 20:59:58.598  INFO 13674 --- [itter.words-1-1] log-sink                                 : could
2019-05-10 20:59:58.602  INFO 13674 --- [itter.words-1-1] log-sink                                 : chuck
```

The following listing shows the log output of `log` instance 3:

```
2019-05-10 20:59:58.573  INFO 13675 --- [itter.words-2-1] log-sink                                 : How
2019-05-10 20:59:58.582  INFO 13675 --- [itter.words-2-1] log-sink                                 : woodchuck
2019-05-10 20:59:58.586  INFO 13675 --- [itter.words-2-1] log-sink                                 : woodchuck
```
