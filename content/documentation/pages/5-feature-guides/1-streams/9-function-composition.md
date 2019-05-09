---
path: 'feature-guides/streams/function-composition/'
title: 'Composing Functions'
description: 'Compose functions to an existing application.'
---

# Function Composition

Spring Cloud Stream includes an integration with Spring Cloud Function's based programming model that enables the business logic of an application to be modelled as a `java.util.Function`, a `java.util.Consumer`, and a `java.util.Supplier`, representing the roles of a `Processor`, `Sink`, and `Source` respectively.

The guide on [Programming Models](%currentPath%/stream-developer-guides/programming-models/) shows how to write a `Processor` using the functional style.

Building on this foundation, we can extend existing `Source` and `Sink` applications by importing the configuration of an existing `Source` or `Sink` and adding code that defines a `java.util.Function`.

For example, given the stream

```bash
http | transformer --expression=(\"Hello \"+payload.toString().toUpperCase()) | log
```

For certain use-cases, a simple payload transformation logic may not require a standalone application and it is beneficial to combine the transformation with either the source or the sink. For example, we may want to avoid an extra application being deployed for such a small amount of logic or to not have any sensitive data received be sent on the messaging middleware.

To do this we can create a new source applications that imports the `HttpSourceConfiguration` and registers a `java.util.Function` as a Spring bean. This will automatically apply the function after the original source's output.
Similarly, for `Sink`'s, the function is applied before the sink's input.

It is also possible to not only compose the original source or sink with a single function, but to declaratively compose several functions with the original source or sink.

In this guide, we will create the stream defined above and then create a new `http-transformer` source application that encapsulates the original transformer expression as two `java.util.Function`s.
A new stream will be deployed that does the same processing, but now only using two applications instead of three.

For this guide we assume that the respective `http`, `transformer`, and `log` application have already been imported and registered with Spring Cloud Data Flow as described in the [Installation guide](%currentPath%/installation/).

## Using three applications

For the first stream, we will use the pre-built `http`, `transform` and `log` applications.

Create the following stream:

```
stream create hello --definition "http --server.port=9000 | transformer --expression=(\"Hello \"+payload.toString().toUpperCase()) | log"
```

Then deploy the stream:

```
stream deploy hello
```

In this guide we are using the Local installation so we can post some data to the endpoint on localhost.

```
http post --data "friend" --target "http://localhost:9000"
```

You can see the following log message in the `log` application:

```
[sformer.hello-1] log-sink                                 : Hello FRIEND

```

## Using two applications

In this step we will create and register a a new source application combines the functionality of the two applications in the Stream, `http | transformer`, into one application.
We will then deploy the new stream and verify that the output of is the same as in the previous example.

The new source application is called `http-transformer` and imports the http source applications configuration and defines two `java.util.Function`'s as Spring Beans.

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

Spring Cloud Stream has a property, called `spring.cloud.stream.function.definition` that takes a pipe or comma delimited list of functions which will be invoked in order.

When this property is set, the functional beans are automatically chained at the runtime.

The functional composition happens in the following way:

- When the Spring Cloud Stream application is of type `Source`, the composed function is applied after the source `output`.

- When the Spring Cloud Stream application is of type `Sink`, the composed function is applied before the sink `input`.

To apply the `upper` function and then the `concat` function, the property needs to be set as:

```
spring.cloud.stream.function.definition=upper|concat
```

<!--NOTE-->

The pipe symbol is used by Spring Cloud Function to compose together these two functions that live in the same JVM. Note that the pipe symbol in the Spring Cloud Data Flow DSL is used to connect the messaging middleware output from one application to another.

<!--END_NOTE-->

Now we will build the new source, register it and deploy the stream on your local machine.

### Building

You can skip this section if you want to register the `maven` or `docker` resource URI of the `http-transformer` that we have made available on our Maven repository and Dockerhub.

You can download the source code for this application from Github:

