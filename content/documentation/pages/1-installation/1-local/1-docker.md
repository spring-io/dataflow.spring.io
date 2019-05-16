---
path: 'installation/local/docker'
title: 'Docker Compose'
description: 'Installation using Docker Compose'
---

# Install using Docker Compose

Spring Cloud Data Flow provides a Docker Compose file to let you quickly bring up Spring Cloud Data Flow, Skipper, Apache Kafka, Prometheus and pre-built dashboards for Grafana, instead of having to install them manually.
Alternatively, you can follow the [manual installation steps](%currentPath%/installation/local/manual)

[[tip | Upgrade to latest version of Docker ]]
| We recommended that you upgrade to the [latest version](https://docs.docker.com/compose/install/) of Docker before running the `docker-compose` command. We have tested using Docker Engine version `18.09.2`

## Download the Docker Compose File

Download the Spring Cloud Data Flow Server Docker Compose file:

```bash
wget https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%dataflow-version%/spring-cloud-dataflow-server/docker-compose.yml
```

<!--NOTE-->

If wget is unavailable, you can use curl or another platform-specific utility. [Click here](https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/%dataflow-version%/spring-cloud-dataflow-server/docker-compose.yml) to download the docker-compose.yml file.

<!--END_NOTE-->

The Docker Compose file will start up the following:

1. Spring Cloud Data Flow Server
1. Spring Cloud Skipper Server
1. MySQL
1. Apache Kafka
1. Prometheus
1. Grafana

## Start Docker Compose

In the directory where you downloaded `docker-compose.yml`, start the system, as follows:

```bash
export DATAFLOW_VERSION=%local-server-image-tag%
export SKIPPER_VERSION=%skipper-version%
docker-compose up
```

If you use Windows, environment variables are defined by using the `set`
command. To start the system on Windows, enter the following commands:

    C:\ set DATAFLOW_VERSION=%local-server-image-tag%
    C:\ set SKIPPER_VERSION=%skipper-version%
    C:\ docker-compose up

Spring Cloud Data Flow is ready for use once the `docker-compose` command stops emitting log messages.

The `docker-compose.yml` file defines `DATAFLOW_VERSION` and `SKIPPER_VERSION` variables, so that those values can
be easily changed.
The preceding commands first set the `DATAFLOW_VERSION`, `SKIPPER_VERSION` to use and then `docker-compose` is started.

You can also use a shorthand version that exposes only the `DATAFLOW_VERSION`, `SKIPPER_VERSION` variables to the `docker-compose` process (rather than setting it in the environment), as follows:

```bash
DATAFLOW_VERSION=%local-server-image-tag% SKIPPER_VERSION=%skipper-version% docker-compose up
```

[[note]]
| By default, the latest GA releases of Stream and Task applications are imported automatically.

[[tip]]
| By default, Docker Compose uses locally available images. For example, when using the `latest` tag, run `docker-compose pull` prior to
| `docker-compose up` to ensure the latest image is downloaded.

[[tip]]
| Some stream applications may open a port, for example `http --server.port=`. By default, a port range of `9000-9010` is exposed from the
| container to the host. If you would need to change this range, you can modify the `ports` block of the `dataflow-server` service in
| the`docker-compose.yml` file.

Now that docker compose is up, you can access the Spring Cloud Data Flow Dashboard.
In your browser, navigate to the [Spring Cloud Data Flow Dashboard URL](http://localhost:9393/dashboard).

## Stop Docker Compose

When you want to shut down Data Flow use the `docker-compose down` command.

1. Open a new terminal window.

1. Change directory to the directory in which you started (where the
   `docker-compose.yml` file is located).

1. Run the following command:

```bash
DATAFLOW_VERSION=%local-server-image-tag% SKIPPER_VERSION=%skipper-version% docker-compose down
```

<!--NOTE-->

You need to specify the `DATAFLOW_VERSION` and the `SKIPPER_VERSION` environment variables if you are running the command in a separate terminal window from which you started Docker Compose. The `export` commands you used earlier set the variables for only that terminal window, so those values are not found in the new terminal window.

<!--END_NOTE-->

If all else fails, you can shut down Docker Compose using `Ctrl+C`.

## Shell

For convenience and as an alternative to using the Spring Cloud Data Flow Dashboard, the Spring Cloud Data Flow Shell can be used as an alternative to the UI.
The shell supports tab completion for commands and also for stream/task application configuration properties.

If you have started Data Flow using Docker compose, the shell is is also included in the springcloud/spring-cloud-dataflow-server Docker image.
To use it, open another console window and type the following:

```bash
docker exec -it dataflow-server java -jar shell.jar
```

If you have started the Data Flow server via `java -jar`, download and start the shell using the following commands:

Download the Spring Cloud Data Flow Shell application by using the following command:

```bash
wget https://repo.spring.io/{version-type-lowercase}/org/springframework/cloud/spring-cloud-dataflow-shell/{%dataflow-version%}/spring-cloud-dataflow-shell-{%dataflow-version%}.jar
```

<!-- **TODO add link/create content for shell** -->

## Monitoring

By default, the Data Flow `docker-compose` configures Stream monitoring with Prometheus and pre-built dashboards for Grafana.
See the section [Using InfluxDB instead of Prometheus](%currentPath%/installation/local/docker-customize/#using-influxdb-instead-of-prometheus-for-monitoring) to how to perform an InfluxDB based installation.

To further learn more about the monitoring experience in SCDF with Prometheus and InfluxDB, please refer to the [Stream Monitoring](%currentPath%/feature-guides/streams/monitoring#local) feature guide.
