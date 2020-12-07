---
path: 'installation/kubernetes/helm'
title: 'Helm'
description: 'Installation using Helm'
---

## Helm Installation

<!--NOTE-->

The Helm project has ended support for Helm 2 as of November, 2020.
As of Spring Cloud Data Flow 2.7.0, the chart is based on Helm 3, dropping support for Helm 2.

You must migrate from Helm 2 to Helm 3.
To prepare for the migration, you should read the [Helm v2 to v3 Migration Guide](https://helm.sh/docs/topics/v2_v3_migration/).
Additionally, you can find some helpful tips on data migration and upgrades in the [post-migration issues](https://docs.bitnami.com/tutorials/resolve-helm2-helm3-post-migration-issues/) article.

As of Spring Cloud Data Flow 2.6.1, the Bitnami team maintains the Helm chart.
To report bugs or request features, use the [Bitnami Issue Tracker](https://github.com/bitnami/charts/issues).

<!--END_NOTE-->

Spring Cloud Data Flow offers a [Helm Chart](https://bitnami.com/stack/spring-cloud-dataflow/helm)
for deploying the Spring Cloud Data Flow server and its required services to a Kubernetes Cluster.

The following sections cover how to initialize Helm and install Spring Cloud Data Flow on a Kubernetes cluster.

<!--TIP-->

If you use Minikube, see [Setting Minikube Resources](%currentPath%/installation/kubernetes/creating-a-cluster/#setting-minikube-resources) for details on CPU and RAM resource requirements.

<!--END_TIP-->

### Installing Spring Cloud Data Flow Server and Required Services

<!--TIP-->

You should review the following documentation and adjust any parameter customizations that have been made for your environment or how they may differ from the legacy official Helm chart. Value names, defaults, and so on may have changed during the Bitnami chart migration. You can find more information in the [Parameter](%currentPath%/installation/kubernetes/helm/#parameters) tables and the [Upgrading](%currentPath%/installation/kubernetes/helm/#upgrading) and [Notable Changes](%currentPath%/installation/kubernetes/helm/#notable-changes) sections.

<!--END_TIP-->

<!--TEMPLATE:https://raw.githubusercontent.com/bitnami/charts/master/bitnami/spring-cloud-dataflow/README.md-->

#### Expected output

After issuing the `helm install` command, you should see output similar to the following:

```
NAME: my-release
LAST DEPLOYED: Sun Nov 22 21:12:29 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
** Please be patient while the chart is being deployed **
```
Spring Cloud Data Flow chart was deployed by using the following components:

- Spring Cloud Data Flow server
- Spring Cloud Skipper server

You can access Spring Cloud Data Flow through the following DNS name from within your cluster:

    my-release-spring-cloud-dataflow-server.default.svc.cluster.local (port 8080)

To access Spring Cloud Data Flow dashboard from outside the cluster, run the following commands:

1. Get the Data Flow dashboard URL by running the following commands:

    export SERVICE_PORT=$(kubectl get --namespace default -o jsonpath="{.spec.ports[0].port}" services my-release-spring-cloud-dataflow-server)
    kubectl port-forward --namespace default svc/my-release-spring-cloud-dataflow-server ${SERVICE_PORT}:${SERVICE_PORT} &
    echo "http://127.0.0.1:${SERVICE_PORT}/dashboard"

2. Open a browser and access the Data Flow dashboard by using the obtained URL.

<!--NOTE-->

If you prefer, you can change the Spring Cloud Data Flow service type by passing the following `set` argument to `helm install`:

```bash
--set server.service.type=ServiceType
```

Where `ServiceType` would be a valid service name (for example `LoadBalancer`, `NodePort`, and so on).

It may take a few minutes for the LoadBalancer IP to be available.
You can watch the status of the server by running `kubectl get svc -w my-release-spring-cloud-dataflow-server`

<!--END_NOTE-->

<!--NOTE-->

If you use Minikube without load balancer support, you can use the following command to get the URL for the server:

```bash
minikube service --url my-release-spring-cloud-dataflow-server
```

<!--END_NOTE-->

You have now created a new release in the default namespace of your Kubernetes cluster.
It takes a couple of minutes for the application and its required services to start.
You can check on the status by issuing a `kubectl get pod -w` command.
You need to wait for the `READY` column to show `1/1` for all pods.

When all pods are ready, you can access the Spring Cloud Data Flow dashboard by accessing `http://<SERVICE_ADDRESS>/dashboard`, where `<SERVICE_ADDRESS>` is the address returned by either the `kubectl` or `minikube` commands shown earlier.

#### Version Compatibility

The following listing shows Spring Cloud Data Flow’s version compatibility with the respective Helm Chart releases:

<!--NOTE-->

Deprecated chart mappings from official Helm repository:

<!--END_NOTE-->

| SCDF Version          | Chart Version |
| --------------------- | :-----------: |
| SCDF-K8S-Server 1.7.x |     1.0.x     |
| SCDF-K8S-Server 2.0.x |     2.2.x     |
| SCDF-K8S-Server 2.1.x |     2.3.x     |
| SCDF-K8S-Server 2.2.x |     2.4.x     |
| SCDF-K8S-Server 2.3.x |     2.5.x     |
| SCDF-K8S-Server 2.4.x |     2.6.x     |
| SCDF-K8S-Server 2.5.x |     2.7.x     |
| SCDF-K8S-Server 2.6.x |     2.8.x     |

<!--NOTE-->

Bitnami chart mappings:

<!--END_NOTE-->

| SCDF Version          | Chart Version |
| --------------------- | :-----------: |
| SCDF-K8S-Server 2.6.x |     1.1.x     |
| SCDF-K8S-Server 2.7.x |     2.0.x     |

## Registering Prebuilt Applications

All of the prebuilt streaming applications:

- Are available as Apache Maven artifacts or Docker images.
- Use RabbitMQ or Apache Kafka.
- Support monitoring via Prometheus and InfluxDB.
- Contain metadata for application properties used in the UI and code completion in the shell.

You can register applications individually by using the `app register` functionality or as a group by using the `app import` functionality.
There are also `dataflow.spring.io` links that represent the group of prebuilt applications for a specific release, which is useful for getting started.

You can register applications by using either the UI or the shell.
Even though we use only two prebuilt applications, we register the full set of prebuilt applications.

The easiest way to install Data Flow on Kubernetes is to use the Helm chart that uses RabbitMQ as the default messaging middleware.
The command to import the Kafka version of the applications is as follows:

```bash
dataflow:>app import --uri https://dataflow.spring.io/kafka-docker-latest
```

Change `kafka` to `rabbitmq` in the above URL if you set `kafka.enabled=true` in the helm chart or followed the manual `kubectl` based installation instructions for installing Data Flow on Kubernetes and chose to use Kafka as the messaging middleware.

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
override global server-level properties on a per-application basis.

<!--END_TIP-->

Properties to be applied for all deployed Tasks are defined in the
`src/kubernetes/server/server-config.yaml` file and for Streams
in `src/kubernetes/skipper/skipper-config-(binder).yaml`. Replace
`(binder)` with the messaging middleware you are using —- for example,
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

The following example shows how to set the CPU and memory for streams and tasks:

<!--TABS-->

<!--Streams-->

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

<!--Tasks-->

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

<!--END_TABS-->

The settings we have used so far affect only the settings for the
container. They do not affect the memory setting for the JVM process in
the container. If you would like to set JVM memory settings, you can
provide an environment variable to do so. See the next section for
details.

### Environment Variables

To influence the environment settings for a given application, you can
use the `spring.cloud.deployer.kubernetes.environmentVariables` deployer
property. For example, a common requirement in production settings is to
influence the JVM memory arguments. You can do so by using the
`JAVA_TOOL_OPTIONS` environment variable, as follows:

```properties
deployer.<app>.kubernetes.environmentVariables=JAVA_TOOL_OPTIONS=-Xmx1024m
```

<!--TIP-->

The `environmentVariables` property accepts a comma-delimited string.
If an environment variable contains a value that is also a
comma-delimited string, it must be enclosed in single quotation marks —- for example,

```properties
spring.cloud.deployer.kubernetes.environmentVariables=spring.cloud.stream.kafka.binder.brokers='somehost:9092, anotherhost:9093'
```

<!--END_TIP-->

Doin so overrides the JVM memory setting for the desired `<app>` (replace
`<app>` with the name of your application).

### Liveness and Readiness Probes

The `liveness` and `readiness` probes use paths called `/health` and
`/info`, respectively. They use a `delay` of `10` for both and a
`period` of `60` and `10`, respectively. You can change these defaults
when you deploy the stream by using deployer properties. The liveness and
readiness probes are applied only to streams.

The following example changes the `liveness` probe (replace `<app>` with
the name of your application) by setting deployer properties:

```properties
deployer.<app>.kubernetes.livenessProbePath=/health
deployer.<app>.kubernetes.livenessProbeDelay=120
deployer.<app>.kubernetes.livenessProbePeriod=20
```

You can declare the same as part of the server global configuration for
streams, as follows:

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
defaults for both `liveness` and `readiness` probe ports by setting
deployer properties, as follows:

```properties
deployer.<app>.kubernetes.readinessProbePort=7000
deployer.<app>.kubernetes.livenessProbePort=7000
```

You can declare the same as part of the global configuration for
streams, as follows:

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
paths, you must adjust the `liveness` and `readiness` values, as
follows (replace `<app>` with the name of your
application):

```properties
deployer.<app>.kubernetes.livenessProbePath=/health
deployer.<app>.kubernetes.readinessProbePath=/info
```

<!--END_TIP-->

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

4.  Create the secret by using `kubectl`, as follows:

    ```bash
    kubectl create -f ./myprobesecret.yml
    secret "myprobesecret" created
    ```

5.  Set the following deployer properties to use authentication when
    accessing probe endpoints, as follows:

    ```properties
    deployer.<app>.kubernetes.probeCredentialsSecret=myprobesecret
    ```

    Replace `<app>` with the name of the application to which to
    apply authentication.

### Using `SPRING_APPLICATION_JSON`

You can use a `SPRING_APPLICATION_JSON` environment variable to set Data
Flow server properties (including the configuration of Maven repository
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
property to set the secret to use, as follows:

```properties
deployer.<app>.kubernetes.imagePullSecret=mysecret
```

Replace `<app>` with the name of your application and `mysecret` with
the name of the secret you created earlier.

You can also configure the image pull secret at the global server level.

The following example shows how to do so for streams and tasks:

<!--TABS-->

<!--Streams (Skipper configuration) -->

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

<!--Tasks (DataFlow configuration) -->

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

<!--END_TABS-->

Replace `mysecret` with the name of the secret you created earlier.

#### Volume Mounted Secretes

Data Flow uses the [application metadata](%currentPath%/feature-guides/general/application-metadata/) stored in a container image label.
To access the metadata labels in a private registry, you have to extend the Data Flow deployment configuration and mount the registry secrets as a [Secrets PropertySource](https://cloud.spring.io/spring-cloud-static/spring-cloud-kubernetes/2.0.0.M1/reference/html/#secrets-propertysource):

```yaml
    spec:
      containers:
      - name: scdf-server
        ...
        volumeMounts:
          - name: mysecret
            mountPath: /etc/secrets/mysecret
            readOnly: true
        ...
      volumes:
        - name: mysecret
          secret:
            secretName: mysecret
```

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

- `shell`: Passes all application properties and command line arguments
  as environment variables. Each of the application and command line
  argument properties is transformed into an uppercase string, and `.`
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

Replace `entryPointStyle` with the desired entry point style.

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
new one. One way to create a service account is by using `kubectl`, as follows:

```bash
kubectl create serviceaccount myserviceaccountname
serviceaccount "myserviceaccountname" created
```

Then you can configure individual applications, as follows:

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

Additionally, you can apply multiple labels, as follows:

```properties
deployer.<app>.kubernetes.deploymentLabels=myLabelName:myLabelValue,myLabelName2:myLabelValue2
```

### NodePort

Applications are deployed with a `Service` type of [ClusterIP](https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types), which is the default Kubernetes `Service` type if not defined otherwise.
`ClusterIP` services are only reachable from within the cluster itself.

To expose the deployed application to be available externally, one option is to use `NodePort`.
See the [NodePort](https://kubernetes.io/docs/concepts/services-networking/service/#nodeport) documentation for more information.

The following example shows how you can individually configure applications by using Kubernetes assigned ports:

```properties
deployer.<app>.kubernetes.createNodePort=true
```

Replace `<app>` with the name of your application.

Additionally, you can define the port to use for the `NodePort` `Service`, as follows:

```properties
deployer.<app>.kubernetes.createNodePort=31101
```

Replace `<app>` with the name of your application and the value of `31101` with your desired port.

<!--NOTE-->

When defining the port manually, the port must not already be in use and be within the defined `NodePort` range.
Per [NodePort](https://kubernetes.io/docs/concepts/services-networking/service/#nodeport) the default port range is 30000-32767.

<!--END_NOTE-->

## Monitoring

To learn more about the monitoring experience in Data Flow with Prometheus running on Kubernetes, see the [Stream Monitoring](%currentPath%/feature-guides/streams/monitoring/#kubernetes) or [Task Monitoring](%currentPath%/feature-guides/batch/monitoring/#kubernetes) guides.
