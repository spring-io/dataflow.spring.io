---
path: 'recipes/rabbitmq/rabbit-source-sink/'
title: 'RabbitMQ as Source and Sink'
description: 'RabbitMQ as Source and Sink + RabbitMQ binder'
---

# RabbitMQ as Source and Sink

Reading from and writing to RabbitMQ is a very common use-case. Primarily, when the source and sink applications use Spring Cloud Stream's RabbitMQ binder implementation, the configurations can be confusing.
The goal of this recipe is to unpack the complexity step by step.

Before we begin, we describe the use-case requirements.

_As a user, I want to:_

- Consume a `String` payload from a queue that runs in an external RabbitMQ cluster.
- For every payload, I want to transform it by converting the received `String` to uppercase.
- Finally, I want to publish the transformed payload to a different queue, that again runs in the external RabbitMQ cluster.

To further make it more interesting, we also use the Spring Cloud Stream's RabbitMQ binder implementation in the source, processor, and sink applications.

## Configuration

There are two levels of RabbitMQ configurations required for this use case.

- Configuration of RabbitMQ source and sink applications to connect to the external RabbitMQ cluster.
- Configuration of RabbitMQ binder properties at the source, processor, and sink applications. We use a locally running RabbitMQ at `127.0.0.1` (aka: `localhost`) for the binder.

## Prerequisite

1. Download the [`rabbit-source`](https://github.com/spring-cloud-stream-app-starters/rabbit/blob/master/spring-cloud-starter-stream-source-rabbit/README.adoc), [`transform-processor`](https://github.com/spring-cloud-stream-app-starters/transform/blob/master/spring-cloud-starter-stream-processor-transform/README.adoc), and [`rabbit-sink`](https://github.com/spring-cloud-stream-app-starters/rabbit/blob/master/spring-cloud-starter-stream-sink-rabbit/README.adoc) applications.

   ```bash
   wget https://repo.spring.io/release/org/springframework/cloud/stream/app/rabbit-source-rabbit/2.1.0.RELEASE/rabbit-source-rabbit-2.1.0.RELEASE.jar
   ```

   ```bash
   wget https://repo.spring.io/release/org/springframework/cloud/stream/app/transform-processor-rabbit/2.1.0.RELEASE/transform-processor-rabbit-2.1.0.RELEASE.jar
   ```

   ```bash
   wget https://repo.spring.io/release/org/springframework/cloud/stream/app/rabbit-sink-rabbit/2.1.0.RELEASE/rabbit-sink-rabbit-2.1.0.RELEASE.jar
   ```

1. Start RabbitMQ locally at `127.0.0.1`.
1. Set up external an RabbitMQ cluster and prepare the cluster connection credentials.

## Deployment

With all the prerequisites from the previous step complete, we can now start the three applications.

### Source

To start the source application, run the following command:

```bash
java -jar rabbit-source-rabbit-2.1.0.RELEASE.jar --server.port=9001 --rabbit.queues=sabbyfooz --spring.rabbitmq.addresses=amqp://<USER>:<PASSWORD>@<HOST>:<PORT> --spring.rabbitmq.username=<USER> --spring.rabbitmq.password=<PASSWORD> --spring.cloud.stream.binders.rabbitBinder.type=rabbit --spring.cloud.stream.binders.rabbitBinder.environment.spring.rabbitmq.addresses=amqp://guest:guest@127.0.0.1:5672 --spring.cloud.stream.bindings.output.destination=rabzysrc
```

<!-- NOTE -->

External RabbitMQ cluster credentials are supplied via `--spring.rabbitmq.*` properties.
The binder configurations are supplied via `--spring.cloud.stream.binders.rabbitBinder.environment.spring.rabbitmq.*` properties.
The prefix `spring.cloud.stream.binders` refers to the binder configuration properties while the name `rabbitBinder` is the configuration name chosen for this binder configuration.
You'd have to replace `<USER>`, `<PASSWORD>`, `<HOST>`, and `<PORT>` with external cluster credentials.
That's how two different RabbitMQ credentials are passed to the same application; one for the actual data and the other for binder configuration.

<!-- END_NOTE -->

<!-- NOTE -->

- `sabbyfooz` is the queue from which we will be polling for new data.
- `rabzysrc` is the destination to which the polled data will be published.

<!-- END_NOTE -->

### Processor

To start the processor application, run the following command:

```bash
java -jar transform-processor-rabbit-2.1.0.RELEASE.jar --server.port=9002 --spring.cloud.stream.binders.rabbitBinder.type=rabbit --spring.cloud.stream.binders.rabbitBinder.environment.spring.rabbitmq.addresses=amqp://guest:guest@127.0.0.1:5672 --spring.cloud.stream.bindings.input.destination=rabzysrc --spring.cloud.stream.bindings.output.destination=rabzysink --transformer.expression='''payload.toUpperCase()'''
```

<!-- NOTE -->

- `rabzysrc` is the destination from which we will be receiving new data from the source application.
- `rabzysink` is the destination to which the transformed data will be published.

<!-- END_NOTE -->

### Sink

To start the sink application, run the following command:

```bash
java -jar rabbit-sink-rabbit-2.1.0.RELEASE.jar --server.port=9003 --rabbit.exchange=sabbyexchange --rabbit.routing-key=foo --spring.rabbitmq.addresses=amqp://<USER>:<PASSWORD>@<HOST>:<PORT> --spring.rabbitmq.username=<USER> --spring.rabbitmq.password=<PASSWORD> --spring.cloud.stream.binders.rabbitBinder.type=rabbit --spring.cloud.stream.binders.rabbitBinder.environment.spring.rabbitmq.addresses=amqp://guest:guest@127.0.0.1:5672 --spring.cloud.stream.bindings.input.destination=rabzysink
```

<!-- NOTE -->
External RabbitMQ cluster credentials are supplied via `--spring.rabbitmq.*` properties.
The binder configurations are supplied via `--spring.cloud.stream.binders.rabbitBinder.environment.spring.rabbitmq.*` properties.
The prefix `spring.cloud.stream.binders` refers to the binder configuration properties while the name `rabbitBinder` is the configuration name chosen for this binder configuration.
You'd have to replace `<USER>`, `<PASSWORD>`, `<HOST>`, and `<PORT>` with external cluster credentials.
That's how two different RabbitMQ credentials are passed to the same application; one for the actual data and the other for binder configuration.

<!-- END_NOTE -->

<!-- NOTE -->

- `rabzysink` is the destination from which the transformed data will be received.
- `sabbyexchange` with the `foo` routing-key is where the data will finally reach.

<!-- END_NOTE -->

## Testing

This section covers how to test your stream.

### Publish Test Data

To publish test data so that you have something to verify:

1. Go to the management console of the external RabbitMQ cluster.
1. Navigate to the `sabbyfooz` queue from the queues list.
1. Click `Publish message` to publish the test message (`hello, rabbit!`).

![Publish Test Message](images/Publish_Test_Message.png)

### Verify Results

To verify the data you published:

1. Go to the management console of the external RabbitMQ cluster.
1. In this sample, the `sabbyexchange` with the `foo` routing key is bound to the `sabbybaaz` queue. You can then navigate to that queue from the queues list.
![Exchange and Queue Binding](images/Bind_Exchange_To_Queue.png)
1. Click `Get Message(s)` to receive the incoming messages.
1. Confirm that the payload is transformed from lower to upper case (that is, `HELLO, RABBIT!`).

![Publish Test Message](images/Receive_Test_Message.png)

You are done! This concludes the demonstration.
