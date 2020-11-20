---
path: 'installation/local/docker'
title: 'Docker Compose'
description: 'Installation using Docker Compose'
---

# Installing by Using Docker Compose

Spring Cloud Data Flow provides a Docker Compose file to let you quickly bring up Spring Cloud Data Flow, Skipper, MySQL and Apache Kafka.
The additional [customization](%currentPath%/installation/local/docker-customize) guides help to extend the basic configuration, showing how to switch the binder to RabbitMQ, use different database, enable monitoring more.

Also, when doing development of custom applications, you need to enable the Docker containers that run the Data Flow and the Skipper servers to see your local file system. The [Accessing the Host File System](#accessing-the-host-file-system) chapter below shows how to do that.

<!--IMPORTANT-->

It is recommended to upgrade to the [latest](https://docs.docker.com/compose/install/) `docker` and `docker-compose` versions. This guide is tested with Docker Engine: `19.03.5` and docker-compose: `1.25.2`.

<!--END_IMPORTANT-->

<!--IMPORTANT-->

Configure your Docker daemon with at least `8 GB` of memory! On Windows or Mac you can use the Docker Desktop's `Preferences/Resource/Advanced` menu to set the Memory.

<!--END_IMPORTANT-->

For the impatient, here is a quick start, single-line command:

<!--TABS-->

<!--Linux / OSX-->

```bash
wget -O docker-compose.yml https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose.yml; \
DATAFLOW_VERSION=%dataflow-version% SKIPPER_VERSION=%skipper-version% \
docker-compose up
```

<!--Windows (Cmd)-->

```bash
curl https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose.yml -o docker-compose.yml & set DATAFLOW_VERSION=%dataflow-version%& set SKIPPER_VERSION=%skipper-version%& docker-compose up
```

<!--END_TABS-->

Detailed instructions of how to configure and start Spring Cloud Data FLow using Docker Compose are provided below.

## Downloading the Docker Compose File

[Click here](https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose.yml) to get the installation Docker Compose file or use the [wget](https://www.gnu.org/software/wget/manual/wget.html) or [curl](https://curl.haxx.se/) tools to download it:

<!--TABS-->

<!--wget-->

```bash
wget -O docker-compose.yml https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose.yml
```

<!--curl-->

```bash
curl https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose.yml -o docker-compose.yml
```

<!--END_TABS-->

<!--TIP-->

[Docker Compose Customization](%currentPath%/installation/local/docker-customize) guides provide additional files that can be combined with the basic docker-compose.yml to extend or alter its configuration.

<!--END_TIP-->

## Starting Docker Compose

From within the `docker-compose.yml` directory run:

<!--TABS-->

<!--Linux / OSX-->

```bash
export DATAFLOW_VERSION=%dataflow-version%
export SKIPPER_VERSION=%skipper-version%
docker-compose up
```

<!--Windows (Cmd)-->

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

<!--TIP-->

By default, Docker Compose uses the locally available images. Run `docker-compose pull` prior to `docker-compose up` to ensure the latest image versions are downloaded.

<!--END_TIP-->

once the emitting of log messages on the command prompt stop, open the Spring Cloud Data Flow [Dashboard](%currentPath%/concepts/tooling/#dashboard) at [http://localhost:9393/dashboard](http://localhost:9393/dashboard) or use the Shell as explained [below](%currentPath%/installation/local/docker/#shell).

The following environment variables can be used to configure the `docker-compose.yml`:

| Variable name       | Default value                                 | Description                                                                                                                                                                                                         |
| ------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATAFLOW_VERSION`  | (required)                                    | Data Flow Server version to install. E.g. `2.4.0.RELEASE` or `%dataflow-version%` for the latest version.                                                                                                           |
| `SKIPPER_VERSION`   | (required)                                    | Skipper Server version to install. E.g. `2.3.0.RELEASE` or `%skipper-version%` for the latest Skipper version.                                                                                                      |
| `STREAM_APPS_URI`   | https://dataflow.spring.io/kafka-maven-latest | Pre-registered Stream applications. Find [here](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#_spring_cloud_stream_app_starters) the available Stream Application Starters links. |
| `TASK_APPS_URI`     | https://dataflow.spring.io/task-maven-latest  | Pre-registered Task applications. Find [here](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#_spring_cloud_task_app_starters) the available Task Application Starters links.       |
| `HOST_MOUNT_PATH`   | .                                             | Defines the host machine folder path on be mount. See the [Accessing the Host File System](#accessing-the-host-file-system) for further details.                                                                    |
| `DOCKER_MOUNT_PATH` | `/root/scdf`                                  | Defines the target (in-container) path to mount the host folder to. See the [Accessing the Host File System](#accessing-the-host-file-system) for further details.                                                  |

The docker-compose.yml configurations expose the following container ports to the host machine:

| Host ports  | Container ports | Description                                                                                                                                                                                                                                                             |
| ----------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 9393        | 9393            | The port that the Data Flow server listens on. You can use it to reach the Dashboard at http://localhost:9393/dashboard or the REST API at http://localhost:9393                                                                                                        |
| 7577        | 7577            | The port that the Skipper server listens on. You can use it to reach the Skipper REST api at http://localhost:7577/api                                                                                                                                                  |
| 20000-20105 | 20000-20105     | Skipper and Local Deployer are configured to use this port range for all deployed stream applications. That means you can reach the application's actuator endpoints from your host machine. The `server.port` deployment property can be used to override those ports. |

<!--TIP-->

You can leverage the exposed application ports (e.g. `20000-20105`) in you stream applications to expose certain ports to the host machine. For example, the `http --server.port=20015 | log` stream definition would permit you use `curl` and POST HTTP messages to the `http` source directly from your host machine on the `20015` port.

<!--END_TIP-->

## Stopping Spring Cloud Data Flow

1. Press `Ctrl+C` to shut down the docker compose process.

1. Run the following command to clean the used Docker containers:

```bash
docker-compose down
```

If errors occur due to old or hanging containers, clean all containers:

<!--TABS-->

<!--Linux / OSX / Windows (PowerShell)-->

```bash
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
```

<!--Windows (Cmd)-->

```basic
FOR /f "tokens=*" %i IN ('docker ps -aq') DO docker rm %i -f
```

<!--END_TABS-->

## Shell

For convenience and as an alternative to the Spring Cloud Data Flow Dashboard, you can use the [Spring Cloud Data Flow Shell](%currentPath%/concepts/tooling/#shell).
The shell supports tab completion for commands and application configuration properties.

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
wget -O spring-cloud-dataflow-shell-%dataflow-version%.jar https://repo.spring.io/%spring-maven-repo-type%/org/springframework/cloud/spring-cloud-dataflow-shell/%dataflow-version%/spring-cloud-dataflow-shell-%dataflow-version%.jar
```

<!--curl-->

```bash
curl https://repo.spring.io/%spring-maven-repo-type%/org/springframework/cloud/spring-cloud-dataflow-shell/%dataflow-version%/spring-cloud-dataflow-shell-%dataflow-version%.jar -o spring-cloud-dataflow-shell-%dataflow-version%.jar
```

<!--END_TABS-->

## Accessing the Host File System

If you develop custom applications on your local machine, you need to register them with Spring Cloud Data Flow. Since Data Flow server run inside a Docker container, you need to configure this container to access to your local file system to resolve the applications registration references. In order to deploy those custom applications, the Skipper Server also needs to access them from within its own Docker container.

By default `docker-compose.yml` mounts the local host folder (e.g. folder where the docker-compose process is started) to a `/root/scdf` folder inside both the `dataflow-server` and the `skipper` containers.

<!--IMPORTANT-->

It is vital that the Data Flow and the Skipper containers use **exactly the same** mount points. This allows applications registration references in Data Flow to be resolved and deployed in Skipper using the same references.

<!--END_IMPORTANT-->

The `HOST_MOUNT_PATH` and `DOCKER_MOUNT_PATH` environment variables (see the [configuration table](#starting-docker-compose)) allow you to customize the default host and container paths.

For example, if the `my-app-1.0.0.RELEASE.jar` is stored in the `/tmp/myapps/` folder on the host machine (`C:\Users\User\MyApps` on Windows), you can make it accessible to the `dataflow-server` and `skipper` containers by setting the `HOST_MOUNT_PATH` like this:

<!--TABS-->

<!--Linux / OSX-->

```bash
export HOST_MOUNT_PATH=/tmp/myapps
```

<!--Windows (Cmd)-->

```bash
set HOST_MOUNT_PATH=C:\Users\User\MyApps
```

<!--Windows (PowerShell) -->

```bash
$Env:HOST_MOUNT_PATH="C:\Users\User\MyApps"
```

<!--END_TABS-->

and follow the [starting docker-compose](%currentPath%/installation/local/docker/#starting-docker-compose) instructions to start the cluster.

See the [compose-file reference](https://docs.docker.com/compose/compose-file/compose-file-v2/) for further configuration details.

Once the host folder is mounted, you can register the app starters (from `/root/scdf`), with the Data Flow [Shell](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#shell) or [Dashboard](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#dashboard-apps) by using the `file://` URI schema. The following example shows how to do so:

```bash
app register --type source --name my-app --uri file://root/scdf/my-app-1.0.0.RELEASE.jar
```

<!--TIP-->

Use the optional, `--metadata-uri` parameter if a metadata jar is available in the `/root/scdf` folder for the same application.

<!--END_TIP-->

You can also pre-register the apps directly, by modifying the `app-import` configuration in the docker-compose.yml. For every pre-registered app starer, add an additional `wget` statement to the `app-import` block configuration, as the following example shows:

```yml
app-import:
  image: alpine:3.7
  command: >
    /bin/sh -c "
      ....
      wget -qO- 'https://dataflow-server:9393/apps/source/my-app' --post-data='uri=file:/root/apps/my-app.jar&metadata-uri=file:/root/apps/my-app-metadata.jar"
```

See the [Data Flow REST API](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#resources-registered-applications) for further details.

### Maven Local Repository Mounting

You can develop applications and install them in the local Maven repository (using `mvn install`) while the Data Flow server is running and have immediate access to the new built applications.

To do this you must mount the host’s local maven repository to the `dataflow-server` and `skipper` containers using a volume called `/root/.m2/`.
The Maven Local repository location defaults to `~/.m2` for Linux and OSX and to `C:\Users\{your-username}\.m2` for Windows.

We can leverage the `HOST_MOUNT_PATH` and `DOCKER_MOUNT_PATH` variables to configure mount volumes like this:

<!--TABS-->

<!--Linux / OSX-->

```bash
export HOST_MOUNT_PATH=~/.m2
export DOCKER_MOUNT_PATH=/root/.m2/
```

<!--Windows (Cmd)-->

```bash
set HOST_MOUNT_PATH=%userprofile%\.m2
set DOCKER_MOUNT_PATH=/root/.m2/
```

<!--Windows (PowerShell) -->

```bash
$Env:HOST_MOUNT_PATH="~\.m2"
$Env:DOCKER_MOUNT_PATH="/root/.m2/"
```

<!--END_TABS-->

and follow the [starting docker-compose](%currentPath%/installation/local/docker/#starting-docker-compose) instructions to start the cluster.

Now you can use the `maven://` URI schema and Maven coordinates to resolve jars installed in the host’s maven repository, as the following example shows:

```bash
app register --type processor --name pose-estimation --uri maven://org.springframework.cloud.stream.app:pose-estimation-processor-rabbit:2.0.2.BUILD-SNAPSHOT --metadata-uri maven://org.springframework.cloud.stream.app:pose-estimation-processor-rabbit:jar:metadata:2.0.2.BUILD-SNAPSHOT
```

This approach lets you use applications that are built and installed on the host machine (for example, by using `mvn clean install`) directly with the Spring Cloud Data Flow server.

## Monitoring

The basic Data Flow docker-compose configuration does not enable the monitoring functionality for Stream and Task applications. Follow the [Monitoring with Prometheus and Grafana](%currentPath%/installation/local/docker-customize/#prometheus--grafana) or [Monitoring with InfluxDB and Grafana](%currentPath%/installation/local/docker-customize/#influxdb--grafana) customization guides to learn how to enable and configure the monitoring for Spring Cloud Data Flow.

To learn more about the monitoring experience in Spring Cloud Data Flow with Prometheus and InfluxDB, see the [Stream Monitoring](%currentPath%/feature-guides/streams/monitoring#local) feature guide.

## Debugging

The [Debug Stream Applications](%currentPath%/installation/local/docker-customize/#debug-stream-applications) guide, shows how to enables remote debugging for Stream Applications deployed by Data Flow.

The [Debug Data Flow Server](%currentPath%/installation/local/docker-customize/#debug-data-flow-server) guide, shows how extend the docker compose configuration to enables remote Data Flow Server debugging with your IDE such as IntelliJ or Eclipse.

The [Debug Skipper Server](%currentPath%/installation/local/docker-customize/#debug-skipper-server) guide, shows how extend the docker compose configuration to enables remote Skipper Server debugging with your IDE such as IntelliJ or Eclipse.

## Docker Stream & Task applications

Basic docker-compose installation supports only uber-jar Stream and/or Task applications.
As the Docker specification doesn't support container nesting, the Data Flow and Skipper servers are not able to run Docker applications from within their own Docker containers.

The [docker-compose-dood.yml](https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/spring-cloud-dataflow-server/docker-compose-dood.yml) extension, leverages the `Docker-out-of-Docker (DooD)` approach to allow Skipper and Data Flow to deploy Stream and Task docker apps.

In this approach, containers created from within the Data Flow and the Skipper containers are sibling containers (spawned by the Docker daemon in the Host). There is no Docker daemon inside the server's containers and thus no container nesting.

The `docker-compose-dood.yml` extends `docker-compose.yml` by installing the Docker CLI to the Data Flow and Skipper servers containers and mounting the server's docker sockets to the Host's socket:

<!--TABS-->

<!--Linux / OSX-->

```bash
export COMPOSE_PROJECT_NAME=scdf
docker-compose -f ./docker-compose.yml -f ./docker-compose-dood.yml
```

<!--Windows-->

```bash
set COMPOSE_PROJECT_NAME=scdf
docker-compose -f .\docker-compose.yml -f .\docker-compose-dood.yml up
```

<!--END_TABS-->

- The `COMPOSE_PROJECT_NAME` sets the docker-compose project name. Later is used for naming the network passed to the apps containers.

- The `STREAM_APPS_URI` and `TASK_APPS_URI` can be used to register docker based Stream and Task apps.

<!--TIP-->

If docker-compose exit before the data pipelines are stopped then the containers should be cleaned manually: `docker stop $(docker ps -a -q); docker rm $(docker ps -a -q)`

Set the `DOCKER_DELETE_CONTAINER_ON_EXIT` environment variable to `false` to retain the stopped docker containers so you can check their logs: `docker logs <container id>`

<!--END_TIP-->
