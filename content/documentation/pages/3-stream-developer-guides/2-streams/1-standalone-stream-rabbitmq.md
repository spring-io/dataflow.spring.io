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

The following sections describe how to build this stream from scratch. If you prefer, you can [download a zip file containing the completed application](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/stream-developer-guides/streams/standalone-stream-rabbitmq/dist/usage-cost-stream-rabbit.zip?raw=true) for the sample stream, unzip it. There is a top level `pom.xml` that will build all three examples, or you can change directory into each example and build them individually. In both cases, the command to build is the same.

```bash
./mvnw clean package
```

You can proceed to the the [deployment](#deployment) section for your platform if you don't want to build the stream from scratch.

### Source

You can develop the source application by following the steps listed below.

<<<<<<< HEAD
**TODO - Add actuator dependency**

Either visit the [Spring Initialzr site](https://start.spring.io/) and follow the instructions below or [download the initialzr generated project directly](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-detail-sender-rabbit&groupId=io.spring.dataflow.sample&artifactId=usage-detail-sender-rabbit&name=usage-detail-sender-rabbit&description=Demo+project+for+Spring+Boot&packageName=io.spring.dataflow.sample.usagedetailsender&packaging=jar&javaVersion=1.8&inputSearch=&style=amqp&style=cloud-stream).
=======
Either visit the [Spring Initialzr site](https://start.spring.io/) and follow the instructions below or [download the initialzr generated project directly](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-detail-sender-rabbit&groupId=io.spring.dataflow.sample&artifactId=usage-detail-sender-rabbit&name=usage-detail-sender-rabbit&description=Demo+project+for+Spring+Boot&packageName=io.spring.dataflow.sample.usagedetailsender&packaging=jar&javaVersion=1.8&inputSearch=&style=amqp&style=cloud-stream&style=actuator&style=web).
>>>>>>> Change from shell to UI and fix initializr links

1. Create a new Maven project with a Group name of `io.spring.dataflow.sample` and an Artifact name of `usage-detail-sender-rabbit`.
1. In the Dependencies text box, type `RabbitMQ` to select the RabbitMQ binder dependency.
1. In the Dependencies text box, type `Cloud Stream` to select the Spring Cloud Stream dependency.
1. Click the Generate Project button.

Now you should `unzip` the `usage-detail-sender-rabbit.zip` file and import the project into your favorite IDE.

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

Now let’s build the Usage Detail Sender application. In the directory `usage-detail-sender` use the following command to build the project using maven.

```bash
./mvnw clean package
```

#### Testing

** TODO Create unit test as in http appstarters**

### Processor

You can develop the processor application by following the steps listed below.

<<<<<<< HEAD
**TODO - Add actuator dependency**

Either visit the [Spring Initialzr site](https://start.spring.io/) and follow the instructions below or [download the initialzr generated project directly](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-cost-processor-rabbit&groupId=io.spring.dataflow.sample&artifactId=usage-cost-processor-rabbit&name=usage-cost-processor-rabbit&description=Demo+project+for+Spring+Boot&packageName=io.spring.dataflow.sample.usagecostprocessor&packaging=jar&javaVersion=1.8&inputSearch=&style=amqp&style=cloud-stream).
=======
Either visit the [Spring Initialzr site](https://start.spring.io/) and follow the instructions below or [download the initialzr generated project directly](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-cost-processor-rabbit&groupId=io.spring.dataflow.sample&artifactId=usage-cost-processor-rabbit&name=usage-cost-processor-rabbit&description=Demo+project+for+Spring+Boot&packageName=io.spring.dataflow.sample.usagecostprocessor&packaging=jar&javaVersion=1.8&inputSearch=&style=amqp&style=cloud-stream&style=actuator&style=web).
>>>>>>> Change from shell to UI and fix initializr links

1. Create a new Maven project with a Group name of `io.spring.dataflow.sample` and an Artifact name of `usage-cost-processor-rabbit`.
1. In the Dependencies text box, type `Rabbitmq` to select the RabbitMQ binder dependency.
1. In the Dependencies text box, type `Cloud Stream` to select the Spring Cloud Stream dependency.
1. Click the Generate Project button.

Now you should `unzip` the `usage-cost-processor-rabbit.zip` file and import the project into your favorite IDE.

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

Now let's build the Usage Cost Processor application. In the directory `usage-cost-processor` use the following command to build the project using maven.

```
./mvnw clean package
```

#### Testing

**TODO: Create unit test**

### Sink

<<<<<<< HEAD
You can develop the sink application by following the steps listed below.

**TODO - Add actuator dependency**
=======
You can develop the sink application by following the steps listed below or **TODO download the completed sink example**
>>>>>>> Change from shell to UI and fix initializr links

Either visit the [Spring Initialzr site](https://start.spring.io/) and follow the instructions below or [download the initialzr generated project directly](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&bootVersion=2.1.4.RELEASE&baseDir=usage-cost-logger-rabbit&groupId=io.spring.dataflow.sample&artifactId=usage-cost-logger-rabbit&name=usage-cost-logger-rabbit&description=Demo+project+for+Spring+Boot&packageName=io.spring.dataflow.sample.usagecostlogger&packaging=jar&javaVersion=1.8&inputSearch=&style=cloud-stream&style=amqp&style=actuator&style=web)

1. Create a new Maven project with a Group name of `io.spring.dataflow` and an Artifact name of `usage-cost-logger-rabbit`.
1. In the Dependencies text box, type `rabbitmq` to select the RabbitMQ binder dependency.
1. In the Dependencies text box, type `cloud stream` to select the Spring Cloud Stream dependency.
1. Click the Generate Project button.

Now you should `unzip` the `usage-cost-logger-rabbit.zip` file and import the project into your favorite IDE.

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

Now let's build the Usage Cost Logger application. In the directory `usage-cost-logger` use the following command to build the project using maven.

```
./mvnw clean package
```

#### Testing

**TODO: Create unit test **

## Deployment

In this section we will deploy the apps created previous to the local machine, Cloud Foundry and Kubernetes.

\*\*TODO There should be some discussion around how the underlying RabbitMQ messaging is going to be configured via stream properties, for example in the current k8s, section `input groups` are being used, we should explain why.

In all 3 deployments, properties related to the quality of service, e.g.

https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#_improving_the_quality_of_service

should be described up front.

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
java -jar target/usage-detail-sender-rabbit-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.output.destination=test-usage-detail &
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
java -jar target/usage-cost-processor-rabbit-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.input.destination=test-usage-detail --spring.cloud.stream.bindings.output.destination=test-usage-cost &
```

#### Running the Sink

To test this `sink` application you need to set the `input` binding that connects to the test RabbitMQ exchange `test-usage-cost` to receive the `UsageCostDetail`.

```
spring.cloud.stream.bindings.input.destination=test-usage-cost
```

You can run the standalone `UsageCostLogger` sink application as,

```
java -jar target/usage-cost-logger-rabbit-0.0.1-SNAPSHOT.jar --spring.cloud.stream.bindings.input.destination=test-usage-cost &
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

#### Install RabbitMQ

We will install the RabbitMQ message broker, using the default configuration from Spring Cloud Data Flow. Execute the following command:

```bash
kubectl apply -f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/rabbitmq/rabbitmq-deployment.yaml \
-f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/rabbitmq/rabbitmq-svc.yaml
```

#### Build docker images

For this we will use the [jib maven plugin](https://github.com/GoogleContainerTools/jib/tree/master/jib-maven-plugin#build-your-image). If you downloaded the [source distribution](#development), the jib plugin is already configured. If you built the apps from scratch, add the following under `plugins` in each pom.xml:

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
| If you downloaded the project source, the project includes a parent pom to build all the modules with a single command. Otherwise, run the build for the source, processor, and sink individually. You only need to execute `eval $(minikube docker-env)` once for each terminal session.

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
      image: springcloudstream/usage-detail-sender-rabbit:0.0.1-SNAPSHOT
      ports:
        - containerPort: 80
          protocol: TCP
      env:
        - name: SPRING_RABBITMQ_ADDRESSES
          value: rabbitmq
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
      image: springcloudstream/usage-cost-processor-rabbit:0.0.1-SNAPSHOT
      ports:
        - containerPort: 80
          protocol: TCP
      env:
        - name: SPRING_RABBITMQ_ADDRESSES
          value: rabbitmq
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
      image: springcloudstream/usage-cost-logger-rabbit:0.0.1-SNAPSHOT
      ports:
        - containerPort: 80
          protocol: TCP
      env:
        - name: SPRING_RABBITMQ_ADDRESSES
          value: rabbitmq
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

The above YAML specifies three pod resources, for the source, processor, and sink applications. Each pod has a single container, referencing the respective docker image.

We set the Spring Cloud Stream binding parameters using environment variables. The input and output destination names have to be correct to wire the stream, specifically, the output of the source must be the same as the input of the processor, and the output of the processor must be the same as the input of the sink.

- Usage Detail Sender: `SPRING_CLOUD_STREAM_BINDINGS_OUTPUT_DESTINATION=user-details`
- Usage Cost Processor: `SPRING_CLOUD_STREAM_BINDINGS_INPUT_DESTINATION=user-details` and `SPRING_CLOUD_STREAM_BINDINGS_OUTPUT_DESTINATION=user-cost`
- Usage Cost Logger: `SPRING_CLOUD_STREAM_BINDINGS_INPUT_DESTINATION=user-cost`

We also set the logical hostname for the RabbitMQ broker for each app to connect to it. Here we use the RabbitMQ service name, `rabbitmq` in this case. We also set the label `app: user-cost-stream` to logically group our apps.

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

To uninstall RabbitMQ:

```bash
kubectl delete all -l app=rabbitmq
```

## Testing

**TODO We did not cover testing, in order to get to the heart of the matter quickly. We can circle back and show how to create unit test for spring cloud stream apps.**
