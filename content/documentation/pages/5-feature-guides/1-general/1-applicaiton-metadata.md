---
path: 'feature-guides/general/application-metadata/'
title: 'Application Metadata'
description: 'Create and use application properties metadata'
---

## Application Metadata

Stream and Task applications are Spring Boot applications that are aware of many [Common Application Properties](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#spring-cloud-dataflow-global-properties), such as server.port but also families of properties such as those with the prefix spring.jmx and logging. For this you need to enable the [Configuration Metadata](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-configuration-metadata.html) generation and to specify the whitelisted properties.

Add the `spring-boot-configuration-processor` as an optional dependency to generate configuration metadata file for your application properties:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
```

The the configuration metadata files will be located under `META-INF/spring-configuration-metadata.json`.

In addition to the generated configuration metadata, when creating your own application, you should `whitelist` the primary properties so that the shell and the UI can display them first when presenting options through TAB completion or in drop-down boxes.

To whitelist application properties, create a file named `spring-configuration-metadata-whitelist.properties` under the `META-INF` resource directory. There are two property keys that can be used inside this file. The first key is named `configuration-properties.classes`. The value is a comma separated list of fully qualified `@ConfigurationProperty` class names. The second key is `configuration-properties.names`, whose value is a comma-separated list of property names. This can contain the full name of the property, such as `server.port`, or a partial name to whitelist a category of property names, such as `spring.jmx`.

The [Spring Cloud Stream application starters](https://github.com/spring-cloud-stream-app-starters) are a good place to look for examples of usage. The following example comes from the file sink’s spring-configuration-metadata-whitelist.properties file:

```properties
configuration-properties.classes=org.springframework.cloud.stream.app.file.sink.FileSinkProperties
```

If we also want to add `server.port` to be white listed, it would become the following line:

```properties
configuration-properties.classes=org.springframework.cloud.stream.app.file.sink.FileSinkProperties
configuration-properties.names=server.port
```

The benefits of a companion artifact include:

- Being much lighter. (The companion artifact is usually a few kilobytes, as opposed to megabytes for the actual app.) Consequently, they are quicker to download, allowing quicker feedback when using, for example, app info or the Dashboard UI.

- As a consequence of being lighter, they can be used in resource constrained environments (such as PaaS) when metadata is the only piece of information needed.

- For environments that do not deal with Spring Boot uber jars directly (for example, Docker-based runtimes such as Kubernetes or Cloud Foundry), this is the only way to provide metadata about the properties supported by the app.

## Create Metadata Artifacts

You can go a step further in the process of describing the main properties that your stream or task app supports by creating a additional application metadata. Depending on the runtime, the metadata is packaged either as an additional companion jar artifact or a configuration label inside the application's Docker image.

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

This plugin comes in addition to the `spring-boot-configuration-processor` that creates the individual JSON files. Be sure to configure both.

<!--END_TIP-->

### Companion Metadata Jar File

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

### Docker Image Metadata Label

For the Docker image packaged applications, the whitelisted properties are used at compile time to extract only the whitelisted configuration metadata form the `spring-configuration-metadata.json` file and insert it as a configuration label in the generated application Docker image. Therefore the produced Docker image contains the application itself as well as the whitelisted configuration metadata for it. Not need for a companion artifact.

At compile time the `spring-cloud-app-starter-metadata-maven-plugin` generates a `META-INF/spring-configuration-metadata-encoded.properties` file with a single property inside: `org.springframework.cloud.dataflow.spring.configuration.metadata.json`. The property value is the strigified, whitelisted subset of the configuration metadata.

```properties
org.springframework.cloud.dataflow.spring.configuration.metadata.json={\n  \"groups\": [{\n    \"name\": \"log\",\n    \"type\": \"org.springframework.cloud.stream.app.log.sink.LogSinkProperties\",\n    \"sourceType\": \"org.springframework.cloud.stream.app.log.sink.LogSinkProperties\"\n  }],\n  \"properties\": [\n    {\n      \"name\": \"log.expression\",\n      \"type\": \"java.lang.String\",\n      \"description\": \"A SpEL expression (against the incoming message) to evaluate as the logged message.\",\n      \"sourceType\": \"org.springframework.cloud.stream.app.log.sink.LogSinkProperties\",\n      \"defaultValue\": \"payload\"\n    },\n    {\n      \"name\": \"log.level\",\n      \"type\": \"org.springframework.integration.handler.LoggingHandler$Level\",\n      \"description\": \"The level at which to log messages.\",\n      \"sourceType\": \"org.springframework.cloud.stream.app.log.sink.LogSinkProperties\"\n    },\n    {\n      \"name\": \"log.name\",\n      \"type\": \"java.lang.String\",\n      \"description\": \"The name of the logger to use.\",\n      \"sourceType\": \"org.springframework.cloud.stream.app.log.sink.LogSinkProperties\"\n    }\n  ],\n  \"hints\": []\n}
```

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

Then with the help of the `fabric8:docker-maven-plugin` or `jib` maven plugins insert the `org.springframework.cloud.dataflow.spring.configuration.metadata.json` property into a Docker label with the same name:

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

Similar configuration using the `docker-maven-plugin`:

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
                        <org.springframework.cloud.dataflow.spring-configuration-metadata.json>${org.springframework.cloud.dataflow.spring.configuration.metadata.json}</org.springframework.cloud.dataflow.spring-configuration-metadata.json>
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

## Using Application Metadata

Once you have the application metadata generated either as a separate, companion artifact or embedded in the application Docker image as a configuration label, you can make the Data Flow system aware of it so that it can be used.

### Using Docker Metadata

When registering a single docker app with app register, the Data Flow server will automatically check for metadata in the `org.springframework.cloud.dataflow.spring-configuration-metadata.json` configuration label:

```shell
dataflow:>app register --name log --type sink --uri docker:springcloudstream/log-sink-rabbit:2.1.13.RELEASE
```

Configurations specific for each target Container Registry provider/instance.

The Docker Hub configuration is set by default for the local docker-compose installation. Additional container registries can be configured through the properties like this:

- [Docker Hub](https://hub.docker.com/)

```yaml
- spring.cloud.dataflow.container.metadata.registry-configurations[0].registry-host=registry-1.docker.io
- spring.cloud.dataflow.container.metadata.registry-configurations[0].authorization-type=dockerhub
```

Note that the docker hub public repository doesn't require username and password authorization. They will be required though for private Docker Hub repositories.

- [Arifactory/JFrog Container Registry](https://jfrog.com/integration/docker-registry):

```yaml
- spring.cloud.dataflow.container.metadata.registry-configurations[0].registry-host=springsource-docker-private-local.jfrog.io
- spring.cloud.dataflow.container.metadata.registry-configurations[0].authorization-type=basicauth
- spring.cloud.dataflow.container.metadata.registry-configurations[0].user=[artifactory user]
- spring.cloud.dataflow.container.metadata.registry-configurations[0].secret=[artifactory encryptedkey]
```

- [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/):

```yaml
- spring.cloud.dataflow.container.metadata.registry-configurations[1].registry-host=283191309520.dkr.ecr.us-west-1.amazonaws.com
- spring.cloud.dataflow.container.metadata.registry-configurations[1].authorization-type=awsecr
- spring.cloud.dataflow.container.metadata.registry-configurations[1].user=[your AWS accessKey]
- spring.cloud.dataflow.container.metadata.registry-configurations[1].secret=[your AWS secretKey]
- spring.cloud.dataflow.container.metadata.registry-configurations[1].extra[region]=us-west-1
- spring.cloud.dataflow.container.metadata.registry-configurations[1].extra[registryIds]=283191309520
```

- [Azure Container Registry](https://azure.microsoft.com/en-us/services/container-registry):

```yaml
- spring.cloud.dataflow.container.metadata.registry-configurations[2].registry-host=tzolovazureregistry.azurecr.io
- spring.cloud.dataflow.container.metadata.registry-configurations[2].authorization-type=basicauth
- spring.cloud.dataflow.container.metadata.registry-configurations[2].user=[your Azure registry username]
- spring.cloud.dataflow.container.metadata.registry-configurations[2].secret=[your Azure registry access password]
```

- [Harbor Registry](https://goharbor.io)

```yaml
- spring.cloud.dataflow.container.metadata.registry-configurations[3].registry-host=demo.goharbor.io
- spring.cloud.dataflow.container.metadata.registry-configurations[3].authorization-type=dockerhub
- spring.cloud.dataflow.container.metadata.registry-configurations[3].user=admin
- spring.cloud.dataflow.container.metadata.registry-configurations[3].secret=Harbor12345
- spring.cloud.dataflow.container.metadata.registry-configurations[3].extra[registryAuthUri]=https://demo.goharbor.io/service/token?service=harbor-registry&scope=repository:{repository}:pull
```

Note that the Harbor Registry configuration uses the OAuth2 Token authorization similar to DockerHub but on different `registryAuthUri`.

### Using Uber JAR Metadata

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
