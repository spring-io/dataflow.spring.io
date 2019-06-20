---
path: 'stream-developer-guides/streams/standalone-stream-kafka/'
title: 'Stream Application Development on Apache Kafka'
description: 'Create your own microservices for Stream processing using Apache Kafka and deploy them manually'
---

# Stream Processing with Apache Kafka

In this guide, we develop three Spring Boot applications that use Spring Cloud Stream's support for Apache Kafka and deploy them to Cloud Foundry, Kubernetes, and your local machine.
In another guide, we [deploy these applications by using Spring Cloud Data Flow](%currentPath%/stream-developer-guides/streams/data-flow-stream/).
By deploying the applications manually, you get a better understanding of the steps that Data Flow can automate for you.

The following sections describe how to build these applications from scratch.
If you prefer, you can download a zip file that contains the sources for these applications, unzip it, and proceed to the [deployment](#deployment) section.

You can [download a zip file containing the completed application](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/dist/usage-cost-stream-kafka.zip?raw=true) that contains all three applications from your browser. You can also download the zip file from the command line by using the following command:

```bash
wget https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/dist/usage-cost-stream-kafka.zip?raw=true -O usage-cost-stream-kafka.zip
```

## Development

We create three Spring Cloud Stream applications that communicate using Kafka.

The scenario is a cell phone company creating bills for its customers.
Each call made by a user has a `duration` and an amount of `data` used during the call.
As part of the process to generate a bill, the raw call data needs to be converted to a cost for the duration of the call and a cost for the amount of data used.

The call is modeled by using the `UsageDetail` class, which contains the `duration` of the call and the amount of `data` used during the call.
The bill is modeled by using the `UsageCostDetail` class, which contains the cost of the call (`costCall`) and the cost of the data (`costData`). Each class contains an ID (`userId`) to identify the person making the call.

The three streaming applications are as follows:

- The `Source` application (named `UsageDetailSender`) generates the user's call `duration` and amount of `data` used per `userId` and sends a message containing the `UsageDetail` object as JSON.

- The `Processor` application (named `UsageCostProcessor`) consumes the `UsageDetail` and computes the cost of the call and the cost of the data per `userId`. It sends the `UsageCostDetail` object as JSON.

- The `Sink` application (named `UsageCostLogger`) consumes the `UsageCostDetail` object and logs the cost of the call and the cost of the data.

### UsageDetailSender source

Either [download the initialzr generated project directly](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-detail-sender-kafka&groupId=io.spring.dataflow.sample&artifactId=usage-detail-sender-kafka&name=usage-detail-sender-kafka&description=Demo+project+for+Spring+Boot&packageName=io.spring.dataflow.sample.usagedetailsender&packaging=jar&javaVersion=1.8&inputSearch=&style=kafka&style=cloud-stream&style=actuator&style=web&style=cloud-connectors) or visit the [Spring Initialzr site](https://start.spring.io/) and follow these instructions:

1. Create a new Maven project with a Group name of `io.spring.dataflow.sample` and an Artifact name of `usage-detail-sender-kafka`.
1. In the **Dependencies** text box, type `Kafka` to select the Kafka binder dependency.
1. In the **Dependencies** text box, type `Cloud Stream` to select the Spring Cloud Stream dependency.
1. In the **Dependencies** text box, type `Actuator` to select the Spring Boot actuator dependency.
1. If your target platform is `Cloud Foundry`, type `Cloud Connectors` to select the Spring Cloud Connector dependency.
1. Click the **Generate Project** button.

Now you should `unzip` the `usage-detail-sender-kafka.zip` file and import the project into your favorite IDE.

#### Business Logic

Now we can create the code required for this application. To do so:

1.  Create a `UsageDetail` class in the `io.spring.dataflow.sample.usagedetailsender` package with content that resembles [UsageDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/usage-detail-sender/src/main/java/io/spring/dataflow/sample/UsageDetail.java).
    This `UsageDetail` model contains `userId`, `data`, and `duration` properties.
2.  Create the `UsageDetailSender` class in the `io.spring.dataflow.sample.usagedetailsender` package with content that resembles the following:

```Java

package io.spring.dataflow.sample.usagedetailsender;

import java.util.Random;

import io.spring.dataflow.sample.UsageDetail;

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

	private String[] users = {"user1", "user2", "user3", "user4", "user5"};

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

The `@EnableBinding` annotation indicates that you want to bind your application to the messaging middleware.
The annotation takes one or more interfaces as a parameter &#151; in this case, the [Source](https://github.com/spring-cloud/spring-cloud-stream/blob/master/spring-cloud-stream/src/main/java/org/springframework/cloud/stream/messaging/Source.java) interface that defines an output channel named `output`.
In the case of Kafka, messages sent to the `output` channel are, in turn, sent the Kafka topic.

The `@EnableScheduling` annotation indicates that you want to enable Spring's scheduling capabilities, which invoke methods annotated with `@Scheduled` with the specified `fixedDelay` of `1` second.

The `sendEvents` method constructs a `UsageDetail` object and then sends it to the the output channel by accessing the `Source` object's `output().send()` method.

#### Configuring the UsageDetailSender application

When configuring the `producer` application, we need to set the `output` binding destination (Kafka topic) where the producer publishes the data.

In `src/main/resources/application.properties`, you can add the following property:

```
spring.cloud.stream.bindings.output.destination=usage-detail
```

The `spring.cloud.stream.bindings.output.destination` property binds the `UsageDetailSender` object's output to the `usage-detail` Kafka topic.

#### Building

Now we can build the Usage Detail Sender application.
In the `usage-detail-sender` directory, use the following command to build the project using maven:

```
./mvnw clean package
```

#### Testing

Spring Cloud Stream provides the `spring-cloud-stream-test-support` dependency to test the Spring Cloud Stream application.
Instead of the `Kafka` binder, the tests use the `Test` binder to trace and test your application's outbound and inbound messages.
The `Test` binder uses a utility class called `MessageCollector`, which stores the messages in-memory.

To unit test this `UsageDetailSender` application, add the following code in the `UsageDetailSenderApplicationTests` class:

```java
package io.spring.dataflow.sample.usagedetailsender;

import java.util.concurrent.TimeUnit;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.spring.dataflow.sample.UsageDetail;
import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.stream.messaging.Source;
import org.springframework.cloud.stream.test.binder.MessageCollector;
import org.springframework.messaging.Message;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.Assert;

import static org.junit.Assert.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UsageDetailSenderApplicationTests {

	@Autowired
	private MessageCollector messageCollector;

	@Autowired
	private Source source;

	@Test
	public void contextLoads() {
	}

	@Test
	public void testUsageDetailSender() throws Exception {
		Message message = this.messageCollector.forChannel(this.source.output()).poll(1, TimeUnit.SECONDS);
		String usageDetailJSON = message.getPayload().toString();
		assertTrue(usageDetailJSON.contains("userId"));
		assertTrue(usageDetailJSON.contains("duration"));
		assertTrue(usageDetailJSON.contains("data"));
	}

}
```

When using the `spring-cloud-stream-test-support` dependency, your application's `output` and `input` are bound to the `Test` binder.

- The `contextLoads` test case verifies the application starts successfully.
- The `testUsageDetailSender` test case uses the `Test` binder's `MessageCollector` to collect the messages sent by the `UsageDetailSender`.

### `UsageCostProcessor` Processor

Either [download the initialzr generated project directly](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-cost-processor-kafka&groupId=io.spring.dataflow.sample&artifactId=usage-cost-processor-kafka&name=usage-cost-processor-kafka&description=Demo+project+for+Spring+Boot&packageName=io.spring.dataflow.sample.usagecostprocessor&packaging=jar&javaVersion=1.8&inputSearch=&style=kafka&style=cloud-stream&style=actuator&style=web&style=cloud-connectors) or visit the [Spring Initialzr site](https://start.spring.io/) and follow these instructions:

1. Create a new Maven project with a Group name of `io.spring.dataflow.sample` and an Artifact name of `usage-cost-processor-kafka`.
1. In the **Dependencies** text box, type `kafka` to select the Kafka binder dependency.
1. In the **Dependencies** text box, type `cloud stream` to select the Spring Cloud Stream dependency.
1. In the **Dependencies** text box, type `Actuator` to select the Spring Boot actuator dependency.
1. If your target platform is `Cloud Foundry`, type `Cloud Connectors` to select the Spring Cloud Connector dependency.
1. Click the **Generate Project** button.

Now you should `unzip` the `usage-cost-processor-kafka.zip` file and import the project into your favorite IDE.

#### Business Logic

Now we can create the code required for this application.

1.  Create the `UsageDetail` class in the `io.spring.dataflow.sample.usagecostprocessor` with content that resembles [UsageDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/usage-cost-processor/src/main/java/io/spring/dataflow/sample/UsageDetail.java).
    The `UsageDetail` class contains `userId`, `data` and, `duration` properties.
1.  Create the `UsageCostDetail` class in the `io.spring.dataflow.sample.usagecostprocessor` package with content that resembles [UsageCostDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/usage-cost-processor/src/main/java/io/spring/dataflow/sample/UsageCostDetail.java).
    This `UsageCostDetail` class contains `userId`, `callCost`, and `dataCost` properties.
1.  Create the `UsageCostProcessor` class in the `io.spring.dataflow.sample.usagecostprocessor` package that receives the `UsageDetail` message, computes the call and data cost and sends a `UsageCostDetail` message. The following listing shows the source code:

```java
package io.spring.dataflow.sample.usagecostprocessor;

import io.spring.dataflow.sample.UsageCostDetail;
import io.spring.dataflow.sample.UsageDetail;

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

In the preceding application, the `@EnableBinding` annotation indicates that you want to bind your application to the messaging middleware. The annotation takes one or more interfaces as a parameter &#151; in this case, the [Processor](https://github.com/spring-cloud/spring-cloud-stream/blob/master/spring-cloud-stream/src/main/java/org/springframework/cloud/stream/messaging/Processor.java) that defines and input and output channels.

The `@StreamListener` annotation binds the application's `input` channel to the `processUsageCost` method by converting the incoming JSON into `UsageDetail` object. We configure the Kafka topic that is bound to the input channel later.

The `@SendTo` annotation sends the `processUsageCost` method's output to the application's `output` channel, which is, in turn, sent to the a Kafka topic that we configure later.

#### Configuring the `UsageCostProcessor` Application

When configuring the `consumer` application, we need to set the `input` binding destination (a Kafka topic).

Since the `UsageCostProcessor` application is also a `producer` application, we need to set the `output` binding destination (a Kafka topic) where the producer publishes the data.

In `src/main/resources/application.properties`, you can add the following properties:

```
spring.cloud.stream.bindings.input.destination=usage-detail
spring.cloud.stream.bindings.output.destination=usage-cost
```

1. The `spring.cloud.stream.bindings.input.destination` property binds the `UsageCostProcessor` object's `input` to the `usage-detail` Kafka topic.
1. The `spring.cloud.stream.bindings.output.destination` property binds the `UsageCostProcessor` object's output to the `usage-cost` Kafka topic.

#### Building

Now we can build the Usage Cost Processor application.
In the `usage-cost-processor` directory, use the following command to build the project with Maven:

```
./mvnw clean package
```

#### Testing

Spring Cloud Stream provides the `spring-cloud-stream-test-support` dependency to test the Spring Cloud Stream application. Instead of the Kafka binder, it uses the `Test` binder to trace and test your application's outbound and inbound messages. The `Test` binder uses a utility class called `MessageCollector`, which stores the messages in-memory.

To unit test the `UsageCostProcessor`, add the following code in the `UsageCostProcessorApplicationTests` class:

```Java

package io.spring.dataflow.sample.usagecostprocessor;

import java.util.concurrent.TimeUnit;

import org.junit.Test;
import org.junit.runner.RunWith;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.stream.messaging.Processor;
import org.springframework.cloud.stream.test.binder.MessageCollector;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UsageCostProcessorApplicationTests {

	@Autowired
	private Processor processor;

	@Autowired
	private MessageCollector messageCollector;

	@Test
	public void contextLoads() {
	}

	@Test
	public void testUsageCostProcessor() throws Exception {
		this.processor.input().send(MessageBuilder.withPayload("{\"userId\":\"user3\",\"duration\":101,\"data\":502}").build());
		Message message = this.messageCollector.forChannel(this.processor.output()).poll(1, TimeUnit.SECONDS);
		assertTrue(message.getPayload().toString().equals("{\"userId\":\"user3\",\"callCost\":10.100000000000001,\"dataCost\":25.1}"));
	}

}
```

- The `contextLoads` test case verifies the application starts successfully.
- The `testUsageCostProcessor` test case uses the `Test` binder's `MessageCollector` to collect the messages from the `UsageCostProcessor` object's `output`.

### `UsageCostLogger` Sink

Either [download the initialzr generated project directly](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-cost-logger-kafka&groupId=io.spring.dataflow.sample&artifactId=usage-cost-logger-kafka&name=usage-cost-logger-kafka&description=Demo+project+for+Spring+Boot&packageName=io.spring.dataflow.sample.usagecostlogger&packaging=jar&javaVersion=1.8&inputSearch=&style=kafka&style=cloud-stream&style=actuator&style=web&style=cloud-connectors) or visit the [Spring Initialzr site](https://start.spring.io/) and follow these instructions:

1. Create a new Maven project with a Group name of `io.spring.dataflow.sample` and an Artifact name of `usage-cost-logger-kafka`.
1. In the **Dependencies** text box, type `kafka` to select the Kafka binder dependency.
1. In the **Dependencies** text box, type `cloud stream` to select the Spring Cloud Stream dependency.
1. In the **Dependencies** text box, type `Actuator` to select the Spring Boot actuator dependency.
1. If your target platform is `Cloud Foundry`, type `Cloud Connectors` to select the Spring Cloud Connector dependency.
1. Click the **Generate Project** button.

Now you should `unzip` the `usage-cost-logger-kafka.zip` file and import the project into your favorite IDE.

#### Business Logic

Now we can create the business logic for the sink application. To do so:

1.  Create a `UsageCostDetail` class in the `io.spring.dataflow.sample.usagecostlogger` package with content that resembles [UsageCostDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/usage-cost-logger/src/main/java/io/spring/dataflow/sample/UsageCostDetail.java).
    The `UsageCostDetail` class contains `userId`, `callCost`, and `dataCost` properties.
1.  Create the `UsageCostLogger` class in the `io.spring.dataflow.sample.usagecostlogger` package to receive the `UsageCostDetail` message and log it. The following listing shows the source code:

```Java
package io.spring.dataflow.sample.usagecostlogger;

import io.spring.dataflow.sample.UsageCostDetail;
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

In the preceding application, the `@EnableBinding` annotation indicates that you want to bind your application to the messaging middleware. The annotation takes one or more interfaces as a parameter &#151; in this case, the [Sink](https://github.com/spring-cloud/spring-cloud-stream/blob/master/spring-cloud-stream/src/main/java/org/springframework/cloud/stream/messaging/Sink.java) interface that defines the input channel.

The `@StreamListener` annotation binds the application's `input` channel to the `process` method by converting the incoming JSON to a `UsageCostDetail` object.

We configure the Kafka topic that is bound to the input channel later.

#### Configuring the `UsageCostLogger` Application

When configuring the `consumer` application, we need to set the `input` binding destination (a Kafka topic).

In `src/main/resources/application.properties`, you can add the following property:

```
spring.cloud.stream.bindings.input.destination=usage-cost
```

The `spring.cloud.stream.bindings.input.destination` property binds the `UsageCostLogger` object's `input` to the `usage-cost` Kafka topic.

#### Building

Now we can build the Usage Cost Logger application.
In the `usage-cost-logger` directory, run the following command to build the project with Maven:

```
./mvnw clean package
```

#### Testing

To unit test the `UsageCostLogger`, add the following code in the `UsageCostLoggerApplicationTests` class:

```Java

package io.spring.dataflow.sample.usagecostlogger;

import io.spring.dataflow.sample.UsageCostDetail;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.messaging.Sink;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.test.context.junit4.SpringRunner;

import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UsageCostLoggerApplicationTests {

	@Autowired
	protected Sink sink;

	@Autowired
	protected UsageCostLogger usageCostLogger;

	@Test
	public void contextLoads() {
	}

	@Test
	public void testUsageCostLogger() throws Exception {
		ArgumentCaptor<UsageCostDetail> captor = ArgumentCaptor.forClass(UsageCostDetail.class);
		this.sink.input().send(MessageBuilder.withPayload("{\"userId\":\"user3\",\"callCost\":10.100000000000001,\"dataCost\":25.1}").build());
		verify(this.usageCostLogger).process(captor.capture());
	}

	@EnableAutoConfiguration
	@EnableBinding(Sink.class)
	static class TestConfig {

		// Override `UsageCostLogger` bean for spying.
		@Bean
		@Primary
		public UsageCostLogger usageCostLogger() {
			return spy(new UsageCostLogger());
		}
	}
}
```

- The `contextLoads` test case verifies the application starts successfully.
- The `testUsageCostLogger` test case verifies that the `process` method of `UsageCostLogger` is invoked by using `Mockito`.
  To do this, the `TestConfig` static class overrides the existing `UsageCostLogger` bean to create a Mock bean of `UsageCostLogger`.
  Since we are mocking the `UsageCostLogger` bean, the `TestConfig` also explicitly annotates `@EnableBinding` and `@EnableAutoConfiguration`.

## Deployment

In this section, we deploy the applications we created earlier to the local machine, to Cloud Foundry, and to Kubernetes.

When you deploy these three applications (`UsageDetailSender`, `UsageCostProcessor` and `UsageCostLogger`), the flow of message is as follows:

```
UsageDetailSender -> UsageCostProcessor -> UsageCostLogger
```

The `UsageDetailSender` source application's output is connected to the `UsageCostProcessor` processor application's input.
The `UsageCostProcessor` application's output is connected to the `UsageCostLogger` sink application's input.

When these applications run, the `Kafka` binder binds the applications' output and input boundaries to the corresponding topics in Kafka.

### Local

This section shows how to run the three applications as standalone applications in your `local` environment.

If you have not already done so, you must [download](https://kafka.apache.org/downloads) and set up `Kafka` in your local environment.

After unpacking the downloaded archive, you can start the `ZooKeeper` and `Kafka` servers by running the following commands:

```
./bin/zookeeper-server-start.sh config/zookeeper.properties &
```

```
./bin/kafka-server-start.sh config/server.properties &
```

#### Running the Source

By using the [pre-defined](#configuring-the-usagedetailsender-application) configuration properties (along with a unique server port) for `UsageDetailSender`, you can run the application, as follows:

```
java -jar target/usage-detail-sender-kafka-0.0.1-SNAPSHOT.jar --server.port=9001 &
```

Now you can see the messages being sent to the `usage-detail` Kafka topic by using the Kafka console consumer, as follows:

```
./bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic usage-detail
```

To list the topics, run the following command:

```
./bin/kafka-topics.sh --zookeeper localhost:2181 --list
```

#### Running the Processor

By using the [pre-defined](#configuring-the-usagecostprocessor-application) configuration properties(along with a unique server port) for `UsageCostProcessor`, you can run the application, as follows:

```
java -jar target/usage-cost-processor-kafka-0.0.1-SNAPSHOT.jar --server.port=9002 &
```

With the `UsageDetail` data in the `usage-detail` Kafka topic from the `UsageDetailSender` source application, you can see the `UsageCostDetail` from the `usage-cost` Kafka topic, as follows:

```
 ./bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic usage-cost
```

#### Running the Sink

By using the [pre-defined](#configuring-the-usagecostlogger-application) configuration properties (along with a unique server port) for `UsageCostLogger`, you can run the application, as follows:

```
java -jar target/usage-cost-logger-kafka-0.0.1-SNAPSHOT.jar --server.port=9003 &
```

Now you can see that this application logs the usage cost detail.

### Cloud Foundry

This section walks you through how to deploy the `UsageDetailSender`, `UsageCostProcessor`, and `UsageCostLogger` applications on CloudFoundry.

#### Create a CF Manifest for the `UsageDetail` Sender

You need to create a CF manifest YAML file called `usage-detail-sender.yml` for the `UsageDetailSender` to define its configuration properties, as follows

```
applications:
- name: usage-detail-sender
  timeout: 120
  path: ./target/usage-detail-sender-kafka-0.0.1-SNAPSHOT.jar
  memory: 1G
  buildpack: java_buildpack
  env:
    SPRING_CLOUD_STREAM_KAFKA_BINDER_BROKERS: [Kafka_Service_IP_Address:Kafka_Service_Port]
    SPRING_CLOUD_STREAM_KAFKA_BINDER_ZKNODES: [ZooKeeper_Service_IP_Address:ZooKeeper_Service_Port]
```

Then you need to push the `UsageDetailSender` application by using its manifest YAML file, as follows:

```
cf push -f usage-detail-sender.yml
```

You need to create a CF manifest YAML file called `usage-cost-processor.yml` for the `UsageCostProcessor` to define its configuration properties, as follows

```
applications:
- name: usage-cost-processor
  timeout: 120
  path: ./target/usage-cost-processor-kafka-0.0.1-SNAPSHOT.jar
  memory: 1G
  buildpack: java_buildpack
  env:
    SPRING_CLOUD_STREAM_KAFKA_BINDER_BROKERS: [Kafka_Service_IP_Address:Kafka_Service_Port]
    SPRING_CLOUD_STREAM_KAFKA_BINDER_ZKNODES: [ZooKeeper_Service_IP_Address:ZooKeeper_Service_Port]
```

Then you need to push the `UsageCostProcessor` application by using its manifest YAML file, as follows:

```
cf push -f usage-cost-processor.yml
```

You need to create a CF manifest YAML file called `usage-cost-logger.yml` for the `UsageCostLogger` to define its configuration properties, as follows:

```
applications:
- name: usage-cost-logger
  timeout: 120
  path: ./target/usage-cost-logger-kafka-0.0.1-SNAPSHOT.jar
  memory: 1G
  buildpack: java_buildpack
  env:
    SPRING_CLOUD_STREAM_KAFKA_BINDER_BROKERS: [Kafka_Service_IP_Address:Kafka_Service_Port]
    SPRING_CLOUD_STREAM_KAFKA_BINDER_ZKNODES: [ZooKeeper_Service_IP_Address:ZooKeeper_Service_Port]
```

Then you need to push the `UsageCostLogger` application by using its manifest YAML file, as follows:

```
cf push -f usage-cost-logger.yml
```

You can see the applications by running the `cf apps` command, as the folowing example (with output) shows:

```
cf apps
```

```
name                   requested state   instances   memory   disk   urls
usage-cost-logger      started           1/1         1G       1G     usage-cost-logger.cfapps.io
usage-cost-processor   started           1/1         1G       1G     usage-cost-processor.cfapps.io
usage-detail-sender    started           1/1         1G       1G     usage-detail-sender.cfapps.io
```

```
   2019-05-13T23:23:33.36+0530 [APP/PROC/WEB/0] OUT 2019-05-13 17:53:33.362  INFO 15 --- [e-cost.logger-1] i.s.d.s.u.UsageCostLoggerApplication     : {"userId": "user5", "callCost": "1.0", "dataCost": "12.350000000000001" }
   2019-05-13T23:23:33.46+0530 [APP/PROC/WEB/0] OUT 2019-05-13 17:53:33.467  INFO 15 --- [e-cost.logger-1] i.s.d.s.u.UsageCostLoggerApplication     : {"userId": "user1", "callCost": "19.0", "dataCost": "10.0" }
   2019-05-13T23:23:34.46+0530 [APP/PROC/WEB/0] OUT 2019-05-13 17:53:34.466  INFO 15 --- [e-cost.logger-1] i.s.d.s.u.UsageCostLoggerApplication     : {"userId": "user4", "callCost": "2.2", "dataCost": "5.15" }
   2019-05-13T23:23:35.46+0530 [APP/PROC/WEB/0] OUT 2019-05-13 17:53:35.469  INFO 15 --- [e-cost.logger-1] i.s.d.s.u.UsageCostLoggerApplication     : {"userId": "user3", "callCost": "21.0", "dataCost": "17.3" }
```

### Kubernetes

This section walks you through how to deploy the three Spring Cloud Stream applications on Kubernetes.

#### Setting up the Kubernetes Cluster

For this we need a running [Kubernetes cluster](%currentPath%/installation/kubernetes/#creating-a-kubernetes-cluster). For this example we will deploy to `minikube`.

##### Verifying Minikube is Running

To verify that Minikube is running, run the following command (shown with typical output if Minikube is running):

```bash
$minikube status

host: Running
kubelet: Running
apiserver: Running
kubectl: Correctly Configured: pointing to minikube-vm at 192.168.99.100
```

#### Installing Apache Kafka

Now we can install the Kafka message broker by using the default configuration from Spring Cloud Data Flow.
To do so, run the following command:

```bash
kubectl apply -f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/kafka/kafka-deployment.yaml \
-f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/kafka/kafka-svc.yaml \
-f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/kafka/kafka-zk-deployment.yaml \
-f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/kafka/kafka-zk-svc.yaml
```

#### Building Docker Images

To build Docker images, we use the [jib Maven plugin](https://github.com/GoogleContainerTools/jib/tree/master/jib-maven-plugin#build-your-image).
If you downloaded the [source distribution](#development), the jib plugin is already configured.
If you built the apps from scratch, add the following under `plugins` in each `pom.xml` file:

```XML
<plugin>
    <groupId>com.google.cloud.tools</groupId>
    <artifactId>jib-maven-plugin</artifactId>
    <version>0.10.1</version>
    <configuration>
        <from>
            <image>springcloud/openjdk</image>
        </from>
        <to>
            <image>${docker.org}/${project.artifactId}:${docker.version}</image>
        </to>
        <container>
            <useCurrentTimestamp>true</useCurrentTimestamp>
        </container>
    </configuration>
</plugin>
```

Then add the following properties under the `properties` section of each `pom.xml` file. For this example, we use the following properties:

```XML
<docker.org>springcloudstream</docker.org>
<docker.version>${project.version}</docker.version>
```

Now you can run the Maven build to create the Docker images in the `minikube` Docker registry. To do so, run the following commands:

```bash
$ eval $(minikube docker-env)
$./mvnw package jib:dockerBuild
```

[[tip]]
| If you downloaded the project source, the project includes a parent pom to let you build all the modules with a single command.
Otherwise, run the build for the source, processor, and sink individually.
You need only run `eval $(minikube docker-env)` once for each terminal session.

#### Deploying the Stream

To deploy the stream, you must first copy and paste the following YAML and save it to `usage-cost-stream.yaml`:

```YAML
kind: Pod
apiVersion: v1
metadata:
  name: usage-detail-sender
  labels:
    app: usage-cost-stream
spec:
  containers:
    - name: usage-detail-sender
      image: springcloudstream/usage-detail-sender-kafka:0.0.1-SNAPSHOT
      ports:
        - containerPort: 80
          protocol: TCP
      env:
        - name: SPRING_CLOUD_STREAM_KAFKA_BINDER_BROKERS
          value: kafka
        - name: SPRING_CLOUD_STREAM_BINDINGS_OUTPUT_DESTINATION
          value: user-details
        - name: SERVER_PORT
          value: '80'
  restartPolicy: Always

---
kind: Pod
apiVersion: v1
metadata:
  name: usage-cost-processor
  labels:
    app: usage-cost-stream
spec:
  containers:
    - name: usage-cost-processor
      image: springcloudstream/usage-cost-processor-kafka:0.0.1-SNAPSHOT
      ports:
        - containerPort: 80
          protocol: TCP
      env:
        - name: SPRING_CLOUD_STREAM_KAFKA_BINDER_BROKERS
          value: kafka
        - name: SPRING_CLOUD_STREAM_BINDINGS_INPUT_GROUP
          value: usage-cost-stream
        - name: SPRING_CLOUD_STREAM_BINDINGS_INPUT_DESTINATION
          value: user-details
        - name: SPRING_CLOUD_STREAM_BINDINGS_OUTPUT_DESTINATION
          value: user-cost
        - name: SERVER_PORT
          value: '80'
  restartPolicy: Always

---
kind: Pod
apiVersion: v1
metadata:
  name: usage-cost-logger
  labels:
    app: usage-cost-stream
spec:
  containers:
    - name: usage-cost-logger
      image: springcloudstream/usage-cost-logger-kafka:0.0.1-SNAPSHOT
      ports:
        - containerPort: 80
          protocol: TCP
      env:
        - name: SPRING_CLOUD_STREAM_KAFKA_BINDER_BROKERS
          value: kafka
        - name: SPRING_CLOUD_STREAM_BINDINGS_INPUT_GROUP
          value: usage-cost-stream
        - name: SPRING_CLOUD_STREAM_BINDINGS_INPUT_DESTINATION
          value: user-cost
        - name: SERVER_PORT
          value: '80'
  restartPolicy: Always
```

Then you need to deploy the apps, by running the following command:

```bash
kubectl apply -f usage-cost-stream.yaml
```

If all is well, you should see the following output:

```
pod/usage-detail-sender created
pod/usage-cost-processor created
pod/usage-cost-logger created
```

The preceding YAML specifies three pod resources, for the source, processor, and sink applications.
Each pod has a single container that references the corresponding docker image.

We set the Kafka binding parameters as environment variables.
The input and output destination names have to be correct to wire the stream. Specifically, the output of the source must be the same as the input of the processor, and the output of the processor must be the same as the input of the sink.
We also set the logical hostname for the Kafka broker so that each application can connect to it.
Here we use the Kafka service name &#151; `kafka`, in this case.
We set the `app: user-cost-stream` label to logically group our apps.

We set the Spring Cloud Stream binding parameters by using environment variables.
The input and output destination names have to be correct to wire the stream. Specifically, the output of the source must be the same as the input of the processor, and the output of the processor must be the same as the input of the sink. We set the inputs and outputs as follows:

- Usage Detail Sender: `SPRING_CLOUD_STREAM_BINDINGS_OUTPUT_DESTINATION=user-details`
- Usage Cost Processor: `SPRING_CLOUD_STREAM_BINDINGS_INPUT_DESTINATION=user-details` and `SPRING_CLOUD_STREAM_BINDINGS_OUTPUT_DESTINATION=user-cost`
- Usage Cost Logger: `SPRING_CLOUD_STREAM_BINDINGS_INPUT_DESTINATION=user-cost`

#### Verifying the Deployment

You can use the following command to tail the log for the `usage-cost-logger` sink:

```bash
kubectl logs -f usage-cost-logger
```

You should see messages similar to the following messages:

```bash
2019-05-02 15:48:18.550  INFO 1 --- [container-0-C-1] i.s.d.s.u.UsageCostLoggerApplication     : {"userId": "Mark", "callCost": "21.1", "dataCost": "26.05" }
2019-05-02 15:48:19.553  INFO 1 --- [container-0-C-1] i.s.d.s.u.UsageCostLoggerApplication     : {"userId": "Ilaya", "callCost": "4.2", "dataCost": "15.75" }
2019-05-02 15:48:20.549  INFO 1 --- [container-0-C-1] i.s.d.s.u.UsageCostLoggerApplication     : {"userId": "Mark", "callCost": "28.400000000000002", "dataCost": "15.0" }
2019-05-02 15:48:21.553  INFO 1 --- [container-0-C-1] i.s.d.s.u.UsageCostLoggerApplication     : {"userId": "Ilaya", "callCost": "16.8", "dataCost": "28.5" }
2019-05-02 15:48:22.551  INFO 1 --- [container-0-C-1] i.s.d.s.u.UsageCostLoggerApplication     : {"userId": "Mark", "callCost": "22.700000000000003", "dataCost": "20.3" }
2019-05-02 15:48:23.556  INFO 1 --- [container-0-C-1] i.s.d.s.u.UsageCostLoggerApplication     : {"userId": "Janne", "callCost": "16.6", "dataCost": "2.6" }
2019-05-02 15:48:24.557  INFO 1 --- [container-0-C-1] i.s.d.s.u.UsageCostLoggerApplication     : {"userId": "Janne", "callCost": "6.7", "dataCost": "1.0" }
2019-05-02 15:48:25.555  INFO 1 --- [container-0-C-1] i.s.d.s.u.UsageCostLoggerApplication     : {"userId": "Glenn", "callCost": "3.7", "dataCost": "2.6500000000000004" }
2019-05-02 15:48:26.557  INFO 1 --- [container-0-C-1] i.s.d.s.u.UsageCostLoggerApplication     : {"userId": "Janne", "callCost": "24.200000000000003", "dataCost": "32.9" }
2019-05-02 15:48:27.556  INFO 1 --- [container-0-C-1] i.s.d.s.u.UsageCostLoggerApplication     : {"userId": "Glenn", "callCost": "19.200000000000003", "dataCost": "7.4" }
2019-05-02 15:48:28.559  INFO 1 --- [container-0-C-1] i.s.d.s.u.UsageCostLoggerApplication     : {"userId": "Sabby", "callCost": "17.7", "dataCost": "27.35" }
2019-05-02 15:48:29.562  INFO 1 --- [container-0-C-1] i.s.d.s.u.UsageCostLoggerApplication     : {"userId": "Ilaya", "callCost": "26.8", "dataCost": "32.45" }
2019-05-02 15:48:30.561  INFO 1 --- [container-0-C-1] i.s.d.s.u.UsageCostLoggerApplication     : {"userId": "Janne", "callCost": "26.5", "dataCost": "33.300000000000004" }
2019-05-02 15:48:31.562  INFO 1 --- [container-0-C-1] i.s.d.s.u.UsageCostLoggerApplication     : {"userId": "Sabby", "callCost": "16.1", "dataCost": "5.0" }
2019-05-02 15:48:32.564  INFO 1 --- [container-0-C-1] i.s.d.s.u.UsageCostLoggerApplication     : {"userId": "Janne", "callCost": "16.3", "dataCost": "23.6" }
2019-05-02 15:48:33.567  INFO 1 --- [container-0-C-1] i.s.d.s.u.UsageCostLoggerApplication     : {"userId": "Ilaya", "callCost": "29.400000000000002", "dataCost": "2.1" }
2019-05-02 15:48:34.567  INFO 1 --- [container-0-C-1] i.s.d.s.u.UsageCostLoggerApplication     : {"userId": "Janne", "callCost": "5.2", "dataCost": "20.200000000000003" }
```

#### Cleaning up

To delete the stream, we can use the label we created earlier. The following command shows how to do so:

```bash
kubectl delete pod -l app=usage-cost-stream
```

To uninstall Kafka, run the following command:

```bash
kubectl delete all -l app=kafka
```

## What's Next

The [RabiitMQ](%currentPath%/stream-developer-guides/streams/standalone-stream-rabbitmq/) shows you how to create the same three applications but with RabbitMQ instead.
Alternatively, you can use Spring Cloud Data Flow to deploy the three applications, as described in [Create and Deploy a Stream Processing Pipeline using Spring Cloud Data Flow](%currentPath%/stream-developer-guides/streams/data-flow-stream/).
