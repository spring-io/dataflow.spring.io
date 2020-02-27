---
path: 'recipes/kafka/ext-kafka-cluster-cf/'
title: 'External Kafka Cluster'
description: 'Connect to an external Kafka Cluster from Cloud Foundry'
---

# Connect to External Kafka Cluster

Pivotal Cloud Foundry does not have Apache Kafka as a managed service in the Marketplace.
However, it is common for developers to develop and deploy applications to Cloud Foundry that interact with an external Kafka cluster.
This recipe specifically walks through the developer expectations from Spring Cloud Stream, Spring Cloud Data Flow, and as well as the [Spring Cloud Data Flow for PCF](https://network.pivotal.io/products/p-dataflow) Tile.

We will review the required Spring Cloud Stream properties and how they are translated over to the applications for the following deployment options in Cloud Foundry.

- Applications run as standalone app instances.
- Applications deployed as part of a streaming data pipeline through open-source SCDF.
- Applications deployed as part of a streaming data pipeline through [SCDF for PCF](https://network.pivotal.io/products/p-dataflow) tile.

## Prerequisite

Let's start with preparing the external Kafka cluster credentials.

Typically, a series of Kafka brokers, collectively are referred to as a Kafka cluster.
The brokers individually can be reached through its external IP addresses or a well-defined DNS route could be available to use as well.

For this walk-through, though, we will stick to a simpler setup of 3-broker cluster with their DNS addresses being `foo0.broker.foo`, `foo1.broker.foo`, and `foo2.broker.foo`. The default port of the brokers is `9092`.

If the cluster is secured, depending on the security option in use at the broker, different properties are expected to be supplied for when applications attempt to connect to the external cluster.
Again, for simplicity, we will use Kafka's [JAAS](https://en.wikipedia.org/wiki/Java_Authentication_and_Authorization_Service) set up of `PlainLoginModule` with username as `test` and password as `bestest`.

## User-provided Services vs. Spring Boot Properties

The next question Cloud Foundry developers stumble upon is whether or not to set up Kafka connection as a Cloud Foundry custom user-provided service (CUPS) or simply pass connection credentials as Spring Boot properties.

In Cloud Foundry, there isn't a [Spring Cloud Connector](https://github.com/spring-cloud/spring-cloud-connectors) or [CF-JavaEnv](https://github.com/pivotal-cf/java-cfenv) support for Kafka, so by service-binding the Kafka CUPS with the application, you _will not_ automatically be able to parse `VCAP_SERVICES` and pass the connection credentials to the applications at runtime.
Even with CUPS in place, it is your responsibility to parse the `VCAP_SERVICES` JSON and pass them as Boot properties, so there's no automation in place for Kafka.
For the curious, you can see an example of CUPS in action in the Spring Cloud Data Flow's [reference guide](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#configuration-cloudfoundry-ups).

For this walk-through, we will stick to the Spring Boot properties.

## Standalone Streaming Apps

The typical Cloud Foundry deployment of an application includes a `manifest.yml` file.
We will use the `source-sample` source application to highlight the configurations to connect to an external Kafka cluster.

```yaml
---
applications:
- name: source-sample
  host: source-sample
  memory: 1G
  disk_quota: 1G
  instances: 1
  path: source-sample.jar
env:
    ... # other application properties
    ... # other application properties
    SPRING_APPLICATION_JSON: |-
        {
            "spring.cloud.stream.kafka.binder": {
                "brokers": "foo0.broker.foo,foo1.broker.foo,foo2.broker.foo",
                "jaas.options": {
                    "username": "test",
                    "password":"bestest"
                },
                "jaas.loginModule":"org.apache.kafka.common.security.plain.PlainLoginModule"
            },
            "spring.cloud.stream.bindings.output.destination":"fooTopic"
        }
```

With the above setting, when the `source-sample` source is deployed to Cloud Foundry, it should be able to connect to the external cluster.

You can verify the connection credentials by accessing `source-sample`'s `/configprops` actuator endpoint.
Likewise, you will also see the connection credentials printed in the app logs.

[[note]]
| The Kafka connection credentials are supplied through the Spring Cloud Stream Kafka binder properties, which in
| this case are all the properties with the `spring.spring.cloud.stream.kafka.binder.*` prefix.
|
| Alternatively, instead of supplying the properties through `SPRING_APPLICATION_JSON`, these properties can be supplied as plain
| env-vars as well.

## Streaming Data Pipeline in SCDF (Open Source)

Deploying a streaming data pipeline in SCDF requires at least two applications. We will use the out-of-the-box `time` as the source and the `log` sink applications here.

### Global Kafka Connection Configurations

Before we jump to the demo walk-through, let's review how [global properties](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#spring-cloud-dataflow-global-properties) can be configured centrally in SCDF.
With that flexibility, every stream application deployed through SCDF will automatically also inherit all the globally defined properties, and it can be convenient for cases like Kafka connection credentials.

```yaml
---
applications:
  - name: scdf-server
    host: scdf-server
    memory: 2G
    disk_quota: 2G
    timeout: 180
    instances: 1
    path: spring-cloud-dataflow-server-%dataflow-version%.jar
env:
  SPRING_PROFILES_ACTIVE: cloud
  JBP_CONFIG_SPRING_AUTO_RECONFIGURATION: '{enabled: false}'
  SPRING_CLOUD_SKIPPER_CLIENT_SERVER_URI: http://your-skipper-server-uri/api
  SPRING_APPLICATION_JSON: |-
    {
        "spring.cloud": {
            "dataflow.task.platform.cloudfoundry": {
                "accounts": {
                    "foo": {
                        "connection": {
                            "url": <api-url>,
                            "org": <org>,
                            "space": <space>,
                            "domain": <app-domain>, 
                            "username": <email>, 
                            "password": <password>,
                            "skipSslValidation": true
                        },
                        "deployment": {
                            "services": <comma delimited list of service>"
                        }
                    }
                }
            }, 
            "stream": { 
                "kafka.binder": {
                    "brokers": "foo0.broker.foo,foo1.broker.foo,foo2.broker.foo",
                    "jaas": {
                        "options": {
                            "username": "test",
                            "password":"bestest"
                        },
                        "loginModule":"org.apache.kafka.common.security.plain.PlainLoginModule"
                    }
                },
                "bindings.output.destination":"fooTopic"
            }
        }
    }
services:
  - mysql
```

With the above `manifest.yml`, SCDF should now be in the position to automatically propagate the Kafka connection credentials to all the stream application deployments.

```bash
dataflow:>stream create fooz --definition "time | log"
Created new stream 'fooz'

dataflow:>stream deploy --name fooz
Deployment request has been sent for stream 'fooz'
```

When the `time` and `log` applications are successfully deployed and started in Cloud Foundry, they should automatically connect to the configured external Kafka cluster.

You can verify the connection credentials by accessing `time` or `log`'s `/configprops` actuator endpoints.
Likewise, you will also see the connection credentials printed in the app logs.

### Explicit Stream-level Kafka Connection Configuration

Alternatively, if you intend to deploy only a particular stream with external Kafka connection credentials, you can do so when deploying a stream with explicit overrides.

```bash
dataflow:>stream create fooz --definition "time | log"
Created new stream 'fooz'

dataflow:>stream deploy --name fooz --properties "app.*.spring.cloud.stream.kafka.binder.brokers=foo0.broker.foo,foo1.broker.foo,foo2.broker.foo,app.*.spring.spring.cloud.stream.kafka.binder.jaas.options.username=test,app.*.spring.spring.cloud.stream.kafka.binder.jaas.options.password=besttest,app.*.spring.spring.cloud.stream.kafka.binder.jaas.loginModule=org.apache.kafka.common.security.plain.PlainLoginModule"
Deployment request has been sent for stream 'fooz'
```

When the `time` and `log` applications are successfully deployed and started in Cloud Foundry, they should automatically connect to the external Kafka cluster.

You can verify the connection credentials by accessing `time` or `log`'s `/configprops` actuator endpoints.
Likewise, you will also see the connection credentials printed in the app logs.

## Streaming Data Pipeline in SCDF for PCF Tile

We don't yet have support to supply global configuration properties through the SCDF for PCF Tile.

However, the option discussed at [Explicit Stream Configuration](%currentPath%/recipes/kafka/ext-kafka-cluster-cf/#explicit-stream-level-kafka-connection-configuration) should still work when deploying a stream from Spring Cloud Data Flow running as a managed service in Pivotal Cloud Foundry.

Alternatively, you could supply Kafka connection credentials as CUPS when creating the service instance of SCDF for PCF Tile.

```bash
cf create-service p-dataflow standard data-flow -c '{"messaging-data-service": { "user-provided": {"brokers":"foo0.broker.foo,foo1.broker.foo,foo2.broker.foo","username":"test","password":"bestest"}}}'
```

With that, when deploying the stream, you'd supply the CUPS properties as values from `VCAP_SERVICES`.

```bash
dataflow:>stream create fooz --definition "time | log"
Created new stream 'fooz'

dataflow:>stream deploy --name fooz --properties "app.*.spring.cloud.stream.kafka.binder.brokers=${vcap.services.messaging-<GENERATED_GUID>.credentials.brokers},app.*.spring.spring.cloud.stream.kafka.binder.jaas.options.username=${vcap.services.messaging-<GENERATED_GUID>.credentials.username},app.*.spring.spring.cloud.stream.kafka.binder.jaas.options.password=${vcap.services.messaging-<GENERATED_GUID>.credentials.password},app.*.spring.spring.cloud.stream.kafka.binder.jaas.loginModule=org.apache.kafka.common.security.plain.PlainLoginModule"
Deployment request has been sent for stream 'fooz'
```

[[note]]
| Replace `<GENERATED_GUID>` with the GUID of the generated messaging service-instance name, which you can find from `cf services` command.
| Example: `messaging-b3e76c87-c5ae-47e4-a83c-5fabf2fc4f11`.
