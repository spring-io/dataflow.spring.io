---
path: 'feature-guides/batch/deployment-properties/'
title: 'Deployment Properties'
description: 'Initiate a Batch deployment with deployment property overrides'
---

# Deployment Properties

When task definitions are launched to the target platforms `Local`, `CloudFoundry` and `Kubernetes`, you can provide the configuration properties that are applied to the task applications at launch time.
For instance you can specify:

- Deployer Properties - These properties customize how tasks are launched.
- Application Properties - These are application specific properties.

## Deployer Properties

Deployer properties are those properties that tell Spring Cloud Data Flow's deployer how the application should be launched.
They are in the format of `deployer.<application name>.property`.
For example if you are launching to the local platform, and you want to set the maximum heap to 2048m, the following deployer property would need to be set, `deployer.timestamp.local.javaOpts=-Xmx2048m`.

## Application Properties

Applications properties are those properties that were created by the application developers that specify the behaviors for the application.
For example, the timestamp application allows you to set the format of the timestamp via the arguments or properties.
The format for app properties is `app.<application name>.<property>`.
So the timestamp format property would be `app.timestamp.format=YYYY`.

## How to set these properties

Make sure you have registered your timestamp application and created a definition for it as discussed in the [Getting Started Guide](%currentPath%/batch-developer-guides/getting-started/).
So using the UI we will launch the `timestamp-task` by pressing the `play` button (that's the middle icon that looks like an arrow head pointing right).
This will take you to a form where you can add command line arguments and deployment parameters.
Using the examples from above, let's add both the deployer and application properties to the parameters text box as shown below:
![set task parameters](images/SCDF-set-task-properties.png)

Press `Launch the task` and stand back!
This will run the task on the Data Flow server's task platform and record a new task `execution`.
When the execution is complete, the Status will turn to a satisfying green color and show `Complete.`
Select the `Executions` tab to view a summary of executions for this task.

<!--TIP-->

You can view the deployment properties for each of the platforms by selecting one of the following links: [Local](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#configuration-local-deployer), [Cloud Foundry](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#configuration-cloudfoundry-deployer) or, [Kubernetes](https://docs.spring.io/spring-cloud-dataflow/docs/current/reference/htmlsingle/#configuration-kubernetes-deployer).

<!--END_TIP-->
