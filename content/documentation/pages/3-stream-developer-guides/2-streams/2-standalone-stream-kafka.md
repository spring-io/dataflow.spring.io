---
path: 'stream-developer-guides/streams/standalone-stream-kafka/'
title: 'Standalone Streaming Application Development on Apache Kafka'
description: 'Create a simple stream processing application on Apache Kafka'
---

# Stream Processing with Apache Kafka

**TODO Look at TODO comments from the Stream Processing with RabbitMQ for guidance....**

We will start from Spring initializr and create three Spring Cloud Stream applications by choosing `Apache kafka` binder.

The three sample applications include:

Source - Usage Detail Sender `source` application sends the `call` and `data` usage per `userId`.

Processor - Usage Cost Processor `processor` application computes the call and data usage cost per `userId`.

Sink - Usage Cost Logger `sink` application logs the usage cost detail.

**TODO describe what the source, processor and sink will do, introduce the domain model.**
**TODO we can remove a step by not requiring the domain object to be in its own package**

We will then run them on your local machine, Cloud Foundry and Kubernetes without using Data Flow.
This provides a foundation to understand the steps that Data Flow is will automate for you.

## Development

The following sections describe how to build this stream from scratch. If you prefer, you can [download a zip file containing the completed application](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/dist/usage-cost-stream-kafka.zip?raw=true) for the sample stream, unzip it. There is a top level `pom.xml` that will build all three examples, or you can change directory into each example and build them individually. In both cases, the command to build is the same.

```bash
./mvnw clean package
```

