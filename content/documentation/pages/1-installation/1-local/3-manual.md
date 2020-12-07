---
path: 'installation/local/manual'
title: 'Manual'
description: 'Manual installation'
---

# Manual Installation

If Docker does not suit your needs, you can manually install the parts you need to run Spring Cloud Data Flow.

<!--NOTE-->

If you want to use Spring Cloud Data Flow only for batch and task processing (that is, not for processing streams), see the [Batch-only Mode recipe](%currentPath%/recipes/batch/batch-only-mode).

<!--END_NOTE-->

## Downloading Server Jars

To begin, you need to download the server jars:

1. Download the [Spring Cloud Data Flow Server](https://spring.io/projects/spring-cloud-dataflow) and shell by using the following commands:

   ```bash
   wget https://repo.spring.io/%spring-maven-repo-type%/org/springframework/cloud/spring-cloud-dataflow-server/%dataflow-version%/spring-cloud-dataflow-server-%dataflow-version%.jar
   wget https://repo.spring.io/%spring-maven-repo-type%/org/springframework/cloud/spring-cloud-dataflow-shell/%dataflow-version%/spring-cloud-dataflow-shell-%dataflow-version%.jar
   ```

2. Download [Skipper](https://cloud.spring.io/spring-cloud-skipper/) by running the following command:
   ```bash
   wget https://repo.spring.io/%spring-maven-repo-type%/org/springframework/cloud/spring-cloud-skipper-server/%skipper-version%/spring-cloud-skipper-server-%skipper-version%.jar
   ```

<!--NOTE-->

If you are interested in trying out the latest `BUILD-SNAPSHOT` (that is, the snapshot build from the `master` branch) of SCDF and Skipper's upstream versions, you can use the following `wget` commands:

```bash
wget https://repo.spring.io/%spring-maven-repo-type%/org/springframework/cloud/spring-cloud-dataflow-server/%dataflow-version%/spring-cloud-dataflow-server-%dataflow-version%.jar
wget https://repo.spring.io/%spring-maven-repo-type%/org/springframework/cloud/spring-cloud-dataflow-shell/%dataflow-version%/spring-cloud-dataflow-shell-%dataflow-version%.jar
```

```bash
wget https://repo.spring.io/%spring-maven-repo-type%/org/springframework/cloud/spring-cloud-skipper-server/%skipper-version%/spring-cloud-skipper-server-%skipper-version%.jar
```

<!--END_NOTE-->

## Install Messaging Middleware

These instructions require that RabbitMQ be running on the same machine as Skipper, Spring Cloud Data Flow server, and Shell.

To install and run the RabbitMQ docker image, use the following command:

```bash
docker run -d --hostname rabbitmq --name rabbitmq -p 15672:15672 -p 5672:5672 rabbitmq:3.7.14-management
```

## Starting Server Jars

Now you need to start the applications that comprise the server:

1. Start Skipper. To do so, in the directory where you downloaded Skipper, run the server by using `java -jar`, as follows:

   ```bash
   java -jar spring-cloud-skipper-server-%skipper-version%.jar
   ```

1. Start the Data Flow Server. To do so, in a different terminal window and in the directory where you downloaded Data Flow, run the server by using `java -jar`, as follows:

   ```bash
   java -jar spring-cloud-dataflow-server-%dataflow-version%.jar
   ```

   If Skipper and the Data Flow server are not running on the same
   host, set the `spring.cloud.skipper.client.serverUri` configuration
   property to the location of Skipper, as shown in the following
   example:

   ```bash
   java -jar spring-cloud-dataflow-server-%dataflow-version%.jar --spring.cloud.skipper.client.serverUri=https://192.51.100.1:7577/api
   ```

1. If you want to use the Spring Cloud Data Flow shell, start it with the following command:

   ```bash
   java -jar spring-cloud-dataflow-shell-%dataflow-version%.jar
   ```

   If the Data Flow Server and shell are not running on the same host, you can also point the shell to the Data Flow server URL by using the `dataflow config server` command in Shell, as follows:

   ```bash
    server-unknown:>dataflow config server https://198.51.100.0
    Successfully targeted https://198.51.100.0
   ```

   Alternatively, you can pass in the `--dataflow.uri` command line option. The shell’s `--help` command line option shows what is available.

<!--TIP-->

**Proxy Servers**

If you run Spring Cloud Data Flow Server behind a proxy server (such
as [Zuul](https://github.com/Netflix/zuul)), you may also need to set
the `server.use-forward-headers` property to `true`. An example that
uses Zuul is available in the [Spring Cloud Data Flow Samples
repository](https://github.com/spring-cloud/spring-cloud-dataflow-samples/tree/master/dataflow-zuul)
on GitHub. Additional information is also available in the [Spring Boot Reference Guide](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#howto-use-tomcat-behind-a-proxy-server).

<!--END_TIP-->

## Accessing Data Flow Dashboard

You can now navigate to Spring Cloud Data Flow Dashboard. In your browser, navigate to the [Spring Cloud Data
Flow Dashboard URL](http://localhost:9393/dashboard).
