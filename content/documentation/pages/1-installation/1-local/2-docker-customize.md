---
path: 'installation/local/docker-customize'
title: 'Docker Compose Customization'
description: 'Customize the Docker Compose installation'
---

# Customizing Docker Compose

The Docker Compose [installation](%currentPath%/installation/local/docker) guide explains how to use the [docker-compose.yml](https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose.yml) for installing `Data Flow`, `Skipper`, `Kafka` and `MySQL`.
You can extend this basic configuration with the help of the provided extension docker-compose files.
For example if you want to use `RabbitMQ` or `PostgreSQL` instead or to enable Data Flow for `Monitoring`, you can combine some of the provided docker-compose extension files like this:

```bash
docker-compose -f ./docker-compose.yml \
               -f ./docker-compose-rabbitmq.yml \
               -f ./docker-compose-postgres.yml \
               -f ./docker-compose-influxdb.yml up
```

Following [section](#docker-compose-extensions) offers a detailed description of the provided extension docker-compose files.
Also, when doing development of custom applications, you need to enable the Docker container that runs the Data Flow Server to see your local file system. The [Accessing the Host File System](#accessing-the-host-file-system) chapter below shows how to do that as well.

## Docker Compose Extensions

Extension docker-compose files that can be applied on top of the `docker-compose.yml`. When more than one docker compose file is used, they are applied in the order of definition.

### Prometheus & Grafana

[docker-compose-prometheus.yml](https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose-prometheus.yml) - Extends the default configuration in `docker-compose.yml` to enable the Stream and Task monitoring with Prometheus and Grafana:

```bash
wget https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose-prometheus.yml
docker-compose -f ./docker-compose.yml -f ./docker-compose-prometheus.yml up
```

In addition to the basic services the extended configuration adds `Prometheus`, `Prometheus-RSocket-Proxy` for service-discovery, and `Grafana` with pre-built Stream and Task dashboards.

### InfluxDB & Grafana

[docker-compose-influxdb.yml](https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose-influxdb.yml) - Enables Stream and Task monitoring with `InfluxDB` and `Grafana` with pre-built Stream and Task dashboards:

```bash
wget https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose-influxdb.yml
docker-compose -f ./docker-compose.yml -f ./docker-compose-influxdb.yml up
```

### Postgres Instead of MySQL

[docker-compose-postgres.yml](https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose-postgres.yml) - Uses `PostgreSQL` instead of `MySQL` for both Spring Cloud Data Flow and SKipper. It disables the default `mysql` service, adds a new `postgres` service and overrides the Data Flow and Skipper configurations to use the postgres:

```bash
wget https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose-postgres.yml
docker-compose -f ./docker-compose.yml -f ./docker-compose-postgres.yml up
```

### RabbitMQ Instead of Kafka

[docker-compose-rabbitmq.yml](https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose-rabbitmq.yml) - Use RabbitMQ instead of Kafka as message broker. It disables the default `kafka` and `zookeeper` services, add a new `rabbitmq` service and override the `dataflow-server`'s service binder configuration to RabbitMQ (e.g. `spring.cloud.dataflow.applicationProperties.stream.spring.rabbitmq.host=rabbitmq`). Finally overrides the `app-import` service to register the rabbit apps:

```bash
wget https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose-rabbitmq.yml
docker-compose -f ./docker-compose.yml -f ./docker-compose-rabbitmq.yml up
```

### Multi-platform support

[docker-compose-cf.yml](https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose-cf.yml) Adds a remote `Cloud Foundry` account as a Data Flow runtime platform under the name `cf`. You will need to edit the `docker-compose-cf.yml` to add your CF API URL and access credentials.

```bash
wget https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose-rabbitmq.yml
wget https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose-cf.yml
docker-compose -f ./docker-compose.yml -f ./docker-compose-rabbitmq.yml -f ./docker-compose-cf.yml up
```

Because `Kafka` is not supported on CF you, also will need to switch to `Rabbit` using the `docker-compose-rabbitmq.yml`. The `docker-compose-cf.yml` expects a `rabbit` service configured in the target CF environment.

[docker-compose-k8s.yml](https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose-cf.yml) Adds a remote `Kubernetes` account as a Data Flow runtime platform under the name `k8s`. You will need to edit the `docker-compose-k8s.yml` to add your Kubernetes master URL and access credentials.

```bash
wget https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose-k8s.yml
STREAM_APPS_URI=https://dataflow.spring.io/kafka-docker-latest docker-compose -f ./docker-compose.yml -f ./docker-compose-k8s.yml up
```

The default maven based app starters can not be deployed in a Kubernetes environment. Switch to the docker based app distribution using the `STREAM_APPS_URI` variable.

The `docker-compose-k8s.yml` expects a `kafka-broker` service pre-deployed in the target Kubernetes environment. Follow the [choose a message broker](%currentPath%/installation/kubernetes/kubectl/#choose-a-message-broker) instructions to deploy kafka-broker service.

### Debug Data Flow Server

[docker-compose-debug-dataflow.yml](https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose-debug-dataflow.yml) enables remote debugging of the Data Flow Server. To enable the debugging run:

```bash
wget https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose-debug-dataflow.yml
docker-compose -f ./docker-compose.yml -f ./docker-compose-debug-dataflow.yml up
```

It makes the `dataflow-server` service wait for a debugger to connect on port `5005` to start debugging. Following snippet shows how to configure remote debug with IntelliJ. Set the `Host:` with the IP address of you local machine. Do not use `localhost` as it won't work inside the docker containers.

  <img src="../images/scdf-remote-debugging.png" alt="SCDF Remote Debug" width="100"/>

Often while debugging you will need to build new, local `spring-cloud-dataflow-server:latest` docker image. You can achieve this running the following commands from the DataFlow root directory:

```bash
./mvnw clean install -DskipTests
./mvnw docker:build -pl spring-cloud-dataflow-server
```

### Integration Testing

The self-documented [DataFlowIT.java](https://github.com/spring-cloud/spring-cloud-dataflow/blob/%github-tag%/spring-cloud-dataflow-server/src/test/java/org/springframework/cloud/dataflow/integration/test/DataFlowIT.java) class demonstrates how to reuse the same docker-compose files to build DataFlow integration and smoke tests.

## Accessing the Host File System

If you develop custom applications on your local machine, you need to register them with Spring Cloud Data Flow.
Since Spring Cloud Data Flow runs inside of a Docker container, you need to configure the Docker container to access to your local file system to resolve the registration reference. Also in order to deploy those custom applications, the Skipper Server in turn needs to access them from within its own Docker container using exactly the same path definitions configured in the Data Flow server configuration.

You can enable local disk access by mounting the host folders to the `dataflow-server` and `skipper-server` containers. For example, if the `my-app.jar` is in the `/thing1/thing2/apps` folder on your host machine, add the following `volumes` block to the `dataflow-server` and `skipper-server` service definitions:

```yaml
dataflow-server:
  image: springcloud/spring-cloud-dataflow-server:${DATAFLOW_VERSION}
  # ...
  volumes:
    - /thing1/thing2/apps:/root/apps
```

and mount **exactly** the same volume to the `skipper-server` service definition:

```yaml
skipper-server:
  image: springcloud/spring-cloud-skipper-server:${SKIPPER_VERSION:?SKIPPER_VERSION is not set!}
  # ...
  volumes:
    - /thing1/thing2/apps:/root/apps
```

This configuration provides access to the `/thing1/thing2/apps` directory that contains your `my-app.jar` from within `dataflow-server` and `skipper-server` containers' `/root/apps/` folder. See the [compose-file reference](https://docs.docker.com/compose/compose-file/compose-file-v2/) for further configuration details.

<!--TIP-->

**Volume Mounting**

The explicit volume mounting couples docker-compose to your host’s file system, limiting the portability to other machines and operating systems.
Unlike `docker`, `docker-compose` does not allow volume mounting from the command line (for example, there is no `-v` parameter).
Instead, you can define a placeholder environment variable (such as `HOST_APP_FOLDER`) in place of the hardcoded path by using `- ${HOST_APP_FOLDER}:/root/apps` and setting this variable before starting docker-compose.

<!--END_TIP-->

Once you mount the host folder, you can register the app starters (from `/root/apps`), with the Data Flow
[Shell](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#shell)
or
[Dashboard](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#dashboard-apps)
by using the `file://` URI schema. The following example shows how to do
so:

```bash
app register --type source --name my-app --uri file://root/apps/my-app-1.0.0.RELEASE.jar
```

<!--NOTE-->

**Metadata URIs**

You also need to use `--metadata-uri` if the metadata jar is available in the `/root/apps` folder.

<!--END_NOTE-->

**Maven Local Repository Mounting**

To access the host’s local maven repository from Spring Cloud Data Flow you must mount the host maven local repository to a `dataflow-server` and `skipper-server` volume called `/root/.m2/`. The Maven Local Repository location defaults to `~/.m2` for OSX and Linux and `C:\Documents and Settings\{your-username}\.m2` for Windows.

For MacOS or Linux host machines, this looks like the following listing:

```
dataflow-server:
.........
  volumes:
    - ~/.m2:/root/.m2

 skipper-server:
 ........
   volumes:
    - ~/.m2:/root/.m2
```

<!--NOTE-->

Dataflow Server requires access to the Maven Local repository in order to properly register applications to the Spring Cloud Data Flow server. The Skipper Server manages application runtime deployment directly and thereby also requires access to Maven Local in order to deploy applications created and installed on the host machine.

Mounting this volume allows you to develop applications and install them using `mvn install` while the server is still running and have immediate access to the applications

<!--END_NOTE-->

Now you can use the `maven://` URI schema and Maven coordinates to
resolve jars installed in the host’s maven repository, as the following
example shows:

```bash
app register --type processor --name pose-estimation --uri maven://org.springframework.cloud.stream.app:pose-estimation-processor-rabbit:2.0.2.BUILD-SNAPSHOT --metadata-uri maven://org.springframework.cloud.stream.app:pose-estimation-processor-rabbit:jar:metadata:2.0.2.BUILD-SNAPSHOT
```

This approach lets you use applications that are built and installed on the
host machine (for example, by using `mvn clean install`) directly with
the Spring Cloud Data Flow server.

You can also pre-register the apps directly in the docker-compose instance. For
every pre-registered app starer, add an additional `wget` statement to
the `app-import` block configuration, as the following example shows:

```
app-import:
  image: alpine:3.7
  command: >
    /bin/sh -c "
      ....
      wget -qO- 'https://dataflow-server:9393/apps/source/my-app' --post-data='uri=file:/root/apps/my-app.jar&metadata-uri=file:/root/apps/my-app-metadata.jar';
      echo 'My custom apps imported'"
```

See the [Data Flow REST API](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#resources-registered-applications)
for further details.
