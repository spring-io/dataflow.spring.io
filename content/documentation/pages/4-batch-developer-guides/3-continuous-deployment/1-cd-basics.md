---
path: 'batch-developer-guides/continuous-deployment/cd-basics/'
title: 'Continuous Deployment of task applications'
description: 'This section discusses how to use Continuous Deployment of Tasks in SCDF'
---

# Continuous Deployment of Task Applications

As task applications evolve, you want to get your updates to production.
The change can be a new version of the task application that fixes a bug or setting a deployment property different from the previous task launch.

When a task application is registered in SCDF, a version is typically associated with it. A task application can have multiple versions associated with it, with one selected as the default. The following image illustrates an application with multiple versions associated with it (see the timestamp entry).

<img src="images/scdf-task-application-versions.png" alt="Registering Task Applications with multiple Versions" width="740"/>

Versions of an application are managed in SCDF by registering multiple applications with the same name and coordinates, _except_ the version is different. For example, if you were to register an application with the following values, you would get one application registered with two versions (2.0.0.RELEASE and 2.1.0.RELEASE):

- Application 1
  - Name: `timestamp`
  - Type: `task`
  - URI: `maven://io.spring:timestamp-task:2.0.1`
- Application 2
  - Name: `timestamp`
  - Type: `task`
  - URI: `maven://io.spring:timestamp-task:2.0.2`

Besides having multiple versions, Spring Cloud Data Flow needs to know which version to run on the next launch. This is indicated by setting a version to be the default version. Whatever version of a task application is configured as the default version is the one to be run on the next launch request. You can see which version is the default in the UI, as follows:

<img src="images/scdf-task-default-version.png" alt="Task Application Default Version" width="740"/>

## Task Launch Lifecycle

Before the CD support for Tasks in SCDF, when the request to launch a task was received, Spring Cloud Data Flow would deploy the application (if needed) and run it. If the application was being run on a platform that did not need to have the application deployed every time (Cloud Foundry, for example), the previously deployed application was used. This flow has changed starting from 2.3. The following image shows what happens when a task launch request comes in now:

<img src="images/scdf-task-launch-flow.png" alt="Flow For Launching A Task" width="740"/>

There are three main flows to consider in the preceding diagram:

- Launching the first time or launching with no changes is one
- Launching when there are changes but the task is not running
- Launching when there are changes but the task is running

We look at the flow with no changes first.

### Launch a Task With No Changes

1. A launch request comes into Data Flow. Data Flow determines that an upgrade is not required, since nothing has changed (no properties, deployment properites, or versions have changed since the last execution).

1. On platforms that cache a deployed artifact (Cloud Foundry at the time of this writing), Data Flow checks whether the application was previously deployed.

1. If the application needs to be deployed, Data Flow deploys the task application.

1. Data Flow launches the application.

This flow is the default behavior and, if nothing has changed, occurs every time a request comes in. Note that this is the same flow that Data Flow has always executed for launching tasks.

### Launch a Task With Changes That Is Not Currently Running

The second flow to consider when launching a task is whether there was a change in the task application version, the application properties, or the deployment properties. In this case, the following flow is executed:

1. A launch request comes into Data Flow. Data Flow determines that an upgrade is required, since there was a change in either task application version, application properties, or deployment properties.

1. Data Flow checks to see whether another instance of the task definition is currently running.

1. If there is not another instance of the task definition currently running, the old deployment is deleted.

1. On platforms that cache a deployed artifact (Cloud Foundry at the time of this writing), Data Flow checks whether the application was previously deployed (this check evaluates to `false` in this flow, since the old deployment was deleted).

1. Data Flow does the deployment of the task application with the updated values (new application version, new merged properties, and new merged deployment properties).

1. Data Flow launches the application.

This flow is what fundamentally enables continuous deployment for Spring Cloud Data Flow.

### Launch a Task With Changes While Another Instance Is Running

The last main flow is when a launch request comes to Spring Cloud Data Flow to do an upgrade but the task definition is currently running. In this case, the launch is blocked due to the requirement to delete the current application. On some platforms (Cloud Foundry at the time of this writing), deleting the application causes all currently running applications to be shut down. This feature prevents that from happening. The following process describes what happens when a task changes while another instance is running:

1. A launch request comes into to Data Flow. Data Flow determines that an upgrade is required, since there was a change in any one of task application version, application properties, or deployment properties.

1. Data Flow checks to see whether another instance of the task definition is currently running.

1. Data Flow prevents the launch from happening because other instances of the task definition are running.

NOTE: Any launch that requires an upgrade of a task definition that is running at the time of the request is blocked from executing due to the need to delete any currently running tasks.

### Example of Continuous Deployment

We now have the `timestamp` application registered in the `Application Registry` with two versions: `2.0.1` and `2.0.2`.

```bash
dataflow:>app list --id task:timestamp
╔═══╤══════╤═════════╤════╤═══════════════════════════╗
║app│source│processor│sink│           task            ║
╠═══╪══════╪═════════╪════╪═══════════════════════════╣
║   │      │         │    │> timestamp-2.0.1 <║
║   │      │         │    │timestamp-2.0.2    ║
╚═══╧══════╧═════════╧════╧═══════════════════════════╝
```

The task application `timestamp` now uses the version `2.0.1` as the default version when launching the task.

Create a task called `demo1` by using the `timestamp` application registered earlier:

```bash
dataflow:>task create demo1 --definition "timestamp"
Created new task 'demo1'
```

Launch the task `demo1` with the deployment properties set:

```bash
dataflow:>task launch demo1 --properties "app.timestamp.format=YYYY"
Launched task 'demo1' with execution id 1
```

When the task is launched, you can check the task execution `status` and verify that the application version `2.0.1` is used:

