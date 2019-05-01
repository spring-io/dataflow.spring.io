---
path: 'stream-developer-guides/streams/standalone-stream-rabbitmq/'
title: 'Standalone Streaming Application Development on RabbitMQ'
description: 'Create a simple stream processing application on RabbitMQ'
---

# Stream Processing with RabbitMQ

We will start from Spring initializr and create three Spring Cloud Stream applications by choosing `RabbitMQ` binder.

The three sample applications include:

Source - Usage Detail Sender `source` application sends the `call` and `data` usage per `userId`.

Processor - Usage Cost Processor `processor` application computes the call and data usage cost per `userId`.

Sink - Usage Cost Logger `sink` application logs the usage cost detail.

**TODO describe what the source, processor and sink will do, introduce the domain model.**

**TODO we can remove a step by not requiring the domain object to be in its own package**

We will then run them on your local machine, Cloud Foundry and Kubernetes without using Data Flow.
This provides a foundation to understand the steps that Data Flow will automate for you.

## Development

### Source

You can develop the source application by following the steps listed below or **TODO download the completed source example**

**TODO - Add actuator dependency**
Either visit the [Spring Initialzr site](https://start.spring.io/) and follow the instructions below or [download the initialzr generated project directly](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-detail-sender&groupId=io.spring.dataflow.sample&artifactId=usage-detail-sender&name=usage-detail-sender&description=Demo+project+for+Spring+Boot&packageName=io.spring.dataflow.sample.usagedetailsender&packaging=jar&javaVersion=1.8&inputSearch=&style=amqp&style=cloud-stream).

1. Create a new Maven project with a Group name of `io.spring.dataflow.sample` and an Artifact name of `usage-detail-sender`.
1. In the Dependencies text box, type `RabbitMQ` to select the RabbitMQ binder dependency.
1. In the Dependencies text box, type `Cloud Stream` to select the Spring Cloud Stream dependency.
1. Click the Generate Project button.

Now you should `unzip` the `usage-detail-sender.zip` file and import the project into your favorite IDE.

#### Business Logic

If you haven't downloaded the completed source example, you will need to perform the following development steps.

1.  In your favorite IDE create the `io.spring.dataflow.sample.domain` package.
1.  Create a `UsageDetail` class in the `io.spring.dataflow.sample.domain` package using your favorite IDE that looks like the contents in [UsageDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-rabbitmq/usage-detail-sender/src/main/java/io/spring/dataflow/sample/domain/UsageDetail.java).
    This `UsageDetail` model contains `userId`, `data` and `duration` properties.
1.  Create the `Source` application produces usage detail for each user including call duration, data usage.
    Create the class `UsageDetailSender` in the `io.spring.dataflow.sample.usagedetailsender` package using your favorite IDE that looks like the below content:

    ```java
    package io.spring.dataflow.sample.usagedetailsender;

    import java.util.Random;

    import io.spring.dataflow.sample.domain.UsageDetail;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.cloud.stream.annotation.EnableBinding;
    import org.springframework.cloud.stream.messaging.Source;
    import org.springframework.messaging.support.MessageBuilder;
    import org.springframework.scheduling.annotation.EnableScheduling;
    import org.springframework.scheduling.annotation.Scheduled;

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

#### Building

1. Now let’s take the next step of building the project.
   From a command line change directory to the location of your project and build the project using maven
   ```
   ./mvnw clean package
   ```

#### Testing

** TODO Create unit test as in http appstarters**

### Processor

You can develop the processor application by following the steps listed below or **TODO download the completed processor example**

**TODO - Add actuator dependency**
Either visit the [Spring Initialzr site](https://start.spring.io/) and follow the instructions below or [download the initialzr generated project directly](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-cost-processor&groupId=io.spring.dataflow.sample&artifactId=usage-cost-processor&name=usage-cost-processor&description=Demo+project+for+Spring+Boot&packageName=io.spring.dataflow.sample.usagecostprocessor&packaging=jar&javaVersion=1.8&inputSearch=&style=amqp&style=cloud-stream).

1. Create a new Maven project with a Group name of `io.spring.dataflow.sample` and an Artifact name of `usage-cost-processor`.
1. In the Dependencies text box, type `Rabbitmq` to select the RabbitMQ binder dependency.
1. In the Dependencies text box, type `Cloud Stream` to select the Spring Cloud Stream dependency.
1. Click the Generate Project button.

Now you should `unzip` the `usage-cost-processor.zip` file and import the project into your favorite IDE.

#### Business Logic

If you haven't downloaded the completed processor example, you will need to perform the following development steps.

1.  In your favorite IDE create the `io.spring.dataflow.sample.domain` package.
1.  Create a `UsageDetail` class in the `io.spring.dataflow.sample.domain` using your favorite IDE that looks like the contents in [UsageDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-rabbitmq/usage-cost-processor/src/main/java/io/spring/dataflow/sample/domain/UsageDetail.java).
    This `UsageDetail` model contains `userId`, `data` and `duration` properties
1.  Create a `UsageCostDetail` class in the `io.spring.dataflow.sample.domain` using using your favorite IDE that looks like the contents in [UsageCostDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-rabbitmq/usage-cost-processor/src/main/java/io/spring/dataflow/sample/domain/UsageCostDetail.java).
    This `UsageCostDetail` model contains `userId`, `callCost` and `dataCost` properties.
1.  Create the `Processor` application that receives the `UsageDetail` from the previously created `source`, computes the call/data cost and returning the `UsageCostDetail`.
    In `io.spring.dataflow.sample.usagecostprocessor` package, create a class `UsageCostProcessor` that looks like the content below:

    ```java

    package io.spring.dataflow.sample.usagecostprocessor;

    import io.spring.dataflow.sample.domain.UsageCostDetail;
    import io.spring.dataflow.sample.domain.UsageDetail;

    import org.springframework.cloud.stream.annotation.EnableBinding;
    import org.springframework.cloud.stream.annotation.StreamListener;
    import org.springframework.cloud.stream.messaging.Processor;
    import org.springframework.messaging.handler.annotation.SendTo;

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

#### Building

1. Now let’s take the next step of building the project.
   From a command line change directory to the location of your project and build the project using maven

   ```
   ./mvnw clean package
   ```

#### Testing

**TODO: Create unit test**

### Sink

You can develop the sink application by following the steps listed below or **TODO download the completed sink example**
**TODO - Add actuator dependency**

Either visit the [Spring Initialzr site](https://start.spring.io/) and follow the instructions below or [download the initialzr generated project directly](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-cost-logger&groupId=io.spring.dataflow.sample&artifactId=usage-cost-logger&name=usage-cost-logger&description=Demo+project+for+Spring+Boot&packageName=io.spring.dataflow.sample.usagecostlogger&packaging=jar&javaVersion=1.8&inputSearch=&style=cloud-stream&style=amqp)

1. Create a new Maven project with a Group name of `io.spring.dataflow` and an Artifact name of `usage-cost-logger`.
1. In the Dependencies text box, type `rabbitmq` to select the RabbitMQ binder dependency.
1. In the Dependencies text box, type `cloud stream` to select the Spring Cloud Stream dependency.
1. Click the Generate Project button.
1. Unzip the usage-cost-logger.zip file and import the project into your favorite IDE.

Now you should `unzip` the `usage-cost-logger.zip` file and import the project into your favorite IDE.

#### Biz Logic

1.  In your favorite IDE create the `io.spring.dataflow.sample.domain` package.
1.  Create a `UsageCostDetail` class in the `io.spring.dataflow.sample.domain` using using your favorite IDE that looks like the contents in [UsageCostDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-rabbitmq/usage-cost-logger/src/main/java/io/spring/dataflow/sample/domain/UsageCostDetail.java).
    This `UsageCostDetail` model contains `userId`, `callCost` and `dataCost` properties.
1.  Create the `Sink` application that receives the `UsageCostDetail` from the previously created `processor` and logs it.
    In `io.spring.dataflow.sample.usagecostlogger` package, create a class `UsageCostLogger` that looks like the content below:

    ```java
    package io.spring.dataflow.sample.usagecostlogger;

    import io.spring.dataflow.sample.domain.UsageCostDetail;
    import org.slf4j.Logger;
    import org.slf4j.LoggerFactory;

    import org.springframework.cloud.stream.annotation.EnableBinding;
    import org.springframework.cloud.stream.annotation.StreamListener;
    import org.springframework.cloud.stream.messaging.Sink;

    @EnableBinding(Sink.class)
    public class UsageCostLogger {

    	private static final Logger logger = LoggerFactory.getLogger(UsageCostLoggerApplication.class);

    	@StreamListener(Sink.INPUT)
    	public void process(UsageCostDetail usageCostDetail) {
    		logger.info(usageCostDetail.toString());
    	}
    }

    ```

**TODO: some discussion of the annotations should be made. See batch guide for guidance as it discusses enabletask.**

#### Building

1. Now let’s take the next step of building the project.
   From a command line change directory to the location of your project and build the project using maven
   ```
   ./mvnw clean package
   ```

#### Testing

**TODO: Create unit test **

## Deployment

In this section we will deploy the apps created previous to the local machine, Cloud Foundry and Kubernetes.

**TODO this section needs to be finished**

### Local

**TODO explain at a high level what we are going to do**
**TODO mention requirements of getting rabbitmq running, reference back to the installation instructions with docker compose to show creating rabbit server**
**TODO Current content was cut-n-pasted from first draft. Should show output logs and a screenshot of the rabbitmq admin console with the created queues and exchanges.**

#### Running the Source

We can individually test these custom applications before creating a pipeline using Spring Cloud Data Flow.
To test, we can explicitly set the Spring Cloud Stream bindings destination property and run the application.

```
spring.cloud.stream.bindings.output.destination=test-usage-detail
```

In this case, we can use some test RabbitMQ `exchanges` to verify the outbound and inbound messages.
For instance, you can set the `output` binding to a test RabbitMQ exchange `test-usage-detail` and see if the messages get posted to the exchange.
You can run the standalone `UsageDetailSender` source application as,

```
java -jar target/usage-detail-sender-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.output.destination=test-usage-detail &
```

Now, you can see the messages being sent to the exchange `test-usage-detail`.

#### Running the Processor

To test this `processor` application, you need to set the `input` binding to the test RabbitMQ exchange `test-usage-detail` to receive the `UsageDetail` data and `output` binding to the test RabbitMQ exchange `test-usage-cost` to send the computed `UsageCostDetail`.

```
spring.cloud.stream.bindings.input.destination=test-usage-detail
spring.cloud.stream.bindings.output.destination=test-usage-cost
```

You can run the standalone `UsageCostProcessor` processor application as,

```
java -jar target/usage-cost-processor-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.input.destination=test-usage-detail --spring.cloud.stream.bindings.output.destination=test-usage-cost &
```

#### Running the Sink

To test this `sink` application you need to set the `input` binding that connects to the test RabbitMQ exchange `test-usage-cost` to receive the `UsageCostDetail`.

```
spring.cloud.stream.bindings.input.destination=test-usage-cost
```

You can run the standalone `UsageCostLogger` sink application as,

```
java -jar target/usage-cost-logger-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.input.destination=test-usage-cost &
```

Now, you can see that this application logs the usage cost detail.

### Cloud Foundry

### Kubernetes

## Testing

**TODO We did not cover testing, in order to get to the heart of the matter quickly. We can circle back and show how to create unit test for spring cloud stream apps.**
