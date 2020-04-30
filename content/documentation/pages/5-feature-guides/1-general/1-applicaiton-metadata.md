---
path: 'feature-guides/general/application-metadata/'
title: 'Application Metadata'
description: 'Create and use application properties metadata'
---

## Application Metadata

Spring Boot provides support for bundling an application's configuration properties within the executable jar.
In this section we also discuss bundling an application's configuraiton properties as a label in a container image.
This packaging of metadata allows Data Flow to present an application's configuration properties in the UI and Shell.
Whitelisting of application configuration properties in an important step in this process so that most important application properties to configure will be presented first by the UI and Shell.

The outline of the steps to create, whitelist and package an application's configuration properties in an executable jar and also as metadata in a container image.

The common steps between packaging configuration properties in an executable jar and container image are

1.  Add Boot's Configuration processor to your pom.xml as explained [here](%currentPath%/feature-guides/general/application-metadata/#boot-configuration-processor)

These configuration properties are packaged in a [configuration metadata file](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-configuration-metadata.html#configuration-metadata).
Boot's auto-configuration libraries already contain these metadata files and is what enabled you to configure Boot's [Common Application Properties](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#spring-cloud-dataflow-global-properties), such as server.port as well as families of other properties specific to a given technology, for example JMX and logging that use the the prefix `spring.jmx` and `logging`.

2.  Whitelist properties that you want to have preferred visibility in the UI and Shell as explained [here](%currentPath%/feature-guides/general/application-metadata/#whitelisting-properties) instead of viewing all of Boot's Common Application Properties.
3.  Configure the `spring-cloud-app-starter-metadata-maven-plugin`, as explained [here](%currentPath%/feature-guides/general/application-metadata/#configure-app-starter-metadata-maven-plugin), to generate metadata jar as well as the `META-INF/spring-configuration-metadata-encoded.properties` file used to create Container Image labels.

The additional steps to create a label in a container image with the application metadata and whitelist are

1. Configure the `properties-maven-plugin`, as explained [here](%currentPath%/feature-guides/general/application-metadata/#properties-maven-plugin), to load the `META-INF/spring-configuration-metadata-encoded.properties` as maven properties. Among others it will load the `org.springframework.cloud.dataflow.spring.configuration.metadata.json` property.

2. Extend the `jib-maven-plugin` (or `docker-maven-plugin`) configuration, as shown [here](%currentPath%/feature-guides/general/application-metadata/#container-maven-plugin), to add the content of the `org.springframework.cloud.dataflow.spring.configuration.metadata.json` property as a Container Image Label

### Boot Configuration processor

For your own applications, you can easily [generate your own configuration metadata file](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-configuration-metadata.html#configuration-metadata-annotation-processor) from items annotated with `@ConfigurationProperties` by using the `spring-boot-configuration-processor` library. This library includes a Java annotation processor which is invoked as your project is compiled.
The generated configuration metadata files are then stored inside the uber-jar under `META-INF/spring-configuration-metadata.json`

To use the processor, include a dependency on spring-boot-configuration-processor.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
```

### Whitelisting properties

In addition to this file, Data Flow can make use of an additional file that whitelists application properties that are the most important, usually your own application's `@ConfigurationProperties`.
Without using a whitelist, the UI and Shell will present the hundreds of [Common Application Properties](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#spring-cloud-dataflow-global-properties) resulting in a poor user experience.
The `whitelist` file lists the primary application properties so that the shell and the UI can display them first when presenting options through TAB completion or in drop-down boxes.

To whitelist application properties, create a file named `spring-configuration-metadata-whitelist.properties` under the `META-INF` resource directory. There are two property keys that can be used inside this file. The first key is named `configuration-properties.classes`. The value is a comma separated list of fully qualified `@ConfigurationProperty` class names. The second key is `configuration-properties.names`, whose value is a comma-separated list of property names. This can contain the full name of the property, such as `server.port`, or a partial name to whitelist a category of property names, such as `spring.jmx`.

The [Spring Cloud Stream application starters](https://github.com/spring-cloud-stream-app-starters) are a good place to look for examples using whitelists. The following example comes from the file sink’s `spring-configuration-metadata-whitelist.properties` file:

```properties
configuration-properties.classes=org.springframework.cloud.stream.app.file.sink.FileSinkProperties
```

If we also want to add `server.port` to be white listed, it would become the following line:

```properties
configuration-properties.classes=org.springframework.cloud.stream.app.file.sink.FileSinkProperties
configuration-properties.names=server.port
```

### Metadata Artifacts

Including the application metadata inside the uber-jar has the downside of needing to download a potentially very large uber-jar just to inspect the metadata. Creating a separate uber-jar, also called a 'companion artifact', that contains only the application metadata has several advantages which include:

- Being much smaller in size. The companion artifact is usually a few kilobytes, as opposed to megabytes for the actual application. Consequently, they are quicker to download, allowing quicker feedback when using Data Flow's UI and shell.

- A smaller size is also a benefit when being used in resource constrained environments, such as Cloud Foundry, where the local disk size is often very small.

- For environments that do not deal with Spring Boot uber jars directly, for example container based runtimes such as Kubernetes, this is the only way to provide metadata about the properties supported by the application.

## Creating Metadata Artifacts

You can go a step further in the process of describing the main properties that your stream or task app supports by creating a additional application metadata. Depending on the runtime, the metadata is packaged either as an additional companion jar artifact or a configuration label inside the application's container image.

### Configure App Starter Metadata Maven Plugin

The `spring-cloud-app-starter-metadata-maven-plugin` plugin helps to prepare all necessary metadata files for your application:

```xml
<plugin>
 	<groupId>org.springframework.cloud</groupId>
 	<artifactId>spring-cloud-app-starter-metadata-maven-plugin</artifactId>
    <version>2.0.0.RELEASE</version>
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

<!--TIP-->

This plugin needs to be used in addition to the `spring-boot-configuration-processor` that creates the `spring-configuration-metadata.json` files. Be sure to configure both of them.

<!--END_TIP-->

### Metadata Jar File

For the uber-jar packaged applications an additional metadata-jar is provided, that contains the Spring boot JSON file about configuration properties metadata and the whitelisting file described in the previous section. The following example shows the contents of such an artifact, for the canonical log sink:

```shell
$ jar tvf log-sink-rabbit-1.2.1.BUILD-SNAPSHOT-metadata.jar
373848 META-INF/spring-configuration-metadata.json
   174 META-INF/spring-configuration-metadata-whitelist.properties
```

Note that the `spring-configuration-metadata.json` file is quite large. This is because it contains the concatenation of all the properties that are available at runtime to the log sink (some of them come from spring-boot-actuator.jar, some of them come from spring-boot-autoconfigure.jar, some more from spring-cloud-starter-stream-sink-log.jar, and so on). Data Flow always relies on all those properties, even when a companion artifact is not available, but here all have been merged into a single file.

<!--TIP-->

The `spring-cloud-app-starter-metadata-maven-plugin` plugin generates ready to use application metadata.jar artifact. Just make sure the plugin is configured in your application's pom.

<!--END_TIP-->

### Metadata Container Image Label

For the container image packaged applications, the whitelisted properties are used at compile time to extract only the whitelisted configuration metadata form the `spring-configuration-metadata.json` file and insert it as a configuration label in the generated application container image. Therefore the produced container image contains the application itself as well as the whitelisted configuration metadata for it. Not need for a companion artifact.

At compile time the `spring-cloud-app-starter-metadata-maven-plugin` generates a `META-INF/spring-configuration-metadata-encoded.properties` file with a single property inside: `org.springframework.cloud.dataflow.spring.configuration.metadata.json`. The property value is the strigified, whitelisted subset of the configuration metadata.

```properties
org.springframework.cloud.dataflow.spring.configuration.metadata.json={\n  \"groups\": [{\n    \"name\": \"log\",\n    \"type\": \"org.springframework.cloud.stream.app.log.sink.LogSinkProperties\",\n    \"sourceType\": \"org.springframework.cloud.stream.app.log.sink.LogSinkProperties\"\n  }],\n  \"properties\": [\n    {\n      \"name\": \"log.expression\",\n      \"type\": \"java.lang.String\",\n      \"description\": \"A SpEL expression (against the incoming message) to evaluate as the logged message.\",\n      \"sourceType\": \"org.springframework.cloud.stream.app.log.sink.LogSinkProperties\",\n      \"defaultValue\": \"payload\"\n    },\n    {\n      \"name\": \"log.level\",\n      \"type\": \"org.springframework.integration.handler.LoggingHandler$Level\",\n      \"description\": \"The level at which to log messages.\",\n      \"sourceType\": \"org.springframework.cloud.stream.app.log.sink.LogSinkProperties\"\n    },\n    {\n      \"name\": \"log.name\",\n      \"type\": \"java.lang.String\",\n      \"description\": \"The name of the logger to use.\",\n      \"sourceType\": \"org.springframework.cloud.stream.app.log.sink.LogSinkProperties\"\n    }\n  ],\n  \"hints\": []\n}
```

#### Properties Maven Plugin

To turn this property into a Docker label, first we need to load it as maven property using the `properties-maven-plugin` plugin:

```xml
<plugin>
    <groupId>org.codehaus.mojo</groupId>
    <artifactId>properties-maven-plugin</artifactId>
    <version>1.0.0</version>
    <executions>
        <execution>
            <id>apps-metadata</id>
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

Then with the help of the `fabric8:docker-maven-plugin` or `jib` maven plugins insert the `org.springframework.cloud.dataflow.spring.configuration.metadata.json` property into a Docker label with the same name:

<!--TABS-->

<!-- Jib maven plugin -->

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

<!-- Fabric8 maven plugin -->

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

Once you have the application metadata generated either as a separate, companion artifact or embedded in the application container image as a configuration label, you can make the Data Flow system aware of it so that it can be used.

### Using Metadata Jar files

When registering a single app with app register, you can use the optional `--metadata-uri` option in the shell, as follows:

```shell
dataflow:>app register --name log --type sink
    --uri maven://org.springframework.cloud.stream.app:log-sink:2.1.0.RELEASE
    --metadata-uri maven://org.springframework.cloud.stream.app:log-sink:jar:metadata:2.1.0.RELEASE
```

When registering several files by using the app import command, the file should contain a `<type>.<name>.metadata` line in addition to each `<type>.<name>` line. Strictly speaking, doing so is optional (if some apps have it but some others do not, it works), but it is best practice.

The following example shows a uber-jar app, where the metadata artifact is being hosted in a Maven repository (retrieving it through `http://` or `file://` would be equally possible).

```properties
source.http=maven://org.springframework.cloud.stream.app:log-sink:2.1.0.RELEASE
source.http.metadata=maven://org.springframework.cloud.stream.app:log-sink:jar:metadata:2.1.0.RELEASE
```

### Using Metadata Container Image Labels

When registering a single docker app with app register, the Data Flow server will automatically check for metadata in the `org.springframework.cloud.dataflow.spring-configuration-metadata.json` configuration label:

```shell
dataflow:>app register --name log --type sink --uri container:springcloudstream/log-sink-rabbit:2.1.13.RELEASE
```

Configurations specific for each target Container Registry provider/instance.

For a [private container registry](%currentPath%/installation/kubernetes/helm/#private-docker-registry) with [volume mounted secretes](%currentPath%/installation/kubernetes/helm/#volume-mounted-secretes), the registry configurations are automatically inferred from the secrets.
In addition the `spring.cloud.dataflow.container.registry-configurations` has properties that let you explicitly configure multiple container registries like this:

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

This registry is used by default, if the image name doesn't provide the registry host prefix.
The public Docker hub repositories don't require username/password authorization.
The credentials though will be required for the private Docker Hub repositories.

- [Arifactory/JFrog Container Registry](https://jfrog.com/integration/docker-registry):

<!--TABS-->

<!--Java properties-->

```yaml
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

Note: you need to create an [Encrypted Password](https://www.jfrog.com/confluence/display/JFROG/Centrally+Secure+Passwords) in JFrog.

- [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/):

<!--TABS-->

<!--Java properties-->

```yaml
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

In addition to the credentials you have to provide the registry's `region` through the extra properties configuration (e.g. `.extra[region]=us-west-1`).
Optionally you can set the registry IDs via the `.extra[registryIds]` property as a comma separated value.

- [Azure Container Registry](https://azure.microsoft.com/en-us/services/container-registry):

<!--TABS-->

<!--Java properties-->

```yaml
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

- [Harbor Registry](https://goharbor.io)

<!--TABS-->

<!--Java properties-->

```yaml
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

The Harbor Registry configuration uses the OAuth2 Token authorization similar to DockerHub but on different `registryAuthUri`. Later is automatically resolved at bootstrap, but you can override it like this:

<!--TABS-->

<!--Java properties-->

```yaml
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

- Overriding/Augmenting [Volume Mounted Secrets](%currentPath%/installation/kubernetes/helm/#volume-mounted-secretes)

Properties can override or augment the configurations obtained via the registry secrets.
For example if you have created a Secret to access a registry running at address: `my-private-registry:5000`, then you can disable SSL verification for this registry like this:

<!--TABS-->

<!--Java properties-->

```yaml
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

This is handy testing registries with self-signed Certificates.
