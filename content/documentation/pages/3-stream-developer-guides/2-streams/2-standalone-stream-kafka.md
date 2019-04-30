---
path: 'stream-developer-guides/streams/standalone-stream-kafka/'
title: 'Standalone Streaming Application Development on Apache Kafka'
description: 'Create a simple stream processing application on Apache Kafka'
---

# Stream Processing with Apache Kafka

We will start from Spring initializr and create three Spring Cloud Stream applications by choosing `Apache kafka` binder.

The three sample applications include:

Source - Usage Detail Sender `source` application sends the `call` and `data` usage per `userId`.

Processor - Usage Cost Processor `processor` application computes the call and data usage cost per `userId`.

Sink - Usage Cost Logger `sink` application logs the usage cost detail.

## Development

### Sample Source

#### Initialzr

1. Visit the [Spring Initialzr site](https://start.spring.io/).
1. Select the latest release of spring boot.
1. Create a new Maven project with a Group name of `io.spring.dataflow.sample` and an Artifact name of `usage-detail-sender`.
1. In the Dependencies text box, type `Kafka` to select the Kafka binder dependency.
1. In the Dependencies text box, type `Cloud Stream` to select the Spring Cloud Stream dependency.
1. Click the Generate Project button.
1. Unzip the usage-detail-sender.zip file and import the project into your favorite IDE.

##### Initialzr Shortcut

Another option instead of using the UI to initialize your project you can do the following:

1. Click [here](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-detail-sender&groupId=io.spring.dataflow.sample&artifactId=usage-detail-sender&name=usage-detail-sender&description=Demo+project+for+Spring+Boot&packageName=io.spring.dataflow.sample.usagedetailsender&packaging=jar&javaVersion=1.8&inputSearch=&style=kafka&style=cloud-stream) to download the preconfigured usage-detail-sender.zip
2. Unzip the usage-detail-sender.zip file and import the project into your favorite IDE

#### Biz Logic

1.  In your favorite IDE create the `io.spring.dataflow.sample.domain` package
1.  Create a `UsageDetail` class in the `io.spring.dataflow.sample.domain` package using your favorite IDE that looks like the contents in [UsageDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/usage-detail-sender/src/main/java/io/spring/dataflow/sample/domain/UsageDetail.java).
    This `UsageDetail` model contains `userId`, `data` and `duration`.
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

#### Building

1. Now let’s take the next step of building the project.
   From a command line change directory to the location of your project and build the project using maven

   ```
   ./mvnw clean package
   ```

#### Testing

We can individually test these custom applications before creating a pipeline using Spring Cloud Data Flow.
To test, we can explicitly set the Spring Cloud Stream bindings destination property and run the application.

```
spring.cloud.stream.bindings.output.destination=test-usage-detail
```

In this case, we can use some test Kafka `topics` to verify the outbound and inbound messages.
For instance, you can set the `output` binding to a test Kafka topic named `test-usage-detail` and see if the messages get posted to this Kafka topic.
You can run the standalone `UsageDetailSender` source application as,

```
java -jar target/usage-detail-sender-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.output.destination=test-usage-detail &
```

Now, you can see the messages being sent to the Kafka topic `test-usage-detail` using Kafka console consumer as follows:

```
./bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test-usage-detail
```

### Sample Processor

#### Initialzr

1. Visit the [Spring Initialzr site](https://start.spring.io/).
1. Select the latest release of spring boot.
1. Create a new Maven project with a Group name of `io.spring.dataflow.sample` and an Artifact name of `usage-cost-processor`.
1. In the Dependencies text box, type `Kafka` to select the Kafka binder dependency.
1. In the Dependencies text box, type `Cloud Stream` to select the Spring Cloud Stream dependency.
1. Click the Generate Project button.
1. Unzip the usage-cost-processor.zip file and import the project into your favorite IDE.

##### Initialzr Shortcut

Another option instead of using the UI to initialize your project you can do the following:

1. Click [here](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-cost-processor&groupId=io.spring.dataflow.sample&artifactId=usage-cost-processor&name=usage-cost-processor&description=Demo+project+for+Spring+Boot&packageName=io.spring.dataflow.sample.usagecostprocessor&packaging=jar&javaVersion=1.8&inputSearch=&style=kafka&style=cloud-stream) to download the preconfigured usage-cost-processor.zip.
2. Unzip the usage-cost-processor.zip file and import the project into your favorite IDE

#### Biz Logic

1.  In your favorite IDE create the `io.spring.dataflow.sample.domain` package
1.  Create a `UsageDetail` class in the `io.spring.dataflow.sample.domain` package using your favorite IDE that looks like the contents in [UsageDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/usage-cost-processor/src/main/java/io/spring/dataflow/sample/domain/UsageDetail.java).
    This `UsageDetail` model contains `userId`, `data` and `duration`.
1.  Create a `UsageCostDetail` class in the `io.spring.dataflow.sample.domain` package using using your favorite IDE that looks like the contents in [UsageCostDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/usage-cost-processor/src/main/java/io/spring/dataflow/sample/domain/UsageCostDetail.java).
    This `UsageCostDetail` model contains `userId`, `callCost` and `dataCost`.
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

#### Building

1. Now let’s take the next step of building the project.
   From a command line change directory to the location of your project and build the project using maven

   ```
   ./mvnw clean package
   ```

#### Testing

To test this `processor` application, you need to set the `input` binding to the test Kafka topic `test-usage-detail` to receive the `UsageDetail` data and `output` binding to the test Kafka topic `test-usage-cost` to send the computed `UsageCostDetail`.

```
spring.cloud.stream.bindings.input.destination=test-usage-detail
spring.cloud.stream.bindings.output.destination=test-usage-cost
```

You can run the standalone `UsageCostProcessor` processor application as,

```
java -jar target/usage-cost-processor-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.input.destination=test-usage-detail --spring.cloud.stream.bindings.output.destination=test-usage-cost &
```

With the `UsageDetail` data on the `test-usage-detail` Kafka topic using the `UsageDetailSender` source application, you can see the `UsageCostDetail` from the `test-usage-cost` Kafka topic as follows:

```
 ./bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test-usage-cost
```

### Sample Sink

#### Initialzr

1. Visit the [Spring Initialzr site](https://start.spring.io/).
1. Select the latest release of spring boot.
1. Create a new Maven project with a Group name of `io.spring.dataflow.sample` and an Artifact name of `usage-cost-logger`.
1. In the Dependencies text box, type `Kafka` to select the Kafka binder dependency.
1. In the Dependencies text box, type `Cloud Stream` to select the Spring Cloud Stream dependency.
1. Click the Generate Project button.
1. Unzip the usage-cost-logger.zip file and import the project into your favorite IDE.

##### Initialzr Shortcut

Another option instead of using the UI to initialize your project you can do the following:

1. Click [here](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-cost-logger&groupId=io.spring.dataflow.sample&artifactId=usage-cost-logger&name=usage-cost-logger&description=Demo+project+for+Spring+Boot&packageName=io.spring.dataflow.sample.usagecostlogger&packaging=jar&javaVersion=1.8&inputSearch=&style=kafka&style=cloud-stream) to download the pre-configured usage-cost-logger zip.
2. Unzip the usage-cost-logger.zip file and import the project into your favorite IDE

#### Biz Logic

1.  In your favorite IDE create the `io.spring.dataflow.sample.domain` package.
1.  Create a `UsageCostDetail` class in the `io.spring.dataflow.sample.domain` using using your favorite IDE that looks like the contents in [UsageCostDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/usage-cost-logger/src/main/java/io/spring/dataflow/sample/domain/UsageCostDetail.java).
    This `UsageCostDetail` model contains `userId`, `callCost` and `dataCost`.
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

#### Building

1. Now let’s take the next step of building the project.
   From a command line change directory to the location of your project and build the project using maven

   ```
   ./mvnw clean package
   ```

#### Testing

To test this `sink` application you need to set the `input` binding that connects to the RabbitMQ test exchange `test-usage-cost` to receive the `UsageCostDetail`.

```
spring.cloud.stream.bindings.input.destination=test-usage-cost
```

You can run the standalone `UsageCostLogger` sink application as,

```
java -jar target/usage-cost-logger-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.input.destination=test-usage-cost &
```

Now, you can see that this application logs the usage cost detail.

## Deployment

Deploy to local, Cloud Foundry and Kubernetes

### Local

You can run

```
java -jar <artifact> --spring.cloud.stream.bindings.output.destination=test-output --server.port=9090
```

### Cloud Foundry

### Kubernetes
