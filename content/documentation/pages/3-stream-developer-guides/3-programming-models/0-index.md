---
path: 'stream-developer-guides/programming-models/'
title: 'Programming Models'
description: 'Programming models'
---

# Programming Models

Spring Cloud Stream provides the flexibility to build the streaming applications by using different programming models.

- Functional
- Kafka Streams (when using Kafak Streams binder)

<!--NOTE-->

The annotation-based programming model (`@EnableBinding` / `@StreamListener`) has been deprecated in [Spring Cloud Stream 3.2.x](https://docs.spring.io/spring-cloud-stream/docs/current/reference/html/spring-cloud-stream.html#spring-cloud-stream-preface-notable-deprecations).

<!--END_NOTE-->

In the sections that follow, we review how a single example of business logic can be built with different programming models.

To highlight the use of programming with a concrete example, consider a scenario in which we receive data from an HTTP endpoint. Once the data is available, we want to transform the payload by adding prefix and suffixes. Finally, we want to verify the transformed data.

## Out-of-the-Box Source and Sink

To demonstrate the previously mentioned use case, we start by taking a look at the two out-of-the-box applications:

- [HTTP Source](https://github.com/spring-cloud/stream-applications/tree/main/applications/source/http-source)
- [Log Sink](https://github.com/spring-cloud/stream-applications/tree/main/applications/sink/log-sink)

## Custom Processor

For the data transformation between the source and sink steps, we highlight a custom processor application and use that as a base to demonstrate different programming models.

**Code:**

<!--TABS-->

<!--Functional-->

```java
public class FunctionStreamSampleProcessor {

	@Bean
	public Function<String, String> messenger() {
		return data -> "Hello: " + data + "!";
	}
}
```

<!--Kafka Streams-->

```java
public class KafkaStreamsSampleProcessor {

	@Bean
	public Consumer<KStream<String, String>> messenger() {
		return data -> data.map((k, v) -> new KeyValue<>(null, "Hello: " + v + "!"));
	}
}
```

<!--END_TABS-->

<!--NOTE-->

The business logic in the processor transforms the received payload by adding the "Hello: " prefix and the "!" suffix.

The same "business logic" can be implemented with different programming models, and each of the variations implements a simple `messenger` function, which can be independently tested and evolved in isolation.

**Takeaway**: Developers have the choice to choose from the available programming model styles.

<!--END_NOTE-->

**Configuration: _(application.properties)_**

<!--TABS-->

<!--Functional-->

```properties
spring.cloud.stream.bindings.input.destination=incomingDataTopic
spring.cloud.stream.bindings.output.destination=outgoingDataTopic
```

<!--Kafka Streams-->

```properties
spring.cloud.stream.bindings.input.destination=incomingDataTopic
spring.cloud.stream.bindings.output.destination=outgoingDataTopic

spring.cloud.stream.kafka.streams.binder.applicationId=kstreams-sample
```

<!--END_TABS-->

<!--NOTE-->

In the Kafka Streams configuration, you may have noticed the extra property, `spring.cloud.stream.kafka.streams.binder.applicationId`, which is required by the framework internally to identify the Kafka Streams application uniquely.

<!--END_NOTE-->

See the Spring Cloud Stream reference docs for more information on the [Functional](https://docs.spring.io/spring-cloud-stream/docs/3.2.x/reference/html/spring-cloud-stream.html#spring_cloud_function) and [Kafka Streams](https://docs.spring.io/spring-cloud-stream/docs/3.2.x/reference/html/spring-cloud-stream-binder-kafka.html#_functional_style) programming models.

## Composing Functional Beans in Processor Applications

Functional composition support is **not** applicable for the out-of-the-box Spring Cloud Stream `Processor` applications, since there is ambiguity in whether the function needs to be applied before or after the existing processor’s application logic.
It is hard to determine that.

However, you can create your own processor applications that use functional composition with the standard `java.util.Function` APIs, as follow:

```java
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

In this example, it would be set to:

```properties
spring.cloud.stream.function.definition=upper|concat
```
