---
path: 'feature-guides/streams/function-composition/'
title: 'Composing Functions'
description: 'Compose functions to an existing application.'
---

With the function composition, you can attach a functional logic dynamically to an existing event streaming application. The business logic is a mere implementation of `java.util.Function`, `java.util.Supplier` or `java.util.Consumer` interfaces that map to `processor`, `source` and `sink`, respectively.

If you have a functional logic implemented using `java.util.Function`, you can represent this `java.util.Function` as a Spring Cloud Data Flow `processor` and attach it to an existing source or sink application. The function composition in this context could be the source and processor combined in one single application: a “new source,” or it could be the processor and sink combined into a single application: “a new sink.” Either way, the transformation logic represented in the `processor` application can be composed into a `source` or `sink` application without having to develop a separate `processor` application.

Let’s start with a streaming data pipeline use-case to receive data, transform and log results using three applications. With that in place, let’s refactor the streaming data pipeline using functional composition to further optimize for the requirements in hand.

### **Streaming data pipeline with three applications**

You can setup Spring Cloud Data Flow and Spring Cloud Skipper servers using the [installation guide](../../../installation/).

For the first stream, we will use the out-of-the-box `http`, `transform` and `log` applications.

**NOTE** Make sure to import the out of the box streaming applications into Spring Cloud Data Flow server.

Now we can create a simple stream without functional composition:

```
stream create hello --definition "http --server.port=9000 | transformer --expression=(\"Hello \"+payload.toString().toUpperCase()) | log"
```

Then we can deploy the stream:

```
stream deploy hello
```

```
http post --data "friend" --target "http://localhost:9000"
```

You can see the following log message at the `log` application:

```
[sformer.hello-1] log-sink                                 : Hello FRIEND

```

In this stream, we have the http (source), transformer (processor), and log (sink) applications deployed as standalone applications in the target platform (in this case, it is local). For certain use-cases, a simple payload transformation logic may not require a standalone application. It might be beneficial to combine the transformation with either the source or the sink.

To compose Processor functions into Source or Sink applications, we use Spring Cloud Stream’s functional composition support.

The functional composition support in Spring Cloud Stream is based on Spring Cloud Function’s ability to allow the registration of

- `java.util.Supplier`
- `java.util.Consumer`
- `java.util.Function`

as Spring `@Bean` definitions.

These function `@Bean` definitions are available for composition at runtime.

Spring Cloud Stream has a property, called `spring.cloud.stream.function.definition`, which corresponds to the function definition DSL in Spring Cloud Function.
When this property is set, the desired functional beans are automatically chained at the runtime.

The functional composition happens in the following way:

- When the Spring Cloud Stream application is of type `Source`, the composed function is applied after the source `output`.

- When the Spring Cloud Stream application is of type `Sink`, the composed function is applied before the sink `input`.

This gives us the ability to compose a series of functions in a single Spring Cloud Stream application and subsequently have Spring Cloud Data Flow orchestrates it as streaming data pipeline.

### **Composing functions into a Stream application**

Let’s create and deploy a stream that composes the previous example’s transformer expression into the `Source` application itself.

The transformer logic is performed in two steps, and they both implement the java.util.Function interface.

We will create a new source application `http-transformer` which extends the out of the box http `source` application.

This application defines the following function beans:

```
	@Bean
	public Function<String, String> upper() {
		return value -> value.toUpperCase();
	}

	@Bean
	public Function<String, String> concat() {
		return value -> "Hello "+ value;
	}

```

#### Building

You can skip this section if you want to register the `maven` or `docker` resource URI of the `http-transformer` with the Spring Cloud Data Flow server

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

#### Registering the locally built application

Now register `http-transformer` application by using the Data Flow Shell.

**NOTE**

> For the below app register `--uri` option, replace the directory name and path of the artifact with the value appropriate to your system.

```
app register --name http-transformer --type source --uri file:///<YOUR-SOURCE-CODE>/target/composed-http-transformer-[kafka/rabbitmq]-0.0.1-SNAPSHOT.jar
```

#### Registering the readily available application

The maven/docker artifacts of the `http-transformer` application are readily available in both the `Kafka` and `RabbitMQ` binders.

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

#### Deploying the stream

Instead of the using the transform application from the previous example, we will use the http-transform application that includes the functional beans with the name upper() and concat().

```
stream create helloComposed --definition "http-transformer --server.port=9001 | log"
```

To chain the order in which the functions will be run, we will have to use the `spring.cloud.stream.function.definition` property to define the function definition.
The function definition represents the functional DSL defined by Spring Cloud Function.

In this case, it is:

```
stream deploy helloComposed --properties "app.http-transformer.spring.cloud.stream.function.definition=upper|concat"

```

The above deployment composes the `upper` and `concat` function beans into the `http` source application.

Then we can send the payload to `http` application:

```
http post --data "friend" --target "http://localhost:9001"
```

Then you can see the output in the `log` application as,

```
[helloComposed-1] log-sink                                 : Hello FRIEND

```

### Composing functional beans to Processor applications

The functional composition support is **not** applicable for the out-of-the-box Spring Cloud Stream `Processor` applications, since there is ambiguity in whether the function needs to be applied before or after the existing processor’s application logic.
It is hard to determine that.

However, you can create your own processor applications that use functional composition with the standard `java.util.Function` APIs, as the following example shows:

```
@Configuration
public static class FunctionProcessorConfiguration {

  @Bean
  public Function<String, String> upperAndConcat() {
  return upper().andThen(concat());
  }

  @Bean
  public Function<String, String> upper() {
     return value -> value.toUpperCase();
  }

  @Bean
  public Function<String, String> concat() {
     return value -> "Hello "+ value;
  }
}
```

When you deploy your stream with the custom `processor` application, you need to deploy the `processor` application by defining the following property: `spring.cloud.stream.function.definition` to compose functional beans.

### **Kotlin Support**

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
