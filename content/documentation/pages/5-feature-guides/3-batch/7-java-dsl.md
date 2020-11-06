---
path: 'feature-guides/batch/java-dsl/'
title: 'Task Java DSL'
description: 'Programmatically create tasks using the Java DSL'
---

# Task & TaskSchedule Java DSL

Instead of using the shell to create and launch tasks, you can use the Java-based DSL provided by the `spring-cloud-dataflow-rest-client` module.
The Task and TaskScheduler Java DSL provide convenient wrappers around the `DataFlowTemplate` class that enables creating, launching and scheduling tasks programmatically.

To get started, you need to add the following dependency to your project:

```xml
<dependency>
	<groupId>org.springframework.cloud</groupId>
	<artifactId>spring-cloud-dataflow-rest-client</artifactId>
	<version>%dataflow-version%</version>
</dependency>
```

The classes at the heart of the Java DSL are `TaskBuilder`, `Task`, `TaskSchedule`, `TaskScheduleBuilder` and `DataFlowTemplate`.
The task DSL also utilizes few DataFlowTemplate classes such as `TaskExecutionResource`, `TaskExecutionStatus`, `JobExecutionResource` and `JobInstanceResource`.

The entry point is the `builder` method on `Task` and `TaskSchedule` that takes an instance of a `DataFlowTemplate`.

## Obtain DataFlowTemplate

Both the `Task` and the `TaskSchedule` DSL requires a valid `DataFlowTemplate` instance.
To create an instance of a `DataFlowTemplate`, you need to provide a `URI` location of the Data Flow Server.
Spring Boot auto-configuration for `DataFlowTemplate` is also available.
You can use the properties in [DataFlowClientProperties](https://github.com/spring-cloud/spring-cloud-dataflow/blob/master/spring-cloud-dataflow-rest-client/src/main/java/org/springframework/cloud/dataflow/rest/client/config/DataFlowClientProperties.java) to configure the connection to the Data Flow server.
Generally, you should start with the `spring.cloud.dataflow.client.uri` property.

```Java
URI dataFlowUri = URI.create("http://localhost:9393");
DataFlowOperations dataFlowOperations = new DataFlowTemplate(dataFlowUri);
```

## Task DSL Usage

Consider the following example, which creates a new composed task:

```Java
dataFlowOperations.appRegistryOperations().importFromResource(
                     "https://dataflow.spring.io/task-maven-latest", true);

Task task = Task.builder(dataflowOperations)
              .name("myComposedTask")
              .definition("a: timestamp && b:timestamp")
              .description("My Composed Task")
              .create();
```

The `TaskBuilder` class is returned from the `Task.builder(dataFlowOperations)` method.

The `create` method returns an instance of a `Task` definition that represents a composite task that has been created but not launched.
It takes a single string for the task definition (same as in the shell).

<!--NOTE-->

In order to create and launch your tasks, you need to make sure that the corresponding apps have been registered in the Data Flow server first.
Attempting to launch a task that contains an unknown application throws an exception.
You can register your application by using the `DataFlowTemplate`, as follows:

```java
dataFlowOperations.appRegistryOperations().importFromResource(
            "https://dataflow.spring.io/task-maven-latest", true);
```

<!--END_NOTE-->

Instead of creating a new Task you can use the `TaskBuilder` to retrieve an existing Task instances by name:

```Java
Optional<Task> task = Task.builder(dataflowOperations).findByName("myTask");
```

or to list all existing tasks:

```Java
List<Task> tasks = Task.builder(dataflowOperations).allTasks();
```

With the `Task` instance, you have methods available to `launch` or `destroy` the task.
The following example launches the task:

```Java
long launchId = task.launch();

```

The `launchId` is an unique Task execution identifier for the launched task.
The `launch` method is overloaded to take a `java.util.Map<String, String>` of launch properties and `java.util.List<String>` of the command line arguments.

The tasks are asynchronously executed. If your use case require to wait on task completion or other task state you can you the java concurrency utils or the `Awaitility` library like this:

```Java
org.awaitility.Awaitility.await().until(
  () -> task.executionStatus(launchId) == TaskExecutionStatus.COMPLETE);
```

The `Task` instance provides `executionStatus`, `destroy`, and `stop` methods to control and query the task.

The `Collection<TaskExecutionResource> executions()` method list all `TaskExecutionResource`s launched by the task. Use the `launchId` to retrieve the `TaskExecutionResource` for a specific execution (`Optional<TaskExecutionResource> execution(long executionId)`).

Similarly the `Collection<JobExecutionResource> jobExecutionResources()` and `Collection<JobInstanceResource> jobInstanceResources()` would let you introspect any Spring Batch Jobs when the task uses such.

## TaskSchedule DSL Usage

Consider the following example, which creates a new task and schedule it:

```Java
Task task = Task.builder(dataflowOperations)
              .name("myTask")
              .definition("timestamp")
              .description("simple task")
              .create();

TaskSchedule schedule = TaskSchedule.builder(dataFlowOperations)
              .prefix("mySchedule")
              .task(task)
              .create();
```

The `TaskScheduleBuilder` class is returned from the `TaskSchedule.builder(dataFlowOperations)` method.

The `create` method returns an instance of a `TaskSchedule` instance called `mySchedule` configured whit a task instance.
At this point the schedule is not yet scheduled to run launch the task.

Use the schedule() method to trigger the schedule process:

```Java
schedule.schedule(Collections.singletonMap("scheduler.cron.expression", "56 20 ? * *"));
```

and the `unschedule()` to stop it:

```Java
schedule.unschedule();
```

The `TaskScheduleBuilder` can be used to retrieve or all the existing schedulers:

```Java
TaskSchedule retrievedSchedule = taskScheduleBuilder.findByScheduleName(schedule.getScheduleName());

List<TaskSchedule> allSchedulesPerTask = taskScheduleBuilder.list(task);
```

## Using the `DeploymentPropertiesBuilder`

The `launch(Map<String, String> properties, List<String> arguments)` method allows customization of how your tasks are launched.
We made it easier to create a map with properties by using a builder style, as well as creating static methods for some properties so you need not remember the name of such properties:

```java
Map<String, String> taskLaunchProperties = new DeploymentPropertiesBuilder()
		.memory("myTask", 512)
		.put("app.timestamp.timestamp.format", "YYYY")
		.build();

long launchId = task.launch(taskLaunchProperties, Collections.EMPTY_LIST);
```
