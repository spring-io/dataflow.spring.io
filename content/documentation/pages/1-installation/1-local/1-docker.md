---
path: 'installation/local/docker'
title: 'Docker Compose'
description: 'Installation using Docker Compose'
---

# Installing by Using Docker Compose

Spring Cloud Data Flow provides a Docker Compose file to let you quickly bring up Spring Cloud Data Flow, Skipper, and MySQL, Apache Kafka. Follow the [customizing](%currentPath%/installation/local/docker-customize) guide to switch to RabbitMQ or to a different database. Prometheus or InfluxDB, along with Grafana can be configured for monitoring the stream and task applications.

[[tip | Upgrade to latest version of Docker ]]
| We recommended that you upgrade to the [latest version](https://docs.docker.com/compose/install/) of Docker before running the `docker-compose` command. We have tested with Docker Engine version `18.09.2`.

## Downloading the Docker Compose File

To download the Spring Cloud Data Flow Server Docker Compose file, run the following command:

```bash
wget https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/v%dataflow-version%/spring-cloud-dataflow-server/docker-compose.yml
```

[[note]]
| If wget is unavailable, you can use curl or another platform-specific utility. [Click here](https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/v%dataflow-version%/spring-cloud-dataflow-server/docker-compose.yml) to download the docker-compose.yml file.

The Docker Compose file starts instances of the following products:

1. Spring Cloud Data Flow Server
1. Spring Cloud Skipper Server
1. MySQL
1. Apache Kafka

## Starting Docker Compose

In the directory where you downloaded `docker-compose.yml`, start the system, by running the following commands:

```bash
export DATAFLOW_VERSION=%dataflow-version%
export SKIPPER_VERSION=%skipper-version%
docker-compose up
```

If you use Windows, you can define environment variables by using the `set`
command. To start the system on Windows, enter the following commands:

    C:\ set DATAFLOW_VERSION=%dataflow-version%
    C:\ set SKIPPER_VERSION=%skipper-version%
    C:\ docker-compose up

Spring Cloud Data Flow is ready for use once the `docker-compose` command stops emitting log messages.

The `docker-compose.yml` file defines `DATAFLOW_VERSION` and `SKIPPER_VERSION` variables, so that you can easily change those values.
The preceding commands first set the `DATAFLOW_VERSION` and `SKIPPER_VERSION` to use and then start `docker-compose`.

You can also use a shorthand version that exposes only the `DATAFLOW_VERSION` and `SKIPPER_VERSION` variables to the `docker-compose` process (rather than setting it in the environment), as follows:

```bash
DATAFLOW_VERSION=%dataflow-version% SKIPPER_VERSION=%skipper-version% docker-compose up
```

[[note]]
| By default, the latest GA releases of Stream and Task applications are imported automatically.

[[tip]]
| By default, Docker Compose uses locally available images. For example, when using the `latest` tag, you can run `docker-compose pull` prior to `docker-compose up` to ensure the latest image is downloaded.

[[tip]]
| Some stream applications may open a port (for example, `http --server.port=`). By default, a port range of `9000-9010` is exposed from the container to the host. If you need to change this range, you can modify the `ports` block of the `dataflow-server` service in the`docker-compose.yml` file.

Now that docker compose is up, you can access the Spring Cloud Data Flow Dashboard.
In your browser, navigate to the [Spring Cloud Data Flow Dashboard URL](http://localhost:9393/dashboard).

## Stopping Spring Cloud Data Flow

When you want to shut down Spring Cloud Data Flow, you can use the `docker-compose down` command. To do so:

1. Open a new terminal window.

1. Change directory to the directory in which you started (where the
   `docker-compose.yml` file is located).

1. Run the following command:

```bash
DATAFLOW_VERSION=%dataflow-version% SKIPPER_VERSION=%skipper-version% docker-compose down
```

[[note]]
| You need to specify the `DATAFLOW_VERSION` and the `SKIPPER_VERSION` environment variables if you are running the command in a separate terminal window from which you started Docker Compose. The `export` commands you used earlier set the variables for only that terminal window, so those values are not found in the new terminal window.

If all else fails, you can shut down Docker Compose by pressing `Ctrl+C`.

## Shell

For convenience and as an alternative to using the Spring Cloud Data Flow Dashboard, you can use the Spring Cloud Data Flow Shell as an alternative to the UI.
The shell supports tab completion for commands and stream and task application configuration properties.

If you have started Spring Cloud Data Flow by using Docker Compose, the shell is also included in the `springcloud/spring-cloud-dataflow-server` Docker image.
To use it, open another console window and type the following:

```bash
docker exec -it dataflow-server java -jar shell.jar
```

If you have started the Data Flow server with `java -jar`, you can download and start the shell.
To download the Spring Cloud Data Flow Shell application, run the following command:

```bash
wget https://repo.spring.io/release/org/springframework/cloud/spring-cloud-dataflow-shell/%dataflow-version%/spring-cloud-dataflow-shell-%dataflow-version%.jar
```

<!-- **TODO add link/create content for shell** -->

## Monitoring

By default, the Data Flow docker-compose does not enable the monitoring functionality for Stream and Task applications. To enable that, follow the [Monitoring with Prometheus and Grafana](%currentPath%/installation/local/docker-customize/#monitoring-with-prometheus-and-grafana) or [Monitoring with InfluxDB and Grafana](%currentPath%/installation/local/docker-customize/#monitoring-with-influxdb-and-grafana) sections for how to configure Prometheus or InfluxDB based monitoring set up for Spring Cloud Data Flow.

To learn more about the monitoring experience in Spring Cloud Data Flow with Prometheus and InfluxDB, see the [Stream Monitoring](%currentPath%/feature-guides/streams/monitoring#local) feature guide.
