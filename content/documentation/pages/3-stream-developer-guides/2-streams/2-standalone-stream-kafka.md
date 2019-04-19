---
path: 'stream-developer-guides/streams/standalone-stream-kafka/'
title: 'Standalone Streaming Application Development on Apache Kafka'
description: 'Create a simple stream processing application on Apache Kafka'
---

# Stream Processing with Apache Kafka

In this guide we will create three types of Spring Cloud Stream applications, a `source`, `processor` and `sink`.

**TODO describe what the source, processor and sink will do, introduce the domain model.**
**TODO we can remove a step by not requiring the domain object to be in its own package**

We will then run them on your local machine, Cloud Foundry and Kubernetes without using Data Flow.
This provides a foundation to understand the steps that Data Flow is will automate for you.

## Development

### Source

You can develop the source application by following the steps listed below or **TODO download the completed source example**

Either visit the [Spring Initialzr site](https://start.spring.io/) and follow the instructions below or [download the initialzr generated project directly](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&baseDir=usage-detail-sender&groupId=io.spring.dataflow.sample&artifactId=usage-detail-sender&name=usage-detail-sender&description=Sample+project+for+Spring+Cloud+Stream+Source&packageName=io.spring.dataflow.sample&packaging=jar&javaVersion=1.8&inputSearch=&style=amqp&style=cloud-stream)

1. Create a new Maven project with a Group name of `io.spring.dataflow.sample` and an Artifact name of `usage-detail-sender`.
1. In the Dependencies text box, type `rabbitmq` to select the RabbitMQ binder dependency.
1. In the Dependencies text box, type `Cloud Stream` to select the Spring Cloud Stream dependency.
1. Click the Generate Project button.

Now you should `unzip` the `usage-detail-sender.zip` file and import the project into your favorite IDE.

#### Business Logic

If you haven't downloaded the completed source example, you will need to perform the following development steps.

1.  In your favorite IDE create the `io.spring.dataflow.sample.domain` package.
1.  Create a `UsageDetail` class in the `io.spring.dataflow.sample.domain` using your favorite IDE that looks like the contents in [UsageDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/usage-detail-sender/src/main/java/io/spring/dataflow/sample/domain/UsageDetail.java).
    This `UsageDetail` model contains `userId`, `data` and `duration` properties.
1.  Create the class `UsageDetailSender` that will send `UsageDetail` objects or each user populated with call duration, data usage.

    ```java
    @EnableScheduling
    @EnableBinding(Source.class)
    public class UsageDetailSender {

    	@Autowired
    	private Source source;

    	private String[] users = {"Glenn", "Sabby", "Mark", "Janne", "Ilaya"};

    	@Scheduled(fixedDelay = 1000)
    	public void sendEvents() {
    		UsageDetail usageDetail = new UsageDetail();
    		usageDetail.setUserId(this.users[new Random().nextInt(5)]);
    		usageDetail.setDuration(new Random().nextInt(300));
    		usageDetail.setData(new Random().nextInt(700));
    		this.source.output().send(MessageBuilder.withPayload(usageDetail).build());
    	}
    }
    ```

**TODO some discussion of the annotations should be made**

### Processor

You can develop the processor application by following the steps listed below or **TODO download the completed processor example**

Either visit the [Spring Initialzr site](https://start.spring.io/) and follow the instructions below or [download the initialzr generated project directly](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&baseDir=usage-cost-processor&groupId=io.spring.dataflow.sample&artifactId=usage-cost-processor&name=usage-cost-processor&description=Sample+project+for+Spring+Cloud+Stream+Processor&packageName=com.example.demosource&packaging=jar&javaVersion=1.8&inputSearch=&style=amqp&style=cloud-stream)

1. Create a new Maven project with a Group name of `com.example` and an Artifact name of `usage-cost-processor`.
1. In the Dependencies text box, type `kafka` to select the RabbitMQ binder dependency.
1. In the Dependencies text box, type `cloud stream` to select the Spring Cloud Stream dependency.
1. Click the Generate Project button.

Now you should `unzip` the `usage-cost-processor.zip` file and import the project into your favorite IDE.

#### Business Logic

If you haven't downloaded the completed processor example, you will need to perform the following development steps.

1.  In your favorite IDE create the `io.spring.dataflow.sample.domain` package.
1.  Create a `UsageDetail` class in the `io.spring.dataflow.sample.domain` using your favorite IDE that looks like the contents in [UsageDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/usage-cost-processor/src/main/java/io/spring/dataflow/sample/domain/UsageDetail.java).
    This `UsageDetail` model contains `userId`, `data` and `duration` properties.
1.  Create a `UsageCostDetail` class in the `io.spring.dataflow.sample.domain` using using your favorite IDE that looks like the contents in [UsageCostDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/usage-cost-processor/src/main/java/io/spring/dataflow/sample/domain/UsageCostDetail.java).
    This `UsageCostDetail` model contains `userId`, `callCost` and `dataCost` properites.
1.  Create the `Processor` application that receives the `UsageDetail` from the previously created `source`, computes the call/data cost and returning the `UsageCostDetail`.

    ```java
    @EnableBinding(Processor.class)
    public class UsageCostProcessor {

      private double ratePerSecond = 0.1;

      private double ratePerMB = 0.05;

      @StreamListener(Processor.INPUT)
      @SendTo(Processor.OUTPUT)
      public UsageCostDetail processUsageCost(UsageDetail usageDetail) {
        UsageCostDetail usageCostDetail = new UsageCostDetail();
        usageCostDetail.setUserId(usageDetail.getUserId());
        usageCostDetail.setCallCost(usageDetail.getDuration() * this.ratePerSecond);
        usageCostDetail.setDataCost(usageDetail.getData() * this.ratePerMB);
        return usageCostDetail;
      }
    }
    ```

**TODO some discussion of the annotations should be made**

### Sink

You can develop the sink application by following the steps listed below or **TODO download the completed sink example**

Either visit the [Spring Initialzr site](https://start.spring.io/) and follow the instructions below or [download the initialzr generated project directly](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&baseDir=usage-cost-logger&groupId=io.spring.dataflow.sample&artifactId=usage-cost-logger&name=usage-cost-logger&description=Sample+project+for+Spring+Cloud+Stream+Sink&packageName=io.spring.dataflow.sample&packaging=jar&javaVersion=1.8&inputSearch=&style=amqp&style=cloud-stream)

1. Create a new Maven project with a Group name of `io.spring.dataflow` and an Artifact name of `usage-cost-logger`.
1. In the Dependencies text box, type `kafka` to select the RabbitMQ binder dependency.
1. In the Dependencies text box, type `cloud stream` to select the Spring Cloud Stream dependency.
1. Click the Generate Project button.

Now you should `unzip` the `usage-cost-logger.zip` file and import the project into your favorite IDE.

#### Business Logic

1.  In your favorite IDE create the `io.spring.dataflow.sample.domain` package.
1.  Create a `UsageCostDetail` class in the `io.spring.dataflow.sample.domain` using using your favorite IDE that looks like the contents in [UsageCostDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/usage-cost-logger/src/main/java/io/spring/dataflow/sample/domain/UsageCostDetail.java).
    This `UsageCostDetail` model contains `userId`, `callCost` and `dataCost` properties.
1.  Create the `Sink` application that receives the `UsageCostDetail` from the previously created `processor` and logs it.

```java
@EnableBinding(Sink.class)
public class UsageCostLogger {

	private static final Logger logger = LoggerFactory.getLogger(UsageCostLoggerApplication.class);

	@StreamListener(Sink.INPUT)
	public void process(UsageCostDetail usageCostDetail) {
		logger.info(usageCostDetail.toString());
	}
}
```

**TODO some discussion of the annotations should be made**

## Deployment

In this section we will deploy the apps created previous to the local machine, Cloud Foundry and Kubernetes.

**TODO this section needs to be finished**

### Local

**TODO explain at a high level what we are going to do**

**TODO mention requirements of getting kafka running. provide instructions for using a docker image**

```
spring.cloud.stream.bindings.output.destination=test-usage-detail
server.port=9090
```

Run the standalone `UsageDetailSender` source application:

```
java -jar usage-detail-sender-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.output.destination=test-usage-detail --server.port=9090
```

You can see the usage detail output using Kafka console consumer as follows:

```
./bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test-usage-detail
```

#### Processor

You need to set

```
spring.cloud.stream.bindings.input.destination=test-usage-detail
spring.cloud.stream.bindings.output.destination=test-usage-cost
server.port=9091
```

You can run the standalone `UsageCostProcessor` processor application as,

```
java -jar usage-cost-processor-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.input.destination=test-usage-detail --spring.cloud.stream.bindings.output.destination=test-usage-cost --server.port=9091
```

#### Sink

You need to set

```
spring.cloud.stream.bindings.input.destination=test-usage-cost
server.port=9092
```

You can run the standalone `UsageCostLogger` sink application as,

```
java -jar usage-cost-logger-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.input.destination=test-usage-cost --server.port=9092
```

### Cloud Foundry

### Kubernetes

## Testing

**TODO We did not cover testing, in order to get to the heart of the matter quickly. We can circle back and show how to create unit test for spring cloud stream apps.**
