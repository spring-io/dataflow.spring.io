---
path: 'feature-guides/streams/function-composition/'
title: 'Composing Functions'
description: 'Daisy-chain Java functions in an existing Spring Cloud Stream application'
---

# Function Composition

Spring Cloud Stream includes an integration with Spring Cloud Function's function-based programming model that lets the business logic of an application be modeled as a `java.util.Function`, a `java.util.Consumer`, and a `java.util.Supplier`, representing the roles of a `Processor`, a `Sink`, and a `Source`, respectively.

The guide on [Programming Models](%currentPath%/stream-developer-guides/programming-models/) shows how to write a `Processor` by using the functional style.

Building on this foundation, we can extend existing `Source` and `Sink` applications by importing the configuration of an existing `Source` or `Sink` and adding code that defines a `java.util.Function`.

Consider the following stream:

```bash
http | transformer --expression=(\"Hello \"+payload.toString().toUpperCase()) | log
```

For certain use-cases, a simple payload transformation logic may not require a standalone application, and it may be beneficial to combine the transformation with either the source or the sink. For example, we may want to avoid an extra application being deployed for such a small amount of logic or avoid having any sensitive data be sent on the messaging middleware.

To do this, we can create a new source applications that imports the `HttpSourceConfiguration` and registers a `java.util.Function` as a Spring bean. This automatically applies the function after the original source's output.
Similarly, for a `Sink` instance, the function is applied before the sink's input.

Also, you can not only compose the original source or sink with a single function, but you can declaratively compose several functions with the original source or sink.

In this guide, we create the stream defined earlier and then create a new `http-transformer` source application that encapsulates the original transformer expression as two `java.util.Function` instances.
A new stream is deployed to do the same processing but now using only two applications instead of three.

For this guide we assume that the respective `http`, `transformer`, and `log` applications have already been imported and registered with Spring Cloud Data Flow, as described in the [Installation guide](%currentPath%/installation/).

## Using Three Applications

For the first stream, we use the prebuilt `http`, `transform`, and `log` applications.

First, we create the following stream:

```
stream create hello --definition "http --server.port=9000 | transformer --expression=(\"Hello \"+payload.toString().toUpperCase()) | log"
```

Then we deploy the stream, as follows:

```
stream deploy hello
```

In this guide, we use local installation so that we can post some data to the endpoint on localhost, as follows:

```
http post --data "friend" --target "http://localhost:9000"
```

You can see the following log message in the `log` application:

```
[sformer.hello-1] log-sink                                 : Hello FRIEND

```

## Using Two Applications

In this step, we create and register a a new source application that combines the functionality of the two applications in the Stream (`http | transformer`) into one application.
We then deploy the new stream and verify that the output of is the same as in the previous example.

The new source application is called `http-transformer` and imports the `http` source application's configuration and defines two `java.util.Function` instances as Spring Beans. The following listing shows the source for this application:

```java
@SpringBootApplication
@Import(org.springframework.cloud.stream.app.http.source.HttpSourceConfiguration.class)
public class HttpSourceRabbitApplication {

	@Bean
	public Function<String, String> upper() {
		return value -> value.toUpperCase();
	}

	@Bean
	public Function<String, String> concat() {
		return value -> "Hello "+ value;
	}


	public static void main(String[] args) {
		SpringApplication.run(HttpSourceRabbitApplication.class, args);
	}
}
```

Spring Cloud Stream has a property called `spring.cloud.stream.function.definition`. It takes a pipe- or comma-delimited list of functions, which are invoked in order.

When this property is set, the functional beans are automatically chained at runtime.

The functional composition happens in the following way:

- When the Spring Cloud Stream application is of type `Source`, the composed function is applied after the source `output`.

- When the Spring Cloud Stream application is of type `Sink`, the composed function is applied before the sink `input`.

To apply the `upper` function and then the `concat` function, the property needs to be set as follows:

```
spring.cloud.stream.function.definition=upper|concat
```

<!--NOTE-->

