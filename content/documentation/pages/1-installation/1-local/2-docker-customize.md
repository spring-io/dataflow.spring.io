---
path: 'installation/local/docker-customize'
title: 'Docker Compose Customization'
description: 'Customize the Docker Compose installation'
---

# Customizing Docker Compose

This section covers how to customize the Docker Compose installation by editing the `docker-compose.yml` file.

The Docker Compose file uses Apache Kafka for the messaging middleware and MySQL as database.
If you want to use RabbitMQ or PostgreSQL instead or to enable Data Flow for monitoring, you can extend or update the docker-compose files to achieve it.

Also, when doing development of custom applications, you need to enable the Docker container that runs the Data Flow Server to see your local file system. This guide shows you how to do that as well.

## Monitoring with Prometheus and Grafana

Extend the default configuration in `docker-compose.yml` to enable the Stream and Task monitoring with Prometheus and Grafana. To do so, you need to download the additional `docker-compose-prometheus.yml` file:

```bash
wget https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/v%dataflow-version%/spring-cloud-dataflow-server/docker-compose-prometheus.yml
```

In the directory where you downloaded `docker-compose.yml` and `docker-compose-prometheus.yml` files, start the system, by running the following commands:

```bash
docker-compose -f ./docker-compose.yml -f ./docker-compose-prometheus.yml up
```

In addition to the basic services the extended configuration also starts `Prometheus`, `Prometheus-RSocket-Proxy` for service-discovery, and `Grafana` with pre-built Stream and Task dashboards.

## Monitoring with InfluxDB and Grafana

Extend the default configuration in `docker-compose.yml` to enable the Stream and Task monitoring with InfluxDB and Grafana. To do so, you need to download the additional `docker-compose-influxdb.yml` file:

```bash
wget https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/v%dataflow-version%/spring-cloud-dataflow-server/docker-compose-influxdb.yml
```

Then in the directory where you downloaded `docker-compose.yml` and `docker-compose-influxdb.yml`, start the system, by running the following commands:

```bash
docker-compose -f ./docker-compose.yml -f ./docker-compose-influxdb.yml up
```

In addition to the basic services the extension starts `InfluxDb` time-series database and `Grafana` with pre-built Stream and Task dashboards.

## Using PostgreSQL Instead of MySQL

You can use PostgreSQL rather than MySQL for both Spring Cloud Data Flow and SKipper. To do so you need to disable the default `mysql` service, add a new `postgres` service and override the Data Flow and Skipper configurations to use the postgres service instead of mysql.

To override the default `docker-compose.yml` configuration you need to download the additional `docker-compose-postgres.yml` file:

```bash
wget https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/v%dataflow-version%/spring-cloud-dataflow-server/docker-compose-postgres.yml
```

In the directory where you downloaded `docker-compose.yml` and `docker-compose-postgres.yml` files, start the system, by running the following commands:

```bash
docker-compose -f ./docker-compose.yml -f ./docker-compose-postgres.yml up
```

## Using RabbitMQ Instead of Kafka

You can use RabbitMQ rather than Kafka for communication. To do so you need to disable the default `kafka` and `zookeeper` services, add a new `rabbitmq` service and override the `dataflow-server`'s service binder configuration to RabbitMQ (e.g. `spring.cloud.dataflow.applicationProperties.stream.spring.rabbitmq.host=rabbitmq`). Finally override the `app-import` service to register the rabbit apps.

For convenience, we provide an out-of-the-box `docker-compose-rabbitmq.yml` file to help override the default `docker-compose.yml` from Kafka to RabbitMQ. You can download the `docker-compose-rabbitmq.yml` file:

```bash
wget https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/v%dataflow-version%/spring-cloud-dataflow-server/docker-compose-rabbitmq.yml
```

In the directory where you downloaded `docker-compose.yml` and `docker-compose-rabbitmq.yml` files, start the system, by running the following commands:

```bash
docker-compose -f ./docker-compose.yml -f ./docker-compose-rabbitmq.yml up
```

## Accessing the Host File System

If you develop custom applications on your local machine, you need to register them with Spring Cloud Data Flow.
Since Spring Cloud Data Flow runs inside of a Docker container, you need to configure the Docker container to access to your local file system to resolve the registration reference.

You can enable local disk access from Docker container by running the Spring Cloud Data Flow Server. To do so:

1. Mount the source host folders to the `dataflow-server` container. For example, if the `my-app.jar` is in the `/thing1/thing2/apps` folder on your host machine, add the following `volumes` block to the `dataflow-server` service definition:
   ```yaml
   dataflow-server:
     image: springcloud/spring-cloud-dataflow-server:${DATAFLOW_VERSION}
     container_name: dataflow-server
     ports:
       - '9393:9393'
     environment:
       - spring.cloud.dataflow.applicationProperties.stream.spring.cloud.stream.kafka.binder.brokers=kafka:9092
       - spring.cloud.dataflow.applicationProperties.stream.spring.cloud.stream.kafka.binder.zkNodes=zookeeper:2181
     volumes:
       - /thing1/thing2/apps:/root/apps
   ```

This configuration provides access to the `/thing1/thing2/apps` directory that contains your `my-app.jar` from within container’s `/root/apps/` folder. See the [compose-file reference](https://docs.docker.com/compose/compose-file/compose-file-v2/) for further configuration details.

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
