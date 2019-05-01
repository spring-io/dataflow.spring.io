---
path: 'installation/kubernetes/'
title: 'Kubernetes'
description: 'Lorem markdownum madefacta, circumtulit aliis, restabat'
---

# Installation- Kubernetes

[Spring Cloud Data Flow](https://cloud.spring.io/spring-cloud-dataflow/)
is a toolkit for building data integration and real-time data-processing
pipelines.

Pipelines consist of Spring Boot apps, built with the Spring Cloud
Stream or Spring Cloud Task microservice frameworks. This makes Spring
Cloud Data Flow suitable for a range of data-processing use cases, from
import-export to event-streaming and predictive analytics.

This project provides support for using Spring Cloud Data Flow with
Kubernetes as the runtime for these pipelines, with applications
packaged as Docker images.

## Installation

This section covers how to install the Spring Cloud Data Flow Server on
a Kubernetes cluster. Spring Cloud Data Flow depends on a few services
and their availability. For example, we need an RDBMS service for the
application registry, stream and task repositories, and task management.
For streaming pipelines, we also need the
[Skipper](https://cloud.spring.io/spring-cloud-skipper/) server (for
lifecycle management) and a messaging middleware option, such as Apache
Kafka or RabbitMQ.

[[tip | Kubernetes Environment]]
|This guide describes setting up an environment for testing Spring
| Cloud Data Flow on the Google Kubernetes Engine and is not meant to be
| a definitive guide for setting up a production environment. You can
| adjust the suggestions to fit your test setup. Remember that a
| production environment requires much more consideration for persistent
| storage of message queues, high availability, security, and other
| concerns.

[[tip]]
| Only applications registered with a `--uri` property
| pointing to a Docker resource are supported by the Data Flow Server
| for Kubernetes. However, we do support Maven resources for the
| `--metadata-uri` property, which is used to list the properties
| supported by each application. For example, the following application
| registration is valid:

    dataflow:>app register --type source --name time --uri docker://springcloudstream/time-source-rabbit:{docker-time-source-rabbit-version} --metadata-uri maven://org.springframework.cloud.stream.app:time-source-rabbit:jar:metadata:{docker-time-source-rabbit-version}

Any application registered with a Maven, HTTP, or File resource or the executable jar (by using a `--uri` property prefixed with
`maven://`, `http://` or `file://`) is **_not supported_**.

### Kubernetes Compatibility

The Spring Cloud Data Flow implementation for Kubernetes uses the
[Spring Cloud Deployer
Kubernetes](https://github.com/spring-cloud/spring-cloud-deployer-kubernetes)
library for orchestration. Before you begin setting up a Kubernetes
cluster, see the [compatibility
matrix](https://github.com/spring-cloud/spring-cloud-deployer-kubernetes#kubernetes-compatibility)
to learn more about deployer and server compatibility against Kubernetes
release versions.

The following listing outlines the compatibility between Spring Cloud
Data Flow for Kubernetes Server and Kubernetes versions:

    | Versions: SCDF K8S Server - K8S Deployer \ Kubernetes | 1.9.x | 1.10.x | 1.11.x |
    |-------------------------------------------------------|-------|--------|--------|
    | Server: 1.4.x - Deployer: 1.3.2                       | ✓     | ✓      | ✓      |
    | Server: 1.5.x - Deployer: 1.3.6                       | ✓     | ✓      | ✓      |
    | Server: 1.6.x - Deployer: 1.3.7                       | ✓     | ✓      | ✓      |
    | Server: 1.7.x - Deployer: 1.3.9                       | ✓     | ✓      | ✓      |
    | Server: 2.0.x - Deployer: 2.0.1                       | ✓     | ✓      | ✓      |
    |---------------------------------------------------------------------------------|

### Creating a Kubernetes Cluster

The Kubernetes [Picking the Right
Solution](https://kubernetes.io/docs/setup/pick-right-solution/) guide
lets you choose among many options, so you can pick the one that you are
most comfortable using.

All our testing is done against [Google Kubernetes
Engine](https://cloud.google.com/kubernetes-engine/) as well as [Pivotal
Container
Service](https://pivotal.io/platform/pivotal-container-service/). GKE is
used as the target platform for this section. We have also successfully
deployed with
[Minikube](https://kubernetes.io/docs/getting-started-guides/minikube/).
We note where you need to adjust for deploying on Minikube.

[[tip | Setting Minikube Resources]]
| When starting Minikube, you should allocate some extra resources,
| since we deploy several services. You can start with
| `minikube start --cpus=4 --memory=8192`. The allocated memory and CPU
| for the Minikube VM gets directly assigned to the number of
| applications deployed in a stream or task. The more you add, the more
| VM resources are required.

The rest of this getting started guide assumes that you have a working
Kubernetes cluster and a `kubectl` command line utility. See [Installing
and Setting up kubectl](https://kubernetes.io/docs/user-guide/prereqs/)
for installation instructions.

### Deploying with `kubectl`

To deploy with `kubectl`, you need to get the Kubernetes configuration
files.

They have the required metadata set for service discovery needed by the
different applications and services deployed. To check out the code,
enter the following commands:

    $ git clone https://github.com/{github-repo}
    $ cd spring-cloud-dataflow
    $ git checkout {github-tag}

#### Choosing a Message Broker

For deployed applications to communicate with each other, you need to
select a message broker. The sample deployment and service YAML files
provide configurations for RabbitMQ and Kafka. You need to configure
only one message broker.

- RabbitMQ

  Run the following command to start the RabbitMQ service:

      $ kubectl create -f src/kubernetes/rabbitmq/

  You can use `kubectl get all -l app=rabbitmq` to verify that the
  deployment, pod, and service resources are running. You can use
  `kubectl delete all -l app=rabbitmq` to clean up afterwards.

- Kafka

  Run the following command to start the Kafka service:

      $ kubectl create -f src/kubernetes/kafka/

  You can use `kubectl get all -l app=kafka` to verify that the
  deployment, pod, and service resources are running. You can use
  `kubectl delete all -l app=kafka` to clean up afterwards.

#### Deploy Services, Skipper, and Data Flow

You must deploy a number of services and the Data Flow server. The
following subsections describe how to do so:

1.  [Deploy MySQL](#deploy-mysql)

2.  [Deploy Prometheus and Grafana](#deploy-prometheus-and-grafana)

3.  [Create Data Flow Role Bindings and Service Account](#create-data-flow-role-bindings-and-service-account)

4.  [Deploy Skipper](#deploy-skipper)

5.  [Deploy the Data Flow Server](#deploy-the-data-flow-server)

[[tip | Messaging Middleware}}
| You also need a messaging middleware application, either RabbitMQ or
| Apache Kafka. See their web sites for how to install and run them.

#### Deploy MySQL

We use MySQL for this guide, but you could use a Postgres or H2 database
instead. We include JDBC drivers for all three of these databases. To
use a database other than MySQL, you must adjust the database URL and
driver class name settings.

[[tip | password management]]
| You can modify the password in the
| `src/kubernetes/mysql/mysql-deployment.yaml` files if you prefer to be
| more secure. If you do modify the password, you must also provide it
| as base64-encoded string in the
| `src/kubernetes/mysql/mysql-secrets.yaml` file.

Run the following command to start the MySQL service:

    kubectl create -f src/kubernetes/mysql/

You can use `kubectl get all -l app=mysql` to verify that the
deployment, pod, and service resources are running. You can use
`kubectl delete all,pvc,secrets -l app=mysql` to clean up afterwards.

#### Deploy Prometheus and Grafana

Metrics are "`scraped`" from deployed pods by Prometheus when configured
with the appropriate annotations. The scraped metrics are viewable
through Grafana dashboards. Out of the box, Grafana comes pre-configured
with a Prometheus data source connection along with SCDF-specific
Grafana dashboards to monitor the streaming applications composed in a
data pipeline.

[[tip | Memory Resources]]
| To run Prometheus and Grafana, you need at least 2GB to 3GB of Memory.
| If you use Minikube and you want Prometheus and Grafana running in it,
| you need to be sure to allocate enough resources. The instructions
| above point to `minikube start --cpus=4 --memory=8192`, but to account
| for these two components, you need at least 10GB or more of memory.

Run the following commands to create the cluster role, binding, and
service account:

    $ kubectl create -f src/kubernetes/prometheus/prometheus-clusterroles.yaml
    $ kubectl create -f src/kubernetes/prometheus/prometheus-clusterrolebinding.yaml
    $ kubectl create -f src/kubernetes/prometheus/prometheus-serviceaccount.yaml

Run the following commands to deploy Prometheus:

    $ kubectl create -f src/kubernetes/prometheus/prometheus-configmap.yaml
    $ kubectl create -f src/kubernetes/prometheus/prometheus-deployment.yaml
    $ kubectl create -f src/kubernetes/prometheus/prometheus-service.yaml

You can use `kubectl get all -l app=prometheus` to verify that the
deployment, pod, and service resources are running. You can use
`kubectl delete all,cm,svc -l app=prometheus` to clean up afterwards. To
cleanup roles, bindings, and the service account for Prometheus, run the
following command:

    kubectl delete clusterrole,clusterrolebinding,sa -l app=prometheus

Run the following command to deploy Grafana:

    $ kubectl create -f src/kubernetes/grafana/

You can use `kubectl get all -l app=grafana` to verify that the
deployment, pod, and service resources are running. You can use
`kubectl delete all,cm,svc,secrets -l app=grafana` to clean up
afterwards.

[[tip]]
| You should replace the `url` attribute value shown in the following
| example in `src/kubernetes/server/server-config-rabbit.yaml` or
| `src/kubernetes/server/server-config-kafka.yaml` to reflect the
| address and port Grafana is running on. On Minikube, you can obtain
| the value by running the command `minikube service --url grafana`.
| This configuration is needed for Grafana links to be accessible when
| accessing the dashboard from a web browser.

              grafana-info:
                url: 'https://grafana:3000'

The default Grafana dashboard credentials are a username of `admin` and
a password of `password`. You can change these defaults by modifying the
`src/kubernetes/grafana/grafana-secret.yaml` file.

In the event that you would not like to deploy metrics collection by
using Prometheus and Grafana, you should remove the following section of
`src/kubernetes/server/server-config-rabbit.yaml` or
`src/kubernetes/server/server-config-kafka.yaml`. You can edit the
appropriate file based on the messaging middleware deployed earlier:

              applicationProperties:
                stream:
                  management:
                    metrics:
                      export:
                        prometheus:
                          enabled: true
                    endpoints:
                      web:
                        exposure:
                          include: 'prometheus,info,health'
                  spring:
                    cloud:
                      streamapp:
                        security:
                          enabled: false
              grafana-info:
                url: 'https://grafana:3000'

#### Create Data Flow Role Bindings and Service Account

To create Role Bindings and Service account, run the following commands:

    kubectl create -f src/kubernetes/server/server-roles.yaml
    kubectl create -f src/kubernetes/server/server-rolebinding.yaml
    kubectl create -f src/kubernetes/server/service-account.yaml

You can use `kubectl get roles` and `kubectl get sa` to list the
available roles and service accounts.

To cleanup roles, bindings and the service account, use the following
commands:

    $ kubectl delete role scdf-role
    $ kubectl delete rolebinding scdf-rb
    $ kubectl delete serviceaccount scdf-sa

#### Deploy Skipper

Data Flow delegates the streams lifecycle management to Skipper. You
need to deploy [Skipper](https://cloud.spring.io/spring-cloud-skipper/)
to enable the stream management features.

The deployment is defined in the
`src/kubernetes/skipper/skipper-deployment.yaml` file. To control what
version of Skipper gets deployed, you can modify the tag used for the
Docker image in the container specification, as the following example
shows:

        spec:
          containers:
          - name: skipper
            image: springcloud/spring-cloud-skipper-server:{skipper-version}   #

- You may change the version as you like.

[tip | Multiple platform support]
| Skipper includes the concept of
| [platforms](https://docs.spring.io/spring-cloud-skipper/docs/current/reference/htmlsingle/#using-platforms),
| so it is important to define the "`accounts`" based on the project
| preferences.

To use RabbitMQ as the messaging middleware, run the following command:

    kubectl create -f src/kubernetes/skipper/skipper-config-rabbit.yaml

To use Apache Kafka as the messaging middleware, run the following
command:

    kubectl create -f src/kubernetes/skipper/skipper-config-kafka.yaml

Additionally, to use the [Apache Kafka Streams
Binder](https://docs.spring.io/spring-cloud-stream/docs/current/reference/htmlsingle/#_apache_kafka_streams_binder),
update the `environmentVariables` attribute to include the Kafka Streams
Binder configuraton in
`src/kubernetes/skipper/skipper-config-kafka.yaml` as follows:

    environmentVariables: 'SPRING_CLOUD_STREAM_KAFKA_BINDER_BROKERS=${KAFKA_SERVICE_HOST}:${KAFKA_SERVICE_PORT},SPRING_CLOUD_STREAM_KAFKA_BINDER_ZK_NODES=${KAFKA_ZK_SERVICE_HOST}:${KAFKA_ZK_SERVICE_PORT}, SPRING_CLOUD_STREAM_KAFKA_STREAMS_BINDER_BROKERS=${KAFKA_SERVICE_HOST}:${KAFKA_SERVICE_PORT},SPRING_CLOUD_STREAM_KAFKA_STREAMS_BINDER_ZK_NODES=${KAFKA_ZK_SERVICE_HOST}:${KAFKA_ZK_SERVICE_PORT}'

Run the following commands to start Skipper as the companion server for
Spring Cloud Data Flow:

    kubectl create -f src/kubernetes/skipper/skipper-deployment.yaml
    kubectl create -f src/kubernetes/skipper/skipper-svc.yaml

You can use `kubectl get all -l app=skipper` to verify that the
deployment, pod, and service resources are running. You can use
`kubectl delete all,cm -l app=skipper` to clean up afterwards.

====== Deploy the Data Flow Server

[[tip]]
| You must specify the version of Spring Cloud Data Flow server that you want to deploy.

The deployment is defined in the
`src/kubernetes/server/server-deployment.yaml` file. To control which
version of Spring Cloud Data Flow server gets deployed, modify the tag
used for the Docker image in the container specification, as follows:

        spec:
          containers:
          - name: scdf-server
            image: springcloud/spring-cloud-dataflow-server:{project-version}      #

- Change the version as you like. This document is based on the
  `{project-version}` release. You can use the docker `latest` tag for
  `BUILD-SNAPSHOT` releases.

> **Important**
>
> The Skipper service should be running and the
> `SPRING_CLOUD_SKIPPER_CLIENT_SERVER_URI` property in
> `src/kubernetes/server/server-deployment.yaml` should point to it.

The Data Flow Server uses the [Fabric8 Java client
library](https://github.com/fabric8io/kubernetes-client) to connect to
the Kubernetes cluster. We use environment variables to set the values
needed when deploying the Data Flow server to Kubernetes. We also use
the [Spring Cloud Kubernetes
library](https://github.com/spring-cloud/spring-cloud-kubernetes) to
access the Kubernetes
[`ConfigMap`](https://kubernetes.io/docs/user-guide/configmap/) and
[`Secrets`](https://kubernetes.io/docs/user-guide/secrets/) settings.
The `ConfigMap` settings for RabbitMQ are specified in the
`src/kubernetes/server/server-config-rabbit.yaml` file and for Kafka in
the `src/kubernetes/server/server-config-kafka.yaml` file. MySQL secrets
are located in the `src/kubernetes/mysql/mysql-secrets.yaml` file. If
you modified the password for MySQL, you should change it in the
`src/kubernetes/mysql/mysql-secrets.yaml` file. Any secrets have to be
provided in base64 encoding.

> **Note**
>
> We now configure the Data Flow server with file-based security, and
> the default user is _user_ with a password of _password_. You should
> change these values in
> `src/kubernetes/server/server-config-rabbit.yaml` for RabbitMQ or
> `src/kubernetes/server/server-config-kafka.yaml` for Kafka.

To create the configuration map when using RabbitMQ, run the following
command:

    kubectl create -f src/kubernetes/server/server-config-rabbit.yaml

To create the configuration map when using Kafka, run the following
command:

    kubectl create -f src/kubernetes/server/server-config.yaml

Now you need to create the server deployment, by running the following
commands:

    kubectl create -f src/kubernetes/server/server-svc.yaml
    kubectl create -f src/kubernetes/server/server-deployment.yaml

You can use `kubectl get all -l app=scdf-server` to verify that the
deployment, pod, and service resources are running. You can use
`kubectl delete all,cm -l app=scdf-server` to clean up afterwards.

You can use the `kubectl get svc scdf-server` command to locate the
`EXTERNAL_IP` address assigned to `scdf-server`. You can use that
address later to connect from the shell. The following example (with
output) shows how to do so:

    $ kubectl get svc scdf-server
    NAME         CLUSTER-IP       EXTERNAL-IP       PORT(S)    AGE
    scdf-server  10.103.246.82    130.211.203.246   80/TCP     4m

In this case, the URL you need to use is `https://130.211.203.246`.

If you use Minikube, you do not have an external load balancer, and the
`EXTERNAL_IP` shows as `<pending>`. You need to use the `NodePort`
assigned for the `scdf-server` service. You can use the following
command to look up the URL to use:

    $ minikube service --url scdf-server
    https://192.168.99.100:31991

## Helm Installation

Spring Cloud Data Flow offers a [Helm Chart](https://hub.kubeapps.com/charts/stable/spring-cloud-data-flow)
for deploying the Spring Cloud Data Flow server and its required services to a Kubernetes Cluster.

The following sections cover how to initialize `Helm` and install Spring Cloud Data Flow on a Kubernetes cluster.

### Installing Helm

`Helm` is comprised of two components: the client (Helm) and the server
(Tiller). The `Helm` client runs on your local machine and can be
installed by following the instructions found
[here](https://github.com/kubernetes/helm/blob/master/README.md#install).
If Tiller has not been installed on your cluster, run the following
`Helm` client command:

    $ helm init

To verify that the `Tiller` pod is running, run the following command:

    kubectl get pod --namespace kube-system

You should see the `Tiller` pod running.

### Installing the Spring Cloud Data Flow Server and Required Services

Before you install Spring Cloud Data Flow, you need to update the Helm
repository and install the chart for Spring Cloud Data Flow.

To update the `Helm` repository, run the following command:

    $ helm repo update

To install the chart for Spring Cloud Data Flow, run the following
command:

    $ helm install --name my-release stable/spring-cloud-data-flow

#### Configuring Helm

As of Spring Cloud Data Flow 1.7.0, the `Helm` chart has been promoted to the `Stable` repository. To install a previous version, you need

> access to the incubator repository. To add this repository to your `Helm` set and install the chart, run the following commands:

    $ helm repo add incubator https://kubernetes-charts-incubator.storage.googleapis.com
    $ helm repo update
    $ helm install --name my-release incubator/spring-cloud-data-flow

[[tip | Setting server.service.type]]
| If you run on a Kubernetes cluster without a load balancer, such as in
| Minikube, you should override the service type to use `NodePort`. To
| do so, add the `--set server.service.type=NodePort` override, as follows:

    helm install --name my-release --set server.service.type=NodePort stable/spring-cloud-data-flow

##### Helm RBAC setting

If you run on a Kubernetes cluster without RBAC, such as in Minikube, you should set `rbac.create` to `false`. By default, it is set to
`true` (based on best practices). To do so, add the `--set rbac.create=false` override, as follows:

    helm install --name my-release --set server.service.type=NodePort --set rbac.create=false stable/spring-cloud-data-flow

##### Using Kafka

If you prefer to use Kafka rather than RabbitMQ as the messaging middleware, you can override properties as shown below. RabbitMQ is enabled by default.

    helm install --name my-release --set kafka.enabled=true,rabbitmq.enabled=false stable/spring-cloud-data-flow

#### Specify Data Flow version

If you wish to specify a version of Spring Cloud Data Flow other than the current GA release, you can set the `server.version` (replacing `stable` with `incubator` if needed), as follows:

    helm install --name my-release stable/spring-cloud-data-flow --set server.version=<version-you-want>

[[tip | Full chart options]]
| To see all of the settings that you can configure on the Spring Cloud Data Flow chart, view the
| [README](https://github.com/kubernetes/charts/tree/master/incubator/spring-cloud-data-flow/README.md).

#### Version Compatibility

The following listing shows Spring Cloud Data Flow’s Kubernetes version compatibility with the respective Helm Chart releases:

    | SCDF-K8S-Server Version \ Chart Version | 0.1.x | 0.2.x | 1.0.x | 2.0.x |
    |-----------------------------------------|-------|-------|-------|-------|
    |1.2.x                                    |✓      |✕     |✕       |✕      |
    |1.3.x                                    |✕      |✓     |✕       |✕      |
    |1.4.x                                    |✕      |✓     |✕       |✕      |
    |1.5.x                                    |✕      |✓     |✕       |✕      |
    |1.6.x                                    |✕      |✓     |✕       |✕      |
    |1.7.x                                    |✕      |✕     |✓       |✕      |
    |2.0.x                                    |✕      |✕     |✕       |✓      |
    |-------------------------------------------------------------------------|

#### Expected output

You should see the following output:

    NAME:   my-release
    LAST DEPLOYED: Sat Mar 10 11:33:29 2018
    NAMESPACE: default
    STATUS: DEPLOYED

    RESOURCES:
    ==> v1/Secret
    NAME                  TYPE    DATA  AGE
    my-release-mysql      Opaque  2     1s
    my-release-data-flow  Opaque  2     1s
    my-release-rabbitmq   Opaque  2     1s

    ==> v1/ConfigMap
    NAME                          DATA  AGE
    my-release-data-flow-server   1     1s
    my-release-data-flow-skipper  1     1s

    ==> v1/PersistentVolumeClaim
    NAME                 STATUS   VOLUME                                    CAPACITY  ACCESSMODES  STORAGECLASS  AGE
    my-release-rabbitmq  Bound    pvc-e9ed7f55-2499-11e8-886f-08002799df04  8Gi       RWO          standard      1s
    my-release-mysql     Pending  standard                                  1s

    ==> v1/ServiceAccount
    NAME                  SECRETS  AGE
    my-release-data-flow  1        1s

    ==> v1/Service
    NAME                          CLUSTER-IP      EXTERNAL-IP  PORT(S)                                AGE
    my-release-mysql              10.110.98.253   <none>       3306/TCP                               1s
    my-release-data-flow-server   10.105.216.155  <pending>    80:32626/TCP                           1s
    my-release-rabbitmq           10.106.76.215   <none>       4369/TCP,5672/TCP,25672/TCP,15672/TCP  1s
    my-release-data-flow-skipper  10.100.28.64    <none>       80/TCP                                 1s

    ==> v1beta1/Deployment
    NAME                          DESIRED  CURRENT  UP-TO-DATE  AVAILABLE  AGE
    my-release-mysql              1        1        1           0          1s
    my-release-rabbitmq           1        1        1           0          1s
    my-release-data-flow-skipper  1        1        1           0          1s
    my-release-data-flow-server   1        1        1           0          1s


    NOTES:
    1. Get the application URL by running these commands:
         NOTE: It may take a few minutes for the LoadBalancer IP to be available.
               You can watch the status of the server by running 'kubectl get svc -w my-release-data-flow-server'
      export SERVICE_IP=$(kubectl get svc --namespace default my-release-data-flow-server -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
      echo http://$SERVICE_IP:80

You have just created a new release in the default namespace of your
Kubernetes cluster. The `NOTES` section gives instructions for
connecting to the newly installed server. It takes a couple of minutes
for the application and its required services to start. You can check on
the status by issuing a `kubectl get pod -w` command. You need to wait
for the `READY` column to show `1/1` for all pods. Once that is done,
you can connect to the Data Flow server with the external IP listed by
the `kubectl get svc my-release-data-flow-server` command. The default
username is `user`, and its password is `password`.

[[tip]]
If you run on Minikube, you can use the following command to get the URL for the server:

    minikube service --url my-release-data-flow-server

To see what `Helm` releases you have running, you can use the
`helm list` command. When it is time to delete the release, run
`helm delete my-release`. This command removes any resources created for
the release but keeps release information so that you can roll back any
changes by using a `helm rollback my-release 1` command. To completely
delete the release and purge any release metadata, you can use
`helm delete my-release --purge`.

[[tip | secret management]]
| There is an [issue](https://github.com/kubernetes/charts/issues/980)
| with generated secrets that are used for the required services getting
| rotated on chart upgrades. To avoid this issue, set the password for
| these services when installing the chart. You can use the following
| command to do so:

    helm install --name my-release \
        --set rabbitmq.rabbitmqPassword=rabbitpwd \
        --set mysql.mysqlRootPassword=mysqlpwd incubator/spring-cloud-data-flow

## Register pre-built applications

All the pre-built streaming applications:

- Are available as Apache Maven artifacts or Docker images.
- Use RabbitMQ or Apache Kafka.
- Support monitoring via Prometheus and InfluxDB.
- Contain metadata for application properties used in the UI and code completion in the shell.

Applications can be registered individually using the `app register` functionality or as a group using the `app import` functionality.
There are also `bit.ly` links that represent the group of pre-built applications for a specific release which is useful for getting started.

You can register applications using the UI or the shell.
Even though we are only using two pre-built applications, we will register the full set of pre-built applications.

The easiest way to install Data Flow on Kubernetes is using the Helm chart that uses RabbitMQ as the default messaging middleware.
The command to import the Kafka version of the applications is

**TODO screen shot instead of shell command**

```
app import --uri  http://bit.ly/Einstein-SR2-stream-applications-kafka-docker
```

Change `kafka` to `rabbit` in the above URL if you set `kafka.endabled=true` in the helm chart or followed the manual `kubectl` based installation instructions for installing Data Flow on Kubernetes and chose to use Kafka as the messaging middleware.

## Application and Server Properties

This section covers how you can customize the deployment of your
applications. You can use a number of properties to influence settings
for the applications that are deployed. Properties can be applied on a
per-application basis or in the appropriate server configuration for all
deployed applications.

[[tip]]
| Properties set on a per-application basis always take precedence over
| properties set as the server configuration. This arrangement lets you
| override global server level properties on a per-application basis.

Properties to be applied for all deployed Tasks are defined in the
`src/kubernetes/server/server-config-(binder).yaml` file and for Streams
in `src/kubernetes/skipper/skipper-config-(binder).yaml`. Replace
`(binder)` with the messaging middleware you are using — for example,
`rabbit` or `kafka`.

### Memory and CPU Settings

Applications are deployed with default memory and CPU settings. If
needed, these values can be adjusted. The following example shows how to
set `Limits` to `1000m` for `CPU` and `1024Mi` for memory and `Requests`
to `800m` for CPU and `640Mi` for memory:

deployer.&lt;app&gt;.kubernetes.limits.cpu=1000m
deployer.&lt;app&gt;.kubernetes.limits.memory=1024Mi
deployer.&lt;app&gt;.kubernetes.requests.cpu=800m
deployer.&lt;app&gt;.kubernetes.requests.memory=640Mi&lt;/programlisting&gt;

Those values results in the following container settings being used:

Limits: cpu: 1 memory: 1Gi Requests: cpu: 800m memory:
640Mi&lt;/programlisting&gt;

You can also control the default values to which to set the `cpu` and
`memory` globally.

The following example shows how to set the CPU and memory for streams:

    data:
      application.yaml: |-
        spring:
          cloud:
            skipper:
              server:
                platform:
                  kubernetes:
                    accounts:
                      default:
                        limits:
                          memory: 640mi
                          cpu: 500m

The following example shows how to set the CPU and memory for tasks:

    data:
      application.yaml: |-
        spring:
          cloud:
            dataflow:
              task:
                platform:
                  kubernetes:
                    accounts:
                      default:
                        limits:
                          memory: 640mi
                          cpu: 500m

The settings we have used so far only affect the settings for the
container. They do not affect the memory setting for the JVM process in
the container. If you would like to set JVM memory settings, you can
provide an environment variable to do so. See the next section for
details.

### Environment Variables

To influence the environment settings for a given application, you can
use the `spring.cloud.deployer.kubernetes.environmentVariables` deployer
property. For example, a common requirement in production settings is to
influence the JVM memory arguments. You can do so by using the
`JAVA_TOOL_OPTIONS` environment variable, as the following example
shows:

deployer.&lt;app&gt;.kubernetes.environmentVariables=JAVA_TOOL_OPTIONS=-Xmx1024m&lt;/programlisting&gt;

[tip]
| The `environmentVariables` property accepts a comma-delimited string.
| If an environment variable contains a value which is also a
| comma-delimited string, it must be enclosed in single quotation marks — for example,
| `spring.cloud.deployer.kubernetes.environmentVariables=spring.cloud.stream.kafka.binder.brokers='somehost:9092, anotherhost:9093'`

This overrides the JVM memory setting for the desired `<app>` (replace
`<app>` with the name of your application).

### Liveness and Readiness Probes

The `liveness` and `readiness` probes use paths called `/health` and
`/info`, respectively. They use a `delay` of `10` for both and a
`period` of `60` and `10` respectively. You can change these defaults
when you deploy the stream by using deployer properties. Liveness and
readiness probes are only applied to streams.

The following example changes the `liveness` probe (replace `<app>` with
the name of your application) by setting deployer properties:

deployer.&lt;app&gt;.kubernetes.livenessProbePath=/health
deployer.&lt;app&gt;.kubernetes.livenessProbeDelay=120
deployer.&lt;app&gt;.kubernetes.livenessProbePeriod=20&lt;/programlisting&gt;

You can declare the same as part of the server global configuration for
streams, as the following example shows:

    data:
      application.yaml: |-
        spring:
          cloud:
            skipper:
              server:
                platform:
                  kubernetes:
                    accounts:
                      default:
                        livenessProbePath: /health
                        livenessProbeDelay: 120
                        livenessProbePeriod: 20

Similarly, you can swap `liveness` for `readiness` to override the
default `readiness` settings.

By default, port 8080 is used as the probe port. You can change the
defaults for both `liveness` and `readiness` probe ports by using
deployer properties, as the following example shows:

deployer.&lt;app&gt;.kubernetes.readinessProbePort=7000
deployer.&lt;app&gt;.kubernetes.livenessProbePort=7000&lt;/programlisting&gt;

You can declare the same as part of the global configuration for
streams, as the following example shows:

    data:
      application.yaml: |-
        spring:
          cloud:
            skipper:
              server:
                platform:
                  kubernetes:
                    accounts:
                      default:
                        readinessProbePort: 7000
                        livenessProbePort: 7000

[tip]
| By default, the `liveness` and `readiness` probe paths use Spring Boot
| 2.x+ actuator endpoints. To use Spring Boot 1.x actuator endpoint
| paths, you must adjust the `liveness` and `readiness` values, as the
| following example shows (replace `<app>` with the name of your
| application):

deployer.&lt;app&gt;.kubernetes.livenessProbePath=/health
deployer.&lt;app&gt;.kubernetes.readinessProbePath=/info&lt;/programlisting&gt;
To automatically set both `liveness` and `readiness` endpoints on a
per-application basis to the default Spring Boot 1.x paths, you can set
the following property:

deployer.&lt;app&gt;.kubernetes.bootMajorVersion=1&lt;/programlisting&gt;

You can access secured probe endpoints by using credentials stored in a
[Kubernetes
secret](https://kubernetes.io/docs/concepts/configuration/secret/). You
can use an existing secret, provided the credentials are contained under
the `credentials` key name of the secret’s `data` block. You can
configure probe authentication on a per-application basis. When enabled,
it is applied to both the `liveness` and `readiness` probe endpoints by
using the same credentials and authentication type. Currently, only
`Basic` authentication is supported.

To create a new secret:

1.  Generate the base64 string with the credentials used to access the
    secured probe endpoints.

    Basic authentication encodes a username and password as a base64
    string in the format of `username:password`.

    The following example (which includes output and in which you should
    replace `user` and `pass` with your values) shows how to generate a
    base64 string:

        $ echo -n "user:pass" | base64
        dXNlcjpwYXNz

2.  With the encoded credentials, create a file (for example,
    `myprobesecret.yml`) with the following contents:

    apiVersion: v1 kind: Secret metadata: name: myprobesecret type:
    Opaque data: credentials:
    GENERATED_BASE64_STRING&lt;/programlisting&gt;

3.  Replace `GENERATED_BASE64_STRING` with the base64-encoded value
    generated earlier.

4.  Create the secret by using `kubectl`, as the following example
    shows:

        $ kubectl create -f ./myprobesecret.yml
        secret "myprobesecret" created

5.  Set the following deployer properties to use authentication when
    accessing probe endpoints, as the following example shows:

    deployer.&lt;app&gt;.kubernetes.probeCredentialsSecret=myprobesecret&lt;/programlisting&gt;

    Replace `<app>` with the name of the application to which to
    apply authentication.

### Using `SPRING_APPLICATION_JSON`

You can use a `SPRING_APPLICATION_JSON` environment variable to set Data
Flow server properties (including the configuration of maven repository
settings) that are common across all of the Data Flow server
implementations. These settings go at the server level in the container
`env` section of a deployment YAML. The following example shows how to
do so:

    env:
    - name: SPRING_APPLICATION_JSON
      value: "{ \"maven\": { \"local-repository\": null, \"remote-repositories\": { \"repo1\": { \"url\": \"https://repo.spring.io/libs-snapshot\"} } } }"

### Private Docker Registry

You can pull Docker images from a private registry on a per-application
basis. First, you must create a secret in the cluster. Follow the [Pull
an Image from a Private
Registry](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)
guide to create the secret.

Once you have created the secret, you can use the `imagePullSecret`
property to set the secret to use, as the following example shows:

deployer.&lt;app&gt;.kubernetes.imagePullSecret=mysecret&lt;/programlisting&gt;

Replace `<app>` with the name of your application and `mysecret` with
the name of the secret you created earlier.

You can also configure the image pull secret at the global server level.

The following example shows how to do so for streams:

    data:
      application.yaml: |-
        spring:
          cloud:
            skipper:
              server:
                platform:
                  kubernetes:
                    accounts:
                      default:
                        imagePullSecret: mysecret

The following example shows how to do so for tasks:

    data:
      application.yaml: |-
        spring:
          cloud:
            dataflow:
              task:
                platform:
                  kubernetes:
                    accounts:
                      default:
                        imagePullSecret: mysecret

Replace `mysecret` with the name of the secret you created earlier.

### Annotations

You can add annotations to Kubernetes objects on a per-application
basis. The supported object types are pod `Deployment`, `Service`, and
`Job`. Annotations are defined in a `key:value` format, allowing for
multiple annotations separated by a comma. For more information and use
cases on annotations, see
[Annotations](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/).

The following example shows how you can configure applications to use
annotations:

    deployer.<app>.kubernetes.podAnnotations=annotationName:annotationValue
    deployer.<app>.kubernetes.serviceAnnotations=annotationName:annotationValue,annotationName2:annotationValue2
    deployer.<app>.kubernetes.jobAnnotations=annotationName:annotationValue

Replace `<app>` with the name of your application and the value of your
annotations.

### Entry Point Style

An entry point style affects how application properties are passed to
the container to be deployed. Currently, three styles are supported:

- `exec` (default): Passes all application properties and command line
  arguments in the deployment request as container arguments.
  Application properties are transformed into the format of
  `--key=value`.

- `shell`: Passes all application properties as environment variables.
  Command line arguments from the deployment request are not converted
  into environment variables nor set on the container. Application
  properties are transformed into an uppercase string and `.`
  characters are replaced with `_`.

- `boot`: Creates an environment variable called
  `SPRING_APPLICATION_JSON` that contains a JSON representation of all
  application properties. Command line arguments from the deployment
  request are set as container args.

[[tip]]
| In all cases, environment variables defined at the server-level
| configuration and on a per-application basis are set onto the
| container as is.

You can configure applications as follows:

    deployer.<app>.kubernetes.entryPointStyle=<Entry Point Style>

Replace `<app>` with the name of your application and
`<Entry Point Style>` with your desired entry point style.

You can also configure the entry point style at the global server level.

The following example shows how to do so for streams:

    data:
      application.yaml: |-
        spring:
          cloud:
            skipper:
              server:
                platform:
                  kubernetes:
                    accounts:
                      default:
                        entryPointStyle: entryPointStyle

The following example shows how to do so for tasks:

    data:
      application.yaml: |-
        spring:
          cloud:
            dataflow:
              task:
                platform:
                  kubernetes:
                    accounts:
                      default:
                        entryPointStyle: entryPointStyle

Replace `entryPointStye` with the desired entry point style.

You should choose an Entry Point Style of either `exec` or `shell`, to
correspond to how the `ENTRYPOINT` syntax is defined in the container’s
`Dockerfile`. For more information and uses cases on `exec` versus
`shell`, see the
[ENTRYPOINT](https://docs.docker.com/engine/reference/builder/#entrypoint)
section of the Docker documentation.

Using the `boot` entry point style corresponds to using the `exec` style
`ENTRYPOINT`. Command line arguments from the deployment request are
passed to the container, with the addition of application properties
being mapped into the `SPRING_APPLICATION_JSON` environment variable
rather than command line arguments.

[[tip]]
| When you use the `boot` Entry Point Style, the `deployer.<app>.kubernetes.environmentVariables` property must not
| contain `SPRING_APPLICATION_JSON`.

### Deployment Service Account

You can configure a custom service account for application deployments
through properties. You can use an existing service account or create a
new one. One way to create a service account is by using `kubectl`, as
the following example shows:

    $ kubectl create serviceaccount myserviceaccountname
    serviceaccount "myserviceaccountname" created

Then you can configure individual applications as follows:

    deployer.<app>.kubernetes.deploymentServiceAccountName=myserviceaccountname

Replace `<app>` with the name of your application and
`myserviceaccountname` with your service account name.

You can also configure the service account name at the global server
level.

The following example shows how to do so for streams:

    data:
      application.yaml: |-
        spring:
          cloud:
            skipper:
              server:
                platform:
                  kubernetes:
                    accounts:
                      default:
                        deploymentServiceAccountName: myserviceaccountname

The following example shows how to do so for tasks:

    data:
      application.yaml: |-
        spring:
          cloud:
            dataflow:
              task:
                platform:
                  kubernetes:
                    accounts:
                      default:
                        deploymentServiceAccountName: myserviceaccountname

Replace `myserviceaccountname` with the service account name to be
applied to all deployments.

### Image Pull Policy

An image pull policy defines when a Docker image should be pulled to the
local registry. Currently, three policies are supported:

- `IfNotPresent` (default): Do not pull an image if it already exists.

- `Always`: Always pull the image regardless of whether it
  already exists.

- `Never`: Never pull an image. Use only an image that already exists.

The following example shows how you can individually configure
applications:

    deployer.<app>.kubernetes.imagePullPolicy=Always

Replace `<app>` with the name of your application and `Always` with your
desired image pull policy.

You can configure an image pull policy at the global server level.

The following example shows how to do so for streams:

    data:
      application.yaml: |-
        spring:
          cloud:
            skipper:
              server:
                platform:
                  kubernetes:
                    accounts:
                      default:
                        imagePullPolicy: Always

The following example shows how to do so for tasks:

    data:
      application.yaml: |-
        spring:
          cloud:
            dataflow:
              task:
                platform:
                  kubernetes:
                    accounts:
                      default:
                        imagePullPolicy: Always

Replace `Always` with your desired image pull policy.

### Deployment Labels

You can set custom labels on objects related to
[Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/).
See
[Labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)
for more information on labels. Labels are specified in `key:value`
format.

The following example shows how you can individually configure
applications:

    deployer.<app>.kubernetes.deploymentLabels=myLabelName:myLabelValue

Replace `<app>` with the name of your application, `myLabelName` with
your label name, and `myLabelValue` with the value of your label.

Additionally, you can apply multiple labels, as the following example
shows:

    deployer.<app>.kubernetes.deploymentLabels=myLabelName:myLabelValue,myLabelName2:myLabelValue2

## Monitoring

**TODO where do we discuss monitoring deployed apps on k8s??**s