You can proceed to the the [deployment](#deployment) section for your platform if you don't want to build the stream from scratch.

### Source

You can develop the source application by following the steps listed below or **TODO download the completed source example**

Either visit the [Spring Initialzr site](https://start.spring.io/) and follow the instructions below or [download the initialzr generated project directly](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-detail-sender-kafka&groupId=io.spring.dataflow.sample&artifactId=usage-detail-sender-kafka&name=usage-detail-sender-kafka&description=Demo+project+for+Spring+Boot&packageName=io.spring.dataflow.sample.usagedetailsender&packaging=jar&javaVersion=1.8&inputSearch=&style=kafka&style=cloud-stream&style=actuator&style=web)

1. Create a new Maven project with a Group name of `io.spring.dataflow.sample` and an Artifact name of `usage-detail-sender-kafka`.
1. In the Dependencies text box, type `Kafka` to select the Kafka binder dependency.
1. In the Dependencies text box, type `Cloud Stream` to select the Spring Cloud Stream dependency.
1. Click the Generate Project button.

Now you should `unzip` the `usage-detail-sender-kafka.zip` file and import the project into your favorite IDE.

#### Business Logic

If you haven't downloaded the completed source example, you will need to perform the following development steps.

1.  In your favorite IDE create the `io.spring.dataflow.sample.domain` package.
1.  Create a `UsageDetail` class in the `io.spring.dataflow.sample.domain` using your favorite IDE that looks like the contents in [UsageDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/usage-detail-sender/src/main/java/io/spring/dataflow/sample/domain/UsageDetail.java).
    This `UsageDetail` model contains `userId`, `data` and `duration` properties.
1.  Create the class `UsageDetailSender` that will send `UsageDetail` objects or each user populated with call duration, data usage.
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

Now let's build the Usage Detail Sender application.
In the directory `usage-detail-sender` use the following command to build the project using maven.

```
./mvnw clean package
```

#### Testing

#### Running the Source

We can individually test these custom applications before creating a pipeline using Spring Cloud Data Flow.
To test, we can explicitly set the Spring Cloud Stream bindings destination property and run the application.

```
spring.cloud.stream.bindings.output.destination=test-usage-detail
```

In this case, we can use some test Kafka `topics` to verify the outbound and inbound messages.
For instance, you can set the `output` binding to a test Kafka topic named `test-usage-detail` and see if the messages get posted to this Kafka topic.

You can run the standalone `UsageDetailSender` source application as,

```
java -jar target/usage-detail-sender-kafka-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.output.destination=test-usage-detail &
```

Now, you can see the messages being sent to the Kafka topic `test-usage-detail` using Kafka console consumer as follows:

```
./bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test-usage-detail
```

### Processor

You can develop the processor application by following the steps listed below or

**TODO download the completed processor example**

Either visit the [Spring Initialzr site](https://start.spring.io/) and follow the instructions below or [download the initialzr generated project directly](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-cost-processor-kafka&groupId=io.spring.dataflow.sample&artifactId=usage-cost-processor-kafka&name=usage-cost-processor-kafka&description=Demo+project+for+Spring+Boot&packageName=io.spring.dataflow.sample.usagecostprocessor&packaging=jar&javaVersion=1.8&inputSearch=&style=kafka&style=cloud-stream&style=actuator&style=web)

1. Create a new Maven project with a Group name of `io.spring.dataflow.sample` and an Artifact name of `usage-cost-processor-kafka`.
1. In the Dependencies text box, type `kafka` to select the Kafka binder dependency.
1. In the Dependencies text box, type `cloud stream` to select the Spring Cloud Stream dependency.
1. Click the Generate Project button.

Now you should `unzip` the `usage-cost-processor-kafka.zip` file and import the project into your favorite IDE.

#### Business Logic

If you haven't downloaded the completed processor example, you will need to perform the following development steps.

1.  In your favorite IDE create the `io.spring.dataflow.sample.domain` package.
1.  Create a `UsageDetail` class in the `io.spring.dataflow.sample.domain` using your favorite IDE that looks like the contents in [UsageDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/usage-cost-processor/src/main/java/io/spring/dataflow/sample/domain/UsageDetail.java).
    This `UsageDetail` model contains `userId`, `data` and `duration` properties.
1.  Create a `UsageCostDetail` class in the `io.spring.dataflow.sample.domain` using using your favorite IDE that looks like the contents in [UsageCostDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/usage-cost-processor/src/main/java/io/spring/dataflow/sample/domain/UsageCostDetail.java).
    This `UsageCostDetail` model contains `userId`, `callCost` and `dataCost` properites.
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

Now let's build the Usage Cost Processor application.
In the directory `usage-cost-processor` use the following command to build the project using maven.

```
./mvnw clean package
```

#### Testing

To test this `processor` application, you need to set the `input` binding to the test Kafka topic `test-usage-detail` to receive the `UsageDetail` data and `output` binding to the test Kafka topic `test-usage-cost` to send the computed `UsageCostDetail`.

```
spring.cloud.stream.bindings.input.destination=test-usage-detail
spring.cloud.stream.bindings.output.destination=test-usage-cost
```

#### Running the Processor

You can run the standalone `UsageCostProcessor` processor application as,

```
java -jar target/usage-cost-processor-kafka-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.input.destination=test-usage-detail --spring.cloud.stream.bindings.output.destination=test-usage-cost &
```

With the `UsageDetail` data on the `test-usage-detail` Kafka topic using the `UsageDetailSender` source application, you can see the `UsageCostDetail` from the `test-usage-cost` Kafka topic as follows:

```
 ./bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test-usage-cost
```

### Sink

You can develop the sink application by following the steps listed below.

Either visit the [Spring Initialzr site](https://start.spring.io/) and follow the instructions below or [download the initialzr generated project directly](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-cost-logger-kafka&groupId=io.spring.dataflow.sample&artifactId=usage-cost-logger-kafka&name=usage-cost-logger-kafka&description=Demo+project+for+Spring+Boot&packageName=io.spring.dataflow.sample.usagecostlogger&packaging=jar&javaVersion=1.8&inputSearch=&style=kafka&style=cloud-stream&style=actuator&style=web)

1. Create a new Maven project with a Group name of `io.spring.dataflow.sample` and an Artifact name of `usage-cost-logger-kafka`.
1. In the Dependencies text box, type `kafka` to select the Kafka binder dependency.
1. In the Dependencies text box, type `cloud stream` to select the Spring Cloud Stream dependency.
1. Click the Generate Project button.

Now you should `unzip` the `usage-cost-logger-kafka.zip` file and import the project into your favorite IDE.

#### Business Logic

1.  In your favorite IDE create the `io.spring.dataflow.sample.domain` package.
1.  Create a `UsageCostDetail` class in the `io.spring.dataflow.sample.domain` using using your favorite IDE that looks like the contents in [UsageCostDetail.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-kafka/usage-cost-logger/src/main/java/io/spring/dataflow/sample/domain/UsageCostDetail.java).
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

**TODO some discussion of the annotations should be made**

#### Building

Now let's build the Usage Cost Logger application. In the directory `usage-cost-logger` use the following command to build the project using maven.

```
./mvnw clean package
```

#### Testing

To test this `sink` application you need to set the `input` binding that connects to the test Kafka topic `test-usage-cost` to receive the `UsageCostDetail`.

```
spring.cloud.stream.bindings.input.destination=test-usage-cost
```

#### Running the Sink

You can run the standalone `UsageCostLogger` sink application as,

```
java -jar target/usage-cost-logger-kafka-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.input.destination=test-usage-cost &
```

Now, you can see that this application logs the usage cost detail.

## Deployment

In this section we will deploy the apps created previous to the local machine, Cloud Foundry and Kubernetes.

**TODO this section needs to be finished**

### Local

**TODO explain at a high level what we are going to do**

**TODO mention requirements of getting kafka running. provide instructions for using a docker image**

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

**TODO We did not cover testing, in order to get to the heart of the matter quickly. We can circle back and show how to create unit test for spring cloud stream apps.**
