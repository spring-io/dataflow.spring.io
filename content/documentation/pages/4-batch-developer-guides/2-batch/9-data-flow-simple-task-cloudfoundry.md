---
path: 'batch-developer-guides/batch/data-flow-simple-task-cloudfoundry/'
title: 'Deploying a task application on Cloud Foundry using Spring Cloud Data Flow'
description: 'Guide to deploying spring-cloud-stream-task applications on Cloud Foundry using Spring Cloud Data Flow'
---

# Setting up Cloud Foundry to Launch Tasks

In order to run the two task applications by using Spring Cloud Data Flow, we also setup the following two server instances on Cloud Foundry:

- [Spring Cloud Data Flow](https://cloud.spring.io/spring-cloud-dataflow/)
- [Spring Cloud Skipper](https://cloud.spring.io/spring-cloud-skipper/)

To download Spring Cloud Data Flow, run the following command:

```bash
wget https://repo.spring.io/milestone/org/springframework/cloud/spring-cloud-dataflow-server/2.1.0.M1/spring-cloud-dataflow-server-2.1.0.M1.jar
```

To download Spring Cloud Skipper, run the following command:

```bash
wget https://repo.spring.io/milestone/org/springframework/cloud/spring-cloud-skipper-server/2.0.2.RC1/spring-cloud-skipper-server-2.0.2.RC1.jar
```

Later in this document, we deploy those two jars to Cloud Foundry.

## Setting up Services

To set up services, you first need a Cloud Foundry account. You can create a free account by using [Pivotal Web Services](https://run.pivotal.io/) (PWS). We use PWS for this example. If you use a different provider, your experience may differ slightly from the experience described in this document.

Once you have an account, to log into Cloud Foundry by using the [Cloud Foundry command line interface](https://console.run.pivotal.io/tools), run the following command:

```bash
cf login
```

[[tip]]
| You can also target specific Cloud Foundry instances with the `-a` flag &#151; for example, `cf login -a https://api.run.pivotal.io`.

We use the following two Cloud Foundry services:

- PostgreSQL
- RabbitMQ

[[note]]
| RabbitMQ is not strictly needed, but, if we continue on to work with Streams, we want to be good citizens.

You can get a listing of available services on Cloud by using the `marketplace` command, as the following listing shows:

```bash
cf marketplace
```

On [Pivotal Web Services](https://run.pivotal.io/) (PWS), you should be able to use the following commands to install the PostgreSQL service and the RabbitMQ service:

```bash
cf create-service elephantsql panda postgres-service
cf create-service cloudamqp lemur rabbitmq-service
```

[[important]]
| **IMPORTANT**: When choosing a Postgres service, keep an eye on the provided number of connections. On PWS, for example, the free service tier of `elephantsql` provides only four parallel database connections, which is too limiting to successfully run this example.

Make sure you name your PostgresSQL service `postgres-service`. We use that name in the rest of the examples in this document

## Setting up Skipper on Cloud Foundry

This example uses Skipper, which you can set up on Cloud Foundry. To do so:

1. Create a file named `manifest-skipper.yml` with the following content:

   ```yaml
   applications:
     - name: skipper-server
       routes:
         - route: <your-skipper-server-route> # e.g. my-skipper-server.cfapps.io
       memory: 1G
       disk_quota: 1G
       instances: 1
       timeout: 180
       buildpacks:
         - java_buildpack
       path: ./spring-cloud-skipper-server-2.0.2.RC1.jar
       env:
         SPRING_APPLICATION_NAME: skipper-server
         SPRING_PROFILES_ACTIVE: cloud
         JBP_CONFIG_SPRING_AUTO_RECONFIGURATION: '{enabled: false}'
         SPRING_CLOUD_SKIPPER_SERVER_STRATEGIES_HEALTHCHECK_TIMEOUTINMILLIS: 300000
         SPRING_CLOUD_SKIPPER_SERVER_PLATFORM_CLOUDFOUNDRY_ACCOUNTS[default]_CONNECTION_URL: https://api.run.pivotal.io
         SPRING_CLOUD_SKIPPER_SERVER_PLATFORM_CLOUDFOUNDRY_ACCOUNTS[default]_CONNECTION_ORG: <your-cloud-foundry-org>
         SPRING_CLOUD_SKIPPER_SERVER_PLATFORM_CLOUDFOUNDRY_ACCOUNTS[default]_CONNECTION_SPACE: <your-cloud-foundry-space>
         SPRING_CLOUD_SKIPPER_SERVER_PLATFORM_CLOUDFOUNDRY_ACCOUNTS[default]_DEPLOYMENT_DOMAIN: cfapps.io
         SPRING_CLOUD_SKIPPER_SERVER_PLATFORM_CLOUDFOUNDRY_ACCOUNTS[default]_CONNECTION_USERNAME: <your-cloud-foundry-username>
         SPRING_CLOUD_SKIPPER_SERVER_PLATFORM_CLOUDFOUNDRY_ACCOUNTS[default]_CONNECTION_PASSWORD: <your-cloud-foundry-password>
         SPRING_CLOUD_SKIPPER_SERVER_PLATFORM_CLOUDFOUNDRY_ACCOUNTS[default]_CONNECTION_SKIP_SSL_VALIDATION: false
         SPRING_CLOUD_SKIPPER_SERVER_PLATFORM_CLOUDFOUNDRY_ACCOUNTS[default]_DEPLOYMENT_DELETE_ROUTES: false
         SPRING_CLOUD_SKIPPER_SERVER_PLATFORM_CLOUDFOUNDRY_ACCOUNTS[default]_DEPLOYMENT_SERVICES: rabbitmq-service
         SPRING_CLOUD_SKIPPER_SERVER_PLATFORM_CLOUDFOUNDRY_ACCOUNTS[default]_DEPLOYMENT_STREAM_ENABLE_RANDOM_APP_NAME_PREFIX: false
         SPRING_CLOUD_SKIPPER_SERVER_PLATFORM_CLOUDFOUNDRY_ACCOUNTS[default]_DEPLOYMENT_MEMORY: 2048m
         SPRING_DATASOURCE_HIKARI_MINIMUMIDLE: 1
         SPRING_DATASOURCE_HIKARI_MAXIMUMPOOLSIZE: 4
       services:
         - postgres-service
   ```

1. Run `cf push -f ./manifest-skipper.yml`.

## Setting up Data Flow on Cloud Foundry

This example uses Skipper, which you can set up on Cloud Foundry. To do so:

1. Create a file named `manifest-dataflow.yml`:

   ```yaml
   ---
   applications:
     - name: data-flow-server
       routes:
         - route: <your-data-flow-server-route> # e.g. my-data-flow-server.cfapps.io
       memory: 2G
       disk_quota: 2G
       instances: 1
       path: ./spring-cloud-dataflow-server-2.1.0.M1.jar
       env:
         SPRING_APPLICATION_NAME: data-flow-server
         SPRING_PROFILES_ACTIVE: cloud
         JBP_CONFIG_SPRING_AUTO_RECONFIGURATION: '{enabled: false}'
         MAVEN_REMOTEREPOSITORIES[REPO1]_URL: https://repo.spring.io/libs-snapshot
         SPRING_CLOUD_DATAFLOW_TASK_PLATFORM_CLOUDFOUNDRY_ACCOUNTS[default]_CONNECTION_URL: https://api.run.pivotal.io
         SPRING_CLOUD_DATAFLOW_TASK_PLATFORM_CLOUDFOUNDRY_ACCOUNTS[default]_CONNECTION_ORG: <your-cloud-foundry-org>
         SPRING_CLOUD_DATAFLOW_TASK_PLATFORM_CLOUDFOUNDRY_ACCOUNTS[default]_CONNECTION_SPACE: <your-cloud-foundry-space>
         SPRING_CLOUD_DATAFLOW_TASK_PLATFORM_CLOUDFOUNDRY_ACCOUNTS[default]_CONNECTION_DOMAIN: cfapps.io
         SPRING_CLOUD_DATAFLOW_TASK_PLATFORM_CLOUDFOUNDRY_ACCOUNTS[default]_CONNECTION_USERNAME: <your-cloud-foundry-username>
         SPRING_CLOUD_DATAFLOW_TASK_PLATFORM_CLOUDFOUNDRY_ACCOUNTS[default]_CONNECTION_PASSWORD: <your-cloud-foundry-password>
         SPRING_CLOUD_DATAFLOW_TASK_PLATFORM_CLOUDFOUNDRY_ACCOUNTS[default]_CONNECTION_SKIP_SSL_VALIDATION: true
         SPRING_CLOUD_DATAFLOW_TASK_PLATFORM_CLOUDFOUNDRY_ACCOUNTS[default]_DEPLOYMENT_SERVICES: postgres-service, rabbitmq-service
         SPRING_CLOUD_SKIPPER_CLIENT_SERVER_URI: <your-skipper-server-uri> # e.g. https://my-skipper-server.cfapps.io/api
         SPRING_CLOUD_DATAFLOW_SERVER_URI: <your-dataflow-server-uri> # e.g. https://my-data-flow-server.cfapps.io
         SPRING_DATASOURCE_HIKARI_MINIMUMIDLE: 2
         SPRING_DATASOURCE_HIKARI_MAXIMUMPOOLSIZE: 4
         SPRING_CLOUD_DATAFLOW_APPLICATIONPROPERTIES_TASK_SPRING_DATASOURCE_HIKARI_MINIMUMIDLE: 1
         SPRING_CLOUD_DATAFLOW_APPLICATIONPROPERTIES_TASK_SPRING_DATASOURCE_HIKARI_MAXIMUMPOOLSIZE: 2
       services:
         - postgres-service
   ```

   For an explanation of the configured properties, see https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#\_common\_application_properties

1. Run `cf push -f ./manifest-dataflow.yml`.

Once you have deployed Spring Cloud Data Flow and Spring Cloud Skipper, go to your Cloud Foundry dashboard. Both Spring Cloud Skipper and Spring Cloud Data Flow should have a status of `Running`, as the following image shows:

![billsetuptask executed on Cloud Foundry](images/scdf-cf-dashboard-cf.png)

```

```
