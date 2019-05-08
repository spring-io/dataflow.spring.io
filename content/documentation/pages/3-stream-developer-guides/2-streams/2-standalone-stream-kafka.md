---
path: 'stream-developer-guides/streams/standalone-stream-kafka/'
title: 'Standalone Streaming Application Development on Apache Kafka'
description: 'Create a simple stream processing application on Apache Kafka'
---

# Stream Processing with Apache Kafka

**TODO Look at TODO comments from the Stream Processing with RabbitMQ for guidance....**

We will start from Spring initializr and create three Spring Cloud Stream applications by choosing `Apache Kafka` binder.

Lets consider a scenario where the mobile phone service company calculates the users' call and data cost based on the usage.

The streaming application has:

- The `Source` application named `UsageDetailSender` generates the users' `call` and `data` usage per `userId`.

- The `Processor` application named `UsageCostProcessor` computes the call and data usage cost per `userId`.

- The `Sink` application named `UsageCostLogger` logs the usage cost detail in the application log.

The domain models used in these applications are:

- UsageDetail
  - userId
  - data
  - duration
- UsageCostDetail
  - userId
  - callCost
  - dataCost

We will then run them on your local machine, Cloud Foundry and Kubernetes without using Spring Cloud Data Flow.
This provides a foundation to understand the steps that Data Flow will automate for you.

## Development

The following sections describe how to build this stream from scratch. If you prefer, you can [download a zip file containing the completed application](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/dist/usage-cost-stream-kafka.zip?raw=true) for the sample stream, unzip it. There is a top level `pom.xml` that will build all three examples, or you can change directory into each example and build them individually. In both cases, the command to build is the same.

```bash
./mvnw clean package
```

