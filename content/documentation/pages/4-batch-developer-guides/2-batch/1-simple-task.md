---
path: 'batch-developer-guides/batch/spring-task/'
title: 'Simple Task'
description: 'Create a simple Spring Boot Application using Spring Cloud Task'
---

# Batch Processing with Spring Cloud Task

In this guide we will develop a Spring Boot application that uses Spring Cloud Task and deploy it to Cloud Foundry, Kubernetes, and on your local machine. In another guide, we will deploy the [Task application using Data Flow](%currentPath%/batch-developer-guides/batch/data-flow-simple-task/).

The following sections describe how to build this application from scratch. If you prefer, you can download a zip file containing the sources for the application `billsetup`, unzip it, and proceed to the [deployment](#deployment) step.

You can [download the project](https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/batch-developer-guides/batch/batchsamples/dist/batchsamples.zip?raw=true) from your browser, or from the command-line:

```bash
wget https://github.com/spring-cloud/spring-cloud-dataflow-samples/blob/master/dataflow-website/batch-developer-guides/batch/batchsamples/dist/batchsamples.zip?raw=true -O batchsamples.zip
```

## Development

We will start from the [Spring Initializr](https://start.spring.io/) and create a Spring Cloud Task application.

Suppose a cell phone data provider needs to create billing statements for customers. The usage data is stored in JSON files that are stored on the file system. The billing solution must pull data from these files, generate the billing data from this usage data, and store it in a `BILLING_STATEMENTS` table.

For this example we will break up the solution into 2 phases:

1. _billsetuptask_: The _billsetuptask_ application will be a Spring Boot application using Spring Cloud Task that will simply create the `BILL_STATEMENTS` table.
1. [billrun](%currentPath%/batch-developer-guides/batch/spring-batch/): The [billrun](%currentPath%/batch-developer-guides/batch/spring-batch/) application will be a Spring Boot application using Spring Cloud Task and Spring Batch that will read usage data from a json file and price the each row and put the resulting data into the `BILL_STATEMENTS` table.

For this section we will create a Spring Cloud Task/Boot application that will create the `BILL_STATEMENTS` table that will be used by the BillRun application.

![BILL_STATMENTS](images/bill_statements.png)

### Initialzr

Either visit the [Spring Initialzr site](https://start.spring.io/) and follow the instructions below or [download the initialzr generated project directly](https://start.spring.io/starter.zip?fakeusernameremembered=&fakepasswordremembered=&type=maven-project&language=java&baseDir=billsetuptask&groupId=io.spring&artifactId=billsetuptask&name=Bill+Setup+Task&description=Bill+Setup+Task+Sample+App&packageName=io.spring.billsetuptask&packaging=jar&inputSearch=&style=cloud-task&style=jdbc&style=h2&style=mysql).

1. Visit the [Spring Initialzr site](https://start.spring.io/).
1. Select the latest release of Spring Boot.
1. Create a new Maven project with a Group name of `io.spring` and an Artifact name of `billsetuptask`.
1. In the Dependencies text box, type `task` to select the Cloud Task dependency.
1. In the Dependencies text box, type `jdbc` then select the JDBC dependency.
1. In the Dependencies text box, type `h2` then select the H2 dependency.
   1. We use H2 for unit testing.
1. In the Dependencies text box, type `mysql` then select mysql dependency(or your favorite database).
   1. We use MySql for the runtime database.
1. Click the Generate Project button.

Now you should `unzip` the `usbillsetuptask.zip` file and import the project into your favorite IDE.

### Setting up MySql

If you don't have an instance of MySql installed available to you, you can follow these instructions to run a MySql docker image for this example.

1. Pull the MySql docker image

   ```bash
   docker pull mysql:5.7.25
   ```

2. Start MySql

   ```bash
   docker run -p 3306:3306 --name mysql -e MYSQL_ROOT_PASSWORD=password \
   -e MYSQL_DATABASE=task -d mysql:5.7.25
   ```

### Building The Application

Now let’s create the code required for this application.

1.  Create the package `io.spring.billsetuptask.configuration`.
1.  Create a [TaskConfiguration](https://github.com/spring-cloud/spring-cloud-dataflow-samples/tree/master/dataflow-website/batch-developer-guides/batch/batchsamples/billsetuptask/src/main/java/io/spring/billsetuptask/configuration/TaskConfiguration.java) class in the `io.spring.billsetuptask.configuration` package that looks like the contents below.

```java
@Configuration
@EnableTask
public class TaskConfiguration {

    @Autowired
    private DataSource dataSource;

    @Bean
    public CommandLineRunner commandLineRunner() {
        return args -> {
            JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
            jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS " +
                    "BILL_STATEMENTS ( id int, " +
                    "first_name varchar(50), last_name varchar(50), " +
                    "minutes int,data_usage int, bill_amount double)");
        };
    }
}
```

The `@EnableTask` annotation sets up a `TaskRepository` which stores information about the task execution such as the start and end time of the task and the exit code.

### Testing

Now let’s create our test. Update the contents of the [BillsetuptaskApplicationTests.java](https://github.com/spring-cloud/spring-cloud-dataflow-samples/tree/master/dataflow-website/batch-developer-guides/batch/batchsamples/billsetuptask/src/test/java/io/spring/billsetuptask/BillsetuptaskApplicationTests.java) with the following code:

```java
package io.spring.billsetuptask;

import javax.sql.DataSource;
import org.junit.Test;
import org.junit.runner.RunWith;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertEquals;


@RunWith(SpringRunner.class)
@SpringBootTest
public class BillsetuptaskApplicationTests {

	@Autowired
	private DataSource dataSource;

	@Test
	public void testRepository() {
		JdbcTemplate jdbcTemplate = new JdbcTemplate(this.dataSource);
		int result = jdbcTemplate.queryForObject(
				"SELECT COUNT(*) FROM BILL_STATEMENTS", Integer.class);

		Assert.assertEquals(0, result);
	}
}
```

## Deployment

In this section we will deploy the task application to the local machine, Cloud Foundry and Kubernetes

### Local

1. Now let’s take the next step of building the project.
   From a command line change directory to the location of your project and build the project using maven
   `./mvnw clean package`

1. Now let’s execute the application with the configurations required to create the "BILL_STATEMENTS" table in the MySql database.
   To configure the execution of the billsetuptask application utilize the following arguments:

   1. _spring.datasource.url_ - set the URL to your database instance. In the sample below we are connecting to a mysql `task` database on our local machine at port 3306.
   1. _spring.datasource.username_ - the user name to be used for the MySql database. In the sample below it is `root`
   1. _spring.datasource.password_ - the password to be used for the MySql database. In the sample below it is `password`
   1. _spring.datasource.driverClassName_ - The driver to use to connect to the MySql database. In the sample below it is `com.mysql.jdbc.Driver'

   ```bash
   java -jar target/billsetuptask-0.0.1-SNAPSHOT.jar \
   --spring.datasource.url=jdbc:mysql://localhost:3306/task?useSSL=false \
   --spring.datasource.username=root \
   --spring.datasource.password=password \
   --spring.datasource.driverClassName=com.mysql.jdbc.Driver
   ```

#### Setting the application name for Task Execution

Spring Cloud Task records all task executions to a table called TASK_EXECUTION.
Here is some of the information that is recorded by Spring Cloud Task:

- START_TIME - The time the task execution started
- END_TIME - The time the task execution completed
- TASK_NAME - The name associated with the task execution
- EXIT_CODE - The exit code that was returned by the task execution
- EXIT_MESSAGE - The exit message that was returned for the execution
- ERROR_MESSAGE - The error message that was returned for the execution
- EXTERNAL_EXECUTION_ID - An id to be associated with the task execution

By default the `TASK_NAME` is "application".

Using the instructions below query the TASK_EXECUTION table:

<div class="gatsby-highlight" data-language="bash">
<pre class="language-bash"><code>$ docker exec -it mysql bash -l
# mysql -u root -ppassword
mysql&gt; select * from task.TASK_EXECUTION;
</code></pre></div>

The results will look something like this:

```
| TASK_EXECUTION_ID | START_TIME          | END_TIME            | TASK_NAME       | EXIT_CODE | EXIT_MESSAGE | ERROR_MESSAGE | LAST_UPDATED        | EXTERNAL_EXECUTION_ID | PARENT_EXECUTION_ID |
|-------------------|---------------------|---------------------|-----------------|-----------|--------------|---------------|---------------------|-----------------------|---------------------|
|                 1 | 2019-04-23 18:10:57 | 2019-04-23 18:10:57 | application     |         0 | NULL         | NULL          | 2019-04-23 18:10:57 | NULL                  |                NULL |
```

Spring Cloud Task allows us to change this setting using the `spring.cloud.task.name`. To do this we will add that property to our next execution as follows:

```bash
java -jar target/billsetuptask-0.0.1-SNAPSHOT.jar \
--spring.datasource.url=jdbc:mysql://localhost:3306/task?useSSL=false \
--spring.datasource.username=root \
--spring.datasource.password=password \
--spring.datasource.driverClassName=com.mysql.jdbc.Driver \
--spring.cloud.task.name=BillSetupTest1
```

Now when you query the table you will see that the last task execution in the query now has the name "BillSetupTest1".

#### Cleanup

To stop and remove the mysql container running in the docker instance:

```bash
docker stop mysql
docker rm mysql
```

### Cloud Foundry

This guide will walk through how to deploy and run simple [spring-cloud-task](https://spring.io/projects/spring-cloud-task) stand-alone applications to Cloud Foundry.

#### Requirements

On your local machine, you will need to have installed:

- Java
- [Git](https://git-scm.com/)

Please also make sure that you have the [Cloud Foundry command line interface](https://console.run.pivotal.io/tools) installed ([documentation](https://docs.run.pivotal.io/cf-cli/)).

#### Building the application

Now let’s take the next step of building the project.
From a command line change directory to the location of your project and build the project using maven
`./mvnw clean package`

#### Setting up Cloud Foundry

First of all you need a Cloud Foundry account. You can create a free account using [Pivotal Web Services](https://run.pivotal.io/) (PWS). We will use PWS for this example. If you use a different provider, your experience may vary slightly.

Log into Cloud Foundry using the [Cloud Foundry command line interface](https://console.run.pivotal.io/tools):

```bash
cf login
```

**INFO** You can also target specific Cloud Foundry instances with the `-a` flag, for example `cf login -a https://api.run.pivotal.io`.

Before you can push application, please also ensure that you setup the **MySql Service** on Cloud Foundry. You can check what services are available using:

```bash
cf marketplace
```

On [Pivotal Web Services](https://run.pivotal.io/) (PWS) you should be able to use the following command to install the MySQL service:

```bash
cf create-service cleardb spark task-example-mysql
```

Please make sure you name your MySQL service is `task-example-mysql`.

#### Task Concepts in Cloud Foundry

In order to provide configuration parameters for Cloud Foundry, we will create dedicated `manifest` YAML files for each application.

**INFO** For additional information on setting up a manifest see [here](https://docs.cloudfoundry.org/devguide/deploy-apps/manifest.html)

Running tasks on Cloud Foundry is a 2-stage process. Before you can actually run any tasks you need to first push an app that is staged without any running instances. We are providing the following common properties to the manifest YAML file to each application:

```yml
memory: 32M
health-check-type: process
no-route: true
instances: 0
```

The key is to set the `instances` property to `0`. This will ensure that the app is staged without being actually running. We also do not need a route to be created and can set `no-route` to `true`.

<!--TIP-->

Having this app staged but not running has a second advantage as well. Not only do we need this staged application to run a task in a subsequent step, but if your database service is internal (part of your Cloud Foundry instance) we can use this application to establish an SSH tunnel to the associated MySql database service to see the persisted data. But we go into the details for that a little bit further down below.

<!--END_TIP-->

#### Running billsetuptask on Cloud Foundry

In order to deploy the first task application `billsetuptask`, create file `manifest-billsetuptask.yml` with the following contents:

```yaml
applications:
  - name: billsetuptask
    memory: 32M
    health-check-type: process
    no-route: true
    instances: 0
    disk_quota: 1G
    timeout: 180
    buildpacks:
      - java_buildpack
    path: target/billsetuptask-0.0.1-SNAPSHOT.jar
    services:
      - task-example-mysql
```

Now run `cf push -f ./manifest-billsetuptask.yml`. This will stage the application and the app should be up which you can also verify in the Cloud Foundry dashboard.

![billsetuptask deployed to Cloud Foundry](images/CF-task-standalone-initial-push-result.png)

We are now ready to run the task:

```bash
cf run-task billsetuptask ".java-buildpack/open_jdk_jre/bin/java org.springframework.boot.loader.JarLauncher arg1" --name billsetuptask-task
```

<!--TIP-->

If needed you also can specify the following optional arguments:

<!--END_TIP-->

- `-k` Disk limit (e.g. 256M, 1024M, 1G)
- `-m` Memory limit (e.g. 256M, 1024M, 1G)

The task should execute successfuly. Verify the results in the Cloud Foundry dashboard by clicking onto the `Task` tab:

![Cloud Foundry Dashboard Task Tab](images/CF-task-standalone-task1-task-tab.png)

In the `Tasks` table you should see your task `billsetuptask` with a `State` of `Succeeded`:

![billsetuptask executed on Cloud Foundry](images/CF-task-standalone-task1-execution-result.png)

#### Teardown of all Task Applications and Services

With the conclusion of this example you may also want to remove all instances on Cloud Foundry, if not proceeding to the Spring Batch example. The following commands will accomplish that:

```bash
cf delete billsetuptask -f
cf delete-service task-example-mysql -f
```

### Kubernetes

This section will walk you through how to deploy and run a simple [spring-cloud-task](https://spring.io/projects/spring-cloud-task) application on Kubernetes.

We will deploy the sample [billsetuptask](%currentPath%/batch-developer-guides/batch/simple-task/) application to Kubernetes.

#### Setting up the Kubernetes cluster

For this we need a running [Kubernetes cluster](%currentPath%/installation/kubernetes#creating-a-kubernetes-cluster). For this example we will deploy to `minikube`.

##### Verify minikube is up and running:

```bash
$ minikube status

host: Running
kubelet: Running
apiserver: Running
kubectl: Correctly Configured: pointing to minikube-vm at 192.168.99.100
```

##### Install the database

We will install a MySQL server, using the default configuration from Spring Cloud Data Flow. Execute the following command:

```bash
kubectl apply -f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/mysql/mysql-deployment.yaml \
-f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/mysql/mysql-pvc.yaml \
-f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/mysql/mysql-secrets.yaml \
-f https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/master/src/kubernetes/mysql/mysql-svc.yaml
```

##### Build a Docker image

We will build the docker image for the [billsetuptask](#batch_processing_with_spring_cloud_task) app.

For this we will use the [jib maven plugin](https://github.com/GoogleContainerTools/jib/tree/master/jib-maven-plugin#build-your-image). If you downloaded the [source distribution](#batch_processing_with_spring_cloud_task), the jib plugin is already configured. If you built the apps from scratch, add the following under `plugins` in pom.xml:

```xml
<plugin>
    <groupId>com.google.cloud.tools</groupId>
    <artifactId>jib-maven-plugin</artifactId>
    <version>0.10.1</version>
    <configuration>
        <from>
            <image>springcloud/openjdk</image>
        </from>
        <to>
            <image>${docker.org}/${project.artifactId}:${docker.version}</image>
        </to>
        <container>
            <useCurrentTimestamp>true</useCurrentTimestamp>
        </container>
    </configuration>
</plugin>
```

Then add the referenced properties, under `properties` For this example, we will use:

```xml
<docker.org>springcloudtask</docker.org>
<docker.version>${project.version}</docker.version>
```

```bash
eval $(minikube docker-env)
./mvnw clean package jib:dockerBuild
```

This will add the image to the `minikube` Docker registry.
Verify its presence by finding `springcloudtask/billsetuptask` in the list of images:

```bash
docker images
```

##### Deploy the app

The simplest way to deploy a task application is as a standalone [Pod](https://kubernetes.io/docs/concepts/workloads/pods/pod/).
Deploying tasks as a [Job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/) or [CronJob](https://kubernetes.io/docs/tasks/job/) is considered best practice for production environments, but is beyond the scope of this guide.

Save the following to `task-app.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: billsetuptask
spec:
  restartPolicy: Never
  containers:
    - name: task
      image: springcloudtask/billsetuptask:1.0.0.BUILD-SNAPSHOT
      env:
        - name: SPRING_DATASOURCE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql
              key: mysql-root-password
        - name: SPRING_DATASOURCE_URL
          value: jdbc:mysql://mysql:3306/task
        - name: SPRING_DATASOURCE_USERNAME
          value: root
        - name: SPRING_DATASOURCE_DRIVER_CLASS_NAME
          value: com.mysql.jdbc.Driver
  initContainers:
    - name: init-mysql-database
      image: mysql:5.6
      env:
        - name: MYSQL_PWD
          valueFrom:
            secretKeyRef:
              name: mysql
              key: mysql-root-password
      command:
        [
          'sh',
          '-c',
          'mysql -h mysql -u root -e "CREATE DATABASE IF NOT EXISTS task;"',
        ]
```

Start the app:

```bash
kubectl apply -f task-app.yaml
```

When the task is complete, you should see something like this:

```bash
$ kubectl get pods
NAME                     READY   STATUS      RESTARTS   AGE
mysql-5cbb6c49f7-ntg2l   1/1     Running     0          4h
billsetuptask            0/1     Completed   0          81s
```

Delete the Pod.

```bash
kubectl delete -f task-app.yaml
```

Log in to the `mysql` container to query the `TASK_EXECUTION` table.
Get the name of the 'mysql`pod using`kubectl get pods`, as shown above.
Then login:

<!-- Rolling my own to disable erroneous formating -->
<div class="gatsby-highlight" data-language="bash">
<pre class="language-bash"><code>$ kubectl exec -it mysql-5cbb6c49f7-ntg2l -- /bin/bash
# mysql -u root -p$MYSQL_ROOT_PASSWORD
mysql&gt; select * from task.TASK_EXECUTION;
</code></pre></div>

To uninstall `mysql`:

```bash
kubectl delete all -l app=mysql
```

## What's Next

Congratulations you have just created and deployed a Spring Cloud Task application. Now lets go onto the [next section](/documentation/master/batch-developer-guides/batch/spring-batch/) and create a Spring Batch Application.
