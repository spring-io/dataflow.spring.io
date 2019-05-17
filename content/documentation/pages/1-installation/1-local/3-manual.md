---
path: 'installation/local/manual'
title: 'Manual'
description: 'Manual installation'
---

# Manual Installation

If Docker does not suit your needs, you can manually install the parts you need to run Spring Cloud Data Flow.

## Download server jars

1.  Download the Spring Cloud Data Flow Server and shell by using the following commands:

        wget https://repo.spring.io/%dataflow-version%/org/springframework/cloud/spring-cloud-dataflow-server/%dataflow-version%/spring-cloud-dataflow-server-%dataflow-version%.jar

        wget https://repo.spring.io/%dataflow-version%/org/springframework/cloud/spring-cloud-dataflow-shell/%dataflow-version%/spring-cloud-dataflow-shell-%dataflow-version%.jar

2.  Download [Skipper](https://cloud.spring.io/spring-cloud-skipper/) by running the
    following commands:

        wget https://repo.spring.io/%skipper-version%/org/springframework/cloud/spring-cloud-skipper-server/%skipper-version%/spring-cloud-skipper-server-%skipper-version%.jar

## Install messaging middleware

These instructions require that RabbitMQ be running on the same machine as Skipper, Spring Cloud Data Flow server and Shell.

To install and run RabbitMQ docker image:

```bash
docker run -d --hostname rabbitmq --name rabbitmq -p 15672:15672 rabbitmq:3.7.14-management
```

## Start server jars

1.  Start Skipper. To do so, in the
    directory where you downloaded Skipper, run the server by using
    `java -jar`, as follows:

        java -jar spring-cloud-skipper-server-%skipper-version%.jar

2.  Start the Data Flow Server

    In a different terminal window and in the directory where you
    downloaded Data Flow, run the server by using `java -jar`, as
    follows:

        java -jar spring-cloud-dataflow-server-%dataflow-version%.jar

    If Skipper and the Data Flow server are not running on the same
    host, set the `spring.cloud.skipper.client.serverUri` configuration
    property to the location of Skipper, as shown in the following
    example

        java -jar spring-cloud-dataflow-server-%dataflow-version%.jar --spring.cloud.skipper.client.serverUri=https://192.51.100.1:7577/api

3.  If you want to use the shell to use Data Flow, start it with the following command:

         java -jar spring-cloud-dataflow-shell-%dataflow-version%.jar

    If the Data Flow Server and shell are not running on the same host, you can also point the shell to the Data Flow server URL by using the `dataflow config server` command in Shell.

         server-unknown:>dataflow config server https://198.51.100.0
         Successfully targeted https://198.51.100.0

    Alternatively, you can pass in the `--dataflow.uri` command line option. The shell’s `--help` command line option shows what is available.

[[tip | Proxy Servers]]
| If you run Spring Cloud Data Flow Server behind a proxy server (such
| as [Zuul](https://github.com/Netflix/zuul)), you may also need to set
| the `server.use-forward-headers` property to `true`. An example that
| uses Zuul is available in the [Spring Cloud Data Flow Samples
| repository](https://github.com/spring-cloud/spring-cloud-dataflow-samples/tree/master/dataflow-zuul)
| on GitHub. Additional information is also available in the [Spring Boot Reference Guide](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#howto-use-tomcat-behind-a-proxy-server).

## Access Data Flow Dashboard

You can now navigate to Spring Cloud Data Flow Dashboard. In your browser, navigate to the [Spring Cloud Data
Flow Dashboard URL](http://localhost:9393/dashboard).

## Register prebuilt applications

<!-- **TODO feels like this can go in some generic section** -->

All the prebuilt streaming applications:

- Are available as Apache Maven artifacts or Docker images.
- Use RabbitMQ or Apache Kafka.
- Support monitoring via Prometheus and InfluxDB.
- Contain metadata for application properties used in the UI and code completion in the shell.

Applications can be registered individually using the `app register` command or in bulk using the `app import` command.
There are also bulk-registration links that represent the group of prebuilt applications for a specific release which is useful for getting started.

You can register applications using the UI or the shell.

Depending on if you are using RabbitMQ or Kafka, register the applications using the respective URLs.

- Kafka - https://dataflow.spring.io/kafka-maven-latest
- RabbitMQ - https://dataflow.spring.io/rabbitmq-maven-latest

From the Data Flow Shell, you can bulk import and register the applications. For example:

```bash
dataflow:>app import --uri https://dataflow.spring.io/kafka-maven-latest
```
