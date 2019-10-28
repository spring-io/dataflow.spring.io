---
path: 'installation/local/docker-customize'
title: 'Docker Compose Customization'
description: 'Customize the Docker Compose installation'
---

# Customizing Docker Compose

This section covers how to customize the Docker Compose installation by editing the `docker-compose.yml` file.

The Docker Compose file uses Apache Kafka for the messaging middleware and Prometheus for monitoring.
If you want to use RabbitMQ or InfluxDB instead, this guide shows you the changes to make in the docker compose file.

Also, when doing development of custom applications, you need to enable the Docker container that runs the Data Flow Server to see your local file system. This guide shows you how to do that as well.

## Using RabbitMQ Instead of Kafka

You can use RabbitMQ rather than Kafka for communication. To do so:

1. Delete the following configuration under the `services:` section:

   ```yaml
   kafka:
     image: confluentinc/cp-kafka:5.2.1
     ...
   zookeeper:
     image: confluentinc/cp-zookeeper:5.2.1
     ....
   ```

1. Insert the following:

   ```yaml
   rabbitmq:
     image: rabbitmq:3.7
     expose:
       - '5672'
   ```

1. In the `dataflow-server` services configuration block, add the
   following `environment` entry:

   ```yaml
   - spring.cloud.dataflow.applicationProperties.stream.spring.rabbitmq.host=rabbitmq
   ```

1. Delete the following:

   ```yaml
   depends_on:
     - kafka
   ```

1. Insert the following:

   ```yaml
   depends_on:
     - rabbitmq
   ```

1. Modify the `app-import` service definition `command` attribute to replace `https://dataflow.spring.io/kafka-maven-latest` with `https://dataflow.spring.io/rabbitmq-maven-latest`.

## Using InfluxDB Instead of Prometheus

You can use InfluxDB rather than Prometheus to monitor time-series database. To do so:

1. Delete the following configuration under the `services` section:

   ```yaml
   prometheus:
     image: springcloud/spring-cloud-dataflow-prometheus-local:${DATAFLOW_VERSION:?DATAFLOW_VERSION is not set! Use 'export DATAFLOW_VERSION=dataflow-version'}
     container_name: 'prometheus'
     volumes:
       - 'scdf-targets:/etc/prometheus/'
     ports:
       - '9090:9090'
     depends_on:
       - service-discovery

   service-discovery:
     image: springcloud/spring-cloud-dataflow-prometheus-service-discovery:0.0.3
     container_name: 'service-discovery'
     volumes:
       - 'scdf-targets:/tmp/scdf-targets/'
     expose:
       - '8181'
     ports:
       - '8181:8181'
     environment:
       - metrics.prometheus.target.refresh.cron=0/20 * * * * *
       - metrics.prometheus.target.discovery.url=http://localhost:9393/runtime/apps
       - metrics.prometheus.target.file.path=/tmp/targets.json
     depends_on:
       - dataflow-server
   ```

1. Insert the following:

   ```yaml
   influxdb:
     image: influxdb:1.7.4
     container_name: 'influxdb'
     ports:
       - '8086:8086'
   ```

1. In the `dataflow-server` services configuration block, delete the following `environment` entries:

   ```yaml
   - spring.cloud.dataflow.applicationProperties.stream.management.metrics.export.prometheus.enabled=true
   - spring.cloud.dataflow.applicationProperties.stream.spring.cloud.streamapp.security.enabled=false
   - spring.cloud.dataflow.applicationProperties.stream.management.endpoints.web.exposure.include=prometheus,info,health
   ```

1. Insert the following:

   ```yaml
   - spring.cloud.dataflow.applicationProperties.stream.management.metrics.export.influx.enabled=true
   - spring.cloud.dataflow.applicationProperties.stream.management.metrics.export.influx.db=myinfluxdb
   - spring.cloud.dataflow.applicationProperties.stream.management.metrics.export.influx.uri=http://influxdb:8086
   ```

1. Modify the `grafana` service definition `image` attribute to replace `spring-cloud-dataflow-grafana-prometheus` with `spring-cloud-dataflow-grafana-influxdb`.

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
