---
path: 'batch-developer-guides/troubleshooting/debugging-scdf-tasks/'
title: 'Debugging Batch applications deployed by Data Flow'
description: 'Debugging Batch applications deployed by Data Flow'
---

# Debugging Tasks

## Did the Task Launch?

To determine if your task executed properly, go to the Task Execution page of the UI or from the shell type `task execution list`.
Find the task execution entry for the task launch.

```mermaid
graph TD;
    A{Task execution has start date?} --> |No| D
    A --> |Yes| B(Task has End Date)
	B --> |Yes| C(Task has proper Exit Code)
	B --> |No| E(Task is running)
	C --> |Yes| F(Task was successful)
	C --> |No| G(Task launched but execution returned failure code)
	D(Task failed to launch)

```

## What To Check If Task Failed To Launch

If a task fails to launch:

- Ensure the latest GA of a particular release version is being used
- Ensure platform of choice meets at least the minimum supported version
- Before launching task / batch applications in SCDF ensure the application has been successfully executed standalone. Refer to [Debugging Batch Applications](%currentPath%/batch-developer-guides/troubleshooting/debugging-task-apps/) before continuing.

SCDF is responsible for launching tasks.
Task launch failure messages can typically be found in the SCDF application logs.

## Platforms

### Local

```mermaid
graph TD;
    A{Start Locally?} --> |No| A
    A --> |Yes| B(Exceptions in SCDF?)
	B --> |Yes| C(Resolve exceptions)
	B --> |No| D(Exceptions in app logs?)
	D -->|Yes| E(Resolve exceptions)
	D -->|No| F(Raise log levels)
    F --> G(Enable debug)
```

Application log files can be inspected on a per application basis.
To aggregate logs from all applications into one, the deployer property `inheritLogging=true` can be set.
See
["Is it possible to aggregate Local deployments into a single log?"](%currentPath%/resources/faq/#aggregatelogs)
for more information and ["How do I enable DEBUG logs for platform deployments?"](%currentPath%/resources/faq/#debuglogs) for enabling more log output.

Debugging applications via JDWP can be accomplished by setting the deployer property `debugPort`.
See ["How do I remote debug deployed applications?"](%currentPath%/resources/faq/#remotedebug) for more information.

#### Docker Compose - Startup

```mermaid
graph TD;
    A{DATAFLOW_VERSION defined?} --> |No| A
    A --> |Yes| B{SKIPPER_VERSION defined?}
	B --> |No| B
```

The environment variables `DATAFLOW_VERSION` and `SKIPPER_VERSION` must be available in the current terminal environment via `export` or prefixing the `docker-compose` command.
See [Starting Docker Compose](%currentPath%/installation/local/docker/) for more information.

#### Docker Compose - Runtime

```mermaid
graph TD;
    A{Low Resources?} --> |Yes| B(Increase Docker Resources)
    A --> |No| C{Exceptions in app logs?}
	C --> |Yes| D(Resolve exceptions)
```

By default, the amount of memory allocated to Docker may be too low.
The recommended amount of memory to allocate is 8GB.
The command `docker stats` can provide useful information into resource usage.
If applications are failing to launch due to resource constraints, increase resource allocations.
Consult the [Docker documentation](https://docs.docker.com/) for your platform.

As tasks are launched via SCDF, applications that are part of that task definition will be launched as Java processes on the SCDF container.
For every part of a task definition, an application is launched.
The overall resource allocation (memory, CPU, etc) provided to Docker should account for the number of launched applications.

### Cloud Foundry

#### Startup failures

```mermaid
graph TD;
    A(Verify Manifest) --> B(Verify environment variables);
    B --> C(Service instances running?)
    C --> |No| C
    C --> |Yes| D(Exceptions in SCDF logs?)
    D --> |No| E(View logs and resolve errors)
```

#### Application failures

```mermaid
graph TD;
    A{Applications Started?} --> |No| B{Errors in SCDF logs?}
    A{Applications Started?} --> |No| F{Errors in app logs?}
    B --> C(Resolve)
	F --> C
```

When debugging deployment issues, raising deployer and Cloud Foundry related log levels may be useful.
See ["How do I enable DEBUG logs for platform deployments?"](%currentPath%/resources/faq/#debuglogs) for more information.

### Kubernetes

#### Distributed Deployment Files

```mermaid
graph TD;
    A{All files applied including RBAC?} --> |No| A
    A --> |Yes| B(External Services Running)
	B --> |No| B
	B --> |Yes| C{Exceptions in SCDF pod logs?}
	B --> |Yes| E{Exceptions in app pod logs?}
	C --> |Yes| F(Resolve)
	E --> |Yes| F(Resolve)
```

#### Helm Chart

```mermaid
graph TD;
    A{Chart found?} --> |No| B(helm repo update)
    A{Chart found?} --> |Yes| C{Expected Services Running?}
	C --> |No| C
	C --> |Yes| D{Exceptions in SCDF pod logs?}
	D --> |Yes| F(Resolve)
```

#### General

```mermaid
graph TD;
    A{Errors in pod events table?} --> |Yes| B(Resolve)
    C{Exceptions in app pod logs?} --> |Yes| B
```

When describing a pod, the `events` table section provides useful information when debugging and can be invoked by the following:

`kubectl describe po/pod_name`

For example, the events from a successfully launched `timestamp-batch-task` application would look similar to:

```
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  15s   default-scheduler  Successfully assigned default/timestamp-7138z511d8 to minikube
  Normal  Pulled     15s   kubelet, minikube  Container image "springcloudtask/timestamp-batch-task:latest" already present on machine
  Normal  Created    14s   kubelet, minikube  Created container
  Normal  Started    14s   kubelet, minikube  Started container
```

Application logs can be tailed to watch logs as they come in, for example:

`kubectl logs -f po/pod_name`

## Troubleshooting Help

If none of those above troubleshooting techniques helped and if you're still looking for help, you can reach out to us in [StackOverflow](https://stackoverflow.com/tags/spring-cloud-dataflow/) with the relevant details (see: [Wiki](https://github.com/spring-cloud/spring-cloud-dataflow/wiki/Reporting-Issues)) - we actively monitor the forum threads.
