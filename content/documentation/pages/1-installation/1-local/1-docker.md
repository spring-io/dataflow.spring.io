---
path: 'installation/local/docker'
title: 'Docker Compose'
description: 'Installation using Docker Compose'
---

# Installing by Using Docker Compose

Spring Cloud Data Flow provides a Docker Compose file to let you quickly bring up Spring Cloud Data Flow, Skipper, MySQL and Apache Kafka.
The additional [customization](%currentPath%/installation/local/docker-customize) guides help to extend the basic configuration, showing how to switch the binder to RabbitMQ, use different database, enable monitoring more.

[[note | ]]
| It is recommended to upgrade to the [latest](https://docs.docker.com/compose/install/) `docker` and `docker-compose` versions. This guide is tested with Docker Engine: `19.03.5` and docker-compose: `1.25.2`.

[[note | ]]
| Give you Docker daemon at least `8 GB` of memory. On Windows or Mac you can use the Docker Desktop's `Preferences/Resource/Advanced` menu to set the Memory.

For the impatient, here is a quick start, single-line command:

<!--TABS-->

<!--Linux / OSX-->

```bash
wget https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-server/docker-compose.yml; \
DATAFLOW_VERSION=%dataflow-version% SKIPPER_VERSION=%skipper-version% \
docker-compose up
```

<!--Windows (Command Prompt)-->

```bash
curl https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/spring-cloud-dataflow-server/docker-compose.yml -o docker-compose.yml & set DATAFLOW_VERSION=%dataflow-version%& set SKIPPER_VERSION=%skipper-version%& docker-compose up
```

<!--END_TABS-->

Detailed instructions of how to configure and start Spring Cloud Data FLow using Docker Compose are provided below.

## Downloading the Docker Compose File

[Click here](https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose.yml) to get the installation Docker Compose file or use the [wget](https://www.gnu.org/software/wget/manual/wget.html) or [curl](https://curl.haxx.se/) tools to download it:

<!--TABS-->

<!--wget-->

```bash
wget https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose.yml
```

<!--curl-->

```bash
curl https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose.yml -o docker-compose.yml
```

<!--END_TABS-->

[[tip |]]
| [Docker Compose Customization](%currentPath%/installation/local/docker-customize) guides provide additional files that can be combined with the basic docker-compose.yml to extend or alter its configuration.

## Starting Docker Compose

From within the `docker-compose.yml` directory run:

<!--TABS-->

<!--Linux / OSX-->

```bash
export DATAFLOW_VERSION=%dataflow-version%
export SKIPPER_VERSION=%skipper-version%
docker-compose up
```

<!--Windows (Command prompt)-->

```bash
set DATAFLOW_VERSION=%dataflow-version%
set SKIPPER_VERSION=%skipper-version%
docker-compose up
```

<!--Windows (PowerShell) -->

```powershell
$Env:DATAFLOW_VERSION="%dataflow-version%"
$Env:SKIPPER_VERSION="%skipper-version%"
docker-compose up
```

<!--END_TABS-->

[[tip]]
| By default, Docker Compose uses the locally available images. Run `docker-compose pull` prior to `docker-compose up` to ensure the latest image versions are downloaded.

once the emitting of log messages on the command prompt stop, open the Spring Cloud Data Flow [Dashboard](%currentPath%/concepts/tooling/#dashboard) at [http://localhost:9393/dashboard](http://localhost:9393/dashboard) or use the Shell as explained [below](%currentPath%/installation/local/docker/#shell).

The following environment variables can be used to configure the `docker-compose.yml`:

| Variable name      | Default value                                 | Description                                                                                                                                                                                                         |
| ------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATAFLOW_VERSION` | (required)                                    | Data Flow Server version to install. E.g. `2.4.0.RELEASE` or `%dataflow-version%` for the latest version.                                                                                                           |
| `SKIPPER_VERSION`  | (required)                                    | Skipper Server version to install. E.g. `2.3.0.RELEASE` or `%skipper-version%` for the latest Skipper version.                                                                                                      |
| `STREAM_APPS_URI`  | https://dataflow.spring.io/kafka-maven-latest | pre-registered Stream applications. Find [here](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#_spring_cloud_stream_app_starters) the available Stream Application Starters links. |
| `TASK_APPS_URI`    | https://dataflow.spring.io/task-maven-latest  | pre-registered Task applications. Find [here](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#_spring_cloud_task_app_starters) the available Task Application Starters links.       |

The docker-compose.yml configurations expose the following container ports to the host machine:

| Host ports  | Container ports | Description                                                                                                                                                                                                                                                             |
| ----------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 9393        | 9393            | The port that the Data Flow server listens on. You can use it to reach the Dashboard at http://localhost:9393/dashboard or the REST API at http://localhost:9393                                                                                                        |
| 7577        | 7577            | The port that the Skipper server listens on. You can use it to reach the Skipper REST api at http://localhost:7577/api                                                                                                                                                  |
| 20000-20105 | 20000-20105     | Skipper and Local Deployer are configured to use this port range for all deployed stream applications. That means you can reach the application's actuator endpoints from your host machine. The `server.port` deployment property can be used to override those ports. |

[[tip]]
| You can leverage the exposed application ports (e.g. `20000-20105`) in you stream applications to expose certain ports to the host machine. For example, the `http --server.port=20015 | log` stream definition would permit you use `curl` and POST HTTP messages to the `http` source directly from your host machine on the `20015` port.

## Stopping Spring Cloud Data Flow

1. Press `Ctrl+C` to shut down the docker compose process.

1. Run the following command to clean the used Docker containers:

```bash
docker-compose down
```

## Shell

For convenience and as an alternative to the Spring Cloud Data Flow Dashboard, you can use the [Spring Cloud Data Flow Shell](%currentPath%/concepts/tooling/#shell).
Later supports tab completion for commands and application configuration properties.

If you have started Spring Cloud Data Flow by using Docker Compose, the shell is also included in the `springcloud/spring-cloud-dataflow-server` Docker image.
To use it, open another console window and type the following:

```bash
docker exec -it dataflow-server java -jar shell.jar
```

If you have started the Data Flow server with `java -jar`, you can download and start the shell.
To download the Spring Cloud Data Flow Shell application, run the following command:

<!--TABS-->

<!--wget-->

```bash
wget https://repo.spring.io/%spring-maven-repo-type%/org/springframework/cloud/spring-cloud-dataflow-shell/%dataflow-version%/spring-cloud-dataflow-shell-%dataflow-version%.jar
```

<!--curl-->

```bash
curl https://repo.spring.io/%spring-maven-repo-type%/org/springframework/cloud/spring-cloud-dataflow-shell/%dataflow-version%/spring-cloud-dataflow-shell-%dataflow-version%.jar -o spring-cloud-dataflow-shell-%dataflow-version%.jar
```

<!--END_TABS-->

<!-- **TODO add link/create content for shell** -->

## Monitoring

The basic Data Flow docker-compose configuration does not enable the monitoring functionality for Stream and Task applications. Follow the [Monitoring with Prometheus and Grafana](%currentPath%/installation/local/docker-customize/#prometheus--grafana) or [Monitoring with InfluxDB and Grafana](%currentPath%/installation/local/docker-customize/#influxdb--grafana) customization guides to learn how to enable and configure the monitoring for Spring Cloud Data Flow.

To learn more about the monitoring experience in Spring Cloud Data Flow with Prometheus and InfluxDB, see the [Stream Monitoring](%currentPath%/feature-guides/streams/monitoring#local) feature guide.

## Debugging

The [Debug Data Flow Server](%currentPath%/installation/local/docker-customize/#debug-data-flow-server) guide, shows how extend the docker compose configuration to enables remote Data Flow Server debugging with your IDE such as IntelliJ or Eclipse.
