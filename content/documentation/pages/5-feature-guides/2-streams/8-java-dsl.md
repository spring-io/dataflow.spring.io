---
path: 'feature-guides/streams/java-dsl/'
title: 'Stream Java DSL'
description: 'Programmatically create streams using the Java DSL'
---

# Stream Java DSL

Instead of using the shell to create and deploy streams, you can use the Java-based DSL provided by the `spring-cloud-dataflow-rest-client` module.
The Java DSL is a convenient wrapper around the `DataFlowTemplate` class that enables creating and deploying streams programmatically.

To get started, you need to add the following dependency to your project:

```xml
<dependency>
	<groupId>org.springframework.cloud</groupId>
	<artifactId>spring-cloud-dataflow-rest-client</artifactId>
	<version>%dataflow-version%</version>
</dependency>
```

## Usage

The classes at the heart of the Java DSL are `StreamBuilder`, `StreamDefinition`, `Stream`, `StreamApplication`, and `DataFlowTemplate`.
The entry point is a `builder` method on `Stream` that takes an instance of a `DataFlowTemplate`.
To create an instance of a `DataFlowTemplate`, you need to provide a `URI` location of the Data Flow Server.

Spring Boot auto-configuration for `StreamBuilder` and `DataFlowTemplate` is also available.
You can use the properties in [`DataFlowClientProperties`](https://github.com/spring-cloud/spring-cloud-dataflow/blob/master/spring-cloud-dataflow-rest-client/src/main/java/org/springframework/cloud/dataflow/rest/client/config/DataFlowClientProperties.java) to configure the connection to the Data Flow server.
Generally, you should start with the `spring.cloud.dataflow.client.uri` property.

Consider the following example, which uses the `definition` style:

```Java
URI dataFlowUri = URI.create("http://localhost:9393");
DataFlowOperations dataFlowOperations = new DataFlowTemplate(dataFlowUri);
dataFlowOperations.appRegistryOperations().importFromResource(
                     "https://dataflow.spring.io/rabbitmq-maven-latest", true);
StreamDefinition streamDefinition = Stream.builder(dataFlowOperations)
                                      .name("ticktock")
                                      .definition("time | log")
                                      .create();
```

The `create` method returns an instance of a `StreamDefinition` that represents a Stream that has been created but not deployed.
This is called the "definition" style, since it takes a single string for the stream definition (same as in the shell).
If applications have not yet been registered in the Data Flow server, you can use the `DataFlowOperations` class to register them.
With the `StreamDefinition` instance, you have methods available to `deploy` or `destroy` the stream.
The following example deploys the stream:

```Java
Stream stream = streamDefinition.deploy();
```

The `Stream` instance provides `getStatus`, `destroy`, and `undeploy` methods to control and query the stream.
If you want to immediately deploy the stream, you need not create a separate local variable of the type `StreamDefinition`.
Rather, you can chain the calls together, as follows:

```Java
Stream stream = Stream.builder(dataFlowOperations)
                  .name("ticktock")
                  .definition("time | log")
                  .create()
                  .deploy();
```

The `deploy` method is overloaded to take a `java.util.Map` of deployment properties.

The `StreamApplication` class is used in the "fluent" Java DSL style and is discussed in the next section.
The `StreamBuilder` class is returned from the `Stream.builder(dataFlowOperations)` method.
In larger applications, it is common to create a single instance of the `StreamBuilder` as a Spring `@Bean` and share it across the application.

## Java DSL styles

The Java DSL offers two styles to create Streams:

- The `definition` style keeps the feel of using the pipes and filters of the textual DSL in the shell.
  This style is selected by using the `definition` method after setting the stream name &#151; for example, `Stream.builder(dataFlowOperations).name("ticktock").definition(<definition goes here>)`.
- The `fluent` style lets you chain together sources, processors, and sinks by passing in an instance of a `StreamApplication`.
  This style is selected by using the `source` method after setting the stream name &#151; for example, `Stream.builder(dataFlowOperations).name("ticktock").source(<stream application instance goes here>)`.
  You then chain together `processor()` and `sink()` methods to create a stream definition.

To demonstrate both styles, we include a simple stream that uses both approaches.

The following example demonstrates the definition approach:

```Java
public void definitionStyle() throws Exception{

  Map<String, String> deploymentProperties = createDeploymentProperties();

  Stream woodchuck = Stream.builder(dataFlowOperations)
          .name("woodchuck")
          .definition("http --server.port=9900 | splitter --expression=payload.split(' ') | log")
          .create()
          .deploy(deploymentProperties);

  waitAndDestroy(woodchuck)
}
```

The following example demonstrates the fluent approach:

```Java
private void fluentStyle(DataFlowOperations dataFlowOperations) throws InterruptedException {

  logger.info("Deploying stream.");

  Stream woodchuck = builder
    .name("woodchuck")
    .source(source)
    .processor(processor)
    .sink(sink)
    .create()
    .deploy();

  waitAndDestroy(woodchuck);
}
```

The `waitAndDestroy` method uses the `getStatus` method to poll for the stream's status:

```Java
private void waitAndDestroy(Stream stream) throws InterruptedException {

  while(!stream.getStatus().equals("deployed")){
    System.out.println("Wating for deployment of stream.");
    Thread.sleep(5000);
  }

  System.out.println("Letting the stream run for 2 minutes.");
  // Let the stream run for 2 minutes
  Thread.sleep(120000);

  System.out.println("Destroying stream");
  stream.destroy();
}
```

When using the definition style, the deployment properties are specified as a `java.util.Map` in the same manner as the shell.
The following listing shows the `createDeploymentProperties` method:

```java
private Map<String, String> createDeploymentProperties() {
  DeploymentPropertiesBuilder propertiesBuilder = new DeploymentPropertiesBuilder();
  propertiesBuilder.memory("log", 512);
  propertiesBuilder.count("log",2);
  propertiesBuilder.put("app.splitter.producer.partitionKeyExpression", "payload");
  return propertiesBuilder.build();
}
```

Is this case, application properties are also overridden at deployment time, in addition to setting the deployer property `count` for the log application.
When using the fluent style, the deployment properties are added by using the `addDeploymentProperty` method (for example, `new StreamApplication("log").addDeploymentProperty("count", 2)`), and you need not prefix the property with `deployer.<app_name>`.

<!--NOTE-->

To create and deploy your streams, you need to make sure that the corresponding apps have been registered in the Data Flow server first.
Attempting to create or deploy a stream that contains an unknown application throws an exception.
You can register your application by using the `DataFlowTemplate`, as follows:

```java
dataFlowOperations.appRegistryOperations().importFromResource(
            "https://dataflow.spring.io/rabbitmq-maven-latest", true);
```

<!--END_NOTE-->

Stream applications can also be beans within your application that are injected into other classes to create Streams.
There are many ways to structure Spring applications, but one way is to have a `@Configuration` class define the `StreamBuilder` and `StreamApplications`:

```java
@Configuration
public class StreamConfiguration {

  @Bean
  public StreamBuilder builder() {
    return Stream.builder(new DataFlowTemplate(URI.create("http://localhost:9393")));
  }

  @Bean
  public StreamApplication httpSource(){
    return new StreamApplication("http");
  }

  @Bean
  public StreamApplication logSink(){
    return new StreamApplication("log");
  }
}
```

Then, in another class, you can `@Autowire` these classes and deploy a stream:

```java
@Component
public class MyStreamApps {

  @Autowired
  private StreamBuilder streamBuilder;

  @Autowired
  private StreamApplication httpSource;

  @Autowired
  private StreamApplication logSink;

  public void deploySimpleStream() {
    Stream simpleStream = streamBuilder.name("simpleStream")
                            .source(httpSource)
                            .sink(logSink)
                            .create()
                            .deploy();
  }
}
```

This style lets you share `StreamApplications` across multiple Streams.

## Using the `DeploymentPropertiesBuilder`

Regardless of the style you choose, the `deploy(Map<String, String> deploymentProperties)` method allows customization of how your streams are deployed.
We made it easier to create a map with properties by using a builder style, as well as creating static methods for some properties so you need not remember the name of such properties.
You could rewrite the previous example of `createDeploymentProperties` as follows:

```java
private Map<String, String> createDeploymentProperties() {
	return new DeploymentPropertiesBuilder()
		.count("log", 2)
		.memory("log", 512)
		.put("app.splitter.producer.partitionKeyExpression", "payload")
		.build();
}
```

This utility class is meant to help with the creation of a `Map` and adds a few methods to assist with defining pre-defined properties.

## Skipper Deployment Properties

In addition to Spring Cloud Data Flow, you need to pass certain Skipper-specific deployment properties &#151; for example, selecting the target platform.
The `SkipperDeploymentPropertiesBuilder` provides all the properties in `DeploymentPropertiesBuilder` and adds those needed for Skipper. The following example creates a `SkipperDeploymentPropertiesBuilder`:

```Java
private Map<String, String> createDeploymentProperties() {
	return new SkipperDeploymentPropertiesBuilder()
		.count("log", 2)
		.memory("log", 512)
		.put("app.splitter.producer.partitionKeyExpression", "payload")
		.platformName("pcf")
		.build();
}
```
