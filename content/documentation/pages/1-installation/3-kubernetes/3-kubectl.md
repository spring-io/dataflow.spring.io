---
path: 'installation/kubernetes/kubectl'
title: 'kubectl'
description: 'Installation using kubectl'
---

# Deploying with `kubectl`

To install with `kubectl`, you need to get the Kubernetes configuration
files.

They have the required metadata set for service discovery needed by the different applications and services deployed.
To check out the code, enter the following commands:

```bash
git clone https://github.com/spring-cloud/spring-cloud-dataflow
cd spring-cloud-dataflow
git checkout %github-tag%
```

<!--TIP-->

If you use Minikube, see [Setting Minikube Resources](%currentPath%/installation/kubernetes/creating-a-cluster/#setting-minikube-resources) for details on CPU and RAM resource requirements.

<!--END_TIP-->

## Installing Spring Cloud Data Flow via the `install-scdf.sh` script.

Spring Cloud Data Flow offers the `install-scdf.sh` script that will execute the `kubectl` commands to install a SCDF for development purposes on Kubernetes.
If you can not run a shell script you can follow the manual instructions shown [below](#kubectl-installation-instructions) .
The script currently supports the following Kubernetes platforms: `kind`, `minikube` and, `tmc`,

Before executing `install-scdf.sh` you can configure you local enviroment using on of the `use-*.sh` scripts:

```shell
source ./use-kind.sh test-ns postrgresql kafka
./configure-k8s.sh
```
<!--NOTE-->

This will export `NS=test-ns, K8S_DRIVER=kind, DATABASE=postgresql, BROKER=kafka` and create a Kubernetes environment using [kind](https://kind.sigs.k8s.io/).
All the variations are available in the Reference Guide.

<!--END_NOTE-->

### Configure Spring Cloud Data Flow create Grafana Dashboard

If you wish to view metrics for the applications in Dataflow, edit the `src/local/k8s/yaml/server-config.yaml` and set the `management.defaults.metrics.export.enabled` to `true` before executing the `install-scdf.sh` script.

### Configuring `install-scdf.sh` and installing Spring Cloud Data Flow

The script offers the following environment variables to establish how you want to install SCDF:

- NS - Establishes the namespace that the dataflow instance will be installed.
- K8S_DRIVER - Configure the Kubernetes environment based on your Kubernetes deployment. Currently supports `kind`, `docker` (minikube), `tmc`. It defaults to `kind`.
- DOCKER_SERVER - The docker registry that is supported in your environment
- DOCKER_USER - The user for the `DOCKER_SERVER`
- DOCKER_PASSWORD - The password for the `DOCKER_SERVER`
- DOCKER_EMAIL - The email for the `DOCKER_SERVER`
- DATABASE - The database to be setup and used by Spring Cloud Data Flow and Task Applications. Currently supports `mariadb` or `postgresql`. The default is `postgresql`.
- BROKER - The messaging broker to be setup and used by Spring Cloud Data Flow and its stream applications. It currently supports `rabbitmq` and `kafka`. It defaults to `rabbitmq`.
- PROMETHEUS - Sets up a prometheus, prometheus-proxy, and a grafana instance if set to `true`. The default is `false`.

An example would be if you wanted to install Spring Cloud Data Flow in the `default` namespace of Minikube using Dockerhub for your registry, Mariadb as your database, Rabbitmq as your broker, and Prometheus for your metrics, you would setup and launch the script as follows:

```bash
export NS=default
export K8S_DRIVER=docker
export DOCKER_SERVER=registry.hub.docker.com
export DOCKER_USER=<your user name>
export DOCKER_PASSWORD=<your password>
export DOCKER_EMAIL=<your email>
export DATABASE=mariadb
export PROMETHEUS=true
<home directory of spring cloud data flow>/spring-cloud-dataflow/src/local/k8s/install-scdf.sh
kubectl port-forward <scdf-podname> 9393:9393
kubectl port-forward <grafana-podname> 3000:3000
```

<!--NOTE-->

On some machines Spring Cloud Data Flow or Skipper may take longer to startup than the current configuration.
If so you may want to update the `spec.template.spec.containers.startupProbe.initialDelaySeconds` in the `src/local/k8s/yaml/server-deployment.yaml`
and `src/local/k8s/yaml/skipper-deployment.yaml` files.

<!--END_NOTE-->

### Uninstalling Spring Cloud Data Flow via the `delete-scdf.sh` script.

If you are deleting the SCDF deployment created by the `install-scdf.sh` set the following environment variables :

- NS - Establishes the namespace that the dataflow instance is deployed.
- K8S_DRIVER - The Kubernetes environment that your SCDF is deployed. Currently supports `kind`, `docker` (minikube), `tmc`. It defaults to `kind`.
- DOCKER_SERVER - The docker registry that is supported in your environment
- DATABASE - The database to be removed that was used by Spring Cloud Data Flow and Task applications. Currently supports `mariadb` or `postgresql`. The default is `postgresql`.
- BROKER - The messaging broker to be removed that was used by Spring Cloud Data Flow and its stream applications. It currently supports `rabbitmq` and `kafka`. It defaults to `rabbitmq`.
- PROMETHEUS - Removes a prometheus, prometheus-proxy, and a grafana instance if set to `true`. The default is `false`.

An example would be if you wanted to delete a Spring Cloud Data Flow deployed in the `default` namespace of Minikube, Mariadb as your database, Rabbitmq as your broker, and Prometheus, you would setup and launch the script as follows:

```bash
export NS=default
export K8S_DRIVER=docker
export DATABASE=mariadb
export PROMETHEUS=true
<home directory of spring cloud data flow>/spring-cloud-dataflow/src/local/k8s/delete-scdf.sh
```

## Kubectl Installation Instructions

If the `install-scdf.sh` script will not work for you or if you wish to install SCDF in another way, you can use the instructions
below:

### Choose a Message Broker

For deployed applications to communicate with each other, you need to select a message broker.
The sample deployment and service YAML files provide configurations for RabbitMQ and Kafka.
You need to configure only one message broker.

#### RabbitMQ

Run the following command to start the RabbitMQ service:

```
kubectl create -f src/kubernetes/rabbitmq/
```

You can use `kubectl get all -l app=rabbitmq` to verify that the deployment, pod, and service resources are running.

#### Kafka

Run the following command to start the Kafka service:

```
kubectl create -f src/kubernetes/kafka/
```

You can use `kubectl get all -l app=kafka` to verify that the deployment, pod, and service resources are running.

### Deploy Services, Skipper, and Data Flow

You must deploy a number of services and the Data Flow server. The
following subsections describe how to do so:

1.  [Deploy MariaDB](#deploy-mariadb)

2.  [Enable Monitoring](#enable-monitoring)

3.  [Create Data Flow Role Bindings and Service Account](#create-data-flow-role-bindings-and-service-account)

4.  [Deploy Skipper](#deploy-skipper)

5.  [Deploy the Data Flow Server](#deploy-data-flow-server)

#### Deploy MariaDB

We use MariaDB for this guide, but you could use a Postgres or H2 database
instead. We include JDBC drivers for all three of these databases. To
use a database other than MariaDB, you must adjust the database URL and
driver class name settings.

<!--TIP-->

**Password Management**

You can modify the password in the `src/kubernetes/mariadb/mariadb-deployment.yaml` files if you prefer to be more secure.
If you do modify the password, you must also provide it as base64-encoded string in the `src/kubernetes/mariadb/mariadb-secrets.yaml` file.

<!--END_TIP-->

Run the following command to start the MariaDB service:

```
kubectl create -f src/kubernetes/mariadb/
```

You can use `kubectl get all -l app=mariadb` to verify that the
deployment, pod, and service resources are running. You can use

#### Enable Monitoring

How to enable monitoring varies by monitoring platform:

- [Prometheus and Grafana](#prometheus-and-grafana)
- [Wavefront](#wavefront)

##### Prometheus and Grafana

The [Prometheus RSocket](https://github.com/micrometer-metrics/prometheus-rsocket-proxy) implementation lets you establish persistent bidirectional `RSocket` connections between all Stream and Task applications and one or more `Prometheus RSocket Proxy` instances.
Prometheus is configured to scrape each proxy instance.
Proxies, in turn, use the connection to pull metrics from each application.
The scraped metrics are viewable through Grafana dashboards.
Out of the box, the Grafana dashboard comes pre-configured with a Prometheus data-source connection along with Data Flow-specific dashboards to monitor the streaming and task applications in a data pipeline.

<!--TIP-->

**Memory Resources**

If you use Minikube, see [Setting Minikube Resources](%currentPath%/installation/kubernetes/creating-a-cluster/#setting-minikube-resources) for details on CPU and RAM resource requirements.

To run Prometheus and Grafana, you need at least an additional 2GB to 3GB of Memory.

<!--END_TIP-->

###### Setup Prometheus Roles, Role Bindings, and Service Account

Run the following commands to create the cluster role, binding, and
service account:

```
kubectl create -f src/kubernetes/prometheus/prometheus-clusterroles.yaml
kubectl create -f src/kubernetes/prometheus/prometheus-clusterrolebinding.yaml
kubectl create -f src/kubernetes/prometheus/prometheus-serviceaccount.yaml
```

###### Deploy Prometheus Proxy

Run the following commands to deploy Prometheus RSocket Proxy:

```
kubectl create -f src/kubernetes/prometheus-proxy/
```

You can use `kubectl get all -l app=prometheus-proxy` to verify that the deployment, pod, and service resources are running.

###### Deploy Prometheus

Run the following commands to deploy Prometheus:

```
kubectl create -f src/kubernetes/prometheus/prometheus-configmap.yaml
kubectl create -f src/kubernetes/prometheus/prometheus-deployment.yaml
kubectl create -f src/kubernetes/prometheus/prometheus-service.yaml
```

You can use `kubectl get all -l app=prometheus` to verify that the
deployment, pod, and service resources are running.

###### Deploy Grafana

Run the following command to deploy Grafana:

```
kubectl create -f src/kubernetes/grafana/
```

You can use `kubectl get all -l app=grafana` to verify that the deployment, pod, and service resources are running.

<!--TIP-->

You should replace the `url` attribute value shown in the following example (from `src/kubernetes/server/server-config.yaml`) to reflect the address and port on which Grafana runs.
On Minikube, you can obtain the value by running `minikube service --url grafana`.

If you see the following message:

```
❗  Because you are using a Docker driver on darwin, the terminal needs to be open to run it.
```

Then use the following command instead: `kubectl port-forward <grafana pod name> 3000:3000` and set the `url` in `server-config.yaml` to `http://localhost:3000`.

```yml
spring:
  cloud:
    dataflow:
      metrics.dashboard:
        url: 'https://grafana:3000'
```

<!--END_TIP-->

The default Grafana dashboard credentials are a username of `admin` and a password of `password`. You can change these defaults by modifying the `src/kubernetes/grafana/grafana-secret.yaml` file.

To enable Prometheus for Spring Cloud Skipper Server, mirror the Data Flow configuration to the Skipper's configuration file (`src/kubernetes/skipper/skipper-config-{kafka|rabbit}.yaml`):

```yaml
management:
  metrics:
    export:
      prometheus:
        enabled: true
        rsocket:
          enabled: true
          host: prometheus-proxy
          port: 7001
```

If you do not want to deploy Prometheus and Grafana for metrics and monitoring, you should remove the following section of `src/kubernetes/server/server-config.yaml`:

```yaml
management:
  metrics:
    export:
      prometheus:
        enabled: true
        rsocket:
          enabled: true
          host: prometheus-proxy
          port: 7001
spring:
  cloud:
    dataflow:
      metrics.dashboard:
        url: 'https://grafana:3000'
```

##### Wavefront

Metrics for the Spring Cloud Data Flow server along with deployed streams and tasks can be sent to the Wavefront service.
Before enabling Wavefront, ensure you have your Wavefront URL and API token.

First, create a secret (to encode your API token) in a file called `wavefront-secret.yaml`:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: wavefront-api
  labels:
    app: wavefront
data:
  wavefront-api-token: bXl0b2tlbg==
```

The value of `wavefront-api-token` is a base64-encoded string that represents your API token. For more information on Secrets, see the [Kubernetes Documentation](https://kubernetes.io/docs/concepts/configuration/secret/).

Create the secret:

```
kubectl create -f wavefront-secret.yaml
```

To mount the secret and make it available to Spring Cloud Data Flow, modify the `src/kubernetes/server/server-deployment.yaml` file, making the following additions:

<!--TIP-->

The secret mountPath should be within the same path as `SPRING_CLOUD_KUBERNETES_SECRETS_PATHS`.

<!--END_TIP-->

```yaml
spec:
  containers:
    - name: scdf-server
      volumeMounts:
        - name: wavefront-api
          mountPath: /etc/secrets/wavefront-api
          readOnly: true
  volumes:
    - name: wavefront-api
      secret:
        secretName: wavefront-api
```

You can enable Wavefront for Spring Cloud Data Flow server, streams, or tasks based on your needs. Each is configured independently, letting one or all be configured.

To enable Wavefront for Spring Cloud Data Flow Server, modify the `src/kubernetes/server/server-config.yaml` file, making the following additions:

```yaml
data:
  application.yaml: |-
    management:
      metrics:
        export:
          wavefront:
            enabled: true
            api-token: ${wavefront-api-token}
            uri: https://yourwfuri.wavefront.com
            source: yoursourcename
```

Changing the values of `uri` and `source` to those matching your setup.
The `api-token` value is automatically resolved from the secret.

By default, the above configuration is applied automatically to the deployed Streams and Tasks as well, and metrics from them are sent to Wavefront. Use the `applicationProperties.stream.*` and `applicationProperties.task.*` to alter the defaults.

To enable Wavefront for Spring Cloud Skipper Server, mirror the Data Flow configuration to the Skipper's configuration file (`src/kubernetes/skipper/skipper-config-{kafka|rabbit}.yaml`) and add the `wavefront-api` volume to the `src/kubernetes/skipper/skipper-deployment.yaml` file.

<!--TIP-->

You should replace the `url` attribute value in the following example in `src/kubernetes/server/server-config.yaml` to reflect the address and port the Wavefront dashboards are running on.
This configuration is needed for Wavefront links to be accessible when accessing the dashboard from a web browser.

```yaml
spring:
  cloud:
    dataflow:
      metrics.dashboard:
        url: 'https://yourwfuri.wavefront.com'
        type: 'WAVEFRONT'
```

<!--END_TIP-->

#### Create Data Flow Role Bindings and Service Account

To create Role Bindings and Service account, run the following commands:

```
kubectl create -f src/kubernetes/server/server-roles.yaml
kubectl create -f src/kubernetes/server/server-rolebinding.yaml
kubectl create -f src/kubernetes/server/service-account.yaml
```

You can use `kubectl get roles` and `kubectl get sa` to list the
available roles and service accounts.

#### Deploy Skipper

Data Flow delegates the streams lifecycle management to Skipper. You
need to deploy [Skipper](https://cloud.spring.io/spring-cloud-skipper/)
to enable the stream management features.

The deployment is defined in the
`src/kubernetes/skipper/skipper-deployment.yaml` file. To control what
version of Skipper gets deployed, you can modify the tag used for the
Docker image in the container specification, as follows:

```yml
spec:
  containers:
    - name: skipper
      image: springcloud/spring-cloud-skipper-server:%skipper-version% #
```

- You can change the version as you like.

<!--TIP-->

**Multiple platform support**

Skipper includes the concept of
[platforms](https://docs.spring.io/spring-cloud-skipper/docs/current/reference/htmlsingle/#using-platforms),
so it is important to define the "accounts" based on the project
preferences.

<!--END_TIP-->

To use RabbitMQ as the messaging middleware, run the following command:

```
kubectl create -f src/kubernetes/skipper/skipper-config-rabbit.yaml
```

To use Apache Kafka as the messaging middleware, run the following
command:

```
kubectl create -f src/kubernetes/skipper/skipper-config-kafka.yaml
```

Additionally, to use the [Apache Kafka Streams
Binder](https://docs.spring.io/spring-cloud-stream/docs/current/reference/htmlsingle/#_apache_kafka_streams_binder),
update the `environmentVariables` attribute to include the Kafka Streams
Binder configuraton in
`src/kubernetes/skipper/skipper-config-kafka.yaml`, as follows:

```yaml
environmentVariables: 'SPRING_CLOUD_STREAM_KAFKA_BINDER_BROKERS=kafka-broker:9092,SPRING_CLOUD_STREAM_KAFKA_BINDER_ZK_NODES=${KAFKA_ZK_SERVICE_HOST}:${KAFKA_ZK_SERVICE_PORT}, SPRING_CLOUD_STREAM_KAFKA_STREAMS_BINDER_BROKERS=kafka-broker:9092,SPRING_CLOUD_STREAM_KAFKA_STREAMS_BINDER_ZK_NODES=${KAFKA_ZK_SERVICE_HOST}:${KAFKA_ZK_SERVICE_PORT}'
```

Run the following commands to start Skipper as the companion server for
Spring Cloud Data Flow:

```
kubectl create -f src/kubernetes/skipper/skipper-deployment.yaml
kubectl create -f src/kubernetes/skipper/skipper-svc.yaml
```

You can use `kubectl get all -l app=skipper` to verify that the
deployment, pod, and service resources are running.

#### Deploy Data Flow Server

The deployment is defined in the
`src/kubernetes/server/server-deployment.yaml` file. To control which
version of Spring Cloud Data Flow server gets deployed, modify the tag
used for the Docker image in the container specification, as follows:

```yaml
spec:
  containers:
    - name: scdf-server
      image: springcloud/spring-cloud-dataflow-server:%dataflow-version%
```

You must specify the version of Spring Cloud Data Flow server that you want to deploy.
To do so, change the version as you like. This document is based on the `%dataflow-version%` release. You can use the docker `latest` tag for `BUILD-SNAPSHOT` releases.
The Skipper service should be running and the `SPRING_CLOUD_SKIPPER_CLIENT_SERVER_URI` property in `src/kubernetes/server/server-deployment.yaml` should point to it.

The Data Flow Server uses the Fabric8 Java client library to connect to the Kubernetes cluster.
There are [several ways to configure the client](https://github.com/fabric8io/kubernetes-client#configuring-the-client) to connect the cluster.
We use environment variables to set the values needed when deploying the Data Flow server to Kubernetes. We also use
the [Spring Cloud Kubernetes library](https://github.com/spring-cloud/spring-cloud-kubernetes) to access the Kubernetes
[`ConfigMap`](https://kubernetes.io/docs/user-guide/configmap/) and
[`Secrets`](https://kubernetes.io/docs/user-guide/secrets/) settings.

The `ConfigMap` settings for RabbitMQ are specified in the `src/kubernetes/skipper/skipper-config-rabbit.yaml` file and for Kafka in
the `src/kubernetes/skipper/skipper-config-kafka.yaml` file.

MariaDB secrets are located in the `src/kubernetes/mariadb/mariadb-secrets.yaml` file.
If you modified the password for MariaDB, you should change it in the `src/kubernetes/maria/mariadb-secrets.yaml` file.
Any secrets have to be provided in base64 encoding.

To create the configuration map with the default settings, run the following
command:

```
kubectl create -f src/kubernetes/server/server-config.yaml
```

Now you need to create the server deployment, by running the following
commands:

```
kubectl create -f src/kubernetes/server/server-svc.yaml
kubectl create -f src/kubernetes/server/server-deployment.yaml
```

You can use `kubectl get all -l app=scdf-server` to verify that the
deployment, pod, and service resources are running.

You can use the `kubectl get svc scdf-server` command to locate the
`EXTERNAL_IP` address assigned to `scdf-server`. You can use that
address later to connect from the shell. The following example (with
output) shows how to do so:

```
kubectl get svc scdf-server
NAME         CLUSTER-IP       EXTERNAL-IP       PORT(S)    AGE
scdf-server  10.103.246.82    130.211.203.246   80/TCP     4m
```

In this case, the URL you need to use is `https://130.211.203.246`.

If you use Minikube, you do not have an external load balancer, and the
`EXTERNAL_IP` shows as `<pending>`. You need to use the `NodePort`
assigned for the `scdf-server` service. You can use the following
command (shown with its output) to look up the URL to use:

```
minikube service --url scdf-server
https://192.168.99.100:31991
```

If you see the following message, `❗ Because you are using a Docker driver on darwin, the terminal needs to be open to run it.`,
Then use the following command instead:

```
kubectl port-forward <scdf-server pod name> 9393:80
```

## Shut Down and Cleanup Data Flow

### Stop and Cleanup RabbitMQ

When using RabbitMQ, use `kubectl delete all -l app=rabbitmq` to clean up RabbitMQ.

### Stop and Cleanup Kafka

When using Kafka, use `kubectl delete all -l app=kafka` to clean up Kafka.

### Stop and Cleanup MariaDB

Use `kubectl delete all,pvc,secrets -l app=mariadb` to clean up Mariadb.

### Stop and Cleanup Prometheus Proxy

You can use `kubectl delete all,cm,svc -l app=prometheus-proxy` to clean up the Prometheus proxy.
To cleanup roles, bindings, and the service account for the Prometheus proxy, run the following command:

```
kubectl delete clusterrole,clusterrolebinding,sa -l app=prometheus-proxy
```

### Stop and Cleanup Prometheus

Use `kubectl delete all,cm,svc -l app=prometheus` to clean up Prometheus.

Use the following when it is time to clean up prometheus' cluster roles and role bindings:

```
kubectl delete clusterrole,clusterrolebinding,sa -l app=prometheus
```

### Stop and Cleanup Grafana

You can use `kubectl delete all,cm,svc,secrets -l app=grafana` to clean up Grafana.

### Stop and Cleanup Skipper

You can use `kubectl delete all,cm -l app=skipper` to clean up Skipper.

### Stop and Cleanup Data Flow Server

#### Cleanup Roles and Bindings for Data Flow

To clean up roles, bindings and the service account, use the following
commands:

```
kubectl delete role scdf-role
kubectl delete rolebinding scdf-rb
kubectl delete serviceaccount scdf-sa
```

#### Stop and Cleanup Data Flow Server Application

You can use `kubectl delete all,cm -l app=scdf-server` to clean up the Data Flow Server.