You can proceed to the the [deployment](#deployment) section for your platform if you don't want to build the stream from scratch.

### Source

You can develop the source application by following the steps listed below or [download](https://github.com/spring-cloud/spring-cloud-dataflow-samples/raw/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/dist/usage-detail-sender.zip) the zip file containing the source code of `UsageDetailSender` source application.

Either visit the [Spring Initialzr site](https://start.spring.io/) and follow the instructions below or [download the initialzr generated project directly](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-detail-sender-kafka&groupId=io.spring.dataflow.sample&artifactId=usage-detail-sender-kafka&name=usage-detail-sender-kafka&description=Demo+project+for+Spring+Boot&packageName=io.spring.dataflow.sample.usagedetailsender&packaging=jar&javaVersion=1.8&inputSearch=&style=kafka&style=cloud-stream&style=actuator&style=web)

1. Create a new Maven project with a Group name of `io.spring.dataflow.sample` and an Artifact name of `usage-detail-sender-kafka`.
1. In the Dependencies text box, type `Kafka` to select the Kafka binder dependency.
1. In the Dependencies text box, type `Cloud Stream` to select the Spring Cloud Stream dependency.
1. In the Dependencies text box, type `Actuator` to select the Spring Boot actuator dependency.
1. Click the Generate Project button.

Now you should `unzip` the `usage-detail-sender-kafka.zip` file and import the project into your favorite IDE.

#### Business Logic

If you haven't downloaded the completed source example, you will need to perform the following development steps.

1.  Create a `UsageDetail` class in the `io.spring.dataflow.sample` using your favorite IDE that looks like the contents in [UsageDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/usage-detail-sender/src/main/java/io/spring/dataflow/sample/UsageDetail.java).
    This `UsageDetail` model contains `userId`, `data` and `duration` properties.
1.  Create the class `UsageDetailSender` that will send `UsageDetail` objects or each user populated with call duration, data usage.
    Create the class `UsageDetailSender` in the `io.spring.dataflow.sample.usagedetailsender` package using your favorite IDE that looks like the below content:

    ```java
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

In the above application, the `@EnableBinding` annotation lets you bind your `Source` application's `output` to the configured `Kafka` topic using the Kafka binder.
The `@EnableScheduling` annotation invokes `sendEvents` with the configured fixed delay `1` second.

#### Building

Now let's build the Usage Detail Sender application.
In the directory `usage-detail-sender` use the following command to build the project using maven.

```
./mvnw clean package
```

#### Testing

Spring Cloud Stream provides `spring-cloud-stream-test-support` dependency to test the standalone Spring Cloud Stream application.
Instead of the `Kafka` binder, you can use the `Test` binder to trace and test your application's outbound/inbound messages.
The `Test` binder uses `MessageCollector` which stores the messages in-memory.

To test this `UsageDetailSender` application, in the class `UsageDetailSenderApplicationTests` you can add following code:

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

1. The test case `contextLoads` verifies the application starts successfully.
1. The test case `testUsageDetailSender` uses `Test` binder's `MessageCollector` to collect the messages sent by the `UsageDetailSender`.

### Processor

You can develop the processor application by following the steps listed below or [download](https://github.com/spring-cloud/spring-cloud-dataflow-samples/raw/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/dist/usage-cost-processor.zip) the zip file containing the source code of `UsageCostProcessor` processor application.

Either visit the [Spring Initialzr site](https://start.spring.io/) and follow the instructions below or [download the initialzr generated project directly](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-cost-processor-kafka&groupId=io.spring.dataflow.sample&artifactId=usage-cost-processor-kafka&name=usage-cost-processor-kafka&description=Demo+project+for+Spring+Boot&packageName=io.spring.dataflow.sample.usagecostprocessor&packaging=jar&javaVersion=1.8&inputSearch=&style=kafka&style=cloud-stream&style=actuator&style=web)

1. Create a new Maven project with a Group name of `io.spring.dataflow.sample` and an Artifact name of `usage-cost-processor-kafka`.
1. In the Dependencies text box, type `kafka` to select the Kafka binder dependency.
1. In the Dependencies text box, type `cloud stream` to select the Spring Cloud Stream dependency.
1. In the Dependencies text box, type `Actuator` to select the Spring Boot actuator dependency.
1. Click the Generate Project button.

Now you should `unzip` the `usage-cost-processor-kafka.zip` file and import the project into your favorite IDE.

#### Business Logic

If you haven't downloaded the completed processor example, you will need to perform the following development steps.

1.  Create a `UsageDetail` class in the `io.spring.dataflow.sample` using your favorite IDE that looks like the contents in [UsageDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/usage-cost-processor/src/main/java/io/spring/dataflow/sample/UsageDetail.java).
    This `UsageDetail` model contains `userId`, `data` and `duration` properties.
1.  Create a `UsageCostDetail` class in the `io.spring.dataflow.sample` using using your favorite IDE that looks like the contents in [UsageCostDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/usage-cost-processor/src/main/java/io/spring/dataflow/sample/UsageCostDetail.java).
    This `UsageCostDetail` model contains `userId`, `callCost` and `dataCost` properites.
1.  Create the `Processor` application that receives the `UsageDetail` from the previously created `source`, computes the call/data cost and returning the `UsageCostDetail`.
    In `io.spring.dataflow.sample.usagecostprocessor` package, create a class `UsageCostProcessor` that looks like the content below:

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

In the above application, the `@EnableBinding` annotation lets you bind your `Processor` application's `input` and `output` to the configured `Kafka` topics using the Kafka binder.
The annotation `@StreamListener` binds the application's `input` to the `processUsageCost` method by converting the incoming data into `UsageDetail` domain object.
The annotation `@SendTo` sends the `processUsageCost` method's output to the application's `output` which binds to the configured Kafka topic.

#### Building

Now let's build the Usage Cost Processor application.
In the directory `usage-cost-processor` use the following command to build the project using maven.

```
./mvnw clean package
```

#### Testing

To test the `UsageCostProcessor`, you can add the following code that uses `spring-cloud-stream-test-support` dependency to bind the application's `output` and `input` to the `Test` binder:

    ```java

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

1. The test case `contextLoads` verifies the application starts successfully.
1. The test case `testUsageCostProcessor` uses `Test` binder's `MessageCollector` to collect the messages from the `UsageCostProcessor`'s `output`.

### Sink

You can develop the sink application by following the steps listed below or [download](https://github.com/spring-cloud/spring-cloud-dataflow-samples/raw/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/dist/usage-cost-logger.zip) the zip file containing the source code of `UsageCostLogger` sink application.

Either visit the [Spring Initialzr site](https://start.spring.io/) and follow the instructions below or [download the initialzr generated project directly](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-cost-logger-kafka&groupId=io.spring.dataflow.sample&artifactId=usage-cost-logger-kafka&name=usage-cost-logger-kafka&description=Demo+project+for+Spring+Boot&packageName=io.spring.dataflow.sample.usagecostlogger&packaging=jar&javaVersion=1.8&inputSearch=&style=kafka&style=cloud-stream&style=actuator&style=web)

1. Create a new Maven project with a Group name of `io.spring.dataflow.sample` and an Artifact name of `usage-cost-logger-kafka`.
1. In the Dependencies text box, type `kafka` to select the Kafka binder dependency.
1. In the Dependencies text box, type `cloud stream` to select the Spring Cloud Stream dependency.
1. In the Dependencies text box, type `Actuator` to select the Spring Boot actuator dependency.
1. Click the Generate Project button.

Now you should `unzip` the `usage-cost-logger-kafka.zip` file and import the project into your favorite IDE.

#### Business Logic

1.  In your favorite IDE create the `io.spring.dataflow.sample` package.
1.  Create a `UsageCostDetail` class in the `io.spring.dataflow.sample` using using your favorite IDE that looks like the contents in [UsageCostDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/usage-cost-logger/src/main/java/io/spring/dataflow/sample/UsageCostDetail.java).
    This `UsageCostDetail` model contains `userId`, `callCost` and `dataCost` properties.
1.  Create the `Sink` application that receives the `UsageCostDetail` from the previously created `processor` and logs it.
    In `io.spring.dataflow.sample.usagecostlogger` package, create a class `UsageCostLogger` that looks like the content below:

    ```java
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

In the above application, the `@EnableBinding` annotation lets you bind your `Sink` application's `input` to the configured `Kafka` topic using the Kafka binder.

#### Building

Now let's build the Usage Cost Logger application. In the directory `usage-cost-logger` use the following command to build the project using maven.

```
./mvnw clean package
```

#### Testing

To test the `UsageCostLogger`, you can add the following code that uses `spring-cloud-stream-test-support` dependency to bind the application's `input` to the `Test` binder:

    ```java

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

1.  The test case `contextLoads` verifies the application starts successfully.
1.  The test case `testUsageCostLogger` verifies if the `process` method of `UsageCostLogger` is invoked using `Mockito`.
    To do this, the static class `TestConfig` overrides the existing `UsageCostLogger` bean to create a Mock bean of `UsageCostLogger`.
    Since we are mocking the `UsageCostLogger` bean, the `TestConfig` also annotates `@EnableBinding` and `@EnableAutoConfiguration` explicitly.

## Deployment

In this section we will deploy the apps created above to the local machine, Cloud Foundry and Kubernetes.

When you deploy these three applications (UsageDetailSender, UsageCostProcessor and UsageCostLogger), the flow of message looks like this:

```
UsageDetailSender -> UsageCostProcessor -> UsageCostLogger
```

The source application `UsageDetailSender`'s output is connected to the `UsageCostProcessor` processor application's input.
The `UsageCostProcessor` application's output is connected to the `UsageCostLogger` sink application's input.

Since we use Kafka as the streaming platform, we have selected Spring Cloud Stream `Kafka` binder for this application.
When these applications are run, the `Kafka` binder binds the applications output/input boundaries into the corresponding destinations (topics) at Kafka.

Let's choose our destinations at Kafka:

- UsageDetailSender's output and `UsageCostProcessor`'s input are bound to `test-usage-detail` topic
- UsageCostProcessor's output and `UsageCostLogger`'s input are bound to `test-usage-cost` topic.

### Local

You can run the above applications as standalone applications on your `local` environment.

You can [download](https://kafka.apache.org/downloads) and setup `Kafka` on your local.

After unpacking the downloaded archive, you can start `ZooKeeper` and `Kafka` servers as follows:

```
./bin/zookeeper-server-start.sh config/zookeeper.properties &
```

```
./bin/kafka-server-start.sh config/server.properties &
```

To list the topics:

```
./bin/kafka-topics.sh --zookeeper localhost:2181 --list
```

#### Running the Source

We can individually run these custom applications before creating a pipeline using Spring Cloud Data Flow.
To test, we can explicitly set the Spring Cloud Stream bindings destination property and run the application.

```
spring.cloud.stream.bindings.output.destination=test-usage-detail
server.port=0
```

In this case, we can use some test Kafka `topics` to verify the outbound and inbound messages.
For instance, you can set the `output` binding to a test Kafka topic named `test-usage-detail` and see if the messages get posted to this Kafka topic.

You can run the standalone `UsageDetailSender` source application as,

```
java -jar target/usage-detail-sender-kafka-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.output.destination=test-usage-detail  --server.port=0 &
```

Now, you can see the messages being sent to the Kafka topic `test-usage-detail` using Kafka console consumer as follows:

```
./bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test-usage-detail
```

#### Running the Processor

For the `UsageCostProcessor` application, you need to set the `input` binding to a Kafka topic `test-usage-detail` to receive the `UsageDetail` data and `output` binding to a Kafka topic `test-usage-cost` to send the computed `UsageCostDetail`.

```
spring.cloud.stream.bindings.input.destination=test-usage-detail
spring.cloud.stream.bindings.output.destination=test-usage-cost
```

You can run the standalone `UsageCostProcessor` processor application as,

```
java -jar target/usage-cost-processor-kafka-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.input.destination=test-usage-detail --spring.cloud.stream.bindings.output.destination=test-usage-cost &
```

With the `UsageDetail` data on the `test-usage-detail` Kafka topic using the `UsageDetailSender` source application, you can see the `UsageCostDetail` from the `test-usage-cost` Kafka topic as follows:

```
 ./bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test-usage-cost
```

#### Running the Sink

For the `UsageCostLogger` application, you need to set the `input` binding to a Kafka topic `test-usage-cost` to receive the computed `UsageCostDetail`:

```
spring.cloud.stream.bindings.input.destination=test-usage-cost
```

You can run the standalone `UsageCostLogger` sink application as,

```
java -jar target/usage-cost-logger-kafka-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.input.destination=test-usage-cost &
```

Now, you can see that this application logs the usage cost detail.

### Cloud Foundry

### Kubernetes

This section will walk you through how to deploy and run the sample stream application on Kubernetes.

#### Setting up the Kubernetes cluster

For this we need a running [Kubernetes cluster](%currentPath%/installation/kubernetes/#creating-a-kubernetes-cluster). For this example we will deploy to `minikube`.

##### Verify minikube is up and running:

```bash
$minikube status

host: Running
kubelet: Running
apiserver: Running
kubectl: Correctly Configured: pointing to minikube-vm at 192.168.99.100
```

#### Install kafka

We will install the kafka message broker, using the default configuration from Spring Cloud Data Flow.
Execute the following command:

```bash
kubectl apply -f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/kafka/kafka-deployment.yaml \
-f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/kafka/kafka-svc.yaml \
-f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/kafka/kafka-zk-deployment.yaml \
-f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/kafka/kafka-zk-svc.yaml
```

#### Build docker images

For this we will use the [jib maven plugin](https://github.com/GoogleContainerTools/jib/tree/master/jib-maven-plugin#build-your-image).
If you downloaded the [source distribution](#development), the jib plugin is already configured.
If you built the apps from scratch, add the following under `plugins` in each pom.xml:

```xml
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

Then add the following properties, under `properties` For this example, we will use:

```xml
<docker.org>springcloudstream</docker.org>
<docker.version>${project.version}</docker.version>
```

Now run the maven build to create the docker images in the `minikube` docker registry:

```bash
$ eval $(minikube docker-env)
$./mvnw package jib:dockerBuild
```

[[tip]]
| If you downloaded the project source, the project includes a parent pom to build all the modules with a single command.
Otherwise, run the build for the source, processor, and sink individually.
You only need to execute `eval $(minikube docker-env)` once for each terminal session.

#### Deploy the stream

Copy and paste the following yaml and save it to `usage-cost-stream.yaml`

```yaml
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

Then deploy the apps:

```bash
kubectl apply -f usage-cost-stream.yaml
```

if all is well, you should see

```
pod/usage-detail-sender created
pod/usage-cost-processor created
pod/usage-cost-logger created
```

The above yaml specifies three pod resources, for the source, processor, and sink applications.
Each pod has a single container, referencing the respective docker image.

We set the Kafka binding parameters as environment variables.
The input and output destination names have to be correct to wire the stream, specifically, the output of the source must be the same as the input of the processor, and the output of the processor must be the same as the input of the sink.
We also set the logical hostname for the Kafka broker for each app to connect to it.
Here we use the Kafka service name, `kafka` in this case.
We set the label `app: user-cost-stream` to logically group our apps.

We set the Spring Cloud Stream binding parameters using environment variables.
The input and output destination names have to be correct to wire the stream, specifically, the output of the source must be the same as the input of the processor, and the output of the processor must be the same as the input of the sink.

- Usage Detail Sender: `SPRING_CLOUD_STREAM_BINDINGS_OUTPUT_DESTINATION=user-details`
- Usage Cost Processor: `SPRING_CLOUD_STREAM_BINDINGS_INPUT_DESTINATION=user-details` and `SPRING_CLOUD_STREAM_BINDINGS_OUTPUT_DESTINATION=user-cost`
- Usage Cost Logger: `SPRING_CLOUD_STREAM_BINDINGS_INPUT_DESTINATION=user-cost`

#### Verify the deployment

Use the following command to tail the log for the `usage-cost-logger` sink:

```bash
kubectl logs -f usage-cost-logger
```

You should see messages streaming like:

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

#### Clean up

To delete the stream we can use the label we created:

```bash
kubectl delete pod -l app=usage-cost-stream
```

To uninstall Kafka:

```bash
kubectl delete all -l app=kafka
```

## Testing

**TODO** **We did not cover testing, in order to get to the heart of the matter quickly. We can circle back and show how to create unit test for spring cloud stream apps.**
