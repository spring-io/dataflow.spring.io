---
path: 'recipes/polyglot/app/'
title: 'Python App'
description: 'Python/Docker as SCDF App'
---

# Python/Docker as SCDF APP

This example illustrates how to deploy a Python script as an [application](http://docs.spring.io/spring-cloud-dataflow/docs/2.1.0.BUILD-SNAPSHOT/reference/htmlsingle/#spring-cloud-dataflow-stream-app-dsl) in a Stream. This is different than deploying a `source`, `processor` or `sink` since Data Flow will not set environment variables that wire up the producers and consumers or set any other application properties by default.

It uses the [kafka-python](https://github.com/dpkp/kafka-python) to consume from the `orders` topic and publishes to either a `cold.drink` or `hot.drink` topic.

**TODO: Source code to be moved into data flow samples repo in a directory structure that mimics the dataflow.io directory structure. There is already some content in there to get an idea of the directory structure.**

**TODO provide a .zip file of all the source code**

The source code can be found [here](https://github.com/tzolov/scdf-polyglot-experiments/tree/master/scdf_python_app).

## Description

The sample emulates a Barista use-case. It consumes orders (represented by timestamp numbers) from an input Kafka topic and in turn serves Hot and Cold drinks to two output topics. The barista app servers hot drinks for even number orders and cold drinks for odd numbered orders.

The [barista_app.py](https://github.com/tzolov/scdf-polyglot-experiments/blob/master/scdf_python_app/barista_app.py) shows the main application logic.

```python
from util.actuator import Actuator
from util.arguments import get_kafka_brokers, get_env_info, get_channel_topic

class Barista:

 def __init__(self, info, kafka_brokers, orders, hot_drinks, cold_drinks):
   self.kafka_brokers = kafka_brokers
   self.orders_topic = orders
   self.hot_drink_topic = hot_drinks
   self.cold_drink_topic = cold_drinks

   Actuator.start(port=8080, info=info)

   self.consumer = KafkaConsumer(self.orders_topic, bootstrap_servers=self.kafka_brokers)
   self.producer = KafkaProducer(bootstrap_servers=self.kafka_brokers)

 def process_orders(self):
   while True:
     for message in self.consumer:
       if message.value is not None:
         if self.is_even_order(message.value):
           self.producer.send(self.hot_drink_topic, b'Serve Hot drink')
         else:
           self.producer.send(self.cold_drink_topic, b'Serve Cold drink')

Barista(
   get_env_info(),
   get_kafka_brokers(),
   get_channel_topic('orders'),
   get_channel_topic('hot.drink'),
   get_channel_topic('cold.drink')
).process_orders()

```

[[note]]
| If you happen to use print command inside the processing loop you must flush it (e.g. sys.stdout.flush()), otherwise there is a chance that your output buffer will be filled up causing disruption to the Kafka’s consumer/producer processing flow!

The Actuator runs the HTTP liveliness server in a separate thread. The kafka-python library is used to consume and produce Kafka messages. The process_orders method continuously consumes orders from the input channel and send hot or cold drinks to the output channels.

The [Actuator](https://github.com/tzolov/scdf-polyglot-experiments/blob/master/scdf_python_app/util/actuator.py#L7) class inside [actuator.py](https://github.com/tzolov/scdf-polyglot-experiments/blob/master/scdf_python_app/util/actuator.py) utility is used to expose operational information about the running application, such as health/liveliness, info, etc.
It runs an embedded HTTP server and exposes the /actuator/health and /actuator/info entry-points handles the Kubernetes liveness and readiness probes requests.

The [arguments.py](https://github.com/tzolov/scdf-polyglot-experiments/blob/master/scdf_python_app/util/arguments.py) utility helps to retrieve the required input parameters from the command line arguments and environment variables.
The utility assumes default (e.g. exec) [entry point style](http://docs.spring.io/spring-cloud-dataflow/docs/2.1.0.BUILD-SNAPSHOT/reference/htmlsingle/#_entry_point_style_2).
Note that Data Flow passes the Kafka broker connection properties as environment variables.

## Build

From within the `[scdf-polyglot-experiments`, build and push the scdf_python_app Docker image to DockerHub:

```bash
docker build -t tzolov/scdf_python_app:0.1 .
docker push tzolov/scdf_python_app:0.1
```

## Usage

Retrieve the Data Flow url from minikube (minikube service --url scdf-server) and configure your dataflow shell:
`dataflow config server --uri http://192.168.99.100:30868`

Import the SCDF app starters and register the scdf_python_app as barista-app of type `app`

```bash
dataflow:> app import --uri http://bit.ly/Einstein-SR2-stream-applications-kafka-docker
dataflow:> app register --type app --name barista-app --uri docker://tzolov/scdf_python_app:0.1
```

The `docker://tzolov/scdf_python_app:0.1` is resolved from the DockerHub repository.

Create the orders, cold-drink-line and hot-drink-line, bar pipelines:

** TODO: We may have spoken about this, but it isn't clear what `:hotDrinks > hot-drinks: log` is doing.**

```bash
dataflow:> stream create --name orders --definition "customer: time > :orders" --deploy
dataflow:> stream create --name hot-drink-line --definition ":hotDrinks > hot-drinks: log" --deploy
dataflow:> stream create --name cold-drink-line --definition ":coldDrinks > cold-drinks: log" --deploy
dataflow:> stream create --name bar --definition "barista-app"

```

As result the following Stream will be deployed:

![Barista Applications - Not Wired](images/polyglot-python-app-barista.png)

- `orders` generates drink orders using the `time` source application to send timestamps that represent the orders. The orders are sent to the Kafka topic named `orders`.
- `hot-drink-line` logs the hot drinks coming through the Kafka topic named `hotDrinks`
- `cold-drink-line` logs the cold drinks coming through Kakfa topic named `coldDrinks`

Note that the barista-app was registered an with the [app](http://docs.spring.io/spring-cloud-dataflow/docs/2.1.0.BUILD-SNAPSHOT/reference/htmlsingle/#spring-cloud-dataflow-stream-app-dsl) `application` type, e.g. not `source`, `processor` or `sink`.
Unlike the `source`, `processor` and `sink` types, the `application` type can have multiple input and output bindings and therefore the Data Flow cannot make any assumptions about the flow of data from one application to another.
It is the developer’s responsibility to 'wire up' the multiple applications when deploying in order for them to communicate.

Keeping this in mind we deploy the bar with the following deployment properties:
**TODO how to format this so the the properties are shown but the copy to buffer still creates a valid string to cut-n-paste into the shell?**

```bash
dataflow:> stream deploy --name bar
--properties app.barista-app.spring.cloud.stream.bindings.orders.destination=orders,
app.barista-app.spring.cloud.stream.bindings.hot.drink.destination=hotDrinks,
app.barista-app.spring.cloud.stream.bindings.cold.drink.destination=coldDrinks
```

[[tip]]
| the app.barrista-app.xxx prefix is a Data Flow convention to map the properties specifed after the prefix to the barista-app in the bar stream.

The orders channel is bound to the orders Kafka topic, the hot.drink barista output channel is bound to the hotDrinks topic and the cold.drink channel is bound to the coldDrinks topic.
After the deployment the data flow would look like this:

![Barista Applications - Wired](images/polyglot-python-app-barista-wired.png)

Use `kubectl get all` command to list the statuses of the deployed k8s containers. Use `kubectl logs -f xxx` to observe the hot and cold drink pipeline output.
For example `kubectl logs -f po/cold-drink-line-cold-drinks-xxx` should show output:

![Barista -Cold Drink Line Log](images/cold-drink-line-cold-drinks-log.png)

For example `kubectl logs -f po/hot-drink-line-hot-drinks-xxx` should show output:

![Barista - Hot Drink Line Log](images/cold-drink-line-hot-drinks-log.png)
