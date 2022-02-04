---
path: 'resources/faq/'
title: 'Frequently Asked Questions'
description: ''
---

# Frequently Asked Questions

## Data Flow

<!--QUESTION#appsandscdf-->

How are streaming applications and Spring Cloud Data Flow (SCDF) related?

Streaming applications are standalone, and they communicate with other applications through message brokers, such as RabbitMQ or Apache Kafka.
They run independently, and no runtime dependency between applications and SCDF exists.
However, based on user actions, SCDF interacts with the platform runtime to update the currently running application, query the current status, or stop the application.

<!--END_QUESTION-->

<!--QUESTION#batchandscdf-->

How are task and batch applications and Spring Cloud Data Flow (SCDF) related?

Though batch and task applications are standalone Spring Boot applications, to record the execution status of batch and task applications, you _must_ connect both SCDF and the batch applications to the same database. The individual batch applications (deployed by SCDF), in turn, attempt to update their execution status to the shared database. The database, in turn, is used by SCDF to show the execution history and other details about the batch applications in SCDF's dashboard. You can also construct your batch and task applications to connect to the SCDF Database only for recording execution status but perform the work in another database.

<!--END_QUESTION-->

<!--QUESTION#ctrandscdf-->

What is the relationship of [Composed Task Runner](https://github.com/spring-cloud-task-app-starters/composed-task-runner) and SCDF?

[Composed tasks](https://docs.spring.io/spring-cloud-dataflow/docs/%dataflow-version%/reference/htmlsingle/#spring-cloud-dataflow-composed-tasks) delegate the running of the collection of tasks to a separate application, named the Composed Task Runner (CTR).
The CTR orchestrates the launching of Tasks defined in the composed task graph.
To use composed tasks, you must connect SCDF, CTR, and batch applications to a shared database. Only then can you track all of their execution history from SCDF’s dashboard.

<!--END_QUESTION-->

<!--QUESTION#brokerandscdf-->

Does SCDF use message broker?

No. The Data Flow and Skipper servers do not interact with the message broker.
Streaming applications deployed by Data flow connect to the message broker to publish and consume messages.

<!--END_QUESTION-->

<!--QUESTION#skipperandscdf-->

What is the role of Skipper in Spring Cloud Data Flow (SCDF)?

SCDF delegates and relies on Skipper for the life cycle management of streaming applications. With Skipper, applications contained within the streaming data pipelines are versioned and can be updated to new versions (on a rolling basis) and rolled back to previous versions.

<!--END_QUESTION-->

<!--QUESTION#scdftools-->

What tools are available to interact with Spring Cloud Data Flow (SCDF)?

You can use the following tools to interact with Spring Cloud Data Flow:

- [Shell](https://docs.spring.io/spring-cloud-dataflow/docs/%dataflow-version%/reference/htmlsingle/#shell)
- [Dashboard](https://docs.spring.io/spring-cloud-dataflow/docs/%dataflow-version%/reference/htmlsingle/#dashboard)
- [Java DSL](https://docs.spring.io/spring-cloud-dataflow/docs/%dataflow-version%/reference/htmlsingle/#spring-cloud-dataflow-stream-java-dsl)
- [REST-API](https://docs.spring.io/spring-cloud-dataflow/docs/%dataflow-version%/reference/htmlsingle/#api-guide-resources).

<!--END_QUESTION-->

<!--QUESTION#intializrandscdf-->

Why is Spring Cloud Data Flow (SCDF) not in Spring Initializr?

Initializr's goal is to provide a getting started experience for creating a Spring Boot Application.
It is not the goal of Initializr to create a production-ready server application.
We had tried this in the past, but we were not able to succeed because of the need for us to have fine-grained control over dependent libraries.
As such, we ship the binaries directly instead. We expect the users to either use the binaries as-is or extend them by building SCDF locally from the source.

<!--END_QUESTION-->

<!--QUESTION#oracleandscdf-->

Can Spring Cloud Data Flow (SCDF) work with an Oracle database?

Yes. You can read more about the [supported databases here.](https://docs.spring.io/spring-cloud-dataflow/docs/%dataflow-version%/reference/htmlsingle/#configuration-local-rdbms).

<!--END_QUESTION-->

<!--QUESTION#propsvsargs-->

When and where should I use Task properties versus arguments?

If the configuration for each task execution remains the same across all task launches, you can set the properties at the time at which you create the task definition. The following example shows how to do so:

```
task create myTaskDefinition --definition "timestamp --format='yyyy'"
```

If the configuration for each task execution changes for each task launch, you can use the arguments at task launch time, as the following example shows:

```
task launch myTaskDefinition "--server.port=8080"
```

<!--NOTE-->

When you use Spring Cloud Data Flow to orchestrate the launches of a task application that uses Spring Batch, you should use arguments to set the Job Parameters required for your batch job.

Remember: If your argument is a non-identifying parameter, suffix the argument with `--`.

<!--END_NOTE-->

<!--END_QUESTION-->

<!--QUESTION#ctrargs-->

How do I pass command line arguments to the child tasks of a Composed Task graph?
You can do so by using the `composedTaskArguments` property of the Composed Task Runner.

In the following example, the `--timestamp.format=YYYYMMDD` command line argument is applied to all the child tasks in the composed task graph.

```
task launch myComposedTask --arguments "--composedTaskArguments=--timestamp.format=YYYYMMDD"
```

<!--END_QUESTION-->

<!--QUESTION#mavenconfig-->

How can I configure remote Maven repositories?

You can set the Maven properties (such as local Maven repository location, remote Maven repositories, authentication credentials, and proxy server properties) through command line properties when you start the Data Flow server.
Alternatively, you can set the properties by setting the `SPRING_APPLICATION_JSON` environment property for the Data Flow server.

The remote Maven repositories need to be configured explicitly if the apps are resolved from a Maven repository, except for a `local` Data Flow server.
The other Data Flow server implementations (which use Maven resources for app artifacts resolution) have no default value for remote repositories.
The `local` server has `https://repo.spring.io/libs-snapshot` as the default remote repository.

To pass the properties as command line options, run the server with a command similar to the following:

```bash
java -jar <dataflow-server>.jar --maven.localRepository=mylocal
--maven.remote-repositories.repo1.url=https://repo1
--maven.remote-repositories.repo1.auth.username=repo1user
--maven.remote-repositories.repo1.auth.password=repo1pass
--maven.remote-repositories.repo2.url=https://repo2 --maven.proxy.host=proxyhost
--maven.proxy.port=9018 --maven.proxy.auth.username=proxyuser
--maven.proxy.auth.password=proxypass
```

You can also set the `SPRING_APPLICATION_JSON` environment property:

```bash
export SPRING_APPLICATION_JSON='{ "maven": { "local-repository": "local","remote-repositories": { "repo1": { "url": "https://repo1", "auth": { "username": "repo1user", "password": "repo1pass" } },
"repo2": { "url": "https://repo2" } }, "proxy": { "host": "proxyhost", "port": 9018, "auth": { "username": "proxyuser", "password": "proxypass" } } } }'
```

Here is the same content in nicely formatted JSON:

```yaml
export SPRING_APPLICATION_JSON='{
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

<!--NOTE-->

Depending on the Spring Cloud Data Flow server implementation, you may have to pass the environment properties by using the platform specific environment-setting capabilities. For instance, in Cloud Foundry,
you would pass them as `cf set-env <your app> SPRING_APPLICATION_JSON '{...`.

<!--END_NOTE-->

<!--END_QUESTION-->

<!--QUESTION#debuglogs-->

How do I enable DEBUG logs for platform deployments?

Spring Cloud Data Flow builds upon the [Spring Cloud Deployer](https://github.com/spring-cloud/spring-cloud-deployer) SPI, and the platform-specific dataflow server uses the respective [SPI implementations](https://github.com/spring-cloud?utf8=%E2%9C%93&q=spring-cloud-deployer).
Specifically, if we were to troubleshoot deployment specific issues, such as network errors, it would be useful to enable the DEBUG logs at the underlying deployer and the libraries used by it.

To enable DEBUG logs for the [local-deployer](https://github.com/spring-cloud/spring-cloud-deployer-local), start the server as follows:

```bash
java -jar <dataflow-server>.jar --logging.level.org.springframework.cloud.deployer.spi.local=DEBUG
```

(where `org.springframework.cloud.deployer.spi.local` is the global package for everything related to the local-deployer.)

To enable DEBUG logs for the [cloudfoundry-deployer](https://github.com/spring-cloud/spring-cloud-deployer-cloudfoundry), set the `logging.level.cloudfoundry-client` environment variable and, after restaging the Data Flow server, you can see more logs around request and response and see detailed stack traces for failures.
The Cloud Foundry deployer uses [cf-java-client](https://github.com/cloudfoundry/cf-java-client), so you must also enable DEBUG logs for this library:

```bash
cf set-env dataflow-server JAVA_OPTS '-Dlogging.level.cloudfoundry-client=DEBUG'
cf restage dataflow-server
```

(where `cloudfoundry-client` is the global package for everything related to`cf-java-client`.)

To review Reactor logs, which are used by the `cf-java-client`, run the following commands:

```bash
cf set-env dataflow-server JAVA_OPTS '-Dlogging.level.cloudfoundry-client=DEBUG -Dlogging.level.reactor.ipc.netty=DEBUG'
cf restage dataflow-server
```

(where `reactor.ipc.netty` is the global package for everything related to `reactor-netty`.)

<!--NOTE-->

Similar to the `local-deployer` and `cloudfoundry-deployer` options as discussed above, there are equivalent settings available for Kubernetes.
See the respective link:https://github.com/spring-cloud?utf8=%E2%9C%93&q=spring-cloud-deployer[SPI implementations] for more detail about the packages to configure for logging.

<!--END_NOTE-->

<!--END_QUESTION-->

<!--QUESTION#debugapps-->

How do I enable DEBUG logs for application deployments?

The streaming applications in Spring Cloud Data Flow are Spring Cloud Stream applications, which are, in turn, based on Spring Boot. You can independently set them up with different logging configurations.

For instance, if you must troubleshoot the `header` and `payload` specifics that are being passed around source, processor, and sink channels, you should deploy the stream with the following options:

```bash
dataflow:>stream create foo --definition "http --logging.level.org.springframework.integration=DEBUG | transform --logging.level.org.springframework.integration=DEBUG | log --logging.level.org.springframework.integration=DEBUG" --deploy
```

(where `org.springframework.integration` is the global package for everything related to Spring Integration,
which is responsible for messaging channels)

You can also specify these properties by setting `deployment` properties when you deploy the stream, as follows:

```bash
dataflow:>stream deploy foo --properties "app.*.logging.level.org.springframework.integration=DEBUG"
```

<!--END_QUESTION-->

<!--QUESTION#remotedebug-->

How do I remote debug deployed applications?

The Data Flow local server lets you debug the deployed applications.
To do so, enable the remote debugging feature of the JVM through deployment properties, as follows:

```bash
stream deploy --name mystream --properties "deployer.fooApp.local.debugPort=9999"
```

The preceding example starts the `fooApp` application in debug mode, letting a remote debugger be attached on port 9999.
By default, the application starts in a "suspend" mode and waits for the remote debug session to be attached (started). Otherwise, you can provide an additional `debugSuspend` property with value `n`.

Also, when more then one instance of the application exists, the debug port for each instance is the value of `debugPort` + `instanceId`.

<!--NOTE-->

Unlike other properties, you must NOT use a wildcard for the application name, since each application must use a unique debug port.

<!--END_NOTE-->

<!--END_QUESTION-->

<!--QUESTION#aggregatelogs-->

Is it possible to aggregate local deployments into a single log?

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
stream deploy --name mystream --properties "deployer.*.local.inheritLogging=true"
```

The preceding stream definition enables log redirection for each application in the stream.
The following stream definition enables log redirection for only the application named `my app`:

```bash
stream deploy --name mystream --properties "deployer.myapp.local.inheritLogging=true"
```

Likewise, you can use the same option to redirect and aggregate all logs for the launched Task applications as well. The property is the same for Tasks, too.

NOTE: Log redirect is only supported with [local-deployer](https://github.com/spring-cloud/spring-cloud-deployer-local).

<!--END_QUESTION-->

<!--QUESTION#predictableIP-->

How can I get a predictable Route or URL or IP address for a given streaming application?

To get a static and predictable IP Address for a given application, you can define an explicit service of type `LoadBalancer`
and use the label selector feature in Kubernetes to route the traffic through the assigned static IP Address.

The following example shows the `LoadBalancer` deployment:

```yaml
kind: Service
apiVersion: v1
metadata:
  name: foo-lb
  namespace: kafkazone
spec:
  ports:
    - port: 80
      name: http
      targetPort: 8080
  selector:
    FOOZ: BAR-APP
  type: LoadBalancer
```

This deployment would produce a static IP Address. Suppose, for example, the IP address of `foo-lb` is: "10.20.30.40".

Now, when you deploy the stream, you can attach a label selector to the desired application (for example, `deployer.<yourapp>.kubernetes.deploymentLabels=FOOZ: BAR-APP`),
so all the incoming traffic to `10.20.30.40` is automatically received by `yourapp`.

In this setup, when the app upgraded or when the stream is redeployed or updated in SCDF, the static IP Address
remains unchanged, and the upstream or downstream traffic can rely on that.

<!--END_QUESTION-->

## Streaming

<!--QUESTION#connectexistingrabbit-->

Can I connect to existing RabbitMQ queues?

Follow the steps in the [reference guide](https://cloud.spring.io/spring-cloud-static/spring-cloud-stream-binder-rabbit/2.2.0.RC1/spring-cloud-stream-binder-rabbit.html#_using_existing_queuesexchanges) to connect with existing RabbitMQ queues.

<!--END_QUESTION-->

<!--QUESTION#kafkacompatibility-->

What is the Apache Kafka versus Spring Cloud Stream compatibility?

See the [compatibility matrix](https://github.com/spring-cloud/spring-cloud-stream/wiki/Kafka-Client-Compatibility) in the Wiki.

<!--END_QUESTION-->

<!--QUESTION#lifecycle-->

Can I manage binding lifecycles?

By default, bindings are started automatically when the application is initialized.
Bindings implement the Spring `SmartLifecycle` interface.
`SmartLifecycle` lets beans be started in phases.
Producer bindings are started in an early phase (`Integer.MIN_VALUE + 1000`).
Consumer bindings are started in a late phase (`Integer.MAX_VALUE - 1000`).
This leaves room in the spectrum such that you can start user beans that implement `SmartLifecycle` before producer bindings, after consumer bindings, or anywhere in between.

You can disable auto-startup by setting the consumer or producer `autoStartup` property to `false`.

You can visualize and control binding lifecycles by using Boot actuators. See [Binding visualization and control](https://cloud.spring.io/spring-cloud-static/spring-cloud-stream/current/reference/html/spring-cloud-stream.html#binding_visualization_control).

You can also invoke the actuator endpoint programmatically, by using the binding name, as follows:

```java
@Autowired
private BindingsEndpoint endpoint;

...

    bindings.changeState("myFunction-in-0", State.STARTED);
```

This starts a previously stopped (or `autoStartup=false`) binding called `myFunction-in-0`.
To stop a running binding, use `State.STOPPED`.
Some binders, such as Kafka, also support `State.PAUSED` and `State.RESUMED` for consumer bindings.

Since the `BindingsEndpoint` is part of the actuator infrastructure, you must enable actuator support as described in [Binding Visualization and Control](https://cloud.spring.io/spring-cloud-static/spring-cloud-stream/current/reference/html/spring-cloud-stream.html#binding_visualization_control).

<!--END_QUESTION-->

## Batch

<!--QUESTION#ctr-->

What is a Composed Task Runner (CTR)?

The [Composed Tasks](https://docs.spring.io/spring-cloud-dataflow/docs/%dataflow-version%/reference/htmlsingle/#spring-cloud-dataflow-composed-tasks) feature in Spring Cloud Data Flow (SCDF) delegates the running of the composed task to a separate application, named the Composed Task Runner (CTR).
The CTR orchestrates the launching of tasks (which are defined in the composed task graph).
The Composed Task Runner (CTR) parses the graph DSL and, for each node in the graph, runs a RESTful call against a specified Spring Cloud Data Flow instance to launch the associated task definition.
For each task definition that is run, the Composed Task Runner polls the database to verify that the task completed.
Once a task is complete, the Composed Task Runner either continues to the next task in the graph or fails, based on how the DSL specified that the sequence of tasks should be run.

<!--END_QUESTION-->

<!--QUESTION#restartjob-->

How do I restart a Spring Batch Job from the beginning rather than from where it failed?

In short, you need to create a new Job Instance for the new task launch. You can do so by changing an existing identifying job parameter or by adding a new identifying job parameter on the next task launch. The following example shows a typical task launch:

```
task launch myBatchApp --arguments="team=yankees"
```

Assuming that the preceding task launch fails, we can launch the task again, and a new job instance is created if we change the value of the `team` parameter, as the following example shows:

```
task launch myBatchApp --arguments="team=cubs"
```

However, the preferred way is to write your task or batch application such that it can handle being restarted with a new job instance. One way to do this is to set a `JobParamsIncrementer` for your batch job, as discussed in the [Spring Batch Reference Guide](https://docs.spring.io/spring-batch/trunk/reference/html/configureJob.html#JobParametersIncrementer).

<!--END_QUESTION-->

<!--QUESTION#taskdidnotterminate-->

Why does my task execution not show an end time?

There are three reasons that this may occur:

- Your application is, in fact, still running. You can view the task's log through the task execution detail page for that task execution, to check the status.
- Your application was terminated using a SIG-KILL. In that case, Spring Cloud Task did not get a signal that the application was terminating. Rather, the task's process was killed.
- You are running a Spring Cloud Task application where the context is held open (for example: if you are using a `TaskExecutor`). In these cases, you can set the `spring.cloud.task.closecontext_enabled` property to `true` when launching your task. Doing so closes the application's context once the task is complete, thus allowing the application to terminate and record the end time.

<!--END_QUESTION-->

<!--QUESTION#useexistingbatchtables-->

I want to migrate from Spring Batch Admin to Spring Cloud Data Flow. Can I use the existing database that is already used by the Spring Batch jobs?

No. Spring Cloud Data Flow creates its own schema that includes the Spring Batch tables.
To let Spring Cloud Data Flow show the status of Spring Batch Job executions in the dashboard or shell, your Spring Batch Apps need to use the same "datasource" configuration as Spring Cloud Data Flow.

<!--END_QUESTION-->
