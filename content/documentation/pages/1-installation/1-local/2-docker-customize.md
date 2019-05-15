---
path: 'installation/local/docker-customize'
title: 'Docker Compose Customization'
description: 'Customize the Docker Compose installation'
---

# Customizing Docker Compose

This section covers how to customize the Docker Compose installation by editing the `docker-compose.yml` file.

The Docker Compose file uses the Apache Kafka for the messaging middleware and Prometheus for monitoring.
If you want to use RabbitMQ or InfluxDB instead, this guide will show you the changes to make in the docker compose file.

Also, when doing development of custom applications you will need to enable the Docker container that is running the Data Flow Server to see your local file system. This guide will show you how to do that as well.

## Using RabbitMQ Instead of Kafka

You can use RabbitMQ rather than Kafka for communication. To do so:

1.  Delete the following configuration under the `services:` section:

          kafka:
            image: confluentinc/cp-kafka:5.2.1
            ...
          zookeeper:
            image: confluentinc/cp-zookeeper:5.2.1
            ....

    With the following:

          rabbitmq:
            image: rabbitmq:3.7
            expose:
              - "5672"

2.  In the `dataflow-server` services configuration block, add the
    following `environment` entry:

              - spring.cloud.dataflow.applicationProperties.stream.spring.rabbitmq.host=rabbitmq

3.  Replace the following:

            depends_on:
              - kafka

    With:

            depends_on:
              - rabbitmq

4.  Modify the `app-import` service definition `command` attribute to
    replace
    `https://bit.ly/Einstein-SR2-stream-applications-kafka-maven` with
    `https://bit.ly/Einstein-SR2-stream-applications-rabbit-maven`.

## Using InfluxDB Instead of Prometheus

You can use InfluxDB rather than Prometheus for monitoring time-series
database. To do so:

1.  Replace the following configuration under the `services` section:

          prometheus:
            image: springcloud/spring-cloud-dataflow-prometheus-local:${DATAFLOW_VERSION:?DATAFLOW_VERSION is not set! Use 'export DATAFLOW_VERSION=local-server-image-tag'}
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

    With the following:

          influxdb:
            image: influxdb:1.7.4
            container_name: 'influxdb'
            ports:
              - '8086:8086'

2.  In the `dataflow-server` services configuration block, replace the
    following `environment` entries:

              - spring.cloud.dataflow.applicationProperties.stream.management.metrics.export.prometheus.enabled=true
              - spring.cloud.dataflow.applicationProperties.stream.spring.cloud.streamapp.security.enabled=false
              - spring.cloud.dataflow.applicationProperties.stream.management.endpoints.web.exposure.include=prometheus,info,health

    With the following:

              - spring.cloud.dataflow.applicationProperties.stream.management.metrics.export.influx.enabled=true
              - spring.cloud.dataflow.applicationProperties.stream.management.metrics.export.influx.db=myinfluxdb
              - spring.cloud.dataflow.applicationProperties.stream.management.metrics.export.influx.uri=http://influxdb:8086

3.  Modify the `grafana` service definition `image` attribute to replace
    `spring-cloud-dataflow-grafana-prometheus` with
    `spring-cloud-dataflow-grafana-influxdb`.

## Accessing the host file system

If you are developing custom applications on your local machine, you will need to register them with Data Flow.
Since Data Flow is running inside of a Docker container, so the Docker container needs to be configured to access to your local file system in order to resolve the registration reference.

You can enable local disk access from Docker container running the Data Flow Server by following these steps.

1.  Mount the source host folders to the `dataflow-server` container.

    For example, if the `my-app.jar` is in the `/thing1/thing2/apps`
    folder on your host machine, add the following `volumes` block to
    the `dataflow-server` service definition:

          dataflow-server:
            image: springcloud/spring-cloud-dataflow-server:${DATAFLOW_VERSION}
            container_name: dataflow-server
            ports:
              - "9393:9393"
            environment:
              - spring.cloud.dataflow.applicationProperties.stream.spring.cloud.stream.kafka.binder.brokers=kafka:9092
              - spring.cloud.dataflow.applicationProperties.stream.spring.cloud.stream.kafka.binder.zkNodes=zookeeper:2181
            volumes:
              - /foo/bar/apps:/root/apps

This configuration provides access to the directory `/foo/bar/apps` that contains your `my-app.jar` from within container’s `/root/apps/` folder.
See the [compose-file reference](https://docs.docker.com/compose/compose-file/compose-file-v2/) for further configuration details.

<!--TIP-->

**Volume Mounting**

The explicit volume mounting couples docker-compose to your host’s file system, limiting the portability to other machines and operating systems.
Unlike `docker`, `docker-compose` does not allow volume mounting from the command line (for example, no `-v` parameter).
Instead, you can define a placeholder environment variable (such as `HOST_APP_FOLDER`) in place of the hardcoded path by using `- ${HOST_APP_FOLDER}:/root/apps` and setting this variable before starting docker-compose.

<!--END_TIP-->

Once you mount the host folder, you can register the app starters (from `/root/apps`), with the SCDF
[Shell](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#shell)
or
[Dashboard](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#dashboard-apps)
by using the `file://` URI schema. The following example shows how to do
so:

    app register --type source --name my-app --uri file://root/apps/my-app-1.0.0.RELEASE.jar

[[tip]] | Metadata URIs]]
| You also need to use `--metadata-uri` if the metadata jar is available in the /root/apps folder.

To access the host’s local maven repository from within the `dataflow-server` container, you should mount the host maven local repository (defaults to `~/.m2` for OSX and Linux and `C:\Documents and Settings\{your-username}\.m2` for Windows) to a `dataflow-server` volume called `/root/.m2/`. For MacOS or Linux host
machines, this looks like the following:

      dataflow-server:
      .........
        volumes:
          - ~/.m2:/root/.m2

Now you can use the `maven://` URI schema and Maven coordinates to
resolve jars installed in the host’s maven repository, as the following
example shows:

    app register --type processor --name pose-estimation --uri maven://org.springframework.cloud.stream.app:pose-estimation-processor-rabbit:2.0.2.BUILD-SNAPSHOT --metadata-uri maven://org.springframework.cloud.stream.app:pose-estimation-processor-rabbit:jar:metadata:2.0.2.BUILD-SNAPSHOT

This approach lets you share jars that are built and installed on the
host machine (for example, by using `mvn clean install`) directly with
the dataflow-server container.

You can also pre-register the apps directly in the docker-compose. For
every pre-registered app starer, add an additional `wget` statement to
the `app-import` block configuration, as the following example shows:

      app-import:
        image: alpine:3.7
        command: >
          /bin/sh -c "
            ....
            wget -qO- 'https://dataflow-server:9393/apps/source/my-app' --post-data='uri=file:/root/apps/my-app.jar&metadata-uri=file:/root/apps/my-app-metadata.jar';
            echo 'My custom apps imported'"

See the [SCDF REST API](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#resources-registered-applications)
for further details.
