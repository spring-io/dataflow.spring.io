---
path: 'applications/application-metadata/'
title: 'Application Metadata'
description: 'Create and use application properties metadata'
---

# Application Metadata

Spring Boot provides support for bundling metadata about an application's configuration properties within the executable jar, used for tooling and document generation.
In this section we discuss how to configure and build an application, including how to provide application configuration metadata as a label in a container image, to work with Data Flow.

For your own applications, you can easily [generate](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-configuration-metadata.html#configuration-metadata-annotation-processor) application [configuration metadata](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-configuration-metadata.html#configuration-metadata) from classes annotated with `@ConfigurationProperties` by using the `spring-boot-configuration-processor` library. This library includes a Java annotation processor which is invoked when you compile your project to generate the configuration metadata file, stored in the uber-jar as `META-INF/spring-configuration-metadata.json`.

To use the configuration processor, include the following dependency in your application's `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
```

## Exposing Application Properties for Data Flow

Stream and Task applications are Spring Boot applications that provide [common application properties](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html), as well as [common properties used by Data Flow](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#spring-cloud-dataflow-global-properties), along with others included with application dependencies. For a typical application, the complete set of available properties can be exhaustive. This presents a usability challenge for Data Flow tooling. For this reason, application configuration features in the Data Flow UI and shell rely on additional configuration property metadata to ensure that only the most relevant configuration properties are included (by default) when providing contextual help, such as listing available properties, handling auto completion, and performing front-end validation.

### Data Flow Configuration Metadata

To define which application properties are most relavant to Data Flow, create a file named `META-INF/dataflow-configuration-metadata.properties` in the project resource directory. This file must include one or both of the following properties:

- `configuration-properties.classes`, containing a comma-separated list of fully qualified `@ConfigurationProperties` class names.
- `configuration-properties.names`, containing a comma-separated list of property names. This may be the full property name, such as `server.port`, or a prefix, such as `spring.jmx`, to include all related properties.

The [Spring Cloud Stream applications](https://github.com/spring-cloud/stream-applications) Git repository is a good place to look for examples. For instance, the jdbc sink's [dataflow-configuration-metadata.properties](https://github.com/spring-cloud/stream-applications/blob/master/applications/sink/jdbc-sink/src/main/resources/META-INF/dataflow-configuration-metadata.properties) file contains:

```bash
configuration-properties.classes=org.springframework.cloud.fn.consumer.jdbc.JdbcConsumerProperties
configuration-properties.names=\
spring.datasource.url,\
spring.datasource.driver-class-name,\
spring.datasource.username,\
spring.datasource.password,\
spring.datasource.schema,\
spring.datasource.data,\
spring.datasource.initialization-mode
```

Here, we want to expose specific `@ConfigurationProperties` used by the sink, along with some standard `spring.datasource` configuration properties needed to configure the JDBC datasource.

### Packaging Configuration Metadata

The common steps for packaging configuration properties in an executable jar or container image are:

1.  Add Boot's Configuration processor to your pom.xml as explained [above](#application-metadata)

2.  Specify properties which properties you want to expose, as explained [above](#data-flow-configuration-metadata)

3.  Configure the `spring-cloud-app-starter-metadata-maven-plugin`, if necessary, as explained [here](#creating-metadata-artifacts)

The additional steps to create a label in a container image with the application metadata are:

1. Configure the `properties-maven-plugin`, as explained [here](#properties-maven-plugin), to load the `META-INF/spring-configuration-metadata-encoded.properties` as maven properties. Among other steps, it will load the `org.springframework.cloud.dataflow.spring.configuration.metadata.json` property.

2. Extend the `jib-maven-plugin` (or `docker-maven-plugin`) configuration, if necesary, as explained [here](#creating-metadata-artifacts).

## Dedicated Metadata Artifacts

Including the application metadata inside the uber jar has the downside of needing to download a potentially very large uber jar just to inspect the metadata. This can cause noticable delays when invoking certain Data Flow operations that require this metadata. Creating a separate jar that contains only the application metadata has several advantages:

- The metadata artifact is usually a few kilobytes, as opposed to megabytes for the actual application. Consequently, it is quicker to download, enabling quick response times when using Data Flow's UI and shell.

- A smaller size also helps in resource-constrained environments, such as Cloud Foundry, where the local disk size is often limited.

<!--TIP-->

For environments that use container images (for example, Kubernetes), Data Flow accesses the configured container registry through a REST API to query the metadata without having to download the image. Optionally, if you choose to create a dedicated metadata jar, Data Flow will use it.

<!--END_TIP-->

### Creating Metadata Artifacts

The `spring-cloud-app-starter-metadata-maven-plugin` plugin helps to prepare all necessary metadata files for your application.
Depending on the runtime, the metadata is packaged either as an separate companion artifact jar or as a configuration label inside the application's container image. To use the plugin, add the following to your `pom.xml`:

```xml
<plugin>
   <groupId>org.springframework.cloud</groupId>
   <artifactId>spring-cloud-dataflow-apps-metadata-plugin</artifactId>
   <version>1.0.2</version>
   <configuration>
      <storeFilteredMetadata>true</storeFilteredMetadata>
   </configuration>
   <executions>
      <execution>
         <id>aggregate-metadata</id>
         <phase>compile</phase>
         <goals>
            <goal>aggregate-metadata</goal>
         </goals>
      </execution>
   </executions>
</plugin>
```

<!--CAUTION-->

You must use this plugin in conjunction with the `spring-boot-configuration-processor` that creates the `spring-configuration-metadata.json` files. Be sure to configure both of them.

<!--END_CAUTION-->

<!--TIP-->

NOTE The Cloud Native [buildpack for spring-boot](https://github.com/paketo-buildpacks/spring-boot/blob/main/README.md), used by the Spring Boot (_version 2.4.1 + strongly recommended_) Maven Plugin [build-image](https://docs.spring.io/spring-boot/docs/current/maven-plugin/reference/htmlsingle/#build-image) goal, provides this metadata automatically for a properly configured application.

<!--END_TIP-->

### Metadata Jar File

For the uber-jar packaged applications, the plugin will create a companion artifact that contains the metadata. Specifically, it contains the Spring boot JSON file about configuration properties metadata and the dataflow configuration metadata file described in the previous section. The following example shows the contents of such an artifact, for the canonical log sink:

```shell
jar tvf log-sink-rabbit-3.0.0.BUILD-SNAPSHOT-metadata.jar
373848 META-INF/spring-configuration-metadata.json
   174 META-INF/dataflow-configuration-metadata.properties
```

<!--TIP-->

The `spring-cloud-app-starter-metadata-maven-plugin` plugin generates a ready-to-use application `metadata.jar` artifact. Make sure the plugin is configured in your application's pom.

<!--END_TIP-->

### Metadata Container Image Label

For applications packaged as container images, the `spring-cloud-app-starter-metadata-maven-plugin` copies the contents of the `spring-configuration-metadata.json` file as a configuration label in the generated application container image, as well as the exposed properties for Data Flow, under the `org.springframework.cloud.dataflow.spring.configuration.metadata.json` label. All the configuration metadata is included in the container image, so there is no need for a companion artifact.

At compile time, the plugin generates a `META-INF/spring-configuration-metadata-encoded.properties` file with a single property inside: `org.springframework.cloud.dataflow.spring.configuration.metadata.json`. The property value is the stringified, expoaed subset of the configuration metadata. The following listing shows a typical metadata JSON file:

```properties
org.springframework.cloud.dataflow.spring.configuration.metadata.json={\n  \"groups\": [{\n    \"name\": \"log\",\n    \"type\": \"org.springframework.cloud.stream.app.log.sink.LogSinkProperties\",\n    \"sourceType\": \"org.springframework.cloud.stream.app.log.sink.LogSinkProperties\"\n  }],\n  \"properties\": [\n    {\n      \"name\": \"log.expression\",\n      \"type\": \"java.lang.String\",\n      \"description\": \"A SpEL expression (against the incoming message) to evaluate as the logged message.\",\n      \"sourceType\": \"org.springframework.cloud.stream.app.log.sink.LogSinkProperties\",\n      \"defaultValue\": \"payload\"\n    },\n    {\n      \"name\": \"log.level\",\n      \"type\": \"org.springframework.integration.handler.LoggingHandler$Level\",\n      \"description\": \"The level at which to log messages.\",\n      \"sourceType\": \"org.springframework.cloud.stream.app.log.sink.LogSinkProperties\"\n    },\n    {\n      \"name\": \"log.name\",\n      \"type\": \"java.lang.String\",\n      \"description\": \"The name of the logger to use.\",\n      \"sourceType\": \"org.springframework.cloud.stream.app.log.sink.LogSinkProperties\"\n    }\n  ],\n  \"hints\": []\n}
```

#### Properties Maven Plugin

To turn this property into a Docker label, we first need to load it as a Maven property by using the `properties-maven-plugin` plugin:

```xml
<plugin>
    <groupId>org.codehaus.mojo</groupId>
    <artifactId>properties-maven-plugin</artifactId>
    <version>1.0.0</version>
    <executions>
        <execution>
            <phase>process-classes</phase>
            <goals>
                <goal>read-project-properties</goal>
            </goals>
            <configuration>
                <files>
                    <file>${project.build.outputDirectory}/META-INF/spring-configuration-metadata-encoded.properties</file>
                </files>
            </configuration>
        </execution>
    </executions>
</plugin>
```

#### Container Maven Plugin

With the help of the `fabric8:docker-maven-plugin` or `jib` Maven plugins, insert the `org.springframework.cloud.dataflow.spring.configuration.metadata.json` property into a Docker label with the same name:

<!--TABS-->

<!-- Jib Maven plugin -->

```xml
<plugin>
    <groupId>com.google.cloud.tools</groupId>
    <artifactId>jib-maven-plugin</artifactId>
    <version>2.0.0</version>
    <configuration>
        <from>
            <image>springcloud/openjdk</image>
        </from>
        <to>
            <image>springcloudstream/${project.artifactId}</image>
            <tags>
                <tag>3.0.0.BUILD-SNAPSHOT</tag>
            </tags>
        </to>
        <container>
            <creationTime>USE_CURRENT_TIMESTAMP</creationTime>
            <format>Docker</format>
            <labels>
                <org.springframework.cloud.dataflow.spring-configuration-metadata.json>
                    ${org.springframework.cloud.dataflow.spring.configuration.metadata.json}
                </org.springframework.cloud.dataflow.spring-configuration-metadata.json>
            </labels>
        </container>
    </configuration>
</plugin>

```

<!-- Fabric8 Maven plugin -->

NOTE: The `docker-maven-plugin` version must be at least `0.33.0` or newer!

```xml
<plugin>
    <groupId>io.fabric8</groupId>
    <artifactId>docker-maven-plugin</artifactId>
    <version>0.33.0</version>
    <configuration>
        <images>
            <image>
                <name>springcloudstream/${project.artifactId}:2.1.3.BUILD-SNAPSHOT</name>
                <build>
                    <from>springcloud/openjdk</from>
                    <volumes>
                        <volume>/tmp</volume>
                    </volumes>
                    <labels>
                        <org.springframework.cloud.dataflow.spring-configuration-metadata.json>
                          ${org.springframework.cloud.dataflow.spring.configuration.metadata.json}
                        </org.springframework.cloud.dataflow.spring-configuration-metadata.json>
                    </labels>
                    <entryPoint>
                        <exec>
                            <arg>java</arg>
                            <arg>-jar</arg>
                            <arg>/maven/log-sink-kafka.jar</arg>
                        </exec>
                    </entryPoint>
                    <assembly>
                        <descriptor>assembly.xml</descriptor>
                    </assembly>
                </build>
            </image>
        </images>
    </configuration>
</plugin>

```

<!--END_TABS-->

## Using Application Metadata

Once you have generated the application configuration metadata (either as a separate, companion artifact or embedded in the application container image as a configuration label), you may need some additional configuration to let Data Flow know where to look for it.

### Using Metadata Jar files

When registering a single app with the `app register` command, you can use the optional `--metadata-uri` option in the shell, as follows:

```shell
dataflow:>app register --name log --type sink
    --uri maven://org.springframework.cloud.stream.app:log-sink:2.1.0.RELEASE
    --metadata-uri maven://org.springframework.cloud.stream.app:log-sink:jar:metadata:2.1.0.RELEASE
```

When registering several files by using the `app import` command, the file should contain a `<type>.<name>.metadata` line in addition to each `<type>.<name>` line. Strictly speaking, doing so is optional (if some apps have it but some others do not, it works), but it is best practice.

The following example shows an uber jar app, where the metadata artifact is hosted in a Maven repository (retrieving it through `http://` or `file://` is equally possible).

```properties
source.http=maven://org.springframework.cloud.stream.app:log-sink:2.1.0.RELEASE
source.http.metadata=maven://org.springframework.cloud.stream.app:log-sink:jar:metadata:2.1.0.RELEASE
```

### Using Metadata Container Image Labels

When registering a single Docker app with the `app register` command, the Data Flow server automatically checks for metadata in the `org.springframework.cloud.dataflow.spring-configuration-metadata.json` configuration label:

```shell
dataflow:>app register --name log --type sink --uri container:springcloudstream/log-sink-rabbit:2.1.13.RELEASE
```

Configurations are specific for each target Container Registry provider or instance.

For a [private container registry](%currentPath%/installation/kubernetes/helm/#private-docker-registry) with volume-mounted secrets, the registry configurations are automatically inferred from the secrets.
In addition, `spring.cloud.dataflow.container.registry-configurations` has properties that let you explicitly configure multiple container registries, as follows:

#### Container Registry Support

Out of the box you can connect to various on-cloud and on-premise container registries such as [Harbor](https://goharbor.io), [Arifactory/JFrog](https://jfrog.com/integration/docker-registry), [Amazon ECR](https://aws.amazon.com/ecr/), [Azure Container Registry](https://azure.microsoft.com/en-us/services/container-registry) or [host your private registry](https://docs.docker.com/registry/deploying/).

As the different registries my impose different authentication schemas the following sections provide registry specific configuration details:

- [Docker Hub](https://hub.docker.com/) - public Docker Hub registry

<!--TABS-->

<!--Java properties-->

```yaml
- spring.cloud.dataflow.container.registry-configurations[default].registry-host=registry-1.docker.io
- spring.cloud.dataflow.container.registry-configurations[default].authorization-type=dockeroauth2
- spring.cloud.dataflow.container.registry-configurations[default].extra[registryAuthUri]=https://auth.docker.io/token?service=registry.docker.io&scope=repository:{repository}:pull&offline_token=1&client_id=shell
```

<!--Yaml-->

```yaml
spring:
  cloud:
    dataflow:
      container:
        registry-configurations:
          default:
            registry-host: registry-1.docker.io
            authorization-type: dockeroauth2
            extra:
              'registryAuthUri': 'https://auth.docker.io/token?service=registry.docker.io&scope=repository:{repository}:pull&offline_token=1&client_id=shell'
```

<!--END_TABS-->

This registry is used by default. If the image name does not provide the registry host prefix.
The public Docker hub repositories do not require username and password authorization.
The credentials, though, are required for the private Docker Hub repositories.

- [Harbor Registry](https://goharbor.io)

<!--TABS-->

<!--Java properties-->

```
- spring.cloud.dataflow.container.registry-configurations[harbor].registry-host=demo.goharbor.io
- spring.cloud.dataflow.container.registry-configurations[harbor].authorization-type=dockeroauth2
- spring.cloud.dataflow.container.registry-configurations[harbor].user=admin
- spring.cloud.dataflow.container.registry-configurations[harbor].secret=Harbor12345
```

<!--Yaml-->

```yaml
spring:
  cloud:
    dataflow:
      container:
        registry-configurations:
          harbor:
            registry-host: demo.goharbor.io
            authorization-type: dockeroauth2
            user: admin
            secret: Harbor12345
```

<!--END_TABS-->

The Harbor Registry configuration uses the OAuth2 Token authorization similar to DockerHub but on a different `registryAuthUri`. Later is automatically resolved at bootstrap, but you can override it like this:

<!--TABS-->

<!--Java properties-->

```
- spring.cloud.dataflow.container.registry-configurations[harbor].extra[registryAuthUri]=https://demo.goharbor.io/service/token?service=harbor-registry&scope=repository:{repository}:pull
```

<!--Yaml-->

```yaml
spring:
  cloud:
    dataflow:
      container:
        registry-configurations:
          harbor:
            extra:
              'registryAuthUri': https://demo.goharbor.io/service/token?service=harbor-registry&scope=repository:{repository}:pull
```

<!--END_TABS-->

- [Arifactory/JFrog Container Registry](https://jfrog.com/integration/docker-registry):

<!--TABS-->

<!--Java properties-->

```
- spring.cloud.dataflow.container.registry-configurations[myjfrog].registry-host=springsource-docker-private-local.jfrog.io
- spring.cloud.dataflow.container.registry-configurations[myjfrog].authorization-type=basicauth
- spring.cloud.dataflow.container.registry-configurations[myjfrog].user=[artifactory user]
- spring.cloud.dataflow.container.registry-configurations[myjfrog].secret=[artifactory encrypted password]
```

<!--Yaml-->

```yaml
spring:
  cloud:
    dataflow:
      container:
        registry-configurations:
          myjfrog:
            registry-host: springsource-docker-private-local.jfrog.io
            authorization-type: basicauth
            user: [artifactory user]
            secret: [artifactory encrypted password]
```

<!--END_TABS-->

NOTE: You need to create an [Encrypted Password](https://www.jfrog.com/confluence/display/JFROG/Centrally+Secure+Passwords) in JFrog.

- [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/):

<!--TABS-->

<!--Java properties-->

```
- spring.cloud.dataflow.container.registry-configurations[myecr].registry-host=283191309520.dkr.ecr.us-west-1.amazonaws.com
- spring.cloud.dataflow.container.registry-configurations[myecr].authorization-type=awsecr
- spring.cloud.dataflow.container.registry-configurations[myecr].user=[your AWS accessKey]
- spring.cloud.dataflow.container.registry-configurations[myecr].secret=[your AWS secretKey]
- spring.cloud.dataflow.container.registry-configurations[myecr].extra[region]=us-west-1
- spring.cloud.dataflow.container.registry-configurations[myecr].extra[registryIds]=283191309520
```

<!--Yaml-->

```yaml
spring:
  cloud:
    dataflow:
      container:
        registry-configurations:
          myecr:
            registry-host: 283191309520.dkr.ecr.us-west-1.amazonaws.com
            authorization-type: awsecr
            user: [your AWS accessKey]
            secret: [your AWS secretKey]
            extra:
              region: us-west-1
              'registryIds': 283191309520
```

<!--END_TABS-->

In addition to the credentials, you have to provide the registry's `region` through the extra properties configuration (for example, `.extra[region]=us-west-1`).
Optionally, you can set the registry IDs by setting the `.extra[registryIds]` property as a comma separated value.

- [Azure Container Registry](https://azure.microsoft.com/en-us/services/container-registry):

<!--TABS-->

<!--Java properties-->

```
- spring.cloud.dataflow.container.registry-configurations[myazurecr].registry-host=tzolovazureregistry.azurecr.io
- spring.cloud.dataflow.container.registry-configurations[myazurecr].authorization-type=basicauth
- spring.cloud.dataflow.container.registry-configurations[myazurecr].user=[your Azure registry username]
- spring.cloud.dataflow.container.registry-configurations[myazurecr].secret=[your Azure registry access password]
```

<!--Yaml-->

```yaml
spring:
  cloud:
    dataflow:
      container:
        registry-configurations:
          myazurecr:
            registry-host: tzolovazureregistry.azurecr.io
            authorization-type: basicauth
            user: [your Azure registry username]
            secret: [your Azure registry access password]
```

<!--END_TABS-->

#### Customizations

- Overriding/Augmenting [Volume Mounted Secrets](%currentPath%/installation/kubernetes/helm/#volume-mounted-secretes)

Properties can override or augment the configurations obtained through the registry secrets.
For example, if you have created a secret to access a registry running at address: `my-private-registry:5000`, you can disable SSL verification for this registry as follows:

<!--TABS-->

<!--Java properties-->

```
- spring.cloud.dataflow.container.registry-configurations[myregistry].registry-host=my-private-registry:5000
- spring.cloud.dataflow.container.registry-configurations[myregistry].disableSslVerification=true
```

<!--Yaml-->

```yaml
spring:
  cloud:
    dataflow:
      container:
        registry-configurations:
          myregistry:
            registry-host: my-private-registry:5000
            disableSslVerification: true
```

<!--END_TABS-->

This is handy for testing registries with self-signed certificates.

- Connect via Http Proxy

You can redirect some of the registry configurations through a pre-configured proxy. For example, if access a registry running at address: `my-private-registry:5000` via a proxy configured at `my-proxy.test:8080`:

<!--TABS-->

<!--Java properties-->

```
- spring.cloud.dataflow.container.http-proxy.host=my-proxy.test
- spring.cloud.dataflow.container.http-proxy.port=8080
- spring.cloud.dataflow.container.registry-configurations[myregistrywithproxy].registry-host=my-proxy-registry:5000
- spring.cloud.dataflow.container.registry-configurations[myregistrywithproxy].use-http-proxy=true
```

<!--Yaml-->

```yaml
spring:
  cloud:
    dataflow:
      container:
        httpProxy:
          host: my-proxy.test
          port: 8080
        registry-configurations:
          myregistrywithproxy:
            registry-host: my-proxy-registry:5000
            use-http-proxy: true
```

<!--END_TABS-->

The `spring.cloud.dataflow.container.http-proxy` properties allow you do configure a global Http Proxy and for every registry you can opt to use the proxy using
the registry configuration `use-http-proxy` property. The proxy is not used by default.
