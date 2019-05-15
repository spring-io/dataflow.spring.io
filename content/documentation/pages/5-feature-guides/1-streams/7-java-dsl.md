---
path: 'feature-guides/streams/java-dsl/'
title: 'Java DSL'
description: 'How to create streams using Java'
---

# Stream Java DSL

Instead of using the shell to create and deploy streams, you can use the Java-based DSL provided by the `spring-cloud-dataflow-rest-client` module.
The Java DSL is a convenient wrapper around the `DataFlowTemplate` class that enables creating and deploying streams programmatically.

To get started, you need to add the following dependency to your project, as follows:

```xml
<dependency>
	<groupId>org.springframework.cloud</groupId>
	<artifactId>spring-cloud-dataflow-rest-client</artifactId>
	<version>%scdf-version-latest%</version>
</dependency>
```

<!--NOTE-->

A complete sample can be found in the [Spring Cloud Data Flow Samples Repository](https://docs.spring.io/spring-cloud-dataflow-samples/docs/current/reference/htmlsingle/#_java_dsl).

<!--END_NOTE-->

## Usage

The classes at the heart of the Java DSL are `StreamBuilder`, `StreamDefinition`, `Stream`, `StreamApplication`, and `DataFlowTemplate`.
The entry point is a `builder` method on `Stream` that takes an instance of a `DataFlowTemplate`.
To create an instance of a `DataFlowTemplate`, you need to provide a `URI` location of the Data Flow Server.

Spring Boot auto-configuration for `StreamBuilder` and `DataFlowTemplate` is also available.
The properties in [DataFlowClientProperties](https://github.com/spring-cloud/spring-cloud-dataflow/blob/master/spring-cloud-dataflow-rest-client/src/main/java/org/springframework/cloud/dataflow/rest/client/config/DataFlowClientProperties.java) can be used to configure the connection to the Data Flow server.
The common property to start using is `spring.cloud.dataflow.client.uri`

Consider the following example, using the `definition` style.

```java
URI dataFlowUri = URI.create("http://localhost:9393");
DataFlowOperations dataFlowOperations = new DataFlowTemplate(dataFlowUri);
dataFlowOperations.appRegistryOperations().importFromResource(
                     "https://bit.ly/%streaming-apps-latest%-stream-applications-rabbit-maven", true);
StreamDefinition streamDefinition = Stream.builder(dataFlowOperations)
                                      .name("ticktock")
                                      .definition("time | log")
                                      .create();
```

The `create` method returns an instance of a `StreamDefinition` representing a Stream that has been created but not deployed.
This is called the `definition` style since it takes a single string for the stream definition, same as in the shell.
If applications have not yet been registered in the Data Flow server, you can use the `DataFlowOperations` class to register them.
With the `StreamDefinition` instance, you have methods available to `deploy` or `destory` the stream.

```java
Stream stream = streamDefinition.deploy();
```

The `Stream` instance provides `getStatus`, `destroy` and `undeploy` methods to control and query the stream.
If you are going to immediately deploy the stream, there is no need to create a separate local variable of the type `StreamDefinition`.
You can just chain the calls together, as follows:

```java
Stream stream = Stream.builder(dataFlowOperations)
                  .name("ticktock")
                  .definition("time | log")
                  .create()
                  .deploy();
```

The `deploy` method is overloaded to take a `java.util.Map` of deployment properties.

The `StreamApplication` class is used in the 'fluent' Java DSL style and is discussed in the next section.
The `StreamBuilder` class is returned from the method `Stream.builder(dataFlowOperations)`.
In larger applications, it is common to create a single instance of the `StreamBuilder` as a Spring `@Bean` and share it across the application.

## Java DSL styles

The Java DSL offers two styles to create Streams.

- The `definition` style keeps the feel of using the pipes and filters textual DSL in the shell.
  This style is selected by using the `definition` method after setting the stream name - for example, `Stream.builder(dataFlowOperations).name("ticktock").definition(<definition goes here>)`.
- The `fluent` style lets you chain together sources, processors, and sinks by passing in an instance of a `StreamApplication`.
  This style is selected by using the `source` method after setting the stream name - for example, `Stream.builder(dataFlowOperations).name("ticktock").source(<stream application instance goes here>)`.
  You then chain together `processor()` and `sink()` methods to create a stream definition.

To demonstrate both styles, we include a simple stream that uses both approaches.
A complete sample for you to get started can be found in the [Spring Cloud Data Flow Samples Repository](https://docs.spring.io/spring-cloud-dataflow-samples/docs/current/reference/htmlsingle/#_java_dsl).

The following example demonstrates the definition approach:

```java
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

```java
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

The `waitAndDestroy` method uses the `getStatus` method to poll for the stream's status, as shown in the following example:

```java
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

When using the definition style, the deployment properties are specified as a `java.util.Map` in the same manner as using the shell.
The `createDeploymentProperties` method is defined as follows:

```java
private Map<String, String> createDeploymentProperties() {
  DeploymentPropertiesBuilder propertiesBuilder = new DeploymentPropertiesBuilder();
  propertiesBuilder.memory("log", 512);
  propertiesBuilder.count("log",2);
  propertiesBuilder.put("app.splitter.producer.partitionKeyExpression", "payload");
  return propertiesBuilder.build();
}
```

Is this case, application properties are also overridden at deployment time in addition to setting the deployer property `count` for the log application.
When using the fluent style, the deployment properties are added by using the method `addDeploymentProperty` (for example, `new StreamApplication("log").addDeploymentProperty("count", 2)`), and you do not need to prefix the property with `deployer.<app_name>`.

<!--NOTE-->

In order to create and deploy your streams, you need to make sure that the corresponding apps have been registered in the DataFlow server first.
Attempting to create or deploy a stream that contains an unknown app throws an exception.
You can register your application by using the `DataFlowTemplate`, as follows:

<!--END_NOTE-->

```java
dataFlowOperations.appRegistryOperations().importFromResource(
            "https://bit.ly/%streaming-apps-latest%-stream-applications-rabbit-maven", true);
```

The Stream applications can also be beans within your application that are injected in other classes to create Streams.
There are many ways to structure Spring applications, but one way is to have an `@Configuration` class define the `StreamBuilder` and `StreamApplications`, as shown in the following example:

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

Then in another class you can `@Autowire` these classes and deploy a stream.

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

## Using the DeploymentPropertiesBuilder

Regardless of style you choose, the `deploy(Map<String, String> deploymentProperties)` method allows customization of how your streams will be deployed.
We made it a easier to create a map with properties by using a builder style, as well as creating static methods for some properties so you don't need to remember the name of such properties.
If you take the previous example of `createDeploymentProperties` it could be rewritten as:

```java
private Map<String, String> createDeploymentProperties() {
	return new DeploymentPropertiesBuilder()
		.count("log", 2)
		.memory("log", 512)
		.put("app.splitter.producer.partitionKeyExpression", "payload")
		.build();
}
```

This utility class is meant to help with the creation of a Map and adds a few methods to assist with defining pre-defined properties.

## Skipper Deployment Properties

In addition to Spring Cloud Data Flow, you need to pass certain Skipper specific deployment properties, for example selecting the target platform.
The `SkipperDeploymentPropertiesBuilder` provides you all the properties in `DeploymentPropertiesBuilder` and adds those needed for Skipper.

```java
private Map<String, String> createDeploymentProperties() {
	return new SkipperDeploymentPropertiesBuilder()
		.count("log", 2)
		.memory("log", 512)
		.put("app.splitter.producer.partitionKeyExpression", "payload")
		.platformName("pcf")
		.build();
}
```
