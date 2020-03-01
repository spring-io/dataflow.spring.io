---
path: 'installation/cloudfoundry/cf-cli'
title: 'Cloud Foundry CLI'
description: 'Install using the Cloud Foundry CLI'
---

# Cloud Foundry Installation

This section covers how to install Spring Cloud Data Flow on Cloud Foundry.

## Backing Services

Spring Cloud Data Flow requires a few data services to perform streaming
and task or batch processing. You have two options when you provision
Spring Cloud Data Flow and related services on Cloud Foundry:

- The simplest (and automated) method is to use the [Spring Cloud Data
  Flow for PCF tile](https://network.pivotal.io/products/p-dataflow).
  This is an opinionated tile for Pivotal Cloud Foundry. It
  automatically provisions the server and the required data services,
  thus simplifying the overall getting-started experience. You can
  read more about the installation
  [here](https://docs.pivotal.io/scdf/).

- Alternatively, you can provision all the components manually.

The following section goes into the specifics of how to install manually.

### Provisioning a Rabbit Service Instance

RabbitMQ is used as a messaging middleware between streaming apps and is available as a PCF tile.

You can use `cf marketplace` to discover which plans are available to you, depending on the details of your Cloud Foundry setup.
For example, you can use [Pivotal Web Services](https://run.pivotal.io/), as the following example shows:

```bash
cf create-service cloudamqp lemur rabbit
```

### Provision a PostgreSQL Service Instance

An RDBMS is used to persist Data Flow state, such as stream and task definitions, deployments, and executions.

You can use `cf marketplace` to discover which plans are available to you, depending on the details of your Cloud Foundry setup. For example, you can use [Pivotal Web Services](https://run.pivotal.io/), as the following example shows:

```bash
cf create-service elephantsql panda my_postgres
```

<!--TIP-->

**Database Connection Limits**

If you intend to create and run batch-jobs as Task pipelines in SCDF,
you must ensure that the underlying database instance includes enough
connections capacity so that the batch-jobs, Task, and SCDF can
concurrently connect to the same database instance without running
into connection limits. This usually means you can't use any free plans.

<!--END_TIP-->

## Manifest based installation on Cloud Foundry

To install Cloud Foundry:

1.  Download the Data Flow server and shell applications, by running the
    following example commands:

    ```bash
    wget https://repo.spring.io/%spring-maven-repo-type%/org/springframework/cloud/spring-cloud-dataflow-server/%dataflow-version%/spring-cloud-dataflow-server-%dataflow-version%.jar
    wget https://repo.spring.io/%spring-maven-repo-type%/org/springframework/cloud/spring-cloud-dataflow-shell/%dataflow-version%/spring-cloud-dataflow-shell-%dataflow-version%.jar
    ```

2.  Download [Skipper](https://cloud.spring.io/spring-cloud-skipper/),
    to which Data Flow delegates stream lifecycle operations, such as
    deployment, upgrading and rolling back. To do so, use the following
    command:

    ```bash
    wget https://repo.spring.io/%spring-maven-repo-type%/org/springframework/cloud/spring-cloud-skipper-server/%skipper-version%/spring-cloud-skipper-server-%skipper-version%.jar
    ```

3.  Push Skipper to Cloud Foundry

    Once you have installed Cloud Foundry, you can push Skipper to
    Cloud Foundry. To do so, you need to create a manifest for Skipper.

    You will use the "default" deployment platform `deployment.services` setting in the `Skipper Server` configuration, as shown below, to configure Skipper to bind the RabbitMQ service to all deployed streaming applications. Note "rabbitmq" is the name of the service instance in this case.

    The following example shows a typical manifest for Skipper:

    ```yml
    ---
    applications:
      - name: skipper-server
        host: skipper-server
        memory: 1G
        disk_quota: 1G
        instances: 1
        timeout: 180
        buildpack: java_buildpack
        path: <PATH TO THE DOWNLOADED SKIPPER SERVER UBER-JAR>
        env:
          SPRING_APPLICATION_NAME: skipper-server
          SPRING_PROFILES_ACTIVE: cloud
          JBP_CONFIG_SPRING_AUTO_RECONFIGURATION: '{enabled: false}'
          SPRING_APPLICATION_JSON: |-
            {
              "spring.cloud.skipper.server" : {
                 "platform.cloudfoundry.accounts":  {
                       "default": {
                           "connection" : {
                               "url" : <cf-api-url>,
                               "domain" : <cf-apps-domain>,
                               "org" : <org>,
                               "space" : <space>,
                               "username": <email>,
                               "password" : <password>,
                               "skipSsValidation" : false 
                           },
                           "deployment" : {
                               "deleteRoutes" : false,
                               "services" : "rabbitmq",
                               "enableRandomAppNamePrefix" : false,
                               "memory" : 2048
                           }
                      }
                  }
               }
            }
    services:
      - <services>
    ```

    You need to fill in `<org>`, `<space>`, `<email>`, `<password>`,
    `<serviceName>` (RabbitMQ or Apache Kafka) and
    `<services>` (such as PostgresSQL) before running these commands.
    Once you have the desired config values in `manifest.yml`, you can
    run the `cf push` command to provision the skipper-server.

    [[warning | SSL Validation]]
    | Set _Skip SSL Validation_ to `true` only if you run on a Cloud
    | Foundry instance by using self-signed certificates (for example,
    | in development). Do not use self-signed certificates
    | for production.

    [[tip | Buildpacks]]
    |
    | When specifying the `buildpack`, our examples typically specify
    | `java_buildpack` or `java_buildpack_offline`. Use the CF command
    | `cf buildpacks` to get a listing of available relevant buildpacks
    | for your environment.

4.  Configure and run the Data Flow Server.

One of the most important configuration details is providing credentials to the Cloud Foundry instance so that the server can itself spawn
applications.
You can use any Spring Boot-compatible configuration mechanism (passing program arguments, editing configuration files before
building the application, using [Spring Cloud Config](https://github.com/spring-cloud/spring-cloud-config), using environment variables, and others), although some may prove more practicable than others, depending on how you typically deploy applications to Cloud Foundry.

Before installing there some general configuration details you should be aware of to update your manifest file as needed.

### General Configuration

This section covers some things to be aware of when you install into
Cloud Foundry.

#### Unique names

You must use a unique name for your application. An application with the same name in the same organization causes your deployment to fail.

#### Memory Settings

The recommended minimum memory setting for the server is 2G. Also, to
push apps to PCF and obtain application property metadata, the server
downloads applications to a Maven repository hosted on the local disk.
While you can specify up to 2G as a typical maximum value for disk
space on a PCF installation, you can increase this to 10G. Read about the
[maximum disk quota](https://bosh.io/jobs/cloud_controller_ng?source=github.com/cloudfoundry/capi-release#p%3dcc.maximum_app_disk_in_mb) for
information on how to configure this PCF property. Also, the Data Flow
server itself implements a Last-Recently-Used algorithm to free disk
space when it falls below a low-water-mark value.

#### Routing

If you push to a space with multiple users (for example, on PWS), the route you chose for your application name may already be taken.
You can use the `--random-route` option to avoid this when you push the server application.

#### Maven repositories

If you need to configure multiple Maven repositories, a proxy, or authorization for a private repository, see [Maven Configuration](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#configuration-maven).

### Installing using a Manifest

As an alternative to setting environment variables with the `cf set-env` command, you can curate all the relevant environment variables in a
`manifest.yml` file and use the `cf push` command to provision the server.

The following example shows such a manifest file. Note that "postgresSQL" is the name of the database service instance:

```yml
---
applications:
  - name: data-flow-server
    host: data-flow-server
    memory: 2G
    disk_quota: 2G
    instances: 1
    path: { PATH TO SERVER UBER-JAR }
    env:
      SPRING_APPLICATION_NAME: data-flow-server
      SPRING_PROFILES_ACTIVE: cloud
      JBP_CONFIG_SPRING_AUTO_RECONFIGURATION: '{enabled: false}'
      SPRING_CLOUD_SKIPPER_CLIENT_SERVER_URI: https://<skipper-host-name>/api
      SPRING_APPLICATION_JSON: |-
        {
           "maven" : {
               "remoteRepositories" : {
                  "repo1" : {
                    "url" : "https://repo.spring.io/libs-snapshot"
                  }
               }
           }, 
           "spring.cloud.dataflow" : {
                "task.platform.cloudfoundry.accounts" : {
                    "default" : {
                        "connection" : {
                            "url" : <cf-api-url>,
                            "domain" : <cf-apps-domain>,
                            "org" : <org>,
                            "space" : <space>,
                            "username" : <email>,
                            "password" : <password>,
                            "skipSsValidation" : true 
                        },
                        "deployment" : {
                          "services" : "postgresSQL"
                        }
                    }
                }
           }
        }
services:
  - postgresSQL
```

<!--TIP-->

You must deploy Skipper first and then configure the URI location where the Skipper server runs.

<!--END_TIP-->

#### Configuration for Prometheus

If you have installed the Prometheus and Grafana on Cloud Foundry or have a separate installation of them on another cluster, update the Data Flow Server's manifest file so that the `SPRING_APPLICATION_JSON` environment variable contains a section that configures all stream applications to send metrics data to the Prometheus RSocket gateway.
The snippets of YAML specific to this configuration is shown below.

```yml
---
applications:
  - name: data-flow-server
    ...
    env:
      ...
      SPRING_APPLICATION_JSON: |-
        {
           ...

           "spring.cloud.dataflow" : {
                ...
                "applicationProperties" : {
                    "stream.management.metrics.export.prometheus" : {
                        "enabled" : true,
                        "rsocket.enabled" : true,
                        "rsocket.host" : <prometheus-rsocket-proxy host>,
                        "rsocket.port" : <prometheus-rsocket-proxy TCP or Websocket port>
                    },
                },
                "grafana-info.url": <grafana root URL>
           }
        }
services:
  - postgresSQL
```

Similarly if you want to configure metrics collection for tasks, update the Data Flow Server's manifest file so that the `SPRING_APPLICATION_JSON` environment variable contains a section that configures all task applications to send metrics data to the Prometheus RSocket gateway.

The snippits of YAML specific to this configuration is shown below.

```yml
---
applications:
  - name: data-flow-server
    ...
    env:
      ...
      SPRING_APPLICATION_JSON: |-
        {
           ...

           "spring.cloud.dataflow" : {
                ...
                "applicationProperties" : {
                    "task.management.metrics.export.prometheus" : {
                        "enabled" : true,
                        "rsocket.enabled" : true,
                        "rsocket.host" : <prometheus-rsocket-proxy host>,
                        "rsocket.port" : <prometheus-rsocket-proxy TCP or Websocket port>
                    },
                },
                "grafana-info.url": <grafana root URL>
           }
        }
services:
  - postgresSQL
```

#### Configuration for InfluxDB

If you have installed the InfluxDB and Grafana on Cloud Foundry or have a separate installation of them on another cluster, to enable the Task and Stream metrics integration you need to extend the Data Flow server manifest by adding following JSON to the `SPRING_APPLICATION_JSON` environment variable:

```json
            "spring.cloud.dataflow.applicationProperties": {
                "task.management.metrics.export.influx": {
                    "enabled": true,
                    "db": "defaultdb",
                    "autoCreateDb": false,
                    "uri": "https://influx-uri:port",
                    "userName": "guest",
                    "password": "******"
                },
                "stream.management.metrics.export.influx": {
                    "enabled": true,
                    "db": "defaultdb",
                    "autoCreateDb": false,
                    "uri": "https://influx-uri:port",
                    "userName": "guest",
                    "password": "******"
                },
                "spring.cloud.dataflow.grafana-info.url": "https://grafana-uri:port"
            }
```

Check the [Influx Actuator properties](https://docs.spring.io/spring-boot/docs/2.2.0.M4/reference/html/#actuator-properties) for further details about the `management.metrics.export.influx.XXX` properties.

Once you are ready with the relevant properties in your manifest file,
you can issue a `cf push` command from the directory where this file is
stored.

## Shell

The following example shows how to start the Data Flow Shell:

```bash
java -jar spring-cloud-dataflow-shell-{scdf-core-version}.jar
```

Since the Data Flow Server and shell are not running on the same host, you can point the shell to the Data Flow server URL by using the `dataflow config server` command in Shell.

```bash
server-unknown:>dataflow config server https://<data-flow-server-route-in-cf>
Successfully targeted https://<data-flow-server-route-in-cf>
```

### Register prebuilt applications

All the prebuilt streaming applications:

- Are available as Apache Maven artifacts or Docker images.
- Use RabbitMQ or Apache Kafka.
- Support monitoring via Prometheus and InfluxDB.
- Contain metadata for application properties used in the UI and code completion in the shell.

Applications can be registered individually using the `app register` functionality or as a group using the `app import` functionality.
There are also `dataflow.spring.io` links that represent the group of prebuilt applications for a specific release which is useful for getting started.

You can register applications using the UI or the shell.

Since the Cloud Foundry installation guide uses RabbitMQ as the messaging middleware, register the RabbitMQ version of the applications.

```bash
dataflow:>app import --uri https://dataflow.spring.io/rabbitmq-maven-latest
```
