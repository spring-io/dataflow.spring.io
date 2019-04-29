---
path: 'stream-developer-guides/streams/standalone-stream-rabbitmq/'
title: 'Standalone Streaming Application Development on RabbitMQ'
description: 'Create a simple stream processing application on RabbitMQ'
---

# Stream Processing with RabbitMQ

We will start from initializr and create three Spring Cloud Stream applications.
Note for CF we need a manifest, for k8s we need a service/deployment yaml.

## Development

### Sample Source

#### Initialzr

1. Visit the [Spring Initialzr site](https://start.spring.io/).
1. Select the latest release of spring boot.
1. Create a new Maven project with a Group name of `io.spring.dataflow.sample` and an Artifact name of `usage-detail-sender`.
1. In the Dependencies text box, type `Rabbitmq` to select the RabbitMQ binder dependency.
1. In the Dependencies text box, type `Cloud Stream` to select the Spring Cloud Stream dependency.
1. Click the Generate Project button.
1. Unzip the usage-detail-sender.zip file and import the project into your favorite IDE.

##### Initialzr Shortcut

Another option instead of using the UI to initialize your project you can do the following:

1. Click the [here](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-detail-sender&groupId=io.spring.dataflow.sample&artifactId=usage-detail-sender&name=usage-detail-sender&description=Sample+project+for+Spring+Cloud+Stream+Source&packageName=io.spring.dataflow.sample&packaging=jar&javaVersion=1.8&inputSearch=&style=amqp&style=cloud-stream) to download the preconfigured usage-detail-sender.zip.

2. Unzip the usage-detail-sender.zip file and import the project into your favorite IDE

#### Biz Logic

1.  In your favorite IDE create the `io.spring.dataflow.sample.domain` package
1.  Create a `UsageDetail` class in the `io.spring.dataflow.sample.domain` using your favorite IDE that looks like the contents in [UsageDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/usage-detail-sender/src/main/java/com/example/demo/domain/UsageDetail.java).
    This `UsageDetail` model contains `userId`, `data` and `duration`.
1.  Create the `Source` application produces usage detail for each user including call duration, data usage.

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

#### Testing

We can individually test these custom applications before creating a pipeline using Spring Cloud Data Flow.
To test, we can explicitly set the Spring Cloud Stream bindings destination property and run the application.
In this case, we can use some test RabbitMQ `exchanges` to verify the outbound and inbound messages.
For instance, testing the `Source` application requires the `output` binding to be set a test `exchange` on RabbitMQ.
We also need to set the server port to be unique.

```
spring.cloud.stream.bindings.output.destination=test-usage-detail
server.port=9090
```

You can run the standalone `UsageDetailSender` source application as,

```
java -jar usage-detail-sender-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.output.destination=test-usage-detail --server.port=9090
```

### Sample Processor

#### Initialzr

1. Visit the [Spring Initialzr site](https://start.spring.io/).
1. Select the latest release of spring boot.
1. Create a new Maven project with a Group name of `com.example` and an Artifact name of `usage-cost-processor`.
1. In the Dependencies text box, type `Rabbitmq` to select the RabbitMQ binder dependency.
1. In the Dependencies text box, type `Cloud Stream` to select the Spring Cloud Stream dependency.
1. Click the Generate Project button.
1. Unzip the usage-cost-processor.zip file and import the project into your favorite IDE.

##### Initialzr Shortcut

Another option instead of using the UI to initialize your project you can do the following:

1. Click the [here](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-cost-processor&groupId=io.spring.dataflow.sample&artifactId=usage-cost-processor&name=usage-cost-processor&description=Sample+project+for+Spring+Cloud+Stream+Processor&packageName=com.example.demosource&packaging=jar&javaVersion=1.8&inputSearch=&style=amqp&style=cloud-stream) to download the preconfigured usage-cost-processor.zip.
2. Unzip the usage-cost-processor.zip file and import the project into your favorite IDE

#### Biz Logic

1.  In your favorite IDE create the `io.spring.dataflow.sample.domain` package
1.  Create a `UsageDetail` class in the `io.spring.dataflow.sample.domain` using your favorite IDE that looks like the contents in [UsageDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/usage-detail-sender/src/main/java/com/example/demo/domain/UsageDetail.java).
    This `UsageDetail` model contains `userId`, `data` and `duration`.
1.  Create a `UsageCostDetail` class in the `io.spring.dataflow.sample.domain` using using your favorite IDE that looks like the contents in [UsageCostDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/usage-cost-processor/src/main/java/com/example/demo/domain/UsageCostDetail.java).
    This `UsageCostDetail` model contains `userId`, `callCost` and `dataCost`.
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

#### Testing

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

### Sample Sink

#### Initialzr

1. Visit the [Spring Initialzr site](https://start.spring.io/).
1. Select the latest release of spring boot.
1. Create a new Maven project with a Group name of `io.spring.dataflow` and an Artifact name of `usage-cost-logger`.
1. In the Dependencies text box, type `Rabbitmq` to select the RabbitMQ binder dependency.
1. In the Dependencies text box, type `Cloud Stream` to select the Spring Cloud Stream dependency.
1. Click the Generate Project button.
1. Unzip the usage-cost-logger.zip file and import the project into your favorite IDE.

##### Initialzr Shortcut

Another option instead of using the UI to initialize your project you can do the following:

1. Click the [here](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-cost-logger&groupId=io.spring.dataflow.sample&artifactId=usage-cost-logger&name=usage-cost-logger&description=Sample+project+for+Spring+Cloud+Stream+Sink&packageName=io.spring.dataflow.sample&packaging=jar&javaVersion=1.8&inputSearch=&style=amqp&style=cloud-stream) to download the preconfigured usage-cost-logger.zip.
2. Unzip the usage-cost-logger.zip file and import the project into your favorite IDE

#### Biz Logic

1.  In your favorite IDE create the `io.spring.dataflow.sample.domain` package.
1.  Create a `UsageCostDetail` class in the `io.spring.dataflow.sample.domain` using using your favorite IDE that looks like the contents in [UsageCostDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/usage-cost-processor/src/main/java/com/example/demo/domain/UsageCostDetail.java).
    This `UsageCostDetail` model contains `userId`, `callCost` and `dataCost`.
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

#### Testing

You need to set

```
spring.cloud.stream.bindings.input.destination=test-usage-cost
server.port=9092
```

You can run the standalone `UsageCostLogger` sink application as,

```
java -jar usage-cost-logger-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.input.destination=test-usage-cost --server.port=9092
```

## Deployment

Deploy to local, Cloud Foundry and Kubernetes

### Local

### Cloud Foundry

### Kubernetes
