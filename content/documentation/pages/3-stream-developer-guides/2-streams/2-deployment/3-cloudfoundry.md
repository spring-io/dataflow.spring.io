---
path: 'stream-developer-guides/streams/deployment/cloudfoundry'
title: 'Deploy sample stream applications to Cloud Foundry'
description: 'Deploy sample stream applications to Cloud Foundry'
---

# Cloud Foundry Deployment

If you have configured and built the [sample stream applications](%currentPath%/stream-developer-guides/streams/standalone-stream-sample) to run with one of the supported message brokers, You can run them as stand-alone applications on a Cloud Foundry installation.

This section walks you through how to deploy the three Spring Cloud Stream applications on Cloud Foundry.

<!--TABS-->

<!--Kafka-->

As of this writing, Kafka must be managed as an external service which is accessible to your Cloud Foundry environment.

### Create deployment manifests

Create a CF manifest for each application, configured to connect to the external Kafka broker.

Create a CF manifest YAML file called `usage-detail-sender.yml` for the `UsageDetailSender`:

```
applications:
- name: usage-detail-sender
  timeout: 120
  path: ./target/usage-detail-sender-0.0.1-SNAPSHOT.jar
  memory: 1G
  buildpack: java_buildpack
  env:
    SPRING_CLOUD_STREAM_KAFKA_BINDER_BROKERS: [Kafka_Service_IP_Address:Kafka_Service_Port]
    SPRING_CLOUD_STREAM_KAFKA_BINDER_ZKNODES: [ZooKeeper_Service_IP_Address:ZooKeeper_Service_Port]
```

Create a CF manifest YAML file called `usage-cost-processor.yml` for the `UsageCostProcessor`:

```
applications:
- name: usage-cost-processor
  timeout: 120
  path: ./target/usage-cost-processor-0.0.1-SNAPSHOT.jar
  memory: 1G
  buildpack: java_buildpack
  env:
    SPRING_CLOUD_STREAM_KAFKA_BINDER_BROKERS: [Kafka_Service_IP_Address:Kafka_Service_Port]
    SPRING_CLOUD_STREAM_KAFKA_BINDER_ZKNODES: [ZooKeeper_Service_IP_Address:ZooKeeper_Service_Port]
```

Create a CF manifest YAML file called `usage-cost-logger.yml` for the `UsageCostLogger`:

```
applications:
- name: usage-cost-logger
  timeout: 120
  path: ./target/usage-cost-logger-0.0.1-SNAPSHOT.jar
  memory: 1G
  buildpack: java_buildpack
  env:
    SPRING_CLOUD_STREAM_KAFKA_BINDER_BROKERS: [Kafka_Service_IP_Address:Kafka_Service_Port]
    SPRING_CLOUD_STREAM_KAFKA_BINDER_ZKNODES: [ZooKeeper_Service_IP_Address:ZooKeeper_Service_Port]
```

<!--RabbitMQ-->

### Create a RabbitMQ service

From the CF market place, create a RabbitMQ service instance, named `rabbitmq` from one of the available RabbitMQ service plans. For example, for a service plan `p.rabbitmq` `single-node`, use:

```bash
cf create-service p.rabbitmq single-node rabbitmq
```

### Create deployment manifests

Create a CF manifest for each application, configured to bind to the `rabbitmq` service.

Create a CF manifest YAML file named `usage-detail-sender.yml` for the `UsageDetailSender`:

```
applications:
- name: usage-detail-sender
  timeout: 120
  path: ./target/usage-detail-sender-rabbit-0.0.1-SNAPSHOT.jar
  memory: 1G
  buildpack: java_buildpack
  services:
    - rabbitmq
```

Create a CF manifest YAML file named `usage-cost-processor.yml` for the `UsageCostProcessor`:

```
applications:
- name: usage-cost-processor
  timeout: 120
  path: ./target/usage-cost-processor-0.0.1-SNAPSHOT.jar
  memory: 1G
  buildpack: java_buildpack
  services:
    - rabbitmq
```

Create a CF manifest YAML file named `usage-cost-logger.yml`:

```
applications:
- name: usage-cost-logger
  timeout: 120
  path: ./target/usage-cost-logger-0.0.1-SNAPSHOT.jar
  memory: 1G
  buildpack: java_buildpack
  services:
    - rabbitmq
```

<!--END_TABS-->

Push the `UsageDetailSender` application by using its manifest, as follows:

```
cf push -f usage-detail-sender.yml
```

Push the `UsageCostProcessor` application by using its manifest, as follows:

```
cf push -f usage-cost-processor.yml
```

Push the `UsageCostLogger` application by using its manifest, as follows:

```
cf push -f usage-cost-logger.yml
```

You can see the applications by running the `cf apps` command, as the following example (with output) shows:

```
cf apps
```

```
name                   requested state   instances   memory   disk   urls
usage-cost-logger      started           1/1         1G       1G     usage-cost-logger.cfapps.io
usage-cost-processor   started           1/1         1G       1G     usage-cost-processor.cfapps.io
usage-detail-sender    started           1/1         1G       1G     usage-detail-sender.cfapps.io
```

To verify the deployment, tail the logs on the `usage-cost-logger` application.

```
cf logs usage-cost-logger
```

You should see something like this:

```bash
   2019-05-13T23:23:33.36+0530 [APP/PROC/WEB/0] OUT 2019-05-13 17:53:33.362  INFO 15 --- [e-cost.logger-1] i.s.d.s.u.UsageCostLogger     : {"userId": "user5", "callCost": "1.0", "dataCost": "12.350000000000001" }
   2019-05-13T23:23:33.46+0530 [APP/PROC/WEB/0] OUT 2019-05-13 17:53:33.467  INFO 15 --- [e-cost.logger-1] i.s.d.s.u.UsageCostLogger     : {"userId": "user1", "callCost": "19.0", "dataCost": "10.0" }
   2019-05-13T23:23:34.46+0530 [APP/PROC/WEB/0] OUT 2019-05-13 17:53:34.466  INFO 15 --- [e-cost.logger-1] i.s.d.s.u.UsageCostLogger     : {"userId": "user4", "callCost": "2.2", "dataCost": "5.15" }
   2019-05-13T23:23:35.46+0530 [APP/PROC/WEB/0] OUT 2019-05-13 17:53:35.469  INFO 15 --- [e-cost.logger-1] i.s.d.s.u.UsageCostLogger     : {"userId": "user3", "callCost": "21.0", "dataCost": "17.3" }
```

### Clean Up

Delete the application instances:

```bash
cf d -f usage-detail-sender
cf d -f usage-cost-processor
cf d -f usage-cost-logger
```

If using RabbitMQ, you may delete the service instance:

```
cf ds -f rabbitmq
```
