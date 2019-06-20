---
path: 'feature-guides/streams/taps/'
title: 'Tapping a Stream'
description: 'Create a stream from another stream without interrupting the data processing'
---

# Tapping a Stream

<!-- **TODO Review** -->

In Spring Cloud Stream terms, a named destination is a specific destination name in the messaging middleware or the streaming platform.
It could be an `exchange` in RabbitMQ or a `topic` in Apache Kafka.
In Spring Cloud Data Flow, the named destination can be treated as either a direct `source` or `sink`, based on whether it acts as a publisher or a consumer.
You can either consume data from a destination (example: a Kafka topic) or you can produce data for a destination (for example, a Kafka topic).
Spring Cloud Data Flow lets you build an event-streaming pipeline from and to the destination on the messaging middleware by using the named destination support.

The stream DSL syntax requires the named destination to be prefixed with a colon (`:`).

Suppose you want to collect the user click events from an HTTP web endpoint and send them over to a Kafka topic with the name `user-click-events`.
In this case, your stream DSL in Spring Cloud Data Flow could be as follows:

```
http > :user-click-events
```

Now the `user-click-events` Kafka topic is set up to consume the user click events from an HTTP web endpoint and thereby acts as a `sink`.

Assume that you want to create another event-streaming pipeline that consumes these user click events and stores them in an RDBMS.
The stream DSL in this case could be as follows:

```
:user-click-events > jdbc
```

Now, the Kafka topic `user-click-events` acts as a producer for the `jdbc` application.

It is a common use case to construct parallel event-streaming pipelines by forking the same data from the event publishers of the primary stream processing pipeline.
Consider the following primary stream:

```
mainstream=http | filter --expression='payload.userId != null' | transform --expression=payload.sensorValue | log
```

When the stream named `mainstream` is deployed, the Kafka topics that connect each of the applications are automatically created by Spring Cloud Data Flow by using Spring Cloud Stream.
Spring Cloud Data Flow names these topics based on the `stream` and `application` naming conventions, and you can override these names by using the appropriate Spring Cloud Stream binding properties.
In this case, three Kafka topics are created:

- `mainstream.http`: The Kafka topic that connects the HTTP source’s output to the filter processor’s input
- `mainstream.filter`: The Kafka topic that connects the filter processor’s output to the transform processor’s input
- `mainstream.transform`: The Kafka topic that connects the transform processor’s output to the log sink’s input

To create parallel stream pipelines that receive the copy from the primary stream, you need to use the Kafka topic names to construct the event streaming pipeline. For example, you may want to tap into the `http` application’s output to construct a new event streaming pipeline that receives unfiltered data. The stream DSL could be as follows:

```
unfiltered-http-events=:mainstream.http > jdbc
```

You may also want to tap into the `filter` application’s output to get a copy of the filtered data for use in another downstream persistence, as follows:

```
filtered-http-events=:mainstream.filter > mongodb
```

In Spring Cloud Data Flow, the name of the stream is unique.
Hence, it is used as the consumer group name for the application that consumes from the given Kafka topic.
This allows for multiple event streaming pipelines to get a copy of the same data instead of competing for messages.
