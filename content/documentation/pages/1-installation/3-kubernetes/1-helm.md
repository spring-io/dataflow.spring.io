---
path: 'installation/kubernetes/helm'
title: 'Helm'
description: 'Installation using Helm'
---

# Helm

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

```bash
helm init
```

To verify that the `Tiller` pod is running, run the following command:

```bash
kubectl get pod --namespace kube-system
```

You should see the `Tiller` pod running.

### Installing the Spring Cloud Data Flow Server and Required Services

Before you install Spring Cloud Data Flow, you need to update the Helm
repository and install the chart for Spring Cloud Data Flow.

To update the `Helm` repository, run the following command:

```bash
helm repo update
```

To install the chart for Spring Cloud Data Flow, run the following
command:

```bash
helm install --name my-release stable/spring-cloud-data-flow
```

#### Configuring Helm

As of Spring Cloud Data Flow 1.7.0, the `Helm` chart has been promoted to the `Stable` repository. To install a previous version, you need

> access to the incubator repository. To add this repository to your `Helm` set and install the chart, run the following commands:

```bash
helm repo add incubator https://kubernetes-charts-incubator.storage.googleapis.com
helm repo update
helm install --name my-release incubator/spring-cloud-data-flow
```

<!--TIP-->

**Setting server.service.type**

If you run on a Kubernetes cluster without a load balancer, you can
override the service type to use `NodePort`. To do so, add the
`--set server.service.type=NodePort` override, as follows:

<!--END_TIP-->

```bash
helm install --name my-release --set server.service.type=NodePort stable/spring-cloud-data-flow
```

##### Helm RBAC setting

If you run on a Kubernetes cluster without RBAC, you should set `rbac.create` to `false`. By default, it is set to
`true` (based on best practices). To do so, add the `--set rbac.create=false` override, as follows:

```bash
helm install --name my-release --set server.service.type=NodePort --set rbac.create=false stable/spring-cloud-data-flow
```

##### Using Kafka

If you prefer to use Kafka rather than RabbitMQ as the messaging middleware, you can override properties as shown below. RabbitMQ is enabled by default.

```bash
helm install --name my-release --set kafka.enabled=true,rabbitmq.enabled=false stable/spring-cloud-data-flow
```

#### Specify Data Flow version

If you wish to specify a version of Spring Cloud Data Flow other than the current GA release, you can set the `server.version` (replacing `stable` with `incubator` if needed), as follows:

```bash
helm install --name my-release stable/spring-cloud-data-flow --set server.version=<version-you-want>
```

<!--TIP-->

**Full chart options**