If you are using RabbitMQ binder: [http-transformer-with-RabbitMQ-binder](https://github.com/spring-cloud/spring-cloud-dataflow-samples/raw/master/dataflow-website/stream-developer-guides/feature-guides/streams/dist/composed-http-transformer-rabbitmq.zip)
After downloading and unpacking the source code, you can build the application using maven:

```
cd composed-http-transformer-kafka
./mvnw clean install
```

If you are using Kafka binder: [http-transformer-with-Kafka-binder](https://github.com/spring-cloud/spring-cloud-dataflow-samples/raw/master/dataflow-website/stream-developer-guides/feature-guides/streams/dist/composed-http-transformer-kafka.zip)
After downloading and unpacking the source code, you can build the application using maven:

```
cd composed-http-transformer-rabbitmq
./mvnw clean install
```

### Registering the locally built application

Now register `http-transformer` application by using the Data Flow Shell.

```
app register --name http-transformer --type source --uri file:///<YOUR-SOURCE-CODE>/target/composed-http-transformer-[kafka/rabbitmq]-0.0.1-SNAPSHOT.jar
```

<!--NOTE-->

For the below app register `--uri` option, replace the directory name and path of the artifact with the value appropriate to your system.

<!--END_NOTE-->

### Registering the readily available application

The maven/docker artifacts of the `http-transformer` application are readily available in both the `Kafka` and `RabbitMQ` binders.

**TODO we need to let users know about how to register our maven repo?**

Maven artifact with Kafka binder:

```
app register --name http-transformer --type source --uri maven://io.spring.dataflow.sample:composed-http-transformer-kafka:0.0.1-SNAPSHOT
```

Maven artifact with RabbitMQ binder:

```
app register --name http-transformer --type source --uri maven://io.spring.dataflow.sample:composed-http-transformer-rabbitmq:0.0.1-SNAPSHOT
```

Docker artifact with Kafka binder:

```
app register --name http-transformer --type source --uri docker://springcloudstream/composed-http-transformer-kafka:0.0.1-SNAPSHOT
```

Docker artifact with RabbitMQ binder:

```
app register --name http-transformer --type source --uri docker://springcloudstream/composed-http-transformer-rabbitmq:0.0.1-SNAPSHOT
```

### Deploying the stream

We will now deploy a new stream using the `http-transform` application that includes the functional beans with the name `upper` and `concat`.

```
stream create helloComposed --definition "http-transformer --server.port=9001 | log"
```

To chain the order in which the functions will be run, we will have to use the `spring.cloud.stream.function.definition` property to define the function definition.
The function definition represents the functional DSL defined by Spring Cloud Function.

In this case, it is:

```
stream deploy helloComposed --properties "app.http-transformer.spring.cloud.stream.function.definition=upper|concat"

```

**TODO why not specify function.definition in the stream definition?**

The above deployment composes the `upper` and `concat` function beans into the `http` source application.

Then we can send the payload to `http` application:

```
http post --data "friend" --target "http://localhost:9001"
```

Then you can see the output in the `log` application as,

```
[helloComposed-1] log-sink                                 : Hello FRIEND

```

### Kotlin Support

Kotlin is supported in Spring Cloud Function. You can add Kotlin-based function beans in your applications.
You can add any Kotlin function beans into composable functions for `Source` or `Sink` applications.

To see this working, let’s create another sample application `http-transformer-kotlin` that defines Kotlin function beans.

The Kotlin function bean is configured as a `processor`. Here, the Kotlin function bean is the `transform` function as defined below:

```
@Bean
open fun transform(): (String) -> String {
   return { "How are you ".plus(it) }
}
```

Also, this project has the `spring-cloud-function-kotlin` as a dependency to apply functional configuration support for Kotlin functions, defined as follows:

```
<dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-function-kotlin</artifactId>
      <version>2.0.0.RELEASE</version>
    </dependency>
```

#### Building

You can skip this section if you want to register the `maven` or `docker` resource URI of the `http-transformer-kotlin` with the Spring Cloud Data Flow server.

You can download the source code for this application from Github:

If you are using RabbitMQ binder: [http-transformer-kotlin-with-RabbitMQ-binder](https://github.com/spring-cloud/spring-cloud-dataflow-samples/raw/master/dataflow-website/stream-developer-guides/feature-guides/streams/dist/composed-http-transformer-kotlin-rabbitmq.zip)
After downloading and unpacking the source code, you can build the application using maven:

```
cd composed-http-transformer-kotlin-kafka
./mvnw clean install
```

If you are using Kafka binder: [http-transformer-kotlin-with-Kafka-binder](https://github.com/spring-cloud/spring-cloud-dataflow-samples/raw/master/dataflow-website/stream-developer-guides/feature-guides/streams/dist/composed-http-transformer-kotlin-kafka.zip)
After downloading and unpacking the source code, you can build the application using maven:

```
cd composed-http-transformer-kotlin-rabbitmq
./mvnw clean install
```

#### Registering the locally built application

Now register `http-transformer-kotlin` application by using the Data Flow Shell.

**NOTE**

> For the below app register `--uri` option, replace the directory name and path of the artifact with the value appropriate to your system.

```
app register --name http-transformer-kotlin --type source --uri file:///>YOUR-SOURCE-CODE>/target/composed-http-transformer-kotlin-[kafka/rabbitmq]-0.0.1-SNAPSHOT.jar
```

#### Registering the readily available application

The maven/docker artifacts of the `http-transformer` application are readily available in both the `Kafka` and `RabbitMQ` binders.

Maven artifact with Kafka binder:

```
app register --name http-transformer-kotlin --type source --uri maven://io.spring.dataflow.sample:composed-http-transformer-kotlin-kafka:0.0.1-SNAPSHOT
```

Maven artifact with RabbitMQ binder:

```
app register --name http-transformer-kotlin --type source --uri maven://io.spring.dataflow.sample:composed-http-transformer-kotlin-rabbitmq:0.0.1-SNAPSHOT
```

Docker artifact with Kafka binder:

```
app register --name http-transformer-kotlin --type source --uri docker://springcloudstream/composed-http-transformer-kotlin-kafka:0.0.1-SNAPSHOT
```

Docker artifact with RabbitMQ binder:

```
app register --name http-transformer-kotlin --type source --uri docker://springcloudstream/composed-http-transformer-kotlin-rabbitmq:0.0.1-SNAPSHOT
```

#### Deploying the stream

To create a stream with the `http-transformer-kotlin` application as the `Source`:

```
stream create helloComposedKotlin --definition "http-transformer-kotlin --server.port=9002 | log"

```

As we did in the `http-transformer` example, we can use the`spring.cloud.stream.function.definition` property to specify any valid composed function DSL to construct the functional composition.
In this case, let’s combine the function beans registered via Java configuration along with the function bean from Kotlin processor configuration.

```
stream deploy helloComposedKotlin --properties "app.http-transformer-kotlin.spring.cloud.stream.function.definition=upper|transform|concat"

```

Here, the function name `transform` corresponds to Kotlin function name.

**Note** We can perform the composition between Kotlin functions and Java functions because Kotlin functions are internally converted into `java.util.Function`.

```
http post --data "friend" --target "http://localhost:9002"

```

and, you can see the output in the `log` application as:

```
[omposedKotlin-1] log-sink               : Hello How are you FRIEND
```
