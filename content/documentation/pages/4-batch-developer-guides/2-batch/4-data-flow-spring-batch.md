---
path: 'batch-developer-guides/batch/data-flow-spring-batch/'
title: 'Register and launch a Spring Batch application using Data Flow'
description: 'Register and launch a Spring Batch application using Data Flow'
---

# Deploy a Spring Batch application using Data Flow

In this section, we will demonstrate how to register a Spring Batch application with Data Flow, create a task definition, and launch the task definition on Cloud Foundry, Kubernetes and your local machine.

## Prerequisites

### Data Flow Installation

Make sure have installed Spring Cloud Data Flow to the platform of your choice:

- [Local](%currentPath%/installation/local/)
- [Cloud Foundry](%currentPath%/installation/cloudfoundry)
- [Kubernetes](%currentPath%/installation/kubernetes/)

### Spring Batch Project

For this guide, we will use the [Spring Batch Jobs](%currentPath%/batch-developer-guides/batch/spring-batch) sample Spring Batch application, called `billrun`.
Follow the instructions to code and build the Spring Batch application if you have not done so already.

## Create Task Definition

We will register the batch application, create a simple task definition for the batch application, and launch the task definition using the Data Flow Server.
The Data Flow server provides a comprehensive [API](http://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#api-guide) to perform the necessary steps.
The Data Flow server includes a Data Flow Dashboard web UI client. In addition there is a [Data Flow Shell](http://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#shell) CLI, available as separate download.
The CLI and the UI both expose the complete API functionality.
Which one to use is a matter of preference, but the UI is quite nice so we will feature it here.

### The Data Flow Dashboard

Assuming Data Flow is [installed](%currentPath%/installation/) and running on one of the supported platforms, open your browser at `<data-flow-url>/dashboard`. Here, `<data-flow-url>` depends on the platform. Consult the [installation guide](%currentPath%/installation) to determining the base URL for your installation. If Data Flow is running on your local machine, go to http://localhost:9393/dashboard.

### Application Registration

The Data Flow Dashboard will land on the Application Registration view where we will register the sample Spring Batch app.

![Add an application](images/SCDF-add-applications.png)

#### Application Registration Concepts

Applications in Data Flow are registered as named resources so that they may be referenced when using the Data Flow DSL to configure and compose tasks.
Registration associates a logical application name and type with a physical resource, given by a URI.
The URI conforms to a [schema](http://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#spring-cloud-dataflow-register-stream-apps) and may represent a Maven artifact, a Docker image, or an actual `http(s)` or `file` URL.
Data Flow defines a some logical application types which indicate its role as a streaming component, a task, or a standalone application.
In this case our Spring Batch application, as you might guess, are always registered as a `task` type.

[[tip]]
|For a Spring Batch Application to be launched by Data Flow it must also be a Spring Cloud Task application. This is done by adding the `@EnableTask` to a configuration or to the application as shown in our [sample](%currentPath%/batch-developer-guides/batch/spring-batch).

#### Registering an Application

<!--TABS-->

<!--Local-->

Spring Cloud Data Flow supports maven, http, file, and docker resources for local deployments. For this example we will use the maven resource.
The URI for a Maven artifact is generally of the form `maven://<groupId>:<artifactId>:<version>`. The maven URI for the sample app is:

```
maven://io.spring:billrun:0.0.1-SNAPSHOT
```

The `maven:` protocol specifies a Maven artifact which is resolved using the remote and local Maven repositories configured for the Data Flow Server.
To register an application, select `Add Applications` and `Register one or more applications`. Fill in the form, as shown, and hit `Register the application(s)`.

![Register the billrun batch app](images/SCDF-register-batch-app-maven.png)

<!--CloudFoundry-->

**TODO Replace ghillerts repo with a Spring repo or use maven central**

Spring Cloud Data Flow supports maven, http, and docker resources for local deployments. For this example we will use a http resource. The URI for a https is of the form `https://<web-path>/<artifactName>-<version>.jar`. Spring Cloud Data Flow will then pull the artifact from the https URI.

The Https URI for the sample app is:

```
maven://io.spring:billrun:0.0.1-SNAPSHOT
```

To register an application, select `Add Applications` and `Register one or more applications`. Fill in the form, as shown, and hit `Register the application(s)`.

![Register the billrun batch app](images/SCDF-register-batch-app-http.png)

<!--Kubernetes-->

Spring Cloud Data Flow supports docker resources for Kubernetes deployments. For this example we will use the maven resource.
The URI for a Docker image is of the form `docker:<docker-image-path>/<imageName>:<version>` and is resolved using the Docker registry configured for the Data Flow task platform and image pull policy.

The Docker URI for the sample app is:

```
docker:springcloudtask/billrun:0.0.1-SNAPSHOT
```

To register an application, select `Add Applications` and `Register one or more applications`. Fill in the form, as shown, and hit `Register the application(s)`.

![Register the billrun batch app](images/SCDF-register-batch-app-docker.png)

<!--END_TABS-->

### Creating the Task Definition

Select `Tasks` from the left navigation bar, then select `Create task(s)`.
This displays a graphical editor that we can use to compose tasks.
The initial canvas contains `START` and `END` nodes. To the left of the canvas, we see the available task applications, including `billrun` which we just registered.
Simply drag that task(billrun) to the canvas and connect the task to the START and END nodes to complete the task definition.
In this case, the task definition consists of a single task application.
If the app defined configuration properties, we would set them here.

![Create the billrun task definition](images/SCDF-create-batch.png)

Click on `Create Task`.
This will prompt you to name the task definition, which is the logical name for the runtime configuration we will to deploy.
In this case, we will use the same name as the task application which is `billrun`.

![Confirm create task](images/SCDF-confirm-create-batch.png)

Press `Create the task`.
This will display the main `Tasks` view.

### Launch the Task

![Launch the task](images/SCDF-launch-batch.png)

Now we will launch the task by pressing the `play` button (that's the middle icon that looks like an arrow head pointing right).
This will take you to a form where you can add command line arguments and deployment parameters, but we don't need any for this task.
Press `Launch the task` and stand back!
This will run the task on the Data Flow server's task platform and record a new task `execution`.
When the execution is complete, the Status will turn to a satisfying green color and show `Complete.`
Select the `Executions` tab to view a summary of executions for this task.

![Task executions](images/SCDF-batch-executions.png)

### Review the Job Execution

Now that we have successfully launched the task we now want to see check the status of the Job that was executed by the application.
To view the Job Executions click the Jobs tab on the left hand side of the UI.

![Job executions](images/SCDF-batch-jobs-execution.png)

Now that we can view our Job executions we can now dig in to the detail for each Job execution. This can be done by clicking the `billrun` link on our Job execution.

![Job execution detail](images/SCDF-batch-execution-detail.png)

And for each Job Execution we can view the Step detail for each of or Steps. This can be done by clicking the name of the Step, in our case it is `BillProcessing`

![Step detail](images/SCDF-step-detail.png)