To see all of the settings that you can configure on the Spring Cloud Data Flow chart, view the
[README](https://github.com/kubernetes/charts/tree/master/stable/spring-cloud-data-flow/README.md).

<!--END_TIP-->

#### Version Compatibility

The following listing shows Spring Cloud Data Flow’s Kubernetes version compatibility with the respective Helm Chart releases:

|                       | Chart 0.1.x | Chart 0.2.x | Chart 1.0.x | Chart 2.0.x |
| --------------------- | :---------: | :---------: | :---------: | :---------: |
| SCDF-K8S-Server 1.2.x |     ✅      |     ❌      |     ❌      |     ❌      |
| SCDF-K8S-Server 1.3.x |     ❌      |     ✅      |     ❌      |     ❌      |
| SCDF-K8S-Server 1.4.x |     ❌      |     ✅      |     ❌      |     ❌      |
| SCDF-K8S-Server 1.5.x |     ❌      |     ✅      |     ❌      |     ❌      |
| SCDF-K8S-Server 1.6.x |     ❌      |     ✅      |     ❌      |     ❌      |
| SCDF-K8S-Server 1.7.x |     ❌      |     ❌      |     ✅      |     ❌      |
| SCDF-K8S-Server 2.0.x |     ❌      |     ❌      |     ❌      |     ✅      |

#### Expected output

You should see the following output:

```bash
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
```

<!--NOTE-->

Get the application URL by running these commands:

```bash
export SERVICE_IP=$(kubectl get svc --namespace default my-release-data-flow-server -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo http://$SERVICE_IP:80
```

It may take a few minutes for the LoadBalancer IP to be available.
You can watch the status of the server by running `kubectl get svc -w my-release-data-flow-server`

<!--END_NOTE-->

You have just created a new release in the default namespace of your
Kubernetes cluster. The `NOTES` section gives instructions for
connecting to the newly installed server. It takes a couple of minutes
for the application and its required services to start. You can check on
the status by issuing a `kubectl get pod -w` command. You need to wait
for the `READY` column to show `1/1` for all pods. Once that is done,
you can connect to the Data Flow server with the external IP listed by
the `kubectl get svc my-release-data-flow-server` command. The default
username is `user`, and its password is `password`.

<!--TIP-->

If you run on Minikube, you can use the following command to get the URL for the server:

<!--END_TIP-->

```bash
minikube service --url my-release-data-flow-server
```

To see what `Helm` releases you have running, you can use the
`helm list` command. When it is time to delete the release, run
`helm delete my-release`. This command removes any resources created for
the release but keeps release information so that you can roll back any
changes by using a `helm rollback my-release 1` command. To completely
delete the release and purge any release metadata, you can use
`helm delete my-release --purge`.

<!--TIP-->

**Secret management**

There is an [issue](https://github.com/kubernetes/charts/issues/980)
with generated secrets that are used for the required services getting
rotated on chart upgrades. To avoid this issue, set the password for
these services when installing the chart. You can use the following
command to do so:

<!--END_TIP-->

```bash
helm install --name my-release \
    --set rabbitmq.rabbitmqPassword=rabbitpwd \
    --set mysql.mysqlRootPassword=mysqlpwd incubator/spring-cloud-data-flow
```

## Register prebuilt applications

All the prebuilt streaming applications:

- Are available as Apache Maven artifacts or Docker images.
- Use RabbitMQ or Apache Kafka.
- Support monitoring via Prometheus and InfluxDB.
- Contain metadata for application properties used in the UI and code completion in the shell.

Applications can be registered individually using the `app register` functionality or as a group using the `app import` functionality.
There are also `dataflow.spring.io` links that represent the group of prebuilt applications for a specific release which is useful for getting started.

You can register applications using the UI or the shell.
Even though we are only using two prebuilt applications, we will register the full set of prebuilt applications.

The easiest way to install Data Flow on Kubernetes is using the Helm chart that uses RabbitMQ as the default messaging middleware.
The command to import the Kafka version of the applications is

```bash
dataflow:>app import --uri https://dataflow.spring.io/kafka-docker-latest
```

Change `kafka` to `rabbitmq` in the above URL if you set `kafka.endabled=true` in the helm chart or followed the manual `kubectl` based installation instructions for installing Data Flow on Kubernetes and chose to use Kafka as the messaging middleware.

<!--TIP-->

Only applications registered with a `--uri` property
pointing to a Docker resource are supported by the Data Flow Server
for Kubernetes. However, we do support Maven resources for the
`--metadata-uri` property, which is used to list the properties
supported by each application. For example, the following application
registration is valid:

```bash
app register --type source --name time --uri docker://springcloudstream/time-source-rabbit:{docker-time-source-rabbit-version} --metadata-uri maven://org.springframework.cloud.stream.app:time-source-rabbit:jar:metadata:{docker-time-source-rabbit-version}
```

Any application registered with a Maven, HTTP, or File resource or the executable jar (by using a `--uri` property prefixed with
`maven://`, `http://` or `file://`) is **_not supported_**.

<!--END_TIP-->

## Application and Server Properties

This section covers how you can customize the deployment of your
applications. You can use a number of properties to influence settings
for the applications that are deployed. Properties can be applied on a
per-application basis or in the appropriate server configuration for all
deployed applications.

<!--TIP-->

Properties set on a per-application basis always take precedence over
properties set as the server configuration. This arrangement lets you
override global server level properties on a per-application basis.

<!--END_TIP-->

Properties to be applied for all deployed Tasks are defined in the
`src/kubernetes/server/server-config.yaml` file and for Streams
in `src/kubernetes/skipper/skipper-config-(binder).yaml`. Replace
`(binder)` with the messaging middleware you are using — for example,
`rabbit` or `kafka`.

### Memory and CPU Settings

Applications are deployed with default memory and CPU settings. If
needed, these values can be adjusted. The following example shows how to
set `Limits` to `1000m` for `CPU` and `1024Mi` for memory and `Requests`
to `800m` for CPU and `640Mi` for memory:

```properties
deployer.<app>.kubernetes.limits.cpu=1000m
deployer.<app>.kubernetes.limits.memory=1024Mi
deployer.<app>.kubernetes.requests.cpu=800m
deployer.<app>.kubernetes.requests.memory=640Mi
```

Those values results in the following container settings being used:

```properties
Limits:
cpu: 1
memory: 1Gi
Requests:
cpu: 800m
memory: 640Mi
```

You can also control the default values to which to set the `cpu` and
`memory` globally.

The following example shows how to set the CPU and memory for streams:

```yaml
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
```

The following example shows how to set the CPU and memory for tasks:

```yaml
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
```

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

```properties
deployer.<app>.kubernetes.environmentVariables=JAVA_TOOL_OPTIONS=-Xmx1024m
```

<!--TIP-->

The `environmentVariables` property accepts a comma-delimited string.
If an environment variable contains a value which is also a
comma-delimited string, it must be enclosed in single quotation marks — for example,

```properties
spring.cloud.deployer.kubernetes.environmentVariables=spring.cloud.stream.kafka.binder.brokers='somehost:9092, anotherhost:9093'
```

<!--END_TIP-->

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

```properties
deployer.<app>.kubernetes.livenessProbePath=/health
deployer.<app>.kubernetes.livenessProbeDelay=120
deployer.<app>.kubernetes.livenessProbePeriod=20
```

You can declare the same as part of the server global configuration for
streams, as the following example shows:

```yaml
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
```

Similarly, you can swap `liveness` for `readiness` to override the
default `readiness` settings.

By default, port 8080 is used as the probe port. You can change the
defaults for both `liveness` and `readiness` probe ports by using
deployer properties, as the following example shows:

```properties
deployer.<app>.kubernetes.readinessProbePort=7000
deployer.<app>.kubernetes.livenessProbePort=7000
```

You can declare the same as part of the global configuration for
streams, as the following example shows:

```yaml
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
```

<!--TIP-->

By default, the `liveness` and `readiness` probe paths use Spring Boot
2.x+ actuator endpoints. To use Spring Boot 1.x actuator endpoint
paths, you must adjust the `liveness` and `readiness` values, as the
following example shows (replace `<app>` with the name of your
application):

<!--END_TIP-->

```properties
deployer.<app>.kubernetes.livenessProbePath=/health
deployer.<app>.kubernetes.readinessProbePath=/info
```

To automatically set both `liveness` and `readiness` endpoints on a
per-application basis to the default Spring Boot 1.x paths, you can set
the following property:

```properties
deployer.<app>.kubernetes.bootMajorVersion=1
```

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

    ```bash
    echo -n "user:pass" | base64
    dXNlcjpwYXNz
    ```

2.  With the encoded credentials, create a file (for example,
    `myprobesecret.yml`) with the following contents:

    ```
    apiVersion: v1
    kind: Secret
    metadata:
    name:
    myprobesecret type:
    Opaque data:
    credentials: GENERATED_BASE64_STRING
    ```

3.  Replace `GENERATED_BASE64_STRING` with the base64-encoded value
    generated earlier.

4.  Create the secret by using `kubectl`, as the following example
    shows:

    ```bash
    kubectl create -f ./myprobesecret.yml
    secret "myprobesecret" created
    ```

5.  Set the following deployer properties to use authentication when
    accessing probe endpoints, as the following example shows:

    ```properties
    deployer.<app>.kubernetes.probeCredentialsSecret=myprobesecret
    ```

    Replace `<app>` with the name of the application to which to
    apply authentication.

### Using `SPRING_APPLICATION_JSON`

You can use a `SPRING_APPLICATION_JSON` environment variable to set Data
Flow server properties (including the configuration of maven repository
settings) that are common across all of the Data Flow server
implementations. These settings go at the server level in the container
`env` section of a deployment YAML. The following example shows how to
do so:

```yaml
env:
  - name: SPRING_APPLICATION_JSON
    value: |-
    {
      "maven": {
        "local-repository": null,
        "remote-repositories": {
          "repo1": {
            "url": "https://repo.spring.io/libs-snapshot"
          }
        }
      }
    }
```

### Private Docker Registry

You can pull Docker images from a private registry on a per-application
basis. First, you must create a secret in the cluster. Follow the [Pull
an Image from a Private
Registry](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)
guide to create the secret.

Once you have created the secret, you can use the `imagePullSecret`
property to set the secret to use, as the following example shows:

```properties
deployer.<app>.kubernetes.imagePullSecret=mysecret
```

Replace `<app>` with the name of your application and `mysecret` with
the name of the secret you created earlier.

You can also configure the image pull secret at the global server level.

The following example shows how to do so for streams:

```yaml
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
```

The following example shows how to do so for tasks:

```yaml
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
```

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

```properties
deployer.<app>.kubernetes.podAnnotations=annotationName:annotationValue
deployer.<app>.kubernetes.serviceAnnotations=annotationName:annotationValue,annotationName2:annotationValue2
deployer.<app>.kubernetes.jobAnnotations=annotationName:annotationValue
```

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

<!--TIP-->

In all cases, environment variables defined at the server-level
configuration and on a per-application basis are set onto the
container as is.

<!--END_TIP-->

You can configure applications as follows:

```properties
deployer.<app>.kubernetes.entryPointStyle=<Entry Point Style>
```

Replace `<app>` with the name of your application and
`<Entry Point Style>` with your desired entry point style.

You can also configure the entry point style at the global server level.

The following example shows how to do so for streams:

```yaml
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
```

The following example shows how to do so for tasks:

```yaml
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
```

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

<!--TIP-->

When you use the `boot` Entry Point Style, the `deployer.<app>.kubernetes.environmentVariables` property must not
contain `SPRING_APPLICATION_JSON`.

<!--END_TIP-->

### Deployment Service Account

You can configure a custom service account for application deployments
through properties. You can use an existing service account or create a
new one. One way to create a service account is by using `kubectl`, as
the following example shows:

```bash
kubectl create serviceaccount myserviceaccountname
serviceaccount "myserviceaccountname" created
```

Then you can configure individual applications as follows:

```properties
deployer.<app>.kubernetes.deploymentServiceAccountName=myserviceaccountname
```

Replace `<app>` with the name of your application and
`myserviceaccountname` with your service account name.

You can also configure the service account name at the global server
level.

The following example shows how to do so for streams:

```yaml
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
```

The following example shows how to do so for tasks:

```yaml
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
```

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

```properties
deployer.<app>.kubernetes.imagePullPolicy=Always
```

Replace `<app>` with the name of your application and `Always` with your
desired image pull policy.

You can configure an image pull policy at the global server level.

The following example shows how to do so for streams:

```yaml
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
```

The following example shows how to do so for tasks:

```yaml
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
```

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

```properties
deployer.<app>.kubernetes.deploymentLabels=myLabelName:myLabelValue
```

Replace `<app>` with the name of your application, `myLabelName` with
your label name, and `myLabelValue` with the value of your label.

Additionally, you can apply multiple labels, as the following example
shows:

```properties
deployer.<app>.kubernetes.deploymentLabels=myLabelName:myLabelValue,myLabelName2:myLabelValue2
```

## Monitoring

To learn more about the monitoring experience in Data Flow using Prometheus running on Kubernetes, please refer to the [Stream Monitoring](%currentPath%/feature-guides/streams/monitoring/#kubernetes) feature guide.