The pipe symbol is used by Spring Cloud Function to compose together two functions that live in the same JVM. Note that the pipe symbol in the Spring Cloud Data Flow DSL is used to connect the messaging middleware output from one application to another.

<!--END_NOTE-->

Now you can build the new source, register it, and deploy the stream on your local machine.

### Building

You can skip this section if you want to register the `maven` or `docker` resource URI of the `http-transformer` that we have made available on our Maven repository and Dockerhub.

You can download the source code for this application from Github.

If you use the RabbitMQ binder, you can download [http-transformer-with-RabbitMQ-binder](https://github.com/spring-cloud/spring-cloud-dataflow-samples/raw/master/dataflow-website/stream-developer-guides/feature-guides/streams/dist/composed-http-transformer-rabbitmq.zip)
After downloading and unpacking the source code, you can build the application by using Maven, as follows:

```
cd composed-http-transformer-kafka
./mvnw clean install
```

If you use the Kafka binder, you can download [http-transformer-with-Kafka-binder](https://github.com/spring-cloud/spring-cloud-dataflow-samples/raw/master/dataflow-website/stream-developer-guides/feature-guides/streams/dist/composed-http-transformer-kafka.zip)
After downloading and unpacking the source code, you can build the application by using Maven, as follows:

```
cd composed-http-transformer-rabbitmq
./mvnw clean install
```

### Registering the Locally Built Application

Now you can register `http-transformer` application by using the Data Flow Shell, as follows:

```
app register --name http-transformer --type source --uri file:///<YOUR-SOURCE-CODE>/target/composed-http-transformer-[kafka/rabbitmq]-0.0.1-SNAPSHOT.jar
```

<!--NOTE-->

For the `--uri` option, replace the directory name and path of the artifact with the values appropriate to your system.

<!--END_NOTE-->

### Registering the Readily Available Application

The Maven and Docker artifacts of the `http-transformer` application are readily available in both the `Kafka` and `RabbitMQ` binders.

The following listing describes a Maven artifact with a Kafka binder:

```
app register --name http-transformer --type source --uri maven://io.spring.dataflow.sample:composed-http-transformer-kafka:0.0.1-SNAPSHOT
```

The following listing describes a Maven artifact with a RabbitMQ binder:

```
app register --name http-transformer --type source --uri maven://io.spring.dataflow.sample:composed-http-transformer-rabbitmq:0.0.1-SNAPSHOT
```

The following listing describes a Docker artifact with a Kafka binder:

```
app register --name http-transformer --type source --uri docker://springcloudstream/composed-http-transformer-kafka:0.0.1-SNAPSHOT
```

The following listing describes a Docker artifact with a RabbitMQ binder:

```
app register --name http-transformer --type source --uri docker://springcloudstream/composed-http-transformer-rabbitmq:0.0.1-SNAPSHOT
```

### Deploying the Stream

We can now deploy a new stream by using the `http-transform` application that includes the functional beans with the names `upper` and `concat`.

```
stream create helloComposed --definition "http-transformer --server.port=9001 | log"
```

To chain the order in which the functions are run, we have to use the `spring.cloud.stream.function.definition` property to define the function definition.
The function definition represents the functional DSL defined by Spring Cloud Function.

In this case, it is as follows:

```
stream deploy helloComposed --properties "app.http-transformer.spring.cloud.stream.function.definition=upper|concat"

```

<!-- TODO why not specify function.definition in the stream definition? -->

The preceding deployment composes the `upper` and `concat` function beans into the `http` source application.

Then we can send the payload to `http` application, as follows:

```
http post --data "friend" --target "http://localhost:9001"
```

Then you can see the output in the `log` application, as follows:

```
[helloComposed-1] log-sink                                 : Hello FRIEND

```

### Kotlin Support

Kotlin is supported in Spring Cloud Function. You can add Kotlin-based function beans in your applications.
You can add any Kotlin function beans into composable functions for `Source` or `Sink` applications.

To see this work, we can create another sample application (`http-transformer-kotlin`) that defines Kotlin function beans.

The Kotlin function bean is configured as a `processor`. Here, the Kotlin function bean is the `transform` function, as defined below:

```
@Bean
open fun transform(): (String) -> String {
   return { "How are you ".plus(it) }
}
```

Also, this project has the `spring-cloud-function-kotlin` as a dependency to apply functional configuration support for Kotlin functions, which is defined as follows:

```
<dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-function-kotlin</artifactId>
      <version>2.0.0.RELEASE</version>
    </dependency>
```

#### Building

You can skip this section if you want to register the `maven` or `docker` resource URI of the `http-transformer-kotlin` with the Spring Cloud Data Flow server.

You can download the source code for this application from Github.

If you use the RabbitMQ binder, you can download [http-transformer-kotlin-with-RabbitMQ-binder](https://github.com/spring-cloud/spring-cloud-dataflow-samples/raw/master/dataflow-website/stream-developer-guides/feature-guides/streams/dist/composed-http-transformer-kotlin-rabbitmq.zip)
After downloading and unpacking the source code, you can build the application by using Maven, as follows:

```
cd composed-http-transformer-kotlin-kafka
./mvnw clean install
```

If you use the Kafka binder, you can download [http-transformer-kotlin-with-Kafka-binder](https://github.com/spring-cloud/spring-cloud-dataflow-samples/raw/master/dataflow-website/stream-developer-guides/feature-guides/streams/dist/composed-http-transformer-kotlin-kafka.zip)
After downloading and unpacking the source code, you can build the application by using Maven, as follows:

```
cd composed-http-transformer-kotlin-rabbitmq
./mvnw clean install
```

#### Registering the Locally Built Application

Now you can register `http-transformer-kotlin` application by using the Data Flow Shell, as follows:

```
app register --name http-transformer-kotlin --type source --uri file:///>YOUR-SOURCE-CODE>/target/composed-http-transformer-kotlin-[kafka/rabbitmq]-0.0.1-SNAPSHOT.jar
```

For the `--uri` option, replace the directory name and path of the artifact with the value appropriate to your system.

#### Registering the Readily Available Application

The Maven/Docker artifacts of the `http-transformer` application are readily available in both the `Kafka` and `RabbitMQ` binders.

The following listing describes a Maven artifact with a Kafka binder:

```
app register --name http-transformer-kotlin --type source --uri maven://io.spring.dataflow.sample:composed-http-transformer-kotlin-kafka:0.0.1-SNAPSHOT
```

The following listing describes a Maven artifact with a RabbitMQ binder:

```
app register --name http-transformer-kotlin --type source --uri maven://io.spring.dataflow.sample:composed-http-transformer-kotlin-rabbitmq:0.0.1-SNAPSHOT
```

The following listing describes a Docker artifact with a Kafka binder:

```
app register --name http-transformer-kotlin --type source --uri docker://springcloudstream/composed-http-transformer-kotlin-kafka:0.0.1-SNAPSHOT
```

The following listing describes a Docker artifact with a RabbitMQ binder:

```
app register --name http-transformer-kotlin --type source --uri docker://springcloudstream/composed-http-transformer-kotlin-rabbitmq:0.0.1-SNAPSHOT
```

#### Deploying the Stream

To create a stream with the `http-transformer-kotlin` application as the `Source`, run the following command:

```
stream create helloComposedKotlin --definition "http-transformer-kotlin --server.port=9002 | log"

```

As we did in the `http-transformer` example, we can use the`spring.cloud.stream.function.definition` property to specify any valid composed function DSL to construct the functional composition.
In this case, we can combine the function beans registered with Java configuration along with the function bean from Kotlin processor configuration, as the following example shows:

```
stream deploy helloComposedKotlin --properties "app.http-transformer-kotlin.spring.cloud.stream.function.definition=upper|transform|concat"

```

In the following example, the function name (`transform`) corresponds to Kotlin function name:

```
http post --data "friend" --target "http://localhost:9002"

```

[[note]]
| **Note** We can perform the composition between Kotlin functions and Java functions because Kotlin functions are internally converted into `java.util.Function`.

You can see the output in the `log` application, as follows:

```
[omposedKotlin-1] log-sink               : Hello How are you FRIEND
```
