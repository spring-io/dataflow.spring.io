---
path: 'feature-guides/streams/named-destinations/'
title: 'Named Destinations'
description: 'Use the Named Destinations to interact with the Topics/Queues directly'
---

# Named Destinations

Instead of referencing a source or sink application, you can use a named destination.
A named destination corresponds to a specific destination name in the middleware broker (RabbitMQ, Kafka, and others). When using the `|` symbol, applications are connected to each other with messaging middleware destination names created by the Data Flow server.
In keeping with the Unix analogy, you can redirect standard input and output using the less-than (`<`) and greater-than (`>`) characters.
To specify the name of the destination, prefix it with a colon (`:`). For example, the following stream has the destination name in the `source` position:

```bash
stream create --definition ":myDestination > log" --name ingest_from_broker --deploy
```

The following stream receives messages from the destination called `myDestination`, located at the broker, and connects it to the log application. You can also create additional streams that consume data from the same named destination.

The following stream has the destination name in the `sink` position:

```bash
stream create --definition "http > :myDestination" --name ingest_to_broker --deploy
```

You can also connect two different destinations (in the source and sink positions) at the broker in a stream, as shown in the following example:

```bash
stream create --definition ":destination1 > :destination2" --name bridge_destinations --deploy
```

In the preceding stream, both the destinations (`destination1` and `destination2`) are located in the broker. The messages flow from the source destination to the sink destination over a `bridge` application that connects them.
