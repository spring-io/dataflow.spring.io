---
path: 'recipes/rabbitmq/rabbit-source-sink/'
title: 'RabbitMQ as Source and Sink'
description: 'RabbitMQ as Source and Sink + RabbitMQ binder'
---

# RabbitMQ as Source and Sink

Reading from and writing to RabbitMQ is a very common use-case. Primarily when the source and sink applications use spring Cloud Stream's RabbitMQ binder implementation, the configurations can be confusing.
The goal of this recipe is to unpack the complexity step by step.

Before we begin, let's describe the use-case requirements.

_As a user, I'd like to,_

- Consume `String` payload from a queue running in an external RabbitMQ cluster.
- For every payload, I'd like to transform by converting the received `String` to uppercase.
- Finally, I'd want to publish the transformed payload to a different queue, again running in the external RabbitMQ cluster.

To further make it more interesting, we will also use the Spring Cloud Stream's RabbitMQ binder implementation in the source, processor, and sink applications.

## Configuration

There are two levels of RabbitMQ configurations required for this use-case.

1. Configuration for RabbitMQ source and sink applications to connect to the external RabbitMQ cluster.
2. Configuration of RabbitMQ binder properties at source, processor, and sink applications. We will use a locally running RabbitMQ at `127.0.0.1` (aka: `localhost`) for the binder.

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

2. Start RabbitMQ locally at `127.0.0.1`.
3. Setup external RabbitMQ cluster and prepare the cluster connection credentials.

## Deployment

With all the prerequisites from the previous step complete, we can now start the three applications.

### Source

```bash
java -jar rabbit-source-rabbit-2.1.0.RELEASE.jar --server.port=9001 --rabbit.queues=sabbyfooz --spring.rabbitmq.addresses=amqp://<USER>:<PASSWORD>@<HOST>:<PORT> --spring.rabbitmq.username=<USER> --spring.rabbitmq.password=<PASSWORD> --spring.cloud.stream.binders.rabbitBinder.type=rabbit --spring.cloud.stream.binders.rabbitBinder.environment.spring.rabbitmq.addresses=amqp://guest:guest@127.0.0.1:5672 --spring.cloud.stream.bindings.output.destination=rabzysrc
```

[[note]]
| External RabbitMQ cluster credentials are supplied via `--spring.rabbitmq.*` properties.
| The binder configurations are supplied via `--spring.cloud.stream.binders.rabbitBinder.environment.spring.rabbitmq.*` properties.
| The prefix `spring.cloud.stream.binders` refers to the binder configuration properties while the name `rabbitBinder` is the configuration name chosen for this binder configuration.
| You'd have to replace `<USER>`, `<PASSWORD>`, `<HOST>`, and `<PORT>` with external cluster credentials.
| That's how two different RabbitMQ credentials are passed to the same application; one for the actual data and the other for binder configuration.

[[note]]
| - `sabbyfooz` is the queue from which we will be polling for new data.
|
| - `rabzysrc` is the destination to which the polled data will be published.

### Processor

```bash
java -jar transform-processor-rabbit-2.1.0.RELEASE.jar --server.port=9002 --spring.cloud.stream.binders.rabbitBinder.type=rabbit --spring.cloud.stream.binders.rabbitBinder.environment.spring.rabbitmq.addresses=amqp://guest:guest@127.0.0.1:5672 --spring.cloud.stream.bindings.input.destination=rabzysrc --spring.cloud.stream.bindings.output.destination=rabzysink --transformer.expression='''payload.toUpperCase()'''
```

[[note]]
| - `rabzysrc` is the destination from which we will be receiving new data from the source application.
|
| - `rabzysink` is the destination to which the transformed data will be published.

### Sink

```bash
java -jar rabbit-sink-rabbit-2.1.0.RELEASE.jar --server.port=9003 --rabbit.exchange=sabbyexchange --rabbit.routing-key=foo --spring.rabbitmq.addresses=amqp://<USER>:<PASSWORD>@<HOST>:<PORT> --spring.rabbitmq.username=<USER> --spring.rabbitmq.password=<PASSWORD> --spring.cloud.stream.binders.rabbitBinder.type=rabbit --spring.cloud.stream.binders.rabbitBinder.environment.spring.rabbitmq.addresses=amqp://guest:guest@127.0.0.1:5672 --spring.cloud.stream.bindings.input.destination=rabzysink
```

[[note]]
| External RabbitMQ cluster credentials are supplied via `--spring.rabbitmq.*` properties.
| The binder configurations are supplied via `--spring.cloud.stream.binders.rabbitBinder.environment.spring.rabbitmq.*` properties.
| The prefix `spring.cloud.stream.binders` refers to the binder configuration properties while the name `rabbitBinder` is the configuration name chosen for this binder configuration.
| You'd have to replace `<USER>`, `<PASSWORD>`, `<HOST>`, and `<PORT>` with external cluster credentials.
| That's how two different RabbitMQ credentials are passed to the same application; one for the actual data and the other for binder configuration.

[[note]]
| - `rabzysink` is the destination from which the transformed data will be received.
|
| - `sabbyexchange` with the `foo` routing-key is where the data will finally reach.

## Testing

### Publish Test Data

- Go to the management console of the external RabbitMQ cluster.
- Navigate to the `sabbyfooz` queue from the queues list.
- Click `Publish message` to publish the test message (i.e., `hello, rabbit!`).

![Publish Test Message](images/Publish_Test_Message.png)

### Verify Results

- Go to the management console of the external RabbitMQ cluster.
- In this sample, the `sabbyexchange` with `foo` routing-key is bound to `sabbybaaz` queue. So, let's navigate to that queue from the queues list.

![Exchange and Queue Binding](images/Bind_Exchange_To_Queue.png)

- Click `Get Message(s)` to receive the incoming messages.
- Confirm that the payload is transformed from lower to upper case (i.e., `HELLO, RABBIT!`).

![Publish Test Message](images/Receive_Test_Message.png)

That's all! This concludes the demonstration.
