---
path: 'stream-developer-guides/troubleshooting/debugging-scdf/'
title: 'Debugging Stream applications deployed by Data Flow'
description: 'Debugging Stream applications deployed by Data Flow'
---

# Debugging streams

If a stream fails to deploy:

- Ensure the latest GA of a particular release version is being used
- Ensure platform of choice meets at least the minimum supported version
- All applications that are part of the stream have been tested as standalone applications outside of SCDF

Skipper is responsible for deploying streams.
Stream deployment failure messages can typically be found in the Skipper application logs.

# Local

```mermaid
graph TD;
    A{Start Locally?} --> |No| A
    A --> |Yes| B(Exceptions in SCDF or Skipper logs?)
	B --> |Yes| C(Resolve exceptions)
	B --> |No| D(Exceptions in app logs?)
	D -->|Yes| E(Resolve exceptions)
	D -->|No| F(Raise log levels)
    F --> G(Enable debug)
```

Application log files can be inspected on a per application basis.
To aggregate logs from all applications into one, the deployer property `inheritLogging=true` can be set.
See
[Log Redirect](http://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#_log_redirect)
for more information and [Deployment Logs](http://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#troubleshooting-deployment-logs) for enabling more log output.

Debugging applications via JDWP can be accomplished by setting the deployer property `debugPort`.
See [Remote Debugging](http://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#_remote_debugging) for more information.

# Docker Compose - Startup

```mermaid
graph TD;
    A{DATAFLOW_VERSION defined?} --> |No| A
    A --> |Yes| B{SKIPPER_VERSION defined?}
	B --> |No| B
```

The environment variables `DATAFLOW_VERSION` and `SKIPPER_VERSION` must be available in the current shell environment via `export` or prefixing the `docker-compose` command.
See [Starting Docker Compose](http://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#getting-started-local-deploying-spring-cloud-dataflow-docker-starting) for more information.

# Docker Compose - Runtime

```mermaid
graph TD;
    A{Low Resources?} --> |Yes| B(Increase Docker Resources)
    A --> |No| C{Exceptions in app logs?}
	C --> |Yes| D(Resolve exceptions)
```

By default, the amount of memory allocated to Docker may be too low.
The command `docker stats` can provide useful information into resource usage.
If applications are failing to deploy due to resource constraints, increase resource allocations.
Consult the [Docker documentation](https://docs.docker.com/) for your platform.

As streams are deployed via Skipper, applications that are part of that stream will be launched as Java processes on the Skipper container.
See [Viewing Stream Logs](http://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#getting-started-local-deploying-spring-cloud-dataflow-docker-viewing-stream-logs) for more information on viewing log files.

# Cloud Foundry - Startup failures

```mermaid
graph TD;
    A(Verify Manifest) --> B(Verify environment variables);
    B --> C(Service instances running?)
    C --> |No| C
    C --> |Yes| D(SCDF and Skipper Running?)
    D --> |No| E(View logs and resolve errors)
```

# Cloud Foundry - Application failures

```mermaid
graph TD;
    A{Applications Started?} --> |No| B{Errors in SCDF logs?}
    A{Applications Started?} --> |No| D{Errors in Skipper logs?}
    A{Applications Started?} --> |No| F{Errors in app logs?}
    B --> C(Resolve)
	D --> C
	F --> C
```

When debugging deployment issues, raising deployer and Cloud Foundry releated log levels may be useful.
See [Deployment Logs](http://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#troubleshooting-deployment-logs) for more information.

# Kubernetes - Distributed Deployment Files

```mermaid
graph TD;
    A{All files applied including RBAC?} --> |No| A
    A --> |Yes| B(External Services Running)
	B --> |No| B
	B --> |Yes| C{Exceptions in SCDF pod logs?}
	B --> |Yes| D{Exceptions in Skipper pod logs?}
	B --> |Yes| E{Exceptions in app pod logs?}
	C --> |Yes| F(Resolve)
	D --> |Yes| F(Resolve)
	E --> |Yes| F(Resolve)
```

# Kubernetes - Helm Chart

```mermaid
graph TD;
    A{Chart found?} --> |No| B(helm repo update)
    A{Chart found?} --> |Yes| C{Expected Services Running?}
	C --> |No| C
	C --> |Yes| D{Exceptions in SCDF pod logs?}
	C --> |Yes| E{Exceptions in Skipper pod logs?}
	D --> |Yes| F(Resolve)
	E --> |Yes| F(Resolve)
```

# Kubernetes - General

```mermaid
graph TD;
    A{Errors in pod events table?} --> |Yes| B(Resolve)
    C{Exceptions in app pod logs?} --> |Yes| B
```

When describing a pod, the `events` table section provides useful information when debugging and can be invoked by the following:

`kubectl describe po/pod_name`

Application logs can be tailed to watch logs as they come in, for example:

`kubectl logs -f po/pod_name`
