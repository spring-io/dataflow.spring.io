---
path: 'resources/faq/'
title: 'Frequently Asked Questions'
description: ''
---

# Frequently Asked Questions

## Application Starters

<!--QUESTION-->

Where to find the latest Spring Cloud Stream and Spring Cloud Task application starters?

The latest releases of Stream and Task application starters are published to Maven Central and Docker Hub.
You can find the latest release versions from the [Spring Cloud Stream App Starters](https://cloud.spring.io/spring-cloud-stream-app-starters/) and [Spring Cloud Task App Starters](https://cloud.spring.io/spring-cloud-task-app-starters/) project sites.

<!--END_QUESTION-->

<!--QUESTION-->

Where to find the latest Spring Cloud Stream and Spring Cloud Task application starters?

The latest releases of Stream and Task application starters are published to Maven Central and Docker Hub.
You can find the latest release versions from the [Spring Cloud Stream App Starters](https://cloud.spring.io/spring-cloud-stream-app-starters/) and [Spring Cloud Task App Starters](https://cloud.spring.io/spring-cloud-task-app-starters/) project sites.

<!--END_QUESTION-->

<!--QUESTION-->

Where do I find the docs for the latest application releases?

Refer to the [Spring Cloud Stream App Starters](https://cloud.spring.io/spring-cloud-stream-app-starters/) and [Spring Cloud Task App Starters](https://cloud.spring.io/spring-cloud-task-app-starters/) project sites.

<!--END_QUESTION-->

<!--QUESTION-->

Is it possible to patch and extend the out-of-the-box applications?

Yes. More details in the reference guide section on [Patching Application Starters](https://docs.spring.io/spring-cloud-stream-app-starters/docs/%streaming-apps-version%/reference/htmlsingle/#_patching_pre_built_applications) as well as documentation on [Functional Composition](%currentPath%/feature-guides/streams/function-composition).

<!--END_QUESTION-->

<!--QUESTION-->

How to build a new application based on the same infrastructure as the out-of-the-box applications?

More details in the Spring Cloud Stream App Starter's reference guide section [FAQ on Spring Cloud Stream App Starters](https://docs.spring.io/spring-cloud-stream-app-starters/docs/%streaming-apps-version%/reference/htmlsingle/#_general_faq_on_spring_cloud_stream_app_starters).

<!--END_QUESTION-->

<!--QUESTION-->

Where can I download the latest applications?

Links available in the [stream](https://cloud.spring.io/spring-cloud-stream-app-starters/#http-repository-location-for-apps) and [task](https://cloud.spring.io/spring-cloud-task-app-starters/#http-repository-location-for-apps) apps project sites.

<!--END_QUESTION-->

<!--QUESTION-->

Where are the Docker images hosted?

See [stream](https://hub.docker.com/u/springcloudstream) and [task](https://hub.docker.com/u/springcloudtask) apps in Docker Hub.

<!--END_QUESTION-->

## Data Flow

<!--QUESTION-->

How are streaming applications and SCDF related?

Streaming applications are standalone and they communicate with other applications through message brokers like RabbitMQ or Apache Kafka.
They run independently and there's no runtime dependency between applications and SCDF.
However, based on user actions, SCDF will interact with the platform runtime to update the currently running application, query the current status, or stop the application from running.

<!--END_QUESTION-->

<!--QUESTION-->

How are task and batch applications and SCDF related?

Though batch/task applications are standalone Spring Boot applications, to record the execution status of batch/task applications, it is _required_ to connect both SCDF and the batch applications to the same database. The individual batch applications (deployed by SCDF) in turn attempt to update their execution status to the shared database, which in turn is used by SCDF to show the execution history and among other details about the batch applications in SCDF's dashboard. You can also construct your batch/task applications to connect to the SCDF Database only for recording execution status but performing work in another database.

<!--END_QUESTION-->

<!--QUESTION-->

What is the relationship of [Composed Task Runner](https://github.com/spring-cloud-task-app-starters/composed-task-runner) and SCDF?

The [Composed Tasks](https://docs.spring.io/spring-cloud-dataflow/docs/%dataflow-version%/reference/htmlsingle/#spring-cloud-dataflow-composed-tasks) delegates the execution of the collection of Tasks to a separate application, named the Composed Task Runner (CTR).
The CTR orchestrates the launching of Tasks defined in the composed task graph.
To use Composed Tasks, it is required to connect SCDF, CTR, and batch applications to a shared database. Only then, you will be able to track all of their execution history from SCDF’s dashboard.

<!--END_QUESTION-->

<!--QUESTION-->

Does SCDF use message broker?

No. The Data Flow and Skipper servers do not interact with the message broker.  
Streaming applications deployed by Data flow connect to the message broker to publish and consume messages.

<!--END_QUESTION-->

<!--QUESTION-->

What is the role of Skipper in SCDF?

SCDF delegates and relies on Skipper for the life cycle management of streaming applications. With Skipper, applications contained within the streaming data pipelines are versioned and can be rolling-updated and rolled-back to previous versions.

<!--END_QUESTION-->

<!--QUESTION-->

What tools are available to interact with SCDF?

[Shell](https://docs.spring.io/spring-cloud-dataflow/docs/%dataflow-version%/reference/htmlsingle/#shell), [Dashboard](https://docs.spring.io/spring-cloud-dataflow/docs/%dataflow-version%/reference/htmlsingle/#dashboard), [Java DSL](https://docs.spring.io/spring-cloud-dataflow/docs/%dataflow-version%/reference/htmlsingle/#spring-cloud-dataflow-stream-java-dsl), and [REST-APIs](https://docs.spring.io/spring-cloud-dataflow/docs/%dataflow-version%/reference/htmlsingle/#api-guide-resources).

<!--END_QUESTION-->

<!--QUESTION-->

Why SCDF is not in Spring Initializr?

Initializr's goal is to provide a getting started experience to creating a Spring Boot Application.
It is not the goal of initializr to create a production ready server application.
We had tried this in the past, but were not able to succeed because of the need for us to have very fine grained control over dependent libraries.
As such, we ship the binaries directly instead. And we expect the users either use the binaries as-is or extend by building SCDF locally from the source.

<!--END_QUESTION-->

<!--QUESTION-->

Can SCDF work with Oracle database?

Yes. Read more about the [supported databases here.](https://docs.spring.io/spring-cloud-dataflow/docs/%dataflow-version%/reference/htmlsingle/#configuration-local-rdbms).

<!--END_QUESTION-->

<!--QUESTION-->

When/Where to use Task properties vs. arguments?

If the configuration for each task execution remains the same across all task launches, then set the properties at the time in which you create the task definition.

```
task create myTaskDefinition --definition "timestamp --format='yyyy'"
```

If the configuration for each task execution changes for each task launch then you will want to use the arguments at task launch time. For example:

```
task launch myTaskDefinition "--server.port=8080"
```

[[note]]
| When using Spring Cloud Data Flow to orchestrate the launches of my task app that utilizes Spring Batch: You will want to use arguments so as to set the Job Parameters required for your batch job.  
|
| Remember: if your argument is a non identifying parameter suffix the argument with `--`.

<!--END_QUESTION-->

<!--QUESTION-->

How to configure remote Maven repositories?

You can set the maven properties such as local maven repository location, remote maven repositories, authentication credentials, and proxy server properties through command line properties when starting the Data Flow server.
Alternatively, you can set the properties using `SPRING_APPLICATION_JSON` environment property for the Data Flow server.

The remote maven repositories need to be configured explicitly if the apps are resolved using maven repository, except for a `local` Data Flow server.
The other Data Flow server implementations (that use maven resources for app artifacts resolution) have no default value for remote repositories.
The `local` server has `https://repo.spring.io/libs-snapshot` as the default remote repository.

To pass the properties as commandline options, run the server with a command similar to the following:

```bash
java -jar <dataflow-server>.jar --maven.localRepository=mylocal
--maven.remote-repositories.repo1.url=https://repo1
--maven.remote-repositories.repo1.auth.username=repo1user
--maven.remote-repositories.repo1.auth.password=repo1pass
--maven.remote-repositories.repo2.url=https://repo2 --maven.proxy.host=proxyhost
--maven.proxy.port=9018 --maven.proxy.auth.username=proxyuser
--maven.proxy.auth.password=proxypass
```

You can also use the `SPRING_APPLICATION_JSON` environment property:

```bash
export SPRING_APPLICATION_JSON='{ "maven": { "local-repository": "local","remote-repositories": { "repo1": { "url": "https://repo1", "auth": { "username": "repo1user", "password": "repo1pass" } },
"repo2": { "url": "https://repo2" } }, "proxy": { "host": "proxyhost", "port": 9018, "auth": { "username": "proxyuser", "password": "proxypass" } } } }'
```

Here is the same content in nicely formatted JSON:

```yaml
SPRING_APPLICATION_JSON='{
  "maven": {
    "local-repository": "local",
    "remote-repositories": {
      "repo1": {
        "url": "https://repo1",
        "auth": {
          "username": "repo1user",
          "password": "repo1pass"
        }
      },
      "repo2": {
        "url": "https://repo2"
      }
    },
    "proxy": {
      "host": "proxyhost",
      "port": 9018,
      "auth": {
        "username": "proxyuser",
        "password": "proxypass"
      }
    }
  }
}'
```

[[note]]
| Depending on the Spring Cloud Data Flow server implementation, you may have to pass the environment properties by using the platform specific environment-setting capabilities. For instance, in Cloud Foundry,
| you would pass them as `cf set-env SPRING_APPLICATION_JSON`.

<!--END_QUESTION-->

<!--QUESTION-->

How do I enable DEBUG logs for platform deployments?

Spring Cloud Data Flow builds upon [Spring Cloud Deployer](https://github.com/spring-cloud/spring-cloud-deployer) SPI, and the platform-specific dataflow server uses the respective [SPI implementations](https://github.com/spring-cloud?utf8=%E2%9C%93&q=spring-cloud-deployer).
Specifically, if we were to troubleshoot deployment specific issues, such as network errors, it would be useful to enable the DEBUG logs at the underlying deployer and the libraries used by it.

To enable DEBUG logs for the [local-deployer](https://github.com/spring-cloud/spring-cloud-deployer-local), start the server as follows:

```bash
java -jar <dataflow-server>.jar --logging.level.org.springframework.cloud.deployer.spi.local=DEBUG
```

(where `org.springframework.cloud.deployer.spi.local` is the global package for everything local-deployer
related.)

To enable DEBUG logs for the [cloudfoundry-deployer](https://github.com/spring-cloud/spring-cloud-deployer-cloudfoundry), set the following environment variable and, after restaging the dataflow server, you can see more logs around request and response and see detailed stack traces for failures.
The cloudfoundry deployer uses [cf-java-client](https://github.com/cloudfoundry/cf-java-client), so you must also enable DEBUG logs for this library.

```bash
cf set-env dataflow-server JAVA_OPTS '-Dlogging.level.cloudfoundry-client=DEBUG'
cf restage dataflow-server
```

(where `cloudfoundry-client` is the global package for everything `cf-java-client` related.)

To review Reactor logs, which are used by the `cf-java-client`, then the following commad would be helpful:

```bash
cf set-env dataflow-server JAVA_OPTS '-Dlogging.level.cloudfoundry-client=DEBUG -Dlogging.level.reactor.ipc.netty=DEBUG'
cf restage dataflow-server
```

(where `reactor.ipc.netty` is the global package for everything `reactor-netty` related.)

[[note]]
| Similar to the `local-deployer` and `cloudfoundry-deployer` options as discussed above, there are equivalent settings available for Kubernetes.
| See the respective link:https://github.com/spring-cloud?utf8=%E2%9C%93&q=spring-cloud-deployer[SPI implementations] for more detail about the packages to configure for logging.

<!--END_QUESTION-->

<!--QUESTION-->

How do I enable DEBUG logs for application deployments?

The streaming applications in Spring Cloud Data Flow are Spring Cloud Stream applications, which are in turn based on Spring Boot. They can be independently setup with logging configurations.

For instance, if you must troubleshoot the `header` and `payload` specifics that are being passed around source, processor, and sink channels, you should deploy the stream with the following options:

```bash
dataflow:>stream create foo --definition "http --logging.level.org.springframework.integration=DEBUG | transform --logging.level.org.springframework.integration=DEBUG | log --logging.level.org.springframework.integration=DEBUG" --deploy
```

(where `org.springframework.integration` is the global package for everything Spring Integration related,
which is responsible for messaging channels.)

These properties can also be specified with `deployment` properties when deploying the stream, as follows:

```bash
dataflow:>stream deploy foo --properties "app.*.logging.level.org.springframework.integration=DEBUG"
```

<!--END_QUESTION-->

<!--QUESTION-->

How do I remote debug deployed applications?

The Data Flow local server lets you debug the deployed applications.
This is accomplished by enabling the remote debugging feature of the JVM through deployment properties, as shown in the following example:

```bash
stream deploy --name mystream --properties "deployer.fooApp.local.debugPort=9999"
```

The preceding example starts the `fooApp` application in debug mode, allowing a remote debugger to be attached on port 9999.
By default, the application starts in a ’suspend’ mode and waits for the remote debug session to be attached (started). Otherwise, you can provide an additional `debugSuspend` property with value `n`.

Also, when there is more then one instance of the application, the debug port for each instance is the value of `debugPort` + instanceId.

[[note]]
| Unlike other properties you must NOT use a wildcard for the application name, since each application must use a unique debug port.

<!--END_QUESTION-->

<!--QUESTION#anchor-sample-->

Is it possible to aggregate Local deployments into a single log?

Given that each application is a separate process that maintains its own set of logs, accessing individual logs could be a bit inconvenient, especially in the early stages of development, when logs are accessed more often.
Since it is also a common pattern to rely on a local SCDF Server that deploys each application as a local JVM process, you can redirect the stdout and stdin from the deployed applications to the parent process.
Thus, with a local SCDF Server, the application logs appear in the logs of the running local SCDF Server.

Typically when you deploy the stream, you see something resembling the following in the server logs:

```bash
017-06-28 09:50:16.372  INFO 41161 --- [nio-9393-exec-7] o.s.c.d.spi.local.LocalAppDeployer       : Deploying app with deploymentId mystream.myapp instance 0.
   Logs will be in /var/folders/l2/63gcnd9d7g5dxxpjbgr0trpw0000gn/T/spring-cloud-dataflow-5939494818997196225/mystream-1498661416369/mystream.myapp
```

However, by setting `local.inheritLogging=true` as a deployment property, you can see the following:

```bash
017-06-28 09:50:16.372  INFO 41161 --- [nio-9393-exec-7] o.s.c.d.spi.local.LocalAppDeployer       : Deploying app with deploymentId mystream.myapp instance 0.
   Logs will be inherited.
```

After that, the application logs appear alongside the server logs, as shown in the following example:

```bash
stream deploy --name mystream --properties "deployer.*.local.inheritLogging=true”
```

The preceding stream definition enables log redirection for each application in the stream.
The following stream definition enables log redirection for only the application named ‘my app’.

```bash
stream deploy --name mystream --properties "deployer.myapp.local.inheritLogging=true”
```

Likewise, you can use the same option to redirect and aggregate all logs for the launched Task applications as well. The property is the same for Tasks, too.

NOTE: Log redirect is only supported with link:https://github.com/spring-cloud/spring-cloud-deployer-local[local-deployer].

<!--END_QUESTION-->

## Streaming

<!--QUESTION-->

What if I want to connect to existing RabbitMQ queues?

Follow the steps in the [reference guide](https://cloud.spring.io/spring-cloud-static/spring-cloud-stream-binder-rabbit/2.2.0.RC1/spring-cloud-stream-binder-rabbit.html#_using_existing_queuesexchanges) to connect with existing RabbitMQ queues.

<!--END_QUESTION-->

<!--QUESTION-->

What is the Apache Kafka vs. Spring Cloud Stream compatibility?

See the [compatibility matrix](https://github.com/spring-cloud/spring-cloud-stream/wiki/Kafka-Client-Compatibility) in the Wiki.

<!--END_QUESTION-->

## Batch

<!--QUESTION-->

What is a Composed Task Runner (CTR)?

The [Composed Tasks](https://docs.spring.io/spring-cloud-dataflow/docs/%dataflow-version%/reference/htmlsingle/#spring-cloud-dataflow-composed-tasks) feature in SCDF that delegates the execution of the composed to an separate application, named the Composed Task Runner (CTR).
The CTR to orchestrate the launching of Tasks defined in the composed task graph.
The Composed Task Runner (CTR) parses the graph DSL and for each node in the graph it will execute a RESTful call against a specified Spring Cloud Data Flow instance to launch the associated task definition.
For each task definition that is executed the Composed Task Runner will poll the database to verify that the task completed.
Once complete the Composed Task Runner will either continue to the next task in the graph or fail based on how the DSL specified the sequence of tasks should be executed.

<!--END_QUESTION-->

<!--QUESTION-->

How do I restart a Spring Batch Job from the beginning, not from where it failed?

In short, you will need to create a new Job Instance for the new task launch. This can be done by changing an existing identifying job parameter or add a new identifying job parameter on the next task launch. For example:

```
task launch myBatchApp --arguments="foo=bar"
```

Assuming this task launch fails we can now launch the task and a new job instance will be created if we change the value of the `foo` parameter as shown here:

```
task launch myBatchApp --arguments="foo=que"
```

But the preferred way is to write your task/batch app such that it can handle be restarted with a new job instance. One way to do this is to set a `JobParamsIncrementer` for your batch job as discussed in the Spring Batch [reference guide](https://docs.spring.io/spring-batch/trunk/reference/html/configureJob.html#JobParametersIncrementer).

<!--END_QUESTION-->