```bash
dataflow:>task execution status 1
╔══════════════════════╤═══════════════════════════════════════════════════════════════════════════════════╗
║         Key          │                                       Value                                       ║
╠══════════════════════╪═══════════════════════════════════════════════════════════════════════════════════╣
║Id                    │1                                                                                  ║
║Resource URL          │io.spring:timestamp-task:jar:2.0.1                                                 ║
║Name                  │demo1                                                                              ║
║CLI Arguments         │[--spring.cloud.data.flow.platformname=default, --spring.cloud.task.executionid=1] ║
║App Arguments         │                 timestamp.format = YYYY                                           ║
║                      │       spring.datasource.username = ******                                         ║
║                      │           spring.cloud.task.name = demo1                                          ║
║                      │            spring.datasource.url = ******                                         ║
║                      │spring.datasource.driverClassName = org.h2.Driver                                  ║
║Deployment Properties │app.timestamp.format = YYYY                                                        ║
║Job Execution Ids     │[]                                                                                 ║
║Start Time            │Wed May 20 20:50:40 IST 2020                                                       ║
║End Time              │Wed May 20 20:50:40 IST 2020                                                       ║
║Exit Code             │0                                                                                  ║
║Exit Message          │                                                                                   ║
║Error Message         │                                                                                   ║
║External Execution Id │demo1-87a6e434-33ce-4b09-9f14-6b1892b6c135                                         ║
╚══════════════════════╧═══════════════════════════════════════════════════════════════════════════════════╝
```

Now we can try to change the default version of the `timestamp` application to `2.0.2`.

```bash
dataflow:>app default --id task:timestamp --version 2.0.2
New default Application task:timestamp:2.0.2
```

You can verify the change, as follows:

```bash
dataflow:>app list --id task:timestamp
╔═══╤══════╤═════════╤════╤═══════════════════════════╗
║app│source│processor│sink│           task            ║
╠═══╪══════╪═════════╪════╪═══════════════════════════╣
║   │      │         │    │timestamp-2.0.1            ║
║   │      │         │    │> timestamp-2.0.2         <║
╚═══╧══════╧═════════╧════╧═══════════════════════════╝
```

Now the default version of `timestamp` application is set to use `2.0.2`.
This means that any subsequent launch of `timestamp` application would use `2.0.2` instead of the previous default (`2.0.1`).

```bash
dataflow:>task launch demo1
Launched task 'demo1' with execution id 2
```

You can verify this by using the task execution status, as follows:

```bash
dataflow:>task execution status 2
╔══════════════════════╤═══════════════════════════════════════════════════════════════════════════════════╗
║         Key          │                                       Value                                       ║
╠══════════════════════╪═══════════════════════════════════════════════════════════════════════════════════╣
║Id                    │2                                                                                  ║
║Resource URL          │io.spring:timestamp-task:jar:2.0.2                                                 ║
║Name                  │demo1                                                                              ║
║CLI Arguments         │[--spring.cloud.data.flow.platformname=default, --spring.cloud.task.executionid=2 ]║
║App Arguments         │                 timestamp.format = YYYY                                           ║
║                      │       spring.datasource.username = ******                                         ║
║                      │           spring.cloud.task.name = demo1                                          ║
║                      │            spring.datasource.url = ******                                         ║
║                      │spring.datasource.driverClassName = org.h2.Driver                                  ║
║Deployment Properties │app.timestamp.format = YYYY                                                        ║
║Job Execution Ids     │[]                                                                                 ║
║Start Time            │Wed May 20 20:57:21 IST 2020                                                       ║
║End Time              │Wed May 20 20:57:21 IST 2020                                                       ║
║Exit Code             │0                                                                                  ║
║Exit Message          │                                                                                   ║
║Error Message         │                                                                                   ║
║External Execution Id │demo1-aac20c8b-9c80-40dc-ac7d-bb3f4155be41                                         ║
╚══════════════════════╧═══════════════════════════════════════════════════════════════════════════════════╝
```

Note that the `2.0.2` version of the `timestamp` application is now used, along with the deployment properties from the previous task launch.
You can override these deployment properties during the task launch as well.

Note: While the deployment properties are propagated between the task launches, the task arguments are **not** propagated.The idea is to keep the arguments only for each task launch.

## Scheduling Lifecycle

Spring Cloud Data Flow supports scheduling on 2 platforms: Kubernetes and Cloud Foundry.
In both cases Spring Cloud Data Flow interacts with the scheduling system provided by the platform to:

- Create a schedule
- Delete a schedule
- List available schedules
  Each platform handles scheduling of tasks differently. In the following sections we will discuss
  how Spring Cloud Data Flow schedules a task.

### Scheduling on Cloud Foundry

1. A scheduling request comes into Spring Cloud Data Flow. Spring Cloud Data Flow determines if the application currently exists, if it isn't present it deploys the application to the Cloud Foundry instance. Then binds the application to the scheduler (along with the required bindings).

1. Once the application has been deployed and bound to the scheduler, the scheduler then launches the application based on the schedule provided.

Once the application has been scheduled, then the lifecycle of the application is managed by the Cloud Foundry Scheduler and is no longer managed by Spring Cloud Data Flow, except when removing the schedule or delete it when the task definition is deleted.

### Scheduling on Kubernetes

1. A scheduling request comes into Spring Cloud Data Flow. Spring Cloud Data Flow creates a CronJob in the namespace and cluster specified by the platform.

1. Once the CronJob has been created, the CronJob then launches the application based on the schedule provided.

Once the application has been scheduled, then the lifecycle of the application is managed by the associated CronJob. Spring Cloud Data Flow then will delete the CronJob when the task definition is deleted or is the schedule is deleted.
