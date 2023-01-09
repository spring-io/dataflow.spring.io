---
path: 'installation/local/docker'
title: 'Docker Compose'
description: 'Installation using Docker Compose'
---

# Installing by Using Docker Compose

Spring Cloud Data Flow provides a Docker Compose file to let you quickly bring up Spring Cloud Data Flow, Skipper, MariaDB, and Apache Kafka.
The additional [customization](%currentPath%/installation/local/docker-customize) guides help to extend the basic configuration, showing how to switch the binder to RabbitMQ, use a different database, enable monitoring, and more.

Also, when doing development of custom applications, you need to enable the Docker containers that run the Data Flow and the Skipper servers to see your local file system. The [Accessing the Host File System](#accessing-the-host-file-system) chapter shows how to do that.

<!--IMPORTANT-->

You should upgrade to the [latest](https://docs.docker.com/compose/install/) `docker` and `docker-compose` versions. This guide is tested with Docker Engine: `20.10.21` and docker-compose: `v2.12.2`.

<!--END_IMPORTANT-->

<!--IMPORTANT-->

Configure your Docker daemon with at least `8 GB` of memory. On Windows or Mac, you can use the Docker Desktop's `Preferences/Resource/Advanced` menu to set the amount of memory.

<!--END_IMPORTANT-->

## Downloading the Docker Compose Files

You will need to download `docker-compose.yml`, `docker-compose-<broker>.yml`, `docker-compose-<database>.yml` where `<broker>` is one of rabbitmq or kafka and `<database>` is one of postgres, mariadb or mysql.

<!--TABS-->

<!--Linux / OSX-->

```shell
wget -O docker-compose.yml https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/src/docker-compose/docker-compose.yml;
wget -O docker-compose-<broker>.yml https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/src/docker-compose/docker-compose-<broker>.yml;
wget -O docker-compose-<database>.yml https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/src/docker-compose/docker-compose-<database>.yml;
```

<!--Windows (Cmd)-->

```shell
curl https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/src/docker-compose/docker-compose.yml -o docker-compose.yml
curl https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/src/docker-compose/docker-compose-<broker>.yml -o docker-compose-<broker>.yml
curl https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/src/docker-compose/docker-compose-<database>.yml -o docker-compose-<database>.yml
```

<!--END_TABS-->

<!--TIP-->

The [Docker Compose Customization](%currentPath%/installation/local/docker-customize) guides provide additional files that you can combine with the basic docker-compose.yml to extend or alter its configuration.

<!--END_TIP-->

## Starting Docker Compose

From within the directory where `docker-compose.yml` and other files are downloaded, run:

<!--TABS-->

<!--Linux / OSX-->

```shell
export DATAFLOW_VERSION=%dataflow-version%
export SKIPPER_VERSION=%skipper-version%
docker-compose -f docker-compose.yml -f docker-compose-<broker>.yml -f docker-compose-<database>.yml up
```

<!--Windows (Cmd)-->

```shell
set DATAFLOW_VERSION=%dataflow-version%&
set SKIPPER_VERSION=%skipper-version%&
docker-compose -f docker-compose.yml -f docker-compose-<broker>.yml -f docker-compose-<database>.yml up
```

<!--Windows (PowerShell) -->

```powershell
$Env:DATAFLOW_VERSION="%dataflow-version%"
$Env:SKIPPER_VERSION="%skipper-version%"
docker-compose -f docker-compose.yml -f docker-compose-<broker>.yml -f docker-compose-<database>.yml up
```

<!--END_TABS-->

<!--TIP-->

By default, Docker Compose uses locally available images. Run `docker-compose pull` prior to `docker-compose up` to ensure the latest image versions are downloaded.

<!--END_TIP-->

Once the emitting of log messages on the command prompt stops, open the Spring Cloud Data Flow [Dashboard](%currentPath%/concepts/tooling/#dashboard) at [http://localhost:9393/dashboard](http://localhost:9393/dashboard) or use the Shell as explained [later](%currentPath%/installation/local/docker/#shell).

You can use the following environment variables to configure the `docker-compose.yml`:

| Variable name       | Default value                                                                                              | Description                                                                                                                                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATAFLOW_VERSION`  | `%dataflow-version%`                                                                                       | Data Flow Server version to install. Example: `2.4.0.RELEASE` or `%dataflow-version%` for the latest version.                                                                                                         |
| `SKIPPER_VERSION`   | `%skipper-version%`                                                                                        | Skipper Server version to install. Example: `2.3.0.RELEASE` or `%skipper-version%` for the latest Skipper version.                                                                                                    |
| `STREAM_APPS_URI`   | https://dataflow.spring.io/kafka-maven-latest (or https://dataflow.spring.io/kafka-docker-latest for DooD) | Pre-registered Stream applications. Find [here](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#_spring_cloud_stream_app_starters) the available Stream Application Starters links.   |
| `TASK_APPS_URI`     | https://dataflow.spring.io/task-maven-latest (or https://dataflow.spring.io/task-docker-latest for DooD)   | Pre-registered Task applications. You can find the available Task Application Starters links [here](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#_spring_cloud_task_app_starters). |
| `HOST_MOUNT_PATH`   | .                                                                                                          | Defines the host machine folder path on the mount. See [Accessing the Host File System](#accessing-the-host-file-system) for further details.                                                                         |
| `DOCKER_MOUNT_PATH` | `/home/cnb/scdf`                                                                                           | Defines the target (in-container) path on which to mount the host folder. See [Accessing the Host File System](#accessing-the-host-file-system) for further details.                                                  |

The docker-compose.yml configurations expose the following container ports to the host machine:

| Host ports  | Container ports | Description                                                                                                                                                                                                                                                             |
| ----------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 9393        | 9393            | The port on which the Data Flow server listens. You can use it to reach the Dashboard at http://localhost:9393/dashboard or the REST API at http://localhost:9393                                                                                                       |
| 7577        | 7577            | The port that the Skipper server listens on. You can use it to reach the Skipper REST API at http://localhost:7577/api                                                                                                                                                  |
| 20000-20105 | 20000-20105     | Skipper and Local Deployer are configured to use this port range for all deployed stream applications. That means you can reach the application's actuator endpoints from your host machine. You can use the `server.port` deployment property to override those ports. |

<!--TIP-->

You can use the exposed application ports (`20000-20105`) in your stream applications to expose certain ports to the host machine. For example, the `http --server.port=20015 | log` stream definition would let you use `curl` and POST HTTP messages to the `http` source directly from your host machine on the `20015` port.

<!--END_TIP-->

## Stopping Spring Cloud Data Flow

1. Press `Ctrl+C` to shut down the docker-compose process.

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

## Using the Shell

For convenience and as an alternative to the Spring Cloud Data Flow Dashboard, you can use the [Spring Cloud Data Flow Shell](%currentPath%/concepts/tooling/#shell).
The shell supports tab completion for commands and application configuration properties.

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

Launch the shell:

```shell
java -jar spring-cloud-dataflow-shell-%dataflow-version%.jar
```

## Accessing the Host File System

If you develop custom applications on your local machine, you need to register them with Spring Cloud Data Flow. Since Data Flow server runs inside a Docker container, you need to configure this container to access to your local file system to resolve the applications registration references. To deploy those custom applications, the Skipper Server also needs to access them from within its own Docker container.

By default, `docker-compose.yml` mounts the local host folder (the folder where the docker-compose process is started) to a `/home/cnb/scdf` folder inside both the `dataflow-server` and the `skipper` containers.

<!--IMPORTANT-->

It is vital that the Data Flow and the Skipper containers use **exactly the same** mount points. This allows application registration references in Data Flow to be resolved and deployed in Skipper by using the same references.

<!--END_IMPORTANT-->

The `HOST_MOUNT_PATH` and `DOCKER_MOUNT_PATH` environment variables (see the [configuration table](#starting-docker-compose)) let you customize the default host and container paths.

For example, if the `my-app-1.0.0.RELEASE.jar` is stored in the `/tmp/myapps/` folder on the host machine (`C:\Users\User\MyApps` on Windows), you can make it accessible to the `dataflow-server` and `skipper` containers by setting the `HOST_MOUNT_PATH`:

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

Then follow the [starting docker-compose](%currentPath%/installation/local/docker/#starting-docker-compose) instructions to start the cluster.

See the [compose-file reference](https://docs.docker.com/compose/compose-file/compose-file-v2/) for further configuration details.

Once the host folder is mounted, you can register the app starters (from `/home/cnb/scdf`) by using either the Data Flow [Shell](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#shell) or the [Dashboard](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#dashboard-apps). To do so, use the `file://` URI schema. The following example shows how to do so:

```bash
app register --type source --name my-app --uri file://home/cnb/scdf/my-app-1.0.0.RELEASE.jar
```

<!--TIP-->

You can use the optional `--metadata-uri` parameter if a metadata jar is available in the `/home/cnb/scdf` folder for the same application.

<!--END_TIP-->

You can also pre-register the apps directly, by modifying the `app-import-stream` and `app-import-task` configurations in the `docker-compose.yml` file. For every pre-registered app starer, add an additional `wget` statement to the `app-import-stream` block configuration, as the following example shows:

```yml
app-import-stream:
  image: springcloud/baseimage:1.0.0
  command: >
    /bin/sh -c "
      ....
      wget -qO- 'https://dataflow-server:9393/apps/source/my-app' --post-data='uri=file:/home/cnb/apps/my-app.jar&metadata-uri=file:/home/cnb/apps/my-app-metadata.jar"
```

See the [Data Flow REST API](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#resources-registered-applications) for further details.

### Maven Local Repository Mounting

You can develop applications and install them in the local Maven repository (using `mvn install`) while the Data Flow server is running and have immediate access to the newly built applications.

To do so, you must mount the host’s local maven repository to the `dataflow-server` and `skipper` containers using a volume called `/home/cnb/.m2/`.
The Maven Local repository location defaults to `~/.m2` for Linux and OSX and to `C:\Users\{your-username}\.m2` for Windows.

We can leverage the `HOST_MOUNT_PATH` and `DOCKER_MOUNT_PATH` variables to configure mount volumes, as follows:

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

Then follow the [starting docker-compose](%currentPath%/installation/local/docker/#starting-docker-compose) instructions to start the cluster.

Now you can use the `maven://` URI schema and Maven coordinates to resolve jars installed in the host’s maven repository, as follows:

```bash
app register --type processor --name pose-estimation --uri maven://org.springframework.cloud.stream.app:pose-estimation-processor-rabbit:2.0.2.BUILD-SNAPSHOT --metadata-uri maven://org.springframework.cloud.stream.app:pose-estimation-processor-rabbit:jar:metadata:2.0.2.BUILD-SNAPSHOT
```

This approach lets you use applications that are built and installed on the host machine (for example, by using `mvn clean install`) directly with the Spring Cloud Data Flow server.

## Monitoring

The basic Data Flow docker-compose configuration does not enable the monitoring functionality for Stream and Task applications. Follow the [Monitoring with Prometheus and Grafana](%currentPath%/installation/local/docker-customize/#prometheus--grafana) or [Monitoring with InfluxDB and Grafana](%currentPath%/installation/local/docker-customize/#influxdb--grafana) customization guides to learn how to enable and configure the monitoring for Spring Cloud Data Flow.

To learn more about the monitoring experience in Spring Cloud Data Flow with Prometheus and InfluxDB, see the [Stream Monitoring](%currentPath%/feature-guides/streams/monitoring#local) feature guide.

## Running Java 17 Applications

Currently Spring Cloud Data Flow defaults to Java 8 when running applications. If you wish to run Java 17 applications set the `BP_JVM_VERSION` to `-jdk17` as shown below:

```bash
export BP_JVM_VERSION=-jdk17
```

## Debugging

The [Debug Stream Applications](%currentPath%/installation/local/docker-customize/#debug-stream-applications) guide shows how to enable remote debugging for Stream Applications deployed by Data Flow.

The [Debug Data Flow Server](%currentPath%/installation/local/docker-customize/#debug-data-flow-server) guide shows how to extend the docker-compose configuration to enable remote Data Flow Server debugging with your IDE (such as IntelliJ or Eclipse).

The [Debug Skipper Server](%currentPath%/installation/local/docker-customize/#debug-skipper-server) guide shows how to extend the docker-compose configuration to enable remote Skipper Server debugging with your IDE (such as IntelliJ or Eclipse).

## Docker Stream & Task applications

Basic docker-compose installation supports only uber-jar Stream and Task applications.
As the Docker specification does not support container nesting, the Data Flow and Skipper servers are not able to run Docker applications from within their own Docker containers.

The [docker-compose-dood.yml](https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%github-tag%/src/docker-compose/docker-compose-dood.yml) extension uses the `Docker-out-of-Docker (DooD)` approach to let Skipper and Data Flow deploy Stream and Task Docker apps.

In this approach, containers created from within the Data Flow and the Skipper containers are sibling containers (spawned by the Docker daemon in the Host). There is no Docker daemon inside the server's containers and, thus, no container nesting.

The `docker-compose-dood.yml` extends `docker-compose.yml` by installing the Docker CLI to the Data Flow and Skipper servers containers and mounting the server's Docker sockets to the Host's socket:

<!--TABS-->

<!--Linux / OSX-->

```bash
export COMPOSE_PROJECT_NAME=scdf
docker-compose -f ./docker-compose.yml -f ./docker-compose-dood.yml up
```

<!--Windows-->

```bash
set COMPOSE_PROJECT_NAME=scdf
docker-compose -f .\docker-compose.yml -f .\docker-compose-dood.yml up
```

<!--END_TABS-->

- `COMPOSE_PROJECT_NAME` sets the docker-compose project name. It is later used for naming the network passed to the apps containers.

- You can use `STREAM_APPS_URI` and `TASK_APPS_URI` to register Docker-based Stream and Task apps.

<!--TIP-->

If docker-compose exits before the data pipelines are stopped, you should manually clean the containers: `docker stop $(docker ps -a -q); docker rm $(docker ps -a -q)`

Set the `DOCKER_DELETE_CONTAINER_ON_EXIT` environment variable to `false` to retain the stopped docker containers so that you can check their logs: `docker logs <container id>`

<!--END_TIP-->
