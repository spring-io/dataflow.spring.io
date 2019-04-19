---
path: 'feature-guides/streams/taps/'
title: 'Tapping a Stream'
description: 'Creating a Stream from an application in another stream..'
---

**TODO Review**

In Spring Cloud Stream terms, a named destination is a specific destination name in the messaging middleware or the streaming platform.
It could be an `exchange` in RabbitMQ or a `topic` in Apache Kafka.
In Spring Cloud Data Flow, the named destination can either be treated as a direct `source` or `sink` based on whether it acts as a publisher or a consumer.
You would either consume data from a destination (example: a Kafka topic), or you would produce data into a destination (example: a Kafka topic).
Spring Cloud Data Flow lets you build an event streaming pipeline from/to the destination on the messaging middleware using the named destination support.

The stream DSL syntax requires the named destination to be prefixed with a colon ‘:’.

Let’s say you want to collect the user/clicks events from an HTTP web endpoint and send them over to a Kafka topic with the name `user-click-events`.
In this case, your stream DSL in Spring Cloud Data Flow would look like this:

```
http > :user-click-events
```

Now the Kafka topic `user-click-events` is set up to consume the user click events from an HTTP web endpoint and thereby acts as a `sink`.

Let’s assume that you want to create another event streaming pipeline that consumes these user click events and store them in an RDBMS.
The stream DSL in this case would look like this:

```
:user-click-events > jdbc
```

Now, the Kafka topic `user-click-events` acts as a producer for the `jdbc` application.

It is a common use case to construct parallel event streaming pipelines by forking the same data from the event publishers of the primary stream processing pipeline.
For the following primary stream:

```
mainstream=http | filter --expression='payload.userId != null' | transform --expression=payload.sensorValue | log
```

When the stream named `mainstream` is deployed, the Kafka topics that connect each of the applications are created by Spring Cloud Data Flow automatically using Spring Cloud Stream.
Spring Cloud Data Flow names these topics based on the `stream` and `application` naming conventions, and you can override these names by using the appropriate Spring Cloud Stream binding properties.
In this case, three Kafka topics will be created:
`mainstream.http`: the Kafka topic that connects the http source’s output to the filter processor’s input
`mainstream.filter`: the Kafka topic that connects the filter processor’s output to the transform processor’s input
`mainstream.transform`: the Kafka topic that connects the transform processor’s output to the log sink’s input

To create parallel stream pipelines that receive the copy from the primary stream, you need to use the Kafka topic names to construct the event streaming pipeline. For example:
You may want to tap into the `http` application’s output to construct a new event streaming pipeline that receives unfiltered data. The stream DSL would look like:

```
unfiltered-http-events=:mainstream.http > jdbc
```

You may also want to tap into the `filter` application’s output to get a copy of the filtered data for use in another downstream persistence:

```
filtered-http-events=:mainstream.filter > mongodb
```

In Spring Cloud Data Flow, the name of the stream is unique.
Hence, it is used as the consumer group name for the application that consumes from the given Kafka topic.
This allows for multiple event streaming pipelines to get a copy of the same data instead of competing for messages.
