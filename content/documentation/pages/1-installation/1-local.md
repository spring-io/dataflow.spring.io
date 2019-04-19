---
path: 'installation/local/'
title: 'Local Machine'
description: 'Install Data Flow on your local machine'
---

# Local installation

This section covers how to install Spring Cloud Data Flow on your Local machine.

## System Requirements

**Java:** Data Flow uses Java 8.

**Database:** The Data Flow Server and Skipper Server need to have an RDBMS installed.
By default, the servers use an embedded H2 database.
You can easily configure the servers to use external databases.
The supproted databases are H2, HSQLDB, MySQL, Oracle, Postgresql, DB2, and SqlServer.
The schemas are automatically created when each server starts.

**Messaging Middleware:** Deployed stream applications communicate via messaging middleware
product.
We provide prebuilt stream applications that use [RabbitMQ](https://www.rabbitmq.com) or
[Kafka](https://kafka.apache.org).
However, other [messaging middleware products](https://cloud.spring.io/spring-cloud-stream/#binder-implementations)
such as
[Kafka Streams](https://kafka.apache.org/documentation/streams/),
[Amazon Kinesis](https://aws.amazon.com/kinesis/),
[Google Pub/Sub](https://cloud.google.com/pubsub/docs/)
[Solace PubSub+](https://solace.com/software/)
and
[Azure Event Hubs](https://azure.microsoft.com/en-us/services/event-hubs/)
are supported.

## Install using Docker Compose

Spring Cloud Data Flow provides a Docker Compose file to let you quickly bring up Spring Cloud Data Flow, Skipper, Apache Kafka, Prometheus and pre-built dashboards for Grafana, instead of having to install them manually.
Alertnatively, you can follow the [manual installation steps](#manual-installation)

[[note | Upgrade to latest version of Docker ]]
| We recommended that you upgrade to the [latest version](https://docs.docker.com/compose/install/) of Docker before running the `docker-compose` command. We have tested using Docker Engine version `18.09.2`

The following sections describe how to get started with Docker Compose:

### Downloading the Docker Compose File

Before you do anything else, you need to download the Docker Compose
file. To do so:

1.  Download the Spring Cloud Data Flow Server Docker Compose file:

        $ wget https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%version%/spring-cloud-dataflow-server/docker-compose.yml

> **Note**

### Starting Docker Compose

To get started, you need to start Docker Compose. To do so:

1.  In the directory where you downloaded `docker-compose.yml`, start
    the system, as follows:

        $ export DATAFLOW_VERSION={local-server-image-tag}
        $ export SKIPPER_VERSION={skipper-version}
        $ docker-compose up

The `docker-compose.yml` file defines `DATAFLOW_VERSION` and
`SKIPPER_VERSION` variables, so that those values can
be easily changed. The preceding commands first set the
`DATAFLOW_VERSION`, `SKIPPER_VERSION` to use in the
environment. Then `docker-compose` is started.

You can also use a shorthand version that exposes only the
`DATAFLOW_VERSION`, `SKIPPER_VERSION` variables to
the `docker-compose` process (rather than setting it in the
environment), as follows:

    $ DATAFLOW_VERSION={local-server-image-tag} SKIPPER_VERSION={skipper-version} up

If you use Windows, environment variables are defined by using the `set`
command. To start the system on Windows, enter the following commands:

    C:\ set DATAFLOW_VERSION={local-server-image-tag}
    C:\ set SKIPPER_VERSION={skipper-version}
    C:\ docker-compose up

[[note]]
| By default, Docker Compose use locally available images. For example, when using the `latest` tag, run `docker-compose pull` prior to
| `docker-compose up` to ensure the latest image is downloaded.

[[note]]
| Some stream applications may open a port, for example `http --server.port=`. By default, a port range of `9000-9010` is exposed from the
| container to the host. If you would need to change this range, you can modify the `ports` block of the `dataflow-server` service in
| the`docker-compose.yml` file.

Spring Cloud Data Flow is ready for use once the `docker-compose`
command stops emitting log messages.

### Access Data Flow Dashboard

Now that docker compose is up, you can access the Spring Cloud Data Flow Dashboard.
In your browser, navigate to the [Spring Cloud Data Flow Dashboard URL](http://localhost:9393/dashboard).

[[note | Registration of pre-build applications]]
| By default, the latest GA releases of Stream and Task applications are imported automatically.

## Customizing Docker Compose

Out of the box, Spring Cloud Data Flow uses the H2 embedded database for storing state and Kafka for communication.
Perhaps you want to use MySQL instead, or use RabbitMQ for communication.
This section covers how to customize these components by editing the `docker-compose.yml` file.

### Using MySQL Rather than the H2 Embedded Database

You can use MySQL rather than the H2 embedded database. To do so:

1.  Add the following configuration under the `services` section:

          mysql:
            image: mysql:5.7.25
            environment:
              MYSQL_DATABASE: dataflow
              MYSQL_USER: root
              MYSQL_ROOT_PASSWORD: rootpw
            expose:
              - 3306

2.  Add the following entries to the `environment` block of the
    `dataflow-server` service definition:

              - spring.datasource.url=jdbc:mysql://mysql:3306/dataflow
              - spring.datasource.username=root
              - spring.datasource.password=rootpw
              - spring.datasource.driver-class-name=org.mariadb.jdbc.Driver

### Using RabbitMQ Instead of Kafka for Communication

You can use RabbitMQ rather than Kafka for communication. To do so:

1.  Replace the following configuration under the `services` section:

          kafka:
            image: wurstmeister/kafka:2.11-0.11.0.3
            expose:
              - "9092"
            environment:
              - KAFKA_ADVERTISED_PORT=9092
              - KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181
              - KAFKA_ADVERTISED_HOST_NAME=kafka
          zookeeper:
            image: wurstmeister/zookeeper
            expose:
              - "2181"

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

### Enabling App Starters from the Host

You can enable `app starters` registration directly from the host
machine. To do so:

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

This configuration provides access to the `my-app.jar` (and the other
files in the folder) from within container’s `/root/apps/` folder. See
the [compose-file
reference](https://docs.docker.com/compose/compose-file/compose-file-v2/)
for further configuration details.

> **Note**
>
> The explicit volume mounting couples docker-compose to your host’s
> file system, limiting the portability to other machines and operating
> systems. Unlike `docker`, `docker-compose` does not allow volume
> mounting from the command line (for example, no `-v` parameter).
> Instead, you can define a placeholder environment variable (such as
> `HOST_APP_FOLDER`) in place of the hardcoded path by using
> `- ${HOST_APP_FOLDER}:/root/apps` and setting this variable before
> starting docker-compose.

Once you mount the host folder, you can register the app starters (from
`/root/apps`), with the SCDF
[Shell](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#shell)
or
[Dashboard](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#dashboard-apps)
by using the `file://` URI schema. The following example shows how to do
so:

    dataflow:>app register --type source --name my-app --uri file://root/apps/my-app-1.0.0.RELEASE.jar

> **Note**
>
> You also need to use `--metadata-uri` if the metadata jar is available
> in the /root/apps.

To access the host’s local maven repository from within the
`dataflow-server` container, you should mount the host maven local
repository (defaults to `~/.m2` for OSX and Linux and
`C:\Documents and Settings\{your-username}\.m2` for Windows) to a
`dataflow-server` volume called `/root/.m2/`. For MacOS or Linux host
machines, this looks like the following:

      dataflow-server:
      .........
        volumes:
          - ~/.m2:/root/.m2

Now you can use the `maven://` URI schema and Maven coordinates to
resolve jars installed in the host’s maven repository, as the following
example shows:

    dataflow:>app register --type processor --name pose-estimation --uri maven://org.springframework.cloud.stream.app:pose-estimation-processor-rabbit:2.0.2.BUILD-SNAPSHOT --metadata-uri maven://org.springframework.cloud.stream.app:pose-estimation-processor-rabbit:jar:metadata:2.0.2.BUILD-SNAPSHOT

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

See the [SCDF REST
API](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#resources-registered-applications)
for further details.

### Using InfluxDB Instead of Prometheus for Monitoring

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

## Stopping Docker Compose

When you want to shut down Data Flow use the `docker-compose down` command.

1.  Open a new terminal window.

2.  Change directory to the directory in which you started (where the
    `docker-compose.yml` file is located).

3.  Run the following command:

        $ DATAFLOW_VERSION={local-server-image-tag} SKIPPER_VERSION={skipper-version} docker-compose down

[[note | Why set environment variables in the previous command?]]
| You need to specify the `DATAFLOW_VERSION` and the `SKIPPER_VERSION` because you are running the command in a separate terminal window. The `export` commands you used earlier set the variables for only that terminal window, so those values are not found in the new terminal window.
If all else fails, you can shut it down with Ctrl+C.

## Install manually

If Docker does not suit your needs, you can manually install the parts you need to run Spring Cloud Data Flow.

### Download server jars

1.  Download the Spring Cloud Data Flow Server by using the following
    command:

        wget https://repo.spring.io/{version-type-lowercase}/org/springframework/cloud/spring-cloud-dataflow-server/{project-version}/spring-cloud-dataflow-server-{project-version}.jar

2.  Download [Skipper](https://cloud.spring.io/spring-cloud-skipper/) (because
    Data Flow delegates to Skipper for those features), by running the
    following commands:

        wget https://repo.spring.io/{skipper-version-type-lowercase}/org/springframework/cloud/spring-cloud-skipper-server/{skipper-version}/spring-cloud-skipper-server-{skipper-version}.jar

        wget https://repo.spring.io/{skipper-version-type-lowercase}/org/springframework/cloud/spring-cloud-skipper-shell/{skipper-version}/spring-cloud-skipper-shell-{skipper-version}.jar

> **Important**
>
> These instructions require that RabbitMQ be running on the same
> machine as Skipper and the Spring Cloud Data Flow server and shell.

### Start server jars

1.  Start Skipper (required unless the Stream features are disabled and
    the Spring Cloud Data Flow runs in Task mode only). To do so, in the
    directory where you downloaded Skipper, run the server by using
    `java -jar`, as follows:

        $ java -jar spring-cloud-skipper-server-{skipper-version}.jar

2.  Start the Data Flow Server

    In a different terminal window and in the directory where you
    downloaded Data Flow, run the server by using `java -jar`, as
    follows:

        $ java -jar spring-cloud-dataflow-server-{project-version}.jar

    If Skipper and the Data Flow server are not running on the same
    host, set the `spring.cloud.skipper.client.serverUri` configuration
    property to the location of Skipper, as shown in the following
    example

        $ java -jar spring-cloud-dataflow-server-{project-version}.jar --spring.cloud.skipper.client.serverUri=https://192.51.100.1:7577/api

If the Data Flow Server and shell are not running on the same host, you
can also point the shell to the Data Flow server URL by using the
`dataflow config server` command when in the shell’s interactive mode.

If the Data Flow Server and shell are not running on the same host,
point the shell to the Data Flow server URL, as the following example
shows:

    server-unknown:>dataflow config server https://198.51.100.0
    Successfully targeted https://198.51.100.0
    dataflow:>

Alternatively, you can pass in the `--dataflow.uri` command line option.
The shell’s `--help` command line option shows what is available.

> **Important**
>
> If you run Spring Cloud Data Flow Server behind a proxy server (such
> as [Zuul](https://github.com/Netflix/zuul)), you may also need to set
> the `server.use-forward-headers` property to `true`. An example that
> uses Zuul is available in the [Spring Cloud Data Flow Samples
> repository](https://github.com/spring-cloud/spring-cloud-dataflow-samples/tree/master/dataflow-zuul)
> on GitHub. Additional information is also available in the [Spring
> Boot Reference
> Guide](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#howto-use-tomcat-behind-a-proxy-server).

### Access Data Flow Dashboard

You can now navigate to Spring Cloud Data Flow Dashboard. In your browser, navigate to the [Spring Cloud Data
Flow Dashboard URL](http://localhost:9393/dashboard).

### Register pre-built applications

All the pre-built streaming applications:

- Are available as Apache Maven artifacts or Docker images.
- Use RabbitMQ or Apache Kafka.
- Support monitoring via Prometheus and InfluxDB.
- Contain metadata for application properties used in the UI and code completion in the shell.

Applications can be registered individually using the `app register` functionality or as a group using the `app import` functionality.
There are also `bit.ly` links that represent the group of pre-built applications for a specific release which is useful for getting started.

You can register applications using the UI or the shell.
Even though we are only using two pre-built applications, we will register the full set of pre-built applications.

Since local installation guide uses Kafka as the messaging middleware, register the Kafka version of the applications.

**TODO screen shot instead of shell command**

```
http://bit.ly/Einstein-SR2-stream-applications-kafka-maven

```

## Shell

For convenience and as an alternative to using the Spring Cloud Data Flow Dashboard, the Spring Cloud Data Flow Shell can be used as an alernative to the UI.
The shell supports tab completion for commands and also for stream/task application configuration properties.

If you have started Data Flow using Docker compose, the shell is is also included in the springcloud/spring-cloud-dataflow-server Docker image.
To use it, open another console window and type the following:

    $ docker exec -it dataflow-server java -jar shell.jar

If you have started the Data Flow server via `java -jar`, download and start the shell using the following commands:

1.  Download the Spring Cloud Data Flow Shell application by using the following command:

        wget https://repo.spring.io/{version-type-lowercase}/org/springframework/cloud/spring-cloud-dataflow-shell/{project-version}/spring-cloud-dataflow-shell-{project-version}.jar

2.  In another terminal window, launch the Data Flow Shell by running
    the following command:

        $ java -jar spring-cloud-dataflow-shell-{project-version}.jar

Using Spring Cloud Data Flow Shell is further described in
[Shell](#shell).

## Monitoring

By default, the Data Flow `docker-compose` configures Stream monitoring with Prometheus and pre-built dashboards for Grafana.
For further instructions about Data Flow monitoring, see [Streams Monitoring Prometheus](#streams-monitoring-local-prometheus).
If required follow the instruction below to customize the docker-compose to replace Prometheus with InfluxDB.
