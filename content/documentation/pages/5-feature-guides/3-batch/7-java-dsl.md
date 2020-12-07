---
path: 'feature-guides/batch/java-dsl/'
title: 'Task Java DSL'
description: 'Programmatically create tasks using the Java DSL'
---

# Task & TaskSchedule Java DSL

Instead of using the shell to create and launch tasks, you can use the Java-based DSL provided by the `spring-cloud-dataflow-rest-client` module.
The Java DSL for `Task` and `TaskSchedule` provides convenient wrappers around the `DataFlowTemplate` class that enables creating, launching, and scheduling tasks programmatically.

To get started, you need to add the following dependency to your project:

```xml
<dependency>
	<groupId>org.springframework.cloud</groupId>
	<artifactId>spring-cloud-dataflow-rest-client</artifactId>
	<version>%dataflow-version%</version>
</dependency>
```

The classes at the heart of the Java DSL are `TaskBuilder`, `Task`, `TaskSchedule`, `TaskScheduleBuilder`, and `DataFlowTemplate`.
The task DSL also uses a few DataFlowTemplate classes, such as `TaskExecutionResource`, `TaskExecutionStatus`, `JobExecutionResource` and `JobInstanceResource`.

The entry point is the `builder` method on `Task` or `TaskSchedule` that takes an instance of a `DataFlowTemplate`.

## Obtain a DataFlowOperations Instance

The DSL for both the `Task` and the `TaskSchedule` requires a valid `DataFlowOperations` instance.
Spring Cloud Data Flow offers the `DataFlowTemplate` as an implementation of the `DataFlowOperations` interface.

To create an instance of a `DataFlowTemplate`, you need to provide a `URI` location of the Data Flow Server.
Spring Boot auto-configuration for `DataFlowTemplate` is also available.
You can use the properties in [`DataFlowClientProperties`](https://github.com/spring-cloud/spring-cloud-dataflow/blob/master/spring-cloud-dataflow-rest-client/src/main/java/org/springframework/cloud/dataflow/rest/client/config/DataFlowClientProperties.java) to configure the connection to the Data Flow server.
Generally, you should start with the `spring.cloud.dataflow.client.uri` property:

```Java
URI dataFlowUri = URI.create("http://localhost:9393");
DataFlowOperations dataFlowOperations = new DataFlowTemplate(dataFlowUri);
```

## Task DSL Usage

You can create new `Task` instances with the help of the `TaskBuilder` class, which is returned from the `Task.builder(dataFlowOperations)` method.

Consider the following example, which creates a new composed task:

```Java
dataFlowOperations.appRegistryOperations().importFromResource(
                     "https://dataflow.spring.io/task-maven-latest", true);

Task task = Task.builder(dataflowOperations)
              .name("myComposedTask")
              .definition("a: timestamp && b:timestamp")
              .description("My Composed Task")
              .build();
```

The `build` method returns an instance of a `Task` definition that represents a composed task that has been created but not launched.
The `timestamp` used in the task definition refers to the task app name, as registered in DataFlow.

<!--NOTE-->

To create and launch your tasks, you need to make sure that the corresponding apps have been registered in the Data Flow server first, as shown [Batch Developer Guide](%currentPath%/batch-developer-guides/batch/data-flow-spring-batch/#create-task-definition).

Attempting to launch a task that contains an unknown application throws an exception.
You can register your application by using the `DataFlowOperations`, as follows:

```java
dataFlowOperations.appRegistryOperations().importFromResource(
            "https://dataflow.spring.io/task-maven-latest", true);
```

<!--END_NOTE-->

Instead of creating a new Task, you can use the `TaskBuilder` to retrieve an existing Task instance by name:

```Java
Optional<Task> task = Task.builder(dataflowOperations).findByName("myTask");
```

You can also list all existing tasks:

```Java
List<Task> tasks = Task.builder(dataflowOperations).allTasks();
```

With the `Task` instance, you have methods available to `launch` or `destroy` the task.
The following example launches the task:

```Java
long executionId = task.launch();

```

The `executionId` is a unique Task execution identifier for the launched task.
The `launch` method is overloaded to take a `java.util.Map<String, String>` of launch properties and `java.util.List<String>` of command line arguments.

The tasks are asynchronously run. If your use case requires you to wait on task completion or another task state, you can use the Java concurrency utilities or the `Awaitility` library, as follows:

```Java
org.awaitility.Awaitility.await().until(
  () -> task.executionStatus(executionId) == TaskExecutionStatus.COMPLETE);
```

The `Task` instance provides `executionStatus`, `destroy`, and `stop` methods to control and query the task.

The `Collection<TaskExecutionResource> executions()` method lists all `TaskExecutionResource` instances launched by the task. You can use the `executionId` to retrieve the `TaskExecutionResource` for a specific execution (`Optional<TaskExecutionResource> execution(long executionId)`).

Similarly, the `Collection<JobExecutionResource> jobExecutionResources()` and `Collection<JobInstanceResource> jobInstanceResources()` would let you introspect any Spring Batch Jobs when the task uses them.

## TaskSchedule DSL Usage

Consider the following example, which creates a new task and schedules it:

```Java
Task task = Task.builder(dataflowOperations)
              .name("myTask")
              .definition("timestamp")
              .description("simple task")
              .build();

TaskSchedule schedule = TaskSchedule.builder(dataFlowOperations)
              .schedueName("mySchedule")
              .task(task)
              .build();
```

The `TaskSchedule.builder(dataFlowOperations)` method returns the `TaskScheduleBuilder` class.

The `build` method returns an instance of a `TaskSchedule` instance called `mySchedule`, which is configured with a schedule instance.
At this point, the schedule has not been created.

You can use the `schedule()` method to create the schedule:

```Java
schedule.schedule("56 20 ? * *", Collections.emptyMap());
```

You can also use the `unschedule()` method to delete it:

```Java
schedule.unschedule();
```

You can use the `TaskScheduleBuilder` to retrieve one or all of the existing schedulers:

```Java
Optional<TaskSchedule> retrievedSchedule =
          taskScheduleBuilder.findByScheduleName(schedule.getScheduleName());

List<TaskSchedule> allSchedulesPerTask = taskScheduleBuilder.list(task);
```

## Setting Deployment Properties

This section covers how to set deployment properties for `Task` and `TaskScheduler`.

### Using the `DeploymentPropertiesBuilder` for `Task`

The `launch(Map<String, String> properties, List<String> arguments)` method lets you customize how your tasks are launched.
We made it easier to create a map with properties by using a builder style and creating static methods for some properties so that you need not remember the names of the properties:

```java
Map<String, String> taskLaunchProperties = new DeploymentPropertiesBuilder()
		.memory("myTask", 512)
		.put("app.timestamp.timestamp.format", "YYYY")
		.build();

long executionId = task.launch(taskLaunchProperties, Collections.EMPTY_LIST);
```

### Setting Properties for `TaskSchedule`

Similarly, you can set deployment properties for a `TaskSchedule` instance:

```java
Map<String,String> props = new HashMap<>();
props.put("app.timestamp.timestamp.format", "YYYY");
taskSchedule.schedule("*/1 * * * *", props);
```
